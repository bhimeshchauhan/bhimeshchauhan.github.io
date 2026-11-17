import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import useLocal from "../useLocal";
import { Card, Grid, H3, Eyebrow, H2, Lede, Button, Reveal, display } from "../ui";

// Public-domain books (Project Gutenberg), chosen for her: psychology, gothic horror, and wild places.
// The texts are served from static/ash/books/ and read in the page: paged, resizable, and it remembers where she stopped.
export const books = [
  { id: "1952", title: "The Yellow Wallpaper", author: "Charlotte Perkins Gilman", year: 1892, mins: 45, why: "A woman, a rest cure and a room. A short psychological horror that is really about how a mind gets treated." },
  { id: "43", title: "Strange Case of Dr Jekyll and Mr Hyde", author: "Robert Louis Stevenson", year: 1886, mins: 150, why: "The divided self, a century before psychology had words for it." },
  { id: "10007", title: "Carmilla", author: "Sheridan Le Fanu", year: 1872, mins: 170, why: "Gothic horror that came 25 years before Dracula, with a slow, strange friendship at its centre." },
  { id: "84", title: "Frankenstein", author: "Mary Shelley", year: 1818, mins: 420, why: "A monster, a creator and the question of who was really abandoned. Written by a nineteen-year-old." },
  { id: "345", title: "Dracula", author: "Bram Stoker", year: 1897, mins: 840, why: "Letters, diaries and dread. Best read by candlelight (the Watch & Read page has one)." },
  { id: "205", title: "Walden", author: "Henry David Thoreau", year: 1854, mins: 630, why: "Two years in a cabin by a pond. For the long-walk and quiet-morning side of her." }
];

const PAGE = 800; // characters per page

function toPages(raw) {
  let t = raw.replace(/\r/g, "");
  const s = t.search(/\*\*\* ?START OF[^\n]*\n/);
  if (s >= 0) t = t.slice(t.indexOf("\n", s) + 1);
  const e = t.search(/\*\*\* ?END OF/);
  if (e >= 0) t = t.slice(0, e);
  const paras = t.split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, " ").trim()).filter(Boolean);
  const pages = [];
  let cur = [];
  let len = 0;
  paras.forEach((p) => {
    if (len > 0 && len + p.length > PAGE) { pages.push(cur); cur = []; len = 0; }
    cur.push(p); len += p.length;
  });
  if (cur.length) pages.push(cur);
  return pages;
}

const themes = {
  paper: { desk: "#1d1410", page: "#f6efdc", fg: "#2b2216", mute: "#8a7a5c", edge: "#d9ccaa" },
  night: { desk: "#06091c", page: "#141a3a", fg: "#e6e2f3", mute: "#8e97c2", edge: "#232c5c" }
};

