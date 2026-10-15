import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily, INK } from "./theme";

// All art is drawn in a 1000 x 700 viewBox, flat pastel fills with thick dark outlines
// (same look as the coin character). `frame` is local to the scene.

const S = { stroke: INK, strokeWidth: 7, strokeLinejoin: "round", strokeLinecap: "round" } as const;

const useSpringAt = (delay: number, damping = 11) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness: 140 } });
};

/* ---------- small pieces ---------- */

const Sparkle: React.FC<{ x: number; y: number; size?: number; delay?: number; color?: string }> = ({ x, y, size = 30, delay = 0, color = "#fff" }) => {
  const frame = useCurrentFrame();
  const k = 0.55 + 0.45 * Math.sin((frame - delay) / 6);
  const s = size * k;
  return (
    <path
      d={`M${x},${y - s} Q${x},${y} ${x + s},${y} Q${x},${y} ${x},${y + s} Q${x},${y} ${x - s},${y} Q${x},${y} ${x},${y - s} Z`}
      fill={color}
      stroke={INK}
      strokeWidth={3}
      strokeLinejoin="round"
    />
  );
};

const Face: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const frame = useCurrentFrame();
  const blink = frame % 96 > 90;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="-17" cy="0" rx="6.5" ry={blink ? 1.6 : 9} fill={INK} />
      <ellipse cx="17" cy="0" rx="6.5" ry={blink ? 1.6 : 9} fill={INK} />
      {blink ? null : (
        <g fill="#fff">
          <circle cx="-15" cy="-3.5" r="2.6" />
          <circle cx="19" cy="-3.5" r="2.6" />
        </g>
      )}
      <ellipse cx="-33" cy="13" rx="9" ry="5.5" fill="#ff7f9a" opacity="0.75" />
      <ellipse cx="33" cy="13" rx="9" ry="5.5" fill="#ff7f9a" opacity="0.75" />
      <path d="M-8,12 Q0,24 8,12" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
    </g>
  );
};

// gradients + light used by every illustration
export const Defs: React.FC = () => (
  <defs>
    <radialGradient id="gApple" cx="35%" cy="30%" r="80%">
      <stop offset="0" stopColor="#ff9a9d" />
      <stop offset="0.55" stopColor="#ff5a5f" />
      <stop offset="1" stopColor="#d93a45" />
    </radialGradient>
    <radialGradient id="gOrange" cx="35%" cy="30%" r="80%">
      <stop offset="0" stopColor="#ffcf7a" />
      <stop offset="0.55" stopColor="#ffa63d" />
      <stop offset="1" stopColor="#e57f12" />
    </radialGradient>
    <radialGradient id="gPear" cx="35%" cy="30%" r="85%">
      <stop offset="0" stopColor="#e4f78a" />
      <stop offset="0.55" stopColor="#b6e35a" />
      <stop offset="1" stopColor="#86bd3a" />
    </radialGradient>
    <linearGradient id="gBanana" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#ffe975" />
      <stop offset="1" stopColor="#f5c518" />
    </linearGradient>
    <radialGradient id="gGrape" cx="35%" cy="30%" r="80%">
      <stop offset="0" stopColor="#c9a7ff" />
      <stop offset="0.6" stopColor="#9b6bff" />
      <stop offset="1" stopColor="#7547d6" />
    </radialGradient>
    <linearGradient id="gWicker" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#f0be82" />
      <stop offset="1" stopColor="#d49a58" />
    </linearGradient>
    <linearGradient id="gWood" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#b9814a" />
      <stop offset="1" stopColor="#8f5f35" />
    </linearGradient>
    <linearGradient id="gMetal" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#f4f6fb" />
      <stop offset="1" stopColor="#c9cfdd" />
    </linearGradient>
    <radialGradient id="gLight" cx="50%" cy="0%" r="90%">
      <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
      <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
    </radialGradient>
    <pattern id="pDots" width="36" height="36" patternUnits="userSpaceOnUse">
      <circle cx="9" cy="9" r="3" fill="#ffffff" opacity="0.55" />
    </pattern>
  </defs>
);

export const Backdrop: React.FC = () => (
  <g>
    <rect width="1000" height="700" fill="url(#pDots)" />
    <rect width="1000" height="700" fill="url(#gLight)" />
  </g>
);

const Apple: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0,-34 C-52,-62 -88,-6 -58,42 C-40,72 -12,66 0,56 C12,66 40,72 58,42 C88,-6 52,-62 0,-34 Z" fill="url(#gApple)" {...S} />
    <path d="M0,-34 C2,-52 10,-62 20,-68" fill="none" {...S} />
    <path d="M6,-50 C22,-76 50,-70 56,-62 C44,-44 22,-42 6,-50 Z" fill="#5ccf6b" {...S} />
    <ellipse cx="-40" cy="-8" rx="9" ry="17" fill="#fff" opacity="0.55" transform="rotate(20 -40 -8)" />
    <Face x={2} y={14} s={0.8} />
  </g>
);

const Orange: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r="54" fill="url(#gOrange)" {...S} />
    <path d="M-6,-52 C0,-66 14,-70 24,-66 C20,-54 8,-48 -6,-52 Z" fill="#5ccf6b" {...S} strokeWidth={5} />
    <ellipse cx="-28" cy="-22" rx="9" ry="14" fill="#fff" opacity="0.5" transform="rotate(25 -28 -22)" />
    <Face x={0} y={8} s={0.78} />
  </g>
);

const Grapes: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0,-62 C2,-80 12,-86 22,-86" fill="none" {...S} />
    <path d="M10,-80 C26,-100 52,-92 54,-84 C42,-70 24,-70 10,-80 Z" fill="#5ccf6b" {...S} strokeWidth={5} />
    {[
      [-30, -34], [0, -40], [30, -34],
      [-45, 0], [-15, -4], [15, -4], [45, 0],
      [-30, 34], [0, 30], [30, 34],
      [0, 62],
    ].map(([cx, cy], i) => (
      <g key={i}>
        <circle cx={cx} cy={cy} r="22" fill="url(#gGrape)" {...S} strokeWidth={5} />
        <ellipse cx={cx - 8} cy={cy - 8} rx="5" ry="8" fill="#fff" opacity="0.6" />
      </g>
    ))}
    <Face x={0} y={16} s={0.62} />
  </g>
);

const Banana: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-78,-28 C-50,56 44,66 86,-6 C92,-18 74,-24 66,-14 C34,30 -30,22 -56,-44 C-62,-56 -84,-44 -78,-28 Z" fill="url(#gBanana)" {...S} />
    <path d="M-80,-34 L-70,-58 L-56,-48" fill="#8a5a2b" {...S} strokeWidth={5} />
    <path d="M-40,-8 C-20,24 20,30 48,6" fill="none" stroke="#fff" strokeWidth="6" opacity="0.5" strokeLinecap="round" />
    <Face x={4} y={28} s={0.55} />
  </g>
);

const Pear: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0,-62 C26,-62 30,-30 38,-8 C70,12 62,68 0,68 C-62,68 -70,12 -38,-8 C-30,-30 -26,-62 0,-62 Z" fill="url(#gPear)" {...S} />
    <path d="M0,-62 C0,-76 6,-86 16,-90" fill="none" {...S} />
    <path d="M10,-80 C26,-98 50,-90 52,-82 C40,-68 22,-68 10,-80 Z" fill="#5ccf6b" {...S} strokeWidth={5} />
    <ellipse cx="-30" cy="22" rx="8" ry="17" fill="#fff" opacity="0.5" />
    <Face x={2} y={30} s={0.8} />
  </g>
);

const BasketBody: React.FC<{ ribbon?: string; label?: string }> = ({ ribbon, label }) => (
  <g>
    <path d="M-180,-6 L180,-6 L142,150 Q0,174 -142,150 Z" fill="url(#gWicker)" {...S} />
    {[28, 66, 104].map((y) => (
      <path key={y} d={`M${-176 + y * 0.2},${y} Q0,${y + 14} ${176 - y * 0.2},${y}`} fill="none" stroke={INK} strokeWidth="4" opacity="0.45" />
    ))}
    {[-110, -55, 0, 55, 110].map((x) => (
      <path key={x} d={`M${x},0 L${x * 0.82},150`} fill="none" stroke={INK} strokeWidth="4" opacity="0.35" />
    ))}
    <rect x="-196" y="-30" width="392" height="38" rx="19" fill="url(#gWicker)" {...S} />
    <path d="M-170,-18 Q0,-8 170,-18" fill="none" stroke="#fff" strokeWidth="5" opacity="0.4" strokeLinecap="round" />
    {ribbon ? (
      <g>
        <path d="M-30,8 L-70,60 L-30,48 L0,66 L30,48 L70,60 L30,8 Z" fill={ribbon} {...S} strokeWidth={5} />
        <circle cx="0" cy="12" r="20" fill={ribbon} {...S} strokeWidth={5} />
      </g>
    ) : null}
    {label ? (
      <g>
        <rect x="-70" y="58" width="140" height="56" rx="14" fill="#fff" {...S} strokeWidth={5} />
        <text x="0" y="98" textAnchor="middle" fontFamily={fontFamily} fontSize="40" fill={INK}>{label}</text>
      </g>
    ) : null}
  </g>
);

const BasketHandle: React.FC = () => (
  <g>
    <path d="M-150,-14 C-150,-220 150,-220 150,-14" fill="none" stroke={INK} strokeWidth="26" strokeLinecap="round" />
    <path d="M-150,-14 C-150,-220 150,-220 150,-14" fill="none" stroke="#e8b274" strokeWidth="12" strokeLinecap="round" />
  </g>
);

// the fruit basket: fruits sit behind the rim, handle goes behind everything
const FruitBasket: React.FC<{ x: number; y: number; s?: number; ribbon?: string; label?: string; fruits?: number }> = ({ x, y, s = 1, ribbon, label, fruits = 5 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="0" cy="168" rx="170" ry="18" fill="#000" opacity="0.14" />
    <BasketHandle />
    {fruits > 0 && <Grapes x={-100} y={-30} s={0.95} />}
    {fruits > 1 && <Banana x={90} y={-34} s={0.95} />}
    {fruits > 2 && <Pear x={20} y={-46} s={0.9} />}
    {fruits > 3 && <Apple x={-50} y={-6} s={0.95} />}
    {fruits > 4 && <Orange x={62} y={-2} s={0.9} />}
    <BasketBody ribbon={ribbon} label={label} />
  </g>
);

const Cloud: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <g transform={`translate(${x + Math.sin(frame / 40) * 14} ${y}) scale(${s})`}>
      <path d="M-70,20 C-100,20 -100,-20 -66,-18 C-60,-56 -6,-60 6,-28 C34,-46 74,-22 62,12 C86,14 86,40 60,40 L-60,40 C-84,40 -90,22 -70,20 Z" fill="#fff" {...S} strokeWidth={5} />
    </g>
  );
};

