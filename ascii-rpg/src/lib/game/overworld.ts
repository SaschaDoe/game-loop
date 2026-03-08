/**
 * Overworld generation: 7 regions on a large grid with biome-specific terrain.
 * US-WG-02: Region placement via Voronoi partitioning
 * US-WG-03: Terrain generation per region
 */
import type { Position, StartingLocation } from './types';
import { SeededRandom, hashSeed, createRng } from './seeded-random';

// ── Region & Terrain Types ──

export type RegionId = 'greenweald' | 'ashlands' | 'hearthlands' | 'frostpeak' | 'drowned_mire' | 'sunstone_expanse' | 'underdepths';

export type TerrainType =
	| 'grass' | 'forest' | 'mountain' | 'water' | 'sand'
	| 'snow' | 'swamp' | 'lava' | 'rock' | 'ice' | 'mud' | 'ash'
	| 'scorched' | 'farmland' | 'oasis' | 'dead_trees';

export type RoadType = 'main' | 'path';

export type SettlementType = 'village' | 'town' | 'city' | 'camp' | 'fortress';

export interface OverworldTile {
	terrain: TerrainType;
	region: RegionId;
	road?: RoadType;
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

export interface WorldMap {
	width: number;
	height: number;
	tiles: OverworldTile[][];
	regions: Region[];
	settlements: Settlement[];
	dungeonEntrances: DungeonEntrance[];
	explored: boolean[][];
}

// ── Constants ──

export const WORLD_W = 200;
export const WORLD_H = 200;

/** Surface regions (6) — Underdepths is underground, not placed on surface */
const SURFACE_REGIONS: RegionId[] = ['greenweald', 'ashlands', 'hearthlands', 'frostpeak', 'drowned_mire', 'sunstone_expanse'];

export const REGION_DEFS: Record<RegionId, { name: string; language: string; dangerLevel: number }> = {
	greenweald:       { name: 'The Greenweald',       language: 'Elvish',       dangerLevel: 1 },
	hearthlands:      { name: 'The Hearthlands',      language: 'Common',       dangerLevel: 2 },
	ashlands:         { name: 'The Ashlands',          language: 'Orcish',       dangerLevel: 4 },
	drowned_mire:     { name: 'The Drowned Mire',      language: 'Whispertongue', dangerLevel: 5 },
	frostpeak:        { name: 'Frostpeak Reach',       language: 'Runic',        dangerLevel: 6 },
	sunstone_expanse: { name: 'The Sunstone Expanse',  language: 'Sandscript',   dangerLevel: 7 },
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
 * Place 6 region seed points using Poisson-disk-like sampling.
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

	// 10. Initialize explored grid (all hidden)
	const explored: boolean[][] = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => false)
	);

	return { width, height, tiles, regions, settlements, dungeonEntrances, explored };
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
			const type = rng.pick<SettlementType>(['village', 'town', 'camp']);
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
	underdepths: { prefixes: ['Deep', 'Void', 'Echo', 'Shadow', 'Abyss', 'Glyph'], suffixes: ['fall', 'maw', 'core', 'vault', 'depth', 'reach'] },
};

function generateSettlementName(regionId: RegionId, rng: SeededRandom): string {
	const { prefixes, suffixes } = REGION_SYLLABLES[regionId];
	return rng.pick(prefixes) + rng.pick(suffixes);
}

const DUNGEON_PREFIXES: Record<RegionId, string[]> = {
	greenweald: ['Overgrown Ruins', 'Root Tunnels', 'Fey Hollow', 'Ancient Grove'],
	ashlands: ['Volcanic Cavern', 'Goblin Warren', 'Obsidian Vault', 'Firepits'],
	hearthlands: ['Castle Basement', 'Bandit Hideout', 'Old Sewers', 'Abandoned Mine'],
	frostpeak: ['Ice Cave', 'Collapsed Mine', 'Frozen Tomb', 'Crystal Cavern'],
	drowned_mire: ['Sunken Temple', 'Flooded Crypt', 'Hag Lair', 'Bone Grotto'],
	sunstone_expanse: ['Buried Pyramid', 'Sand Ruins', 'Oasis Grotto', 'Tomb of Kings'],
	underdepths: ['Abyssal Pit', 'Fungal Network', 'Crystal Depths', 'Echo Vault'],
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
