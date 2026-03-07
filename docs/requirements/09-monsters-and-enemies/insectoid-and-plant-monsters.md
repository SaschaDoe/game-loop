# Insectoid and Plant Monsters

As a player, I want to encounter insect swarms, giant arachnids, and carnivorous plants, so that natural dungeons and forests have creepy, biome-appropriate threats.

## Details

- **Giant Spider**: web traps (immobilize for 2 turns), poison bite, ambush from ceiling tiles
- **Ant Swarm**: low individual damage but attacks as a swarm (AoE entity), immune to single-target attacks, weak to AoE
- **Scorpion**: armored, tail sting with paralyzing poison, burrows underground to ambush
- **Mantis Warrior**: fast, high damage, counterattack ability (hits back when missed)
- **Hive Queen**: spawns insect minions, pheromone aura that enrages all insects in range
- **Venus Maw**: carnivorous plant, roots grab passing creatures, digestive acid DoT
- **Spore Shaman**: mushroom creature, releases confusion spores, heals other plant monsters
- **Treant Corruption**: infected treant, spreads blight (corrupts nearby terrain), tough but slow
- **Myconid Colony**: fungus creatures that communicate telepathically, fight as coordinated group
- Insectoid and plant monsters are weak to fire, resistant to poison
- Found in: forests, swamps, caves, underground gardens

## Acceptance Criteria

- [ ] All creature types have distinct mechanics
- [ ] Swarm entity handles AoE-only vulnerability
- [ ] Web, root, and spore effects function correctly
- [ ] Fire weakness and poison resistance apply
