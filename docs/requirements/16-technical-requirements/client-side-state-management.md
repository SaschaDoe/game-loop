# Client-Side State Management

As a developer, I want all game state managed client-side with Svelte's reactivity system, so that the game runs entirely in the browser with no server round-trips.

## Details

- Game state stored in Svelte stores or `$state` runes (Svelte 5)
- State includes: player, enemies, map, inventory, quests, NPC memories, settings
- State is serializable to JSON for save/load functionality
- IndexedDB used for large save data (world state, NPC memory history)
- localStorage used for settings and quick preferences
- State changes trigger reactive UI updates automatically
- No external state management library needed; Svelte's built-in reactivity is sufficient

## Technical Constraints

- All state mutations must go through Svelte's reactivity system
- State must be fully serializable (no functions, DOM refs, or circular refs in state)
- IndexedDB operations must be async and non-blocking

## Acceptance Criteria

- [ ] All game state lives in Svelte stores or runes
- [ ] State serializes to JSON without errors
- [ ] Save/load roundtrip preserves complete game state
- [ ] UI updates reactively on state changes without manual DOM manipulation
