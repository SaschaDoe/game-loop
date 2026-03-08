# World Generation Algorithm

As a developer, I want a clear procedural generation strategy for the overworld, so that the huge world can be generated deterministically from a seed.

## Problem Statement

The current map.ts generates single 50×24 dungeon floors. We need a generation pipeline that creates a 200×200 overworld with 7 themed regions, settlements, roads, dungeons, and points of interest — all from a single seed.

---

## User Stories

### Generation Pipeline

#### US-WG-01: Seed-Based World Generation
As a player, I want to enter a world seed so that I can share interesting worlds with others or replay the same layout.

**Details:**
- Seed input on character creation screen (optional, random if blank)
- All procedural generation uses a seeded PRNG (not Math.random())
- Same seed + same settings = identical world
- Seed stored in save file

**Acceptance Criteria:**
- [x] Seed input field exists on creation screen
- [x] Same seed produces identical world layout (dungeon levels are deterministic per seed+level)
- [x] Seed persists in save files (via CharacterConfig serialization)

**Implementation Notes (completed):**
- `seeded-random.ts`: Mulberry32 PRNG with `SeededRandom` class, `hashSeed()`, `createRng()`, `randomSeedString()`
- `types.ts`: `worldSeed: string` added to `CharacterConfig`
- `map.ts`: `generateMap()` and `getSpawnPositions()` accept optional `SeededRandom` parameter
- `engine.ts`: `newLevel()` creates per-level RNG via `hashSeed(worldSeed + ':level:' + level)`, threads through all placement functions
- Placement functions updated: `placeTraps()`, `placeHazards()`, `placeChests()`, `placeLandmarks()`, `spawnDungeonNPCs()`, `spawnEnemies()`, `pickMonsterDef()`, `createRareMonster()`
- `save.ts`: SAVE_VERSION bumped to 13; seed persists via CharacterConfig
- `+page.svelte`: seed input field on creation screen, empty = random seed
- Tests: `seeded-random.test.ts` (12 tests), `map.test.ts` seeded determinism tests (3 tests)
- Combat randomness intentionally NOT seeded (dice rolls, dodge, flee should stay unpredictable)

---

#### US-WG-02: Region Placement
As a developer, I want regions placed via Voronoi-like partitioning, so that region shapes are organic and non-rectangular.

**Details:**
- Place 7 region seed points on the 200×200 grid (with constraints for spacing)
- Each tile is assigned to the nearest seed point → defines region boundaries
- Apply noise to boundaries for organic edges
- Region seed points determine the center of that region's primary settlement
- Underdepths region uses a special rule: accessible only via cave entrances in other regions (not a surface area)

**Generation order:**
1. Place 6 surface region seeds (spread via Poisson disk sampling)
2. Assign tiles to nearest region
3. Apply biome terrain rules per region
4. Generate Underdepths as underground layer accessible via cave tiles

**Acceptance Criteria:**
- [x] 7 regions are placed with organic boundaries
- [x] No region is too small (minimum ~400 tiles) or too large
- [ ] Underdepths is underground, accessible via cave entrances
- [x] Region placement is deterministic from seed

**Implementation Notes (completed):**
- `overworld.ts`: `generateWorld(worldSeed, width?, height?)` — full pipeline
- Voronoi partitioning with Poisson-disk seed placement (min 25% of map dimension apart)
- Noise-distorted boundaries for organic region edges (value noise, scale 12)
- 6 surface regions + Underdepths (underground, no surface tiles yet)
- Validation helpers: `getRegionTileCounts()`, `getRegionTerrainDistribution()`
- Tests: `overworld.test.ts` — 21 tests covering determinism, region counts, terrain distribution, settlements, dungeons

---

#### US-WG-03: Terrain Generation Per Region
As a developer, I want each region to generate appropriate terrain, so that biomes look and feel distinct.

**Terrain rules:**
- **Greenweald:** 70% forest, 20% grass, 10% water (streams)
- **Ashlands:** 50% scorched earth, 25% lava, 15% rock, 10% ash
- **Hearthlands:** 60% grass/farmland, 20% road, 15% forest patches, 5% water
- **Frostpeak:** 40% snow, 30% mountain, 20% ice, 10% rock
- **Drowned Mire:** 50% swamp, 25% water, 15% mud, 10% dead trees
- **Sunstone Expanse:** 80% sand, 10% rock, 5% oasis, 5% ruins
- Perlin noise layers for natural-looking distribution
- Transition zones (3-tile width) blend adjacent biome terrain types

**Acceptance Criteria:**
- [x] Each region's terrain matches its biome identity
- [x] Perlin noise creates natural variation within regions
- [x] Transition zones blend smoothly between regions
- [x] Terrain generation is deterministic from seed

**Implementation Notes (completed):**
- Two-octave value noise (scales 8 and 20) with smoothstep interpolation for natural terrain variation
- `TERRAIN_WEIGHTS` per region define biome-appropriate terrain distributions
- `pickTerrain()` maps noise values to weighted terrain types
- `applyTransitionZones()` blends region borders with 40% chance of neutral grass at border tiles
- Tests verify biome identity: forest-dominated Greenweald, snow/mountain Frostpeak, sand-dominated Sunstone, wet Drowned Mire

---

#### US-WG-04: Settlement Placement
As a developer, I want settlements placed logically within regions, so that the world feels plausible.

