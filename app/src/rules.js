// Shared, DOM-free catalogue and challenge rules.
export const CONTENT_REVISION = 'debates-2026-11-06-1';
export const CATALOG_VERSION = 5;
export const identity = s => String(s || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9|]/g, '');
export const rankRule = item => `#1 = ${item.criterion || 'your favourite'}`;
export const modeLabel = mode => mode === 'casual' ? 'Casual · Undo allowed' : 'Strict · No take-backs';
export function uniquePicks(picks) {
  const seen = new Set();
  return picks.filter(p => { const key = identity(p.id || `${p.name}|${p.detail || ''}`); if (!key || seen.has(key)) return false; seen.add(key); return true; });
}
export function shuffle(picks, random = Math.random) {
  const out = [...picks];
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
}
export function validateMenu(menu) {
  const errors = [], ids = new Set(), reachable = new Set();
  if (!menu || !Array.isArray(menu.domain) || !menu.domain.length) return ['Missing domains'];
  function visit(key, path = []) {
    if (path.includes(key)) { errors.push(`Navigation cycle: ${key}`); return; }
    if (!Array.isArray(menu[key])) { errors.push(`Missing menu: ${key}`); return; }
    for (const item of menu[key]) {
      if (!item || !item.id || !item.name) { errors.push(`Invalid item in ${key}`); continue; }
      if (ids.has(item.id)) errors.push(`Duplicate id: ${item.id}`);
      ids.add(item.id); reachable.add(item.id);
      if (item.type === 'nav') visit(item.id, [...path, key]);
      else {
        const pool = item.picks || item.pool?.map(([name, img]) => ({ id: name, name, img }));
        if (pool && (pool.length < 10 || uniquePicks(pool).length !== pool.length)) errors.push(`Invalid pool: ${item.id}`);
        if (item.type === 'curated' && (!item.criterion || !item.eligibility || item.grow)) errors.push(`Missing editorial rules: ${item.id}`);
      }
    }
  }
  for (const d of menu.domain) visit(d.id);
  return errors;
}
export function catalogueCompatible(cat) {
  return !!cat && cat.version === CATALOG_VERSION && cat.contentRevision === CONTENT_REVISION &&
    Number.isFinite(Date.parse(cat.generatedAt)) && validateMenu(cat.menu).length === 0;
}
// Safe text card: no image is invented or substituted when a portrait is unavailable.
export function nameCard(name, detail = '') {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
  const words = String(name).split(/\s+/); const lines = []; let line = '';
  for (const word of words) { if ((line + ' ' + word).trim().length > 19 && line) { lines.push(line); line = word; } else line = (line + ' ' + word).trim(); }
  if (line) lines.push(line);
  const label = lines.slice(0, 5).map((l, i) => `<text x="300" y="${230 + i * 48}" text-anchor="middle" font-size="${l.length > 22 ? 26 : 36}" font-weight="800" fill="white">${esc(l)}</text>`).join('');
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" rx="36" fill="#102234"/><path d="M0 90H600M0 510H600" stroke="#32d6c5" stroke-width="3"/><text x="300" y="65" text-anchor="middle" font-size="22" fill="#32d6c5" font-family="sans-serif">BLIND RANK · NAME CARD</text><g font-family="sans-serif">${label}<text x="300" y="555" text-anchor="middle" font-size="18" fill="#b9c8dc">${esc(detail.slice(0, 48))}</text></g></svg>`);
}
