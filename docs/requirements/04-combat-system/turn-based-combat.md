# Turn-Based Combat

As a player, I want combat to be turn-based and triggered by bumping into enemies, so that I have time to think tactically about each encounter.

## Details

- Combat initiates when the player moves into an enemy tile (bump-to-attack)
- Each turn: player acts first, then all enemies act
- Actions: attack, use item, cast spell, defend, flee
- Initiative system based on Dexterity for multi-enemy encounters
- Combat log displays all actions and damage numbers
- Positioning matters: flanking bonuses, ranged attack distances

## Acceptance Criteria

- [ ] Bump-to-attack initiates combat
- [ ] Turn order follows initiative rules
- [ ] All combat actions are functional
- [ ] Combat log accurately reflects all events
