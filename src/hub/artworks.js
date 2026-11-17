// Public-domain paintings, one set of credits for the whole hub. Every work here is out of copyright (the artists died long ago)
// and every image comes from a museum or Wikimedia Commons file marked "Public domain" or CC0. Licenses were checked on Nov 17, 2026.
// To add one: put a resized JPEG in static/ash/art/ and add an entry. `why` is the one line that tells her why she might love it.
const p = (f) => `/ash/art/${f}.jpg`;
export const artworks = [
  { id: "starry", src: p("starry"), title: "The Starry Night", artist: "Vincent van Gogh", year: "1889", museum: "Museum of Modern Art, New York", page: "https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg", why: "Painted from memory at an asylum window: the sky he felt, not the one he saw.", tone: "#1b2a6f", focus: "50% 40%" },
  { id: "cypress", src: p("cypress"), title: "Wheat Field with Cypresses", artist: "Vincent van Gogh", year: "1889", museum: "The Metropolitan Museum of Art", page: "https://commons.wikimedia.org/wiki/File:Wheat-Field-with-Cypresses-(1889)-Vincent-van-Gogh-Met.jpg", why: "Wind you can see. It's what a long walk outside feels like to her.", tone: "#3a4f2a", focus: "50% 45%" },
  { id: "lilies", src: p("lilies"), title: "Water Lilies", artist: "Claude Monet", year: "1906", museum: "Art Institute of Chicago", page: "https://commons.wikimedia.org/wiki/File:Claude_Monet_-_Water_Lilies_-_1906,_Ryerson.jpg", why: "Monet painted his pond for decades. Proof that looking closely never gets old.", tone: "#2c5b6a", focus: "50% 50%" },
  { id: "kiss", src: p("kiss"), title: "The Kiss", artist: "Gustav Klimt", year: "1907–08", museum: "Österreichische Galerie Belvedere, Vienna", page: "https://commons.wikimedia.org/wiki/File:The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg", why: "Real gold leaf. Two people wrapped in pattern, the way love feels to her.", tone: "#7a5a1e", focus: "50% 35%" },
  { id: "wanderer", src: p("wanderer"), title: "Wanderer above the Sea of Fog", artist: "Caspar David Friedrich", year: "c. 1818", museum: "Hamburger Kunsthalle", page: "https://commons.wikimedia.org/wiki/File:Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg", why: "Standing on the summit, not sure which way is next. That's every big decision.", tone: "#4a566c", focus: "50% 40%" },
  { id: "nightmare", src: p("nightmare"), title: "The Nightmare", artist: "Henry Fuseli", year: "1781", museum: "Detroit Institute of Arts", page: "https://commons.wikimedia.org/wiki/File:John_Henry_Fuseli_-_The_Nightmare.JPG", why: "Horror, 1781 edition. It scandalised London and has been giving people chills ever since.", tone: "#5a1d1d", focus: "50% 45%" },
  { id: "bellows", src: p("bellows"), title: "Stag at Sharkey's", artist: "George Bellows", year: "1909", museum: "Cleveland Museum of Art", page: "https://clevelandart.org/art/1922.1133", why: "Two boxers in a smoky club, all motion and nerve. For the girl who is trying boxing.", tone: "#6b4a2a", focus: "50% 45%" }
];
export const byId = Object.fromEntries(artworks.map((a) => [a.id, a]));
// A different painting each day.
const warm = artworks.filter((a) => a.id !== "nightmare" && a.id !== "bellows"); // a gentle welcome: no horror or boxing as the front door
export const ofTheDay = (d = new Date()) => warm[Math.floor(d.getTime() / 86400000) % warm.length];
