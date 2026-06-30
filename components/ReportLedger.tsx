"use client";

import { ExternalLink } from "lucide-react";
import ClaimEntry, { Tag, MeterBar } from "./ClaimEntry";
import type {
  SimilarityResult,
  InnovationResult,
  FeasibilityResult,
  RiskResult,
} from "@/types";

export function SimilarityClaim({ data }: { data: SimilarityResult }) {
  const bandTone = data.noveltyBand === "high" ? "good" : data.noveltyBand === "moderate" ? "warn" : "bad";
  return (
    <ClaimEntry number="§1" title="Similarity Agent — Prior Art Search" accent="blueprint">
      <div className="mb-4 flex items-center gap-2">
        <Tag tone={bandTone as "good" | "warn" | "bad"}>{data.noveltyBand} novelty band</Tag>
        <Tag>{data.priorArt.length} patents reviewed</Tag>
      </div>
      <p className="mb-5 text-sm leading-relaxed text-ink-300">{data.summary}</p>

      {data.priorArt.length === 0 ? (
        <p className="text-sm text-ink-600">No meaningfully similar prior art was found in PatentsView for this description.</p>
      ) : (
        <ul className="space-y-3">
          {data.priorArt.slice(0, 6).map((p, i) => (
            <li key={p.patentId + i} className="rounded-lg border border-ink-border bg-ink-700/40 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-ink-50 hover:text-blueprint"
                  >
                    {p.title}
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                  <p className="mt-1 font-mono text-[11px] text-ink-600">
                    US{p.patentId} · {p.assignee} · {p.date}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-ink-300">{p.overlapSummary}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="font-mono text-lg font-semibold tabular-nums text-blueprint">{p.similarityScore}%</span>
                  <p className="font-mono text-[10px] uppercase text-ink-600">overlap</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </ClaimEntry>
  );
}

export function InnovationClaim({ data }: { data: InnovationResult }) {
  return (
    <ClaimEntry number="§2" title="Innovation Agent — Novelty Assessment" accent="agent">
      <div className="mb-5">
        <MeterBar value={data.noveltyScore} label="Novelty score" tone="blueprint" />
      </div>
      <p className="mb-5 text-sm leading-relaxed text-ink-300">{data.summary}</p>

      <div className="grid gap-5 sm:grid-cols-3">
        <ListBlock title="Strengths" items={data.strengths} tone="good" />
        <ListBlock title="Differentiators" items={data.differentiators} tone="neutral" />
        <ListBlock title="Suggestions" items={data.suggestions} tone="warn" />
      </div>
    </ClaimEntry>
  );
}

export function FeasibilityClaim({ data }: { data: FeasibilityResult }) {
  const tone = data.technicalDifficulty === "low" ? "good" : data.technicalDifficulty === "medium" ? "neutral" : data.technicalDifficulty === "high" ? "warn" : "bad";
  return (
    <ClaimEntry number="§3" title="Feasibility Agent — Buildability" accent="brass">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Tag tone={tone as "good" | "warn" | "bad" | "neutral"}>{data.technicalDifficulty} difficulty</Tag>
        <Tag>{data.estimatedTimeline}</Tag>
      </div>
      <p className="mb-5 text-sm leading-relaxed text-ink-300">{data.summary}</p>

      <div className="grid gap-5 sm:grid-cols-2">
        <ListBlock title="Required capabilities" items={data.requiredCapabilities} tone="neutral" />
        <ListBlock title="Key challenges" items={data.keyChallenges} tone="warn" />
      </div>
    </ClaimEntry>
  );
}

export function RiskClaim({ data }: { data: RiskResult }) {
  const tone = data.overallRisk === "low" ? "good" : data.overallRisk === "moderate" ? "warn" : "bad";
  return (
    <ClaimEntry number="§4" title="Risk Agent — Synthesis" accent="danger">
      <div className="mb-5 flex items-center gap-2">
        <Tag tone={tone as "good" | "warn" | "bad"}>{data.overallRisk} overall risk</Tag>
      </div>

      <div className="mb-5 grid gap-5 sm:grid-cols-2">
        <MeterBar value={data.infringementRisk} label="Infringement risk" tone="danger" />
        <MeterBar value={data.marketRisk} label="Market / commercial risk" tone="brass" />
      </div>

      <p className="mb-5 text-sm leading-relaxed text-ink-300">{data.summary}</p>

      {data.flags.length > 0 && (
        <ul className="mb-5 space-y-2">
          {data.flags.map((f, i) => (
            <li key={i} className="flex items-start gap-3 rounded-lg border border-ink-border bg-ink-700/40 px-4 py-3">
              <Tag tone={f.severity === "high" ? "bad" : f.severity === "medium" ? "warn" : "neutral"}>{f.severity}</Tag>
              <span className="text-xs leading-relaxed text-ink-300">{f.description}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="rounded-lg border border-blueprint/20 bg-blueprint/5 px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-blueprint">Recommendation</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-50">{data.recommendation}</p>
      </div>
    </ClaimEntry>
  );
}

function ListBlock({ title, items, tone }: { title: string; items: string[]; tone: "good" | "warn" | "neutral" }) {
  const dotColor = { good: "bg-success", warn: "bg-brass", neutral: "bg-blueprint" }[tone];
  return (
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-300">{title}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-ink-300">
            <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${dotColor}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