/* ---------- scenes ---------- */

const Shop: React.FC = () => {
  const frame = useCurrentFrame();
  const basket = useSpringAt(6);
  const q = useSpringAt(26, 8);
  const bob = Math.sin(frame / 12) * 8;
  const apples = useSpringAt(16);
  const stripes = Array.from({ length: 9 }, (_, i) => i);
  return (
    <g>
      <Cloud x={160} y={180} s={0.9} />
      <Cloud x={860} y={120} s={0.7} />
      {/* awning */}
      {stripes.map((i) => (
        <g key={i}>
          <path d={`M${60 + i * 98},50 L${158 + i * 98},50 L${158 + i * 98},150 L${60 + i * 98},150 Z`} fill={i % 2 ? "#fff" : "#ff6b6b"} {...S} strokeWidth={5} />
          <circle cx={109 + i * 98} cy="150" r="49" fill={i % 2 ? "#fff" : "#ff6b6b"} {...S} strokeWidth={5} />
        </g>
      ))}
      {/* counter */}
      <rect x="40" y="470" width="920" height="40" rx="12" fill="url(#gWood)" {...S} />
      <rect x="70" y="510" width="860" height="170" fill="url(#gWood)" {...S} />
      <rect x="110" y="540" width="220" height="110" rx="10" fill="#b07a47" {...S} strokeWidth={5} />
      <rect x="390" y="540" width="220" height="110" rx="10" fill="#b07a47" {...S} strokeWidth={5} />
      <rect x="670" y="540" width="220" height="110" rx="10" fill="#b07a47" {...S} strokeWidth={5} />
      {/* basket */}
      <g transform={`translate(0 ${(1 - basket) * -260})`}>
        <FruitBasket x={380} y={400} s={1.1} />
      </g>
      {/* loose apples */}
      <g opacity={Math.min(1, apples * 1.3)} transform={`translate(0 ${(1 - apples) * -80})`}>
        <Apple x={710} y={444} s={0.9} />
        <Apple x={800} y={452} s={0.8} />
        <Apple x={756} y={400} s={0.85} />
      </g>
      {/* question bubble */}
      <g transform={`translate(740 ${230 + bob}) scale(${q})`}>
        <circle r="92" fill="#fff" {...S} />
        <path d="M-40,70 L-72,128 L10,86 Z" fill="#fff" {...S} />
        <circle r="86" fill="#fff" />
        <text x="0" y="40" textAnchor="middle" fontFamily={fontFamily} fontSize="120" fill="#ff8a3d">?</text>
      </g>
      <Sparkle x={560} y={300} delay={0} />
      <Sparkle x={220} y={330} size={22} delay={9} />
    </g>
  );
};

const Company: React.FC = () => {
  const frame = useCurrentFrame();
  const lift = useSpringAt(34, 12);
  const colors = ["#7fb7ff", "#ffd84d", "#ff9e80", "#9be3a1", "#c3a6ff"];
  const cols = 5;
  const rows = 4;
  const bw = 86;
  const gap = 10;
  const ox = 140;
  const oy = 175;
  const target = { c: 3, r: 1 };
  const blocks = [] as React.ReactNode[];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (c === target.c && r === target.r) {
        continue;
      }
      const pop = spring({ frame: frame - (r * cols + c) * 1.2, fps: 30, config: { damping: 12 } });
      blocks.push(
        <rect
          key={`${r}-${c}`}
          x={ox + c * (bw + gap)}
          y={oy + r * (bw + gap) + (1 - pop) * 60}
          width={bw}
          height={bw}
          rx="14"
          fill={colors[(r + c) % colors.length]}
          opacity={pop}
          {...S}
          strokeWidth={5}
        />,
      );
    }
  }
  const bx = ox + target.c * (bw + gap);
  const by = oy + target.r * (bw + gap);
  const lx = interpolate(lift, [0, 1], [bx, 700]);
  const ly = interpolate(lift, [0, 1], [by, 170]);
  const sc = interpolate(lift, [0, 1], [1, 1.5]);
  const rot = interpolate(lift, [0, 1], [0, -8]);
  return (
    <g>
      <Cloud x={820} y={110} s={0.8} />
      {/* roof sign */}
      <path d={`M${ox - 10},${oy - 20} L${ox + (cols * (bw + gap)) / 2 - 6},${oy - 110} L${ox + cols * (bw + gap) + 4},${oy - 20} Z`} fill="#ff6b6b" {...S} />
      <rect x={ox - 16} y={oy - 24} width={cols * (bw + gap) + 20} height="16" rx="8" fill="#c94b4b" {...S} strokeWidth={5} />
      {blocks}
      {/* lifted block */}
      <g transform={`translate(${lx + bw / 2} ${ly + bw / 2}) rotate(${rot}) scale(${sc}) translate(${-bw / 2} ${-bw / 2})`}>
        <rect width={bw} height={bw} rx="14" fill="#ffd84d" {...S} strokeWidth={5} />
        <text x={bw / 2} y={bw / 2 + 16} textAnchor="middle" fontFamily={fontFamily} fontSize="46" fill={INK}>1%</text>
      </g>
      {/* coins */}
      {[0, 1, 2, 3].map((i) => {
        const p = spring({ frame: frame - (60 + i * 12), fps: 30, config: { damping: 9 } });
        const cx = 690 + (i % 2) * 70 + i * 6;
        return (
          <g key={i} transform={`translate(${cx} ${interpolate(p, [0, 1], [250, 470 - i * 8])})`} opacity={Math.min(1, p * 2)}>
            <circle r="34" fill="#ffd84d" {...S} strokeWidth={6} />
            <circle r="23" fill="none" stroke="#e0a800" strokeWidth="4" />
            <text y="12" textAnchor="middle" fontFamily={fontFamily} fontSize="32" fill="#b07a00">₩</text>
          </g>
        );
      })}
      <Sparkle x={820} y={250} delay={4} color="#fff7b0" />
      <Sparkle x={620} y={150} size={22} delay={14} />
    </g>
  );
};

const BasketScene: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = useSpringAt(2);
  const order = [
    { n: 1, delay: 14 },
    { n: 2, delay: 28 },
    { n: 3, delay: 42 },
    { n: 4, delay: 56 },
    { n: 5, delay: 70 },
  ];
  const drops = order.map((o) => spring({ frame: frame - o.delay, fps: 30, config: { damping: 8, stiffness: 110 } }));
  const fruitDefs = [
    { C: Grapes, x: -100, y: -30, s: 0.95 },
    { C: Banana, x: 90, y: -34, s: 0.95 },
    { C: Pear, x: 20, y: -46, s: 0.9 },
    { C: Apple, x: -50, y: -6, s: 0.95 },
    { C: Orange, x: 62, y: -2, s: 0.9 },
  ];
  const gx = 500;
  const gy = 300;
  const sc = 1.25;
  return (
    <g>
      <Cloud x={170} y={150} s={0.9} />
      <Cloud x={840} y={190} s={0.7} />
      <ellipse cx={gx} cy={gy + 222} rx="270" ry="28" fill="#000" opacity="0.1" />
      <g transform={`translate(${gx} ${gy}) scale(${sc * pop})`}>
        <BasketHandle />
        {fruitDefs.map((f, i) => {
          const p = drops[i];
          return (
            <g key={i} opacity={Math.min(1, p * 3)} transform={`translate(0 ${(1 - p) * -330})`}>
              <f.C x={f.x} y={f.y} s={f.s} />
            </g>
          );
        })}
        <BasketBody ribbon="#2f6bff" label="펀드" />
      </g>
      <Sparkle x={250} y={380} delay={0} />
      <Sparkle x={780} y={330} size={24} delay={11} />
      <Sparkle x={700} y={140} size={20} delay={20} />
    </g>
  );
};

const Checkout: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const move = interpolate(frame, [0, 3.6 * fps], [-260, 1180], { extrapolateRight: "clamp" });
  const scan = Math.abs(move - 540) < 120;
  const ok = useSpringAt(Math.round(2.2 * fps), 8);
  const beltShift = (frame * 6) % 40;
  return (
    <g>
      <Cloud x={160} y={90} s={0.8} />
      <g transform="translate(0 -95)">
      {/* back wall shelves hint */}
      <rect x="40" y="250" width="920" height="20" rx="8" fill="#c8ccd6" {...S} strokeWidth={5} opacity="0.7" />
      {/* belt */}
      <rect x="40" y="520" width="920" height="150" rx="24" fill="#6b7280" {...S} />
      <rect x="60" y="490" width="880" height="50" rx="22" fill="#3b3f4a" {...S} />
      {Array.from({ length: 24 }, (_, i) => (
        <rect key={i} x={50 + i * 40 - beltShift} y="498" width="10" height="34" rx="5" fill="#59606e" opacity={50 + i * 40 - beltShift > 60 && 50 + i * 40 - beltShift < 920 ? 1 : 0} />
      ))}
      {/* scanner arch */}
      <g>
        <rect x="470" y="200" width="24" height="300" rx="10" fill="#e6e9f2" {...S} />
        <rect x="590" y="200" width="24" height="300" rx="10" fill="#e6e9f2" {...S} />
        <rect x="456" y="170" width="172" height="56" rx="22" fill="#ffd84d" {...S} />
        <circle cx="500" cy="198" r="9" fill={scan ? "#ff3b3b" : "#9aa0ad"} {...S} strokeWidth={3} />
        <circle cx="542" cy="198" r="9" fill="#9aa0ad" {...S} strokeWidth={3} />
        <circle cx="584" cy="198" r="9" fill="#9aa0ad" {...S} strokeWidth={3} />
        {scan ? <rect x="494" y="296" width="96" height="10" rx="5" fill="#ff3b3b" opacity={0.55 + 0.4 * Math.sin(frame)} /> : null}
      </g>
      {/* basket on belt */}
      <FruitBasket x={move} y={410} s={0.78} ribbon="#2f6bff" label="ETF" />
      {/* success badge */}
      <g transform={`translate(800 260) scale(${ok})`}>
        <circle r="84" fill="#5ccf6b" {...S} />
        <path d="M-40,2 L-10,34 L44,-30" fill="none" stroke="#fff" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Sparkle x={870} y={180} size={24} delay={10} />
      </g>
    </g>
  );
};

