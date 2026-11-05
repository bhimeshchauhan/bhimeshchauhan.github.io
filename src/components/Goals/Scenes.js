import React from "react";
import styled, { keyframes } from "styled-components";

// Illustrated, flat-vector scenes in the site palette. One per theme; every goal maps to one.
const float = keyframes`0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}`;
const drift = keyframes`0%,100%{transform:translateX(0)}50%{transform:translateX(16px)}`;
const spin = keyframes`to{transform:rotate(360deg)}`;
const pulse = keyframes`0%,100%{opacity:.35;transform:scale(1)}50%{opacity:1;transform:scale(1.15)}`;
const slideL = keyframes`from{transform:translateX(0)}to{transform:translateX(-120px)}`;
const rise = keyframes`from{transform:translateY(0);opacity:0}15%{opacity:1}to{transform:translateY(-110px);opacity:0}`;
const fall = keyframes`from{transform:translateY(-30px)}to{transform:translateY(310px)}`;
const grow = keyframes`from{transform:scaleY(.15)}to{transform:scaleY(1)}`;
const wave = keyframes`0%,100%{transform:translateX(0)}50%{transform:translateX(-24px)}`;
const draw = keyframes`from{stroke-dashoffset:400}to{stroke-dashoffset:0}`;
const beat = keyframes`0%,100%{transform:scale(1)}50%{transform:scale(1.22)}`;
const key = keyframes`0%,100%{transform:translateY(0)}50%{transform:translateY(5px)}`;
const sweep = keyframes`0%,100%{transform:rotate(-26deg)}50%{transform:rotate(26deg)}`;

const Svg = styled.svg`
  display: block; height: 100%; width: 100%;
  .cream { fill: #f2f0ea; } .amb { fill: #ffb454; } .ind { fill: #3b4bd8; } .vio { fill: #7c3aed; }
  .soft { fill: rgba(255,255,255,0.08); } .dim { fill: rgba(255,255,255,0.16); }
  .ls { fill: none; stroke: #f2f0ea; stroke-linecap: round; stroke-linejoin: round; stroke-width: 3; }
  .as { fill: none; stroke: #ffb454; stroke-linecap: round; stroke-linejoin: round; stroke-width: 3; }
  .tb { transform-box: fill-box; }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
`;

const A = (name, dur, extra = "") => ({ animation: `${name.getName()} ${dur} ease-in-out infinite ${extra}` });
const Defs = () => (
  <defs>
    <linearGradient id="gv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3b4bd8" /><stop offset="1" stopColor="#7c3aed" /></linearGradient>
    <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffb454" /><stop offset="1" stopColor="#ff7a3d" /></linearGradient>
    <linearGradient id="gn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b0d16" /><stop offset="1" stopColor="#1c1850" /></linearGradient>
  </defs>
);
const Reg = () => <g className="__r" style={{ animationName: [float, drift, spin, pulse, slideL, rise, fall, grow, wave, draw, beat, key, sweep].map((k) => k.getName()).join(","), display: "none" }} />;
const Wrap = ({ children }) => (<Svg viewBox="0 0 300 300" aria-hidden="true"><Defs /><Reg />{children}</Svg>);
const Halo = () => <circle cx="150" cy="150" r="118" className="soft" />;

export const Road = () => (
  <Wrap>
    <Halo />
    <rect x="0" y="196" width="300" height="104" fill="#12141f" />
    <g style={A(slideL, "1.2s", "").animation ? { animation: `${slideL.getName()} 1.1s linear infinite` } : {}}>{[0, 60, 120, 180, 240, 300, 360].map((x) => <rect key={x} x={x} y="244" width="34" height="5" rx="2" className="amb" />)}</g>
    <g style={{ animation: `${wave.getName()} 1s ease-in-out infinite` }}>
      <path d="M96 192 L108 164 Q112 156 122 156 H176 Q186 156 192 164 L206 192 Z" fill="url(#gv)" />
      <rect x="84" y="188" width="136" height="26" rx="10" fill="url(#gv)" />
      <path d="M118 164 H148 V186 H108 Z M154 164 H178 L190 186 H154 Z" className="cream" opacity=".85" />
      <circle cx="116" cy="214" r="13" className="cream" /><circle cx="116" cy="214" r="5" fill="#12141f" />
      <circle cx="190" cy="214" r="13" className="cream" /><circle cx="190" cy="214" r="5" fill="#12141f" />
      <rect x="210" y="196" width="10" height="7" rx="3" className="amb" />
    </g>
    <circle cx="232" cy="80" r="26" fill="url(#ga)" style={{ animation: `${pulse.getName()} 4s ease-in-out infinite` }} />
  </Wrap>
);

