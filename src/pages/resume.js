import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import Layout from "../components/layout";
import resume from "../../static/resume.json";

const display = `"Space Grotesk", "Inter", sans-serif`;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// "2026-01" -> "Jan 2026", "2018" -> "2018"
const fmt = (d) => {
  if (!d) return "";
  const [y, m] = String(d).split("-");
  return m ? `${MONTHS[Number(m) - 1]} ${y}` : y;
};
const range = (s, e) => `${fmt(s)} – ${e ? fmt(e) : "Present"}`;

// Print as a clean light page: hide site chrome, drop the dark theme.
const Print = createGlobalStyle`
  @media print {
    :root { --ink: #111; --muted: #444; --line: #ccc; --bg: #fff; --accent: #111; }
    html, body { background: #fff !important; color: #111; }
    .nav, .defaultFooter, .assistant-launcher, [role="dialog"], .skip-link, .no-print { display: none !important; }
    body > div, body > div > div { background: transparent !important; }
    div[aria-hidden="true"] { display: none !important; }
  }
`;

const Wrap = styled.article`
  margin: 2rem auto 0;
  max-width: 820px;
  h1 { color: var(--ink); font-family: ${display}; font-size: clamp(2.2rem, 6vw, 3.6rem); font-weight: 700; letter-spacing: -0.04em; line-height: 1; margin: 0 0 0.5rem; }
  .label { color: var(--muted); font-size: 1.2rem; margin: 0 0 1rem; }
  .contact { color: var(--muted); display: flex; flex-wrap: wrap; gap: 0.25rem 1.25rem; list-style: none; margin: 0 0 1.5rem; padding: 0; }
  .contact a { color: var(--ink); }
  .actions { display: flex; flex-wrap: wrap; gap: 0.7rem; margin: 0 0 1rem; }
  .actions a { border: 1px solid var(--line); border-radius: 8px; color: var(--ink); font-weight: 600; padding: 0.75rem 1.2rem; text-decoration: none; }
  .actions a.primary { background: var(--accent); border-color: var(--accent); color: #0b0d12; }
  .actions a:hover { border-color: var(--accent); }
  h2 { border-top: 1px solid var(--line); color: var(--accent); font-size: 0.8rem; letter-spacing: 0.1em; margin: 2.5rem 0 1.25rem; padding-top: 1.5rem; text-transform: uppercase; }
  p, li { color: #d9d7d0; line-height: 1.65; }
  .job { margin-bottom: 1.75rem; }
  .job header { align-items: baseline; display: flex; flex-wrap: wrap; gap: 0.2rem 1rem; justify-content: space-between; }
  .job h3 { color: var(--ink); font-family: ${display}; font-size: 1.2rem; letter-spacing: -0.02em; margin: 0; }
  .job h3 span { color: var(--muted); font-family: inherit; font-weight: 400; }
  .job time { color: var(--muted); font-size: 0.92rem; }
  .job ul, .plain { margin: 0.5rem 0 0; padding-left: 1.2rem; }
  .job li { margin-bottom: 0.4rem; }
  dl.skills { display: grid; gap: 0.6rem 1.5rem; grid-template-columns: 12rem minmax(0, 1fr); margin: 0; }
  dl.skills dt { color: var(--ink); font-weight: 600; }
  dl.skills dd { color: #d9d7d0; margin: 0; }
  @media (max-width: 600px) { dl.skills { grid-template-columns: 1fr; gap: 0; } dl.skills dd { margin-bottom: 0.8rem; } }
  a { color: var(--accent); }
  @media print {
    h1, .job h3, .contact a, .actions a, dl.skills dt { color: #111; }
    p, li, dl.skills dd { color: #222; }
    .actions { display: none; }
    .job { break-inside: avoid; }
  }
`;

const Resume = () => {
  const b = resume.basics;
  const profiles = b.profiles || [];
  return (
    <Layout
      seo={{
        title: "Resume",
        description: `${b.name}, ${b.label}: work history, projects, skills and education, readable on the page. Lead AI platform engineer with 10+ years of production software.`,
        pathname: "/resume/",
        image: "/og/resume.jpg",
        imageAlt: "Bhimesh Chauhan: resume. Lead AI platform engineer"
      }}
    >
      <Print />
      <Wrap>
        <h1>{b.name}</h1>
        <p className="label">{b.label}</p>
        <ul className="contact">
          <li><a href={`mailto:${b.email}`}>{b.email}</a></li>
          {profiles.map((p) => (
            <li key={p.network}><a href={p.url} target="_blank" rel="noopener noreferrer">{p.network}</a></li>
          ))}
        </ul>
        <div className="actions no-print">
          <a className="primary" href="/resume.pdf" target="_blank" rel="noopener noreferrer">Download PDF</a>
          <a href="/hire/">Is this role a fit?</a>
        </div>

        <h2>Summary</h2>
        <p>{b.summary}</p>

        <h2>Experience</h2>
        {resume.work.map((w) => (
          <section className="job" key={`${w.name}-${w.startDate}`}>
            <header>
              <h3>{w.position} <span>· {w.name}</span></h3>
              <time>{range(w.startDate, w.endDate)}</time>
            </header>
            {w.summary && <p>{w.summary}</p>}
            {w.highlights && w.highlights.length > 0 && (
              <ul>
                {w.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <h2>Projects</h2>
        <ul className="plain">
          {resume.projects.map((p) => (
            <li key={p.name}>
              {p.url ? <a href={p.url}>{p.name}</a> : p.name}: {p.description}
            </li>
          ))}
        </ul>

        <h2>Skills</h2>
        <dl className="skills">
          {resume.skills.map((s) => (
            <React.Fragment key={s.name}>
              <dt>{s.name}</dt>
              <dd>{s.keywords.join(", ")}</dd>
            </React.Fragment>
          ))}
        </dl>

        <h2>Education</h2>
        <ul className="plain">
          {resume.education.map((e) => (
            <li key={e.institution}>
              {e.studyType} in {e.area}, {e.institution}, {fmt(e.startDate)}–{fmt(e.endDate)}
            </li>
          ))}
        </ul>

        {resume.languages && (
          <>
            <h2>Languages</h2>
            <p>{resume.languages.map((l) => l.language).join(", ")}</p>
          </>
        )}
      </Wrap>
    </Layout>
  );
};

export default Resume;