const Shelf: React.FC = () => {
  const frame = useCurrentFrame();
  const lift = useSpringAt(50, 10);
  const ribbons = ["#2f6bff", "#ff8a3d", "#5ccf6b", "#ff7ab8"];
  const baskets: React.ReactNode[] = [];
  [0, 1].forEach((row) => {
    ribbons.forEach((color, i) => {
      const pop = spring({ frame: frame - (row * 4 + i) * 3, fps: 30, config: { damping: 12 } });
      const picked = row === 0 && i === 2;
      const bx = 150 + i * 230;
      const by = row === 0 ? 165 : 385;
      const dy = picked ? interpolate(lift, [0, 1], [0, -70]) : 0;
      const ds = picked ? interpolate(lift, [0, 1], [0.5, 0.62]) : 0.5;
      baskets.push(
        <g key={`${row}-${i}`} opacity={pop} transform={`translate(${bx} ${by + dy + (1 - pop) * 40})`}>
          <g transform={`scale(${ds})`}>
            <BasketHandle />
            <Apple x={-80} y={-10} s={0.9} />
            <Orange x={70} y={-6} s={0.85} />
            <BasketBody ribbon={color} />
          </g>
        </g>,
      );
    });
  });
  return (
    <g>
      <rect x="40" y="252" width="920" height="26" rx="10" fill="url(#gWood)" {...S} />
      <rect x="40" y="472" width="920" height="26" rx="10" fill="url(#gWood)" {...S} />
      <rect x="40" y="498" width="40" height="90" fill="#9a6a3d" {...S} strokeWidth={5} />
      <rect x="920" y="498" width="40" height="90" fill="#9a6a3d" {...S} strokeWidth={5} />
      {baskets}
      <Sparkle x={640} y={70} size={28} delay={0} color="#fff7b0" />
      <Sparkle x={740} y={120} size={20} delay={8} />
      <Sparkle x={540} y={130} size={18} delay={15} />
    </g>
  );
};

const Bag: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = useSpringAt(4);
  const rays = Array.from({ length: 12 }, (_, i) => i);
  return (
    <g>
      {/* sun */}
      <g transform={`translate(840 140) rotate(${frame * 0.8})`}>
        {rays.map((i) => (
          <rect key={i} x="-8" y="-100" width="16" height="34" rx="8" fill="#ffd84d" {...S} strokeWidth={4} transform={`rotate(${i * 30})`} />
        ))}
        <circle r="56" fill="#ffd84d" {...S} />
      </g>
      <Cloud x={160} y={140} s={0.8} />
      <g transform="translate(0 -75)">
      {/* table */}
      <rect x="40" y="590" width="920" height="40" rx="14" fill="url(#gWood)" {...S} />
      <rect x="120" y="630" width="30" height="60" fill="#9a6a3d" {...S} strokeWidth={5} />
      <rect x="850" y="630" width="30" height="60" fill="#9a6a3d" {...S} strokeWidth={5} />
      {/* bag */}
      <g transform={`translate(500 590) scale(${pop}) translate(-500 -590)`}>
        <path d="M400,300 C400,190 600,190 600,300" fill="none" stroke={INK} strokeWidth="22" strokeLinecap="round" />
        <g transform="translate(500 330) scale(0.8)">
          <BasketHandle />
          <Grapes x={-100} y={-30} s={0.95} />
          <Banana x={90} y={-34} s={0.95} />
          <Pear x={20} y={-50} s={0.9} />
          <Apple x={-50} y={-4} s={0.95} />
        </g>
        <path d="M320,360 L680,360 L710,590 L290,590 Z" fill="#ffcf7a" {...S} />
        <path d="M320,360 L680,360 L670,420 L330,420 Z" fill="#ffb84a" {...S} strokeWidth={5} />
        <circle cx="500" cy="500" r="52" fill="#fff" {...S} />
        <text x="500" y="518" textAnchor="middle" fontFamily={fontFamily} fontSize="50" fill="#ff6b6b">♥</text>
      </g>
      </g>
      <Sparkle x={250} y={360} delay={2} />
      <Sparkle x={760} y={330} size={28} delay={9} color="#fff7b0" />
      <Sparkle x={690} y={190} size={20} delay={16} />
    </g>
  );
};

/* ---------- 2nd video: pizza / dividend / buyback ---------- */

const Coin: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r="30" fill="#ffd84d" {...S} strokeWidth={6} />
    <circle r="20" fill="none" stroke="#e0a800" strokeWidth="4" />
    <text y="10" textAnchor="middle" fontFamily={fontFamily} fontSize="28" fill="#b07a00">₩</text>
  </g>
);

const polar = (cx: number, cy: number, r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;

const Slice: React.FC<{ cx: number; cy: number; r: number; a0: number; a1: number; glow?: boolean }> = ({ cx, cy, r, a0, a1, glow }) => {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  const [px, py] = polar(cx, cy, r * 0.6, (a0 + a1) / 2);
  const d = `M${cx},${cy} L${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1} Z`;
  const arc = `M${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1}`;
  return (
    <g>
      {glow ? <path d={d} fill="none" stroke="#ff8a3d" strokeWidth="16" strokeLinejoin="round" opacity="0.9" /> : null}
      <path d={d} fill={glow ? "#ffe58a" : "#ffd35c"} {...S} strokeWidth={5} />
      <path d={arc} fill="none" stroke={INK} strokeWidth="26" strokeLinecap="butt" />
      <path d={arc} fill="none" stroke="#e8a04a" strokeWidth="16" strokeLinecap="butt" />
      <circle cx={px} cy={py} r={r * 0.1} fill="#e8473d" {...S} strokeWidth={3} />
    </g>
  );
};

const Pie: React.FC<{ cx: number; cy: number; r: number; n: number; skip?: number; hi?: number; spin?: number }> = ({ cx, cy, r, n, skip = -1, hi = -1, spin = 0 }) => {
  const step = (Math.PI * 2) / n;
  return (
    <g>
      <ellipse cx={cx} cy={cy + r + 26} rx={r * 1.05} ry="20" fill="#000" opacity="0.12" />
      {Array.from({ length: n }, (_, i) => (i === skip ? null : <Slice key={i} cx={cx} cy={cy} r={r} a0={-Math.PI / 2 + spin + i * step} a1={-Math.PI / 2 + spin + (i + 1) * step} glow={i === hi} />))}
    </g>
  );
};

const Tag: React.FC<{ x: number; y: number; text: string; color?: string; size?: number }> = ({ x, y, text, color = "#fff", size = 44 }) => {
  const w = text.length * size * 0.95 + 50;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2} y={-size * 0.9} width={w} height={size * 1.6} rx="22" fill={color} {...S} strokeWidth={6} />
      <text x="0" y={size * 0.28} textAnchor="middle" fontFamily={fontFamily} fontSize={size} fill={color === "#fff" ? INK : "#fff"}>{text}</text>
    </g>
  );
};

const Office: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-110,-190 L0,-270 L110,-190 Z" fill="#ff6b6b" {...S} />
    <rect x="-100" y="-190" width="200" height="240" rx="10" fill="#7fb7ff" {...S} />
    {[0, 1, 2].map((r) => [0, 1].map((c) => (
      <rect key={`${r}${c}`} x={-70 + c * 78} y={-160 + r * 62} width="54" height="44" rx="8" fill="#fff3b0" {...S} strokeWidth={5} />
    )))}
    <rect x="-24" y="-8" width="48" height="58" rx="8" fill="#c98d49" {...S} strokeWidth={5} />
  </g>
);

const Pizza: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = useSpringAt(4);
  const q = useSpringAt(24, 8);
  const bob = Math.sin(frame / 12) * 8;
  return (
    <g>
      <Cloud x={160} y={140} s={0.9} />
      <Cloud x={860} y={110} s={0.7} />
      <rect x="40" y="560" width="920" height="40" rx="14" fill="url(#gWood)" {...S} />
      <g transform={`translate(430 ${330 + (1 - pop) * -200}) scale(${pop}) translate(-430 -330)`}>
        <Pie cx={430} cy={340} r={190} n={8} spin={Math.sin(frame / 30) * 0.05} />
      </g>
      {[[760, 440, 0], [850, 370, 8], [700, 500, 16]].map(([x, y, d], i) => (
        <g key={i} transform={`translate(0 ${Math.sin((frame + d) / 10) * 8})`}>
          <Coin x={x} y={y} s={0.9} />
        </g>
      ))}
      <g transform={`translate(780 ${200 + bob}) scale(${q})`}>
        <circle r="92" fill="#fff" {...S} />
        <path d="M-40,70 L-72,128 L10,86 Z" fill="#fff" {...S} />
        <circle r="86" fill="#fff" />
        <text x="0" y="40" textAnchor="middle" fontFamily={fontFamily} fontSize="120" fill="#ff8a3d">?</text>
      </g>
      <Sparkle x={220} y={380} delay={0} />
      <Sparkle x={640} y={140} size={22} delay={9} />
    </g>
  );
};

const Dividend: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = useSpringAt(2);
  const coins = Array.from({ length: 10 }, (_, i) => i);
  return (
    <g>
      <Cloud x={820} y={110} s={0.7} />
      <g transform={`translate(300 300) scale(${pop}) translate(-300 -300)`}>
        <Pie cx={300} cy={290} r={150} n={10} />
      </g>
      {coins.map((i) => {
        const p = spring({ frame: frame - (14 + i * 6), fps: 30, config: { damping: 15, stiffness: 90 } });
        const sx = 300 + 90 * Math.cos(-Math.PI / 2 + (i + 0.5) * ((Math.PI * 2) / 10));
        const sy = 290 + 90 * Math.sin(-Math.PI / 2 + (i + 0.5) * ((Math.PI * 2) / 10));
        const ex = 700 + (i % 3) * 52;
        const ey = 450 - Math.floor(i / 3) * 34;
        return (
          <g key={i} opacity={Math.min(1, p * 4)}>
            <Coin x={interpolate(p, [0, 1], [sx, ex])} y={interpolate(p, [0, 1], [sy, ey]) - Math.sin(p * Math.PI) * 120} s={0.62} />
          </g>
        );
      })}
      <Tag x={760} y={160} text="배당금" color="#2f6bff" />
      <Sparkle x={560} y={350} delay={3} />
      <Sparkle x={880} y={330} size={22} delay={11} color="#fff7b0" />
    </g>
  );
};

