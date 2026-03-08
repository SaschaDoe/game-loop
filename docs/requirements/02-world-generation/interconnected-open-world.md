# Interconnected Open World

As a player, I want a huge, interconnected world where all starting locations exist as real places I can travel between, so that the game feels like a living world rather than a linear dungeon crawl.

## Problem Statement

Currently the game has 3 isolated starting locations (Willowmere village, The Rusty Flagon tavern, Goblin Cave) that each funnel into the same linear dungeon. The world feels small and disposable — you pick a start, enter the dungeon, and never see those places again. Other players' starting areas are inaccessible.

## Vision

A massive overworld grid (~200×200 tiles) divided into **7 distinct regions**, each with its own biome, culture, settlements, dungeons, and inhabitants. All 3 starting locations exist as named places on this map. A player who starts in Willowmere can eventually travel to The Rusty Flagon and the Goblin Cave — and vice versa. The world rewards exploration with new cultures, languages, lore, and challenges.

---

## User Stories

### World Structure

#### US-OW-01: Overworld Grid
As a player, I want a large tile-based overworld map so that I can explore a vast world beyond the dungeon.

**Details:**
- World grid of ~200×200 ASCII tiles
- Terrain types: grass (.), forest (♣/T), mountain (^), water (~), sand (:), snow (*), lava (&), swamp (%), road (=), path (-)
- Player moves tile-by-tile on the overworld (same WASD controls)
- Each tile has a biome and terrain type that affects movement and encounters
- The overworld is generated once per playthrough (seed-based) and persists

**Acceptance Criteria:**
- [x] Overworld renders with distinct terrain types using ASCII characters and colors
- [x] Player can move on the overworld with standard controls
- [x] Terrain types are visually distinguishable
- [x] World persists across save/load

**Implementation Notes (completed):**
- `GameState` extended with `locationMode` ('overworld'|'location'), `worldMap`, `overworldPos`, `currentLocationId`
- `createGame()` generates full `WorldMap` and starts player inside their starting settlement
- `handleOverworldInput()`: WASD movement on the 200×200 grid with terrain passability checks
- `renderOverworldColored()`: 50×24 viewport centered on player, camera clamped to world bounds
- Terrain rendered via `TERRAIN_DISPLAY` chars/colors, roads as =/-, settlements as v/T/C/F/c, dungeons as >, POIs as ?
- Fog of war: `revealOverworldArea()` reveals circular area around player position
- Hidden POIs only visible when player is adjacent
- Location entry: settlements generate interior, dungeons start at level 1, POIs grant discovery XP
- `exitToOverworld()`: returns player to overworld from level 0 via stairs
- Save/load: world regenerated from seed on load, explored grid and discovered POIs serialized (SAVE_VERSION 14)
- Dungeon level transitions carry overworld state through all levels
- 4 new engine tests: worldMap generation, location mode, overworld position, fog of war

---

#### US-OW-02: Region System — 7 Regions
As a player, I want the world divided into distinct regions with unique identities, so that traveling to a new area feels like entering a different world.

**Regions:**

1. **The Greenweald** (Temperate Forest)
   - Culture: Elvish — nature worship, druids, wood architecture
   - Palette: greens, browns, soft gold
   - Contains: Willowmere (starting village), elven tree-settlements, sacred groves, forest dungeons
   - Language: Elvish
   - Threats: corrupted treants, fey creatures, giant spiders

2. **The Ashlands** (Volcanic Wasteland / Badlands)
   - Culture: Orcish — war clans, fire forges, brutal honor codes
   - Palette: reds, oranges, charcoal
   - Contains: Goblin Cave (starting location), orc war camps, volcanic dungeons, obsidian fortresses
   - Language: Orcish
   - Threats: fire elementals, war boars, goblin raiding parties

3. **The Hearthlands** (Rolling Plains / Farmland)
   - Culture: Human — traders, farmers, political intrigue
   - Palette: yellows, warm browns, sky blue
   - Contains: The Rusty Flagon (starting tavern), market towns, castles, trade roads
   - Language: Common (default)
   - Threats: bandits, corrupt guards, political assassins

