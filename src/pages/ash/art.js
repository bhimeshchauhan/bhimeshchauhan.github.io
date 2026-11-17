import React, { useEffect, useState } from "react";
import styled from "styled-components";
import HubLayout from "../../hub/HubLayout";
import { art } from "../../hub/data/art";
import { Wrap, Eyebrow, H2, H3, Lede, Hand, Section, Reveal, Card, Grid, glass, display } from "../../hub/ui";

const Frame = styled.button`
  ${glass}
  background: rgba(8, 12, 40, 0.7);
  color: inherit;
  cursor: zoom-in;
  display: block;
  font: inherit;
  overflow: hidden;
  padding: 0.6rem;
  text-align: left;
  width: 100%;
  img { aspect-ratio: 4 / 5; border-radius: 10px; display: block; object-fit: cover; width: 100%; }
  figcaption { padding: 0.8rem 0.4rem 0.3rem; }
  b { display: block; font-family: ${display}; font-size: 1.3rem; font-weight: 600; }
  span { color: var(--muted); font-size: 0.9rem; }
`;

const Box = styled.div`
  align-items: center;
  background: rgba(3, 5, 18, 0.93);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 1.2rem;
  position: fixed;
  z-index: 50;
  figure { margin: 0; max-height: 100%; max-width: min(92vw, 900px); text-align: center; }
  img { border-radius: 10px; max-height: 78vh; max-width: 100%; }
  figcaption { color: var(--cream); margin-top: 0.8rem; }
  button { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(232, 194, 107, 0.5); border-radius: 999px; color: var(--gold2); cursor: pointer; font: inherit; font-weight: 600; padding: 0.55rem 1.1rem; position: absolute; right: 1rem; top: 1rem; }
`;

export default function Art() {
  const [open, setOpen] = useState(null);
  useEffect(() => {
    if (open == null) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const item = open != null ? art[open] : null;
  return (
    <HubLayout current="art" title="Art" description="Art made for Ash.">
      <Wrap>
        <Section style={{ paddingTop: "clamp(2rem, 7vw, 4rem)" }}>
          <Reveal>
            <Eyebrow>Art</Eyebrow>
            <H2>Things I made for you.</H2>
            <Lede>You're the artist. I'm just the guy who wanted to hang a few things on your wall. <Hand>Hang them anywhere you like.</Hand></Lede>
          </Reveal>
          <Grid cols={3}>
            <Reveal>
              <Card>
                <Eyebrow>Piece zero</Eyebrow>
                <H3>The sky above you</H3>
                <p>Look behind this page: the swirling night, the ringed stars and the crescent moon are painted in code, in the spirit of Van Gogh's <em>Starry Night</em>. The gold edges are for Klimt. The water-light at the very bottom is for Monet. It's the first thing I made for you here.</p>
              </Card>
            </Reveal>
            {art.map((a, i) => (
              <Reveal key={a.src} delay={(i % 3) * 0.06}>
                <Frame type="button" onClick={() => setOpen(i)} aria-label={`Open ${a.title}`}>
                  <img src={a.src} alt={a.title} loading="lazy" />
                  <figcaption><b>{a.title}</b><span>{a.note}{a.year ? ` · ${a.year}` : ""}</span></figcaption>
                </Frame>
              </Reveal>
            ))}
          </Grid>
          {art.length === 0 && (
            <Reveal>
              <p style={{ color: "var(--muted)", lineHeight: 1.7, marginTop: "1.4rem", maxWidth: "36rem" }}>
                More is on its way: real paintings and drawings, framed in gold. <Hand>Come back soon.</Hand>
              </p>
            </Reveal>
          )}
        </Section>
      </Wrap>
      {item && (
        <Box role="dialog" aria-modal="true" aria-label={item.title} onClick={() => setOpen(null)}>
          <button type="button" onClick={() => setOpen(null)}>Close ✕</button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={item.src} alt={item.title} />
            <figcaption><b>{item.title}</b>{item.note ? ` · ${item.note}` : ""}</figcaption>
          </figure>
        </Box>
      )}
    </HubLayout>
  );
}
