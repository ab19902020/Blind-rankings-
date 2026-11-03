import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { themeFor, randomChallenge, cleanName, displayName, ALL_CHALLENGES } from './catalog.js';
import { createEngine } from './engine.js';
import { initAudio, playSound, setSoundEnabled } from './audio.js';
import { load, save, DEFAULT_SETTINGS } from './storage.js';
import { haptic, saveVideo, shareText, shareVideo, setHapticsEnabled } from './native.js';
import { themeVars, itemTheme, Toast, leafInfo } from './ui.jsx';
import { Onboarding, HomeTab, DiscoverTab, RankingsTab, CategoryScreen, ReadyScreen, SettingsSheet } from './screens.jsx';
import { GameScreen, ResultScreen } from './game.jsx';
import * as Ic from './icons.jsx';

function App() {
  const [settings, setSettings] = useState(() => ({ ...DEFAULT_SETTINGS, mic: true, tracking: true, ...load('settings', {}) }));
  const [onboarded, setOnboarded] = useState(() => load('onboarded', false));
  const [tab, setTab] = useState('home');
  const [stack, setStack] = useState([]); // overlays: category / ready / game / result
  const [sheet, setSheet] = useState(false);
  const [camState, setCamState] = useState('off'); // off | on | denied
  const [faceStatus, setFaceStatus] = useState('searching');
  const [history, setHistory] = useState(() => load('history', []));
  const [video, setVideo] = useState({ status: 'off' });
  const [toast, setToast] = useState(null);

  const videoRef = useRef(null), canvasRef = useRef(null), cardRef = useRef(null);
  const streamRef = useRef(null), engineRef = useRef(null), gameRef = useRef({ phase: 'idle', slots: [], queue: [] });
  const deckRef = useRef(null);
  const toastT = useRef(null);

  const say = msg => { setToast(msg); clearTimeout(toastT.current); toastT.current = setTimeout(() => setToast(null), 2400); };
  const setSetting = (k, v) => setSettings(s => { const n = { ...s, [k]: v }; save('settings', n); return n; });
  useEffect(() => { setSoundEnabled(settings.sound); }, [settings.sound]);
  useEffect(() => { engineRef.current && engineRef.current.setTracking(settings.tracking); }, [settings.tracking]);

  useEffect(() => { setHapticsEnabled(settings.haptics); }, [settings.haptics]);
  const buzz = haptic;

  /* ---------- camera ---------- */
  const requestCamera = useCallback(async () => {
    if (streamRef.current) { setCamState('on'); return true; }
    try {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: { echoCancellation: true, noiseSuppression: true } });
      } catch (e) {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      }
      streamRef.current = stream;
      const v = videoRef.current;
      if (v) { v.srcObject = stream; v.muted = true; try { await v.play(); } catch (e) {} }
      setCamState('on'); save('camWanted', true);
      return true;
    } catch (e) { setCamState('denied'); return false; }
  }, []);
  const stopCamera = () => {
    streamRef.current && streamRef.current.getTracks().forEach(t => t.stop());
    streamRef.current = null; if (videoRef.current) videoRef.current.srcObject = null;
    setCamState('off'); save('camWanted', false);
  };
  useEffect(() => { if (onboarded && load('camWanted', false)) requestCamera(); }, []);

  /* ---------- engine ---------- */
  useEffect(() => {
    engineRef.current = createEngine({
      video: videoRef.current, canvas: canvasRef.current, getCard: () => cardRef.current,
      getState: () => gameRef.current, onFace: s => setFaceStatus(s),
    });
    engineRef.current.setTracking(settings.tracking);
    return () => engineRef.current.destroy();
  }, []);

  /* ---------- navigation ---------- */
  const top = stack[stack.length - 1];
  const push = v => setStack(s => [...s, v]);
  const pop = () => setStack(s => s.slice(0, -1));
  const goHome = () => { setStack([]); setTab('home'); };
  const tap = () => { initAudio(); playSound('tap'); buzz(10); };

  const openDomain = d => { tap(); push({ name: 'category', domain: d }); };
  const openReady = (item, domain) => {
    tap(); deckRef.current = null;
    const info = leafInfo(item);
    setStack(s => [...s.filter(x => x.name === 'category'), { name: 'ready', item, domain: domain || info.domain, group: info.group }]);
  };
  const quick = () => { const r = randomChallenge(); openReady(r.item, r.domain); };

  const startGame = () => {
    if (!deckRef.current) return;
    initAudio(); playSound('pop');
    setVideo({ status: 'off' });
    push({ name: 'game', item: top.item, domain: top.domain, group: top.group, deck: deckRef.current });
  };

  const finishGame = ({ slots, timeMs, recording }) => {
    const g = top;
    const record = {
      id: Date.now().toString(36), title: g.item.name, itemId: g.item.id, domain: g.domain,
      themeKey: g.item.themeOverride || g.domain, date: Date.now(), timeMs,
      picks: slots.map(s => ({ name: cleanName(s.name), img: s.img })),
    };
    setHistory(h => { const n = [record, ...h].slice(0, 60); save('history', n); return n; });
    setStack(s => [...s.slice(0, -1).filter(x => x.name !== 'ready'), { name: 'result', record, item: g.item, domain: g.domain, group: g.group }]);
    if (recording) {
      setVideo({ status: 'compiling' });
      setTimeout(async () => {
        const out = await engineRef.current.stopRecording();
        gameRef.current = { phase: 'idle', slots: [], queue: [] };
        if (out) setVideo({ status: 'ready', ...out, url: URL.createObjectURL(out.blob) });
        else setVideo({ status: 'error' });
      }, 2600);
    } else gameRef.current = { phase: 'idle', slots: [], queue: [] };
  };

  const back = () => {
    if (sheet) { setSheet(false); return true; }
    if (!top) { if (tab !== 'home') { setTab('home'); return true; } return false; }
    if (top.name === 'game') { engineRef.current.cancelRecording(); gameRef.current = { phase: 'idle', slots: [], queue: [] }; }
    pop(); return true;
  };
  useEffect(() => { window.__onAndroidBack = () => back(); });

  const shareList = rec => {
    const text = `🏆 My Blind Rank: ${displayName(rec.title)}\n\n${rec.picks.map((p, i) => `${['🥇', '🥈', '🥉'][i] || `${i + 1}.`} ${p.name}`).join('\n')}\n\nRanked blind in ${(rec.timeMs / 1000).toFixed(1)}s — can you beat my list?`;
    shareText('My Blind Rank', text).then(r => r === 'copied' && say('Ranking copied to clipboard'));
  };
  const onSaveVideo = async () => {
    if (video.status !== 'ready' || video.saved) { if (video.saved) say('Already saved to your gallery'); return; }
    say('Saving…');
    const r = await saveVideo(video.blob, video.ext);
    if (r === 'saved') { setVideo(v => ({ ...v, saved: true })); say('Saved to Movies › Blind Rank'); }
    else if (r === 'downloaded') { setVideo(v => ({ ...v, saved: true })); say('Video downloaded'); }
    else say('Couldn’t save the video');
  };
  const onShareVideo = async () => {
    if (video.status !== 'ready') return;
    const r = await shareVideo(video.blob, video.ext, video.saved);
    if (r === 'shared-saved') setVideo(v => ({ ...v, saved: true }));
    else if (r === 'downloaded') { setVideo(v => ({ ...v, saved: true })); say('Video downloaded — share it from your gallery'); }
    else if (r === false) say('Couldn’t share the video');
  };

  /* ---------- theme for the current view ---------- */
  let theme = themeFor('brand');
  if (top?.name === 'category') theme = themeFor(top.domain);
  else if (top?.item) theme = itemTheme(top.item, top.domain);
  else if (top?.name === 'history') theme = themeFor(top.record.themeKey);

  const inGame = top?.name === 'game';

  return (
    <div className="app" style={themeVars(theme)}>
      {/* camera layer (always mounted so the stream survives navigation) */}
      <div className={`camera-layer ${inGame ? 'show' : ''}`}>
        {camState !== 'on' && <div className="nocam" />}
        <video ref={videoRef} autoPlay playsInline muted />
      </div>
      <canvas ref={canvasRef} style={{ position: 'fixed', left: -99999, top: 0, width: 10, height: 10, opacity: 0, pointerEvents: 'none' }} />

      {/* tabs */}
      {!inGame && (
        <div className="screen" style={{ zIndex: 5, ...themeVars(themeFor('brand')) }}>
          <div className="ambient"><i className="a1" /><i className="a2" /></div>
          <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', minHeight: 0 }} key={tab}>
            {tab === 'home' && <HomeTab camOn={camState === 'on'} onSettings={() => { tap(); setSheet(true); }} onPlay={openReady} onDomain={openDomain} onQuick={quick} />}
            {tab === 'discover' && <DiscoverTab onPlay={openReady} />}
            {tab === 'rankings' && <RankingsTab history={history} onBrowse={() => setTab('discover')} onOpen={rec => { tap(); push({ name: 'history', record: rec }); }} />}
          </div>
          <nav className="tabbar">
            {[['home', 'Home', Ic.Home], ['discover', 'Discover', Ic.Search], ['rankings', 'My Rankings', Ic.List]].map(([id, label, C]) => (
              <button key={id} className={tab === id ? 'on' : ''} onClick={() => { tap(); setTab(id); }}><C size={26} active={tab === id} sw={2} />{label}</button>
            ))}
          </nav>
        </div>
      )}

      {stack.map((v, i) => {
        const isTop = i === stack.length - 1;
        const hidden = !isTop && !(v.name === 'category');
        if (v.name === 'category') return <div key={i} style={{ display: isTop ? 'contents' : 'none' }}><CategoryScreen domain={v.domain} onBack={() => { tap(); pop(); }} onPlay={openReady} /></div>;
        if (hidden) return null;
        if (v.name === 'ready') return (
          <ReadyScreen key={i + v.item.id} item={v.item} domain={v.domain} group={v.group} deckRef={deckRef}
            camOn={camState === 'on'} micOn={settings.mic}
            onToggleCam={() => { tap(); camState === 'on' ? stopCamera() : requestCamera().then(ok => !ok && say('Camera blocked — allow it in phone settings')); }}
            onToggleMic={() => { tap(); setSetting('mic', !settings.mic); }}
            onBack={() => { tap(); pop(); }} onStart={startGame} onOptions={() => { tap(); setSheet(true); }} />
        );
        if (v.name === 'game') return (
          <GameScreen key={i} item={v.item} theme={itemTheme(v.item, v.domain)} deck={v.deck} settings={settings}
            engine={engineRef.current} audioTrack={streamRef.current?.getAudioTracks()[0]} camOn={camState === 'on'}
            faceStatus={faceStatus} gameRef={gameRef} cardRef={cardRef} onExit={pop} onDone={finishGame} />
        );
        if (v.name === 'result') return (
          <ResultScreen key={i} record={v.record} theme={itemTheme(v.item, v.domain)} video={video}
            onHome={() => { tap(); goHome(); }} onAgain={() => openReady(v.item, v.domain)} onShareList={() => shareList(v.record)}
            onSaveVideo={onSaveVideo} onShareVideo={onShareVideo} />
        );
        if (v.name === 'history') {
          const leaf = ALL_CHALLENGES.find(l => l.item.id === v.record.itemId && l.domain === v.record.domain);
          return (
            <ResultScreen key={i} fromHistory record={v.record} theme={themeFor(v.record.themeKey)} video={null}
              onHome={() => { tap(); pop(); }} onAgain={leaf ? () => openReady(leaf.item, leaf.domain) : null} onShareList={() => shareList(v.record)} />
          );
        }
        return null;
      })}

      {sheet && (
        <SettingsSheet settings={settings} setSetting={(k, v) => { tap(); setSetting(k, v); }} camState={camState}
          onEnableCam={() => { tap(); camState === 'on' ? stopCamera() : requestCamera().then(ok => !ok && say('Camera blocked — allow it in phone settings')); }}
          onClose={() => setSheet(false)} onHowTo={() => { setSheet(false); setOnboarded(false); }}
          onClearHistory={() => { setHistory([]); save('history', []); say('Rankings cleared'); }}
          onFullscreen={() => { if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {}); else document.exitFullscreen?.(); }} />
      )}

      {!onboarded && (
        <Onboarding
          onCamera={async () => { initAudio(); playSound('pop'); await requestCamera(); setOnboarded(true); save('onboarded', true); }}
          onSkip={() => { initAudio(); setOnboarded(true); save('onboarded', true); }} />
      )}
      <Toast msg={toast} />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
