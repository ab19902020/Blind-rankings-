import { wikiResolve, tmdbImage, liveResults, parseWikiItem, fetchTMDB, TMDB_IMG } from './resolve.js';
import { load, save } from './storage.js';

/* ---------------- caches ---------------- */
function persistentMap(key, limit = 2000) {
  const m = new Map(Object.entries(load(key, {})));
  let t = null;
  const flush = () => { clearTimeout(t); t = setTimeout(() => { const o = {}; let n = 0; for (const [k, v] of m) { if (n++ > limit) break; o[k] = v; } save(key, o); }, 500); };
  return { has: k => m.has(k), get: k => m.get(k), set: (k, v) => { m.set(k, v); flush(); } };
}
const wikiCache = persistentMap('wikiimg4');
const tmdbCache = persistentMap('tmdbimg2');

export const itemKey = item => `${item.type === 'pool' ? 'p' : item.type}:${item.id}`;

/** Expand compact image codes from the catalog. */
export function expandImg(code, size = 'w500') {
  if (!code) return null;
  if (code.startsWith('t:')) return `${TMDB_IMG}${size}${code.slice(2)}`;
  if (code.startsWith('b:')) return `${TMDB_IMG}w780${code.slice(2)}`;
  if (code.startsWith('w:')) return 'https://upload.wikimedia.org/wikipedia/' + code.slice(2);
  if (code.startsWith('W:')) return 'https://thumb.wikimedia.org/wikipedia/' + code.slice(2);
  return code;
}

/* ---------------- variety: avoid what you saw last time ---------------- */
const seenStore = load('seen', {});
function orderPool(item, pool) {
  const seen = new Set(seenStore[itemKey(item)] || []);
  const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const fresh = shuffle(pool.filter(p => !seen.has(p.id)));
  const old = shuffle(pool.filter(p => seen.has(p.id)));
  return [...fresh, ...old];
}
export function markSeen(item, picks) {
  const k = itemKey(item);
  const prev = seenStore[k] || [];
  seenStore[k] = [...picks.map(p => p.id), ...prev].slice(0, 24);
  save('seen', seenStore);
}

/* ---------------- image preloading ---------------- */
export function preload(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => resolve(img.naturalWidth > 20 ? img : null);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function finalise(pool, onProgress) {
  const out = [];
  let i = 0;
  while (out.length < 10 && i < pool.length) {
    const batch = pool.slice(i, i + Math.max(4, 10 - out.length + 2));
    i += batch.length;
    const imgs = await Promise.all(batch.map(it => preload(it.img)));
    batch.forEach((it, k) => { if (imgs[k] && out.length < 10) out.push({ ...it, imgObj: imgs[k] }); });
    onProgress && onProgress(out.length);
  }
  if (out.length < 10) throw new Error(`Only found ${out.length} of 10 picks. Check your connection and try again.`);
  return out;
}

async function poolFor(item, need = 999) {
  if (item.type === 'pool') return item.pool.map(([name, img]) => ({ id: name, name, img: expandImg(img) }));
  if (item.type === 'wiki') {
    const parsed = item.items.map(parseWikiItem);
    const imgs = await wikiResolve(parsed.map(p => p.title), wikiCache, item.img);
    return parsed.filter(p => imgs[p.title]).map(p => ({ id: p.title, name: p.name, img: imgs[p.title] }));
  }
  if (item.type === 'custom') {
    const order = orderPool(item, item.queries.map(q => ({ ...q, id: q.n + (q.y || '') })));
    const found = [];
    // Resolve in small parallel waves until we have plenty.
    for (let i = 0; i < order.length && found.length < need; i += 8) {
      const wave = order.slice(i, i + 8);
      const urls = await Promise.all(wave.map(async q => {
        const k = `${q.t}|${q.q}|${q.y || ''}`;
        if (tmdbCache.has(k)) return tmdbCache.get(k);
        const u = await tmdbImage(q); if (u) tmdbCache.set(k, u); return u;
      }));
      wave.forEach((q, k) => { if (urls[k]) found.push({ id: q.id, name: q.n, img: urls[k] }); });
    }
    return found;
  }
  return liveResults(item);
}

/* ---------------- deck loader ---------------- */
export async function loadDeck(item, onProgress) {
  const pool = await poolFor(item, 14);
  const ordered = item.type === 'custom' ? pool : orderPool(item, pool);
  // also warm the next few so a re-roll is instant
  ordered.slice(10, 14).forEach(p => { const i = new Image(); i.src = p.img; });
  if (ordered.length < 10) throw new Error(`Couldn’t find 10 picks for this one right now (${ordered.length}/10). Check your connection and try again.`);
  return finalise(ordered, onProgress);
}

/* ---------------- challenge thumbnails (rows / banners) ---------------- */
const thumbCache = load('thumbs4', {});
const inflight = {};
let active = 0; const waiting = [];
const slot = () => new Promise(r => { if (active < 4) { active++; r(); } else waiting.push(r); });
const release = () => { active--; const n = waiting.shift(); if (n) { active++; n(); } };

export function cachedThumb(item) {
  if (item.type === 'pool') return expandImg(item.thumb || item.pool[0][1], 'w780');
  return thumbCache[itemKey(item)] || null;
}

export function thumbFor(item) {
  if (item.type === 'pool') return Promise.resolve(cachedThumb(item));
  const key = itemKey(item);
  if (thumbCache[key]) return Promise.resolve(thumbCache[key]);
  if (inflight[key]) return inflight[key];
  inflight[key] = (async () => {
    await slot();
    let url = null;
    try {
      if (item.type === 'game') {
        const r = await fetchTMDB(item.endpoint, 1);
        const m = (r?.results || []).find(x => x.backdrop_path);
        if (m) url = `${TMDB_IMG}w780${m.backdrop_path}`;
      } else if (item.type === 'custom') {
        const q = item.queries[0];
        if (q.t === 'person') url = await tmdbImage(q);
        else {
          const kind = q.t === 'tv' ? 'tv' : 'movie';
          const yp = q.y ? (kind === 'movie' ? `&primary_release_year=${q.y}` : `&first_air_date_year=${q.y}`) : '';
          const r = await fetchTMDB(`/search/${kind}?query=${encodeURIComponent(q.q)}${yp}`);
          const m = r?.results?.[0];
          if (m) url = m.backdrop_path ? `${TMDB_IMG}w780${m.backdrop_path}` : m.poster_path ? `${TMDB_IMG}w500${m.poster_path}` : null;
        }
      } else if (item.type === 'wiki') {
        const a = parseWikiItem(item.items[0]).title, b = parseWikiItem(item.items[1]).title;
        const imgs = await wikiResolve([a, b], wikiCache, item.img);
        url = imgs[a] || imgs[b] || null;
      }
    } catch (e) {}
    release();
    if (url) { thumbCache[key] = url; save('thumbs4', thumbCache); }
    delete inflight[key];
    return url;
  })();
  return inflight[key];
}

/* ---------------- home carousel: what's hot ---------------- */
export async function trendingStrip() {
  const cached = load('trendStrip', null);
  if (cached && Date.now() - cached.t < 6 * 3600e3) return cached.items;
  const r = await fetchTMDB('/trending/all/week', 1);
  const items = (r?.results || []).filter(m => m.backdrop_path && (m.title || m.name)).slice(0, 10)
    .map(m => ({ id: m.id, name: m.title || m.name, img: `${TMDB_IMG}w780${m.backdrop_path}`, kind: m.media_type }));
  if (items.length) save('trendStrip', { t: Date.now(), items });
  return items;
}