const Buyback: React.FC = () => {
  const fly = useSpringAt(36, 13);
  const poof = useSpringAt(66, 8);
  const flame = useSpringAt(70, 7);
  const n = 10;
  const idx = 2;
  const step = (Math.PI * 2) / n;
  const mid = -Math.PI / 2 + (idx + 0.5) * step;
  const pcx = 680;
  const pcy = 330;
  const r = 150;
  const [sx, sy] = polar(pcx, pcy, r * 0.6, mid);
  const tx = 230 - sx;
  const ty = 420 - sy;
  return (
    <g>
      <Cloud x={500} y={90} s={0.7} />
      <Office x={230} y={380} s={0.95} />
      <Pie cx={pcx} cy={pcy} r={r} n={n} skip={fly > 0.02 ? idx : -1} />
      {fly > 0.02 && poof < 0.6 ? (
        <g transform={`translate(${interpolate(fly, [0, 1], [0, tx])} ${interpolate(fly, [0, 1], [0, ty]) - Math.sin(fly * Math.PI) * 110}) rotate(${fly * 380} ${sx} ${sy}) translate(${sx} ${sy}) scale(${1 - poof * 1.2}) translate(${-sx} ${-sy})`}>
          <Slice cx={pcx} cy={pcy} r={r} a0={-Math.PI / 2 + idx * step} a1={-Math.PI / 2 + (idx + 1) * step} glow />
        </g>
      ) : null}
      <g opacity={Math.min(1, poof * 2)} transform={`translate(230 430) scale(${0.4 + poof * 0.9})`}>
        <path d="M0,-70 L18,-24 L66,-34 L34,4 L62,46 L12,30 L0,76 L-14,30 L-62,46 L-34,4 L-66,-34 L-18,-24 Z" fill="#ffd84d" {...S} strokeWidth={6} />
      </g>
      <g transform={`translate(230 120) scale(${flame * 1.1})`} opacity={Math.min(1, flame * 2)}>
        <path d="M0,-70 C30,-30 56,-10 40,30 C28,56 -28,56 -40,30 C-52,0 -20,-20 0,-70 Z" fill="#ff8a3d" {...S} />
        <path d="M0,-26 C14,-8 24,2 16,20 C10,30 -10,30 -16,20 C-22,6 -8,-6 0,-26 Z" fill="#ffd84d" {...S} strokeWidth={4} />
      </g>
      <Tag x={680} y={590} text="회사가 사들여요" />
      <Sparkle x={420} y={250} delay={4} />
    </g>
  );
};

const Bigger: React.FC = () => {
  const frame = useCurrentFrame();
  const left = useSpringAt(2);
  const right = useSpringAt(30, 9);
  const arrow = useSpringAt(22);
  const pulse = 1 + 0.04 * Math.sin(frame / 5);
  return (
    <g>
      <Cloud x={500} y={90} s={0.7} />
      <g transform={`translate(250 300) scale(${left}) translate(-250 -300)`}>
        <Pie cx={250} cy={300} r={125} n={10} hi={0} />
        <Tag x={250} y={520} text="1/10" />
      </g>
      <g transform={`translate(500 300) scale(${arrow})`}>
        <path d="M-60,0 L30,0 M0,-36 L40,0 L0,36" fill="none" stroke={INK} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform={`translate(750 300) scale(${right * pulse}) translate(-750 -300)`}>
        <Pie cx={750} cy={300} r={125} n={9} hi={0} />
        <Tag x={750} y={520} text="1/9" color="#ff8a3d" />
      </g>
      <Sparkle x={860} y={160} delay={0} color="#fff7b0" />
      <Sparkle x={620} y={420} size={20} delay={9} />
    </g>
  );
};

const Return: React.FC = () => {
  const frame = useCurrentFrame();
  const a1 = useSpringAt(18);
  const a2 = useSpringAt(34);
  const dash = -frame * 3;
  return (
    <g>
      <Cloud x={500} y={80} s={0.6} />
      <Office x={190} y={400} s={0.85} />
      <path d="M300,270 C420,200 480,180 560,190" fill="none" stroke={INK} strokeWidth="9" strokeDasharray="20 16" strokeDashoffset={dash} strokeLinecap="round" />
      <path d="M300,330 C420,420 480,440 560,440" fill="none" stroke={INK} strokeWidth="9" strokeDasharray="20 16" strokeDashoffset={dash} strokeLinecap="round" />
      <g transform={`translate(720 210) scale(${a1})`}>
        <Coin x={-40} y={20} s={1.2} />
        <Coin x={36} y={36} s={1.1} />
        <Coin x={-4} y={-30} s={1} />
        <Tag x={0} y={-110} text="배당" color="#2f6bff" />
      </g>
      <g transform={`translate(740 450) scale(${a2})`}>
        <Pie cx={0} cy={0} r={78} n={10} skip={3} />
        <Tag x={0} y={-130} text="소각" color="#ff8a3d" />
      </g>
      <Sparkle x={520} y={320} delay={4} />
      <Sparkle x={880} y={330} size={20} delay={12} color="#fff7b0" />
    </g>
  );
};

const Piggy: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = useSpringAt(4);
  const bounce = Math.abs(Math.sin(frame / 14)) * 10;
  return (
    <g>
      <Cloud x={160} y={140} s={0.8} />
      <g transform={`translate(0 ${-bounce}) translate(500 330) scale(${pop}) translate(-500 -330)`}>
        <ellipse cx="500" cy="570" rx="230" ry="22" fill="#000" opacity="0.13" />
        <path d="M720,350 C770,330 790,380 750,400" fill="none" stroke={INK} strokeWidth="10" strokeLinecap="round" />
        {[360, 440, 580, 660].map((x) => (
          <rect key={x} x={x - 26} y="460" width="52" height="90" rx="20" fill="#ff8fb3" {...S} />
        ))}
        <ellipse cx="500" cy="380" rx="230" ry="165" fill="#ffa8c4" {...S} />
        <path d="M330,260 L350,190 L420,240 Z" fill="#ff8fb3" {...S} />
        <path d="M600,240 L660,190 L680,270 Z" fill="#ff8fb3" {...S} />
        <ellipse cx="270" cy="390" rx="62" ry="50" fill="#ff8fb3" {...S} />
        <ellipse cx="256" cy="390" rx="9" ry="14" fill={INK} />
        <ellipse cx="290" cy="390" rx="9" ry="14" fill={INK} />
        <rect x="430" y="232" width="130" height="18" rx="9" fill={INK} />
        <Face x={400} y={340} s={1.25} />
        <ellipse cx="620" cy="320" rx="22" ry="34" fill="#fff" opacity="0.4" />
      </g>
      {[0, 1, 2].map((i) => {
        const p = ((frame + i * 28) % 84) / 84;
        return (
          <g key={i} opacity={p < 0.9 ? 1 : 0}>
            <Coin x={495} y={interpolate(p, [0, 1], [30, 250])} s={0.85} />
          </g>
        );
      })}
      <Sparkle x={820} y={190} size={28} delay={0} color="#fff7b0" />
      <Sparkle x={200} y={450} size={22} delay={8} />
      <Sparkle x={760} y={470} size={18} delay={14} />
    </g>
  );
};

/* ---------- topic pack 2: 기회비용 / 중앙은행 / IPO ---------- */

const Bowl: React.FC<{ x: number; y: number; s?: number; soup: string; label: string; ghost?: number }> = ({ x, y, s = 1, soup, label, ghost = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={ghost}>
    <ellipse cx="0" cy="118" rx="140" ry="16" fill="#000" opacity="0.13" />
    <path d="M-140,0 L140,0 C140,96 76,120 0,120 C-76,120 -140,96 -140,0 Z" fill="#fff" {...S} />
    <ellipse cx="0" cy="0" rx="140" ry="34" fill={soup} {...S} />
    <path d="M-80,-6 C-50,-26 -30,12 0,-6 C30,-24 50,10 84,-8" fill="none" stroke="#fff3c4" strokeWidth="9" strokeLinecap="round" />
    <path d="M-60,8 C-30,-8 -10,20 20,6 C40,-4 56,12 70,4" fill="none" stroke="#fff3c4" strokeWidth="7" strokeLinecap="round" />
    <Face x={0} y={70} s={0.85} />
    {label ? <Tag x={0} y={190} text={label} size={40} /> : null}
  </g>
);

const Choice: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useSpringAt(4);
  const b = useSpringAt(12);
  const q = useSpringAt(24, 8);
  const bob = Math.sin(frame / 12) * 8;
  return (
    <g>
      <Cloud x={500} y={90} s={0.7} />
      <g transform={`translate(250 300) scale(${a}) translate(-250 -300)`}>
        <Bowl x={250} y={300} soup="#5a3a22" label="짜장면" />
      </g>
      <g transform={`translate(750 300) scale(${b}) translate(-750 -300)`}>
        <Bowl x={750} y={300} soup="#ff5a3d" label="짬뽕" />
      </g>
      <g transform={`translate(500 ${150 + bob}) scale(${q})`}>
        <circle r="62" fill="#fff" {...S} />
        <text x="0" y="28" textAnchor="middle" fontFamily={fontFamily} fontSize="86" fill="#ff8a3d">?</text>
      </g>
      <Sparkle x={130} y={140} delay={0} />
      <Sparkle x={880} y={150} size={22} delay={9} color="#fff7b0" />
    </g>
  );
};

const Noodle: React.FC = () => {
  const a = useSpringAt(2);
  const check = useSpringAt(20, 8);
  const lost = useSpringAt(34, 10);
  return (
    <g>
      <Cloud x={500} y={90} s={0.7} />
      <g transform={`translate(250 300) scale(${a}) translate(-250 -300)`}>
        <Bowl x={250} y={300} soup="#5a3a22" label="짜장면" />
      </g>
      <g transform={`translate(335 190) scale(${check})`}>
        <circle r="48" fill="#5ccf6b" {...S} />
        <path d="M-22,2 L-6,20 L26,-18" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Bowl x={750} y={300} soup="#ff5a3d" label="짬뽕" ghost={0.35 + 0.65 * (1 - lost)} />
      <g transform={`translate(750 300) scale(${lost})`} opacity={Math.min(1, lost * 2)}>
        <path d="M-60,-60 L60,60 M60,-60 L-60,60" stroke="#ff4d4d" strokeWidth="18" strokeLinecap="round" />
      </g>
      <g transform={`translate(500 565) scale(${lost})`}>
        <Tag x={0} y={0} text="포기한 짬뽕 = 기회비용" color="#ff8a3d" size={38} />
      </g>
    </g>
  );
};

const Phone: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = useSpringAt(2);
  const t1 = useSpringAt(14);
  const t2 = useSpringAt(26);
  return (
    <g>
      <Cloud x={500} y={80} s={0.7} />
      <g transform={`translate(500 330) scale(${pop}) translate(-500 -330)`}>
        <rect x="410" y="170" width="180" height="320" rx="34" fill="#7fb7ff" {...S} />
        <rect x="428" y="204" width="144" height="236" rx="14" fill="#fff" {...S} strokeWidth={5} />
        <circle cx="500" cy="466" r="10" fill="#fff" {...S} strokeWidth={4} />
        <Face x={500} y={320} s={1.3} />
      </g>
      <g transform={`translate(190 250) scale(${t1})`}>
        <Tag x={0} y={0} text="50만 원" color="#ff6b6b" size={50} />
        <Tag x={0} y={92} text="내가 산 값" size={34} />
      </g>
      <g transform={`translate(810 250) scale(${t2})`}>
        <Tag x={0} y={0} text="30만 원" color="#2fa84f" size={50} />
        <Tag x={0} y={92} text="옆 가게" size={34} />
      </g>
      {[0, 1, 2].map((i) => {
        const p = Math.max(0, Math.min(1, (frame - (44 + i * 8)) / 26));
        return (
          <g key={i} opacity={p > 0 && p < 1 ? 1 : 0}>
            <Coin x={interpolate(p, [0, 1], [220, 760])} y={interpolate(p, [0, 1], [430, 380]) - Math.sin(p * Math.PI) * 120} s={0.8} />
          </g>
        );
      })}
      <Tag x={500} y={565} text="20만 원 차이 = 기회비용" color="#ff8a3d" size={38} />
      <Sparkle x={880} y={430} size={22} delay={6} color="#fff7b0" />
    </g>
  );
};

