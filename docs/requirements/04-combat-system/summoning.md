# Summoning

As a player, I want to summon creatures and constructs to fight alongside me in combat, so that I can command a small army through magical means.

## Details

- Summoning spells available to: Mage, Necromancer, Ranger, Cleric
- Summon types:
  - **Elemental** (Mage): fire/ice/earth elemental, moderate HP, deals elemental damage
  - **Undead** (Necromancer): skeleton warriors from corpses, weak individually but summon many
  - **Beast** (Ranger): wolf, bear, hawk — each with different combat roles
  - **Spirit** (Cleric): holy guardian, heals allies and damages undead enemies
- Summons persist for a limited number of turns (10-30 based on Intelligence)
- Maximum 3 summons active at once
- Summons act autonomously with basic AI (attack nearest enemy, protect summoner)
- Summoning from corpses: Necromancer can raise recently killed enemies as undead allies
- Summon stats scale with caster level and Intelligence

## Acceptance Criteria

- [ ] All summon types can be cast and appear on the map
- [ ] Summons fight with appropriate AI
- [ ] Duration and maximum limits are enforced
- [ ] Necromancer corpse-raising works on dead enemies
