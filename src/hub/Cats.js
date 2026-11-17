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
    const move = (e) => { mouse = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("pointermove", move, { passive: true });
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
          if (!c.until || Date.now() > c.until) decide(c, i);
          if (c.mode === "follow") c.setTarget(mouse.x, mouse.y);
          else if (c.mode === "play" && c.buddy) c.setTarget(c.buddy.x + (i % 2 ? 40 : -40), c.buddy.y);
        });
        timer = setTimeout(tick, 500);
      };
      tick();
    }).catch(() => {});
    return () => { dead = true; clearTimeout(timer); window.removeEventListener("pointermove", move); cats.forEach((c) => { if (c.element && c.element.parentNode) c.element.parentNode.removeChild(c.element); }); };
  }, [on]);
  const toggle = () => { const n = !on; setOn(n); try { window.localStorage.setItem("ash-hub-cats", n ? "on" : "off"); } catch (e) { /* ignore */ } };
  return <Toggle type="button" aria-label={on ? "Send the cats away" : "Bring the cats back"} aria-pressed={on} onClick={toggle}>{on ? "🐈" : "·"}</Toggle>;
}
