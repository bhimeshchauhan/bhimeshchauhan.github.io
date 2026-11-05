// Public Supabase anon key (safe to ship; same one the chat uses). The Instagram token itself never leaves Supabase.
import { ASK_KEY } from "./assistant";
export const FEED_KEY = ASK_KEY;
// Set GATSBY_FEED_URL=http://127.0.0.1:54321/functions/v1/instagram-feed in .env.development to use the local function.
export const FEED_URL = process.env.GATSBY_FEED_URL || "https://svrkaceygixujjakhfsl.functions.supabase.co/instagram-feed";
