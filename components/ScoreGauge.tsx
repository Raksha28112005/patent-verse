"use client";

export default function ScoreGauge({
  value,
  size = 120,
  strokeWidth = 10,
  colorClass = "text-blueprint",
  trackClass = "text-ink-700",
  label,
}: {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  colorClass?: string;
  trackClass?: string;
  label?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;
  const center = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className={trackClass}
          stroke="currentColor"
          opacity={0.4}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className={colorClass}
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 800ms ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-mono text-2xl font-semibold tabular-nums ${colorClass}`}>{value}</span>
        {label && <span className="font-mono text-[9px] uppercase tracking-wide text-ink-300">{label}</span>}
      </div>
    </div>
  );
}
