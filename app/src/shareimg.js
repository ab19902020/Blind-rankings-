// Renders a 1080x1920 "My Top 10" card and shares it.
import { preload } from './api.js';
import { displayName, inkOn, safeSecondary } from './catalog.js';

const W = 1080, H = 1920, FONT = "'Nunito Sans', system-ui, sans-serif";
const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r); };
function cover(c, img, x, y, w, h) {
  const s = Math.max(w / img.naturalWidth, h / img.naturalHeight); const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
  c.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2 * 0.5, dw, dh);
}

export async function renderRankImage(record, theme) {
  try { await document.fonts.ready; } catch (e) {}
  const imgs = await Promise.all(record.picks.map(p => preload(p.img)));
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const c = cv.getContext('2d');
  const prim = theme.primary, sec = safeSecondary(theme);
  c.fillStyle = '#09090C'; c.fillRect(0, 0, W, H);
  let g = c.createRadialGradient(W * 0.5, 280, 40, W * 0.5, 280, 900); g.addColorStop(0, prim + '55'); g.addColorStop(1, 'transparent');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  g = c.createRadialGradient(W * 0.1, H, 40, W * 0.1, H, 900); g.addColorStop(0, sec + '33'); g.addColorStop(1, 'transparent');
  c.fillStyle = g; c.fillRect(0, 0, W, H);

  c.textAlign = 'center'; c.textBaseline = 'alphabetic';
  c.fillStyle = '#fff'; c.font = `900 54px ${FONT}`; c.fillText('BLIND RANK', W / 2, 120);
  c.fillStyle = '#FFB300'; c.font = `900 26px ${FONT}`; c.fillText('P R O   U L T R A', W / 2, 162);
  c.fillStyle = prim; c.font = `900 30px ${FONT}`; c.fillText('M Y   T O P   1 0', W / 2, 250);
  c.fillStyle = '#fff'; c.font = `900 72px ${FONT}`; c.fillText(displayName(record.title), W / 2, 330, W - 120);

  // #1 hero card
  const cw = 420, ch = 520, cx = (W - cw) / 2, cy = 380;
  c.save(); c.shadowColor = 'rgba(255,179,0,0.6)'; c.shadowBlur = 60; rr(c, cx, cy, cw, ch, 34); c.fillStyle = '#111'; c.fill(); c.restore();
  c.save(); rr(c, cx, cy, cw, ch, 34); c.clip(); if (imgs[0]) cover(c, imgs[0], cx, cy, cw, ch);
  g = c.createLinearGradient(0, cy + ch * 0.55, 0, cy + ch); g.addColorStop(0, 'transparent'); g.addColorStop(1, 'rgba(0,0,0,0.85)'); c.fillStyle = g; c.fillRect(cx, cy, cw, ch); c.restore();
  rr(c, cx, cy, cw, ch, 34); c.lineWidth = 8; g = c.createLinearGradient(cx, cy, cx + cw, cy + ch); g.addColorStop(0, '#FFE58A'); g.addColorStop(1, '#F59E0B'); c.strokeStyle = g; c.stroke();
  rr(c, cx - 22, cy - 22, 96, 96, 26); c.fillStyle = g; c.fill();
  c.fillStyle = '#3A2000'; c.font = `900 italic 64px ${FONT}`; c.textAlign = 'center'; c.fillText('1', cx + 26, cy + 52);
  c.fillStyle = '#fff'; c.font = `900 46px ${FONT}`; c.fillText(record.picks[0]?.name || '', W / 2, cy + ch - 34, cw - 40);

  // 2-10
  const top = 960, rowH = 96;
  record.picks.slice(1).forEach((p, k) => {
    const i = k + 1, y = top + k * rowH;
    rr(c, 70, y, W - 140, rowH - 14, 22); c.fillStyle = 'rgba(255,255,255,0.06)'; c.fill();
    c.lineWidth = 2; c.strokeStyle = 'rgba(255,255,255,0.10)'; c.stroke();
    c.textAlign = 'center'; c.fillStyle = i < 3 ? ['#FFD45C', '#D7DAE5', '#E7B48F'][i] : prim; c.font = `900 italic 44px ${FONT}`; c.fillText(String(i + 1), 128, y + 58);
    c.save(); rr(c, 180, y + 7, 68, 68, 14); c.clip(); if (imgs[i]) cover(c, imgs[i], 180, y + 7, 68, 68); c.restore();
    c.textAlign = 'left'; c.fillStyle = '#fff'; c.font = `800 38px ${FONT}`; c.fillText(p.name, 276, y + 54, W - 380);
  });

  c.textAlign = 'center'; c.fillStyle = 'rgba(255,255,255,0.6)'; c.font = `700 30px ${FONT}`;
  c.fillText(`Ranked blind in ${((record.timeMs || 0) / 1000).toFixed(1)}s · can you beat my list?`, W / 2, H - 60);
  return cv;
}

export async function shareRankImage(record, theme) {
  const cv = await renderRankImage(record, theme);
  const name = `BlindRank_${Date.now()}.png`;
  const n = window.BlindRankNative;
  if (n && n.shareImage) {
    const b64 = cv.toDataURL('image/png').split(',')[1];
    return n.shareImage(b64, name) ? 'shared' : 'failed';
  }
  const blob = await new Promise(r => cv.toBlob(r, 'image/png'));
  try {
    const file = new File([blob], name, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file] }); return 'shared'; }
  } catch (e) {}
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click();
  return 'downloaded';
}
