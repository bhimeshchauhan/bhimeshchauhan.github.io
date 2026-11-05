import { useEffect, useState } from "react";

// Public Supabase anon key (safe to ship; access is limited by RLS and the function itself).
export const ASK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2cmthY2V5Z2l4dWpqYWtoZnNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MTQzMDIsImV4cCI6MjA3MDA5MDMwMn0.2l3kNQ_rIn1zjz9jXkyrHQ7Ku3xOMhrZrBTo4sDJeMY";
export const ASK_URL = "https://svrkaceygixujjakhfsl.functions.supabase.co/ask-ai";
const KEY = "assistant-health";
const TTL = 10 * 60 * 1000;

// Cheap CORS preflight, no model call. A paused/down project fails or returns non-2xx.
export const checkAssistant = async () => {
  try {
    const cached = JSON.parse(sessionStorage.getItem(KEY) || "null");
    if (cached && Date.now() - cached.t < TTL) return cached.ok;
  } catch (e) {}
  let ok = false;
  try {
    const r = await fetch(ASK_URL, { method: "OPTIONS" });
    ok = r.ok;
  } catch (e) {
    ok = false;
  }
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ ok, t: Date.now() }));
  } catch (e) {}
  return ok;
};

// null = checking, true = online, false = offline
export const useAssistantOnline = () => {
  const [online, setOnline] = useState(null);
  useEffect(() => {
    let live = true;
    checkAssistant().then((ok) => live && setOnline(ok));
    return () => {
      live = false;
    };
  }, []);
  return online;
};

// Lets any component ask the chat widget a question.
export const askAssistant = (question) =>
  window.dispatchEvent(new CustomEvent("ask-assistant", { detail: question }));
