// Quick check of Wikidata grow queries: status, time, result count, first names.
process.env.CATALOG_NO_RUN = '1';
const { sparqlFor } = await import('./build-catalog.mjs');
const { qidsLog } = {};
const { GROW } = await import('./src/data-more.js');
const UA = 'BlindRankCatalog/2.0 (https://github.com/ab19902020/Blind-rankings-; catalog bot)';
const ids = (process.argv[2] || 'g_darts,fc_utd,a_men,mu_rap,vg_best,n_dogs,cr_uk,hg_pres').split(',');
async function run(label, q, method) {
  const t = Date.now();
  try {
    const r = method === 'POST'
      ? await fetch('https://query.wikidata.org/sparql', { method: 'POST', headers: { 'User-Agent': UA, Accept: 'application/sparql-results+json', 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'query=' + encodeURIComponent(q), signal: AbortSignal.timeout(80000) })
      : await fetch(`https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(q)}`, { headers: { 'User-Agent': UA, Accept: 'application/sparql-results+json' }, signal: AbortSignal.timeout(80000) });
    const txt = await r.text();
    let n = '?', names = '';
    try { const d = JSON.parse(txt); const b = d.results.bindings; n = b.length; names = [...new Set(b.map(x => x.label?.value || x.title?.value))].slice(0, 8).join(', '); } catch (e) { names = txt.slice(0, 300).replace(/\s+/g, ' '); }
    console.log(`${label} ${method} → ${r.status} in ${((Date.now() - t) / 1000).toFixed(1)}s · ${n} rows · ${names}`);
  } catch (e) { console.log(`${label} ${method} → ERROR ${e.name} after ${((Date.now() - t) / 1000).toFixed(1)}s`); }
}
await run('trivial', 'SELECT ?x WHERE { wd:Q42 wdt:P31 ?x }', 'GET');
for (const id of ids) { const g = Array.isArray(GROW[id]) ? GROW[id][0] : GROW[id]; const q = await sparqlFor(g, 170); if (id === ids[0]) console.log(q); await run(id, q, process.argv[3] || 'GET'); }
