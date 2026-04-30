import { createClient } from "@supabase/supabase-js";

export const PHOTO_EVENT    = "photo:new";
export const MESSAGE_EVENT = "message:new";

export const createChannelName = (eventId) => `event:${eventId}`;

let cachedClient = null;

export const getSupabaseClient = () => {
  if (typeof window === "undefined") return null;
  if (cachedClient) return cachedClient;

  const url = process.env.GATSBY_SUPABASE_URL;
  const anonKey = process.env.GATSBY_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  cachedClient = createClient(url, anonKey, {
    realtime: { params: { eventsPerSecond: 10 } },
  });
  return cachedClient;
};

export const getPublicUrl = (storagePath) => {
  const url = process.env.GATSBY_SUPABASE_URL;
  if (!url) return null;
  return `${url}/storage/v1/object/public/photobooth/${storagePath}`;
};
