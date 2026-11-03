// Original vector illustrations — lit, glossy, "3D-ish" to match the mockup style.
import React, { useMemo } from 'react';

let seq = 0;
const useIds = (...names) => useMemo(() => {
  const n = ++seq; const o = {};
  names.forEach(k => { o[k] = `a${n}${k}`; });
  return o;
}, []);
const u = id => `url(#${id})`;

const Svg = ({ children, vb = '0 0 200 200', className = '', style }) => (
  <svg viewBox={vb} className={className} style={style} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">{children}</svg>
);

const SoftShadow = ({ id, std = 6 }) => (
  <filter id={id} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={std} /></filter>
);

/* ---------- Rank card (used in hero, ready screen, results) ---------- */
export function Laurel({ color = '#7A4A00', x = 0, y = 0, s = 1 }) {
  // Wreath: two branches curving up and out, leaves laid along the tangent.
  const out = [];
  for (const side of [-1, 1]) {
    const P0 = [side * -2, 8], P1 = [side * 26, 8], P2 = [side * 22, -20];
    const q = t => [0, 1].map(k => (1 - t) ** 2 * P0[k] + 2 * (1 - t) * t * P1[k] + t * t * P2[k]);
    const d = t => [0, 1].map(k => 2 * (1 - t) * (P1[k] - P0[k]) + 2 * t * (P2[k] - P1[k]));
    out.push(<path key={'b' + side} d={`M${P0[0]} ${P0[1]} Q ${P1[0]} ${P1[1]} ${P2[0]} ${P2[1]}`} stroke={color} strokeWidth="1.5" fill="none" />);
    for (let i = 0; i < 7; i++) {
      const t = 0.18 + i * 0.13; const [px, py] = q(t); const [dx, dy] = d(t);
      const ang = Math.atan2(dy, dx) * 180 / Math.PI; const flip = i % 2 ? 1 : -1;
      const nx = -dy, ny = dx; const L = Math.hypot(nx, ny) || 1;
      const cx = px + (nx / L) * 3.2 * flip, cy = py + (ny / L) * 3.2 * flip;
      out.push(<ellipse key={side + 'l' + i} cx={cx} cy={cy} rx="5.2" ry="2.2" transform={`rotate(${ang + flip * 28} ${cx} ${cy})`} fill={color} />);
    }
  }
  return <g transform={`translate(${x} ${y}) scale(${s})`}>{out}</g>;
}

export function RankCardArt({ n = 1, tone = 'gold', className = '', style }) {
  const id = useIds('f', 'e', 's', 'g', 'h');
  const tones = {
    gold:   { a: '#FFE58A', b: '#FFB300', c: '#B86E00', ink: '#6B3B00', edge: '#FFF3C4' },
    silver: { a: '#4A4A55', b: '#26262E', c: '#141418', ink: '#C9CBD6', edge: '#8A8C99' },
    bronze: { a: '#5A3A2A', b: '#33211A', c: '#1C120E', ink: '#E7B48F', edge: '#A0674A' },
    glass:  { a: 'rgba(255,255,255,0.20)', b: 'rgba(255,255,255,0.08)', c: 'rgba(255,255,255,0.04)', ink: 'rgba(255,255,255,0.85)', edge: 'rgba(255,255,255,0.45)' },
  };
  const t = tones[tone] || tones.gold;
  return (
    <Svg vb="0 0 120 170" className={className} style={style}>
      <defs>
        <linearGradient id={id.f} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={t.a} /><stop offset="0.55" stopColor={t.b} /><stop offset="1" stopColor={t.c} />
        </linearGradient>
        <linearGradient id={id.e} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={t.edge} /><stop offset="1" stopColor={t.edge} stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id={id.g} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="0.5" stopColor="#fff" stopOpacity="0.35" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={id.h} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={t.ink} /><stop offset="1" stopColor={t.ink} stopOpacity="0.75" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="112" height="162" rx="16" fill={u(id.f)} stroke={u(id.e)} strokeWidth="2.5" />
      <rect x="11" y="11" width="98" height="148" rx="11" fill="none" stroke={t.edge} strokeOpacity="0.35" strokeWidth="1.2" />
      <path d="M-10 60 L60 -10 L85 -10 L15 60Z" fill={u(id.g)} transform="translate(30 40)" opacity="0.8" />
      <text x="60" y="104" textAnchor="middle" fontFamily="'Nunito Sans', system-ui, sans-serif" fontWeight="900" fontStyle="italic"
            fontSize={n >= 10 ? 58 : 82} fill={u(id.h)} style={{ paintOrder: 'stroke' }} stroke={tone === 'gold' ? '#FFF6D0' : 'none'} strokeWidth="1.5">{n}</text>
      {tone === 'gold' && <Laurel color={t.ink} x={60} y={140} s={0.9} />}
    </Svg>
  );
}

