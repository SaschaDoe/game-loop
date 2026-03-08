# Item Rarity & Artifact System Core

**Status: DONE**

## User Story
As a player, I want items to have rarity tiers and unique legendary artifacts, so that loot is exciting and exploration is rewarding.

## Acceptance Criteria
- [x] 5 rarity tiers: Common, Uncommon, Rare, Epic, Legendary
- [x] Each rarity has a distinct color and stat multiplier
- [x] Items can have enchantments (fire, frost, life steal, etc.)
- [x] 10 weapon special effects (vampiric, flaming, freezing, vorpal, etc.)
- [x] 5+ item sets with set bonuses at piece thresholds
- [x] 10+ legendary artifacts with lore descriptions
- [x] Random item generation scales with dungeon level
- [x] Higher levels produce higher rarity items
- [x] Weapon effects proc during combat with damage and messages
- [x] Artifacts reference the game's lore and hidden history

## Implementation
- `artifacts.ts`: Rarity system, weapon effects, set bonuses, artifact catalog
- `items.ts`: Extended Item type with rarity, enchantments, weaponEffect, setId, isArtifact
