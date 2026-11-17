import React, { useState } from "react";
import Room from "../../hub/Room";
import { Tabs, Swap, Stagger, Item } from "../../hub/motion";
import { Checklist } from "../../hub/rooms/AfterDark";
import useLocal from "../../hub/useLocal";
import { Card, Grid, H3, Hand, GhostButton } from "../../hub/ui";

// Ideas, not a guide: always check conditions, closures and any passes before you go.
const trails = [["Quarry Rock", "Deep Cove, North Vancouver"], ["Lynn Canyon", "North Vancouver"], ["Grouse Grind", "North Vancouver"], ["Stawamus Chief", "Squamish"], ["Garibaldi Lake", "Garibaldi Provincial Park (check day-pass rules)"]];
const lists = {
  hike: ["Water and snacks", "Rain shell and a warm layer", "Headlamp", "First-aid kit", "Charged phone and an offline map", "Tell someone the plan and your turnaround time", "Trail pass or permit, if needed"],
  ski: ["Lift ticket or pass", "Waterproof layers, gloves and helmet", "Goggles and sunscreen", "Boots and skis rented or packed", "Water and snacks", "Check the snow report and road conditions"]
};
function Checks({ id, items }) {
  const [done, setDone] = useLocal(`ash-hub-check-${id}`, {});
  const left = items.filter((i) => !done[i]).length;
  return (
    <>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.4rem" }}>
        {items.map((i) => (
          <li key={i}><label style={{ alignItems: "center", display: "flex", gap: "0.7rem", minHeight: 40, cursor: "pointer", opacity: done[i] ? 0.5 : 1 }}>
            <input type="checkbox" style={{ accentColor: "#e8c26b", height: 20, width: 20 }} checked={!!done[i]} onChange={() => setDone((d) => ({ ...d, [i]: !d[i] }))} />{i}</label></li>
        ))}
      </ul>
      <p style={{ marginTop: "0.8rem" }}>{left === 0 ? "All packed. Go! 🥾" : `${left} left`} <GhostButton type="button" style={{ marginLeft: "0.6rem" }} onClick={() => setDone({})}>Reset</GhostButton></p>
    </>
  );
}

export default function Outdoors() {
  const [tab, setTab] = useState("trails");
  return (
    <Room roomKey="outdoors" art="cypress" kicker="Outdoors" title="Out there" lede="Trails to try, checklists so you can just go, and a wishlist for the big ones.">
      <Tabs tabs={[["trails", "Trails"], ["lists", "Checklists"], ["wish", "Wishlist"]]} value={tab} onChange={setTab} id="out" />
      <Swap k={tab}>
        {tab === "trails" && (
          <Stagger><Grid cols={2}>{trails.map(([n, w]) => (
            <Item key={n}><Card><H3>{n}</H3><p>{w}</p><p><a href={`https://www.google.com/search?q=${encodeURIComponent(`${n} trail conditions`)}`} target="_blank" rel="noopener noreferrer">Check conditions ↗</a></p></Card></Item>
          ))}</Grid></Stagger>
        )}
        {tab === "lists" && (
          <Stagger><Grid cols={2}>
            <Item><Card><H3>Day hike</H3><Checks id="hike" items={lists.hike} /></Card></Item>
            <Item><Card><H3>Ski day</H3><Checks id="ski" items={lists.ski} /></Card></Item>
          </Grid></Stagger>
        )}
        {tab === "wish" && <Card><H3>The wishlist</H3><p>Hikes, ski hills, weekends away. <Hand>Add the ones you dream about.</Hand></p><Checklist storeKey="ash-hub-wish-v1" seed={[]} placeholder="Add a place or trail…" empty="Nothing yet. Where to first?" /></Card>}
      </Swap>
    </Room>
  );
}
