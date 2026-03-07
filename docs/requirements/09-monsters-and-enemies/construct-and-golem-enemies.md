# Construct and Golem Enemies

As a player, I want to fight magical constructs and golems with unique resistances, so that certain enemies require specific strategies beyond normal combat.

## Details

- **Stone Golem**: extremely high armor, immune to piercing, slow, ground slam AoE. Weak to: heavy blunt weapons
- **Iron Golem**: immune to all magic, poison breath attack, magnetic field pulls metal-armored players closer. Weak to: rust/acid, lightning (overloads)
- **Clay Golem**: regenerates HP each turn, immune to slashing, shapeshifts limbs into weapons. Weak to: fire (hardens it, stops regen)
- **Flesh Golem**: stitched-together creature, berserk at low HP (double damage, attacks randomly), absorbs lightning (heals from it). Weak to: fire, holy
- **Crystal Golem**: reflects 40% of spell damage, shatters on death (AoE piercing to all nearby). Weak to: sonic/thunder attacks
- **Clockwork Sentinel**: fast, precise, combo attacks, self-repairs if given 2 uninterrupted turns. Weak to: water (rusts joints), EMP/lightning
- **Animated Armor**: floats without a body, uses sword and shield, can disassemble and reassemble at a different location. Weak to: dispel magic
- Constructs are: immune to poison, disease, fear, charm, sleep, and bleeding
- Found in: ancient ruins, mage towers, Clockwork Creed areas, abandoned workshops
- Loot: gears, arcane cores, enchanted metal (crafting materials for mechanical items)

## Acceptance Criteria

- [ ] All construct types have unique immunities and weaknesses
- [ ] Standard immunities (poison, charm, etc.) apply to all constructs
- [ ] Weakness-exploiting strategies are meaningfully rewarded
- [ ] Construct-specific loot drops and is usable in crafting
