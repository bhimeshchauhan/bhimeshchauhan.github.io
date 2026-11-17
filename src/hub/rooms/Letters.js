import React, { useState } from "react";
import styled from "styled-components";
import { letters } from "../data/letters";
import { Wrap, Eyebrow, H2, Lede, Hand, Section, Reveal, glass, display } from "../ui";

const Envelope = styled.article`
  ${glass}
  margin-bottom: 1rem;
  overflow: hidden;
  button.head {
    align-items: center; background: none; border: 0; color: inherit; cursor: pointer; display: flex; font: inherit; gap: 1rem; justify-content: space-between; padding: 1.2rem 1.4rem; text-align: left; width: 100%;
  }
  .date { color: var(--gold); font-size: 0.74rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; }
  .title { color: var(--cream); display: block; font-family: ${display}; font-size: 1.6rem; font-weight: 600; line-height: 1.15; margin-top: 0.25rem; }
  .seal { color: var(--rose); flex: none; font-size: 1.6rem; transition: transform 0.4s ease; }
  &[data-open="true"] .seal { transform: rotate(180deg); }
  .paper { background: linear-gradient(180deg, rgba(246, 239, 220, 0.96), rgba(236, 225, 196, 0.96)); color: #2b2440; margin: 0 1rem 1rem; padding: clamp(1.2rem, 4vw, 2rem); border-radius: 10px; }
  .paper p { font-family: ${display}; font-size: clamp(1.2rem, 3vw, 1.45rem); line-height: 1.55; margin: 0 0 1rem; white-space: pre-line; }
  .paper p:last-child { color: #6b3a55; font-style: italic; margin-bottom: 0; }
`;

const nice = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

export default function Letters() {
  const [open, setOpen] = useState(letters[0] ? letters[0].id : null);
  return (
    <>
      <Section >
          <Reveal>
            <Eyebrow>Letters</Eyebrow>
            <H2>Notes I wrote for you.</H2>
            <Lede>Open one whenever you like: on a good day, on a hard one, or on the train. <Hand>There will be more.</Hand></Lede>
          </Reveal>
          {letters.map((l) => {
            const isOpen = open === l.id;
            return (
              <Reveal key={l.id}>
                <Envelope data-open={isOpen}>
                  <button type="button" className="head" aria-expanded={isOpen} aria-controls={`letter-${l.id}`} onClick={() => setOpen(isOpen ? null : l.id)}>
                    <span><span className="date">{nice(l.date)}</span><span className="title">{l.title}</span></span>
                    <span className="seal" aria-hidden="true">♡</span>
                  </button>
                  {isOpen && (
                    <div className="paper" id={`letter-${l.id}`}>
                      {l.body.map((para, i) => <p key={i}>{para}</p>)}
                    </div>
                  )}
                </Envelope>
              </Reveal>
            );
          })}
        </Section>
      
    </>
  );
}
