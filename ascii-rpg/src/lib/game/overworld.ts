/**
 * Overworld generation: 7 regions on a large grid with biome-specific terrain.
 * US-WG-02: Region placement via Voronoi partitioning
 * US-WG-03: Terrain generation per region
 * US-WG-05: Road network connecting settlements
 */
import type { Position, StartingLocation } from './types';
import { SeededRandom, hashSeed, createRng } from './seeded-random';

// ── Region & Terrain Types ──

export type RegionId = 'greenweald' | 'ashlands' | 'hearthlands' | 'frostpeak' | 'drowned_mire' | 'sunstone_expanse' | 'thornlands' | 'pale_coast' | 'underdepths';

export type TerrainType =
	| 'grass' | 'forest' | 'mountain' | 'water' | 'sand'
	| 'snow' | 'swamp' | 'lava' | 'rock' | 'ice' | 'mud' | 'ash'
	| 'scorched' | 'farmland' | 'oasis' | 'dead_trees';

export type RoadType = 'main' | 'path';

export type SettlementType = 'village' | 'town' | 'city' | 'camp' | 'fortress' | 'temple' | 'harbor';

export interface OverworldTile {
	terrain: TerrainType;
	region: RegionId;
	road?: RoadType;
	signpost?: boolean;
	locationId?: string;
}

export interface Region {
	id: RegionId;
	name: string;
	center: Position;
	language: string;
	dangerLevel: number;
}

export interface Settlement {
	id: string;
	name: string;
	region: RegionId;
	pos: Position;
	type: SettlementType;
	isStartingLocation?: StartingLocation;
}

export interface DungeonEntrance {
	id: string;
	name: string;
	region: RegionId;
	pos: Position;
	maxDepth: number;
}

export interface Road {
	from: string;       // settlement id
	to: string;         // settlement id
	type: RoadType;
	path: Position[];   // ordered tiles from→to
}

export type POIType = 'shrine' | 'ruins' | 'standing_stones' | 'hidden_cave' | 'ancient_tree' | 'grave_site' | 'obelisk' | 'hot_spring';

export interface PointOfInterest {
	id: string;
	name: string;
	region: RegionId;
	pos: Position;
	type: POIType;
	hidden: boolean;    // true = requires adjacent tile to discover, false = visible from distance
	discovered: boolean;
}

export interface WorldMap {
	width: number;
	height: number;
	tiles: OverworldTile[][];
	regions: Region[];
	settlements: Settlement[];
	dungeonEntrances: DungeonEntrance[];
	roads: Road[];
	pois: PointOfInterest[];
	explored: boolean[][];
}

// ── Constants ──

export const WORLD_W = 200;
export const WORLD_H = 200;

/** Surface regions (8) — Underdepths is underground, not placed on surface */
const SURFACE_REGIONS: RegionId[] = ['greenweald', 'ashlands', 'hearthlands', 'frostpeak', 'drowned_mire', 'sunstone_expanse', 'thornlands', 'pale_coast'];

export const REGION_DEFS: Record<RegionId, { name: string; language: string; dangerLevel: number }> = {
	greenweald:       { name: 'The Greenweald',       language: 'Elvish',       dangerLevel: 1 },
	hearthlands:      { name: 'The Hearthlands',      language: 'Common',       dangerLevel: 2 },
	ashlands:         { name: 'The Ashlands',          language: 'Orcish',       dangerLevel: 4 },
	drowned_mire:     { name: 'The Drowned Mire',      language: 'Whispertongue', dangerLevel: 5 },
	frostpeak:        { name: 'Frostpeak Reach',       language: 'Runic',        dangerLevel: 6 },
	sunstone_expanse: { name: 'The Sunstone Expanse',  language: 'Sandscript',   dangerLevel: 7 },
	thornlands:       { name: 'The Thornlands',        language: 'Old Iron',     dangerLevel: 3 },
	pale_coast:       { name: 'The Pale Coast',        language: 'Tidespeak',    dangerLevel: 4 },
	underdepths:      { name: 'The Underdepths',       language: 'Deepscript',   dangerLevel: 10 },
};

/** Which starting location belongs to which region */
const STARTING_REGION: Record<StartingLocation, RegionId> = {
	village: 'greenweald',
	tavern: 'hearthlands',
	cave: 'ashlands',
};

