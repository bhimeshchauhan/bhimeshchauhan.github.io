import React, { useState } from "react";
import styled from "styled-components";
import { OWNER_EMAIL, mailtoLink, sendMessageToOwner, whatsappLink } from "../../utils/connect";

const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  color: #f2f0ea;
  font-family: "Inter", sans-serif;
  max-width: 100%;
  padding: 0.95rem;
  p { margin: 0 0 0.7rem; font-size: 0.92rem; line-height: 1.45; color: #d9d7d0; }
  .actions { display: flex; flex-wrap: wrap; gap: 0.45rem; }
  .btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 999px;
    color: #f2f0ea;
    cursor: pointer;
    font: 600 0.82rem "Inter", sans-serif;
    padding: 0.45rem 0.8rem;
    text-decoration: none;
    transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }
  .btn:hover, .btn:focus-visible { background: #ffb454; border-color: #ffb454; color: #0b0d12; }
  .btn.primary { background: #ffb454; border-color: #ffb454; color: #0b0d12; }
  form { display: grid; gap: 0.5rem; margin-top: 0.8rem; }
  input, textarea {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 10px;
    color: #f2f0ea;
    font: 0.9rem "Inter", sans-serif;
    padding: 0.55rem 0.7rem;
    width: 100%;
    box-sizing: border-box;
  }
  input:focus, textarea:focus { border-color: #ffb454; outline: none; }
  textarea { min-height: 70px; resize: vertical; }
  .hp { position: absolute; left: -9999px; height: 0; width: 0; opacity: 0; }
  .note { color: #a3a8b8; font-size: 0.75rem; margin: 0; }
  .err { color: #ff9a8a; font-size: 0.8rem; margin: 0; }
  .ok { color: #9ee6a8; margin: 0; }
`;

const ConnectCard = () => {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState("idle"); // idle | sending | sent
  const [error, setError] = useState("");
  const [f, setF] = useState({ name: "", email: "", message: "", hp: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setState("sending");
    const r = await sendMessageToOwner({ name: f.name, email: f.email, message: f.message, honeypot: f.hp });
    if (r.ok) setState("sent");
    else {
      setError(r.error);
      setState("idle");
    }
  };

  if (state === "sent") {
    return (
      <Card>
        <p className="ok">Sent. Bhimesh will get your message by email and can reply to {f.email}.</p>
      </Card>
    );
  }

  return (
    <Card>
      <p>I can pass a message to Bhimesh, or you can reach him directly.</p>
      <div className="actions">
        <button type="button" className="btn primary" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          Send a message
        </button>
        <a className="btn" href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a className="btn" href={mailtoLink()}>Email</a>
      </div>
      {open && (
        <form onSubmit={submit} noValidate>
          <input aria-label="Your name" placeholder="Your name" value={f.name} onChange={set("name")} maxLength={100} autoComplete="name" />
          <input aria-label="Your email" placeholder="Your email" type="email" value={f.email} onChange={set("email")} maxLength={200} autoComplete="email" />
          <textarea aria-label="Your message" placeholder="What would you like to say?" value={f.message} onChange={set("message")} maxLength={2000} />
          <input className="hp" tabIndex={-1} aria-hidden="true" autoComplete="off" name="company" value={f.hp} onChange={set("hp")} />
          {error && <p className="err" role="alert">{error}</p>}
          <button type="submit" className="btn primary" disabled={state === "sending"}>
            {state === "sending" ? "Sending..." : "Send to Bhimesh"}
          </button>
          <p className="note">Delivered to {OWNER_EMAIL} by email. Your details are used only to reply.</p>
        </form>
      )}
    </Card>
  );
};

export default ConnectCard;
