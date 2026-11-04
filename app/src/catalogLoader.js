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
const MIN_VERSION = 4;
const fresh = c => !!(c && c.menu && (c.version || 0) >= MIN_VERSION);
const time = c => (fresh(c) && c.generatedAt ? Date.parse(c.generatedAt) : 0);

export async function initCatalog() {
  let bundled = await fetchJSON('catalog.json', 4000);
  let cached = null;
  try { cached = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
  const best = time(cached) > time(bundled) ? ['downloaded', cached] : fresh(bundled) ? ['bundled', bundled] : null;
  if (best) applyCatalog(best[1], best[0]);
  // Background refresh for next launch.
  setTimeout(async () => {
    for (const url of REMOTES) {
      const remote = await fetchJSON(url, 15000);
      if (fresh(remote) && time(remote) > Math.max(time(bundled), time(cached))) {
        try { localStorage.setItem(KEY, JSON.stringify(remote)); } catch (e) {}
        break;
      }
      if (fresh(remote)) break;
    }
  }, 2500);
}
