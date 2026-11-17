import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { display } from "./ui";

// A little Ash who follows your cursor along the bottom of every page in the hub, watches what you do, and reacts when poked.
const rise = keyframes`0%{opacity:0;transform:translate(-50%,0) scale(.4)}15%{opacity:1}100%{opacity:0;transform:translate(calc(-50% + var(--dx)),-90px) scale(1.2)}`;
const Box = styled(motion.div)`
  bottom: -10px; height: 190px; position: fixed; width: 150px; z-index: 24;
  .stage { cursor: grab; inset: 0; position: absolute; }
  .heart { animation: ${rise} 1.4s ease-out forwards; color: #ff6f98; font-size: 18px; pointer-events: none; position: absolute; text-shadow: 0 0 8px rgba(255, 110, 150, 0.7); }
  .bubble { background: #fffaf0; border-radius: 14px; bottom: calc(100% - 20px); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4); color: #2a1a36; font-family: ${display}; font-size: 0.95rem; font-weight: 600; left: 50%; padding: 0.3rem 0.75rem; pointer-events: none; position: absolute; transform: translateX(-50%); white-space: nowrap; }
  .bubble::after { border: 7px solid transparent; border-top-color: #fffaf0; content: ""; left: 50%; margin-left: -7px; position: absolute; top: 100%; }
`;
const Hide = styled.button`
  background: rgba(10, 14, 40, 0.75); border: 1px solid rgba(232, 194, 107, 0.5); border-radius: 999px; bottom: 10px; color: var(--gold2); cursor: pointer; font: inherit; font-size: 0.78rem; font-weight: 600; min-height: 34px; padding: 0 0.8rem; position: fixed; right: 12px; z-index: 25;
`;

const PAGE_LINES = { career: "Career! Brave. I'm cheering.", outdoors: "Outdoors? I'll get my boots.", practice: "Practice makes... me proud.", music: "Ooh, ragas.", "watch-read": "Scary movies? Hold my hand.", gallery: "Art! My favourite.", games: "Games, yes please.", notes: "Our little notes." };

export default function Companion({ path }) {
  const mount = useRef(null); const her = useRef(null); const bt = useRef(0);
  const reduce = useReducedMotion();
  const [bubble, setBubble] = useState(null); const [hearts, setHearts] = useState([]);
  const [hidden, setHidden] = useState(false); const [ok, setOk] = useState(true);
  const mx = useMotionValue(typeof window === "undefined" ? 100 : window.innerWidth - 170);
  const x = useSpring(mx, { stiffness: 55, damping: 14, mass: 1.1 });
  useEffect(() => { try { setHidden(window.localStorage.getItem("ash-hub-buddy") === "off"); } catch (e) { /* ignore */ } }, []);
  useEffect(() => {
    if (hidden) return undefined;
    const move = (e) => { mx.set(Math.min(Math.max(e.clientX - 75, 6), window.innerWidth - 156)); };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [hidden, mx]);
  useEffect(() => {
    if (hidden) return undefined;
    let dead = false; let inst = null;
    import("./her3d").then(({ createHer }) => createHer(mount.current, {
      compact: true, reduceMotion: !!reduce,
      onSay: (text) => { setBubble({ text, k: Date.now() }); clearTimeout(bt.current); bt.current = setTimeout(() => setBubble(null), 1900); },
      onHeart: (px, py, n) => { const base = Date.now(); const fresh = Array.from({ length: n }, (_, i) => ({ k: `${base}-${i}`, x: px, y: py, dx: (Math.random() - 0.5) * 50, d: i * 0.08 })); setHearts((h) => [...h, ...fresh]); setTimeout(() => setHearts((h) => h.filter((q) => !fresh.includes(q))), 1700); }
    })).then((i) => { if (dead) { if (i) i.dispose(); return; } if (!i) { setOk(false); return; } inst = i; her.current = i; i.wave(); }).catch(() => setOk(false));
    return () => { dead = true; clearTimeout(bt.current); if (inst) inst.dispose(); her.current = null; };
  }, [hidden, reduce]);
  // she notices when you go to another page
  const last = useRef(path);
  useEffect(() => {
    if (last.current === path || !her.current) { last.current = path; return; }
    last.current = path; const slug = path.replace(/^\/ash\/?/, "").replace(/\/$/, "");
    her.current.say(PAGE_LINES[slug] || "Back home!"); her.current.wave();
  }, [path]);
  const toggle = () => { const n = !hidden; setHidden(n); try { window.localStorage.setItem("ash-hub-buddy", n ? "off" : "on"); } catch (e) { /* ignore */ } };
  if (!ok) return null;
  return (
    <>
      {!hidden && (
        <Box style={{ x }} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <AnimatePresence>{bubble && <motion.div key={bubble.k} className="bubble" initial={{ opacity: 0, y: 6, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}>{bubble.text}</motion.div>}</AnimatePresence>
          <div className="stage" ref={mount} aria-label="A little Ash who follows your cursor. Click her." />
          {hearts.map((h) => <span key={h.k} className="heart" style={{ left: h.x, top: h.y, "--dx": `${h.dx}px`, animationDelay: `${h.d}s` }}>♥</span>)}
        </Box>
      )}
      <Hide type="button" onClick={toggle} aria-pressed={!hidden}>{hidden ? "Bring her back" : "Hide her"}</Hide>
    </>
  );
}
