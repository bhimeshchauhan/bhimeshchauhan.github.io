import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { slotFor, search } from "./data/ragas";
import { ragaVideos } from "./data/ragaVideos";
import VideoCard from "./VideoCard";
import { motion, AnimatePresence } from "framer-motion";
import { Card, GhostButton, H3, display } from "./ui";

const Box = styled(Card)`
  .time { color: var(--gold); font-size: 0.74rem; font-weight: 700; letter-spacing: 0.2em; margin: 0 0 0.5rem; text-transform: uppercase; }
  .pills { display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 0.9rem 0; }
  .pills button { background: transparent; border: 1px solid rgba(232, 194, 107, 0.45); border-radius: 999px; color: var(--gold2); cursor: pointer; font: inherit; font-family: ${display}; font-size: 1.15rem; font-weight: 600; min-height: 40px; padding: 0 1rem; }
  .pills button[aria-pressed="true"] { background: var(--gold); color: #14122a; }
  .more { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.9rem !important; }
  .more a { border: 1px solid rgba(232, 194, 107, 0.4); border-radius: 999px; font-size: 0.82rem; font-weight: 600; letter-spacing: 0.04em; padding: 0.4rem 0.95rem; text-decoration: none; white-space: nowrap; }
  .more a:hover { background: rgba(232, 194, 107, 0.14); }
`;

const Panel = styled(Box)`
  display: grid; gap: 1.4rem; grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr);
  @media (max-width: 760px) { grid-template-columns: 1fr; }
  .pills { margin-top: 0; }
`;

// The raga for exactly this hour (from the clock on her own device). The card is short; the video opens below it on request.
export function useRaga() {
  const [slot, setSlot] = useState(null);
  const [sel, setSel] = useState(0);
  useEffect(() => {
    setSlot(slotFor());
    const t = setInterval(() => setSlot((s) => { const n = slotFor(); return s && s.label === n.label ? s : n; }), 60000);
    return () => clearInterval(t);
  }, []);
  const s = slot || slotFor(new Date(2000, 0, 1, 20)); // evening on the server render; fixed up on the client
  const raga = s.ragas[Math.min(sel, s.ragas.length - 1)];
  return { s, ready: !!slot, sel, setSel, raga, video: ragaVideos[raga] };
}

export function RagaCard({ r, open, onToggle }) {
  return (
    <Box>
      <p className="time">{r.ready ? r.s.label : "For this hour"}</p>
      <H3>A raga for right now</H3>
      <p style={{ color: "var(--gold2)", fontFamily: display, fontSize: "1.9rem", fontWeight: 600, lineHeight: 1.1, margin: "0.3rem 0 0.6rem" }}>{r.raga}</p>
      <p>Traditionally played in the {r.s.label.toLowerCase()}.</p>
      <GhostButton type="button" aria-expanded={open} onClick={onToggle}>{open ? "Hide ▴" : "Listen ▾"}</GhostButton>
    </Box>
  );
}

export function RagaPanel({ r, open }) {
  const { s, sel, setSel, raga, video } = r;
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: "hidden" }}>
          <Panel as="div" style={{ marginTop: "1.2rem" }}>
            <div>
              <H3>Choose a raga</H3>
              <div className="pills" role="group" aria-label="Choose a raga">
                {s.ragas.map((x, i) => <button key={x} type="button" aria-pressed={i === sel} onClick={() => setSel(i)}>{x}</button>)}
              </div>
              <p className="more"><a href={search(`raga ${raga}`).youtube} target="_blank" rel="noopener noreferrer">More on YouTube</a><a href={search(`raga ${raga}`).spotify} target="_blank" rel="noopener noreferrer">Spotify</a></p>
            </div>
            {video ? <VideoCard key={video.id} id={video.id} title={video.title} /> : null}
          </Panel>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
