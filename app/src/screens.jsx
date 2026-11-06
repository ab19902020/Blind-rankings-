import { rankRule, modeLabel } from './rules.js';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MENU_DATA, ALL_CHALLENGES, countChallenges, displayName, themeFor, dailyChallenge, DOMAIN_META, safeSecondary, featuredToday, sourceLabel, searchText, catalogInfo, REGIONS, regionPicks, regionLeaves } from './catalog.js';
import { loadDeck, cachedThumb } from './api.js';
import { RankCardArt, PopcornArt, GamepadArt, CreatorArt, DomainArt, HEADER_ART, JerseyArt } from './art.jsx';
import { ChallengeRow, FeatureBanner, Switch, Sheet, themeVars, itemTheme, themeLabel, useThumb, Ambient } from './ui.jsx';
import * as Ic from './icons.jsx';
import { appVersion, isNative } from './native.js';

/* ======================= Onboarding ======================= */
export function Onboarding({ onCamera, onSkip }) {
  const [i, setI] = useState(0);
  const slides = [
    { h: 'Trust your first instinct.', p: 'Ten picks appear one at a time. Lock each one into a rank from 1 to 10.', art: <HeroCards /> },
    { h: 'Make your call.', p: 'Strict mode locks every pick. Casual mode lets you undo your last choice. Future picks stay hidden.', art: <LockArt /> },
    { h: 'Film your reaction.', p: 'Each pick floats above your head while we record a clip ready for TikTok, Reels or Shorts. It never leaves your phone unless you share it.', art: <CreatorArt style={{ width: '64%', maxWidth: 260 }} /> },
  ];
  const last = i === slides.length - 1;
  return (
    <div className="onb" style={themeVars(themeFor('brand'))}>
      <Ambient />
      <div className="top-safe pad" style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Wordmark />
        {!last && <button className="text-btn" onClick={() => setI(slides.length - 1)}>Skip</button>}
      </div>
      <div className="onb-stage" key={i}>
        <div className="fade-up" style={{ width: '100%', display: 'grid', placeItems: 'center' }}>{slides[i].art}</div>
      </div>
      <div className="onb-text fade-up" key={'t' + i}>
        <h1>{slides[i].h}</h1>
        <p>{slides[i].p}</p>
      </div>
      <div className="dots">{slides.map((_, k) => <i key={k} className={k === i ? 'on' : ''} />)}</div>
      <div className="onb-actions">
        {last ? (
          <>
            <button className="cta" onClick={onCamera}><Ic.Camera size={24} solid /> Enable camera</button>
            <button className="text-btn" onClick={onSkip}>Play without camera</button>
          </>
        ) : (
          <button className="cta" onClick={() => setI(i + 1)}>Next <Ic.Chevron size={24} sw={3} /></button>
        )}
      </div>
    </div>
  );
}

function HeroCards({ small }) {
  return (
    <div className="hero-art" style={small ? undefined : { width: 'min(84vw, 340px)', height: 'min(70vw, 290px)', margin: 0 }}>
      <div className="glow" />
      <RankCardArt n={1} tone="gold" className="c1" />
      <RankCardArt n={2} tone="silver" className="c2" />
      <RankCardArt n={3} tone="bronze" className="c3" />
      <PopcornArt className="pop" />
      <GamepadArt className="pad-art" accent="#FFB300" />
    </div>
  );
}

function LockArt() {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', transform: 'rotate(-4deg)' }}>
      {[1, 2, 3].map(n => <RankCardArt key={n} n={n} tone={n === 1 ? 'gold' : 'glass'} style={{ width: 'min(24vw, 100px)' }} />)}
      <div style={{ width: 'min(24vw, 100px)', aspectRatio: '120/170', borderRadius: 16, border: '2px dashed rgba(255,255,255,0.35)', display: 'grid', placeItems: 'center', color: 'var(--gold-2)' }}>
        <Ic.Lock size={40} />
      </div>
    </div>
  );
}

export function Wordmark() {
  return <div className="wordmark"><b>Blind Rank</b><span>PRO ULTRA</span></div>;
}

