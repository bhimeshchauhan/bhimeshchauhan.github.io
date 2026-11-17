import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled, { keyframes } from "styled-components";
import { useReducedMotion } from "framer-motion";

// Christmas on the hub: snow that drifts away from your cursor, a string of lights, Santa's boot prints appearing in the drift,
// and a sleigh that crosses the sky now and then (click it). It all switches off from the little snowflake button.
const twinkle = keyframes`0%,100%{opacity:1;filter:brightness(1.3)}50%{opacity:.35;filter:brightness(.7)}`;
const Lights = styled.div`
  height: 30px; left: 0; pointer-events: none; position: fixed; right: 0; top: 0; z-index: 41;
  svg { display: block; height: 100%; left: 0; position: absolute; top: 0; width: 100%; }
  i { animation: ${twinkle} 1.8s ease-in-out infinite; border-radius: 50% 50% 55% 55%; display: block; height: 9px; margin-left: -3px; position: absolute; width: 6px; }
  @media (prefers-reduced-motion: reduce) { i { animation: none; } }
`;
const Canvas = styled.canvas`inset: 0; pointer-events: none; position: fixed; z-index: -1;`;
const Toggle = styled.button`
  background: rgba(10, 14, 40, 0.75); border: 1px solid rgba(232, 194, 107, 0.5); border-radius: 999px; bottom: 10px; color: var(--gold2); cursor: pointer; font: inherit; font-size: 0.95rem; height: 34px; left: 12px; position: fixed; width: 38px; z-index: 25;
`;
const COLORS = ["#ff4a5a", "#ffd24a", "#4ad2ff", "#6bff8f", "#ff7bd5"];

function Garland() {
  const [w, setW] = useState(1200);
  useEffect(() => { const f = () => setW(window.innerWidth); f(); window.addEventListener("resize", f); return () => window.removeEventListener("resize", f); }, []);
  const swags = Math.max(2, Math.round(w / 300)); const sw = w / swags; const sag = 8; const bulbs = [];
  let d = `M0 4`;
  for (let s = 0; s < swags; s++) {
    const x0 = s * sw; d += ` Q${x0 + sw / 2} ${4 + sag * 2} ${x0 + sw} 4`;
    const n = 5; for (let i = 1; i <= n; i++) { const t = i / (n + 1); const x = x0 + sw * t; const y = (1 - t) * (1 - t) * 4 + 2 * (1 - t) * t * (4 + sag * 2) + t * t * 4; bulbs.push({ x, y, c: COLORS[(s * n + i) % COLORS.length], d: ((s * n + i) % 7) * 0.26 }); }
  }
  return (
    <Lights aria-hidden="true">
      <svg viewBox={`0 0 ${w} 30`} preserveAspectRatio="none"><path d={d} fill="none" stroke="rgba(30,40,30,.8)" strokeWidth="2" /></svg>
      {bulbs.map((b, i) => <i key={i} style={{ left: b.x, top: b.y, background: b.c, boxShadow: `0 0 7px 1px ${b.c}`, animationDelay: `${b.d}s` }} />)}
    </Lights>
  );
}