/* ---------- Popcorn ---------- */
export function PopcornArt({ className, style }) {
  const id = useIds('r', 'w', 'k', 'sh', 'bl');
  const kernels = [[70,62,15],[92,52,17],[116,56,16],[136,66,14],[60,80,13],[82,74,15],[104,70,16],[126,78,15],[146,84,12],[96,88,14],[72,94,12],[118,92,13],[84,40,12],[108,36,13],[130,46,11]];
  return (
    <Svg className={className} style={style}>
      <defs>
        <linearGradient id={id.r} x1="0" x2="1"><stop offset="0" stopColor="#8E0F12" /><stop offset="0.45" stopColor="#E3262B" /><stop offset="1" stopColor="#7A0A0D" /></linearGradient>
        <linearGradient id={id.w} x1="0" x2="1"><stop offset="0" stopColor="#C9C3B8" /><stop offset="0.45" stopColor="#FFFDF7" /><stop offset="1" stopColor="#BDB5A8" /></linearGradient>
        <radialGradient id={id.k} cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor="#FFFBE8" /><stop offset="0.6" stopColor="#FFE7A3" /><stop offset="1" stopColor="#E0A945" /></radialGradient>
        <SoftShadow id={id.sh} std={5} />
        <clipPath id={id.bl}><path d="M52 92 L148 92 L134 184 L66 184 Z" /></clipPath>
      </defs>
      <ellipse cx="100" cy="186" rx="44" ry="7" fill="#000" opacity="0.55" filter={u(id.sh)} />
      <g clipPath={u(id.bl)}>
        <rect x="40" y="90" width="120" height="100" fill={u(id.w)} />
        {[0, 1, 2, 3, 4].map(i => <path key={i} d={`M${54 + i * 20} 92 L${66 + i * 20} 92 L${66 + i * 16.4 + 6} 184 L${60 + i * 16.4} 184Z`} fill={u(id.r)} />)}
        <rect x="40" y="90" width="120" height="100" fill="url(#none)" />
      </g>
      <path d="M48 90 Q100 98 152 90 L150 100 Q100 107 50 100Z" fill="#B71C1C" />
      {kernels.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill={u(id.k)} />
          <circle cx={x + r * 0.45} cy={y - r * 0.2} r={r * 0.65} fill={u(id.k)} />
          <circle cx={x - r * 0.3} cy={y - r * 0.35} r={r * 0.3} fill="#fff" opacity="0.7" />
        </g>
      ))}
    </Svg>
  );
}

