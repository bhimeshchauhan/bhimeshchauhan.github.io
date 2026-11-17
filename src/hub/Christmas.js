import React, { useEffect, useRef, useState } from "react";
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
const Canvas = styled.canvas`inset: 0; pointer-events: none; position: fixed; z-index: 4;`;
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
function makePath(W, H) {
  const ltr = Math.random() < 0.5; const y0 = H * (0.3 + Math.random() * 0.45), y1 = H * (0.25 + Math.random() * 0.5);
  const pts = [[ltr ? -80 : W + 80, y0], [W * (ltr ? 0.3 : 0.7), y0 + (Math.random() - 0.5) * 420], [W * (ltr ? 0.68 : 0.32), y1 + (Math.random() - 0.5) * 420], [ltr ? W + 80 : -80, y1]];
  const P = []; let len = 0; let prev = null;
  for (let i = 0; i <= 500; i++) { const t = i / 500, u = 1 - t; const x = u * u * u * pts[0][0] + 3 * u * u * t * pts[1][0] + 3 * u * t * t * pts[2][0] + t * t * t * pts[3][0]; const y = u * u * u * pts[0][1] + 3 * u * u * t * pts[1][1] + 3 * u * t * t * pts[2][1] + t * t * t * pts[3][1]; if (prev) len += Math.hypot(x - prev[0], y - prev[1]); P.push({ x, y, s: len }); prev = [x, y]; }
  return { P, len };
}
function at(path, s) {
  const P = path.P; if (s <= 0) return { ...P[0], a: 0 }; if (s >= path.len) { const q = P[P.length - 1]; return { ...q, a: 0 }; }
  let lo = 0, hi = P.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (P[m].s < s) lo = m; else hi = m; }
  const A = P[lo], B = P[hi]; const k = (s - A.s) / Math.max(0.001, B.s - A.s); return { x: A.x + (B.x - A.x) * k, y: A.y + (B.y - A.y) * k, a: Math.atan2(B.y - A.y, B.x - A.x) };
}
const INK_L = "rgba(246,236,205,.8)", INK_D = "rgba(6,10,30,.5)";
function drawMark(ctx, m, alpha) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(m.x, m.y); ctx.rotate(m.a + Math.PI / 2); ctx.scale(m.k === "run" ? 1 : 1.7, m.k === "run" ? 1 : 1.7);
  const shape = (dx, dy, col) => {
    ctx.fillStyle = col; ctx.strokeStyle = col;
    if (m.k === "boot") { ctx.beginPath(); ctx.ellipse(dx, dy, 4.4, 8.6, 0, 0, 6.3); ctx.fill(); ctx.beginPath(); ctx.ellipse(dx, dy + 12.5, 3.4, 3.8, 0, 0, 6.3); ctx.fill(); }
    else if (m.k === "hoof") { [-2.2, 2.2].forEach((o) => { ctx.beginPath(); ctx.ellipse(dx + o, dy, 1.7, 4.6, o * 0.08, 0, 6.3); ctx.fill(); }); }
    else { ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(dx, dy - 7); ctx.lineTo(dx, dy + 7); ctx.stroke(); }
  };
  shape(1.3, 1.6, INK_D); shape(-0.6, -0.8, INK_L); ctx.restore();
}

