import React, { Suspense, useEffect, useState } from "react";

// Mounted for the whole site from gatsby-browser.js, but it does nothing (and loads nothing) outside /ash.
const AshLayer = React.lazy(() => import("./AshLayer"));
export default function Addons() {
  const [path, setPath] = useState(null);
  useEffect(() => {
    const set = (p) => setPath(p);
    set(window.location.pathname);
    const h = (e) => set(e.detail);
    window.addEventListener("ash-route", h);
    return () => window.removeEventListener("ash-route", h);
  }, []);
  if (!path || !/^\/ash(\/|$)/.test(path)) return null;
  return <Suspense fallback={null}><AshLayer path={path} /></Suspense>;
}
