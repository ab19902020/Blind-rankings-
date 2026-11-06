import { identity, uniquePicks } from './rules.js';
const PREFIX = 'BR1.';
const hosts = ['upload.wikimedia.org', 'thumb.wikimedia.org', 'image.tmdb.org', 'cdn-images.dzcdn.net', 'e-cdns-images.dzcdn.net', 'yt3.googleusercontent.com', 'yt3.ggpht.com', 'a.espncdn.com', 'static-cdn.jtvnw.net', 'is1-ssl.mzstatic.com', 'raw.githubusercontent.com', 'images.pokemontcg.io', 'ddragon.leagueoflegends.com', 'media.valorant-api.com'];
export function safeImage(url) {
  if (!url) return '';
  try { const u = new URL(url); return u.protocol === 'https:' && hosts.includes(u.hostname) && !u.username && !u.password ? u.href : ''; } catch { return ''; }
}
const checksum = text => { let n = 2166136261; for (const c of text) n = Math.imul(n ^ c.charCodeAt(0), 16777619); return (n >>> 0).toString(36); };
export function encodeChallenge(item, deck, mode = 'strict') {
  if (deck.length !== 10 || uniquePicks(deck).length !== 10) throw new Error('A friend challenge needs ten unique picks.');
  const data = { v: 1, id: item.id, title: item.name, criterion: item.criterion || 'your favourite', direction: item.direction || 'best', mode: mode === 'casual' ? 'casual' : 'strict', fit: item.fit === 'contain' ? 'contain' : 'cover', picks: deck.map(p => ({ id: p.id, name: p.name, detail: p.detail || '', img: safeImage(p.img) })) };
  const json = JSON.stringify(data);
  const b64 = btoa(Array.from(new TextEncoder().encode(json), b => String.fromCharCode(b)).join('')).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return PREFIX + b64 + '.' + checksum(json);
}
export function decodeChallenge(input) {
  const token = input.trim().match(/BR1\.[A-Za-z0-9_-]+\.[a-z0-9]+/)?.[0];
  if (!token || token.length > 30000) throw new Error('Paste the full BR1 challenge code.');
  try {
    const [, b64, check] = token.split('.');
    const json = new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(atob(b64.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)));
    if (checksum(json) !== check) throw new Error();
    const d = JSON.parse(json);
    const string = (s, n) => typeof s === 'string' && s.length > 0 && s.length <= n && !/[\u0000-\u001f]/.test(s);
    if (d.v !== 1 || !string(d.id, 100) || !string(d.title, 120) || !string(d.criterion, 100) || !['strict', 'casual'].includes(d.mode) || !Array.isArray(d.picks) || d.picks.length !== 10) throw new Error();
    if (!d.picks.every(p => string(p.id, 240) && string(p.name, 120) && typeof p.detail === 'string' && p.detail.length <= 180 && typeof p.img === 'string' && p.img.length <= 2000)) throw new Error();
    if (new Set(d.picks.map(p => identity(p.id))).size !== 10) throw new Error();
    return { type: 'challenge', id: 'friend_' + check, name: d.title, criterion: d.criterion, direction: d.direction === 'worst' ? 'worst' : 'best', fit: d.fit === 'contain' ? 'contain' : 'cover', mode: d.mode, challengeCode: token, picks: d.picks.map(p => ({ ...p, img: safeImage(p.img) })), subtitle: 'Friend challenge · the exact same ten picks, in the same order.' };
  } catch { throw new Error('That challenge code is incomplete or invalid. Ask your friend to share it again.'); }
}
