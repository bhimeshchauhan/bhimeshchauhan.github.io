// Read-only Instagram feed for the portfolio art page.
// The token lives only in Supabase secrets (IG_ACCESS_TOKEN, IG_USER_ID); it is never returned to the browser.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};
const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json", ...extra } });

const FIELDS = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
let cache: { at: number; items: unknown[] } | null = null;
const TTL = 10 * 60 * 1000; // 10 minutes, keeps us far below Instagram rate limits

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "GET") return json({ error: "Method not allowed" }, 405);

  const token = Deno.env.get("IG_ACCESS_TOKEN");
  const userId = Deno.env.get("IG_USER_ID");
  if (!token || !userId) return json({ error: "Instagram is not configured." }, 503);

  if (cache && Date.now() - cache.at < TTL) return json({ items: cache.items, cached: true }, 200, { "Cache-Control": "public, max-age=300" });

  // Unified-login tokens use graph.facebook.com; the Instagram-login token uses graph.instagram.com. Try both.
  const hosts = ["https://graph.instagram.com", "https://graph.facebook.com/v21.0"];
  let lastErr = "";
  for (const host of hosts) {
    try {
      const r = await fetch(`${host}/${userId}/media?fields=${FIELDS}&limit=50&access_token=${encodeURIComponent(token)}`);
      const body = await r.json();
      if (!r.ok) { lastErr = body?.error?.message ?? `HTTP ${r.status}`; continue; }
      const items = (body.data ?? [])
        .filter((m: any) => m.media_type === "IMAGE" || m.media_type === "CAROUSEL_ALBUM" || m.media_type === "VIDEO")
        .map((m: any) => ({
          id: m.id,
          image: m.media_type === "VIDEO" ? (m.thumbnail_url ?? null) : m.media_url,
          caption: (m.caption ?? "").slice(0, 600),
          link: m.permalink,
          date: m.timestamp,
          type: m.media_type,
        }))
        .filter((m: any) => m.image);
      cache = { at: Date.now(), items };
      return json({ items }, 200, { "Cache-Control": "public, max-age=300" });
    } catch (e) {
      lastErr = String((e as Error)?.message ?? e);
    }
  }
  console.error("instagram-feed failed:", lastErr.replace(token, "<token>"));
  return json({ error: "Could not load Instagram right now." }, 502);
});