/* ======================= Home ======================= */
export function HomeTab({ camOn, onSettings, onPlay, onDomain, onQuick, region, onRegion, onRegionHub, saved, onJoin }) {
  const daily = useMemo(() => dailyChallenge(new Date(), region), [region]);
  const featured = useMemo(() => featuredToday(8, new Date(), region).filter(l => l.item !== daily.item), [region]);
  const local = useMemo(() => regionPicks(region, 10), [region]);
  const R = REGIONS[region] || REGIONS.us;
  const [dref, durl] = useThumb(daily.item);
  return (
    <div className="scroll">
      <div className="pad top-safe wrap" style={{ position: 'relative' }}>
        <div className="topbar fade-up">
          <Wordmark />
          <button className={`cam-btn ${camOn ? '' : 'off'}`} onClick={onSettings} aria-label="Camera & settings">
            <Ic.Camera size={20} solid /><span className="dot" />
          </button>
        </div>

        <div className="hero">
          <div className="fade-up" style={{ animationDelay: '60ms', position: 'relative', zIndex: 5 }}>
            <div className="kicker">YOUR PICKS. YOUR CALL.</div><h1>Where do<br />you rank them?</h1>
            <p>Ten surprises. One unforgettable top 10.</p>
          </div>
          <div className="fade-up" style={{ animationDelay: '120ms' }}><HeroCards small /></div>
        </div>

        <div className="fade-up" style={{ animationDelay: '180ms', padding: '6px 18px 0' }}>
          <button className="cta" onClick={onQuick}><Ic.Play size={22} /> Let’s rank</button>
        </div>

        <button className="friend-banner" onClick={onJoin}><span className="friend-icon">↗</span><span><b>Challenge a mate</b><small>Same ten picks. Settle the debate.</small></span><Ic.Chevron size={24} /></button>
        {saved}
        <div className="section-label">Featured today</div>
        <div className="carousel">
          {featured.map((l, i) => <FeatureCard key={l.item.id} leaf={l} delay={i * 50} onClick={() => onPlay(l.item, l.domain)} />)}
        </div>

        {local.length > 0 && <>
          <div className="region-head">
            <button className="region-title" onClick={onRegionHub}>{R.flag} Made for {R.long} <Ic.Chevron size={16} sw={3} /></button>
            <div className="region-toggle" role="group" aria-label="Region">
              {Object.entries(REGIONS).map(([k, r]) => <button key={k} className={k === region ? 'on' : ''} onClick={() => onRegion(k)} aria-pressed={k === region}>{r.flag} {r.name}</button>)}
            </div>
          </div>
          <div className="carousel">
            {local.map((l, i) => <FeatureCard key={region + l.item.id} leaf={l} delay={i * 40} onClick={() => onPlay(l.item, l.domain)} />)}
          </div>
        </>}

        <div className="section-label">Pick your world</div>
        <div className="tiles">
          {MENU_DATA.domain.map((d, i) => {
            const t = themeFor(d.id);
            return (
              <button key={d.id} className="tile fade-up" style={{ '--tp': t.primary, '--ts': safeSecondary(t), animationDelay: `${200 + i * 40}ms` }} onClick={() => onDomain(d.id)}>
                <span className="t-name">{displayName(d.name)}</span>
                <span className="t-count">{countChallenges(d.id)} challenges</span>
                <DomainArt domain={d.id} className="t-art" />
              </button>
            );
          })}
        </div>

        <div className="section-label">Today’s challenge</div>
        <button ref={dref} className="daily fade-up" onClick={() => onPlay(daily.item, daily.domain)}>
          <div className="d-thumb">{durl ? <img src={durl} alt="" /> : <div style={{ display: 'grid', placeItems: 'center', height: '100%', fontSize: 30 }}>{daily.item.icon}</div>}</div>
          <div style={{ minWidth: 0 }}>
            <div className="kicker">Daily · {themeLabel(daily.domain)}</div>
            <div className="d-title">{displayName(daily.item.name)}</div>
            <div className="d-sub">A fresh category every day</div>
          </div>
          <span className="go"><Ic.Play size={18} /></span>
        </button>
        <div className="tab-space" />
      </div>
    </div>
  );
}

function FeatureCard({ leaf, onClick, delay }) {
  const [ref, url] = useThumb(leaf.item);
  const t = themeFor(leaf.item.themeOverride || leaf.domain);
  return (
    <button ref={ref} className="fcard fade-up" style={{ ...themeVars(t), animationDelay: `${delay}ms` }} onClick={onClick}>
      <div className="fc-bg">{url ? <img src={url} alt="" /> : <DomainArt domain={leaf.domain} item={leaf.item} theme={t} className="fc-art" />}</div>
      <div className="fc-shade" />
      <span className="fc-world"><Ic.DomainLine name={MENU_DATA.domain.find(d => d.id === leaf.domain)?.icon} size={13} sw={2.6} />{themeLabel(leaf.domain)}</span>
      <div className="fc-text"><b>{displayName(leaf.item.name)}</b><span>{sourceLabel(leaf.item)}</span></div>
      <span className="fc-play"><Ic.Play size={16} /></span>
    </button>
  );
}

