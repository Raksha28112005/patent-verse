import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";
import type {
  PriorArtPatent,
  SimilarityResult,
  InnovationResult,
  FeasibilityResult,
  RiskResult,
  AnalysisReport,
} from "@/types";
import type { RawPatentHit } from "./patentsview";

const MODEL = "gemini-2.5-flash";

function getClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add it to your environment to run live analysis."
    );
  }
  return new GoogleGenerativeAI(apiKey);
}

async function askJSON<T>(
  client: GoogleGenerativeAI,
  system: string,
  user: string
): Promise<T> {
  const model: GenerativeModel = client.getGenerativeModel({
    model: MODEL,
    systemInstruction: system,
    generationConfig: {
      responseMimeType: "application/json",
      maxOutputTokens: 2000,
    },
  });

  const result = await model.generateContent(user);
  const raw = result.response.text() ?? "{}";
  const cleaned = raw.replace(/```json\s*|```/g, "").trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Attempt to salvage the first {...} block
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]) as T;
    throw new Error("Agent returned malformed JSON: " + cleaned.slice(0, 200));
  }
}

// ---------- Agent 1: Similarity ----------
export async function runSimilarityAgent(
  title: string,
  description: string,
  field: string,
  rawPatents: RawPatentHit[]
): Promise<SimilarityResult> {
  const client = getClient();

  const candidateList = rawPatents
    .slice(0, 10)
    .map(
      (p, i) =>
        `[${i}] ID:${p.patent_id} | ${p.patent_title} | Date:${p.patent_date} | Assignee:${
          p.assignees?.[0]?.assignee_organization ?? "Unknown"
        }\nAbstract: ${(p.patent_abstract ?? "No abstract available").slice(0, 500)}`
    )
    .join("\n\n");

  const system = `You are the Similarity Agent inside PatentVerse, a patent intelligence system. You compare an invention concept against a list of candidate prior-art patents pulled from PatentsView (USPTO data). For each candidate, you estimate a similarity score (0-100) reflecting how much functional/technical overlap exists with the invention concept. Be rigorous and skeptical — most candidates returned by keyword search are only loosely related, so most similarity scores should land low (0-35) unless there is a genuine technical overlap. Only respond with strict JSON, no prose, no markdown fences.`;

  const user = `INVENTION CONCEPT
Title: ${title}
Field: ${field}
Description: ${description}

CANDIDATE PRIOR ART (from PatentsView keyword search)
${candidateList || "No candidates were returned by the search."}

Return JSON exactly in this shape:
{
  "priorArt": [
    {"patentId": string, "title": string, "similarityScore": number, "overlapSummary": string (1-2 sentences, specific)}
  ],
  "noveltyBand": "high" | "moderate" | "low",
  "summary": string (2-3 sentences on the overall prior-art landscape)
}
Only include candidates that are at least minimally relevant; you may exclude clearly irrelevant ones. Order by similarityScore descending. "noveltyBand" reflects how novel the invention appears against this prior art: "high" = little real overlap found, "low" = a near-identical patent likely exists.`;

  const result = await askJSON<{
    priorArt: { patentId: string; title: string; similarityScore: number; overlapSummary: string }[];
    noveltyBand: "high" | "moderate" | "low";
    summary: string;
  }>(client, system, user);

  const byId = new Map(rawPatents.map((p) => [p.patent_id, p]));

  const priorArt: PriorArtPatent[] = result.priorArt.map((item) => {
    const raw = byId.get(item.patentId);
    return {
      patentId: item.patentId,
      title: item.title || raw?.patent_title || "Untitled patent",
      abstract: raw?.patent_abstract ?? "",
      date: raw?.patent_date ?? "",
      assignee: raw?.assignees?.[0]?.assignee_organization ?? "Unknown",
      url: `https://patents.google.com/patent/US${item.patentId}`,
      similarityScore: item.similarityScore,
      overlapSummary: item.overlapSummary,
    };
  });

  return { priorArt, noveltyBand: result.noveltyBand, summary: result.summary };
}

// ---------- Agent 2: Innovation ----------
export async function runInnovationAgent(
  title: string,
  description: string,
  field: string,
  similarity: SimilarityResult
): Promise<InnovationResult> {
  const client = getClient();

  const system = `You are the Innovation Agent inside PatentVerse. You assess how genuinely novel and differentiated an invention concept is, informed by the prior-art landscape already identified by the Similarity Agent. You give specific, technically grounded suggestions to strengthen novelty — never generic startup advice. Only respond with strict JSON, no prose, no markdown fences.`;

  const user = `INVENTION CONCEPT
Title: ${title}
Field: ${field}
Description: ${description}

PRIOR ART CONTEXT (from Similarity Agent)
Novelty band: ${similarity.noveltyBand}
Summary: ${similarity.summary}
Top overlaps: ${similarity.priorArt
    .slice(0, 5)
    .map((p) => `${p.title} (${p.similarityScore}% similar) - ${p.overlapSummary}`)
    .join(" | ") || "None found"}

Return JSON exactly in this shape:
{
  "noveltyScore": number (0-100),
  "strengths": string[] (2-4 specific technical/conceptual strengths),
  "differentiators": string[] (2-4 things that could set this apart from existing art),
  "suggestions": string[] (2-4 concrete, specific suggestions to increase novelty or patentability),
  "summary": string (2-3 sentences)
}`;

  return askJSON<InnovationResult>(client, system, user);
}

