# Performance Targets

As a player, I want the game to load fast and run smoothly without lag on any device, so that the experience is never interrupted by technical issues.

## Details

- **Initial load**: Time to Interactive (TTI) under 2 seconds on 4G connection
- **Bundle size**: Total JavaScript under 200 KB gzipped; total assets under 500 KB
- **Frame rate**: UI updates complete within 16ms (60fps target) for all game actions
- **Input latency**: Key press to screen update under 50ms
- **Map rendering**: Full 50x24 map with 100+ entities renders in under 10ms
- **LLM response**: Streaming begins within 2 seconds of sending (network-dependent)
- **Save/load**: Complete state serialization/deserialization under 100ms
- **Memory**: Heap usage stays under 50 MB during normal gameplay
- **No jank**: No frame drops during movement, combat, or map transitions

## Optimization Strategies

- Lazy load non-critical features (settings, lore viewer, full map)
- Avoid DOM thrashing: batch state updates, use Svelte's built-in batching
- Use `requestAnimationFrame` for any animation loops
- Minimize re-renders: fine-grained reactivity, derived state memoization
- No heavy computation on the main thread; use Web Workers for map generation if needed
- Efficient ASCII rendering: avoid per-character DOM elements where possible (canvas or pre-rendered blocks)

## Acceptance Criteria

- [ ] Lighthouse Performance score >= 95
- [ ] TTI under 2 seconds on simulated 4G
- [ ] No visible lag during gameplay on a mid-range phone (e.g., Pixel 5)
- [ ] Bundle size under 200 KB gzipped JS