/** Terrain distribution weights per region (must sum to ~100) */
const TERRAIN_WEIGHTS: Record<Exclude<RegionId, 'underdepths'>, { terrain: TerrainType; weight: number }[]> = {
	greenweald: [
		{ terrain: 'forest', weight: 70 },
		{ terrain: 'grass', weight: 20 },
		{ terrain: 'water', weight: 10 },
	],
	ashlands: [
		{ terrain: 'scorched', weight: 50 },
		{ terrain: 'lava', weight: 25 },
		{ terrain: 'rock', weight: 15 },
		{ terrain: 'ash', weight: 10 },
	],
	hearthlands: [
		{ terrain: 'grass', weight: 45 },
		{ terrain: 'farmland', weight: 15 },
		{ terrain: 'forest', weight: 15 },
		{ terrain: 'water', weight: 5 },
		{ terrain: 'grass', weight: 20 }, // extra grass to dominate
	],
	frostpeak: [
		{ terrain: 'snow', weight: 40 },
		{ terrain: 'mountain', weight: 30 },
		{ terrain: 'ice', weight: 20 },
		{ terrain: 'rock', weight: 10 },
	],
	drowned_mire: [
		{ terrain: 'swamp', weight: 50 },
		{ terrain: 'water', weight: 25 },
		{ terrain: 'mud', weight: 15 },
		{ terrain: 'dead_trees', weight: 10 },
	],
	sunstone_expanse: [
		{ terrain: 'sand', weight: 80 },
		{ terrain: 'rock', weight: 10 },
		{ terrain: 'oasis', weight: 5 },
		{ terrain: 'sand', weight: 5 }, // extra sand
	],
	thornlands: [
		{ terrain: 'grass', weight: 35 },
		{ terrain: 'rock', weight: 25 },
		{ terrain: 'forest', weight: 25 },
		{ terrain: 'mountain', weight: 15 },
	],
	pale_coast: [
		{ terrain: 'sand', weight: 40 },
		{ terrain: 'water', weight: 20 },
		{ terrain: 'grass', weight: 25 },
		{ terrain: 'rock', weight: 15 },
	],
};

// ── Perlin Noise (simplified 2D value noise) ──

function createNoiseGrid(width: number, height: number, scale: number, rng: SeededRandom): number[][] {
	// Generate a coarse grid of random values, then interpolate
	const cellsX = Math.ceil(width / scale) + 2;
	const cellsY = Math.ceil(height / scale) + 2;
	const grid: number[][] = [];
	for (let y = 0; y < cellsY; y++) {
		grid[y] = [];
		for (let x = 0; x < cellsX; x++) {
			grid[y][x] = rng.next();
		}
	}

	// Bilinear interpolation for each tile
	const result: number[][] = [];
	for (let y = 0; y < height; y++) {
		result[y] = [];
		for (let x = 0; x < width; x++) {
			const gx = x / scale;
			const gy = y / scale;
			const x0 = Math.floor(gx);
			const y0 = Math.floor(gy);
			const fx = gx - x0;
			const fy = gy - y0;
			// Smoothstep
			const sx = fx * fx * (3 - 2 * fx);
			const sy = fy * fy * (3 - 2 * fy);
			const v00 = grid[y0][x0];
			const v10 = grid[y0][x0 + 1];
			const v01 = grid[y0 + 1][x0];
			const v11 = grid[y0 + 1][x0 + 1];
			const top = v00 + (v10 - v00) * sx;
			const bot = v01 + (v11 - v01) * sx;
			result[y][x] = top + (bot - top) * sy;
		}
	}
	return result;
}

// ── Region Placement (Voronoi) ──

function distance(a: Position, b: Position): number {
	const dx = a.x - b.x;
	const dy = a.y - b.y;
	return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Place 8 region seed points using Poisson-disk-like sampling.
 * Ensures minimum spacing between points.
 */
function placeRegionSeeds(width: number, height: number, rng: SeededRandom): Map<RegionId, Position> {
	const minDist = Math.min(width, height) * 0.25; // ~50 tiles apart minimum
	const margin = 20; // keep away from edges
	const seeds = new Map<RegionId, Position>();

	for (const regionId of SURFACE_REGIONS) {
		let pos: Position;
		let attempts = 0;
		do {
			pos = {
				x: rng.nextRange(margin, width - margin - 1),
				y: rng.nextRange(margin, height - margin - 1),
			};
			attempts++;
		} while (
			attempts < 200 &&
			[...seeds.values()].some(s => distance(s, pos) < minDist)
		);
		seeds.set(regionId, pos);
	}

	return seeds;
}

/**
 * Assign each tile to the nearest region seed (Voronoi partitioning).
 * Returns a 2D grid of RegionId.
 */
function assignRegions(width: number, height: number, seeds: Map<RegionId, Position>, noise: number[][]): RegionId[][] {
	const regionGrid: RegionId[][] = [];
	const seedEntries = [...seeds.entries()];

	for (let y = 0; y < height; y++) {
		regionGrid[y] = [];
		for (let x = 0; x < width; x++) {
			let minDist = Infinity;
			let closest: RegionId = seedEntries[0][0];
			for (const [id, center] of seedEntries) {
				// Add noise to distance for organic boundaries
				const noiseOffset = (noise[y][x] - 0.5) * 15;
				const d = distance({ x, y }, center) + noiseOffset;
				if (d < minDist) {
					minDist = d;
					closest = id;
				}
			}
			regionGrid[y][x] = closest;
		}
	}

	return regionGrid;
}

// ── Terrain Generation ──

function pickTerrain(regionId: RegionId, noiseValue: number): TerrainType {
	if (regionId === 'underdepths') return 'rock';
	const weights = TERRAIN_WEIGHTS[regionId];
	const totalWeight = weights.reduce((s, w) => s + w.weight, 0);
	let threshold = noiseValue * totalWeight;
	for (const { terrain, weight } of weights) {
		threshold -= weight;
		if (threshold <= 0) return terrain;
	}
	return weights[0].terrain;
}

// ── World Generation Pipeline ──

export function generateWorld(worldSeed: string, width: number = WORLD_W, height: number = WORLD_H): WorldMap {
	const rng = createRng(hashSeed(worldSeed + ':overworld'));

	// 1. Place region seeds
	const regionSeeds = placeRegionSeeds(width, height, rng);

	// 2. Generate noise for boundary distortion
	const boundaryNoise = createNoiseGrid(width, height, 12, rng);

	// 3. Assign tiles to regions (Voronoi)
	const regionGrid = assignRegions(width, height, regionSeeds, boundaryNoise);

	// 4. Generate terrain noise (two octaves for variety)
	const terrainNoise1 = createNoiseGrid(width, height, 8, rng);
	const terrainNoise2 = createNoiseGrid(width, height, 20, rng);

	// 5. Build tile grid
	const tiles: OverworldTile[][] = [];
	for (let y = 0; y < height; y++) {
		tiles[y] = [];
		for (let x = 0; x < width; x++) {
			const region = regionGrid[y][x];
			// Combine noise octaves for terrain selection
			const noiseVal = terrainNoise1[y][x] * 0.6 + terrainNoise2[y][x] * 0.4;
			const terrain = pickTerrain(region, noiseVal);
			tiles[y][x] = { terrain, region };
		}
	}

	// 6. Apply transition blending at region borders (3-tile zone)
	applyTransitionZones(tiles, regionGrid, width, height, rng);

	// 7. Build region definitions
	const regions: Region[] = [];
	for (const [id, center] of regionSeeds) {
		const def = REGION_DEFS[id];
		regions.push({ id, name: def.name, center, language: def.language, dangerLevel: def.dangerLevel });
	}
	// Add Underdepths (no surface center)
	regions.push({
		id: 'underdepths',
		name: REGION_DEFS.underdepths.name,
		center: { x: Math.floor(width / 2), y: Math.floor(height / 2) },
		language: REGION_DEFS.underdepths.language,
		dangerLevel: REGION_DEFS.underdepths.dangerLevel,
	});

	// 8. Place settlements
	const settlements = placeSettlements(tiles, regionSeeds, width, height, rng);

	// 9. Place dungeon entrances
	const dungeonEntrances = placeDungeonEntrances(tiles, regionSeeds, settlements, width, height, rng);

	// 10. Generate road network connecting settlements
	const roads = generateRoads(tiles, settlements, width, height, rng);

	// 11. Place points of interest (after roads, so we can avoid them)
	const pois = placePOIs(tiles, regionSeeds, settlements, width, height, rng);

	// 12. Initialize explored grid (all hidden)
	const explored: boolean[][] = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => false)
	);

	return { width, height, tiles, regions, settlements, dungeonEntrances, roads, pois, explored };
}

