"use client";

import { useState } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import ClaimSheetForm from "@/components/ClaimSheetForm";
import AgentConsole from "@/components/AgentConsole";
import VerdictBanner from "@/components/VerdictBanner";
import Scorecard from "@/components/Scorecard";
import ResultTabs from "@/components/ResultTabs";
import {
  SimilarityClaim,
  InnovationClaim,
  FeasibilityClaim,
  RiskClaim,
} from "@/components/ReportLedger";
import { useAnalysis } from "@/lib/use-analysis";
import type { AgentId } from "@/types";

export default function Home() {
  const { state, run, reset } = useAnalysis();
  const [submittedTitle, setSubmittedTitle] = useState("");
  const [activeTab, setActiveTab] = useState<AgentId>("similarity");

  const isRunning = state.phase === "running";
  const isDone = state.phase === "done" && state.report;
  const isIdleOrError = state.phase === "idle" || state.phase === "error";

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />

      <main className="bp-grid flex-1">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          {(isIdleOrError || isRunning) && !isDone && (
            <Hero showForm={isIdleOrError} />
          )}

          {isIdleOrError && (
            <div className="mx-auto max-w-3xl">
              {state.phase === "error" && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 px-5 py-4">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                  <p className="text-sm text-danger">{state.error}</p>
                </div>
              )}
              <ClaimSheetForm
                disabled={isRunning}
                onSubmit={(title, description, field) => {
                  setSubmittedTitle(title);
                  setActiveTab("similarity");
                  run(title, description, field);
                }}
              />
            </div>
          )}

          {isRunning && (
            <div className="mx-auto max-w-3xl">
              <AgentConsole agents={state.agents} />
            </div>
          )}

          {isDone && state.report && (
            <div className="mx-auto max-w-4xl space-y-6">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-300">
                  Analysis Report
                </p>
                <button
                  onClick={reset}
                  className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-300 hover:text-blueprint"
                >
                  <RotateCcw className="h-3 w-3" />
                  New analysis
                </button>
              </div>

              <VerdictBanner verdict={state.report.verdict} title={submittedTitle} />

              {/* At-a-glance scorecard — click any tile to jump to that section */}
              <Scorecard report={state.report} active={activeTab} onSelect={setActiveTab} />

              {/* Tab navigation between the 4 agent deep-dives */}
              <ResultTabs active={activeTab} onChange={setActiveTab} />

              <div>
                {activeTab === "similarity" && <SimilarityClaim data={state.report.similarity} />}
                {activeTab === "innovation" && <InnovationClaim data={state.report.innovation} />}
                {activeTab === "feasibility" && <FeasibilityClaim data={state.report.feasibility} />}
                {activeTab === "risk" && <RiskClaim data={state.report.risk} />}
              </div>

              <p className="pt-2 text-center font-mono text-[10px] text-ink-600">
                PatentVerse provides AI-generated guidance, not legal advice. Consult a registered patent attorney before filing.
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-ink-border px-6 py-6">
        <p className="mx-auto max-w-6xl font-mono text-[11px] text-ink-600">
          PatentVerse — multi-agent patent intelligence. Prior art via PatentsView (USPTO). Analysis via Gemini.
        </p>
      </footer>
    </div>
  );
}

function Hero({ showForm }: { showForm: boolean }) {
  return (
    <div className={`mx-auto max-w-3xl text-center ${showForm ? "mb-10" : "mb-12"}`}>
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-blueprint">
        Four agents. One verdict. Seconds, not weeks.
      </p>
      <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-ink-50 sm:text-5xl">
        Know if your invention is{" "}
        <span className="text-blueprint">novel</span> before you build it.
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-ink-300">
        Pick a field, describe your idea, and tap Run Analysis. PatentVerse checks
        real prior art, scores novelty, tests feasibility, and weighs risk — then shows
        you one clear verdict.
      </p>
    </div>
  );
}
