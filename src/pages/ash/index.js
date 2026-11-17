import React from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import HubLayout from "../../hub/HubLayout";
import RagaNow from "../../hub/RagaNow";
import Countdown from "../../hub/Countdown";
import { hubPath, rooms } from "../../hub/config";
import { Wrap, Eyebrow, H1, H2, H3, Lede, Hand, Card, Grid, Section, Reveal, Icon, ButtonLink, Rule, display, glass } from "../../hub/ui";

const Hero = styled.section`
  align-items: center;
  display: flex;
  min-height: calc(100vh - 60px);
  padding: clamp(2rem, 8vw, 5rem) 0 clamp(3rem, 8vw, 5rem);
  .cue { color: var(--gold2); display: inline-block; font-size: 0.85rem; letter-spacing: 0.16em; margin-top: 2.2rem; text-decoration: none; text-transform: uppercase; }
  .cue span { animation: drift 2.4s ease-in-out infinite; display: inline-block; margin-left: 0.5rem; }
  @keyframes drift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
  @media (prefers-reduced-motion: reduce) { .cue span { animation: none; } }
`;

const Line = styled.span`
  display: block;
  overflow: hidden;
  padding-bottom: 0.08em;
  > span { animation: up 1s cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: ${(p) => p.delay || 0}s; display: block; }
  @keyframes up { from { opacity: 0; transform: translateY(105%); } }
  @media (prefers-reduced-motion: reduce) { > span { animation: none; } }
`;

const Room = styled(Link)`
  ${glass}
  color: inherit;
  display: block;
  padding: 1.3rem 1.3rem 1.4rem;
  text-decoration: none;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  &:hover { border-color: rgba(246, 227, 166, 0.7); box-shadow: 0 14px 50px rgba(232, 194, 107, 0.18); transform: translateY(-4px); }
  .ic { color: var(--gold); display: block; margin-bottom: 0.9rem; }
  h3 { font-family: ${display}; font-size: 1.6rem; font-weight: 600; margin: 0 0 0.4rem; }
  p { color: var(--muted); font-size: 0.95rem; line-height: 1.55; margin: 0; }
  .go { color: var(--gold2); display: inline-block; font-size: 0.84rem; font-weight: 600; margin-top: 0.9rem; }
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  justify-content: center;
  span {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(232, 194, 107, 0.28);
    border-radius: 999px;
    color: var(--cream);
    font-size: 0.95rem;
    padding: 0.5rem 1rem;
  }
`;

const loves = ["🥾 Hiking", "🎻 Violin (new!)", "🎶 Indian classical", "🎿 Skiing (new!)", "🥊 Boxing (new!)", "🎨 Painting", "📚 Books", "🎬 Movies", "👻 Horror, especially", "🐈 Cats, obviously", "🌌 Van Gogh", "🪷 Monet", "✨ Klimt"];

export default function HubHome() {
  return (
    <HubLayout current="home" title="Home">
      <Wrap>
        <Hero>
          <div>
            <Eyebrow>A little sky for Ash ♡</Eyebrow>
            <H1>
              <Line delay={0.1}><span>My psych baby!</span></Line>
              <Line delay={0.28}><span><em>I'm psyched for you.</em></span></Line>
            </H1>
            <Lede>
              Okay, I had to. I got a little carried away and built you a whole night sky. The career homework is ready, the art is on its way, and there's a cat hiding in the stars. Wander wherever you like. I'm not grading any of it.
            </Lede>
            <ButtonLink href="#rooms">Step inside ✦</ButtonLink>
            <br />
            <a className="cue" href="#tonight">Or see what the sky says tonight<span aria-hidden="true">↓</span></a>
          </div>
        </Hero>

        <Section id="tonight">
          <Reveal>
            <Eyebrow>Tonight</Eyebrow>
            <H2>Look up, there's a lot going on.</H2>
          </Reveal>
          <Grid cols={2}>
            <Reveal><RagaNow /></Reveal>
            <Reveal delay={0.1}>
              <Card>
                <Eyebrow>Something hidden</Eyebrow>
                <H3>There's a cat in the sky</H3>
                <p>Bottom left, in the stars: two ears, two eyes, one very smug face. Found her yet? <Hand>She says hi.</Hand></p>
                <p>If you want to catch her properly, there's a game for that.</p>
                <ButtonLink as={Link} to={hubPath("/games/")}>Find the cat 🐈</ButtonLink>
              </Card>
            </Reveal>
          </Grid>
          <Reveal><div style={{ marginTop: "1.2rem" }}><Countdown /></div></Reveal>
        </Section>

        <Rule />

        <Section id="rooms">
          <Reveal>
            <Eyebrow>The rooms</Eyebrow>
            <H2>Pick a star.</H2>
            <Lede>Each one opens a little room. Start with whatever you're in the mood for.</Lede>
          </Reveal>
          <Grid cols={4}>
            {rooms.map((r, i) => (
              <Reveal key={r.key} delay={(i % 4) * 0.07}>
                <Room to={hubPath(r.path)}>
                  <span className="ic"><Icon name={r.icon} size={30} /></span>
                  <h3>{r.title}</h3>
                  <p>{r.blurb}</p>
                  <span className="go">Open →</span>
                </Room>
              </Reveal>
            ))}
          </Grid>
        </Section>

        <Rule />

        <Section>
          <Reveal>
            <Eyebrow style={{ textAlign: "center" }}>I've been paying attention</Eyebrow>
            <H2 style={{ textAlign: "center" }}>A few of my favourite things about you.</H2>
            <Chips>{loves.map((l) => <span key={l}>{l}</span>)}</Chips>
            <p style={{ color: "var(--muted)", margin: "1.6rem auto 0", maxWidth: "36rem", textAlign: "center", lineHeight: 1.65 }}>
              The sky is painted in the spirit of Van Gogh. The gold edges are for Klimt, and the soft water light at the very bottom is Monet's. <Hand>It's all yours.</Hand>
            </p>
          </Reveal>
        </Section>
      </Wrap>
    </HubLayout>
  );
}
