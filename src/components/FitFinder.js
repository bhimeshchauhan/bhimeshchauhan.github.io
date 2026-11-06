import React, { useEffect } from "react";
import styled from "styled-components";
import FitInput from "./chat/FitInput";
import { useAssistantOnline } from "../utils/assistant";

const Wrap = styled.section`
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 28px;
  margin: 3.5rem 0;
  padding: clamp(1.25rem, 4vw, 2.25rem);
  scroll-margin-top: 6rem;
  .eyebrow { color: var(--accent); font-size: 0.78rem; font-weight: 700; letter-spacing: 0.14em; margin: 0 0 0.6rem; text-transform: uppercase; }
  h2 { color: var(--ink); font-family: "Space Grotesk", "Inter", sans-serif; font-size: clamp(1.5rem, 3.4vw, 2.2rem); letter-spacing: -0.03em; line-height: 1.1; margin: 0 0 0.6rem; }
  .lede { color: var(--muted); line-height: 1.55; margin: 0 0 1.2rem; max-width: 42rem; }
`;

// Sends the job description to the chat assistant, which opens and continues the conversation.
// Hidden while the assistant backend is offline, since the chat is what answers.
const FitFinder = ({ id = "fit" }) => {
  const online = useAssistantOnline();
  // The section only exists once the assistant is confirmed online, so a #fit link has nothing to scroll to at first.
  useEffect(() => {
    if (online && window.location.hash === `#${id}`) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView();
    }
  }, [online, id]);
  if (!online) return null;
  return (
    <Wrap id={id} aria-labelledby={`${id}-title`}>
      <p className="eyebrow">For recruiters and hiring managers</p>
      <h2 id={`${id}-title`}>Is working with Bhimesh right for your role?</h2>
      <p className="lede">Paste a job description or upload one. The assistant opens and shows how he fits, and you can keep asking questions about the role right there in the chat.</p>
      <FitInput onSubmit={(text) => window.dispatchEvent(new CustomEvent("assistant-fit", { detail: { text } }))} cta="See how he fits" />
    </Wrap>
  );
};

export default FitFinder;
