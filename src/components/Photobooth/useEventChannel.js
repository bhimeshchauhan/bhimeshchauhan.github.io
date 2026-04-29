import { useCallback, useEffect, useRef, useState } from "react";
import { createChannelName, getSupabaseClient, PHOTO_EVENT } from "./photoboothProtocol";

export const useEventChannel = ({ eventId, enabled = true, onPhoto }) => {
  const [status, setStatus] = useState("idle");
  const channelRef = useRef(null);
  const onPhotoRef = useRef(onPhoto);
  onPhotoRef.current = onPhoto;

  useEffect(() => {
    if (!enabled || !eventId) return;

    const client = getSupabaseClient();
    if (!client) { setStatus("error"); return; }

    const channel = client.channel(createChannelName(eventId), {
      config: { broadcast: { self: false } },
    });
    channelRef.current = channel;

    channel
      .on("broadcast", { event: PHOTO_EVENT }, ({ payload }) => {
        onPhotoRef.current?.(payload);
      })
      .subscribe((s) => setStatus(s));

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
      setStatus("idle");
    };
  }, [enabled, eventId]);

  const broadcastPhoto = useCallback(async (photoData) => {
    if (!channelRef.current) return;
    await channelRef.current.send({
      type: "broadcast",
      event: PHOTO_EVENT,
      payload: photoData,
    });
  }, []);

  return { status, broadcastPhoto };
};