const Scale: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = useSpringAt(2);
  const tilt = Math.sin(frame / 22) * 7 + 5;
  const pan = (label: string, color: string, coins: boolean) => (
    <g>
      <path d="M0,0 L-70,120 M0,0 L70,120" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <path d="M-100,120 L100,120 C96,160 -96,160 -100,120 Z" fill={color} {...S} />
      {coins ? (
        <g>
          <Coin x={-34} y={90} s={0.8} />
          <Coin x={30} y={96} s={0.8} />
          <Coin x={-2} y={56} s={0.8} />
        </g>
      ) : (
        <g transform="translate(0 100) scale(0.34)">
          <Bowl x={0} y={-60} soup="#ff5a3d" label="" />
        </g>
      )}
      <Tag x={0} y={230} text={label} size={38} />
    </g>
  );
  return (
    <g>
      <Cloud x={160} y={110} s={0.8} />
      <Cloud x={860} y={150} s={0.6} />
      <g transform={`translate(500 330) scale(${pop}) translate(-500 -330)`}>
        <ellipse cx="500" cy="590" rx="190" ry="20" fill="#000" opacity="0.14" />
        <path d="M440,590 L460,230 L540,230 L560,590 Z" fill="url(#gWood)" {...S} />
        <g transform={`translate(500 210) rotate(${tilt})`}>
          <rect x="-300" y="-14" width="600" height="28" rx="14" fill="#ffd84d" {...S} />
          <g transform={`translate(-300 14) rotate(${-tilt})`}>{pan("얻는 것", "#7fb7ff", true)}</g>
          <g transform={`translate(300 14) rotate(${-tilt})`}>{pan("포기하는 것", "#ffb3c1", false)}</g>
        </g>
        <circle cx="500" cy="210" r="30" fill="#ffd84d" {...S} />
      </g>
      <Sparkle x={500} y={90} size={24} delay={4} color="#fff7b0" />
    </g>
  );
};

const Columns: React.FC<{ x: number; y: number; s?: number; roof?: string; label?: string }> = ({ x, y, s = 1, roof = "#ff6b6b", label }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-190,-110 L0,-210 L190,-110 Z" fill={roof} {...S} />
    <rect x="-190" y="-110" width="380" height="30" rx="8" fill="#fff" {...S} />
    {[-132, -66, 0, 66, 132].map((cx) => (
      <rect key={cx} x={cx - 20} y="-80" width="40" height="160" rx="10" fill="#fff" {...S} strokeWidth={5} />
    ))}
    <rect x="-205" y="80" width="410" height="30" rx="10" fill="#e5e7ee" {...S} />
    <rect x="-225" y="110" width="450" height="30" rx="10" fill="#d4d8e4" {...S} />
    {label ? <Tag x={0} y={-132} text={label} size={34} color="#2f6bff" /> : null}
  </g>
);

const Person: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = "#ffb870" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-50,90 C-50,30 50,30 50,90 Z" fill={color} {...S} />
    <circle cx="0" cy="-8" r="38" fill="#ffe0c2" {...S} />
    <Face x={0} y={-4} s={0.7} />
  </g>
);

const Megaphone: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = useSpringAt(2);
  const bubble = useSpringAt(14, 8);
  const draw = Math.max(0, Math.min(1, (frame - 24) / 50));
  const shake = Math.sin(frame / 3) * 3 * draw;
  return (
    <g>
      <Cloud x={140} y={110} s={0.7} />
      <g transform={`translate(240 400) scale(${pop}) translate(-240 -400)`}>
        <Person x={240} y={430} s={1.5} color="#7fb7ff" />
        <rect x="150" y="520" width="180" height="100" rx="14" fill="url(#gWood)" {...S} />
        <path d="M318,400 L396,360 L396,450 L318,430 Z" fill="#ffd84d" {...S} />
      </g>
      <g transform={`translate(430 190) scale(${bubble})`}>
        <path d="M-120,-60 H150 a30,30 0 0 1 30,30 V40 a30,30 0 0 1 -30,30 H-60 L-110,110 L-100,70 H-120 a30,30 0 0 1 -30,-30 V-30 a30,30 0 0 1 30,-30 Z" fill="#fff" {...S} />
        <text x="15" y="30" textAnchor="middle" fontFamily={fontFamily} fontSize="62" fill="#2f6bff">금리는?</text>
      </g>
      <g transform={`translate(${620 + shake} 330)`}>
        <rect x="0" y="0" width="340" height="230" rx="24" fill="#fff" {...S} />
        <path pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} d="M24,170 L80,120 L130,150 L190,60 L240,130 L290,40 L320,80" fill="none" stroke="#ff4d4d" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Tag x={790} y={300} text="주가 요동" color="#ff8a3d" size={38} />
      <Sparkle x={560} y={300} delay={3} />
    </g>
  );
};

const CBank: React.FC = () => {
  const frame = useCurrentFrame();
  const top = useSpringAt(2);
  const b1 = useSpringAt(18);
  const b2 = useSpringAt(26);
  const nope = useSpringAt(40, 8);
  const dash = -frame * 3;
  return (
    <g>
      <Cloud x={140} y={90} s={0.6} />
      <Cloud x={880} y={100} s={0.6} />
      <g transform={`translate(500 260) scale(${top * 0.85}) translate(-500 -260)`}>
        <Columns x={500} y={205} label="중앙은행" />
      </g>
      <path d="M440,345 C400,390 330,400 285,410" fill="none" stroke={INK} strokeWidth="8" strokeDasharray="18 14" strokeDashoffset={dash} strokeLinecap="round" />
      <path d="M560,345 C600,390 670,400 715,410" fill="none" stroke={INK} strokeWidth="8" strokeDasharray="18 14" strokeDashoffset={dash} strokeLinecap="round" />
      <g transform={`translate(230 505) scale(${b1})`}>
        <Office x={0} y={0} s={0.42} />
        <Tag x={0} y={60} text="은행" size={34} />
      </g>
      <g transform={`translate(770 505) scale(${b2})`}>
        <Office x={0} y={0} s={0.42} />
        <Tag x={0} y={60} text="은행" size={34} />
      </g>
      <g transform={`translate(880 250) scale(${nope})`}>
        <Person x={0} y={0} s={0.9} color="#ffb3c1" />
        <path d="M-60,-70 L60,90 M60,-70 L-60,90" stroke="#ff4d4d" strokeWidth="14" strokeLinecap="round" />
        <Tag x={0} y={140} text="개인 ✕" size={32} />
      </g>
    </g>
  );
};

const Fed: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = useSpringAt(2);
  const crown = useSpringAt(22, 8);
  const bob = Math.sin(frame / 12) * 6;
  return (
    <g>
      <Cloud x={160} y={110} s={0.7} />
      <Cloud x={860} y={150} s={0.6} />
      <g transform={`translate(500 330) scale(${pop}) translate(-500 -330)`}>
        <Columns x={500} y={380} s={1.0} roof="#2f6bff" label="미국 연준" />
      </g>
      <g transform={`translate(500 ${120 + bob}) scale(${crown})`}>
        <path d="M-70,30 L-80,-30 L-36,0 L0,-50 L36,0 L80,-30 L70,30 Z" fill="#ffd84d" {...S} />
        <circle cx="-80" cy="-34" r="9" fill="#ff6b6b" {...S} strokeWidth={4} />
        <circle cx="0" cy="-54" r="9" fill="#ff6b6b" {...S} strokeWidth={4} />
        <circle cx="80" cy="-34" r="9" fill="#ff6b6b" {...S} strokeWidth={4} />
      </g>
      <Tag x={500} y={570} text="세계 경제 대통령?" color="#ff8a3d" size={38} />
      <Sparkle x={250} y={300} size={24} delay={4} color="#fff7b0" />
      <Sparkle x={760} y={330} size={20} delay={11} />
    </g>
  );
};

const Globe: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = useSpringAt(2);
  const shake = Math.sin(frame / 2.2) * 3;
  const mini = (x: number, y: number, up: boolean, d: number) => {
    const p = Math.max(0, Math.min(1, (frame - d) / 18));
    return (
      <g transform={`translate(${x} ${y}) scale(${p})`}>
        <rect x="-70" y="-50" width="140" height="100" rx="16" fill="#fff" {...S} strokeWidth={5} />
        <path d={up ? "M-46,28 L-14,-4 L8,12 L44,-26" : "M-46,-26 L-14,4 L8,-12 L44,28"} fill="none" stroke={up ? "#ff4d4d" : "#2f6bff"} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  };
  return (
    <g>
      <Cloud x={500} y={70} s={0.6} />
      <g transform={`translate(${500 + shake} 340) scale(${pop})`}>
        <circle r="170" fill="#7fb7ff" {...S} />
        <path d="M-120,-60 C-80,-110 -30,-100 -10,-60 C0,-30 -50,-10 -80,-20 C-110,-24 -130,-40 -120,-60 Z" fill="#5ccf6b" {...S} strokeWidth={5} />
        <path d="M30,20 C70,-20 120,-10 130,30 C134,70 80,100 50,80 C24,64 14,40 30,20 Z" fill="#5ccf6b" {...S} strokeWidth={5} />
        <path d="M-70,90 C-40,70 -10,90 -20,120 C-34,140 -70,130 -70,90 Z" fill="#5ccf6b" {...S} strokeWidth={5} />
        <ellipse cx="-70" cy="-100" rx="24" ry="38" fill="#fff" opacity="0.45" transform="rotate(30 -70 -100)" />
        <Face x={10} y={-30} s={1.5} />
      </g>
      {mini(180, 200, true, 12)}
      {mini(820, 190, false, 20)}
      {mini(170, 470, false, 28)}
      {mini(830, 480, true, 36)}
      <Tag x={500} y={570} text="전 세계 증시 요동" color="#ff8a3d" size={40} />
    </g>
  );
};

