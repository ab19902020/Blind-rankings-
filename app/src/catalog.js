import { MENU_DATA, THEME } from './data.js';

export const BRAND = { primary: '#FFB547', secondary: '#FF3D7F', tertiary: '#7B5CFF' };

// Extra polish per domain: a third accent + a short tagline for the home tiles.
export const DOMAIN_META = {
  movies:   { tagline: 'Franchises, villains, decades', tertiary: '#FF7A1A' },
  tv:       { tagline: 'Networks, cartoons, reality',  tertiary: '#4F46E5' },
  anime:    { tagline: 'Shonen, Ghibli, legends',      tertiary: '#FF2E63' },
  actors:   { tagline: 'A-listers & comedy icons',     tertiary: '#FB923C' },
  sports:   { tagline: 'Football, NBA, UFC, F1',       tertiary: '#22D3EE' },
  creators: { tagline: 'YouTube & Twitch royalty',     tertiary: '#FF6B6B' },
  music:    { tagline: 'Pop, rap, rock, K-pop',        tertiary: '#A855F7' },
  games:    { tagline: 'Heroes, bosses, consoles',     tertiary: '#A3E635' },
  nature:   { tagline: 'Dogs, dinos, deadly',          tertiary: '#84CC16' },
  food:     { tagline: 'Fast food, cereal, candy',     tertiary: '#F43F5E' },
  history:  { tagline: 'Landmarks, flags, figures',    tertiary: '#F59E0B' },
  myths:    { tagline: 'Greek gods & cryptids',        tertiary: '#EC4899' },
  cars:     { tagline: 'Supercars, brands, JDM',       tertiary: '#F97316' },
  places:   { tagline: 'Cities, islands, wonders',     tertiary: '#22D3EE' },
};

const KEEP_UPPER = new Set(['TV', 'NBA', 'UFC', 'F1', 'US', 'MCU', '007', 'A24', 'WWE', 'NFL', 'MLB', 'DC', 'HBO', 'CN', 'AMC', 'K-POP', 'R&B', 'GOATS', 'GOAT']);
export function displayName(name = '') {
  if (name !== name.toUpperCase()) return name;
  return name.split(' ').map(w => {
    if (KEEP_UPPER.has(w)) return w === 'GOATS' ? 'GOATs' : w === 'K-POP' ? 'K-Pop' : w;
    if (/^\d/.test(w)) return w.toLowerCase();
    return w.charAt(0) + w.slice(1).toLowerCase();
  }).join(' ').replace('Tv', 'TV');
}

export const cleanName = (n = '') => n.split(' (')[0];

// Build an index of every playable challenge and which domain it belongs to.
const leaves = [];
const domainOfMenu = {};
(function walk() {
  for (const dom of MENU_DATA.domain) {
    const visit = (menuId, group) => {
      domainOfMenu[menuId] = dom.id;
      for (const item of MENU_DATA[menuId] || []) {
        if (item.type === 'nav') visit(item.id, item);
        else leaves.push({ item, domain: dom.id, group });
      }
    };
    visit(dom.id, null);
  }
})();

export const ALL_CHALLENGES = leaves;
export const domainForMenu = (menuId) => domainOfMenu[menuId];
export const domainForItem = (item) => leaves.find(l => l.item === item)?.domain;

export function countChallenges(menuId) {
  let n = 0;
  for (const item of MENU_DATA[menuId] || []) n += item.type === 'nav' ? countChallenges(item.id) : 1;
  return n;
}

export function themeFor(key) {
  const t = THEME[key];
  if (!t) return { ...BRAND, shadow: 'rgba(255,181,71,0.5)', key: 'brand' };
  const meta = DOMAIN_META[key];
  return { ...t, tertiary: meta?.tertiary || t.secondary, key };
}

// Pick readable ink for text sitting on a colour.
export function inkOn(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255, g = parseInt(h.slice(2, 4), 16) / 255, b = parseInt(h.slice(4, 6), 16) / 255;
  const lin = c => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return L > 0.36 ? '#0B0B10' : '#FFFFFF';
}

// A gradient that never ends in pure black / white so it always looks rich.
export function safeSecondary(t) {
  const s = (t.secondary || '').toUpperCase();
  if (s === '#000000' || s === '#FFFFFF') return t.tertiary && t.tertiary !== t.secondary ? t.tertiary : '#3A0D0D';
  return t.secondary;
}

export function hexA(hex, a) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

export function sourceLabel(item) {
  if (item.type === 'game') return 'Live chart · changes daily';
  if (item.type === 'custom') {
    const n = item.queries.length;
    return item.kind === 'films' ? `${n} films` : item.kind === 'shows' ? `${n} shows` : item.kind === 'people' ? `${n} stars` : `${n} picks`;
  }
  if (item.type === 'wiki') return `${item.items.length} picks`;
  return '';
}

export function poolSize(item) {
  return item.type === 'custom' ? item.queries.length : item.type === 'wiki' ? item.items.length : null;
}

// Deterministic daily challenge — same for everyone on the same day.
export function dailyChallenge(date = new Date()) {
  const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619); }
  return leaves[Math.abs(h) % leaves.length];
}

export function randomChallenge(excludeItem) {
  const pool = leaves.filter(l => l.item !== excludeItem);
  return pool[Math.floor(Math.random() * pool.length)];
}

export { MENU_DATA };
