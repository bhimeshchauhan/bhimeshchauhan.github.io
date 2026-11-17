import React from "react";
import styled, { css } from "styled-components";
import { motion, useReducedMotion } from "framer-motion";

// Shared look for Ash's hub: a night sky (Van Gogh), gold leaf (Klimt) and soft water light (Monet).
export const display = `"Cormorant Garamond", "Playfair Display", Georgia, serif`;
export const hand = `"Caveat", "Segoe Script", cursive`;
export const sans = `"Inter", system-ui, -apple-system, "Segoe UI", sans-serif`;

export const Wrap = styled.div`
  margin: 0 auto;
  max-width: 1080px;
  padding: 0 clamp(16px, 5vw, 32px);
  width: 100%;
`;

export const Eyebrow = styled.p`
  color: var(--gold);
  font-family: ${sans};
  font-size: 0.74rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  margin: 0 0 0.9rem;
  text-transform: uppercase;
`;

export const H1 = styled.h1`
  color: var(--cream);
  font-family: ${display};
  font-size: clamp(2.7rem, 9vw, 6rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 0.98;
  margin: 0 0 1.2rem;
  em { color: var(--gold2); font-style: italic; font-weight: 500; }
`;

export const H2 = styled.h2`
  color: var(--cream);
  font-family: ${display};
  font-size: clamp(1.9rem, 5vw, 3rem);
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.08;
  margin: 0 0 0.8rem;
`;

export const H3 = styled.h3`
  color: var(--cream);
  font-family: ${display};
  font-size: 1.55rem;
  font-weight: 600;
  line-height: 1.15;
  margin: 0 0 0.6rem;
`;

export const Lede = styled.p`
  color: var(--muted);
  font-size: clamp(1.02rem, 2.4vw, 1.2rem);
  line-height: 1.65;
  margin: 0 0 1.4rem;
  max-width: 44rem;
  text-shadow: 0 1px 14px rgba(4, 7, 28, 0.95), 0 0 3px rgba(4, 7, 28, 0.85); /* keeps it readable over the bright swirls */
`;

export const Hand = styled.span`
  color: var(--rose);
  font-family: ${hand};
  font-size: 1.35em;
  line-height: 1.1;
`;

// Gold-leaf frame with a small Klimt-style spiral in the corner.
export const glass = css`
  background: linear-gradient(160deg, rgba(14, 22, 66, 0.78), rgba(8, 12, 40, 0.78));
  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
  border: 1px solid rgba(232, 194, 107, 0.3);
  border-radius: 18px;
  box-shadow: 0 10px 40px rgba(0, 0, 8, 0.4), inset 0 0 0 1px rgba(255, 240, 190, 0.04);
  position: relative;
`;

export const Card = styled.article`
  ${glass}
  padding: clamp(1.1rem, 3vw, 1.6rem);
  &::after {
    background:
      radial-gradient(circle at 50% 50%, transparent 3px, var(--gold) 3.5px, var(--gold) 4.5px, transparent 5px),
      radial-gradient(circle at 50% 50%, transparent 8px, rgba(232, 194, 107, 0.55) 8.5px, rgba(232, 194, 107, 0.55) 9.5px, transparent 10px);
    content: "";
    height: 22px;
    opacity: 0.7;
    pointer-events: none;
    position: absolute;
    right: 12px;
    top: 12px;
    width: 22px;
  }
  p { color: var(--muted); line-height: 1.65; margin: 0 0 0.9rem; }
  p:last-child { margin-bottom: 0; }
  strong, b { color: var(--cream); }
  a { color: var(--gold2); text-decoration-color: rgba(232, 194, 107, 0.45); text-underline-offset: 3px; }
  a:hover { color: #fff; }
`;

