# Rune System

As a player, I want to find and socket runes into my equipment to customize gear with magical properties, so that I can fine-tune my build beyond base item stats.

## Details

- **Rune Types** (each has a unique ASCII symbol):
  - **Fury** (F): +damage, chance to deal double damage on hit
  - **Ward** (W): +armor, chance to absorb incoming spell damage
  - **Haste** (H): +speed, chance to take an extra action
  - **Drain** (D): lifesteal on hit (recover HP equal to 15% of damage dealt)
  - **Shock** (S): attacks have 20% chance to chain lightning to adjacent enemies
  - **Frost** (C): attacks slow enemies by 30% for 2 turns
  - **Venom** (V): attacks apply poison (3 turns, stacking)
  - **Arcane** (A): +mana regen, spells cost 10% less
- **Rune Tiers**: Cracked (weak) → Common → Refined → Perfect → Legendary
- **Socket System**: weapons have 1-3 sockets, armor has 1-2 sockets, accessories have 1 socket
- **Rune Combinations**: socketing specific rune pairs creates synergy bonuses:
  - Fury + Fury = Berserker (damage scales with missing HP)
  - Frost + Shock = Frostfire (frozen enemies shatter on lightning hit)
  - Drain + Venom = Plague Leech (poison heals you instead of draining enemy)
- Runes can be removed with a Rune Chisel (destroys the rune) or a Master Jeweler NPC (preserves both, costs gold)
- Runes are found in dungeons, as quest rewards, or crafted from rune fragments at an enchanting table
- Some legendary runes are unique and only one exists per world seed

## Acceptance Criteria

- [ ] All eight rune types apply correct effects
- [ ] Rune tiers scale effect strength appropriately
- [ ] Socket system works for weapons, armor, and accessories
- [ ] Rune combination synergies activate correctly
- [ ] Rune removal works via both methods (destructive and NPC)
