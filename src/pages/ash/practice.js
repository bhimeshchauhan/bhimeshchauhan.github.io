import React, { useState } from "react";
import Room from "../../hub/Room";
import Firsts from "../../hub/rooms/Firsts";
import { Tabs, Swap, Stagger, Item, CountUp } from "../../hub/motion";
import useLocal from "../../hub/useLocal";
import { Card, Grid, H3, Button, display } from "../../hub/ui";

const things = ["Violin", "Boxing", "Painting", "Skiing", "Hiking", "Something new"];
const weekAgo = () => new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);

function Log() {
  const [log, setLog] = useLocal("ash-hub-practice-log-v1", []);
  const [what, setWhat] = useState(things[0]);
  const [mins, setMins] = useState(30);
  const [note, setNote] = useState("");
  const week = log.filter((e) => e.d >= weekAgo()).reduce((n, e) => n + Number(e.m), 0);
  const add = (e) => { e.preventDefault(); setLog((l) => [{ d: new Date().toISOString().slice(0, 10), what, m: Number(mins) || 0, note: note.trim() }, ...l]); setNote(""); };
  const field = { background: "rgba(255,255,255,.07)", border: "1px solid rgba(232,194,107,.35)", borderRadius: 10, color: "#f6efdc", font: "inherit", minHeight: 44, padding: "0 .8rem" };
  return (
    <Grid cols={2}>
      <Card>
        <H3>Log a session</H3>
        <form onSubmit={add} style={{ display: "grid", gap: "0.7rem" }}>
          <select aria-label="What did you do" value={what} onChange={(e) => setWhat(e.target.value)} style={field}>{things.map((t) => <option key={t} style={{ background: "#0c1240" }}>{t}</option>)}</select>
          <input aria-label="Minutes" type="number" min="1" max="600" value={mins} onChange={(e) => setMins(e.target.value)} style={field} />
          <input aria-label="A note" placeholder="How did it go? (optional)" value={note} onChange={(e) => setNote(e.target.value)} style={field} />
          <Button type="submit">Add to my log</Button>
        </form>
      </Card>
      <Card>
        <H3>This week</H3>
        <div style={{ color: "var(--gold2)", fontFamily: display, fontSize: "3.6rem", lineHeight: 1 }}><CountUp to={week} /><small style={{ color: "var(--muted)", fontSize: "1rem", marginLeft: "0.4rem" }}>minutes</small></div>
        <ul style={{ listStyle: "none", margin: "1rem 0 0", padding: 0, display: "grid", gap: "0.4rem", maxHeight: 260, overflow: "auto" }}>
          {log.length === 0 && <li style={{ color: "var(--muted)" }}>Nothing logged yet. The first one is the hardest.</li>}
          {log.slice(0, 12).map((e, i) => <li key={i} style={{ color: "var(--muted)" }}><b style={{ color: "var(--cream)" }}>{e.what}</b> · {e.m} min · {e.d}{e.note ? ` · ${e.note}` : ""}</li>)}
        </ul>
      </Card>
    </Grid>
  );
}

export default function Practice() {
  const [tab, setTab] = useState("log");
  return (
    <Room roomKey="practice" art="bellows" kicker="Practice" title="The things you're learning" lede="Log a session in ten seconds. Watch the minutes add up, and the trail fill in.">
      <Tabs tabs={[["log", "Log"], ["trail", "Trail of firsts"]]} value={tab} onChange={setTab} id="prac" />
      <Swap k={tab}>{tab === "log" ? <Log /> : <Firsts />}</Swap>
    </Room>
  );
}