// Santa, his reindeer and the sleigh cross the page like the Marauder's Map: you only see what they leave behind, boot prints,
// hoof prints and sleigh runners appearing in the snow, with a handwritten name beside them.
const INK_L = "rgba(246,236,205,.8)", INK_D = "rgba(6,10,30,.5)";
function drawMark(ctx, m, alpha) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(m.x, m.y); ctx.rotate(m.a + Math.PI / 2); ctx.scale(m.k === "run" ? 1.2 : 1.5, m.k === "run" ? 1.2 : 1.5);
  const shape = (dx, dy, col) => {
    ctx.fillStyle = col; ctx.strokeStyle = col;
    if (m.k === "boot") { ctx.beginPath(); ctx.ellipse(dx, dy, 4.4, 8.6, 0, 0, 6.3); ctx.fill(); ctx.beginPath(); ctx.ellipse(dx, dy + 12.5, 3.4, 3.8, 0, 0, 6.3); ctx.fill(); }
    else if (m.k === "paw") { ctx.beginPath(); ctx.ellipse(dx, dy + 2.5, 3.2, 2.7, 0, 0, 6.3); ctx.fill(); [[-3.6, -1.6], [-1.3, -4], [1.3, -4], [3.6, -1.6]].forEach(([ox, oy]) => { ctx.beginPath(); ctx.ellipse(dx + ox, dy + oy, 1.25, 1.5, 0, 0, 6.3); ctx.fill(); }); }
    else if (m.k === "hoof") { [-2.2, 2.2].forEach((o) => { ctx.beginPath(); ctx.ellipse(dx + o, dy, 1.7, 4.6, o * 0.08, 0, 6.3); ctx.fill(); }); }
    else { ctx.lineWidth = 4.5; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(dx, dy - 5); ctx.lineTo(dx, dy + 5); ctx.stroke(); }
  };
  shape(1.3, 1.6, INK_D); shape(-0.6, -0.8, INK_L); ctx.restore();
}