/* ---------- Film reel ---------- */
export function ReelArt({ className, style }) {
  const id = useIds('m', 'h', 'sh', 'f');
  return (
    <Svg className={className} style={style}>
      <defs>
        <radialGradient id={id.m} cx="0.35" cy="0.3" r="0.9"><stop offset="0" stopColor="#FFE7A8" /><stop offset="0.45" stopColor="#C8862A" /><stop offset="1" stopColor="#4A2A08" /></radialGradient>
        <radialGradient id={id.h} cx="0.4" cy="0.35" r="0.8"><stop offset="0" stopColor="#2A1C10" /><stop offset="1" stopColor="#0A0603" /></radialGradient>
        <linearGradient id={id.f} x1="0" x2="1"><stop offset="0" stopColor="#3A2A1A" /><stop offset="1" stopColor="#120C06" /></linearGradient>
        <SoftShadow id={id.sh} std={6} />
      </defs>
      <path d="M100 150 C 60 175, 30 160, 5 185 L 5 200 L 40 200 C 60 182, 90 188, 112 160Z" fill={u(id.f)} stroke="#6B4A22" strokeWidth="1.5" />
      {[0, 1, 2, 3, 4, 5].map(i => <rect key={i} x={14 + i * 15} y={186 - i * 4.5} width="6" height="5" rx="1" fill="#C8862A" opacity="0.7" />)}
      <circle cx="104" cy="92" r="78" fill="#000" opacity="0.5" filter={u(id.sh)} />
      <circle cx="100" cy="88" r="76" fill={u(id.m)} />
      <circle cx="100" cy="88" r="70" fill="none" stroke="#FFE7A8" strokeOpacity="0.5" strokeWidth="2" />
      {[0, 60, 120, 180, 240, 300].map(a => {
        const r = (a * Math.PI) / 180; const cx = 100 + Math.cos(r) * 42, cy = 88 + Math.sin(r) * 42;
        return <g key={a}><circle cx={cx} cy={cy} r="17" fill={u(id.h)} /><circle cx={cx - 4} cy={cy - 5} r="6" fill="#fff" opacity="0.06" /></g>;
      })}
      <circle cx="100" cy="88" r="14" fill="#8A5A1C" stroke="#FFE7A8" strokeOpacity="0.6" strokeWidth="2" />
      <circle cx="100" cy="88" r="5" fill="#1A1006" />
      <path d="M45 40 A 76 76 0 0 1 120 14" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="4" strokeLinecap="round" />
    </Svg>
  );
}

/* ---------- Clapperboard (small header icon) ---------- */
export function ClapperArt({ className, style, color = '#FFB300' }) {
  return (
    <Svg vb="0 0 48 48" className={className} style={style}>
      <path d="M6 20h36v20a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z" fill={color} />
      <path d="M5 12.5 39.5 5l1.7 7.4L6.7 20z" fill={color} />
      <path d="M11 11.2 15 18M19.5 9.4 23.5 16.2M28 7.6 32 14.4" stroke="#111" strokeWidth="3" />
      <rect x="10" y="26" width="28" height="3" rx="1.5" fill="#111" opacity="0.35" />
      <rect x="10" y="32" width="18" height="3" rx="1.5" fill="#111" opacity="0.35" />
    </Svg>
  );
}

/* ---------- Retro TV ---------- */
export function TvArt({ className, style }) {
  const id = useIds('b', 's', 'gl', 'sh');
  return (
    <Svg className={className} style={style}>
      <defs>
        <linearGradient id={id.b} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6B4A3A" /><stop offset="1" stopColor="#2A1A14" /></linearGradient>
        <radialGradient id={id.s} cx="0.45" cy="0.4" r="0.75"><stop offset="0" stopColor="#E6B8FF" /><stop offset="0.45" stopColor="#9B4DFF" /><stop offset="1" stopColor="#3A0F7A" /></radialGradient>
        <linearGradient id={id.gl} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.5" /><stop offset="0.4" stopColor="#fff" stopOpacity="0" /></linearGradient>
        <SoftShadow id={id.sh} std={6} />
      </defs>
      <path d="M100 52 L70 18 M100 52 L138 14" stroke="#9A9AA5" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="70" cy="18" r="4" fill="#D0D0DA" /><circle cx="138" cy="14" r="4" fill="#D0D0DA" />
      <ellipse cx="100" cy="186" rx="70" ry="8" fill="#000" opacity="0.6" filter={u(id.sh)} />
      <rect x="22" y="50" width="160" height="128" rx="22" fill={u(id.b)} stroke="#8A6A55" strokeWidth="2" />
      <rect x="36" y="64" width="108" height="98" rx="18" fill="#120A20" />
      <rect x="40" y="68" width="100" height="90" rx="15" fill={u(id.s)} />
      {Array.from({ length: 14 }).map((_, i) => <rect key={i} x="40" y={70 + i * 6.3} width="100" height="1.6" fill="#fff" opacity="0.07" />)}
      <rect x="40" y="68" width="100" height="90" rx="15" fill={u(id.gl)} />
      <rect x="150" y="70" width="24" height="88" rx="8" fill="#1E120D" />
      <circle cx="162" cy="88" r="7" fill="#C9A27E" /><circle cx="162" cy="110" r="7" fill="#C9A27E" />
      {[0, 1, 2, 3].map(i => <rect key={i} x="154" y={126 + i * 7} width="16" height="3" rx="1.5" fill="#000" opacity="0.5" />)}
      <rect x="44" y="178" width="14" height="10" rx="3" fill="#1E120D" /><rect x="146" y="178" width="14" height="10" rx="3" fill="#1E120D" />
    </Svg>
  );
}

