import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { getSupabaseClient } from "../../components/Photobooth/photoboothProtocol";
import LiveWall from "../../components/Photobooth/LiveWall";

const Fonts = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
`;

// ── Background animations ───────────────────────────────────────────────────

const floatUp = keyframes`
  0%   { transform: translateY(0)   rotate(0deg)   scale(1);   opacity: 0.7; }
  50%  { transform: translateY(-45vh) rotate(180deg) scale(1.1); opacity: 0.5; }
  100% { transform: translateY(-95vh) rotate(360deg) scale(0.8); opacity: 0; }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.4); }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;

// ── Confetti particles (deterministic positions to avoid SSR mismatch) ───────
const PARTICLES = [
  { left: "5%",  size: 6,  delay: 0,   dur: 18, color: "#d4a843" },
  { left: "12%", size: 4,  delay: 2,   dur: 22, color: "#c8a96e" },
  { left: "20%", size: 8,  delay: 5,   dur: 16, color: "#f5d483" },
  { left: "28%", size: 5,  delay: 1,   dur: 20, color: "#e8c97a" },
  { left: "35%", size: 7,  delay: 8,   dur: 24, color: "#d4a843" },
  { left: "42%", size: 3,  delay: 3,   dur: 17, color: "#fff0a0" },
  { left: "50%", size: 6,  delay: 11,  dur: 19, color: "#c8a96e" },
  { left: "58%", size: 4,  delay: 6,   dur: 21, color: "#f5d483" },
  { left: "65%", size: 8,  delay: 0,   dur: 23, color: "#d4a843" },
  { left: "72%", size: 5,  delay: 9,   dur: 18, color: "#fff0a0" },
  { left: "80%", size: 7,  delay: 4,   dur: 20, color: "#e8c97a" },
  { left: "88%", size: 3,  delay: 13,  dur: 25, color: "#c8a96e" },
  { left: "93%", size: 6,  delay: 7,   dur: 17, color: "#f5d483" },
  { left: "97%", size: 4,  delay: 2,   dur: 22, color: "#d4a843" },
  { left: "8%",  size: 5,  delay: 15,  dur: 19, color: "#fff0a0" },
  { left: "45%", size: 7,  delay: 10,  dur: 21, color: "#e8c97a" },
  { left: "75%", size: 4,  delay: 14,  dur: 16, color: "#c8a96e" },
  { left: "55%", size: 6,  delay: 12,  dur: 24, color: "#d4a843" },
];

// ── Styled components ────────────────────────────────────────────────────────

const Page = styled.div`
  min-height: 100vh;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(80, 30, 120, 0.35) 0%, transparent 60%),
    radial-gradient(ellipse at 75% 80%, rgba(120, 60, 20, 0.3) 0%, transparent 55%),
    radial-gradient(ellipse at 60% 40%, rgba(180, 130, 20, 0.08) 0%, transparent 50%),
    linear-gradient(160deg, #0f0820 0%, #1a0f2e 35%, #0d1520 65%, #150d1a 100%);
  position: relative;
  overflow-x: hidden;
`;

const ParticleLayer = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
`;

const Particle = styled.span`
  position: absolute;
  bottom: -20px;
  left: ${({ $left }) => $left};
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  animation: ${floatUp} ${({ $dur }) => $dur}s linear infinite;
  animation-delay: -${({ $delay }) => $delay}s;
  box-shadow: 0 0 ${({ $size }) => $size * 2}px ${({ $color }) => $color};
`;

const Star = styled.span`
  position: absolute;
  font-size: ${({ $size }) => $size}px;
  animation: ${twinkle} ${({ $dur }) => $dur}s ease-in-out infinite;
  animation-delay: -${({ $delay }) => $delay}s;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
