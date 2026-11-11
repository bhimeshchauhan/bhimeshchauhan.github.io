import React, { useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import Layout from "../components/layout";
import days from "../data/github-activity.json"; // [date, contributions] for every active day; counts only, no repo names

const display = `"Space Grotesk", "Inter", sans-serif`;
const W = 1000, H = 372, L = 76, R = 36, T = 112, ROW = 25;
const span = W - L - R;
const VY = 80; // trim the empty top of the canvas (the README version keeps it for its title)
const twinkle = keyframes`0%,100%{opacity:var(--o)}50%{opacity:calc(var(--o) - .4)}`;

// Deterministic jitter, so the server and browser draw the same sky.
const rand = (n) => { let t = (n + 1) * 0x6d2b79f5; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const first = 2017;
const last = Number(days[days.length - 1][0].slice(0, 4));
const years = Array.from({ length: last - first + 1 }, (_, i) => first + i);
const fmtDate = (d) => new Date(d + "T12:00:00").toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

const Wrap = styled.div`
  margin: 2rem auto 0;
  max-width: 1040px;
  h1 { color: var(--ink); font-family: ${display}; font-size: clamp(2.4rem, 6vw, 4.5rem); font-weight: 700; letter-spacing: -0.04em; line-height: 1; margin: 0 0 1rem; }
  .lede { color: var(--muted); font-size: clamp(1.05rem, 2vw, 1.3rem); line-height: 1.6; margin: 0 0 2rem; max-width: 46rem; }
  .sky { background: #0b0c10; border: 1px solid var(--line); border-radius: 16px; position: relative; }
  svg { display: block; height: auto; width: 100%; }
  .tip { background: #11131c; border: 1px solid var(--accent); border-radius: 8px; color: var(--ink); font-size: 0.9rem; padding: 0.45rem 0.7rem; pointer-events: none; position: absolute; transform: translate(-50%, -135%); white-space: nowrap; z-index: 2; }
  .tip b { color: var(--accent); }
  .stats { color: var(--muted); display: flex; flex-wrap: wrap; gap: 0.4rem 2rem; list-style: none; margin: 1rem 0 0; padding: 0; }
  .stats strong { color: var(--ink); font-family: ${display}; font-size: 1.3rem; }
  .hint { color: var(--muted); font-size: 0.9rem; margin-top: 0.75rem; }
  details { margin-top: 1.5rem; }
  summary { color: var(--ink); cursor: pointer; }
  table { border-collapse: collapse; margin-top: 0.75rem; }
  th, td { border-bottom: 1px solid var(--line); color: #d9d7d0; padding: 0.4rem 1rem 0.4rem 0; text-align: left; }
  .tw { animation: ${twinkle} 4s ease-in-out infinite; }
`;

const Activity = () => {
  const [tip, setTip] = useState(null);
  const [focus, setFocus] = useState(null);
  const stars = useMemo(() => days.map(([date, c], n) => {
    const y = Number(date.slice(0, 4));
    const doy = (Date.UTC(y, Number(date.slice(5, 7)) - 1, Number(date.slice(8, 10))) - Date.UTC(y, 0, 0)) / 864e5;
    const cur = y === last;
    return { date, c, y, n, x: L + span * ((doy - 1) / 366) + (rand(n) * 2 - 1), cy: T + (y - first) * ROW + 5 + (rand(n + 9999) * 10 - 5), r: Math.min(3.4, 1.1 + 0.55 * Math.sqrt(c)), o: cur ? Math.min(1, 0.7 + 0.06 * c) : Math.min(1, 0.42 + 0.07 * c), cur };
  }), []);
  const per = years.map((y) => ({ y, d: stars.filter((s) => s.y === y).length, c: stars.filter((s) => s.y === y).reduce((a, s) => a + s.c, 0) }));
  const best = stars.reduce((a, s) => (s.c > a.c ? s : a), stars[0]);
  const total = stars.reduce((a, s) => a + s.c, 0);
  return (
    <Layout seo={{ title: "Activity: every day I shipped", description: `${stars.length} days with a GitHub contribution since ${first}, drawn as an interactive sky of stars. Private repositories are counted, never named.`, pathname: "/activity/" }}>
      <Wrap>
        <h1>Activity</h1>
        <p className="lede">Every day I contributed on GitHub since {first}, drawn as a star: one row per year, brighter for busier days. Private work is counted, never named.</p>
        <div className="sky" onMouseLeave={() => { setTip(null); setFocus(null); }}>
          <svg viewBox={`0 ${VY} ${W} ${H - VY}`} role="img" aria-label={`Activity sky: ${stars.length} active days from ${first} to ${last}. ${per.map((p) => `${p.y}: ${p.d} days`).join(", ")}.`}>
            {"JFMAMJJASOND".split("").map((m, i) => <text key={i} x={L + span * (i / 12) + 2} y={T - 10} fontSize="10" fill="#6f7488">{m}</text>)}
            {years.map((y) => (
              <g key={y} style={{ cursor: "default" }} onMouseEnter={() => setFocus(y)}>
                <rect x="0" y={T + (y - first) * ROW - 6} width={W} height={ROW} fill="transparent" />
                <line x1={L} x2={W - R} y1={T + (y - first) * ROW + 10} y2={T + (y - first) * ROW + 10} stroke="#1a1d2a" />
                <text x="32" y={T + (y - first) * ROW + 9} fontSize="12" fill={y === last || focus === y ? "#ffb454" : "#a3a8b8"} fontWeight={focus === y || y === last ? 600 : 400}>{y}</text>
              </g>
            ))}
            {stars.map((s) => (
              <g key={s.date} opacity={focus && focus !== s.y ? 0.12 : 1} style={{ transition: "opacity .2s" }}
                 onMouseEnter={() => { setTip(s); setFocus(s.y); }} onClick={() => setTip(s)}>
                <circle cx={s.x} cy={s.cy} r="9" fill="transparent" />
                <circle cx={s.x} cy={s.cy} r={tip && tip.date === s.date ? s.r + 2 : s.r} fill={s.cur ? "#ffd08a" : "#ffb454"} style={{ "--o": s.o }} opacity={s.o} className={s.n % 6 === 0 ? "tw" : undefined} />
              </g>
            ))}
          </svg>
          {tip && <div className="tip" style={{ left: `${(tip.x / W) * 100}%`, top: `${((tip.cy - VY) / (H - VY)) * 100}%` }}><b>{fmtDate(tip.date)}</b> · {tip.c} contribution{tip.c === 1 ? "" : "s"}</div>}
        </div>
        <p className="hint">Hover or tap a star for its date and count. Hover a year to light up its row.</p>
        <ul className="stats">
          <li><strong>{stars.length.toLocaleString()}</strong> active days</li>
          <li><strong>{total.toLocaleString()}</strong> contributions</li>
          <li><strong>{best.c}</strong> on the busiest day ({fmtDate(best.date)})</li>
        </ul>
        <details>
          <summary>Year by year</summary>
          <table><thead><tr><th>Year</th><th>Active days</th><th>Contributions</th></tr></thead>
            <tbody>{per.map((p) => <tr key={p.y}><td>{p.y}</td><td>{p.d}</td><td>{p.c.toLocaleString()}</td></tr>)}</tbody></table>
        </details>
      </Wrap>
    </Layout>
  );
};

export default Activity;
