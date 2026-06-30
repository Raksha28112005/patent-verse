"use client";

import { useState } from "react";
import {
  ArrowRight,
  Loader2,
  Cpu,
  Cog,
  HeartPulse,
  Wrench,
  Leaf,
  Package,
  Sparkles,
  Wand2,
} from "lucide-react";

const FIELD_OPTIONS = [
  { label: "Software / AI & ML", icon: Cpu },
  { label: "Hardware / IoT & Electronics", icon: Cog },
  { label: "Biotech / Medical Devices", icon: HeartPulse },
  { label: "Mechanical / Industrial Design", icon: Wrench },
  { label: "Clean Energy / Materials", icon: Leaf },
  { label: "Consumer Products", icon: Package },
  { label: "General / Cross-disciplinary", icon: Sparkles },
];

const EXAMPLES = [
  {
    label: "Try: Gait sensor",
    title: "Bilateral ankle-sensor gait asymmetry monitor",
    field: "Biotech / Medical Devices",
    description:
      "A wearable device with paired ankle sensors that fuses accelerometer and gyroscope data from both legs in real time to detect asymmetric gait patterns linked to early-stage neurological conditions, flagging deviations through a mobile app for clinicians.",
  },
  {
    label: "Try: Smart compost bin",
    title: "AI-assisted compost moisture and aeration controller",
    field: "Clean Energy / Materials",
    description:
      "A countertop compost bin with embedded moisture and gas sensors that uses a small ML model to predict optimal turning and aeration schedules, automatically rotating internal paddles to speed decomposition and reduce odor.",
  },
  {
    label: "Try: Water drone",
    title: "Autonomous surface vehicle for water pollution mapping",
    field: "Hardware / IoT & Electronics",
    description:
      "A solar-powered autonomous surface vehicle that patrols lakes and rivers, using onboard optical sensors and a lightweight vision model to detect oil sheens, algae blooms, and turbidity changes, then maps pollution hotspots in real time.",
  },
];

export default function ClaimSheetForm({
  onSubmit,
  disabled,
}: {
  onSubmit: (title: string, description: string, field: string) => void;
  disabled: boolean;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [field, setField] = useState(FIELD_OPTIONS[6].label);
  const [touched, setTouched] = useState(false);

  const descTooShort = description.trim().length > 0 && description.trim().length < 30;
  const canSubmit = title.trim().length > 0 && description.trim().length >= 30 && !disabled;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;
    onSubmit(title.trim(), description.trim(), field);
  }

  function loadExample(ex: (typeof EXAMPLES)[number]) {
    setTitle(ex.title);
    setDescription(ex.description);
    setField(ex.field);
    setTouched(false);
  }

  return (
    <div className="space-y-4">
      {/* Quick-start example chips — removes blank-page friction */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-300">
          <Wand2 className="h-3.5 w-3.5" />
          Not sure where to start?
        </span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            type="button"
            onClick={() => loadExample(ex)}
            className="rounded-full border border-ink-border bg-ink-700/50 px-3 py-1.5 text-xs text-ink-300 transition-colors hover:border-blueprint/40 hover:text-blueprint"
          >
            {ex.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative rounded-2xl border border-ink-border bg-ink-800/60 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between border-b border-ink-border px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-blueprint">
              Claim Sheet
            </span>
            <span className="hidden text-xs text-ink-300 sm:inline">
              — describe your invention in plain language
            </span>
          </div>
          <span className="font-mono text-[11px] text-ink-600">
            No. <span className="text-ink-300">PV-{new Date().getFullYear()}</span>
          </span>
        </div>

        <div className="space-y-6 px-6 py-6">
          <Field label="01 — Title of Invention">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Adaptive bilateral ankle-sensor gait asymmetry monitor"
              className="w-full bg-transparent font-display text-xl text-ink-50 placeholder:text-ink-600 focus:outline-none"
              maxLength={140}
            />
          </Field>

          <div>
            <label className="mb-3 block font-mono text-[11px] uppercase tracking-[0.14em] text-ink-300">
              02 — Field of Art
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {FIELD_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const active = field === opt.label;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setField(opt.label)}
                    className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-3 text-center transition-all ${
                      active
                        ? "border-blueprint/50 bg-blueprint/10 text-blueprint"
                        : "border-ink-border bg-ink-700/30 text-ink-300 hover:border-ink-600 hover:text-ink-50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[11px] leading-tight">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <Field
            label="03 — Description"
            hint={`${description.trim().length} characters · 30 minimum`}
          >
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what the invention does, how it works, and what problem it solves. Be specific about the mechanism — that's what the Similarity Agent searches against."
              rows={5}
              className="w-full resize-none bg-transparent font-body text-sm leading-relaxed text-ink-50 placeholder:text-ink-600 focus:outline-none"
              maxLength={4000}
            />
          </Field>
          {touched && descTooShort && (
            <p className="-mt-3 text-xs text-danger">
              Add a bit more detail — at least 30 characters helps the agents work accurately.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 border-t border-ink-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-300">
            Four agents will run in sequence: Similarity → Innovation → Feasibility → Risk.
          </p>
          <button
            type="submit"
            disabled={!canSubmit}
            className="group flex items-center justify-center gap-2 rounded-lg bg-blueprint px-5 py-2.5 font-body text-sm font-semibold text-ink-900 transition-all hover:bg-blueprint-dim disabled:cursor-not-allowed disabled:opacity-40"
          >
            {disabled ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing
              </>
            ) : (
              <>
                Run Analysis
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-300">
          {label}
        </label>
        {hint && <span className="font-mono text-[10px] text-ink-600">{hint}</span>}
      </div>
      <div className="border-b border-ink-border pb-2 focus-within:border-blueprint/60">
        {children}
      </div>
    </div>
  );
}
