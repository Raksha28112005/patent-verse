"use client";

import { CheckCircle2, CircleDashed, Loader2, AlertTriangle, Search, Lightbulb, Wrench, ShieldAlert } from "lucide-react";
import type { AgentId, AgentStatus } from "@/types";

const AGENT_ICONS: Record<AgentId, React.ComponentType<{ className?: string }>> = {
  similarity: Search,
  innovation: Lightbulb,
  feasibility: Wrench,
  risk: ShieldAlert,
};

const AGENT_NUMBERS: Record<AgentId, string> = {
  similarity: "§1",
  innovation: "§2",
  feasibility: "§3",
  risk: "§4",
};

export default function AgentConsole({ agents }: { agents: AgentStatus[] }) {
  return (
    <div className="rounded-2xl border border-ink-border bg-ink-800/60 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-ink-border px-5 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-300">
          Agent Pipeline
        </span>
        <span className="font-mono text-[11px] text-ink-300">
          {agents.filter((a) => a.state === "done").length}/{agents.length} complete
        </span>
      </div>
      <ul className="divide-y divide-ink-border">
        {agents.map((agent) => (
          <AgentRow key={agent.id} agent={agent} />
        ))}
      </ul>
    </div>
  );
}

function AgentRow({ agent }: { agent: AgentStatus }) {
  const Icon = AGENT_ICONS[agent.id];

  return (
    <li className="flex items-start gap-4 px-5 py-4">
      <div
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
          agent.state === "done"
            ? "border-blueprint-dim/40 bg-blueprint/10 text-blueprint"
            : agent.state === "running"
            ? "border-agent/40 bg-agent/10 text-agent"
            : agent.state === "error"
            ? "border-danger/40 bg-danger/10 text-danger"
            : "border-ink-border bg-ink-700/50 text-ink-300"
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-ink-300">{AGENT_NUMBERS[agent.id]}</span>
          <span className="font-body text-sm font-medium text-ink-50">{agent.label}</span>
        </div>
        <p className="mt-0.5 truncate text-xs text-ink-300">
          {agent.state === "pending" && "Queued"}
          {agent.state === "running" && (agent.detail ?? "Working…")}
          {agent.state === "done" && "Complete"}
          {agent.state === "error" && (agent.detail ?? "Failed")}
        </p>
      </div>

      <div className="mt-1 shrink-0">
        {agent.state === "pending" && <CircleDashed className="h-4 w-4 text-ink-600" />}
        {agent.state === "running" && <Loader2 className="h-4 w-4 animate-spin text-agent" />}
        {agent.state === "done" && <CheckCircle2 className="h-4 w-4 text-blueprint" />}
        {agent.state === "error" && <AlertTriangle className="h-4 w-4 text-danger" />}
      </div>
    </li>
  );
}
