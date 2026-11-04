// Nightly catalog builder — runs in GitHub Actions.
// Resolves an image for every pick in every category, generates fresh "right now"
// categories from free APIs, drops anything with fewer than 10 working picks,
// and writes catalog.json (served to the app via CDN + bundled in the APK).
//
// Sources (all free):
//   TMDB (films, TV, people, charts, streaming)   · Wikipedia/Wikimedia (everything else)
//   Jikan / MyAnimeList (anime, characters, manga) · Deezer (live music charts)
//   iTunes Search (album artwork)                  · PokéAPI (all Pokémon artwork)
//   Riot Data Dragon (League champions)            · valorant-api.com (agents)
//   akabab Superhero API (comic characters)        · HP-API · ThronesAPI · Jolpica F1
import fs from 'fs';
import { MENU_DATA } from './src/data.js';

const TMDB_KEY = process.env.TMDB_KEY || '3ea9e43d0b879725ac8fda707021e858';
const UA = 'BlindRankCatalog/1.0 (https://github.com/ab19902020/Blind-rankings-)';
const OUT = process.argv[2] || 'catalog.json';
const NOW = new Date();
const Y = NOW.getFullYear();

/* ---------------- polite fetch ---------------- */
const lastHit = {};
const pace = { 'en.wikipedia.org': 110, 'api.jikan.moe': 1100, 'itunes.apple.com': 350, 'api.deezer.com': 120 };
async function get(url, { json = true } = {}) {
  const host = new URL(url).host;
  if (pace[host]) { const wait = Math.max(0, (lastHit[host] || 0) + pace[host] - Date.now()); lastHit[host] = Date.now() + wait; if (wait) await sleep(wait); }
  for (let a = 0; a < 5; a++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
      if (r.status === 429 || r.status >= 500) { await sleep(1500 * (a + 1)); continue; }
      if (!r.ok) return null;
      return json ? await r.json() : await r.text();
    } catch (e) { await sleep(1000 * (a + 1)); }
  }
  return null;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function mapLimit(list, n, fn) {
  const out = new Array(list.length); let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < list.length) { const k = i++; out[k] = await fn(list[k], k); } }));
  return out;
}

/* ---------------- image codes (keeps the catalog small) ---------------- */
const tPoster = p => p ? 't:' + p : null;          // image.tmdb.org/t/p/w500
const tBack = p => p ? 'b:' + p : null;            // image.tmdb.org/t/p/w780
const wImg = u => u ? (u.startsWith('https://upload.wikimedia.org/wikipedia/') ? 'w:' + u.slice(39) : u) : null;

/* ---------------- TMDB ---------------- */
const tmdb = (path) => get(`https://api.themoviedb.org/3${path}${path.includes('?') ? '&' : '?'}api_key=${TMDB_KEY}&language=en-GB&include_adult=false`);
const tmdbCache = new Map();
async function tmdbFind(q) {
  const key = `${q.t}|${q.q}|${q.y || ''}`;
  if (tmdbCache.has(key)) return tmdbCache.get(key);
  const kind = q.t === 'person' ? 'person' : q.t === 'tv' ? 'tv' : 'movie';
  const yp = q.y ? (kind === 'movie' ? `&primary_release_year=${q.y}` : `&first_air_date_year=${q.y}`) : '';
  let r = await tmdb(`/search/${kind}?query=${encodeURIComponent(q.q)}${yp}`);
  if (q.y && !r?.results?.length && kind === 'movie') r = await tmdb(`/search/movie?query=${encodeURIComponent(q.q)}&year=${q.y}`);
  if (q.y && !r?.results?.length) r = await tmdb(`/search/${kind}?query=${encodeURIComponent(q.q)}`);
  const list = r?.results || [];
  const lower = q.q.toLowerCase();
  const m = list.find(x => (x.title || x.name || '').toLowerCase() === lower && (kind === 'person' ? x.profile_path : x.poster_path)) || list.find(x => kind === 'person' ? x.profile_path : x.poster_path);
  const res = m ? { img: tPoster(kind === 'person' ? m.profile_path : m.poster_path), back: tBack(m.backdrop_path) } : null;
  tmdbCache.set(key, res);
  return res;
}
async function tmdbList(endpoint, pages = 2, { kind } = {}) {
  const rs = [];
  for (let p = 1; p <= pages; p++) { const r = await tmdb(`${endpoint}${endpoint.includes('?') ? '&' : '?'}page=${p}`); if (!r?.results?.length) break; rs.push(...r.results); if (p >= (r.total_pages || 1)) break; }
  const seen = new Set(); const pool = []; let thumb = null;
  for (const m of rs) {
    const name = m.title || m.name; const img = kind === 'person' ? m.profile_path : m.poster_path;
    if (!name || !img || seen.has(name)) continue; seen.add(name);
    if (kind === 'person' && m.known_for_department && m.known_for_department !== 'Acting') continue;
    pool.push([name, tPoster(img)]);
    if (!thumb && m.backdrop_path) thumb = tBack(m.backdrop_path);
  }
  return { pool, thumb };
}

