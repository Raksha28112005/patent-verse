"use client";

import ScoreGauge from "./ScoreGauge";
import type { AnalysisReport } from "@/types";

const VERDICT_STYLES: Record<
  AnalysisReport["verdict"]["label"],
  { ring: string; text: string; bg: string; gauge: string }
> = {
  Promising: { ring: "ring-success/30", text: "text-success", bg: "bg-success/10", gauge: "text-success" },
  "Proceed with Caution": { ring: "ring-brass/30", text: "text-brass", bg: "bg-brass/10", gauge: "text-brass" },
  "High Risk": { ring: "ring-danger/30", text: "text-danger", bg: "bg-danger/10", gauge: "text-danger" },
  "Not Recommended": { ring: "ring-danger/30", text: "text-danger", bg: "bg-danger/10", gauge: "text-danger" },
};

export default function VerdictBanner({ verdict, title }: { verdict: AnalysisReport["verdict"]; title: string }) {
  const style = VERDICT_STYLES[verdict.label];

  return (
    <div className={`rounded-2xl border border-ink-border bg-ink-800/60 p-6 ring-1 ${style.ring} backdrop-blur-sm`}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-300">Verdict — {title}</p>
          <h2 className={`mt-2 font-display text-2xl font-semibold ${style.text}`}>{verdict.label}</h2>
          <p className="mt-2 max-w-xl text-sm text-ink-300">{verdict.headline}</p>
        </div>

        <div className="flex items-center gap-4">
          <ScoreGauge value={verdict.score} size={104} strokeWidth={9} colorClass={style.gauge} label="/ 100" />
        </div>
      </div>
    </div>
  );
}
