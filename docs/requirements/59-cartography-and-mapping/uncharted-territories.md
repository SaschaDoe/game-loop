# Uncharted Territories

As a player, I want to discover completely unmapped regions that no NPC knows about, so that exploration has a frontier discovery element.

## Details

- **Uncharted Zone Generation**: areas beyond the edges of the known world map; generated on-demand when the player reaches the border
- **Discovery Types**:
  - **Lost Valley**: a hidden biome surrounded by impassable mountains; unique flora/fauna found nowhere else; potentially a lost civilization
  - **Floating Islands**: sky-high terrain accessible by climbing or flight; aetherial creatures, sky pirates, cloud forests
  - **Underground Empire**: a massive cavern system with its own ecosystem, light source (bioluminescent), and inhabitants who've never seen the surface
  - **Frozen Continent**: extreme tundra; ancient ice-locked ruins; creatures adapted to permanent cold; a frozen sea with things trapped beneath
  - **Volcanic Archipelago**: chain of volcanic islands; fire-based ecosystem; dragon nesting grounds; obsidian everything
- **Exploration Mechanics**:
  - No existing maps; fog of war is total; must map everything yourself
  - No fast travel until you've explored enough to establish landmarks
  - Unique resources not available in the known world (new ores, plants, creature parts)
  - Indigenous NPCs with unknown languages (must learn through immersion)
  - New enemy types exclusive to each uncharted region
- **Discovery Rewards**:
  - First discovery of each region grants "Explorer" title + major XP bonus
  - Mapping an uncharted region completely grants a legendary cartography item
  - Establishing trade with indigenous NPCs unlocks exclusive commerce
  - Reporting discoveries to the Explorer's Guild in the capital grants gold + reputation
- **Colonization vs Preservation**: choice to exploit uncharted regions (mining, settlement) or preserve them (protect indigenous cultures, maintain ecosystem); affects karma and faction standings
- **Dynamic Generation**: uncharted territories are seeded but not generated until visited; each playthrough discovers different frontiers

## Acceptance Criteria

- [ ] Uncharted zones generate dynamically at world borders
- [ ] All discovery types have unique biomes, creatures, and resources
- [ ] Fog of war is complete with no pre-existing map data
- [ ] Discovery rewards grant appropriate XP, titles, and items
- [ ] Colonization vs preservation choice has meaningful consequences
