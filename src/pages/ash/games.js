import React from "react";
import Room from "../../hub/Room";
import Games from "../../hub/rooms/Games";

export default function GamesPage() {
  return (
    <Room roomKey="games" art="lilies" kicker="Games" title="Take a little break" lede="Two tiny games, no timer, no pressure.">
      <Games />
    </Room>
  );
}