/* ---------------- Wikipedia ---------------- */
const WIKI = 'https://en.wikipedia.org/w/api.php?format=json&formatversion=2';
const wikiCache = new Map();
async function wikiImages(titles) {
  const need = [...new Set(titles)].filter(t => !wikiCache.has(t));
  for (let i = 0; i < need.length; i += 50) {
    const chunk = need.slice(i, i + 50);
    const d = await get(`${WIKI}&action=query&redirects=1&prop=pageimages&piprop=thumbnail&pithumbsize=500&pilimit=50&pilicense=any&titles=${encodeURIComponent(chunk.join('|'))}`);
    const q = d?.query || {};
    const norm = {}; (q.normalized || []).forEach(n => { norm[n.from] = n.to; });
    const redir = {}; (q.redirects || []).forEach(r => { redir[r.from] = r.to; });
    const by = {}; (q.pages || []).forEach(p => { if (p.thumbnail) by[p.title] = p.thumbnail.source; });
    for (const t of chunk) { let k = norm[t] || t; k = redir[k] || k; if (by[k]) wikiCache.set(t, by[k]); }
  }
  for (const t of need.filter(t => !wikiCache.has(t))) {
    const d = await get(`${WIKI}&action=query&generator=search&gsrsearch=${encodeURIComponent(t.replace(/[()]/g, ' '))}&gsrlimit=1&prop=pageimages&piprop=thumbnail&pithumbsize=500&pilicense=any`);
    wikiCache.set(t, d?.query?.pages?.[0]?.thumbnail?.source || null);
  }
  const out = {}; for (const t of titles) out[t] = wikiCache.get(t) || null; return out;
}
const parseWiki = s => { const [title, display] = s.split('|'); return { title, name: display || title.replace(/ \([^)]*\)$/, '') }; };

/* ---------------- other sources ---------------- */
async function itunesAlbum(album, artist) {
  const r = await get(`https://itunes.apple.com/search?term=${encodeURIComponent(artist + ' ' + album)}&entity=album&limit=8&country=GB`);
  const list = r?.results || [];
  const norm = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const m = list.find(x => norm(x.collectionName).startsWith(norm(album)) && norm(x.artistName).includes(norm(artist).slice(0, 6))) || list.find(x => norm(x.collectionName).includes(norm(album)));
  return m?.artworkUrl100 ? m.artworkUrl100.replace('100x100bb', '600x600bb') : null;
}
let heroData = null;
async function heroImage(name) {
  if (!heroData) heroData = (await get('https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json')) || [];
  const m = heroData.find(h => h.name.toLowerCase() === name.toLowerCase() && /Marvel|DC/.test(h.biography?.publisher || ''));
  if (m?.images?.lg) return m.images.lg;
  const w = await wikiImages([`${name} (character)`, `${name} (Marvel Comics)`]);
  return wImg(w[`${name} (character)`] || w[`${name} (Marvel Comics)`]);
}

/* ---------------- curated leaf -> pool ---------------- */
async function resolveCurated(it) {
  if (it.type === 'wiki') {
    const parsed = it.items.map(parseWiki);
    const imgs = await wikiImages(parsed.map(p => p.title));
    const pool = parsed.filter(p => imgs[p.title]).map(p => [p.name, wImg(imgs[p.title])]);
    return { pool, missing: parsed.filter(p => !imgs[p.title]).map(p => p.title) };
  }
  if (it.type === 'custom') {
    const res = await mapLimit(it.queries, 6, q => tmdbFind(q));
    const pool = [], missing = []; let thumb = null;
    it.queries.forEach((q, i) => { if (res[i]) { pool.push([q.n, res[i].img]); if (!thumb && res[i].back && q.t !== 'person') thumb = res[i].back; } else missing.push(q.q + (q.y ? ` (${q.y})` : '')); });
    return { pool, missing, thumb };
  }
  if (it.type === 'game') {
    const { pool, thumb } = await tmdbList(it.endpoint, Math.max(3, it.pages || 3));
    return { pool, thumb, missing: [] };
  }
  if (it.type === 'albums') {
    const res = await mapLimit(it.items, 2, s => { const [a, b] = s.split('|'); return itunesAlbum(a, b); });
    const pool = [], missing = [];
    it.items.forEach((s, i) => { const [a] = s.split('|'); res[i] ? pool.push([a, res[i]]) : missing.push(s); });
    return { pool, missing };
  }
  if (it.type === 'heroes') {
    const res = await mapLimit(it.items, 4, heroImage);
    const pool = [], missing = [];
    it.items.forEach((n, i) => res[i] ? pool.push([n, res[i]]) : missing.push(n));
    return { pool, missing };
  }
  return { pool: [], missing: ['unknown type'] };
}

