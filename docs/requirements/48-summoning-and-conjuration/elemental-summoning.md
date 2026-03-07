# Elemental Summoning

As a player, I want to summon elemental beings that fight alongside me with element-specific abilities, so that summoning has tactical variety based on the element chosen.

## Details

- **Elemental Types**:
  - **Fire Elemental**: deals fire damage on contact; leaves burning ground (damage over time to enemies stepping on it); ranged fireball attack; weak to water/ice; sets flammable objects ablaze
  - **Water Elemental**: heals allies in adjacent tiles (1 HP/turn); douses fires; can flood a small area (slows enemies); ranged water jet (knockback); weak to lightning; strong in rain
  - **Earth Elemental**: highest HP of all elementals; blocks pathways with stone walls; tremor attack (AoE, stuns grounded enemies); weak to wind; immune to physical knockback
  - **Air Elemental**: fastest movement; gust attack (pushes enemies 3 tiles); creates wind barriers (deflects projectiles); weak to earth; can carry player for limited flight
  - **Lightning Elemental**: chain lightning (hits up to 3 enemies); paralysis chance on hit; teleports to enemies instantly; weak to earth; extremely fragile; boosted in storms
  - **Ice Elemental**: freezes water terrain (creates walkable ice); slow aura (enemies within 3 tiles have reduced speed); ice spike ranged attack (piercing); weak to fire; creates difficult terrain
  - **Shadow Elemental**: invisible in darkness; sneak attacks from stealth (2x damage); can extinguish light sources; weak to radiant/holy magic; useless in full daylight
- **Summoning Mechanics**: requires a summoning circle (drawn with chalk, 1 turn) + elemental essence (consumed); cast time: 3 turns; summon lasts 30 turns or until destroyed; maximum 1 elemental active at a time
- **Elemental Commands**: attack target, defend position, follow player, use special ability; elementals have limited autonomy (they won't walk into their weakness element)
- **Elemental Essence Sources**: fire = volcano/forge, water = deep spring/ocean, earth = cave/mountain, air = mountain peak/storm, lightning = storm/enchanting, ice = glacier/tundra, shadow = dark dungeon/midnight
- **Elemental Growth**: repeatedly summoning the same element type increases bond level; higher bond = stronger elemental (more HP, damage, duration); max bond grants a unique combined attack (player + elemental)

## Acceptance Criteria

- [ ] All elemental types have correct abilities, weaknesses, and behaviors
- [ ] Summoning requires correct materials and cast time
- [ ] Elemental commands produce correct AI behaviors
- [ ] Essence sources are location-appropriate
- [ ] Bond levels increase with repeated summoning and grant correct bonuses
