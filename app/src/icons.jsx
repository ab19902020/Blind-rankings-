import React from 'react';

const I = ({ d, size = 22, sw = 2.2, fill = 'none', className, style, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
    {d ? <path d={d} /> : children}
  </svg>
);

export const Home = p => <I {...p}><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" fill={p.active ? 'currentColor' : 'none'} /></I>;
export const Search = p => <I {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></I>;
export const List = p => <I {...p}><path d="M9 6h11M9 12h11M9 18h11" /><path d="M4 6h.01M4 12h.01M4 18h.01" strokeWidth="3" /></I>;
export const ListNum = p => <I {...p}><path d="M10 6h11M10 12h11M10 18h11" /><path d="M4 4v4M3 8h2M3 12.5a1.2 1.2 0 0 1 2 .8L3 16h2.2M3 18.6a1.2 1.2 0 1 1 1.2 1.4 1.2 1.2 0 1 1-1.2 1.4" strokeWidth="1.5" /></I>;
export const Back = p => <I {...p} d="M19 12H5m6-7-7 7 7 7" />;
export const Close = p => <I {...p} d="M18 6 6 18M6 6l12 12" />;
export const Chevron = p => <I {...p} d="m9 6 6 6-6 6" />;
export const Play = p => <I {...p} fill="currentColor" sw={1}><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" /></I>;
export const Camera = p => <I {...p}><rect x="2.5" y="6" width="13" height="12" rx="2.5" fill={p.solid ? 'currentColor' : 'none'} /><path d="m15.5 10.5 6-3.5v10l-6-3.5" fill={p.solid ? 'currentColor' : 'none'} /></I>;
export const Mic = p => <I {...p}><rect x="9" y="3" width="6" height="11" rx="3" fill={p.solid ? 'currentColor' : 'none'} /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></I>;
export const Eye = p => <I {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></I>;
export const Lock = p => <I {...p}><rect x="4.5" y="10.5" width="15" height="10.5" rx="2.5" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /></I>;
export const Gear = p => <I {...p}><circle cx="12" cy="12" r="3.2" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></I>;
export const Undo = p => <I {...p}><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" /></I>;
export const Share = p => <I {...p}><path d="M12 3v13M7 8l5-5 5 5" /><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" /></I>;
export const Download = p => <I {...p}><path d="M12 3v13m-5-5 5 5 5-5" /><path d="M5 21h14" /></I>;
export const Repeat = p => <I {...p}><path d="M17 2l4 4-4 4" /><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4" /><path d="M21 13v2a3 3 0 0 1-3 3H3" /></I>;
export const Shuffle = p => <I {...p}><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" /></I>;
export const Alert = p => <I {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" /></I>;
export const Spinner = p => <I {...p} className={(p.className || '') + ' spin'}><path d="M21 12a9 9 0 1 1-6.2-8.6" /></I>;
export const Trophy = p => <I {...p}><path d="M7 4h10v5a5 5 0 0 1-10 0z" /><path d="M7 6H4.5a2.5 2.5 0 0 0 2.5 4M17 6h2.5a2.5 2.5 0 0 1-2.5 4M12 14v4M8 21h8M9.5 18h5" /></I>;
export const Flame = p => <I {...p}><path d="M12 2s5 4.5 5 10a5 5 0 0 1-10 0c0-2.2 1.2-3.8 2-4.6.3 1.6 1.3 2.6 2.4 2.6C11 7.5 12 2 12 2z" /></I>;
export const Info = p => <I {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5h.01" /></I>;
export const Trash = p => <I {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></I>;
export const Volume = p => <I {...p}><path d="M4 9h4l5-4v14l-5-4H4z" /><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" /></I>;
export const Vibrate = p => <I {...p}><rect x="7" y="3" width="10" height="18" rx="2.5" /><path d="M3 9v6M21 9v6" /></I>;
export const Timer = p => <I {...p}><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2M9 2h6" /></I>;
export const Expand = p => <I {...p} d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />;

// Line icons for domains (header use)
const DOMAIN_LINE = {
  popcorn: p => <I {...p}><path d="M5 10h14l-1.6 10.4a1.8 1.8 0 0 1-1.8 1.6H8.4a1.8 1.8 0 0 1-1.8-1.6z" /><path d="M9 10l.6 12M15 10l-.6 12M6 10a2.5 2.5 0 0 1 2-4.6 3 3 0 0 1 5.5-1.3A2.6 2.6 0 0 1 18 7a2.5 2.5 0 0 1 0 3" /></I>,
  tv: p => <I {...p}><rect x="2.5" y="7" width="19" height="13" rx="2.5" /><path d="m8 2.5 4 4.5 4-4.5" /></I>,
  star: p => <I {...p}><path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" /></I>,
  users: p => <I {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" /></I>,
  trophy: Trophy,
  play: p => <I {...p}><rect x="2.5" y="5" width="19" height="14" rx="4" /><path d="m10 9 5 3-5 3z" fill="currentColor" /></I>,
  music: p => <I {...p}><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></I>,
  gamepad: p => <I {...p}><rect x="2" y="6" width="20" height="12" rx="5" /><path d="M7 10v4M5 12h4M15.5 11h.01M18 13h.01" /></I>,
  leaf: p => <I {...p}><path d="M5 21c0-9 5-15 16-16-.5 10-6.5 16-16 16z" /><path d="M5 21 14 12" /></I>,
  burger: p => <I {...p}><path d="M4 11a8 8 0 0 1 16 0zM3 14.5h18M4 18h16a0 0 0 0 1 0 0 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" /></I>,
  globe: p => <I {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" /></I>,
  zap: p => <I {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></I>,
  car: p => <I {...p}><path d="M3 16v-3.5l2-5A2 2 0 0 1 6.9 6h10.2a2 2 0 0 1 1.9 1.5l2 5V16a1 1 0 0 1-1 1h-1M3 16a1 1 0 0 0 1 1h1M3 12.5h18" /><circle cx="7.5" cy="17" r="2" /><circle cx="16.5" cy="17" r="2" /></I>,
  plane: p => <I {...p}><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" /></I>,
};
export function DomainLine({ name, ...p }) { const C = DOMAIN_LINE[name] || DOMAIN_LINE.star; return <C {...p} />; }

export function Crown(p) {
  return (
    <svg viewBox="0 0 48 36" {...p} aria-hidden="true">
      <defs><linearGradient id="crownG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE58A" /><stop offset="1" stopColor="#F59E0B" /></linearGradient></defs>
      <path d="M4 10l10 9 10-15 10 15 10-9-4 22H8z" fill="url(#crownG)" stroke="#7A4A00" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="4" cy="10" r="3" fill="#FFE58A" /><circle cx="24" cy="4" r="3" fill="#FFE58A" /><circle cx="44" cy="10" r="3" fill="#FFE58A" />
    </svg>
  );
}
