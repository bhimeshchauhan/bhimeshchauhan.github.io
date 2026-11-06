import React, { useState } from "react";
import styled from "styled-components";
import { GETFORM_URL, OWNER_EMAIL } from "../../utils/connect";

const Box = styled.section`
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 28px;
  padding: clamp(1.25rem, 4vw, 2.25rem);
  h2 { color: var(--ink); font-family: "Space Grotesk", "Inter", sans-serif; font-size: clamp(1.4rem, 3vw, 1.8rem); letter-spacing: -0.02em; margin: 0 0 0.35rem; }
  .lede { color: var(--muted); line-height: 1.55; margin: 0 0 1.4rem; }
  form { display: grid; gap: 1rem; }
  .two { display: grid; gap: 1rem; grid-template-columns: 1fr 1fr; }
  @media (max-width: 600px) { .two { grid-template-columns: 1fr; } }
  fieldset { border: 0; display: grid; gap: 1rem; margin: 0; min-width: 0; padding: 0; }
  legend { color: var(--accent); font-size: 0.78rem; font-weight: 700; letter-spacing: 0.12em; margin-bottom: 0.6rem; padding: 0; text-transform: uppercase; }
  label { color: var(--muted); display: grid; font-size: 0.8rem; gap: 0.35rem; letter-spacing: 0.06em; text-transform: uppercase; }
  label .opt { letter-spacing: 0; opacity: 0.7; text-transform: none; }
  input, select, textarea { background: rgba(0,0,0,0.3); border: 1px solid var(--line); border-radius: 12px; box-sizing: border-box; color: var(--ink); font: 1rem "Inter", sans-serif; letter-spacing: 0; min-height: 46px; padding: 0.7rem 0.85rem; text-transform: none; width: 100%; }
  select { appearance: none; background-image: linear-gradient(45deg, transparent 50%, var(--muted) 50%), linear-gradient(135deg, var(--muted) 50%, transparent 50%); background-position: calc(100% - 20px) 50%, calc(100% - 14px) 50%; background-repeat: no-repeat; background-size: 6px 6px, 6px 6px; padding-right: 2.2rem; }
  select option { background: #11131c; color: var(--ink); }
  input:focus, select:focus, textarea:focus { border-color: var(--accent); outline: none; }
  textarea { min-height: 140px; resize: vertical; }
  .hp { height: 0; left: -9999px; opacity: 0; position: absolute; width: 0; }
  button[type=submit] { background: var(--accent); border: 0; border-radius: 999px; color: #0b0d12; cursor: pointer; font: 700 1rem "Inter", sans-serif; min-height: 48px; padding: 0.9rem 1.5rem; }
  button[disabled] { cursor: default; opacity: 0.5; }
  .err { color: #ff9a8a; margin: 0; }
  .ok { color: #9ee6a8; font-size: 1.05rem; line-height: 1.5; margin: 0; }
  .note { color: var(--muted); font-size: 0.85rem; margin: 0; }
`;

const WHO = ["Recruiter or talent partner", "Hiring manager or founder", "Engineer or collaborator", "Client with a project", "Something else"];
const TOPIC = ["Full-time role", "Contract or consulting", "Forward-deployed / customer engagement", "Advisory or speaking", "Just saying hello"];
const ARRANGEMENT = ["Not sure yet", "Remote", "Hybrid", "On-site"];
const FOUND = ["LinkedIn", "Google or other search", "An AI assistant (ChatGPT, Claude, etc.)", "GitHub", "Referral", "This site's chat assistant", "Somewhere else"];
const REPLY = ["Email", "LinkedIn message", "Phone or WhatsApp", "Video call"];
const COOLDOWN = 60 * 1000;
const LAST = "contact-form-last";

const cap = (s, n) => String(s || "").trim().slice(0, n);
const safeUrl = (s) => { try { const u = new URL(s); return /^https?:$/.test(u.protocol) ? u.href.slice(0, 300) : ""; } catch (e) { return ""; } };