4. **Frostpeak Reach** (Tundra / Mountains)
   - Culture: Dwarven — master crafters, miners, runesmiths
   - Palette: whites, ice blue, iron grey
   - Contains: underground dwarven cities, frozen passes, ice caverns, runic forges
   - Language: Runic (new)
   - Threats: frost giants, ice wyrms, yeti, avalanches

5. **The Drowned Mire** (Swamp / Bayou)
   - Culture: Swampfolk — witches, herbalists, spirit-speakers
   - Palette: murky greens, purples, sickly yellow
   - Contains: stilt villages, witch huts, sunken temples, plague grounds
   - Language: Whispertounge (new)
   - Threats: bog wraiths, plague rats, will-o-wisps, venomous snakes

6. **The Sunstone Expanse** (Desert)
   - Culture: Nomadic — caravan traders, stargazers, sand mages
   - Palette: golds, burnt orange, deep blue (night)
   - Contains: oasis towns, buried ruins, sandstone temples, nomad camps
   - Language: Sandscript (new)
   - Threats: sand wurms, scorpions, mirages, tomb guardians

7. **The Underdepths** (Underground / Caverns)
   - Culture: Deep Ones — shadow cults, fungal farmers, Deepscript scholars
   - Palette: dark purples, bioluminescent cyan, pitch black
   - Contains: underground cities, fungal forests, crystal caverns, the deepest dungeon levels
   - Language: Deepscript (existing)
   - Threats: shadow creatures, cave horrors, mind-warping fungi, ancient constructs

**Acceptance Criteria:**
- [ ] Each region has a distinct color palette and tile set
- [ ] Region boundaries are identifiable via terrain transitions
- [ ] Each region has at least 2 settlements, 2 dungeon entrances, and unique NPCs
- [ ] Entering a new region triggers a flavor message

---

#### US-OW-03: Starting Locations as World Locations
As a player, I want to eventually visit the other starting locations, so that the world feels connected and my starting choice is about origin, not content lock.

**Details:**
- Willowmere is a named village in The Greenweald
- The Rusty Flagon is a tavern in a Hearthlands crossroads town
- The Goblin Cave is a dungeon entrance in The Ashlands
- All 3 exist on the overworld regardless of which start the player chose
- Visiting another starting area triggers unique dialogue acknowledging you're a visitor, not a native
- NPCs in other starting areas react based on your origin (e.g., "You're not from around here, are you?")

**Acceptance Criteria:**
- [ ] All 3 starting locations exist as enterable locations on the overworld
- [ ] Player can travel to and enter any starting location
- [ ] NPCs acknowledge the player's origin
- [ ] Each location has content whether or not it was the player's start

---

### Navigation & Travel

#### US-OW-04: Region Transitions
As a player, I want clear transitions between regions, so that I know when I'm entering new territory.

**Details:**
- Biome transitions are gradual (2-3 tile blending zone)
- Entering a new region shows a banner message: "You enter The Ashlands..."
- Region name displayed in the HUD when on the overworld
- Some region borders have natural barriers (mountain ranges, rivers, chasms) requiring specific routes or items

**Acceptance Criteria:**
- [x] Transitions between regions are visually gradual
- [x] Region entry announcement displays
- [x] HUD shows current region name
- [ ] Natural barriers enforce meaningful route planning

**Implementation Notes (partial):**
- Region transitions already blend via `applyTransitionZones()` (grass at borders)
- `handleOverworldInput()` detects region changes by comparing previous vs next tile region
- Banner message "— You enter {Region Name} —" + flavor text on region transition
- `REGION_FLAVOR`: atmospheric description per region (Greenweald, Ashlands, etc.)
- `getOverworldInfo()`: returns region name, color, danger level for HUD display
- `REGION_COLORS`: color per region for HUD text
- HUD in `+page.svelte` shows colored region name when `locationMode === 'overworld'`
- Natural barriers NOT yet enforced (mountains/water block movement, but no special route gates)

---

#### US-OW-05: Roads and Paths
As a player, I want roads connecting major settlements so that I can navigate the world efficiently.

**Details:**
- Main roads (=) connect major towns — +50% movement speed, lower encounter rate
- Dirt paths (-) connect smaller locations — normal speed
- Off-road travel is slower (forest: 50%, swamp: 75%, mountain: impassable without climbing)
- Signposts at crossroads show directions and distances
- Roads are procedurally generated using minimum spanning tree + extra loops