`;

const STARS = [
  { top: "8%",  left: "3%",  size: 14, dur: 2.5, delay: 0 },
  { top: "15%", left: "92%", size: 10, dur: 3.2, delay: 1 },
  { top: "25%", left: "7%",  size: 8,  dur: 2.8, delay: 0.5 },
  { top: "5%",  left: "50%", size: 12, dur: 3.5, delay: 1.5 },
  { top: "18%", left: "75%", size: 10, dur: 2.2, delay: 0.8 },
  { top: "30%", left: "88%", size: 8,  dur: 3.0, delay: 2 },
  { top: "10%", left: "35%", size: 6,  dur: 2.6, delay: 0.3 },
];

const Content = styled.div`
  position: relative;
  z-index: 1;
`;

const Header = styled.header`
  text-align: center;
  padding: 48px 24px 32px;
`;

const Crown = styled.div`
  font-size: 2.8rem;
  margin-bottom: 8px;
  filter: drop-shadow(0 0 12px rgba(212, 168, 67, 0.7));
`;

const BirthdayTitle = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  margin: 0 0 8px;
  background: linear-gradient(135deg, #f5d483 0%, #d4a843 40%, #ffe0a0 70%, #c8913a 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 4s linear infinite;
  text-shadow: none;
  line-height: 1.15;
`;

const Subtitle = styled.p`
  font-family: 'Dancing Script', cursive;
  font-size: clamp(1.2rem, 2.5vw, 1.8rem);
  color: rgba(245, 212, 131, 0.7);
  margin: 0 0 20px;
`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.5);
  color: #fca5a5;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 100px;
  font-family: 'Playfair Display', serif;
`;

const LiveDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ef4444;
  animation: ${twinkle} 1s ease-in-out infinite;
  display: inline-block;
`;

const Divider = styled.div`
  width: 160px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(212,168,67,0.4), transparent);
  margin: 0 auto 8px;
`;

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  font-family: 'Playfair Display', serif;
  font-style: italic;
  color: rgba(255, 255, 255, 0.35);
  font-size: 1.1rem;
`;

// ── Component ────────────────────────────────────────────────────────────────

const DisplayPage = () => {
  const [token, setToken] = useState(null);
  const [event, setEvent] = useState(null);
  const [pageState, setPageState] = useState("loading");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const eid = params.get("eid");

    // No token → show mock preview for design purposes
    if (!eid) {
      setPageState("mock");
      return;
    }
    setToken(eid);

    const client = getSupabaseClient();
    if (!client) { setPageState("mock"); return; }

    client.rpc("get_event_by_token", { p_token: eid }).then(({ data, error }) => {
      if (error || !data || data.length === 0) { setPageState("error"); return; }
      setEvent(data[0]);
      setPageState("ready");
    });
  }, []);

  const isMock = pageState === "mock";
  const isReady = pageState === "ready" || isMock;

  return (
    <>
      <Fonts />
      <Helmet title="Happy 70th, LB! 🎂" />
      <Page>
        {mounted && (
          <ParticleLayer>
            {PARTICLES.map((p, i) => (
              <Particle key={i} $left={p.left} $size={p.size} $delay={p.delay} $dur={p.dur} $color={p.color} />
            ))}
            {STARS.map((s, i) => (
              <Star key={i} $top={s.top} $left={s.left} $size={s.size} $dur={s.dur} $delay={s.delay}>✦</Star>
            ))}
          </ParticleLayer>
        )}

        <Content>
          {pageState === "loading" && <Center>Loading…</Center>}
          {pageState === "error" && <Center>Event not found.</Center>}

          {isReady && (
            <>
              <Header>
                <Crown>👑</Crown>
                <BirthdayTitle>Happy 70th Birthday, LB!</BirthdayTitle>
                <Subtitle>Capturing every beautiful moment, live</Subtitle>
                <Divider />
                <BadgeRow>
                  {(isMock || event?.active) && (
                    <LiveBadge><LiveDot />Live</LiveBadge>
                  )}
                </BadgeRow>
              </Header>

              <LiveWall
                eventId={event?.id}
                displayToken={token}
                useMock={isMock}
              />
            </>
          )}
        </Content>
      </Page>
    </>
  );
};

export default DisplayPage;