/* ---------------- fresh, generated categories ---------------- */
const fresh = (id, name, icon, fn, kind) => ({ id, name, icon, fn, kind });
const GB = 'watch_region=GB';
const PROVIDERS = [['Netflix', 8, 'N'], ['Prime Video', 9, '📦'], ['Disney+', 337, '🏰'], ['Apple TV+', 350, '🍎'], ['BBC iPlayer', 38, '📻']];

function generators() {
  const movieNow = [
    fresh('fm_trend', 'Trending This Week', '🔥', () => tmdbList('/trending/movie/week', 3)),
    fresh('fm_cinema', 'In Cinemas Now', '🎟️', () => tmdbList('/movie/now_playing?region=GB', 3)),
    fresh('fm_y0', `Best of ${Y}`, '🆕', () => tmdbList(`/discover/movie?primary_release_year=${Y}&sort_by=vote_count.desc&vote_count.gte=150`, 3)),
    fresh('fm_y1', `Best of ${Y - 1}`, '📅', () => tmdbList(`/discover/movie?primary_release_year=${Y - 1}&sort_by=vote_count.desc&vote_count.gte=300`, 3)),
    fresh('fm_y2', `Best of ${Y - 2}`, '📅', () => tmdbList(`/discover/movie?primary_release_year=${Y - 2}&sort_by=vote_count.desc&vote_count.gte=500`, 3)),
    fresh('fm_box', 'Biggest Box Office Hits', '💰', () => tmdbList('/discover/movie?sort_by=revenue.desc', 3)),
    ...PROVIDERS.slice(0, 4).map(([n, id, ic]) => fresh(`fm_p${id}`, `Films on ${n}`, ic, () => tmdbList(`/discover/movie?${GB}&with_watch_providers=${id}&sort_by=popularity.desc&vote_count.gte=200`, 3))),
  ];
  const tvNow = [
    fresh('ft_trend', 'Trending TV This Week', '🔥', () => tmdbList('/trending/tv/week', 3)),
    fresh('ft_y0', `Best TV of ${Y}`, '🆕', () => tmdbList(`/discover/tv?first_air_date_year=${Y}&sort_by=vote_count.desc&vote_count.gte=40&without_genres=10767,10763`, 3)),
    fresh('ft_y1', `Best TV of ${Y - 1}`, '📅', () => tmdbList(`/discover/tv?first_air_date_year=${Y - 1}&sort_by=vote_count.desc&vote_count.gte=80&without_genres=10767,10763`, 3)),
    ...PROVIDERS.map(([n, id, ic]) => fresh(`ft_p${id}`, `Shows on ${n}`, ic, () => tmdbList(`/discover/tv?${GB}&with_watch_providers=${id}&sort_by=popularity.desc&vote_count.gte=50&without_genres=10767,10763`, 3))),
  ];
  const jikan = async (path, map) => {
    const out = []; const seen = new Set();
    for (let p = 1; p <= 2; p++) {
      const r = await get(`https://api.jikan.moe/v4${path}${path.includes('?') ? '&' : '?'}page=${p}`);
      for (const x of r?.data || []) { const [n, img] = map(x); if (n && img && !seen.has(n)) { seen.add(n); out.push([n, img]); } }
    }
    return { pool: out };
  };
  const animeImg = x => x.images?.webp?.large_image_url || x.images?.jpg?.large_image_url;
  const anime = [
    fresh('fa_season', 'This Season’s Anime', '🌸', () => jikan('/seasons/now?sfw=true&limit=25&filter=tv', x => [x.title_english || x.title, animeImg(x)])),
    fresh('fa_top', 'Top Anime (MyAnimeList)', '⭐', () => jikan('/top/anime?limit=25&type=tv', x => [x.title_english || x.title, animeImg(x)])),
    fresh('fa_pop', 'Most Popular Anime', '🔥', () => jikan('/top/anime?limit=25&filter=bypopularity', x => [x.title_english || x.title, animeImg(x)])),
    fresh('fa_movies', 'Top Anime Movies', '🎞️', () => jikan('/top/anime?limit=25&type=movie', x => [x.title_english || x.title, animeImg(x)])),
    fresh('fa_chars', 'Most Loved Anime Characters', '💖', () => jikan('/top/characters?limit=25', x => [x.name, x.images?.webp?.image_url || x.images?.jpg?.image_url])),
    fresh('fa_manga', 'Top Manga', '📖', () => jikan('/top/manga?limit=25&type=manga', x => [x.title_english || x.title, animeImg(x)])),
  ];
  const deezer = async (path, map) => { const r = await get(`https://api.deezer.com${path}`); const seen = new Set(); const pool = []; for (const x of r?.data || []) { const [n, img] = map(x); if (n && img && !seen.has(n)) { seen.add(n); pool.push([n, img]); } } return { pool }; };
  const music = [
    fresh('fmu_uk', 'UK Top Songs Right Now', '🇬🇧', () => deezer('/playlist/1111142221/tracks?limit=60', t => [`${t.title_short || t.title} – ${t.artist?.name}`, t.album?.cover_xl])),
    fresh('fmu_global', 'Global Top Songs', '🌍', () => deezer('/chart/0/tracks?limit=60', t => [`${t.title_short || t.title} – ${t.artist?.name}`, t.album?.cover_xl])),
    fresh('fmu_artists', 'Biggest Artists Right Now', '🎤', () => deezer('/chart/0/artists?limit=60', a => [a.name, a.picture_xl])),
    fresh('fmu_albums', 'Top Albums Right Now', '💿', () => deezer('/chart/0/albums?limit=60', a => [`${a.title} – ${a.artist?.name}`, a.cover_xl])),
  ];
  const art = id => `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/${id}.png`;
  const cap = s => s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  const pokeGen = n => async () => {
    const r = await get(`https://pokeapi.co/api/v2/generation/${n}`);
    const pool = (r?.pokemon_species || []).map(sp => { const id = +sp.url.split('/').filter(Boolean).pop(); return [id, cap(sp.name), art(id)]; }).sort((a, b) => a[0] - b[0]).map(([, nm, img]) => [nm, img]);
    return { pool };
  };
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
  const regions = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola', 'Galar', 'Paldea'];
  const games = [
    fresh('fg_lol', 'League of Legends Champions', '⚔️', async () => {
      const v = (await get('https://ddragon.leagueoflegends.com/api/versions.json'))?.[0];
      const d = v && await get(`https://ddragon.leagueoflegends.com/cdn/${v}/data/en_GB/champion.json`);
      return { pool: Object.values(d?.data || {}).map(c => [c.name, `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${c.id}_0.jpg`]) };
    }),
    fresh('fg_val', 'Valorant Agents', '🎯', async () => {
      const d = await get('https://valorant-api.com/v1/agents?isPlayableCharacter=true');
      return { pool: (d?.data || []).map(a => [a.displayName, a.fullPortrait || a.displayIcon]).filter(x => x[1]) };
    }),
  ];
  const poke = regions.map((r, i) => fresh(`fp_gen${i + 1}`, `Gen ${roman[i]} Pokémon (${r})`, '🔴', pokeGen(i + 1)));
  const people = [fresh('fa_hot', 'Hottest Stars This Week', '🔥', () => tmdbList('/person/popular', 4, { kind: 'person' }), 'people')];
  const franchiseChars = [
    fresh('fc_hp', 'Harry Potter Characters', '⚡', async () => {
      const d = (await get('https://hp-api.onrender.com/api/characters')) || [];
      return { pool: d.filter(c => c.image).map(c => [c.name, c.image]) };
    }),
  ];
  const tvChars = [
    fresh('fc_got', 'Game of Thrones Characters', '🐉', async () => {
      const d = (await get('https://thronesapi.com/api/v2/Characters')) || [];
      return { pool: d.filter(c => c.imageUrl).map(c => [c.fullName, c.imageUrl]) };
    }),
  ];
  const f1 = [
    fresh('fs_f1grid', `F1 ${Y} Grid`, '🏁', async () => {
      const d = await get('https://api.jolpi.ca/ergast/f1/current/drivers.json');
      const drivers = d?.MRData?.DriverTable?.Drivers || [];
      const titles = drivers.map(x => decodeURIComponent((x.url || '').split('/wiki/')[1] || `${x.givenName} ${x.familyName}`).replace(/_/g, ' '));
      const imgs = await wikiImages(titles);
      return { pool: drivers.map((x, i) => [`${x.givenName} ${x.familyName}`, wImg(imgs[titles[i]])]).filter(p => p[1]) };
    }),
  ];
  return { movieNow, tvNow, anime, music, games, poke, people, franchiseChars, tvChars, f1 };
}

