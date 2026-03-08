# World Seed Settings

As a player, I want to enter a world seed or configure generation settings before starting, so that I can replay a specific world or customize the experience.

## Details

- Text input for a world seed (string or number)
- Settings panel with sliders/toggles for:
  - World size (small, medium, large, massive)
  - Monster density (sparse, normal, dense, nightmare)
  - Loot frequency (scarce, balanced, generous)
  - Dungeon depth (number of floors)
  - NPC population density
- Default "balanced" preset for quick start
- Seed and settings are saved with the save file for consistency on reload

## Acceptance Criteria

- [ ] Entering the same seed produces the same world
- [ ] All settings are adjustable and affect generation
- [ ] Settings are persisted in save files
- [ ] Default preset produces a balanced experience

## See Also

This story is expanded and superseded by:
- [world-generation-algorithm.md](world-generation-algorithm.md) — US-WG-01 (seed-based world generation)