const News: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = useSpringAt(2);
  const lens = useSpringAt(20, 9);
  const wob = Math.sin(frame / 10) * 6;
  return (
    <g>
      <Cloud x={150} y={120} s={0.7} />
      <g transform={`translate(430 330) scale(${pop}) translate(-430 -330)`}>
        <rect x="200" y="100" width="460" height="480" rx="26" fill="#fff" {...S} />
        <rect x="236" y="136" width="388" height="70" rx="14" fill="#2f6bff" {...S} strokeWidth={5} />
        <text x="430" y="188" textAnchor="middle" fontFamily={fontFamily} fontSize="46" fill="#fff">경제 뉴스</text>
        {[240, 290, 340, 450, 500].map((y) => (
          <rect key={y} x="236" y={y} width={y % 100 === 40 ? 250 : 388} height="22" rx="11" fill="#d4d8e4" />
        ))}
        <rect x="236" y="382" width="388" height="48" rx="12" fill="#fff3b0" {...S} strokeWidth={4} />
        <text x="430" y="418" textAnchor="middle" fontFamily={fontFamily} fontSize="34" fill={INK}>연준 발표</text>
      </g>
      <g transform={`translate(${690 + wob} ${440 - wob}) scale(${lens})`}>
        <circle r="78" fill="#cfe6ff" opacity="0.7" {...S} />
        <path d="M54,54 L120,120" stroke={INK} strokeWidth="22" strokeLinecap="round" />
      </g>
      <Sparkle x={830} y={190} size={26} delay={6} color="#fff7b0" />
    </g>
  );
};

const Ipo: React.FC = () => {
  const frame = useCurrentFrame();
  const open = useSpringAt(16, 14);
  const label = useSpringAt(34, 9);
  const beam = 0.35 + 0.15 * Math.sin(frame / 8);
  return (
    <g>
      <path d="M500,0 L300,560 L700,560 Z" fill="#fff7b0" opacity={beam} />
      <rect x="40" y="520" width="920" height="40" rx="14" fill="url(#gWood)" {...S} />
      <Office x={500} y={470} s={1.25} />
      <g transform={`translate(${-open * 250} 0)`}>
        <path d="M120,40 L500,40 L500,590 L120,590 C160,420 160,200 120,40 Z" fill="#ff6b6b" {...S} />
        <path d="M250,40 C270,240 270,400 240,590 M370,40 C380,240 380,400 360,590" fill="none" stroke="#d94a4a" strokeWidth="8" />
      </g>
      <g transform={`translate(${open * 250} 0)`}>
        <path d="M880,40 L500,40 L500,590 L880,590 C840,420 840,200 880,40 Z" fill="#ff6b6b" {...S} />
        <path d="M750,40 C730,240 730,400 760,590 M630,40 C620,240 620,400 640,590" fill="none" stroke="#d94a4a" strokeWidth="8" />
      </g>
      <g transform={`translate(500 585) scale(${label})`}>
        <Tag x={0} y={0} text="IPO 기업 공개!" color="#2f6bff" size={46} />
      </g>
      <Sparkle x={200} y={160} delay={2} />
      <Sparkle x={800} y={200} size={26} delay={8} color="#fff7b0" />
    </g>
  );
};

const Launch: React.FC = () => {
  const frame = useCurrentFrame();
  const t = Math.max(0, Math.min(1, (frame - 14) / 70));
  const x = interpolate(t, [0, 1], [150, 850]);
  const hop = Math.abs(Math.sin(t * Math.PI * 3)) * 130;
  const pass = useSpringAt(70, 9);
  return (
    <g>
      <Cloud x={500} y={90} s={0.7} />
      <rect x="40" y="500" width="920" height="40" rx="14" fill="url(#gWood)" {...S} />
      {[330, 500, 670].map((hx) => (
        <g key={hx} transform={`translate(${hx} 500)`}>
          <rect x="-8" y="-90" width="16" height="90" fill="#fff" {...S} strokeWidth={5} />
          <rect x="-70" y="-110" width="140" height="26" rx="8" fill="#ff6b6b" {...S} strokeWidth={5} />
        </g>
      ))}
      <g transform={`translate(${x} ${430 - hop})`}>
        <rect x="-70" y="-70" width="140" height="140" rx="22" fill="#7fb7ff" {...S} />
        <path d="M-70,-20 H70" stroke={INK} strokeWidth="6" />
        <Face x={0} y={22} s={0.9} />
        <g transform="translate(60 -80) rotate(14)">
          <path d="M0,-40 L12,-14 L40,-18 L22,4 L38,28 L8,20 L-4,46 L-12,20 L-40,28 L-22,4 L-38,-18 L-10,-14 Z" fill="#ffd84d" {...S} strokeWidth={5} />
        </g>
      </g>
      <g transform={`translate(840 230) scale(${pass})`}>
        <Tag x={0} y={0} text="심사 통과!" color="#2fa84f" size={40} />
      </g>
      <Tag x={500} y={575} text="까다로운 허들을 넘어야 상장" size={34} />
    </g>
  );
};

const Market: React.FC = () => {
  const frame = useCurrentFrame();
  const top = useSpringAt(2);
  const l = useSpringAt(16);
  const r = useSpringAt(26);
  const sw = Math.sin(frame / 10) * 14;
  return (
    <g>
      <Cloud x={150} y={100} s={0.6} />
      <Cloud x={860} y={90} s={0.6} />
      <g transform={`translate(500 240) scale(${top * 0.8}) translate(-500 -240)`}>
        <Columns x={500} y={230} label="거래소" roof="#2fa84f" />
      </g>
      <g transform={`translate(190 410) scale(${l})`}>
        <Person x={0} y={0} s={1} color="#7fb7ff" />
        <Tag x={0} y={140} text="사요" size={36} color="#2f6bff" />
      </g>
      <g transform={`translate(810 410) scale(${r})`}>
        <Person x={0} y={0} s={1} color="#ffb870" />
        <Tag x={0} y={140} text="팔아요" size={36} color="#ff8a3d" />
      </g>
      <g transform={`translate(${500 + sw} 420)`}>
        <rect x="-70" y="-44" width="140" height="88" rx="16" fill="#fff" {...S} />
        <text x="0" y="14" textAnchor="middle" fontFamily={fontFamily} fontSize="44" fill={INK}>주식</text>
      </g>
      <Sparkle x={500} y={540} size={22} delay={5} color="#fff7b0" />
    </g>
  );
};

/* ---------- topic pack 3: 레버리지 ---------- */

const Lever: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = useSpringAt(2);
  const press = useSpringAt(18, 9);
  const ang = -7 + press * 17 + Math.sin(frame / 14) * 1.5;
  const tag = useSpringAt(34, 9);
  return (
    <g>
      <Cloud x={150} y={110} s={0.7} />
      <Cloud x={860} y={130} s={0.6} />
      <g transform={`translate(500 330) scale(${pop}) translate(-500 -330)`}>
        <ellipse cx="400" cy="560" rx="260" ry="18" fill="#000" opacity="0.14" />
        <g transform={`rotate(${ang} 400 470)`}>
          <rect x="60" y="450" width="640" height="34" rx="14" fill="url(#gWood)" {...S} />
          <g transform="translate(120 400)">
            <Coin x={0} y={0} s={0.9} />
          </g>
          <g transform="translate(610 360)">
            <rect x="-62" y="-62" width="124" height="124" rx="20" fill="#7fb7ff" {...S} />
            <path d="M-62,-14 H62" stroke={INK} strokeWidth="6" />
            <Face x={0} y={24} s={0.9} />
          </g>
        </g>
        <path d="M400,470 L330,560 L470,560 Z" fill="#ffd84d" {...S} />
      </g>
      <g transform={`translate(500 ${600}) scale(${tag})`}>
        <Tag x={0} y={0} text="작은 힘 → 큰 효과" color="#ff8a3d" size={38} />
      </g>
      <Sparkle x={820} y={250} size={24} delay={6} color="#fff7b0" />
    </g>
  );
};

const Double: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useSpringAt(4);
  const arrow = useSpringAt(20);
  const b = useSpringAt(32, 9);
  const pulse = 1 + 0.04 * Math.sin(frame / 5);
  return (
    <g>
      <Cloud x={500} y={90} s={0.6} />
      <g transform={`translate(230 360) scale(${a}) translate(-230 -360)`}>
        <Coin x={230} y={340} s={2.2} />
        <Tag x={230} y={500} text="투자 100원" size={38} />
      </g>
      <g transform={`translate(500 340) scale(${arrow})`}>
        <path d="M-70,0 L40,0 M6,-40 L50,0 L6,40" fill="none" stroke={INK} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        <Tag x={0} y={-90} text="2배" color="#2f6bff" size={44} />
      </g>
      <g transform={`translate(770 360) scale(${b * pulse}) translate(-770 -360)`}>
        <Coin x={700} y={380} s={1.9} />
        <Coin x={830} y={380} s={1.9} />
        <Coin x={765} y={290} s={1.9} />
        <Tag x={770} y={500} text="효과는 200원" color="#ff8a3d" size={38} />
      </g>
      <Sparkle x={500} y={560} size={22} delay={8} color="#fff7b0" />
    </g>
  );
};

const Risk: React.FC = () => {
  const bar1 = useSpringAt(8, 14);
  const bar2 = useSpringAt(24, 14);
  const t = useSpringAt(44, 8);
  return (
    <g>
      <Cloud x={150} y={110} s={0.6} />
      <Cloud x={860} y={100} s={0.6} />
      <rect x="120" y="170" width="760" height="10" rx="5" fill={INK} />
      <g transform="translate(300 180)">
        <rect x="-70" y="0" width="140" height={bar1 * 130} rx="14" fill="#7fb7ff" {...S} />
        <Tag x={0} y={-40} text="시장 -10%" size={36} />
      </g>
      <g transform="translate(700 180)">
        <rect x="-70" y="0" width="140" height={bar2 * 260} rx="14" fill="#ff6b6b" {...S} />
        <Tag x={0} y={-40} text="2배 -20%" color="#ff4d4d" size={36} />
      </g>
      <g transform={`translate(500 560) scale(${t})`}>
        <Tag x={0} y={0} text="손실도 2배로 커져요" color="#ff8a3d" size={40} />
      </g>
    </g>
  );
};

/* ---------- topic pack 4: 선물 / 코스피·코스닥 ---------- */

