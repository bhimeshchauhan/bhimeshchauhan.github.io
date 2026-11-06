import React from "react";
import styled from "styled-components";

const Wrap = styled.details`
  border: 1px solid var(--line);
  border-radius: 8px;
  color: var(--muted);
  font-size: 0.8rem;
  margin-top: -0.35rem;
  max-width: 94%;
  summary { cursor: pointer; list-style: none; padding: 0.45rem 0.7rem; }
  summary::-webkit-details-marker { display: none; }
  summary b { color: var(--ink); font-weight: 600; }
  summary::after { content: " +"; }
  &[open] summary::after { content: " −"; }
  .steps { border-top: 1px solid var(--line); display: grid; gap: 0.35rem; grid-template-columns: repeat(4, 1fr); margin: 0; padding: 0.6rem 0.7rem; }
  .steps div { min-width: 0; }
  .steps dt { font-size: 0.68rem; letter-spacing: 0.08em; text-transform: uppercase; }
  .steps dd { color: var(--ink); font-variant-numeric: tabular-nums; margin: 0.1rem 0 0; }
  ol { border-top: 1px solid var(--line); list-style: none; margin: 0; padding: 0.5rem 0.7rem 0.6rem; }
  li { display: grid; gap: 0.6rem; grid-template-columns: 3rem 1fr; margin: 0.35rem 0 0; }
  li span { color: var(--accent); font-variant-numeric: tabular-nums; }
  li p { margin: 0; overflow-wrap: anywhere; }
  .none { border-top: 1px solid var(--line); margin: 0; padding: 0.5rem 0.7rem 0.6rem; }
`;

const ms = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)} s` : `${Math.round(n)} ms`);

const Trace = ({ trace: t }) => (
  <Wrap>
    <summary>
      <b>How this answer was made</b> · {t.chunks.length} passage{t.chunks.length === 1 ? "" : "s"} retrieved · {ms(t.total_ms)}
    </summary>
    <dl className="steps">
      <div><dt>Embed</dt><dd>{ms(t.embed_ms)}</dd></div>
      <div><dt>Search</dt><dd>{ms(t.search_ms)}</dd></div>
      <div><dt>LLM</dt><dd>{ms(t.llm_ms)}</dd></div>
      <div><dt>Total</dt><dd>{ms(t.total_ms)}</dd></div>
    </dl>
    {t.chunks.length ? (
      <ol aria-label={`Passages above similarity ${t.threshold}`}>
        {t.chunks.map((c, i) => (
          <li key={i}>
            <span>{c.score == null ? "" : c.score.toFixed(2)}</span>
            <p>{c.source ? `${c.source}: ` : ""}{c.preview}</p>
          </li>
        ))}
      </ol>
    ) : (
      <p className="none">No passage scored above {t.threshold}, so the answer falls back to the no-context reply.</p>
    )}
  </Wrap>
);

export default Trace;
