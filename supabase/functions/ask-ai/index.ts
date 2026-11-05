// supabase/functions/ask-ai/index.ts
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// ---------- CORS ----------
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};
// ---------- Config ----------
const OPENROUTER_BASE = "https://openrouter.ai/api/v1/chat/completions";
const COHERE_EMBED_URL = "https://api.cohere.ai/v1/embed";
// Use widely-available defaults; override via env if desired
const DEFAULT_MODEL = Deno.env.get("OPENROUTER_MODEL") || "mistralai/mistral-small-3.2-24b-instruct";
const COHERE_EMBED_MODEL = Deno.env.get("COHERE_EMBED_MODEL") || "embed-english-v3.0";
// RAG params
const RAG_MATCH_THRESHOLD = Number(Deno.env.get("RAG_MATCH_THRESHOLD") ?? 0.75);
const RAG_MATCH_COUNT = Number(Deno.env.get("RAG_MATCH_COUNT") ?? 10);
// Token caps (explicit to satisfy strict TS configs)
const ANSWER_MAX_TOKENS = Number(Deno.env.get("OPENROUTER_ANSWER_MAX_TOKENS") ?? 500);
// ---------- Utils ----------
function withTimeout(ms) {
  const controller = new AbortController();
  const id = setTimeout(()=>controller.abort(), ms);
  return {
    signal: controller.signal,
    cancel: ()=>clearTimeout(id)
  };
}
function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
    }
  });
}
function s(x) {
  return (x ?? "").toString().trim();
}
function isGreeting(input) {
  const q = s(input).toLowerCase();
  if (!q) return false;
  if (q.length <= 24 && /^(hi|hello|hey|yo|sup|what'?s up|how'?s it going|good (morning|afternoon|evening))!?\.?$/.test(q)) {
    return true;
  }
  if (/^(hi+|he+y+|hello+)[!?.]*$/.test(q)) return true;
  return false;
}
// ---------- OpenRouter helper ----------
async function callOpenRouter({ apiKey, model, messages, temperature = 0.4, max_tokens, timeoutMs = 12000 }) {
  const to = withTimeout(timeoutMs);
  try {
    const body = {
      model,
      messages,
      temperature,
      max_tokens
    };
    const res = await fetch(OPENROUTER_BASE, {
      method: "POST",
      signal: to.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const t = await res.text().catch(()=>"");
      throw new Error(`OpenRouter ${model} error: ${res.status} ${t}`);
    }
    const json = await res.json();
    return s(json?.choices?.[0]?.message?.content);
  } finally{
    to.cancel();
  }
}
// ---------- Server ----------
serve(async (req)=>{
  if (req.method === "OPTIONS") return new Response("ok", {
    headers: corsHeaders
  });
  try {
    const body = await req.json().catch(()=>({}));
    const queryRaw = body.query;
    const historyRaw = body.history;
    const query = s(queryRaw);
    const history = Array.isArray(historyRaw) ? historyRaw : [];
    if (!query) return jsonResponse({
      error: "Missing or invalid query."
    }, 400);
    // Env
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    const COHERE_API_KEY = Deno.env.get("COHERE_API_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase credentials missing.");
    if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY missing.");
    if (!COHERE_API_KEY) throw new Error("COHERE_API_KEY missing.");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    // 0) Greeting guard (we assume convo is about Bhimesh; greet warmly without RAG)
    if (isGreeting(query)) {
      return jsonResponse({
        response: "Hi! I’m Bhimesh’s personal assistant. I can share details about his skills, projects, experience, or hobbies—what would you like to know?"
      });
    }
    // 1) Build trimmed history (helps style continuity; not required)
    const trimmedHistory = history.slice(-5);
    const historyMessages = trimmedHistory.flatMap((turn)=>{
      const u = s(turn?.user);
      const a = s(turn?.assistant);
      return u && a ? [
        {
          role: "user",
          content: u
        },
        {
          role: "assistant",
          content: a
        }
      ] : [];
    });
    // 2) Embed the query (augment with Bhimesh for better retrieval signal)
    const embedQuery = `Bhimesh: ${query}`;
    const embedTO = withTimeout(8000);
    const embedRes = await fetch(COHERE_EMBED_URL, {
      method: "POST",
      signal: embedTO.signal,
      headers: {
        Authorization: `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: COHERE_EMBED_MODEL,
        texts: [
          embedQuery
        ],
        input_type: "search_query"
      })
    }).catch((e)=>{
      throw new Error(`Cohere fetch failed: ${e?.message || e}`);
    });
    embedTO.cancel();
    if (!embedRes.ok) {
      const t = await embedRes.text().catch(()=>"");
      throw new Error(`Cohere embed error: ${embedRes.status} ${t}`);
    }
    const embedJson = await embedRes.json();
    const [embedding] = embedJson?.embeddings ?? [];
    if (!embedding) throw new Error("No embedding returned by Cohere.");
    // 3) RAG search in Supabase
    const { data: chunks, error } = await supabase.rpc("match_information_chunks", {
      query_embedding: embedding,
      match_threshold: RAG_MATCH_THRESHOLD,
      match_count: RAG_MATCH_COUNT,
      filter_sources: null
    });
    if (error) throw new Error(`Postgres RPC error: ${error.message}`);
    const context = Array.isArray(chunks) ? chunks.map((c)=>c.content).join("\n\n") : "";
    // 4) Answer as Bhimesh’s PA (grounded, concise, human)
    const systemPrompt = `
You are “Bhimesh’s Resume Assistant,” speaking on his behalf.

Write answers that are:
• Grounded: Use ONLY the provided context (resume, projects, goals, site data). Do not invent facts.
• Helpful & concise: Prefer 2–6 sentences. Use bullets if it improves clarity.
• Positive framing: Highlight Bhimesh’s engineering depth, leadership, impact, and learning velocity.

Assumptions:
• All user questions refer to **Bhimesh** (e.g., “hobbies” means “Bhimesh’s hobbies”).

If an exact technology/tool the user asks about is not present in context:
• Do NOT claim direct experience.
• Briefly connect it to adjacent/analogous experience in the context (similar stacks/frameworks/infra).
• Add a short line like: “This is adjacent to Bhimesh’s work on X; he’s actively extending skills in this area.”

If the requested detail is not in the documents:
• Say you don’t have that in the documents, and provide a next step:
  “You can reach Bhimesh at bhimeshchauhan@gmail.com for details.”
`.trim();
    const answer = await callOpenRouter({
      apiKey: OPENROUTER_API_KEY,
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        ...historyMessages,
        {
          role: "user",
          content: `Context:\n${context}\n\nCurrent Question about Bhimesh: ${query}`
        }
      ],
      temperature: 0.4,
      max_tokens: ANSWER_MAX_TOKENS,
      timeoutMs: 12000
    });
    const safe = s(answer) || "I don’t see that in the documents. You can reach Bhimesh at bhimeshchauhan@gmail.com for details.";
    return jsonResponse({
      response: safe
    });
  } catch (err) {
    console.error("ask-ai error:", err?.message || err);
    return jsonResponse({
      error: "Internal Server Error",
      details: err?.message || "Unknown error"
    }, 500);
  }
});