/* ======================= Discover ======================= */
export function DiscoverTab({ onPlay, initialFilter = 'all' }) {
  const [q, setQ] = useState('');
  const [dom, setDom] = useState(initialFilter);
  useEffect(() => setDom(initialFilter), [initialFilter]);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    let l = ALL_CHALLENGES;
    if (REGIONS[dom]) l = regionLeaves(dom);
    else if (dom !== 'all') l = l.filter(x => x.domain === dom);
    if (s) l = l.filter(x => (searchText(x.item) + ' ' + (x.group?.name || '') + ' ' + themeLabel(x.domain)).toLowerCase().includes(s));
    return l;
  }, [q, dom]);
  return (
    <div className="scroll">
      <div className="pad top-safe wrap">
        <h1 className="page-title fade-up">Discover</h1>
        <p className="page-sub fade-up">{ALL_CHALLENGES.length} blind ranking challenges</p>
        <div className="search fade-up">
          <Ic.Search size={22} />
          <input placeholder="Search players, films, anything…" value={q} onChange={e => setQ(e.target.value)} />
          {q && <button className="clear" onClick={() => setQ('')}><Ic.Close size={14} sw={3} /></button>}
        </div>
        <div className="chips">
          <button className={`chip ${dom === 'all' ? 'on' : ''}`} onClick={() => setDom('all')}>All</button>
          {Object.entries(REGIONS).map(([k, r]) => <button key={k} className={`chip ${dom === k ? 'on' : ''}`} onClick={() => setDom(k)}>{r.flag} {r.name}</button>)}
          {MENU_DATA.domain.map(d => (
            <button key={d.id} className={`chip ${dom === d.id ? 'on' : ''}`} style={dom === d.id ? themeVars(themeFor(d.id)) : undefined} onClick={() => setDom(d.id)}>{themeLabel(d.id)}</button>
          ))}
        </div>
        <div className="rows" style={{ marginTop: 18 }}>
          {list.length === 0 && <div className="empty"><b>Nothing found</b>Try a player, a film or a category name.</div>}
          {list.slice(0, 120).map((l, i) => (
            <ChallengeRow key={l.domain + l.item.id + i} item={l.item} group={l.group} domain={l.domain} showDomain onClick={() => onPlay(l.item, l.domain)} style={{ animationDelay: `${Math.min(i, 10) * 30}ms` }} />
          ))}
        </div>
        <div className="tab-space" />
      </div>
    </div>
  );
}

/* ======================= My Rankings ======================= */
export function RankingsTab({ history, onOpen, onBrowse }) {
  const played = history.length;
  const fastest = played ? Math.min(...history.map(h => h.timeMs || Infinity)) : null;
  const fav = useMemo(() => {
    const c = {}; history.forEach(h => { c[h.domain] = (c[h.domain] || 0) + 1; });
    const top = Object.entries(c).sort((a, b) => b[1] - a[1])[0]; return top ? themeLabel(top[0]) : '—';
  }, [history]);
  return (
    <div className="scroll">
      <div className="pad top-safe wrap">
        <h1 className="page-title fade-up">My Rankings</h1>
        <p className="page-sub fade-up">Every top 10 you’ve locked in.</p>
        <div className="stats fade-up">
          <div className="stat"><b>{played}</b><span>Ranked</span></div>
          <div className="stat"><b>{fastest && isFinite(fastest) ? (fastest / 1000).toFixed(1) + 's' : '—'}</b><span>Fastest</span></div>
          <div className="stat"><b style={{ fontSize: fav.length > 6 ? 20 : 26 }}>{fav}</b><span>Top world</span></div>
        </div>
        <div className="section-label left" style={{ letterSpacing: '0.24em' }}>History</div>
        {played === 0 ? (
          <div className="empty fade-up">
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 18 }}>
              <RankCardArt n={1} tone="gold" style={{ width: 60, transform: 'rotate(-8deg)' }} />
              <RankCardArt n={2} tone="glass" style={{ width: 60 }} />
              <RankCardArt n={3} tone="glass" style={{ width: 60, transform: 'rotate(8deg)' }} />
            </div>
            <b>No rankings yet</b>
            Your finished top 10s will live here.
            <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center' }}><button className="btn-outline" onClick={onBrowse}>Find a challenge</button></div>
          </div>
        ) : (
          <div className="hist">
            {history.map((h, i) => (
              <button key={h.id} className="hcard fade-up" style={{ ...themeVars(themeFor(h.themeKey)), animationDelay: `${Math.min(i, 8) * 30}ms` }} onClick={() => onOpen(h)}>
                <div className="stack">{h.picks.slice(0, 3).map((p, k) => <img key={k} src={p.img} alt="" />)}</div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="ht">{displayName(h.title)}</div>
                  <div className="hs">#1 {h.picks[0]?.name} · {new Date(h.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</div>
                </div>
                <Ic.Chevron size={20} />
              </button>
            ))}
          </div>
        )}
        <div className="tab-space" />
      </div>
    </div>
  );
}

