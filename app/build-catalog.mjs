// Catalog builder — runs in GitHub Actions (nightly + on every data change).
// Resolves a picture for every pick in every category, generates fresh "right now"
// categories from free APIs, drops anything with fewer than 10 verified picks,
// and writes catalog.json (served to the app via CDN + bundled in the APK).
//
// Accuracy rules (why a pick gets a picture):
//   • Names must match. Wikipedia search fallbacks only count when the article title
//     IS the name we asked for — never "first search result" (that's how Joe Weller
//     ended up with KSI's face).
//   • Section redirects ("Name" → "Someone Else#Career") are rejected for people.
//   • Signatures, logos, maps and placeholder files are never used for people.
//   • YouTube/Twitch avatars are only used when the channel's own name matches.
//   • Two picks in one category can never share the same picture.
//
// Sources (all free):
//   YouTube channel avatars · Twitch avatars (decapi)   · Wikidata portraits + logos
//   Wikipedia page images   · Wikimedia Commons          · TMDB (films, TV, people)
//   Deezer (artists, albums, charts) · iTunes · Apple Music RSS (US/UK charts, podcasts, apps)
//   ESPN (NFL/NBA/MLB/NHL/WNBA/MLS headshots + team logos) · AniList (anime)
//   PokéAPI · Riot Data Dragon · valorant-api · akabab Superhero API · HP-API · ThronesAPI · Jolpica F1
import fs from 'fs';
import { MENU_DATA } from './src/data.js';

const TMDB_KEY = process.env.TMDB_KEY || '3ea9e43d0b879725ac8fda707021e858';
const UA = 'BlindRankCatalog/2.0 (https://github.com/ab19902020/Blind-rankings-; catalog bot)';
const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
const OUT = process.argv[2] || 'catalog.json';
const NOW = new Date();
const Y = NOW.getFullYear();
export const CATALOG_VERSION = 4;

/* ---------------- polite fetch ---------------- */
const lastHit = {};
const pace = {
  'en.wikipedia.org': 110, 'commons.wikimedia.org': 110, 'query.wikidata.org': 1200, 'www.wikidata.org': 200,
  'api.jikan.moe': 1100, 'itunes.apple.com': 3200, 'api.deezer.com': 130, 'www.youtube.com': 350,
  'decapi.me': 400, 'www.twitch.tv': 400, 'site.api.espn.com': 60, 'rss.applemarketingtools.com': 150,
};
const hostDown = {};
async function get(url, { json = true, headers = {}, ua = UA } = {}) {
  const host = new URL(url).host;
  if (hostDown[host] >= 8) return null; // stop hammering a host that is clearly blocking us
  if (pace[host]) { const wait = Math.max(0, (lastHit[host] || 0) + pace[host] - Date.now()); lastHit[host] = Date.now() + wait; if (wait) await sleep(wait); }
  for (let a = 0; a < 4; a++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': ua, Accept: json ? 'application/json' : 'text/html,*/*', ...headers }, signal: AbortSignal.timeout(20000) });
      if (r.status === 429 || r.status >= 500) { await sleep(1500 * (a + 1)); continue; }
      if (!r.ok) return null;
      hostDown[host] = 0;
      return json ? await r.json() : await r.text();
    } catch (e) { await sleep(1000 * (a + 1)); }
  }
  hostDown[host] = (hostDown[host] || 0) + 1;
  return null;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function mapLimit(list, n, fn) {
  const out = new Array(list.length); let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < list.length) { const k = i++; out[k] = await fn(list[k], k); } }));
  return out;
}

/* ---------------- names ---------------- */
const norm = s => (s || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]/g, '');
const stripParen = s => (s || '').replace(/\s*\([^)]*\)\s*$/, '');
const html = s => (s || '').replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
function sameName(found, wants) {
  const f = norm(stripParen(found));
  if (!f) return false;
  return wants.some(w => { const n = norm(stripParen(w)); return n && (n === f || (n.length >= 4 && f.length >= 4 && (f.includes(n) || n.includes(f)))); });
}

