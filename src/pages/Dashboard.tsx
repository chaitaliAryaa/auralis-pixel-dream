import { useState, useMemo } from "react";
import { useHabitStore } from "@/lib/habitStore";
import { useAuth } from "@/hooks/useAuth";
import WeekStrip from "@/components/WeekStrip";
import ProgressRing from "@/components/ProgressRing";
import HabitCard from "@/components/HabitCard";
import AddHabitDialog from "@/components/AddHabitDialog";
import InsightsPanel from "@/components/InsightsPanel";
import YearPixels from "@/components/YearPixels";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import { BarChart3, CalendarDays, LayoutGrid, LogOut, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-habits.jpg";
import patternBg from "@/assets/pattern-bg.jpg";

type Tab = "plan" | "analytics" | "pixels";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tab, setTab] = useState<Tab>("plan");
  const { user, signOut } = useAuth();
  const store = useHabitStore();

  const dateStr = selectedDate.toISOString().split("T")[0];
  const dayScore = store.getDayCompletionRate(dateStr);

  const completionRates = useMemo(() => {
    const rates: Record<string, number> = {};
    for (let i = -5; i <= 5; i++) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + i);
      const ds = d.toISOString().split("T")[0];
      rates[ds] = store.getDayCompletionRate(ds);
    }
    return rates;
  }, [selectedDate, store]);

  const yearRates = useMemo(() => {
    const rates: Record<string, number> = {};
    const year = new Date().getFullYear();
    for (let m = 0; m < 12; m++) {
      const days = new Date(year, m + 1, 0).getDate();
      for (let d = 1; d <= days; d++) {
        const ds = `${year}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        rates[ds] = store.getDayCompletionRate(ds);
      }
    }
    return rates;
  }, [store]);

  const insights = store.getInsights();
  const weeklyChartData = store.getWeeklyChartData();
  const monthlyChartData = store.getMonthlyChartData();
  const habitChartData = store.getHabitChartData();

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  if (store.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-soft text-2xl">✨ Loading your habits...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 glass-card">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl gradient-hero flex items-center justify-center text-primary-foreground font-bold">H</div>
            <span className="text-xl font-bold text-foreground hidden sm:inline">HabitFlow</span>
          </div>

          <nav className="flex items-center gap-1">
            {([
              { id: "plan" as Tab, icon: CalendarDays, label: "My Plan" },
              { id: "analytics" as Tab, icon: BarChart3, label: "Analytics" },
              { id: "pixels" as Tab, icon: LayoutGrid, label: "Pixels" },
            ]).map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${tab === t.id
                    ? "gradient-hero text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
              >
                <t.icon className="h-4 w-4" />
                <span className="hidden md:inline">{t.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden md:inline">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={signOut} className="rounded-xl">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero opacity-70" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
          <div>
            <p className="text-primary-foreground/70 text-sm font-medium">{formatDate(selectedDate)}</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary-foreground mt-1">
              {tab === "plan" ? "My Habits" : tab === "analytics" ? "Analytics" : "Year in Pixels"}
            </h1>
          </div>
        </div>
      </div>

      {/* Week Strip */}
      <div className="max-w-7xl mx-auto px-6 -mt-6 relative z-20">
        <div className="bg-card rounded-2xl shadow-lg px-4">
          <WeekStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} completionRates={completionRates} />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {tab === "plan" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Progress Ring + Quick Stats */}
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-8 habit-card-shadow flex flex-col items-center">
                <ProgressRing percentage={dayScore} />
                <div className="grid grid-cols-3 gap-4 mt-6 w-full">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{store.habits.length}</p>
                    <p className="text-xs text-muted-foreground">Habits</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-streak">{store.habits.filter(h => store.getStreak(h.id) > 0).length}</p>
                    <p className="text-xs text-muted-foreground">Active Streaks</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{store.habits.filter(h => store.isCompleted(h.id, dateStr)).length}</p>
                    <p className="text-xs text-muted-foreground">Done Today</p>
                  </div>
                </div>
              </div>

              {/* Mini insight card */}
              <div className="bg-card rounded-2xl p-5 habit-card-shadow border border-primary/10">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">AI Tip</span>
                </div>
                <p className="text-sm text-foreground">
                  {insights.worst && insights.worst.score < 50
                    ? `Focus on "${insights.worst.habit.emoji} ${insights.worst.habit.name}" — it's at ${insights.worst.score}% this month. Small wins compound!`
                    : insights.best
                      ? `Great job on "${insights.best.habit.emoji} ${insights.best.habit.name}"! Keep the ${insights.best.streak}-day streak going! 🔥`
                      : "Start adding habits to get personalized insights!"
                  }
                </p>
              </div>

              {/* Pattern decoration */}
              <div className="hidden lg:block rounded-2xl overflow-hidden shadow-lg h-40">
                <img src={patternBg} alt="" className="w-full h-full object-cover" loading="lazy" width={800} height={800} />
              </div>
            </div>

            {/* Right: Habit Cards */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-foreground">Today's Habits</h2>
                <span className="text-sm text-muted-foreground">
                  {store.habits.filter(h => store.isCompleted(h.id, dateStr)).length}/{store.habits.length} completed
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {store.habits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    completed={store.isCompleted(habit.id, dateStr)}
                    streak={store.getStreak(habit.id)}
                    prediction={store.getPrediction(habit.id)}
                    weekData={store.getWeekData(habit.id, selectedDate)}
                    onToggle={() => store.toggleCompletion(habit.id, dateStr)}
                    onDelete={() => store.deleteHabit(habit.id)}
                  />
                ))}
              </div>
              {store.habits.length === 0 && (
                <div className="bg-card rounded-2xl p-12 habit-card-shadow text-center">
                  <p className="text-5xl mb-4">🌱</p>
                  <h3 className="text-lg font-bold text-foreground mb-2">No habits yet!</h3>
                  <p className="text-muted-foreground">Click the + button to start building your routine.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnalyticsCharts weeklyData={weeklyChartData} monthlyData={monthlyChartData} habitData={habitChartData} />
            <InsightsPanel insights={insights} />
          </div>
        )}

        {tab === "pixels" && (
          <div className="bg-card rounded-2xl p-6 habit-card-shadow">
            <YearPixels completionRates={yearRates} />
          </div>
        )}
      </main>

      <AddHabitDialog onAdd={store.addHabit} />
    </div>
  );
}