/* ======================= Category ======================= */
export function CategoryScreen({ domain, onBack, onPlay }) {
  const t = themeFor(domain);
  const dom = MENU_DATA.domain.find(d => d.id === domain);
  const leaves = ALL_CHALLENGES.filter(l => l.domain === domain);
  const groups = MENU_DATA[domain].filter(i => i.type === 'nav');
  const hasDirect = leaves.some(l => !l.group);
  const [chip, setChip] = useState('all');
  const [q, setQ] = useState('');
  const Art = HEADER_ART[domain];
  const filtered = useMemo(() => {
    let l = leaves;
    if (chip === 'top') l = l.filter(x => !x.group);
    else if (chip !== 'all') l = l.filter(x => x.group && x.group.id === chip);
    const s = q.trim().toLowerCase();
    if (s) l = l.filter(x => (searchText(x.item) + ' ' + (x.group?.name || '')).toLowerCase().includes(s));
    return l;
  }, [chip, q, domain]);
  const [feat, ...rest] = filtered;
  return (
    <div className="screen enter" style={themeVars(t)}>
      <Ambient />
      <div className="scroll" style={{ position: 'relative', zIndex: 1 }}>
        <div className="pad top-safe wrap">
          <div className={`cat-head ${domain === 'sports' ? 'sports-broadcast' : ''}`}>
            <button className="icon-btn ghost back" onClick={onBack} aria-label="Back"><Ic.Back size={28} /></button>
            {Art && <div className="cat-art fade-up"><Art /></div>}
            <div className="cat-title fade-up">
              {domain === 'movies' ? <ClapperIcon /> : <Ic.DomainLine name={dom.icon} className="ic" size={40} sw={2.4} />}
              <h1>{domain === 'sports' ? 'The sporting debate' : displayName(dom.name)}</h1>
            </div>
            {domain === 'sports' && <p className="helper sports-subtitle">Legends. Flops. Hard men. Your verdict.</p>}
          </div>
          <div className="search fade-up">
            <Ic.Search size={22} />
            <input placeholder="Find a challenge" value={q} onChange={e => setQ(e.target.value)} />
            {q && <button className="clear" onClick={() => setQ('')}><Ic.Close size={14} sw={3} /></button>}
          </div>
          <div className="chips fade-up">
            <button className={`chip ${chip === 'all' ? 'on' : ''}`} onClick={() => setChip('all')}>All</button>
            {hasDirect && groups.length > 0 && <button className={`chip ${chip === 'top' ? 'on' : ''}`} onClick={() => setChip('top')}>Popular</button>}
            {groups.map(g => <button key={g.id} className={`chip ${chip === g.id ? 'on' : ''}`} onClick={() => setChip(g.id)}>{displayName(g.name)}</button>)}
          </div>
          {!feat && <div className="empty"><b>No matches</b>Try another search.</div>}
          {feat && <FeatureBanner key={feat.item.id + chip} item={feat.item} domain={domain} kicker={feat.group ? displayName(feat.group.name) : 'Popular'} onClick={() => onPlay(feat.item, domain)} />}
          {rest.length > 0 && <div className="section-label">Choose your challenge</div>}
          <div className="rows">
            {rest.map((l, i) => <ChallengeRow key={l.item.id + (l.item.endpoint || '') + i} item={l.item} group={l.group} domain={domain} onClick={() => onPlay(l.item, domain)} style={{ animationDelay: `${Math.min(i, 10) * 35}ms` }} />)}
          </div>
          <div style={{ height: 'calc(var(--sab) + 30px)' }} />
        </div>
      </div>
    </div>
  );
}