const ContactForm = () => {
  const [f, setF] = useState({ who: WHO[0], name: "", email: "", company: "", topic: TOPIC[0], role: "", posting: "", arrangement: ARRANGEMENT[0], location: "", comp: "", timeline: "", found: FOUND[0], reply: REPLY[0], handle: "", message: "", hp: "" });
  const [state, setState] = useState("idle");
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const isRole = f.topic === TOPIC[0] || f.topic === TOPIC[1] || f.topic === TOPIC[2];

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    const name = cap(f.name, 100), email = cap(f.email, 200), message = cap(f.message, 3000);
    if (!name || !message) return setErr("Please add your name and a message.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErr("Please enter a valid email so I can reply.");
    if (f.posting.trim() && !safeUrl(f.posting.trim())) return setErr("The job posting link should start with https://");
    if (f.hp) return setState("sent");
    try {
      if (Date.now() - Number(sessionStorage.getItem(LAST) || 0) < COOLDOWN) return setErr("Message already sent. Please wait a minute before sending another.");
    } catch (x) {}
    setState("sending");
    const line = (label, v) => (v ? `${label}: ${v}` : "");
    const body = new FormData();
    body.append("name", name);
    body.append("email", email);
    body.append("message", [
      `[CONTACT: ${f.who} | ${f.topic}]`,
      line("Company", cap(f.company, 150)),
      isRole ? line("Role", cap(f.role, 150)) : "",
      isRole ? line("Posting", f.posting.trim() ? safeUrl(f.posting.trim()) : "") : "",
      isRole ? `Arrangement: ${f.arrangement}` : "",
      isRole ? line("Location", cap(f.location, 150)) : "",
      isRole ? line("Compensation range", cap(f.comp, 150)) : "",
      line("Timeline", cap(f.timeline, 150)),
      `Found me via: ${f.found}`,
      `Best reply by: ${f.reply}${f.reply !== REPLY[0] && f.handle.trim() ? ` (${cap(f.handle, 150)})` : ""}`,
      "",
      message,
    ].filter((x) => x !== "").join("\n"));
    try {
      const r = await fetch(GETFORM_URL, { method: "POST", body, headers: { Accept: "application/json" } });
      if (!r.ok) throw new Error(String(r.status));
      try { sessionStorage.setItem(LAST, String(Date.now())); } catch (x) {}
      setState("sent");
    } catch (x) {
      setState("idle");
      setErr(`Could not send right now. Please email ${OWNER_EMAIL} directly.`);
    }
  };

  if (state === "sent") {
    return <Box><h2>Thank you</h2><p className="ok">Message sent. I will reply to {f.email || "you"} by {f.reply.toLowerCase()} soon.</p></Box>;
  }
  return (
    <Box>
      <h2>Send a message</h2>
      <p className="lede">A few details up front help me reply with something useful. Only name, email and message are required.</p>
      <form onSubmit={submit} noValidate>
        <fieldset>
          <legend>About you</legend>
          <div className="two">
            <label>I am a<select value={f.who} onChange={set("who")}>{WHO.map((t) => <option key={t}>{t}</option>)}</select></label>
            <label><span>Company or organization <span className="opt">(optional)</span></span><input value={f.company} onChange={set("company")} maxLength={150} autoComplete="organization" /></label>
          </div>
          <div className="two">
            <label>Your name<input value={f.name} onChange={set("name")} maxLength={100} autoComplete="name" /></label>
            <label>Your email<input type="email" value={f.email} onChange={set("email")} maxLength={200} autoComplete="email" /></label>
          </div>
        </fieldset>

        <fieldset>
          <legend>What it is about</legend>
          <label>Topic<select value={f.topic} onChange={set("topic")}>{TOPIC.map((t) => <option key={t}>{t}</option>)}</select></label>
          {isRole && (
            <>
              <div className="two">
                <label><span>Role title <span className="opt">(optional)</span></span><input value={f.role} onChange={set("role")} maxLength={150} placeholder="e.g. Staff AI Engineer" /></label>
                <label><span>Job posting link <span className="opt">(optional)</span></span><input type="url" value={f.posting} onChange={set("posting")} maxLength={300} placeholder="https://" /></label>
              </div>
              <div className="two">
                <label>Work arrangement<select value={f.arrangement} onChange={set("arrangement")}>{ARRANGEMENT.map((t) => <option key={t}>{t}</option>)}</select></label>
                <label><span>Team location <span className="opt">(optional)</span></span><input value={f.location} onChange={set("location")} maxLength={150} placeholder="e.g. Toronto or remote" /></label>
              </div>
              <label><span>Compensation range <span className="opt">(optional, if known)</span></span><input value={f.comp} onChange={set("comp")} maxLength={150} placeholder="e.g. CAD 180k to 220k" /></label>
            </>
          )}
          <label><span>Timeline <span className="opt">(optional)</span></span><input value={f.timeline} onChange={set("timeline")} maxLength={150} placeholder="e.g. hiring in Q1, or a call this week" /></label>
        </fieldset>

        <fieldset>
          <legend>Your message</legend>
          <label>Message<textarea value={f.message} onChange={set("message")} maxLength={3000} /></label>
          <div className="two">
            <label>How did you find me?<select value={f.found} onChange={set("found")}>{FOUND.map((t) => <option key={t}>{t}</option>)}</select></label>
            <label>Best way to reply<select value={f.reply} onChange={set("reply")}>{REPLY.map((t) => <option key={t}>{t}</option>)}</select></label>
          </div>
          {f.reply !== REPLY[0] && (
            <label><span>{f.reply === REPLY[1] ? "Your LinkedIn profile" : "Your phone number or handle"} <span className="opt">(optional)</span></span><input value={f.handle} onChange={set("handle")} maxLength={150} /></label>
          )}
        </fieldset>

        <input className="hp" tabIndex={-1} aria-hidden="true" autoComplete="off" name="website" value={f.hp} onChange={set("hp")} />
        {err && <p className="err" role="alert">{err}</p>}
        <button type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send message"}</button>
        <p className="note">Goes to {OWNER_EMAIL}. I only use your details to reply.</p>
      </form>
    </Box>
  );
};

export default ContactForm;
