import React, { useState } from "react";
import Room from "../../hub/Room";
import Letters from "../../hub/rooms/Letters";
import Memories from "../../hub/rooms/Memories";
import Countdown from "../../hub/Countdown";
import { Tabs, Swap } from "../../hub/motion";
import { dates } from "../../hub/data/dates";
import { Card, H3, Hand } from "../../hub/ui";

export default function Notes() {
  const [tab, setTab] = useState("letters");
  return (
    <Room roomKey="notes" art="kiss" kicker="Notes" title="Letters, and us" lede="Short notes to open when you want one, our timeline, and the days we're counting.">
      <Tabs tabs={[["letters", "Letters"], ["timeline", "Timeline"], ["days", "Countdowns"]]} value={tab} onChange={setTab} id="notes" />
      <Swap k={tab}>
        {tab === "letters" && <Letters />}
        {tab === "timeline" && <Memories />}
        {tab === "days" && (dates.length ? <Countdown /> : <Card><H3>No dates yet</H3><p>Birthdays, trips and anniversaries will count down here. <Hand>Soon.</Hand></p></Card>)}
      </Swap>
    </Room>
  );
}
