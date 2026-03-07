# Chronomancy

As a player, I want access to time manipulation magic, so that I can rewind mistakes, slow enemies, and manipulate the flow of combat in unique ways.

## Details

- Chronomancy is a rare, hidden spell school — learned from a reclusive NPC or ancient scroll
- Spells:
  - **Slow** (Lv5): target acts every other turn for 6 turns, 8 mana
  - **Haste** (Lv8): self or ally gets 2 actions per turn for 3 turns, 12 mana
  - **Rewind** (Lv12): undo the last 3 turns of combat (enemy positions, HP, buffs reset), 20 mana, once per combat
  - **Time Freeze** (Lv16): all enemies skip their next 2 turns, 25 mana, 30-turn cooldown
  - **Age** (Lv20): rapidly age a target, reducing all stats by 4 for 20 turns (undead immune), 15 mana
  - **Temporal Clone** (Lv22): create a copy of yourself from 5 turns ago that fights alongside you for 10 turns, 30 mana
  - **Paradox** (Lv25): swap your current HP/mana with what they were 10 turns ago, 0 mana, 100-turn cooldown
- Chronomancy has inherent instability: 5% chance per cast of a "time hiccup" (random minor effect — age/de-age self, teleport a random entity, duplicate a random item)
- Time hiccup chance increases with spell level
- Lorewise: chronomancy is banned by all factions due to paradox risk

## Acceptance Criteria

- [ ] All chronomancy spells function as described
- [ ] Rewind correctly restores combat state from 3 turns ago
- [ ] Time hiccup random effects trigger at correct probability
- [ ] Temporal Clone has correct stats and fights autonomously
