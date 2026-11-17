import React, { useEffect, useRef } from "react";

// A painted night sky for Ash: swirling brush strokes in the spirit of Van Gogh's "Starry Night", stars that breathe in rings,
// a crescent moon, and a cat hidden in the stars. Drawn procedurally (no copied artwork). The strokes are painted once into an
// offscreen layer; only the stars, light and sparkles animate, so it stays light on phones. Respects "reduce motion".

const BLUES = ["#101a52", "#16245f", "#1f3a8a", "#2b56b0", "#3f7bd1", "#78a9e6", "#a8cdf2", "#2d8a9b"];
const rng = (seed) => {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
};

// Flow direction at a point: two big vortices (like the great swirl) plus gentle waves.
const angleAt = (x, y, w, h) => {
  const vortices = [
    { x: 0.3 * w, y: 0.36 * h, k: 1, r: 0.32 * Math.min(w, h * 1.4) },
    { x: 0.7 * w, y: 0.26 * h, k: -1, r: 0.26 * Math.min(w, h * 1.4) }
  ];
  let vx = Math.cos(y * 0.011 + Math.sin(x * 0.006) * 2.2) * 0.55;
  let vy = Math.sin(x * 0.009 + Math.cos(y * 0.007) * 1.8) * 0.55;
  for (const v of vortices) {
    const dx = x - v.x, dy = y - v.y;
    const d = Math.hypot(dx, dy) + 0.001;
    const wgt = Math.exp(-(d * d) / (2 * v.r * v.r)) * 2.4;
    vx += (-dy / d) * v.k * wgt;
    vy += (dx / d) * v.k * wgt;
  }
  return Math.atan2(vy, vx);
};

const STARS = [
  [0.12, 0.17, 1.0], [0.33, 0.09, 0.8], [0.52, 0.22, 1.15], [0.74, 0.1, 0.85], [0.9, 0.34, 0.8], [0.2, 0.46, 0.7],
  [0.62, 0.46, 1.0], [0.82, 0.6, 0.7], [0.08, 0.72, 0.8], [0.46, 0.68, 0.6], [0.93, 0.84, 0.75], [0.3, 0.86, 0.65]
];
// A cat's face, drawn as a constellation: ears, cheeks, chin, then two eyes and a nose.
const CAT = { outline: [[0.05, 0], [0, 0.55], [0.25, 1], [0.75, 1], [1, 0.55], [0.95, 0], [0.72, 0.28], [0.28, 0.28]], dots: [[0.3, 0.62], [0.7, 0.62], [0.5, 0.78]] };