// ── Transition Zones ──

function applyTransitionZones(tiles: OverworldTile[][], regionGrid: RegionId[][], width: number, height: number, rng: SeededRandom): void {
	for (let y = 1; y < height - 1; y++) {
		for (let x = 1; x < width - 1; x++) {
			const myRegion = regionGrid[y][x];
			// Check if any neighbor has a different region
			let isBorder = false;
			for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
				const nx = x + dx;
				const ny = y + dy;
				if (nx >= 0 && ny >= 0 && nx < width && ny < height && regionGrid[ny][nx] !== myRegion) {
					isBorder = true;
					break;
				}
			}
			if (isBorder && rng.chance(0.4)) {
				// Blend to grass at borders (neutral terrain)
				tiles[y][x] = { ...tiles[y][x], terrain: 'grass' };
			}
		}
	}
}

// ── Settlement Placement ──

function placeSettlements(tiles: OverworldTile[][], regionSeeds: Map<RegionId, Position>, width: number, height: number, rng: SeededRandom): Settlement[] {
	const settlements: Settlement[] = [];
	const minSettlementDist = 15;
	let idCounter = 0;

	// 1. Place starting locations first as anchors
	const startingDefs: { start: StartingLocation; name: string; type: SettlementType }[] = [
		{ start: 'village', name: 'Willowmere', type: 'village' },
		{ start: 'tavern', name: 'Crossroads Inn', type: 'town' },
		{ start: 'cave', name: 'Goblin Cave', type: 'camp' },
	];

	for (const def of startingDefs) {
		const regionId = STARTING_REGION[def.start];
		const center = regionSeeds.get(regionId)!;
		// Place near region center on passable terrain
		const pos = findPassableTile(tiles, center, width, height, rng, 20);
		if (pos) {
			const id = `settlement_${idCounter++}`;
			settlements.push({ id, name: def.name, region: regionId, pos, type: def.type, isStartingLocation: def.start });
			tiles[pos.y][pos.x].locationId = id;
		}
	}

	// 2. Place 2-3 additional settlements per region
	for (const regionId of SURFACE_REGIONS) {
		const center = regionSeeds.get(regionId)!;
		const count = rng.nextRange(2, 3);
		for (let i = 0; i < count; i++) {
			// Pick a random position within the region
			const offset: Position = {
				x: center.x + rng.nextRange(-40, 40),
				y: center.y + rng.nextRange(-40, 40),
			};
			const clamped: Position = {
				x: Math.max(5, Math.min(width - 6, offset.x)),
				y: Math.max(5, Math.min(height - 6, offset.y)),
			};
			// Check region match and minimum distance
			if (tiles[clamped.y]?.[clamped.x]?.region !== regionId) continue;
			if (settlements.some(s => distance(s.pos, clamped) < minSettlementDist)) continue;

			const pos = findPassableTile(tiles, clamped, width, height, rng, 10);
			if (!pos) continue;
			if (tiles[pos.y][pos.x].region !== regionId) continue;
			if (settlements.some(s => distance(s.pos, pos) < minSettlementDist)) continue;

			const id = `settlement_${idCounter++}`;
			const name = generateSettlementName(regionId, rng);
			const type = rng.pick<SettlementType>(['village', 'town', 'city', 'camp', 'fortress', 'temple', 'harbor']);
			settlements.push({ id, name, region: regionId, pos, type });
			tiles[pos.y][pos.x].locationId = id;
		}
	}

	return settlements;
}

