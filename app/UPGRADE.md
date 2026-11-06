# Blind Rank 2.1

84 new editorial challenges bring the source catalogue to 397 categories. Sports now includes football transfer debates, separate hard-men and physical-strength lists, ability, personalities, managers and culture; five club packs each have signings, fan favourites, captains and academy products. Boxing, UFC, F1, WWE and NBA gain themed debates. TV, movies, music, gaming and food gain additional packs.

Category membership is editorial. The automatic occupation-based expansion is disabled. Transfer cards carry club/year context; number-one criteria appear before play, during play, on results, shared text/images and recordings. Character challenges no longer substitute actor headshots. Some character, kit, rivalry and food packs deliberately use labelled name cards until correct item-specific art is available. They do not pretend to have verified photographs.

Strict is the default and disallows undo. Casual allows one-step undo. Rapid taps cannot double-place a pick. Favourites and the latest 20 opened challenges persist locally. Results can export a BR1 friend code containing exactly the original ten picks and order, including context and mode; importing it does not depend on catalogue updates. Imported image URLs are limited to supported image hosts; arbitrary code and navigation are rejected. Codes are portable, not encrypted or competitive anti-cheat.

Wrong-pick reports are saved on-device and can be shared explicitly using the OS share sheet. No report is sent to a server automatically. Images have bounded loads; failed images produce name cards, never unrelated replacement candidates. Live chart categories still need a working source API.

## Build and test

Requires Node 22+ for the development tests. `npm ci`, `npm test`, `npm run build`, and `npx playwright install --with-deps chromium && npx playwright test`. The web build prepares a complete compatible v5 catalogue automatically. Android builds use the same preparation step and tests. `node build-catalog.mjs public/catalog.json` performs a full online image refresh; copy a verified result to `catalog-seed.json` to refresh the bundled seed.

Compatibility uses both schema version and content revision. v3/v4 catalogues and missing-category snapshots are rejected. On nightly publication, the remote catalogue must come from this source revision. The `catalog` branch is not overwritten by feature-branch builds.

The Game quality workflow checks mobile UI and stores screenshots/traces in `mobile-test-evidence`. Android feature builds provide APK/AAB artifacts without publishing a release. Test signing is unchanged; do not use the shared test keystore as a private Play upload key.

## Content checks

Debate categories intentionally let the player decide reputation, ability or value. Academy packs judge a player's entire senior career after development at that club, including careers elsewhere. Premier League club entries are explicitly all eras. Current/season-specific lists are not inferred from nationality or age alone.

Useful historical primary sources checked during the review:
- https://www.uefa.com/uefaeuropaleague/news/01dc-0e72b6ecb303-7446081f0247-1000--distin-deal-done-and-dusted-for-everton/ (Distin was a fee transfer and is excluded from the free-transfer pack)
- https://www.manutd.com/en/academy/academy-history
- https://www.manutd.com/en/academy/life-after-the-academy
- https://www.mancity.com/news/club-news/club-news/2019/city-dna/city-dna-32-roy-paul
- https://www.mancity.com/mancitylegends/power-paul
- https://www.chelseafc.com/en/colin-pates

## Validation limits

Automated offline checks exercise every static category and complete Strict/Casual rounds. Browser integration tests cover navigation, saving favourites, reports, friend-code replay, and small-phone layout. Physical Android camera orientation, microphone capture, native gallery export and face tracking still need an on-device check; they are not covered by a DOM test.
