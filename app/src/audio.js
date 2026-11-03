// Synthesised UI sounds — no audio files needed.
let ctx = null;
let enabled = true;

export function setSoundEnabled(v) { enabled = v; }

export function initAudio() {
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
  } catch (e) {}
}

function tone({ type = 'sine', from, to, dur, gain = 0.3, attack = 0.005, delay = 0 }) {
  const now = ctx.currentTime + delay;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(from, now);
  if (to) o.frequency.exponentialRampToValueAtTime(to, now + dur);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(gain, now + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  o.connect(g); g.connect(ctx.destination);
  o.start(now); o.stop(now + dur + 0.05);
}

export function playSound(type) {
  if (!enabled || !ctx || ctx.state !== 'running') return;
  try {
    switch (type) {
      case 'tap': tone({ from: 880, to: 620, dur: 0.06, gain: 0.12 }); break;
      case 'pop': tone({ from: 620, to: 320, dur: 0.08, gain: 0.35 }); break;
      case 'thud':
        tone({ from: 140, to: 40, dur: 0.18, gain: 0.9 });
        tone({ type: 'triangle', from: 1400, to: 900, dur: 0.05, gain: 0.08 });
        break;
      case 'swoosh': tone({ type: 'triangle', from: 320, to: 60, dur: 0.28, gain: 0.18, attack: 0.05 }); break;
      case 'tick': tone({ type: 'square', from: 1200, dur: 0.04, gain: 0.05 }); break;
      case 'count': tone({ type: 'triangle', from: 660, dur: 0.18, gain: 0.25 }); break;
      case 'go':
        tone({ type: 'triangle', from: 990, dur: 0.35, gain: 0.25 });
        tone({ type: 'sine', from: 1320, dur: 0.35, gain: 0.12, delay: 0.02 });
        break;
      case 'undo': tone({ type: 'sine', from: 300, to: 600, dur: 0.12, gain: 0.2 }); break;
      case 'cheer':
        [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) =>
          tone({ type: 'triangle', from: f, dur: 0.9, gain: 0.16, attack: 0.03, delay: i * 0.07 }));
        break;
      default: break;
    }
  } catch (e) {}
}
