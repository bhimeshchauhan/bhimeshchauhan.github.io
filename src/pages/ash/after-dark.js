import React from "react";
import HubLayout from "../../hub/HubLayout";
import AfterDark from "../../hub/rooms/AfterDark";
import { Wrap, Section } from "../../hub/ui";

export default function Page() {
  return (
    <HubLayout current="afterdark" title="After dark" description="Scary movies, good books and one candle.">
      <Wrap>
        <Section style={{ paddingTop: "clamp(2rem, 7vw, 4rem)" }}>
          <AfterDark />
        </Section>
      </Wrap>
    </HubLayout>
  );
}
