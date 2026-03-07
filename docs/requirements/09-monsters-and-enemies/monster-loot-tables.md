# Monster Loot Tables

As a player, I want monsters to drop loot when defeated based on their type, so that combat is rewarding and I'm motivated to fight different enemies.

## Details

- Each monster type has a loot table with weighted probabilities
- Loot includes: gold, materials, consumables, equipment, rare drops
- Higher-tier monsters drop better loot
- Rare drops have low probability but high value (monster-specific unique items)
- Loot is influenced by player luck stat (if applicable) and difficulty setting
- Loot drops visually appear on the monster's tile after death
- Boss loot tables guarantee at least one rare or better item

## Acceptance Criteria

- [ ] Monsters drop loot on death based on their loot table
- [ ] Loot probabilities match the configured weights
- [ ] Boss drops guarantee rare+ items
- [ ] Loot is collectible from the ground
