import React, { useState } from "react";
import styled from "styled-components";
import Room from "../../hub/Room";
import { useRaga, RagaCard, RagaPanel } from "../../hub/RagaNow";
import { Tabs, Swap, Stagger, Item } from "../../hub/motion";
import { slots, search } from "../../hub/data/ragas";
import { playlistUrl, artists } from "../../hub/data/music";
import { Card, Grid, H3, Hand, display } from "../../hub/ui";

const Row = styled.div`
  align-items: center; background: rgba(255, 255, 255, 0.04); border-radius: 12px; display: flex; flex-wrap: wrap; gap: 0.3rem 1rem; justify-content: space-between; padding: 0.7rem 0.9rem;
  b { font-family: ${display}; font-size: 1.25rem; font-weight: 600; } small { color: var(--muted); margin-left: 0.5rem; } a { color: var(--gold2); font-size: 0.88rem; font-weight: 600; }
`;
const embedFor = (url) => { const m = url.match(/open\.spotify\.com\/(playlist|album|track)\/([A-Za-z0-9]+)/); return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}` : null; };

export default function Music() {
  const [tab, setTab] = useState("now");
  const raga = useRaga();
  const [listen, setListen] = useState(true);
  const embed = playlistUrl ? embedFor(playlistUrl) : null;
  return (
    <Room roomKey="music" art="lilies" kicker="Music" title="A raga for every hour" lede="In Hindustani classical music, many ragas belong to a time of day. This room knows what time it is.">
      <Tabs tabs={[["now", "Right now"], ["day", "The whole day"], ["listen", "Listen next"]]} value={tab} onChange={setTab} id="mus" />
      <Swap k={tab}>
        {tab === "now" && (
          <Stagger><Grid cols={2}>
            <Item><RagaCard r={raga} open={listen} onToggle={() => setListen((o) => !o)} /></Item>
            <Item><Card><H3>Learning violin?</H3><p>The violin has a long life in Indian classical music, in both the Hindustani and Carnatic traditions. Try Dr. N. Rajam and L. Subramaniam.</p><p><a href={`https://www.google.com/search?q=${encodeURIComponent("Indian classical music concert Vancouver")}`} target="_blank" rel="noopener noreferrer">Concerts near us ↗</a> <Hand>I’m in.</Hand></p></Card></Item>
          </Grid><RagaPanel r={raga} open={listen} /></Stagger>
        )}
        {tab === "day" && (
          <Stagger><Grid cols={3}>{slots.map((s) => (<Item key={s.label}><Card><H3>{s.label}</H3><p>{s.ragas.join(" · ")}</p></Card></Item>))}</Grid>
            <p style={{ color: "var(--muted)", marginTop: "1rem" }}>Traditional pairings. A guide, not a rule: listen whenever you like.</p></Stagger>
        )}
        {tab === "listen" && (
          <Stagger style={{ display: "grid", gap: "0.6rem" }}>
            {embed && <Item><iframe title="Our playlist" src={embed} width="100%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen" loading="lazy" style={{ borderRadius: 14 }} /></Item>}
            {artists.map((a) => (<Item key={a.name}><Row><span><b>{a.name}</b><small>{a.what}</small></span><span><a href={search(a.name).youtube} target="_blank" rel="noopener noreferrer">YouTube ↗</a> · <a href={search(a.name).spotify} target="_blank" rel="noopener noreferrer">Spotify ↗</a></span></Row></Item>))}
          </Stagger>
        )}
      </Swap>
    </Room>
  );
}
