import React, { useEffect, useRef, useState } from "react";
import { Link } from "gatsby";
import styled, { keyframes } from "styled-components";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform
} from "framer-motion";
import { Magnetic } from "../motion/primitives";

const ROLES = [
  "Lead AI platform engineer",
  "Founder, Scrubs Co-Pilot",
  "RAG and LLM systems",
  "Distributed full-stack"
];
const EASE = [0.22, 1, 0.36, 1];

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255,180,84,.6); }
  70% { box-shadow: 0 0 0 10px rgba(255,180,84,0); }
  100% { box-shadow: 0 0 0 0 rgba(255,180,84,0); }
`;

const Section = styled.section`
  align-items: center;
  display: grid;
  gap: 3rem;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  min-height: min(calc(100vh - 12rem), 760px);
  padding: 2rem 0 4rem;
  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    min-height: 0;
  }
`;

const Eyebrow = styled.p`
  align-items: center;
  color: var(--muted);
  display: inline-flex;
  font-size: 0.85rem;
  gap: 0.6rem;
  letter-spacing: 0.14em;
  margin: 0 0 1.25rem;
  text-transform: uppercase;
  &::before {
    animation: ${pulse} 2.2s infinite;
    background: var(--accent);
    border-radius: 50%;
    content: "";
    height: 8px;
    width: 8px;
  }
`;

const Title = styled.h1`
  font-family: "Space Grotesk", "Signika", sans-serif;
  font-size: clamp(3.4rem, 10.5vw, 9rem);
  color: var(--ink);
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  margin: 0;
  .ln {
    display: block;
    overflow: hidden;
    padding-bottom: 0.08em;
  }
  .accent {
    -webkit-text-stroke: 2px var(--accent);
    color: transparent;
  }
`;

const RoleLine = styled.div`
  color: var(--ink);
  font-family: "Space Grotesk", "Signika", sans-serif;
  font-size: clamp(1.25rem, 2.6vw, 2rem);
  height: 2.6rem;
  margin: 1.75rem 0 1rem;
  overflow: hidden;
  span {
    display: block;
  }
  b {
    color: var(--accent);
    font-weight: 500;
  }
`;

const Lede = styled.p`
  color: var(--muted);
  font-size: clamp(1.05rem, 1.6vw, 1.25rem);
  line-height: 1.6;
  margin: 0 0 2rem;
  max-width: 34rem;
  strong {
    color: var(--ink);
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
`;

export const Button = styled.a`
  align-items: center;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--ink);
  display: inline-flex;
  font-weight: 600;
  gap: 0.5rem;
  overflow: hidden;
  padding: 0.95rem 1.6rem;
  position: relative;
  text-decoration: none;
  transition: color 0.3s ease, border-color 0.3s ease;
  z-index: 0;
  &::before {
    background: var(--accent);
    border-radius: inherit;
    content: "";
    inset: 0;
    position: absolute;
    transform: translateY(101%);
    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    z-index: -1;
  }
  &:hover,
  &:focus-visible {
    border-color: var(--accent);
    color: #0b0d12;
  }
  &:hover::before,
  &:focus-visible::before {
    transform: translateY(0);
  }
  &.primary {
    background: var(--accent);
    border-color: var(--accent);
    color: #0b0d12;
  }
  &.primary::before {
    background: var(--ink);
  }
`;

const Visual = styled.div`
  position: relative;
  .desk {
    display: block;
    margin: 0 auto;
    max-width: min(520px, 88%);
    height: auto;
  }
  @media (min-width: 961px) {
    .card {
      margin: 0.5rem 0 0 auto;
      width: 100%;
    }
  }
