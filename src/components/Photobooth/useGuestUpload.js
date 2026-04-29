import { useCallback, useState } from "react";
import { getPublicUrl, getSupabaseClient } from "./photoboothProtocol";

const MAX_DIMENSION = 1920;

function downscaleToBlob(imageBitmap) {
  return new Promise((resolve) => {
    const { width, height } = imageBitmap;
    const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
    const w = Math.round(width * scale);
    const h = Math.round(height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d").drawImage(imageBitmap, 0, 0, w, h);
    canvas.toBlob(resolve, "image/jpeg", 0.85);
  });
}

export const useGuestUpload = ({ displayToken, guestName }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadPhoto = useCallback(async (imageBitmap) => {
    setUploading(true);
    setError(null);

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error("Supabase not configured");

      const blob = await downscaleToBlob(imageBitmap);
      const photoId = crypto.randomUUID();

      // 1. Register photo + get storage path via RPC
      const { data: rpcData, error: rpcErr } = await client.rpc("insert_guest_photo", {
        p_token: displayToken,
        p_path: `events/${photoId}.jpg`,
        p_guest_name: guestName || null,
      });
      if (rpcErr) throw rpcErr;

      const { event_id, path } = rpcData;

      // 2. Upload blob directly to Supabase Storage
      const { error: uploadErr } = await client.storage
        .from("photobooth")
        .upload(path, blob, { contentType: "image/jpeg", upsert: false });
      if (uploadErr) throw uploadErr;

      const publicUrl = getPublicUrl(path);
      return { photoId, eventId: event_id, path, publicUrl, guestName };
    } catch (err) {
      setError(err.message ?? String(err));
      return null;
    } finally {
      setUploading(false);
    }
  }, [displayToken, guestName]);

  return { uploadPhoto, uploading, error };
};