/* ---------- Football ---------- */
export function FootballArt({ className, style }) {
  const id = useIds('b', 'g', 'sh', 'c');
  const pent = (cx, cy, r, rot = 0) => Array.from({ length: 5 }).map((_, i) => {
    const a = ((i * 72 + rot - 90) * Math.PI) / 180; return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
  }).join(' ');
  return (
    <Svg className={className} style={style}>
      <defs>
        <radialGradient id={id.b} cx="0.38" cy="0.32" r="0.8"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.6" stopColor="#E3E6EC" /><stop offset="1" stopColor="#8A8F9C" /></radialGradient>
        <linearGradient id={id.g} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4ADE80" /><stop offset="1" stopColor="#14532D" /></linearGradient>
        <SoftShadow id={id.sh} std={5} />
        <clipPath id={id.c}><circle cx="104" cy="104" r="70" /></clipPath>
      </defs>
      <path d="M0 170 Q100 150 200 170 L200 200 L0 200Z" fill={u(id.g)} />
      {Array.from({ length: 26 }).map((_, i) => <path key={i} d={`M${4 + i * 7.6} 200 l${(i % 3) - 1} -${10 + (i * 7) % 14}`} stroke="#86EFAC" strokeWidth="1.6" opacity="0.6" />)}
      <ellipse cx="104" cy="178" rx="56" ry="8" fill="#000" opacity="0.6" filter={u(id.sh)} />
      <circle cx="104" cy="104" r="70" fill={u(id.b)} />
      <g clipPath={u(id.c)} fill="#16161C">
        <polygon points={pent(104, 100, 22)} />
        <polygon points={pent(52, 74, 20, 36)} /><polygon points={pent(156, 74, 20, 36)} />
        <polygon points={pent(70, 160, 21, 36)} /><polygon points={pent(140, 160, 21, 36)} />
        <polygon points={pent(104, 30, 16, 36)} /><polygon points={pent(176, 128, 18, 10)} /><polygon points={pent(32, 128, 18, -10)} />
      </g>
      <g clipPath={u(id.c)} stroke="#16161C" strokeWidth="2.5" fill="none" opacity="0.8">
        <path d="M104 78 L104 40 M83 93 L64 80 M125 93 L144 80 M91 120 L76 145 M117 120 L132 145" />
      </g>
      <ellipse cx="80" cy="70" rx="22" ry="13" fill="#fff" opacity="0.55" transform="rotate(-30 80 70)" />
    </Svg>
  );
}

/* ---------- Headphones ---------- */
export function HeadphonesArt({ className, style }) {
  const id = useIds('c', 'p', 'sh');
  return (
    <Svg className={className} style={style}>
      <defs>
        <linearGradient id={id.c} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4A4A55" /><stop offset="1" stopColor="#0E0E12" /></linearGradient>
        <linearGradient id={id.p} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FF8AB8" /><stop offset="1" stopColor="#B0135A" /></linearGradient>
        <SoftShadow id={id.sh} std={6} />
      </defs>
      <ellipse cx="100" cy="186" rx="70" ry="8" fill="#000" opacity="0.6" filter={u(id.sh)} />
      <path d="M38 120 C 30 40, 170 40, 162 120" fill="none" stroke={u(id.c)} strokeWidth="16" strokeLinecap="round" />
      <path d="M44 112 C 40 56, 160 56, 156 112" fill="none" stroke="#FF5FA2" strokeWidth="3" strokeOpacity="0.6" strokeLinecap="round" />
      {[[22, 1], [138, -1]].map(([x, f], i) => (
        <g key={i}>
          <rect x={x} y="104" width="40" height="70" rx="18" fill={u(id.c)} stroke="#6A6A78" strokeWidth="1.5" />
          <rect x={x + (f > 0 ? 26 : 0)} y="112" width="14" height="54" rx="7" fill={u(id.p)} />
          <ellipse cx={x + 14} cy="122" rx="8" ry="5" fill="#fff" opacity="0.18" />
        </g>
      ))}
    </Svg>
  );
}

