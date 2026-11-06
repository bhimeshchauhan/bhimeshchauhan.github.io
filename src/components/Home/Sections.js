import React from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import caseStudies from "../../data/caseStudies";
import recommendations from "../../data/Recommendation";
import { Reveal } from "../motion/primitives";
import { Button } from "./Hero";
import ScrubsMock from "./ScrubsMock";

const display = `"Space Grotesk", "Inter", sans-serif`;

/* ---------- Stats ---------- */
const StatsGrid = styled.ul`
  display: grid;
  gap: 1px;
  grid-template-columns: repeat(3, 1fr);
  row-gap: 2.5rem;
  list-style: none;
  margin: 2rem 0 0;
  padding: 0;
  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
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
  { to: 700, prefix: "$", suffix: "K", label: "USD in sales in under 48 hours (Jefferson Fisher launch)" },
  { to: 80, prefix: "~", suffix: "%", label: "less clinician documentation time (Scrubs Co-Pilot)" },
  { to: 200, prefix: "~", label: "daily active users on Ask Kindred (Rare Days)" }
];
export const Stats = () => (
  <StatsGrid aria-label="Highlights">
    {STATS.map((s, i) => (
      <Reveal as="li" key={s.label} delay={i * 0.08}>
        <strong>
          {s.prefix}{s.to}{s.suffix}
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
  margin: 9rem 0 2.5rem;
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

const Grid = styled.div`
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;
const Card = styled(Link)`
  border: 1px solid var(--line);
  border-radius: 8px;
  color: var(--ink);
  display: flex;
  flex-direction: column;
  min-height: 330px;
  overflow: hidden;
  padding: 1.75rem;
  position: relative;
  text-decoration: none;
  transition: border-color 0.2s ease;
  &:hover,
  &:focus-visible {
    border-color: var(--accent);
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
  > h3,
  .copy > h3 {
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
  &.has-thumb { padding-right: 9.5rem; }
  &.featured { display: grid; gap: 2.5rem; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); min-height: 0; padding: 2.25rem; }
  &.featured .copy { display: flex; flex-direction: column; position: static; }
  &.featured .visual { align-self: center; pointer-events: none; }
  @media (max-width: 800px) { &.featured { grid-template-columns: 1fr; } }
  @media (max-width: 560px) {
    &.has-thumb { padding-right: 1.75rem; }
    .thumb { display: none; }
  }
  .thumb {
    border: 4px solid #05060a;
    border-radius: 18px;
    bottom: -28px;
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.5);
    height: auto;
    position: absolute;
    right: 1.5rem;
    transform: rotate(5deg);
    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    width: 112px;
  }
  &:hover .thumb { transform: rotate(2deg) translateY(-8px); }
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
export const Work = () => {
  const [lead, ...rest] = caseStudies.slice(0, 3);
  const body = (s, i) => (
    <>
      <h3>{s.title}</h3>
      <p className="result">{s.keyResult}</p>
      <p className="sum">{s.summary}</p>
      <ul className="tags" aria-label={`${s.title} technologies`}>
        {s.technologies.slice(0, 4).map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </>
  );
  return (
    <section>
      <SectionHead title="Selected work" note="Three systems I led end to end, and what changed." />
      <Reveal>
        <Card to={`/case-studies/${lead.slug}/`} className="featured" aria-label={`${lead.title} case study`}>
          <div className="copy">{body(lead, 0)}</div>
          {lead.slug === "scrubs-copilot" && (
            <div className="visual" aria-hidden="true">
              <ScrubsMock />
            </div>
          )}
        </Card>
      </Reveal>
      <Grid style={{ marginTop: "1.5rem" }}>
        {rest.map((s, i) => (
          <Reveal key={s.slug} delay={i * 0.1}>
            <Card to={`/case-studies/${s.slug}/`} style={{ height: "100%" }} className={s.demo ? "has-thumb" : undefined}>
              {s.demo && <img className="thumb" src={s.demo.poster} alt="" loading="lazy" width="384" height="784" />}
              {body(s, i + 1)}
            </Card>
          </Reveal>
        ))}
      </Grid>
    </section>
  );
};

/* ---------- Closing CTA ---------- */
const Cta = styled.section`
  align-items: center;
  display: grid;
  gap: 3rem;
  grid-template-columns: 1fr;
  margin: 10rem 0 2rem;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    margin-top: 7rem;
  }
  h2 {
    font-family: ${display};
    font-size: clamp(2.6rem, 6vw, 5rem);
    color: var(--ink);
    font-weight: 700;
    letter-spacing: -0.045em;
    line-height: 0.98;
    margin: 0 0 1.25rem;
  }
  h2 em {
    color: var(--accent);
    font-style: normal;
  }
  p {
    color: var(--muted);
    font-size: 1.15rem;
    line-height: 1.6;
    margin: 0 0 2rem;
    max-width: 30rem;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.9rem;
  }
`;
export const Contact = () => {
  return (
    <Cta>
      <Reveal>
        <h2>
          Let's build something <em>reliable.</em>
        </h2>
        <p>Got an AI platform, a RAG system, or something hard to ship? I would like to hear about it.</p>
        <div className="row">
          <Button className="primary" href="mailto:bhimeshchauhan@gmail.com">bhimeshchauhan@gmail.com</Button>
          <Button href="https://www.linkedin.com/in/bhimeshchauhan" target="_blank" rel="noopener noreferrer">LinkedIn</Button>
          <Button href="https://github.com/bhimeshchauhan" target="_blank" rel="noopener noreferrer">GitHub</Button>
        </div>
      </Reveal>
    </Cta>
  );
};

/* ---------- Social proof (verbatim excerpts from Recommendation.js) ---------- */
const QuoteWrap = styled.section`
  margin-top: 9rem;
  blockquote {
    border-left: 3px solid var(--accent);
    margin: 0;
    padding: 0.5rem 0 0.5rem 1.5rem;
  }
  blockquote p {
    color: var(--ink);
    font-family: ${display};
    font-size: clamp(1.4rem, 3.2vw, 2.3rem);
    letter-spacing: -0.02em;
    line-height: 1.3;
    margin: 0 0 0.9rem;
    max-width: 52rem;
  }
  figcaption {
    color: var(--muted);
  }
  figcaption a {
    align-items: center;
    color: var(--accent);
    display: inline-flex;
    margin-left: 0.6rem;
    min-height: 44px;
    text-decoration: none;
  }
`;
const EXCERPT = "His critical thinking and developer skill set helped us to further improve efficiencies throughout Nebullam as a whole.";
export const Quote = () => {
  const r = recommendations[0];
  if (!r || !r.description.includes(EXCERPT)) return null;
  return (
    <QuoteWrap>
      <Reveal>
        <figure style={{ margin: 0 }}>
          <blockquote>
            <p>“{EXCERPT}”</p>
          </blockquote>
          <figcaption>
            {r.name}, {r.designation}
            <Link to="/recommendation/">Read the full recommendation →</Link>
          </figcaption>
        </figure>
      </Reveal>
    </QuoteWrap>
  );
};
