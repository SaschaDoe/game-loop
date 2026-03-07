# Dragonborn Heritage

As a player choosing the dragonborn race, I want unique racial abilities tied to draconic ancestry that evolve as I level, so that dragonborn characters feel connected to their dragon lineage.

## Details

- **Ancestry Selection**: at character creation, choose a draconic ancestry (red, blue, green, white, black, gold, silver); determines breath weapon element and resistance
- **Racial Abilities by Level**:
  - **Level 1 — Breath Weapon**: exhale a 3-tile cone of elemental damage (element based on ancestry); 10 damage at level 1, scales +5 per 5 levels; usable once per 20 turns; STR-based (breath power)
  - **Level 3 — Draconic Resistance**: 25% resistance to your ancestry element; passive; stacks with equipment resistance
  - **Level 5 — Dragon Scales**: natural armor +2; visible as subtle scale patterns on skin; no equipment conflict
  - **Level 8 — Dragon Senses**: blindsight 5 tiles (detect invisible/hidden creatures); enhanced smell (tracking bonus +3)
  - **Level 12 — Frightful Presence**: once per combat, let out a draconic roar; all enemies within 5 tiles must WIS save or be frightened for 3 turns; CHA-based
  - **Level 16 — Draconic Wings**: grow functional wings; limited flight (glide + short vertical flight); not full sustained flight; cosmetic wing display outside combat
  - **Level 20 — Dragon Form**: once per day, fully transform into a young dragon of your ancestry type for 10 turns; gain dragon stats, breath weapon at full power, flight, massive size; devastating ultimate ability
- **Ancestry-Specific Bonuses**:
  - Red: +1 STR, fire affinity (fire spells cost 10% less)
  - Blue: +1 INT, lightning affinity
  - Green: +1 CHA, poison affinity
  - White: +1 CON, cold affinity
  - Black: +1 DEX, acid affinity
  - Gold: +1 WIS, radiant affinity (holy magic bonus)
  - Silver: +1 CHA, cold affinity + charm resistance
- **Social Impact**: dragonborn are rare; NPCs react with curiosity, respect, or fear depending on culture; dragon-worshipping cults may recruit you; anti-dragon factions may target you; dragons themselves treat dragonborn as distant kin (diplomacy bonus)
- **Draconic Instincts**: dragonborn feel drawn to hoarding (collect shiny objects — optional flavor mechanic); territorial about their home; natural affinity with other reptilian creatures

## Acceptance Criteria

- [ ] Breath weapon scales correctly with level and ancestry element
- [ ] Racial abilities unlock at correct level thresholds
- [ ] Ancestry-specific stat bonuses apply at character creation
- [ ] Dragon Form transformation applies correct dragon stats for 10 turns
- [ ] Social impact produces correct NPC reactions based on culture
