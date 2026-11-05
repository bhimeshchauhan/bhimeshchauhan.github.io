import React from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import caseStudies from "../../data/caseStudies";
import skillGroups from "../../data/skills";
import { CountUp, Magnetic, Reveal } from "../motion/primitives";
import { Button } from "./Hero";

const display = `"Space Grotesk", "Signika", sans-serif`;

/* ---------- Marquee ---------- */
const MarqueeWrap = styled.div`
  border-block: 1px solid var(--line);
  margin: 2rem -8vw 0;
  overflow: hidden;
  padding: 1.2rem 0;
  &:hover .marquee-track {
    animation-play-state: paused;
  }
`;
const Track = styled.div`
  animation: marquee 32s linear infinite;
  display: flex;
  white-space: nowrap;
  width: max-content;
  span {
    -webkit-text-stroke: 1px rgba(242, 240, 234, 0.4);
    color: transparent;
    font-family: ${display};
    font-size: clamp(2.5rem, 7vw, 5.5rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    padding-right: 2.5rem;
  }
  span:nth-child(even) {
    -webkit-text-stroke: 0;
    color: var(--accent);
  }
  @keyframes marquee {
    to {
      transform: translateX(-50%);
    }
  }
`;
const WORDS = ["AI platforms", "✦", "RAG", "✦", "LLM systems", "✦", "Distributed systems", "✦", "Healthcare AI", "✦", "Payments", "✦", "IoT", "✦"];
export const MarqueeBand = () => (
  <MarqueeWrap aria-hidden="true">
    <Track className="marquee-track">
      {[...WORDS, ...WORDS].map((w, i) => (
        <span key={i}>{w}</span>
      ))}
    </Track>
  </MarqueeWrap>
);

/* ---------- Stats ---------- */
const StatsGrid = styled.ul`
  display: grid;
  gap: 1px;
  grid-template-columns: repeat(4, 1fr);
  list-style: none;
  margin: 4rem 0 0;
  padding: 0;
  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
  }
  li {
    border-left: 1px solid var(--line);
    margin: 0;
    padding: 0.5rem 1.5rem 0.5rem 1.25rem;
  }
  strong {
    color: var(--ink);
    display: block;
    font-family: ${display};
    font-size: clamp(2.6rem, 6vw, 4.8rem);
    letter-spacing: -0.04em;
    line-height: 1;
  }
  span {
    color: var(--muted);
    display: block;
    margin-top: 0.6rem;
  }
`;
const STATS = [
  { to: 10, suffix: "+", label: "years shipping production software" },
  { to: 80, prefix: "~", suffix: "%", label: "less clinician documentation time" },
  { to: 100, suffix: "K+", label: "biomedical artifacts structured" },
  { to: 80, suffix: "K+", label: "learners served" }
];
export const Stats = () => (
  <StatsGrid aria-label="Highlights">
    {STATS.map((s, i) => (
      <Reveal as="li" key={s.label} delay={i * 0.08}>
        <strong>
          <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} />
        </strong>
        <span>{s.label}</span>
      </Reveal>
    ))}
  </StatsGrid>
);

/* ---------- Section heading ---------- */
const Head = styled.div`
  align-items: end;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  margin: 7rem 0 2rem;
  h2 {
    font-family: ${display};
    font-size: clamp(2.2rem, 6vw, 4.5rem);
    color: var(--ink);
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 1;
    margin: 0;
  }
  p {
    color: var(--muted);
    margin: 0;
    max-width: 24rem;
  }
`;
const SectionHead = ({ title, note }) => (
  <Reveal>
    <Head>
      <h2>{title}</h2>
      <p>{note}</p>
    </Head>
  </Reveal>
);

