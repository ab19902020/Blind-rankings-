// Thin layer over the Android shell (window.BlindRankNative) with web fallbacks.
const N = () => (typeof window !== 'undefined' ? window.BlindRankNative : null);

export const isNative = () => !!N();

let hapticsOn = true;
export function setHapticsEnabled(v) { hapticsOn = v; }

export function haptic(pattern = 30) {
  if (!hapticsOn) return;
  try {
    const n = N();
    if (n && n.haptic) { n.haptic(Array.isArray(pattern) ? pattern.join(',') : String(pattern)); return; }
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch (e) {}
}

export async function shareText(title, text) {
  const n = N();
  if (n && n.shareText) { n.shareText(title, text); return true; }
  if (navigator.share) { try { await navigator.share({ title, text }); return true; } catch (e) { return false; } }
  try { await navigator.clipboard.writeText(text); return 'copied'; } catch (e) { return false; }
}

function toBase64(buf) {
  const bytes = new Uint8Array(buf);
  let bin = '';
  const step = 0x8000;
  for (let i = 0; i < bytes.length; i += step) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + step));
  return btoa(bin);
}

// Saves the recorded clip. On Android it lands in Movies/Blind Rank; on the web it downloads.
export async function saveVideo(blob, ext, onProgress) {
  const n = N();
  const filename = `BlindRank_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.${ext}`;
  if (n && n.videoBegin) {
    n.videoBegin(filename, blob.type || (ext === 'mp4' ? 'video/mp4' : 'video/webm'));
    const CHUNK = 768 * 1024; // multiple of 3 keeps base64 chunks independent
    for (let off = 0; off < blob.size; off += CHUNK) {
      const buf = await blob.slice(off, off + CHUNK).arrayBuffer();
      n.videoChunk(toBase64(buf));
      onProgress && onProgress(Math.min(1, (off + CHUNK) / blob.size));
      await new Promise(r => setTimeout(r, 0));
    }
    const ok = n.videoEnd();
    return ok ? 'saved' : 'failed';
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  return 'downloaded';
}

export async function shareVideo(blob, ext, alreadySaved) {
  const n = N();
  if (n && n.shareLastVideo) {
    if (!alreadySaved) {
      const r = await saveVideo(blob, ext);
      if (r !== 'saved') return false;
    }
    return n.shareLastVideo() ? 'shared-saved' : false;
  }
  try {
    const file = new File([blob], `BlindRank.${ext}`, { type: blob.type });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: 'Blind Rank' }); return true; }
  } catch (e) {}
  await saveVideo(blob, ext);
  return 'downloaded';
}

export function appVersion() {
  const n = N();
  try { return n && n.version ? n.version() : 'web'; } catch (e) { return 'web'; }
}
