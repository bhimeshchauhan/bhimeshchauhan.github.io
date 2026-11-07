import React, { useEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FEED_URL, FEED_KEY } from "../../utils/art";

const display = `"Space Grotesk", "Inter", sans-serif`;
// A slight downward tilt (rotateX) makes the ring read as a ring, not a flat row.
// --back pushes the whole ring away by its radius so front cards render at true size (no magnified, clipped cards).
const shimmer = keyframes`from{background-position:200% 0}to{background-position:-200% 0}`;
const spin = keyframes`from{transform:translateZ(var(--back)) rotateX(-5deg) rotateY(0)}to{transform:translateZ(var(--back)) rotateX(-5deg) rotateY(360deg)}`;

// Full-bleed (breaks out of the page column) with soft faded ends instead of a hard clip.
const Stage = styled.div`
  height: clamp(290px, 38vw, 470px);
  touch-action: pan-y;
  margin: 0 0 3rem calc(50% - 50vw);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent);
  overflow: hidden;
  perspective: 1100px;
  position: relative;
  width: 100vw;
`;
const Carousel = styled.div`
  animation: ${spin} var(--dur, 60s) linear infinite;
  animation-play-state: ${(p) => (p.$paused ? "paused" : "running")};
  height: 100%;
  left: 50%;
  position: absolute;
  top: 0;
  transform-style: preserve-3d;
  width: 0;
  @media (prefers-reduced-motion: reduce) { animation: none; }
`;
const Card = styled.button`
  background: linear-gradient(100deg, #11131c 30%, #262b3d 50%, #11131c 70%) 0 0 / 200% 100%;
  animation: ${shimmer} 1.6s linear infinite;
  &.ready, &.ghost.ready { animation: none; background: #11131c; }
  &.ghost { pointer-events: none; }
  border: 1px solid var(--line);
  border-radius: 18px;
  cursor: pointer;
  height: clamp(200px, 28vw, 330px);
  left: calc(var(--w) / -2);
  margin-top: clamp(16px, 2.5vw, 36px);
  padding: 0;
  position: absolute;
  transform-style: preserve-3d;
  transition: border-color 0.25s ease, filter 0.25s ease;
  width: var(--w);
  &:hover, &:focus-visible { border-color: var(--accent); filter: brightness(1.12); }
  img { backface-visibility: hidden; border-radius: 17px; display: block; height: 100%; object-fit: cover; opacity: 0; pointer-events: none; transition: opacity 0.45s ease; width: 100%; }
  &.ready img { opacity: 1; }
  /* Card back: cards on the far side of the ring show a dark panel instead of a mirrored drawing. */
  &::after { background: linear-gradient(160deg, #161a28, #0b0d14); backface-visibility: hidden; border-radius: 17px; content: ""; inset: 0; position: absolute; transform: rotateY(180deg); }
`;

const Overlay = styled(motion.div)`
  align-items: center;
  background: rgba(5, 6, 10, 0.82);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 1.25rem;
  position: fixed;
  z-index: 1200;
  perspective: 1600px;
`;
const Flip = styled(motion.div)`
  background: #0e1018;
  border: 1px solid var(--line);
  border-radius: 24px;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
  display: grid;
  gap: 0;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  max-height: min(88vh, 760px);
  max-width: 1000px;
  overflow: hidden;
  width: 100%;
  @media (max-width: 800px) { grid-template-columns: 1fr; max-height: 92vh; overflow-y: auto; && img { height: auto; max-height: 38vh; } }
  img { background: #000; display: block; height: 100%; max-height: 88vh; object-fit: contain; width: 100%; }
  .info { display: flex; flex-direction: column; gap: 1rem; padding: 1.75rem; overflow-y: auto; }
  .info small { color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; font-size: 0.75rem; }
  .info p { color: var(--ink); line-height: 1.6; margin: 0; white-space: pre-wrap; overflow-wrap: anywhere; }
  .row { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: auto; }
  .row a, .row button { align-items: center; display: inline-flex; min-height: 44px; background: transparent; border: 1px solid var(--line); border-radius: 999px; color: var(--ink); cursor: pointer; font: 600 0.9rem "Inter", sans-serif; padding: 0.55rem 1.1rem; text-decoration: none; transition: background .2s, color .2s, border-color .2s; }
  .row .primary { background: var(--accent); border-color: var(--accent); color: #0b0d12; }
  .row a:hover, .row button:hover { border-color: var(--accent); }
  h3 { color: var(--ink); font-family: ${display}; font-size: 1.5rem; letter-spacing: -0.02em; margin: 0; }
`;

