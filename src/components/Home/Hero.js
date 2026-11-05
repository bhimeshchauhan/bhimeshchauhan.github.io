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
  &::before {
    background: var(--accent);
    border-radius: 50%;
    content: "";
    height: 7px;
    width: 7px;
  }
`;

const Title = styled.h1`
  color: var(--ink);
  font-family: "Space Grotesk", "Signika", sans-serif;
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
    -webkit-text-stroke: 2px var(--accent);
    color: transparent;
  }
`;

const Role = styled.p`
  color: var(--ink);
  font-family: "Space Grotesk", "Signika", sans-serif;
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
  max-width: 380px;
  position: relative;
  width: 100%;
  &::before {
    background: radial-gradient(closest-side, rgba(255, 180, 84, 0.28), rgba(124, 58, 237, 0.14) 60%, transparent 75%);
    content: "";
    filter: blur(28px);
    inset: -10% -14% -2%;
    position: absolute;
  }
  img {
    aspect-ratio: 4 / 5;
    border-radius: 28px 28px 0 0;
    display: block;
    height: auto;
    -webkit-mask-image: linear-gradient(to bottom, #000 66%, transparent 100%);
    mask-image: linear-gradient(to bottom, #000 66%, transparent 100%);
    object-fit: cover;
    object-position: 50% 20%;
    position: relative;
    width: 100%;
  }
  @media (max-width: 900px) {
    max-width: 280px;
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
        <strong>I built Scrubs Co-Pilot</strong>, ambient clinical AI that cut clinician documentation time by about 80%.
      </Lede>
      <Now>
        Currently <b>Lead Software Engineer at Rare Days</b>
      </Now>
      <Actions>
        <Button as={Link} to="/case-studies/" className="primary">View case studies →</Button>
        <Button href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume</Button>
        <TextLink href="https://github.com/bhimeshchauhan" target="_blank" rel="noopener noreferrer">GitHub ↗</TextLink>
      </Actions>
    </div>
    <Portrait initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3, ease: EASE }}>
      <img src="/me.jpg" alt="Portrait of Bhimesh Chauhan" width="380" height="475" fetchpriority="high" />
    </Portrait>
  </Section>
);

export default Hero;
