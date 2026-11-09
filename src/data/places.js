// Countries on the Goals globe. `country` must match a name in static/world/countries-110m.json (Natural Earth).
// kinds: "lived" | "worked" | "visited". A country with lived/worked glows amber; visited-only is periwinkle.
// `cities` is optional: only add real cities you were in, since each one gets a marker on the globe.
// Lived and worked: Canada, United States, Spain. Everything else is "visited". Update kinds as needed and the globe + legend follow.
export default [
  { country: "Canada", kinds: ["lived", "worked"], cities: [[49.28, -123.12], [43.65, -79.38]] },
  { country: "United States of America", label: "United States", kinds: ["lived", "worked"], cities: [[42.36, -71.06]] },
  { country: "India", kinds: ["visited"], cities: [[19.08, 72.88]] },
  { country: "Japan", kinds: ["visited"], cities: [[35.68, 139.69]] },
  { country: "Mexico", kinds: ["visited"], cities: [[19.43, -99.13]] },
  { country: "Peru", kinds: ["visited"], cities: [[-12.05, -77.04]] },
  { country: "Spain", kinds: ["lived", "worked"], cities: [[41.39, 2.17]] },
  { country: "Belgium", kinds: ["visited"] },
  { country: "Germany", kinds: ["visited"] },
  { country: "Italy", kinds: ["visited"] },
  { country: "Netherlands", kinds: ["visited"] },
  { country: "Austria", kinds: ["visited"] },
  { country: "Croatia", kinds: ["visited"] },
  { country: "Romania", kinds: ["visited"] },
  { country: "Hungary", kinds: ["visited"] },
  { country: "Portugal", kinds: ["visited"] },
  // Too small for the 110m map, so it is shown as a single marker (Andorra la Vella) instead of land dots.
  { country: "Andorra", kinds: ["visited"], cities: [[42.51, 1.52]] },
];
