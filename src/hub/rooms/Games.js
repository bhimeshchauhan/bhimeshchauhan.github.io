import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import useLocal from "../useLocal";
import { Eyebrow, H2, H3, Lede, Hand, Card, Grid, Reveal, GhostButton, display, glass } from "../ui";

// Two small games: connect the stars to find the cat, and match the things Ash loves.
const PTS = [[0.05, 0], [0, 0.55], [0.25, 1], [0.75, 1], [1, 0.55], [0.95, 0], [0.72, 0.28], [0.28, 0.28], [0.3, 0.62], [0.7, 0.62], [0.5, 0.78]];
// Connect the outline (1 to 8), close it back at star 1, then add the eyes and the nose.
const SEQ = [0, 1, 2, 3, 4, 5, 6, 7, 0, 8, 9, 10];
const X = (n) => 60 + n * 200;
const Y = (n) => 40 + n * 200;

const Board = styled.div`
  ${glass}
  padding: 0.8rem;
  svg { display: block; height: auto; touch-action: manipulation; width: 100%; }
  .star { cursor: pointer; outline: none; }
  .star text { fill: #14122a; font-size: 9px; font-weight: 700; pointer-events: none; text-anchor: middle; }
  .star:focus-visible circle.core { stroke: #fff; stroke-width: 2; }
  .shake { animation: shake 0.35s; }
  @keyframes shake { 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }
  @media (prefers-reduced-motion: reduce) { .shake { animation: none; } }
  .msg { color: var(--cream); margin: 0.5rem 0.2rem 0.2rem; min-height: 1.6em; text-align: center; }
`;

function FindTheCat() {
  const [step, setStep] = useState(0);
  const [wrong, setWrong] = useState(-1);
  const win = step >= SEQ.length;
  const click = (i) => {
    if (win) return;
    if (i === SEQ[step]) setStep(step + 1);
    else { setWrong(i); setTimeout(() => setWrong(-1), 400); }
  };
  const label = (i) => (i <= 7 ? i + 1 : i - 7 + 8); // outline stars are 1-8; eyes and nose are 9-11
  const next = SEQ[step];
  const done = SEQ.slice(0, step);
  return (
    <Board>
      <svg viewBox="0 0 320 290" role="group" aria-label="Constellation game: tap the stars in order to find the cat">
        <rect width="320" height="290" rx="14" fill="rgba(5,8,30,0.6)" />
        {done.slice(1).map((s, k) => (
          <line key={k} x1={X(PTS[done[k]][0])} y1={Y(PTS[done[k]][1])} x2={X(PTS[s][0])} y2={Y(PTS[s][1])} stroke="#f6e3a6" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
        ))}
        {PTS.map((p, i) => {
          const lit = done.includes(i), isNext = !win && i === next;
          return (
            <g key={i} className={`star ${wrong === i ? "shake" : ""}`} tabIndex={0} role="button" aria-label={`Star ${label(i)}`} onClick={() => click(i)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), click(i))}>
              <circle cx={X(p[0])} cy={Y(p[1])} r="16" fill="transparent" />
              {isNext && <circle cx={X(p[0])} cy={Y(p[1])} r="14" fill="none" stroke="#f0aec3" strokeWidth="1.5" opacity="0.7" />}
              <circle className="core" cx={X(p[0])} cy={Y(p[1])} r="9" fill={lit ? "#ffe9a0" : "#9fb2ee"} />
              <text x={X(p[0])} y={Y(p[1]) + 3}>{label(i)}</text>
            </g>
          );
        })}
        {win && <text x="160" y="278" textAnchor="middle" fontSize="22">🐈</text>}
      </svg>
      <p className="msg" aria-live="polite">
        {win ? "You found her! She's very pleased with herself. 🐈" : step === 0 ? "Tap the stars in order, starting at 1." : step === 8 ? "Now close the shape: back to star 1." : `Next: star ${label(next)}.`}
      </p>
      <p style={{ textAlign: "center", margin: "0.3rem 0 0.2rem" }}><GhostButton type="button" onClick={() => setStep(0)}>{win ? "Play again" : "Start over"}</GhostButton></p>
    </Board>
  );
}

const EMOJI = ["🐈", "🥾", "🎻", "🎿", "🥊", "🎨", "📚", "👻"];
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const deal = (shuffled) => (shuffled ? shuffle([...EMOJI, ...EMOJI]) : [...EMOJI, ...EMOJI]).map((e, id) => ({ id, e }));

const Deck = styled.div`
  ${glass}
  padding: 0.8rem;
  .grid { display: grid; gap: 0.5rem; grid-template-columns: repeat(4, 1fr); }
  .card { aspect-ratio: 1; background: linear-gradient(145deg, #1b2a6f, #0d1342); border: 1px solid rgba(232, 194, 107, 0.4); border-radius: 12px; color: var(--gold2); cursor: pointer; font-size: clamp(1.6rem, 7vw, 2.4rem); font-family: ${display}; }
  .card[data-up="true"] { background: rgba(246, 239, 220, 0.95); }
  .card[data-match="true"] { background: rgba(240, 174, 195, 0.35); border-color: var(--rose); cursor: default; }
  .hub-info { color: var(--muted); display: flex; flex-wrap: wrap; gap: 0.4rem 1rem; justify-content: space-between; margin: 0.6rem 0.2rem 0.2rem; }
`;

function Pairs() {
  const [cards, setCards] = useState(() => deal(false)); // the same on the server; shuffled once on the client
  const [up, setUp] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useLocal("ash-hub-pairs-best", 0);
  const lock = useRef(false);
  useEffect(() => { setCards(deal(true)); }, []);
  const win = matched.length === cards.length;
  useEffect(() => { if (win && moves && (!best || moves < best)) setBest(moves); }, [win]); // eslint-disable-line react-hooks/exhaustive-deps
  const flip = (c) => {
    if (lock.current || up.includes(c.id) || matched.includes(c.id)) return;
    const now = [...up, c.id];
    setUp(now);
    if (now.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = now.map((id) => cards.find((x) => x.id === id));
      if (a.e === b.e) { setMatched((m) => [...m, a.id, b.id]); setUp([]); }
      else { lock.current = true; setTimeout(() => { setUp([]); lock.current = false; }, 750); }
    }
  };
  const again = () => { setCards(deal(true)); setUp([]); setMatched([]); setMoves(0); };
  return (
    <Deck>
      <div className="grid">
        {cards.map((c) => {
          const open = up.includes(c.id) || matched.includes(c.id);
          return <button key={c.id} type="button" className="card" data-up={open} data-match={matched.includes(c.id)} aria-label={open ? c.e : "Hidden card"} onClick={() => flip(c)}>{open ? c.e : "✦"}</button>;
        })}
      </div>
      <div className="hub-info">
        <span aria-live="polite">{win ? "All matched! 💛" : `Moves: ${moves}`}</span>
        <span>{best ? `Best: ${best}` : ""}</span>
        <GhostButton type="button" onClick={again}>{win ? "Play again" : "Shuffle"}</GhostButton>
      </div>
    </Deck>
  );
}

export default function Games() {
  return (
    <>
      <Grid cols={2}>
        <Reveal><Card><H3>Find the cat</H3><p>There's a cat hiding in the sky. Connect the stars to find her.</p><FindTheCat /></Card></Reveal>
        <Reveal delay={0.08}><Card><H3>Pairs</H3><p>Match the pairs: the cat, the trail, the violin, the skis, the gloves, the paint, the book and the ghost.</p><Pairs /></Card></Reveal>
      </Grid>
    </>
  );
}