export default function Christmas({ path }) {
  const [host, setHost] = useState(null);
  // The snow lives inside the page itself, between the painting and the content, so it falls behind the cards and text.
  useEffect(() => { setHost(null); const t = setTimeout(() => setHost(document.querySelector(".hub main")), 80); return () => clearTimeout(t); }, [path]);
  const reduce = useReducedMotion(); const cv = useRef(null); const [on, setOn] = useState(true); const wind = useRef(0);
  useEffect(() => { try { setOn(window.localStorage.getItem("ash-hub-snow") !== "off"); } catch (e) { /* ignore */ } }, []);
  useEffect(() => {
    if (!on || !host) return undefined; const c = cv.current; const ctx = c.getContext("2d"); let W = 0, H = 0, dead = false, raf = 0;
    const resize = () => { const dpr = Math.min(window.devicePixelRatio || 1, 2); W = window.innerWidth; H = window.innerHeight; c.width = W * dpr; c.height = H * dpr; c.style.width = `${W}px`; c.style.height = `${H}px`; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize(); window.addEventListener("resize", resize);
    const flakes = Array.from({ length: Math.round(Math.min(160, window.innerWidth / 8)) }, () => ({ x: Math.random() * 2000, y: Math.random() * 1000, r: 1 + Math.random() * 2.6, v: 0.4 + Math.random() * 1.1, p: Math.random() * 6.28, s: 0.4 + Math.random() }));
    let lastX = 0, mxp = -999, myp = -999; const move = (e) => { wind.current = Math.max(-6, Math.min(6, (e.clientX - lastX) * 0.4)); lastX = e.clientX; mxp = e.clientX; myp = e.clientY; };
    window.addEventListener("pointermove", move, { passive: true });
    // faint, scattered tracks: Santa wandering, single reindeer going their own ways, and the odd sleigh skid
    const walkers = []; let nextSpawn = reduce ? 1e9 : 1; let t = 0, last = performance.now(); const marks = [];
    const spawn = () => {
      const r = Math.random(); const kind = r < 0.3 ? "boot" : r < 0.55 ? "hoof" : r < 0.82 ? "paw" : "run";
      const side = Math.floor(Math.random() * 4); const m = 40; let x, y, h;
      if (side === 0) { x = -m; y = 140 + Math.random() * (H - 260); h = (Math.random() - 0.5) * 0.9; }
      else if (side === 1) { x = W + m; y = 140 + Math.random() * (H - 260); h = Math.PI + (Math.random() - 0.5) * 0.9; }
      else if (side === 2) { x = 60 + Math.random() * (W - 120); y = H + m; h = -Math.PI / 2 + (Math.random() - 0.5) * 0.9; }
      else { x = 60 + Math.random() * (W - 120); y = 140 - m; h = Math.PI / 2 + (Math.random() - 0.5) * 0.9; }
      const w = { kind, x, y, h, left: kind === "run" ? 70 : 14 + Math.floor(Math.random() * 10), acc: 0, n: 0, turn: (Math.random() - 0.5) * (kind === "run" ? 0.06 : 0.03) };
      w.step = kind === "boot" ? 44 : kind === "hoof" ? 38 : kind === "paw" ? 24 : 6; w.speed = kind === "boot" ? 70 : kind === "hoof" ? 110 : kind === "paw" ? 100 : 90; walkers.push(w);
    };
    const frame = (now) => {
      if (dead) return; raf = requestAnimationFrame(frame); const dt = Math.min((now - last) / 1000, 0.05); last = now; t += dt;
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createLinearGradient(0, H - 46, 0, H); g.addColorStop(0, "rgba(235,242,255,0)"); g.addColorStop(0.55, "rgba(235,242,255,.5)"); g.addColorStop(1, "rgba(250,252,255,.95)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 24) ctx.lineTo(x, H - 18 - Math.sin(x * 0.012) * 6 - Math.sin(x * 0.031 + 1) * 4); ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
      nextSpawn -= dt; if (nextSpawn <= 0 && walkers.length < 4) { spawn(); nextSpawn = 2.5 + Math.random() * 4; }
      for (let i = walkers.length - 1; i >= 0; i--) {
        const w = walkers[i]; const d = w.speed * dt; w.acc += d; w.h += w.turn + (Math.random() - 0.5) * 0.04; w.x += Math.cos(w.h) * d; w.y += Math.sin(w.h) * d;
        while (w.acc >= w.step && w.left > 0) {
          w.acc -= w.step; w.left--; w.n++; const nx = Math.cos(w.h + Math.PI / 2), ny = Math.sin(w.h + Math.PI / 2); const side = w.n % 2 ? 1 : -1;
          if (w.kind === "run") { for (const sd of [-1, 1]) marks.push({ k: "run", x: w.x + nx * 11 * sd, y: w.y + ny * 11 * sd, a: w.h, born: t }); }
          else marks.push({ k: w.kind, x: w.x + nx * (w.kind === "boot" ? 6 : w.kind === "paw" ? 5 : 9) * side, y: w.y + ny * (w.kind === "boot" ? 6 : w.kind === "paw" ? 5 : 9) * side, a: w.h, born: t });
        }
        if (w.left <= 0) walkers.splice(i, 1);
      }
      for (let i = marks.length - 1; i >= 0; i--) { const m = marks[i]; const age = t - m.born; if (age > 14) { marks.splice(i, 1); continue; } drawMark(ctx, m, 0.7 * Math.min(1, age * 2) * (1 - Math.max(0, (age - 9) / 5))); }
      wind.current *= 0.97; ctx.fillStyle = "rgba(255,255,255,.88)";
      flakes.forEach((f) => { f.y += f.v * 40 * dt * f.s; f.p += dt * f.s; f.x += Math.sin(f.p) * 0.35 + wind.current * 0.25 * f.s; const dx = (f.x % W) - mxp, dy = f.y - myp; if (Math.hypot(dx, dy) < 70) { f.x += dx * 0.06; f.y += dy * 0.04; } if (f.y > H) { f.y = -8; f.x = Math.random() * W; } if (f.x < -10) f.x = W + 10; const x = ((f.x % W) + W) % W; ctx.beginPath(); ctx.arc(x, f.y, f.r, 0, 6.3); ctx.fill(); });
    };
    raf = requestAnimationFrame(frame);
    return () => { dead = true; cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", move); };
  }, [on, reduce, host]);
  const toggle = () => { const n = !on; setOn(n); try { window.localStorage.setItem("ash-hub-snow", n ? "on" : "off"); } catch (e) { /* ignore */ } };
  return (
    <>
      {on && host && createPortal(<Canvas ref={cv} aria-hidden="true" />, host)}
      {on && <Garland />}
      <Toggle type="button" aria-label={on ? "Turn the snow and lights off" : "Turn the snow and lights on"} aria-pressed={on} onClick={toggle}>{on ? "❄" : "☃"}</Toggle>
    </>
  );
}
