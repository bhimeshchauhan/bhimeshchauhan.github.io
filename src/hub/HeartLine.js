import React, { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import Heart from "./Heart";

// A hospital-monitor heartbeat along the bottom edge of the nav. The trace itself is fixed; a bright head sweeps across it left to right,
// leaving a fading tail, so the beats appear as it passes. At the centre the trace draws a heart, which fades as the sweep moves on.
const W = 1920, CX = 960, SWEEP = 5, TAIL = 380;
let d = "M0 30";
for (let x = 120; x < W; x += 210) {
  if (Math.abs(x - CX) < 130) continue; // the centre belongs to the heart
  d += ` H${x} L${x + 8} 30 L${x + 15} 10 L${x + 24} 52 L${x + 32} 20 L${x + 38} 30`;
}
// ...then the heart: baseline into the left side, round the left lobe, the dip, the right lobe, down to the tip, and back up to the start.
d += ` M0 30`; // (restart the baseline so beats and heart are separate strokes)
const BEATS = d;
const HEART = `M${CX - 70} 30 H${CX - 34} C${CX - 34} 6 ${CX - 6} 2 ${CX} 22 C${CX + 6} 2 ${CX + 34} 6 ${CX + 34} 30 C${CX + 34} 42 ${CX + 10} 50 ${CX} 58 C${CX - 10} 50 ${CX - 34} 42 ${CX - 34} 30 L${CX + 34} 30 H${CX + 70}`;

export default function HeartLine() {
  const x = useMotionValue(-TAIL);
  useEffect(() => { const c = animate(x, W, { duration: SWEEP, repeat: Infinity, ease: "linear" }); return () => c.stop(); }, [x]);
  const pos = useTransform(x, (v) => `${v}px 0px`);
  const mask = `linear-gradient(90deg, transparent 0, rgba(0,0,0,0.25) 40%, #000 96%, transparent 100%)`;
  const layer = { WebkitMaskImage: mask, maskImage: mask, WebkitMaskSize: `${TAIL}px 100%`, maskSize: `${TAIL}px 100%`, WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: pos, maskPosition: pos };
  const flat = "M0 30 H1920"; // the faint resting line that is always there
  return (
    <>
      <div aria-hidden="true" style={{ bottom: -30, height: 60, left: 0, overflow: "hidden", pointerEvents: "none", position: "absolute", right: 0 }}>
        <div style={{ left: "50%", marginLeft: -CX, position: "absolute", width: W, height: 60 }}>
          <svg viewBox={`0 0 ${W} 60`} width={W} height="60" style={{ position: "absolute", inset: 0 }}>
            <path d={flat} stroke="rgba(232,194,107,0.28)" strokeWidth="1.5" fill="none" />
          </svg>
          <motion.svg viewBox={`0 0 ${W} 60`} width={W} height="60" style={{ ...layer, filter: "blur(3px)", position: "absolute", inset: 0 }}>
            <path d={BEATS} stroke="#ffd9a8" strokeWidth="4" fill="none" /><path d={HEART} stroke="#f26c96" strokeWidth="4.5" fill="none" />
          </motion.svg>
          <motion.svg viewBox={`0 0 ${W} 60`} width={W} height="60" style={{ ...layer, position: "absolute", inset: 0 }}>
            <path d={BEATS} stroke="#fff3c4" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d={HEART} stroke="#ff8fb3" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </div>
      </div>
      {/* the glossy heart beats once as the head crosses the centre */}
      <motion.div style={{ bottom: -17, left: "50%", marginLeft: -17, pointerEvents: "none", position: "absolute", zIndex: 2 }}
        animate={{ opacity: [0, 0, 1, 1, 0, 0], scale: [0.3, 0.3, 1, 1.12, 0.4, 0.3] }} transition={{ duration: SWEEP, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.46, 0.55, 0.68, 1] }}>
        <Heart size={30} burst={false} />
      </motion.div>
    </>
  );
}
