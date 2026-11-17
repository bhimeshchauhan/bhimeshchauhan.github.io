import { useEffect, useState } from "react";

// State that is remembered on Ash's own device (localStorage) and nowhere else. Safe on the server render and in private windows.
export default function useLocal(key, initial) {
  const [value, setValue] = useState(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw));
    } catch (e) { /* private window or blocked storage: carry on without saving */ }
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (!ready) return;
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
  }, [key, value, ready]);
  return [value, setValue];
}