// ---------- Agent 3: Feasibility ----------
export async function runFeasibilityAgent(
  title: string,
  description: string,
  field: string
): Promise<FeasibilityResult> {
  const client = getClient();

  const system = `You are the Feasibility Agent inside PatentVerse. You assess the technical feasibility of building an invention concept as described — required engineering disciplines, realistic timeline for a working prototype, and the hardest technical risks. Be concrete and realistic, calibrated to what a small team (2-6 people) or solo builder could realistically do. Only respond with strict JSON, no prose, no markdown fences.`;

  const user = `INVENTION CONCEPT
Title: ${title}
Field: ${field}
Description: ${description}

Return JSON exactly in this shape:
{
  "technicalDifficulty": "low" | "medium" | "high" | "very high",
  "estimatedTimeline": string (e.g. "3-5 months for an MVP, 12-18 months for production-grade"),
  "requiredCapabilities": string[] (3-6 specific skills/disciplines/technologies needed),
  "keyChallenges": string[] (2-4 specific technical hurdles, not generic ones),
  "summary": string (2-3 sentences)
}`;

  return askJSON<FeasibilityResult>(client, system, user);
}

// ---------- Agent 4: Risk ----------
export async function runRiskAgent(
  title: string,
  description: string,
  field: string,
  similarity: SimilarityResult,
  innovation: InnovationResult,
  feasibility: FeasibilityResult
): Promise<RiskResult> {
  const client = getClient();

  const system = `You are the Risk Agent inside PatentVerse — the final agent that synthesizes the outputs of the Similarity, Innovation, and Feasibility agents into a holistic risk assessment, covering both patent infringement exposure and market/commercial risk. You are the most rigorous and conservative agent in the pipeline. Only respond with strict JSON, no prose, no markdown fences.`;

  const user = `INVENTION CONCEPT
Title: ${title}
Field: ${field}
Description: ${description}

SIMILARITY AGENT OUTPUT
Novelty band: ${similarity.noveltyBand}
${similarity.summary}
Closest prior art: ${similarity.priorArt[0]?.title ?? "None"} at ${similarity.priorArt[0]?.similarityScore ?? 0}% similarity

INNOVATION AGENT OUTPUT
Novelty score: ${innovation.noveltyScore}/100
${innovation.summary}

FEASIBILITY AGENT OUTPUT
Technical difficulty: ${feasibility.technicalDifficulty}
${feasibility.summary}

Return JSON exactly in this shape:
{
  "overallRisk": "low" | "moderate" | "high" | "critical",
  "infringementRisk": number (0-100, derived from prior art overlap),
  "marketRisk": number (0-100, derived from feasibility + novelty + practical commercial viability),
  "flags": [{"severity": "low"|"medium"|"high", "description": string}] (2-5 specific flags),
  "recommendation": string (1-2 sentences, direct and actionable),
  "summary": string (2-3 sentences synthesizing everything)
}`;

  return askJSON<RiskResult>(client, system, user);
}

export function computeVerdict(
  similarity: SimilarityResult,
  innovation: InnovationResult,
  risk: RiskResult
): AnalysisReport["verdict"] {
  const noveltyComponent = innovation.noveltyScore;
  const riskPenalty = (risk.infringementRisk + risk.marketRisk) / 2;
  const score = Math.max(
    0,
    Math.min(100, Math.round(noveltyComponent * 0.55 + (100 - riskPenalty) * 0.45))
  );

  let label: AnalysisReport["verdict"]["label"];
  let headline: string;

  if (score >= 75) {
    label = "Promising";
    headline = "Strong novelty signal with manageable risk — worth pursuing.";
  } else if (score >= 55) {
    label = "Proceed with Caution";
    headline = "Genuine potential, but key risks need addressing before you build.";
  } else if (score >= 35) {
    label = "High Risk";
    headline = "Significant overlap or feasibility concerns — rework the core idea first.";
  } else {
    label = "Not Recommended";
    headline = "Substantial prior art or risk exposure makes this path unlikely to succeed as-is.";
  }

  return { label, score, headline };
}
