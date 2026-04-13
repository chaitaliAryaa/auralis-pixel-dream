import { Check, Flame, Trash2 } from "lucide-react";
import type { Habit, HabitColor } from "@/lib/habitStore";

const colorBgMap: Record<HabitColor, string> = {
  pink: "bg-habit-pink/30",
  blue: "bg-habit-blue/30",
  green: "bg-habit-green/30",
  purple: "bg-habit-purple/30",
  orange: "bg-habit-orange/30",
  yellow: "bg-habit-yellow/30",
  teal: "bg-habit-teal/30",
};

const colorBorderMap: Record<HabitColor, string> = {
  pink: "border-habit-pink/50",
  blue: "border-habit-blue/50",
  green: "border-habit-green/50",
  purple: "border-habit-purple/50",
  orange: "border-habit-orange/50",
  yellow: "border-habit-yellow/50",
  teal: "border-habit-teal/50",
};

const dotColorMap: Record<HabitColor, string> = {
  pink: "bg-habit-pink",
  blue: "bg-habit-blue",
  green: "bg-habit-green",
  purple: "bg-habit-purple",
  orange: "bg-habit-orange",
  yellow: "bg-habit-yellow",
  teal: "bg-habit-teal",
};

interface HabitCardProps {
  habit: Habit;
  completed: boolean;
  streak: number;
  prediction: number;
  weekData: { date: string; completed: boolean }[];
  onToggle: () => void;
  onDelete: () => void;
}

export default function HabitCard({ habit, completed, streak, prediction, weekData, onToggle, onDelete }: HabitCardProps) {
  return (
    <div className={`group relative rounded-2xl p-4 habit-card-shadow transition-all duration-300 hover:scale-[1.02] border
      ${colorBgMap[habit.color as HabitColor] || "bg-muted/30"} ${colorBorderMap[habit.color as HabitColor] || "border-border"}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{habit.emoji}</span>
          <div>
            <h3 className="font-semibold text-foreground text-base">{habit.name}</h3>
            {habit.goal && <p className="text-xs text-muted-foreground">{habit.goal}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {streak > 0 && (
            <div className="flex items-center gap-1 text-xs font-bold text-streak animate-pulse-soft">
              <Flame className="h-4 w-4" />
              {streak}d
            </div>
          )}
          <button
            onClick={onToggle}
            className={`h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm
              ${completed
                ? "gradient-hero text-primary-foreground scale-110 shadow-md"
                : "border-2 border-muted-foreground/30 hover:border-primary/60 hover:scale-105"
              }`}
          >
            {completed && <Check className="h-4 w-4" strokeWidth={3} />}
          </button>
        </div>
      </div>

      {/* Mini week dots */}
      <div className="flex items-center gap-2 mt-3">
        {weekData.map((d) => (
          <div
            key={d.date}
            className={`h-3 w-3 rounded-md transition-all duration-300 ${
              d.completed ? `${dotColorMap[habit.color as HabitColor] || "bg-primary"} shadow-sm` : "bg-foreground/10"
            }`}
          />
        ))}
        <span className="text-[10px] text-muted-foreground ml-auto font-medium">
          {prediction}% likely today
        </span>
      </div>

      <button
        onClick={onDelete}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
