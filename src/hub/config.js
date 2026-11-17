// Ash's hub. Everything lives under one unlisted address:
//  - it is NOT linked from the public site, NOT in the sitemap or robots.txt, and every page is noindex/nofollow;
//  - the analytics tag skips it (gatsby-config.js);
//  - BUT this repository is public, so anything committed here (letters, photos, art) can be read on GitHub.
// To change the address, rename src/pages/<this folder> and static/<this folder>, and update HUB below.
export const HUB = "/ash";
export const hubPath = (p = "") => `${HUB}${p}`;

export const rooms = [
  { key: "career", path: "/career/", title: "Career guide", icon: "compass", blurb: "Programs, paths and pay, with the jokes left in." },
  { key: "letters", path: "/letters/", title: "Letters", icon: "envelope", blurb: "Notes I wrote for you. Open one when you want." },
  { key: "memories", path: "/memories/", title: "Memories", icon: "hourglass", blurb: "Our story, one star at a time." },
  { key: "art", path: "/art/", title: "Art", icon: "brush", blurb: "Things I made, just for you." },
  { key: "music", path: "/music/", title: "Music", icon: "note", blurb: "A raga for exactly this hour." },
  { key: "firsts", path: "/firsts/", title: "Firsts", icon: "mountain", blurb: "Skiing, boxing, violin, painting. The trail so far." },
  { key: "afterdark", path: "/after-dark/", title: "After dark", icon: "moon", blurb: "Scary movies, good books, one candle." },
  { key: "games", path: "/games/", title: "Games", icon: "star", blurb: "Find the cat. Match the memories." }
];