const Shell = styled(motion.div)`
  background: radial-gradient(ellipse at 50% 40%, ${(p) => p.$t.desk}, #000 140%); display: flex; flex-direction: column; inset: 0; position: fixed; z-index: 80;
  .rd-bar { align-items: center; display: flex; gap: 0.6rem; padding: 0.7rem clamp(12px, 3vw, 24px); }
  .rd-ttl { color: #f0e6cc; flex: 1; font-family: ${display}; font-size: 1.05rem; font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .rd-bar button { background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(240, 230, 204, 0.35); border-radius: 999px; color: #f0e6cc; cursor: pointer; font: inherit; font-size: 0.9rem; min-height: 38px; min-width: 38px; padding: 0 0.8rem; }
  .rd-desk { align-items: center; display: flex; flex: 1; justify-content: center; min-height: 0; padding: 0 clamp(8px, 3vw, 32px); perspective: 2200px; }
  .rd-book { background: ${(p) => p.$t.edge}; border-radius: 6px; box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(0, 0, 0, 0.35); display: flex; height: min(100%, 780px); max-width: ${(p) => (p.$spread ? "1180px" : "620px")}; padding: 6px 6px 8px; position: relative; width: 100%; }
  .rd-book::after { background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.28) 46%, rgba(0, 0, 0, 0.42) 50%, rgba(0, 0, 0, 0.28) 54%, transparent); bottom: 6px; content: ""; display: ${(p) => (p.$spread ? "block" : "none")}; left: 50%; margin-left: -30px; pointer-events: none; position: absolute; top: 6px; width: 60px; }
  .rd-leaf { background: ${(p) => p.$t.page}; color: ${(p) => p.$t.fg}; display: flex; flex: 1; flex-direction: column; min-width: 0; overflow: hidden; padding: clamp(1.2rem, 3.4vw, 2.6rem) clamp(1.2rem, 3.6vw, 3rem) 0.8rem; position: relative; }
  .rd-leaf.l { border-radius: 4px 0 0 4px; box-shadow: inset -26px 0 30px -18px rgba(0, 0, 0, 0.22); }
  .rd-leaf.r { border-radius: 0 4px 4px 0; box-shadow: inset 26px 0 30px -18px rgba(0, 0, 0, 0.22); }
  .rd-leaf.one { border-radius: 4px; }
  .rd-text { flex: 1; font-family: "Cormorant Garamond", Georgia, serif; font-size: ${(p) => p.$size}px; hyphens: auto; line-height: 1.62; overflow-y: auto; scrollbar-width: none; text-align: justify; }
  .rd-text::-webkit-scrollbar { display: none; }
  .rd-text p { color: inherit; font-family: inherit; font-size: 1em; line-height: inherit; margin: 0; text-indent: 1.5em; }
  .rd-text p.rd-first { text-indent: 0; }
  .rd-text p.rd-first::first-letter { float: left; font-family: ${display}; font-size: 3.1em; line-height: 0.85; padding: 0.06em 0.1em 0 0; }
  .rd-text p.rd-h { font-family: ${display}; font-weight: 600; letter-spacing: 0.06em; margin: 0.8em 0; text-align: center; text-indent: 0; }
  .rd-folio { color: ${(p) => p.$t.mute}; font-size: 0.78rem; padding-top: 0.5rem; text-align: center; }
  .rd-nav { align-items: center; display: flex; gap: 0.8rem; padding: 0.7rem clamp(12px, 3vw, 24px); }
  .rd-pg { color: #cbbf9f; flex: 1; font-size: 0.85rem; text-align: center; }
  .rd-nav button { background: #f0e6cc; border: 0; border-radius: 999px; color: #2b2216; cursor: pointer; font: inherit; font-weight: 700; min-height: 44px; padding: 0 1.3rem; }
  .rd-nav button:disabled { opacity: 0.3; }
  .rd-prog { background: rgba(255, 255, 255, 0.12); height: 3px; margin: 0 clamp(12px, 3vw, 24px); }
  .rd-prog i { background: #e8c26b; display: block; height: 100%; }
`;

