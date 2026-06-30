// PatentsView API client — free, public, no key required.
// Docs: https://search.patentsview.org/docs/
// We use the /patent/ endpoint with a full-text-ish query against
// patent_title and patent_abstract using a basic keyword strategy,
// since PatentsView does not support fuzzy semantic search natively.

const PATENTSVIEW_BASE = "https://search.patentsview.org/api/v1/patent/";

export interface RawPatentHit {
  patent_id: string;
  patent_title: string;
  patent_abstract: string | null;
  patent_date: string;
  assignees?: { assignee_organization?: string }[] | null;
}

function extractKeywords(text: string, max = 6): string[] {
  const stopwords = new Set([
    "the", "and", "for", "with", "that", "this", "from", "into", "using",
    "based", "system", "method", "device", "would", "could", "should",
    "have", "has", "are", "was", "were", "will", "can", "our", "their",
    "which", "such", "than", "then", "also", "more", "most", "some",
    "any", "all", "its", "it's", "a", "an", "of", "to", "in", "on", "is",
  ]);
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopwords.has(w));

  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([w]) => w);
}

export async function searchPriorArt(
  title: string,
  description: string
): Promise<RawPatentHit[]> {
  const keywords = extractKeywords(`${title} ${description}`, 6);

  if (keywords.length === 0) return [];

  // PatentsView query DSL: _or of _text_any across title/abstract for our keyword set.
  const query = {
    _or: [
      { _text_any: { patent_title: keywords.join(" ") } },
      { _text_any: { patent_abstract: keywords.join(" ") } },
    ],
  };

  const fields = [
    "patent_id",
    "patent_title",
    "patent_abstract",
    "patent_date",
    "assignees.assignee_organization",
  ];

  const url =
    PATENTSVIEW_BASE +
    "?q=" +
    encodeURIComponent(JSON.stringify(query)) +
    "&f=" +
    encodeURIComponent(JSON.stringify(fields)) +
    "&o=" +
    encodeURIComponent(JSON.stringify({ size: 12 }));

  try {
    const res = await fetch(url, {
      headers: { "X-Api-Key": process.env.PATENTSVIEW_API_KEY ?? "" },
      // PatentsView allows limited unauthenticated access on some endpoints;
      // if an API key is configured via env, it will be used automatically.
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error("PatentsView error", res.status, await res.text());
      return [];
    }

    const data = await res.json();
    return (data.patents ?? []) as RawPatentHit[];
  } catch (err) {
    console.error("PatentsView fetch failed", err);
    return [];
  }
}
