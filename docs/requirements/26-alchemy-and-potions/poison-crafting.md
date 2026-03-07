# Poison Crafting

As a player, I want to craft poisons to coat my weapons or set as traps, so that I have a stealthy offensive tool for weakening enemies before or during combat.

## Details

- Poisons crafted at alchemy tables from toxic ingredients (venom sacs, nightshade, spider fangs)
- Poison types:
  - **Paralyzing Poison**: target loses 1 turn every 3 turns for 9 turns
  - **Weakening Poison**: reduces target Strength by 3 for 20 turns
  - **Hallucinogenic Poison**: target attacks random entities (including allies) for 5 turns
  - **Lethal Poison**: heavy damage over time, kills weak enemies outright
  - **Sleep Poison**: target falls asleep for 5 turns (wakes on damage)
  - **Mana Drain Poison**: target loses mana per turn, cannot cast spells
- Apply poison to: weapons (lasts 5 hits), food (leave poisoned food for enemies), traps, arrows
- Poison resistance: Constitution check reduces or negates effects
- Antidotes: craftable or purchasable to cure poison on self or allies
- Evil-aligned action: poisoning innocents shifts alignment toward evil

## Acceptance Criteria

- [ ] All poison types are craftable and functional
- [ ] Poison application to weapons, food, and traps works
- [ ] Constitution-based resistance reduces effects
- [ ] Antidotes cure active poisons