function ClapperIcon() {
  return (
    <svg viewBox="0 0 48 48" width="42" height="42" aria-hidden="true" style={{ filter: 'drop-shadow(0 0 12px rgba(255,179,0,0.6))' }}>
      <path d="M6 20h36v20a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z" fill="#FFB300" />
      <path d="M5 12.5 39.5 5l1.7 7.4L6.7 20z" fill="#FFB300" />
      <path d="M11.5 11 15.5 17.8M20 9.2 24 16M28.5 7.4 32.5 14.2" stroke="#111" strokeWidth="3.2" />
      <path d="M6 20h36v5H6z" fill="#111" opacity="0.35" />
    </svg>
  );
}

/* ======================= Ready ======================= */
const GENERIC_TAGS = ['Rank them blind. No take-backs.', 'Ten picks. One shot each.', 'You won’t know who’s next.', 'Trust your gut. Lock it in.'];
const TAGLINES = {
  sports: 'Rank the legends. Before you know who’s next.', movies: 'Rank them blind. Before you know what’s next.', tv: 'Ten shows. One shot each.',
  anime: 'Ten icons. Zero second chances.', actors: 'Ten stars. Rank them blind.', creators: 'Ten creators. Rank them blind.',
  music: 'Ten artists. No skipping.', games: 'Ten legends. No respawns.', nature: 'Ten creatures. Rank them blind.', food: 'Ten bites. Rank them blind.',
  history: 'Ten icons of history. One shot each.', myths: 'Ten legends. Rank them blind.',
};

