// Sends a Google Analytics event. Silent when analytics is blocked or not loaded (dev, Do Not Track, ad blockers).
export const track = (name, params = {}) => {
  try {
    if (typeof window !== "undefined" && typeof window.gtag === "function") window.gtag("event", name, params);
  } catch (e) {}
};
