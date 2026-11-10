import React from "react";
import styled from "styled-components";
import { Link } from "gatsby";
import Layout from "../components/layout";
import { profilePageSchema } from "../utils/schema";
import FitFinder from "../components/FitFinder";
import { BOOKING_URL } from "../utils/connect";

const display = `"Space Grotesk", "Inter", sans-serif`;

// Role-fit evidence. Every line below is already stated on a case study or the experience page.
const roles = [
  {
    title: "Forward deployed / customer-facing AI engineer",
    blurb: "Embedded with customer teams, scoping vague problems into shipped systems.",
    evidence: [
      ["Led Ask Kindred from SDK integration to production for three customer companies, about 200 daily active users.", "/case-studies/ask-kindred/"],
      ["Led engineering for a client launch (Jefferson Fisher, via Rare Days): about $700K USD in total sales in under 48 hours.", "/case-studies/jefferson-fisher/"],
      ["Validated Scrubs Co-Pilot outputs with working clinicians: about 80% less documentation time.", "/case-studies/scrubs-copilot/"],
      ["Built DataRobot integrations with Excel, Snowflake, Tableau and Alteryx (partner visibility +70%).", "/experience/"],
      ["Used customer interviews at Preply to shape personalization releases for 80K+ learners.", "/experience/"]
    ],
    keywords: "forward deployed engineer, customer-facing, SDK integration, solutions engineering, RAG, launch engineering"
  },
  {
    title: "Staff / principal AI platform engineer",
    blurb: "Architecture, reliability and reusable platform work that other teams build on.",
    evidence: [
      ["Designed a multi-tenant SaaS platform with role-aware access control and a production RAG chatbot.", "/case-studies/ask-kindred/"],
      ["Built reusable ingestion and retrieval capabilities shared across other Rare Days projects.", "/case-studies/ask-kindred/"],
      ["Delivered 10+ CI improvements and added Sentry across frontend and backend services.", "/case-studies/ask-kindred/"],
      ["Wrangle platform: 1,000+ automated tests, 46 migrations, 3 automated deploy pipelines (counted from the repository).", "/case-studies/wrangle/"],
      ["BenchSci: AI pipelines over 100K+ research artifacts, about 60% less manual curation, plus lineage and auditability practices.", "/experience/"],
      ["Every case study documents its design decisions and reliability approach.", "/case-studies/"],
      ["Wrote up how I balance customer requests, timeline and stakeholder expectations (VP Engineering, CTO, CEO) across several projects.", "/blog/#post-9"]
    ],
    keywords: "staff engineer, principal engineer, AI platform, architecture, multi-tenant, reliability, RAG, observability"
  },
  {
    title: "Lead / founding engineer",
    blurb: "Owns the roadmap from zero to production and leads the team doing it.",
    evidence: [
      ["Founder and CTO of Scrubs Co-Pilot: built from zero to a production MVP with clinicians.", "/case-studies/scrubs-copilot/"],
      ["Led teams of 4–5 engineers and designers across Scrubs Co-Pilot, the Jefferson Fisher launch, Ask Kindred and Wrangle.", "/case-studies/"],
      ["Set the technical roadmap from MVP through production, balancing clinical quality, security and reliability.", "/experience/"],
      ["Mentored engineers at Rare Days; led a cross-functional team at Preply serving 80K learners.", "/experience/"],
      ["Wrote up how I balance customer requests, timeline and stakeholder expectations (VP Engineering, CTO, CEO) across several projects.", "/blog/#post-9"]
    ],
    keywords: "lead engineer, founding engineer, CTO, engineering lead, technical leadership, hiring and mentoring"
  }
];

const facts = [
  ["Current role", "Lead Software Engineer, Rare Days (Jan 2026 – present)"],
  ["Location", "Canada. Permanent resident, authorized to work in Canada for any employer, no sponsorship needed"],
  ["Worked in", "Has lived and worked in Canada, the United States and Spain"],
  ["Experience", "10+ years of production software; earlier roles at Scrubs Co-Pilot, BenchSci, MicroMart, Preply, DataRobot, Pitchly and Nebullam"],
  ["Focus", "Production RAG and LLM systems, multi-tenant SaaS, healthcare AI, high-traffic commerce, IoT and distributed systems"],
  ["Stack", "TypeScript, Python, React, Next.js, Node.js, NestJS, PostgreSQL, pgvector, Neo4j, Supabase, AWS, Docker, Stripe, Sentry, CI/CD"],
  ["Leadership", "Teams of 4–5 engineers and designers; roadmap ownership; mentoring"],
  ["Education", "B.S. Electrical Engineering, Iowa State University (2014–2018)"],
  ["Languages", "English, Hindi, Bengali"]
];

