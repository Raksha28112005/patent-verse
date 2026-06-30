"use client";

import { Search, Lightbulb, Wrench, ShieldAlert } from "lucide-react";
import type { AgentId } from "@/types";

const TABS: { id: AgentId; label: string; short: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "similarity", label: "Similarity", short: "§1", icon: Search },
  { id: "innovation", label: "Innovation", short: "§2", icon: Lightbulb },
  { id: "feasibility", label: "Feasibility", short: "§3", icon: Wrench },
  { id: "risk", label: "Risk", short: "§4", icon: ShieldAlert },
];

export default function ResultTabs({
  active,
  onChange,
}: {
  active: AgentId;
  onChange: (id: AgentId) => void;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-xl border border-ink-border bg-ink-800/60 p-1 backdrop-blur-sm">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-blueprint/15 text-blueprint"
                : "text-ink-300 hover:bg-ink-700/50 hover:text-ink-50"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="font-mono text-[10px] opacity-60">{tab.short}</span>
          </button>
        );
      })}
    </div>
  );
}