// ── Dungeon Entrance Placement ──

function placeDungeonEntrances(tiles: OverworldTile[][], regionSeeds: Map<RegionId, Position>, settlements: Settlement[], width: number, height: number, rng: SeededRandom): DungeonEntrance[] {
	const entrances: DungeonEntrance[] = [];
	const minDungeonDist = 10;
	let idCounter = 0;

	for (const regionId of SURFACE_REGIONS) {
		const center = regionSeeds.get(regionId)!;
		const count = rng.nextRange(2, 3);
		const dangerLevel = REGION_DEFS[regionId].dangerLevel;

		for (let i = 0; i < count; i++) {
			const offset: Position = {
				x: center.x + rng.nextRange(-50, 50),
				y: center.y + rng.nextRange(-50, 50),
			};
			const clamped: Position = {
				x: Math.max(3, Math.min(width - 4, offset.x)),
				y: Math.max(3, Math.min(height - 4, offset.y)),
			};

			if (tiles[clamped.y]?.[clamped.x]?.region !== regionId) continue;
			if (settlements.some(s => distance(s.pos, clamped) < 8)) continue;
			if (entrances.some(e => distance(e.pos, clamped) < minDungeonDist)) continue;

			const pos = findPassableTile(tiles, clamped, width, height, rng, 8);
			if (!pos) continue;

			const id = `dungeon_${idCounter++}`;
			const name = generateDungeonName(regionId, rng);
			const maxDepth = 3 + dangerLevel + rng.nextRange(0, 5);
			entrances.push({ id, name, region: regionId, pos, maxDepth });
			tiles[pos.y][pos.x].locationId = id;
		}
	}

	return entrances;
}

// ── Points of Interest Placement (US-WG-07) ──

