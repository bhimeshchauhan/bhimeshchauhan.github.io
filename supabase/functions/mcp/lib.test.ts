import { assert, assertEquals, assertFalse, assertStringIncludes } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { MAX_REPLY, isToolCall, makeServer } from "./lib.ts";
import content from "./content.json" with { type: "json" };

const chunks = [
  { source: "profile", tag: "overview", content: "Bhimesh Chauhan, overview. Lead AI platform engineer. Contact: bhimeshchauhan@gmail.com" },
  { source: "case_study", tag: "ask-kindred", content: "Case study: Ask Kindred. Production RAG assistant serving about 200 daily users across three customer companies." },
  { source: "case_study", tag: "ask-kindred", content: "Case study: Ask Kindred. How the system works. Multi-tenant retrieval with citations." },
  { source: "case_study", tag: "jefferson-fisher", content: "Case study: Jefferson Fisher launch platform. About $700K in sales in under 48 hours." },
  { source: "blog", tag: "Boxing", content: 'Blog post "Boxing". Staying present in the ring.' },
];
const s = makeServer(chunks);
const call = (name: string, args: unknown) => s.rpc({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } }) as any;
const text = (r: any) => r.result.content[0].text as string;

Deno.test("initialize agrees on a supported protocol version and falls back for an unknown one", () => {
  const ok = s.rpc({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-03-26" } }) as any;
  assertEquals(ok.result.protocolVersion, "2025-03-26");
  const odd = s.rpc({ jsonrpc: "2.0", id: 2, method: "initialize", params: { protocolVersion: "1999-01-01" } }) as any;
  assert(odd.result.protocolVersion >= "2024-11-05");
  assertEquals(Object.keys(ok.result.capabilities), ["tools"]);
});

Deno.test("notifications get no reply; unknown methods and malformed messages get clean errors", () => {
  assertEquals(s.rpc({ jsonrpc: "2.0", method: "notifications/initialized" }), null);
  assertEquals((s.rpc({ jsonrpc: "2.0", id: 3, method: "nope" }) as any).error.code, -32601);
  assertEquals((s.rpc("garbage") as any).error.code, -32600);
  assertEquals((s.rpc({ jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "nope" } }) as any).error.code, -32602);
});

Deno.test("tools/list exposes exactly the four public tools, each with a description and schema", () => {
  const r = s.rpc({ jsonrpc: "2.0", id: 5, method: "tools/list" }) as any;
  assertEquals(r.result.tools.map((t: any) => t.name), ["get_profile", "list_case_studies", "get_case_study", "search"]);
  for (const t of r.result.tools) { assert(t.description.length > 30); assertEquals(t.inputSchema.type, "object"); }
});

Deno.test("search ranks the matching case study first and cites where it came from", () => {
  const r = text(call("search", { query: "launch sales" }));
  assert(r.indexOf("jefferson-fisher") >= 0 && (r.indexOf("ask-kindred") < 0 || r.indexOf("jefferson-fisher") < r.indexOf("ask-kindred")));
  assertStringIncludes(r, "case_study");
});

Deno.test("search with no match says absence of a match is not evidence he lacks the skill", () => {
  const r = call("search", { query: "kubernetes" });
  assertFalse(r.result.isError);
  assertStringIncludes(text(r), "No matches");
  assertStringIncludes(text(r), "does not mean");
});

Deno.test("search rejects bad arguments with a readable error and clamps the limit", () => {
  assert(call("search", { query: { x: 1 } }).result.isError);
  assert(call("search", { query: "   " }).result.isError);
  assert(call("search", { query: "a".repeat(500) }).result.isError);
  assert(call("search", {}).result.isError);
  const many = makeServer(Array.from({ length: 50 }, (_, i) => ({ source: "blog", tag: `t${i}`, content: `rag item ${i}` })));
  const r = (many.rpc({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "search", arguments: { query: "rag", limit: 999 } } }) as any).result.content[0].text;
  assert((r.match(/\n---\n/g) ?? []).length + 1 <= 8);
});

Deno.test("get_case_study returns every chunk of that case study; an unknown slug lists the valid ones", () => {
  const r = text(call("get_case_study", { slug: "ask-kindred" }));
  assertStringIncludes(r, "200 daily users");
  assertStringIncludes(r, "Multi-tenant retrieval");
  const bad = call("get_case_study", { slug: "nope" });
  assert(bad.result.isError);
  assertStringIncludes(text(bad), "ask-kindred");
});

Deno.test("list_case_studies and get_profile answer without arguments", () => {
  const l = text(call("list_case_studies", {}));
  assertStringIncludes(l, "ask-kindred"); assertStringIncludes(l, "jefferson-fisher");
  assertStringIncludes(text(call("get_profile", {})), "Lead AI platform engineer");
});

Deno.test("no reply is ever larger than MAX_REPLY", () => {
  const big = makeServer([{ source: "case_study", tag: "x", content: "word ".repeat(20000) }]);
  const r = (big.rpc({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: "get_case_study", arguments: { slug: "x" } } }) as any).result.content[0].text;
  assert(r.length <= MAX_REPLY + 100);
});

Deno.test("isToolCall is true only for tools/call", () => {
  assert(isToolCall({ method: "tools/call" }));
  assertFalse(isToolCall({ method: "tools/list" })); assertFalse(isToolCall(null)); assertFalse(isToolCall("x"));
});

Deno.test("the shipped content has real case studies and nothing private", () => {
  const all = (content as { source: string; tag: string; content: string }[]);
  assert(all.filter((c) => c.source === "case_study").length >= 30);
  const blob = all.map((c) => c.content).join("\n").toLowerCase();
  for (const forbidden of ["437", "yearly revenue", "manhattan", "can start immediately", "open to contract", "deeksha", "raredays.com"]) {
    assertFalse(blob.includes(forbidden), `content must not contain: ${forbidden}`);
  }
});
