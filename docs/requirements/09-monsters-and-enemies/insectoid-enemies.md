# Insectoid Enemies

As a player, I want to encounter hive-based insect enemies with swarm mechanics and a queen hierarchy, so that fighting insects requires different tactics than humanoid combat.

## Details

- **Insectoid Types**:
  - **Giant Ant Worker**: low damage, high HP, carries food/materials; won't attack unless provoked or hive is threatened
  - **Giant Ant Soldier**: strong mandible attack, can grapple (immobilize for 1 turn), defends workers and queen paths
  - **Giant Wasp**: flying, venomous sting (poison + pain = -2 to all actions for 3 turns), aggressive, nests in trees and cave ceilings
  - **Spider Broodmother**: boss-tier, spawns spiderlings each turn (up to 8 active), web shot (immobilize at range), venomous bite; killing her stops all spiderling spawning
  - **Beetle Tank**: extremely high armor (immune to slashing), slow, charges in straight lines for massive damage, weak underbelly (must flank)
  - **Mantis Assassin**: stealth, ambush from tall grass, scythe arms (high crit chance), lightning-fast first strike; retreats if damaged below 50% HP
  - **Swarm of Locusts**: not a single enemy but a cloud tile; deals damage to anything inside it; immune to single-target attacks, weak to AoE (fire, wind)
  - **Hive Queen**: immobile boss, summons waves of all insectoid types; pheromone aura (charmed insects fight harder); killing her collapses the hive
- **Hive Mechanics**: insectoid dungeons have a hive structure; destroying egg chambers reduces spawn rate, destroying food stores weakens soldiers, finding the queen ends the threat
- **Pheromone System**: killing insects releases alarm pheromones (alerts nearby insects); stealth or wind spells can disperse pheromones
- **Loot**: chitin (armor crafting), venom sacs (alchemy), royal jelly (rare healing ingredient), silk (bowstring/rope crafting)
- Fire is highly effective against all insectoids (+50% damage); cold slows them significantly

## Acceptance Criteria

- [ ] All insectoid types have unique behaviors and attacks
- [ ] Hive mechanics (eggs, food, queen) affect dungeon difficulty
- [ ] Pheromone alert system triggers correctly
- [ ] Fire and cold elemental effectiveness applies
- [ ] Insectoid loot is usable in crafting systems
