import styled from "styled-components";

const panelBackground = "rgba(255, 255, 255, 0.04)";
const panelBorder = "rgba(255, 255, 255, 0.12)";

export const CaseStudiesWrapper = styled.div`
  color: #f3f7ff;
  margin: 3.5rem auto 0;
  max-width: 1120px;
  width: 100%;
`;

export const CaseStudiesIntro = styled.header`
  max-width: 760px;
  margin-bottom: 2.75rem;

  h1 {
    font-size: clamp(2.25rem, 6vw, 4.5rem);
    font-weight: 400;
    letter-spacing: -0.04em;
    line-height: 1;
    margin: 0 0 1rem;
  }

  p {
    color: #d4dff5;
    font-size: clamp(1.05rem, 2vw, 1.35rem);
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
  background: ${panelBackground};
  border: 1px solid ${panelBorder};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  min-height: 295px;
  padding: 1.65rem;
  transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;

  &:hover {
    border-color: rgba(255, 180, 84, 0.55);
    box-shadow: 0 18px 42px rgba(3, 9, 44, 0.3);
    transform: translateY(-5px);
  }

  h2 {
    font-size: clamp(1.55rem, 3vw, 2.1rem);
    font-weight: 400;
    line-height: 1.08;
    margin: 0.6rem 0 0.9rem;
  }

  p {
    color: #d8e3f8;
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
  padding: 0;

  li {
    background: rgba(117, 162, 237, 0.17);
    border: 1px solid rgba(166, 204, 255, 0.25);
    border-radius: 999px;
    color: #e9f2ff;
    font-size: 0.83rem;
    line-height: 1.2;
    padding: 0.38rem 0.64rem;
  }
`;

export const CaseStudyLink = styled.a`
  align-self: flex-start;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  margin-top: auto;
  text-decoration: none;

  &:hover {
    color: #9ed2ff;
  }
`;

export const DetailShell = styled.article`
  color: #edf4ff;
  margin: 3rem auto 0;
  max-width: 940px;
  width: 100%;

  h1,
  h2 {
    font-weight: 400;
  }

  h1 {
    font-size: clamp(2.5rem, 7vw, 5.2rem);
    letter-spacing: -0.05em;
    line-height: 0.95;
    margin: 0.45rem 0 1.35rem;
  }

  h2 {
    font-size: clamp(1.45rem, 3vw, 2rem);
    margin: 0 0 0.9rem;
  }
`;

export const Breadcrumb = styled.a`
  color: #badbff;
  font-size: 0.95rem;
  text-decoration: none;

  &:hover {
    color: #ffffff;
  }
`;

export const DetailSummary = styled.p`
  color: #dbe7fa;
  font-size: clamp(1.15rem, 2.5vw, 1.5rem);
  line-height: 1.5;
  margin: 0;
  max-width: 850px;
`;

export const DetailSection = styled.section`
  background: ${panelBackground};
  border: 1px solid ${panelBorder};
  border-radius: 18px;
  margin-top: 1.25rem;
  padding: clamp(1.25rem, 4vw, 2.1rem);

  p,
  li {
    color: #dbe6f8;
    line-height: 1.65;
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
    background: rgba(116, 174, 255, 0.25);
    border: 1px solid rgba(178, 215, 255, 0.5);
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
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 1.25rem;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
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
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 1.5rem 0 0;

  @media (max-width: 700px) {
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
    color: #edf4ff;
    margin: 0.2rem 0 0;
  }
`;

export const StatGrid = styled.ul`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  list-style: none;
  margin: 1.5rem 0 0 !important;
  padding: 0 !important;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }

  li {
    background: rgba(117, 162, 237, 0.14);
    border: 1px solid rgba(166, 204, 255, 0.25);
    border-radius: 14px;
    margin: 0 !important;
    padding: 1rem;
  }

  strong {
    color: #ffffff;
    display: block;
    font-size: clamp(1.6rem, 4vw, 2.2rem);
    line-height: 1.1;
  }

  span {
    color: #d4dff5;
    font-size: 0.95rem;
  }
`;

export const FlowDiagram = styled.ol`
  align-items: stretch;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  list-style: none;
  margin: 0 0 1.5rem !important;
  padding: 0 !important;

  li {
    flex: 1 1 140px;
    margin: 0 !important;
    position: relative;
  }
  li button {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 12px;
    color: #ffffff;
    cursor: pointer;
    font: inherit;
    font-weight: 600;
    height: 100%;
    padding: 0.8rem 1rem;
    text-align: center;
    transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
    width: 100%;
  }
  li button:hover,
  li button.on {
    background: rgba(255, 180, 84, 0.16);
    border-color: var(--accent);
  }
  li button.on {
    transform: translateY(-2px);
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
  color: #edf4ff !important;
  margin: 0 0 1.5rem !important;
  padding: 0.25rem 0 0.25rem 1rem;
  @keyframes flowIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: none; }
  }
`;
