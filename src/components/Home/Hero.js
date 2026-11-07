import React from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];
// Update when you publish a meaningful change; reviewers read recency as a signal.
const UPDATED = "November 2026";

const Section = styled.section`
  align-items: center;

  display: grid;
  gap: 4rem;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  min-height: min(calc(100vh - 12rem), 720px);
  padding: 3rem 0 5rem;
  @media (max-width: 900px) {
    gap: 2.5rem;
    grid-template-columns: 1fr;
    min-height: 0;
    padding-top: 1.5rem;
  }
`;

const Eyebrow = styled.p`
  align-items: center;
  color: var(--muted);
  display: inline-flex;
  font-size: 0.8rem;
  gap: 0.6rem;
  letter-spacing: 0.14em;
  margin: 0 0 1.5rem;
  text-transform: uppercase;
`;

const Title = styled.h1`
  color: var(--ink);
  font-family: "Space Grotesk", "Inter", sans-serif;
  font-size: clamp(3rem, 8vw, 6.5rem);
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.95;
  margin: 0;
  .ln {
    display: block;
    overflow: hidden;
    padding-bottom: 0.08em;
  }
  .accent {
    color: var(--muted);
  }
`;

const Role = styled.p`
  color: var(--ink);
  font-family: "Space Grotesk", "Inter", sans-serif;
  font-size: clamp(1.25rem, 2.4vw, 1.75rem);
  margin: 2rem 0 1.25rem;
`;

const Lede = styled.p`
  color: var(--muted);
  font-size: clamp(1.05rem, 1.5vw, 1.2rem);
  line-height: 1.65;
  margin: 0 0 0.75rem;
  max-width: 32rem;
  strong {
    color: var(--ink);
    font-weight: 600;
  }
`;

const Now = styled.p`
  color: var(--muted);
  font-size: 0.95rem;
  margin: 0 0 2.25rem;
  b {
    color: var(--ink);
    font-weight: 500;
  }
`;

const Actions = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
`;

export const Button = styled.a`
  align-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  color: var(--ink);
  display: inline-flex;
  font-weight: 600;
  gap: 0.5rem;
  padding: 0.95rem 1.5rem;
  text-decoration: none;
  transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
  &:hover,
  &:focus-visible {
    border-color: var(--accent);
    color: var(--accent);
  }
  &.primary {
    background: var(--accent);
    border-color: var(--accent);
    color: #0b0d12;
  }
  &.primary:hover,
  &.primary:focus-visible {
    background: var(--ink);
    border-color: var(--ink);
    color: #0b0d12;
  }
`;

const TextLink = styled.a`
  color: var(--muted);
  font-weight: 600;
  padding: 0.5rem 0.25rem;
  text-decoration: none;
  transition: color 0.2s ease;
  &:hover,
  &:focus-visible {
    color: var(--accent);
  }
`;

const Portrait = styled(motion.figure)`
  margin: 0 auto;
  max-width: 480px;
  position: relative;
  width: 100%;
  img {
    display: block;
    height: auto;
    -webkit-mask-image: linear-gradient(to bottom, #000 82%, transparent 100%);
    mask-image: linear-gradient(to bottom, #000 82%, transparent 100%);
    position: relative;
    width: 100%;
  }
  @media (max-width: 900px) {
    max-width: 320px;
  }
`;

const Line = ({ children, delay, className }) => (
  <span className="ln">
    <motion.span className={className} style={{ display: "block" }} initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay, ease: EASE }}>
      {children}
    </motion.span>
  </span>
);

const Hero = () => (
  <Section>
    <div className="content">
      <Eyebrow>Updated {UPDATED}</Eyebrow>
      <Title>
        <Line delay={0.1}>Bhimesh</Line>
        <Line delay={0.22} className="accent">Chauhan</Line>
      </Title>
      <Role>Lead AI platform engineer</Role>
      <Lede>
        <strong>I lead Ask Kindred</strong>, a production RAG assistant serving about 200 daily users across three customer companies. Before that: Scrubs Co-Pilot, which cut clinician documentation time by about 80%.
      </Lede>
      <Now>
        Currently <b>Lead Software Engineer at Rare Days</b>
      </Now>
      <Actions>
        <Button as={Link} to="/case-studies/" className="primary">View case studies →</Button>
        <Button href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume</Button>
        <TextLink as={Link} to="/hire/#fit">Role fit →</TextLink>
        <TextLink href="https://github.com/bhimeshchauhan" target="_blank" rel="noopener noreferrer">GitHub ↗</TextLink>
      </Actions>
    </div>
    <Portrait initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3, ease: EASE }}>
      <img src="/me-cutout.webp" alt="Portrait of Bhimesh Chauhan" width="800" height="800" fetchpriority="high" />
    </Portrait>
  </Section>
);

export default Hero;
