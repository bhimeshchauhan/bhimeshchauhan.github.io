import React, { useEffect, useState } from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { getPublicUrl, getSupabaseClient } from "./photoboothProtocol";
import { useEventChannel } from "./useEventChannel";

const Fonts = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
`;

// ── Animations ───────────────────────────────────────────────────────────────

const scrollUp = keyframes`
  0%   { transform: translateY(0); }
  100% { transform: translateY(-50%); }
`;

const newGlow = keyframes`
  0%   { box-shadow: 0 6px 20px rgba(0,0,0,0.6), 0 0  0px  0px rgba(255,215,0,0);    }
  20%  { box-shadow: 0 6px 20px rgba(0,0,0,0.6), 0 0 44px 16px rgba(255,200,0,0.9);  }
  60%  { box-shadow: 0 6px 20px rgba(0,0,0,0.6), 0 0 28px  8px rgba(255,165,0,0.5);  }
  100% { box-shadow: 0 6px 20px rgba(0,0,0,0.6), 0 20px 60px rgba(255,165,0,0.05);   }
`;

const dropIn = keyframes`
  0%   { opacity: 0; transform: translateY(-60px) scale(0.85) rotate(var(--rot)); }
  60%  { opacity: 1; transform: translateY(8px)   scale(1.04) rotate(var(--rot)); }
  100% { opacity: 1; transform: translateY(0)     scale(1)    rotate(var(--rot)); }
`;

// ── Deterministic rotation (-4° to +4°) ─────────────────────────────────────

const getRotation = (id = "") => {
  const sum = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return ((sum % 9) - 4);
};

// ── Column scroll speeds (seconds) ───────────────────────────────────────────

const COL_SPEEDS = [34, 50, 28];

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

/*
 * Card width auto-derived from viewport height so exactly 2 rows fill the space:
 *   available_h = 100vh - 64px header - 60px padding - 28px gap = 100vh - 152px
 *   card_h      = available_h / 2
 *   card_w      = card_h * (3/4) = available_h * 3/8 = (100vh - 152px) * 0.375
 */
const CARD_W = "calc((100vh - 152px) * 0.375)";

const WallWrapper = styled.div`
  position: relative;
  height: calc(100vh - 64px);
  overflow: hidden;
`;

/* absolute gradient overlays — more reliable than mask-image cross-browser */
const EdgeFade = styled.div`
  position: absolute;
  left: 0; right: 0;
  height: 36px;
  z-index: 3;
  pointer-events: none;
  ${({ $pos, $bg }) =>
    $pos === "top"
      ? `top: 0; background: linear-gradient(to bottom, ${$bg} 0%, transparent 100%);`
      : `bottom: 0; background: linear-gradient(to top, ${$bg} 0%, transparent 100%);`}
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, ${CARD_W});
  justify-content: center;
  gap: 28px;
  padding: 30px 40px;

  @media (max-width: 860px) {
    grid-template-columns: repeat(2, ${CARD_W});
    gap: 20px;
    padding: 20px;
  }
`;

/* overflow: visible so rotated card corners aren't chopped */
const Column = styled.div`
  overflow: visible;
  position: relative;
`;

const Track = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  animation: ${scrollUp} ${({ $dur }) => $dur}s linear infinite;

  &:hover { animation-play-state: paused; }
`;

const Card = styled.div`
  --rot: ${({ $rot }) => $rot}deg;
  width: ${CARD_W};
  aspect-ratio: 3/4;
  border-radius: 14px;
  overflow: hidden;
  transform: rotate(var(--rot));
  flex-shrink: 0;
  position: relative;
  box-shadow:
    0 6px 20px rgba(0,0,0,0.65),
    0 0 0 1px rgba(255,255,255,0.04),
    0 20px 60px rgba(255,180,0,0.07);
  animation: ${({ $isNew }) => $isNew ? newGlow : "none"} 3s ease-out forwards;

  &[data-dropin="true"] {
    animation:
      ${dropIn} 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards,
      ${newGlow} 3s ease-out 0.3s forwards;
  }
`;

const PhotoImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: contrast(1.03) saturate(1.05);
`;

const Caption = styled.div`
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%);
  padding: 40px 12px 10px;
`;

const GuestName = styled.span`
  display: block;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 600;
  font-size: 0.82rem;
  color: #fff;
  line-height: 1.2;
`;

const TimeStamp = styled.span`
  display: block;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 400;
  font-size: 0.58rem;
  color: rgba(255,255,255,0.38);
  margin-top: 3px;
`;

const Empty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: rgba(255,220,150,0.2);
  font-size: 0.95rem;
  font-weight: 300;
`;

// ── Helpers ──────────────────────────────────────────────────────────────────

function relativeTime(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function toColumns(photos, n) {
  const cols = Array.from({ length: n }, () => []);
  photos.forEach((p, i) => cols[i % n].push(p));
  return cols;
}

// ── Component ────────────────────────────────────────────────────────────────

const LiveWall = ({ eventId, displayToken, useMock = false, bgColor = "#060414" }) => {
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

  if (!loaded) return <Empty>Getting ready…</Empty>;
  if (photos.length === 0) return <Empty>Photos will appear here as guests take them.</Empty>;

  const columns = toColumns(photos, colCount);

  return (
    <>
      <Fonts />
      <WallWrapper>
        <EdgeFade $pos="top"    $bg={bgColor} />
        <EdgeFade $pos="bottom" $bg={bgColor} />
        <Grid>
          {columns.map((colPhotos, ci) => {
            if (colPhotos.length === 0) return null;
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
                      {(photo.guestName || photo.createdAt) && (
                        <Caption>
                          {photo.guestName && <GuestName>{photo.guestName}</GuestName>}
                          {photo.createdAt && <TimeStamp>{relativeTime(photo.createdAt)}</TimeStamp>}
                        </Caption>
                      )}
                    </Card>
                  ))}
                </Track>
              </Column>
            );
          })}
        </Grid>
      </WallWrapper>
    </>
  );
};

export default LiveWall;
