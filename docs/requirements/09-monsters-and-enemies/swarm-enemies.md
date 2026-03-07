# Swarm Enemies

As a player, I want to fight swarm-type enemies that function as a collective rather than individuals, so that combat includes crowd-control challenges.

## Details

- **Swarm Types**:
  - **Rat Swarm**: low damage per tick but constant; fills a 3x3 area; moves as a unit; splits into 2 smaller swarms at 50% HP; weak to fire (AoE kills efficiently)
  - **Locust Swarm**: flying, moves fast; strips vegetation and food (destroys consumables in inventory if it engulfs the player); blocks visibility; weak to cold
  - **Spider Swarm**: poisons on contact; leaves webbing (slow terrain); spreads across walls and ceilings; weak to fire and area attacks
  - **Bat Cloud**: darkness-dwelling; echolocation makes them immune to blindness; screech (stun AoE); flying makes them immune to ground traps; weak to light and sonic
  - **Skeleton Horde**: reanimated bone fragments; reforms after being scattered; immune to piercing/slashing; weak to blunt AoE and holy; feels like fighting quicksand made of bones
  - **Nanite Swarm** (Precursor): technological micro-machines; disassembles equipment (durability damage); can reform into shapes (walls, weapons, copies of creatures); weak to EMP/lightning
  - **Spirit Swarm**: lost souls merged into a mass of wailing faces; drains mana on contact; fear aura; immune to physical; weak to holy and Turn Undead
- **Swarm Mechanics**:
  - Swarms occupy multiple tiles; stepping into swarm tiles takes damage each turn
  - Single-target attacks are ineffective (10% damage); AoE is full effectiveness
  - Swarms don't have individual HP; they have a collective HP pool that determines their tile coverage (more HP = larger area)
  - Swarms flow around obstacles like liquid; can squeeze through 1-tile gaps
  - Splitting: some swarms split into smaller independent swarms; each must be eliminated
- **Swarm Sources**: nests, hives, magical corruption, Precursor malfunctions, cursed areas
- **Swarm Prevention**: destroying the source (nest/hive) prevents respawning; fire barriers block swarm movement; certain potions repel specific swarm types
- **Swarm Loot**: swarm essence (alchemy ingredient for AoE potions), hive material (trap crafting), collective consciousness gem (psychic crafting)

## Acceptance Criteria

- [ ] All swarm types occupy multiple tiles and deal contact damage
- [ ] Single-target attacks deal reduced damage to swarms
- [ ] AoE attacks are fully effective against swarms
- [ ] Swarms flow through gaps and around obstacles
- [ ] Destroying swarm sources prevents respawning
