import React from "react";
import Room from "../../hub/Room";
import CareerGuide from "../../hub/career/CareerGuide";

export default function Career() {
  return (
    <Room roomKey="career" art="wanderer" kicker="Career" title="Figure it out, one step at a time" lede="Programs, deadlines and a plan. Pick a tab, take your time.">
      <CareerGuide />
    </Room>
  );
}