export const Growth = () => (
  <Wrap>
    <Halo />
    <path className="ls" d="M52 232 H252" opacity=".4" />
    {[[70, 70, "gv"], [112, 108, "gv"], [154, 150, "gv"], [196, 196, "ga"]].map(([x, h, g], i) => (
      <rect key={x} className="tb" x={x} y={232 - h * 0.8} width="30" height={h * 0.8} rx="6" fill={`url(#${g})`} style={{ transformOrigin: "bottom", animation: `${grow.getName()} 1.2s cubic-bezier(.2,.8,.2,1) both`, animationDelay: `${i * 0.15}s` }} />
    ))}
    <path className="as" d="M64 168 L118 132 L160 96 L226 56" strokeDasharray="400" style={{ animation: `${draw.getName()} 1.8s ease both .5s` }} />
    <path className="amb" d="M226 56 l-18 3 l9 14z" />
    <g style={{ animation: `${float.getName()} 3s ease-in-out infinite` }}><circle cx="236" cy="150" r="22" fill="url(#ga)" /><text x="236" y="158" textAnchor="middle" fontSize="22" fontWeight="700" fill="#0b0d12">$</text></g>
  </Wrap>
);

export const Book = () => (
  <Wrap>
    <Halo />
    <g style={{ animation: `${float.getName()} 4s ease-in-out infinite` }}>
      <path d="M150 96 Q112 80 66 92 V212 Q112 200 150 216 Z" fill="url(#gv)" />
      <path d="M150 96 Q188 80 234 92 V212 Q188 200 150 216 Z" fill="url(#gv)" opacity=".75" />
      {[112, 130, 148, 166].map((y, i) => <path key={y} className="ls" d={`M80 ${y} Q112 ${y - 8} 138 ${y + 2}`} opacity=".55" />)}
      <g className="tb" style={{ transformOrigin: "left", animation: `${sweep.getName()} 3s ease-in-out infinite` }}><path d="M150 96 Q188 80 234 92 V212 Q188 200 150 216 Z" className="cream" opacity=".9" /></g>
    </g>
    {[0, 1, 2].map((i) => <circle key={i} className="amb" cx={190 + i * 18} cy={70} r="3" style={{ animation: `${rise.getName()} 2.6s linear infinite`, animationDelay: `${i * 0.8}s` }} />)}
  </Wrap>
);

export const Code = () => (
  <Wrap>
    <Halo />
    <rect x="48" y="78" width="204" height="144" rx="14" fill="#0e1018" stroke="rgba(255,255,255,.2)" />
    <circle cx="68" cy="96" r="4" className="amb" /><circle cx="82" cy="96" r="4" className="dim" /><circle cx="96" cy="96" r="4" className="dim" />
    {[[64, 124, 90], [78, 144, 120], [78, 164, 70], [64, 184, 100]].map(([x, y, w], i) => (
      <rect key={i} className={i === 1 ? "amb" : "cream"} opacity={i === 1 ? 1 : 0.7} x={x} y={y} width={w} height="8" rx="4" style={{ transformOrigin: "left", animation: `${grow.getName()} .9s ease both`, animationDelay: `${i * 0.25}s`, transform: "scaleY(1)" }} />
    ))}
    <rect x="170" y="184" width="9" height="14" className="amb" style={{ animation: `${pulse.getName()} 1s steps(2) infinite` }} />
    <g style={{ animation: `${float.getName()} 3s ease-in-out infinite` }}><circle cx="224" cy="70" r="20" fill="url(#gv)" /><path className="ls" d="M216 70 l6 6 l12 -12" /></g>
  </Wrap>
);