/* ---------- Gamepad ---------- */
export function GamepadArt({ className, style, accent = '#22C55E' }) {
  const id = useIds('b', 'sh', 'gl');
  return (
    <Svg className={className} style={style}>
      <defs>
        <linearGradient id={id.b} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3A3D45" /><stop offset="1" stopColor="#0B0C0F" /></linearGradient>
        <radialGradient id={id.gl} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={accent} stopOpacity="0.9" /><stop offset="1" stopColor={accent} stopOpacity="0" /></radialGradient>
        <SoftShadow id={id.sh} std={6} />
      </defs>
      <ellipse cx="100" cy="170" rx="80" ry="10" fill="#000" opacity="0.6" filter={u(id.sh)} />
      <circle cx="100" cy="110" r="70" fill={u(id.gl)} opacity="0.35" />
      <path d="M58 64 C 30 64, 18 100, 16 132 C 14 160, 38 170, 52 150 L 66 130 L 134 130 L 148 150 C 162 170, 186 160, 184 132 C 182 100, 170 64, 142 64 Z" fill={u(id.b)} stroke="#5A5E6A" strokeWidth="1.5" />
      <path d="M60 70 C 40 72, 30 92, 27 110" stroke="#fff" strokeOpacity="0.25" strokeWidth="4" fill="none" strokeLinecap="round" />
      <rect x="44" y="92" width="10" height="30" rx="3" fill="#1A1C22" stroke="#6A6E7A" /><rect x="34" y="102" width="30" height="10" rx="3" fill="#1A1C22" stroke="#6A6E7A" />
      <circle cx="146" cy="92" r="7" fill={accent} /><circle cx="160" cy="106" r="7" fill="#EF4444" /><circle cx="132" cy="106" r="7" fill="#3B82F6" /><circle cx="146" cy="120" r="7" fill="#EAB308" />
      <circle cx="80" cy="124" r="11" fill="#14161B" stroke="#6A6E7A" /><circle cx="120" cy="124" r="11" fill="#14161B" stroke="#6A6E7A" />
      <circle cx="100" cy="92" r="6" fill={accent} opacity="0.9" />
    </Svg>
  );
}

/* ---------- Leaf ---------- */
export function LeafArt({ className, style }) {
  const id = useIds('l', 'd', 'sh');
  return (
    <Svg className={className} style={style}>
      <defs>
        <linearGradient id={id.l} x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#14532D" /><stop offset="0.5" stopColor="#22C55E" /><stop offset="1" stopColor="#A3E635" /></linearGradient>
        <radialGradient id={id.d} cx="0.35" cy="0.3" r="0.7"><stop offset="0" stopColor="#fff" stopOpacity="0.95" /><stop offset="1" stopColor="#BBF7D0" stopOpacity="0.25" /></radialGradient>
        <SoftShadow id={id.sh} std={6} />
      </defs>
      <path d="M30 180 C 40 90, 110 30, 188 18 C 182 100, 130 170, 30 180 Z" fill="#000" opacity="0.45" filter={u(id.sh)} transform="translate(6 8)" />
      <path d="M30 180 C 40 90, 110 30, 188 18 C 182 100, 130 170, 30 180 Z" fill={u(id.l)} />
      <path d="M30 180 C 80 130, 130 80, 186 20" stroke="#DCFCE7" strokeOpacity="0.7" strokeWidth="2.5" fill="none" />
      {[0.25, 0.4, 0.55, 0.7].map((t, i) => {
        const x = 30 + 156 * t, y = 180 - 160 * t;
        return <g key={i} stroke="#DCFCE7" strokeOpacity="0.45" strokeWidth="1.6" fill="none">
          <path d={`M${x} ${y} q ${-24} ${-6} ${-34} ${-34}`} /><path d={`M${x} ${y} q ${10} ${20} ${36} ${26}`} />
        </g>;
      })}
      <ellipse cx="96" cy="112" rx="7" ry="8" fill={u(id.d)} /><ellipse cx="132" cy="70" rx="5" ry="6" fill={u(id.d)} /><ellipse cx="70" cy="140" rx="4" ry="5" fill={u(id.d)} />
    </Svg>
  );
}