export function ReadyScreen({ item, domain, group, camOn, camState, camError, stream, faceStatus, micOn, onToggleCam, onRetryCam, onToggleMic, onBack, onStart, onOptions, deckRef, mode, onMode, favourite, onFavourite }) {
  const t = itemTheme(item, domain);
  const [deck, setDeck] = useState({ status: 'loading', n: 0 });
  const [attempt, setAttempt] = useState(0);
  const [tagline] = useState(() => (Math.random() < 0.5 && TAGLINES[domain]) || GENERIC_TAGS[Math.floor(Math.random() * GENERIC_TAGS.length)]);
  useEffect(() => {
    let alive = true;
    deckRef.current = null;
    setDeck({ status: 'loading', n: 0 });
    loadDeck(item, n => alive && setDeck(d => ({ ...d, n })))
      .then(cards => { if (!alive) return; deckRef.current = cards; setDeck({ status: 'ready', n: 10 }); })
      .catch(e => alive && setDeck({ status: 'error', msg: e.message || 'Couldn’t load this challenge.' }));
    return () => { alive = false; };
  }, [item, attempt]);
  const domName = MENU_DATA.domain.find(d => d.id === domain);
  const crumb = [themeLabel(domain), group ? displayName(group.name) : null].filter(Boolean).join(' / ');
  const cards = [[1, 'gold', '11%', '44%', -10], [2, 'glass', '22%', '51%', -6], [3, 'glass', '31%', '58%', -3], [8, 'glass', '69%', '58%', 3], [9, 'glass', '78%', '51%', 6], [10, 'glass', '89%', '44%', 10]];
  return (
    <div className="screen enter-up" style={themeVars(t)}>
      <div className="scroll">
        <div className="pad top-safe wrap">
          <div style={{ position: 'relative', zIndex: 7, height: 44 }}>
            <button className="icon-btn ghost" onClick={onBack} aria-label="Back"><Ic.Back size={28} /></button>
          </div>
          <div className="ready-stage" style={{ marginTop: -44 }}>
            <div className="lights" /><div className="beams" />
            <div className="crumb"><Ic.DomainLine name={domName?.icon} size={18} />{crumb}</div>
            {cards.map(([n, tone, x, y, r]) => (
              <RankCardArt key={n} n={n} tone={tone} className="rc" style={{ left: x, top: y, transform: `translateX(-50%) rotate(${r}deg)`, opacity: n === 1 ? 1 : 0.85, filter: n === 1 ? 'drop-shadow(0 0 16px rgba(255,179,0,0.6))' : undefined }} />
            ))}
            <DomainArt domain={domain} item={item} theme={t} className="hero-obj" />
            <div className="floor" />
          </div>
          <div className="ready-title fade-up">
            <h1>{displayName(item.name)}</h1>
            <p>{item.subtitle || tagline}</p>
            <div className="rank-rule">{rankRule(item)}</div>
            {item.type !== 'challenge' && <button className={`save-challenge ${favourite ? 'saved' : ''}`} aria-pressed={favourite} onClick={onFavourite}>{favourite ? '♥ Saved' : '♡ Save challenge'}</button>}
            <div className="mode-picker" role="group" aria-label="Game mode">
              {['strict', 'casual'].map(m => <button key={m} disabled={!!item.mode} className={mode === m ? 'on' : ''} onClick={() => onMode(m)}><b>{m === 'strict' ? 'Strict' : 'Casual'}</b><small>{m === 'strict' ? 'Every placement is final' : 'Undo your last placement'}</small></button>)}
            </div>
            {item.mode && <p className="helper">Your friend chose {item.mode} mode for this challenge.</p>}
          </div>
          <div className="rules fade-up" style={{ animationDelay: '80ms' }}>
            <div><Ic.Eye size={24} />Reveal a pick</div>
            <div><Ic.ListNum size={24} />Choose a rank from 1–10</div>
            <div><Ic.Lock size={24} />Keep going — future picks stay hidden</div>
          </div>
          <CameraCheck camState={camState} camError={camError} stream={stream} onToggle={onToggleCam} onRetry={onRetryCam} />
          <div className="toggles fade-up" style={{ animationDelay: '120ms' }}>
            {camOn && <button className={`pill-toggle ${micOn ? 'on' : 'off'}`} onClick={onToggleMic}><Ic.Mic size={20} solid={micOn} />Record my voice: {micOn ? 'On' : 'Off'}</button>}
          </div>
          <div style={{ marginTop: 20 }} className="fade-up">
            <button className="cta theme" disabled={deck.status !== 'ready'} onClick={() => deck.status === 'ready' && onStart()}>
              {deck.status === 'loading' ? <><Ic.Spinner size={24} sw={3} /> Shuffling picks…</> : <><Ic.Play size={22} /> Start challenge</>}
            </button>
          </div>
          <div className="deck-status">
            {deck.status === 'loading' && <><span>Loading picks</span><span className="deck-bar"><i style={{ width: `${deck.n * 10}%` }} /></span><span>{deck.n}/10</span></>}
            {deck.status === 'ready' && <span style={{ color: 'var(--green)' }}>● 10 picks ready — all hidden</span>}
          </div>
          {deck.status === 'error' && (
            <div className="error-box"><Ic.Alert size={20} /><div style={{ flex: 1 }}>{deck.msg}<div style={{ marginTop: 10 }}><button className="mini-btn" onClick={() => setAttempt(a => a + 1)}><Ic.Repeat size={16} />Try again</button></div></div></div>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
            <button className="btn-outline" onClick={onOptions}><Ic.Gear size={20} />Camera options</button>
          </div>
          <div style={{ height: 'calc(var(--sab) + 26px)' }} />
        </div>
      </div>
    </div>
  );
}

/* Live camera preview so players can see it's working before they start. */
function CameraCheck({ camState, camError, stream, onToggle, onRetry }) {
  const vref = useRef(null);
  useEffect(() => {
    const v = vref.current; if (!v) return;
    if (stream && v.srcObject !== stream) { v.srcObject = stream; v.muted = true; v.play().catch(() => {}); }
    if (!stream) v.srcObject = null;
  }, [stream, camState]);
  const on = camState === 'on';
  const msg = {
    denied: ['Camera is blocked', 'Allow camera access for Blind Rank in your phone’s Settings › Apps › Blind Rank › Permissions, then tap Try again.'],
    nocamera: ['No front camera found', 'You can still play — the picks will float in the middle of the screen.'],
    busy: ['Camera is busy', 'Another app is using the camera. Close it, then tap Try again.'],
    error: ['Camera couldn’t start', 'Tap Try again. If it keeps failing, restart the app.'],
  }[camError] || null;
  return (
    <div className={`camcheck fade-up ${on ? 'ok' : camState === 'denied' ? 'bad' : ''}`}>
      <div className="cc-view">
        <video ref={vref} autoPlay playsInline muted style={{ opacity: on ? 1 : 0 }} />
        {!on && <div className="cc-off">{camState === 'starting' ? <Ic.Spinner size={26} /> : <Ic.Camera size={28} />}</div>}
        {on && <span className="cc-live">LIVE</span>}
      </div>
      <div className="cc-body">
        {on && <><b>Camera ready</b><span>You’re in shot — this is what gets recorded.</span></>}
        {camState === 'starting' && <><b>Starting camera…</b><span>Allow access if your phone asks.</span></>}
        {camState === 'off' && <><b>Camera is off</b><span>Turn it on to film your reaction with each pick above your head.</span>
          <div className="cc-actions"><button className="mini-btn primary" onClick={onToggle}><Ic.Camera size={16} solid />Turn on</button></div></>}
        {camState === 'denied' && msg && <><b>{msg[0]}</b><span>{msg[1]}</span>
          <div className="cc-actions">
            <button className="mini-btn primary" onClick={onRetry}><Ic.Repeat size={16} />Try again</button>
            {camError === 'denied' && isNative() && window.BlindRankNative.openAppSettings && <button className="mini-btn" onClick={() => window.BlindRankNative.openAppSettings()}><Ic.Gear size={16} />Settings</button>}
          </div></>}
      </div>
    </div>
  );
}

/* ======================= Settings ======================= */
export function SettingsSheet({ settings, setSetting, camState, camWanted, onEnableCam, onClose, onHowTo, onClearHistory, onFullscreen }) {
  const row = (key, icon, title, sub) => (
    <button className="opt" onClick={() => setSetting(key, !settings[key])}>{icon}<span className="ot">{title}{sub && <span className="os">{sub}</span>}</span><Switch on={settings[key]} /></button>
  );
  return (
    <Sheet onClose={onClose}>
      <h2>Settings</h2>
      <h4>Camera</h4>
      <div className="group">
        <button className="opt" onClick={onEnableCam}>
          <Ic.Camera size={22} solid />
          <span className="ot">Use camera
            <span className="os">{camState === 'denied' ? 'Blocked — allow camera access for Blind Rank in phone settings.' : 'Films your reaction. Only switches on during a challenge.'}</span></span>
          <Switch on={!!camWanted} />
        </button>
        {row('mic', <Ic.Mic size={22} />, 'Record microphone', 'Capture your commentary in the video')}
        {row('record', <Ic.Download size={22} />, 'Record video', 'Make a 9:16 clip of every round')}
        {row('tracking', <Ic.Eye size={22} />, 'Face tracking', 'Pick floats above your head')}
      </div>
      <h4>Gameplay</h4>
      <div className="mode-picker">{['strict', 'casual'].map(m => <button key={m} className={settings.mode === m ? 'on' : ''} onClick={() => setSetting('mode', m)}>{modeLabel(m)}</button>)}</div>
      <div className="group">
        <button className="opt" onClick={() => setSetting('region', settings.region === 'uk' ? 'us' : 'uk')}>
          <Ic.Globe size={22} />
          <span className="ot">Region<span className="os">Picks local categories for your home screen</span></span>
          <span className="region-pill">{(REGIONS[settings.region] || REGIONS.us).flag} {(REGIONS[settings.region] || REGIONS.us).name}</span>
        </button>
        {row('countdown', <Ic.Timer size={22} />, '3-2-1 countdown')}
        {row('sound', <Ic.Volume size={22} />, 'Sound effects')}
        {row('haptics', <Ic.Vibrate size={22} />, 'Haptics')}
      </div>
      <h4>More</h4>
      <div className="group">
        <button className="opt" onClick={onHowTo}><Ic.Info size={22} /><span className="ot">How to play</span><Ic.Chevron size={20} /></button>
        {!isNative() && <button className="opt" onClick={onFullscreen}><Ic.Expand size={22} /><span className="ot">Toggle fullscreen</span><Ic.Chevron size={20} /></button>}
        <button className="opt" onClick={onClearHistory}><Ic.Trash size={22} /><span className="ot">Clear my rankings</span></button>
      </div>
      <p className="fine">
        Blind Rank {appVersion()} · catalog {catalogInfo.generatedAt ? new Date(catalogInfo.generatedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : 'built-in'}. Your videos are made and stored on your device — nothing is uploaded unless you share it.<br />
        This product uses the TMDB API but is not endorsed or certified by TMDB. Movie and TV data and images © TMDB. Other images via Wikipedia / Wikimedia Commons under their respective licences.
      </p>
    </Sheet>
  );
}
