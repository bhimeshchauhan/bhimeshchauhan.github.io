import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { motion, useReducedMotion, useAnimationControls } from "framer-motion";
import { display } from "./ui";

// Christmas on the hub: snow that drifts away from your cursor, a string of lights, Santa's boot prints appearing in the drift,
// and a sleigh that crosses the sky now and then (click it). It all switches off from the little snowflake button.
const twinkle = keyframes`0%,100%{opacity:1;filter:brightness(1.3)}50%{opacity:.35;filter:brightness(.7)}`;
const Lights = styled.div`
  height: 46px; left: 0; pointer-events: none; position: fixed; right: 0; top: 0; z-index: 41;
  svg { display: block; height: 100%; left: 0; position: absolute; top: 0; width: 100%; }
  i { animation: ${twinkle} 1.8s ease-in-out infinite; border-radius: 50% 50% 55% 55%; display: block; height: 11px; margin-left: -4px; position: absolute; width: 8px; }
  @media (prefers-reduced-motion: reduce) { i { animation: none; } }
`;
const Canvas = styled.canvas`inset: 0; pointer-events: none; position: fixed; z-index: 4;`;
const Toggle = styled.button`
  background: rgba(10, 14, 40, 0.75); border: 1px solid rgba(232, 194, 107, 0.5); border-radius: 999px; bottom: 10px; color: var(--gold2); cursor: pointer; font: inherit; font-size: 0.95rem; height: 34px; left: 12px; position: fixed; width: 38px; z-index: 25;
`;
const Ho = styled(motion.div)`color: #fff; font-family: ${display}; font-size: 1.4rem; font-weight: 700; pointer-events: none; position: fixed; text-shadow: 0 0 16px #ff4a5a, 0 2px 10px #000; z-index: 43;`;
const COLORS = ["#ff4a5a", "#ffd24a", "#4ad2ff", "#6bff8f", "#ff7bd5"];

function Garland() {
  const [w, setW] = useState(1200);
  useEffect(() => { const f = () => setW(window.innerWidth); f(); window.addEventListener("resize", f); return () => window.removeEventListener("resize", f); }, []);
  const swags = Math.max(2, Math.round(w / 300)); const sw = w / swags; const sag = 26; const bulbs = [];
  let d = `M0 4`;
  for (let s = 0; s < swags; s++) {
    const x0 = s * sw; d += ` Q${x0 + sw / 2} ${4 + sag * 2} ${x0 + sw} 4`;
    const n = 5; for (let i = 1; i <= n; i++) { const t = i / (n + 1); const x = x0 + sw * t; const y = (1 - t) * (1 - t) * 4 + 2 * (1 - t) * t * (4 + sag * 2) + t * t * 4; bulbs.push({ x, y, c: COLORS[(s * n + i) % COLORS.length], d: ((s * n + i) % 7) * 0.26 }); }
  }
  return (
    <Lights aria-hidden="true">
      <svg viewBox={`0 0 ${w} 46`} preserveAspectRatio="none"><path d={d} fill="none" stroke="rgba(30,40,30,.8)" strokeWidth="2" /></svg>
      {bulbs.map((b, i) => <i key={i} style={{ left: b.x, top: b.y, background: b.c, boxShadow: `0 0 12px 3px ${b.c}`, animationDelay: `${b.d}s` }} />)}
    </Lights>
  );
}

