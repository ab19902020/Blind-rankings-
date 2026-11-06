import React, { useEffect, useRef, useState } from 'react';
import { cachedThumb, thumbFor, preload } from './api.js';
import { displayName, sourceLabel, themeFor, inkOn, safeSecondary, domainForItem, ALL_CHALLENGES } from './catalog.js';
import { DomainArt, HEADER_ART } from './art.jsx';
import * as Ic from './icons.jsx';

export function themeVars(t) {
  return { '--p': t.primary, '--s': safeSecondary(t), '--p-ink': inkOn(t.primary) };
}

export function leafInfo(item) { return ALL_CHALLENGES.find(l => l.item === item) || { item, domain: domainForItem(item) }; }

export function itemTheme(item, domain) { return themeFor(item.themeOverride || domain); }

/* Lazily fetch a real image for a challenge once it scrolls into view. */
export function useThumb(item) {
  const ref = useRef(null);
  const [url, setUrl] = useState(null);
  useEffect(() => {
    setUrl(null);
    let alive = true;
    const el = ref.current;
    const go = async () => { const u = cachedThumb(item) || await thumbFor(item); if (u && await preload(u) && alive) setUrl(u); };
    if (!el || !('IntersectionObserver' in window)) { go(); return () => { alive = false; }; }
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); go(); } }, { rootMargin: '200px' });
    io.observe(el);
    return () => { alive = false; io.disconnect(); };
  }, [item]);
  return [ref, url];
}

function FadeImg({ src, className = '' }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(false), [src]);
  if (!src) return null;
  return <img src={src} alt="" className={`${className} ${loaded ? 'in' : ''}`} onLoad={() => setLoaded(true)} draggable="false" />;
}

function DebateArt({ item }) {
  return <div className="debate-art" aria-hidden="true"><span className="da-rank da-one">1</span><span className="da-icon">{item.icon || '🏆'}</span><span className="da-rank da-ten">10</span></div>;
}

export function ChallengeRow({ item, group, domain, onClick, style, showDomain }) {
  const [ref, url] = useThumb(item);
  const t = itemTheme(item, domain);
  const sub = [showDomain ? displayName(themeLabel(domain)) : null, group ? displayName(group.name) : null, sourceLabel(item)].filter(Boolean).join(' · ');
  return (
    <button ref={ref} className="row fade-up" style={{ ...themeVars(t), ...style }} onClick={onClick}>
      <div className="r-media">
        {!url && (item.type === 'curated' ? <DebateArt item={item} /> : <div className="r-emoji">{item.icon}</div>)}
        <FadeImg src={url} />
      </div>
      <div className="r-body">
        <div className="r-title">{displayName(item.name)}{item.id.startsWith('deb_') && <span className="new-badge">NEW</span>}</div>
        <div className="r-sub">{sub}</div>
      </div>
      <div className="r-go"><Ic.Chevron size={22} /></div>
    </button>
  );
}

export function NavRow({ item, onClick, count, style }) {
  return (
    <button className="row nav fade-up" style={style} onClick={onClick}>
      <div className="r-media"><span style={{ fontSize: 34 }}>{item.icon}</span></div>
      <div className="r-body">
        <div className="r-title">{displayName(item.name)}{item.id.startsWith('deb_') && <span className="new-badge">NEW</span>}</div>
        <div className="r-sub">{count} challenges</div>
      </div>
      <div className="r-go"><Ic.Chevron size={22} /></div>
    </button>
  );
}

const DOMAIN_LABEL = { movies: 'Movies', tv: 'TV', anime: 'Anime', actors: 'Celebs', sports: 'Sports', creators: 'Creators', music: 'Music', games: 'Gaming', nature: 'Nature', food: 'Food', history: 'History', myths: 'Myths', cars: 'Cars', places: 'Places' };
export const themeLabel = d => DOMAIN_LABEL[d] || '';

export function FeatureBanner({ item, domain, onClick, kicker = 'Featured' }) {
  const [ref, url] = useThumb(item);
  const t = itemTheme(item, domain);
  const Art = HEADER_ART[domain];
  return (
    <button ref={ref} className="feature fade-up" style={themeVars(t)} onClick={onClick}>
      {!url && (item.type === 'curated' ? <DebateArt item={item} /> : Art ? <Art className="f-art" /> : null)}
      <FadeImg src={url} className="f-img" />
      <div className="f-body">
        <div className="f-kick">{kicker}</div>
        <h2>{displayName(item.name)}</h2>
        <div className="f-meta">10 picks • Blind ranking</div>
      </div>
      <div className="f-play"><Ic.Play size={20} /></div>
    </button>
  );
}

export function Switch({ on }) { return <span className={`switch ${on ? 'on' : ''}`} />; }

export function Sheet({ onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const prior = document.activeElement;
    const focusable = () => [...(ref.current?.querySelectorAll('button:not(:disabled),input,textarea,select,[tabindex="0"]') || [])];
    focusable()[0]?.focus();
    const key = e => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      if (e.key === 'Tab') {
        const list = focusable(), first = list[0], last = list.at(-1);
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('keydown', key); prior?.focus(); };
  }, []);
  return (
    <>
      <div className="sheet-back" onClick={onClose} />
      <div ref={ref} className="sheet" role="dialog" aria-modal="true"><div className="grab" /><button className="dialog-close" onClick={onClose} aria-label="Close dialog">×</button>{children}</div>
    </>
  );
}

export function Toast({ msg }) { return msg ? <div className="toast">{msg}</div> : null; }

export function Confetti({ colors, run }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!run) return;
    const c = ref.current; const ctx = c.getContext('2d');
    const dpr = Math.min(2, devicePixelRatio || 1);
    const W = c.clientWidth, H = c.clientHeight; c.width = W * dpr; c.height = H * dpr; ctx.scale(dpr, dpr);
    const parts = Array.from({ length: 160 }, (_, i) => ({
      x: W / 2 + (Math.random() - 0.5) * 40, y: H * 0.28, vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 16 - 4,
      s: Math.random() * 8 + 5, c: colors[i % colors.length], r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, shape: i % 3,
    }));
    let raf, t0 = performance.now();
    const tick = now => {
      const el = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      parts.forEach(p => {
        p.vy += 0.38; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.globalAlpha = Math.max(0, 1 - el / 3.6); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
        if (p.shape === 0) ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        else if (p.shape === 1) { ctx.beginPath(); ctx.arc(0, 0, p.s / 3, 0, Math.PI * 2); ctx.fill(); }
        else { ctx.beginPath(); ctx.moveTo(0, -p.s / 2); ctx.lineTo(p.s / 2, p.s / 2); ctx.lineTo(-p.s / 2, p.s / 2); ctx.fill(); }
        ctx.restore();
      });
      if (el < 3.8) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run]);
  return <canvas ref={ref} className="confetti" style={{ width: '100%', height: '100%' }} />;
}

export function Ambient() { return <div className="ambient"><i className="a1" /><i className="a2" /></div>; }

export { DomainArt };
