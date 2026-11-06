import styled from "styled-components";

export const CaseStudiesWrapper = styled.div`
  color: var(--ink);
  margin: 3.5rem auto 0;
  max-width: 1120px;
  width: 100%;
`;

export const CaseStudiesIntro = styled.header`
  max-width: 760px;
  margin-bottom: 2.75rem;

  h1 {
    color: var(--ink);
    font-family: "Space Grotesk", "Inter", sans-serif;
    font-size: clamp(2.25rem, 6vw, 4.5rem);
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 1;
    margin: 0 0 1rem;
  }

  p {
    color: var(--muted);
    font-size: clamp(1.05rem, 2vw, 1.3rem);
    line-height: 1.6;
    margin: 0;
  }
`;

export const CaseStudyGrid = styled.section`
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const CaseStudyCardShell = styled.article`
  border: 1px solid var(--line);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  min-height: 295px;
  padding: 1.65rem;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: var(--accent);
  }

  h2 {
    color: var(--ink);
    font-family: "Space Grotesk", "Inter", sans-serif;
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin: 0.6rem 0 0.9rem;
  }

  p {
    color: var(--muted);
    font-size: 1rem;
    line-height: 1.55;
    margin: 0 0 1.3rem;
  }
`;

export const Eyebrow = styled.p`
  color: var(--accent) !important;
  font-size: 0.78rem !important;
  font-weight: 600;
  letter-spacing: 0.1em;
  margin: 0 !important;
  text-transform: uppercase;
`;

export const TagList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  list-style: none;
  margin: 0;
  padding: 0 !important;

  li {
    border: 1px solid var(--line);
    border-radius: 4px;
    color: var(--ink);
    font-size: 0.83rem;
    line-height: 1.2;
    padding: 0.38rem 0.64rem;
  }
`;

export const CaseStudyLink = styled.a`
  align-items: center;
  align-self: flex-start;
  display: inline-flex;
  min-height: 44px;
  color: var(--ink);
  font-size: 1rem;
  font-weight: 600;
  margin-top: auto;
  text-decoration: none;

  &:hover {
    color: var(--accent);
  }
`;

export const DetailShell = styled.article`
  color: var(--ink);
  margin: 3rem auto 0;
  max-width: 940px;
  width: 100%;

  h1,
  h2 {
    font-family: "Space Grotesk", "Inter", sans-serif;
    font-weight: 700;
  }

  h1 {
    font-size: clamp(2.5rem, 7vw, 4.6rem);
    letter-spacing: -0.045em;
    line-height: 0.98;
    margin: 0.45rem 0 1.35rem;
  }

  h2 {
    font-size: 1.05rem;
    letter-spacing: 0;
    margin: 0 0 0.9rem;
  }
`;

export const Breadcrumb = styled.a`
  align-items: center;
  display: inline-flex;
  min-height: 44px;
  color: var(--muted);
  font-size: 0.95rem;
  text-decoration: none;

  &:hover {
    color: var(--accent);
  }
`;

export const DetailSummary = styled.p`
  color: #d9d7d0;
  font-size: clamp(1.15rem, 2.5vw, 1.45rem);
  line-height: 1.5;
  margin: 0;
  max-width: 850px;
`;

export const DetailSection = styled.section`
  border-top: 1px solid var(--line);
  display: grid;
  gap: 0.25rem 2.5rem;
  grid-template-columns: 11rem minmax(0, 1fr);
  margin-top: 2.5rem;
  padding-top: 1.75rem;

  > h2 {
    color: var(--accent);
    font-size: 0.8rem;
    grid-column: 1;
    grid-row: 1;
    letter-spacing: 0.1em;
    margin: 0.3rem 0 0;
    text-transform: uppercase;
  }
  > *:not(h2) {
    grid-column: 2;
  }
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    > h2,
    > *:not(h2) {
      grid-column: 1;
    }
    > h2 {
      grid-row: auto;
      margin-bottom: 0.6rem;
    }
  }

  p,
  li {
    color: #d9d7d0;
    line-height: 1.7;
    max-width: 70ch;
  }

  p {
    margin: 0 0 1rem;
  }

  p:last-child,
  ul:last-child,
  ol:last-child {
    margin-bottom: 0;
  }

  ul,
  ol {
    margin: 0;
    padding-left: 1.25rem;
  }

  li + li {
    margin-top: 0.7rem;
  }
`;

