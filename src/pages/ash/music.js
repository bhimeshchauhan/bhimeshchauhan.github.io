import React from "react";
import styled from "styled-components";
import HubLayout from "../../hub/HubLayout";
import RagaNow from "../../hub/RagaNow";
import { slots, search } from "../../hub/data/ragas";
import { playlistUrl, artists } from "../../hub/data/music";
import { Wrap, Eyebrow, H2, H3, Lede, Hand, Section, Reveal, Card, Grid, Rule, display } from "../../hub/ui";

const Slots = styled.div`
  display: grid; gap: 0.7rem; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  div { background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(232, 194, 107, 0.2); border-radius: 12px; padding: 0.9rem 1rem; }
  b { color: var(--gold2); display: block; font-family: ${display}; font-size: 1.2rem; font-weight: 600; }
  span { color: var(--muted); font-size: 0.92rem; }
`;

const Artists = styled.ul`
  list-style: none; margin: 0; padding: 0; display: grid; gap: 0.6rem;
  li { align-items: center; background: rgba(255, 255, 255, 0.04); border-radius: 12px; display: flex; flex-wrap: wrap; gap: 0.3rem 1rem; justify-content: space-between; padding: 0.7rem 0.9rem; }
  b { font-family: ${display}; font-size: 1.25rem; font-weight: 600; }
  small { color: var(--muted); font-size: 0.86rem; margin-left: 0.5rem; }
  a { color: var(--gold2); font-size: 0.88rem; font-weight: 600; }
`;

const embedFor = (url) => {
  const m = url.match(/open\.spotify\.com\/(playlist|album|track)\/([A-Za-z0-9]+)/);
  return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}` : null;
};

export default function Music() {
  const embed = playlistUrl ? embedFor(playlistUrl) : null;
  return (
    <HubLayout current="music" title="Music" description="Indian classical music, a raga for every hour.">
      <Wrap>
        <Section style={{ paddingTop: "clamp(2rem, 7vw, 4rem)" }}>
          <Reveal>
            <Eyebrow>Music</Eyebrow>
            <H2>A raga for exactly this hour.</H2>
            <Lede>In Hindustani classical music, many ragas belong to a time of day or night. I thought you'd like a room that knows what time it is. <Hand>Press play, close your eyes.</Hand></Lede>
          </Reveal>
          <Grid cols={2}>
            <Reveal><RagaNow /></Reveal>
            <Reveal delay={0.08}>
              <Card>
                <Eyebrow>Learning violin?</Eyebrow>
                <H3>The violin belongs here too</H3>
                <p>The violin has a long life in Indian classical music, played in both the Hindustani and Carnatic traditions. If you want to hear what it can do beyond the squeaks, start with Dr. N. Rajam and L. Subramaniam below.</p>
                <p>And if you ever want to go to a concert together, I'm in. <a href={`https://www.google.com/search?q=${encodeURIComponent("Indian classical music concert Vancouver")}`} target="_blank" rel="noopener noreferrer">Search what's on near us ↗</a></p>
              </Card>
            </Reveal>
          </Grid>

          {embed && (
            <Reveal>
              <div style={{ marginTop: "1.4rem" }}>
                <iframe title="Our playlist" src={embed} width="100%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" style={{ borderRadius: 14 }} />
              </div>
            </Reveal>
          )}

          <Rule />

          <Reveal>
            <H2>The whole day, in ragas</H2>
            <Lede>These are the traditional pairings. They're a guide, not a rule, so listen whenever you like.</Lede>
            <Slots>
              {slots.map((s) => (
                <div key={s.label}><b>{s.label}</b><span>{s.ragas.join(" · ")}</span></div>
              ))}
            </Slots>
          </Reveal>

          <Rule />

          <Reveal>
            <H2>Places to start listening</H2>
            <Lede>A few artists to type into the search bar on a rainy afternoon.</Lede>
            <Artists>
              {artists.map((a) => (
                <li key={a.name}>
                  <span><b>{a.name}</b><small>{a.what}</small></span>
                  <span>
                    <a href={search(a.name).youtube} target="_blank" rel="noopener noreferrer">YouTube ↗</a>
                    {" · "}
                    <a href={search(a.name).spotify} target="_blank" rel="noopener noreferrer">Spotify ↗</a>
                  </span>
                </li>
              ))}
            </Artists>
          </Reveal>
        </Section>
      </Wrap>
    </HubLayout>
  );
}
