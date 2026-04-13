import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export type HabitColor = "pink" | "blue" | "green" | "purple" | "orange" | "yellow" | "teal";

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: HabitColor;
  goal: string | null;
  frequency: string;
  created_at: string;
}

export interface HabitCompletion {
  habit_id: string;
  date: string;
  completed: boolean;
}

export function useHabitStore() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(true);

  // Load habits
  useEffect(() => {
    if (!user) { setHabits([]); setCompletions([]); setLoading(false); return; }

    const loadData = async () => {
      setLoading(true);
      const [habitsRes, completionsRes] = await Promise.all([
        supabase.from("habits").select("*").eq("user_id", user.id).order("created_at"),
        supabase.from("habit_completions").select("habit_id, date, completed").eq("user_id", user.id),
      ]);

      if (habitsRes.data) setHabits(habitsRes.data as Habit[]);
      if (completionsRes.data) setCompletions(completionsRes.data);
      setLoading(false);
    };

    loadData();
  }, [user]);

  const addHabit = useCallback(async (habit: { name: string; emoji: string; color: HabitColor; goal: string; frequency: string }) => {
    if (!user) return;
    const { data, error } = await supabase.from("habits").insert({
      user_id: user.id,
      name: habit.name,
      emoji: habit.emoji,
      color: habit.color,
      goal: habit.goal || null,
      frequency: habit.frequency,
    }).select().single();

    if (error) { toast.error("Failed to add habit"); return; }
    if (data) setHabits(prev => [...prev, data as Habit]);
    toast.success("Habit added!");
  }, [user]);

  const deleteHabit = useCallback(async (id: string) => {
    if (!user) return;
    await supabase.from("habits").delete().eq("id", id);
    setHabits(prev => prev.filter(h => h.id !== id));
    setCompletions(prev => prev.filter(c => c.habit_id !== id));
    toast.success("Habit deleted");
  }, [user]);

  const toggleCompletion = useCallback(async (habitId: string, date: string) => {
    if (!user) return;
    const existing = completions.find(c => c.habit_id === habitId && c.date === date);

    if (existing) {
      await supabase.from("habit_completions").delete().eq("habit_id", habitId).eq("date", date).eq("user_id", user.id);
      setCompletions(prev => prev.filter(c => !(c.habit_id === habitId && c.date === date)));
    } else {
      const { error } = await supabase.from("habit_completions").insert({
        habit_id: habitId,
        user_id: user.id,
        date,
        completed: true,
      });
      if (!error) setCompletions(prev => [...prev, { habit_id: habitId, date, completed: true }]);
    }
  }, [user, completions]);

  const isCompleted = useCallback((habitId: string, date: string) => {
    return completions.some(c => c.habit_id === habitId && c.date === date && c.completed);
  }, [completions]);

  const getStreak = useCallback((habitId: string) => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      if (completions.some(c => c.habit_id === habitId && c.date === dateStr && c.completed)) {
        streak++;
      } else if (i > 0) break;
    }
    return streak;
  }, [completions]);

  const getDayCompletionRate = useCallback((date: string) => {
    if (habits.length === 0) return 0;
    const completed = habits.filter(h => isCompleted(h.id, date)).length;
    return Math.round((completed / habits.length) * 100);
  }, [habits, isCompleted]);

  const getWeekData = useCallback((habitId: string, centerDate: Date) => {
    const results: { date: string; completed: boolean }[] = [];
    for (let i = -3; i <= 3; i++) {
      const d = new Date(centerDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      results.push({ date: dateStr, completed: isCompleted(habitId, dateStr) });
    }
    return results;
  }, [isCompleted]);

  const getPrediction = useCallback((habitId: string) => {
    const dayOfWeek = new Date().getDay();
    let total = 0, completed = 0;
    for (let i = 0; i < 90; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      if (d.getDay() === dayOfWeek) {
        total++;
        if (isCompleted(habitId, d.toISOString().split("T")[0])) completed++;
      }
    }
    return total === 0 ? 50 : Math.round((completed / total) * 100);
  }, [isCompleted]);

  const getInsights = useCallback(() => {
    const last30 = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    });

    const habitScores = habits.map(h => {
      const completed = last30.filter(date => isCompleted(h.id, date)).length;
      return { habit: h, score: Math.round((completed / 30) * 100), streak: getStreak(h.id) };
    });

    const sorted = [...habitScores].sort((a, b) => b.score - a.score);
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];
    const avgScore = Math.round(habitScores.reduce((s, h) => s + h.score, 0) / (habitScores.length || 1));

    return { habitScores, best, worst, avgScore };
  }, [habits, isCompleted, getStreak]);

  // Weekly chart data
  const getWeeklyChartData = useCallback(() => {
    const data: { day: string; completed: number; total: number; rate: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
      const completed = habits.filter(h => isCompleted(h.id, dateStr)).length;
      data.push({ day: dayLabel, completed, total: habits.length, rate: habits.length ? Math.round((completed / habits.length) * 100) : 0 });
    }
    return data;
  }, [habits, isCompleted]);

  // Monthly chart data
  const getMonthlyChartData = useCallback(() => {
    const data: { week: string; avgRate: number }[] = [];
    for (let w = 3; w >= 0; w--) {
      let totalRate = 0;
      for (let d = 0; d < 7; d++) {
        const date = new Date();
        date.setDate(date.getDate() - (w * 7 + d));
        totalRate += getDayCompletionRate(date.toISOString().split("T")[0]);
      }
      data.push({ week: `Week ${4 - w}`, avgRate: Math.round(totalRate / 7) });
    }
    return data;
  }, [getDayCompletionRate]);

  // Per-habit chart data
  const getHabitChartData = useCallback(() => {
    return habits.map(h => {
      const last7 = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return isCompleted(h.id, d.toISOString().split("T")[0]) ? 1 : 0;
      });
      return { name: h.emoji + " " + h.name, color: h.color, data: last7, total: last7.reduce((a, b) => a + b, 0) };
    });
  }, [habits, isCompleted]);

  return {
    habits, completions, loading, addHabit, deleteHabit, toggleCompletion,
    isCompleted, getStreak, getDayCompletionRate, getWeekData, getPrediction, getInsights,
    getWeeklyChartData, getMonthlyChartData, getHabitChartData,
  };
}
