import test from 'node:test';
import assert from 'node:assert/strict';
import { MENU_DATA } from '../src/data.js';
import { CONTENT_REVISION, CATALOG_VERSION, validateMenu, catalogueCompatible, uniquePicks, nameCard } from '../src/rules.js';
import { encodeChallenge, decodeChallenge, safeImage } from '../src/challenge.js';
const leaves = Object.values(MENU_DATA).flat().filter(x => x.type !== 'nav');
test('all menus are reachable, acyclic and have unique categories and candidate IDs', () => {
  assert.deepEqual(validateMenu(MENU_DATA), []);
  for (const it of leaves) { assert.equal(it.grow, undefined, it.id); const n = it.picks?.length || it.items?.length || it.queries?.length; if (n) assert.ok(n >= 10, it.id); }
  assert.ok(leaves.length >= 390);
});
test('football criteria, transfer context and curated membership are explicit', () => {
  for (const id of ['deb_flops','deb_waste','deb_bargain','deb_free','deb_january']) {
    const item = leaves.find(x => x.id === id); assert.ok(item.picks.every(p => p.detail.includes(' · ')), id); assert.equal(item.type, 'curated');
  }
  assert.ok(!leaves.find(x => x.id === 'deb_free').picks.some(p => p.name === 'Sylvain Distin'));
  assert.ok(!leaves.find(x => x.id === 'deb_flops').picks.some(p => /Augustin/.test(p.name)));
  assert.ok(!leaves.find(x => x.id === 'club_utd_best').picks.some(p => p.name === 'Paul Scholes'));
  for (const it of leaves.filter(x => x.type === 'curated')) assert.ok(it.criterion && it.eligibility);
});
test('character categories cannot request actor portraits', () => {
  const item = leaves.find(x => x.id === 'mc_villains'); assert.equal(item.picture, 'none'); assert.equal(item.queries, undefined); assert.ok(item.picks.some(p => p.name === 'Thanos'));
});
test('old, malformed and incompatible catalogues are rejected', () => {
  const cat = { version: CATALOG_VERSION, contentRevision: CONTENT_REVISION, generatedAt: new Date().toISOString(), menu: MENU_DATA };
  assert.equal(catalogueCompatible(cat), true);
  assert.equal(catalogueCompatible({...cat, version:4}), false);
  assert.equal(catalogueCompatible({...cat, contentRevision:'old'}), false);
  assert.equal(catalogueCompatible({...cat, generatedAt:'not-a-date'}), false);
  const menu = {domain:[{id:'a'}], a:[{type:'nav',id:'a',name:'Cycle'}]}; assert.ok(validateMenu(menu).length);
});
test('same-ten friend challenge preserves order, context and mode across Unicode round trip', () => {
  const it = leaves.find(x => x.id === 'deb_flops'), deck = it.picks.slice(0,10).map(p=>({...p,img:'https://upload.wikimedia.org/wikipedia/test.jpg'}));
  const token = encodeChallenge(it,deck,'casual'); const imported = decodeChallenge('Join me!\n'+token);
  assert.deepEqual(imported.picks, deck.map(({id,name,detail,img})=>({id,name,detail,img}))); assert.equal(imported.mode,'casual'); assert.equal(imported.direction,'worst');
  assert.throws(()=>decodeChallenge(token.slice(0,-1)+'!'));
  assert.throws(()=>encodeChallenge(it,Array(10).fill(deck[0])));
  assert.equal(safeImage('javascript:alert(1)'), ''); assert.equal(safeImage('https://example.com/track'), '');
});
test('identity deduplication and text card escaping', () => {
  assert.equal(uniquePicks([{id:'José'},{id:'Jose'}]).length,1);
  const svg=decodeURIComponent(nameCard('<script>','A&B').split(',')[1]); assert.ok(!svg.includes('<script>')); assert.ok(svg.includes('&amp;'));
});
