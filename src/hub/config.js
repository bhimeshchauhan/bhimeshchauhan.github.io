// Ash's hub. Everything lives under one unlisted address:
//  - it is NOT linked from the public site, NOT in the sitemap or robots.txt, and every page is noindex/nofollow;
//  - the analytics tag skips it (gatsby-config.js);
//  - BUT this repository is public, so anything committed here (letters, photos, art) can be read on GitHub.
// To change the address, rename src/pages/<this folder> and static/<this folder>, and update HUB below.
export const HUB = "/ash";
export const hubPath = (p = "") => `${HUB}${p}`;

export const rooms = [
  { key: "career", path: "/career/", title: "Career", icon: "compass", art: "wanderer", blurb: "Programs, deadlines and a plan, one step at a time." },
  { key: "outdoors", path: "/outdoors/", title: "Outdoors", icon: "mountain", art: "cypress", blurb: "Trails, ski days and checklists." },
  { key: "practice", path: "/practice/", title: "Practice", icon: "brush", art: "bellows", blurb: "Violin, boxing, painting, skiing. Log it, watch it grow." },
  { key: "music", path: "/music/", title: "Music", icon: "note", art: "lilies", blurb: "A raga for this hour, and where to listen next." },
  { key: "watch", path: "/watch-read/", title: "Watch & Read", icon: "moon", art: "nightmare", blurb: "The lists, and a pick for tonight." },
  { key: "gallery", path: "/gallery/", title: "Gallery", icon: "star", art: "starry", blurb: "Paintings you'd love, and why." },
  { key: "games", path: "/games/", title: "Games", icon: "paw", art: "lilies", blurb: "Find the cat. Match the memories." },
  { key: "together", path: "/together/", title: "Together", icon: "heart", art: "wanderer", blurb: "Our bucket list, pinned up like a scrapbook." },
  { key: "notes", path: "/notes/", title: "Notes", icon: "envelope", art: "kiss", blurb: "Letters, our timeline, and countdowns." }
];
