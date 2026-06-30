"use client";

import { Layers } from "lucide-react";

export default function SiteHeader() {
  return (
    <header className="border-b border-ink-border bg-ink/80 backdrop-blur-md sticky top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blueprint/10 text-blueprint">
            <Layers className="h-4 w-4" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight text-ink-50">
            PatentVerse
          </span>
        </div>
        <nav className="flex items-center gap-6">
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-ink-300 sm:inline">
            4-Agent Intelligence Pipeline
          </span>
          <a
            href="https://patentsview.org"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-300 hover:text-blueprint"
          >
            Data: USPTO
          </a>
        </nav>
      </div>
    </header>
  );
}
