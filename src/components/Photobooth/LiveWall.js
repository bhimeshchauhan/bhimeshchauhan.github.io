import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { getPublicUrl, getSupabaseClient } from "./photoboothProtocol";
import { useEventChannel } from "./useEventChannel";

const Fonts = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&family=Playfair+Display:wght@400;700&display=swap');
`;

// Deterministic rotation from photo id so it never shifts on re-render
const getRotation = (id = "") => {
  const sum = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return ((sum % 11) - 5); // -5 to +5 deg
};

const MOCK_PHOTOS = [
  { id: "mock1", publicUrl: "https://picsum.photos/seed/party1/400/520", guestName: "Sarah M.", createdAt: new Date(Date.now() - 120000).toISOString() },
  { id: "mock2", publicUrl: "https://picsum.photos/seed/party2/400/480", guestName: "James & Lily", createdAt: new Date(Date.now() - 95000).toISOString() },
  { id: "mock3", publicUrl: "https://picsum.photos/seed/party3/400/560", guestName: "The Nguyens", createdAt: new Date(Date.now() - 75000).toISOString() },
  { id: "mock4", publicUrl: "https://picsum.photos/seed/party4/400/500", guestName: "Priya", createdAt: new Date(Date.now() - 60000).toISOString() },
  { id: "mock5", publicUrl: "https://picsum.photos/seed/party5/400/540", guestName: "Tom & Kate", createdAt: new Date(Date.now() - 45000).toISOString() },
  { id: "mock6", publicUrl: "https://picsum.photos/seed/party6/400/480", guestName: "Ava", createdAt: new Date(Date.now() - 30000).toISOString() },
  { id: "mock7", publicUrl: "https://picsum.photos/seed/party7/400/520", guestName: "Carlos", createdAt: new Date(Date.now() - 20000).toISOString() },
  { id: "mock8", publicUrl: "https://picsum.photos/seed/party8/400/500", guestName: "Michelle", createdAt: new Date(Date.now() - 10000).toISOString() },
];

const Wall = styled.div`
  column-count: 4;
  column-gap: 20px;
  padding: 24px 32px 48px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1100px) { column-count: 3; }
  @media (max-width: 720px)  { column-count: 2; }
  @media (max-width: 480px)  { column-count: 1; }
`;

const PolaroidWrap = styled(motion.div)`
  break-inside: avoid;
  margin-bottom: 24px;
  display: inline-block;
  width: 100%;
  transform-origin: center bottom;
`;

const Polaroid = styled.div`
  background: #fffef5;
  padding: 12px 12px 52px;
  box-shadow:
    0 4px 8px rgba(0,0,0,0.35),
    0 12px 32px rgba(0,0,0,0.45),
    0 2px 4px rgba(0,0,0,0.2);
  border-radius: 2px;
  transform: rotate(${({ $rot }) => $rot}deg);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: rotate(0deg) scale(1.03);
    box-shadow:
      0 8px 20px rgba(0,0,0,0.45),
      0 24px 60px rgba(0,0,0,0.55);
    z-index: 10;
    position: relative;
  }
`;

const PhotoImg = styled.img`
  width: 100%;
  display: block;
  filter: contrast(1.02) saturate(0.92);
`;

const NameArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: -8px;
  gap: 2px;
`;

const GuestName = styled.span`
  font-family: 'Dancing Script', cursive;
  font-size: 1.15rem;
  color: #2a2a2a;
  text-align: center;
  line-height: 1.2;
`;

const TimeStamp = styled.span`
  font-family: 'Playfair Display', serif;
  font-size: 0.65rem;
  color: #aaa;
  letter-spacing: 0.04em;
  text-align: center;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 16px;
  text-align: center;
  padding: 40px;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  color: rgba(255,255,255,0.4);
  margin: 0;
`;

function relativeTime(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 22 },
  },
  exit: { opacity: 0, scale: 0.88, transition: { duration: 0.2 } },
};

const LiveWall = ({ eventId, displayToken, useMock = false }) => {
  const [photos, setPhotos] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (useMock) {
      setPhotos(MOCK_PHOTOS);
      setLoaded(true);
      return;
    }
    if (!displayToken) return;
    const client = getSupabaseClient();
    if (!client) { setLoaded(true); return; }

    client
      .rpc("get_event_photos", { p_token: displayToken, p_limit: 60 })
      .then(({ data }) => {
        if (data) {
          setPhotos(data.map((p) => ({
            id: p.id,
            publicUrl: getPublicUrl(p.storage_path),
            guestName: p.guest_name,
            createdAt: p.created_at,
          })));
        }
        setLoaded(true);
      });
  }, [displayToken, useMock]);

  useEventChannel({
    eventId,
    enabled: Boolean(eventId) && !useMock,
    onPhoto: (payload) => {
      setPhotos((prev) => {
        if (prev.some((p) => p.id === payload.photoId)) return prev;
        return [{
          id: payload.photoId,
          publicUrl: payload.publicUrl,
          guestName: payload.guestName,
          createdAt: payload.createdAt,
        }, ...prev];
      });
    },
  });

  if (!loaded) {
    return (
      <EmptyState>
        <EmptyIcon>📸</EmptyIcon>
        <EmptyText>Getting ready…</EmptyText>
      </EmptyState>
    );
  }

  if (photos.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon>📷</EmptyIcon>
        <EmptyText>Photos will appear here as guests capture them.</EmptyText>
      </EmptyState>
    );
  }

  return (
    <>
      <Fonts />
      <Wall>
        <AnimatePresence>
          {photos.map((photo) => (
            <PolaroidWrap
              key={photo.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              <Polaroid $rot={getRotation(photo.id)}>
                <PhotoImg
                  src={photo.publicUrl}
                  alt={photo.guestName ?? "photo"}
                  loading="lazy"
                />
                <NameArea>
                  {photo.guestName && <GuestName>{photo.guestName}</GuestName>}
                  {photo.createdAt && <TimeStamp>{relativeTime(photo.createdAt)}</TimeStamp>}
                </NameArea>
              </Polaroid>
            </PolaroidWrap>
          ))}
        </AnimatePresence>
      </Wall>
    </>
  );
};

export default LiveWall;