export default function Christmas() {
  const reduce = useReducedMotion(); const cv = useRef(null); const [on, setOn] = useState(true); const wind = useRef(0);
  useEffect(() => { try { setOn(window.localStorage.getItem("ash-hub-snow") !== "off"); } catch (e) { /* ignore */ } }, []);
  useEffect(() => {
    if (!on) return undefined; const c = cv.current; const ctx = c.getContext("2d"); let W = 0, H = 0, dead = false, raf = 0;
    const resize = () => { const dpr = Math.min(window.devicePixelRatio || 1, 2); W = window.innerWidth; H = window.innerHeight; c.width = W * dpr; c.height = H * dpr; c.style.width = `${W}px`; c.style.height = `${H}px`; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize(); window.addEventListener("resize", resize);
    const flakes = Array.from({ length: Math.round(Math.min(160, window.innerWidth / 8)) }, () => ({ x: Math.random() * 2000, y: Math.random() * 1000, r: 1 + Math.random() * 2.6, v: 0.4 + Math.random() * 1.1, p: Math.random() * 6.28, s: 0.4 + Math.random() }));
    let lastX = 0, mxp = -999, myp = -999; const move = (e) => { wind.current = Math.max(-6, Math.min(6, (e.clientX - lastX) * 0.4)); lastX = e.clientX; mxp = e.clientX; myp = e.clientY; };
    window.addEventListener("pointermove", move, { passive: true });
    // the procession
    const ROWS = 4, GAP = 62, BEHIND = 170, SLEIGH = BEHIND + ROWS * GAP + 70; const names = ["Rudolph", "Dasher", "Dancer", "Prancer"];
    let run = null, nextRun = reduce ? 1e9 : 2.5, t = 0, last = performance.now(); const marks = [];
    const start = () => { const path = makePath(W, H); run = { path, s: 0, santaStep: 0, hoofStep: 0, runStep: 0, speed: 95, total: path.len + SLEIGH + 60 }; };
    const frame = (now) => {
      if (dead) return; raf = requestAnimationFrame(frame); const dt = Math.min((now - last) / 1000, 0.05); last = now; t += dt;
      ctx.clearRect(0, 0, W, H);
      const g = ctx.createLinearGradient(0, H - 46, 0, H); g.addColorStop(0, "rgba(235,242,255,0)"); g.addColorStop(0.55, "rgba(235,242,255,.5)"); g.addColorStop(1, "rgba(250,252,255,.95)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 24) ctx.lineTo(x, H - 18 - Math.sin(x * 0.012) * 6 - Math.sin(x * 0.031 + 1) * 4); ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
      if (!run) { nextRun -= dt; if (nextRun <= 0) start(); }
      let santa = null, labels = [];
      if (run) {
        run.s += run.speed * dt; const path = run.path;
        if (run.s < path.len + 20) { santa = at(path, run.s); while (run.santaStep * 46 <= run.s) { const sp = at(path, run.santaStep * 46); const side = run.santaStep % 2 ? 1 : -1; marks.push({ k: "boot", x: sp.x + Math.cos(sp.a + Math.PI / 2) * 7 * side, y: sp.y + Math.sin(sp.a + Math.PI / 2) * 7 * side, a: sp.a, born: t }); run.santaStep++; } }
        // reindeer: each leaves a pair of hoofprints every 26px
        const hs = 44; while (run.hoofStep * hs < run.s) { const d = run.hoofStep * hs; for (let r = 0; r < ROWS; r++) for (const side of [-1, 1]) { const dist = d - BEHIND - r * GAP; if (dist < 0 || dist > path.len) continue; const sp = at(path, dist); const off = side * 22; marks.push({ k: "hoof", x: sp.x + Math.cos(sp.a + Math.PI / 2) * off, y: sp.y + Math.sin(sp.a + Math.PI / 2) * off + (run.hoofStep % 2) * 4, a: sp.a, born: t }); } run.hoofStep++; }
        // sleigh runners: two parallel tracks
        const rs = 15; while (run.runStep * rs < run.s) { const dist = run.runStep * rs - SLEIGH; if (dist >= 0 && dist <= path.len) { const sp = at(path, dist); for (const side of [-1, 1]) marks.push({ k: "run", x: sp.x + Math.cos(sp.a + Math.PI / 2) * 17 * side, y: sp.y + Math.sin(sp.a + Math.PI / 2) * 17 * side, a: sp.a, born: t }); } run.runStep++; }
        // name tags in the Marauder's Map style
        if (santa) labels.push(["Santa Claus", santa.x, santa.y - 10]);
        const rud = at(path, Math.max(0, run.s - BEHIND)); if (run.s > BEHIND && run.s - BEHIND < path.len) labels.push(["Rudolph", rud.x, rud.y - 30]);
        const sl = at(path, Math.max(0, run.s - SLEIGH)); if (run.s > SLEIGH && run.s - SLEIGH < path.len) labels.push(["the sleigh", sl.x, sl.y - 34]);
        if (run.s > run.total) { run = null; nextRun = 18 + Math.random() * 14; }
      }
      for (let i = marks.length - 1; i >= 0; i--) { const m = marks[i]; const age = t - m.born; if (age > 12) { marks.splice(i, 1); continue; } drawMark(ctx, m, Math.min(1, age * 4) * (1 - Math.max(0, (age - 8) / 4))); }
      ctx.font = "26px Caveat, cursive"; ctx.textAlign = "center"; ctx.lineWidth = 4; ctx.strokeStyle = "rgba(6,10,30,.7)"; ctx.fillStyle = "rgba(250,240,210,.95)";
      labels.forEach(([txt, x, y]) => { ctx.strokeText(txt, x + 34, y - 14); ctx.fillText(txt, x + 34, y - 14); });
      wind.current *= 0.97; ctx.fillStyle = "rgba(255,255,255,.88)";
      flakes.forEach((f) => { f.y += f.v * 40 * dt * f.s; f.p += dt * f.s; f.x += Math.sin(f.p) * 0.35 + wind.current * 0.25 * f.s; const dx = (f.x % W) - mxp, dy = f.y - myp; if (Math.hypot(dx, dy) < 70) { f.x += dx * 0.06; f.y += dy * 0.04; } if (f.y > H) { f.y = -8; f.x = Math.random() * W; } if (f.x < -10) f.x = W + 10; const x = ((f.x % W) + W) % W; ctx.beginPath(); ctx.arc(x, f.y, f.r, 0, 6.3); ctx.fill(); });
    };
    raf = requestAnimationFrame(frame);
    return () => { dead = true; cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", move); };
  }, [on, reduce]);
  const toggle = () => { const n = !on; setOn(n); try { window.localStorage.setItem("ash-hub-snow", n ? "on" : "off"); } catch (e) { /* ignore */ } };
  return (
    <>
      {on && <Canvas ref={cv} aria-hidden="true" />}
      {on && <Garland />}
      <Toggle type="button" aria-label={on ? "Turn the snow and lights off" : "Turn the snow and lights on"} aria-pressed={on} onClick={toggle}>{on ? "❄" : "☃"}</Toggle>
    </>
  );
}
