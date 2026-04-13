import { TrendingUp, TrendingDown, Brain, Target, Zap, Award } from "lucide-react";

interface InsightsPanelProps {
  insights: {
    habitScores: { habit: { name: string; emoji: string }; score: number; streak: number }[];
    best?: { habit: { name: string; emoji: string }; score: number; streak: number };
    worst?: { habit: { name: string; emoji: string }; score: number; streak: number };
    avgScore: number;
  };
}

export default function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="font-bold text-lg text-foreground">AI Insights</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-card rounded-2xl p-5 habit-card-shadow border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-accent" />
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">30-Day Average</span>
          </div>
          <p className="text-3xl font-extrabold text-foreground">{insights.avgScore}%</p>
        </div>

        {insights.best && (
          <div className="bg-card rounded-2xl p-5 habit-card-shadow border border-progress-green/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-progress-green" />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Top Performer</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {insights.best.habit.emoji} {insights.best.habit.name}
            </p>
            <p className="text-sm text-muted-foreground">{insights.best.score}% · {insights.best.streak}d 🔥</p>
          </div>
        )}

        {insights.worst && insights.worst.habit.name !== insights.best?.habit.name && (
          <div className="bg-card rounded-2xl p-5 habit-card-shadow border border-progress-red/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-progress-red" />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Needs Focus</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              {insights.worst.habit.emoji} {insights.worst.habit.name}
            </p>
            <p className="text-sm text-muted-foreground">{insights.worst.score}% completion</p>
          </div>
        )}
      </div>

      {/* All habits bar chart */}
      <div className="space-y-2 mt-4">
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">All Habits Performance</h4>
        {insights.habitScores.map(hs => (
          <div key={hs.habit.name} className="flex items-center gap-3 bg-card rounded-xl p-3 habit-card-shadow">
            <span className="text-xl">{hs.habit.emoji}</span>
            <span className="text-sm font-medium text-foreground flex-1">{hs.habit.name}</span>
            <div className="w-28 h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 gradient-hero"
                style={{ width: `${hs.score}%` }}
              />
            </div>
            <span className="text-xs font-bold text-foreground w-10 text-right">{hs.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
