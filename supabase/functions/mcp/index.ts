// MCP server for bhimeshchauhan.com: lets a visitor's own AI client query his public work. No model runs here, so there is no token bill.
// Protection: size cap, per-visitor hourly + global daily limits (fail CLOSED), a kill switch (MCP_ENABLED=false), and logs that hold no IPs or arguments.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { clientIp, hashKey } from "../job-fit/lib.ts";
import content from "./content.json" with { type: "json" };
import { makeHandler } from "./handler.ts";

const HOUR_LIMIT = Number(Deno.env.get("MCP_HOUR_LIMIT") ?? 30);
const DAY_LIMIT = Number(Deno.env.get("MCP_DAY_LIMIT") ?? 1000);
const url = Deno.env.get("SUPABASE_URL"), svc = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const db = url && svc ? createClient(url, svc, { auth: { persistSession: false } }) : null;
const salt = Deno.env.get("MCP_SALT") || svc?.slice(-16) || "";

Deno.serve(makeHandler({
  enabled: Deno.env.get("MCP_ENABLED") !== "false",
  chunks: content,
  gate: async (req) => {
    if (!db) return null; // missing config means refuse, never run unmetered
    const who = await hashKey(clientIp(req.headers), salt);
    const { data, error } = await db.rpc("mcp_hit", { p_key: who, p_hour_limit: HOUR_LIMIT, p_day_limit: DAY_LIMIT });
    return error ? null : data;
  },
  log: (o) => console.log(JSON.stringify(o)),
}));
