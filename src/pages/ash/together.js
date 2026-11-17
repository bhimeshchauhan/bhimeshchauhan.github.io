import React, { Suspense, useRef, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import Room from "../../hub/Room";
import useLocal from "../../hub/useLocal";
const TogetherMap = React.lazy(() => import("../../hub/TogetherMap"));
import { Eyebrow, H3, Button, GhostButton, hand, display } from "../../hub/ui";

// Our shared bucket list as a scrapbook: tilted Polaroids on a corkboard, a hand-drawn map, ink stamps when something is done.
// For now it saves on this device only; swapping useLocal for a shared database is the one change needed to share it.
const cats = [["all", "Everything"], ["trip", "Trips"], ["outdoors", "Outdoors"], ["food", "Food"], ["learn", "Learn"]];
const seed = [
  { id: "s1", t: "Banff in the fall", note: "Golden larches, a lake that doesn't look real.", cat: "trip", img: "/ash/art/wanderer.jpg", where: "Banff", lat: 51.1784, lng: -115.5708, done: false },
  { id: "s2", t: "Tofino storm-watching", note: "Big waves, a warm drink, a window seat.", cat: "trip", img: "/ash/art/lilies.jpg", where: "Tofino", lat: 49.153, lng: -125.9066, done: false },
  { id: "s3", t: "A first ski day together", note: "Lesson first. Falling over is part of it.", cat: "outdoors", img: "/ash/art/cypress.jpg", where: "Whistler", lat: 50.1163, lng: -122.9574, done: false },
  { id: "s4", t: "Calgary", note: "The trip we already took.", cat: "trip", img: "/ash/art/starry.jpg", where: "Calgary", lat: 51.0447, lng: -114.0719, done: true, doneOn: "2026-10-01" }
];
// Typing one of these in "Where?" pins the idea on the map automatically; otherwise drop a pin by tapping the map.
const places = { vancouver: [49.2827, -123.1207], victoria: [48.4284, -123.3656], tofino: [49.153, -125.9066], whistler: [50.1163, -122.9574], banff: [51.1784, -115.5708], calgary: [51.0447, -114.0719], jasper: [52.8737, -118.0814], toronto: [43.6532, -79.3832], montreal: [45.5019, -73.5674], paris: [48.8566, 2.3522], tokyo: [35.6762, 139.6503], kyoto: [35.0116, 135.7681], london: [51.5072, -0.1276], reykjavik: [64.1466, -21.9426] };

const Page = styled.div`
  .tg-bar { align-items: center; display: flex; flex-wrap: wrap; gap: 0.6rem; justify-content: space-between; margin-bottom: 1.2rem; }
  .chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .chips button { background: rgba(10, 14, 40, 0.6); border: 1px solid rgba(232, 194, 107, 0.45); border-radius: 999px; color: var(--gold2); cursor: pointer; font: inherit; font-size: 0.85rem; font-weight: 600; min-height: 36px; padding: 0 0.9rem; }
  .chips button[aria-pressed="true"] { background: var(--gold); color: #14122a; }
  .top { align-items: stretch; display: grid; gap: 1.2rem; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); margin-bottom: 1.6rem; }
  @media (max-width: 800px) { .top { grid-template-columns: 1fr; } }
  .map { background: radial-gradient(ellipse at 30% 20%, #f3e6c4, #e4cf9b 70%, #cfb578); border-radius: 6px; box-shadow: 0 14px 40px rgba(0, 0, 0, 0.45), inset 0 0 60px rgba(120, 80, 20, 0.35); color: #3a2a12; padding: 0.8rem; position: relative; transform: rotate(-0.6deg); }
  .map svg { display: block; height: auto; width: 100%; }
  .map .cap { font-family: ${hand}; font-size: 1.25rem; margin: 0.2rem 0 0; text-align: center; }
  .board { background: #4a3322 radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.06) 0 2px, transparent 3px) 0 0 / 22px 22px; border-radius: 14px; box-shadow: inset 0 0 70px rgba(0, 0, 0, 0.55), 0 14px 40px rgba(0, 0, 0, 0.4); padding: clamp(1rem, 3vw, 2rem); }
  .grid { display: grid; gap: clamp(1.4rem, 3vw, 2.2rem) 1.4rem; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); }
  .card { perspective: 900px; }
  .pol { background: #fbf7ee; box-shadow: 0 12px 26px rgba(0, 0, 0, 0.5); color: #2a2218; cursor: pointer; padding: 0.7rem 0.7rem 0.4rem; position: relative; }
  .tape { background: rgba(240, 220, 150, 0.75); box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); height: 22px; left: 50%; margin-left: -34px; position: absolute; top: -11px; transform: rotate(-3deg); width: 68px; }
  .ph { aspect-ratio: 1; background: #d8cfba center / cover; filter: sepia(0.25) contrast(1.05); }
  .cap { font-family: ${hand}; font-size: 1.45rem; line-height: 1.1; min-height: 2.6rem; padding: 0.5rem 0.2rem 0.2rem; text-align: center; }
  .meta { color: #8a7a5c; font-size: 0.72rem; letter-spacing: 0.12em; padding-bottom: 0.3rem; text-align: center; text-transform: uppercase; }
  .stamp { border: 3px double #b0262e; border-radius: 6px; color: #b0262e; font-family: ${display}; font-size: 0.85rem; font-weight: 700; letter-spacing: 0.12em; opacity: 0.85; padding: 0.15rem 0.5rem; position: absolute; right: -6px; text-align: center; top: 38%; transform: rotate(-14deg); }
  .back { background: #f4ecd8; display: flex; flex-direction: column; justify-content: space-between; min-height: 300px; padding: 1rem; }
  .back p { font-family: ${hand}; font-size: 1.35rem; line-height: 1.2; margin: 0; }
  .acts { display: flex; gap: 0.4rem; }
  .acts button { background: #2a2218; border: 0; border-radius: 999px; color: #f4ecd8; cursor: pointer; font: inherit; font-size: 0.78rem; font-weight: 600; min-height: 34px; padding: 0 0.8rem; }
  .acts button.x { background: transparent; color: #8a7a5c; }
  form.add { display: grid; gap: 0.6rem; max-width: 520px; }
  form.add input, form.add select, form.add textarea { background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(232, 194, 107, 0.4); border-radius: 12px; color: var(--cream); font: inherit; min-height: 44px; padding: 0.5rem 0.9rem; }
  form.add textarea { min-height: 70px; }
  .next h3 { margin-top: 0; }
  .next .row { align-items: center; display: flex; gap: 0.9rem; }
  .next .mini { background: #d8cfba center / cover; border: 6px solid #fbf7ee; border-bottom-width: 18px; box-shadow: 0 8px 18px rgba(0, 0, 0, 0.5); flex: none; height: 110px; transform: rotate(3deg); width: 110px; }
`;

function shrink(file) {
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = () => { const im = new Image(); im.onload = () => { const s = Math.min(1, 700 / Math.max(im.width, im.height)); const c = document.createElement("canvas"); c.width = im.width * s; c.height = im.height * s; c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); resolve(c.toDataURL("image/jpeg", 0.78)); }; im.onerror = () => resolve(null); im.src = fr.result; };
    fr.onerror = () => resolve(null); fr.readAsDataURL(file);
  });
}

