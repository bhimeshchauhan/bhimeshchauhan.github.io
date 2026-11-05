import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { askAssistant, useAssistantOnline } from "../../utils/assistant";

const Wrap = styled(motion.div)`
  margin-top: 1.75rem;
  max-width: 34rem;
  form {
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--line);
    border-radius: 999px;
    display: flex;
    gap: 0.5rem;
    padding: 0.35rem 0.35rem 0.35rem 1.2rem;
    transition: border-color 0.25s ease;
  }
  form:focus-within {
    border-color: var(--accent);
  }
  input {
    background: transparent;
    border: 0;
    color: var(--ink);
    flex: 1;
    font-size: 1rem;
    min-width: 0;
    outline: none;
  }
  input::placeholder {
    color: var(--muted);
  }
  button.go {
    background: var(--accent);
    border: 0;
    border-radius: 999px;
    color: #0b0d12;
    cursor: pointer;
    font-weight: 700;
    padding: 0.7rem 1.2rem;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.8rem;
  }
  .chips button {
    background: transparent;
    border: 1px solid var(--line);
    border-radius: 999px;
    color: var(--muted);
    cursor: pointer;
    font-size: 0.85rem;
    padding: 0.35rem 0.8rem;
    transition: color 0.2s ease, border-color 0.2s ease;
  }
  .chips button:hover {
    border-color: var(--accent);
    color: var(--ink);
  }
`;

const SUGGESTIONS = [
  "What did you build at Scrubs Co-Pilot?",
  "Have you led engineering teams?",
  "What's your experience with RAG?"
];

// Only renders when the assistant backend is reachable.
const Ask = () => {
  const online = useAssistantOnline();
  const [q, setQ] = useState("");
  if (!online) return null;
  const send = (text) => {
    if (text.trim()) askAssistant(text.trim());
    setQ("");
  };
  return (
    <Wrap initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1 }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(q);
        }}
      >
        <input
          aria-label="Ask my portfolio assistant a question"
          placeholder="Ask my portfolio anything…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          maxLength={300}
        />
        <button className="go" type="submit">Ask</button>
      </form>
      <div className="chips">
        {SUGGESTIONS.map((s) => (
          <button key={s} type="button" onClick={() => send(s)}>{s}</button>
        ))}
      </div>
    </Wrap>
  );
};

export default Ask;