export const Grid = styled.div`
  display: grid;
  gap: clamp(0.9rem, 2.4vw, 1.3rem);
  grid-template-columns: repeat(${(p) => p.cols || 2}, minmax(0, 1fr));
  @media (max-width: 860px) { grid-template-columns: ${(p) => (p.cols >= 3 ? "repeat(2, minmax(0, 1fr))" : "1fr")}; }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

const buttonStyle = css`
  align-items: center;
  background: linear-gradient(135deg, #f6e3a6, #e8c26b 55%, #c99a3d);
  border: 0;
  border-radius: 999px;
  box-shadow: 0 6px 24px rgba(232, 194, 107, 0.28);
  color: #14122a;
  cursor: pointer;
  display: inline-flex;
  font-family: ${sans};
  font-size: 0.98rem;
  font-weight: 700;
  gap: 0.5rem;
  min-height: 46px;
  padding: 0 1.4rem;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover { box-shadow: 0 10px 32px rgba(232, 194, 107, 0.42); transform: translateY(-2px); }
  &:disabled { cursor: not-allowed; filter: grayscale(0.7); opacity: 0.5; transform: none; }
`;
export const Button = styled.button`${buttonStyle}`;
export const ButtonLink = styled.a`${buttonStyle}`;

export const GhostButton = styled.button`
  background: transparent;
  border: 1px solid rgba(232, 194, 107, 0.45);
  border-radius: 999px;
  color: var(--gold2);
  cursor: pointer;
  font-family: ${sans};
  font-size: 0.92rem;
  font-weight: 600;
  min-height: 42px;
  padding: 0 1.1rem;
  &:hover { background: rgba(232, 194, 107, 0.12); }
`;

// Klimt-ish ornamental divider: tiny gold tiles that fade in from the middle.
export const Rule = styled.div`
  background:
    radial-gradient(circle, var(--gold) 1.5px, transparent 2px) 0 0 / 14px 10px repeat-x,
    linear-gradient(90deg, transparent, rgba(232, 194, 107, 0.5), transparent) center / 100% 1px no-repeat;
  height: 10px;
  margin: clamp(1.8rem, 5vw, 3rem) 0;
  opacity: 0.8;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 20%, #000 80%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 20%, #000 80%, transparent);
`;

export const Section = styled.section`
  padding: clamp(1.6rem, 5vw, 3.2rem) 0;
  scroll-margin-top: 78px;
`;

// Fade-and-rise as things scroll into view (skipped entirely for people who ask for less motion).
export function Reveal({ children, delay = 0, y = 22, as = "div", ...rest }) {
  const reduce = useReducedMotion();
  const Tag = motion[as] || motion.div;
  if (reduce) return <Tag {...rest}>{children}</Tag>;
  return (
    <Tag initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} {...rest}>
      {children}
    </Tag>
  );
}

const paths = {
  compass: "M12 2a10 10 0 100 20 10 10 0 000-20zm3.6 6.4l-2 5.2-5.2 2 2-5.2 5.2-2z",
  envelope: "M3 6h18v12H3zM3 6l9 7 9-7",
  hourglass: "M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9",
  brush: "M20 3c-6 2-10 6-11 11l2 2c5-1 9-5 11-11zM8 15c-2 0-4 1-4 4 0 1-1 2-2 2 4 1 8 0 8-4",
  note: "M9 18V5l11-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm11-2a3 3 0 11-6 0 3 3 0 016 0z",
  mountain: "M2 20l7-12 4 7 3-4 6 9zM14 5l1.5-2L17 5",
  moon: "M20 14.5A8.5 8.5 0 119.5 4 7 7 0 0020 14.5z",
  star: "M12 2l2.6 6.4L21 9l-5 4.5L17.5 21 12 17.3 6.5 21 8 13.5 3 9l6.4-.6z",
  heart: "M12 21s-8-5.2-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.8-8 11-8 11z",
  paw: "M7 11a2 2 0 110-4 2 2 0 010 4zm10 0a2 2 0 110-4 2 2 0 010 4zM4 14a2 2 0 110-4 2 2 0 010 4zm16 0a2 2 0 110-4 2 2 0 010 4zM12 12c3 0 5 3 5 5.5S15.5 20 12 20s-5-.5-5-2.5S9 12 12 12z"
};
export const Icon = ({ name, size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={paths[name] || paths.star} />
  </svg>
);
