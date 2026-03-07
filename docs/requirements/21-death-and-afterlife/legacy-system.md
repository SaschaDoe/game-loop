# Legacy System

As a player, I want my dead characters to leave a legacy that affects future playthroughs, so that permadeath feels like contributing to a larger story rather than total loss.

## Details

- **Grave Sites**: dead characters get a grave marker in the world at their death location; future characters can find it
- **Grave Loot**: one item from the dead character's inventory can be recovered from their grave (best item by value)
- **Ghost Encounter**: dead characters may appear as ghosts in future playthroughs; LLM dialogue lets the new character talk to the old one for advice
- **Bloodline Bonuses**: creating a new character of the same race as a dead one grants +1 to one stat (inherited talent); stacks up to +3 across generations
- **World Persistence**: choices made by dead characters persist in the world state (freed prisoners stay free, killed NPCs stay dead, completed quests stay done)
- **Hall of Fallen Heroes**: a monument in the starting town lists all dead characters with their achievements
- **Inherited Reputation**: new characters start with 25% of their predecessor's reputation (both positive and negative)
- **Nemesis System**: the enemy that killed the player is promoted — gains a name, levels up, and taunts future characters about their kill
- **Legacy Quests**: some quests span multiple character lifetimes (multi-generational storylines)
- Legacy data stored in IndexedDB, persists across new game starts

## Acceptance Criteria

- [ ] Grave sites appear at correct death locations in new games
- [ ] Ghost encounters with dead characters use LLM dialogue
- [ ] Bloodline bonuses apply and stack correctly
- [ ] World persistence carries over dead character's choices
- [ ] Nemesis system promotes the killing enemy
