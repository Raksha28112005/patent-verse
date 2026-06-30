# PatentVerse

AI-powered multi-agent patent intelligence platform. Describe an invention concept and PatentVerse runs four specialized AI agents — Similarity, Innovation, Feasibility, and Risk — to evaluate it against real USPTO prior art, in seconds.

## Why this exists

Inventors, researchers, and students build projects without knowing:
- Whether similar patents already exist
- Whether the idea is genuinely innovative
- Whether it's technically feasible to build
- What risk (infringement + market) they're taking on

PatentVerse answers all four with one submission.

## Architecture

```
Browser (React UI) <--SSE--> Next.js App Router (single repo)
                              /api/analyze (streaming route)
                                1. PatentsView search (USPTO data)
                                2. Similarity Agent  (Gemini)
                                3. Innovation Agent  (Gemini)
                                4. Feasibility Agent (Gemini)
                                5. Risk Agent        (Gemini)
                                6. Verdict synthesis (local)
```

Each agent is a focused Gemini call with its own system prompt and strict JSON output contract (see `lib/agents.ts`). The route streams agent status updates to the client over Server-Sent Events so the UI can show live progress instead of a single blocking spinner — this is the "multi-agent" experience made visible.

Prior art comes from [PatentsView](https://patentsview.org), the USPTO's free public patent search API. No API key is required for light usage; an optional key raises rate limits.

## Tech stack

- **Framework:** Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4
- **AI:** Google Gemini API (`@google/generative-ai`), model `gemini-2.5-flash`
- **Data:** PatentsView REST API (USPTO)
- **Icons:** lucide-react
- **Fonts:** Source Serif 4 (display), Inter (body), JetBrains Mono (data/labels)

## Local setup

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```
GEMINI_API_KEY=AIza...   # required — get one at aistudio.google.com/apikey
PATENTSVIEW_API_KEY=           # optional — raises PatentsView rate limits
```

Run the dev server:

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel, **Import Project** and select the repo. Framework preset `Next.js` is auto-detected — no build config changes needed.
3. Under **Environment Variables**, add:
   - `GEMINI_API_KEY` (required)
   - `PATENTSVIEW_API_KEY` (optional)
4. Deploy. The `/api/analyze` route is configured via `vercel.json` to allow up to 60 seconds of execution time, since it runs four sequential Gemini calls plus a PatentsView lookup.

Or via CLI:

```bash
npm i -g vercel
vercel
vercel env add GEMINI_API_KEY
vercel --prod
```

## Project structure

```
app/
  api/analyze/route.ts   — streaming orchestration endpoint
  layout.tsx              — fonts + global metadata
  page.tsx                 — main UI (form -> agent console -> report)
  globals.css              — design tokens (blueprint/ink theme)
components/
  ClaimSheetForm.tsx       — invention input form
  AgentConsole.tsx          — live 4-agent status panel
  VerdictBanner.tsx         — composite score + verdict
  ReportLedger.tsx          — per-agent result cards
  ClaimEntry.tsx             — shared card/meter/tag primitives
  SiteHeader.tsx              — top nav
lib/
  agents.ts                — the 4 Gemini agent calls + verdict scoring
  patentsview.ts             — PatentsView API client
  use-analysis.ts             — client hook driving the SSE stream
types/
  index.ts                  — shared TypeScript contracts
```

## Notes on accuracy

PatentVerse produces AI-generated guidance, not legal advice. Prior-art coverage is limited to what PatentsView indexes (granted US patents primarily) and to a keyword-based candidate search, so it should be treated as a fast first-pass screen — not a substitute for a professional patentability search or a registered patent attorney.