/* ---------- Burger ---------- */
export function BurgerArt({ className, style }) {
  const id = useIds('t', 'p', 'sh');
  return (
    <Svg className={className} style={style}>
      <defs>
        <radialGradient id={id.t} cx="0.4" cy="0.25" r="0.9"><stop offset="0" stopColor="#FFD08A" /><stop offset="0.6" stopColor="#E08A2C" /><stop offset="1" stopColor="#8A4A10" /></radialGradient>
        <linearGradient id={id.p} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6B3418" /><stop offset="1" stopColor="#2A1206" /></linearGradient>
        <SoftShadow id={id.sh} std={6} />
      </defs>
      <ellipse cx="100" cy="182" rx="72" ry="8" fill="#000" opacity="0.6" filter={u(id.sh)} />
      <path d="M32 152 h136 a10 10 0 0 1 -10 22 h-116 a10 10 0 0 1 -10 -22z" fill={u(id.t)} />
      <rect x="28" y="128" width="144" height="26" rx="13" fill={u(id.p)} />
      <path d="M26 122 L174 122 L160 140 L146 128 L130 142 L114 128 L98 142 L82 128 L66 142 L50 128 L38 140 Z" fill="#FACC15" />
      <path d="M24 118 q12 -10 24 0 q12 10 24 0 q12 -10 24 0 q12 10 24 0 q12 -10 24 0 q12 10 32 0 v8 h-152z" fill="#22C55E" />
      <path d="M30 116 C 30 60, 170 60, 170 116 Z" fill={u(id.t)} />
      {[[70, 84], [96, 74], [122, 82], [84, 98], [112, 96], [140, 98], [58, 102]].map(([x, y], i) =>
        <ellipse key={i} cx={x} cy={y} rx="3.2" ry="1.8" fill="#FFF7E0" transform={`rotate(${i * 25} ${x} ${y})`} />)}
      <path d="M58 98 C 68 86, 88 81, 106 81" stroke="#fff" strokeOpacity="0.35" strokeWidth="5" fill="none" strokeLinecap="round" />
    </Svg>
  );
}

/* ---------- Temple (history) ---------- */
export function TempleArt({ className, style }) {
  const id = useIds('g', 'sh');
  return (
    <Svg className={className} style={style}>
      <defs>
        <linearGradient id={id.g} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFF1B8" /><stop offset="0.5" stopColor="#D4AF37" /><stop offset="1" stopColor="#6B4A10" /></linearGradient>
        <SoftShadow id={id.sh} std={6} />
      </defs>
      <ellipse cx="100" cy="184" rx="80" ry="8" fill="#000" opacity="0.6" filter={u(id.sh)} />
      <path d="M16 70 L100 26 L184 70 Z" fill={u(id.g)} />
      <path d="M40 64 L100 34 L160 64 Z" fill="#000" opacity="0.18" />
      <rect x="20" y="70" width="160" height="12" rx="2" fill={u(id.g)} />
      {[0, 1, 2, 3, 4].map(i => (
        <g key={i}>
          <rect x={30 + i * 30} y="84" width="20" height="76" fill={u(id.g)} />
          {[0, 1, 2].map(j => <rect key={j} x={34 + i * 30 + j * 5} y="88" width="2" height="68" fill="#000" opacity="0.15" />)}
        </g>
      ))}
      <rect x="14" y="160" width="172" height="10" rx="2" fill={u(id.g)} /><rect x="6" y="170" width="188" height="10" rx="2" fill={u(id.g)} />
    </Svg>
  );
}

/* ---------- Lightning (myths) ---------- */
export function BoltArt({ className, style }) {
  const id = useIds('b', 'gl', 'cl');
  return (
    <Svg className={className} style={style}>
      <defs>
        <linearGradient id={id.b} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.4" stopColor="#E9D5FF" /><stop offset="1" stopColor="#8B5CF6" /></linearGradient>
        <radialGradient id={id.gl} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#A78BFA" stopOpacity="0.9" /><stop offset="1" stopColor="#A78BFA" stopOpacity="0" /></radialGradient>
        <linearGradient id={id.cl} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6B6F85" /><stop offset="1" stopColor="#25263A" /></linearGradient>
      </defs>
      <circle cx="104" cy="104" r="90" fill={u(id.gl)} opacity="0.6" />
      <path d="M30 70 a26 26 0 0 1 40 -22 a34 34 0 0 1 62 2 a24 24 0 0 1 36 22 a18 18 0 0 1 -6 34 h-124 a20 20 0 0 1 -8 -36z" fill={u(id.cl)} />
      <path d="M112 84 L72 140 L100 140 L84 196 L140 122 L110 122 L128 84 Z" fill={u(id.b)} stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
    </Svg>
  );
}

