import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import Room from "../../hub/Room";
import { Tabs, Swap } from "../../hub/motion";
import { artworks } from "../../hub/artworks";
import { art as mine } from "../../hub/data/art";
import { glass, display, Hand, Grid, Card, H3 } from "../../hub/ui";

const Chips = styled.div`display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0 0 1.2rem; button { background: transparent; border: 1px solid rgba(232,194,107,.4); border-radius: 999px; color: var(--gold2); cursor: pointer; font: inherit; font-size: .88rem; font-weight: 600; min-height: 40px; padding: 0 1rem; } button[aria-pressed="true"] { background: var(--gold); color: #14122a; }`;
const Tile = styled(motion.figure)`${glass} cursor: zoom-in; margin: 0; overflow: hidden; img { display: block; width: 100%; } figcaption { padding: 0.9rem 1rem 1.1rem; } b { display: block; font-family: ${display}; font-size: 1.45rem; font-weight: 600; line-height: 1.15; } span { color: var(--gold); font-size: 0.8rem; font-weight: 600; letter-spacing: .06em; } p { color: var(--muted); font-size: .92rem; line-height: 1.5; margin: .5rem 0 0; }`;
const Cols = styled.div`columns: 3 280px; column-gap: 1.1rem; > * { break-inside: avoid; margin-bottom: 1.1rem; }`;
const Box = styled(motion.div)`align-items: center; background: rgba(3,5,18,.94); display: flex; inset: 0; justify-content: center; padding: 1rem; position: fixed; z-index: 60; figure { margin: 0; max-width: min(94vw, 980px); text-align: center; } img { border-radius: 10px; max-height: 76vh; max-width: 100%; } figcaption { color: var(--cream); margin-top: .8rem; line-height: 1.5; } a { color: var(--gold2); }`;

const groups = [["all", "All"], ["Vincent van Gogh", "Van Gogh"], ["Claude Monet", "Monet"], ["Gustav Klimt", "Klimt"], ["other", "More"]];

export default function Gallery() {
  const [tab, setTab] = useState("love");
  const [f, setF] = useState("all");
  const [open, setOpen] = useState(null);
  useEffect(() => { if (!open) return undefined; const k = (e) => e.key === "Escape" && setOpen(null); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [open]);
  const known = groups.map((g) => g[0]);
  const shown = artworks.filter((a) => f === "all" || a.artist === f || (f === "other" && !known.includes(a.artist)));
  return (
    <Room roomKey="gallery" art="starry" kicker="Gallery" title="Paintings she'd love" lede="Free to look at, public domain, and each one with a reason it might be hers.">
      <Tabs tabs={[["love", "Paintings she'd love"], ["made", "Made for her"]]} value={tab} onChange={setTab} id="gal" />
      <Swap k={tab}>
        {tab === "love" ? (
          <>
            <Chips>{groups.map(([k, l]) => <button key={k} type="button" aria-pressed={f === k} onClick={() => setF(k)}>{l}</button>)}</Chips>
            <Cols>
              <AnimatePresence mode="popLayout">
                {shown.map((a) => (
                  <Tile key={a.id} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 260, damping: 26 }} onClick={() => setOpen(a)}>
                    <motion.img layoutId={`img-${a.id}`} src={a.src} alt={`${a.title} by ${a.artist}`} loading="lazy" />
                    <figcaption><span>{a.artist.toUpperCase()} · {a.year}</span><b>{a.title}</b><p>{a.why}</p></figcaption>
                  </Tile>
                ))}
              </AnimatePresence>
            </Cols>
          </>
        ) : mine.length ? (
          <Cols>{mine.map((a) => <Tile key={a.src} whileHover={{ y: -6 }}><img src={a.src} alt={a.title} loading="lazy" onError={(e) => { const f = e.currentTarget.closest("figure"); if (f) f.style.display = "none"; }} /><figcaption><b>{a.title}</b><p>{a.note}{a.year ? ` · ${a.year}` : ""}</p></figcaption></Tile>)}</Cols>
        ) : (
          <Card><H3>Coming soon</H3><p>Real paintings and drawings, made just for her, will hang here. <Hand>Work in progress.</Hand></p></Card>
        )}
      </Swap>
      <AnimatePresence>
        {open && (
          <Box initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label={open.title}>
            <figure onClick={(e) => e.stopPropagation()}>
              <motion.img layoutId={`img-${open.id}`} src={open.src} alt={open.title} />
              <figcaption><b>{open.title}</b>, {open.artist}, {open.year}<br />{open.museum} · <a href={open.page} target="_blank" rel="noopener noreferrer">public domain ↗</a> · press Esc to close</figcaption>
            </figure>
          </Box>
        )}
      </AnimatePresence>
    </Room>
  );
}
