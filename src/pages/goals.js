import React, { useMemo, useState } from "react";
import styled from "styled-components";
import goals from "../data/Goals";
import places from "../data/places";
import Layout from "../components/layout";
import { Reveal } from "../components/motion/primitives";
import Globe from "../components/Goals/Globe";
import Constellation from "../components/Goals/Constellation";
import { sceneFor } from "../components/Goals/Scenes";

const display = `"Space Grotesk", "Inter", sans-serif`;
const placeName = (p) => p.label || p.country;
const homeNames = places.filter((p) => p.kinds.some((k) => k !== "visited")).map(placeName);
const seenNames = places.filter((p) => p.kinds.every((k) => k === "visited")).map(placeName);

const Wrap = styled.div`
  margin: 0 auto;
  max-width: 1120px;
  width: 100%;
  h1 { color: var(--ink); font-family: ${display}; font-size: clamp(2.4rem, 6vw, 4.5rem); font-weight: 700; letter-spacing: -0.04em; line-height: 1; margin: 1rem 0 1rem; }
  .lede { color: var(--muted); font-size: 1.2rem; line-height: 1.6; margin: 0 0 2.5rem; max-width: 44rem; }
`;

const Summary = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 2rem;
  margin-bottom: 2rem;
  .big { color: var(--ink); font-family: ${display}; font-size: clamp(2.4rem, 5vw, 3.6rem); font-weight: 700; letter-spacing: -0.04em; line-height: 1; }
  .big small { color: var(--muted); font-size: 1rem; font-weight: 400; letter-spacing: 0; margin-left: 0.5rem; }
  .bar { background: rgba(255,255,255,0.08); border-radius: 999px; flex: 1; height: 8px; min-width: 200px; overflow: hidden; }
  .bar i { background: linear-gradient(90deg, #3b4bd8, #7c3aed, var(--accent)); display: block; height: 100%; transition: width 1s cubic-bezier(0.22, 1, 0.36, 1); }
`;

const Filters = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2.5rem;
  button { background: transparent; border: 1px solid var(--line); border-radius: 999px; color: var(--muted); cursor: pointer; font: 600 0.9rem "Inter", sans-serif; min-height: 44px; padding: 0.5rem 1.1rem; transition: all 0.2s ease; }
  button:hover { color: var(--ink); }
  button.on { background: var(--accent); border-color: var(--accent); color: #0b0d12; }
`;

const Split = styled.div`
  align-items: start;
  display: grid;
  gap: 2rem;
  grid-template-columns: minmax(0, 1fr) 360px;
  @media (max-width: 1000px) { grid-template-columns: 1fr; }
`;

const Stage = styled.aside`
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 28px;
  display: flex;
  flex-direction: column;
  height: min(600px, calc(100vh - 7rem));
  overflow: hidden;
  position: sticky;
  top: 6.5rem;
  .view { flex: 1; min-height: 0; position: relative; }
  .view > * { animation: stageIn 0.45s ease both; inset: 0; position: absolute; }
  figcaption { border-top: 1px solid var(--line); color: var(--muted); font-size: 0.95rem; padding: 0.9rem 1.2rem; }
  .legend { display: grid; gap: 0.25rem; font-size: 0.85rem; margin-top: 0.55rem; }
  .legend i { border-radius: 50%; display: inline-block; height: 9px; margin-right: 0.45rem; width: 9px; }
  figcaption b { color: var(--ink); display: block; font-family: ${display}; font-size: 1.05rem; font-weight: 600; margin-bottom: 0.15rem; }
  @keyframes stageIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: none; } }
  @media (max-width: 1000px) { position: relative; top: 0; height: 320px; order: -1; }
`;

const Board = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(0, 1fr);
`;

const Card = styled.section`
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 24px;
  padding: 1.5rem 1.75rem 1.75rem;
  &.now { border-color: rgba(255,180,84,0.5); }
  header { align-items: center; display: flex; gap: 1rem; margin-bottom: 1rem; }
  h2 { color: var(--ink); flex: 1; font-family: ${display}; font-size: 1.4rem; letter-spacing: -0.02em; margin: 0; }
  .tag { background: rgba(255,180,84,0.16); border-radius: 999px; color: var(--accent); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em; padding: 0.25rem 0.7rem; text-transform: uppercase; }
  ul { list-style: none; margin: 0; padding: 0; }
  li { border-radius: 10px; cursor: default; outline: none; padding: 0.15rem 0.4rem; margin-left: -0.4rem; transition: background 0.2s ease; align-items: flex-start; color: var(--ink); display: flex; gap: 0.7rem; line-height: 1.5; margin: 0 0 0.55rem; max-width: 70ch; }
  li .box { border: 1.5px solid rgba(255,255,255,0.3); border-radius: 6px; flex: none; height: 18px; margin-top: 3px; position: relative; width: 18px; }
  li.has-scene { cursor: pointer; }
  li.has-scene:hover, li.has-scene:focus-visible, li.active { background: rgba(255,180,84,0.1); }
  li.done { color: var(--muted); }
  li.done .box { background: var(--accent); border-color: var(--accent); }
  li.done .box::after { border: solid #0b0d12; border-width: 0 2px 2px 0; content: ""; height: 8px; left: 5px; position: absolute; top: 1px; transform: rotate(45deg); width: 4px; }
  .empty { color: var(--muted); font-size: 0.95rem; margin: 0; }
`;

const Ring = ({ done, total }) => {
  const r = 18, c = 2 * Math.PI * r, pct = total ? done / total : 0;
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" role="img" aria-label={`${done} of ${total} done`}>
      <circle cx="24" cy="24" r={r} style={{ fill: "none" }} stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
      <circle cx="24" cy="24" r={r} style={{ fill: "none" }} stroke="#ffb454" strokeWidth="4" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform="rotate(-90 24 24)" />
      <text x="24" y="28" textAnchor="middle" fontSize="11" fontWeight="700" fill="#f2f0ea">{done}/{total}</text>
    </svg>
  );
};

const CURRENT = "YEAR - 2026";
const titleOf = (n) => n.replace("YEAR - ", "");

const Goals = () => {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState(null);
  const scene = active ? sceneFor(active) : null;
  const Scene = scene ? scene[1] : null;
  const stats = useMemo(() => {
    const total = goals.reduce((n, g) => n + g.todo.length, 0);
    const done = goals.reduce((n, g) => n + g.todo.filter((t) => t.fin).length, 0);
    return { total, done };
  }, []);
  const pct = Math.round((stats.done / stats.total) * 100);
  const show = (t) => filter === "all" || (filter === "done" ? t.fin : !t.fin);
  const ordered = [...goals].sort((a, b) => (a.name === CURRENT ? -1 : b.name === CURRENT ? 1 : 0));

  return (
    <Layout seo={{ title: "Goals", description: "A living list of personal and professional goals, and how far along they are.", noindex: true }}>
      <Wrap>
        <h1>Goals, in progress</h1>
        <p className="lede">A living list: what I am working on this year, what I have finished, and the long bucket list behind it.</p>
        <Summary>
          <div className="big">{stats.done}<small>of {stats.total} done · {pct}%</small></div>
          <div className="bar" aria-hidden="true"><i style={{ width: `${pct}%` }} /></div>
        </Summary>
        <Filters role="group" aria-label="Filter goals">
          {[["all", "All"], ["open", "Still open"], ["done", "Done"]].map(([k, l]) => (
            <button key={k} type="button" className={filter === k ? "on" : ""} aria-pressed={filter === k} onClick={() => setFilter(k)}>{l}</button>
          ))}
        </Filters>
        <Split><div style={{ minWidth: 0 }}><Constellation active={active} onPick={setActive} /><Board>
          {ordered.map((g, i) => {
            const items = g.todo.filter(show);
            const done = g.todo.filter((t) => t.fin).length;
            if (!items.length) return null;
            return (
              <Reveal key={g.id} delay={(i % 2) * 0.06} style={g.name === CURRENT ? { gridColumn: "1 / -1" } : undefined}>
                <Card className={g.name === CURRENT ? "now" : ""}>
                  <header>
                    <Ring done={done} total={g.todo.length} />
                    <h2>{g.name.startsWith("YEAR") ? titleOf(g.name) : g.name.charAt(0) + g.name.slice(1).toLowerCase()}</h2>
                    {g.name === CURRENT && <span className="tag">This year</span>}
                  </header>
                  <ul>
                    {items.map((t) => (
                      <li
                        key={t.desc}
                        tabIndex={0}
                        className={`${t.fin ? "done" : ""} has-scene ${active === t.desc ? "active" : ""}`}
                        onMouseEnter={() => setActive(t.desc)}
                        onMouseLeave={() => setActive(null)}
                        onFocus={() => setActive(t.desc)}
                        onBlur={() => setActive(null)}
                        onClick={() => setActive(t.desc)}
                      >
                        <span className="box" aria-hidden="true" />
                        <span>{t.desc.trim()}<span className="sr-only">{t.fin ? " (done)" : " (open)"}</span></span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
            );
          })}
        </Board></div>
        <Stage aria-live="polite">
          <div className="view" key={scene ? scene[2] : "globe"}>
            {Scene ? <Scene /> : <Globe />}
          </div>
          <figcaption>
            {scene ? (<><b>{scene[2]}</b>{active.trim()}</>) : (<><b>Places so far</b>Drag the globe. Hover a star or a goal to see it play out.
              <span className="legend">
                {homeNames.length > 0 && <span><i style={{ background: "#ffb454" }} />Lived or worked: {homeNames.join(", ")}</span>}
                {seenNames.length > 0 && <span><i style={{ background: "#8fa0ff" }} />Visited: {seenNames.join(", ")}</span>}
              </span></>)}
          </figcaption>
        </Stage>
        </Split>
      </Wrap>
    </Layout>
  );
};

export default Goals;
