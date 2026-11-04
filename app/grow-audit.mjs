// Lists, for every category that tops up from Wikidata, what gets added and what the
// relevance check throws out. No pictures are fetched, so this runs in a few minutes.
process.env.CATALOG_NO_RUN = '1';
const { growWikidata, relevant, audit } = await import('./build-catalog.mjs');
const { MENU_DATA } = await import('./src/data.js');
const only = (process.argv[2] || '').split(',').filter(Boolean);
const leaves = [];
for (const list of Object.values(MENU_DATA)) for (const it of list) if (it.grow && it.type !== 'nav') leaves.push(it);
const arr = x => (Array.isArray(x) ? x : [x]);
let i = 0;
await Promise.all(Array.from({ length: 3 }, async () => {
  while (i < leaves.length) {
    const it = leaves[i++];
    if (only.length && !only.includes(it.id)) continue;
    for (const g of arr(it.grow)) {
      if (g.tmdb || g.person || g.popularActors || g.deezerGenre != null) continue;
      for (const o of await growWikidata(g, 170)) relevant(it.id, g, o);
    }
  }
}));
for (const it of leaves) {
  const a = audit[it.id]; if (!a) continue;
  console.log(`\n## ${it.id} — ${it.name} · kept ${a.kept.length} · dropped ${a.dropped.length}`);
  console.log('KEEP: ' + a.kept.slice(0, 110).map(x => x.split(' — ')[0]).join(' | '));
  console.log('DROP: ' + a.dropped.slice(0, 25).join(' | '));
}
