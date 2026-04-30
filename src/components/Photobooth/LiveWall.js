import React, { useEffect, useRef, useState } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { getPublicUrl, getSupabaseClient } from "./photoboothProtocol";
import { useEventChannel } from "./useEventChannel";

const Fonts = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&family=Playfair+Display:ital,wght@0,400;1,400&display=swap');
`;

// ── Animations ───────────────────────────────────────────────────────────────

const scrollUp = keyframes`
  0%   { transform: translateY(0); }
  100% { transform: translateY(-50%); }
`;

const newGlow = keyframes`
  0%   { box-shadow: 0 4px 8px rgba(0,0,0,0.4), 0 0  0px  0px rgba(212,168,67,0);   }
  20%  { box-shadow: 0 4px 8px rgba(0,0,0,0.4), 0 0 40px 12px rgba(212,168,67,0.9); }
  60%  { box-shadow: 0 4px 8px rgba(0,0,0,0.4), 0 0 24px  6px rgba(212,168,67,0.5); }
  100% { box-shadow: 0 4px 8px rgba(0,0,0,0.35),0 12px 32px rgba(0,0,0,0.45);       }
`;

const dropIn = keyframes`
  0%   { opacity: 0; transform: translateY(-60px) scale(0.85) rotate(var(--rot)); }
  60%  { opacity: 1; transform: translateY(8px)   scale(1.04) rotate(var(--rot)); }
  100% { opacity: 1; transform: translateY(0)     scale(1)    rotate(var(--rot)); }
`;

// ── Deterministic rotation (-5° to +5°) ─────────────────────────────────────

const getRotation = (id = "") => {
  const sum = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return ((sum % 11) - 5);
};

// ── Column scroll speeds (seconds) — slight variation = parallax feel ────────

const COL_SPEEDS = [44, 58, 38];

// ── Mock photos ──────────────────────────────────────────────────────────────

const MOCK_PHOTOS = [
  { id: "m1",  publicUrl: "https://picsum.photos/seed/ev1/360/460",  guestName: "Sarah M.",      createdAt: new Date(Date.now() - 600000).toISOString() },
  { id: "m2",  publicUrl: "https://picsum.photos/seed/ev2/360/430",  guestName: "James & Lily",  createdAt: new Date(Date.now() - 540000).toISOString() },
  { id: "m3",  publicUrl: "https://picsum.photos/seed/ev3/360/500",  guestName: "The Nguyens",   createdAt: new Date(Date.now() - 480000).toISOString() },
  { id: "m4",  publicUrl: "https://picsum.photos/seed/ev4/360/460",  guestName: "Priya",         createdAt: new Date(Date.now() - 420000).toISOString() },
  { id: "m5",  publicUrl: "https://picsum.photos/seed/ev5/360/490",  guestName: "Tom & Kate",    createdAt: new Date(Date.now() - 360000).toISOString() },
  { id: "m6",  publicUrl: "https://picsum.photos/seed/ev6/360/440",  guestName: "Ava",           createdAt: new Date(Date.now() - 300000).toISOString() },
  { id: "m7",  publicUrl: "https://picsum.photos/seed/ev7/360/470",  guestName: "Carlos",        createdAt: new Date(Date.now() - 240000).toISOString() },
  { id: "m8",  publicUrl: "https://picsum.photos/seed/ev8/360/450",  guestName: "Michelle",      createdAt: new Date(Date.now() - 180000).toISOString() },
  { id: "m9",  publicUrl: "https://picsum.photos/seed/ev9/360/510",  guestName: "Kevin",         createdAt: new Date(Date.now() - 120000).toISOString() },
  { id: "m10", publicUrl: "https://picsum.photos/seed/ev10/360/460", guestName: "Diane & Paul",  createdAt: new Date(Date.now() -  60000).toISOString() },
  { id: "m11", publicUrl: "https://picsum.photos/seed/ev11/360/480", guestName: "Nadia",         createdAt: new Date(Date.now() -  30000).toISOString() },
  { id: "m12", publicUrl: "https://picsum.photos/seed/ev12/360/430", guestName: "The Garcias",   createdAt: new Date(Date.now() -  10000).toISOString() },
];

// ── Styled components ────────────────────────────────────────────────────────

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  padding: 0 40px 40px;
  height: calc(100vh - 210px);
  overflow: hidden;

  @media (max-width: 720px) { grid-template-columns: repeat(2, 1fr); gap: 16px; padding: 0 16px 16px; }
`;

const Column = styled.div`
  overflow: hidden;
  position: relative;

  /* Fade edges so photos melt into the background */
  &::before, &::after {
    content: '';
    position: absolute;
    left: 0; right: 0;
    height: 80px;
    z-index: 2;
    pointer-events: none;
  }
  &::before {
    top: 0;
    background: linear-gradient(to bottom, #050508 0%, transparent 100%);
  }
  &::after {
    bottom: 0;
    background: linear-gradient(to top, #050508 0%, transparent 100%);
  }
`;

