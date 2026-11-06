import { rankRule, modeLabel } from './rules.js';
import React, { useEffect, useRef, useState } from 'react';
import { cleanName, displayName, fitFor } from './catalog.js';
import { RankCardArt } from './art.jsx';
import { Confetti, themeVars } from './ui.jsx';
import { initAudio, playSound } from './audio.js';
import { haptic } from './native.js';
import * as Ic from './icons.jsx';

const fmt = ms => `${(ms / 1000).toFixed(1)}s`;
const pick = a => a[Math.floor(Math.random() * a.length)];
const LINES = {
  top: ['Straight to #1 👑', 'Bold #1 call!', 'Instant GOAT 🐐', 'Crowned. 👑', 'That’s the one!', 'Top spot, no hesitation'],
  high: ['Big respect 🔥', 'Strong pick', 'Up there!', 'Elite tier', 'Solid choice'],
  mid: ['Safe pick', 'Hmm, interesting…', 'Middle of the pack', 'Fair enough', 'No regrets?', 'Bit of a gamble'],
  low: ['Ouch 😬', 'Harsh!', 'Bottom tier…', 'Down it goes', 'Cold-blooded'],
  last: ['Dead last 💀', 'Brutal. #10', 'Rock bottom 🪨', 'Sorry, not sorry'],
  forced: ['No choice now!', 'Last slot standing', 'Had to go somewhere…'],
};
function reaction(slot, remaining, item) {
  if (item.criterion) return slot === 0 ? `${item.criterion}: your #1` : slot === 9 ? 'Your #10. Locked in.' : `Rank ${slot + 1}. Bold call.`;
  if (remaining === 1) return pick(LINES.forced);
  if (slot === 0) return pick(LINES.top);
  if (slot === 9) return pick(LINES.last);
  if (slot <= 2) return pick(LINES.high);
  if (slot >= 7) return pick(LINES.low);
  return pick(LINES.mid);
}
const INTROS = ['Get in frame', 'Lights, camera…', 'No take-backs', 'Trust your gut', 'Here we go'];

