// Pure data lookups (no DOM) — shared by the app and the CI validator.
export const TMDB_KEY = '3ea9e43d0b879725ac8fda707021e858';
export const TMDB_IMG = 'https://image.tmdb.org/t/p/';
const WIKI = 'https://en.wikipedia.org/w/api.php?format=json&origin=*&formatversion=2';

export async function fetchTMDB(endpoint, page = 1) {
  try {
    if (typeof endpoint !== 'string' || !endpoint.startsWith('/')) return null;
    const sep = endpoint.includes('?') ? '&' : '?';
    const res = await fetch(`https://api.themoviedb.org/3${endpoint}${sep}api_key=${TMDB_KEY}&language=en-US&page=${page}&include_adult=false`, { signal: AbortSignal.timeout(8000) });
    return res.ok ? await res.json() : null;
  } catch (e) { return null; }
}

/** 'Wikipedia Title|Display|@channel' -> { title, name } */
export function parseWikiItem(s) {
  const [title, display] = s.split('|');
  const name = display || title.replace(/ \([^)]*\)$/, '');
  return { title: title || name, name };
}

const norm = s => (s || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]/g, '');
const stripParen = s => (s || '').replace(/\s*\([^)]*\)\s*$/, '');
// Never show a signature, logo or placeholder as somebody's photo.
const BAD_ANY = /(signature|autograph|_sig[._ -]|\bsig\.svg|signatur|placeholder|no[_ -]?image|question[_ ]book|ambox|silhouette)/i;
const BAD_PERSON = /(logo|wordmark|\.svg|map[_ .]|locator|flag[_ ]of|coat[_ ]of[_ ]arms|crest|emblem|poster|cover[_ ]art)/i;
const fileOk = (url, kind) => {
  if (!url) return false;
  const f = decodeURIComponent(url.split('/').pop());
  return !BAD_ANY.test(f) && !((kind === 'person' || kind === 'artist') && BAD_PERSON.test(f));
};

async function wikiBatch(titles, kind) {
  // pilicense=any so posters, logos, crests and character art are included.
  const url = `${WIKI}&action=query&redirects=1&prop=pageimages|pageprops&ppprop=disambiguation&piprop=thumbnail&pithumbsize=600&pilimit=50&pilicense=any&titles=${encodeURIComponent(titles.join('|'))}`;
  const data = await (await fetch(url, { signal: AbortSignal.timeout(8000) })).json();
  const q = data.query || {};
  const norm2 = {}; (q.normalized || []).forEach(n => { norm2[n.from] = n.to; });
  const redir = {}; (q.redirects || []).forEach(r => { redir[r.from] = r; });
  const byTitle = {}; (q.pages || []).forEach(p => { if (p.thumbnail && !(p.pageprops && 'disambiguation' in p.pageprops)) byTitle[p.title] = p.thumbnail.source; });
  const person = kind === 'person' || kind === 'artist';
  const out = {};
  for (const t of titles) {
    let k = norm2[t] || t; const r = redir[k];
    if (r) { if (r.tofragment) { out[t] = null; continue; } k = r.to; }
    const img = byTitle[k] || null;
    out[t] = img && fileOk(img, kind) ? img : null;
  }
  return out;
}

// Search only counts when the article title IS the name we asked for — never "first result".
async function wikiSearch(title, kind) {
  try {
    const url = `${WIKI}&action=query&generator=search&gsrsearch=${encodeURIComponent(title.replace(/[()]/g, ' '))}&gsrlimit=5&prop=pageimages|pageprops&ppprop=disambiguation&piprop=thumbnail&pithumbsize=600&pilicense=any`;
    const data = await (await fetch(url, { signal: AbortSignal.timeout(8000) })).json();
    const want = norm(title);
    const p = (data.query?.pages || []).sort((a, b) => (a.index || 0) - (b.index || 0))
      .find(p => p.thumbnail && !(p.pageprops && 'disambiguation' in p.pageprops) && norm(p.title) === want);
    return p && fileOk(p.thumbnail.source, kind) ? p.thumbnail.source : null;
  } catch (e) { return null; }
}

/** titles -> { title: imageUrl|null } */
export async function wikiResolve(titles, cache, kind) {
  const result = {};
  const need = titles.filter(t => { if (cache && cache.has(`${kind || 'any'}:${t}`)) { result[t] = cache.get(`${kind || 'any'}:${t}`); return false; } return true; });
  for (let i = 0; i < need.length; i += 50) {
    try { Object.assign(result, await wikiBatch(need.slice(i, i + 50), kind)); } catch (e) {}
  }
  const misses = need.filter(t => !result[t]);
  for (let i = 0; i < misses.length; i += 3) {
    await Promise.all(misses.slice(i, i + 3).map(async t => { result[t] = await wikiSearch(t, kind); }));
  }
  if (cache) for (const t of need) if (result[t]) cache.set(`${kind || 'any'}:${t}`, result[t]);
  // Two picks can never share a picture.
  const seen = new Set();
  for (const t of titles) { const u = result[t]; if (!u) continue; const k = decodeURIComponent(u.split('/').pop()).replace(/^\d+px-/, ''); if (seen.has(k)) result[t] = null; else seen.add(k); }
  return result;
}

/** A TMDB title/person query -> image url (poster for films/shows, photo for people). */
export async function tmdbImage(q) {
  const kind = q.t === 'person' ? 'person' : q.t === 'tv' ? 'tv' : 'movie';
  const yearParam = q.y ? (kind === 'movie' ? `&primary_release_year=${q.y}` : `&first_air_date_year=${q.y}`) : '';
  let res = await fetchTMDB(`/search/${kind}?query=${encodeURIComponent(q.q)}${yearParam}`);
  if (q.y && !(res?.results?.length)) res = await fetchTMDB(`/search/${kind}?query=${encodeURIComponent(q.q)}`);
  const list = res?.results || [];
  // Prefer an exact title match, then the most popular result.
  const N = norm(q.q);
  const names = r => [r.title, r.name, r.original_title, r.original_name].filter(Boolean).map(norm);
  const exact = list.filter(r => names(r).includes(N)).sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  // People must match exactly; films/shows may use a year-matched close title.
  const r = exact[0] || (kind !== 'person' && q.y ? list.find(r => names(r).some(n => n.includes(N) || N.includes(n))) : null);
  const path = r && (kind === 'person' ? r.profile_path : r.poster_path);
  return path ? `${TMDB_IMG}w500${path}` : null;
}

/** Fresh results from a live chart, using a random spread of pages so rounds differ. */
export async function liveResults(item, random = Math.random) {
  const maxPages = item.pages || 3;
  const first = await fetchTMDB(item.endpoint, 1);
  const total = Math.min(maxPages, first?.total_pages || 1);
  const pages = [];
  for (let p = 2; p <= total; p++) pages.push(p);
  pages.sort(() => random() - 0.5);
  const extra = await Promise.all(pages.slice(0, 2).map(p => fetchTMDB(item.endpoint, p)));
  const media = [first, ...extra].flatMap(r => r?.results || []).filter(m => m.poster_path && (m.title || m.name));
  return Array.from(new Map(media.map(m => [m.id, { id: String(m.id), name: m.title || m.name, img: `${TMDB_IMG}w500${m.poster_path}` }])).values());
}
