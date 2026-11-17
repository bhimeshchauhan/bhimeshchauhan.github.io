import React, { useEffect, useState } from "react";
import styled from "styled-components";

// Three little pixel cats (lots-o-nekos, MIT) that nap at the bottom of the screen, wander, chase each other and follow your cursor.
// The cat sprites are fetched from the package's public sprite database on GitHub, so nothing is bundled.
const Toggle = styled.button`
  background: rgba(10, 14, 40, 0.75); border: 1px solid rgba(232, 194, 107, 0.5); border-radius: 999px; bottom: 10px; color: var(--gold2); cursor: pointer; font: inherit; font-size: 0.95rem; height: 34px; left: 58px; position: fixed; width: 38px; z-index: 25;
`;
const SPRITES = ["calico", "black", "gray"];

export default function Cats() {
  const [on, setOn] = useState(true);
  useEffect(() => { try { setOn(window.localStorage.getItem("ash-hub-cats") !== "off"); } catch (e) { /* ignore */ } }, []);
  useEffect(() => {
    if (!on) return undefined;
    let dead = false; let timer; const cats = []; let mouse = { x: 300, y: 300 };
    let lastMove = { x: 0, y: 0, t: performance.now() }; let fastUntil = 0; let still = { x: 0, y: 0, t: Date.now() };
    const move = (e) => {
      const n = performance.now(); const sp = Math.hypot(e.clientX - lastMove.x, e.clientY - lastMove.y) / Math.max(1, n - lastMove.t);
      if (sp > 1.6) fastUntil = Date.now() + 4500; // a quick wiggle makes them give chase
      lastMove = { x: e.clientX, y: e.clientY, t: n }; mouse = { x: e.clientX, y: e.clientY };
      if (Math.hypot(e.clientX - still.x, e.clientY - still.y) > 14) still = { x: e.clientX, y: e.clientY, t: Date.now() };
    };
    const heart = (x, y) => {
      const h = document.createElement("div"); h.textContent = "♥"; h.setAttribute("aria-hidden", "true");
      h.style.cssText = `position:fixed;left:${x}px;top:${y}px;color:#ff6f98;font-size:${14 + Math.random() * 8}px;pointer-events:none;z-index:31;text-shadow:0 0 8px rgba(255,110,150,.7)`;
      document.body.appendChild(h);
      const a = h.animate([{ opacity: 0, transform: "translate(0,0) scale(.5)" }, { opacity: 1, offset: 0.2 }, { opacity: 0, transform: `translate(${(Math.random() - 0.5) * 40}px,-60px) scale(1.2)` }], { duration: 1400, easing: "ease-out" });
      a.onfinish = () => h.remove();
    };
    const near = (c, x, y, r) => Math.hypot(c.x - x, c.y - y) < r;
    const onClick = (e) => {
      if (e.target.closest && e.target.closest("a, button, input, textarea, select, label, [role=button], [role=dialog]")) return;
      const hit = cats.find((c) => near(c, e.clientX, e.clientY, 34));
      if (hit) { // a poke: it bolts
        hit.mode = "flee"; hit.until = Date.now() + 2800; hit.setTarget(Math.random() * window.innerWidth, Math.min(window.innerHeight - 50, hit.y + (Math.random() - 0.5) * 300)); hit.speed = 16;
        setTimeout(() => { hit.speed = 7; }, 2800);
      } else { cats.forEach((c, i) => { c.mode = "call"; c.until = Date.now() + 4500 + i * 600; c.setTarget(e.clientX + (i - 1) * 46, e.clientY); }); }
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("click", onClick);
    // petting: keep the cursor still over a cat for a moment and it sits there purring
    const petTimer = setInterval(() => {
      if (!cats.length) return; const held = Date.now() - still.t;
      cats.forEach((c) => {
        if (held > 700 && near(c, mouse.x, mouse.y, 40)) {
          if (c.mode !== "pet") { c.mode = "pet"; c.setTarget(c.x, c.y); }
          c.until = Date.now() + 1200; if (Math.random() < 0.5) heart(c.x - 8, c.y - 24);
        } else if (c.mode === "pet" && Date.now() > c.until - 200) c.until = 0;
      });
    }, 220);
    import("lots-o-nekos").then(({ Oneko }) => {
      if (dead) return;
      const W = window.innerWidth, H = window.innerHeight;
      SPRITES.forEach((name, i) => {
        const c = new Oneko({ x: 60 + i * 120, y: H - 60, size: 48, speed: 7 + i, source: `https://raw.githubusercontent.com/raynecloudy/oneko_db/refs/heads/master/${name}.png`, allowedTargetDistance: 36 });
        if (!c.isInitialized()) return;
        c.element.style.zIndex = 30; c.mode = "nap"; cats.push(c);
      });
      const decide = (c, i) => {
        const r = Math.random(); const w = window.innerWidth, h = window.innerHeight;
        if (r < 0.35) { c.mode = "nap"; c.setTarget(40 + Math.random() * (w - 80), h - 48); }
        else if (r < 0.6 && cats.length > 1) { c.mode = "play"; c.buddy = cats[(i + 1 + Math.floor(Math.random() * (cats.length - 1))) % cats.length]; }
        else if (r < 0.8) { c.mode = "follow"; }
        else { c.mode = "wander"; c.setTarget(40 + Math.random() * (w - 80), 160 + Math.random() * (h - 300)); }
        c.until = Date.now() + 5000 + Math.random() * 9000;
      };
      const tick = () => {
        if (dead) return;
        cats.forEach((c, i) => {
          if (Date.now() < fastUntil && c.mode !== "pet" && c.mode !== "flee") { c.mode = "follow"; c.until = Math.max(c.until || 0, fastUntil); }
          if (!c.until || Date.now() > c.until) decide(c, i);
          if (c.mode === "pet" || c.mode === "flee" || c.mode === "call") { /* target already set */ } else if (c.mode === "follow") c.setTarget(mouse.x, mouse.y);
          else if (c.mode === "play" && c.buddy) c.setTarget(c.buddy.x + (i % 2 ? 40 : -40), c.buddy.y);
        });
        timer = setTimeout(tick, 500);
      };
      tick();
    }).catch(() => {});
    return () => { dead = true; clearTimeout(timer); clearInterval(petTimer); window.removeEventListener("pointermove", move); window.removeEventListener("click", onClick); cats.forEach((c) => { if (c.element && c.element.parentNode) c.element.parentNode.removeChild(c.element); }); };
  }, [on]);
  const toggle = () => { const n = !on; setOn(n); try { window.localStorage.setItem("ash-hub-cats", n ? "on" : "off"); } catch (e) { /* ignore */ } };
  return <Toggle type="button" aria-label={on ? "Send the cats away" : "Bring the cats back"} aria-pressed={on} onClick={toggle}>{on ? "🐈" : "·"}</Toggle>;
}