**Acceptance Criteria:**
- [x] Roads visibly connect settlements on the overworld
- [x] Movement speed varies by terrain
- [x] Signposts provide navigation information
- [x] Off-road penalties apply correctly

**Implementation Notes (completed):**
- Roads generated via Kruskal's MST + A* pathfinding in `overworld.ts`
- Main roads ('=') connect cities/towns/fortresses, dirt paths ('-') connect villages/camps
- Road double-step: moving along roads lets player travel 2 tiles per turn (if both tiles are road)
- `TERRAIN_MOVE_COST`: forest/swamp/snow/mud/ice cost 2 turns per step, other terrain costs 1
- Slow terrain message: "The {terrain} slows your progress."
- Signposts placed at road intersections (3+ cardinal road neighbors)
- `showSignpostInfo()`: displays 4 nearest settlements with compass direction and Manhattan distance
- `compassDirection()`: converts dx/dy to N/S/E/W/NE/NW/SE/SW labels
- 4 new engine tests: slow terrain cost, road double-step, signpost info, normal terrain cost

---

#### US-OW-06: Location Entry/Exit
As a player, I want to enter settlements and dungeons from the overworld and return to the overworld when I leave.

**Details:**
- Stepping onto a settlement/dungeon tile and pressing Enter (or bumping) transitions to the interior map
- Exiting a location (reaching the edge or using an exit tile) returns to the overworld at the same position
- Dungeon levels still work as before (stairs go deeper), but exiting level 0/1 returns to overworld
- Location state persists (NPCs talked to, enemies killed) for the current session

**Acceptance Criteria:**
- [ ] Player can enter locations from the overworld
- [ ] Player can exit locations back to the overworld
- [ ] Dungeon depth still works (deeper floors accessible via stairs)
- [ ] Location state is preserved within a session

---

### World Content

#### US-OW-07: Biome-Specific Monsters
As a player, I want each region to have unique monsters, so that exploration introduces new threats.

**Details:**
- Each region has 4-6 unique monster types not found elsewhere
- Monster visual design (ASCII char + color) reflects the biome
- Common monsters from the existing pool can still appear but are region-weighted
- Boss monsters are region-themed (e.g., Ancient Treant in Greenweald, Lava Titan in Ashlands)

**Acceptance Criteria:**
- [ ] Each region spawns its unique monster set
- [ ] Monster appearance matches regional theme
- [ ] Boss encounters are region-themed
- [ ] Bestiary tracks region of discovery

---

#### US-OW-08: Regional Cultures and Languages
As a player, I want each region to have a distinct culture with its own language, customs, and NPCs, so that the world feels alive and diverse.

