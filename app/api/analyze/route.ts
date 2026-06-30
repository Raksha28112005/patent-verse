import { NextRequest } from "next/server";
import { searchPriorArt } from "@/lib/patentsview";
import {
  runSimilarityAgent,
  runInnovationAgent,
  runFeasibilityAgent,
  runRiskAgent,
  computeVerdict,
} from "@/lib/agents";
import type { AnalysisReport, StreamEvent } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

function sse(event: StreamEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const title: string = body?.title?.trim() ?? "";
  const description: string = body?.description?.trim() ?? "";
  const field: string = body?.field?.trim() || "General / Cross-disciplinary";

  if (!title || !description || description.length < 30) {
    return new Response(
      JSON.stringify({
        error: "Provide a title and a description of at least 30 characters.",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const push = (event: StreamEvent) =>
        controller.enqueue(encoder.encode(sse(event)));

      try {
        if (!process.env.GEMINI_API_KEY) {
          push({
            type: "error",
            message:
              "GEMINI_API_KEY is not configured on the server. Add it to your environment variables (see .env.example) and redeploy.",
          });
          controller.close();
          return;
        }

        // --- Similarity Agent ---
        push({ type: "agent-status", agentId: "similarity", status: "running", detail: "Searching USPTO prior art via PatentsView…" });
        const rawPatents = await searchPriorArt(title, description);
        push({ type: "agent-status", agentId: "similarity", status: "running", detail: `Found ${rawPatents.length} candidate patents — scoring overlap…` });
        const similarity = await runSimilarityAgent(title, description, field, rawPatents);
        push({ type: "agent-result", agentId: "similarity", payload: similarity });
        push({ type: "agent-status", agentId: "similarity", status: "done" });

        // --- Innovation Agent ---
        push({ type: "agent-status", agentId: "innovation", status: "running", detail: "Evaluating novelty against prior-art landscape…" });
        const innovation = await runInnovationAgent(title, description, field, similarity);
        push({ type: "agent-result", agentId: "innovation", payload: innovation });
        push({ type: "agent-status", agentId: "innovation", status: "done" });

        // --- Feasibility Agent ---
        push({ type: "agent-status", agentId: "feasibility", status: "running", detail: "Assessing technical buildability…" });
        const feasibility = await runFeasibilityAgent(title, description, field);
        push({ type: "agent-result", agentId: "feasibility", payload: feasibility });
        push({ type: "agent-status", agentId: "feasibility", status: "done" });

        // --- Risk Agent ---
        push({ type: "agent-status", agentId: "risk", status: "running", detail: "Synthesizing infringement and market risk…" });
        const risk = await runRiskAgent(title, description, field, similarity, innovation, feasibility);
        push({ type: "agent-result", agentId: "risk", payload: risk });
        push({ type: "agent-status", agentId: "risk", status: "done" });

        const verdict = computeVerdict(similarity, innovation, risk);

        const report: AnalysisReport = {
          id: crypto.randomUUID(),
          query: { title, description, field },
          createdAt: new Date().toISOString(),
          similarity,
          innovation,
          feasibility,
          risk,
          verdict,
        };

        push({ type: "final", payload: report });
        controller.close();
      } catch (err) {
        console.error("Analysis pipeline error", err);
        push({
          type: "error",
          message: err instanceof Error ? err.message : "Unknown error during analysis.",
        });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
