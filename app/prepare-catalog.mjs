// Always ship a complete editorial catalogue. A generated seed contributes images;
// category definitions and eligibility come from the source in this exact build.
import fs from 'node:fs';
import { MENU_DATA } from './src/data.js';
import { CATALOG_VERSION, CONTENT_REVISION, catalogueCompatible, validateMenu } from './src/rules.js';
const candidates = ['public/catalog.json', 'catalog-seed.json'];
let seed;
for (const file of candidates) {
  try { const cat = JSON.parse(fs.readFileSync(file, 'utf8')); if (catalogueCompatible(cat)) { seed = cat; break; } } catch {}
}
const resolved = new Map(Object.values(seed?.menu || {}).flat().map(it => [it.id, it]));
const menu = structuredClone(MENU_DATA);
for (const [key, list] of Object.entries(menu)) menu[key] = list.map(item => {
  if (item.type === 'nav') return item;
  const old = resolved.get(item.id);
  if (item.type === 'curated') {
    const pictures = new Map((old?.picks || []).map(p => [p.id, p]));
    return { ...item, picks: item.picks.map(p => { const photo = pictures.get(p.id); return {...p, img: item.picture !== 'none' && photo?.name === p.name && photo?.title === p.title ? photo.img || '' : ''}; }) };
  }
  // A resolved pool is used only for the same source category; curated categories
  // above can never inherit an expanded pool or another actor's picture.
  if (old?.type === 'pool') return { ...old, name: item.name, criterion: item.criterion, direction: item.direction, subtitle: item.subtitle, eligibility: item.eligibility };
  return item;
});
const errors = validateMenu(menu); if (errors.length) throw new Error(errors.join('\n'));
const cat = {version:CATALOG_VERSION, contentRevision:CONTENT_REVISION, generatedAt:seed?.generatedAt || new Date().toISOString(), menu};
fs.mkdirSync('public',{recursive:true}); fs.writeFileSync('public/catalog.json',JSON.stringify(cat));
console.log(`Prepared ${Object.values(menu).flat().filter(x=>x.type!=='nav').length} categories (${seed ? 'with resolved images' : 'exact-name fallback'})`);
