"use client";

import { Search, Lightbulb, Wrench, ShieldAlert } from "lucide-react";
import ScoreGauge from "./ScoreGauge";
import type { AgentId, AnalysisReport } from "@/types";

export default function Scorecard({
  report,
  active,
  onSelect,
}: {
  report: AnalysisReport;
  active: AgentId;
  onSelect: (id: AgentId) => void;
}) {
  const items: {
    id: AgentId;
    label: string;
    value: number;
    sub: string;
    icon: React.ComponentType<{ className?: string }>;
    colorClass: string;
  }[] = [
    {
      id: "similarity",
      label: "Prior Art",
      value: report.similarity.priorArt[0]?.similarityScore ?? 0,
      sub: "closest match",
      icon: Search,
      colorClass: "text-blueprint",
    },
    {
      id: "innovation",
      label: "Novelty",
      value: report.innovation.noveltyScore,
      sub: "novelty score",
      icon: Lightbulb,
      colorClass: "text-agent",
    },
    {
      id: "feasibility",
      label: "Feasibility",
      value: difficultyToScore(report.feasibility.technicalDifficulty),
      sub: report.feasibility.technicalDifficulty + " difficulty",
      icon: Wrench,
      colorClass: "text-brass",
    },
    {
      id: "risk",
      label: "Risk",
      value: Math.round((report.risk.infringementRisk + report.risk.marketRisk) / 2),
      sub: report.risk.overallRisk + " risk",
      icon: ShieldAlert,
      colorClass: "text-danger",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all ${
              isActive
                ? "border-blueprint/40 bg-ink-800/80"
                : "border-ink-border bg-ink-800/40 hover:border-ink-600"
            }`}
          >
            <ScoreGauge value={item.value} size={72} strokeWidth={6} colorClass={item.colorClass} />
            <div className="flex items-center gap-1.5 text-ink-50">
              <Icon className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">{item.label}</span>
            </div>
            <span className="font-mono text-[10px] capitalize text-ink-300">{item.sub}</span>
          </button>
        );
      })}
    </div>
  );
}

function difficultyToScore(d: "low" | "medium" | "high" | "very high"): number {
  return { low: 85, medium: 60, high: 35, "very high": 15 }[d];
}
