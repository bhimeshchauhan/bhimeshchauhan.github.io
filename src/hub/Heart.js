import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// An animated heart: it draws itself in, beats like a real heart (a quick double pulse, then a rest), glows, shines,
// and sends little hearts floating up when you hover or tap it. Framer Motion's reduced-motion setting calms it down.
const D = "M12 21.2s-8.6-5.5-8.6-11.6A4.9 4.9 0 0 1 12 7.1a4.9 4.9 0 0 1 8.6 2.5c0 6.1-8.6 11.6-8.6 11.6z";
let uid = 0;

export default function Heart({ size = 30, burst = true }) {
  const [hearts, setHearts] = useState([]);
  const [id] = useState(() => `h${uid++}`);
  const pop = () => {
    if (!burst) return;
    const n = Date.now();
    const fresh = Array.from({ length: 7 }, (_, i) => ({ k: `${n}-${i}`, x: (Math.random() - 0.5) * 70, s: 0.45 + Math.random() * 0.55, d: i * 0.05 }));
    setHearts((h) => [...h, ...fresh]);
    setTimeout(() => setHearts((h) => h.filter((x) => !fresh.includes(x))), 1700);
  };
  return (
    <span style={{ display: "inline-block", height: size, position: "relative", verticalAlign: "middle", width: size }} onMouseEnter={pop} onClick={pop} role="img" aria-label="heart">
      <motion.svg viewBox="0 0 24 24" width={size} height={size} style={{ overflow: "visible", cursor: "pointer" }}
        animate={{ scale: [1, 1.2, 1, 1.13, 1, 1], filter: ["drop-shadow(0 0 3px rgba(240,100,150,.5))", "drop-shadow(0 0 11px rgba(255,120,170,.95))", "drop-shadow(0 0 4px rgba(240,100,150,.55))", "drop-shadow(0 0 8px rgba(255,120,170,.8))", "drop-shadow(0 0 3px rgba(240,100,150,.5))", "drop-shadow(0 0 3px rgba(240,100,150,.5))"] }}
        transition={{ duration: 1.7, repeat: Infinity, times: [0, 0.14, 0.28, 0.42, 0.56, 1], ease: "easeInOut" }}
        whileHover={{ scale: 1.3, rotate: -6 }} whileTap={{ scale: 0.88 }}>
        <defs>
          <linearGradient id={`${id}f`} x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0" stopColor="#ffc2d4" /><stop offset="0.5" stopColor="#f2688f" /><stop offset="1" stopColor="#c23566" />
          </linearGradient>
          <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f6e3a6" /><stop offset="1" stopColor="#e8c26b" /></linearGradient>
          <clipPath id={`${id}c`}><path d={D} /></clipPath>
        </defs>
        <motion.path d={D} fill={`url(#${id}f)`} stroke={`url(#${id}s)`} strokeWidth="0.9" strokeLinejoin="round"
          initial={{ pathLength: 0, fillOpacity: 0 }} animate={{ pathLength: 1, fillOpacity: 1 }} transition={{ pathLength: { duration: 1.3, ease: "easeInOut" }, fillOpacity: { duration: 0.8, delay: 1 } }} />
        <g clipPath={`url(#${id}c)`}>
          <motion.rect x="-8" y="0" width="5" height="26" fill="rgba(255,255,255,.55)" transform="rotate(18 12 12)"
            animate={{ x: [-8, 34] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2.6, ease: "easeInOut" }} />
        </g>
        <path d="M7.1 9.4c.5-1.3 1.6-1.9 2.7-1.7" fill="none" stroke="rgba(255,255,255,.65)" strokeWidth="1.1" strokeLinecap="round" />
      </motion.svg>
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.svg key={h.k} viewBox="0 0 24 24" width={size * h.s * 0.6} height={size * h.s * 0.6} aria-hidden="true"
            style={{ left: "50%", marginLeft: -(size * h.s * 0.3), pointerEvents: "none", position: "absolute", top: "30%" }}
            initial={{ opacity: 0, y: 0, x: 0, scale: 0.4 }} animate={{ opacity: [0, 1, 0], y: -(46 + h.s * 40), x: h.x, scale: 1, rotate: h.x / 3 }} exit={{ opacity: 0 }} transition={{ duration: 1.5, delay: h.d, ease: "easeOut" }}>
            <path d={D} fill="#f2688f" />
          </motion.svg>
        ))}
      </AnimatePresence>
    </span>
  );
}
