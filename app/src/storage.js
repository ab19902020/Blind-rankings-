const PREFIX = 'blindrank.';

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch (e) { return fallback; }
}

export function save(key, value) {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch (e) {}
}

function guessRegion() {
  try {
    const lang = (navigator.language || '').toLowerCase();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (lang.endsWith('-gb') || tz === 'Europe/London' || tz === 'Europe/Belfast') return 'uk';
  } catch (e) {}
  return 'us';
}

export const DEFAULT_SETTINGS = { sound: true, haptics: true, record: true, countdown: true, region: guessRegion() };
