import React, { useState } from "react";
import styled from "styled-components";
import Layout from "../components/layout";
import Ring from "../components/Art/Ring";
import Commission from "../components/Art/Commission";

const Wrap = styled.div`
  margin: 0 auto;
  max-width: 1120px;
  width: 100%;
  h1 { color: var(--ink); font-family: "Space Grotesk", sans-serif; font-size: clamp(2.4rem, 6vw, 4.5rem); font-weight: 700; letter-spacing: -0.04em; line-height: 1; margin: 1rem 0; }
  .lede { color: var(--muted); font-size: 1.2rem; line-height: 1.6; margin: 0 0 1rem; max-width: 40rem; }
  .hint { color: var(--muted); font-size: 0.9rem; margin: 0; }
  .cta { background: var(--accent); border-radius: 999px; color: #0b0d12; display: inline-block; font-weight: 700; margin-top: 1.25rem; padding: 0.8rem 1.5rem; text-decoration: none; }
`;

const Art = () => {
  const [ref, setRef] = useState(null);
  const goCommission = (item) => {
    setRef(item || null);
    setTimeout(() => { const el = document.getElementById("commission"); if (el) el.scrollIntoView({ behavior: "smooth" }); }, 60);
  };
  return (
    <Layout seo={{ title: "Art", description: "Illustration and design by Bhimesh Chauhan, plus commissions." }}>
      <Wrap>
        <h1>Art</h1>
        <p className="lede">Drawings and design, straight from my Instagram. Hover to pause, click a piece to open it.</p>
        <a className="cta" href="#commission" onClick={(e) => { e.preventDefault(); goCommission(null); }}>Request a commission</a>
        <Ring onCommission={goCommission} />
        <Commission reference={ref} />
      </Wrap>
    </Layout>
  );
};

export default Art;
