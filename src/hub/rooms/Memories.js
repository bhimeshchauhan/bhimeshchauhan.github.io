import React from "react";
import styled from "styled-components";
import Countdown from "../Countdown";
import { memories } from "../data/memories";
import { Wrap, Eyebrow, H2, Lede, Hand, Section, Reveal, Card, display } from "../ui";

const Line = styled.ol`
  list-style: none;
  margin: 2rem 0 0;
  padding: 0 0 0 clamp(26px, 6vw, 46px);
  position: relative;
  &::before { background: linear-gradient(180deg, transparent, var(--gold) 6%, var(--gold) 94%, transparent); content: ""; left: 8px; position: absolute; top: 0; bottom: 0; width: 2px; opacity: 0.7; }
  li { margin: 0 0 1.4rem; position: relative; }
  li::before {
    background: radial-gradient(circle, #fff6cf 0, #f6e3a6 35%, rgba(232, 194, 107, 0) 70%);
    border-radius: 50%; content: ""; height: 22px; left: calc(-1 * clamp(26px, 6vw, 46px) - 1px); position: absolute; top: 0.9rem; width: 22px;
  }
  .when { color: var(--gold); font-size: 0.74rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; }
  h3 { color: var(--cream); font-family: ${display}; font-size: 1.6rem; font-weight: 600; line-height: 1.15; margin: 0.3rem 0 0.5rem; }
  img { border-radius: 12px; display: block; margin-top: 1rem; max-width: 100%; }
`;

const nice = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

export default function Memories() {
  const sorted = [...memories].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <>
      <Section >
          <Reveal>
            <Eyebrow>Memories</Eyebrow>
            <H2>Our story, one star at a time.</H2>
            <Lede>Every moment gets a little light. <Hand>Scroll slowly.</Hand></Lede>
          </Reveal>
          <Countdown />
          <Line>
            {sorted.map((m) => (
              <li key={m.date + m.title}>
                <Reveal>
                  <Card>
                    <div className="when">{nice(m.date)}</div>
                    <h3>{m.title}</h3>
                    <p>{m.body}</p>
                    {m.image ? <img src={m.image} alt={m.title} loading="lazy" /> : null}
                  </Card>
                </Reveal>
              </li>
            ))}
          </Line>
        </Section>
      
    </>
  );
}