const Gift: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = useSpringAt(2);
  const q = useSpringAt(22, 8);
  const hop = Math.abs(Math.sin(frame / 12)) * 14;
  return (
    <g>
      <Cloud x={150} y={110} s={0.7} />
      <Cloud x={860} y={130} s={0.6} />
      <g transform={`translate(0 ${-hop}) translate(500 340) scale(${pop}) translate(-500 -340)`}>
        <ellipse cx="500" cy="560" rx="200" ry="18" fill="#000" opacity="0.14" />
        <rect x="340" y="320" width="320" height="230" rx="22" fill="#ff8fb3" {...S} />
        <rect x="320" y="270" width="360" height="70" rx="18" fill="#ffb3c8" {...S} />
        <rect x="470" y="270" width="60" height="280" fill="#ffd84d" {...S} />
        <path d="M500,270 C440,200 380,230 420,270 Z M500,270 C560,200 620,230 580,270 Z" fill="#ffd84d" {...S} />
        <Face x={400} y={430} s={1.1} />
      </g>
      <g transform={`translate(780 220) scale(${q})`}>
        <circle r="64" fill="#fff" {...S} />
        <text x="0" y="30" textAnchor="middle" fontFamily={fontFamily} fontSize="90" fill="#ff8a3d">?</text>
      </g>
      <Tag x={500} y={590} text="공짜 선물이 아니에요" color="#ff8a3d" size={38} />
    </g>
  );
};

const Contract: React.FC = () => {
  const doc = useSpringAt(2);
  const stamp = useSpringAt(26, 7);
  const cal = useSpringAt(14);
  return (
    <g>
      <Cloud x={150} y={100} s={0.6} />
      <g transform={`translate(330 330) scale(${doc}) translate(-330 -330)`}>
        <rect x="170" y="110" width="320" height="400" rx="24" fill="#fff" {...S} />
        <text x="330" y="180" textAnchor="middle" fontFamily={fontFamily} fontSize="52" fill={INK}>계약서</text>
        {[230, 280, 330, 380].map((y) => <rect key={y} x="210" y={y} width={y === 380 ? 160 : 240} height="20" rx="10" fill="#d4d8e4" />)}
        <path d="M220,460 C250,420 270,480 300,440 C320,420 340,470 380,450" fill="none" stroke="#2f6bff" strokeWidth="8" strokeLinecap="round" />
      </g>
      <g transform={`translate(430 450) scale(${stamp}) rotate(-12)`}>
        <circle r="54" fill="none" stroke="#ff4d4d" strokeWidth="10" />
        <text x="0" y="14" textAnchor="middle" fontFamily={fontFamily} fontSize="40" fill="#ff4d4d">약속</text>
      </g>
      <g transform={`translate(740 290) scale(${cal})`}>
        <rect x="-110" y="-120" width="220" height="240" rx="22" fill="#fff" {...S} />
        <rect x="-110" y="-120" width="220" height="70" rx="22" fill="#ff6b6b" {...S} />
        <text x="0" y="-70" textAnchor="middle" fontFamily={fontFamily} fontSize="42" fill="#fff">미래</text>
        <text x="0" y="50" textAnchor="middle" fontFamily={fontFamily} fontSize="64" fill={INK}>1년 뒤</text>
      </g>
      <Tag x={500} y={575} text="미래 가격을 오늘 약속해요" color="#2f6bff" size={38} />
    </g>
  );
};

const Oil: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = useSpringAt(2);
  const price = useSpringAt(18, 8);
  const cal = useSpringAt(30);
  const dash = -frame * 3;
  return (
    <g>
      <Cloud x={500} y={80} s={0.6} />
      <g transform={`translate(260 380) scale(${pop}) translate(-260 -380)`}>
        <ellipse cx="260" cy="540" rx="140" ry="16" fill="#000" opacity="0.14" />
        <rect x="160" y="220" width="200" height="320" rx="30" fill="#4a4f5e" {...S} />
        <path d="M160,290 H360 M160,470 H360" stroke={INK} strokeWidth="7" />
        <Face x={260} y={380} s={1.4} />
        <path d="M260,160 C300,210 320,240 300,270 C280,290 240,290 220,270 C200,240 230,210 260,160 Z" fill="#ffd84d" {...S} strokeWidth={6} />
      </g>
      <g transform={`translate(560 220) scale(${price})`}>
        <Tag x={0} y={0} text="지금 가격 확정" color="#2f6bff" size={42} />
      </g>
      <path d="M380,330 C470,330 560,330 690,330" fill="none" stroke={INK} strokeWidth="8" strokeDasharray="18 14" strokeDashoffset={dash} strokeLinecap="round" />
      <g transform={`translate(790 330) scale(${cal})`}>
        <rect x="-90" y="-100" width="180" height="200" rx="20" fill="#fff" {...S} />
        <rect x="-90" y="-100" width="180" height="60" rx="20" fill="#ff6b6b" {...S} />
        <text x="0" y="-56" textAnchor="middle" fontFamily={fontFamily} fontSize="34" fill="#fff">도착</text>
        <text x="0" y="40" textAnchor="middle" fontFamily={fontFamily} fontSize="52" fill={INK}>1년 뒤</text>
      </g>
      <Tag x={640} y={560} text="석유 선물 계약" size={38} />
    </g>
  );
};

const WinLose: React.FC = () => {
  const frame = useCurrentFrame();
  const l = useSpringAt(4);
  const r = useSpringAt(14);
  const arrow = useSpringAt(30);
  const dash = -frame * 3;
  return (
    <g>
      <Cloud x={500} y={90} s={0.6} />
      <g transform={`translate(210 320) scale(${l})`}>
        <Person x={0} y={0} s={1.5} color="#7fb7ff" />
        <Tag x={0} y={170} text="이익 +" color="#2fa84f" size={40} />
        <Coin x={-110} y={-90} s={0.9} />
        <Coin x={110} y={-90} s={0.9} />
      </g>
      <g transform={`translate(790 320) scale(${r})`}>
        <Person x={0} y={0} s={1.5} color="#ffb3c1" />
        <Tag x={0} y={170} text="손실 -" color="#ff4d4d" size={40} />
      </g>
      <g transform={`translate(500 300) scale(${arrow})`}>
        <path d="M-120,0 H120 M80,-30 L120,0 L80,30" fill="none" stroke={INK} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="24 14" strokeDashoffset={dash} />
        <Tag x={0} y={-70} text="한쪽이 번 만큼" size={34} />
      </g>
    </g>
  );
};

const Kvs: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useSpringAt(2);
  const b = useSpringAt(12);
  const vs = useSpringAt(24, 8);
  return (
    <g>
      <Cloud x={500} y={80} s={0.6} />
      <g transform={`translate(250 400) scale(${a}) translate(-250 -400)`}>
        <Office x={250} y={440} s={1.0} />
        <Tag x={250} y={540} text="코스피" color="#2f6bff" size={42} />
      </g>
      <g transform={`translate(750 420) scale(${b}) translate(-750 -420)`}>
        <Office x={750} y={440} s={0.75} />
        <Tag x={750} y={540} text="코스닥" color="#2fa84f" size={42} />
      </g>
      <g transform={`translate(500 ${270 + Math.sin(frame / 10) * 6}) scale(${vs})`}>
        <circle r="62" fill="#ffd84d" {...S} />
        <text x="0" y="22" textAnchor="middle" fontFamily={fontFamily} fontSize="62" fill={INK}>VS</text>
      </g>
    </g>
  );
};

const Kospi: React.FC = () => {
  const a = useSpringAt(2);
  const b = useSpringAt(10);
  const c = useSpringAt(18);
  const tag = useSpringAt(30, 9);
  return (
    <g>
      <Cloud x={150} y={110} s={0.7} />
      <Cloud x={860} y={120} s={0.6} />
      <rect x="40" y="500" width="920" height="40" rx="14" fill="url(#gWood)" {...S} />
      <g transform={`translate(240 500) scale(${a}) translate(-240 -500)`}><Office x={240} y={500} s={1.1} /></g>
      <g transform={`translate(500 500) scale(${b}) translate(-500 -500)`}><Office x={500} y={500} s={1.3} /></g>
      <g transform={`translate(770 500) scale(${c}) translate(-770 -500)`}><Office x={770} y={500} s={1.0} /></g>
      <g transform={`translate(500 575) scale(${tag})`}>
        <Tag x={0} y={0} text="코스피: 대기업 중심" color="#2f6bff" size={36} />
      </g>
    </g>
  );
};

const Kosdaq: React.FC = () => {
  const frame = useCurrentFrame();
  const a = useSpringAt(2);
  const grow = useSpringAt(16, 9);
  const tag = useSpringAt(30, 9);
  return (
    <g>
      <Cloud x={150} y={110} s={0.7} />
      <Cloud x={860} y={120} s={0.6} />
      <rect x="40" y="500" width="920" height="40" rx="14" fill="url(#gWood)" {...S} />
      {[220, 500, 780].map((x, i) => (
        <g key={x} transform={`translate(${x} 500) scale(${a})`}>
          <Office x={0} y={0} s={0.7} />
          <g transform={`translate(0 ${-200 * 0.7 - 30 - Math.sin((frame + i * 9) / 8) * 6}) scale(${grow})`}>
            <path d="M0,0 V-50" stroke={INK} strokeWidth="8" strokeLinecap="round" />
            <path d="M0,-30 C-40,-40 -50,-80 -10,-90 C0,-60 0,-40 0,-30 Z M0,-40 C40,-50 50,-90 10,-100 C0,-70 0,-50 0,-40 Z" fill="#5ccf6b" {...S} strokeWidth={5} />
          </g>
        </g>
      ))}
      <g transform={`translate(500 575) scale(${tag})`}>
        <Tag x={0} y={0} text="코스닥: 성장하는 기업 중심" color="#2fa84f" size={34} />
      </g>
    </g>
  );
};

const Index: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = useSpringAt(2);
  const draw = Math.max(0, Math.min(1, (frame - 14) / 50));
  const tag = useSpringAt(46, 9);
  return (
    <g>
      <Cloud x={150} y={100} s={0.6} />
      <g transform={`translate(500 330) scale(${pop}) translate(-500 -330)`}>
        <rect x="140" y="120" width="720" height="360" rx="28" fill="#fff" {...S} />
        <path d="M200,420 H800 M200,330 H800 M200,240 H800" stroke="#e5e7ee" strokeWidth="6" />
        <path pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} d="M200,410 L300,360 L380,380 L480,300 L560,330 L680,220 L800,170" fill="none" stroke="#ff4d4d" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
        <text x="190" y="180" fontFamily={fontFamily} fontSize="52" fill={INK}>지수</text>
      </g>
      <g transform={`translate(500 560) scale(${tag})`}>
        <Tag x={0} y={0} text="시장 전체 흐름을 숫자 하나로" color="#ff8a3d" size={34} />
      </g>
    </g>
  );
};

/* ---------- interest-rate topic (2026-10-15) ---------- */

