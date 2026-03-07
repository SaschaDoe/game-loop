# World Codex

As a player, I want an encyclopedia that auto-populates with lore about places, factions, items, and people I discover, so that all world knowledge is organized in one place.

## Details

- Codex sections: Locations, Factions, Characters, Items, History, Languages, Religions
- Entries auto-create when relevant content is discovered (visiting a town, meeting an NPC, finding a lore book)
- Each entry has: title, description, related entries (hyperlinked), discovery date
- Entries expand as more information is learned (initial discovery is sparse, grows with interaction)
- Search functionality across all codex sections
- Codex completion percentage tracked per section
- Codex can be browsed during observer mode for world-building immersion
- NPC librarians sell codex entries for locations/factions the player hasn't visited
- **Additional Sections**: Recipes (cooking, alchemy, crafting — auto-recorded when learned), Maps (treasure maps, dungeon layouts), Timeline (historical events in chronological order)
- **Player Notes**: add custom annotations to any entry (e.g., "Found mostly near the Eastern Mine")
- **Codex Quests**: some quests require cross-referencing distant codex entries to find connections
- **Export**: codex data exportable as text file for out-of-game reference
- **Codex Rewards**: 100% completion in any section grants a unique reward (Loremaster title, bonus XP, unique item)
- **Legacy Persistence**: codex data carries over across character deaths (accumulated knowledge transcends individual characters)
- **Faction Intelligence**: codex tracks faction relationships in a visual web; shows alliances, rivalries, and your standing with each

## Acceptance Criteria

- [ ] Codex auto-populates on discovery events
- [ ] Entries grow with additional interactions
- [ ] Cross-referencing between related entries works
- [ ] Search returns relevant results across all sections
