# Elemental Creatures

As a player, I want to fight elemental creatures tied to fire, ice, earth, and lightning, so that combat requires adapting my strategy to enemy resistances and weaknesses.

## Details

- **Fire Elemental**: immune to fire, weak to ice, leaves burning tiles where it walks
- **Ice Elemental**: immune to ice, weak to fire, freezes adjacent tiles (slows player)
- **Earth Elemental**: high armor, slow, immune to lightning, weak to piercing weapons, can cause earthquakes (AoE stun)
- **Storm Elemental**: fast, teleports, chain lightning attack hits multiple targets, weak to earth magic
- **Water Elemental**: regenerates near water tiles, can flood an area, weak to lightning
- **Shadow Elemental**: invisible in dark areas, drains light sources, weak to holy magic
- **Crystal Elemental**: reflects 30% of spell damage back at the caster, shatters on death dealing AoE piercing damage
- Elementals spawn in biomes matching their type (fire in volcanic, ice in tundra, etc.)
- Defeating elementals drops elemental cores (crafting material for enchanting)

## Acceptance Criteria

- [ ] All elemental types have correct resistances and weaknesses
- [ ] Environmental effects (burning tiles, freezing, flooding) function
- [ ] Elementals spawn in appropriate biomes
- [ ] Elemental cores drop and are usable in crafting