**Details:**
- 7 languages total: Common, Elvish (existing), Orcish (existing), Deepscript (existing), Runic (new), Whispertongue (new), Sandscript (new)
- NPCs in their home region may speak their native language (garbled text until learned)
- Learning a language unlocks dialogue options, readable inscriptions, and lore in that region
- Cultural differences affect: greeting style, trade customs, quest types, building architecture
- Faction reputation is per-region (friendly in Greenweald doesn't mean friendly in Ashlands)

**Acceptance Criteria:**
- [ ] Each region has NPCs speaking the regional language
- [ ] Language barrier prevents understanding until language is learned
- [ ] Unlocking a language opens new dialogue and lore
- [ ] Cultural differences are reflected in NPC behavior and settlement design

---

#### US-OW-09: Regional Dungeons
As a player, I want each region to have themed dungeon types, so that dungeon crawling stays fresh across the world.

**Details:**
- Greenweald: overgrown ruins, living root tunnels, fey hollows
- Ashlands: volcanic caverns, goblin warrens, obsidian vaults
- Hearthlands: castle basements, bandit hideouts, sewers
- Frostpeak: ice caves, collapsed mines, frozen tombs
- Drowned Mire: sunken temples, flooded crypts, hag lairs
- Sunstone Expanse: buried pyramids, sand-filled ruins, oasis grottos
- Underdepths: crystal caverns, fungal networks, abyssal pits
- Each dungeon type has themed tile colors, unique traps, and region-specific loot

**Acceptance Criteria:**
- [ ] Each region has at least 2 distinct dungeon themes
- [ ] Dungeon tile colors and traps reflect the region
- [ ] Region-specific loot drops in regional dungeons
- [ ] Dungeon difficulty scales with distance from starting region

---

#### US-OW-10: Overworld Random Encounters
As a player, I want random encounters while traveling the overworld, so that journeys feel dangerous and eventful.

**Details:**
- Encounter chance per overworld step: ~5% off-road, ~2% on roads
- Encounter type depends on region: bandits in Hearthlands, wolves in Greenweald, sand scorpions in Expanse
- Encounters transition to a small combat map (like current dungeon rooms)
- After combat, player returns to overworld at the same position
- Non-combat encounters: merchant caravans, lost travelers, shrine discoveries

**Acceptance Criteria:**
- [ ] Random encounters trigger at appropriate rates
- [ ] Encounter content matches the current region
- [ ] Combat encounters use temporary maps
- [ ] Non-combat encounters provide meaningful interactions

---

### World Discovery

#### US-OW-11: Overworld Fog of War
As a player, I want the overworld to be hidden until I explore it, so that discovery feels rewarding.

**Details:**
- Overworld starts fully hidden (unexplored)
- Player reveals tiles within sight radius while walking (radius 5 on plains, 3 in forest, 2 in mountains)
- Previously seen tiles remain visible but dimmed (no real-time updates)
- Settlements and roads are revealed when adjacent
- Map items and NPC rumors can reveal distant locations

**Acceptance Criteria:**
- [x] Overworld starts hidden
- [x] Explored tiles persist as revealed
- [x] Sight radius varies by terrain
- [x] Rumors/maps can reveal locations

**Implementation Notes (completed):**
- Overworld starts fully unexplored; `revealOverworldArea()` reveals circular area on each move
- Explored grid (boolean[][]) persists via save/load (serialized as `overworldExplored`)
- `TERRAIN_SIGHT_RADIUS`: grass/farmland=6, sand=7, forest/dead_trees/swamp/rock=3, snow/ice/mud/ash=4, scorched=5
- `getOverworldSightRadius(tile)` returns terrain-specific radius, used in all `revealOverworldArea()` calls
- `revealRumorLocation()`: when a rumor is learned, reveals radius-8 area around nearest unrevealed settlement
- Discovery message: "The rumor reveals the location of {name} on your map."
- 2 new engine tests: forest reveals fewer tiles than grass, sand has extended sight radius

---

#### US-OW-12: Points of Interest
As a player, I want discoverable points of interest scattered across the world, so that exploration is rewarded beyond just settlements and dungeons.

**Details:**
- Shrines: pray for a temporary buff (1 per region)
- Ruins: environmental storytelling + loot (2-3 per region)
- Standing stones: teach a word of a regional language
- Hidden caves: small single-room dungeons with rare loot
- Battlefield remnants: lore about faction wars
- Abandoned camps: journals, supplies, story fragments

**Acceptance Criteria:**
- [ ] At least 3 types of POI per region
- [ ] POIs provide meaningful rewards (loot, lore, buffs)
- [ ] POIs are distributed across the map, not clustered
- [ ] Discovering a POI adds it to the player's map

---

#### US-OW-13: World Map View
As a player, I want to open a zoomed-out world map showing discovered regions and locations, so that I can plan my route.

**Details:**
- Press 'M' to toggle world map overlay
- Shows discovered terrain, settlements (named), dungeons, and POIs
- Current position marked with blinking cursor
- Undiscovered areas shown as dark/blank
- Region names labeled on the map
- Can set a waypoint that shows a directional indicator in the HUD

**Acceptance Criteria:**
- [x] World map opens with 'M' key
- [x] Discovered locations and terrain are shown
- [x] Undiscovered areas are hidden
- [x] Waypoint system provides navigation aid

**Implementation Notes (completed):**
- 'M' key toggles world map overlay (only on overworld), mutual-exclusive with journal
- `renderWorldMap()`: scales 200×200 → 50×24, scans each cell for settlements/dungeons/POIs
- Player shown as '@' (yellow), waypoint as 'X' (magenta), settlements as C/T/v, dungeons as '>'
- Undiscovered cells render as black spaces; explored cells show dimmed terrain colors
- Region labels: first explored cell per region gets a positioned label with region name+color
- Waypoint: click on world map grid to set, converts viewport coords → world coords
- `getWaypointIndicator()`: returns compass direction (N/S/E/W/NE/NW/SE/SW) + Manhattan distance
- HUD shows waypoint arrow when set: "→E (50)" or "★ HERE" when close (<3 tiles)
- `waypoint` field added to GameState, serialized in save/load, carried through dungeon levels
- CSS: crosshair cursor on map grid, overlay follows journal pattern (z-index 200)
- 6 new engine tests: world map grid size, undiscovered hiding, waypoint indicator (null/direction/HERE), waypoint marker

---

### Difficulty & Progression

#### US-OW-14: Distance-Based Difficulty
As a player, I want regions further from my start to be harder, so that I have a natural sense of progression across the world.

**Details:**
- Player's starting region is the easiest (level-appropriate enemies)
- Adjacent regions are moderately harder (+3-5 levels)
- Distant regions are significantly harder (+8-12 levels)
- The Underdepths is always the hardest region regardless of start
- Players can attempt hard regions early but will face steep difficulty
- Region difficulty is displayed on the world map (e.g., "Danger: High")

**Acceptance Criteria:**
- [x] Enemy levels scale with distance from starting region
- [x] Difficulty indicators are visible on the world map
- [x] The Underdepths is the hardest region
- [x] Players can still enter hard regions (not gated, just difficult)

**Implementation Notes (completed):**
- `enterDungeon()`: dungeon starting level = 1 + (regionDangerLevel - 1), so Greenweald dungeons start at level 1, Ashlands at 4, Underdepths at 10
- Danger warning on dungeon entry: "The creatures here seem {challenging/dangerous/very dangerous/overwhelming}. (Level N+)"
- `dangerDisplay()`: converts numeric danger (1-10) to label (Safe/Low/Medium/High/Very High/Extreme) + color
- `getOverworldInfo()`: now returns `dangerLabel` and `dangerColor` for HUD display
- HUD shows "Danger: {label}" with color-coded text next to region name
- World map labels include danger indicator: "The Ashlands [Medium]"
- Region transition warning: entering regions with danger >= 4 shows orange 'danger' message
- New 'danger' MessageType with orange bold styling
- REGION_DEFS danger levels: Greenweald=1, Hearthlands=2, Ashlands=4, Drowned Mire=5, Frostpeak=6, Sunstone Expanse=7, Underdepths=10
- No movement gating — players can freely enter any region
- 3 new engine tests: dangerDisplay labels, getOverworldInfo danger fields, world map danger labels

---

#### US-OW-15: Cross-Region Quests
As a player, I want quests that require traveling to other regions, so that I have reasons to explore the full world.

**Details:**
- NPCs in one region reference locations/people in other regions
- "Fetch" quests that require items from distant biomes
- Language-locked content that requires learning from another region's scholars
- Lore fragments scattered across multiple regions that tell a complete story when combined
- The main quest requires visiting at least 4 of 7 regions

**Acceptance Criteria:**
- [ ] At least 3 cross-region quest chains exist
- [ ] Quests reference specific named locations in other regions
- [ ] Completing cross-region content provides significant rewards
- [ ] Main quest drives exploration across the world

---

## Technical Considerations

- **Map Storage:** Overworld is a single large grid stored in GameState. Interior maps are loaded/unloaded on entry/exit.
- **Performance:** Only render the visible portion of the overworld (viewport). Store full grid in memory.
- **Save/Load:** Overworld state (explored tiles, POI states) must serialize. Interior location states can be regenerated or cached.
- **Generation Order:** Generate overworld terrain → place regions → generate roads → place settlements → place dungeons → place POIs.
- **Seed System:** All generation must be deterministic from world seed for reproducibility.

## Dependencies
- Existing: fog-of-war system (fov.ts), map generation (map.ts), locations (locations.ts)
- New: overworld-map.md, biome-variety.md, road-and-path-network.md, settlement-types.md
- Related: fast-travel.md, world-seed-settings.md, npc-factions.md
