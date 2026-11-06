import React, { useState } from 'react';
import { Sheet } from './ui.jsx';
import { decodeChallenge } from './challenge.js';
import { rankRule } from './rules.js';
import { load, save } from './storage.js';
import { shareText } from './native.js';
export function SavedChallenges({ all, favourites, recent, onPlay }) {
  const [view, setView] = useState('favourites');
  const list = (view === 'favourites' ? favourites : recent).map(id => all.find(l => l.item.id === id)).filter(Boolean);
  return <section className="saved-section"><div className="section-heading"><h2>Your next round</h2><div className="segmented">{['favourites', 'recent'].map(v => <button key={v} className={view === v ? 'on' : ''} onClick={() => setView(v)}>{v === 'recent' ? 'Recent' : 'Favourites'}</button>)}</div></div>{list.length ? <div className="saved-strip">{list.slice(0, 12).map(({item, domain}) => <button key={item.id} onClick={() => onPlay(item, domain)}><span>{item.icon || '🏆'}</span><b>{item.name}</b><small>{rankRule(item)}</small></button>)}</div> : <p className="helper">{view === 'favourites' ? 'Tap Save on a challenge to keep it here.' : 'The challenges you open will appear here.'}</p>}</section>;
}
export function ChallengeImport({ onClose, onPlay }) {
  const [text, setText] = useState(''), [error, setError] = useState('');
  const join = () => { try { onPlay(decodeChallenge(text)); } catch (e) { setError(e.message); } };
  return <Sheet onClose={onClose}><div className="kicker">SAME TEN. DIFFERENT OPINIONS.</div><h2>Challenge a mate</h2><p className="helper">Paste your friend’s code to get the exact same ten picks, in the same order. Their rankings stay hidden.</p><label className="field-label" htmlFor="friend-code">Challenge code</label><textarea id="friend-code" className="code-input" value={text} maxLength={32000} onChange={e => setText(e.target.value)} placeholder="BR1.…" autoCapitalize="off" spellCheck={false} /><p role="alert" className="error-text">{error}</p><button className="cta" disabled={!text.trim()} onClick={join}>Join challenge</button><p className="fine">To create your own, finish a round and tap Challenge a mate.</p></Sheet>;
}
export function ReportPick({ record, onClose }) {
  const [selected, setSelected] = useState('0'), [reason, setReason] = useState('Wrong picture'), [note, setNote] = useState(''), [saved, setSaved] = useState(false), [message, setMessage] = useState('');
  const report = () => ({ categoryId: record.itemId, category: record.title, pick: record.picks[Number(selected)], reason, note, createdAt: new Date().toISOString() });
  const store = () => { const r = report(); save('reports', [r, ...load('reports', [])].slice(0, 100)); setSaved(true); return r; };
  const share = async () => { const r = saved ? report() : store(); const result = await shareText('Blind Rank content report', JSON.stringify(r, null, 2)); setMessage(result === 'copied' ? 'Report copied. Paste it into your feedback message.' : 'Use your chosen app to send the report.'); };
  return <Sheet onClose={onClose}><h2>Report a pick</h2><p className="helper">Save this on your phone or share it with the developer. Nothing is sent automatically.</p><label className="field-label" htmlFor="report-pick">Pick</label><select id="report-pick" value={selected} onChange={e => { setSelected(e.target.value); setSaved(false); }}>{record.picks.map((p, i) => <option key={i} value={i}>{i + 1}. {p.name}{p.detail ? ` · ${p.detail}` : ''}</option>)}</select><label className="field-label" htmlFor="report-reason">What’s wrong?</label><select id="report-reason" value={reason} onChange={e => { setReason(e.target.value); setSaved(false); }}>{['Wrong picture', 'Doesn’t belong in this category', 'Wrong name or details', 'Duplicate pick', 'Other'].map(x => <option key={x}>{x}</option>)}</select><label className="field-label" htmlFor="report-note">Details (optional)</label><textarea id="report-note" className="code-input" maxLength={1000} value={note} onChange={e => { setNote(e.target.value); setSaved(false); }} /><div className="duo"><button className="btn-outline" disabled={saved} onClick={store}>{saved ? 'Saved on phone' : 'Save report'}</button><button className="cta" onClick={share}>Share report</button></div><p role="status" className="helper">{message}</p></Sheet>;
}