export const People = () => (
  <Wrap>
    <Halo />
    {[[100, 0], [150, 1], [200, 2]].map(([x, i]) => (
      <g key={x} style={{ animation: `${float.getName()} 3s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }}>
        <circle cx={x} cy={140 - (i === 1 ? 14 : 0)} r="22" fill={i === 1 ? "url(#ga)" : "url(#gv)"} />
        <path d={`M${x - 32} ${224 - (i === 1 ? 14 : 0)} Q${x} ${168 - (i === 1 ? 14 : 0)} ${x + 32} ${224 - (i === 1 ? 14 : 0)} Z`} fill={i === 1 ? "url(#ga)" : "url(#gv)"} opacity=".9" />
      </g>
    ))}
    <path className="amb" d="M150 78 C134 62 114 74 124 90 C130 98 150 110 150 110 C150 110 170 98 176 90 C186 74 166 62 150 78Z" style={{ transformOrigin: "150px 90px", animation: `${beat.getName()} 1.4s ease-in-out infinite` }} />
  </Wrap>
);

export const Water = () => (
  <Wrap>
    <defs><clipPath id="wc"><circle cx="150" cy="150" r="118" /></clipPath></defs>
    <circle cx="150" cy="150" r="118" fill="url(#gn)" />
    <g clipPath="url(#wc)">
      {[0, 1, 2].map((i) => <g key={i} style={{ animation: `${wave.getName()} ${3 + i}s ease-in-out infinite` }}><path d={`M-40 ${150 + i * 34} Q 0 ${130 + i * 34} 40 ${150 + i * 34} T 120 ${150 + i * 34} T 200 ${150 + i * 34} T 280 ${150 + i * 34} T 360 ${150 + i * 34} V300 H-40Z`} fill={i === 0 ? "#3b4bd8" : i === 1 ? "#5b3fd1" : "#7c3aed"} opacity={0.55 + i * 0.15} /></g>)}
      <g style={{ animation: `${drift.getName()} 5s ease-in-out infinite` }}><path className="amb" d="M120 226 q18 -16 38 0 q-20 16 -38 0z" /><path className="amb" d="M158 226 l16 -10 v20z" /><circle cx="130" cy="224" r="2.5" fill="#0b0d12" /></g>
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={96 + i * 22} cy={250} r={3 + (i % 2)} className="cream" opacity=".6" style={{ animation: `${rise.getName()} ${2.4 + i * 0.3}s linear infinite`, animationDelay: `${i * 0.5}s` }} />)}
    </g>
    <g style={{ animation: `${drift.getName()} 6s ease-in-out infinite` }}><path className="cream" d="M96 128 h74 l-12 18 h-50z" /><path className="cream" d="M133 128 v-36 l26 36z" opacity=".9" /><path className="amb" d="M133 92 l-26 36 h26z" /></g>
  </Wrap>
);

export const Ski = () => (
  <Wrap>
    <circle cx="150" cy="150" r="118" fill="url(#gn)" />
    <path className="vio" opacity=".7" d="M32 232 L110 112 L160 188 L204 130 L268 232Z" />
    <path className="cream" opacity=".9" d="M110 112 L92 140 L108 134 L120 150 L130 134Z M204 130 L190 152 L202 146 L214 160 L222 146Z" />
    <g style={{ animation: `${fall.getName()} 2.6s linear infinite` }}>{[50, 98, 150, 202, 252].map((x, i) => <circle key={i} cx={x} cy={i * 24 - 20} r="2.5" className="cream" opacity=".7" />)}</g>
    <path d="M70 214 L246 252 L246 262 L56 262Z" className="cream" opacity=".95" />
    <g style={{ animation: `${float.getName()} 1.3s ease-in-out infinite` }}>
      <g transform="rotate(14 150 200)">
        <circle cx="146" cy="150" r="10" className="cream" />
        <path d="M146 162 L140 190 L128 210 M140 190 L156 206 L168 214" className="ls" strokeWidth="5" />
        <path d="M144 170 L120 178 M144 170 L170 160" className="as" strokeWidth="4" />
        <path d="M112 216 L184 232" className="as" strokeWidth="6" />
      </g>
    </g>
  </Wrap>
);

export const Sky = () => (
  <Wrap>
    <circle cx="150" cy="150" r="118" fill="url(#gn)" />
    {[[70, 90], [120, 70], [210, 100], [240, 140], [90, 150], [180, 60]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.4" className="cream" style={{ animation: `${pulse.getName()} ${2 + (i % 3)}s ease-in-out infinite`, animationDelay: `${i * 0.3}s` }} />)}
    <g style={{ animation: `${drift.getName()} 8s ease-in-out infinite` }}>
      <path d="M40 196 Q90 120 150 170 T270 150 V210 H40Z" fill="#2fe6a7" opacity=".28" />
      <path d="M40 210 Q100 150 160 196 T270 176 V230 H40Z" fill="#7c3aed" opacity=".4" />
    </g>
    <g style={{ animation: `${float.getName()} 4s ease-in-out infinite` }}>
      <circle cx="214" cy="84" r="24" fill="url(#ga)" /><ellipse cx="214" cy="84" rx="40" ry="8" className="ls" transform="rotate(-18 214 84)" opacity=".8" />
    </g>
    <path d="M60 238 H240" className="ls" opacity=".25" />
  </Wrap>
);

export const Skydive = () => (
  <Wrap>
    <Halo />
    {[[60, 0], [220, 1], [150, 2]].map(([x, i]) => <ellipse key={x} className="dim" cx={x} cy={300} rx="38" ry="11" style={{ animation: `${rise.getName()} ${3 + i}s linear infinite`, animationDelay: `${i * -1}s`, opacity: 1 }} />)}
    <g style={{ animation: `${float.getName()} 2s ease-in-out infinite` }}>
      <path d="M150 54 C98 54 84 110 96 128 L204 128 C216 110 202 54 150 54Z" fill="url(#ga)" />
      <path className="ls" d="M100 128 L142 190 M200 128 L158 190 M150 128 V190" opacity=".7" />
      <circle cx="150" cy="198" r="10" className="cream" /><path className="ls" strokeWidth="5" d="M150 208 V240 M150 240 L136 262 M150 240 L164 262 M150 214 L132 226 M150 214 L168 226" />
    </g>
  </Wrap>
);

export const Music = () => (
  <Wrap>
    <Halo />
    <rect x="48" y="150" width="204" height="86" rx="12" className="cream" />
    {Array.from({ length: 8 }, (_, i) => <g key={i}><rect x={52 + i * 25} y="154" width="23" height="78" rx="5" fill="#fff" stroke="#c9c6bd" style={{ animation: `${key.getName()} 1.6s ease-in-out infinite`, animationDelay: `${i * 0.15}s` }} /></g>)}
    {[1, 2, 4, 5, 6].map((n, i) => <rect key={n} x={44 + n * 25 + 12} y="154" width="16" height="48" rx="3" fill="#12141f" />)}
    {[0, 1, 2, 3].map((i) => <text key={i} className="amb" fontSize={26 - i * 2} x={80 + i * 44} y="130" style={{ animation: `${rise.getName()} 2.6s ease-out infinite`, animationDelay: `${i * 0.65}s` }}>♪</text>)}
    <g style={{ animation: `${pulse.getName()} 1.4s ease-in-out infinite` }}>{[0, 1, 2].map((i) => <path key={i} className="as" opacity={0.5 - i * 0.12} d={`M236 ${96 - i * 12} q 18 ${12 + i * 6} 0 ${28 + i * 10}`} />)}</g>
  </Wrap>
);

export const Fitness = () => (
  <Wrap>
    <Halo />
    <g style={{ animation: `${float.getName()} 1.2s ease-in-out infinite` }}>
      <rect x="88" y="132" width="124" height="14" rx="7" className="cream" />
      <rect x="64" y="108" width="22" height="62" rx="7" fill="url(#gv)" /><rect x="214" y="108" width="22" height="62" rx="7" fill="url(#gv)" />
      <rect x="44" y="120" width="16" height="38" rx="6" className="amb" /><rect x="240" y="120" width="16" height="38" rx="6" className="amb" />
    </g>
    <path className="as" strokeWidth="4" d="M44 220 H96 L112 196 L132 238 L152 206 L170 220 H256" strokeDasharray="400" style={{ animation: `${draw.getName()} 2s linear infinite` }} />
  </Wrap>
);

export const Lang = () => (
  <Wrap>
    <Halo />
    {[["Hola", 62, 82, "gv", 0], ["Szia", 160, 122, "ga", 0.5], ["Hello", 74, 178, "gv", 1], ["Привет", 168, 218, "gv", 1.5]].map(([t, x, y, g, d], i) => (
      <g key={t} style={{ animation: `${float.getName()} 3.4s ease-in-out infinite`, animationDelay: `${d}s` }}>
        <rect x={x} y={y - 24} width={t.length > 5 ? 96 : 78} height="36" rx="18" fill={`url(#${g})`} />
        <text x={x + (t.length > 5 ? 48 : 39)} y={y} textAnchor="middle" fontSize="19" fontWeight="700" fill={g === "ga" ? "#0b0d12" : "#f2f0ea"}>{t}</text>
      </g>
    ))}
  </Wrap>
);

export const Art = () => (
  <Wrap>
    <Halo />
    <rect x="62" y="70" width="176" height="150" rx="10" fill="#0e1018" stroke="rgba(255,255,255,.2)" />
    <path className="ls" strokeWidth="3.5" d="M84 190 Q112 96 148 150 T214 104" strokeDasharray="400" style={{ animation: `${draw.getName()} 3s ease-in-out infinite` }} />
    <path className="as" d="M92 204 Q126 170 156 188 T212 170" strokeDasharray="400" style={{ animation: `${draw.getName()} 3s ease-in-out infinite .4s` }} />
    <g style={{ animation: `${drift.getName()} 3s ease-in-out infinite` }}><path className="amb" d="M214 70 l30 -18 l8 14 l-30 18z" /><path className="cream" d="M222 84 l-6 18 l18 -8z" /></g>
  </Wrap>
);

export const Plane = () => (
  <Wrap>
    <circle cx="150" cy="150" r="118" fill="url(#gn)" />
    <path className="as" strokeDasharray="6 8" d="M40 224 Q150 40 262 112" opacity=".6" />
    <circle cx="40" cy="224" r="6" className="amb" /><circle cx="262" cy="112" r="6" className="amb" style={{ animation: `${pulse.getName()} 2s ease-in-out infinite` }} />
    <g style={{ animation: `${float.getName()} 3s ease-in-out infinite` }}><g transform="translate(150 118) rotate(-20)"><path className="cream" d="M-38 0 L26 -10 Q40 -10 44 0 Q40 10 26 10 Z" /><path className="cream" d="M-6 -2 L-26 -34 L-14 -34 L14 -2Z M-6 2 L-26 34 L-14 34 L14 2Z" opacity=".9" /><path className="amb" d="M-38 0 L-48 -14 L-40 -14 L-28 -2Z" /></g></g>
    {[0, 1, 2].map((i) => <ellipse key={i} className="dim" cx={70 + i * 70} cy={236} rx="26" ry="8" style={{ animation: `${drift.getName()} ${4 + i}s ease-in-out infinite` }} />)}
  </Wrap>
);

export const City = () => (
  <Wrap>
    <circle cx="150" cy="150" r="118" fill="url(#gn)" />
    <g>{[[56, 110, 36], [96, 78, 30], [130, 124, 34], [168, 62, 34], [208, 98, 32], [244, 134, 26]].map(([x, y, w], i) => (
      <g key={i}><rect x={x - w / 2} y={y + 56} width={w} height={236 - y - 56} rx="3" fill={i % 2 ? "#242169" : "#1a1a52"} />{Array.from({ length: 4 }, (_, r) => <rect key={r} x={x - 8} y={y + 66 + r * 22} width="6" height="8" rx="2" className="amb" opacity=".75" style={{ animation: `${pulse.getName()} ${3 + ((i + r) % 3)}s ease-in-out infinite` }} />)}</g>))}</g>
    <circle cx="232" cy="64" r="16" className="cream" opacity=".9" />
  </Wrap>
);

export const Festival = () => (
  <Wrap>
    <circle cx="150" cy="150" r="118" fill="url(#gn)" />
    {[-1, 0, 1].map((k) => <g key={k} className="tb" style={{ transformOrigin: `${150 + k * 62}px 70px`, animation: `${sweep.getName()} ${2.4 + (k + 1) * 0.4}s ease-in-out infinite` }}><path d={`M${150 + k * 62} 70 L${116 + k * 62} 210 H${184 + k * 62}Z`} fill={k === 0 ? "#ffb454" : "#7c8cff"} opacity=".32" /></g>)}
    <rect x="46" y="212" width="208" height="26" rx="8" className="dim" />
    {[0, 1, 2, 3, 4, 5].map((i) => <g key={i} style={{ animation: `${float.getName()} ${0.9 + (i % 3) * 0.2}s ease-in-out infinite`, animationDelay: `${i * 0.12}s` }}><circle cx={70 + i * 32} cy={200} r="9" className="cream" /><rect x={64 + i * 32} y={208} width="12" height="14" rx="4" className="cream" /></g>)}
  </Wrap>
);

export const Landmark = () => (
  <Wrap>
    <circle cx="150" cy="150" r="118" fill="url(#gn)" />
    <path d="M40 232 H260" className="ls" opacity=".4" />
    <g style={{ animation: `${float.getName()} 5s ease-in-out infinite` }}>
      <path className="cream" d="M150 52 L158 100 L176 232 H156 L150 196 L144 232 H124 L142 100Z" opacity=".95" />
      <path className="amb" d="M132 150 H168 V158 H132Z M138 112 H162 V119 H138Z" />
      <path className="ls" d="M146 196 Q150 168 154 196" />
    </g>
    <path className="vio" opacity=".85" d="M30 232 V196 H48 V204 H64 V188 H82 V196 H98 V232Z" />
    <path className="vio" opacity=".85" d="M204 232 V200 H214 V232Z M222 232 V196 H232 V232Z M240 232 V204 H250 V232Z M208 196 H246 V202 H208Z" />
  </Wrap>
);

export const Balloon = () => (
  <Wrap>
    <Halo />
    {[44, 236].map((x, i) => <ellipse key={x} className="dim" cx={x} cy={104 + i * 70} rx="36" ry="10" style={{ animation: `${drift.getName()} ${6 + i * 2}s ease-in-out infinite` }} />)}
    <g style={{ animation: `${float.getName()} 4.5s ease-in-out infinite` }}>
      <path d="M150 38 C102 38 90 98 114 130 H186 C210 98 198 38 150 38Z" fill="url(#ga)" />
      <path d="M150 38 C132 70 134 104 150 130 C166 104 168 70 150 38Z" fill="url(#gv)" />
      <path className="ls" d="M120 130 L136 176 M180 130 L164 176" />
      <rect x="132" y="176" width="36" height="26" rx="5" fill="url(#gv)" />
    </g>
  </Wrap>
);

export const Target = () => (
  <Wrap>
    <Halo />
    {[96, 70, 44].map((r, i) => <circle key={r} cx="150" cy="150" r={r} fill="none" stroke={i === 2 ? "#ffb454" : "rgba(242,240,234,.55)"} strokeWidth="4" style={{ transformOrigin: "150px 150px", animation: `${pulse.getName()} ${2.4 + i * 0.3}s ease-in-out infinite` }} />)}
    <circle cx="150" cy="150" r="14" className="amb" style={{ transformOrigin: "150px 150px", animation: `${beat.getName()} 1.6s ease-in-out infinite` }} />
    <g style={{ animation: `${float.getName()} 3s ease-in-out infinite` }}><path className="cream" d="M236 72 L170 138 M236 72 l-4 18 l-14 -14z" /></g>
  </Wrap>
);

// [pattern, Component, label]. First match wins; unmatched goals get Target.
export const SCENES = [
  [/hot air|balloon/i, Balloon, "Up in the air"],
  [/skydiv|bungee/i, Skydive, "Free fall"],
  [/ski\b|skiing/i, Ski, "Snow skiing"],
  [/scuba|gondola|cruise/i, Water, "On the water"],
  [/space|northern|aurora/i, Sky, "Under the sky"],
  [/piano|gig|chord|scale|music/i, Music, "On stage"],
  [/fat|fit|strength|gym/i, Fitness, "In training"],
  [/car\b|highway|cross-country|redwood|drive/i, Road, "On the road"],
  [/hungarian|spanish|russian|ielts|language/i, Lang, "Languages"],
  [/sketch|draw|passion project/i, Art, "On paper"],
  [/immigration|express entry|\bpr\b|canada|move to/i, Plane, "Moving"],
  [/travel|visit|explore|europe|peru|mexico|continent/i, Plane, "Travel"],
  [/eiffel|great wall|stonehenge|holocaust|volcano|safari|memorial|exhibition|auction/i, Landmark, "Landmarks"],
  [/new york|london|venice|manhattan|singapore|bigger city/i, City, "Cities"],
  [/tomorrowland|oktoberfest|coachella|fifa|dias de|event/i, Festival, "Live events"],
  [/revenue|income|invest|finance|business|enterprise|merger|acquisition|board|startup|accelerator|patent/i, Growth, "Growth"],
  [/read|book|paper|research|degree|bachelor|gmat|class|study|teach|learn/i, Book, "Learning"],
  [/ai\b|machine|data|sdlc|ci\/cd|ml\b|product/i, Code, "Building"],
  [/speak|mentor|friend|jury|political|profit|people|help/i, People, "People"],
];
export const sceneFor = (desc) => SCENES.find(([re]) => re.test(desc)) || [null, Target, "A goal in progress"];