export const ArchitectureList = styled.ol`
  counter-reset: architecture;
  list-style: none;
  padding: 0 !important;

  li {
    align-items: flex-start;
    display: grid;
    gap: 0.85rem;
    grid-template-columns: 2.25rem 1fr;
  }

  li::before {
    align-items: center;
    background: none;
    border: 1px solid var(--line);
    border-radius: 50%;
    color: #ffffff;
    content: counter(architecture);
    counter-increment: architecture;
    display: flex;
    font-size: 0.9rem;
    font-weight: 600;
    height: 2.1rem;
    justify-content: center;
    margin-top: 0.1rem;
    width: 2.1rem;
  }
`;

export const DetailColumns = styled.div`
  display: block;
`;

export const DetailFooter = styled.footer`
  margin: 2rem 0 1rem;
`;

export const KeyResult = styled.p`
  color: #ffffff !important;
  font-size: 1.05rem !important;
  font-weight: 600;
  margin: 0 0 0.8rem !important;
`;

export const MetaStrip = styled.dl`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 1.75rem 0 0;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }

  dt {
    color: var(--accent);
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  dd {
    color: var(--ink);
    margin: 0.2rem 0 0;
  }
`;

export const StatGrid = styled.ul`
  display: grid;
  gap: 1.5rem 2rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  list-style: none;
  margin: 1.5rem 0 1.75rem !important;
  padding: 0 !important;

  &:has(li:nth-child(4):last-child) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 700px) {
    grid-template-columns: 1fr !important;
  }

  li {
    border-left: 2px solid var(--accent);
    margin: 0 !important;
    padding: 0.1rem 0 0.1rem 1rem;
  }

  strong {
    color: var(--ink);
    display: block;
    font-family: "Space Grotesk", "Inter", sans-serif;
    font-size: clamp(1.7rem, 4vw, 2.4rem);
    letter-spacing: -0.03em;
    line-height: 1.1;
  }

  span {
    color: var(--muted);
    display: block;
    font-size: 0.92rem;
    line-height: 1.45;
    margin-top: 0.25rem;
  }
`;

export const FlowDiagram = styled.ol`
  align-items: stretch;
  display: flex;
  flex-wrap: nowrap;
  gap: 1.25rem;
  list-style: none;
  margin: 0 0 1.5rem !important;
  padding: 0 !important;

  li {
    flex: 1 1 0;
    min-width: 0;
    margin: 0 !important;
    position: relative;
  }
  li button {
    background: none;
    border: 1px solid var(--line);
    border-radius: 6px;
    color: var(--ink);
    cursor: pointer;
    font: inherit;
    font-weight: 600;
    height: 100%;
    font-size: 0.85rem;
    padding: 0.7rem 0.4rem;
    text-align: center;
    transition: background 0.2s ease, border-color 0.2s ease;
    width: 100%;
  }
  li button:hover,
  li button.on {
    background: rgba(255, 180, 84, 0.12);
    border-color: var(--accent);
  }

  li:not(:last-child)::after {
    color: var(--accent);
    content: "→";
    position: absolute;
    right: -1.3rem;
    top: 50%;
    transform: translateY(-50%);
  }

  @media (max-width: 700px) {
    flex-direction: column;
    gap: 1.5rem;

    li:not(:last-child)::after {
      content: "↓";
      right: 50%;
      top: auto;
      bottom: -1.45rem;
      transform: translateX(50%);
    }
  }
`;

export const SourceNote = styled.p`
  color: var(--muted) !important;
  font-size: 0.85rem;
  margin: 1rem 0 0 !important;
`;

export const PhoneRow = styled.div`
  align-items: flex-start;
  display: grid;
  gap: 1.25rem;
  grid-template-columns: 1.15fr repeat(3, 1fr);
  margin-top: 1.5rem;
  @media (max-width: 800px) {
    grid-template-columns: 1fr 1fr;
    .main {
      grid-column: 1 / -1;
      max-width: 260px;
      margin: 0 auto;
    }
  }
  figure {
    margin: 0;
  }
  figcaption {
    color: var(--muted);
    font-size: 0.85rem;
    margin-top: 0.6rem;
    text-align: center;
  }
`;

export const PhoneFrame = styled.div`
  background: #05060a;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 28px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  padding: 6px;
  video,
  img {
    border-radius: 22px;
    display: block;
    height: auto;
    width: 100%;
  }
`;

export const FlowDetail = styled.p`
  animation: flowIn 0.35s ease both;
  border-left: 3px solid var(--accent);
  color: var(--ink) !important;
  margin: 0 0 1.5rem !important;
  padding: 0.25rem 0 0.25rem 1rem;
  @keyframes flowIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: none; }
  }
`;
