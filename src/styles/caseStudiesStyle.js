import styled from "styled-components";

const panelBackground = "rgba(21, 33, 92, 0.58)";
const panelBorder = "rgba(214, 231, 255, 0.24)";

export const CaseStudiesWrapper = styled.main`
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
  background: linear-gradient(145deg, rgba(95, 113, 177, 0.33), ${panelBackground});
  border: 1px solid ${panelBorder};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  min-height: 295px;
  padding: 1.65rem;
  transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;

  &:hover {
    border-color: rgba(163, 201, 255, 0.65);
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
  color: #85c7ff !important;
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
