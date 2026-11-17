import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Room from "../../hub/Room";
import Books from "../../hub/rooms/Books";
import { Rule } from "../../hub/ui";
import AfterDark, { films } from "../../hub/rooms/AfterDark";
import useLocal from "../../hub/useLocal";
import { Card, Button, H3, Hand } from "../../hub/ui";

function Tonight() {
  const [items] = useLocal("ash-hub-films-v1", films.map(([t, y]) => ({ t, y, done: false })));
  const [pick, setPick] = useState(null);
  const roll = () => { const pool = items.filter((i) => !i.done); setPick(pool.length ? pool[Math.floor(Math.random() * pool.length)] : { t: "Everything's watched. Add something terrifying." }); };
  return (
    <Card style={{ marginBottom: "1.4rem", textAlign: "center" }}>
      <H3>Tonight's pick</H3>
      <p>Can't decide? Let the dark choose. <Hand>No take-backs.</Hand></p>
      <div style={{ minHeight: 64 }}>
        <AnimatePresence mode="wait">
          {pick && <motion.div key={pick.t} initial={{ opacity: 0, scale: 0.7, rotate: -4 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ type: "spring", stiffness: 260, damping: 16 }} style={{ color: "var(--gold2)", fontFamily: "Cormorant Garamond, serif", fontSize: "2rem", margin: "0.4rem 0 1rem" }}>{pick.t}{pick.y ? ` (${pick.y})` : ""}</motion.div>}
        </AnimatePresence>
      </div>
      <Button type="button" onClick={roll}>{pick ? "Pick again 🎲" : "Pick for me 🎲"}</Button>
    </Card>
  );
}

export default function WatchRead() {
  return (
    <Room roomKey="watch" art="nightmare" kicker="Watch & Read" title="Scary movies, good books" lede="Your lists, and a pick for tonight. Lights out is one button away.">
      <Tonight />
      <Books />
      <Rule />
      <AfterDark />
    </Room>
  );
}
