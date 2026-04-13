interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

export default function ProgressRing({ percentage, size = 200, strokeWidth = 16 }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const getGradientId = "progressGrad";

  return (
    <div className="relative inline-flex items-center justify-center progress-ring-shadow">
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={getGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--progress-green))" />
            <stop offset="60%" stopColor="hsl(var(--progress-yellow))" />
            <stop offset="100%" stopColor="hsl(var(--progress-red))" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${getGradientId})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-5xl font-extrabold text-foreground">{percentage}</span>
        <span className="text-lg font-semibold text-primary">%</span>
        <span className="text-xs text-muted-foreground mt-1">daily score</span>
      </div>
    </div>
  );
}