const Wrap = styled.div`
  margin: 0 auto;
  max-width: 1120px;
  width: 100%;
  h1 { color: var(--ink); font-family: ${display}; font-size: clamp(2.2rem, 6vw, 4rem); font-weight: 700; letter-spacing: -0.04em; line-height: 1.02; margin: 1rem 0; }
  .lede { color: var(--muted); font-size: clamp(1.05rem, 2vw, 1.25rem); line-height: 1.6; margin: 0 0 1.5rem; max-width: 46rem; }
  h2 { color: var(--ink); font-family: ${display}; font-size: clamp(1.4rem, 3vw, 1.9rem); letter-spacing: -0.02em; margin: 3rem 0 1.25rem; }
  .actions { display: flex; flex-wrap: wrap; gap: 0.7rem; }
  .btn { align-items: center; background: transparent; cursor: pointer; font-family: inherit; font-size: 1rem; border: 1px solid var(--line); border-radius: 999px; color: var(--ink); display: inline-flex; font-weight: 600; min-height: 44px; padding: 0 1.3rem; text-decoration: none; transition: border-color 0.2s, background 0.2s; }
  .btn:hover { border-color: var(--accent); }
  .btn.primary { background: var(--accent); border-color: var(--accent); color: #0b0d12; }
`;
const Grid = styled.div`
  display: grid;
  gap: 1.1rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  @media (max-width: 960px) { grid-template-columns: 1fr; }
`;
const Card = styled.article`
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.5rem;
  h3 { color: var(--ink); font-family: ${display}; font-size: 1.25rem; letter-spacing: -0.02em; line-height: 1.2; margin: 0; }
  .blurb { color: var(--muted); line-height: 1.5; margin: 0; }
  ul { display: grid; gap: 0.6rem; list-style: none; margin: 0; padding: 0; }
  li { color: var(--ink); font-size: 0.95rem; line-height: 1.5; padding-left: 1rem; position: relative; }
  li::before { background: var(--accent); border-radius: 50%; content: ""; height: 5px; left: 0; position: absolute; top: 0.62em; width: 5px; }
  li a { color: inherit; text-decoration-color: rgba(255, 180, 84, 0.5); text-underline-offset: 3px; }
  li a:hover { color: var(--accent); }
  .kw { border-top: 1px solid var(--line); color: var(--muted); font-size: 0.8rem; line-height: 1.5; margin: auto 0 0; padding-top: 0.8rem; }
`;
const Facts = styled.dl`
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 20px;
  display: grid;
  gap: 0;
  margin: 0;
  overflow: hidden;
  .row { border-top: 1px solid var(--line); display: grid; gap: 0.3rem 1.5rem; grid-template-columns: 11rem 1fr; padding: 0.9rem 1.4rem; }
  .row:first-child { border-top: 0; }
  dt { color: var(--muted); font-size: 0.85rem; letter-spacing: 0.06em; text-transform: uppercase; }
  dd { color: var(--ink); line-height: 1.5; margin: 0; }
  @media (max-width: 640px) { .row { grid-template-columns: 1fr; } }
`;
const Files = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  list-style: none;
  margin: 0;
  padding: 0;
  a { align-items: center; border: 1px solid var(--line); border-radius: 12px; color: var(--ink); display: inline-flex; font-family: ui-monospace, Menlo, monospace; font-size: 0.9rem; min-height: 44px; padding: 0 1rem; text-decoration: none; }
  a:hover { border-color: var(--accent); }
`;

const Hire = () => (
  <Layout
    seo={{
      title: "Hire: Forward Deployed / Staff / Lead AI Engineer",
      description:
        "Where Bhimesh Chauhan fits: forward deployed, staff/principal AI platform and lead/founding engineering roles, with the shipped evidence behind each.",
      pathname: "/hire/",
      structuredData: profilePageSchema({
        pathname: "/hire/",
        name: "Hire Bhimesh Chauhan: role fit and evidence",
        description: "Role-fit summary for forward deployed, staff and lead AI platform engineering roles, with links to shipped work."
      })
    }}
  >
    <Wrap>
      <h1>Hire me for AI platform work that has to ship.</h1>
      <p className="lede">
        Lead AI platform engineer with 10+ years of production software. I build and run customer-facing AI systems end to end,
        from retrieval architecture to launch-day reliability, and lead the teams around them. Below: the three kinds of role
        I fit, and the shipped work behind each.
      </p>
      <div className="actions">
        {BOOKING_URL && <a className="btn primary" href={BOOKING_URL} target="_blank" rel="noopener noreferrer">Book a 15-minute call</a>}
        <a className={BOOKING_URL ? "btn" : "btn primary"} href="#fit">Is this role a fit?</a>
        <a className="btn" href="mailto:bhimeshchauhan@gmail.com">Email me</a>
        <a className="btn" href="https://www.linkedin.com/in/bhimeshchauhan" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a className="btn" href="/resume.pdf" target="_blank" rel="noopener noreferrer">Resume (PDF)</a>
        <Link className="btn" to="/case-studies/">Case studies</Link>
      </div>

      <FitFinder />

      <h2>Roles I fit, and the evidence</h2>
      <Grid>
        {roles.map((r) => (
          <Card key={r.title}>
            <h3>{r.title}</h3>
            <p className="blurb">{r.blurb}</p>
            <ul>
              {r.evidence.map(([text, href]) => (
                <li key={text}>
                  <Link to={href}>{text}</Link>
                </li>
              ))}
            </ul>
            <p className="kw">{r.keywords}</p>
          </Card>
        ))}
      </Grid>

      <h2>Fast facts</h2>
      <Facts>
        {facts.map(([k, v]) => (
          <div className="row" key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </Facts>

      <h2>For recruiters, ATS and AI agents</h2>
      <p className="lede">
        The same facts in machine-readable form, kept in sync with this site. You can also ask the assistant on any page; it
        answers from this content.
      </p>
      <Files>
        <li><a href="/llms.txt">/llms.txt</a></li>
        <li><a href="/llms-full.txt">/llms-full.txt</a></li>
        <li><a href="/resume.json">/resume.json</a></li>
        <li><a href="/resume.pdf">/resume.pdf</a></li>
        <li><a href="/sitemap.xml">/sitemap.xml</a></li>
      </Files>
    </Wrap>
  </Layout>
);

export default Hire;
