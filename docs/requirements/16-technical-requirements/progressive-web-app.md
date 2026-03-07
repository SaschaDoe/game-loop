# Progressive Web App

As a player, I want the game to be installable as a PWA, so that I can play it like a native app on my phone or desktop with offline support.

## Details

- Service worker caches all static assets for offline play
- Web app manifest with game name, icons, theme color, and display mode (fullscreen)
- "Add to Home Screen" prompt on mobile browsers
- Offline mode: full game playable without internet (LLM features disabled, fallback dialogue used)
- Background sync: when back online, sync cloud saves if configured
- App icons in multiple sizes (generated from ASCII art logo)
- Splash screen while loading

## Technical Constraints

- Service worker must not cache API responses (only static assets)
- Manifest must pass Lighthouse PWA audit
- Update strategy: stale-while-revalidate for assets, network-first for API calls

## Acceptance Criteria

- [ ] Game is installable as a PWA on mobile and desktop
- [ ] Offline play works for all non-LLM features
- [ ] Lighthouse PWA score is 90+
- [ ] Service worker caches assets correctly