/* ---------- Selected work ---------- */
const Grid = styled.div`
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;
const Card = styled(Link)`
  --mx: 50%;
  --my: 50%;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 24px;
  color: var(--ink);
  display: flex;
  flex-direction: column;
  min-height: 330px;
  overflow: hidden;
  padding: 1.75rem;
  position: relative;
  text-decoration: none;
  transition: border-color 0.3s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  &::before {
    background: radial-gradient(420px circle at var(--mx) var(--my), rgba(255, 180, 84, 0.16), transparent 60%);
    content: "";
    inset: 0;
    opacity: 0;
    position: absolute;
    transition: opacity 0.3s ease;
  }
  &:hover,
  &:focus-visible {
    border-color: rgba(255, 180, 84, 0.55);
    transform: translateY(-6px);
  }
  &:hover::before {
    opacity: 1;
  }
  > * {
    position: relative;
  }
  .num {
    color: var(--muted);
    font-family: ${display};
    font-size: 0.9rem;
    letter-spacing: 0.1em;
  }
  h3 {
    font-family: ${display};
    font-size: clamp(1.8rem, 3.4vw, 2.6rem);
    letter-spacing: -0.03em;
    line-height: 1.05;
    margin: 0.8rem 0 0.6rem;
  }
  .result {
    color: var(--accent);
    font-weight: 600;
    margin: 0 0 0.8rem;
  }
  .sum {
    color: var(--muted);
    line-height: 1.55;
    margin: 0 0 1.2rem;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    list-style: none;
    margin: auto 0 0;
    padding: 0;
  }
  .tags li {
    border: 1px solid var(--line);
    border-radius: 999px;
    font-size: 0.8rem;
    margin: 0;
    padding: 0.3rem 0.65rem;
  }
  .arrow {
    font-size: 1.6rem;
    position: absolute;
    right: 1.5rem;
    top: 1.3rem;
    transition: transform 0.3s ease;
  }
  &:hover .arrow {
    transform: translate(4px, -4px);
  }
`;
const track = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};
export const Work = () => (
  <section>
    <SectionHead title="Selected work" note="Four systems, what I owned, and what changed." />
    <Grid>
      {caseStudies.map((s, i) => (
        <Reveal key={s.slug} delay={(i % 2) * 0.1}>
          <Card to={`/case-studies/${s.slug}/`} onMouseMove={track} style={{ height: "100%" }}>
            <span className="num">0{i + 1}</span>
            <span className="arrow" aria-hidden="true">↗</span>
            <h3>{s.title}</h3>
            <p className="result">{s.keyResult}</p>
            <p className="sum">{s.summary}</p>
            <ul className="tags" aria-label={`${s.title} technologies`}>
              {s.technologies.slice(0, 4).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Card>
        </Reveal>
      ))}
    </Grid>
  </section>
);

/* ---------- Explore list ---------- */
const List = styled.ul`
  border-top: 1px solid var(--line);
  list-style: none;
  margin: 0;
  padding: 0;
  li {
    border-bottom: 1px solid var(--line);
    margin: 0;
  }
  a {
    align-items: center;
    color: var(--ink);
    display: flex;
    font-family: ${display};
    font-size: clamp(1.8rem, 5vw, 3.4rem);
    font-weight: 700;
    gap: 1rem;
    justify-content: space-between;
    letter-spacing: -0.03em;
    padding: 1.4rem 0;
    text-decoration: none;
    transition: color 0.3s ease, padding 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }
  a small {
    color: var(--muted);
    font-family: "Signika", sans-serif;
    font-size: 1rem;
    font-weight: 400;
    letter-spacing: 0;
    max-width: 22rem;
    text-align: right;
  }
  a:hover,
  a:focus-visible {
    color: var(--accent);
    padding-left: 1.2rem;
  }
  @media (max-width: 700px) {
    a small {
      display: none;
    }
  }
`;
const LINKS = [
  ["Experience", "/experience/", "A decade across startups and scale-ups"],
  ["Projects", "/projects/", "Products I have architected and shipped"],
  ["Skills", "/skills/", "The stack I build and operate with"],
  ["Writing", "/blog/", "Notes on engineering and building"],
  ["Recommendations", "/recommendation/", "What colleagues say"]
];
export const Explore = () => (
  <section>
    <SectionHead title="Explore" note="Go deeper on the work, the stack and the people." />
    <List>
      {LINKS.map(([t, to, note], i) => (
        <Reveal as="li" key={t} delay={i * 0.05} y={16}>
          <Link to={to}>
            {t}
            <small>{note}</small>
            <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      ))}
    </List>
  </section>
);

/* ---------- Closing CTA ---------- */
const Cta = styled.section`
  margin: 8rem 0 2rem;
  text-align: center;
  h2 {
    font-family: ${display};
    font-size: clamp(2.6rem, 8vw, 6.5rem);
    color: var(--ink);
    font-weight: 700;
    letter-spacing: -0.045em;
    line-height: 0.98;
    margin: 0 0 1rem;
  }
  h2 em {
    -webkit-text-stroke: 2px var(--accent);
    color: transparent;
    font-style: normal;
  }
  p {
    color: var(--muted);
    font-size: 1.15rem;
    margin: 0 auto 2rem;
    max-width: 32rem;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.9rem;
    justify-content: center;
  }