/** Region-themed POI templates: [type, name, hidden] */
const REGION_POIS: Record<RegionId, { type: POIType; name: string; hidden: boolean }[]> = {
	greenweald: [
		{ type: 'ancient_tree', name: 'The Elder Oak', hidden: false },
		{ type: 'shrine', name: 'Mossy Shrine', hidden: false },
		{ type: 'standing_stones', name: 'Fey Circle', hidden: false },
		{ type: 'hidden_cave', name: 'Root Cellar', hidden: true },
		{ type: 'ruins', name: 'Elven Ruins', hidden: false },
		{ type: 'hot_spring', name: 'Woodland Spring', hidden: true },
		{ type: 'grave_site', name: 'Ranger\'s Rest', hidden: true },
		{ type: 'obelisk', name: 'Prismatic Spire', hidden: false },
	],
	ashlands: [
		{ type: 'obelisk', name: 'Obsidian Obelisk', hidden: false },
		{ type: 'ruins', name: 'Charred Fortress', hidden: false },
		{ type: 'hidden_cave', name: 'Lava Tube', hidden: true },
		{ type: 'grave_site', name: 'Warlord\'s Cairn', hidden: false },
		{ type: 'shrine', name: 'Flame Altar', hidden: false },
		{ type: 'standing_stones', name: 'Basalt Pillars', hidden: true },
		{ type: 'hot_spring', name: 'Sulfur Vents', hidden: true },
		{ type: 'ancient_tree', name: 'Petrified Ashbloom', hidden: false },
	],
	hearthlands: [
		{ type: 'shrine', name: 'Roadside Chapel', hidden: false },
		{ type: 'ruins', name: 'Old Watchtower', hidden: false },
		{ type: 'standing_stones', name: 'King\'s Stones', hidden: false },
		{ type: 'hidden_cave', name: 'Smuggler\'s Den', hidden: true },
		{ type: 'grave_site', name: 'Hero\'s Tomb', hidden: false },
		{ type: 'hot_spring', name: 'Healing Well', hidden: true },
		{ type: 'obelisk', name: 'Crossroads Marker', hidden: false },
		{ type: 'ruins', name: 'Burned Manor', hidden: true },
	],
	frostpeak: [
		{ type: 'obelisk', name: 'Runestone Pillar', hidden: false },
		{ type: 'ruins', name: 'Frozen Hall', hidden: false },
		{ type: 'hidden_cave', name: 'Ice Grotto', hidden: true },
		{ type: 'shrine', name: 'Dwarven Forge Shrine', hidden: false },
		{ type: 'standing_stones', name: 'Glacial Stones', hidden: false },
		{ type: 'grave_site', name: 'Thane\'s Barrow', hidden: true },
		{ type: 'hot_spring', name: 'Thermal Vent', hidden: true },
		{ type: 'ancient_tree', name: 'Frozen Pine', hidden: false },
	],
	drowned_mire: [
		{ type: 'ruins', name: 'Sunken Altar', hidden: false },
		{ type: 'standing_stones', name: 'Bog Stones', hidden: false },
		{ type: 'hidden_cave', name: 'Hag\'s Burrow', hidden: true },
		{ type: 'grave_site', name: 'Drowned Graveyard', hidden: false },
		{ type: 'obelisk', name: 'Rotting Totem', hidden: false },
		{ type: 'shrine', name: 'Weeping Shrine', hidden: true },
		{ type: 'ancient_tree', name: 'Hangman\'s Willow', hidden: false },
		{ type: 'hot_spring', name: 'Bubbling Mud Pool', hidden: true },
	],
	sunstone_expanse: [
		{ type: 'obelisk', name: 'Sandstone Pillar', hidden: false },
		{ type: 'ruins', name: 'Desert Temple', hidden: false },
		{ type: 'hidden_cave', name: 'Sand-Buried Vault', hidden: true },
		{ type: 'shrine', name: 'Oasis Shrine', hidden: false },
		{ type: 'standing_stones', name: 'Sun Dial Circle', hidden: false },
		{ type: 'hot_spring', name: 'Desert Oasis Pool', hidden: true },
		{ type: 'grave_site', name: 'Sand King\'s Tomb', hidden: true },
		{ type: 'ruins', name: 'Collapsed Minaret', hidden: false },
	],
	thornlands: [
		{ type: 'ruins', name: 'Rusted Aqueduct', hidden: false },
		{ type: 'obelisk', name: 'Republican Monument', hidden: false },
		{ type: 'hidden_cave', name: 'Smuggler\'s Tunnel', hidden: true },
		{ type: 'standing_stones', name: 'Iron Circle', hidden: false },
		{ type: 'grave_site', name: 'Founder\'s Cairn', hidden: false },
		{ type: 'shrine', name: 'Shrine of the Gears', hidden: true },
		{ type: 'ruins', name: 'Broken Automaton', hidden: false },
		{ type: 'hot_spring', name: 'Steam Vent', hidden: true },
	],
	pale_coast: [
		{ type: 'ruins', name: 'Lighthouse Ruins', hidden: false },
		{ type: 'obelisk', name: 'Hollow Sea Overlook', hidden: false },
		{ type: 'hidden_cave', name: 'Sea Cave', hidden: true },
		{ type: 'standing_stones', name: 'Driftwood Circle', hidden: false },
		{ type: 'shrine', name: 'Tidal Shrine', hidden: false },
		{ type: 'grave_site', name: 'Sailor\'s Memorial', hidden: true },
		{ type: 'hot_spring', name: 'Saltwater Geyser', hidden: true },
		{ type: 'ancient_tree', name: 'Bleached Driftwood Giant', hidden: false },
	],
	underdepths: [
		{ type: 'obelisk', name: 'Void Monolith', hidden: false },
		{ type: 'shrine', name: 'Echo Shrine', hidden: true },
		{ type: 'ruins', name: 'Collapsed Cathedral', hidden: false },
		{ type: 'hidden_cave', name: 'Fungal Hollow', hidden: true },
		{ type: 'standing_stones', name: 'Whispering Stalactites', hidden: false },
		{ type: 'grave_site', name: 'Forgotten Ossuary', hidden: true },
		{ type: 'hot_spring', name: 'Glowmoss Pool', hidden: true },
		{ type: 'ancient_tree', name: 'Rootvein Pillar', hidden: false },
	],
};

const MIN_POI_TO_SETTLEMENT_DIST = 12;
const MIN_POI_TO_ROAD_DIST = 5;
const MIN_POI_TO_POI_DIST = 10;

function placePOIs(tiles: OverworldTile[][], regionSeeds: Map<RegionId, Position>, settlements: Settlement[], width: number, height: number, rng: SeededRandom): PointOfInterest[] {
	const pois: PointOfInterest[] = [];
	let idCounter = 0;

	// Build a set of road tile positions for distance checking
	const roadTiles = new Set<string>();
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (tiles[y][x].road) roadTiles.add(`${x},${y}`);
		}
	}

	function nearRoad(pos: Position): boolean {
		for (let dy = -MIN_POI_TO_ROAD_DIST; dy <= MIN_POI_TO_ROAD_DIST; dy++) {
			for (let dx = -MIN_POI_TO_ROAD_DIST; dx <= MIN_POI_TO_ROAD_DIST; dx++) {
				if (Math.abs(dx) + Math.abs(dy) <= MIN_POI_TO_ROAD_DIST) {
					if (roadTiles.has(`${pos.x + dx},${pos.y + dy}`)) return true;
				}
			}
		}
		return false;
	}

	for (const regionId of SURFACE_REGIONS) {
		const center = regionSeeds.get(regionId)!;
		const templates = REGION_POIS[regionId];
		const count = rng.nextRange(3, 5);
		const shuffled = [...templates];
		rng.shuffle(shuffled);

		for (let i = 0; i < count && i < shuffled.length; i++) {
			const template = shuffled[i];
			let placed = false;

			for (let attempt = 0; attempt < 60 && !placed; attempt++) {
				const offset: Position = {
					x: center.x + rng.nextRange(-55, 55),
					y: center.y + rng.nextRange(-55, 55),
				};
				const clamped: Position = {
					x: Math.max(3, Math.min(width - 4, offset.x)),
					y: Math.max(3, Math.min(height - 4, offset.y)),
				};

				if (tiles[clamped.y]?.[clamped.x]?.region !== regionId) continue;

				const pos = findPassableTile(tiles, clamped, width, height, rng, 8);
				if (!pos) continue;
				if (tiles[pos.y][pos.x].region !== regionId) continue;
				if (tiles[pos.y][pos.x].locationId) continue;

				// Must be away from settlements
				if (settlements.some(s => distance(s.pos, pos) < MIN_POI_TO_SETTLEMENT_DIST)) continue;
				// Must be away from other POIs
				if (pois.some(p => distance(p.pos, pos) < MIN_POI_TO_POI_DIST)) continue;
				// Should be away from roads (off the beaten path)
				if (nearRoad(pos)) continue;

				const id = `poi_${idCounter++}`;
				pois.push({
					id, name: template.name, region: regionId,
					pos, type: template.type, hidden: template.hidden, discovered: false,
				});
				tiles[pos.y][pos.x].locationId = id;
				placed = true;
			}
		}
	}

	return pois;
}

