# Ingredient Gathering

As a player, I want to gather alchemical ingredients from plants, creatures, and minerals throughout the world, so that alchemy has a satisfying exploration-driven supply chain.

## Details

- **Plant Ingredients** (found in the wild, biome-specific):
  - Moonpetal (forest, only blooms at night): mana restoration
  - Bloodroot (swamp): cure disease, poison base
  - Frostbloom (tundra/mountains): cold resistance, ice damage
  - Sunleaf (plains, only during day): healing boost, fire resistance
  - Gloomcap Mushroom (caves): night vision, hallucination risk
  - Thornvine (jungle): damage over time, trap ingredient
  - Stargrass (high altitude, clear nights only): all-stat buff
- **Creature Ingredients** (harvested from killed enemies):
  - Spider Venom Sac: poison potions
  - Troll Blood: regeneration potions
  - Dragon Scale: fire resistance elixir
  - Ghost Ectoplasm: ethereal potions (phase through walls)
  - Basilisk Eye: petrification bombs
  - Phoenix Ash: resurrection potion ingredient (legendary)
- **Mineral Ingredients** (mined from ore deposits):
  - Arcane Crystal: mana potions, spell amplification
  - Sulfite: explosive compounds
  - Mercury: transmutation catalyst
- **Gathering Skill**: higher skill = more yield per node, rarer ingredient drops, ability to identify ingredients in the field
- **Seasonal Availability**: some plants only grow in certain seasons; creature ingredients vary with migration patterns
- **Ingredient Quality**: Poor → Common → Fine → Superior → Perfect; higher quality = stronger potions
- Ingredients have weight and can spoil if not preserved (dried, pickled, or stored in alchemist's pouch)

## Acceptance Criteria

- [ ] All ingredient types are gatherable in correct biomes/from correct sources
- [ ] Gathering skill affects yield and quality
- [ ] Seasonal availability restricts certain ingredients
- [ ] Ingredient quality tiers affect potion potency
- [ ] Spoilage mechanic functions with preservation methods
