import React from "react";
import HubLayout from "../../hub/HubLayout";
import Firsts from "../../hub/rooms/Firsts";
import { Wrap, Section } from "../../hub/ui";

export default function Page() {
  return (
    <HubLayout current="firsts" title="Firsts" description="Things Ash is trying for the first time.">
      <Wrap>
        <Section style={{ paddingTop: "clamp(2rem, 7vw, 4rem)" }}>
          <Firsts />
        </Section>
      </Wrap>
    </HubLayout>
  );
}