/* ======================= Game ======================= */
export function GameScreen({ item, theme, deck, settings, engine, audioTrack, camOn, faceStatus, gameRef, cardRef, onExit, onDone }) {
  const [phase, setPhase] = useState('pre');
  const [count, setCount] = useState(0);
  const [slots, setSlots] = useState(Array(10).fill(null));
  const [active, setActive] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [last, setLast] = useState(null);
  const [flash, setFlash] = useState(null);
  const [recording, setRecording] = useState(false);
  const [caption, setCaption] = useState(null);
  const [intro] = useState(() => pick(INTROS));
  const capT = useRef(null);
  const startRef = useRef(0);
  const timerRef = useRef(null);
  const timeouts = useRef([]);
  const later = (fn, ms) => { const t = setTimeout(fn, ms); timeouts.current.push(t); return t; };
  const finishT = useRef(null);
  const placementLock = useRef(false);
  const title = displayName(item.name);

  useEffect(() => () => timeouts.current.forEach(clearTimeout), []);

  // Share live state with the render engine.
  gameRef.current = {
    phase: phase === 'done' ? 'result' : phase === 'pre' ? 'idle' : phase,
    slots, queue: deck, activeIndex: active, rolling, count, theme, title, caption: caption && caption.text, fit: fitFor(item), criterion: item.criterion, mode: settings.mode,
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    const iv = setInterval(() => { if (timerRef.current) timerRef.current.textContent = fmt(Date.now() - startRef.current); }, 50);
    return () => clearInterval(iv);
  }, [phase]);

  const begin = () => {
    initAudio(); playSound('pop'); haptic(20);
    if (settings.record && camOn) setRecording(engine.startRecording(settings.mic ? audioTrack : null));
    const go = () => {
      playSound('go'); haptic([20, 30, 40]);
      setPhase('playing'); startRef.current = Date.now(); setRolling(true);
      later(() => setRolling(false), 700);
    };
    if (!settings.countdown) { go(); return; }
    setPhase('countdown');
    [3, 2, 1].forEach((n, i) => later(() => { setCount(n); playSound('count'); haptic(15); }, i * 850));
    later(() => { setCount(0); go(); }, 3 * 850);
  };

  const place = i => {
    if (phase !== 'playing' || placementLock.current || rolling || slots[i] || active >= deck.length) return;
    placementLock.current = true;
    haptic(35); playSound('thud');
    const n = [...slots]; n[i] = deck[active];
    const remaining = slots.filter(x => !x).length;
    setSlots(n); setFlash(i); later(() => setFlash(null), 600);
    clearTimeout(capT.current);
    setCaption({ text: reaction(i, remaining, item), slot: i, k: Date.now() });
    capT.current = later(() => setCaption(null), 1300);
    setLast({ slot: i, idx: active });
    const next = active + 1;
    if (n.filter(Boolean).length >= 10 || next >= deck.length) {
      const time = Date.now() - startRef.current;
      finishT.current = later(() => {
        finishT.current = null;
        setPhase('done'); playSound('cheer'); haptic([30, 40, 30, 40, 60]);
        onDone({ slots: n, timeMs: time, recording });
      }, 650);
    } else {
      setRolling(true); later(() => playSound('swoosh'), 150);
      later(() => { setActive(next); setRolling(false); placementLock.current = false; }, 700);
    }
  };

  const undo = () => {
    if (settings.mode !== 'casual' || !last || rolling) return;
    placementLock.current = false;
    if (finishT.current) { clearTimeout(finishT.current); finishT.current = null; }
    haptic([15, 10, 15]); playSound('undo');
    const n = [...slots]; n[last.slot] = null; setSlots(n);
    setActive(last.idx); setLast(null);
  };

  const exit = () => { engine.cancelRecording(); playSound('tap'); onExit(); };
  const nextEmpty = slots.findIndex(s => !s);
  const cur = deck[active];
  const placed = slots.filter(Boolean).length;

  return (
    <div className={`game ${fitFor(item) === 'contain' ? 'fit-contain' : ''}`} style={themeVars(theme)}>
      <div className="hud">
        <button className="icon-btn glass" onClick={exit} aria-label="Quit"><Ic.Close size={22} sw={2.6} /></button>
        <div className="hud-title"><span>{title}</span></div>
        <div className="hud-right">
          <div ref={timerRef} className="timer glass">{phase === 'playing' ? '0.0s' : '—'}</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {recording && <div className="rec glass"><i />REC</div>}
            {camOn && settings.tracking && <div className="rec glass" style={{ padding: '6px 8px' }}><span className={`face-dot ${faceStatus === 'tracking' ? 'tracking' : ''}`} /></div>}
          </div>
        </div>
      </div>

      <div className="game-rule">{rankRule(item)}<span>{settings.mode === 'casual' ? 'CASUAL' : 'STRICT'}</span></div>
      {phase !== 'pre' && phase !== 'countdown' && (
        <div className="slots">
          {slots.map((s, i) => (
            <button key={i} className={`slot ${s ? 'filled' : ''} ${i === nextEmpty && !rolling && phase === 'playing' ? 'next' : ''} ${flash === i ? 'flash' : ''}`}
              disabled={!!s || rolling || phase !== 'playing'} onClick={() => place(i)} aria-label={`Rank ${i + 1}${s ? `: ${s.name}` : ''}`}>
              {s ? <><img src={s.img} alt="" /><span className="tag">{i + 1}</span><span className="slot-label">{s.name}</span></> : <span className="num">{i + 1}</span>}{flash === i && <span className="burst" />}
            </button>
          ))}
        </div>
      )}

      <div ref={cardRef} className="float-card">
        <div className="fc-frame"><div className="fc-in">
          {cur && !rolling ? <img key={active} src={cur.img} alt="" /> : <span className="q">?</span>}
        </div></div>
        <div className="fc-name">{rolling || !cur ? 'Shuffling…' : cleanName(cur.name)}</div>{!rolling && cur?.detail && <div className="fc-detail">{cur.detail}</div>}
      </div>

      {caption && phase !== 'pre' && (
        <div key={caption.k} className="caption" style={{ top: `calc(var(--sat) + 70px + ${caption.slot} * ((100vh - var(--sat) - var(--sab) - 92px) / 10))` }}>{caption.text}</div>
      )}
      {phase === 'playing' && (
        <div className="counter"><b>{placed}/10</b><span>PLACED</span></div>
      )}
      {phase === 'playing' && settings.mode === 'casual' && last && !rolling && (
        <button className="undo glass" onClick={undo}><Ic.Undo size={20} />Undo</button>
      )}

      {phase === 'pre' && (
        <div className="prestart">
          <div className="fade-up" style={{ textAlign: 'center', padding: '0 30px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 26 }}>
              <RankCardArt n={1} tone="gold" style={{ width: 54, transform: 'rotate(-8deg)' }} />
              <RankCardArt n={2} tone="glass" style={{ width: 54 }} />
              <RankCardArt n={3} tone="glass" style={{ width: 54, transform: 'rotate(8deg)' }} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: '0.24em', color: 'var(--p)', textTransform: 'uppercase' }}>{intro}</div>
            <h1 style={{ margin: '8px 0 6px', fontSize: 34, fontWeight: 900, lineHeight: 1.05 }}>{title}</h1>
            <p style={{ margin: 0, color: 'var(--muted)', fontWeight: 600 }}>{camOn ? 'Hold your phone up so your face fits the screen.' : 'Camera is off — you can still play.'}</p>
          </div>
          <div style={{ width: 'min(86vw, 380px)', marginTop: 30 }} className="fade-up">
            <button className="cta theme" onClick={begin}><Ic.Play size={22} />{settings.record && camOn ? 'Start & record' : 'Start'}</button>
          </div>
        </div>
      )}
      {phase === 'countdown' && (
        <div className="prestart" style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'none' }}>
          {count > 0 && <><div className="count-ring" key={'r' + count} /><div className="countdown" key={count}>{count}</div></>}
        </div>
      )}
    </div>
  );
}

