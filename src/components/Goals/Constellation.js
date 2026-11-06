import React, { useMemo } from "react";
import styled, { keyframes } from "styled-components";
import goals from "../../data/Goals";
import { sceneFor } from "./Scenes";

const draw = keyframes`from{stroke-dashoffset:var(--len)}to{stroke-dashoffset:0}`;
const twinkle = keyframes`0%,100%{opacity:.75}50%{opacity:1}`;

const ROWS = ["Places", "Craft", "Body", "Career", "Mind", "Adventure", "People"];
const AREA = {
  Travel: "Places", Moving: "Places", Landmarks: "Places", Cities: "Places", "On the road": "Places",
  "On stage": "Craft", "On paper": "Craft", Languages: "Craft",
  "In training": "Body",
  Growth: "Career", Building: "Career",
  Learning: "Mind",
  "Up in the air": "Adventure", "Free fall": "Adventure", "Snow skiing": "Adventure", "On the water": "Adventure", "Under the sky": "Adventure", "Live events": "Adventure",
  People: "People",
};
const areaOf = (d) => AREA[sceneFor(d)[2]] || "People";
const colLabel = (n) => (n.startsWith("YEAR") ? n.replace("YEAR - ", "'").replace("'20", "'") : n.startsWith("LIFE") ? "Life" : n.startsWith("PROF") ? "Work" : "Events");

const Wrap = styled.div`
  background: radial-gradient(120% 90% at 20% 0%, rgba(59,75,216,0.16), transparent 60%), rgba(8,9,16,0.7);
  border: 1px solid var(--line);
  border-radius: 28px;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  padding: 1.1rem 1rem 0.6rem;
  .head { align-items: baseline; display: flex; flex-wrap: wrap; gap: 0.5rem 1.2rem; justify-content: space-between; padding: 0 0.5rem 0.4rem; }
  .head b { color: var(--ink); font-family: "Space Grotesk", sans-serif; font-size: 1.15rem; }
  .legend { color: var(--muted); font-size: 0.85rem; }
  .legend i { display: inline-block; height: 9px; margin: 0 5px 0 12px; width: 9px; border-radius: 50%; }
  .legend i.on { background: #ffb454; box-shadow: 0 0 8px #ffb454; }
  .legend i.off { border: 1.5px solid rgba(242,240,234,0.55); }
  svg { display: block; width: 100%; height: auto; }
  .lbl { fill: #a3a8b8; font-family: "Inter", sans-serif; font-size: 12px; }
  .row { fill: #f2f0ea; font-family: "Inter", sans-serif; font-size: 12px; font-weight: 600; }
  .line { fill: none; stroke: #ffb454; stroke-linecap: round; stroke-opacity: 0.45; stroke-width: 1.4; stroke-dasharray: var(--len); animation: ${draw} 2.2s ease-out both; }
  .star { cursor: pointer; outline: none; }
  .star .core { animation: ${twinkle} 3.5s ease-in-out infinite; transition: r .2s ease; }
  .star:hover .core, .star:focus-visible .core, .star.on .core { r: 8.5; }
  .ring { fill: none; opacity: 0; stroke: #ffb454; stroke-width: 1.5; transition: opacity .2s ease; }
  .star:hover .ring, .star:focus-visible .ring, .star.on .ring { opacity: 1; }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
`;

const W = 760, H = 360, LEFT = 86, TOP = 30, BOTTOM = 14;

const Constellation = ({ active, onPick }) => {
  const { cols, stars, lines } = useMemo(() => {
    const order = [...goals].filter((g) => g.name.startsWith("YEAR")).sort((a, b) => a.name.localeCompare(b.name));
    const cols = [...order, ...goals.filter((g) => !g.name.startsWith("YEAR"))];
    const cw = (W - LEFT - 14) / cols.length, rh = (H - TOP - BOTTOM) / ROWS.length;
    const cell = {};
    const stars = [];
    cols.forEach((g, ci) =>
      g.todo.forEach((t) => {
        const r = ROWS.indexOf(areaOf(t.desc));
        const k = ci + "-" + r;
        const n = (cell[k] = (cell[k] || 0) + 1) - 1;
        const jx = ((n * 17) % 5) - 2, jy = ((n * 11) % 5) - 2;
        stars.push({ desc: t.desc, fin: t.fin, ci, r, x: LEFT + cw * (ci + 0.5) + n * 7 + jx * 2, y: TOP + rh * (r + 0.5) + (n % 2 ? 9 : -2) + jy });
      })
    );
    const lines = ROWS.map((_, r) => {
      const pts = stars.filter((s) => s.r === r && s.fin).sort((a, b) => a.x - b.x);
      return pts.length > 1 ? "M" + pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L") : null;
    });
    return { cols, stars, lines, cw, rh };
  }, []);
  const cw = (W - LEFT - 14) / cols.length, rh = (H - TOP - BOTTOM) / ROWS.length;
  const done = stars.filter((s) => s.fin).length;
  return (
    <Wrap>
      <div className="head">
        <b>Constellation</b>
        <span className="legend"><i className="on" />done ({done})<i className="off" />open ({stars.length - done}) · hover a star</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label="Goals by life area and year. Lit stars are done.">
        <defs><filter id="gl" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="3.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        {ROWS.map((n, r) => <g key={n}><line x1={LEFT} x2={W - 8} y1={TOP + rh * (r + 0.5)} y2={TOP + rh * (r + 0.5)} stroke="rgba(255,255,255,0.06)" /><text className="row" x="8" y={TOP + rh * (r + 0.5) + 4}>{n}</text></g>)}
        {cols.map((g, ci) => <text key={g.id} className="lbl" x={LEFT + cw * (ci + 0.5)} y="16" textAnchor="middle">{colLabel(g.name)}</text>)}
        {lines.map((d, i) => d && <path key={i} className="line" d={d} style={{ "--len": 1200, animationDelay: `${i * 0.15}s` }} />)}
        {stars.map((s) => (
          <g key={s.desc} className={`star ${active === s.desc ? "on" : ""}`} tabIndex={0} role="button" aria-label={`${s.desc.trim()} (${s.fin ? "done" : "open"})`}
            onMouseEnter={() => onPick(s.desc)} onFocus={() => onPick(s.desc)} onClick={() => onPick(s.desc)}>
            <circle className="ring" cx={s.x} cy={s.y} r="13" />
            {s.fin
              ? <circle className="core" cx={s.x} cy={s.y} r="5" fill="#ffb454" filter="url(#gl)" style={{ animationDelay: `${(s.x % 7) * 0.4}s` }} />
              : <circle className="core" cx={s.x} cy={s.y} r="4.2" fill="#0b0d16" stroke="rgba(242,240,234,0.6)" strokeWidth="1.5" />}
          </g>
        ))}
      </svg>
    </Wrap>
  );
};

export default Constellation;
