// Pure data lookups (no DOM) — shared by the app and the CI validator.
export const TMDB_KEY = '3ea9e43d0b879725ac8fda707021e858';
export const TMDB_IMG = 'https://image.tmdb.org/t/p/';
const WIKI = 'https://en.wikipedia.org/w/api.php?format=json&origin=*&formatversion=2';

export async function fetchTMDB(endpoint, page = 1) {
  try {
    const sep = endpoint.includes('?') ? '&' : '?';
    const res = await fetch(`https://api.themoviedb.org/3${endpoint}${sep}api_key=${TMDB_KEY}&language=en-US&page=${page}&include_adult=false`);
    return res.ok ? await res.json() : null;
  } catch (e) { return null; }
}

/** 'Wikipedia Title|Display' -> { title, name } */
export function parseWikiItem(s) {
  const [title, display] = s.split('|');
  return { title, name: display || title.replace(/ \([^)]*\)$/, '') };
}

async function wikiBatch(titles) {
  // pilicense=any so posters, logos, crests and character art are included.
  const url = `${WIKI}&action=query&redirects=1&prop=pageimages&piprop=thumbnail&pithumbsize=600&pilimit=50&pilicense=any&titles=${encodeURIComponent(titles.join('|'))}`;
  const data = await (await fetch(url)).json();
  const q = data.query || {};
  const norm = {}; (q.normalized || []).forEach(n => { norm[n.from] = n.to; });
  const redir = {}; (q.redirects || []).forEach(r => { redir[r.from] = r.to; });
  const byTitle = {}; (q.pages || []).forEach(p => { if (p.thumbnail) byTitle[p.title] = p.thumbnail.source; });
  const out = {};
  for (const t of titles) { let k = norm[t] || t; k = redir[k] || k; out[t] = byTitle[k] || null; }
  return out;
}

async function wikiSearch(query) {
  try {
    const url = `${WIKI}&action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=pageimages&piprop=thumbnail&pithumbsize=600&pilicense=any`;
    const data = await (await fetch(url)).json();
    return (data.query?.pages || [])[0]?.thumbnail?.source || null;
  } catch (e) { return null; }
}

/** titles -> { title: imageUrl|null } */
export async function wikiResolve(titles, cache) {
  const result = {};
  const need = titles.filter(t => { if (cache && cache.has(t)) { result[t] = cache.get(t); return false; } return true; });
  for (let i = 0; i < need.length; i += 50) {
    try { Object.assign(result, await wikiBatch(need.slice(i, i + 50))); } catch (e) {}
  }
  const misses = need.filter(t => !result[t]);
  await Promise.all(misses.map(async t => { result[t] = await wikiSearch(t.replace(/[()]/g, ' ')); }));
  if (cache) for (const t of need) if (result[t]) cache.set(t, result[t]);
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
  const lower = q.q.toLowerCase();
  const exact = list.find(r => ((r.title || r.name || '') + '').toLowerCase() === lower);
  const r = exact || list[0];
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