function Sleigh({ onClick }) {
  return (
    <svg width="330" height="120" viewBox="0 0 330 120" aria-hidden="true">
      <g fill="#0a0f24" stroke="#0a0f24" strokeLinecap="round">
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${i * 52 + 4} 0)`}>
            <ellipse cx="26" cy="60" rx="24" ry="11" /><path d="M44 54L58 40" strokeWidth="7" /><ellipse cx="62" cy="38" rx="9" ry="6" transform="rotate(-20 62 38)" />
            <path d="M60 32l-3-16m3 16l9-14m-9 14l16-8m-9-2l4-6" strokeWidth="2.4" fill="none" />
            <path d="M12 66l-4 26m12-24l-2 26m20-24l4 24m10-26l8 22" strokeWidth="3.2" fill="none" />
          </g>
        ))}
      </g>
      <circle cx="220" cy="40" r="4" fill="#ff3b4a" style={{ filter: "drop-shadow(0 0 7px #ff3b4a)" }} />
      <path d="M0 68H220" stroke="#d9a82e" strokeWidth="1.2" opacity=".7" />
      <g transform="translate(236 50)"><path d="M0 18C0 6 8 0 24 0H64C60 8 52 14 40 14H34C32 22 26 28 14 28H0Z" fill="#c4262e" stroke="#0a0f24" strokeWidth="2" /><path d="M-6 34C20 36 52 36 78 30" stroke="#e8c26b" strokeWidth="3" fill="none" strokeLinecap="round" /><circle cx="38" cy="-4" r="9" fill="#c4262e" /><circle cx="38" cy="-14" r="4" fill="#fff" /></g>
      {[236, 260, 284, 308].map((x, i) => <circle key={x} cx={x} cy={100 + (i % 2) * 4} r="3" fill={COLORS[i]} style={{ filter: `drop-shadow(0 0 6px ${COLORS[i]})` }} />)}
    </svg>
  );
}

export default function Christmas() {
  const reduce = useReducedMotion(); const cv = useRef(null); const [on, setOn] = useState(true); const [ho, setHo] = useState(null);
  const sleigh = useAnimationControls(); const wind = useRef(0);
  useEffect(() => { try { setOn(window.localStorage.getItem("ash-hub-snow") !== "off"); } catch (e) { /* ignore */ } }, []);
  // snow + boot prints
  useEffect(() => {
    if (!on) return undefined; const c = cv.current; const ctx = c.getContext("2d"); let W = 0, H = 0, dead = false, raf = 0;
    const resize = () => { const dpr = Math.min(window.devicePixelRatio || 1, 2); W = window.innerWidth; H = window.innerHeight; c.width = W * dpr; c.height = H * dpr; c.style.width = `${W}px`; c.style.height = `${H}px`; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize(); window.addEventListener("resize", resize);
    const flakes = Array.from({ length: Math.round(Math.min(160, window.innerWidth / 8)) }, () => ({ x: Math.random() * 2000, y: Math.random() * 1000, r: 1 + Math.random() * 2.6, v: 0.4 + Math.random() * 1.1, p: Math.random() * 6.28, s: 0.4 + Math.random() }));
    let mxv = 0, lastX = 0, mxp = -999, myp = -999; const move = (e) => { mxv = e.clientX - lastX; lastX = e.clientX; wind.current = Math.max(-6, Math.min(6, mxv * 0.4)); mxp = e.clientX; myp = e.clientY; };
    window.addEventListener("pointermove", move, { passive: true });
    const prints = []; let walkX = -60, nextWalk = 3, foot = 0, t = 0, last = performance.now(), walking = false;
    const GROUND = () => H - 16;
    const boot = (x, y, flip) => { ctx.save(); ctx.translate(x, y); ctx.rotate(flip * 0.08); ctx.fillStyle = "rgba(150,170,215,.55)"; ctx.beginPath(); ctx.ellipse(0, 0, 4.2, 8.5, 0, 0, 6.3); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, 12, 3.4, 4.2, 0, 0, 6.3); ctx.fill(); ctx.restore(); };
    const frame = (now) => {
      if (dead) return; raf = requestAnimationFrame(frame); const dt = Math.min((now - last) / 1000, 0.05); last = now; t += dt;
      ctx.clearRect(0, 0, W, H);
      // drift along the bottom
      const g = ctx.createLinearGradient(0, H - 46, 0, H); g.addColorStop(0, "rgba(235,242,255,0)"); g.addColorStop(0.55, "rgba(235,242,255,.5)"); g.addColorStop(1, "rgba(250,252,255,.95)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 24) ctx.lineTo(x, H - 18 - Math.sin(x * 0.012) * 6 - Math.sin(x * 0.031 + 1) * 4); ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
      // Santa's footsteps
      nextWalk -= dt; if (!walking && nextWalk <= 0 && !reduce) { walking = true; walkX = -40; foot = 0; }
      if (walking) { walkX += 150 * dt; if (walkX > foot * 46) { foot++; prints.push({ x: walkX, y: GROUND() + (foot % 2 ? 4 : -4), born: t, flip: foot % 2 ? 1 : -1 }); } if (walkX > W + 40) { walking = false; nextWalk = 22 + Math.random() * 18; } }
      for (let i = prints.length - 1; i >= 0; i--) { const p = prints[i]; const age = t - p.born; if (age > 9) { prints.splice(i, 1); continue; } ctx.globalAlpha = Math.min(1, age * 3) * (1 - Math.max(0, (age - 6) / 3)); boot(p.x, p.y, p.flip); ctx.globalAlpha = 1; }
      // flakes
      wind.current *= 0.97; ctx.fillStyle = "rgba(255,255,255,.88)";
      flakes.forEach((f) => { f.y += f.v * 40 * dt * f.s; f.p += dt * f.s; f.x += Math.sin(f.p) * 0.35 + wind.current * 0.25 * f.s; const dx = f.x % W - mxp, dy = f.y - myp; if (Math.hypot(dx, dy) < 70) { f.x += dx * 0.06; f.y += dy * 0.04; } if (f.y > H) { f.y = -8; f.x = Math.random() * W; } if (f.x < -10) f.x = W + 10; const x = ((f.x % W) + W) % W; ctx.beginPath(); ctx.arc(x, f.y, f.r, 0, 6.3); ctx.fill(); });
    };
    raf = requestAnimationFrame(frame);
    return () => { dead = true; cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", move); };
  }, [on, reduce]);
  // sleigh flies across every so often
  useEffect(() => {
    if (!on || reduce) return undefined; let dead = false; let timer;
    const fly = async () => { if (dead) return; const w = window.innerWidth; const top = 190 + Math.random() * 150; await sleigh.set({ x: w + 60, y: top, opacity: 1 }); await sleigh.start({ x: -420, y: [top, top - 30, top + 10, top - 20, top], transition: { duration: 14, ease: "linear" } }); if (!dead) timer = setTimeout(fly, 30000 + Math.random() * 25000); };
    timer = setTimeout(fly, 6000); return () => { dead = true; clearTimeout(timer); sleigh.stop(); };
  }, [on, reduce, sleigh]);
  const toggle = () => { const n = !on; setOn(n); try { window.localStorage.setItem("ash-hub-snow", n ? "on" : "off"); } catch (e) { /* ignore */ } };
  const clickSleigh = (e) => { setHo({ x: e.clientX, y: e.clientY, k: Date.now() }); setTimeout(() => setHo(null), 1500); };
  return (
    <>
      {on && <Canvas ref={cv} aria-hidden="true" />}
      {on && <Garland />}
      {on && !reduce && <motion.div animate={sleigh} initial={{ opacity: 0, x: -500 }} onClick={clickSleigh} style={{ cursor: "pointer", left: 0, position: "fixed", top: 0, zIndex: 3 }}><Sleigh /></motion.div>}
      {ho && <Ho key={ho.k} style={{ left: ho.x - 50, top: ho.y - 20 }} initial={{ opacity: 0, y: 0, scale: 0.6 }} animate={{ opacity: [0, 1, 0], y: -60, scale: 1.2 }} transition={{ duration: 1.4 }}>Ho ho ho!</Ho>}
      <Toggle type="button" aria-label={on ? "Turn the snow and lights off" : "Turn the snow and lights on"} aria-pressed={on} onClick={toggle}>{on ? "❄" : "☃"}</Toggle>
    </>
  );
}