`;
export const Contact = () => (
  <Cta>
    <Reveal>
      <h2>
        Let's build something <em>reliable.</em>
      </h2>
      <p>Got an AI platform, a RAG system, or something hard to ship? I would like to hear about it.</p>
      <div className="row">
        <Magnetic>
          <Button className="primary" href="mailto:bhimeshchauhan@gmail.com">bhimeshchauhan@gmail.com</Button>
        </Magnetic>
        <Magnetic>
          <Button href="https://www.linkedin.com/in/bhimeshchauhan" target="_blank" rel="noopener noreferrer">LinkedIn</Button>
        </Magnetic>
        <Magnetic>
          <Button href="https://github.com/bhimeshchauhan" target="_blank" rel="noopener noreferrer">GitHub</Button>
        </Magnetic>
      </div>
    </Reveal>
  </Cta>
);

/* ---------- Stack (logos from the Skills data) ---------- */
const StackGrid = styled.ul`
  display: grid;
  gap: 0.9rem;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  list-style: none;
  margin: 0;
  padding: 0;
  li { margin: 0; }
  a {
    align-items: center;
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 16px;
    color: var(--ink);
    display: flex;
    gap: 0.8rem;
    padding: 0.9rem 1rem;
    text-decoration: none;
    transition: border-color 0.3s ease, transform 0.3s ease;
  }
  a:hover, a:focus-visible { border-color: rgba(255, 180, 84, 0.55); transform: translateY(-3px); }
  img { height: 28px; object-fit: contain; width: 28px; }
  span { font-size: 0.95rem; font-weight: 500; }
`;
const STACK = (() => {
  const seen = new Set();
  const out = [];
  skillGroups.forEach((g) =>
    g.skills.forEach((s) => {
      if (s.icon && s.icon.includes("simpleicons") && !seen.has(s.icon)) {
        seen.add(s.icon);
        out.push(s);
      }
    })
  );
  return out.slice(0, 16);
})();
export const Stack = () => (
  <section>
    <SectionHead title="Stack" note="What I build and operate with, in production." />
    <StackGrid>
      {STACK.map((s, i) => (
        <Reveal as="li" key={s.title} delay={(i % 4) * 0.05} y={14}>
          <Link to="/skills/">
            <img src={s.icon} alt="" loading="lazy" width="28" height="28" />
            <span>{s.title}</span>
          </Link>
        </Reveal>
      ))}
    </StackGrid>
  </section>
);

/* ---------- About: animated portrait ---------- */
const AboutGrid = styled.section`
  align-items: center;
  display: grid;
  gap: 3rem;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  margin-top: 7rem;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
  h2 {
    color: var(--ink);
    font-family: ${display};
    font-size: clamp(2.2rem, 6vw, 4.5rem);
    letter-spacing: -0.04em;
    line-height: 1;
    margin: 0 0 1rem;
  }
  p { color: var(--muted); font-size: 1.1rem; line-height: 1.65; margin: 0 0 1rem; max-width: 36rem; }
  p strong { color: var(--ink); }
  ul { display: grid; gap: 0.6rem; list-style: none; margin: 1.5rem 0 0; padding: 0; }
  li { border-left: 2px solid var(--accent); color: var(--ink); margin: 0; padding-left: 0.9rem; }
  li small { color: var(--muted); display: block; font-size: 0.85rem; }
`;
const Stage = styled.div`
  perspective: 900px;
  margin: 0 auto;
  max-width: 380px;
  width: 100%;