// ── Road Network Generation (US-WG-05) ──

/** Movement cost for A* pathfinding through terrain. Higher = roads avoid it. */
const TERRAIN_ROAD_COST: Record<TerrainType, number> = {
	grass: 1, farmland: 1, sand: 2, ash: 2, scorched: 2,
	mud: 3, snow: 3, rock: 4, ice: 4, dead_trees: 3,
	forest: 3, swamp: 4, oasis: 2,
	water: 100, mountain: 100, lava: 100,
};

/** Determine road type based on the two connected settlements. */
function classifyRoad(a: Settlement, b: Settlement): RoadType {
	const major = new Set<SettlementType>(['town', 'city', 'fortress', 'harbor']);
	if (major.has(a.type) || major.has(b.type)) return 'main';
	return 'path';
}

/** Kruskal's MST over settlements, then add extra loop edges. */
function buildRoadGraph(settlements: Settlement[], rng: SeededRandom): { from: number; to: number }[] {
	if (settlements.length < 2) return [];

	// All edges sorted by distance
	const edges: { from: number; to: number; dist: number }[] = [];
	for (let i = 0; i < settlements.length; i++) {
		for (let j = i + 1; j < settlements.length; j++) {
			edges.push({ from: i, to: j, dist: distance(settlements[i].pos, settlements[j].pos) });
		}
	}
	edges.sort((a, b) => a.dist - b.dist);

	// Union-Find
	const parent = settlements.map((_, i) => i);
	function find(x: number): number {
		while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
		return x;
	}
	function union(a: number, b: number): boolean {
		const ra = find(a), rb = find(b);
		if (ra === rb) return false;
		parent[ra] = rb;
		return true;
	}

	// MST
	const mstEdges: { from: number; to: number }[] = [];
	const inMst = new Set<string>();
	for (const e of edges) {
		if (union(e.from, e.to)) {
			mstEdges.push({ from: e.from, to: e.to });
			inMst.add(`${e.from},${e.to}`);
		}
		if (mstEdges.length === settlements.length - 1) break;
	}

	// Add 2-3 extra short edges for loops
	const extraCount = rng.nextRange(2, 3);
	let added = 0;
	for (const e of edges) {
		if (added >= extraCount) break;
		const key = `${e.from},${e.to}`;
		if (!inMst.has(key)) {
			mstEdges.push({ from: e.from, to: e.to });
			inMst.add(key);
			added++;
		}
	}

	return mstEdges;
}

/** A* pathfinding between two positions, weighted by terrain cost. */
function findRoadPath(tiles: OverworldTile[][], width: number, height: number, start: Position, end: Position): Position[] {
	const key = (p: Position) => p.y * width + p.x;
	const heuristic = (p: Position) => Math.abs(p.x - end.x) + Math.abs(p.y - end.y);

	const gScore = new Map<number, number>();
	const fScore = new Map<number, number>();
	const cameFrom = new Map<number, number>();

	const startKey = key(start);
	gScore.set(startKey, 0);
	fScore.set(startKey, heuristic(start));

	// Simple priority queue (array sorted by fScore — fine for overworld-scale paths)
	const open: Position[] = [start];
	const inOpen = new Set<number>([startKey]);
	const closed = new Set<number>();

	while (open.length > 0) {
		// Pick lowest fScore
		let bestIdx = 0;
		let bestF = fScore.get(key(open[0]))!;
		for (let i = 1; i < open.length; i++) {
			const f = fScore.get(key(open[i]))!;
			if (f < bestF) { bestF = f; bestIdx = i; }
		}
		const current = open[bestIdx];
		const ck = key(current);

		if (current.x === end.x && current.y === end.y) {
			// Reconstruct path
			const path: Position[] = [];
			let k = ck;
			while (k !== undefined) {
				const y = Math.floor(k / width);
				const x = k % width;
				path.push({ x, y });
				k = cameFrom.get(k)!;
			}
			return path.reverse();
		}

		open.splice(bestIdx, 1);
		inOpen.delete(ck);
		closed.add(ck);

		const cg = gScore.get(ck)!;

		for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
			const nx = current.x + dx;
			const ny = current.y + dy;
			if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
			const nk = ny * width + nx;
			if (closed.has(nk)) continue;

			const terrain = tiles[ny][nx].terrain;
			const cost = TERRAIN_ROAD_COST[terrain];
			// Already-roaded tiles are cheaper to share
			const roadBonus = tiles[ny][nx].road ? 0.5 : 0;
			const tentG = cg + cost - roadBonus;

			if (tentG < (gScore.get(nk) ?? Infinity)) {
				cameFrom.set(nk, ck);
				gScore.set(nk, tentG);
				fScore.set(nk, tentG + heuristic({ x: nx, y: ny }));
				if (!inOpen.has(nk)) {
					open.push({ x: nx, y: ny });
					inOpen.add(nk);
				}
			}
		}
	}

	// No path found — return direct bresenham-like fallback
	return bresenhamPath(start, end);
}

