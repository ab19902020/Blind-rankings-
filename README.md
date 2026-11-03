# Blind Rank

Rank 10 hidden picks, one at a time, with no going back — and film your reaction.

## Project layout

- `app/` — the game (React, bundled with esbuild into a single offline bundle)
  - `src/main.jsx` app shell & navigation · `screens.jsx` menus · `game.jsx` gameplay & results
  - `src/engine.js` face tracking + the 1080×1920 video renderer
  - `src/art.jsx` original vector illustrations · `src/data.js` all categories
- `android/` — native Android shell (WebView + camera/mic permissions, save/share video to gallery)
- `.github/workflows/android.yml` — builds the APK + Play Store AAB on every push and publishes a test release

## Building

Every push to `main` or `app-v2` builds automatically on GitHub Actions. Grab the APK from the **Releases** page (or the run's artifacts).

Locally: `cd app && npm install && npm run build:android`, then `cd android && gradle assembleRelease`.

## Before publishing to the Play Store

- Builds are signed with a **shared test key** (`android/app/blindrank-test.jks`) so test installs upgrade cleanly. Create your own private upload key for the store and keep it out of the repo.
- Upload the `.aab` artifact, not the APK. `android/playstore-icon-512.png` is the store icon.
- TMDB attribution is shown in Settings, as their terms require.

The original single-file versions (`Index.html*`) are kept for reference.
