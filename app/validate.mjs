// Checks every challenge against the live TMDB + Wikipedia APIs.
// Writes validation-report.json and validation-report.md. Run in CI: node validate.mjs
import fs from 'fs';

// Wikimedia requires an identifying User-Agent for automated clients, and rate-limits bursts.
const realFetch = globalThis.fetch;
let lastWiki = 0;
globalThis.fetch = async (url, opts = {}) => {
  const isWiki = String(url).includes('wikipedia.org');
  if (isWiki) { const wait = Math.max(0, lastWiki + 120 - Date.now()); lastWiki = Date.now() + wait; if (wait) await new Promise(r => setTimeout(r, wait)); }
  const headers = { ...(opts.headers || {}), 'User-Agent': 'BlindRankValidator/1.0 (https://github.com/ab19902020/Blind-rankings-)' };
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await realFetch(url, { ...opts, headers });
    if (res.status !== 429 && res.status < 500) return res;
    await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
  }
  return realFetch(url, { ...opts, headers });
};
import { MENU_DATA } from './src/data.js';
import { wikiResolve, tmdbImage, liveResults, parseWikiItem } from './src/resolve.js';

const leaves = [];
const walk = (id, path) => { for (const it of MENU_DATA[id] || []) { if (it.type === 'nav') walk(it.id, [...path, it.name]); else leaves.push({ it, path }); } };
for (const d of MENU_DATA.domain) walk(d.id, [d.name]);

async function check({ it, path }) {
  const r = { id: it.id, name: it.name, path: path.join(' / '), type: it.type, pool: 0, found: 0, missing: [] };
  try {
    if (it.type === 'wiki') {
      const parsed = it.items.map(parseWikiItem); r.pool = parsed.length;
      const imgs = await wikiResolve(parsed.map(p => p.title));
      for (const p of parsed) imgs[p.title] ? r.found++ : r.missing.push(p.title);
    } else if (it.type === 'custom') {
      r.pool = it.queries.length;
      for (let i = 0; i < it.queries.length; i += 6) {
        const wave = it.queries.slice(i, i + 6);
        const urls = await Promise.all(wave.map(q => tmdbImage(q)));
        wave.forEach((q, k) => urls[k] ? r.found++ : r.missing.push(`${q.q}${q.y ? ' (' + q.y + ')' : ''}`));
      }
    } else {
      const res = await liveResults(it); r.pool = res.length; r.found = res.length;
    }
  } catch (e) { r.error = String(e); }
  r.ok = r.found >= 10;
  return r;
}

const out = [];
for (let i = 0; i < leaves.length; i += 2) {
  out.push(...await Promise.all(leaves.slice(i, i + 2).map(check)));
  process.stdout.write(`${out.length}/${leaves.length}\r`);
}
fs.writeFileSync('validation-report.json', JSON.stringify(out, null, 1));
const bad = out.filter(r => !r.ok);
const md = [`# Category validation`, ``, `${out.length} challenges · ${bad.length} below 10`, ``,
  ...out.map(r => `- ${r.ok ? '✅' : '❌'} **${r.path} › ${r.name}** — ${r.found}/${r.pool}${r.missing.length ? ` · missing: ${r.missing.join(', ')}` : ''}${r.error ? ' · ' + r.error : ''}`)].join('\n');
fs.writeFileSync('validation-report.md', md);
console.log(`\n${out.length} challenges, ${bad.length} failing`);
