import { nameCard, uniquePicks } from './rules.js';
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

const CDN = { 'd:': 'https://cdn-images.dzcdn.net/images/', 'D:': 'https://e-cdns-images.dzcdn.net/images/', 'y:': 'https://yt3.googleusercontent.com/', 'Y:': 'https://yt3.ggpht.com/', 'e:': 'https://a.espncdn.com/i/', 'j:': 'https://static-cdn.jtvnw.net/jtv_user_pictures/', 'a:': 'https://is1-ssl.mzstatic.com/image/thumb/' };
/** Expand compact image codes from the catalog. */
export function expandImg(code, size = 'w500') {
  if (!code) return null;
  if (code.startsWith('t:')) return `${TMDB_IMG}${size}${code.slice(2)}`;
  if (code.startsWith('b:')) return `${TMDB_IMG}w780${code.slice(2)}`;
  if (code.startsWith('w:')) return 'https://upload.wikimedia.org/wikipedia/' + code.slice(2);
  if (code.startsWith('W:')) return 'https://thumb.wikimedia.org/wikipedia/' + code.slice(2);
  const pre = CDN[code.slice(0, 2)];
  if (pre) return pre + code.slice(2);
  return code;
}

/* ---------------- variety: avoid what you saw last time ---------------- */
const seenStore = load('seen', {});
function orderPool(item, pool) {
  const seen = new Set(seenStore[itemKey(item)] || []);
  // Big pools are ordered most-famous first: favour the top so a round is mostly names
  // everyone knows, with a few deep cuts (weighted shuffle, weight falls with rank).
  const weighted = pool.length > 30 && item.type === 'pool' && !item.fresh;
  const rank = new Map(pool.map((p, i) => [p.id, i]));
  const shuffle = a => {
    if (weighted) return a.map(p => [Math.pow(Math.random(), 1 + (rank.get(p.id) || 0) / 35), p]).sort((x, y) => y[0] - x[0]).map(x => x[1]);
    const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b;
  };
  const fresh = shuffle(pool.filter(p => !seen.has(p.id)));
  const old = shuffle(pool.filter(p => seen.has(p.id)));
  return [...fresh, ...old];
}
export function markSeen(item, picks) {
  const k = itemKey(item);
  const prev = seenStore[k] || [];
  seenStore[k] = [...picks.map(p => p.id), ...prev].slice(0, 40);
  save('seen', seenStore);
}

/* ---------------- image preloading ---------------- */
export function preload(src, timeoutMs = 8000) {
  return new Promise(resolve => {
    if (!src) { resolve(null); return; }
    const img = new Image(); let done = false;
    const finish = value => { if (done) return; done = true; clearTimeout(timer); img.onload = img.onerror = null; resolve(value); };
    const timer = setTimeout(() => { finish(null); img.src = ''; }, timeoutMs);
    img.crossOrigin = 'anonymous'; img.decoding = 'async';
    img.onload = () => finish(img.naturalWidth > 20 ? img : null);
    img.onerror = () => finish(null); img.src = src;
  });
}

async function finalise(pool, onProgress) {
  const picks = uniquePicks(pool).slice(0, 10);
  if (picks.length !== 10) throw new Error(`This category has only ${picks.length} valid picks. Try another challenge.`);
  let complete = 0;
  return Promise.all(picks.map(async p => {
    let img = p.img, imgObj = await preload(img);
    const fallback = !imgObj;
    if (fallback) { img = nameCard(p.name, p.detail); imgObj = await preload(img); }
    if (!imgObj) throw new Error('The card renderer could not start. Please try again.');
    onProgress?.(++complete);
    return { ...p, img, imgObj, nameCard: fallback || p.nameCard };
  }));
}

const bounded = (promise, fallback, ms = 10000) => new Promise(resolve => {
  const t = setTimeout(() => resolve(fallback), ms);
  Promise.resolve(promise).then(value => { clearTimeout(t); resolve(value); }, () => { clearTimeout(t); resolve(fallback); });
});

async function poolFor(item, need = 999) {
  if (item.type === 'challenge') return item.picks;
  if (item.type === 'curated') {
    const picks = orderPool(item, uniquePicks(item.picks)).slice(0, 14);
    const need = picks.filter(p => !p.img);
    const imgs = item.picture === 'none' ? {} : await bounded(wikiResolve(need.map(p => p.title), wikiCache, item.img), {});
    return picks.map(p => ({ ...p, img: expandImg(p.img || imgs[p.title]) || '', nameCard: item.picture === 'none' }));
  }
  if (item.type === 'albums') {
    const picks = orderPool(item, item.items.map(s => { const [name, artist] = s.split('|'); return { id: s, name, detail: artist || '', title: `${name} (${artist} album)` }; })).slice(0, 14);
    // Without a built catalogue, keep the exact album/artist as a name card.
    return picks;
  }
  if (item.type === 'heroes') return item.items.map(name => ({ id: name, name, img: '' }));
  if (item.type === 'pool') return item.pool.map(([name, img]) => ({ id: name, name, img: expandImg(img) }));
  if (item.type === 'wiki') {
    const parsed = item.items.map(parseWikiItem);
    const imgs = await bounded(wikiResolve(parsed.map(p => p.title), wikiCache, item.img), {});
    return parsed.map(p => ({ id: p.title, name: p.name, img: imgs[p.title] || '' }));
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
        const u = await bounded(tmdbImage(q), null, 4000); if (u) tmdbCache.set(k, u); return u;
      }));
      wave.forEach((q, k) => { found.push({ id: q.id, name: q.n, img: urls[k] || '', detail: q.y || '' }); });
    }
    return found;
  }
  return liveResults(item);
}

/* ---------------- deck loader ---------------- */
export async function loadDeck(item, onProgress) {
  const pool = await poolFor(item, 14);
  const ordered = ['custom', 'curated', 'challenge', 'albums'].includes(item.type) ? uniquePicks(pool) : orderPool(item, uniquePicks(pool));
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
  if (item.type === 'curated' || item.type === 'challenge') return expandImg(item.picks.find(p => p.img)?.img) || null;
  if (item.type === 'pool') return expandImg(item.thumb || item.pool[0]?.[1], 'w780');
  return thumbCache[itemKey(item)] || null;
}

export function thumbFor(item) {
  if (['pool', 'curated', 'challenge', 'albums', 'heroes'].includes(item.type)) return Promise.resolve(cachedThumb(item));
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
