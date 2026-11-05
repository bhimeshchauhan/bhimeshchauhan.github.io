// Usage: deno run --allow-net --allow-env --allow-read --import-map=scripts/local/import-map.json scripts/local/run-instagram-feed.ts
// Loads supabase/functions/.env.local into the process (never printed), then runs the real function file.
const text = await Deno.readTextFile("supabase/functions/.env.local");
for (const line of text.split("\n")) {
  const i = line.indexOf("=");
  if (i > 0 && !line.startsWith("#")) Deno.env.set(line.slice(0, i).trim(), line.slice(i + 1).trim());
}
console.log("instagram-feed local runner: env keys loaded:", ["IG_ACCESS_TOKEN", "IG_USER_ID"].map((k) => `${k}=${Deno.env.get(k) ? "set" : "MISSING"}`).join(", "));
await import("../../supabase/functions/instagram-feed/index.ts");
