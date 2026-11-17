import React from "react";
import HubLayout from "../../hub/HubLayout";
import Games from "../../hub/rooms/Games";
import { Wrap, Section } from "../../hub/ui";

export default function Page() {
  return (
    <HubLayout current="games" title="Games" description="Find the cat and match the memories.">
      <Wrap>
        <Section style={{ paddingTop: "clamp(2rem, 7vw, 4rem)" }}>
          <Games />
        </Section>
      </Wrap>
    </HubLayout>
  );
}