/** Fallback straight-line path when A* fails. */
function bresenhamPath(start: Position, end: Position): Position[] {
	const path: Position[] = [];
	let x = start.x, y = start.y;
	const dx = Math.abs(end.x - x), dy = Math.abs(end.y - y);
	const sx = x < end.x ? 1 : -1, sy = y < end.y ? 1 : -1;
	let err = dx - dy;
	while (true) {
		path.push({ x, y });
		if (x === end.x && y === end.y) break;
		const e2 = 2 * err;
		if (e2 > -dy) { err -= dy; x += sx; }
		if (e2 < dx) { err += dx; y += sy; }
	}
	return path;
}

/** Generate all roads, paint them on tiles, and place signposts. */
function generateRoads(tiles: OverworldTile[][], settlements: Settlement[], width: number, height: number, rng: SeededRandom): Road[] {
	const graphEdges = buildRoadGraph(settlements, rng);
	const roads: Road[] = [];

	for (const edge of graphEdges) {
		const a = settlements[edge.from];
		const b = settlements[edge.to];
		const roadType = classifyRoad(a, b);
		const path = findRoadPath(tiles, width, height, a.pos, b.pos);

		// Paint road tiles (skip start/end which are settlements)
		for (let i = 1; i < path.length - 1; i++) {
			const p = path[i];
			const tile = tiles[p.y][p.x];
			// Don't downgrade a main road to a path
			if (!tile.road || (roadType === 'main' && tile.road === 'path')) {
				tile.road = roadType;
			}
		}

		roads.push({ from: a.id, to: b.id, type: roadType, path });
	}

	// Place signposts at intersections (tiles with 3+ adjacent road tiles)
	placeSignposts(tiles, width, height);

	return roads;
}

/** Mark tiles as signposts where 3+ cardinal neighbors are road tiles. */
function placeSignposts(tiles: OverworldTile[][], width: number, height: number): void {
	for (let y = 1; y < height - 1; y++) {
		for (let x = 1; x < width - 1; x++) {
			if (!tiles[y][x].road) continue;
			let roadNeighbors = 0;
			for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
				if (tiles[y + dy]?.[x + dx]?.road) roadNeighbors++;
			}
			if (roadNeighbors >= 3) {
				tiles[y][x].signpost = true;
			}
		}
	}
}

// ── Helpers ──

function isPassable(terrain: TerrainType): boolean {
	return terrain !== 'water' && terrain !== 'mountain' && terrain !== 'lava';
}

function findPassableTile(tiles: OverworldTile[][], near: Position, width: number, height: number, rng: SeededRandom, radius: number): Position | null {
	for (let attempt = 0; attempt < 50; attempt++) {
		const x = Math.max(1, Math.min(width - 2, near.x + rng.nextRange(-radius, radius)));
		const y = Math.max(1, Math.min(height - 2, near.y + rng.nextRange(-radius, radius)));
		if (tiles[y]?.[x] && isPassable(tiles[y][x].terrain)) {
			return { x, y };
		}
	}
	return null;
}

// ── Name Generation ──

const REGION_SYLLABLES: Record<RegionId, { prefixes: string[]; suffixes: string[] }> = {
	greenweald: { prefixes: ['Elm', 'Oak', 'Fern', 'Moss', 'Willow', 'Leaf', 'Thorn', 'Ivy'], suffixes: ['dale', 'grove', 'hollow', 'glade', 'wood', 'brook', 'haven'] },
	ashlands: { prefixes: ['Char', 'Slag', 'Cinder', 'Ember', 'Scorch', 'Blaze', 'Iron'], suffixes: ['forge', 'pit', 'hold', 'maw', 'scar', 'peak', 'keep'] },
	hearthlands: { prefixes: ['Cross', 'Mill', 'Stone', 'Bridge', 'Kings', 'Fair', 'Gold'], suffixes: ['ford', 'bury', 'stead', 'gate', 'field', 'haven', 'wick'] },
	frostpeak: { prefixes: ['Frost', 'Ice', 'Grim', 'Iron', 'Stone', 'Rune', 'Deep'], suffixes: ['helm', 'hold', 'forge', 'mine', 'hall', 'peak', 'barrow'] },
	drowned_mire: { prefixes: ['Bog', 'Mist', 'Rot', 'Shade', 'Murk', 'Gloom', 'Wither'], suffixes: ['fen', 'marsh', 'moor', 'pool', 'shade', 'hollow', 'reach'] },
	sunstone_expanse: { prefixes: ['Sun', 'Star', 'Sand', 'Gold', 'Dust', 'Opal', 'Dawn'], suffixes: ['watch', 'spire', 'haven', 'spring', 'gate', 'well', 'crest'] },
	thornlands: { prefixes: ['Iron', 'Thorn', 'Rust', 'Bolt', 'Gear', 'Anvil', 'Brass'], suffixes: ['gate', 'wall', 'ridge', 'fall', 'hold', 'works', 'keep'] },
	pale_coast: { prefixes: ['Sea', 'Tide', 'Drift', 'Salt', 'Shell', 'Coral', 'Mist'], suffixes: ['port', 'haven', 'cove', 'bay', 'watch', 'reach', 'landing'] },
	underdepths: { prefixes: ['Deep', 'Void', 'Echo', 'Shadow', 'Abyss', 'Glyph'], suffixes: ['fall', 'maw', 'core', 'vault', 'depth', 'reach'] },
};

