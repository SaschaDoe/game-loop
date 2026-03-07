# Difficulty Scaling

As a player, I want the world difficulty to scale based on distance from the starting area and dungeon depth, so that exploration has a natural risk-reward curve.

## Details

- Areas near the starting town are low-difficulty with weaker enemies
- Difficulty increases the further you travel from the center
- Dungeon levels get progressively harder with tougher enemies and better loot
- Optional difficulty modifiers at game start: Easy, Normal, Hard, Permadeath
- Permadeath mode: character is deleted on death (roguelike mode)
- Scaling affects enemy HP, damage, spawn density, and loot quality

## Acceptance Criteria

- [ ] Nearby areas have weaker enemies than distant areas
- [ ] Dungeon depth increases enemy difficulty
- [ ] Difficulty setting modifies the scaling curve
- [ ] Permadeath mode permanently ends the run on death
