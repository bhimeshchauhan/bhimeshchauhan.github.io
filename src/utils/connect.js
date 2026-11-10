import { track } from "./track";

// One place for how visitors can reach Bhimesh.
export const OWNER_EMAIL = "bhimeshchauhan@gmail.com";
// Calendar link for a short intro call (Cal.com, Calendly, ...). Leave empty and the "Book a call" buttons stay hidden.
export const BOOKING_URL = "";
// Click-to-chat: opens WhatsApp on the visitor's device addressed to this number (digits only, with country code).
export const WHATSAPP_NUMBER = "14376601725";
// Same Getform inbox the Contact page already posts to; it emails the owner.
export const GETFORM_URL = "https://getform.io/f/275143c6-10cf-4c83-a630-0c7381081eb6";

export const whatsappLink = (text = "Hi Bhimesh, I found your portfolio and would like to connect.") =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export const mailtoLink = (subject = "Reaching out from your portfolio") =>
  `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(subject)}`;

// Phrases that mean "I want to reach Bhimesh" rather than "tell me about Bhimesh".
export const CONNECT_INTENT =
  /(get in touch|contact (him|you|bhimesh)|reach (him|you|out)|e-?mail (him|you)|whats ?app|talk to (him|bhimesh)|speak (to|with) (him|bhimesh)|hire (him|you|bhimesh)|interview|schedule a|book a (call|meeting|time)|phone number|leave a message|message (him|bhimesh)|send (him|bhimesh) a|connect with (him|bhimesh|you))/i;

const COOLDOWN_MS = 60 * 1000;

// Returns { ok, error }. Validates, rate-limits per browser session, and honors a honeypot.
export const sendMessageToOwner = async ({ name, email, message, honeypot = "" }) => {
  const n = String(name || "").trim().slice(0, 100);
  const e = String(email || "").trim().slice(0, 200);
  const m = String(message || "").trim().slice(0, 2000);
  if (!n || !m) return { ok: false, error: "Please add your name and a message." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return { ok: false, error: "Please enter a valid email so Bhimesh can reply." };
  if (honeypot) return { ok: true }; // bots: pretend success, send nothing
  try {
    const last = Number(sessionStorage.getItem("connect-last") || 0);
    if (Date.now() - last < COOLDOWN_MS) return { ok: false, error: "Message already sent. Please wait a minute before sending another." };
  } catch (err) {}
  const body = new FormData();
  body.append("name", n);
  body.append("email", e);
  body.append("message", `[via portfolio assistant] ${m}`);
  try {
    const res = await fetch(GETFORM_URL, { method: "POST", body, headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(String(res.status));
    try { sessionStorage.setItem("connect-last", String(Date.now())); } catch (err) {}
    track("contact_message_sent");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: `Could not send right now. Please email ${OWNER_EMAIL} directly.` };
  }
};
