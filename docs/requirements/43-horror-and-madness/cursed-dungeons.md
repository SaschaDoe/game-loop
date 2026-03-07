# Cursed Dungeons

As a player, I want some dungeons to have active curses that warp gameplay rules while inside, so that horror dungeons feel distinctly unsettling and mechanically unique.

## Details

- **Dungeon Curses** (one curse per dungeon, random from pool):
  - **No Healing**: all healing is reversed (potions deal damage, heal spells hurt); must survive with damage avoidance only
  - **Permadeath Zone**: dying inside the dungeon is permanent regardless of resurrection methods; extra tension
  - **Mirrored Controls**: movement directions are reversed (pressing left moves right); adapts after 50 turns (player adjusts)
  - **Darkness Eater**: light sources dim 2x faster; complete darkness is hostile (1 damage/turn); light is precious resource
  - **Time Loop**: dungeon resets every 100 turns; must find the exit before reset; progress (opened doors, killed enemies) partially persists between loops
  - **Paranoia**: all NPCs and companions inside the dungeon may be shape-shifted enemies; trust no one; Perception check to identify real allies
  - **Gravity Flux**: gravity direction shifts every 20 turns (floor becomes ceiling); plan positioning to avoid falling when it shifts
  - **Soul Tax**: every enemy killed costs 1 max HP (permanent while in dungeon, restored on exit); killing everything is not viable; must choose battles
- **Curse Warning**: a sign or NPC at the dungeon entrance warns about the curse; player can choose to enter or find another approach
- **Curse Breaking**: deep within the cursed dungeon is the curse source (artifact, ritual circle, trapped spirit); destroying/resolving it lifts the curse permanently
- **Curse Loot**: cursed dungeons have significantly better loot than normal dungeons (risk/reward balance)
- **Curse Stacking**: very rarely, a dungeon has 2 curses simultaneously (extremely dangerous, legendary loot)
- Visual indicator: cursed dungeon tiles have a subtle pulsing color shift to remind the player they're in a cursed zone

## Acceptance Criteria

- [ ] All dungeon curses modify gameplay rules correctly while active
- [ ] Curse warning appears before entry
- [ ] Curse source is findable and destroyable to lift the curse
- [ ] Cursed dungeon loot is measurably better than normal
- [ ] Visual indicators distinguish cursed dungeons
