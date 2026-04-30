import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { getSupabaseClient } from "../../components/Photobooth/photoboothProtocol";
import LiveWall from "../../components/Photobooth/LiveWall";

const Fonts = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');
`;

// ── Animations ───────────────────────────────────────────────────────────────

const sparkle = keyframes`
  0%,100% { opacity: 0;   transform: scale(0.5) rotate(0deg);   }
  50%      { opacity: 1;   transform: scale(1.2) rotate(180deg); }
`;

const floatUp = keyframes`
  0%   { transform: translateY(0)    rotate(0deg);   opacity: 0.8; }
  100% { transform: translateY(-100vh) rotate(360deg); opacity: 0;   }
`;

const shimmer = keyframes`
  0%   { background-position: -300% center; }
  100% { background-position:  300% center; }
`;

const spin = keyframes`
  from { transform: rotateY(0deg); }
  to   { transform: rotateY(360deg); }
`;

const pulse = keyframes`
  0%,100% { opacity: 0.6; transform: scale(1); }
  50%      { opacity: 1;   transform: scale(1.05); }
`;

// ── Disco confetti — silver/white/light-blue palette ─────────────────────────

const PARTICLES = [
  { left: "4%",  size: 5,  delay: 0,  dur: 14, color: "#e8e8e8" },
  { left: "10%", size: 3,  delay: 3,  dur: 18, color: "#c0c0c0" },
  { left: "18%", size: 6,  delay: 7,  dur: 12, color: "#ffffff" },
  { left: "25%", size: 4,  delay: 1,  dur: 16, color: "#b0d4f8" },
  { left: "33%", size: 7,  delay: 5,  dur: 20, color: "#e8e8e8" },
  { left: "40%", size: 3,  delay: 11, dur: 15, color: "#d0d0d0" },
  { left: "48%", size: 5,  delay: 2,  dur: 17, color: "#ffffff" },
  { left: "55%", size: 4,  delay: 8,  dur: 13, color: "#c0c0c0" },
  { left: "62%", size: 6,  delay: 0,  dur: 19, color: "#b0d4f8" },
  { left: "70%", size: 3,  delay: 6,  dur: 16, color: "#e8e8e8" },
  { left: "77%", size: 5,  delay: 13, dur: 14, color: "#ffffff" },
  { left: "84%", size: 7,  delay: 4,  dur: 21, color: "#c0c0c0" },
  { left: "91%", size: 4,  delay: 9,  dur: 15, color: "#d0d0d0" },
  { left: "96%", size: 3,  delay: 14, dur: 18, color: "#b0d4f8" },
  { left: "7%",  size: 6,  delay: 10, dur: 16, color: "#ffffff" },
  { left: "52%", size: 4,  delay: 12, dur: 20, color: "#e8e8e8" },
  { left: "80%", size: 5,  delay: 2,  dur: 13, color: "#c0c0c0" },
  { left: "30%", size: 3,  delay: 15, dur: 17, color: "#b0d4f8" },
];

const SPARKLES = [
  { top: "6%",  left: "2%",  dur: 2.1, delay: 0 },
  { top: "12%", left: "94%", dur: 2.7, delay: 0.8 },
  { top: "4%",  left: "48%", dur: 1.9, delay: 1.5 },
  { top: "20%", left: "8%",  dur: 3.0, delay: 0.3 },
  { top: "16%", left: "78%", dur: 2.4, delay: 1.1 },
  { top: "8%",  left: "62%", dur: 2.2, delay: 0.6 },
  { top: "25%", left: "90%", dur: 2.8, delay: 1.8 },
  { top: "3%",  left: "25%", dur: 1.8, delay: 0.4 },
];

// ── Styled components ─────────────────────────────────────────────────────────

const Page = styled.div`
  min-height: 100vh;
  background:
    radial-gradient(ellipse at 50% 0%,   rgba(180,180,200,0.12) 0%, transparent 55%),
    radial-gradient(ellipse at 20% 60%,  rgba(100,120,160,0.10) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%,  rgba(120,100,160,0.08) 0%, transparent 50%),
    linear-gradient(180deg, #050508 0%, #0a0a10 40%, #080810 100%);
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
  bottom: -10px;
  left: ${({ $left }) => $left};
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 2px;
  background: ${({ $color }) => $color};
  animation: ${floatUp} ${({ $dur }) => $dur}s linear infinite;
  animation-delay: -${({ $delay }) => $delay}s;
  box-shadow: 0 0 6px ${({ $color }) => $color};
  opacity: 0.85;
`;

const Sparkle = styled.span`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  font-size: 18px;
  color: #fff;
  text-shadow: 0 0 8px #fff, 0 0 16px rgba(180,200,255,0.8);
  animation: ${sparkle} ${({ $dur }) => $dur}s ease-in-out infinite;
  animation-delay: -${({ $delay }) => $delay}s;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 14px 32px;
`;

const DiscoBall = styled.div`
  font-size: 1.6rem;
  display: inline-block;
  filter: drop-shadow(0 0 10px rgba(200,220,255,0.8));
  animation: ${pulse} 2s ease-in-out infinite;
  flex-shrink: 0;
`;

const MainTitle = styled.h1`
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: clamp(1.2rem, 2.4vw, 2rem);
  margin: 0;
  background: linear-gradient(
    135deg,
    #ffffff 0%,
    #d0d0d0 20%,
    #ffffff 40%,
    #a8c4e0 55%,
    #ffffff 70%,
    #c8c8c8 85%,
    #ffffff 100%
  );
  background-size: 300% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 3s linear infinite;
  line-height: 1.2;
  white-space: nowrap;
`;

const TagLine = styled.p`
  font-family: 'Dancing Script', cursive;
  font-size: clamp(0.85rem, 1.4vw, 1.1rem);
  color: rgba(200, 215, 240, 0.5);
  margin: 0;
  white-space: nowrap;
`;

const Divider = styled.div`display: none;`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const LiveBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(200,220,255,0.07);
  border: 1px solid rgba(200,220,255,0.25);
  color: rgba(200,220,255,0.85);
  font-family: 'Playfair Display', serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 5px 16px;
  border-radius: 100px;
`;

const LiveDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #a0c4ff;
  box-shadow: 0 0 6px #a0c4ff;
  animation: ${sparkle} 1s ease-in-out infinite;
  display: inline-block;
`;

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  font-family: 'Playfair Display', serif;
  font-style: italic;
  color: rgba(200,210,240,0.3);
  font-size: 1.1rem;
`;

// ── Component ─────────────────────────────────────────────────────────────────

const DisplayPage = () => {
  const [token, setToken]       = useState(null);
  const [event, setEvent]       = useState(null);
  const [pageState, setPageState] = useState("loading");
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const eid = params.get("eid");

    if (!eid) { setPageState("mock"); return; }
    setToken(eid);

    const client = getSupabaseClient();
    if (!client) { setPageState("mock"); return; }

    client.rpc("get_event_by_token", { p_token: eid }).then(({ data, error }) => {
      if (error || !data || data.length === 0) { setPageState("error"); return; }
      setEvent(data[0]);
      setPageState("ready");
    });
  }, []);

  const isMock  = pageState === "mock";
  const isReady = pageState === "ready" || isMock;

  return (
    <>
      <Fonts />
      <Helmet title="Sweet Seventy, Elvie! 🪩" />
      <Page>
        {mounted && (
          <ParticleLayer>
            {PARTICLES.map((p, i) => (
              <Particle key={i} $left={p.left} $size={p.size} $delay={p.delay} $dur={p.dur} $color={p.color} />
            ))}
            {SPARKLES.map((s, i) => (
              <Sparkle key={i} $top={s.top} $left={s.left} $dur={s.dur} $delay={s.delay}>✦</Sparkle>
            ))}
          </ParticleLayer>
        )}

        <Content>
          {pageState === "loading" && <Center>Loading…</Center>}
          {pageState === "error"   && <Center>Event not found.</Center>}

          {isReady && (
            <>
              <Header>
                <DiscoBall>🪩</DiscoBall>
                <MainTitle>Sweet Seventy, Elvie!</MainTitle>
                <TagLine>Every moment, captured live ✦</TagLine>
                {(isMock || event?.active) && (
                  <BadgeRow><LiveBadge><LiveDot />Live</LiveBadge></BadgeRow>
                )}
              </Header>

              <LiveWall eventId={event?.id} displayToken={token} useMock={isMock} />
            </>
          )}
        </Content>
      </Page>
    </>
  );
};

export default DisplayPage;