const Empty = styled.p`color: var(--muted); padding: 3rem 0; text-align: center;`;

const Ring = ({ onCommission }) => {
  const reduce = useReducedMotion();
  const [items, setItems] = useState(null); // null = loading
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(null);
  const [hover, setHover] = useState(false);
  const closeRef = useRef(null);
  const [w, setW] = useState(200); // card width: smaller on phones/tablets so several cards stay in view
  useEffect(() => {
    const f = () => setW(window.innerWidth < 600 ? 140 : window.innerWidth < 1000 ? 170 : 200);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);

  useEffect(() => {
    let live = true;
    fetch(FEED_URL, { headers: { Authorization: `Bearer ${FEED_KEY}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => live && setItems(d.items || []))
      .catch(() => live && (setFailed(true), setItems([])));
    return () => { live = false; };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    if (closeRef.current) closeRef.current.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (items === null) {
    const n = 12;
    const r = Math.round((w + 16) / (2 * Math.tan(Math.PI / n)));
    return (
      <>
        <Stage aria-hidden="true">
          <Carousel style={{ "--dur": "60s", "--back": `${-r}px` }}>
            {Array.from({ length: n }, (_, i) => (
              <Card as="div" className="ghost" key={i} style={{ "--w": `${w}px`, transform: `rotateY(${(360 / n) * i}deg) translateZ(${r}px)` }} />
            ))}
          </Carousel>
        </Stage>
        <Empty role="status" style={{ paddingTop: 0 }}>Loading the gallery…</Empty>
      </>
    );
  }
  if (!items.length) return <Empty>{failed ? "The live feed is unavailable right now." : "No posts to show yet."}</Empty>;

  // Repeat items so the ring is always full (>= 12 cards), then size the radius so neighbours nearly touch.
  const base = items.slice(0, 24);
  const shown = base.length >= 12 ? base : Array.from({ length: 12 }, (_, i) => base[i % base.length]);
  const gap = 16;
  const radius = Math.round((w + gap) / (2 * Math.tan(Math.PI / shown.length)));
  return (
    <>
      <Stage onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <Carousel $paused={hover || !!open} style={{ "--dur": `${Math.max(40, shown.length * 5)}s`, "--back": `${-radius}px` }}>
          {shown.map((it, i) => (
            <Card
              key={`${it.id}-${i}`}
              type="button"
              style={{ "--w": `${w}px`, transform: `rotateY(${(360 / shown.length) * i}deg) translateZ(${radius}px)` }}
              aria-label={`Open artwork ${i + 1}${it.caption ? ": " + it.caption.slice(0, 60) : ""}`}
              onClick={() => setOpen(it)}
            >
              <img src={it.image} alt="" loading="lazy" decoding="async" ref={(el) => { if (el && el.complete) el.parentElement.classList.add("ready"); }} onLoad={(e) => e.currentTarget.parentElement.classList.add("ready")} />
            </Card>
          ))}
        </Carousel>
      </Stage>
      <AnimatePresence>
        {open && (
          <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <Flip
              role="dialog"
              aria-modal="true"
              aria-label="Artwork"
              initial={reduce ? { opacity: 0 } : { rotateY: -90, opacity: 0, scale: 0.9 }}
              animate={reduce ? { opacity: 1 } : { rotateY: 0, opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { rotateY: 90, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={open.image} alt={open.caption ? open.caption.slice(0, 120) : "Artwork"} />
              <div className="info">
                <small>{new Date(open.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</small>
                <h3>The piece</h3>
                <p>{open.caption || "No caption."}</p>
                <div className="row">
                  <button type="button" className="primary" onClick={() => { setOpen(null); onCommission(open); }}>Commission something like this</button>
                  <a href={open.link} target="_blank" rel="noopener noreferrer">View on Instagram ↗</a>
                  <button type="button" ref={closeRef} onClick={() => setOpen(null)}>Close</button>
                </div>
              </div>
            </Flip>
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default Ring;