/* ---------------- image codes (keeps the catalog small) ---------------- */
const tPoster = p => p ? 't:' + p : null;          // image.tmdb.org/t/p/w500
const tBack = p => p ? 'b:' + p : null;            // image.tmdb.org/t/p/w780
const wImg = u => {
  if (!u) return null;
  u = u.replace(/\?utm_[^#]*$/, '');
  if (u.startsWith('https://upload.wikimedia.org/wikipedia/')) return 'w:' + u.slice(39);
  if (u.startsWith('https://thumb.wikimedia.org/wikipedia/')) return 'W:' + u.slice(38);
  return u;
};
// The file a picture really is, so two picks can't share one.
const imgKey = code => {
  let s = decodeURIComponent(String(code)).toLowerCase().split('?')[0];
  // Wikimedia: the same file can come as an original or any thumbnail size.
  if (/^[wW]:|wikimedia\.org\//i.test(String(code))) {
    const parts = s.split('/'); let last = parts.pop();
    if (/^\d+px-/.test(last) || /^lossy-page/.test(last)) last = parts.pop();
    return 'wm:' + last;
  }
  // Everything else (Deezer, Apple, ESPN, YouTube…): the whole address, minus size hints.
  return s.replace(/=s\d+.*$/, '').replace(/\/\d+x\d+[a-z0-9-]*\.(jpg|png|webp)$/, '');
};

/* ---------------- picture sanity ---------------- */
const BAD_ANY = /(signature|autograph|_sig[._ -]|\bsig\.svg|signatur|unterschrift|firma[_ .]|placeholder|no[_ -]?image|question[_ ]book|ambox|wiki[_ ]letter|commons-logo|disambig|edit-clear|replace[_ ]this[_ ]image|silhouette|default[_ -]?(avatar|image|profile)|blank[_ .]|location[_ ]dot)/i;
const BAD_PERSON = /(logo|wordmark|\.svg$|\.svg\.png$|map[_ .]|locator|flag[_ ]of|coat[_ ]of[_ ]arms|crest|emblem|seal[_ ]of|stadium|trophy|poster|album[_ ]cover|cover[_ ]art)/i;
function fileOk(file, kind) {
  if (!file) return true;
  const f = decodeURIComponent(file);
  if (BAD_ANY.test(f)) return false;
  if ((kind === 'person' || kind === 'artist') && BAD_PERSON.test(f)) return false;
  return true;
}

/* ---------------- TMDB (strict) ---------------- */
const tmdb = (path) => get(`https://api.themoviedb.org/3${path}${path.includes('?') ? '&' : '?'}api_key=${TMDB_KEY}&language=en-GB&include_adult=false`);
const tmdbCache = new Map();
const yearOf = x => +((x.release_date || x.first_air_date || '').slice(0, 4)) || 0;
async function tmdbFind(q) {
  const key = `${q.t}|${q.q}|${q.y || ''}`;
  if (tmdbCache.has(key)) return tmdbCache.get(key);
  const kind = q.t === 'person' ? 'person' : q.t === 'tv' ? 'tv' : 'movie';
  const N = norm(q.q);
  let m = null;
  if (kind === 'person') {
    const r = await tmdb(`/search/person?query=${encodeURIComponent(q.q)}`);
    // Exact name only; if several people share it, the most famous one.
    m = (r?.results || []).filter(x => x.profile_path && norm(x.name) === N).sort((a, b) => (b.popularity || 0) - (a.popularity || 0))[0] || null;
  } else {
    const titles = x => [x.title, x.name, x.original_title, x.original_name].filter(Boolean).map(norm);
    const exact = x => titles(x).includes(N);
    const close = x => titles(x).some(t => t.length >= 3 && (t.includes(N) || N.includes(t)));
    const yearClose = x => !q.y || Math.abs(yearOf(x) - +q.y) <= 1;
    const yp = q.y ? (kind === 'movie' ? `&primary_release_year=${q.y}` : `&first_air_date_year=${q.y}`) : '';
    let list = q.y ? (await tmdb(`/search/${kind}?query=${encodeURIComponent(q.q)}${yp}`))?.results || [] : [];
    list = list.filter(x => x.poster_path);
    m = list.find(exact) || list.find(close) || null;
    if (!m) {
      const all = ((await tmdb(`/search/${kind}?query=${encodeURIComponent(q.q)}`))?.results || []).filter(x => x.poster_path);
      m = all.find(x => exact(x) && yearClose(x)) || all.find(x => close(x) && yearClose(x) && q.y) || (!q.y && all.find(exact)) || null;
    }
  }
  const res = m ? { img: tPoster(kind === 'person' ? m.profile_path : m.poster_path), back: tBack(m.backdrop_path), src: 'tmdb' } : null;
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

/* ---------------- Wikipedia + Wikidata + Commons ---------------- */
const WIKI = 'https://en.wikipedia.org/w/api.php?format=json&formatversion=2';
const PAGE_PROPS = 'prop=pageimages|pageprops&piprop=thumbnail|name&pithumbsize=500&pilicense=any&ppprop=wikibase_item|disambiguation';
const pageCache = new Map();
const pageInfo = (p, frag) => ({
  title: p.title, qid: p.pageprops?.wikibase_item || null, disamb: !!(p.pageprops && 'disambiguation' in p.pageprops),
  frag: frag || null, file: p.pageimage || null, thumb: p.thumbnail?.source || null,
});
async function wikiPages(titles) {
  const need = [...new Set(titles.filter(Boolean))].filter(t => !pageCache.has(t));
  for (let i = 0; i < need.length; i += 50) {
    const chunk = need.slice(i, i + 50);
    const d = await get(`${WIKI}&action=query&redirects=1&${PAGE_PROPS}&pilimit=50&titles=${encodeURIComponent(chunk.join('|'))}`);
    if (!d) continue;
    const q = d.query || {};
    const nm = {}; (q.normalized || []).forEach(n => { nm[n.from] = n.to; });
    const rd = {}; (q.redirects || []).forEach(r => { rd[r.from] = r; });
    const by = {}; (q.pages || []).forEach(p => { by[p.title] = p; });
    for (const t of chunk) {
      let k = nm[t] || t; const r = rd[k]; if (r) k = r.to;
      const p = by[k];
      pageCache.set(t, !p || p.missing || p.invalid ? null : { ...pageInfo(p, r?.tofragment), redirected: !!r });
    }
  }
}
// Search only counts when the article's own title is the name we asked for.
async function wikiSearchStrict(title, name) {
  const key = 'search:' + title;
  if (pageCache.has(key)) return pageCache.get(key);
  const d = await get(`${WIKI}&action=query&generator=search&gsrsearch=${encodeURIComponent(title.replace(/[()]/g, ' '))}&gsrlimit=5&${PAGE_PROPS}`);
  const pages = (d?.query?.pages || []).sort((a, b) => (a.index || 0) - (b.index || 0));
  const want = [norm(stripParen(title)), norm(name)];
  const p = pages.find(p => !(p.pageprops && 'disambiguation' in p.pageprops) && want.includes(norm(stripParen(p.title))));
  const res = p ? pageInfo(p) : null;
  pageCache.set(key, res);
  return res;
}
const wdCache = new Map();
async function wikidataFiles(qids) {
  const need = [...new Set(qids.filter(Boolean))].filter(q => !wdCache.has(q));
  for (let i = 0; i < need.length; i += 100) {
    const chunk = need.slice(i, i + 100);
    const sparql = `SELECT ?item ?img ?logo ?flag WHERE { VALUES ?item { ${chunk.map(q => 'wd:' + q).join(' ')} } OPTIONAL { ?item wdt:P18 ?img } OPTIONAL { ?item wdt:P154 ?logo } OPTIONAL { ?item wdt:P41 ?flag } }`;
    const d = await get(`https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(sparql)}`, { headers: { Accept: 'application/sparql-results+json' } });
    if (!d) {
      // Fallback: the regular API (heavier, but works when the query service is busy).
      for (let j = 0; j < chunk.length; j += 50) {
        const part = chunk.slice(j, j + 50);
        const e = await get(`https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=claims&ids=${part.join('|')}`);
        for (const q of part) {
          const c = e?.entities?.[q]?.claims || {};
          const f = p => c[p]?.[0]?.mainsnak?.datavalue?.value || null;
          wdCache.set(q, { p18: f('P18'), p154: f('P154'), p41: f('P41') });
        }
      }
      continue;
    }
    chunk.forEach(q => wdCache.set(q, {}));
    const file = v => v ? decodeURIComponent(v.value.split('/Special:FilePath/')[1] || '').replace(/_/g, ' ') : null;
    for (const b of d.results?.bindings || []) {
      const o = wdCache.get(b.item.value.split('/').pop()); if (!o) continue;
      if (b.img && !o.p18) o.p18 = file(b.img);
      if (b.logo && !o.p154) o.p154 = file(b.logo);
      if (b.flag && !o.p41) o.p41 = file(b.flag);
    }
  }
}
const fileCache = new Map();
async function commonsThumbs(files) {
  const need = [...new Set(files.filter(Boolean))].filter(f => !fileCache.has(f));
  for (let i = 0; i < need.length; i += 50) {
    const chunk = need.slice(i, i + 50);
    const d = await get(`https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2&prop=imageinfo&iiprop=url|mime&iiurlwidth=500&titles=${encodeURIComponent(chunk.map(f => 'File:' + f).join('|'))}`);
    if (!d) continue;
    const q = d.query || {}; const nm = {}; (q.normalized || []).forEach(n => { nm[n.from] = n.to; });
    const by = {}; (q.pages || []).forEach(p => { by[p.title] = p.imageinfo?.[0]; });
    for (const f of chunk) { const t = 'File:' + f; const ii = by[nm[t] || t]; fileCache.set(f, ii && /^image\//.test(ii.mime || 'image/') ? (ii.thumburl || ii.url) : null); }
  }
}

/** A list of wiki picks -> [{ img, src } | null], picking the right kind of picture. */
async function resolveWikiPicks(parsed, kind) {
  await wikiPages(parsed.map(p => p.title));
  for (const p of parsed) if (!pageCache.get(p.title)) await wikiSearchStrict(p.title, p.name);
  const info = p => pageCache.get(p.title) || pageCache.get('search:' + p.title) || null;
  const usable = i => {
    if (!i || i.disamb) return false;
    if ((kind === 'person' || kind === 'artist') && i.frag) return false;            // "Name" -> "Other page#Section"
    if ((kind === 'person' || kind === 'artist') && / vs\.? | v\. /i.test(i.title)) return false; // redirected to a fight/event page
    return true;
  };
  const wantWd = parsed.map(info).filter(usable).filter(i => kind === 'logo' || kind === 'flag' || !i.thumb || !fileOk(i.file, kind)).map(i => i.qid);
  await wikidataFiles(wantWd);
  const files = [];
  for (const q of wantWd) { const w = wdCache.get(q) || {}; files.push(w.p18, w.p154, w.p41); }
  await commonsThumbs(files.filter(f => f && fileOk(f, kind)));
  return parsed.map(p => {
    const i = info(p);
    if (!usable(i)) return null;
    const w = (i.qid && wdCache.get(i.qid)) || {};
    const fromFile = f => f && fileOk(f, kind) && fileCache.get(f) ? { img: wImg(fileCache.get(f)), src: 'wikidata' } : null;
    const page = i.thumb && fileOk(i.file, kind) ? { img: wImg(i.thumb), src: 'wikipedia' } : null;
    if (kind === 'logo') return fromFile(w.p154) || page || fromFile(w.p18);
    if (kind === 'flag') return page || fromFile(w.p41) || fromFile(w.p18);
    return page || fromFile(w.p18);
  });
}

/* ---------------- creators: YouTube + Twitch avatars ---------------- */
const avatarCache = new Map();
async function youtubeAvatar(handle, wants, trusted = false) {
  const key = 'yt:' + handle.toLowerCase();
  if (!avatarCache.has(key)) {
    avatarCache.set(key, (async () => {
      const page = await get(`https://www.youtube.com/${handle.startsWith('@') ? handle : '@' + handle}`, {
        json: false, ua: BROWSER_UA, headers: { 'Accept-Language': 'en-US,en;q=0.9', Cookie: 'CONSENT=YES+cb.20240101-00-p0.en+FX+000; SOCS=CAI' },
      });
      if (!page) return null;
      const meta = p => html((page.match(new RegExp(`<meta property="og:${p}" content="([^"]+)"`)) || [])[1]);
      const img = meta('image'), title = meta('title');
      if (!img || !/yt3\.(googleusercontent|ggpht)\.com/.test(img)) return null;
      return { img: img.replace(/=s\d+-/, '=s800-'), title };
    })());
  }
  const r = await avatarCache.get(key);
  if (!r) return null;
  if (!trusted && !sameName(r.title, wants)) { avatarFlags.push(`YouTube ${handle} is "${r.title}", expected ${wants[0]}`); return null; }
  return { img: r.img, src: 'youtube' };
}
async function twitchAvatar(login, wants) {
  const key = 'tw:' + login.toLowerCase();
  if (!avatarCache.has(key)) {
    avatarCache.set(key, (async () => {
      const t = await get(`https://decapi.me/twitch/avatar/${encodeURIComponent(login)}`, { json: false });
      if (t && /^https:\/\/static-cdn\.jtvnw\.net\//.test(t.trim())) return { img: t.trim(), title: login };
      const page = await get(`https://www.twitch.tv/${encodeURIComponent(login)}`, { json: false, ua: BROWSER_UA });
      const img = page && html((page.match(/<meta property="og:image" content="([^"]+)"/) || [])[1]);
      return img && /jtv_user_pictures/.test(img) ? { img, title: login } : null;
    })());
  }
  const r = await avatarCache.get(key);
  return r ? { img: r.img, src: 'twitch' } : null;
}
const avatarFlags = [];

/* ---------------- music: Deezer artists ---------------- */
const deezerCache = new Map();
async function deezerArtist(name) {
  const N = norm(name);
  if (deezerCache.has(N)) return deezerCache.get(N);
  const r = await get(`https://api.deezer.com/search/artist?q=${encodeURIComponent(name)}&limit=15`);
  const m = (r?.data || [])
    .filter(a => norm(a.name) === N && a.picture_xl && !/\/artist\/\//.test(a.picture_xl) && (a.nb_fan || 0) >= 20000)
    .sort((a, b) => (b.nb_fan || 0) - (a.nb_fan || 0))[0];
  const res = m ? { img: m.picture_xl, src: 'deezer' } : null;
  deezerCache.set(N, res);
  return res;
}

/* ---------------- sport: ESPN headshots + logos ---------------- */
const ESPN = { nfl: 'football/nfl', nba: 'basketball/nba', mlb: 'baseball/mlb', nhl: 'hockey/nhl', wnba: 'basketball/wnba', mls: 'soccer/usa.1', epl: 'soccer/eng.1' };
const espnCache = {};
function espnLeague(lg) {
  if (!ESPN[lg]) return Promise.resolve(null);
  return espnCache[lg] ||= (async () => {
    const path = ESPN[lg];
    const d = await get(`https://site.api.espn.com/apis/site/v2/sports/${path}/teams?limit=100`);
    const teams = (d?.sports?.[0]?.leagues?.[0]?.teams || []).map(t => t.team).filter(Boolean);
    const players = new Map(); const clash = new Set();
    if (!lg.startsWith('epl') && lg !== 'mls') {
      await mapLimit(teams, 4, async t => {
        const r = await get(`https://site.api.espn.com/apis/site/v2/sports/${path}/teams/${t.id}/roster`);
        const list = (r?.athletes || []).flatMap(a => a.items ? a.items : [a]);
        for (const a of list) {
          const k = norm(a.fullName || a.displayName); const h = a.headshot?.href;
          if (!k || !h) continue;
          if (players.has(k) && players.get(k) !== h) clash.add(k); else players.set(k, h);
        }
      });
    }
    for (const k of clash) players.delete(k); // two players share the name — don't guess
    const logos = teams.map(t => [t.displayName, (t.logos || []).find(l => !/dark/.test((l.rel || []).join(' ')))?.href || t.logos?.[0]?.href]).filter(x => x[1]);
    return { logos, players };
  })();
}

/* ---------------- albums / heroes ---------------- */
async function deezerAlbum(album, artist) {
  const r = await get(`https://api.deezer.com/search/album?q=${encodeURIComponent(`artist:"${artist}" album:"${album}"`)}&limit=10`);
  let list = r?.data || [];
  if (!list.length) list = (await get(`https://api.deezer.com/search/album?q=${encodeURIComponent(artist + ' ' + album)}&limit=15`))?.data || [];
  const A = norm(album), R = norm(artist).slice(0, 5);
  const m = list.find(x => norm(x.title) === A && norm(x.artist?.name).includes(R)) || list.find(x => norm(x.title).startsWith(A) && norm(x.artist?.name).includes(R)) || list.find(x => norm(x.title).includes(A) && norm(x.artist?.name).includes(R));
  return m?.cover_xl || null;
}
async function albumArt(album, artist) { return (await deezerAlbum(album, artist)) || (await itunesAlbum(album, artist)); }
async function itunesAlbum(album, artist) {
  const A = norm(album), R = norm(artist);
  const pick = list => list.find(x => norm(x.collectionName) === A && norm(x.artistName).includes(R.slice(0, 5)))
    || list.find(x => norm(x.collectionName).startsWith(A) && norm(x.artistName).includes(R.slice(0, 5)))
    || list.find(x => norm(x.collectionName).includes(A) && norm(x.artistName).includes(R.slice(0, 5)));
  let r = await get(`https://itunes.apple.com/search?term=${encodeURIComponent(artist + ' ' + album)}&entity=album&limit=15&country=GB`);
  let m = pick(r?.results || []);
  if (!m) { r = await get(`https://itunes.apple.com/search?term=${encodeURIComponent(artist + ' ' + album)}&entity=album&limit=15&country=US`); m = pick(r?.results || []); }
  return m?.artworkUrl100 ? m.artworkUrl100.replace('100x100bb', '600x600bb') : null;
}
let heroData = null;
async function heroImage(name) {
  if (!heroData) heroData = (await get('https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json')) || [];
  const m = heroData.find(h => norm(h.name) === norm(name) && /Marvel|DC/.test(h.biography?.publisher || ''));
  if (m?.images?.lg) return m.images.lg;
  const [r] = await resolveWikiPicks([{ title: `${name} (character)`, name }], 'any');
  return r?.img || null;
}

/* ---------------- curated leaf -> pool ---------------- */
// Wiki-style item: 'Wikipedia Title|Display name|@youtube,tw:twitch'
const parseWiki = s => {
  const [title, display, src] = s.split('|');
  const name = display || stripParen(title);
  return { title: title || name, name, src: (src || '').split(',').map(x => x.trim()).filter(Boolean) };
};

async function resolveCurated(it) {
  const kind = it.img || 'any';
  if (it.type === 'wiki') {
    const parsed = it.items.map(parseWiki);
    const out = new Array(parsed.length).fill(null);
    // 1) creators: their own channel picture
    await mapLimit(parsed, 3, async (p, i) => {
      for (const s of p.src) {
        const wants = [p.name, p.title];
        const trusted = s.endsWith('!'); const h = trusted ? s.slice(0, -1) : s;
        const r = h.startsWith('tw:') ? await twitchAvatar(h.slice(3), wants) : h.startsWith('@') ? await youtubeAvatar(h, wants, trusted) : null;
        if (r) { out[i] = r; return; }
      }
    });
    // 2) athletes in US leagues: ESPN headshots
    if (it.league) {
      const lg = await espnLeague(it.league);
      parsed.forEach((p, i) => { if (!out[i] && lg?.players.get(norm(p.name))) out[i] = { img: lg.players.get(norm(p.name)), src: 'espn' }; });
    }
    // 3) musicians: Deezer artist photos
    if (kind === 'artist') await mapLimit(parsed, 3, async (p, i) => { if (!out[i]) out[i] = await deezerArtist(p.name); });
    // 4) everything else: Wikipedia / Wikidata, strictly
    const rest = parsed.map((p, i) => [p, i]).filter(([, i]) => !out[i]);
    const wk = await resolveWikiPicks(rest.map(([p]) => p), kind);
    rest.forEach(([, i], k) => { out[i] = wk[k]; });
    const pool = [], missing = [], srcs = {};
    parsed.forEach((p, i) => { if (out[i]?.img) { pool.push([p.name, out[i].img]); srcs[p.name] = out[i].src; } else missing.push(p.title); });
    return { pool, missing, srcs };
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
    const res = await mapLimit(it.items, 2, s => { const [a, b] = s.split('|'); return albumArt(a, b); });
    const pool = [], missing = [];
    it.items.forEach((s, i) => { const [a] = s.split('|'); res[i] ? pool.push([a, res[i]]) : missing.push(s); });
    return { pool, missing };
  }
  if (it.type === 'heroes') {
    const res = await mapLimit(it.items, 4, heroImage);
    const pool = [], missing = [];
    it.items.forEach((n, i) => res[i] ? pool.push([n, wImg(res[i])]) : missing.push(n));
    return { pool, missing };
  }
  return { pool: [], missing: ['unknown type'] };
}

/* ---------------- fresh, generated categories ---------------- */
const fresh = (id, name, icon, fn, kind, extra = {}) => ({ id, name, icon, fn, kind, ...extra });
const GB = 'watch_region=GB', US = 'watch_region=US';
const PROVIDERS = [['Netflix', 8, 'N'], ['Prime Video', 9, '📦'], ['Disney+', 337, '🏰'], ['Apple TV+', 350, '🍎'], ['BBC iPlayer', 38, '📻']];
const US_PROVIDERS = [['Hulu', 15, '🟩'], ['HBO Max', 1899, '🟦'], ['Peacock', 386, '🦚']];

function generators() {
  const movieNow = [
    fresh('fm_trend', 'Trending This Week', '🔥', () => tmdbList('/trending/movie/week', 3)),
    fresh('fm_cinema', 'In Cinemas Now', '🎟️', () => tmdbList('/movie/now_playing?region=GB', 3), null, { region: 'uk' }),
    fresh('fm_theaters', 'In US Theaters Now', '🍿', () => tmdbList('/movie/now_playing?region=US', 3), null, { region: 'us' }),
    fresh('fm_y0', `Best of ${Y}`, '🆕', () => tmdbList(`/discover/movie?primary_release_year=${Y}&sort_by=vote_count.desc&vote_count.gte=150`, 3)),
    fresh('fm_y1', `Best of ${Y - 1}`, '📅', () => tmdbList(`/discover/movie?primary_release_year=${Y - 1}&sort_by=vote_count.desc&vote_count.gte=300`, 3)),
    fresh('fm_y2', `Best of ${Y - 2}`, '📅', () => tmdbList(`/discover/movie?primary_release_year=${Y - 2}&sort_by=vote_count.desc&vote_count.gte=500`, 3)),
    fresh('fm_box', 'Biggest Box Office Hits', '💰', () => tmdbList('/discover/movie?sort_by=revenue.desc', 3)),
    ...PROVIDERS.slice(0, 4).map(([n, id, ic]) => fresh(`fm_p${id}`, `Films on ${n}`, ic, () => tmdbList(`/discover/movie?${GB}&with_watch_providers=${id}&sort_by=popularity.desc&vote_count.gte=200`, 3))),
    ...US_PROVIDERS.map(([n, id, ic]) => fresh(`fm_us${id}`, `Films on ${n}`, ic, () => tmdbList(`/discover/movie?${US}&with_watch_providers=${id}&sort_by=popularity.desc&vote_count.gte=200`, 3), null, { region: 'us' })),
  ];
  const tvNow = [
    fresh('ft_trend', 'Trending TV This Week', '🔥', () => tmdbList('/trending/tv/week', 3)),
    fresh('ft_y0', `Best TV of ${Y}`, '🆕', () => tmdbList(`/discover/tv?first_air_date_year=${Y}&sort_by=vote_count.desc&vote_count.gte=40&without_genres=10767,10763`, 3)),
    fresh('ft_y1', `Best TV of ${Y - 1}`, '📅', () => tmdbList(`/discover/tv?first_air_date_year=${Y - 1}&sort_by=vote_count.desc&vote_count.gte=80&without_genres=10767,10763`, 3)),
    ...PROVIDERS.map(([n, id, ic]) => fresh(`ft_p${id}`, `Shows on ${n}`, ic, () => tmdbList(`/discover/tv?${GB}&with_watch_providers=${id}&sort_by=popularity.desc&vote_count.gte=50&without_genres=10767,10763`, 3), null, id === 38 ? { region: 'uk' } : {})),
    ...US_PROVIDERS.map(([n, id, ic]) => fresh(`ft_us${id}`, `Shows on ${n}`, ic, () => tmdbList(`/discover/tv?${US}&with_watch_providers=${id}&sort_by=popularity.desc&vote_count.gte=50&without_genres=10767,10763`, 3), null, { region: 'us' })),
  ];
  // AniList GraphQL (free, no key) — primary anime source.
  const anilist = async (query, variables, map) => {
    for (let a = 0; a < 4; a++) {
      try {
        const r = await fetch('https://graphql.anilist.co', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': UA }, body: JSON.stringify({ query, variables }) });
        if (r.status === 429) { await sleep(3000 * (a + 1)); continue; }
        const d = await r.json();
        const list = d?.data?.Page?.media || d?.data?.Page?.characters || [];
        const seen = new Set(); const pool = [];
        for (const x of list) { const [n, img] = map(x); if (n && img && !seen.has(n)) { seen.add(n); pool.push([n, img]); } }
        await sleep(800);
        return { pool };
      } catch (e) { await sleep(2000); }
    }
    return { pool: [] };
  };
  const MEDIA = `query($sort:[MediaSort],$season:MediaSeason,$year:Int,$format:MediaFormat,$type:MediaType){ Page(perPage:50){ media(sort:$sort,season:$season,seasonYear:$year,format:$format,type:$type,isAdult:false){ title{ english romaji } coverImage{ extraLarge } } } }`;
  const CHARS = `query{ Page(perPage:50){ characters(sort:FAVOURITES_DESC){ name{ full } image{ large } } } }`;
  const mt = x => [x.title?.english || x.title?.romaji, x.coverImage?.extraLarge];
  const m = NOW.getMonth();
  const season = m < 3 ? 'WINTER' : m < 6 ? 'SPRING' : m < 9 ? 'SUMMER' : 'FALL';
  const anime = [
    fresh('fa_season', 'This Season’s Anime', '🌸', () => anilist(MEDIA, { sort: ['POPULARITY_DESC'], season, year: Y, type: 'ANIME' }, mt)),
    fresh('fa_trend', 'Trending Anime', '🔥', () => anilist(MEDIA, { sort: ['TRENDING_DESC'], type: 'ANIME' }, mt)),
    fresh('fa_top', 'Highest Rated Anime', '⭐', () => anilist(MEDIA, { sort: ['SCORE_DESC'], format: 'TV', type: 'ANIME' }, mt)),
    fresh('fa_pop', 'Most Popular Anime Ever', '👑', () => anilist(MEDIA, { sort: ['POPULARITY_DESC'], type: 'ANIME' }, mt)),
    fresh('fa_movies', 'Top Anime Movies', '🎞️', () => anilist(MEDIA, { sort: ['SCORE_DESC'], format: 'MOVIE', type: 'ANIME' }, mt)),
    fresh('fa_chars', 'Most Loved Anime Characters', '💖', () => anilist(CHARS, {}, x => [x.name?.full, x.image?.large])),
    fresh('fa_manga', 'Most Popular Manga', '📖', () => anilist(MEDIA, { sort: ['POPULARITY_DESC'], format: 'MANGA', type: 'MANGA' }, mt)),
  ];
  const deezer = async (path, map) => { const r = await get(`https://api.deezer.com${path}`); const seen = new Set(); const pool = []; for (const x of r?.data || []) { const [n, img] = map(x); if (n && img && !seen.has(n)) { seen.add(n); pool.push([n, img]); } } return { pool }; };
  // Apple Music / Podcasts / App Store charts (free RSS, no key)
  const apple = async (path, map) => {
    const d = await get(`https://rss.applemarketingtools.com/api/v2/${path}`);
    const seen = new Set(); const pool = [];
    for (const x of d?.feed?.results || []) { const [n, img] = map(x); if (n && img && !seen.has(n)) { seen.add(n); pool.push([n, img.replace(/\/\d+x\d+bb\./, '/600x600bb.')]); } }
    return { pool };
  };
  const song = x => [`${x.name} – ${x.artistName}`, x.artworkUrl100];
  const music = [
    fresh('fmu_uk', 'UK Top Songs Right Now', '🇬🇧', () => deezer('/playlist/1111142221/tracks?limit=60', t => [`${t.title_short || t.title} – ${t.artist?.name}`, t.album?.cover_xl]), null, { region: 'uk' }),
    fresh('fmu_us', 'US Top Songs Right Now', '🇺🇸', () => apple('us/music/most-played/50/songs.json', song), null, { region: 'us' }),
    fresh('fmu_usalb', 'US Top Albums Right Now', '💿', () => apple('us/music/most-played/50/albums.json', song), null, { region: 'us' }),
    fresh('fmu_global', 'Global Top Songs', '🌍', () => deezer('/chart/0/tracks?limit=60', t => [`${t.title_short || t.title} – ${t.artist?.name}`, t.album?.cover_xl])),
    fresh('fmu_artists', 'Biggest Artists Right Now', '🎤', () => deezer('/chart/0/artists?limit=60', a => [a.name, a.picture_xl])),
    fresh('fmu_albums', 'Top Albums Right Now', '💿', () => deezer('/chart/0/albums?limit=60', a => [`${a.title} – ${a.artist?.name}`, a.cover_xl])),
  ];
  const charts = [
    fresh('fx_pod_us', 'Top Podcasts in the US', '🎙️', () => apple('us/podcasts/top/50/podcasts.json', x => [x.name, x.artworkUrl100]), null, { region: 'us' }),
    fresh('fx_pod_uk', 'Top Podcasts in the UK', '🎙️', () => apple('gb/podcasts/top/50/podcasts.json', x => [x.name, x.artworkUrl100]), null, { region: 'uk' }),
    fresh('fx_apps_us', 'Top Free iPhone Apps (US)', '📱', () => apple('us/apps/top-free/50/apps.json', x => [x.name, x.artworkUrl100]), null, { region: 'us' }),
    fresh('fx_apps_uk', 'Top Free iPhone Apps (UK)', '📱', () => apple('gb/apps/top-free/50/apps.json', x => [x.name, x.artworkUrl100]), null, { region: 'uk' }),
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
      const parsed = drivers.map(x => ({ title: decodeURIComponent((x.url || '').split('/wiki/')[1] || `${x.givenName} ${x.familyName}`).replace(/_/g, ' '), name: `${x.givenName} ${x.familyName}` }));
      const imgs = await resolveWikiPicks(parsed, 'person');
      return { pool: parsed.map((p, i) => [p.name, imgs[i]?.img]).filter(p => p[1]) };
    }),
  ];
  // ESPN team logos — always the current, official crest.
  const teams = (lg) => async () => ({ pool: (await espnLeague(lg))?.logos || [] });
  const usTeams = [
    fresh('fs_nflteams', 'NFL Teams', '🏈', teams('nfl'), null, { region: 'us', fit: 'contain', replaces: 'a_nfl_teams' }),
    fresh('fs_nbateams', 'NBA Teams', '🏀', teams('nba'), null, { region: 'us', fit: 'contain', replaces: 'b_teams' }),
    fresh('fs_mlbteams', 'MLB Teams', '⚾', teams('mlb'), null, { region: 'us', fit: 'contain', replaces: 'a_mlb_teams' }),
    fresh('fs_nhlteams', 'NHL Teams', '🏒', teams('nhl'), null, { region: 'us', fit: 'contain', replaces: 'a_nhl_teams' }),
    fresh('fs_mlsteams', 'MLS Teams', '⚽', teams('mls'), null, { region: 'us', fit: 'contain' }),
  ];
  return { movieNow, tvNow, anime, music, charts, games, poke, people, franchiseChars, tvChars, f1, usTeams };
}

/* ---------------- build ---------------- */
const report = [];
function finishLeaf(base, res, extra = {}) {
  const seen = new Map(); const dups = [];
  const pool = [];
  for (const p of res.pool || []) {
    if (!p[0] || !p[1]) continue;
    const k = imgKey(p[1]);
    if (seen.has(k)) { dups.push(`${p[0]} (same picture as ${seen.get(k)})`); continue; }
    seen.set(k, p[0]); pool.push(p);
  }
  const missing = [...(res.missing || []), ...dups];
  const srcCount = {}; Object.values(res.srcs || {}).forEach(s => { srcCount[s] = (srcCount[s] || 0) + 1; });
  report.push({ id: base.id, name: base.name, found: pool.length, missing, dups, srcs: srcCount, picks: res.srcs || null, ok: pool.length >= 10 });
  if (pool.length < 10) return null;
  const leaf = { type: 'pool', id: base.id, name: base.name, icon: base.icon, kind: extra.kind || base.kind || base.type, pool: pool.slice(0, 120) };
  if (res.thumb) leaf.thumb = res.thumb;
  if (base.themeOverride) leaf.themeOverride = base.themeOverride;
  if (base.region) leaf.region = base.region;
  if (base.fit || base.img === 'logo' || base.img === 'flag') leaf.fit = base.fit || 'contain';
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
    let res;
    try { res = await resolveCurated(it); } catch (e) { res = { pool: [], missing: [String(e)] }; }
    menu[mid][i] = finishLeaf(it, res);
    if (++done % 25 === 0) console.log(`curated ${done}/${curated.length}  (${Math.round((Date.now() - t0) / 1000)}s)`);
  });
  for (const k of Object.keys(menu)) menu[k] = menu[k].filter(Boolean);

  // generated
  const g = generators();
  const runAll = async (list, extra) => (await mapLimit(list, 2, async f => { let res = { pool: [] }; try { res = await f.fn(); } catch (e) { res = { pool: [], missing: [String(e)] }; } const leaf = finishLeaf(f, res, { fresh: true, kind: f.kind || 'fresh', ...extra }); if (leaf && f.replaces) leaf.replaces = f.replaces; return leaf; })).filter(Boolean);
  const [mNow, tNow, an, mu, ch, ga, po, pe, fc, tc, f1, ut] = await Promise.all([g.movieNow, g.tvNow, g.anime, g.music, g.charts, g.games, g.poke, g.people, g.franchiseChars, g.tvChars, g.f1, g.usTeams].map(l => runAll(l)));
  const nav = (id, name, icon, desc) => ({ type: 'nav', id, name, icon, desc });
  if (mNow.length) { menu.m_now = mNow; menu.movies.unshift(nav('m_now', 'NEW & TRENDING', '🆕', `TRENDING, IN CINEMAS, BEST OF ${Y}`)); }
  if (tNow.length) { menu.tv_now = tNow; menu.tv.unshift(nav('tv_now', 'NEW & TRENDING', '🆕', 'NETFLIX, HULU, MAX, IPLAYER')); }
  if (an.length) menu.anime.unshift(...an);
  if (mu.length) { menu.mu_charts = mu; menu.music.unshift(nav('mu_charts', 'LIVE CHARTS', '📈', 'UK & US TOP SONGS, BIGGEST ARTISTS')); }
  if (ch.length) { menu.cr_charts = ch; menu.creators.push(nav('cr_charts', 'PODCASTS & APPS', '🎙️', 'TOP PODCASTS & APPS RIGHT NOW')); }
  if (ga.length) menu.games.push(...ga);
  if (po.length) { menu.vg_poke = po; menu.games.push(nav('vg_poke', 'POKÉMON BY GEN', '🔴', 'EVERY GENERATION, I – IX')); }
  if (pe.length) menu.actors.unshift(...pe);
  if (fc.length) (menu.m_chars ||= []).push(...fc);
  if (tc.length) (menu.tv_chars ||= []).push(...tc);
  if (f1.length) (menu.sp_global ||= []).unshift(...f1);
  // ESPN team logos replace the hand-made team lists (same place in the menu), or join US sports.
  for (const leaf of ut) {
    const target = leaf.replaces; delete leaf.replaces;
    let placed = false;
    if (target) for (const k of Object.keys(menu)) {
      const idx = menu[k].findIndex(x => x.id === target);
      if (idx >= 0) { menu[k][idx] = { ...leaf, id: target }; placed = true; break; }
    }
    if (!placed) (menu.sp_amer ||= []).push(leaf);
  }
  // remove empty navs
  const emptyNav = id => !(menu[id] && menu[id].length);
  for (const k of Object.keys(menu)) menu[k] = menu[k].filter(x => x.type !== 'nav' || !emptyNav(x.id));

  const out = { version: CATALOG_VERSION, generatedAt: NOW.toISOString(), menu };
  fs.writeFileSync(OUT, JSON.stringify(out));
  const bad = report.filter(r => !r.ok);
  const totalPicks = report.reduce((n, r) => n + r.found, 0);
  const srcTotals = {}; report.forEach(r => Object.entries(r.srcs).forEach(([k, v]) => { srcTotals[k] = (srcTotals[k] || 0) + v; }));
  const md = [`# Blind Rank catalog — ${NOW.toISOString()}`, '',
    `${report.length - bad.length} categories built · ${bad.length} dropped (<10 verified pictures) · ${totalPicks} picks · ${Math.round((Date.now() - t0) / 1000)}s`, '',
    `Curated picture sources: ${Object.entries(srcTotals).map(([k, v]) => `${k} ${v}`).join(' · ')}`, '',
    ...(avatarFlags.length ? ['## Channel name mismatches (not used)', ...avatarFlags.map(f => `- ${f}`), ''] : []),
    '## Categories',
    ...report.map(r => `- ${r.ok ? '✅' : '❌'} ${r.name} — ${r.found}${r.missing.length ? ` · no picture: ${r.missing.slice(0, 15).join(', ')}` : ''}`)].join('\n');
  fs.writeFileSync('catalog-report.md', md);
  fs.writeFileSync('catalog-report.json', JSON.stringify(report, null, 1));
  console.log(`catalog: ${report.length - bad.length} categories, ${bad.length} dropped, ${totalPicks} picks, ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB`);
  console.log(`sources: ${JSON.stringify(srcTotals)}`);
}

export { resolveCurated, finishLeaf, report, imgKey };
if (!process.env.CATALOG_NO_RUN) main();
