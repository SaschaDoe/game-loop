# Starter Quest

As a player, I want a short introductory quest that naturally teaches exploration, dialogue, and quest mechanics, so that I learn the core game loop through guided play rather than text walls.

## Details

- **Quest Hook**: immediately after character creation, an NPC approaches with an urgent but simple request (varies by starting area):
  - Village: farmer's chickens escaped, track them through the fields
  - City: messenger's package stolen, follow thief through alleys
  - Wilderness: injured traveler needs herbs, search nearby forest
  - Dungeon: fellow prisoner wants to escape, find the key
- **Exploration Teaching**: quest requires visiting 3-4 locations; first location is directly adjacent (teaches movement); second requires navigating a corner or door (teaches pathfinding); third is partially hidden (teaches searching/interaction keys)
- **Dialogue Teaching**: at least one quest step requires talking to an NPC; teaches dialogue initiation, response selection, and how LLM-powered conversations work; includes a Persuasion option that always succeeds (teaches the mechanic without risk)
- **Inventory Teaching**: quest grants 2-3 items along the way; first item auto-equips with explanation; second item is a consumable (teaches using items); third item is a quest item (teaches quest inventory)
- **Reward**: quest completion grants starter gold, a useful item appropriate to class, and enough XP to reach level 2; triggers the level-up tutorial
- **Quest Journal**: the starter quest introduces the quest journal UI; shows objective tracking, quest log entries, and map markers
- **Skip Option**: veteran players can decline the starter quest ("I already know my way around") and receive the rewards immediately

## Acceptance Criteria

- [ ] Quest hook varies by starting area
- [ ] Each quest step teaches a distinct game mechanic
- [ ] Dialogue teaching includes successful Persuasion example
- [ ] Inventory teaching covers equip, use, and quest items
- [ ] Quest completion grants appropriate starter rewards and triggers level-up
- [ ] Skip option available for experienced players
