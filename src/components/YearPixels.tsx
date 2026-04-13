import { useMemo } from "react";

interface YearPixelsProps {
  completionRates: Record<string, number>;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function YearPixels({ completionRates }: YearPixelsProps) {
  const pixels = useMemo(() => {
    const year = new Date().getFullYear();
    const data: { month: number; day: number; rate: number; dateStr: string }[] = [];
    for (let m = 0; m < 12; m++) {
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        data.push({ month: m, day: d, rate: completionRates[dateStr] || 0, dateStr });
      }
    }
    return data;
  }, [completionRates]);

  const getColor = (rate: number) => {
    if (rate === 0) return "bg-muted";
    if (rate < 30) return "bg-habit-pink";
    if (rate < 60) return "bg-habit-yellow";
    if (rate < 80) return "bg-habit-blue";
    return "bg-habit-green";
  };

  const byMonth = useMemo(() => {
    const grouped: Record<number, typeof pixels> = {};
    pixels.forEach(p => {
      if (!grouped[p.month]) grouped[p.month] = [];
      grouped[p.month].push(p);
    });
    return grouped;
  }, [pixels]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-foreground">🎨 Year in Pixels</h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-muted" /> None</span>
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-habit-pink" /> Low</span>
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-habit-yellow" /> Med</span>
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-habit-blue" /> Good</span>
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-habit-green" /> Great</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-2 min-w-[600px]">
          {MONTHS.map((label, m) => (
            <div key={m} className="flex flex-col items-center gap-0.5 flex-1">
              <span className="text-[10px] text-muted-foreground font-medium mb-1">{label}</span>
              <div className="grid grid-cols-1 gap-[2px]">
                {(byMonth[m] || []).map(p => (
                  <div
                    key={p.dateStr}
                    className={`h-2.5 w-full rounded-[3px] ${getColor(p.rate)} transition-colors hover:scale-150 hover:z-10 cursor-default`}
                    title={`${MONTHS[p.month]} ${p.day}: ${p.rate}%`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
