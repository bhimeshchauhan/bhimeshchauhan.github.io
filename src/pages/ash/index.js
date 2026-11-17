import React, { useEffect, useState } from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import { motion } from "framer-motion";
import HubLayout from "../../hub/HubLayout";
import { useRaga, RagaCard, RagaPanel } from "../../hub/RagaNow";
import Heart from "../../hub/Heart";
import { ArtHero, Stagger, Item, CountUp } from "../../hub/motion";
import { artworks, ofTheDay, byId } from "../../hub/artworks";
import { upcoming, daysUntil } from "../../hub/career/deadlines";
import { hubPath, rooms } from "../../hub/config";
import { Wrap, Eyebrow, H1, H2, H3, Card, Grid, Section, Hand, display } from "../../hub/ui";

const RoomCard = styled(motion.create(Link))`
  border-radius: 18px; color: inherit; display: block; min-height: 190px; overflow: hidden; position: relative; text-decoration: none;
  .bg { background-size: cover; inset: 0; position: absolute; }
  .shade { background: linear-gradient(180deg, rgba(7, 10, 28, 0.15), rgba(7, 10, 28, 0.88)); inset: 0; position: absolute; }
  .t { bottom: 0; left: 0; padding: 1.1rem; position: absolute; right: 0; }
  h3 { font-family: ${display}; font-size: 1.7rem; font-weight: 600; margin: 0 0 0.2rem; }
  p { color: #e6e9f7; font-size: 0.9rem; line-height: 1.45; margin: 0; }
  border: 1px solid rgba(232, 194, 107, 0.3);
`;
const Hero = styled.div`
  align-items: center; display: flex; gap: clamp(1.5rem, 5vw, 4rem); justify-content: space-between;
  @media (max-width: 760px) { flex-direction: column-reverse; align-items: flex-start; }
`;
// Her portrait lives in the git-ignored static/ash/private/ folder, so it only shows where that file exists (it hides itself otherwise).
const Portrait = styled(motion.div)`
  border: 2px solid rgba(232, 194, 107, 0.8); border-radius: 999px 999px 24px 24px; box-shadow: 0 0 0 8px rgba(232, 194, 107, 0.12), 0 24px 70px rgba(0, 0, 12, 0.6); flex: none; height: clamp(220px, 30vw, 340px); overflow: hidden; width: clamp(180px, 24vw, 280px);
  img { height: 100%; object-fit: cover; width: 100%; }
`;
function HerPortrait() {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    <Portrait initial={{ opacity: 0, scale: 0.9, rotate: 3 }} animate={{ opacity: 1, scale: 1, rotate: 0, y: [0, -8, 0] }} transition={{ opacity: { duration: 1, delay: 0.5 }, scale: { duration: 1, delay: 0.5 }, rotate: { duration: 1, delay: 0.5 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}>
      <img src="/ash/private/portrait.jpg" alt="" onError={() => setOk(false)} />
    </Portrait>
  );
}
// Cards in a row share one height, however much each one holds.
const Equal = styled(Grid)`
  align-items: stretch;
  & > * { height: 100%; }
  & > * > article { height: 100%; }
`;
const Big = styled.div`color: var(--gold2); font-family: ${display}; font-size: 3.6rem; line-height: 1; small { color: var(--muted); font-family: inherit; font-size: 1rem; margin-left: 0.4rem; }`;

export default function Today() {
  const [art, setArt] = useState(artworks[0]);
  const [next, setNext] = useState(null);
  const raga = useRaga();
  const [listen, setListen] = useState(false);
  useEffect(() => { setArt(ofTheDay()); setNext(upcoming()[0] || null); }, []);
  const left = next ? daysUntil(next.date) : null;
  return (
    <HubLayout current="home" title="Today">
      <ArtHero art={byId.starry}>
        <Wrap>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
            <Hero>
              <div>
                <Eyebrow>For my star</Eyebrow>
                <H1 style={{ fontSize: "clamp(2.4rem, 6vw, 4.6rem)", margin: 0 }}>My psych baby!<br /><em>I’m psyched for you.</em></H1>
              </div>
            </Hero>
          </motion.div>
        </Wrap>
      </ArtHero>
      <Wrap>
        <Section>
          <Eyebrow>Right now</Eyebrow>
          <Stagger>
            <Equal cols={3}>
              <Item><RagaCard r={raga} open={listen} onToggle={() => setListen((o) => !o)} /></Item>
              <Item>
                <Card>
                  <Eyebrow>Next deadline</Eyebrow>
                  {next ? (<>
                    <Big><CountUp to={left} /><small>{left === 1 ? "day" : "days"}</small></Big>
                    <H3 style={{ marginTop: "0.5rem" }}>{next.title}</H3>
                    <p><Link to={hubPath("/career/")} state={{ tab: "deadlines" }}>See all deadlines →</Link></p>
                  </>) : <p>No dates coming up. Breathe.</p>}
                </Card>
              </Item>
              <Item>
                <Card>
                  <Eyebrow>Painting of the day</Eyebrow>
                  <H3>{art.title}</H3>
                  <p>{art.why}</p>
                  <p><Hand>{art.artist}, {art.year}</Hand></p>
                </Card>
              </Item>
            </Equal>
            <RagaPanel r={raga} open={listen} />
          </Stagger>
        </Section>
        <Section>
          <H2>Pick a room</H2>
          <Stagger>
            <Grid cols={3}>
              {rooms.map((r) => (
                <Item key={r.key}>
                  <RoomCard to={hubPath(r.path)} whileHover={{ y: -6 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 300, damping: 22 }}>
                    <motion.div className="bg" style={{ backgroundImage: `url(${byId[r.art].src})`, backgroundPosition: byId[r.art].focus }} whileHover={{ scale: 1.08 }} transition={{ duration: 0.8 }} />
                    <div className="shade" />
                    <div className="t"><h3>{r.title}</h3><p>{r.blurb}</p></div>
                  </RoomCard>
                </Item>
              ))}
            </Grid>
          </Stagger>
        </Section>
      </Wrap>
    </HubLayout>
  );
}
