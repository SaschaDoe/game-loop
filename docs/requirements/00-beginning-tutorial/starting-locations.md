# Starting Locations

## Overview
Players choose a starting location during character creation that determines their opening scenario, difficulty, and initial resources. Each location provides a unique narrative introduction and teaches core mechanics through gameplay.

## User Stories

### Starting Location Selection
- As a player, I can choose between three starting locations during character creation
- As a player, I see a difficulty indicator (Easy/Medium/Hard) for each location
- As a player, I see a brief description of each starting scenario before choosing

### Village Start (Easy) — "Willowmere"
- As a player, I start in my family home in a small village
- As a player, I can talk to my Mother who gives me a healing potion (+5 HP)
- As a player, I can talk to my Father who gives me a weapon (+1 ATK)
- As a player, I can explore the village safely with no enemies
- As a player, I find extra potions scattered around the village
- As a player, I find the dungeon entrance on the outskirts of the village
- As a player, I learn movement and interaction controls naturally through the village

### Tavern Start (Medium) — "The Rusty Flagon"
- As a player, I start inside a tavern with several NPC patrons
- As a player, I can talk to the Barkeep who offers a minor heal (+3 HP)
- As a player, I can talk to a Hooded Stranger who hints about dungeon mechanics (boss floors, secret walls)
- As a player, I can talk to a Drunk Patron who provides comic relief and vague hints
- As a player, I find the dungeon entrance in the tavern's cellar
- As a player, I start with standard stats and must rely on information rather than items

### Cave Start (Hard) — "Goblin Warren"
- As a player, I start imprisoned in a goblin cave cell at reduced HP (60%)
- As a player, I must fight through 3 goblin enemies to reach the exit
- As a player, I find one potion in my prison cell
- As a player, I experience combat immediately with limited resources
- As a player, reaching the dungeon stairs feels like escaping the cave

### NPC Interaction
- As a player, I bump into NPCs to interact with them (same as attacking enemies, but talks instead)
- As a player, I see NPC dialogue in the message log with a distinct color
- As a player, NPCs show different dialogue lines each time I interact
- As a player, NPCs who have gifts give them on the first interaction
- As a player, NPCs are visible on the map with unique colored characters

## Acceptance Criteria
- [x] Three starting locations selectable during character creation
- [x] Village generates safe area with NPC parents and items
- [x] Tavern generates room with NPC patrons and hints
- [x] Cave generates hostile area with goblin enemies
- [x] NPCs rendered on map with unique characters and colors
- [x] Bump-to-interact NPC dialogue system
- [x] NPC gifts (HP/ATK) given on first interaction
- [x] Each location has stairs leading to dungeon level 1
- [x] Starting location choice persists on restart
