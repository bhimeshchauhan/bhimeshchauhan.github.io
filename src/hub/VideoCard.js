import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

// A video with its cover photo. Nothing from YouTube loads until she taps it (the cover is just a picture), then the video plays right here.
const Box = styled.div`
  background: #000; border-radius: 14px; overflow: hidden; position: relative; aspect-ratio: 16 / 9; width: 100%;
  .cover { background-size: cover; background-position: center; border: 0; cursor: pointer; inset: 0; padding: 0; position: absolute; width: 100%; }
  .shade { background: linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65)); inset: 0; position: absolute; pointer-events: none; }
  .play { align-items: center; background: rgba(242, 108, 150, 0.92); border-radius: 50%; box-shadow: 0 6px 28px rgba(242, 108, 150, 0.55); display: flex; height: 62px; justify-content: center; left: 50%; margin: -31px 0 0 -31px; position: absolute; top: 50%; width: 62px; }
  .play svg { margin-left: 4px; }
  iframe { border: 0; height: 100%; inset: 0; position: absolute; width: 100%; }
`;

export default function VideoCard({ id, title }) {
  const [playing, setPlaying] = useState(false);
  return (
    <Box>
      <AnimatePresence mode="wait" initial={false}>
        {playing ? (
          <motion.iframe key="v" title={title} src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
        ) : (
          <motion.button key="c" type="button" className="cover" aria-label={`Play ${title}`} style={{ backgroundImage: `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)` }} onClick={() => setPlaying(true)} exit={{ opacity: 0 }} whileHover={{ scale: 1.04 }} transition={{ duration: 0.5 }}>
            <span className="shade" />
            <motion.span className="play" animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="#fff" /></svg>
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </Box>
  );
}
