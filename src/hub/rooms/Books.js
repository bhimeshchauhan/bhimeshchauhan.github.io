import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
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

const PAGE = 2200; // characters per page

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
  night: { bg: "#0b1030", fg: "#e9e6f7", mute: "#9aa3c7" },
  sepia: { bg: "#f1e6cf", fg: "#2a2418", mute: "#7d6f52" }
};

const Shell = styled(motion.div)`
  background: ${(p) => p.$t.bg}; color: ${(p) => p.$t.fg}; display: flex; flex-direction: column; inset: 0; position: fixed; z-index: 60;
  .rd-bar { align-items: center; border-bottom: 1px solid ${(p) => p.$t.mute}55; display: flex; gap: 0.6rem; padding: 0.7rem clamp(12px, 3vw, 24px); }
  .rd-bar .rd-ttl { flex: 1; font-family: ${display}; font-size: 1.05rem; font-weight: 600; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .rd-bar button { background: transparent; border: 1px solid ${(p) => p.$t.mute}88; border-radius: 999px; color: ${(p) => p.$t.fg}; cursor: pointer; font: inherit; font-size: 0.9rem; min-height: 38px; min-width: 38px; padding: 0 0.8rem; }
  .rd-scroll { flex: 1; overflow-y: auto; padding: 1.6rem clamp(16px, 5vw, 32px) 2rem; }
  .rd-page { font-family: "Cormorant Garamond", Georgia, serif; font-size: ${(p) => p.$size}px; line-height: 1.7; margin: 0 auto; max-width: 38rem; }
  .rd-page p { color: inherit; font-family: "Cormorant Garamond", Georgia, serif; font-size: 1em; line-height: 1.7; margin: 0 0 1em; text-align: left; }
  .rd-page p.rd-h { font-family: ${display}; font-weight: 600; letter-spacing: 0.04em; margin-top: 1.4em; text-align: center; }
  .rd-nav { align-items: center; border-top: 1px solid ${(p) => p.$t.mute}55; display: flex; gap: 0.8rem; padding: 0.7rem clamp(12px, 3vw, 24px); }
  .rd-nav .rd-pg { color: ${(p) => p.$t.mute}; flex: 1; font-size: 0.85rem; text-align: center; }
  .rd-nav button { background: ${(p) => p.$t.fg}; border: 0; border-radius: 999px; color: ${(p) => p.$t.bg}; cursor: pointer; font: inherit; font-weight: 700; min-height: 44px; padding: 0 1.3rem; }
  .rd-nav button:disabled { opacity: 0.3; }
  .rd-prog { background: ${(p) => p.$t.mute}33; height: 3px; }
  .rd-prog i { background: #e8c26b; display: block; height: 100%; }
`;

function Reader({ book, onClose }) {
  const [pages, setPages] = useState(null);
  const [err, setErr] = useState(false);
  const [saved, setSaved] = useLocal("ash-hub-reader-v1", {});
  const [theme, setTheme] = useLocal("ash-hub-reader-theme", "night");
  const [size, setSize] = useLocal("ash-hub-reader-size", 21);
  const [i, setI] = useState(saved[book.id] || 0);
  useEffect(() => {
    let live = true;
    fetch(`/ash/books/${book.id}.txt`).then((r) => (r.ok ? r.text() : Promise.reject())).then((t) => live && setPages(toPages(t))).catch(() => live && setErr(true));
    return () => { live = false; };
  }, [book.id]);
  const n = pages ? pages.length : 0;
  const go = useCallback((d) => setI((x) => Math.min(Math.max(x + d, 0), Math.max(n - 1, 0))), [n]);
  useEffect(() => { if (pages) setSaved((s) => ({ ...s, [book.id]: i })); const el = document.getElementById("reader-scroll"); if (el) el.scrollTop = 0; }, [i, pages]); // eslint-disable-line
  useEffect(() => {
    const k = (e) => { if (e.key === "ArrowRight") go(1); else if (e.key === "ArrowLeft") go(-1); else if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [go, onClose]);
  const t = themes[theme] || themes.night;
  const page = pages ? pages[i] : null;
  return (
    <Shell $t={t} $size={size} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} transition={{ duration: 0.35 }} role="dialog" aria-label={`Reading ${book.title}`}>
      <div className="rd-bar">
        <span className="rd-ttl">{book.title}</span>
        <button type="button" aria-label="Smaller text" onClick={() => setSize((s) => Math.max(15, s - 2))}>A−</button>
        <button type="button" aria-label="Larger text" onClick={() => setSize((s) => Math.min(34, s + 2))}>A+</button>
        <button type="button" aria-label="Switch page colour" onClick={() => setTheme((x) => (x === "night" ? "sepia" : "night"))}>{theme === "night" ? "☀" : "☾"}</button>
        <button type="button" onClick={onClose}>Close</button>
      </div>
      <div className="rd-prog"><i style={{ width: n ? `${((i + 1) / n) * 100}%` : 0 }} /></div>
      <div className="rd-scroll" id="reader-scroll" >
        {err && <p className="rd-page">The book didn't load. Check your connection and try again.</p>}
        {!pages && !err && <p className="rd-page">Opening…</p>}
        {page && (
          <div className="rd-page">
            {page.map((p, j) => (/^[A-Z0-9 .,'’:;—-]{3,60}$/.test(p) || /^(CHAPTER|Chapter|BOOK|PART|STAVE) /.test(p) && p.length < 70)
              ? <p className="rd-h" key={j}>{p}</p> : <p key={j}>{p}</p>)}
          </div>
        )}
      </div>
      <div className="rd-nav">
        <button type="button" disabled={i === 0} onClick={() => go(-1)}>← Back</button>
        <span className="rd-pg">{n ? `Page ${i + 1} of ${n}` : ""}</span>
        <button type="button" disabled={!n || i >= n - 1} onClick={() => go(1)}>Next →</button>
      </div>
    </Shell>
  );
}

export default function Books() {
  const [open, setOpen] = useState(null);
  const [saved] = useLocal("ash-hub-reader-v1", {});
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
