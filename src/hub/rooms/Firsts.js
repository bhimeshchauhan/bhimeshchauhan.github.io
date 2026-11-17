import React, { useState } from "react";
import styled from "styled-components";
import useLocal from "../useLocal";
import { Eyebrow, H2, H3, Lede, Hand, Card, Grid, Reveal, GhostButton, Rule, display, glass } from "../ui";

// Things Ash is trying for the first time. Her progress and notes are saved on her own device only.
const base = [
  { id: "violin", emoji: "🎻", title: "Violin", line: "Squeaks are allowed. Squeaks are, honestly, chapter one." },
  { id: "skiing", emoji: "🎿", title: "Skiing", line: "Powder days, and one very graceful fall." },
  { id: "boxing", emoji: "🥊", title: "Boxing", line: "Hands up. Heart up too." },
  { id: "painting", emoji: "🎨", title: "Painting", line: "The Starry Night did not happen in a day." }
];
const steps = ["Someday", "Trying it", "Did it!"];

// Trail ideas around Vancouver. They're my ideas, not a guide: always check conditions, closures and any passes first.
const trails = [
  ["Quarry Rock", "Deep Cove, North Vancouver"],
  ["Lynn Canyon", "North Vancouver"],
  ["Grouse Grind", "North Vancouver"],
  ["Stawamus Chief", "Squamish"],
  ["Garibaldi Lake", "Garibaldi Provincial Park (check day-pass rules)"]
];

const Mountain = styled.div`
  ${glass}
  padding: 1rem 1rem 0.4rem;
  svg { display: block; height: auto; width: 100%; }
  .caption { color: var(--muted); font-size: 0.92rem; margin: 0.3rem 0 0.8rem; text-align: center; }
`;

const Item = styled(Card)`
  .top { align-items: center; display: flex; gap: 0.9rem; margin-bottom: 0.6rem; }
  .emoji { font-size: 2.2rem; line-height: 1; }
  h3 { margin: 0; }
  .seg { display: grid; gap: 0.4rem; grid-template-columns: repeat(3, 1fr); margin: 0.9rem 0; }
  .seg button { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(232, 194, 107, 0.3); border-radius: 10px; color: var(--muted); cursor: pointer; font: inherit; font-size: 0.86rem; font-weight: 600; min-height: 42px; }
  .seg button[aria-pressed="true"] { background: var(--gold); border-color: var(--gold); color: #14122a; }
  textarea { background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(232, 194, 107, 0.28); border-radius: 10px; color: var(--cream); font: inherit; font-size: 0.95rem; min-height: 74px; padding: 0.6rem 0.7rem; resize: vertical; width: 100%; }
`;

const Add = styled.form`
  display: flex; gap: 0.6rem; margin-top: 1.2rem; flex-wrap: wrap;
  input { background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(232, 194, 107, 0.35); border-radius: 999px; color: var(--cream); flex: 1; font: inherit; min-height: 46px; min-width: 200px; padding: 0 1.1rem; }
`;

const TrailList = styled.ul`
  list-style: none; margin: 0; padding: 0; display: grid; gap: 0.6rem;
  li { align-items: center; background: rgba(255, 255, 255, 0.04); border-radius: 12px; display: flex; flex-wrap: wrap; gap: 0.3rem 1rem; justify-content: space-between; padding: 0.7rem 0.9rem; }
  b { font-family: ${display}; font-size: 1.25rem; font-weight: 600; }
  small { color: var(--muted); display: block; font-size: 0.86rem; }
  a { color: var(--gold2); font-size: 0.88rem; font-weight: 600; }
`;

