// Countries on the Goals globe. `country` must match a name in static/world/countries-110m.json (Natural Earth).
// kinds: "lived" | "worked" | "visited". A country with lived/worked glows amber; visited-only is periwinkle.
// Seeded from what the site already states (Canada: based here; the rest are cities from blog datelines, so
// "visited" is the safe label). Update kinds here as needed; the globe and legend follow.
export default [
  { country: "Canada", kinds: ["lived", "worked"], cities: [[49.28, -123.12], [43.65, -79.38]] },
  { country: "United States of America", label: "United States", kinds: ["visited"], cities: [[42.36, -71.06]] },
  { country: "Mexico", kinds: ["visited"], cities: [[19.43, -99.13]] },
  { country: "Peru", kinds: ["visited"], cities: [[-12.05, -77.04]] },
  { country: "Spain", kinds: ["visited"], cities: [[41.39, 2.17]] },
  { country: "India", kinds: ["visited"], cities: [[19.08, 72.88]] },
  { country: "Japan", kinds: ["visited"], cities: [[35.68, 139.69]] },
];
