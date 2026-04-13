import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from "recharts";

interface AnalyticsChartsProps {
  weeklyData: { day: string; completed: number; total: number; rate: number }[];
  monthlyData: { week: string; avgRate: number }[];
  habitData: { name: string; color: string; data: number[]; total: number }[];
}

const COLORS = [
  "hsl(165, 60%, 40%)",
  "hsl(340, 65%, 70%)",
  "hsl(200, 75%, 60%)",
  "hsl(25, 85%, 60%)",
  "hsl(270, 55%, 65%)",
  "hsl(45, 85%, 55%)",
  "hsl(175, 55%, 50%)",
];

export default function AnalyticsCharts({ weeklyData, monthlyData, habitData }: AnalyticsChartsProps) {
  return (
    <div className="space-y-6">
      {/* Weekly completion bar chart */}
      <div className="bg-card rounded-2xl p-6 habit-card-shadow">
        <h3 className="font-bold text-foreground mb-4">📊 Weekly Completion</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(220,10%,50%)" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(220,10%,50%)" />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
              formatter={(value: number, name: string) => [value, name === "completed" ? "Completed" : name]}
            />
            <Bar dataKey="completed" fill="hsl(165, 60%, 40%)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="total" fill="hsl(220,15%,88%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly trend area chart */}
      <div className="bg-card rounded-2xl p-6 habit-card-shadow">
        <h3 className="font-bold text-foreground mb-4">📈 Monthly Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(165, 60%, 40%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(165, 60%, 40%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(220,10%,50%)" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(220,10%,50%)" domain={[0, 100]} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
            <Area type="monotone" dataKey="avgRate" stroke="hsl(165, 60%, 40%)" fill="url(#areaGrad)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Habit distribution pie chart */}
      {habitData.length > 0 && (
        <div className="bg-card rounded-2xl p-6 habit-card-shadow">
          <h3 className="font-bold text-foreground mb-4">🎯 Habit Distribution (7 days)</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={habitData.map((h, i) => ({ name: h.name, value: h.total, fill: COLORS[i % COLORS.length] }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {habitData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "none" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {habitData.map((h, i) => (
                <div key={h.name} className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-foreground font-medium truncate">{h.name}</span>
                  <span className="text-muted-foreground ml-auto">{h.total}/7</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
