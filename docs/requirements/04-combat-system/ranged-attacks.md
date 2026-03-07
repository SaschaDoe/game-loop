# Ranged Attacks

As a player, I want to use ranged weapons like bows and thrown weapons, so that I can attack enemies from a distance before they reach me.

## Details

- Ranged attacks can target enemies within a range (e.g., bow: 6 tiles, thrown dagger: 3 tiles)
- Require line of sight (walls block projectiles)
- Ammunition system: bows require arrows, crossbows require bolts
- Accuracy decreases with distance (Dexterity modifier helps)
- Ranged weapons cannot be used on adjacent enemies (too close)
- Targeting UI highlights valid targets within range

## Acceptance Criteria

- [ ] Ranged attacks reach enemies at specified distances
- [ ] Line of sight is checked for obstructions
- [ ] Ammunition is consumed on use
- [ ] Accuracy scales with distance and Dexterity