function paintLayer(w, h, dpr) {
  const c = document.createElement("canvas");
  c.width = Math.ceil(w * dpr);
  c.height = Math.ceil(h * dpr);
  const ctx = c.getContext("2d");
  ctx.scale(dpr, dpr);
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#080c2a");
  g.addColorStop(0.55, "#0f1a5a");
  g.addColorStop(1, "#070b1f");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  const rand = rng(1889); // the year of the painting
  const count = Math.min(4600, Math.max(1100, Math.floor((w * h) / 260)));
  ctx.lineCap = "round";
  for (let i = 0; i < count; i++) {
    let x = rand() * w, y = rand() * h;
    const near = Math.hypot(x - 0.3 * w, y - 0.36 * h) < 0.3 * w || Math.hypot(x - 0.7 * w, y - 0.26 * h) < 0.25 * w;
    const pick = Math.min(BLUES.length - 1, Math.floor((near ? 3 + rand() * 4 : rand() * 5) * (1 - (y / h) * 0.35)));
    ctx.strokeStyle = BLUES[Math.max(0, pick)];
    ctx.globalAlpha = 0.32 + rand() * 0.35;
    ctx.lineWidth = 2 + rand() * 3.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    const steps = 9 + Math.floor(rand() * 12), step = 5 + rand() * 4;
    for (let s = 0; s < steps; s++) {
      const a = angleAt(x, y, w, h);
      x += Math.cos(a) * step;
      y += Math.sin(a) * step;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // a few warm strokes around the stars, the way the painter lit them
  ctx.globalAlpha = 0.5;
  for (const [sx, sy, sc] of STARS) {
    for (let i = 0; i < 10; i++) {
      const a = rand() * Math.PI * 2, r = (24 + rand() * 38) * sc;
      ctx.strokeStyle = rand() < 0.5 ? "#e8c26b" : "#f6e3a6";
      ctx.lineWidth = 1.6 + rand() * 2;
      ctx.beginPath();
      ctx.arc(sx * w, sy * h, r, a, a + 0.5 + rand() * 0.8);
      ctx.stroke();
    }
  }
  // keep the bottom calm so reading is easy
  ctx.globalAlpha = 1;
  const fade = ctx.createLinearGradient(0, h * 0.55, 0, h);
  fade.addColorStop(0, "rgba(7,11,31,0)");
  fade.addColorStop(1, "rgba(7,11,31,0.55)");
  ctx.fillStyle = fade;
  ctx.fillRect(0, h * 0.55, w, h * 0.45);
  return c;
}

export default function SkyCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, dpr = 1, layer = null, raf = 0, last = 0, running = true;
    const mouse = { x: 0, y: 0 };
    const sparkles = [];
    let scrollY = 0;

    const size = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.ceil(w * dpr);
      canvas.height = Math.ceil(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      layer = paintLayer(w, h, dpr);
      frame(performance.now(), true);
    };

    const star4 = (x, y, r, alpha) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = "#fff3c4";
      ctx.beginPath();
      ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.quadraticCurveTo(x, y, x, y + r);
      ctx.quadraticCurveTo(x, y, x - r, y); ctx.quadraticCurveTo(x, y, x, y - r);
      ctx.fill();
    };

    const frame = (now, still) => {
      if (!layer) return;
      const t = now / 1000;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      const px = reduce ? 0 : mouse.x * 10, py = reduce ? 0 : -Math.min(scrollY, 900) * 0.04 + mouse.y * 6;
      ctx.drawImage(layer, -14 + px, -14 + py, w + 28, h + 28);

      // drifting light on the swirls
      if (!reduce) {
        ctx.globalCompositeOperation = "lighter";
        for (let i = 0; i < 3; i++) {
          const cx = w * (0.3 + 0.4 * i) + Math.sin(t * 0.18 + i * 2) * w * 0.12, cy = h * (0.3 + 0.18 * i) + Math.cos(t * 0.15 + i) * h * 0.08;
          const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.32);
          gr.addColorStop(0, i === 1 ? "rgba(232,194,107,0.07)" : "rgba(90,140,230,0.09)");
          gr.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = gr;
          ctx.fillRect(0, 0, w, h);
        }
      }
      ctx.globalCompositeOperation = "source-over";

      // the moon: a warm crescent
      const mx = w * 0.88, my = h * 0.13, mr = Math.min(w, h) * 0.055 + 12;
      ctx.save();
      ctx.shadowColor = "rgba(255,200,90,0.9)";
      ctx.shadowBlur = 38;
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI * 2);
      ctx.arc(mx + mr * 0.34, my - mr * 0.1, mr * 0.74, 0, Math.PI * 2, true);
      ctx.fillStyle = "#ffd878";
      ctx.fill("evenodd");
      ctx.restore();

      // stars that breathe in rings
      for (let i = 0; i < STARS.length; i++) {
        const [sx, sy, sc] = STARS[i];
        const x = sx * w + px * 0.5, y = sy * h + py * 0.5;
        const pulse = reduce ? 0 : Math.sin(t * 1.2 + i * 1.7) * 2.2;
        const base = (7 + 5 * sc) * (w < 600 ? 0.75 : 1);
        for (let r = 0; r < 4; r++) {
          ctx.globalAlpha = 0.42 - r * 0.09;
          ctx.strokeStyle = r % 2 ? "#e8c26b" : "#fff0b0";
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(x, y, base + r * 6.5 * sc + pulse * (r + 1) * 0.35, 0, Math.PI * 2);
          ctx.stroke();
        }
        const core = ctx.createRadialGradient(x, y, 0, x, y, base);
        core.addColorStop(0, "rgba(255,250,215,1)");
        core.addColorStop(1, "rgba(255,214,110,0)");
        ctx.globalAlpha = 1;
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(x, y, base, 0, Math.PI * 2);
        ctx.fill();
      }

      // the cat in the stars
      const cs = Math.min(w, h) * 0.13 + 28, cx0 = w * 0.05 + px * 0.5, cy0 = h * 0.6 + py * 0.5;
      ctx.globalAlpha = 0.34;
      ctx.strokeStyle = "#f6e3a6";
      ctx.lineWidth = 1;
      ctx.beginPath();
      CAT.outline.forEach(([a, b], i) => (i ? ctx.lineTo(cx0 + a * cs, cy0 + b * cs) : ctx.moveTo(cx0 + a * cs, cy0 + b * cs)));
      ctx.closePath();
      ctx.stroke();
      [...CAT.outline, ...CAT.dots].forEach(([a, b], i) => star4(cx0 + a * cs, cy0 + b * cs, 3.2 + (i > 7 ? 1.6 : 0), 0.85));

      // sparkles that follow the pointer
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.life -= 0.022; s.x += s.vx; s.y += s.vy;
        if (s.life <= 0) sparkles.splice(i, 1);
        else star4(s.x, s.y, 2 + s.life * 4, s.life);
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      if (now - last < 32) return; // about 30 frames a second is plenty for a painting
      last = now;
      frame(now);
    };

    const onMove = (e) => {
      mouse.x = e.clientX / w - 0.5;
      mouse.y = e.clientY / h - 0.5;
      if (!reduce && e.pointerType !== "touch" && sparkles.length < 40 && Math.random() < 0.5)
        sparkles.push({ x: e.clientX, y: e.clientY, vx: (Math.random() - 0.5) * 0.7, vy: Math.random() * 0.5, life: 1 });
    };
    const onScroll = () => { scrollY = window.scrollY; };
    const onVis = () => {
      running = !document.hidden;
      if (running && !reduce) raf = requestAnimationFrame(loop);
    };
    let resizeTimer;
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(size, 180); };

    size();
    if (!reduce) raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "#070b1f" }} />;
}