/* ---------- Anime (rising sun + blade + petals) ---------- */
export function AnimeArt({ className, style }) {
  const id = useIds('s', 'k', 'p');
  return (
    <Svg className={className} style={style}>
      <defs>
        <radialGradient id={id.s} cx="0.45" cy="0.4" r="0.6"><stop offset="0" stopColor="#FFB38A" /><stop offset="0.7" stopColor="#FF4500" /><stop offset="1" stopColor="#B42400" /></radialGradient>
        <linearGradient id={id.k} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#F2F4F8" /><stop offset="0.5" stopColor="#FFFFFF" /><stop offset="1" stopColor="#9AA0AE" /></linearGradient>
        <radialGradient id={id.p} cx="0.4" cy="0.4" r="0.7"><stop offset="0" stopColor="#FFE4EE" /><stop offset="1" stopColor="#FF7AA8" /></radialGradient>
      </defs>
      <circle cx="104" cy="96" r="66" fill={u(id.s)} />
      <g transform="rotate(-38 100 100)">
        <rect x="8" y="94" width="150" height="9" rx="4.5" fill={u(id.k)} />
        <path d="M158 94 L184 98.5 L158 103Z" fill={u(id.k)} />
        <rect x="-6" y="88" width="10" height="21" rx="2" fill="#D4AF37" />
        <rect x="-48" y="93" width="44" height="11" rx="5" fill="#1F1F28" />
        {[0, 1, 2, 3].map(i => <path key={i} d={`M${-44 + i * 10} 93 l5 11`} stroke="#B91C1C" strokeWidth="2.5" />)}
      </g>
      {[[40, 150, 0], [160, 160, 40], [150, 36, 80], [56, 40, 120], [178, 110, 200]].map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          {[0, 72, 144, 216, 288].map(a => <ellipse key={a} cx="0" cy="-7" rx="4.5" ry="7" fill={u(id.p)} transform={`rotate(${a})`} />)}
          <circle r="2.4" fill="#FFD166" />
        </g>
      ))}
    </Svg>
  );
}

/* ---------- Celebs (star tile + flash) ---------- */
export function StarTileArt({ className, style }) {
  const id = useIds('t', 's', 'sh', 'f');
  const star = Array.from({ length: 10 }).map((_, i) => {
    const r = i % 2 ? 22 : 52; const a = (i * 36 - 90) * Math.PI / 180; return `${100 + Math.cos(a) * r},${96 + Math.sin(a) * r}`;
  }).join(' ');
  return (
    <Svg className={className} style={style}>
      <defs>
        <linearGradient id={id.t} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FF8FA3" /><stop offset="1" stopColor="#9F1239" /></linearGradient>
        <linearGradient id={id.s} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFF3C4" /><stop offset="0.5" stopColor="#FBBF24" /><stop offset="1" stopColor="#92400E" /></linearGradient>
        <radialGradient id={id.f} cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
        <SoftShadow id={id.sh} std={6} />
      </defs>
      <ellipse cx="100" cy="182" rx="72" ry="8" fill="#000" opacity="0.6" filter={u(id.sh)} />
      <rect x="22" y="26" width="156" height="150" rx="10" fill="#2A2A33" transform="skewX(-6) translate(10 0)" />
      <polygon points={star} fill={u(id.t)} stroke={u(id.s)} strokeWidth="5" strokeLinejoin="round" />
      <circle cx="100" cy="96" r="10" fill={u(id.s)} />
      <rect x="54" y="150" width="92" height="8" rx="4" fill={u(id.s)} opacity="0.85" />
      <circle cx="166" cy="34" r="30" fill={u(id.f)} opacity="0.9" />
      <path d="M166 14 v40 M146 34 h40" stroke="#fff" strokeWidth="2" opacity="0.8" />
    </Svg>
  );
}