**Rules:**
- Each region gets 2-4 settlements (scaled by region size)
- Settlements placed on passable terrain, near water if possible
- Minimum distance between settlements: 15 tiles
- Starting locations (Willowmere, Rusty Flagon, Goblin Cave) are placed first as anchors
- Each settlement has a type (village, town, city, camp, fortress) based on the region's culture
- Settlement names generated from culture-specific syllable tables

**Acceptance Criteria:**
- [x] Settlements are placed on passable terrain
- [x] Starting locations are correctly placed in their regions
- [x] Settlement names are culture-appropriate
- [x] Minimum spacing is enforced

**Implementation Notes (completed):**
- `placeSettlements()`: anchors 3 starting locations first (Willowmere/Greenweald, Crossroads Inn/Hearthlands, Goblin Cave/Ashlands)
- 2-3 additional settlements per region, random offset from center, clamped to bounds
- `findPassableTile()` avoids water/mountain/lava, searches within radius
- `REGION_SYLLABLES` provides culture-specific prefix/suffix syllable tables for name generation
- Min 15 tiles between settlements (enforced in placement loop)
- Tests verify: 3 starting locations present, correct regions, passable terrain, minimum spacing

---

#### US-WG-05: Road Network Generation
As a developer, I want roads connecting all settlements, so that the world is navigable.

**Algorithm:**
1. Create minimum spanning tree connecting all settlements
2. Add 2-3 extra edges for loop paths
3. Pathfind each road along terrain (roads prefer flat terrain, avoid water/mountains)
4. Main roads (=) between major settlements, dirt paths (-) for minor ones
5. Place signposts at intersections

**Acceptance Criteria:**
- [ ] All settlements are connected via road network
- [ ] Roads follow terrain naturally (no roads through mountains/water)
- [ ] Signposts exist at intersections
- [ ] Road types match settlement importance

---

#### US-WG-06: Dungeon Entrance Placement
As a developer, I want dungeon entrances scattered across the world, so that each region has explorable depths.

**Details:**
- Each region gets 2-3 dungeon entrances
- Dungeon entrances placed on appropriate terrain (caves in mountains, ruins in forests, tombs in deserts)
- Each dungeon entrance has a theme based on its region
- Dungeon depth scales with distance from nearest starting location (3-8 floors near start, 10-20 floors in distant regions)
- Dungeon interiors generated on-demand when entered (using existing map.ts with themed modifications)

**Acceptance Criteria:**
- [x] Each region has multiple dungeon entrances
- [x] Dungeon themes match their region
- [x] Dungeon depth scales with world position
- [ ] Interiors generate on-demand

**Implementation Notes (partial):**
- `placeDungeonEntrances()`: 2-3 entrances per surface region, min 10 tiles apart, min 8 tiles from settlements
- `DUNGEON_PREFIXES` per region: region-themed names (e.g., "Overgrown Ruins" for Greenweald, "Buried Pyramid" for Sunstone)
- `maxDepth = 3 + dangerLevel + random(0-5)` — scales with region danger level
- On-demand interior generation NOT yet implemented (needs engine integration)

---

#### US-WG-07: Points of Interest Placement
As a developer, I want POIs scattered across the world for discovery rewards.

**Details:**
- 3-5 POIs per region (shrines, ruins, standing stones, hidden caves, etc.)
- Placed away from settlements and roads (rewarding off-road exploration)
- Some POIs are visible from a distance (ruins), others require adjacent discovery (hidden caves)
- POI content is generated from templates with regional flavor

**Acceptance Criteria:**
- [ ] POIs are distributed across all regions
- [ ] POIs are generally off the beaten path
- [ ] POI content matches regional theme
- [ ] Discovery is tracked in player state

---

## Data Structures

```typescript
// New types needed
interface WorldMap {
  width: number;           // 200
  height: number;          // 200
  tiles: OverworldTile[][];
  regions: Region[];
  settlements: Settlement[];
  dungeonEntrances: DungeonEntrance[];
  pois: PointOfInterest[];
  roads: Road[];
  explored: boolean[][];   // fog of war
}

type OverworldTile = {
  terrain: TerrainType;
  region: RegionId;
  road?: RoadType;
  locationId?: string;     // links to settlement/dungeon/poi
};

type TerrainType = 'grass' | 'forest' | 'mountain' | 'water' | 'sand'
  | 'snow' | 'swamp' | 'lava' | 'rock' | 'ice' | 'mud' | 'ash'
  | 'scorched' | 'farmland' | 'oasis' | 'ruins' | 'dead_trees';

type RegionId = 'greenweald' | 'ashlands' | 'hearthlands'
  | 'frostpeak' | 'drowned_mire' | 'sunstone_expanse' | 'underdepths';

interface Region {
  id: RegionId;
  name: string;
  center: Position;
  culture: CultureType;
  language: Language;
  dangerLevel: number;     // base difficulty 1-10
}

interface Settlement {
  id: string;
  name: string;
  region: RegionId;
  pos: Position;
  type: 'village' | 'town' | 'city' | 'camp' | 'fortress';
  isStartingLocation?: StartingLocation;  // links to existing system
}

interface DungeonEntrance {
  id: string;
  name: string;
  region: RegionId;
  pos: Position;
  theme: DungeonTheme;
  maxDepth: number;
}
```

## Dependencies
- interconnected-open-world.md (world design)
- regional-cultures.md (cultural theming)
- world-seed-settings.md (seed system)
- map.ts (existing dungeon generation to extend)
