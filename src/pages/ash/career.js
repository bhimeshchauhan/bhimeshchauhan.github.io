import React from "react";
import HubLayout from "../../hub/HubLayout";
import CareerGuide from "../../hub/career/CareerGuide";

export default function Career() {
  return (
    <HubLayout current="career" title="Career guide" description="Workplace psychology and change management programs, careers and pay, compared for Ash.">
      <CareerGuide />
    </HubLayout>
  );
}
