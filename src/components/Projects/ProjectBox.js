import React from 'react'
import styled from 'styled-components'
import { Reveal } from '../motion/primitives'

const display = `"Space Grotesk", "Signika", sans-serif`

const Box = styled.article`
  --mx: 50%;
  --my: 0%;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  transition: border-color 0.3s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  &::before {
    background: radial-gradient(520px circle at var(--mx) var(--my), rgba(255, 180, 84, 0.12), transparent 60%);
    content: "";
    inset: 0;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    transition: opacity 0.3s ease;
  }
  &:hover {
    border-color: rgba(255, 180, 84, 0.45);
  }
  &:hover::before {
    opacity: 1;
  }
  > * {
    position: relative;
  }
`

const Head = styled.header`
  align-items: center;
  display: flex;
  gap: 1.1rem;
  padding: 1.5rem 1.75rem 0;
  .icon {
    border-radius: 18px;
    flex: none;
    height: 64px;
    width: 64px;
  }
  .titles {
    flex: 1;
    min-width: 0;
  }
  h2 {
    color: var(--ink);
    font-family: ${display};
    font-size: clamp(1.25rem, 2.6vw, 1.85rem);
    font-weight: 700;
    letter-spacing: -0.025em;
    line-height: 1.1;
    margin: 0;
  }
  .year {
    border: 1px solid var(--line);
    border-radius: 999px;
    color: var(--muted);
    flex: none;
    font-size: 0.82rem;
    letter-spacing: 0.06em;
    padding: 0.3rem 0.75rem;
  }
  @media (max-width: 560px) {
    flex-wrap: wrap;
    .year { order: -1; }
  }
`

const Body = styled.div`
  padding: 1.25rem 1.75rem 1.75rem;
  .desc {
    color: var(--muted);
    font-size: 1.05rem;
    line-height: 1.65;
    margin: 0 0 1.25rem;
    max-width: 62rem;
  }
`

const Media = styled.div`
  border: 1px solid var(--line);
  border-radius: 16px;
  margin-bottom: 1.25rem;
  overflow: hidden;
  &.gallery {
    background: rgba(0, 0, 0, 0.25);
    display: flex;
    gap: 0.75rem;
    overflow-x: auto;
    padding: 0.75rem;
    scroll-snap-type: x proximity;
    scrollbar-color: rgba(255, 180, 84, 0.6) transparent;
    scrollbar-width: thin;
  }
  &.gallery img {
    border-radius: 10px;
    flex: none;
    height: clamp(180px, 28vw, 300px);
    scroll-snap-align: start;
    width: auto;
  }
  iframe {
    background: #0d0f11;
    border: 0;
    display: block;
    min-height: 20em;
    max-height: 500px;
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
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--line);
    border-radius: 999px;
    color: var(--ink);
    font-size: 0.82rem;
    margin: 0;
    padding: 0.3rem 0.7rem;
  }
`

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  a {
    align-items: center;
    background: transparent;
    border: 1px solid var(--line);
    border-radius: 999px;
    color: var(--ink);
    display: inline-flex;
    font-size: 0.95rem;
    font-weight: 600;
    gap: 0.45rem;
    padding: 0.6rem 1.15rem;
    text-decoration: none;
    transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
  }
  a:hover,
  a:focus-visible {
    background: var(--accent);
    border-color: var(--accent);
    color: #0b0d12;
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

const track = (e) => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

const ProjectBox = ({ info }) => (
  <Reveal>
    <Box className="projectBox" onMouseMove={track}>
      <Head>
        <img className="icon" src={info.icon} alt="" loading="lazy" decoding="async" width="64" height="64" />
        <div className="titles">
          <h2>{info.title}</h2>
        </div>
        {info.year && <span className="year">{info.year}</span>}
      </Head>
      <Body>
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
      </Body>
    </Box>
  </Reveal>
)

export default ProjectBox
