import React from "react";
import styled from "styled-components";
import { dates } from "./data/dates";
import { Card, display } from "./ui";

const Row = styled.div`
  display: grid;
  gap: 0.9rem;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  .n { color: var(--gold2); font-family: ${display}; font-size: 3.2rem; font-weight: 500; line-height: 1; }
  .l { color: var(--cream); font-weight: 600; margin: 0.35rem 0 0; }
  .s { color: var(--muted); font-size: 0.88rem; margin: 0.2rem 0 0; }
`;

const daysBetween = (iso) => Math.round((new Date(`${iso}T00:00:00`) - new Date(new Date().toDateString())) / 86400000);

export default function Countdown() {
  if (!dates.length) return null; // nothing to count yet
  return (
    <Row>
      {dates.map((d) => {
        const n = daysBetween(d.date);
        const text = d.since ? Math.abs(n) : Math.max(n, 0);
        return (
          <Card key={d.label}>
            <div className="n">{text}</div>
            <p className="l">{d.since ? `days · ${d.label}` : n < 0 ? `${d.label} (it's here!)` : n === 0 ? `${d.label} · today ♡` : `days until ${d.label}`}</p>
            {d.note ? <p className="s">{d.note}</p> : null}
          </Card>
        );
      })}
    </Row>
  );
}
