# Save and Load

As a player, I want to save my game progress and load it later, so that I can play in multiple sessions without losing progress.

## Details

- Multiple save slots (at least 5)
- Quick save (hotkey) and manual save (menu)
- Auto-save on entering a new area and periodically (every 50 turns)
- Save file includes: complete world state, player state, NPC memories, quest progress, map exploration
- Load screen shows: save name, character name, level, playtime, location, screenshot preview
- Save file corruption detection with backup system
- Permadeath mode disables manual saving (auto-save only, deleted on death)

## Acceptance Criteria

- [ ] Saving captures complete game state
- [ ] Loading restores game state accurately
- [ ] Auto-save triggers at configured intervals
- [ ] Permadeath mode enforces save restrictions
