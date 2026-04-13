import { useMemo } from "react";

interface WeekStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  completionRates: Record<string, number>;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeekStrip({ selectedDate, onSelectDate, completionRates }: WeekStripProps) {
  const days = useMemo(() => {
    const result: Date[] = [];
    for (let i = -5; i <= 5; i++) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + i);
      result.push(d);
    }
    return result;
  }, [selectedDate]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex items-center justify-center gap-1 md:gap-2 py-4">
      {days.map((day) => {
        const dateStr = day.toISOString().split("T")[0];
        const isSelected = dateStr === selectedDate.toISOString().split("T")[0];
        const isToday = dateStr === today;
        const rate = completionRates[dateStr] || 0;

        return (
          <button
            key={dateStr}
            onClick={() => onSelectDate(day)}
            className={`flex flex-col items-center gap-1.5 rounded-2xl px-3 py-2.5 transition-all duration-300
              ${isSelected
                ? "gradient-hero text-primary-foreground scale-110 shadow-lg"
                : "hover:bg-card hover:shadow-md"
              }
            `}
          >
            <span className={`text-[11px] font-medium uppercase tracking-wider ${
              isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
            }`}>
              {DAY_NAMES[day.getDay()]}
            </span>
            <span className={`text-sm font-bold ${isToday && !isSelected ? "text-primary" : ""}`}>
              {day.getDate()}
            </span>
            <div className="flex gap-0.5">
              {rate > 0 && (
                <div
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    isSelected
                      ? "bg-primary-foreground/70"
                      : rate >= 80
                        ? "bg-progress-green"
                        : rate >= 40
                          ? "bg-progress-yellow"
                          : "bg-progress-red"
                  }`}
                />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
