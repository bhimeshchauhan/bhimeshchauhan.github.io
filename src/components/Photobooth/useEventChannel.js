import { useCallback, useEffect, useRef, useState } from "react";
import { createChannelName, getSupabaseClient, MESSAGE_EVENT, PHOTO_EVENT } from "./photoboothProtocol";

export const useEventChannel = ({ eventId, enabled = true, onPhoto, onMessage }) => {
  const [status, setStatus] = useState("idle");
  const channelRef = useRef(null);
  const onPhotoRef = useRef(onPhoto);
  const onMessageRef = useRef(onMessage);
  onPhotoRef.current = onPhoto;
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!enabled || !eventId) return;

    const client = getSupabaseClient();
    if (!client) { setStatus("error"); return; }

    const channel = client.channel(createChannelName(eventId), {
      config: { broadcast: { self: false } },
    });
    channelRef.current = channel;

    channel
      .on("broadcast", { event: PHOTO_EVENT },   ({ payload }) => { onPhotoRef.current?.(payload); })
      .on("broadcast", { event: MESSAGE_EVENT }, ({ payload }) => { onMessageRef.current?.(payload); })
      .subscribe((s) => setStatus(s));

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
      setStatus("idle");
    };
  }, [enabled, eventId]);

  const broadcastPhoto = useCallback(async (data) => {
    if (!channelRef.current) return;
    await channelRef.current.send({ type: "broadcast", event: PHOTO_EVENT, payload: data });
  }, []);

  const broadcastMessage = useCallback(async (data) => {
    if (!channelRef.current) return;
    await channelRef.current.send({ type: "broadcast", event: MESSAGE_EVENT, payload: data });
  }, []);

  return { status, broadcastPhoto, broadcastMessage };
};
