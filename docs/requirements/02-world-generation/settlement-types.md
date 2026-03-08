# Settlement Types

## Overview
The game world contains diverse settlement types drawn from multiple fantasy genres. Settlements serve as safe zones, quest hubs, and thematic variety across the game world.

## User Stories

### Human Settlements
- As a player, I can visit farming villages with simple homes and friendly NPCs
- As a player, I can visit coastal fishing villages with docks, boats, and fisherman NPCs
- As a player, I can visit walled towns with gates, guards, and market squares
- As a player, I can visit castles and fortresses with throne rooms and armories
- As a player, I can visit mountain monasteries with scholar NPCs

### Non-Human Settlements
- As a player, I can encounter orc war camps with crude tents and warrior NPCs
- As a player, I can discover dwarven underground cities with forges and mine shafts
- As a player, I can find elven forest settlements built among trees
- As a player, I can stumble upon goblin warrens (hostile cave systems)
- As a player, I can visit underground dark elf cities with exotic trade goods

### Thematic Variety
- As a player, each settlement type has a distinct visual style using ASCII characters
- As a player, settlement NPCs reflect their culture (dwarven smiths, elven rangers, orc warriors)
- As a player, settlements of different types offer different goods, quests, and information
- As a player, some settlements are friendly while others are hostile based on race/faction

### Settlement Features
- As a player, settlements may contain shops where I can buy/sell items
- As a player, settlements may contain inns where I can rest and heal
- As a player, settlements may contain quest-givers with location-specific quests
- As a player, settlements connect to dungeons, wilderness, and other settlements

## Future Implementation Notes
- Currently only the starting village and tavern are implemented as playable locations
- The cave (Goblin Warren) represents the first hostile non-human settlement
- Additional settlement types will be added as the overworld system develops
- Each settlement type should eventually have its own map generation algorithm

## See Also

This story is expanded and superseded by:
- [interconnected-open-world.md](interconnected-open-world.md) — US-OW-03 (starting locations as world locations), US-OW-06 (location entry/exit)
- [regional-cultures.md](regional-cultures.md) — culture-specific settlement styles per region (US-RC-01 through US-RC-07)
- [world-generation-algorithm.md](world-generation-algorithm.md) — US-WG-04 (settlement placement rules)
