// Face tracking, on-screen card positioning and the 1080x1920 recording renderer.
import { cleanName, inkOn, safeSecondary } from './catalog.js';

const CW = 1080, CH = 1920;
const FONT = "'Nunito Sans', system-ui, sans-serif";

let faceapiPromise = null;
function loadFaceApi() {
  if (window.faceapi) return Promise.resolve(window.faceapi);
  if (!faceapiPromise) {
    faceapiPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'vendor/face-api.js';
      s.onload = async () => {
        try { await window.faceapi.nets.tinyFaceDetector.loadFromUri('models/'); resolve(window.faceapi); }
        catch (e) { reject(e); }
      };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  return faceapiPromise;
}

function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }

function drawCover(ctx, img, x, y, w, h) {
  const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
  const s = Math.max(w / iw, h / ih); const dw = iw * s, dh = ih * s;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2 * 0.6, dw, dh);
}

export function createEngine({ video, canvas, getCard, getState, onFace }) {
  const p = {
    domX: innerWidth / 2, domY: innerHeight * 0.3, domScale: 0.9, domRot: 0,
    cX: CW / 2, cY: CH * 0.3, cScale: 1, cRot: 0,
    detected: false, lost: 0, box: null, vw: 1, vh: 1, targetScale: 0.9,
  };
  let running = true, detecting = false, aiReady = false, trackingOn = true;
  let recorder = null, chunks = [], recording = false, mime = '';
  let confetti = [];
  const ctx = canvas.getContext('2d', { alpha: false });
  canvas.width = CW; canvas.height = CH;

  loadFaceApi().then(() => { aiReady = true; }).catch(() => { aiReady = false; onFace && onFace('unavailable'); });

  const aiTimer = setInterval(async () => {
    if (!running || !aiReady || !trackingOn || detecting || !video || video.readyState < 2) return;
    const st = getState(); if (st.phase !== 'playing' && st.phase !== 'countdown') return;
    detecting = true;
    try {
      const d = await window.faceapi.detectSingleFace(video, new window.faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.25 }));
      if (d) { p.detected = true; p.lost = 0; p.box = d.box; p.vw = video.videoWidth; p.vh = video.videoHeight; }
      else if (++p.lost > 5) p.detected = false;
      onFace && onFace(p.detected ? 'tracking' : 'searching');
    } catch (e) {} finally { detecting = false; }
  }, 80);

  function faceTarget(sw, sh, contain) {
    // Returns where the card should float (above the head) in a given viewport.
    if (!(trackingOn && p.detected && p.box && video && video.videoWidth)) return null;
    const vw = p.vw, vh = p.vh;
    const s = contain ? Math.min(sw / vw, sh / vh) : Math.max(sw / vw, sh / vh);
    const ox = (sw - vw * s) / 2, oy = (sh - vh * s) / 2;
    const fx = p.box.x + p.box.width / 2;
    const x = sw - (ox + fx * s);
    const y = oy + p.box.y * s - p.box.height * s * 0.62;
    return { x, y: Math.max(sh * 0.17, Math.min(sh * 0.86, y)), w: p.box.width * s };
  }

  function frame() {
    if (!running) return;
    const st = getState();
    const sw = innerWidth, sh = innerHeight;

    // ---- on-screen floating card
    const card = getCard && getCard();
    if (card) {
      const show = st.phase === 'playing';
      if (show) {
        const t = faceTarget(sw, sh, false);
        const tx = t ? t.x : sw / 2 + 22, ty = t ? t.y : sh * 0.34;
        const ts = t ? Math.min(1.05, Math.max(0.68, t.w / 170)) : 1;
        p.targetScale = ts;
        const rot = Math.max(-12, Math.min(12, (tx - p.domX) * 0.08));
        p.domX += (tx - p.domX) * 0.22; p.domY += (ty - p.domY) * 0.22;
        p.domScale += (ts - p.domScale) * 0.2; p.domRot += (rot - p.domRot) * 0.2;
        card.style.transform = `translate3d(${p.domX}px, ${p.domY}px, 0) translate(-50%, -50%) scale(${p.domScale}) rotate(${p.domRot}deg)`;
        card.style.opacity = '1';
      } else card.style.opacity = '0';
    }

    if (recording) draw(st);
    requestAnimationFrame(frame);
  }

  function draw(st) {
    const theme = st.theme;
    const prim = theme.primary, sec = safeSecondary(theme);
    ctx.save();
    ctx.fillStyle = '#07070A'; ctx.fillRect(0, 0, CW, CH);
    let cs = 1, cox = 0, coy = 0;
    if (video && video.videoWidth) {
      const vw = video.videoWidth, vh = video.videoHeight;
      const cover = Math.max(CW / vw, CH / vh);
      ctx.save(); ctx.translate(CW, 0); ctx.scale(-1, 1);
      ctx.drawImage(video, (CW - vw * cover) / 2, (CH - vh * cover) / 2, vw * cover, vh * cover);
      ctx.restore();
      cs = cover; cox = (CW - vw * cover) / 2; coy = (CH - vh * cover) / 2;
    }
    // cinematic grade
    let g = ctx.createLinearGradient(0, 0, 0, CH);
    g.addColorStop(0, 'rgba(0,0,0,0.72)'); g.addColorStop(0.18, 'rgba(0,0,0,0.05)');
    g.addColorStop(0.75, 'rgba(0,0,0,0.05)'); g.addColorStop(1, 'rgba(0,0,0,0.8)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, CW, CH);
    g = ctx.createLinearGradient(0, 0, 420, 0);
    g.addColorStop(0, 'rgba(0,0,0,0.55)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 420, CH);

    // header
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `900 34px ${FONT}`; ctx.fillStyle = '#FFFFFF';
    ctx.fillText('BLIND RANK', CW / 2, 92);
    ctx.font = `900 20px ${FONT}`; ctx.fillStyle = '#FFB300';
    ctx.fillText('P R O   U L T R A', CW / 2, 126);
    const title = (st.title || '').toUpperCase();
    ctx.font = `900 46px ${FONT}`;
    const tw = Math.min(CW - 140, ctx.measureText(title).width + 90);
    rr(ctx, CW / 2 - tw / 2, 158, tw, 84, 42);
    ctx.fillStyle = 'rgba(10,10,14,0.72)'; ctx.fill();
    ctx.lineWidth = 4; ctx.strokeStyle = prim; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.fillText(title, CW / 2, 202, tw - 60);

    // slots
    const top = 300, bottom = 1730, n = 10;
    const slotH = (bottom - top) / n, h = slotH - 16, w = Math.round(h * 0.8), x = 56;
    const nextEmpty = st.slots.findIndex(s => !s);
    st.slots.forEach((s, i) => {
      const y = top + i * slotH;
      const isNext = i === nextEmpty && st.phase === 'playing';
      ctx.save();
      if (isNext) { ctx.shadowColor = prim; ctx.shadowBlur = 40; }
      rr(ctx, x, y, w, h, 18);
      if (s) {
        ctx.fillStyle = '#111'; ctx.fill(); ctx.shadowBlur = 0;
        ctx.save(); rr(ctx, x, y, w, h, 18); ctx.clip();
        if (s.imgObj) drawCover(ctx, s.imgObj, x, y, w, h);
        const sg = ctx.createLinearGradient(0, y, 0, y + h); sg.addColorStop(0.55, 'rgba(0,0,0,0)'); sg.addColorStop(1, 'rgba(0,0,0,0.7)');
        ctx.fillStyle = sg; ctx.fillRect(x, y, w, h);
        ctx.restore();
        rr(ctx, x, y, w, h, 18); ctx.lineWidth = i === 0 ? 6 : 4; ctx.strokeStyle = i === 0 ? '#FFC93C' : prim; ctx.stroke();
        // number tag
        rr(ctx, x - 6, y - 6, 46, 46, 14);
        ctx.fillStyle = i === 0 ? '#FFC93C' : prim; ctx.fill();
        ctx.fillStyle = i === 0 ? '#3A2000' : inkOn(prim); ctx.font = `900 italic 28px ${FONT}`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(i + 1), x + 17, y + 18);
      } else {
        const eg = ctx.createLinearGradient(x, y, x + w, y + h);
        eg.addColorStop(0, i === 0 ? 'rgba(255,201,60,0.35)' : 'rgba(255,255,255,0.18)');
        eg.addColorStop(1, i === 0 ? 'rgba(255,150,0,0.12)' : 'rgba(255,255,255,0.05)');
        ctx.fillStyle = eg; ctx.fill(); ctx.shadowBlur = 0;
        ctx.lineWidth = isNext ? 5 : 2.5; ctx.strokeStyle = isNext ? prim : (i === 0 ? 'rgba(255,201,60,0.8)' : 'rgba(255,255,255,0.35)'); ctx.stroke();
        ctx.fillStyle = i === 0 ? '#FFD45C' : 'rgba(255,255,255,0.85)';
        ctx.font = `900 italic ${i === 9 ? 50 : 66}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(String(i + 1), x + w / 2, y + h / 2 + 3);
      }
      ctx.restore();
    });

    // floating card
    const active = st.queue[st.activeIndex];
    if (st.phase === 'playing' && active) {
      const vw = video?.videoWidth || 1;
      let tx = CW / 2 + 60, ty = CH * 0.32;
      if (trackingOn && p.detected && p.box && video?.videoWidth) {
        const fx = p.box.x + p.box.width / 2;
        tx = CW - (cox + fx * cs); ty = coy + p.box.y * cs - p.box.height * cs * 0.62;
        ty = Math.max(CH * 0.2, Math.min(CH * 0.84, ty)); tx = Math.max(330, Math.min(CW - 190, tx));
      }
      const rot = Math.max(-12, Math.min(12, (tx - p.cX) * 0.05));
      p.cX += (tx - p.cX) * 0.22; p.cY += (ty - p.cY) * 0.22; p.cRot += (rot - p.cRot) * 0.2;
      const S = 330, H = S / 2;
      ctx.save(); ctx.translate(p.cX, p.cY); ctx.rotate(p.cRot * Math.PI / 180);
      ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 24;
      rr(ctx, -H, -H, S, S, 40); ctx.fillStyle = '#0B0B10'; ctx.fill();
      ctx.shadowOffsetY = 0; ctx.shadowColor = prim; ctx.shadowBlur = 45;
      const bg = ctx.createLinearGradient(-H, -H, H, H); bg.addColorStop(0, prim); bg.addColorStop(1, sec);
      ctx.lineWidth = 12; ctx.strokeStyle = bg; ctx.stroke(); ctx.shadowBlur = 0;
      ctx.save(); rr(ctx, -H + 12, -H + 12, S - 24, S - 24, 30); ctx.clip();
      if (!st.rolling && active.imgObj) drawCover(ctx, active.imgObj, -H + 12, -H + 12, S - 24, S - 24);
      else {
        const qg = ctx.createLinearGradient(-H, -H, H, H); qg.addColorStop(0, '#1b1b22'); qg.addColorStop(1, '#0d0d12');
        ctx.fillStyle = qg; ctx.fillRect(-H, -H, S, S);
        ctx.fillStyle = prim; ctx.font = `900 170px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('?', 0, 10);
      }
      ctx.restore();
      // name plate
      const name = st.rolling ? 'SHUFFLING…' : cleanName(active.name).toUpperCase();
      ctx.font = `900 40px ${FONT}`;
      const nw = Math.min(560, ctx.measureText(name).width + 70);
      rr(ctx, -nw / 2, H + 18, nw, 76, 38);
      const ng = ctx.createLinearGradient(-nw / 2, 0, nw / 2, 0); ng.addColorStop(0, prim); ng.addColorStop(1, sec);
      ctx.fillStyle = ng; ctx.fill();
      ctx.fillStyle = inkOn(prim); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(name, 0, H + 58, nw - 40);
      ctx.restore();
    }

    // reaction caption
    if (st.phase === 'playing' && st.caption) {
      ctx.save();
      ctx.font = `900 46px ${FONT}`;
      const cw = ctx.measureText(st.caption).width + 70;
      const cx = CW / 2 - cw / 2 + 60, cy = CH - 330;
      rr(ctx, cx, cy, cw, 92, 30); ctx.fillStyle = '#FFFFFF'; ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 30; ctx.fill();
      ctx.shadowBlur = 0; ctx.fillStyle = '#111'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(st.caption, cx + cw / 2, cy + 48);
      ctx.restore();
    }

    // countdown
    if (st.phase === 'countdown' && st.count) {
      ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, 0, CW, CH);
      ctx.beginPath(); ctx.arc(CW / 2, CH / 2, 190, 0, Math.PI * 2);
      ctx.lineWidth = 14; ctx.strokeStyle = prim; ctx.shadowColor = prim; ctx.shadowBlur = 50; ctx.stroke();
      ctx.shadowBlur = 0; ctx.fillStyle = '#fff'; ctx.font = `900 italic 240px ${FONT}`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(st.count), CW / 2, CH / 2 + 12);
      ctx.restore();
    }

    // results confetti + banner
    if (st.phase === 'result') {
      if (!confetti.length) {
        const cols = ['#FFC93C', prim, sec, '#FFFFFF', '#FF3D7F', '#22D3EE'];
        confetti = Array.from({ length: 140 }, () => ({ x: CW / 2, y: CH * 0.45, vx: (Math.random() - 0.5) * 46, vy: (Math.random() - 1.15) * 46, s: Math.random() * 16 + 10, c: cols[Math.floor(Math.random() * cols.length)], r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4 }));
      }
      confetti.forEach(c => {
        c.x += c.vx; c.vy += 1.4; c.y += c.vy; c.vx *= 0.99; c.r += c.vr;
        ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.r); ctx.fillStyle = c.c; ctx.fillRect(-c.s / 2, -c.s / 4, c.s, c.s / 2); ctx.restore();
      });
      const bw = 560; rr(ctx, CW - bw - 60, CH - 330, bw, 150, 34);
      const bg2 = ctx.createLinearGradient(CW - bw - 60, 0, CW - 60, 0); bg2.addColorStop(0, '#FFD45C'); bg2.addColorStop(1, '#FF9F0A');
      ctx.fillStyle = bg2; ctx.fill();
      ctx.fillStyle = '#2A1600'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = `900 30px ${FONT}`; ctx.fillText('MY #1', CW - 60 - bw / 2, CH - 290);
      const first = st.slots[0]; ctx.font = `900 50px ${FONT}`;
      ctx.fillText(first ? cleanName(first.name).toUpperCase() : '', CW - 60 - bw / 2, CH - 230, bw - 40);
    } else confetti = [];

    // watermark
    ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic';
    ctx.font = `900 40px ${FONT}`; ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.fillText('BLIND RANK', CW - 56, CH - 92);
    ctx.font = `800 24px ${FONT}`; ctx.fillStyle = '#FFB300'; ctx.fillText('PLAY THE GAME →', CW - 56, CH - 56);
    ctx.restore();
  }

  requestAnimationFrame(frame);

  return {
    setTracking(v) { trackingOn = v; if (!v) p.detected = false; },
    isRecording: () => recording,
    startRecording(audioTrack) {
      if (recording) return true;
      try {
        if (!canvas.captureStream || typeof MediaRecorder === 'undefined') return false;
        recording = true; draw(getState());
        const stream = canvas.captureStream(30);
        if (audioTrack) stream.addTrack(audioTrack);
        const types = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
        mime = types.find(t => MediaRecorder.isTypeSupported(t)) || '';
        chunks = [];
        recorder = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 6_000_000, audioBitsPerSecond: 128_000 } : undefined);
        recorder.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
        recorder.start(250);
        return true;
      } catch (e) { recording = false; return false; }
    },
    stopRecording() {
      return new Promise(resolve => {
        if (!recorder || recorder.state === 'inactive') { recording = false; resolve(null); return; }
        recorder.onstop = () => {
          recording = false;
          if (!chunks.length) { resolve(null); return; }
          const type = recorder.mimeType || mime || 'video/webm';
          const blob = new Blob(chunks, { type });
          resolve({ blob, ext: type.includes('mp4') ? 'mp4' : 'webm' });
        };
        recorder.stop();
      });
    },
    cancelRecording() { try { if (recorder && recorder.state !== 'inactive') { recorder.onstop = null; recorder.stop(); } } catch (e) {} recording = false; chunks = []; },
    destroy() { running = false; clearInterval(aiTimer); },
  };
}
