import React, { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import Typed from "typed.js";
import styled, { createGlobalStyle, keyframes, css } from "styled-components";
import { getPublicUrl, getSupabaseClient } from "../../components/Photobooth/photoboothProtocol";
import { useEventChannel } from "../../components/Photobooth/useEventChannel";

const Fonts = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,400&family=Caveat:wght@400;600;700&display=swap');
`;

// ── Keyframes ─────────────────────────────────────────────────────────────────

const shimmer = keyframes`
  0%   { background-position: -300% center; }
  100% { background-position:  300% center; }
`;

const dotBlink = keyframes`
  0%,100% { opacity: 1; }
  50%      { opacity: 0.2; }
`;

const photoReveal = keyframes`
  0%   { filter: blur(24px) saturate(0)   brightness(0.2); }
  35%  { filter: blur(10px) saturate(0.2) brightness(0.55); }
  70%  { filter: blur(3px)  saturate(0.7) brightness(0.9); }
  100% { filter: blur(0)    saturate(1)   brightness(1); }
`;

const scanSweep = keyframes`
  from { transform: translateX(-120%); }
  to   { transform: translateX(120%); }
`;

const scanOut = keyframes`
  0%,45% { opacity: 1; }
  100%   { opacity: 0; }
`;

const scrollUp = keyframes`
  from { transform: translateY(0); }
  to   { transform: translateY(-50%); }
`;

const scrollDown = keyframes`
  from { transform: translateY(-50%); }
  to   { transform: translateY(0); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  40%, 60%  { opacity: 1; transform: scale(1) rotate(180deg); }
`;

const cardGloss = keyframes`
  0%   { transform: translateX(-130%) skewX(-18deg); opacity: 0; }
  10%  { opacity: 0.55; }
  60%  { opacity: 0.2; }
  100% { transform: translateX(220%) skewX(-18deg); opacity: 0; }
`;

const cardDrop = keyframes`
  0%   { opacity: 0; transform: rotate(var(--rot)) scale(0.78) translateY(-60px); filter: blur(14px); }
  55%  { opacity: 1; filter: blur(0); transform: rotate(var(--rot)) scale(1.05) translateY(7px); }
  100% { opacity: 1; transform: rotate(var(--rot)) scale(1) translateY(0); }
`;

const newCardGlow = keyframes`
  0%   { box-shadow: 0 0 0 0px rgba(212,175,83,0),   0 20px 55px rgba(0,0,0,0.88), 0 4px 14px rgba(0,0,0,0.55); }
  18%  { box-shadow: 0 0 0 5px rgba(212,175,83,0.65), 0 20px 55px rgba(0,0,0,0.88), 0 4px 14px rgba(0,0,0,0.55); }
  55%  { box-shadow: 0 0 0 3px rgba(212,175,83,0.3),  0 20px 55px rgba(0,0,0,0.88), 0 4px 14px rgba(0,0,0,0.55); }
  100% { box-shadow: 0 20px 55px rgba(0,0,0,0.88),    0 4px 14px rgba(0,0,0,0.55); }
`;

const announceIn = keyframes`
  0%   { transform: translateX(115%) scale(0.88); opacity: 0; }
  9%   { transform: translateX(-8px) scale(1.02); opacity: 1; }
  15%  { transform: translateX(0)    scale(1);    opacity: 1; }
  80%  { transform: translateX(0)    scale(1);    opacity: 1; }
  100% { transform: translateX(115%) scale(0.92); opacity: 0; }
`;

const popBurst = keyframes`
  0%   { transform: scale(0.7); opacity: 0; }
  40%  { transform: scale(1.06); opacity: 1; }
  70%  { transform: scale(0.97); }
  100% { transform: scale(1);    opacity: 1; }
`;

// ── Constants ─────────────────────────────────────────────────────────────────

const BG = "#05050e";

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_PHOTOS = [
  { id: "mp1", guestName: "Carlos",       publicUrl: "https://picsum.photos/seed/ev7/480/480",  text: "¡Felicidades! 💃",   createdAt: new Date(Date.now()-240000).toISOString() },
  { id: "mp2", guestName: "The Nguyens",  publicUrl: "https://picsum.photos/seed/ev3/480/480",  text: null,                 createdAt: new Date(Date.now()-180000).toISOString() },
  { id: "mp3", guestName: "Michelle",     publicUrl: "https://picsum.photos/seed/ev8/480/480",  text: "So honored! 🥂",     createdAt: new Date(Date.now()-90000).toISOString() },
  { id: "mp4", guestName: "Diane & Paul", publicUrl: "https://picsum.photos/seed/ev1/480/480",  text: null,                 createdAt: new Date(Date.now()-30000).toISOString() },
  { id: "mp5", guestName: "Priya",        publicUrl: "https://picsum.photos/seed/ev5/480/480",  text: "Happy 70th! ✨",     createdAt: new Date(Date.now()-15000).toISOString() },
];

const MOCK_MESSAGES = [
  { id: "ms1", guestName: "Sarah M.",   text: "Happiest birthday gorgeous! 70 looks SO good on you!",       createdAt: new Date(Date.now()-320000).toISOString() },
  { id: "ms2", guestName: "Tom & Kate", text: "Here's to the most fabulous woman we know. 70 years young!", createdAt: new Date(Date.now()-210000).toISOString() },
  { id: "ms3", guestName: "Priya",      text: "Dancing with you tonight was pure magic. Happy 70th!",       createdAt: new Date(Date.now()-140000).toISOString() },
  { id: "ms4", guestName: "Carlos",     text: "Felicidades! You inspire everyone around you!",               createdAt: new Date(Date.now()-70000).toISOString() },
  { id: "ms5", guestName: "Nadia",      text: "Here's to 70 more years of dancing and joy!",                createdAt: new Date(Date.now()-20000).toISOString() },
];

// ── Page / Header ─────────────────────────────────────────────────────────────

const Page = styled.div`
  position: fixed; inset: 0; overflow: hidden;
  background: ${BG};
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: flex; flex-direction: column;
`;

const Header = styled.header`
  position: relative; z-index: 10; flex-shrink: 0;
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 36px;
`;

const TitleRow = styled.div`
  display: flex; align-items: baseline; gap: 14px;
`;

const MainTitle = styled.h1`
  font-weight: 800; font-size: clamp(1rem, 1.9vw, 1.55rem);
  margin: 0; letter-spacing: -0.03em;
  background: linear-gradient(110deg, #fff 0%, #e8d9b4 25%, #fff 45%, #d4ba7a 65%, #fff 82%, #e0cf9e 100%);
  background-size: 260% auto;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: ${shimmer} 6s linear infinite;
`;

const TagLine = styled.p`
  font-weight: 300; font-size: 0.68rem;
  color: rgba(210,190,130,0.35); margin: 0; letter-spacing: 0.08em;
`;

const LiveBadge = styled.span`
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
  color: rgba(220,220,220,0.7);
  font-size: 0.52rem; font-weight: 700; letter-spacing: 0.18em;
  text-transform: uppercase; padding: 4px 13px; border-radius: 100px;
`;

const LiveDot = styled.span`
  width: 5px; height: 5px; border-radius: 50%; background: #86d9ba;
  animation: ${dotBlink} 1.2s ease-in-out infinite; display: inline-block;
`;

// ── Canvas ────────────────────────────────────────────────────────────────────

const Canvas = styled.div`
  flex: 1; position: relative; overflow: hidden;
`;

/* Elvie's portrait — full-height background element on the left */
const ElviePortrait = styled.img`
  position: absolute; left: 0; top: 0; bottom: 0; z-index: 1;
  width: 44%; height: 100%;
  object-fit: cover; object-position: 70% 5%;
  display: block;
  filter: contrast(1.04) brightness(0.88) saturate(1.05);
`;

/* Fades Elvie's portrait smoothly into the dark background */
const PortraitBlend = styled.div`
  position: absolute; left: 0; top: 0; bottom: 0; z-index: 2; pointer-events: none;
  width: 56%;
  background: linear-gradient(to right,
    transparent 0%,
    transparent 26%,
    rgba(5,5,14,0.32) 40%,
    rgba(5,5,14,0.80) 54%,
    rgba(5,5,14,0.99) 67%
  );
`;

/* Top + bottom canvas fades */
const VFade = styled.div`
  position: absolute; left: 0; right: 0; z-index: 7; pointer-events: none; height: 90px;
  ${({ $pos }) => $pos === 'top'
    ? `top: 0; background: linear-gradient(to bottom, ${BG} 0%, transparent 100%);`
    : `bottom: 0; background: linear-gradient(to top, ${BG} 0%, transparent 100%);`}
`;

/* Atmospheric color glows replacing disco balls */
const AmbientGlow = styled.div`
  position: absolute; border-radius: 50%; z-index: 0; pointer-events: none;
  filter: blur(${({ $blur }) => $blur}px); opacity: ${({ $op }) => $op};
  background: ${({ $c }) => $c};
`;

/* Twinkling sparkle cross */
const SparkleEl = styled.div`
  position: absolute; z-index: 4; pointer-events: none;
  width: ${({ $s }) => $s}px; height: ${({ $s }) => $s}px;
  animation: ${sparkle} ${({ $dur }) => $dur}s ease-in-out ${({ $delay }) => $delay}s infinite;
  &::before, &::after {
    content: ''; position: absolute;
    background: rgba(255,235,150,0.95); border-radius: 1px;
  }
  &::before { width: 100%; height: 1.5px; top: 50%; left: 0; transform: translateY(-50%); }
  &::after  { width: 1.5px; height: 100%; left: 50%; top: 0; transform: translateX(-50%); }
`;

const SPARKLES = [
  { x: "54%", y: "12%", s: 7,  delay: 0,   dur: 2.8 },
  { x: "70%", y: "6%",  s: 5,  delay: 1.1, dur: 3.3 },
  { x: "76%", y: "32%", s: 6,  delay: 0.5, dur: 2.6 },
  { x: "87%", y: "18%", s: 4,  delay: 1.9, dur: 3.1 },
  { x: "61%", y: "52%", s: 5,  delay: 2.3, dur: 2.7 },
  { x: "92%", y: "45%", s: 7,  delay: 0.7, dur: 3.5 },
  { x: "56%", y: "78%", s: 4,  delay: 1.4, dur: 2.9 },
  { x: "80%", y: "65%", s: 6,  delay: 0.3, dur: 3.2 },
  { x: "94%", y: "82%", s: 5,  delay: 2.0, dur: 2.5 },
  { x: "65%", y: "90%", s: 4,  delay: 1.7, dur: 3.0 },
  { x: "48%", y: "38%", s: 5,  delay: 0.9, dur: 3.4 },
  { x: "83%", y: "88%", s: 3,  delay: 2.6, dur: 2.8 },
];

// ── New photo announcement ────────────────────────────────────────────────────

const AnnouncementWrap = styled.div`
  position: absolute; right: 24px; top: 24px; z-index: 12;
  animation: ${announceIn} 5.2s cubic-bezier(0.22,1,0.36,1) forwards;
`;

const AnnouncementCard = styled.div`
  display: flex; gap: 18px; align-items: center;
  width: min(340px, 32vw);
  background: rgba(6,5,20,0.88);
  backdrop-filter: blur(26px) saturate(1.5);
  border: 1px solid rgba(212,175,83,0.38);
  border-radius: 22px;
  padding: 16px 20px 16px 16px;
  box-shadow:
    0 8px 48px rgba(0,0,0,0.82),
    0 0 0 1px rgba(255,255,255,0.04),
    0 0 60px rgba(212,175,83,0.14);
`;

const AnnounceFrame = styled.div`
  flex-shrink: 0;
  background: #f5ede0;
  padding: 7px 7px 26px;
  border-radius: 2px;
  transform: rotate(-4deg);
  box-shadow: 0 8px 28px rgba(0,0,0,0.65), inset 0 0 0 1px rgba(0,0,0,0.07);
  animation: ${popBurst} 0.5s cubic-bezier(0.22,1,0.36,1) 0.08s both;
`;

const AnnounceImg = styled.img`
  width: 72px; height: 72px;
  object-fit: cover; display: block;
`;

const AnnounceBody = styled.div`
  flex: 1; min-width: 0;
`;

const AnnounceLabel = styled.div`
  font-size: 0.56rem; font-weight: 700; letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(212,175,83,0.75);
  margin-bottom: 5px;
`;

const AnnounceName = styled.div`
  font-family: 'Caveat', cursive; font-weight: 700;
  font-size: clamp(1.3rem, 2vw, 1.7rem);
  color: rgba(255,252,244,0.97); line-height: 1.15;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  margin-bottom: 3px;
`;

const AnnounceMsg = styled.div`
  font-family: 'Caveat', cursive; font-weight: 400;
  font-size: clamp(0.9rem, 1.2vw, 1.1rem);
  color: rgba(212,200,160,0.65); line-height: 1.3;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
`;

// ── Message card ──────────────────────────────────────────────────────────────

const MessageCard = styled.div`
  position: absolute; left: 26px; bottom: 32px; z-index: 8;
  width: min(290px, 28vw);
  background: rgba(6,5,18,0.76);
  backdrop-filter: blur(22px) saturate(1.4);
  border: 1px solid rgba(212,175,83,0.2);
  border-radius: 20px;
  padding: 18px 22px 16px;
  box-shadow:
    0 4px 40px rgba(0,0,0,0.7),
    0 0 0 1px rgba(255,255,255,0.025);
`;

const MsgDots = styled.div`
  display: flex; gap: 5px; margin-bottom: 12px;
`;

const MsgDot = styled.span`
  width: 4px; height: 4px; border-radius: 50%;
  background: ${({ $active }) => $active ? 'rgba(212,175,83,0.8)' : 'rgba(255,255,255,0.15)'};
  transition: background 0.3s;
`;

const MsgFrom = styled.div`
  font-family: 'Caveat', cursive; font-weight: 700; font-size: 0.85rem;
  color: rgba(212,175,83,0.9); margin-bottom: 6px; letter-spacing: 0.03em;
`;

const MsgText = styled.div`
  font-family: 'Caveat', cursive !important;
  font-size: clamp(1.15rem, 1.45vw, 1.38rem);
  font-weight: 400; color: rgba(255,252,244,0.92);
  line-height: 1.52; min-height: 2.8em;
  .typed-cursor {
    font-family: inherit;
    color: rgba(212,175,83,0.7);
    animation: ${dotBlink} 0.7s ease-in-out infinite;
  }
`;

const MsgTime = styled.div`
  font-size: 0.47rem; color: rgba(200,190,160,0.22);
  margin-top: 9px; letter-spacing: 0.08em; text-transform: uppercase;
`;

// ── EtchMessage ───────────────────────────────────────────────────────────────

const EtchMessage = ({ text }) => {
  const elRef = useRef(null);
  useEffect(() => {
    if (!elRef.current || !text) return;
    const typed = new Typed(elRef.current, {
      strings: [text],
      typeSpeed: 38,
      showCursor: true,
      cursorChar: "|",
      onComplete: (self) => { if (self.cursor) self.cursor.style.opacity = "0"; },
    });
    return () => typed.destroy();
  }, [text]);
  return <MsgText ref={elRef} />;
};

// ── Photo wall ────────────────────────────────────────────────────────────────

const PhotoWall = styled.div`
  position: absolute; right: 0; top: 0; bottom: 0;
  left: 38%; z-index: 3;
  /* left-edge fade merges seamlessly with portrait */
  &::before {
    content: ''; position: absolute; top: 0; bottom: 0; left: 0;
    width: 130px; z-index: 5; pointer-events: none;
    background: linear-gradient(to right, ${BG} 0%, transparent 100%);
  }
`;

const PhotoCols = styled.div`
  display: flex; gap: 10px;
  width: 100%; height: 100%;
  padding: 0 32px;
  overflow: visible;
  justify-content: center;
  align-items: stretch;
`;

const PhotoCol = styled.div`
  width: clamp(210px, 17vw, 280px);
  flex-shrink: 0; overflow: visible; height: 100%;
`;

const PhotoTrack = styled.div`
  display: flex; flex-direction: column;
  align-items: center; gap: 18px;
  padding: 50px 0;
  animation: ${({ $dir }) => $dir === "down" ? scrollDown : scrollUp} ${({ $dur }) => $dur}s linear infinite;
  animation-delay: ${({ $delay }) => $delay}s;
`;

const GuestCard = styled.div`
  --rot: ${({ $rot }) => $rot}deg;
  width: 92%; flex-shrink: 0;
  background: ${({ $warm }) => $warm ? '#f5ede0' : '#eef2ee'};
  padding: 10px 10px 56px;
  border-radius: 2px;
  position: relative;
  transform: rotate(var(--rot));
  box-shadow:
    0 20px 55px rgba(0,0,0,0.88),
    0 4px 14px rgba(0,0,0,0.55),
    inset 0 0 0 1px rgba(0,0,0,0.05);
  animation: ${({ $isNew }) => $isNew
    ? css`${cardDrop} 0.65s cubic-bezier(0.22,1,0.36,1) forwards, ${newCardGlow} 3.5s ease-out 0.3s forwards`
    : 'none'};
  overflow: hidden;
  &::before {
    content: ''; pointer-events: none; position: absolute;
    top: 10px; left: 10px; right: 10px; bottom: 56px;
    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.12), inset 0 3px 7px rgba(0,0,0,0.15);
    z-index: 2;
  }
  &::after {
    content: ''; pointer-events: none; position: absolute;
    top: 10px; left: 10px; right: 10px; bottom: 56px;
    background: linear-gradient(108deg, transparent 35%, rgba(255,255,255,0.18) 48%, rgba(255,255,255,0.06) 55%, transparent 65%);
    animation: ${cardGloss} ${({ $glossDur }) => $glossDur || 7}s ease-in-out ${({ $glossDelay }) => $glossDelay || 0}s infinite;
    z-index: 3;
  }
`;

const GuestPhoto = styled.img`
  width: 100%; aspect-ratio: 1/1;
  object-fit: cover; display: block;
  animation: ${({ $gen }) => $gen ? photoReveal : 'none'} 2.6s ease-out forwards;
`;

const ScanOverlay = styled.div`
  position: absolute; top: 10px; left: 10px; right: 10px; bottom: 56px;
  pointer-events: none; overflow: hidden; z-index: 3;
  animation: ${scanOut} 2.6s ease-out forwards;
  background: repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 4px);
  &::after {
    content: ''; position: absolute; top: 0; bottom: 0; width: 35%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
    animation: ${scanSweep} 0.9s ease-in-out 2 forwards;
  }
`;

const GenBadge = styled.div`
  position: absolute; top: 18px; right: 18px; z-index: 4;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(6px);
  border: 1px solid rgba(200,200,200,0.25); color: rgba(220,220,220,0.85);
  font-size: 0.5rem; font-weight: 700; letter-spacing: 0.12em;
  text-transform: uppercase; padding: 3px 9px; border-radius: 100px;
`;

const GuestStrip = styled.div`
  position: absolute; bottom: 0; left: 0; right: 0; height: 56px;
  display: flex; flex-direction: column;
  justify-content: center; align-items: center;
  gap: 2px; padding: 0 12px;
`;

const GuestName = styled.div`
  font-family: 'Caveat', cursive; font-weight: 700;
  font-size: clamp(1.1rem, 1.5vw, 1.45rem);
  color: #1c1c1c; text-align: center; line-height: 1.2;
  max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
`;

const GuestMsg = styled.div`
  font-family: 'Caveat', cursive; font-weight: 400;
  font-size: clamp(0.85rem, 1vw, 1.02rem);
  color: #5e5e5e; text-align: center; line-height: 1.15;
  max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
`;

const EmptyPhotos = styled.div`
  position: absolute; top: 50%; right: 5%; left: 42%; z-index: 5;
  transform: translateY(-50%);
  font-size: 0.85rem; color: rgba(255,255,255,0.1);
  font-style: italic; text-align: center; pointer-events: none;
`;

// ── Star field ────────────────────────────────────────────────────────────────

function seededRand(seed) {
  let s = seed >>> 0;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 0xffffffff; };
}

function starShadow(count, seed, opRange) {
  const r = seededRand(seed);
  return Array.from({ length: count }, () => {
    const x   = (r() * 1920).toFixed(0);
    const y   = (r() * 1080).toFixed(0);
    const op  = (opRange[0] + r() * (opRange[1] - opRange[0])).toFixed(2);
    return `${x}px ${y}px rgba(255,240,195,${op})`;
  }).join(",");
}

/* Pre-compute once — deterministic, no re-render jitter */
const FAR_STARS  = starShadow(240, 42,   [0.12, 0.42]);
const MID_STARS  = starShadow(90,  1337, [0.32, 0.72]);
const NEAR_STARS = starShadow(32,  7777, [0.65, 1.0]);

const StarDot = styled.div`
  position: absolute; top: 0; left: 0; pointer-events: none;
  width: ${({ $sz }) => $sz}px; height: ${({ $sz }) => $sz}px;
  background: rgba(255,240,195,1); border-radius: 50%;
  box-shadow: ${({ $s }) => $s};
  filter: blur(${({ $blur }) => $blur}px);
`;

const DepthGlass = styled.div`
  position: absolute; inset: 0; pointer-events: none;
  background: rgba(5,5,14,${({ $op }) => $op});
`;

// ── Helpers ───────────────────────────────────────────────────────────────────

function relativeTime(iso) {
  const d = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  return `${Math.floor(d / 3600)}h ago`;
}

function getAngle(id = "", col = 0) {
  const s = [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
  const mag = 2 + (s % 6); // 2° – 7°
  // col 0 tilts right, col 1 tilts left — creates a mirrored stagger
  return col === 0 ? mag : -mag;
}

function getGlossDelay(id = "") {
  const s = [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
  return (s % 8) * 0.9; // 0 – 6.3s
}

function getGlossDur(id = "") {
  const s = [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
  return 5.5 + (s % 5); // 5.5 – 9.5s
}

function isWarmCard(id = "") {
  return [...id].reduce((a, c) => a + c.charCodeAt(0), 0) % 2 === 0;
}

function buildColumns(photos, minPerCol = 6) {
  const c0 = photos.filter((_, i) => i % 2 === 0);
  const c1 = photos.filter((_, i) => i % 2 === 1);
  const tile = (col) => {
    if (!col.length) return [];
    const copies = Math.ceil(minPerCol / col.length);
    const exp = [];
    for (let i = 0; i < copies; i++) exp.push(...col);
    return [...exp, ...exp];
  };
  return [tile(c0), tile(c1.length ? c1 : c0)];
}

// ── Component ─────────────────────────────────────────────────────────────────

const DisplayPage = () => {
  const [event, setEvent]          = useState(null);
  const [pageState, setPageState]  = useState("loading");
  const [photos, setPhotos]        = useState([]);
  const [messages, setMessages]    = useState([]);
  const [generatingIds, setGenIds] = useState(new Set());
  const [msgIdx, setMsgIdx]        = useState(0);
  const [msgKey, setMsgKey]        = useState(0);
  const [newIds, setNewIds]        = useState(new Set());
  const [announcement, setAnnouncement] = useState(null);
  const prevMsgLen                 = useRef(0);
  const announceTmr                = useRef(null);

  useEffect(() => {
    if (messages.length < 2) return;
    const id = setInterval(() => {
      setMsgIdx(p => (p + 1) % messages.length);
      setMsgKey(p => p + 1);
    }, 9000);
    return () => clearInterval(id);
  }, [messages.length]);

  useEffect(() => {
    if (messages.length > prevMsgLen.current) {
      prevMsgLen.current = messages.length;
      setMsgIdx(messages.length - 1);
      setMsgKey(p => p + 1);
    }
  }, [messages.length]);

  const markGenerating = useCallback((id) => {
    setGenIds(p => new Set([...p, id]));
    setNewIds(p => new Set([...p, id]));
    setTimeout(() => setGenIds(p => { const s = new Set(p); s.delete(id); return s; }), 2700);
    setTimeout(() => setNewIds(p => { const s = new Set(p); s.delete(id); return s; }), 3500);
  }, []);

  const addPhoto = useCallback((photo) => {
    setPhotos(p => p.some(x => x.id === photo.id) ? p : [photo, ...p]);
    markGenerating(photo.id);
    // Show celebration announcement for live uploads
    setAnnouncement(photo);
    if (announceTmr.current) clearTimeout(announceTmr.current);
    announceTmr.current = setTimeout(() => setAnnouncement(null), 5400);
    if (photo.text) {
      setMessages(p => {
        const mid = `msg-${photo.id}`;
        return p.some(m => m.id === mid) ? p : [...p, {
          id: mid, guestName: photo.guestName, text: photo.text, createdAt: photo.createdAt,
        }];
      });
    }
  }, [markGenerating]);

  const addMessage = useCallback((msg) => {
    setMessages(p => p.some(m => m.id === msg.messageId) ? p : [...p, {
      id: msg.messageId, guestName: msg.guestName, text: msg.message, createdAt: msg.createdAt,
    }]);
  }, []);

  useEventChannel({
    eventId: event?.id, enabled: Boolean(event?.id),
    onPhoto:   (pl) => addPhoto({ id: pl.photoId, guestName: pl.guestName, publicUrl: pl.publicUrl, text: pl.message || null, createdAt: pl.createdAt }),
    onMessage: addMessage,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const eid = new URLSearchParams(window.location.search).get("eid");
    if (!eid) { setPageState("mock"); return; }
    const client = getSupabaseClient();
    if (!client) { setPageState("mock"); return; }

    client.rpc("get_event_by_token", { p_token: eid }).then(({ data, error }) => {
      if (error || !data?.length) { setPageState("error"); return; }
      setEvent(data[0]);
      client.rpc("get_event_photos", { p_token: eid, p_limit: 40 }).then(({ data: pics }) => {
        if (pics) {
          const items = pics.map(p => ({
            id: p.id, guestName: p.guest_name,
            publicUrl: getPublicUrl(p.storage_path), text: p.message || null, createdAt: p.created_at,
          }));
          setPhotos(items);
          setMessages(items.filter(p => p.text).map(p => ({
            id: `msg-${p.id}`, guestName: p.guestName, text: p.text, createdAt: p.createdAt,
          })));
        }
        setPageState("ready");
      });
    });
  }, []);

  useEffect(() => {
    if (pageState === "mock") { setPhotos(MOCK_PHOTOS); setMessages(MOCK_MESSAGES); }
  }, [pageState]);

  const testCounterRef = useRef(0);
  const fireTestPhoto = useCallback(() => {
    const seeds = ["abc", "def", "ghi", "jkl", "mno", "pqr"];
    const names = ["Sarah M.", "Tom & Kate", "Carlos", "Priya", "Michelle", "The Nguyens"];
    const msgs  = ["Cheers! 🥂", "Happy 70th! ✨", null, "Love you Elvie! 💛", null, "¡Felicidades! 🎉"];
    const i = testCounterRef.current % seeds.length;
    testCounterRef.current += 1;
    addPhoto({
      id: `test-${Date.now()}`,
      guestName: names[i],
      publicUrl: `https://picsum.photos/seed/${seeds[i]}${testCounterRef.current}/480/480`,
      text: msgs[i],
      createdAt: new Date().toISOString(),
    });
  }, [addPhoto]);

  const currentMsg = messages[msgIdx] ?? null;
  const columns    = buildColumns(photos);
  const dur0       = Math.max(72, photos.length * 14);
  const dur1       = Math.max(100, photos.length * 20);

  return (
    <>
      <Fonts />
      <Helmet title="Sweet Seventy, Elvie! 🪩" />
      <Page>
        <Header>
          <TitleRow>
            <span style={{ fontSize: "1.25rem", filter: "drop-shadow(0 0 9px rgba(200,200,200,0.5))" }}>🪩</span>
            <MainTitle>Sweet Seventy, Elvie!</MainTitle>
            <TagLine>Every moment, captured live ✦</TagLine>
          </TitleRow>
          {(pageState === "mock" || event?.active) && (
            <LiveBadge><LiveDot />Live</LiveBadge>
          )}
        </Header>

        <Canvas>
          {/* ── 3D star field: 3 depth layers with glass fog between ── */}
          <StarDot $sz={1}   $s={FAR_STARS}  $blur={0.9} />  {/* far: tiny, slightly blurred */}
          <DepthGlass $op={0.14} />                           {/* glass fog depth 1 */}
          <StarDot $sz={1.5} $s={MID_STARS}  $blur={0} />    {/* mid: crisp, medium */}
          <DepthGlass $op={0.10} />                           {/* glass fog depth 2 */}
          <StarDot $sz={2}   $s={NEAR_STARS} $blur={0} />    {/* near: bright, sharp */}
          <StarDot $sz={2}   $s={NEAR_STARS} $blur={4} style={{ opacity: 0.35 }} /> {/* near glow halo */}

          {/* Elvie's portrait — full-height background element */}
          <ElviePortrait src="/elvie.jpeg" alt="" />
          <PortraitBlend />

          {/* Atmospheric color glows */}
          <AmbientGlow $c="rgba(140,100,220,0.3)" $blur={120} $op={1}
            style={{ width: 520, height: 520, top: "-80px", left: "28%" }} />
          <AmbientGlow $c="rgba(220,170,60,0.15)" $blur={100} $op={1}
            style={{ width: 380, height: 380, bottom: "-60px", right: "8%" }} />

          {/* Glimmer sparkles */}
          {SPARKLES.map((sp, i) => (
            <SparkleEl key={i} $s={sp.s} $dur={sp.dur} $delay={sp.delay}
              style={{ left: sp.x, top: sp.y }} />
          ))}

          <VFade $pos="top" />
          <VFade $pos="bottom" />

          {/* New photo announcement — slides in top-right */}
          {announcement && (
            <AnnouncementWrap key={announcement.id}>
              <AnnouncementCard>
                <AnnounceFrame>
                  <AnnounceImg src={announcement.publicUrl} alt="" />
                </AnnounceFrame>
                <AnnounceBody>
                  <AnnounceLabel>✦ just joined the wall</AnnounceLabel>
                  <AnnounceName>{announcement.guestName || "A guest"}</AnnounceName>
                  {announcement.text
                    ? <AnnounceMsg>"{announcement.text}"</AnnounceMsg>
                    : <AnnounceMsg style={{ opacity: 0.35 }}>added a photo ✨</AnnounceMsg>
                  }
                </AnnounceBody>
              </AnnouncementCard>
            </AnnouncementWrap>
          )}

          {/* Message card — floating bottom-left over portrait */}
          <MessageCard>
            {messages.length > 1 && (
              <MsgDots>
                {messages.map((_, i) => <MsgDot key={i} $active={i === msgIdx} />)}
              </MsgDots>
            )}
            {currentMsg ? (
              <>
                <MsgFrom>— {currentMsg.guestName}</MsgFrom>
                <EtchMessage key={msgKey} text={currentMsg.text} />
                <MsgTime>{relativeTime(currentMsg.createdAt)}</MsgTime>
              </>
            ) : (
              <MsgText style={{ color: "rgba(200,190,160,0.2)", fontSize: "1.05rem", minHeight: "auto", fontStyle: "italic" }}>
                Guest messages will appear here…
              </MsgText>
            )}
          </MessageCard>

          {/* Scrolling Polaroid wall */}
          {photos.length === 0 ? (
            <EmptyPhotos>Photos will appear here as guests take them.</EmptyPhotos>
          ) : (
            <PhotoWall>
              <PhotoCols>
                {[0, 1].map(ci => (
                  <PhotoCol key={ci}>
                    <PhotoTrack
                      $dur={ci === 0 ? dur0 : dur1}
                      $delay={ci === 0 ? 0 : -(dur1 * 0.5)}
                      $dir={ci === 0 ? "up" : "down"}
                    >
                      {columns[ci].map((photo, idx) => {
                        const half = columns[ci].length / 2;
                        const isNew = newIds.has(photo.id) && idx < half;
                        const isGen = generatingIds.has(photo.id) && idx < half;
                        return (
                          <GuestCard
                            key={`${photo.id}-${ci}-${idx}`}
                            $rot={getAngle(photo.id, ci)}
                            $warm={isWarmCard(photo.id)}
                            $isNew={isNew}
                            $glossDelay={getGlossDelay(photo.id)}
                            $glossDur={getGlossDur(photo.id)}
                          >
                            <GuestPhoto src={photo.publicUrl} alt={photo.guestName ?? "photo"} $gen={isGen} />
                            {isGen && <ScanOverlay />}
                            {isGen && <GenBadge>⚡ Capturing…</GenBadge>}
                            <GuestStrip>
                              {photo.guestName && <GuestName>{photo.guestName}</GuestName>}
                              {photo.text      && <GuestMsg>{photo.text}</GuestMsg>}
                            </GuestStrip>
                          </GuestCard>
                        );
                      })}
                    </PhotoTrack>
                  </PhotoCol>
                ))}
              </PhotoCols>
            </PhotoWall>
          )}
          {/* Test button — remove before event */}
          <button
            onClick={fireTestPhoto}
            style={{
              position: "absolute", bottom: 20, right: 20, zIndex: 20,
              background: "rgba(212,175,83,0.15)", border: "1px solid rgba(212,175,83,0.4)",
              color: "rgba(212,175,83,0.9)", borderRadius: 10, padding: "8px 18px",
              fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em",
              cursor: "pointer", backdropFilter: "blur(10px)",
            }}
          >
            + Test photo
          </button>
        </Canvas>
      </Page>
    </>
  );
};

export default DisplayPage;