/* ---------------- build ---------------- */
const report = [];
function finishLeaf(base, res, extra = {}) {
  const pool = (res.pool || []).filter(p => p[0] && p[1]);
  report.push({ id: base.id, name: base.name, found: pool.length, pool: pool.length + (res.missing?.length || 0), missing: res.missing || [], ok: pool.length >= 10 });
  if (pool.length < 10) return null;
  const leaf = { type: 'pool', id: base.id, name: base.name, icon: base.icon, kind: extra.kind || base.kind || base.type, pool: pool.slice(0, 120) };
  if (res.thumb) leaf.thumb = res.thumb;
  if (base.themeOverride) leaf.themeOverride = base.themeOverride;
  if (extra.fresh) leaf.fresh = true;
  return leaf;
}

async function main() {
  const t0 = Date.now();
  const menu = JSON.parse(JSON.stringify(MENU_DATA));
  // curated
  const curated = [];
  for (const [mid, list] of Object.entries(MENU_DATA)) list.forEach((it, i) => { if (it.type !== 'nav') curated.push([mid, i, it]); });
  let done = 0;
  await mapLimit(curated, 3, async ([mid, i, it]) => {
    const res = await resolveCurated(it);
    menu[mid][i] = finishLeaf(it, res);
    if (++done % 20 === 0) console.log(`curated ${done}/${curated.length}`);
  });
  for (const k of Object.keys(menu)) menu[k] = menu[k].filter(Boolean);

  // generated
  const g = generators();
  const runAll = async (list, extra) => (await mapLimit(list, 2, async f => { let res = { pool: [] }; try { res = await f.fn(); } catch (e) { res = { pool: [], missing: [String(e)] }; } return finishLeaf(f, res, { fresh: true, kind: f.kind || 'fresh', ...extra }); })).filter(Boolean);
  const [mNow, tNow, an, mu, ga, po, pe, fc, tc, f1] = await Promise.all([g.movieNow, g.tvNow, g.anime, g.music, g.games, g.poke, g.people, g.franchiseChars, g.tvChars, g.f1].map(l => runAll(l)));
  const nav = (id, name, icon, desc) => ({ type: 'nav', id, name, icon, desc });
  if (mNow.length) { menu.m_now = mNow; menu.movies.unshift(nav('m_now', 'NEW & TRENDING', '🆕', `TRENDING, IN CINEMAS, BEST OF ${Y}`)); }
  if (tNow.length) { menu.tv_now = tNow; menu.tv.unshift(nav('tv_now', 'NEW & TRENDING', '🆕', 'NETFLIX, PRIME, DISNEY+, IPLAYER')); }
  if (an.length) menu.anime.unshift(...an);
  if (mu.length) { menu.mu_charts = mu; menu.music.unshift(nav('mu_charts', 'LIVE CHARTS', '📈', 'UK TOP SONGS, BIGGEST ARTISTS')); }
  if (ga.length) menu.games.push(...ga);
  if (po.length) { menu.vg_poke = po; menu.games.push(nav('vg_poke', 'POKÉMON BY GEN', '🔴', 'EVERY GENERATION, I – IX')); }
  if (pe.length) menu.actors.unshift(...pe);
  if (fc.length) (menu.m_chars ||= []).push(...fc);
  if (tc.length) (menu.tv_chars ||= []).push(...tc);
  if (f1.length) (menu.sp_global ||= []).unshift(...f1);
  // remove empty navs
  const emptyNav = id => !(menu[id] && menu[id].length);
  for (const k of Object.keys(menu)) menu[k] = menu[k].filter(x => x.type !== 'nav' || !emptyNav(x.id));

  const out = { version: 3, generatedAt: NOW.toISOString(), menu };
  fs.writeFileSync(OUT, JSON.stringify(out));
  const bad = report.filter(r => !r.ok);
  const md = [`# Blind Rank catalog — ${NOW.toISOString()}`, '', `${report.length} categories built · ${bad.length} dropped (<10 pictures) · ${Math.round((Date.now() - t0) / 1000)}s`, '',
    ...report.map(r => `- ${r.ok ? '✅' : '❌'} ${r.name} — ${r.found}${r.missing.length ? ` · missing: ${r.missing.slice(0, 12).join(', ')}` : ''}`)].join('\n');
  fs.writeFileSync('catalog-report.md', md);
  fs.writeFileSync('catalog-report.json', JSON.stringify(report, null, 1));
  console.log(`catalog: ${report.length - bad.length} categories, ${bad.length} dropped, ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB`);
}
main();
