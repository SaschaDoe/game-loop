# Mage Class

> **NOTE:** Mana formula, spell schools, spell weaving, and specializations are now defined in **Epic 79: Magic System** (`docs/requirements/79-magic-system/`). See `attributes-and-resources.md` for mana, `spell-schools.md` for schools, `progression-and-learning.md` for specializations and class-specific paths. This file retains the mage class flavor/identity; mechanical details defer to Epic 79.

As a player, I want the mage class to have elemental specialization, spell weaving, and arcane research mechanics that reward intelligent spell selection, so that mages feel cerebral and powerful.

## Details

- **Core Stats**: INT primary, WIS secondary; low HP per level (+1); no armor proficiency (armor interferes with casting — penalty to spell success per armor piece)
- **Class Resource — Mana**: max mana = INT x 5 + (level x 10); regenerates slowly (1 per 3 turns); meditation recovers faster (5 per turn, can't move); mana potions provide instant restoration
- **Elemental Schools** (choose primary at creation, secondary at level 5):
  - **Fire**: high damage, AoE focus; Fireball, Fire Wall, Meteor (ultimate); fire spells ignite terrain
  - **Ice**: crowd control, defensive; Ice Bolt, Blizzard, Frozen Prison, Ice Shield; frozen enemies shatter if hit for massive damage
  - **Lightning**: fast, chain damage; Lightning Bolt, Chain Lightning, Thunderstorm, Overcharge (self-buff: all spells arc to additional targets); stun chance on all spells
  - **Earth**: summoning, terrain control; Stone Wall, Earthquake, Summon Earth Elemental, Petrify; manipulation of dungeon layout
  - **Arcane**: pure magic, utility; Magic Missile (never misses), Dispel Magic, Counterspell, Time Stop (ultimate); meta-magic focus
  - **Shadow**: stealth magic, debuffs; Shadow Bolt, Darkness, Fear, Shadow Clone, Void Gate (ultimate); integrates with stealth gameplay
- **Spell Weaving**: combine two spells from different schools for a unique hybrid effect:
  - Fire + Ice = Steam Cloud (AoE blind + damage)
  - Lightning + Water = Electrified Puddle (AoE stun + damage in water)
  - Earth + Fire = Lava Flow (terrain destruction + heavy DoT)
  - Shadow + Arcane = Phase Shift (teleport + invisibility for 3 turns)
  - Spell weaving costs mana of both spells + 20% surcharge; requires both schools at Skilled level
- **Arcane Research**: downtime activity; spend turns researching to: discover new spells, improve existing spells (reduce cost, increase damage, add effects), and create custom spells (combine effects with LLM evaluation of balance)
- **Mage Specializations** (level 10):
  - **Archmage**: all spell costs -25%; Arcane Mastery (counterspell as free action); can maintain 2 concentration spells simultaneously
  - **Elementalist**: chosen primary school spells +50% damage; Elemental Overload (once per combat, next spell deals triple damage); immune to chosen element
  - **Battlemage**: can wear light armor without penalty; melee spell attacks (enchant fists with spell damage); Spell Shield (absorb spells to restore mana)

## Acceptance Criteria

- [ ] Mana pool calculates correctly from INT and level
- [ ] Elemental schools provide correct spells and effects
- [ ] Spell weaving produces correct hybrid effects with correct costs
- [ ] Arcane research discovers spells and improves existing ones
- [ ] Specializations apply correct bonuses at level 10
