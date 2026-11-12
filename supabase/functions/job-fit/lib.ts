// Pure helpers for the job-fit function. No I/O, so they are unit-tested in lib.test.ts.
export const MAX_CHARS = 12000;
export const MIN_CHARS = 200;
export const SITE = "https://bhimeshchauhan.com";
export const CANARY = "fit-canary-7f3a91c2"; // appears only in the system prompt; if the model echoes it, the reply is dropped
export const NOT_A_JD = "NOT_A_JOB_DESCRIPTION";

// Invisible / control characters are a common way to hide instructions inside pasted text.
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const INVISIBLE = /[​-‏‪-‮⁠-⁤⁦-⁩﻿­]/g;
const TAG_CHARS = /[\u{E0000}-\u{E007F}]/gu;

export function sanitizeInput(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw
    .normalize("NFKC")
    .replace(TAG_CHARS, "")
    .replace(INVISIBLE, "")
    .replace(CONTROL, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, MAX_CHARS);
}

// The job text is untrusted data. Neutralise anything that could close or spoof our delimiter.
export function wrapJob(text: string): string {
  const safe = text.replace(/<\/?\s*job_description[^>]*>/gi, "[tag removed]");
  return `<job_description>\n${safe}\n</job_description>`;
}

// Only links back to this site survive; no other URLs, images, or HTML reach the visitor.
export function filterOutput(raw: string): { text: string; flagged: boolean } {
  let t = String(raw ?? "");
  const flagged = t.includes(CANARY);
  t = t.replace(/<[^>]*>/g, ""); // strip any HTML
  t = t.replace(/!\[[^\]]*\]\([^)]*\)/g, ""); // markdown images
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label, url) => (url.startsWith(`${SITE}/`) || url === SITE ? `[${label}](${url})` : label));
  t = t.replace(/(?<!\()\bhttps?:\/\/[^\s)\]]+/gi, (url) => (url.startsWith(SITE) ? url : "")); // bare non-site URLs
  t = t.replace(/\n{3,}/g, "\n\n").trim().slice(0, 4000);
  return { text: t, flagged };
}

// Cheap lexical check: does this read like a job posting? Used only to decide whether to retry after a model refusal.
const POSTING_WORDS = [/requirements?/i, /responsibilit/i, /qualifications?/i, /you will/i, /we are (looking|hiring)/i, /years of/i, /nice to have/i, /experience (with|in)/i, /\b(apply|salary|benefits|on-?site|remote|hybrid)\b/i, /\b(engineer|developer|manager|architect|analyst|designer)\b/i, /\bteam\b/i];
export const looksLikeJobPosting = (text: string): boolean => POSTING_WORDS.filter((re) => re.test(text)).length >= 4;

export function clientIp(h: Headers): string {
  const xf = h.get("x-forwarded-for") || "";
  return (h.get("cf-connecting-ip") || xf.split(",")[0] || "unknown").trim().slice(0, 64);
}

export async function hashKey(ip: string, salt: string): Promise<string> {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}|${ip}`));
  return [...new Uint8Array(d)].slice(0, 12).map((b) => b.toString(16).padStart(2, "0")).join("");
}

const ORIGINS = new Set([SITE, "https://bhimeshchauhan.github.io", /* ponytail: old host kept while redirects settle, drop later */ "http://localhost:8000", "http://localhost:9000"]);
export const originAllowed = (origin: string | null) => origin === null || ORIGINS.has(origin);
export const corsFor = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin && ORIGINS.has(origin) ? origin : SITE,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  Vary: "Origin",
});
