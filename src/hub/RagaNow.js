import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { slotFor, listen } from "./data/ragas";
import { Card, Hand, H3, display } from "./ui";

const Box = styled(Card)`
  .time { color: var(--gold); font-size: 0.74rem; font-weight: 700; letter-spacing: 0.2em; margin: 0 0 0.5rem; text-transform: uppercase; }
  .ragas { display: grid; gap: 0.7rem; margin-top: 1rem; }
  .raga { align-items: center; background: rgba(255, 255, 255, 0.04); border-radius: 12px; display: flex; flex-wrap: wrap; gap: 0.5rem 1rem; justify-content: space-between; padding: 0.7rem 0.9rem; }
  .raga b { font-family: ${display}; font-size: 1.35rem; font-weight: 600; }
  .raga span a { font-size: 0.86rem; margin-left: 0.8rem; }
`;

// A raga for exactly this hour, from the clock on her own device.
export default function RagaNow() {
  const [slot, setSlot] = useState(null);
  useEffect(() => {
    setSlot(slotFor());
    const t = setInterval(() => setSlot(slotFor()), 60000);
    return () => clearInterval(t);
  }, []);
  const s = slot || slotFor(new Date(2000, 0, 1, 20)); // evening on the server render; fixed up on the client
  return (
    <Box>
      <p className="time">{slot ? s.label : "For this hour"}</p>
      <H3>A raga for right now</H3>
      <p>Traditionally these are the ragas for the {s.label.toLowerCase()}. <Hand>Press play and let the room change.</Hand></p>
      <div className="ragas">
        {s.ragas.map((r) => (
          <div className="raga" key={r}>
            <b>{r}</b>
            <span>
              <a href={listen(r).youtube} target="_blank" rel="noopener noreferrer">YouTube ↗</a>
              <a href={listen(r).spotify} target="_blank" rel="noopener noreferrer">Spotify ↗</a>
            </span>
          </div>
        ))}
      </div>
    </Box>
  );
}
