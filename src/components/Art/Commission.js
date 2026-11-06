import React, { useState } from "react";
import styled from "styled-components";
import { GETFORM_URL, OWNER_EMAIL } from "../../utils/connect";

const Box = styled.section`
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 28px;
  margin: 4rem auto 2rem;
  max-width: 760px;
  padding: clamp(1.5rem, 4vw, 2.5rem);
  scroll-margin-top: 6rem;
  h2 { color: var(--ink); font-family: "Space Grotesk", sans-serif; font-size: clamp(1.8rem, 4vw, 2.6rem); letter-spacing: -0.03em; margin: 0 0 0.5rem; }
  .lede { color: var(--muted); line-height: 1.6; margin: 0 0 1.5rem; }
  form { display: grid; gap: 1rem; }
  .two { display: grid; gap: 1rem; grid-template-columns: 1fr 1fr; }
  @media (max-width: 600px) { .two { grid-template-columns: 1fr; } }
  label { color: var(--muted); display: grid; font-size: 0.82rem; gap: 0.35rem; letter-spacing: 0.06em; text-transform: uppercase; }
  input, select, textarea { background: rgba(0,0,0,0.3); border: 1px solid var(--line); border-radius: 12px; color: var(--ink); font: 1rem "Inter", sans-serif; letter-spacing: 0; padding: 0.7rem 0.85rem; text-transform: none; width: 100%; box-sizing: border-box; }
  input:focus, select:focus, textarea:focus { border-color: var(--accent); outline: none; }
  textarea { min-height: 120px; resize: vertical; }
  .hp { height: 0; left: -9999px; opacity: 0; position: absolute; width: 0; }
  button[type=submit] { background: var(--accent); border: 0; border-radius: 999px; color: #0b0d12; cursor: pointer; font: 700 1rem "Inter", sans-serif; padding: 0.9rem 1.5rem; }
  button[disabled] { opacity: 0.5; cursor: default; }
  .err { color: #ff9a8a; margin: 0; }
  .ok { color: #9ee6a8; font-size: 1.05rem; margin: 0; }
  .note { color: var(--muted); font-size: 0.85rem; margin: 0; }
`;

const TYPES = ["Illustration", "Portrait", "Logo or brand design", "Poster or print", "UI or web design", "Something else"];
const COOLDOWN = 60 * 1000;

const Commission = ({ reference }) => {
  const [f, setF] = useState({ name: "", email: "", type: TYPES[0], budget: "", deadline: "", details: "", hp: "" });
  const [state, setState] = useState("idle");
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    const name = f.name.trim().slice(0, 100), email = f.email.trim().slice(0, 200), details = f.details.trim().slice(0, 3000);
    if (!name || !details) return setErr("Please add your name and what you have in mind.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErr("Please enter a valid email so I can reply.");
    if (f.hp) return setState("sent");
    try {
      if (Date.now() - Number(sessionStorage.getItem("commission-last") || 0) < COOLDOWN) return setErr("Request already sent. Please wait a minute before sending another.");
    } catch (x) {}
    setState("sending");
    const body = new FormData();
    body.append("name", name);
    body.append("email", email);
    body.append("message", [
      "[ART COMMISSION REQUEST]",
      `Type: ${f.type}`,
      `Budget: ${f.budget.trim().slice(0, 100) || "not given"}`,
      `Deadline: ${f.deadline.trim().slice(0, 100) || "not given"}`,
      reference ? `Inspired by: ${reference.link}` : "",
      "",
      details,
    ].filter(Boolean).join("\n"));
    try {
      const r = await fetch(GETFORM_URL, { method: "POST", body, headers: { Accept: "application/json" } });
      if (!r.ok) throw new Error(String(r.status));
      try { sessionStorage.setItem("commission-last", String(Date.now())); } catch (x) {}
      setState("sent");
    } catch (x) {
      setState("idle");
      setErr(`Could not send right now. Please email ${OWNER_EMAIL} directly.`);
    }
  };

  return (
    <Box id="commission">
      <h2>Commission a piece</h2>
      <p className="lede">Illustration, portraits, brand and web design. Tell me what you have in mind and I will reply by email with ideas, timing and a quote.</p>
      {state === "sent" ? (
        <p className="ok">Sent. I will get back to you at {f.email}.</p>
      ) : (
        <form onSubmit={submit} noValidate>
          {reference && <p className="note">Inspired by <a href={reference.link} target="_blank" rel="noopener noreferrer">this piece</a>.</p>}
          <div className="two">
            <label>Your name<input value={f.name} onChange={set("name")} maxLength={100} autoComplete="name" /></label>
            <label>Your email<input type="email" value={f.email} onChange={set("email")} maxLength={200} autoComplete="email" /></label>
          </div>
          <div className="two">
            <label>What kind of work<select value={f.type} onChange={set("type")}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
            <label>Budget (optional)<input value={f.budget} onChange={set("budget")} maxLength={100} placeholder="e.g. CAD 300 to 500" /></label>
          </div>
          <label>Deadline (optional)<input value={f.deadline} onChange={set("deadline")} maxLength={100} placeholder="e.g. end of December" /></label>
          <label>What do you have in mind?<textarea value={f.details} onChange={set("details")} maxLength={3000} /></label>
          <input className="hp" tabIndex={-1} aria-hidden="true" autoComplete="off" name="company" value={f.hp} onChange={set("hp")} />
          {err && <p className="err" role="alert">{err}</p>}
          <button type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send request"}</button>
          <p className="note">Goes to {OWNER_EMAIL}. I only use your details to reply.</p>
        </form>
      )}
    </Box>
  );
};

export default Commission;
