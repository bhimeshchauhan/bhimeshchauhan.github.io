import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import Heart from "./Heart";

// A hospital-monitor heartbeat along the bottom edge of the nav. The trace itself is fixed; a bright head sweeps across it left to right,
// leaving a fading tail, so the beats appear as it passes. At the centre the trace draws a heart, which fades as the sweep moves on.
const W = 1920, CX = 960, SWEEP = 5, TAIL = 380;
let d = "M0 30";
for (let x = 120; x < W; x += 210) {
  if (Math.abs(x - CX) < 130) continue; // the centre belongs to the heart
  d += ` H${x} L${x + 8} 30 L${x + 15} 10 L${x + 24} 52 L${x + 32} 20 L${x + 38} 30`;
}
// ...then the heart: baseline into the left side, round the left lobe, the dip, the right lobe, down to the tip, and back up to the start.
d += ` M0 30`; // (restart the baseline so beats and heart are separate strokes)
const BEATS = d;
const HEART = `M${CX - 70} 30 H${CX - 34} C${CX - 34} 6 ${CX - 6} 2 ${CX} 22 C${CX + 6} 2 ${CX + 34} 6 ${CX + 34} 30 C${CX + 34} 42 ${CX + 10} 50 ${CX} 58 C${CX - 10} 50 ${CX - 34} 42 ${CX - 34} 30 L${CX + 34} 30 H${CX + 70}`;

const HD = "M12 21.2s-8.6-5.5-8.6-11.6A4.9 4.9 0 0 1 12 7.1a4.9 4.9 0 0 1 8.6 2.5c0 6.1-8.6 11.6-8.6 11.6z";
const CHARGE_SECS = 4; // hold the pointer on the heart this long and it bursts

export default function HeartLine() {
  const reduce = useReducedMotion();
  const x = useMotionValue(-TAIL);
  const lift = useMotionValue(1); // the centre heart swells as it charges
  const glow = useMotionValue(0);
  const hot = useRef(false); const charge = useRef(0);
  const [burst, setBurst] = useState(0); const [done, setBurstDone] = useState(0);
  useEffect(() => {
    let raf = 0; let last = performance.now(); let alive = true;
    const frame = (now) => {
      if (!alive) return; raf = requestAnimationFrame(frame); const dt = Math.min((now - last) / 1000, 0.05); last = now;
      if (hot.current && !reduce) charge.current = Math.min(1, charge.current + dt / CHARGE_SECS);
      else charge.current = Math.max(0, charge.current - dt / 1.2);
      const c = charge.current;
      let v = x.get() + ((W + TAIL) / SWEEP) * (1 + c * c * 9) * dt; if (v > W) v = -TAIL;
      x.set(v); lift.set(1 + c * 0.9); glow.set(c);
      if (c >= 1) { charge.current = 0; setBurst((n) => n + 1); }
    };
    raf = requestAnimationFrame(frame);
    return () => { alive = false; cancelAnimationFrame(raf); };
  }, [x, lift, glow, reduce]);
  const on = () => { hot.current = true; }; const off = () => { hot.current = false; };
  const pos = useTransform(x, (v) => `${v}px 0px`);
  const mask = `linear-gradient(90deg, transparent 0, rgba(0,0,0,0.25) 40%, #000 96%, transparent 100%)`;
  const layer = { WebkitMaskImage: mask, maskImage: mask, WebkitMaskSize: `${TAIL}px 100%`, maskSize: `${TAIL}px 100%`, WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: pos, maskPosition: pos };
  const flat = "M0 30 H1920"; // the faint resting line that is always there
  return (
    <>
      <div aria-hidden="true" style={{ bottom: -30, height: 60, left: 0, overflow: "hidden", pointerEvents: "none", position: "absolute", right: 0 }}>
        <div style={{ left: "50%", marginLeft: -CX, position: "absolute", width: W, height: 60 }}>
          <svg viewBox={`0 0 ${W} 60`} width={W} height="60" style={{ position: "absolute", inset: 0 }}>
            <path d={flat} stroke="rgba(232,194,107,0.28)" strokeWidth="1.5" fill="none" />
          </svg>
          <motion.svg viewBox={`0 0 ${W} 60`} width={W} height="60" style={{ ...layer, filter: "blur(3px)", position: "absolute", inset: 0 }}>
            <path d={BEATS} stroke="#ffd9a8" strokeWidth="4" fill="none" /><path d={HEART} stroke="#f26c96" strokeWidth="4.5" fill="none" />
          </motion.svg>
          <motion.svg viewBox={`0 0 ${W} 60`} width={W} height="60" style={{ ...layer, position: "absolute", inset: 0 }}>
            <path d={BEATS} stroke="#fff3c4" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d={HEART} stroke="#ff8fb3" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </div>
      </div>
      {/* hover (or press) the heart: the line speeds up, the heart swells and glows, and at the top it bursts */}
      <div onPointerEnter={on} onPointerLeave={off} onPointerDown={on} onPointerUp={off} onPointerCancel={off}
        style={{ bottom: -34, height: 68, left: "50%", marginLeft: -70, position: "absolute", touchAction: "manipulation", width: 140, zIndex: 3 }} aria-hidden="true">
        <motion.div style={{ bottom: 17, left: "50%", marginLeft: -17, pointerEvents: "none", position: "absolute", scale: lift, filter: useTransform(glow, (g) => `drop-shadow(0 0 ${4 + g * 22}px rgba(255,110,160,${0.4 + g * 0.6}))`) }}>
          <motion.div animate={{ opacity: [0, 0, 1, 1, 0, 0], scale: [0.3, 0.3, 1, 1.12, 0.4, 0.3] }} transition={{ duration: SWEEP, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.46, 0.55, 0.68, 1] }}>
            <Heart size={30} burst={false} />
          </motion.div>
          <motion.div style={{ inset: 0, opacity: glow, position: "absolute" }}><Heart size={30} burst={false} /></motion.div>
        </motion.div>
      </div>
      {burst > 0 && burst !== done && <Burst key={burst} onDone={() => setBurstDone(burst)} />}
      {null}
    </>
  );
}