function Polaroid({ it, i, onDone, onDel }) {
  const [flip, setFlip] = useState(false);
  const tilt = ((i * 37) % 9) - 4;
  return (
    <motion.div className="card" layout initial={{ opacity: 0, y: 30, rotate: tilt * 2 }} animate={{ opacity: 1, y: 0, rotate: tilt }} exit={{ opacity: 0, scale: 0.8 }} whileHover={{ rotate: 0, y: -8, scale: 1.04, zIndex: 5 }} transition={{ type: "spring", stiffness: 220, damping: 20 }}>
      <AnimatePresence mode="wait" initial={false}>
        {!flip ? (
          <motion.div key="f" className="pol" onClick={() => setFlip(true)} initial={{ rotateY: -90 }} animate={{ rotateY: 0 }} exit={{ rotateY: 90 }} transition={{ duration: 0.2 }}>
            <span className="tape" />
            <div className="ph" style={{ backgroundImage: it.img ? `url(${it.img})` : "linear-gradient(135deg,#cdbf9c,#e9dfc4)" }} />
            <div className="cap">{it.t}</div>
            <div className="meta">{it.where || it.cat}</div>
            {it.done && <div className="stamp">DONE<br />{it.doneOn || ""}</div>}
          </motion.div>
        ) : (
          <motion.div key="b" className="pol back" initial={{ rotateY: -90 }} animate={{ rotateY: 0 }} exit={{ rotateY: 90 }} transition={{ duration: 0.2 }}>
            <span className="tape" />
            <p>{it.note || "No note yet."}</p>
            <div className="acts">
              <button type="button" onClick={() => onDone(it.id)}>{it.done ? "Not yet" : "We did it ✓"}</button>
              <button type="button" onClick={() => setFlip(false)}>Back</button>
              <button type="button" className="x" onClick={() => onDel(it.id)}>Remove</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Together() {
  const [items, setItems] = useLocal("ash-hub-together-v1", seed);
  const [cat, setCat] = useState("all");
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(null);
  const picking = open;
  const [f, setF] = useState({ t: "", note: "", cat: "trip", where: "", img: null, lat: null, lng: null });
  const file = useRef(null);
  const shown = items.filter((x) => cat === "all" || x.cat === cat);
  const next = items.find((x) => !x.done);
  const submit = (e) => { e.preventDefault(); if (!f.t.trim()) return; const known = places[f.where.trim().toLowerCase()]; const pin = f.lat != null ? { lat: f.lat, lng: f.lng } : known ? { lat: known[0], lng: known[1] } : {}; setItems((cur) => [{ ...f, ...pin, t: f.t.trim(), id: `i${Date.now()}`, done: false }, ...cur]); setF({ t: "", note: "", cat: "trip", where: "", img: null, lat: null, lng: null }); setOpen(false); };
  const toggleDone = (id) => setItems((cur) => cur.map((x) => (x.id === id ? { ...x, done: !x.done, doneOn: !x.done ? new Date().toISOString().slice(0, 10) : undefined } : x)));
  const del = (id) => setItems((cur) => cur.filter((x) => x.id !== id));
  return (
    <Room roomKey="together" art="wanderer" kicker="Together" title="Our adventures" lede="Places we'll go and things we'll try, pinned up like a scrapbook.">
      <Page>
        <div className="top">
          <div style={{ minHeight: 340 }}>
            <Suspense fallback={null}><TogetherMap items={items} picking={picking} picked={f.lat != null ? { lat: f.lat, lng: f.lng } : null} onPick={(p) => setF((c) => ({ ...c, ...p }))} onView={setView} /></Suspense>
          </div>
          <div className="map next" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", transform: "rotate(0.6deg)" }}>
            <div>
              <Eyebrow style={{ color: "#8a5a1e", textShadow: "none" }}>Next up</Eyebrow>
              {next ? (
                <div className="row">
                  <div className="mini" style={{ backgroundImage: next.img ? `url(${next.img})` : "none" }} />
                  <div><H3 style={{ color: "#2a1a08", fontFamily: hand, fontSize: "2.1rem", lineHeight: 1 }}>{next.t}</H3><p style={{ color: "#6b4e1e", fontFamily: display, fontSize: "0.8rem", letterSpacing: "0.14em", margin: "0.3rem 0 0", textTransform: "uppercase" }}>{next.where || next.cat}</p></div>
                </div>
              ) : <p style={{ color: "#4a3820" }}>Everything's done. Time to dream up more.</p>}
              {next && next.note && <p style={{ color: "#3a2a12", fontFamily: hand, fontSize: "1.6rem", lineHeight: 1.15, margin: "1.1rem 0 0", paddingLeft: "0.9rem", borderLeft: "3px solid #b0262e" }}>“{next.note}”</p>}
            </div>
            <div style={{ borderTop: "1px dashed #8a6a30", color: "#3a2a12", display: "flex", fontFamily: hand, fontSize: "1.45rem", gap: "1.4rem", justifyContent: "space-around", marginTop: "1rem", paddingTop: "0.7rem" }}>
              <span><b style={{ color: "#b0262e", fontSize: "1.9rem" }}>{items.filter((x) => x.done).length}</b> done</span>
              <span><b style={{ color: "#b0262e", fontSize: "1.9rem" }}>{items.filter((x) => !x.done).length}</b> dreaming</span>
              <span><b style={{ color: "#b0262e", fontSize: "1.9rem" }}>{new Set(items.filter((x) => x.where).map((x) => x.where)).size}</b> places</span>
            </div>
          </div>
        </div>
        <div className="tg-bar">
          <div className="chips" role="group" aria-label="Filter">{cats.map(([k, l]) => <button key={k} type="button" aria-pressed={cat === k} onClick={() => setCat(k)}>{l}</button>)}</div>
          <Button type="button" onClick={() => setOpen((o) => !o)}>{open ? "Close" : "+ Add an idea"}</Button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.form className="add" onSubmit={submit} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden", marginBottom: "1.2rem" }}>
              <input aria-label="Title" placeholder="What's the idea?" value={f.t} onChange={(e) => setF({ ...f, t: e.target.value })} />
              <input aria-label="Where" placeholder="Where? (Vancouver, Whistler, Banff…)" value={f.where} onChange={(e) => setF({ ...f, where: e.target.value })} />
              <textarea aria-label="Why" placeholder="Why is it on our radar?" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} />
              <select aria-label="Category" value={f.cat} onChange={(e) => setF({ ...f, cat: e.target.value })}>{cats.slice(1).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
              <input ref={file} type="file" accept="image/*" aria-label="Photo" onChange={async (e) => { const im = e.target.files[0] ? await shrink(e.target.files[0]) : null; setF((c) => ({ ...c, img: im })); }} />
              <p style={{ color: "var(--muted)", fontSize: "0.85rem", margin: 0 }}>{f.lat != null ? "Pin dropped on the map ✓" : "Type a known city above, or tap the map to drop a pin."}</p>
              <GhostButton type="submit">Pin it up</GhostButton>
            </motion.form>
          )}
        </AnimatePresence>
        <div className="board">
          <div className="grid"><AnimatePresence>{shown.map((it, i) => <Polaroid key={it.id} it={it} i={i} onDone={toggleDone} onDel={del} />)}</AnimatePresence></div>
          {!shown.length && <p style={{ color: "#f4ecd8", margin: 0 }}>Nothing pinned here yet.</p>}
        </div>
        <p style={{ color: "var(--muted)", fontSize: "0.82rem", marginTop: "1rem" }}>{view ? `Map view: zoom ${view.zoom}, centred near ${view.center.lat.toFixed(1)}, ${view.center.lng.toFixed(1)}. ` : ""}Saved on this device for now. Sharing it between the two of you needs a small database.</p>
      </Page>
    </Room>
  );
}
