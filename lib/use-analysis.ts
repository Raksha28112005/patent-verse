"use client";

import { useCallback, useRef, useState } from "react";
import type {
  AgentId,
  AgentStatus,
  AnalysisReport,
  SimilarityResult,
  InnovationResult,
  FeasibilityResult,
  RiskResult,
  StreamEvent,
} from "@/types";

const AGENT_LABELS: Record<AgentId, string> = {
  similarity: "Similarity Agent",
  innovation: "Innovation Agent",
  feasibility: "Feasibility Agent",
  risk: "Risk Agent",
};

const AGENT_ORDER: AgentId[] = ["similarity", "innovation", "feasibility", "risk"];

function initialAgentStatuses(): AgentStatus[] {
  return AGENT_ORDER.map((id) => ({ id, label: AGENT_LABELS[id], state: "pending" }));
}

export interface AnalysisState {
  phase: "idle" | "running" | "done" | "error";
  agents: AgentStatus[];
  partial: {
    similarity?: SimilarityResult;
    innovation?: InnovationResult;
    feasibility?: FeasibilityResult;
    risk?: RiskResult;
  };
  report: AnalysisReport | null;
  error: string | null;
}

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    phase: "idle",
    agents: initialAgentStatuses(),
    partial: {},
    report: null,
    error: null,
  });
  const controllerRef = useRef<AbortController | null>(null);

  const run = useCallback(
    async (title: string, description: string, field: string) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      setState({
        phase: "running",
        agents: initialAgentStatuses(),
        partial: {},
        report: null,
        error: null,
      });

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, field }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(errJson.error || `Request failed (${res.status})`);
        }
        if (!res.body) throw new Error("No response stream available.");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const chunks = buffer.split("\n\n");
          buffer = chunks.pop() ?? "";

          for (const chunk of chunks) {
            const line = chunk.trim();
            if (!line.startsWith("data:")) continue;
            const jsonStr = line.slice(5).trim();
            if (!jsonStr) continue;

            let event: StreamEvent;
            try {
              event = JSON.parse(jsonStr);
            } catch {
              continue;
            }

            setState((prev) => applyEvent(prev, event));
          }
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        setState((prev) => ({
          ...prev,
          phase: "error",
          error: err instanceof Error ? err.message : "Something went wrong.",
        }));
      }
    },
    []
  );

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    setState({
      phase: "idle",
      agents: initialAgentStatuses(),
      partial: {},
      report: null,
      error: null,
    });
  }, []);

  return { state, run, reset };
}

function applyEvent(prev: AnalysisState, event: StreamEvent): AnalysisState {
  switch (event.type) {
    case "agent-status": {
      if (!event.agentId || !event.status) return prev;
      const agents = prev.agents.map((a) =>
        a.id === event.agentId
          ? { ...a, state: event.status as AgentStatus["state"], detail: event.detail ?? a.detail }
          : a
      );
      return { ...prev, agents };
    }
    case "agent-result": {
      if (!event.agentId) return prev;
      return {
        ...prev,
        partial: { ...prev.partial, [event.agentId]: event.payload },
      };
    }
    case "final": {
      return {
        ...prev,
        phase: "done",
        report: event.payload as AnalysisReport,
      };
    }
    case "error": {
      return { ...prev, phase: "error", error: event.message ?? "Unknown error." };
    }
    default:
      return prev;
  }
}
