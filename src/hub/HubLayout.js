import React from "react";
import { Link } from "gatsby";
import { Helmet } from "react-helmet";
import styled, { createGlobalStyle } from "styled-components";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import SkyCanvas from "./SkyCanvas";
import { HUB, hubPath, rooms } from "./config";
import { sans, display, hand, Wrap, Icon } from "./ui";

// Scoped to the hub: these only exist while a hub page is on screen.
const HubStyle = createGlobalStyle`
  html { scroll-behavior: smooth; background: #070b1f; }
  body { background: #070b1f; margin: 0; }
  .hub {
    --gold: #e8c26b; --gold2: #f6e3a6; --cream: #f6efdc; --muted: #c4c9e2; --rose: #f0aec3; --teal: #7ccdd3; --night: #070b1f;
    color: var(--cream); font-family: ${sans}; min-height: 100vh; position: relative;
    -webkit-font-smoothing: antialiased;
  }
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
  .hub-bar { align-items: center; display: flex; gap: 1.2rem; min-height: 60px; }
  .brand {
    color: var(--gold2); flex: none; font-family: ${display}; font-size: 1.35rem; font-weight: 600; letter-spacing: 0.08em; text-decoration: none; white-space: nowrap;
    span { color: var(--rose); font-family: ${hand}; font-size: 1.3em; margin-left: 0.2rem; }
  }
  nav {
    display: flex; flex: 1; gap: 0.2rem; overflow-x: auto; padding: 0.3rem 0; scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
    a {
      border-radius: 999px; color: var(--muted); flex: none; font-size: 0.86rem; font-weight: 500; padding: 0.45rem 0.85rem; text-decoration: none; transition: color 0.2s, background 0.2s;
      &:hover { color: #fff; }
      &[aria-current="page"] { background: rgba(232, 194, 107, 0.16); color: var(--gold2); }
    }
  }
`;

const Main = styled.main`
  position: relative;
  z-index: 1;
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
    <div className="hub">
      <HubStyle />
      <Helmet htmlAttributes={{ lang: "en" }}>
        <title>{title ? `${title} · For Ash` : "For Ash"}</title>
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
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&display=swap"
        />
      </Helmet>
      <SkyCanvas />
      <Top>
        <Wrap>
          <div className="hub-bar">
            <Link className="brand" to={hubPath("/")}>
              FOR ASH<span>♡</span>
            </Link>
            <nav aria-label="Rooms">
              <Link to={hubPath("/")} aria-current={current === "home" ? "page" : undefined}>Home</Link>
              {rooms.map((r) => (
                <Link key={r.key} to={hubPath(r.path)} aria-current={current === r.key ? "page" : undefined}>
                  {r.title}
                </Link>
              ))}
            </nav>
          </div>
        </Wrap>
      </Top>
      <Main>{children}</Main>
      <Pond>
        <span className="lily l1" /><span className="lily l2" /><span className="lily l3" />
        <div className="in">
          <strong>Made for you, Ash. With love ♡</strong>
          <p>This little sky is just for you. It isn't listed anywhere, but anyone with the link can open it, so keep it between us.</p>
          <span className="paw"><Icon name="paw" size={22} /></span>
        </div>
      </Pond>
    </div>
  );
}
