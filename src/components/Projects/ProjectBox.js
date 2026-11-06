import React from 'react'
import { Link } from 'gatsby'
import styled from 'styled-components'

const display = `"Space Grotesk", "Inter", sans-serif`

const Box = styled.article`
  border-top: 1px solid var(--line);
  display: grid;
  gap: 0.5rem 2.5rem;
  grid-template-columns: 9rem minmax(0, 1fr);
  padding: 2rem 0;
  .year {
    color: var(--muted);
    font-size: 0.85rem;
    letter-spacing: 0.1em;
    padding-top: 0.55rem;
  }
  h2 {
    color: var(--ink);
    font-family: ${display};
    font-size: clamp(1.35rem, 2.8vw, 1.9rem);
    font-weight: 700;
    letter-spacing: -0.025em;
    line-height: 1.15;
    margin: 0 0 0.9rem;
  }
  .desc {
    color: var(--muted);
    font-size: 1.05rem;
    line-height: 1.65;
    margin: 0 0 1.25rem;
    max-width: 46rem;
  }
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    .year { padding-top: 0; }
  }
`

const Media = styled.div`
  border: 1px solid var(--line);
  border-radius: 8px;
  margin-bottom: 1.25rem;
  overflow: hidden;
  &.gallery {
    display: flex;
    gap: 0.75rem;
    overflow-x: auto;
    padding: 0.75rem;
    scrollbar-color: var(--accent) transparent;
    scrollbar-width: thin;
  }
  &.gallery img {
    border-radius: 6px;
    flex: none;
    height: clamp(180px, 28vw, 300px);
    width: auto;
  }
  iframe {
    background: #0d0f11;
    border: 0;
    display: block;
    max-height: 500px;
    min-height: 20em;
    width: 100%;
  }
`

const Tags = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  list-style: none;
  margin: 0 0 1.25rem;
  padding: 0;
  li {
    border: 1px solid var(--line);
    border-radius: 4px;
    color: var(--ink);
    font-size: 0.82rem;
    margin: 0;
    padding: 0.3rem 0.65rem;
  }
`

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  a {
    align-items: center;
    border: 1px solid var(--line);
    border-radius: 8px;
    color: var(--ink);
    display: inline-flex;
    font-size: 0.95rem;
    font-weight: 600;
    gap: 0.45rem;
    min-height: 44px;
    padding: 0 1.1rem;
    text-decoration: none;
    transition: border-color 0.2s ease, color 0.2s ease;
  }
  a:hover,
  a:focus-visible {
    border-color: var(--accent);
    color: var(--accent);
  }
`

// Split on top-level commas only, so "AWS (EC2, S3)" stays one tag.
const splitTech = (text = '') => {
  const out = []
  let depth = 0
  let cur = ''
  for (const ch of text) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === ',' && depth === 0) {
      out.push(cur.trim())
      cur = ''
    } else cur += ch
  }
  if (cur.trim()) out.push(cur.trim())
  return out
}

const ProjectBox = ({ info }) => (
  <Box className="projectBox">
    <span className="year">{info.year || ''}</span>
    <div>
      <h2>{info.title}</h2>
      {info.iframe ? (
        <Media dangerouslySetInnerHTML={{ __html: info.iframe }} />
      ) : info.media?.length ? (
        <Media className="gallery">
          {info.media.map((item, i) => (
            <img key={item} src={item} alt={`${info.title} screenshot ${i + 1}`} loading="lazy" decoding="async" />
          ))}
        </Media>
      ) : null}
      <p className="desc">{info.description}</p>
      <Tags aria-label={`${info.title} technology stack`}>
        {splitTech(info.techUsed).map((t) => (
          <li key={t}>{t}</li>
        ))}
      </Tags>
      <Links>
        {info.caseStudy && <Link to={`/case-studies/${info.caseStudy}/`}>Read the case study →</Link>}
        {info.demoPath != null && (
          <a href={info.demoPath} target="_blank" rel="noopener noreferrer">
            Live demo <span aria-hidden="true">↗</span>
          </a>
        )}
        {info.githubPath != null && (
          <a href={info.githubPath} target="_blank" rel="noopener noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
        )}
      </Links>
    </div>
  </Box>
)

export default ProjectBox