/* ---------- Creators (phone on ring light) ---------- */
export function CreatorArt({ className, style }) {
  const id = useIds('r', 'p', 'sh', 'sc');
  return (
    <Svg className={className} style={style}>
      <defs>
        <radialGradient id={id.r} cx="0.5" cy="0.5" r="0.5"><stop offset="0.75" stopColor="#fff" stopOpacity="0" /><stop offset="0.86" stopColor="#FFF4F4" /><stop offset="1" stopColor="#FF9A9A" stopOpacity="0.2" /></radialGradient>
        <linearGradient id={id.p} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3A3A44" /><stop offset="1" stopColor="#0A0A0E" /></linearGradient>
        <linearGradient id={id.sc} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF5A5A" /><stop offset="1" stopColor="#8A0000" /></linearGradient>
        <SoftShadow id={id.sh} std={6} />
      </defs>
      <circle cx="100" cy="96" r="84" fill={u(id.r)} />
      <rect x="96" y="160" width="8" height="34" fill="#2A2A33" />
      <rect x="66" y="40" width="68" height="116" rx="12" fill={u(id.p)} stroke="#6A6A78" strokeWidth="1.5" />
      <rect x="72" y="48" width="56" height="100" rx="8" fill={u(id.sc)} />
      <path d="M90 82 L116 98 L90 114Z" fill="#fff" />
      <rect x="78" y="134" width="44" height="4" rx="2" fill="#fff" opacity="0.5" /><rect x="78" y="134" width="20" height="4" rx="2" fill="#fff" />
      <path d="M74 52 L100 52 L76 100Z" fill="#fff" opacity="0.12" />
    </Svg>
  );
}

/* ---------- Football jersey (tinted per club) ---------- */
export function JerseyArt({ primary = '#DA291C', secondary = '#FFFFFF', className, style }) {
  const id = useIds('b', 'sh', 'f');
  return (
    <Svg className={className} style={style}>
      <defs>
        <linearGradient id={id.b} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={primary} stopOpacity="0.75" /><stop offset="0.45" stopColor={primary} /><stop offset="1" stopColor={primary} stopOpacity="0.7" /></linearGradient>
        <linearGradient id={id.f} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.45" /></linearGradient>
        <SoftShadow id={id.sh} std={7} />
      </defs>
      <ellipse cx="100" cy="188" rx="64" ry="7" fill="#000" opacity="0.6" filter={u(id.sh)} />
      <path d="M72 22 L42 34 L8 70 L30 98 L50 84 L50 182 L150 182 L150 84 L170 98 L192 70 L158 34 L128 22 C 120 36, 80 36, 72 22Z" fill={u(id.b)} />
      <path d="M72 22 L42 34 L8 70 L30 98 L50 84 L50 182 L150 182 L150 84 L170 98 L192 70 L158 34 L128 22 C 120 36, 80 36, 72 22Z" fill={u(id.f)} />
      <path d="M72 22 C 80 40, 120 40, 128 22 L 122 20 C 116 32, 84 32, 78 20Z" fill={secondary} />
      <path d="M8 70 L30 98 L34 93 L13 66Z M192 70 L170 98 L166 93 L187 66Z" fill={secondary} />
      <path d="M70 60 C 66 100, 70 140, 64 176" stroke="#fff" strokeOpacity="0.14" strokeWidth="10" fill="none" />
      <path d="M118 46 C 132 70, 138 120, 134 176" stroke="#000" strokeOpacity="0.12" strokeWidth="14" fill="none" />
    </Svg>
  );
}

/* ---------- Map domain -> art ---------- */
export const DOMAIN_ART = {
  movies: PopcornArt, tv: TvArt, anime: AnimeArt, actors: StarTileArt, sports: FootballArt, creators: CreatorArt,
  music: HeadphonesArt, games: GamepadArt, nature: LeafArt, food: BurgerArt, history: TempleArt, myths: BoltArt,
};
export const HEADER_ART = { ...DOMAIN_ART, movies: ReelArt };

export function DomainArt({ domain, className, style, item, theme }) {
  if (item && item.themeOverride && theme) return <JerseyArt primary={theme.primary} secondary={theme.secondary === '#000000' ? '#111' : theme.secondary} className={className} style={style} />;
  const C = DOMAIN_ART[domain] || PopcornArt;
  return <C className={className} style={style} />;
}
