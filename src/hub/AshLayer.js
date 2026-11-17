import React from "react";
import Christmas from "./Christmas";
import Cats from "./Cats";

// Everything that lives on top of the hub pages and persists between them (mounted once from gatsby-browser.js).
export default function AshLayer({ path }) {
  // The cartoon companion (Companion.js) and the 3D hero bust (Portrait3D.js) are switched off: they did not look real enough.
  return (<><Christmas path={path} /><Cats /></>);
}
