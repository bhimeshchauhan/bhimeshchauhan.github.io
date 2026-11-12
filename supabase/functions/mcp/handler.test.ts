import { assert, assertEquals, assertFalse, assertStringIncludes } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { MAX_BODY, type Gate, makeHandler } from "./handler.ts";

const chunks = [{ source: "case_study", tag: "ask-kindred", content: "Case study: Ask Kindred. Production RAG assistant." }];
const rpc = (body: unknown, init: RequestInit = {}) => new Request("https://x.test/mcp", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": "9.9.9.9" }, body: typeof body === "string" ? body : JSON.stringify(body), ...init });
const callBody = { jsonrpc: "2.0", id: 7, method: "tools/call", params: { name: "search", arguments: { query: "rag" } } };
function build(gate: Gate | "throw" = { allowed: true }, enabled = true) {
  let gateCalls = 0;
  const h = makeHandler({ enabled, chunks, gate: () => { gateCalls++; if (gate === "throw") throw new Error("db down"); return Promise.resolve(gate); } });
  return { h, calls: () => gateCalls };
}

Deno.test("an allowed tool call is answered and counted exactly once", async () => {
  const { h, calls } = build();
  const r = await h(rpc(callBody)); const j = await r.json();
  assertEquals(r.status, 200); assertEquals(j.id, 7); assertFalse(j.result.isError); assertStringIncludes(j.result.content[0].text, "ask-kindred");
  assertEquals(calls(), 1);
});

Deno.test("hourly and daily limits refuse the call with a readable reason and never run the tool", async () => {
  for (const reason of ["hourly", "daily"]) {
    const { h } = build({ allowed: false, reason });
    const j = await (await h(rpc(callBody))).json();
    assert(j.result.isError); assertStringIncludes(j.result.content[0].text.toLowerCase(), reason); assertFalse(j.result.content[0].text.includes("ask-kindred"));
  }
});

Deno.test("if the limiter is unavailable the call fails CLOSED", async () => {
  for (const g of [null, "throw"] as const) {
    const { h } = build(g); const j = await (await h(rpc(callBody))).json();
    assert(j.result.isError); assertStringIncludes(j.result.content[0].text, "Temporarily unavailable");
  }
});

Deno.test("handshake and listing never touch the limiter", async () => {
  const { h, calls } = build();
  await h(rpc({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18" } }));
  await h(rpc({ jsonrpc: "2.0", id: 2, method: "tools/list" }));
  await h(rpc({ jsonrpc: "2.0", method: "notifications/initialized" }));
  assertEquals(calls(), 0);
});

Deno.test("the kill switch turns everything off", async () => {
  const { h, calls } = build({ allowed: true }, false);
  assertEquals((await h(rpc(callBody))).status, 503); assertEquals(calls(), 0);
});

Deno.test("only POST works; OPTIONS answers CORS; GET is refused", async () => {
  const { h } = build();
  assertEquals((await h(new Request("https://x.test/mcp", { method: "GET" }))).status, 405);
  const o = await h(new Request("https://x.test/mcp", { method: "OPTIONS" }));
  assertEquals(o.status, 204); assertEquals(o.headers.get("access-control-allow-origin"), "*");
});

Deno.test("oversized, malformed and batch bodies are rejected before any work", async () => {
  const { h, calls } = build();
  assertEquals((await h(rpc("x".repeat(MAX_BODY + 1)))).status, 413);
  assertEquals((await h(rpc("x", { headers: { "content-length": String(MAX_BODY + 1), "content-type": "application/json" } }))).status, 413);
  const bad = await h(rpc("{not json")); assertEquals(bad.status, 400); assertEquals((await bad.json()).error.code, -32700);
  const batch = await (await h(rpc([callBody]))).json(); assertEquals(batch.error.code, -32600);
  assertEquals(calls(), 0);
});

Deno.test("a notification gets 202 and no body", async () => {
  const { h } = build(); const r = await h(rpc({ jsonrpc: "2.0", method: "notifications/initialized" }));
  assertEquals(r.status, 202); assertEquals(await r.text(), "");
});
