// MCP server logic for the portfolio. Pure: no network, no env, no model. index.ts adds HTTP, the rate limiter and the kill switch.
// The visitor's own AI decides which tool to call and writes the answer; this only returns public site content.

export type Chunk = { source: string; tag: string; content: string };
type Id = number | string | null;
type Out = null | { jsonrpc: "2.0"; id: Id; result?: unknown; error?: { code: number; message: string } };

export const PROTOCOLS = ["2025-06-18", "2025-03-26", "2024-11-05"]; // MCP spec versions we speak
export const MAX_REPLY = 12_000; // characters in any one tool reply
const MAX_QUERY = 120;
const MAX_HITS = 8;
const SNIPPET = 420;
const SITE = "https://bhimeshchauhan.com";
const STOP = new Set(["the", "a", "an", "and", "or", "of", "to", "in", "for", "with", "on", "at", "is", "has", "have", "he", "his", "him", "did", "does", "do", "what", "how", "who", "about", "been", "by", "as"]);

const clip = (s: string) => (s.length > MAX_REPLY ? s.slice(0, MAX_REPLY) + "\n[truncated]" : s);
const reply = (text: string, isError = false) => ({ content: [{ type: "text", text: clip(text) }], isError });
const str = (v: unknown, max: number) => (typeof v === "string" && v.trim() && v.length <= max ? v.trim() : null); // every argument is checked
const fail = (code: number, message: string) => ({ code, message });
export const isToolCall = (m: unknown) => typeof m === "object" && m !== null && (m as { method?: unknown }).method === "tools/call";

export function makeServer(chunks: Chunk[]) {
  const slugs = [...new Set(chunks.filter((c) => c.source === "case_study").map((c) => c.tag))];
  const titleOf = (slug: string) => chunks.find((c) => c.tag === slug)?.content.match(/^Case study: ([^.]+?)\./)?.[1] ?? slug;

  const tools = [
    { name: "get_profile", description: "Who Bhimesh Chauhan is: role, focus, experience timeline, education, skills and how to contact him. Start here.",
      inputSchema: { type: "object", properties: {} },
      run: () => reply(chunks.filter((c) => c.source === "profile" && ["overview", "timeline", "education", "skills"].includes(c.tag)).map((c) => c.content).join("\n\n") +
        `\n\nMore: ${SITE}/ (site), ${SITE}/evidence/ (published retrieval evaluation), ${SITE}/case-studies/.`) },
    { name: "list_case_studies", description: "List his shipped case studies (slug and title). Use a slug with get_case_study.",
      inputSchema: { type: "object", properties: {} },
      run: () => reply(slugs.map((s) => `- ${s}: ${titleOf(s)}`).join("\n")) },
    { name: "get_case_study", description: "Get the full text of one case study: scope, architecture, decisions, reliability and measured outcomes.",
      inputSchema: { type: "object", properties: { slug: { type: "string", enum: slugs, description: "a slug from list_case_studies" } }, required: ["slug"] },
      run: (a: Record<string, unknown>) => {
        const slug = str(a.slug, 80);
        if (!slug || !slugs.includes(slug)) return reply(`Unknown slug. Valid slugs: ${slugs.join(", ")}`, true);
        return reply(chunks.filter((c) => c.source === "case_study" && c.tag === slug).map((c) => c.content).join("\n\n"));
      } },
    { name: "search", description: "Keyword search across his public work: case studies, experience, projects and writing. Returns short passages with where each came from.",
      inputSchema: { type: "object", properties: { query: { type: "string", description: "a few keywords, e.g. 'rag evaluation' or 'stripe launch'" }, limit: { type: "integer", minimum: 1, maximum: MAX_HITS, description: `passages to return (default 5, max ${MAX_HITS})` } }, required: ["query"] },
      run: (a: Record<string, unknown>) => {
        const q = str(a.query, MAX_QUERY);
        if (!q) return reply(`query must be a short text of keywords (at most ${MAX_QUERY} characters)`, true);
        const limit = Math.min(MAX_HITS, Math.max(1, Math.floor(Number(a.limit) || 5)));
        const terms = [...new Set(q.toLowerCase().match(/[a-z0-9]{2,}/g) ?? [])].filter((t) => !STOP.has(t));
        const scored = chunks.map((c, i) => {
          const text = c.content.toLowerCase(), tag = c.tag.toLowerCase();
          let distinct = 0, occ = 0;
          for (const t of terms) { const n = text.split(t).length - 1; if (n) { distinct++; occ += Math.min(n, 3); } }
          return { c, i, score: distinct ? distinct * 10 + occ + (terms.some((t) => tag.includes(t)) ? 3 : 0) : 0 };
        }).filter((x) => x.score > 0).sort((x, y) => y.score - x.score || x.i - y.i).slice(0, limit);
        if (!scored.length) return reply(`No matches for "${q}". A missing match does not mean he lacks that skill or experience: this only searches his public site. Try broader keywords, list_case_studies, or get_profile.`);
        return reply(scored.map(({ c }) => `[${c.source}:${c.tag}]\n${c.content.length > SNIPPET ? c.content.slice(0, SNIPPET) + "…" : c.content}`).join("\n---\n"));
      } },
  ];

  function handle(method: string, params: any) {
    switch (method) {
      case "initialize": return { protocolVersion: PROTOCOLS.includes(params?.protocolVersion) ? params.protocolVersion : PROTOCOLS[0], capabilities: { tools: {} }, serverInfo: { name: "bhimesh-chauhan-portfolio", version: "1.0.0" } };
      case "ping": return {};
      case "tools/list": return { tools: tools.map(({ run: _run, ...spec }) => spec) };
      case "tools/call": {
        const t = tools.find((t) => t.name === params?.name);
        if (!t) throw fail(-32602, "unknown tool");
        const args = params?.arguments;
        return t.run(typeof args === "object" && args !== null && !Array.isArray(args) ? args : {});
      }
      default: throw fail(-32601, "method not found");
    }
  }

  return {
    rpc(msg: unknown): Out {
      if (typeof msg !== "object" || msg === null || Array.isArray(msg) || (msg as { jsonrpc?: unknown }).jsonrpc !== "2.0") return { jsonrpc: "2.0", id: null, error: fail(-32600, "invalid request") };
      const m = msg as { id?: unknown; method?: unknown; params?: unknown };
      if (m.id === undefined) return null; // a notification (e.g. "initialized"): no reply
      if (!["number", "string"].includes(typeof m.id) && m.id !== null) return { jsonrpc: "2.0", id: null, error: fail(-32600, "invalid request") };
      const id = m.id as Id;
      if (typeof m.method !== "string") return { jsonrpc: "2.0", id, error: fail(-32600, "invalid request") };
      try { return { jsonrpc: "2.0", id, result: handle(m.method, m.params) }; }
      catch (e) { const er = e as { code?: number; message?: string }; return { jsonrpc: "2.0", id, error: typeof er?.code === "number" ? fail(er.code, er.message ?? "error") : fail(-32603, "internal error") }; }
    },
  };
}
