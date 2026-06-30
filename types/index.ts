export interface PriorArtPatent {
  patentId: string;
  title: string;
  abstract: string;
  date: string;
  assignee: string;
  url: string;
  similarityScore: number; // 0-100, computed by Similarity Agent
  overlapSummary: string;
}

export interface AgentStatus {
  id: AgentId;
  label: string;
  state: "pending" | "running" | "done" | "error";
  detail?: string;
}

export type AgentId = "similarity" | "innovation" | "feasibility" | "risk";

export interface SimilarityResult {
  priorArt: PriorArtPatent[];
  noveltyBand: "high" | "moderate" | "low";
  summary: string;
}

export interface InnovationResult {
  noveltyScore: number; // 0-100
  strengths: string[];
  differentiators: string[];
  suggestions: string[];
  summary: string;
}

export interface FeasibilityResult {
  technicalDifficulty: "low" | "medium" | "high" | "very high";
  estimatedTimeline: string;
  requiredCapabilities: string[];
  keyChallenges: string[];
  summary: string;
}

export interface RiskResult {
  overallRisk: "low" | "moderate" | "high" | "critical";
  infringementRisk: number; // 0-100
  marketRisk: number; // 0-100
  flags: { severity: "low" | "medium" | "high"; description: string }[];
  recommendation: string;
  summary: string;
}

export interface AnalysisReport {
  id: string;
  query: {
    title: string;
    description: string;
    field: string;
  };
  createdAt: string;
  similarity: SimilarityResult;
  innovation: InnovationResult;
  feasibility: FeasibilityResult;
  risk: RiskResult;
  verdict: {
    label: "Promising" | "Proceed with Caution" | "High Risk" | "Not Recommended";
    score: number; // 0-100 composite
    headline: string;
  };
}

export interface StreamEvent {
  type: "agent-status" | "agent-result" | "final" | "error";
  agentId?: AgentId;
  status?: AgentStatus["state"];
  detail?: string;
  payload?: unknown;
  message?: string;
}