const Discount: React.FC = () => {
  const frame = useCurrentFrame();
  const left = useSpringAt(2);
  const arrow = useSpringAt(16);
  const right = useSpringAt(28, 9);
  const tag = useSpringAt(42, 9);
  return (
    <g>
      <Cloud x={500} y={90} s={0.6} />
      <g transform={`translate(230 340) scale(${left}) translate(-230 -340)`}>
        <Coin x={190} y={360} s={2.3} />
        <Coin x={290} y={300} s={1.6} />
        <Tag x={230} y={500} text="1년 뒤 100만 원" size={34} />
      </g>
      <g transform={`translate(500 340) scale(${arrow})`}>
        <path d="M-70,0 L40,0 M6,-40 L50,0 L6,40" fill="none" stroke={INK} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        <Tag x={0} y={-90} text="할인율" color="#2f6bff" size={40} />
      </g>
      <g transform={`translate(780 370) scale(${right * (1 + 0.03 * Math.sin(frame / 6))}) translate(-780 -370)`}>
        <Coin x={780} y={370} s={1.5} />
        <Tag x={780} y={500} text="지금 가치" color="#ff8a3d" size={34} />
      </g>
      <g transform={`translate(500 565) scale(${tag})`}>
        <Tag x={0} y={0} text="미래 돈을 지금 가치로 계산" color="#2fa84f" size={30} />
      </g>
    </g>
  );
};

const RatesUp: React.FC = () => {
  const frame = useCurrentFrame();
  const up = useSpringAt(2);
  const shrink = interpolate(frame, [14, 50], [2.4, 1.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tag = useSpringAt(46, 9);
  const bob = Math.sin(frame / 8) * 6;
  const fill = Math.min(1, frame / 40);
  return (
    <g>
      <Cloud x={150} y={110} s={0.7} />
      <g transform={`translate(260 380) scale(${up}) translate(-260 -380)`}>
        <rect x="200" y="150" width="120" height="360" rx="60" fill="#fff" {...S} />
        <rect x="236" y={150 + 360 - 60 - 220 * fill} width="48" height={60 + 220 * fill} rx="24" fill="#ff4d4d" />
        <circle cx="260" cy="510" r="52" fill="#ff4d4d" {...S} />
        <path d="M380,330 L380,180 M340,220 L380,170 L420,220" fill="none" stroke="#ff4d4d" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
        <Tag x={260} y={120} text="금리 ↑" color="#ff4d4d" size={44} />
      </g>
      <g transform={`translate(700 ${380 + bob})`}>
        <Coin x={0} y={0} s={shrink} />
      </g>
      <g transform={`translate(700 520) scale(${tag})`}>
        <Tag x={0} y={0} text="지금 가치 ↓" color="#2f6bff" size={36} />
      </g>
    </g>
  );
};

const Growth: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = useSpringAt(2);
  const sway = Math.sin(frame / 5) * Math.min(1, Math.max(0, (frame - 18) / 20)) * 9;
  const tag = useSpringAt(40, 9);
  return (
    <g>
      <Cloud x={150} y={110} s={0.7} />
      <g transform={`translate(500 500) scale(${pop}) translate(-500 -500)`}>
        <rect x="40" y="500" width="920" height="40" rx="14" fill="url(#gWood)" {...S} />
        <g transform={`rotate(${sway} 500 500)`}>
          <path d="M500,500 V250" stroke={INK} strokeWidth="14" strokeLinecap="round" />
          <path d="M500,380 C420,370 380,300 440,250 C500,290 510,340 500,380 Z" fill="#5ccf6b" {...S} />
          <path d="M500,330 C580,320 620,250 560,200 C500,240 490,290 500,330 Z" fill="#5ccf6b" {...S} />
          <Coin x={500} y={200} s={1.5} />
        </g>
        <path d="M720,260 C780,240 840,280 900,250 M700,330 C770,310 830,350 910,320" fill="none" stroke="#7aa6ff" strokeWidth="10" strokeLinecap="round" />
      </g>
      <g transform={`translate(500 565) scale(${tag})`}>
        <Tag x={0} y={0} text="꿈이 큰 성장주일수록 더 흔들려요" color="#ff8a3d" size={30} />
      </g>
    </g>
  );
};

const Prices: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = useSpringAt(2);
  const tag = useSpringAt(40, 9);
  const heights = [130, 210, 300];
  return (
    <g>
      <Cloud x={150} y={110} s={0.7} />
      <Cloud x={860} y={120} s={0.6} />
      <g transform={`translate(500 500) scale(${pop}) translate(-500 -500)`}>
        <rect x="60" y="500" width="880" height="40" rx="14" fill="url(#gWood)" {...S} />
        {heights.map((h, i) => {
          const g = Math.min(1, Math.max(0, (frame - 8 - i * 8) / 18));
          const hh = h * g;
          return (
            <g key={i}>
              <rect x={200 + i * 230} y={500 - hh} width="150" height={hh} rx="16" fill={["#ffd84d", "#ffa63d", "#ff6b6b"][i]} {...S} />
              <text x={275 + i * 230} y={500 - hh - 14} textAnchor="middle" fontFamily={fontFamily} fontSize="56" fill={INK}>₩</text>
            </g>
          );
        })}
      </g>
      <g transform={`translate(500 565) scale(${tag})`}>
        <Tag x={0} y={0} text="물가 상승 → 금리를 올려요" color="#ff4d4d" size={32} />
      </g>
    </g>
  );
};

const Debt: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = useSpringAt(2);
  const tag = useSpringAt(40, 9);
  return (
    <g>
      <Cloud x={150} y={110} s={0.7} />
      <Cloud x={860} y={120} s={0.6} />
      <rect x="40" y="500" width="920" height="40" rx="14" fill="url(#gWood)" {...S} />
      <g transform={`translate(500 500) scale(${pop}) translate(-500 -500)`}>
        <Columns x={500} y={500} s={1.7} roof="#7b8cff" label="정부" />
      </g>
      {[0, 1, 2, 3, 4].map((i) => {
        const t = ((frame + i * 9) % 60) / 60;
        const dir = i % 2 === 0 ? -1 : 1;
        return (
          <g key={i} transform={`translate(${500 + dir * (130 + t * 300)} ${380 - Math.sin(t * Math.PI) * 120 + t * 100})`} opacity={1 - t * 0.5}>
            <Coin x={0} y={0} s={0.9} />
          </g>
        );
      })}
      <g transform={`translate(500 565) scale(${tag})`}>
        <Tag x={0} y={0} text="풀린 돈이 많아지면 금리를 높여요" color="#2f6bff" size={30} />
      </g>
    </g>
  );
};

const AiInvest: React.FC = () => {
  const frame = useCurrentFrame();
  const bot = useSpringAt(2);
  const tag = useSpringAt(40, 9);
  return (
    <g>
      <Cloud x={150} y={110} s={0.7} />
      <g transform={`translate(700 360) scale(${bot}) translate(-700 -360)`}>
        <path d="M700,150 V210" stroke={INK} strokeWidth="10" strokeLinecap="round" />
        <circle cx="700" cy="140" r="16" fill="#ff6b6b" {...S} strokeWidth={5} />
        <rect x="590" y="210" width="220" height="190" rx="36" fill="#cfd8ff" {...S} />
        <rect x="630" y="250" width="140" height="70" rx="22" fill="#fff" {...S} strokeWidth={5} />
        <circle cx="668" cy="285" r="10" fill={INK} />
        <circle cx="732" cy="285" r="10" fill={INK} />
        <path d="M670,350 H730" stroke={INK} strokeWidth="8" strokeLinecap="round" />
        <rect x="620" y="400" width="160" height="120" rx="26" fill="#9fb0ff" {...S} />
        <text x="700" y="478" textAnchor="middle" fontFamily={fontFamily} fontSize="54" fill="#fff">AI</text>
      </g>
      {[0, 1, 2, 3].map((i) => {
        const t = ((frame + i * 12) % 48) / 48;
        return (
          <g key={i} transform={`translate(${130 + t * 380} ${430 - Math.sin(t * Math.PI) * 60})`}>
            <Coin x={0} y={0} s={1} />
          </g>
        );
      })}
      <g transform={`translate(500 565) scale(${tag})`}>
        <Tag x={0} y={0} text="돈 수요가 늘면 금리도 오르기 쉬워요" color="#ff8a3d" size={30} />
      </g>
    </g>
  );
};

const Productivity: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = useSpringAt(2);
  const tag = useSpringAt(40, 9);
  const stack = Math.min(5, Math.floor(Math.max(0, frame - 10) / 7));
  const arm = Math.sin(frame / 7) * 12;
  return (
    <g>
      <Cloud x={150} y={110} s={0.7} />
      <Cloud x={860} y={120} s={0.6} />
      <rect x="40" y="500" width="920" height="40" rx="14" fill="url(#gWood)" {...S} />
      <g transform={`translate(300 500) scale(${pop}) translate(-300 -500)`}>
        <rect x="190" y="330" width="220" height="170" rx="30" fill="#cfd8ff" {...S} />
        <circle cx="260" cy="395" r="14" fill={INK} />
        <circle cx="340" cy="395" r="14" fill={INK} />
        <path d="M265,450 H335" stroke={INK} strokeWidth="8" strokeLinecap="round" />
        <g transform={`rotate(${arm} 410 400)`}>
          <path d="M410,400 L520,340" stroke={INK} strokeWidth="26" strokeLinecap="round" />
          <circle cx="526" cy="336" r="22" fill="#ffd84d" {...S} strokeWidth={5} />
        </g>
      </g>
      {Array.from({ length: stack }).map((_, i) => (
        <g key={i}><Coin x={760} y={470 - i * 52} s={1.1} /></g>
      ))}
      <g transform={`translate(500 565) scale(${tag})`}>
        <Tag x={0} y={0} text="생산성이 커지면 전체 부(富)도 커져요" color="#2fa84f" size={30} />
      </g>
    </g>
  );
};

export const ART: Record<string, React.FC> = {
  discount: Discount,
  ratesup: RatesUp,
  growth: Growth,
  prices: Prices,
  debt: Debt,
  aiinvest: AiInvest,
  productivity: Productivity,
  shop: Shop,
  company: Company,
  basket: BasketScene,
  checkout: Checkout,
  shelf: Shelf,
  bag: Bag,
  pizza: Pizza,
  dividend: Dividend,
  buyback: Buyback,
  bigger: Bigger,
  return: Return,
  piggy: Piggy,
  choice: Choice,
  noodle: Noodle,
  phone: Phone,
  scale: Scale,
  megaphone: Megaphone,
  cbank: CBank,
  fed: Fed,
  globe: Globe,
  news: News,
  ipo: Ipo,
  launch: Launch,
  market: Market,
  lever: Lever,
  double: Double,
  risk: Risk,
  gift: Gift,
  contract: Contract,
  oil: Oil,
  winlose: WinLose,
  kvs: Kvs,
  kospi: Kospi,
  kosdaq: Kosdaq,
  index: Index,
};
