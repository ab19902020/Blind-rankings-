import { cleanName } from './catalog.js';
import { load, save } from './storage.js';

const TMDB_KEY = '3ea9e43d0b879725ac8fda707021e858';
const TMDB_IMG = 'https://image.tmdb.org/t/p/';

export async function fetchTMDB(endpoint, page = 1) {
  try {
    const sep = endpoint.includes('?') ? '&' : '?';
    const res = await fetch(`https://api.themoviedb.org/3${endpoint}${sep}api_key=${TMDB_KEY}&language=en-US&page=${page}`);
    return res.ok ? await res.json() : null;
  } catch (e) { return null; }
}

/* ---------------- Wikipedia (batched) ---------------- */
const wikiCache = new Map(Object.entries(load('wikiimg', {})));
let wikiSaveT = null;
const persistWiki = () => {
  clearTimeout(wikiSaveT);
  wikiSaveT = setTimeout(() => {
    const obj = {}; let n = 0;
    for (const [k, v] of wikiCache) { if (n++ > 1500) break; obj[k] = v; }
    save('wikiimg', obj);
  }, 400);
};

const WIKI = 'https://en.wikipedia.org/w/api.php?format=json&origin=*&formatversion=2';

async function wikiBatch(titles) {
  const url = `${WIKI}&action=query&redirects=1&prop=pageimages&piprop=thumbnail&pithumbsize=600&pilimit=50&titles=${encodeURIComponent(titles.join('|'))}`;
  const res = await fetch(url);
  const data = await res.json();
  const q = data.query || {};
  const map = {};
  (q.normalized || []).forEach(n => { map[n.from] = n.to; });
  const redir = {};
  (q.redirects || []).forEach(r => { redir[r.from] = r.to; });
  const byTitle = {};
  (q.pages || []).forEach(p => { if (p.thumbnail) byTitle[p.title] = p.thumbnail.source; });
  const out = {};
  for (const t of titles) {
    let k = map[t] || t; k = redir[k] || k;
    out[t] = byTitle[k] || null;
  }
  return out;
}

async function wikiSearchImage(query) {
  try {
    const url = `${WIKI}&action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=pageimages&piprop=thumbnail&pithumbsize=600`;
    const data = await (await fetch(url)).json();
    const p = (data.query?.pages || [])[0];
    return p?.thumbnail?.source || null;
  } catch (e) { return null; }
}

export async function wikiImages(names) {
  const result = {};
  const need = names.filter(n => { if (wikiCache.has(n)) { result[n] = wikiCache.get(n); return false; } return true; });
  for (let i = 0; i < need.length; i += 50) {
    try {
      const got = await wikiBatch(need.slice(i, i + 50));
      Object.assign(result, got);
    } catch (e) {}
  }
  const misses = need.filter(n => !result[n]);
  await Promise.all(misses.map(async n => { result[n] = await wikiSearchImage(n); }));
  for (const n of need) if (result[n]) wikiCache.set(n, result[n]);
  persistWiki();
  return result;
}

/* ---------------- Image preloading ---------------- */
export function preload(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

async function finalise(pool, onProgress) {
  // Load images in parallel batches until we have 10 that render.
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

/* ---------------- Deck loaders ---------------- */
export async function loadDeck(item, onProgress) {
  if (item.type === 'wiki') {
    const names = shuffle(item.items);
    const imgs = await wikiImages(names);
    const pool = names.filter(n => imgs[n]).map(n => ({ id: n, name: cleanName(n), img: imgs[n] }));
    return finalise(pool, onProgress);
  }
  if (item.type === 'custom') {
    const top = item.queries.slice(0, 3);
    const anchor = top[Math.floor(Math.random() * top.length)];
    const order = [anchor, ...shuffle(item.queries.filter(q => q !== anchor))];
    const found = await Promise.all(order.map(async q => {
      const kind = q.t === 'person' ? 'person' : q.t === 'tv' ? 'tv' : 'movie';
      const res = await fetchTMDB(`/search/${kind}?query=${encodeURIComponent(q.q)}`);
      const r = res?.results?.[0];
      const path = r && (r.profile_path || r.poster_path);
      return path ? { id: q.n, name: q.n, img: `${TMDB_IMG}w500${path}` } : null;
    }));
    return finalise(found.filter(Boolean), onProgress);
  }
  // TMDB discover endpoint
  const pages = await Promise.all([1, 2, 3, 4].map(p => fetchTMDB(item.endpoint, p)));
  let media = pages.flatMap(r => r?.results || []).filter(m => m.poster_path && (m.title || m.name));
  if (media.length < 10) {
    const fb = item.endpoint.includes('/tv') ? '/discover/tv?sort_by=popularity.desc' : '/discover/movie?sort_by=popularity.desc';
    const more = await Promise.all([1, 2].map(p => fetchTMDB(fb, p)));
    media = media.concat(more.flatMap(r => r?.results || []).filter(m => m.poster_path && (m.title || m.name)));
  }
  const unique = Array.from(new Map(media.map(m => [m.id, { id: m.id, name: m.title || m.name, img: `${TMDB_IMG}w500${m.poster_path}` }])).values());
  if (unique.length < 10) throw new Error('Couldn’t reach the movie database. Check your connection and try again.');
  const anchor = unique.slice(0, 5)[Math.floor(Math.random() * Math.min(5, unique.length))];
  return finalise([anchor, ...shuffle(unique.filter(m => m !== anchor))], onProgress);
}

/* ---------------- Challenge thumbnails (for rows / banners) ---------------- */
const thumbCache = load('thumbs', {});
const inflight = {};
let active = 0; const waiting = [];
const slot = () => new Promise(r => { if (active < 4) { active++; r(); } else waiting.push(r); });
const release = () => { active--; const n = waiting.shift(); if (n) { active++; n(); } };

export const itemKey = item => `${item.type}:${item.id}:${item.endpoint || ''}`;
export function cachedThumb(item) { return thumbCache[itemKey(item)] || null; }

export function thumbFor(item) {
  const key = itemKey(item);
  if (thumbCache[key]) return Promise.resolve(thumbCache[key]);
  if (inflight[key]) return inflight[key];
  inflight[key] = (async () => {
    await slot();
    let url = null;
    try {
      if (item.type === 'game') {
        const r = await fetchTMDB(item.endpoint, 1);
        const m = (r?.results || []).find(x => x.backdrop_path) || (r?.results || [])[0];
        if (m) url = m.backdrop_path ? `${TMDB_IMG}w780${m.backdrop_path}` : `${TMDB_IMG}w500${m.poster_path}`;
      } else if (item.type === 'custom') {
        const q = item.queries[0];
        const kind = q.t === 'person' ? 'person' : q.t === 'tv' ? 'tv' : 'movie';
        const r = await fetchTMDB(`/search/${kind}?query=${encodeURIComponent(q.q)}`);
        const m = r?.results?.[0];
        if (m) url = m.backdrop_path ? `${TMDB_IMG}w780${m.backdrop_path}` : (m.profile_path || m.poster_path) ? `${TMDB_IMG}w500${m.profile_path || m.poster_path}` : null;
      } else if (item.type === 'wiki') {
        const imgs = await wikiImages([item.items[0], item.items[1]]);
        url = imgs[item.items[0]] || imgs[item.items[1]] || null;
      }
    } catch (e) {}
    release();
    if (url) { thumbCache[key] = url; save('thumbs', thumbCache); }
    delete inflight[key];
    return url;
  })();
  return inflight[key];
}
