import React, { useState } from "react";
import styled from "styled-components";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

const Float = styled(motion.div)`
  min-width: 0;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02));
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 1.1rem;
`;

const Bar = styled.div`
  align-items: center;
  color: var(--muted);
  display: flex;
  font-size: 0.78rem;
  gap: 0.4rem;
  letter-spacing: 0.06em;
  margin-bottom: 1rem;
  i {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    height: 9px;
    width: 9px;
  }
  span {
    margin-left: auto;
  }
`;

const Cols = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const Col = styled.div`
  h3 {
    color: var(--accent);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    margin: 0 0 0.6rem;
    text-transform: uppercase;
  }
  p {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    color: var(--ink);
    font-size: 0.85rem;
    line-height: 1.45;
    margin: 0 0 0.5rem;
    overflow-wrap: anywhere;
    padding: 0.6rem 0.7rem;
  }
  p small {
    color: var(--muted);
    display: block;
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  &.note p {
    border-left: 2px solid var(--accent);
  }
`;

const Badge = styled(motion.div)`
  background: var(--accent);
  border-radius: 999px;
  color: #0b0d12;
  font-size: 0.85rem;
  font-weight: 700;
  margin-top: 0.5rem;
  padding: 0.5rem 0.9rem;
  width: max-content;
`;

const Fine = styled.p`
  color: var(--muted);
  font-size: 0.75rem;
  margin: 0.8rem 0 0;
  opacity: 0.7;
`;

const transcript = [
  ["Patient", "Three days of cough and a mild fever."],
  ["Clinician", "Any shortness of breath?"],
  ["Patient", "Only climbing stairs."]
];
const note = [
  ["Chief complaint", "Cough x3 days, mild fever"],
  ["Assessment", "Likely lower respiratory infection"],
  ["Plan", "Antibiotic course, follow-up in 1 week"]
];


// Illustrative only: plays once when scrolled into view, then stays still.
const ScrubsMock = () => {
  const reduce = useReducedMotion();
  const [seen, setSeen] = useState(false);
  const t = (d) => (reduce ? { duration: 0.01 } : { delay: d, duration: 0.5, ease: EASE });
  return (
    <Float
      initial={{ opacity: 0, y: 24 }}
      animate={seen ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE }}
      onViewportEnter={() => setSeen(true)}
      viewport={{ once: true, amount: 0.3 }}
      aria-label="Illustrative example of Scrubs Co-Pilot turning a conversation into a structured note"
    >
      <Bar>
        <i /> <i /> <i /> <span>Scrubs Co-Pilot</span>
      </Bar>
      <Cols>
        <Col>
          <h3>Live transcript</h3>
          {transcript.map(([who, line], i) => (
            <motion.p key={line} initial={{ opacity: 0, x: -12 }} animate={seen ? { opacity: 1, x: 0 } : {}} transition={t(0.3 + i * 0.5)}>
              <small>{who}</small>
              {line}
            </motion.p>
          ))}
        </Col>
        <Col className="note">
          <h3>Structured note</h3>
          {note.map(([k, v], i) => (
            <motion.p key={k} initial={{ opacity: 0, x: 12 }} animate={seen ? { opacity: 1, x: 0 } : {}} transition={t(2 + i * 0.45)}>
              <small>{k}</small>
              {v}
            </motion.p>
          ))}
        </Col>
      </Cols>
      <Badge initial={{ opacity: 0, scale: 0.9 }} animate={seen ? { opacity: 1, scale: 1 } : {}} transition={t(3.5)}>
        ~80% less documentation time
      </Badge>
      <Fine>Illustrative example. Not real patient data.</Fine>
    </Float>
  );
};

export default ScrubsMock;