// The finale: a big heart blooms, a ring flashes, and little hearts fly out in every direction.
function Burst({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1700); return () => clearTimeout(t); }, []); // eslint-disable-line
  const bits = Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2 + Math.random() * 0.3; const r = 70 + Math.random() * 90; return { dx: Math.cos(a) * r * 1.6, dy: Math.sin(a) * r * 0.9 + 20, s: 0.5 + Math.random() * 0.9, d: Math.random() * 0.12 }; });
  return (
    <div aria-hidden="true" style={{ bottom: -2, height: 0, left: "50%", pointerEvents: "none", position: "absolute", width: 0, zIndex: 5 }}>
      <motion.div style={{ border: "3px solid #ff8fb3", borderRadius: "50%", height: 40, left: -20, position: "absolute", top: -20, width: 40 }} initial={{ opacity: 0.9, scale: 0.4 }} animate={{ opacity: 0, scale: 9 }} transition={{ duration: 0.9, ease: "easeOut" }} />
      <motion.svg viewBox="0 0 24 24" width="64" height="64" style={{ left: -32, position: "absolute", top: -32, filter: "drop-shadow(0 0 24px rgba(255,110,160,.95))" }} initial={{ opacity: 1, scale: 0.6 }} animate={{ opacity: [1, 1, 0], scale: [0.6, 2.8, 3.6] }} transition={{ duration: 1, ease: "easeOut" }}>
        <path d={HD} fill="#ff7aa6" stroke="#ffd9a8" strokeWidth="0.8" />
      </motion.svg>
      {bits.map((b, i) => (
        <motion.svg key={i} viewBox="0 0 24 24" width={22 * b.s} height={22 * b.s} style={{ left: -11 * b.s, position: "absolute", top: -11 * b.s }} initial={{ opacity: 0, x: 0, y: 0, scale: 0.3 }} animate={{ opacity: [0, 1, 0], x: b.dx, y: b.dy, scale: 1, rotate: b.dx / 6 }} transition={{ duration: 1.4, delay: b.d, ease: "easeOut" }}>
          <path d={HD} fill={i % 3 ? "#ff7aa6" : "#ffd24a"} />
        </motion.svg>
      ))}
    </div>
  );
}