/* ======================= Result ======================= */
export function ResultScreen({ record, theme, video, onHome, onAgain, onShareList, onShareImage, onSaveVideo, onShareVideo, fromHistory, onChallenge, onReport }) {
  const picks = record.picks;
  const [one, two, three] = picks;
  const rest = picks.slice(3);
  const pod = (p, n, cls, delay) => p && (
    <div className={`pod ${cls}`} style={{ animationDelay: delay }}>
      {n === 1 && <Ic.Crown className="crown" />}
      <div className="picwrap">
        <div className="pic"><img src={p.img} alt="" /></div>
        <RankCardArt n={n} tone={n === 1 ? 'gold' : n === 2 ? 'silver' : 'bronze'} className="medal" />
      </div>
      <div className="nm">{p.name}{p.detail && <small>{p.detail}</small>}</div>
    </div>
  );
  return (
    <div className={`screen enter-up ${record.fit === 'contain' ? 'fit-contain' : ''}`} style={themeVars(theme)}>
      <div className="ambient"><i className="a1" style={{ background: '#FFB300', opacity: 0.25 }} /><i className="a2" /></div>
      {!fromHistory && <Confetti run colors={['#FFD45C', '#FFB300', theme.primary, '#FFFFFF', '#FF3D7F', '#22D3EE']} />}
      <div className="scroll" style={{ position: 'relative', zIndex: 2 }}>
        <div className="pad top-safe wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="icon-btn ghost" onClick={onHome} aria-label="Close"><Ic.Close size={26} /></button>
          </div>
          <div className="res-head fade-up">
            <div className="kick">{fromHistory ? new Date(record.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long' }) : 'Your top 10'}</div>
            <h1>{displayName(record.title)}</h1>
            <div className="rank-rule">{rankRule(record)}</div><p>{modeLabel(record.mode)} · {fmt(record.timeMs || 0)}</p>
          </div>
          <div className="podium">
            {pod(two, 2, '', '120ms')}
            {pod(one, 1, 'first', '0ms')}
            {pod(three, 3, '', '220ms')}
          </div>
          <div className="list">
            {rest.map((p, i) => (
              <div key={i} className="li" style={{ animationDelay: `${300 + i * 50}ms` }}>
                <span className="n">{i + 4}</span><img src={p.img} alt="" /><span className="t">{p.name}{p.detail && <small>{p.detail}</small>}</span>
              </div>
            ))}
          </div>

          {video && video.status !== 'off' && (
            <div className="video-card fade-up">
              {video.status === 'ready' ? <video src={video.url} autoPlay muted loop playsInline /> : <div className="vc-shim" />}
              <div style={{ minWidth: 0 }}>
                <h3>{video.status === 'ready' ? 'Your clip is ready' : video.status === 'error' ? 'Recording failed' : 'Finishing your clip…'}</h3>
                <p>{video.status === 'ready' ? '9:16 HD — perfect for TikTok, Reels & Shorts.' : video.status === 'error' ? 'This device couldn’t record the round.' : 'Adding the final frame.'}</p>
                {video.status === 'ready' && (
                  <div className="vc-actions">
                    <button className="mini-btn primary" onClick={onShareVideo}><Ic.Share size={18} />Share</button>
                    <button className="mini-btn" onClick={onSaveVideo}><Ic.Download size={18} />{video.saved ? 'Saved' : 'Save'}</button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="res-actions fade-up">
            {onAgain && <button className="cta theme" onClick={onAgain}><Ic.Repeat size={22} />Play again</button>}
            {onChallenge && <button className="cta friend" onClick={onChallenge}>↗ Challenge a mate</button>}
            <div className="duo">
              <button className="btn-outline" onClick={onShareImage}><Ic.Share size={20} />Share image</button>
              <button className="btn-outline" onClick={onShareList}><Ic.List size={20} />Share text</button>
            </div>
            {onReport && <button className="text-btn" onClick={onReport}>Report a wrong picture or pick</button>}
            <button className="btn-outline" onClick={onHome}><Ic.Home size={20} />Home</button>
          </div>
          <div style={{ height: 'calc(var(--sab) + 30px)' }} />
        </div>
      </div>
    </div>
  );
}
