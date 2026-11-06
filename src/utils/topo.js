// Minimal TopoJSON (world-atlas countries) decoder -> [{ name, polys: [[outerRing, ...holes], ...] }] in [lon, lat].
export const decodeCountries = (topo) => {
  const [sx, sy] = topo.transform.scale;
  const [tx, ty] = topo.transform.translate;
  const arcs = topo.arcs.map((a) => {
    let x = 0, y = 0;
    return a.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty]; });
  });
  const arc = (i) => (i >= 0 ? arcs[i] : arcs[~i].slice().reverse());
  const ring = (idxs) => idxs.flatMap((i, k) => (k ? arc(i).slice(1) : arc(i)));
  return topo.objects.countries.geometries.map((g) => ({
    name: g.properties.name,
    polys: g.type === "Polygon" ? [g.arcs.map(ring)] : g.arcs.map((p) => p.map(ring))
  }));
};

const inRing = (lon, lat, r) => {
  let c = false;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};

// Returns the country name containing the point, or null (ocean).
export const makeLocator = (countries) => {
  const items = [];
  countries.forEach((c) => c.polys.forEach((p) => {
    const o = p[0];
    let x0 = 181, x1 = -181, y0 = 91, y1 = -91;
    o.forEach(([x, y]) => { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; });
    items.push({ name: c.name, p, x0, x1, y0, y1 });
  }));
  return (lon, lat) => {
    for (const it of items) {
      if (lon < it.x0 || lon > it.x1 || lat < it.y0 || lat > it.y1) continue;
      if (inRing(lon, lat, it.p[0]) && !it.p.slice(1).some((h) => inRing(lon, lat, h))) return it.name;
    }
    return null;
  };
};
