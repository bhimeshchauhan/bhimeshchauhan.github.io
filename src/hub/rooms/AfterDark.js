import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import useLocal from "../useLocal";
import { Eyebrow, H2, H3, Lede, Hand, Card, Grid, Reveal, GhostButton, Rule, display } from "../ui";

// Scary movies, good books, one candle. Everything she ticks or adds is saved on her own device only.
const films = [
  ["Hereditary", 2018], ["The Babadook", 2014], ["The Thing", 1982], ["Let the Right One In", 2008],
  ["The Witch", 2015], ["Suspiria", 1977], ["Get Out", 2017], ["Midsommar", 2019]
];

const Candle = styled.div`
  display: flex; justify-content: center; margin: 0 0 1.4rem;
  .flame { animation: flick 1.6s ease-in-out infinite; background: radial-gradient(ellipse at 50% 70%, #fff6cf, #ffc656 55%, rgba(255, 140, 40, 0) 75%); border-radius: 50% 50% 50% 50% / 62% 62% 38% 38%; filter: drop-shadow(0 0 16px rgba(255, 190, 80, 0.9)); height: 38px; transform-origin: 50% 100%; width: 20px; }
  .wax { background: linear-gradient(90deg, #d7cdb4, #f3ead2 50%, #cdbf9f); border-radius: 4px; height: 56px; margin-top: 3px; width: 26px; }
  .stack { align-items: center; display: flex; flex-direction: column; }
  @keyframes flick { 0%, 100% { transform: scale(1, 1) rotate(-1deg); } 25% { transform: scale(0.94, 1.06) rotate(2deg); } 50% { transform: scale(1.05, 0.96) rotate(-2deg); } 75% { transform: scale(0.97, 1.04) rotate(1deg); } }
  @media (prefers-reduced-motion: reduce) { .flame { animation: none; } }
`;

// "Lights out": the page goes dark and only a small circle around the pointer (or finger) is visible.
const Dark = styled.div`
  background: radial-gradient(circle ${(p) => p.r}px at var(--sx, 50%) var(--sy, 40%), rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.55) 55%, rgba(0, 0, 0, 0.96) 100%);
  inset: 0;
  pointer-events: none;
  position: fixed;
  z-index: 30;
`;

const List = styled.ul`
  list-style: none; margin: 0.8rem 0 0; padding: 0; display: grid; gap: 0.5rem;
  li { align-items: center; background: rgba(255, 255, 255, 0.04); border-radius: 12px; display: flex; gap: 0.8rem; padding: 0.6rem 0.8rem; }
  label { align-items: center; cursor: pointer; display: flex; flex: 1; gap: 0.8rem; min-height: 40px; }
  input[type="checkbox"] { accent-color: var(--gold); height: 20px; width: 20px; }
  b { font-family: ${display}; font-size: 1.2rem; font-weight: 600; }
  small { color: var(--muted); margin-left: 0.4rem; }
  .done b { opacity: 0.55; text-decoration: line-through; }
  .x { background: none; border: 0; color: var(--muted); cursor: pointer; font-size: 1.1rem; padding: 0.3rem 0.5rem; }
`;

const Add = styled.form`
  display: flex; flex-wrap: wrap; gap: 0.6rem; margin-top: 0.9rem;
  input { background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(232, 194, 107, 0.35); border-radius: 999px; color: var(--cream); flex: 1; font: inherit; min-height: 44px; min-width: 180px; padding: 0 1rem; }
`;

function Checklist({ storeKey, seed, placeholder, empty }) {
  const [items, setItems] = useLocal(storeKey, seed);
  const [text, setText] = useState("");
  return (
    <>
      <List>
        {items.map((it, i) => (
          <li key={it.t + i} className={it.done ? "done" : ""}>
            <label>
              <input type="checkbox" checked={!!it.done} onChange={() => setItems((cur) => cur.map((x, j) => (j === i ? { ...x, done: !x.done } : x)))} />
              <span><b>{it.t}</b>{it.y ? <small>{it.y}</small> : null}</span>
            </label>
            <button type="button" className="x" aria-label={`Remove ${it.t}`} onClick={() => setItems((cur) => cur.filter((_, j) => j !== i))}>✕</button>
          </li>
        ))}
        {items.length === 0 && <li style={{ color: "var(--muted)" }}>{empty}</li>}
      </List>
      <Add onSubmit={(e) => { e.preventDefault(); const t = text.trim(); if (!t) return; setItems((cur) => [...cur, { t, done: false }]); setText(""); }}>
        <input aria-label={placeholder} placeholder={placeholder} value={text} onChange={(e) => setText(e.target.value)} />
        <GhostButton type="submit">Add</GhostButton>
      </Add>
    </>
  );
}

export default function AfterDark() {
  const [dark, setDark] = useState(false);
  const raf = useRef(0);
  useEffect(() => {
    if (!dark) return undefined;
    const move = (x, y) => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--sx", `${x}px`);
        document.documentElement.style.setProperty("--sy", `${y}px`);
      });
    };
    const onPointer = (e) => move(e.clientX, e.clientY);
    const onTouch = (e) => e.touches[0] && move(e.touches[0].clientX, e.touches[0].clientY);
    const onKey = (e) => e.key === "Escape" && setDark(false);
    move(window.innerWidth / 2, window.innerHeight * 0.4);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.removeProperty("--sx");
      document.documentElement.style.removeProperty("--sy");
    };
  }, [dark]);

  return (
    <>
      {dark && <Dark r={typeof window !== "undefined" && window.innerWidth < 600 ? 120 : 170} aria-hidden="true" />}
      <Reveal>
        <Eyebrow>After dark</Eyebrow>
        <H2>Scary movies, good books, one candle.</H2>
        <Lede>For the nights you want something to read, something to watch, or something to jump at. <Hand>I'll hold the blanket.</Hand></Lede>
        <Candle aria-hidden="true"><div className="stack"><div className="flame" /><div className="wax" /></div></Candle>
        <GhostButton type="button" aria-pressed={dark} onClick={() => setDark((d) => !d)}>{dark ? "Lights on (or press Esc)" : "Lights out 🕯️"}</GhostButton>
        <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginTop: "0.6rem" }}>Lights out makes the page go dark, so you only see a small circle around your cursor or finger.</p>
      </Reveal>

      <Rule />

      <Grid cols={2}>
        <Reveal>
          <Card>
            <H3>The scream queue</H3>
            <p>A few of my ideas to get you started. Tell me what you've already seen, tick what we've watched, and add your own.</p>
            <Checklist
              storeKey="ash-hub-films-v1"
              seed={films.map(([t, y]) => ({ t, y, done: false }))}
              placeholder="Add a movie…"
              empty="Nothing in the queue. Add something terrifying."
            />
          </Card>
        </Reveal>
        <Reveal delay={0.08}>
          <Card>
            <H3>The reading nook</H3>
            <p>What are you reading right now? Keep a little shelf of what's next and what you've finished. It stays on your device.</p>
            <Checklist storeKey="ash-hub-books-v1" seed={[]} placeholder="Add a book…" empty="The shelf is empty. What's the next one?" />
          </Card>
        </Reveal>
      </Grid>
    </>
  );
}
