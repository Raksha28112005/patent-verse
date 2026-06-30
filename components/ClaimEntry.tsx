"use client";

export default function ClaimEntry({
  number,
  title,
  accent,
  children,
}: {
  number: string;
  title: string;
  accent: "blueprint" | "agent" | "brass" | "danger";
  children: React.ReactNode;
}) {
  const accentClass = {
    blueprint: "text-blueprint border-blueprint/30",
    agent: "text-agent border-agent/30",
    brass: "text-brass border-brass/30",
    danger: "text-danger border-danger/30",
  }[accent];

  return (
    <section className="rounded-2xl border border-ink-border bg-ink-800/60 backdrop-blur-sm">
      <div className={`flex items-center gap-3 border-b border-ink-border px-6 py-4`}>
        <span className={`font-mono text-sm font-semibold ${accentClass.split(" ")[0]}`}>{number}</span>
        <h3 className="font-display text-lg font-semibold text-ink-50">{title}</h3>
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

export function Tag({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" | "bad" }) {
  const toneClass = {
    neutral: "bg-ink-700 text-ink-300 border-ink-border",
    good: "bg-success/10 text-success border-success/30",
    warn: "bg-brass/10 text-brass border-brass/30",
    bad: "bg-danger/10 text-danger border-danger/30",
  }[tone];

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide ${toneClass}`}>
      {children}
    </span>
  );
}

export function MeterBar({ value, label, tone = "blueprint" }: { value: number; label: string; tone?: "blueprint" | "danger" | "brass" }) {
  const barColor = {
    blueprint: "bg-blueprint",
    danger: "bg-danger",
    brass: "bg-brass",
  }[tone];

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs text-ink-300">{label}</span>
        <span className="font-mono text-xs tabular-nums text-ink-50">{value}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
        <div className={`h-full rounded-full ${barColor} transition-all duration-700`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
