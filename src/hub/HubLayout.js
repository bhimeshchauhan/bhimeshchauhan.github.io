import React from "react";
import { Link } from "gatsby";
import { Helmet } from "react-helmet";
import styled, { createGlobalStyle } from "styled-components";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import { motion, MotionConfig } from "framer-motion";
import { ScrollBar } from "./motion";
import Heart from "./Heart";
import HeartLine from "./HeartLine";
import { HUB, hubPath, rooms } from "./config";
import { sans, display, hand, Wrap, Icon } from "./ui";

// Scoped to the hub: these only exist while a hub page is on screen.
const HubStyle = createGlobalStyle`
  html { scroll-behavior: smooth; background: #090c20; }
  body { background: #090c20; margin: 0; }
  .hub {
    --gold: #e8c26b; --gold2: #f6e3a6; --cream: #f6efdc; --muted: #dfe3f6; --rose: #f0aec3; --teal: #7ccdd3; --night: #070b1f;
    color: var(--cream); font-family: ${sans}; min-height: 100vh; position: relative;
    background: radial-gradient(1200px 600px at 85% -10%, rgba(232, 194, 107, 0.09), transparent 60%), radial-gradient(900px 500px at -10% 30%, rgba(80, 110, 220, 0.12), transparent 60%), #090c20;
    -webkit-font-smoothing: antialiased; overflow-x: clip;
  }
  .hub-dim { background: linear-gradient(180deg, rgba(4, 7, 26, 0.32), rgba(4, 7, 26, 0.2) 45%, rgba(4, 7, 26, 0.4)); inset: 0; pointer-events: none; position: fixed; z-index: 0; }
  .hub-scrim { position: relative; z-index: 0; }
  .hub-scrim::before { background: radial-gradient(closest-side, rgba(4, 7, 26, 0.74), rgba(4, 7, 26, 0.45) 62%, transparent); content: ""; filter: blur(5px); inset: -2.5rem -3.5rem; position: absolute; z-index: -1; }
  @media (max-width: 700px) { .hub-scrim::before { inset: -2rem -0.4rem; } }
  .hub *, .hub *::before, .hub *::after { box-sizing: border-box; }
  .hub a { color: inherit; }
  .hub ::selection { background: rgba(232, 194, 107, 0.4); color: #fff; }
  .hub :focus-visible { outline: 2px solid var(--gold2); outline-offset: 3px; }
  @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
`;

const Top = styled.header`
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: linear-gradient(180deg, rgba(7, 11, 31, 0.82), rgba(7, 11, 31, 0.55));
  border-bottom: 1px solid rgba(232, 194, 107, 0.18);
  position: sticky;
  top: 0;
  z-index: 20;
  .hub-bar { align-items: center; display: flex; gap: 2rem; min-height: 84px; }
  .brand {
    align-items: center; color: var(--gold2); display: inline-flex; flex: none; font-family: ${display}; font-size: 1.5rem; font-weight: 600; letter-spacing: 0.04em; text-decoration: none; white-space: nowrap;
    span { color: var(--rose); font-family: ${hand}; font-size: 1.3em; margin-left: 0.2rem; }
  }
  nav {
    display: flex; flex: 1; gap: 0.5rem; overflow-x: auto; padding: 0.4rem 0; scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
    a:first-child { margin-left: auto; }
    a {
      border-radius: 999px; color: var(--muted); flex: none; font-size: 0.95rem; font-weight: 500; padding: 0.6rem 1.1rem; text-decoration: none; transition: color 0.2s, background 0.2s;
      &:hover { color: #fff; }
      position: relative;
      &[aria-current="page"] { color: var(--gold2); }
      i { background: rgba(232, 194, 107, 0.18); border-radius: 999px; inset: 0; position: absolute; }
      span { position: relative; }
    }
  }
  @media (max-width: 1560px) {
    .hub-bar { flex-wrap: wrap; gap: 0.1rem 1rem; min-height: 0; padding: 0.8rem 0 0.9rem; }
    nav { flex: 1 1 100%; margin: 0 -0.4rem; }
    nav a:first-child { margin-left: 0; }
    nav a { padding: 0.55rem 0.95rem; }
  }
`;

const Main = styled.main`
  position: relative;
  z-index: 2;
`;

// Monet at the bottom: soft pads of colour floating like water lilies.
const Pond = styled.footer`
  margin-top: clamp(3rem, 8vw, 6rem);
  overflow: hidden;
  padding: clamp(3rem, 8vw, 5rem) 0 2.4rem;
  position: relative;
  text-align: center;
  z-index: 1;
  .lily { animation: bob 9s ease-in-out infinite; border-radius: 50%; filter: blur(34px); opacity: 0.5; position: absolute; }
  .l1 { background: #3f8fa0; height: 190px; left: -40px; top: 10px; width: 260px; }
  .l2 { animation-delay: -3s; background: #c58bb4; height: 150px; left: 38%; top: 40px; width: 220px; }
  .l3 { animation-delay: -6s; background: #6f78c8; height: 200px; right: -30px; top: 0; width: 280px; }
  @keyframes bob { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-12px) scale(1.06); } }
  @media (prefers-reduced-motion: reduce) { .lily { animation: none; } }
  .in { position: relative; }
  strong { color: var(--gold2); display: block; font-family: ${display}; font-size: 1.5rem; font-weight: 500; }
  p { color: var(--muted); font-size: 0.9rem; margin: 0.5rem auto 0; max-width: 34rem; }
  .paw { color: var(--rose); display: inline-block; margin-top: 0.8rem; opacity: 0.8; }
`;

export default function HubLayout({ title, description = "A little sky, just for you.", children, current }) {
  return (
    <MotionConfig reducedMotion="user"><div className="hub">
      <HubStyle />
      <Helmet htmlAttributes={{ lang: "en" }}>
        <title>{title ? `${title} · Ash, my star` : "Ash, my star"}</title>
        <meta name="description" content={description} />
        {/* This place is for one person: ask search engines and archives to stay away, and send no referrer from its links. */}
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="googlebot" content="noindex, nofollow, noarchive" />
        <meta name="referrer" content="no-referrer" />
        <meta name="theme-color" content="#070b1f" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..600&family=Caveat:wght@500;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=DM+Sans:opsz,wght@9..40,400..700&display=swap"
        />
      </Helmet>
      <ScrollBar />
      <Top>
        <HeartLine />
        <Wrap style={{ maxWidth: 1560 }}>
          <div className="hub-bar">
            <Link className="brand" to={hubPath("/")}>
              Ash, my star
            </Link>
            <nav aria-label="Rooms">
              <Link to={hubPath("/")} aria-current={current === "home" ? "page" : undefined}>{current === "home" && <motion.i layoutId="navpill" />}<span>Today</span></Link>
              {rooms.map((r) => (
                <Link key={r.key} to={hubPath(r.path)} aria-current={current === r.key ? "page" : undefined}>
                  {current === r.key && <motion.i layoutId="navpill" />}<span>{r.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </Wrap>
      </Top>
      <Main as={motion.main} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>{children}</Main>
      <Pond>
        <span className="lily l1" /><span className="lily l2" /><span className="lily l3" />
        <div className="in">
          <strong>Made for you, Ash. With love</strong>
          <div style={{ margin: "0.7rem 0 0.2rem" }}><Heart size={44} /></div>
          <p>This little sky is just for you. It isn't listed anywhere, but anyone with the link can open it, so keep it between us.</p>
          <span className="paw"><Icon name="paw" size={22} /></span>
        </div>
      </Pond>
    </div></MotionConfig>
  );
}