`;

const Float = styled(motion.div)`
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.025));
  backdrop-filter: blur(14px);
  border: 1px solid var(--line);
  border-radius: 22px;
  box-shadow: 0 40px 90px rgba(0, 0, 0, 0.5);
  padding: 1.25rem;
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
  grid-template-columns: 1fr 1fr;
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const Col = styled.div`
  h3 {
    color: var(--accent);
    font-size: 0.72rem;
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
    padding: 0.6rem 0.7rem;
  }
  p small {
    color: var(--muted);
    display: block;
    font-size: 0.68rem;
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
  font-size: 0.7rem;
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

const MockCopilot = () => {
  const reduce = useReducedMotion();
  return (
    <Float
      className="card"
      initial={{ opacity: 0, y: 40, rotate: 1.5 }}
      animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -10, 0], rotate: 0 }}
      transition={
        reduce
          ? { duration: 0.01 }
          : { opacity: { duration: 0.8, delay: 0.5 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }, rotate: { duration: 0.8, delay: 0.5 } }
      }
      aria-label="Illustrative example of Scrubs Co-Pilot turning a conversation into a structured note"
    >
      <Bar>
        <i /> <i /> <i /> <span>Scrubs Co-Pilot</span>
      </Bar>
      <Cols>
        <Col>
          <h3>Live transcript</h3>
          {transcript.map(([who, line], i) => (
            <motion.p key={line} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 + i * 0.55, duration: 0.5, ease: EASE }}>
              <small>{who}</small>
              {line}
            </motion.p>
          ))}
        </Col>
        <Col className="note">
          <h3>Structured note</h3>
          {note.map(([k, v], i) => (
            <motion.p key={k} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.8 + i * 0.5, duration: 0.5, ease: EASE }}>
              <small>{k}</small>
              {v}
            </motion.p>
          ))}
        </Col>
      </Cols>
      <Badge initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 4.4, type: "spring", stiffness: 260, damping: 18 }}>
        ~80% less documentation time
      </Badge>
      <Fine>Illustrative example. Not real patient data.</Fine>
    </Float>
  );
};

const RoleCycler = () => {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return undefined;
    const t = setInterval(() => setI((n) => (n + 1) % ROLES.length), 2800);
    return () => clearInterval(t);
  }, [reduce]);
  return (
    <RoleLine aria-live="off">
      <AnimatePresence mode="wait">
        <motion.span key={i} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.45, ease: EASE }}>
          <b>/</b> {ROLES[i]}
        </motion.span>
      </AnimatePresence>
    </RoleLine>
  );
};

const Line = ({ children, delay, className }) => (
  <span className="ln">
    <motion.span className={className} style={{ display: "block" }} initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay, ease: EASE }}>
      {children}
    </motion.span>
  </span>
);

const Hero = () => {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -60]);
  const opacity = useTransform(scrollY, [0, 450], [1, 0.25]);
  return (
    <Section ref={ref}>
      <motion.div style={{ y, opacity }}>
        <Eyebrow>Portfolio / 2026</Eyebrow>
        <Title>
          <Line delay={0.1}>Bhimesh</Line>
          <Line delay={0.22} className="accent">Chauhan</Line>
          <span className="sr-only">, Lead AI Platform Engineer</span>
        </Title>
        <RoleCycler />
        <Lede>
          <strong>I built Scrubs Co-Pilot</strong>, ambient clinical AI that cut clinician documentation time by about 80%, and I ship RAG, LLM, payments and IoT platforms end to end with hands-on technical leadership.
        </Lede>
        <Actions>
          <Magnetic>
            <Button as={Link} to="/case-studies/" className="primary">View case studies →</Button>
          </Magnetic>
          <Magnetic>
            <Button href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume</Button>
          </Magnetic>
          <Magnetic>
            <Button href="mailto:bhimeshchauhan@gmail.com">Email me</Button>
          </Magnetic>
        </Actions>
      </motion.div>
      <Visual>
        <motion.img
          className="desk"
          src="/coding.webp"
          alt="Illustration of a developer working at a desk"
          width="800"
          height="600"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        />
        <MockCopilot />
      </Visual>
    </Section>
  );
};

export default Hero;
