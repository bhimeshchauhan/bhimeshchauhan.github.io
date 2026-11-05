// Prints non-secret facts about the IG token. Never prints the token itself.
const env: Record<string, string> = {};
for (const line of Deno.readTextFileSync("supabase/functions/.env.local").split("\n")) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const T = env.IG_ACCESS_TOKEN, ID = env.IG_USER_ID;
const scrub = (s: string) => s.split(T).join("<token>");
async function get(label: string, url: string) {
  const r = await fetch(url);
  const t = scrub(await r.text());
  console.log(`\n## ${label} -> HTTP ${r.status}\n${t.slice(0, 900)}`);
}
const G = "https://graph.facebook.com/v21.0";
console.log("token length:", T.length, "prefix:", T.slice(0, 4), "| id:", ID);
await get("debug_token", `${G}/debug_token?input_token=${T}&access_token=${T}`);
await get("/me", `${G}/me?fields=id,name&access_token=${T}`);
await get("/me/accounts (pages + linked IG)", `${G}/me/accounts?fields=name,instagram_business_account{id,username}&access_token=${T}`);
await get("/me/assigned_ig_accounts?", `${G}/me/assigned_instagram_accounts?access_token=${T}`);
await get("IG id on facebook host", `${G}/${ID}?fields=id,username&access_token=${T}`);
await get("IG id on instagram host", `https://graph.instagram.com/${ID}?fields=id,username&access_token=${T}`);
await get("instagram /me", `https://graph.instagram.com/me?fields=user_id,username&access_token=${T}`);
