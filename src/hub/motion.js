import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView, useMotionValue, animate, useReducedMotion } from "framer-motion";
import { display, sans } from "./ui";

// Shared motion kit for the hub: everything animates with Framer Motion, and `MotionConfig reducedMotion="user"` in the layout
// switches it all off for anyone who asks their device for less motion.
const ease = [0.22, 1, 0.36, 1];

// A group whose children rise in one after another.
export const Stagger = ({ children, gap = 0.07, as = "div", ...rest }) => {
  const Tag = motion[as] || motion.div;
  return (
    <Tag initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }} {...rest}>
      {children}
    </Tag>
  );
};
export const item = { hidden: { opacity: 0, y: 26, scale: 0.97 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease } } };
export const Item = ({ children, as = "div", ...rest }) => {
  const Tag = motion[as] || motion.div;
  return <Tag variants={item} {...rest}>{children}</Tag>;
};

// Pills that glide: the active one is a shared-layout highlight that slides between tabs.
const Bar = styled.div`
  display: flex; gap: 0.3rem; margin: 0 0 1.6rem; overflow-x: auto; padding: 0.3rem; position: sticky; top: 94px; z-index: 12;
  @media (max-width: 1560px) { top: 150px; }
  background: rgba(8, 11, 30, 0.82); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(232, 194, 107, 0.18); border-radius: 999px; scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
  button { background: none; border: 0; border-radius: 999px; color: var(--muted); cursor: pointer; flex: none; font: inherit; font-size: 0.92rem; font-weight: 600; min-height: 42px; padding: 0 1.1rem; position: relative; }
  button[aria-selected="true"] { color: #14122a; }
  .pill { background: linear-gradient(135deg, #f6e3a6, #e8c26b); border-radius: 999px; inset: 0; position: absolute; z-index: 0; }
  button span { position: relative; z-index: 1; }
`;
export function Tabs({ tabs, value, onChange, id = "tabs" }) {
  return (
    <Bar role="tablist">
      {tabs.map(([key, label]) => (
        <button key={key} role="tab" type="button" aria-selected={value === key} onClick={() => onChange(key)}>
          {value === key && <motion.span layoutId={`${id}-pill`} className="pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
          <span>{label}</span>
        </button>
      ))}
    </Bar>
  );
}

// Content that cross-fades and slides when its key changes.
export const Swap = ({ k, children }) => (
  <AnimatePresence mode="wait" initial={false}>
    <motion.div key={k} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.28, ease }}>{children}</motion.div>
  </AnimatePresence>
);

// "More" that opens smoothly.
const Acc = styled.div`
  border-top: 1px solid rgba(232, 194, 107, 0.2); margin-top: 0.8rem;
  > button { align-items: center; background: none; border: 0; color: var(--gold2); cursor: pointer; display: flex; font: inherit; font-weight: 600; gap: 0.5rem; justify-content: space-between; min-height: 44px; padding: 0; width: 100%; text-align: left; }
  .chev { transition: transform 0.3s ease; }
  &[data-open="true"] .chev { transform: rotate(180deg); }
  .body { overflow: hidden; }
`;
export function More({ label = "More", children, startOpen = false }) {
  const [open, setOpen] = useState(startOpen);
  return (
    <Acc data-open={open}>
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)}><span>{open ? "Less" : label}</span><span className="chev" aria-hidden="true">⌄</span></button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }}>
            <div style={{ paddingTop: "0.6rem" }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </Acc>
  );
}

// A number that counts up when it scrolls into view.
export function CountUp({ to, ...rest }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const v = useMotionValue(0);
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!inView) return undefined;
    if (reduce) { setN(to); return undefined; }
    const c = animate(v, to, { duration: 1.4, ease, onUpdate: (x) => setN(Math.round(x)) });
    return () => c.stop();
  }, [inView, to, reduce, v]);
  return <span ref={ref} {...rest}>{n}</span>;
}

// A thin gold bar at the very top that fills as the page scrolls.
export function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return <motion.div aria-hidden="true" style={{ background: "linear-gradient(90deg,#f6e3a6,#e8c26b,#f0aec3)", height: 3, left: 0, position: "fixed", right: 0, scaleX: x, top: 0, transformOrigin: "0 50%", zIndex: 40 }} />;
}

// The page's painting: slow parallax, a gentle zoom-in on arrival, the title riding on top, and a credit line.
const Hero = styled.header`
  align-items: flex-end; display: flex; min-height: clamp(300px, 50vh, 500px); position: relative;
  .img { background-size: cover; height: 118%; inset: 0 0 auto 0; position: fixed; width: 100%; z-index: -2; }
  .shade { background: linear-gradient(180deg, rgba(7, 10, 28, 0.28), rgba(7, 10, 28, 0.5) 40%, rgba(7, 10, 28, 0.72)); inset: 0; position: fixed; z-index: -1; }
  .txt { padding: clamp(2.4rem, 6vw, 4rem) 0 clamp(1rem, 4vw, 2.2rem); position: relative; width: 100%; z-index: 2; }
  .credit { bottom: 0.55rem; color: rgba(255, 255, 255, 0.78); font-size: 0.7rem; position: absolute; right: 1rem; text-align: right; text-shadow: 0 1px 8px rgba(5, 7, 24, 0.9); a { color: inherit; } }
`;
export function ArtHero({ art, children }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1600], [0, -70]);
  return (
    <Hero>
      <motion.div className="img" style={{ backgroundImage: `url(${art.src})`, backgroundPosition: art.focus, y }} initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 2.6, ease }} />
      <div className="shade" />
      <div className="txt">{children}</div>
      <p className="credit"><a href={art.page} target="_blank" rel="noopener noreferrer" title={`${art.artist}, ${art.year} · ${art.museum} · public domain`}>{art.title} ↗</a></p>
    </Hero>
  );
}
export { sans, display };