function generateSettlementName(regionId: RegionId, rng: SeededRandom): string {
	const { prefixes, suffixes } = REGION_SYLLABLES[regionId];
	return rng.pick(prefixes) + rng.pick(suffixes);
}

const DUNGEON_PREFIXES: Record<RegionId, string[]> = {
	greenweald: ['Overgrown Ruins', 'Root Tunnels', 'Fey Hollow', 'Ancient Grove', 'Spider Nest', 'Druid Catacombs', 'Mosscrypt'],
	ashlands: ['Volcanic Cavern', 'Goblin Warren', 'Obsidian Vault', 'Firepits', 'Charred Depths', 'Warlord\'s Tomb', 'Magma Rift'],
	hearthlands: ['Castle Basement', 'Bandit Hideout', 'Old Sewers', 'Abandoned Mine', 'Thieves\' Tunnels', 'Crypt of Kings', 'Smuggler\'s Cellar'],
	frostpeak: ['Ice Cave', 'Collapsed Mine', 'Frozen Tomb', 'Crystal Cavern', 'Glacial Rift', 'Thane\'s Barrow', 'Runebound Vault'],
	drowned_mire: ['Sunken Temple', 'Flooded Crypt', 'Hag Lair', 'Bone Grotto', 'Plague Pit', 'Drowned Cellars', 'Spirit Hollow'],
	sunstone_expanse: ['Buried Pyramid', 'Sand Ruins', 'Oasis Grotto', 'Tomb of Kings', 'Sandworm Tunnels', 'Star Chamber', 'Pharaoh\'s Vault'],
	thornlands: ['Collapsed Foundry', 'Iron Citadel Ruins', 'Thornwild Tunnels', 'Underground Forge', 'Gear Works', 'Republican Vault', 'Automaton Crypt'],
	pale_coast: ['Flooded Caverns', 'Smuggler\'s Cove', 'Sunken Ship Hold', 'Tidal Passage', 'Sea Witch Grotto', 'Coral Labyrinth', 'Drowned Archives'],
	underdepths: ['Abyssal Pit', 'Fungal Network', 'Crystal Depths', 'Echo Vault', 'Void Fissure', 'Worm Tunnels', 'Shaper\'s Passage'],
};

function generateDungeonName(regionId: RegionId, rng: SeededRandom): string {
	return rng.pick(DUNGEON_PREFIXES[regionId]);
}

// ── ASCII Rendering (for terrain visualization) ──

export const TERRAIN_DISPLAY: Record<TerrainType, { char: string; color: string }> = {
	grass:      { char: '.', color: '#4a4' },
	forest:     { char: 'T', color: '#2a2' },
	mountain:   { char: '^', color: '#888' },
	water:      { char: '~', color: '#48f' },
	sand:       { char: ':', color: '#da4' },
	snow:       { char: '*', color: '#ddf' },
	swamp:      { char: '%', color: '#4a4' },
	lava:       { char: '&', color: '#f40' },
	rock:       { char: '#', color: '#666' },
	ice:        { char: '=', color: '#8df' },
	mud:        { char: ',', color: '#864' },
	ash:        { char: '.', color: '#555' },
	scorched:   { char: '.', color: '#a60' },
	farmland:   { char: '"', color: '#aa4' },
	oasis:      { char: 'o', color: '#4da' },
	dead_trees: { char: 't', color: '#654' },
};

// ── Region Statistics (for validation) ──

export function getRegionTileCounts(world: WorldMap): Record<RegionId, number> {
	const counts: Partial<Record<RegionId, number>> = {};
	for (let y = 0; y < world.height; y++) {
		for (let x = 0; x < world.width; x++) {
			const region = world.tiles[y][x].region;
			counts[region] = (counts[region] ?? 0) + 1;
		}
	}
	return counts as Record<RegionId, number>;
}

export function getRegionTerrainDistribution(world: WorldMap, regionId: RegionId): Record<TerrainType, number> {
	const counts: Partial<Record<TerrainType, number>> = {};
	for (let y = 0; y < world.height; y++) {
		for (let x = 0; x < world.width; x++) {
			if (world.tiles[y][x].region === regionId) {
				const terrain = world.tiles[y][x].terrain;
				counts[terrain] = (counts[terrain] ?? 0) + 1;
			}
		}
	}
	return counts as Record<TerrainType, number>;
}
