import React from "react";
import Companion from "./Companion";
import Christmas from "./Christmas";

// Everything that lives on top of the hub pages and persists between them (mounted once from gatsby-browser.js).
export default function AshLayer({ path }) {
  const home = /^\/ash\/?$/.test(path);
  return (<><Christmas />{!home && <Companion path={path} />}</>);
}