export default function Firsts() {
  const [state, setState] = useLocal("ash-hub-firsts-v1", { status: {}, notes: {}, extra: [] });
  const [text, setText] = useState("");
  const items = [...base, ...state.extra];
  const level = (id) => state.status[id] || 0;
  const set = (id, v) => setState((s) => ({ ...s, status: { ...s.status, [id]: v } }));
  const note = (id, v) => setState((s) => ({ ...s, notes: { ...s.notes, [id]: v } }));
  const done = items.filter((i) => level(i.id) === 2).length;
  const progress = items.length ? items.reduce((n, i) => n + level(i.id), 0) / (items.length * 2) : 0;

  // Points along a winding trail up the mountain; the walker sits at the current progress.
  const trailPts = [[40, 240], [110, 205], [95, 160], [165, 135], [150, 95], [215, 70], [250, 28]];
  const at = progress * (trailPts.length - 1);
  const i0 = Math.min(Math.floor(at), trailPts.length - 2), f = at - i0;
  const wx = trailPts[i0][0] + (trailPts[i0 + 1][0] - trailPts[i0][0]) * f;
  const wy = trailPts[i0][1] + (trailPts[i0 + 1][1] - trailPts[i0][1]) * f;

  return (
    <>
      <Reveal>
        <Eyebrow>Firsts</Eyebrow>
        <H2>Look at all the things you're trying.</H2>
        <Lede>Skiing, boxing, violin, painting. You say yes to new things like it's a hobby. <Hand>It's my favourite thing about you.</Hand> Mark where you are and watch the trail fill in. This lives only on your own device, so nobody else sees your notes.</Lede>
      </Reveal>

      <Reveal>
        <Mountain>
          <svg viewBox="0 0 300 270" role="img" aria-label={`Trail progress: ${done} of ${items.length} firsts done`}>
            <defs>
              <linearGradient id="mt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3b4a9a" /><stop offset="1" stopColor="#141a4f" /></linearGradient>
            </defs>
            <path d="M0 270 L70 150 L110 195 L190 60 L250 150 L300 100 L300 270Z" fill="url(#mt)" opacity="0.95" />
            <path d="M190 60 L170 92 L190 82 L205 96 L220 84Z" fill="#f6efdc" opacity="0.85" />
            <polyline points={trailPts.map((p) => p.join(",")).join(" ")} fill="none" stroke="rgba(232,194,107,0.35)" strokeWidth="3" strokeDasharray="2 7" strokeLinecap="round" />
            {trailPts.slice(0, -1).map((p, i) => (i <= at ? <circle key={i} cx={p[0]} cy={p[1]} r="3.4" fill="#e8c26b" /> : null))}
            <g transform="translate(250 28)"><line x1="0" y1="0" x2="0" y2="-18" stroke="#f6efdc" strokeWidth="1.5" /><path d="M0 -18 L14 -13 L0 -8Z" fill={progress >= 1 ? "#f0aec3" : "#6a6f9a"} /></g>
            <text x={wx} y={wy - 6} fontSize="16" textAnchor="middle">🥾</text>
          </svg>
          <p className="caption">{progress >= 1 ? "Summit! The flag is up. ✦" : `${done} of ${items.length} firsts done. The flag is waiting at the top.`}</p>
        </Mountain>
      </Reveal>

      <Rule />

      <Grid cols={2}>
        {items.map((it, i) => (
          <Reveal key={it.id} delay={(i % 2) * 0.06}>
            <Item>
              <div className="top"><span className="emoji" aria-hidden="true">{it.emoji || "✨"}</span><H3>{it.title}</H3></div>
              {it.line ? <p>{it.line}</p> : null}
              <div className="seg" role="group" aria-label={`${it.title} progress`}>
                {steps.map((s, v) => <button key={s} type="button" aria-pressed={level(it.id) === v} onClick={() => set(it.id, v)}>{s}</button>)}
              </div>
              <textarea aria-label={`Notes about ${it.title}`} placeholder="How did it go? What was funny? (only you see this)" value={state.notes[it.id] || ""} onChange={(e) => note(it.id, e.target.value)} />
            </Item>
          </Reveal>
        ))}
      </Grid>

      <Add onSubmit={(e) => { e.preventDefault(); const t = text.trim(); if (!t) return; setState((s) => ({ ...s, extra: [...s.extra, { id: `x-${Date.now()}`, emoji: "✨", title: t }] })); setText(""); }}>
        <input aria-label="Add a new first" placeholder="A new first you want to try…" value={text} onChange={(e) => setText(e.target.value)} />
        <GhostButton type="submit">Add to the trail</GhostButton>
      </Add>

      <Rule />

      <Reveal>
        <H2>Your next trail</H2>
        <Lede>You're a hiker, so here are a few trails near Vancouver that I'd follow you up. They're my ideas, not a guide: check the conditions, closures and any passes before you go.</Lede>
        <TrailList>
          {trails.map(([name, where]) => (
            <li key={name}>
              <span><b>{name}</b><small>{where}</small></span>
              <a href={`https://www.google.com/search?q=${encodeURIComponent(`${name} trail conditions`)}`} target="_blank" rel="noopener noreferrer">Check conditions ↗</a>
            </li>
          ))}
        </TrailList>
      </Reveal>
    </>
  );
}
