# Browser Compatibility

As a player, I want the game to work in all modern browsers on desktop and mobile, so that I'm not locked into a specific browser or platform.

## Details

- Supported browsers (latest 2 major versions):
  - Chrome (desktop + Android)
  - Firefox (desktop + Android)
  - Safari (desktop + iOS)
  - Edge (desktop)
- Must work on iOS Safari (the only browser engine on iPhone)
- No browser-specific APIs without feature detection and fallback
- IndexedDB for storage (with localStorage fallback)
- CSS features: use only widely supported properties (check caniuse.com)
- ES2022 JavaScript target (supported by all target browsers)
- No WebGL dependency; pure DOM/CSS/Canvas rendering

## Non-Functional Targets

- Zero critical bugs on any supported browser
- Visual consistency across browsers (minor rendering differences acceptable)
- Feature parity across all supported browsers

## Acceptance Criteria

- [ ] Game loads and plays correctly on Chrome, Firefox, Safari, and Edge
- [ ] Mobile browsers (iOS Safari, Chrome Android) are fully functional
- [ ] No unhandled errors in any supported browser's console
- [ ] Touch and keyboard input work on all platforms
