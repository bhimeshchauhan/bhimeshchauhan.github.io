import React from "react";
import { motion } from "framer-motion";
import HubLayout from "./HubLayout";
import { ArtHero } from "./motion";
import { byId } from "./artworks";
import { Wrap, Eyebrow, H1, Section } from "./ui";

// Every room opens with its own painting. `kicker` is the small label, `lede` is one short line.
export default function Room({ roomKey, art, title, kicker, lede, children }) {
  return (
    <HubLayout current={roomKey} title={title}>
      <ArtHero art={byId[art]}>
        <Wrap>
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}>
            {kicker ? <Eyebrow>{kicker}</Eyebrow> : null}
            <H1 style={{ fontSize: "clamp(2.3rem, 7vw, 4.4rem)", margin: "0 0 0.5rem" }}>{title}</H1>
            {lede ? <p style={{ color: "#f3efe2", fontSize: "clamp(1rem, 2.4vw, 1.2rem)", lineHeight: 1.5, margin: 0, maxWidth: "36rem", textShadow: "0 1px 14px rgba(5,7,24,.9)" }}>{lede}</p> : null}
          </motion.div>
        </Wrap>
      </ArtHero>
      <Wrap><Section>{children}</Section></Wrap>
    </HubLayout>
  );
}
