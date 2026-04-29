import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getPublicUrl, getSupabaseClient } from "./photoboothProtocol";
import { useEventChannel } from "./useEventChannel";

const Wall = styled.div`
  column-count: 3;
  column-gap: 12px;
  padding: 16px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 700px) { column-count: 2; }
  @media (max-width: 420px) { column-count: 1; }
`;

const PhotoCard = styled(motion.div)`
  break-inside: avoid;
  margin-bottom: 12px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  background: rgba(255,255,255,0.05);
`;

const Photo = styled.img`
  width: 100%;
  display: block;
`;

const Caption = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 12px;
  background: linear-gradient(transparent, rgba(0,0,0,0.65));
  font-size: 0.78rem;
  color: rgba(255,255,255,0.85);
  display: flex;
  justify-content: space-between;
`;

const Empty = styled.div`
  text-align: center;
  color: rgba(255,255,255,0.35);
  padding: 80px 20px;
  font-size: 1.1rem;
`;

function relativeTime(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

const LiveWall = ({ eventId, displayToken }) => {
  const [photos, setPhotos] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load initial photos
  useEffect(() => {
    if (!displayToken) return;
    const client = getSupabaseClient();
    if (!client) return;

    client
      .rpc("get_event_photos", { p_token: displayToken, p_limit: 30 })
      .then(({ data }) => {
        if (data) {
          setPhotos(
            data.map((p) => ({
              id: p.id,
              publicUrl: getPublicUrl(p.storage_path),
              guestName: p.guest_name,
              createdAt: p.created_at,
            })),
          );
        }
        setLoaded(true);
      });
  }, [displayToken]);

  // Subscribe to new photos via realtime
  useEventChannel({
    eventId,
    enabled: Boolean(eventId),
    onPhoto: (payload) => {
      setPhotos((prev) => {
        if (prev.some((p) => p.id === payload.photoId)) return prev;
        return [
          {
            id: payload.photoId,
            publicUrl: payload.publicUrl,
            guestName: payload.guestName,
            createdAt: payload.createdAt,
          },
          ...prev,
        ];
      });
    },
  });

  if (!loaded) {
    return <Empty>Loading photos…</Empty>;
  }

  return (
    <>
      {photos.length === 0 ? (
        <Empty>Photos will appear here as guests take them.</Empty>
      ) : (
        <Wall>
          <AnimatePresence>
            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                layout
              >
                <Photo src={photo.publicUrl} alt={photo.guestName ?? "photo"} loading="lazy" />
                {(photo.guestName || photo.createdAt) && (
                  <Caption>
                    <span>{photo.guestName ?? ""}</span>
                    <span>{photo.createdAt ? relativeTime(photo.createdAt) : ""}</span>
                  </Caption>
                )}
              </PhotoCard>
            ))}
          </AnimatePresence>
        </Wall>
      )}
    </>
  );
};

export default LiveWall;