const Track = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${scrollUp} ${({ $dur }) => $dur}s linear infinite;

  &:hover { animation-play-state: paused; }
`;

const Card = styled.div`
  --rot: ${({ $rot }) => $rot}deg;
  background: #fafbff;
  padding: 10px 10px 44px;
  border-radius: 2px;
  transform: rotate(var(--rot));
  box-shadow:
    0 4px 8px rgba(0,0,0,0.35),
    0 12px 32px rgba(0,0,0,0.45);
  transition: transform 0.25s ease;
  animation: ${({ $isNew }) => $isNew ? newGlow : "none"} 3s ease-out forwards;

  /* Drop in only for brand new photos (first render) */
  &[data-dropin="true"] {
    animation: ${dropIn} 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards,
               ${newGlow} 3s ease-out 0.3s forwards;
  }
`;

const PhotoImg = styled.img`
  width: 100%;
  display: block;
  filter: contrast(1.02) saturate(0.9);
`;

const NameArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  gap: 1px;
`;

const GuestName = styled.span`
  font-family: 'Dancing Script', cursive;
  font-size: 1rem;
  color: #2a2a2a;
  text-align: center;
  line-height: 1.2;
`;

const TimeStamp = styled.span`
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-size: 0.6rem;
  color: #bbb;
  text-align: center;
`;

const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 12px;
  font-family: 'Playfair Display', serif;
  font-style: italic;
  color: rgba(255,255,255,0.3);
  font-size: 1.1rem;
`;

// ── Helpers ──────────────────────────────────────────────────────────────────

function relativeTime(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

// Distribute photos across N columns (round-robin by index)
function toColumns(photos, n) {
  const cols = Array.from({ length: n }, () => []);
  photos.forEach((p, i) => cols[i % n].push(p));
  return cols;
}

// ── Component ────────────────────────────────────────────────────────────────

const LiveWall = ({ eventId, displayToken, useMock = false }) => {
  const [photos, setPhotos] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [newIds, setNewIds] = useState(new Set());
  const colCount = 3;

  const markNew = (id) => {
    setNewIds((prev) => new Set([...prev, id]));
    setTimeout(() => {
      setNewIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
    }, 3500);
  };

  useEffect(() => {
    if (useMock) { setPhotos(MOCK_PHOTOS); setLoaded(true); return; }
    if (!displayToken) return;
    const client = getSupabaseClient();
    if (!client) { setLoaded(true); return; }

    client.rpc("get_event_photos", { p_token: displayToken, p_limit: 60 })
      .then(({ data }) => {
        if (data) setPhotos(data.map((p) => ({
          id: p.id,
          publicUrl: getPublicUrl(p.storage_path),
          guestName: p.guest_name,
          createdAt: p.created_at,
        })));
        setLoaded(true);
      });
  }, [displayToken, useMock]);

  useEventChannel({
    eventId,
    enabled: Boolean(eventId) && !useMock,
    onPhoto: (payload) => {
      setPhotos((prev) => {
        if (prev.some((p) => p.id === payload.photoId)) return prev;
        return [{ id: payload.photoId, publicUrl: payload.publicUrl, guestName: payload.guestName, createdAt: payload.createdAt }, ...prev];
      });
      markNew(payload.photoId);
    },
  });

  if (!loaded) return <Empty>✦ Getting ready…</Empty>;
  if (photos.length === 0) return <Empty>✦ Photos will appear here as guests take them.</Empty>;

  const columns = toColumns(photos, colCount);

  return (
    <>
      <Fonts />
      <Grid>
        {columns.map((colPhotos, ci) => {
          if (colPhotos.length === 0) return null;
          // Duplicate for seamless scroll loop
          const looped = [...colPhotos, ...colPhotos];
          return (
            <Column key={ci}>
              <Track $dur={COL_SPEEDS[ci]}>
                {looped.map((photo, idx) => (
                  <Card
                    key={`${photo.id}-${idx}`}
                    $rot={getRotation(photo.id)}
                    $isNew={newIds.has(photo.id) && idx < colPhotos.length}
                    data-dropin={newIds.has(photo.id) && idx === 0 ? "true" : undefined}
                  >
                    <PhotoImg
                      src={photo.publicUrl}
                      alt={photo.guestName ?? "photo"}
                      loading="lazy"
                    />
                    <NameArea>
                      {photo.guestName && <GuestName>{photo.guestName}</GuestName>}
                      {photo.createdAt && <TimeStamp>{relativeTime(photo.createdAt)}</TimeStamp>}
                    </NameArea>
                  </Card>
                ))}
              </Track>
            </Column>
          );
        })}
      </Grid>
    </>
  );
};

export default LiveWall;