function Leaf({ page, n, cls, first }) {
  if (!page) return <div className={`rd-leaf ${cls}`} />;
  const isH = (p) => /^[A-Z0-9 .,'’:;—-]{3,60}$/.test(p) || (/^(CHAPTER|Chapter|BOOK|PART|STAVE) /.test(p) && p.length < 70);
  return (
    <div className={`rd-leaf ${cls}`}>
      <div className="rd-text">
        {page.map((p, j) => (isH(p) ? <p className="rd-h" key={j}>{p}</p> : <p key={j} className={j === 0 && first ? "rd-first" : ""}>{p}</p>))}
      </div>
      <div className="rd-folio">{n}</div>
    </div>
  );
}

function Reader({ book, onClose }) {
  const [pages, setPages] = useState(null);
  const [err, setErr] = useState(false);
  const [saved, setSaved] = useLocal("ash-hub-reader-v2", {});
  const [theme, setTheme] = useLocal("ash-hub-reader-theme2", "paper");
  const [size, setSize] = useLocal("ash-hub-reader-size2", 19);
  const [i, setI] = useState(saved[book.id] || 0);
  const [dir, setDir] = useState(1);
  const [wide, setWide] = useState(typeof window !== "undefined" && window.innerWidth >= 1000);
  useEffect(() => { const f = () => setWide(window.innerWidth >= 1000); window.addEventListener("resize", f); return () => window.removeEventListener("resize", f); }, []);
  useEffect(() => {
    let live = true;
    fetch(`/ash/books/${book.id}.txt`).then((r) => (r.ok ? r.text() : Promise.reject())).then((t) => live && setPages(toPages(t))).catch(() => live && setErr(true));
    return () => { live = false; };
  }, [book.id]);
  const n = pages ? pages.length : 0; const step = wide ? 2 : 1;
  const left = wide ? i - (i % 2) : i;
  const go = useCallback((d) => { setDir(d); setI((x) => { const base = wide ? x - (x % 2) : x; return Math.min(Math.max(base + d * step, 0), Math.max(n - 1, 0)); }); }, [n, step, wide]);
  useEffect(() => { if (pages) setSaved((s) => ({ ...s, [book.id]: i })); }, [i, pages]); // eslint-disable-line
  useEffect(() => {
    const k = (e) => { if (e.key === "ArrowRight") go(1); else if (e.key === "ArrowLeft") go(-1); else if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k); document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [go, onClose]);
  const t = themes[theme] || themes.paper;
  const ok = pages && pages.length;
  return createPortal(
    <Shell $t={t} $size={size} $spread={wide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} role="dialog" aria-label={`Reading ${book.title}`}>
      <div className="rd-bar">
        <span className="rd-ttl">{book.title}</span>
        <button type="button" aria-label="Smaller text" onClick={() => setSize((s) => Math.max(14, s - 1))}>A−</button>
        <button type="button" aria-label="Larger text" onClick={() => setSize((s) => Math.min(30, s + 1))}>A+</button>
        <button type="button" aria-label="Switch page colour" onClick={() => setTheme((x) => (x === "paper" ? "night" : "paper"))}>{theme === "paper" ? "☾" : "☀"}</button>
        <button type="button" onClick={onClose}>Close</button>
      </div>
      <div className="rd-prog"><i style={{ width: n ? `${((left + 1) / n) * 100}%` : 0 }} /></div>
      <div className="rd-desk">
        {err && <p style={{ color: "#f0e6cc" }}>The book didn't load. Check your connection and try again.</p>}
        {!ok && !err && <p style={{ color: "#f0e6cc" }}>Opening…</p>}
        {ok && (
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <motion.div key={left} className="rd-book" custom={dir} variants={{ in: (d) => ({ opacity: 0, rotateY: d * 14, x: d * 40 }), on: { opacity: 1, rotateY: 0, x: 0 }, out: (d) => ({ opacity: 0, rotateY: d * -14, x: d * -40 }) }} initial="in" animate="on" exit="out" transition={{ duration: 0.28, ease: "easeOut" }} style={{ transformOrigin: "50% 50%" }}>
              <Leaf page={pages[left]} n={left + 1} cls={wide ? "l" : "one"} first={left === 0} />
              {wide && <Leaf page={pages[left + 1]} n={left + 2 <= n ? left + 2 : ""} cls="r" />}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      <div className="rd-nav">
        <button type="button" disabled={left === 0} onClick={() => go(-1)}>← Back</button>
        <span className="rd-pg">{n ? `${left + 1}${wide && left + 2 <= n ? `–${left + 2}` : ""} of ${n}` : ""}</span>
        <button type="button" disabled={!n || left + step >= n} onClick={() => go(1)}>Next →</button>
      </div>
    </Shell>,
    document.body
  );
}

export default function Books() {
  const [open, setOpen] = useState(null);
  const [saved] = useLocal("ash-hub-reader-v2", {});
  const close = useCallback(() => setOpen(null), []);
  return (
    <>
      <Reveal>
        <Eyebrow>The library</Eyebrow>
        <H2>Read something old and strange.</H2>
        <Lede>Six public-domain books, picked for the psychology, the gothic and the wild. Open one and read it right here; it remembers where she stopped.</Lede>
      </Reveal>
      <Grid cols={3}>
        {books.map((b, k) => (
          <Reveal key={b.id} delay={k * 0.05}>
            <Card style={{ height: "100%" }}>
              <Eyebrow>{b.author} · {b.year}</Eyebrow>
              <H3>{b.title}</H3>
              <p>{b.why}</p>
              <p style={{ fontSize: "0.85rem" }}>About {b.mins >= 120 ? `${Math.round(b.mins / 60)} hours` : `${b.mins} minutes`}{saved[b.id] ? ` · back to page ${saved[b.id] + 1}` : ""}</p>
              <Button type="button" onClick={() => setOpen(b)}>{saved[b.id] ? "Continue reading" : "Read"}</Button>
            </Card>
          </Reveal>
        ))}
      </Grid>
      <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginTop: "1rem" }}>Texts from Project Gutenberg, in the public domain.</p>
      <AnimatePresence>{open && <Reader key={open.id} book={open} onClose={close} />}</AnimatePresence>
    </>
  );
}
