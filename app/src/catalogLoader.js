import { catalogueCompatible } from './rules.js';
// Loads the pre-built catalog: bundled copy (instant, offline) or a newer one
// fetched from the CDN on a previous launch. A fresh copy is fetched in the
// background each launch and used next time.
import { applyCatalog } from './catalog.js';

const KEY = 'blindrank.catalog';
const REMOTES = [
  'https://cdn.jsdelivr.net/gh/ab19902020/Blind-rankings-@catalog/catalog.json',
  'https://raw.githubusercontent.com/ab19902020/Blind-rankings-/catalog/catalog.json',
];

async function fetchJSON(url, ms) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), ms);
  try { const r = await fetch(url, { signal: ctl.signal, cache: 'no-cache' }); return r.ok ? await r.json() : null; }
  catch (e) { return null; } finally { clearTimeout(t); }
}
// Catalogs older than v4 were built before the strict picture checks — never use them.
const fresh = catalogueCompatible;
const time = c => (fresh(c) && c.generatedAt ? Date.parse(c.generatedAt) : 0);

// The catalog is a few MB — too big for localStorage, so keep it in the Cache API.
async function readCached() {
  try {
    if (window.caches) { const r = await (await caches.open('blindrank')).match('/catalog-v5.json'); if (r) return await r.json(); }
  } catch (e) {}
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
}
async function writeCached(cat) {
  try {
    if (window.caches) { await (await caches.open('blindrank')).put('/catalog-v5.json', new Response(JSON.stringify(cat), { headers: { 'Content-Type': 'application/json' } })); try { localStorage.removeItem(KEY); } catch (e) {} return; }
  } catch (e) {}
  try { localStorage.setItem(KEY, JSON.stringify(cat)); } catch (e) {}
}

export async function initCatalog() {
  let bundled = await fetchJSON('catalog.json', 4000);
  let cached = await readCached();
  const best = time(cached) > time(bundled) ? ['downloaded', cached] : fresh(bundled) ? ['bundled', bundled] : null;
  if (best) applyCatalog(best[1], best[0]);
  // Background refresh for next launch.
  setTimeout(async () => {
    for (const url of REMOTES) {
      const remote = await fetchJSON(url, 15000);
      if (fresh(remote) && time(remote) > Math.max(time(bundled), time(cached))) {
        await writeCached(remote);
        break;
      }
      if (fresh(remote)) break;
    }
  }, 2500);
}
