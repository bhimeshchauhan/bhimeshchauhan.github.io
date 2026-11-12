// The HTTP layer for the MCP server, with the abuse protection. The rate limiter is passed in, so it can be tested without a database.
// Order matters: kill switch, method, size, parse, THEN the limiter (only for tool calls), and only then any work.
import { type Chunk, isToolCall, makeServer } from "./lib.ts";

export const MAX_BODY = 10_000; // bytes
export type Gate = { allowed: boolean; reason?: string } | null; // null = the limiter is unavailable
export type Deps = { enabled: boolean; chunks: Chunk[]; gate: (req: Request) => Promise<Gate>; log?: (o: Record<string, unknown>) => void };

const CORS = {
  "Access-Control-Allow-Origin": "*", // public, read-only content: any AI client may connect
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, accept, mcp-protocol-version, mcp-session-id",
};
const toolError = (text: string) => ({ content: [{ type: "text", text }], isError: true });

export function makeHandler(d: Deps) {
  const server = makeServer(d.chunks);
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });
  const rpcError = (code: number, message: string, status = 200) => json({ jsonrpc: "2.0", id: null, error: { code, message } }, status);

  return async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    if (!d.enabled) return rpcError(-32000, "This server is switched off.", 503);
    if (req.method !== "POST") return new Response("POST only", { status: 405, headers: { ...CORS, Allow: "POST, OPTIONS" } });

    if (Number(req.headers.get("content-length") || 0) > MAX_BODY) return rpcError(-32600, "request too large", 413);
    const raw = await req.text();
    if (raw.length > MAX_BODY) return rpcError(-32600, "request too large", 413);
    let msg: unknown;
    try { msg = JSON.parse(raw); } catch { return rpcError(-32700, "parse error", 400); }

    const m = msg as { id?: unknown; method?: unknown; params?: { name?: unknown } };
    if (isToolCall(msg) && (typeof m.id === "number" || typeof m.id === "string")) {
      let gate: Gate = null;
      try { gate = await d.gate(req); } catch { gate = null; }
      const refuse = (text: string, outcome: string) => { d.log?.({ t: "mcp", method: "tools/call", tool: m.params?.name, outcome }); return json({ jsonrpc: "2.0", id: m.id, result: toolError(text) }); };
      if (!gate) return refuse("Temporarily unavailable. Please try again later.", "limiter_unavailable"); // fails CLOSED
      if (!gate.allowed) {
        return refuse(gate.reason === "daily"
          ? "This server has reached its daily limit. Please try again tomorrow, or email Bhimesh directly."
          : "You have reached the hourly limit for this server. Please try again later.", gate.reason ?? "limited");
      }
    }
    const out = server.rpc(msg);
    d.log?.({ t: "mcp", method: typeof m.method === "string" ? m.method : null, tool: m.params?.name, outcome: out === null ? "notification" : "answered" }); // never logs arguments or IPs
    return out === null ? new Response(null, { status: 202, headers: CORS }) : json(out);
  };
}
