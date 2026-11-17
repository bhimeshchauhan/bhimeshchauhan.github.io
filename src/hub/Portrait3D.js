import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { display } from "./ui";

// The big, playable 3D Ash on the home page. See her3d.js for what she does.
const rise = keyframes`0%{opacity:0;transform:translate(-50%,0) scale(.4)}15%{opacity:1}100%{opacity:0;transform:translate(calc(-50% + var(--dx)),-120px) scale(1.2) rotate(var(--rot))}`;
const Wrap = styled.div`
  flex: none; position: relative; width: clamp(230px, 24vw, 300px);
  .frame { aspect-ratio: 0.84; background: var(--bg), radial-gradient(circle at 50% 30%, #2a56a8, #0b1740); background-position: center; background-size: cover; border: 2px solid rgba(232, 194, 107, 0.85); border-radius: 999px 999px 26px 26px; box-shadow: 0 0 0 8px rgba(232, 194, 107, 0.12), 0 24px 70px rgba(0, 0, 12, 0.6); overflow: hidden; position: relative; transition: background 0.8s; }
  .frame.pearl { background: radial-gradient(circle at 45% 40%, #6b5a3e, #1a140f 75%); }
  .stage { cursor: grab; inset: 0; position: absolute; }
  .heart { animation: ${rise} 1.5s ease-out forwards; color: #ff6f98; font-size: 22px; left: 0; pointer-events: none; position: absolute; text-shadow: 0 0 10px rgba(255, 110, 150, 0.7); top: 0; }
  .bubble { background: #fffaf0; border-radius: 16px; bottom: calc(100% + 10px); box-shadow: 0 8px 26px rgba(0, 0, 0, 0.4); color: #2a1a36; font-family: ${display}; font-size: 1.1rem; font-weight: 600; left: 50%; padding: 0.4rem 0.9rem; pointer-events: none; position: absolute; transform: translateX(-50%); white-space: nowrap; z-index: 3; }
  .bubble::after { border: 8px solid transparent; border-top-color: #fffaf0; content: ""; left: 50%; margin-left: -8px; position: absolute; top: 100%; }
  .tools { display: flex; flex-wrap: wrap; gap: 0.4rem; justify-content: center; margin-top: 0.8rem; }
  .tools button { background: rgba(10, 14, 40, 0.7); border: 1px solid rgba(232, 194, 107, 0.5); border-radius: 999px; color: var(--gold2); cursor: pointer; font: inherit; font-size: 0.8rem; font-weight: 600; min-height: 36px; padding: 0 0.9rem; }
  .tools button:hover { background: rgba(232, 194, 107, 0.16); }
  .hint { color: #f3efe2; font-size: 0.78rem; margin: 0.5rem 0 0; opacity: 0.8; text-align: center; text-shadow: 0 1px 8px #04071c; }
  @media (max-width: 760px) { width: min(78vw, 320px); }
`;

export default function Portrait3D() {
  const mount = useRef(null);
  const her = useRef(null);
  const reduce = useReducedMotion();
  const [bubble, setBubble] = useState(null);
  const [hearts, setHearts] = useState([]);
  const [outfit, setOutfit] = useState("starry");
  const [spin, setSpin] = useState(true);
  const [ok, setOk] = useState(true);
  const bt = useRef(0);

  useEffect(() => {
    let dead = false; let inst = null;
    import("./her3d").then(({ createHer }) => createHer(mount.current, {
      reduceMotion: !!reduce,
      onSay: (text) => { setBubble({ text, k: Date.now() }); clearTimeout(bt.current); bt.current = setTimeout(() => setBubble(null), 2000); },
      onHeart: (x, y, n) => { const base = Date.now(); const fresh = Array.from({ length: n }, (_, i) => ({ k: `${base}-${i}`, x, y, dx: (Math.random() - 0.5) * 70, rot: (Math.random() - 0.5) * 50, d: i * 0.08 })); setHearts((h) => [...h, ...fresh]); setTimeout(() => setHearts((h) => h.filter((q) => !fresh.includes(q))), 1800); }
    })).then((i) => { if (dead) { if (i) i.dispose(); return; } if (!i) { setOk(false); return; } inst = i; her.current = i; }).catch(() => setOk(false));
    return () => { dead = true; clearTimeout(bt.current); if (inst) inst.dispose(); her.current = null; };
  }, [reduce]);

  if (!ok) return null;
  const toggleOutfit = () => { const n = outfit === "starry" ? "pearl" : "starry"; setOutfit(n); if (her.current) { her.current.setOutfit(n); her.current.say(n === "pearl" ? "ooh, a pearl!" : "back to the stars"); } };
  const toggleSpin = () => { setSpin((s) => { if (her.current) her.current.setAutoSpin(!s); return !s; }); };
  return (
    <Wrap>
      <AnimatePresence>{bubble && <motion.div key={bubble.k} className="bubble" initial={{ opacity: 0, y: 8, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}>{bubble.text}</motion.div>}</AnimatePresence>
      <div className={`frame ${outfit}`} style={{ "--bg": "url(/ash/art/starry.jpg)" }}>
        <div className="stage" ref={mount} aria-label="A 3D Ash you can turn, poke and tickle" />
        {hearts.map((h) => <span key={h.k} className="heart" style={{ left: h.x, top: h.y, "--dx": `${h.dx}px`, "--rot": `${h.rot}deg`, animationDelay: `${h.d}s` }}>♥</span>)}
      </div>
      <div className="tools">
        <button type="button" onClick={toggleOutfit}>{outfit === "starry" ? "Pearl earring ✨" : "Starry again 🌌"}</button>
        <button type="button" aria-pressed={spin} onClick={toggleSpin}>{spin ? "Stop spinning" : "Spin"}</button>
        <button type="button" onClick={() => her.current && her.current.wave()}>Say hi 👋</button>
      </div>
      <p className="hint">Drag to turn her · poke her · tickle her · pull her face</p>
    </Wrap>
  );
}
