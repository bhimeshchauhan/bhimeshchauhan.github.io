import styled from 'styled-components'

export const ProjectsWrapper = styled.div`
  margin: 0 auto;
  max-width: 1120px;
  padding-top: 1rem;
  width: 100%;
`

export const ProjectsIntro = styled.header`
  margin-bottom: 2.5rem;
  max-width: 760px;
  h1 {
    color: var(--ink);
    font-family: "Space Grotesk", "Signika", sans-serif;
    font-size: clamp(2.4rem, 6vw, 4.5rem);
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
`

export const ProjectsSection = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
`
