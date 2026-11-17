import React, { useEffect, useRef } from "react";
import styled from "styled-components";

// A real, zoomable map (Leaflet + OpenStreetMap tiles; a light-use private page, per the OSM tile policy) tinted to the hub's night-blue and gold.
// It opens on Vancouver. Moving or zooming reports the visible area through onView, which is where a live events feed hooks in.
const Box = styled.div`
  border: 2px solid rgba(232, 194, 107, 0.7); border-radius: 14px; box-shadow: 0 14px 40px rgba(0, 0, 0, 0.45); height: 100%; min-height: 340px; overflow: hidden; position: relative;
  .leaflet-container { background: #0b1233; font-family: inherit; height: 100%; min-height: 340px; width: 100%; }
  .leaflet-tile-pane { filter: invert(1) hue-rotate(235deg) saturate(0.9) brightness(0.92) contrast(0.95); }
  .leaflet-control-zoom a { background: rgba(10, 14, 40, 0.85); border-color: rgba(232, 194, 107, 0.5); color: var(--gold2); }
  .leaflet-control-attribution { background: rgba(7, 11, 31, 0.7); color: #aab3d8; }
  .leaflet-control-attribution a { color: var(--gold2); }
  .pin { align-items: center; background: #e8c26b; border: 2px solid #fff6d8; border-radius: 50% 50% 50% 0; box-shadow: 0 0 12px rgba(232, 194, 107, 0.9); display: flex; height: 22px; justify-content: center; transform: rotate(-45deg); width: 22px; }
  .pin.done { background: #7ccdd3; box-shadow: 0 0 12px rgba(124, 205, 211, 0.9); }
  .pin.pick { background: #f0aec3; box-shadow: 0 0 14px rgba(240, 174, 195, 1); }
  .pin i { background: #14122a; border-radius: 50%; display: block; height: 7px; width: 7px; }
  .leaflet-tooltip { background: #fbf7ee; border: 0; color: #2a2218; font-family: Caveat, cursive; font-size: 1.1rem; }
  .hint { background: rgba(7, 11, 31, 0.8); border-radius: 999px; color: var(--gold2); font-size: 0.78rem; left: 50%; padding: 0.3rem 0.8rem; pointer-events: none; position: absolute; top: 10px; transform: translateX(-50%); z-index: 500; }
`;

export default function TogetherMap({ items, picking, picked, onPick, onView }) {
  const el = useRef(null); const api = useRef({});
  useEffect(() => {
    let dead = false; let map;
    import("leaflet").then((mod) => {
      const L = mod.default || mod; if (dead || !el.current) return;
      import("leaflet/dist/leaflet.css");
      map = L.map(el.current, { center: [49.2827, -123.1207], zoom: 9, minZoom: 2, worldCopyJump: true, zoomControl: true, attributionControl: true });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap contributors", maxZoom: 18, referrerPolicy: "origin" }).addTo(map);
      const layer = L.layerGroup().addTo(map);
      api.current = { L, map, layer };
      const report = () => { const b = map.getBounds(); onView && onView({ zoom: map.getZoom(), center: map.getCenter(), bounds: { south: b.getSouth(), west: b.getWest(), north: b.getNorth(), east: b.getEast() } }); };
      map.on("moveend", report); report();
      map.on("click", (e) => { if (api.current.picking) api.current.onPick && api.current.onPick({ lat: e.latlng.lat, lng: e.latlng.lng }); });
      setTimeout(() => map.invalidateSize(), 300);
    });
    return () => { dead = true; if (map) map.remove(); };
  }, []); // eslint-disable-line
  useEffect(() => {
    api.current.picking = picking; api.current.onPick = onPick;
    if (api.current.map) api.current.map.getContainer().style.cursor = picking ? "crosshair" : "";
  }, [picking, onPick]);
  useEffect(() => {
    const { L, layer } = api.current; if (!layer) return;
    layer.clearLayers();
    const icon = (cls) => L.divIcon({ className: "", html: `<div class="pin ${cls}"><i></i></div>`, iconSize: [22, 22], iconAnchor: [11, 22] });
    items.filter((x) => x.lat != null).forEach((x) => L.marker([x.lat, x.lng], { icon: icon(x.done ? "done" : "") }).bindTooltip(x.t, { direction: "top", offset: [0, -20] }).addTo(layer));
    if (picked) L.marker([picked.lat, picked.lng], { icon: icon("pick") }).addTo(layer);
  }, [items, picked, api.current.layer]); // eslint-disable-line
  return (<Box>{picking && <div className="hint">Tap the map to drop a pin</div>}<div ref={el} /></Box>);
}