`;
const Tilt = styled(motion.div)`
  aspect-ratio: 4 / 5;
  position: relative;
  transform-style: preserve-3d;
  width: 100%;
  .glow {
    background: radial-gradient(closest-side, rgba(255, 180, 84, 0.35), rgba(124, 58, 237, 0.18) 60%, transparent 75%);
    filter: blur(30px);
    inset: -12% -18% -4%;
    position: absolute;
    transform: translateZ(-40px);
  }
  .frame {
    inset: 0;
    overflow: hidden;
    position: absolute;
    border-radius: 28px 28px 0 0;
    -webkit-mask-image: linear-gradient(to bottom, #000 62%, transparent 100%);
    mask-image: linear-gradient(to bottom, #000 62%, transparent 100%);
  }
  .frame img {
    filter: saturate(0.9) contrast(1.06);
    height: 100%;
    object-fit: cover;
    object-position: 50% 20%;
    transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), filter 0.5s ease;
    width: 100%;
  }
  .frame::after {
    background: linear-gradient(200deg, rgba(255, 180, 84, 0.28), transparent 45%),
      linear-gradient(20deg, rgba(59, 75, 216, 0.38), transparent 55%);
    content: "";
    inset: 0;
    mix-blend-mode: soft-light;
    position: absolute;
  }
  .frame::before {
    background: linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.22) 50%, transparent 60%);
    content: "";
    inset: 0;
    position: absolute;
    transform: translateX(-120%);
    transition: transform 0.9s ease;
    z-index: 2;
  }
  &:hover .frame::before { transform: translateX(120%); }
  &:hover .frame img { filter: saturate(1) contrast(1.08); transform: scale(1.05); }
  .mono {
    align-items: center;
    color: var(--accent);
    display: flex;
    font-family: ${display};
    font-size: 5rem;
    font-weight: 700;
    height: 100%;
    justify-content: center;
    width: 100%;
  }
  .chip {
    background: rgba(10, 12, 18, 0.72);
    backdrop-filter: blur(10px);
    border: 1px solid var(--line);
    border-radius: 999px;
    color: var(--ink);
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.4rem 0.8rem;
    position: absolute;
    transform: translateZ(60px);
    white-space: nowrap;
  }
  .chip::before {
    background: var(--accent);
    border-radius: 50%;
    content: "";
    display: inline-block;
    height: 6px;
    margin-right: 0.5rem;
    width: 6px;
  }
`;
const CHIPS = [
  { t: "RAG", s: { top: "6%", left: "-12%" }, d: 0 },
  { t: "LLM systems", s: { top: "38%", right: "-16%" }, d: 0.8 },
  { t: "Distributed", s: { bottom: "10%", left: "-10%" }, d: 1.6 }
];
const Portrait = () => {
  const [failed, setFailed] = React.useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 140, damping: 16 });
  const sy = useSpring(my, { stiffness: 140, damping: 16 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [12, -12]);
  return (
    <Stage
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <Reveal y={40}>
        <Tilt style={{ rotateX, rotateY }}>
          <div className="glow" aria-hidden="true" />
          <motion.div
            className="frame"
            initial={{ clipPath: "inset(100% 0 0 0)", scale: 1.08 }}
            whileInView={{ clipPath: "inset(0% 0 0 0)", scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {failed ? (
              <div className="mono" aria-hidden="true">BC</div>
            ) : (
              <img src="/me.jpg" alt="Portrait of Bhimesh Chauhan" width="380" height="475" loading="lazy" onError={() => setFailed(true)} />
            )}
          </motion.div>
          {CHIPS.map(({ t, s, d }) => (
            <motion.span
              key={t}
              className="chip"
              style={s}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: d }}
            >
              {t}
            </motion.span>
          ))}
        </Tilt>
      </Reveal>
    </Stage>
  );
};
export const About = () => (
  <AboutGrid>
    <Portrait />
    <Reveal delay={0.1}>
      <h2>Hello, I'm Bhimesh.</h2>
      <p>
        <strong>Lead software engineer and founder.</strong> I have spent over a decade building production software, and lately that means AI platforms: RAG pipelines, LLM workflows and the distributed systems that keep them reliable.
      </p>
      <p>I like owning a system from retrieval architecture to release process, and mentoring the engineers around it.</p>
      <ul>
        <li>
          Iowa State University
          <small>B.S. Electrical Engineering, minor in Entrepreneurial Studies</small>
        </li>
        <li>
          Currently
          <small>Lead Software Engineer at Rare Days</small>
        </li>
      </ul>
    </Reveal>
  </AboutGrid>
);
