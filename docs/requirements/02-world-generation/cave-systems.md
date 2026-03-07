# Cave Systems

As a player, I want procedurally generated cave systems with unique formations, underground rivers, and multi-level depth, so that underground exploration is as rich as surface exploration.

## Details

- **Cave Generation**: caves use organic shape algorithms (cellular automata / Perlin noise) rather than room-and-corridor; produces natural-looking caverns with irregular walls
- **Cave Features**:
  - **Stalactites/Stalagmites**: decorative tile variants; some are breakable (reveal hidden passages or drop on enemies)
  - **Underground Rivers**: flowing water through caves; can be followed to find exits or secret areas; some are navigable by small boat
  - **Crystal Caverns**: rooms filled with glowing crystals; provide light; mineable for arcane crystals; some crystals resonate with magic (amplify spells cast nearby)
  - **Lava Tubes**: volcanic caves with lava flows; heat damage without protection; obsidian deposits; fire enemies
  - **Mushroom Forests**: underground fungal ecosystems; bioluminescent, harvestable, some hostile (spore mushrooms)
  - **Fossil Beds**: ancient bones embedded in walls; mineable for fossil artifacts (museum quest items, necromancy components)
  - **Underground Lakes**: dark, still water; hidden depths; fishing possible; aquatic enemies
- **Cave Depth**: caves have vertical layers (descent mechanic); deeper = more dangerous, better loot, rarer resources
  - Shallow (levels 1-3): mundane creatures (bats, spiders, goblins), common ores
  - Mid (levels 4-6): dangerous creatures (cave trolls, basilisks), rare ores, crystal caverns
  - Deep (levels 7-9): boss creatures (elder things, deep dragons), mythril/adamantine, ancient ruins
  - Abyss (level 10+): eldritch entities, void crystal, Precursor technology
- **Cave Ecology**: creatures form food chains (bats eat insects, spiders eat bats, trolls eat everything); disrupting the chain affects the cave
- **Navigation**: no compass underground; player maps as they go; getting lost is possible without high Perception or mapping tools
- **Collapsed Passages**: some paths are blocked by rubble; mineable (slow) or blastable (loud, alerts enemies)

## Acceptance Criteria

- [ ] Cave generation produces organic, natural-feeling layouts
- [ ] All cave features are present and functional
- [ ] Depth levels scale difficulty and rewards correctly
- [ ] Cave ecology affects creature behavior
- [ ] Navigation without compass creates exploration challenge
