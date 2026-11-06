import React from "react";
import styled from "styled-components";

const display = `"Space Grotesk", "Inter", sans-serif`;

export const Body = styled.div`
  color: #d9d7d0;
  font-size: 1.075rem;
  line-height: 1.75;
  max-width: 42rem;
  h3 { color: var(--ink); font-family: ${display}; font-size: 1.5rem; letter-spacing: -0.02em; line-height: 1.2; margin: 3rem 0 0.75rem; }
  h4 { color: var(--ink); font-family: ${display}; font-size: 1.15rem; margin: 2rem 0 0.5rem; }
  p { margin: 0 0 1.2rem; }
  strong { color: var(--ink); font-weight: 600; }
  code, pre { background: rgba(255,255,255,0.06); border-radius: 4px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.9em; }
  code { padding: 0.1em 0.35em; }
  pre { overflow-x: auto; padding: 1rem; white-space: pre; }
  blockquote { border-left: 2px solid var(--accent); color: var(--ink); margin: 1.5rem 0; padding: 0.2rem 0 0.2rem 1.2rem; }
  hr { border: 0; border-top: 1px solid var(--line); margin: 2.5rem 0; }
  figure.photo { margin: 2rem 0; }
  figure.photo img { border-radius: 8px; display: block; height: auto; width: 100%; }
`;

const Fig = styled.figure`
  border: 1px solid var(--line);
  border-radius: 8px;
  margin: 2rem 0;
  padding: 1.25rem 1.25rem 1rem;
  figcaption { color: var(--muted); font-size: 0.85rem; margin-top: 0.9rem; }
  .t { color: var(--ink); font-family: ${display}; font-size: 1rem; font-weight: 600; margin: 0 0 1rem; }
  .row { display: grid; gap: 0.35rem 1rem; grid-template-columns: 9.5rem 1fr 4.5rem; align-items: center; margin-bottom: 0.7rem; font-size: 0.9rem; }
  .row > span:first-child { color: var(--muted); }
  .track { background: rgba(255,255,255,0.06); border-radius: 3px; height: 14px; position: relative; }
  .bar { background: var(--accent); border-radius: 3px; height: 100%; }
  .bar.old { background: rgba(255,255,255,0.35); }
  .mark { border-left: 2px dashed var(--ink); bottom: -4px; position: absolute; top: -4px; }
  .mark b { color: var(--ink); font-size: 0.72rem; font-weight: 500; left: 6px; position: absolute; top: -1.2rem; white-space: nowrap; }
  .val { color: var(--ink); font-variant-numeric: tabular-nums; margin-left: 0.5rem; }
  @media (max-width: 560px) { .row { grid-template-columns: 1fr 4.5rem; } .row > span:first-child { grid-column: 1 / -1; } }
`;

const StepList = styled.ol`
  align-items: stretch;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  margin: 2rem 0;
  padding: 0;
  li { border: 1px solid var(--line); border-radius: 6px; color: var(--ink); flex: 1 1 8rem; font-size: 0.85rem; line-height: 1.4; margin: 0; padding: 0.7rem 0.8rem; }
  li small { color: var(--muted); display: block; margin-top: 0.25rem; }
`;

const fmt = (v, unit) => `${v}${unit || ""}`;

export const Bars = ({ title, unit, max, rows, marker, caption }) => (
  <Fig>
    <p className="t">{title}</p>
    {rows.map((r) => (
      <div className="row" key={r.label}>
        <span>{r.label}</span>
        <span className="track" role="img" aria-label={`${r.label}: ${fmt(r.value, unit)}`}>
          <span className="bar" style={{ display: "block", width: `${Math.min(100, (r.value / max) * 100)}%` }} />
          {marker && r === rows[0] && <span className="mark" style={{ left: `${(marker.value / max) * 100}%`, height: `${rows.length * 2.05}rem` }}><b>{marker.label}</b></span>}
        </span>
        <span className="val" style={{ marginLeft: 0 }}>{r.text || fmt(r.value, unit)}</span>
      </div>
    ))}
    {caption && <figcaption>{caption}</figcaption>}
  </Fig>
);

export const Pairs = ({ title, rows, caption }) => (
  <Fig>
    <p className="t">{title}</p>
    {rows.map((r) => (
      <div key={r.label} style={{ marginBottom: "1rem" }}>
        <div style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "0.3rem" }}>{r.label}</div>
        <div className="row" style={{ marginBottom: "0.25rem" }}>
          <span>Before</span>
          <span className="track"><span className="bar old" style={{ display: "block", width: `${r.beforePct}%` }} /></span>
          <span className="val" style={{ marginLeft: 0 }}>{r.before}</span>
        </div>
        <div className="row" style={{ marginBottom: 0 }}>
          <span>After</span>
          <span className="track"><span className="bar" style={{ display: "block", width: `${r.afterPct}%` }} /></span>
          <span className="val" style={{ marginLeft: 0 }}>{r.after}</span>
        </div>
      </div>
    ))}
    {caption && <figcaption>{caption}</figcaption>}
  </Fig>
);

export const Steps = ({ steps }) => (
  <StepList>
    {steps.map(([name, note]) => (
      <li key={name}>
        {name}
        {note && <small>{note}</small>}
      </li>
    ))}
  </StepList>
);

const inline = (parts) =>
  parts.map(([kind, value], i) => {
    if (kind === "strong") return <strong key={i}>{value}</strong>;
    if (kind === "em") return <em key={i}>{value}</em>;
    if (kind === "code") return <code key={i}>{value}</code>;
    if (kind === "br") return <br key={i} />;
    return <React.Fragment key={i}>{value}</React.Fragment>;
  });

export const Block = ({ block, alt }) => {
  const [tag, v] = block;
  if (tag === "img") return <figure className="photo"><img src={v} alt={alt} loading="lazy" /></figure>;
  if (tag === "h3") return <h3>{v}</h3>;
  if (tag === "h4") return <h4>{v}</h4>;
  if (tag === "p") return <p>{inline(v)}</p>;
  if (tag === "blockquote") return <blockquote>{v}</blockquote>;
  if (tag === "pre") return <pre>{inline(v)}</pre>;
  if (tag === "hr") return <hr />;
  if (tag === "bars") return <Bars {...v} />;
  if (tag === "pairs") return <Pairs {...v} />;
  if (tag === "steps") return <Steps steps={v} />;
  return null;
};
