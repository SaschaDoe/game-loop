# Death Mechanics

As a player, I want death to be meaningful but not permanently punishing (outside permadeath mode), so that dying has stakes without erasing hours of progress.

## Details

- On death: screen fades to dark, death message with cause and stats summary
- Normal mode: respawn at last visited town shrine with 50% gold penalty and temporary stat debuff ("Death's Chill" for 100 turns)
- Equipment dropped at death location; must retrieve it (corpse run)
- If you die again before retrieval, previous corpse loot is lost permanently
- Death counter tracked in character stats
- Frequent deaths in the same area trigger a hint system ("Perhaps try a different approach...")
- Special death messages for unique causes (lava, drowning, boss kills, betrayal)
- Permadeath mode: permanent character death, save deleted, stats recorded in Hall of Fame

## Acceptance Criteria

- [ ] Death respawns player at last shrine with penalties
- [ ] Corpse with equipment persists at death location
- [ ] Double-death destroys previous corpse loot
- [ ] Permadeath mode permanently ends the run
