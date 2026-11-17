// Traditional time-of-day pairings in Hindustani (North Indian) classical music. A raga is a melodic frame, and many are
// customarily played at a particular part of the day or night. Listening links are searches, so nothing here can go stale.
export const slots = [
  { from: 4, to: 7, label: "Early morning", ragas: ["Bhairav", "Ahir Bhairav"] },
  { from: 7, to: 10, label: "Morning", ragas: ["Todi", "Bilaskhani Todi"] },
  { from: 10, to: 13, label: "Late morning", ragas: ["Brindavani Sarang", "Madhyamad Sarang"] },
  { from: 13, to: 16, label: "Afternoon", ragas: ["Bhimpalasi", "Multani"] },
  { from: 16, to: 19, label: "Dusk", ragas: ["Puriya Dhanashree", "Marwa"] },
  { from: 19, to: 22, label: "Evening", ragas: ["Yaman", "Bihag", "Kedar"] },
  { from: 22, to: 28, label: "Night", ragas: ["Darbari Kanada", "Malkauns", "Bageshri"] } // 22:00 to 04:00
];

export const slotFor = (date = new Date()) => {
  const h = date.getHours();
  const hh = h < 4 ? h + 24 : h;
  return slots.find((s) => hh >= s.from && hh < s.to) || slots[slots.length - 1];
};

export const search = (q) => ({
  youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`,
  spotify: `https://open.spotify.com/search/${encodeURIComponent(q)}`
});
export const listen = (raga) => search(`raga ${raga}`);
