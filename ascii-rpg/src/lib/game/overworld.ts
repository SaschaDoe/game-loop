/**
 * Overworld generation: 7 regions on a large grid with biome-specific terrain.
 * US-WG-02: Region placement via Voronoi partitioning
 * US-WG-03: Terrain generation per region
 * US-WG-05: Road network connecting settlements
 */
import type { Position, StartingLocation } from './types';
import { SeededRandom, hashSeed, createRng } from './seeded-random';

// ── Region & Terrain Types ──

export type RegionId = 'greenweald' | 'ashlands' | 'hearthlands' | 'frostpeak' | 'drowned_mire' | 'sunstone_expanse' | 'thornlands' | 'pale_coast' | 'glassfields' | 'verdant_deep' | 'mirrow_wastes' | 'silence_peaks' | 'timeless_wastes' | 'hollow_sea' | 'grey_wastes' | 'korthaven' | 'eldergrove' | 'stormcradle' | 'luminara_ruins' | 'duskhollow' | 'irongate' | 'arcane_conservatory' | 'gallowmere' | 'underdepths';

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
	leyLine?: 'core' | 'aura' | 'convergence';
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
	leyLines: {
		northSouth: number[]; // x-coordinate per y-row
		westEast: number[];   // y-coordinate per x-column
	};
}

// ── Constants ──

export const WORLD_W = 200;
export const WORLD_H = 200;

/** Surface regions (21) — Underdepths is underground, not placed on surface */
const SURFACE_REGIONS: RegionId[] = ['greenweald', 'ashlands', 'hearthlands', 'frostpeak', 'drowned_mire', 'sunstone_expanse', 'thornlands', 'pale_coast', 'glassfields', 'verdant_deep', 'mirrow_wastes', 'silence_peaks', 'timeless_wastes', 'hollow_sea', 'grey_wastes', 'korthaven', 'eldergrove', 'stormcradle', 'luminara_ruins', 'duskhollow', 'irongate', 'arcane_conservatory', 'gallowmere'];

export const REGION_DEFS: Record<RegionId, { name: string; language: string; dangerLevel: number }> = {
	greenweald:       { name: 'The Greenweald',       language: 'Elvish',       dangerLevel: 1 },
	hearthlands:      { name: 'The Hearthlands',      language: 'Common',       dangerLevel: 2 },
	ashlands:         { name: 'The Ashlands',          language: 'Orcish',       dangerLevel: 4 },
	drowned_mire:     { name: 'The Drowned Mire',      language: 'Whispertongue', dangerLevel: 5 },
	frostpeak:        { name: 'Frostpeak Reach',       language: 'Runic',        dangerLevel: 6 },
	sunstone_expanse: { name: 'The Sunstone Expanse',  language: 'Sandscript',   dangerLevel: 7 },
	thornlands:       { name: 'The Thornlands',        language: 'Old Iron',     dangerLevel: 3 },
	pale_coast:       { name: 'The Pale Coast',        language: 'Tidespeak',    dangerLevel: 4 },
	glassfields:      { name: 'The Glassfields',       language: 'Prismatic',    dangerLevel: 8 },
	verdant_deep:     { name: 'The Verdant Deep',      language: 'Greentongue',  dangerLevel: 5 },
	mirrow_wastes:    { name: 'The Mirrow Wastes',     language: 'Mirrow',       dangerLevel: 9 },
	silence_peaks:    { name: 'The Silence Peaks',     language: 'Knotweave',    dangerLevel: 6 },
	timeless_wastes:  { name: 'The Timeless Wastes',   language: 'Chronoscript', dangerLevel: 7 },
	hollow_sea:       { name: 'The Hollow Sea',        language: 'Dominion Aquatic', dangerLevel: 8 },
	grey_wastes:      { name: 'The Grey Wastes',       language: 'Old Primal',       dangerLevel: 7 },
	korthaven:        { name: 'Korthaven',             language: 'Trade Common',     dangerLevel: 3 },
	eldergrove:       { name: 'The Eldergrove',        language: 'Sylvan',           dangerLevel: 5 },
	stormcradle:      { name: 'The Stormcradle',       language: 'Storm Cant',       dangerLevel: 6 },
	luminara_ruins:   { name: 'The Luminara Ruins',    language: 'Luminari Script',  dangerLevel: 7 },
	duskhollow:       { name: 'Duskhollow',            language: 'Twilight Cant',    dangerLevel: 6 },
	irongate:              { name: 'Irongate',              language: 'Old Iron',         dangerLevel: 8 },
	arcane_conservatory:   { name: 'The Arcane Conservatory', language: 'Arcane Script',    dangerLevel: 4 },
	gallowmere:           { name: 'Gallowmere',             language: 'Old Solanthine',   dangerLevel: 5 },
	underdepths:      { name: 'The Underdepths',       language: 'Deepscript',   dangerLevel: 10 },
};

/** Which starting location belongs to which region */
const STARTING_REGION: Record<StartingLocation, RegionId> = {
	village: 'greenweald',
	tavern: 'hearthlands',
	cave: 'ashlands',
	academy: 'arcane_conservatory',
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
	glassfields: [
		{ terrain: 'ice', weight: 35 },
		{ terrain: 'rock', weight: 25 },
		{ terrain: 'sand', weight: 25 },
		{ terrain: 'grass', weight: 10 },
		{ terrain: 'water', weight: 5 },
	],
	verdant_deep: [
		{ terrain: 'forest', weight: 55 },
		{ terrain: 'swamp', weight: 15 },
		{ terrain: 'water', weight: 15 },
		{ terrain: 'grass', weight: 10 },
		{ terrain: 'mud', weight: 5 },
	],
	mirrow_wastes: [
		{ terrain: 'dead_trees', weight: 30 },
		{ terrain: 'scorched', weight: 25 },
		{ terrain: 'mud', weight: 20 },
		{ terrain: 'grass', weight: 15 },
		{ terrain: 'water', weight: 10 },
	],
	silence_peaks: [
		{ terrain: 'mountain', weight: 40 },
		{ terrain: 'rock', weight: 30 },
		{ terrain: 'snow', weight: 20 },
		{ terrain: 'grass', weight: 10 },
	],
	timeless_wastes: [
		{ terrain: 'sand', weight: 30 },
		{ terrain: 'rock', weight: 30 },
		{ terrain: 'ice', weight: 20 },
		{ terrain: 'grass', weight: 10 },
		{ terrain: 'water', weight: 10 },
	],
	hollow_sea: [
		{ terrain: 'water', weight: 45 },
		{ terrain: 'sand', weight: 25 },
		{ terrain: 'rock', weight: 15 },
		{ terrain: 'swamp', weight: 10 },
		{ terrain: 'grass', weight: 5 },
	],
	grey_wastes: [
		{ terrain: 'dead_trees', weight: 30 },
		{ terrain: 'ash', weight: 25 },
		{ terrain: 'rock', weight: 20 },
		{ terrain: 'mud', weight: 15 },
		{ terrain: 'grass', weight: 10 },
	],
	korthaven: [
		{ terrain: 'farmland', weight: 35 },
		{ terrain: 'grass', weight: 30 },
		{ terrain: 'rock', weight: 15 },
		{ terrain: 'water', weight: 10 },
		{ terrain: 'forest', weight: 10 },
	],
	eldergrove: [
		{ terrain: 'forest', weight: 78 },
		{ terrain: 'grass', weight: 8 },
		{ terrain: 'water', weight: 7 },
		{ terrain: 'mountain', weight: 4 },
		{ terrain: 'swamp', weight: 3 },
	],
	stormcradle: [
		{ terrain: 'rock', weight: 35 },
		{ terrain: 'mountain', weight: 25 },
		{ terrain: 'grass', weight: 20 },
		{ terrain: 'water', weight: 10 },
		{ terrain: 'sand', weight: 10 },
	],
	luminara_ruins: [
		{ terrain: 'rock', weight: 35 },
		{ terrain: 'sand', weight: 25 },
		{ terrain: 'grass', weight: 15 },
		{ terrain: 'ice', weight: 15 },
		{ terrain: 'ash', weight: 10 },
	],
	duskhollow: [
		{ terrain: 'forest', weight: 40 },
		{ terrain: 'swamp', weight: 20 },
		{ terrain: 'grass', weight: 15 },
		{ terrain: 'water', weight: 15 },
		{ terrain: 'mud', weight: 10 },
	],
	irongate: [
		{ terrain: 'rock', weight: 40 },
		{ terrain: 'lava', weight: 15 },
		{ terrain: 'scorched', weight: 15 },
		{ terrain: 'mountain', weight: 15 },
		{ terrain: 'ash', weight: 15 },
	],
	arcane_conservatory: [
		{ terrain: 'grass', weight: 40 },
		{ terrain: 'rock', weight: 25 },
		{ terrain: 'water', weight: 15 },
		{ terrain: 'forest', weight: 10 },
		{ terrain: 'mountain', weight: 10 },
	],
	gallowmere: [
		{ terrain: 'farmland', weight: 30 },
		{ terrain: 'grass', weight: 25 },
		{ terrain: 'dead_trees', weight: 20 },
		{ terrain: 'rock', weight: 15 },
		{ terrain: 'mud', weight: 10 },
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
 * Place 21 region seed points using Poisson-disk-like sampling.
 * Ensures minimum spacing between points.
 */
function placeRegionSeeds(width: number, height: number, rng: SeededRandom): Map<RegionId, Position> {
	const minDist = Math.min(width, height) * 0.14; // ~28 tiles apart minimum
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

	// 10b. Generate ley lines crossing at the academy
	const leyLines = generateLeyLines(tiles, settlements, width, height, rng);

	// 10c. Place Thornfield Farm on the W-E ley line in hearthlands
	const hearthCenter = regionSeeds.get('hearthlands');
	if (hearthCenter && leyLines) {
		// Search along the W-E ley line within hearthlands
		let farmPos: Position | null = null;
		for (let dx = 0; dx < 40; dx++) {
			for (const sign of [1, -1]) {
				const tx = hearthCenter.x + dx * sign;
				if (tx >= 5 && tx < width - 5) {
					const ty = leyLines.westEast[tx];
					if (ty >= 5 && ty < height - 5 &&
						tiles[ty]?.[tx]?.region === 'hearthlands' &&
						!tiles[ty][tx].locationId &&
						settlements.every(s => Math.abs(s.pos.x - tx) + Math.abs(s.pos.y - ty) > 10)) {
						farmPos = { x: tx, y: ty };
						break;
					}
				}
			}
			if (farmPos) break;
		}
		if (farmPos) {
			const farmId = `settlement_${settlements.length}`;
			settlements.push({
				id: farmId,
				name: 'Thornfield Farm',
				region: 'hearthlands',
				pos: farmPos,
				type: 'village',
			});
			tiles[farmPos.y][farmPos.x].locationId = farmId;
		}
	}

	// 11. Place points of interest (after roads, so we can avoid them)
	const pois = placePOIs(tiles, regionSeeds, settlements, width, height, rng);

	// 12. Initialize explored grid (all hidden)
	const explored: boolean[][] = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => false)
	);

	return { width, height, tiles, regions, settlements, dungeonEntrances, roads, pois, explored, leyLines };
}

// ── Ley Line Generation ──

/**
 * Generate two ley lines (N-S and W-E) that cross at the Arcane Academy.
 * Each line wobbles organically (±1 per step) using the seeded RNG.
 * Tiles are marked: convergence (3×3 around academy), core (on the line), aura (2 tiles each side).
 */
function generateLeyLines(
	tiles: OverworldTile[][],
	settlements: Settlement[],
	width: number,
	height: number,
	rng: SeededRandom,
): { northSouth: number[]; westEast: number[] } {
	// Find the academy position as the crossing point
	const academy = settlements.find(s => s.name === 'Arcane Academy');
	const crossX = academy ? academy.pos.x : Math.floor(width / 2);
	const crossY = academy ? academy.pos.y : Math.floor(height / 2);

	// Generate N-S line: one x per y-row, wobbling from crossX
	const northSouth: number[] = new Array(height);
	northSouth[crossY] = crossX;
	// Walk upward from crossing
	for (let y = crossY - 1; y >= 0; y--) {
		const prev = northSouth[y + 1];
		const wobble = rng.nextRange(-1, 1);
		northSouth[y] = Math.max(0, Math.min(width - 1, prev + wobble));
	}
	// Walk downward from crossing
	for (let y = crossY + 1; y < height; y++) {
		const prev = northSouth[y - 1];
		const wobble = rng.nextRange(-1, 1);
		northSouth[y] = Math.max(0, Math.min(width - 1, prev + wobble));
	}

	// Generate W-E line: one y per x-column, wobbling from crossY
	const westEast: number[] = new Array(width);
	westEast[crossX] = crossY;
	// Walk leftward from crossing
	for (let x = crossX - 1; x >= 0; x--) {
		const prev = westEast[x + 1];
		const wobble = rng.nextRange(-1, 1);
		westEast[x] = Math.max(0, Math.min(height - 1, prev + wobble));
	}
	// Walk rightward from crossing
	for (let x = crossX + 1; x < width; x++) {
		const prev = westEast[x - 1];
		const wobble = rng.nextRange(-1, 1);
		westEast[x] = Math.max(0, Math.min(height - 1, prev + wobble));
	}

	// Mark convergence zone: 3×3 around the academy
	for (let dy = -1; dy <= 1; dy++) {
		for (let dx = -1; dx <= 1; dx++) {
			const tx = crossX + dx;
			const ty = crossY + dy;
			if (tx >= 0 && tx < width && ty >= 0 && ty < height) {
				tiles[ty][tx].leyLine = 'convergence';
			}
		}
	}

	// Mark N-S line: core on the line, aura 1-2 tiles each side
	for (let y = 0; y < height; y++) {
		const cx = northSouth[y];
		// Aura first (so core can override)
		for (let offset = -2; offset <= 2; offset++) {
			if (offset === 0) continue; // skip core position
			const ax = cx + offset;
			if (ax >= 0 && ax < width && !tiles[y][ax].leyLine) {
				tiles[y][ax].leyLine = 'aura';
			}
		}
		// Core on the line itself (overrides aura, but not convergence)
		if (tiles[y][cx].leyLine !== 'convergence') {
			tiles[y][cx].leyLine = 'core';
		}
	}

	// Mark W-E line: core on the line, aura 1-2 tiles each side
	for (let x = 0; x < width; x++) {
		const cy = westEast[x];
		// Aura first (so core can override)
		for (let offset = -2; offset <= 2; offset++) {
			if (offset === 0) continue;
			const ay = cy + offset;
			if (ay >= 0 && ay < height && !tiles[ay][x].leyLine) {
				tiles[ay][x].leyLine = 'aura';
			}
		}
		// Core on the line itself (overrides aura, but not convergence)
		if (tiles[cy][x].leyLine !== 'convergence') {
			tiles[cy][x].leyLine = 'core';
		}
	}

	return { northSouth, westEast };
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
		{ start: 'academy', name: 'Arcane Academy', type: 'town' },
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

	// 2. Place Korthaven — the grand trade city — near the center of its region
	{
		const kortCenter = regionSeeds.get('korthaven')!;
		const kortPos = findPassableTile(tiles, kortCenter, width, height, rng, 20);
		if (kortPos) {
			const id = `settlement_${idCounter++}`;
			settlements.push({ id, name: 'Korthaven', region: 'korthaven', pos: kortPos, type: 'city' });
			tiles[kortPos.y][kortPos.x].locationId = id;
		}
	}

	// 3. Place 2-3 additional settlements per region
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
	glassfields: [
		{ type: 'obelisk', name: 'Prismatic Obelisk', hidden: false },
		{ type: 'ruins', name: 'Crystal Citadel', hidden: false },
		{ type: 'standing_stones', name: 'Refraction Ring', hidden: false },
		{ type: 'hidden_cave', name: 'Chromatic Grotto', hidden: true },
		{ type: 'shrine', name: 'Shrine of Fractured Light', hidden: false },
		{ type: 'grave_site', name: 'Luminari Cenotaph', hidden: true },
		{ type: 'hot_spring', name: 'Mana Wellspring', hidden: true },
		{ type: 'ancient_tree', name: 'Vitrified Oak', hidden: false },
	],
	verdant_deep: [
		{ type: 'ancient_tree', name: 'The Heartwood', hidden: false },
		{ type: 'shrine', name: 'Druid\'s Altar', hidden: false },
		{ type: 'ruins', name: 'Overgrown Temple', hidden: false },
		{ type: 'hidden_cave', name: 'Ley Line Grotto', hidden: true },
		{ type: 'standing_stones', name: 'Primordialist Circle', hidden: false },
		{ type: 'hot_spring', name: 'Bioluminescent Pool', hidden: true },
		{ type: 'grave_site', name: 'Grey Pilgrim\'s Rest', hidden: true },
		{ type: 'obelisk', name: 'Voidbloom Spire', hidden: false },
	],
	mirrow_wastes: [
		{ type: 'ruins', name: 'Mirrow Ford', hidden: false },
		{ type: 'standing_stones', name: 'Widow\'s Crossing', hidden: false },
		{ type: 'grave_site', name: 'Soldier\'s Ossuary', hidden: false },
		{ type: 'hidden_cave', name: 'Theron\'s Workshop', hidden: true },
		{ type: 'shrine', name: 'Stoneblood Shallows', hidden: false },
		{ type: 'obelisk', name: 'Cenotaph of Two Crowns', hidden: false },
		{ type: 'hot_spring', name: 'Weeping Spring', hidden: true },
		{ type: 'ancient_tree', name: 'The Grieving Elm', hidden: true },
	],
	silence_peaks: [
		{ type: 'shrine', name: 'Monastery of Closed Eyes', hidden: false },
		{ type: 'standing_stones', name: 'The Echo Gardens', hidden: false },
		{ type: 'ruins', name: 'Silent Temple', hidden: false },
		{ type: 'hidden_cave', name: 'Acoustic Vault', hidden: true },
		{ type: 'obelisk', name: 'Pho-Lumen\'s Scar', hidden: false },
		{ type: 'grave_site', name: 'Monk\'s Cairn', hidden: true },
		{ type: 'hot_spring', name: 'Stillwater Basin', hidden: true },
		{ type: 'ancient_tree', name: 'The Mute Pine', hidden: false },
	],
	timeless_wastes: [
		{ type: 'obelisk', name: 'Chronos\' Wound', hidden: false },
		{ type: 'standing_stones', name: 'The Fractured Hours', hidden: false },
		{ type: 'ruins', name: 'Eternal Noon', hidden: false },
		{ type: 'hidden_cave', name: 'Rewind Grotto', hidden: true },
		{ type: 'shrine', name: 'Shrine of Frozen Moments', hidden: false },
		{ type: 'grave_site', name: 'The Looping Grave', hidden: true },
		{ type: 'hot_spring', name: 'Ageless Pool', hidden: true },
		{ type: 'ancient_tree', name: 'The Year-Ring Oak', hidden: false },
	],
	hollow_sea: [
		{ type: 'obelisk', name: 'The Shimmer Strait', hidden: false },
		{ type: 'ruins', name: 'Pelagathis Overlook', hidden: false },
		{ type: 'standing_stones', name: 'Coral Monoliths', hidden: false },
		{ type: 'hidden_cave', name: 'Biolume Grotto', hidden: true },
		{ type: 'shrine', name: 'Tidal Altar of Dro-Mahk', hidden: false },
		{ type: 'grave_site', name: 'Drowned Captain\'s Cairn', hidden: true },
		{ type: 'hot_spring', name: 'Thermal Vent Pool', hidden: true },
		{ type: 'ancient_tree', name: 'The Salt-Bleached Sentinel', hidden: false },
	],
	grey_wastes: [
		{ type: 'standing_stones', name: 'Grief\'s Circle', hidden: false },
		{ type: 'ruins', name: 'Veiled Hand Outpost', hidden: false },
		{ type: 'obelisk', name: 'The Scar Trench Overlook', hidden: false },
		{ type: 'hidden_cave', name: 'The Hollow Vein', hidden: true },
		{ type: 'shrine', name: 'Pilgrim\'s Altar', hidden: false },
		{ type: 'grave_site', name: 'Ossuary Plain', hidden: false },
		{ type: 'hot_spring', name: 'Ash-Memory Pool', hidden: true },
		{ type: 'ancient_tree', name: 'The Petrified Grove Heart', hidden: true },
	],
	korthaven: [
		{ type: 'ruins', name: 'Old Trade Road Pillars', hidden: false },
		{ type: 'shrine', name: 'Merchant\'s Chapel', hidden: false },
		{ type: 'standing_stones', name: 'The Founder\'s Circle', hidden: false },
		{ type: 'hidden_cave', name: 'Smuggler\'s Tunnel', hidden: true },
		{ type: 'grave_site', name: 'Gallows Hill', hidden: false },
		{ type: 'obelisk', name: 'The Golden Mile Marker', hidden: false },
		{ type: 'hot_spring', name: 'Noble\'s Bath Ruins', hidden: true },
		{ type: 'ruins', name: 'Collapsed Aqueduct', hidden: true },
	],
	eldergrove: [
		{ type: 'ancient_tree', name: 'The Worldseed Tree', hidden: false },
		{ type: 'ruins', name: 'Temple of the Forgotten Moon', hidden: false },
		{ type: 'shrine', name: 'Sylvan Shrine', hidden: false },
		{ type: 'standing_stones', name: 'Starlight Menhirs', hidden: false },
		{ type: 'hidden_cave', name: 'Bandit King\'s Hollow', hidden: true },
		{ type: 'hot_spring', name: 'Moonwell', hidden: true },
		{ type: 'grave_site', name: 'Elven Barrow', hidden: true },
		{ type: 'obelisk', name: 'Canopy Spire', hidden: false },
		{ type: 'ancient_tree', name: 'The Rootmother\'s Embrace', hidden: false },
		{ type: 'hidden_cave', name: 'Spider Queen\'s Lair', hidden: true },
		{ type: 'ruins', name: 'Overgrown Watchtower', hidden: false },
		{ type: 'shrine', name: 'Moonpetal Glade', hidden: true },
		{ type: 'hot_spring', name: 'Starlight Pool', hidden: true },
		{ type: 'standing_stones', name: 'The Singing Stones', hidden: false },
		{ type: 'grave_site', name: 'Warden\'s Grave', hidden: true },
		{ type: 'hidden_cave', name: 'Herb Grotto', hidden: true },
	],
	stormcradle: [
		{ type: 'ruins', name: 'Shattered Lightning Temple', hidden: false },
		{ type: 'standing_stones', name: 'Thundercrown Circle', hidden: false },
		{ type: 'shrine', name: 'Storm Altar', hidden: false },
		{ type: 'obelisk', name: 'The Fulgurite Spire', hidden: false },
		{ type: 'hidden_cave', name: 'Glazed Tunnel Entrance', hidden: true },
		{ type: 'hot_spring', name: 'Lightning Glass Pool', hidden: true },
		{ type: 'grave_site', name: 'Storm Warden\'s Cairn', hidden: true },
		{ type: 'ancient_tree', name: 'The Charred Sentinel', hidden: false },
	],
	luminara_ruins: [
		{ type: 'ruins', name: 'The Ash Library', hidden: false },
		{ type: 'standing_stones', name: 'Philosopher\'s Garden Columns', hidden: false },
		{ type: 'shrine', name: 'Shrine of the Last Scholar', hidden: false },
		{ type: 'obelisk', name: 'The Inscription Wall', hidden: false },
		{ type: 'hidden_cave', name: 'Temporal Pocket', hidden: true },
		{ type: 'hot_spring', name: 'Frozen Fountain', hidden: true },
		{ type: 'grave_site', name: 'Arcanist\'s Cenotaph', hidden: true },
		{ type: 'ancient_tree', name: 'The Petrified Scholar-Tree', hidden: false },
	],
	duskhollow: [
		{ type: 'ruins', name: 'The Flickering Court', hidden: false },
		{ type: 'standing_stones', name: 'Spirit Bridge Pillars', hidden: false },
		{ type: 'shrine', name: 'Shrine of the Thin Place', hidden: false },
		{ type: 'obelisk', name: 'The Membrane Stone', hidden: false },
		{ type: 'hidden_cave', name: 'Passage Between', hidden: true },
		{ type: 'hot_spring', name: 'Ghostwater Pool', hidden: true },
		{ type: 'grave_site', name: 'Twilight Elder\'s Barrow', hidden: true },
		{ type: 'ancient_tree', name: 'The Half-Visible Oak', hidden: false },
	],
	irongate: [
		{ type: 'ruins', name: 'The Great Forge', hidden: false },
		{ type: 'standing_stones', name: 'Republican Columns', hidden: false },
		{ type: 'shrine', name: 'Centurion\'s Memorial', hidden: false },
		{ type: 'obelisk', name: 'The Broken Chain Monument', hidden: false },
		{ type: 'hidden_cave', name: 'The Collapsed Tunnel', hidden: true },
		{ type: 'hot_spring', name: 'Forge Vent Pool', hidden: true },
		{ type: 'grave_site', name: 'The Soldiers\' Cairn', hidden: true },
		{ type: 'ancient_tree', name: 'The Iron-Root Oak', hidden: false },
	],
	arcane_conservatory: [
		{ type: 'ruins', name: 'The Old Lecture Hall', hidden: false },
		{ type: 'standing_stones', name: 'The Founder\'s Circle', hidden: false },
		{ type: 'shrine', name: 'Shrine of the First Flame', hidden: false },
		{ type: 'obelisk', name: 'The Curriculum Stone', hidden: false },
		{ type: 'hidden_cave', name: 'The Headmaster\'s Secret Vault', hidden: true },
		{ type: 'hot_spring', name: 'The Reflecting Pool', hidden: true },
		{ type: 'grave_site', name: 'Memorial to Fallen Scholars', hidden: true },
		{ type: 'ancient_tree', name: 'The Wisdom Oak', hidden: false },
		{ type: 'ruins', name: 'Collapsed Alchemy Wing', hidden: false },
		{ type: 'shrine', name: 'Divination Terrace', hidden: false },
		{ type: 'standing_stones', name: 'The Warding Stones', hidden: false },
		{ type: 'hidden_cave', name: 'Catacombs Entrance', hidden: true },
		{ type: 'hot_spring', name: 'Enchanted Fountain', hidden: true },
		{ type: 'obelisk', name: 'The Astral Observatory', hidden: false },
		{ type: 'ruins', name: 'The Forbidden Library Annex', hidden: true },
		{ type: 'grave_site', name: 'The Expelled Students\' Marker', hidden: true },
	],
	gallowmere: [
		{ type: 'ruins', name: 'The North Throne Room', hidden: false },
		{ type: 'ruins', name: 'The South Throne Room', hidden: false },
		{ type: 'standing_stones', name: 'The Brothers\' Memorial', hidden: false },
		{ type: 'obelisk', name: 'War Census Pillar', hidden: false },
		{ type: 'hidden_cave', name: 'Pol\'s Cottage Cellar', hidden: true },
		{ type: 'grave_site', name: 'The Unmarked Field', hidden: true },
		{ type: 'shrine', name: 'Edric\'s Chapel', hidden: false },
		{ type: 'hidden_cave', name: 'The Old Sewer Drain', hidden: true },
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
	glassfields: { prefixes: ['Prism', 'Shard', 'Crystal', 'Lumen', 'Glass', 'Refract', 'Chroma'], suffixes: ['spire', 'reach', 'fall', 'field', 'hollow', 'ward', 'light'] },
	verdant_deep: { prefixes: ['Vine', 'Root', 'Fern', 'Bloom', 'Thorn', 'Canopy', 'Moss'], suffixes: ['haven', 'deep', 'heart', 'shade', 'grove', 'fall', 'watch'] },
	mirrow_wastes: { prefixes: ['Ash', 'Grief', 'Bone', 'Hollow', 'Rust', 'Sorrow', 'Silent'], suffixes: ['ford', 'field', 'cairn', 'mound', 'watch', 'rest', 'cross'] },
	silence_peaks: { prefixes: ['Still', 'Hush', 'Mute', 'Deaf', 'Calm', 'Void', 'Quiet'], suffixes: ['peak', 'spire', 'ledge', 'pass', 'hold', 'keep', 'aerie'] },
	timeless_wastes: { prefixes: ['Chrono', 'Loop', 'Drift', 'Fade', 'Hour', 'Epoch', 'Stasis'], suffixes: ['fall', 'reach', 'gate', 'ward', 'point', 'drift', 'hold'] },
	hollow_sea: { prefixes: ['Coral', 'Tide', 'Abyss', 'Pearl', 'Drift', 'Brine', 'Depth'], suffixes: ['port', 'reach', 'haven', 'cove', 'deep', 'fall', 'watch'] },
	grey_wastes: { prefixes: ['Grey', 'Ash', 'Scar', 'Cairn', 'Wither', 'Blight', 'Husk'], suffixes: ['rest', 'hollow', 'mark', 'field', 'reach', 'ward', 'moor'] },
	korthaven: { prefixes: ['Crown', 'Guild', 'Merchant', 'Coin', 'Trade', 'Noble', 'Silver'], suffixes: ['gate', 'ward', 'market', 'square', 'hall', 'row', 'quarter'] },
	eldergrove: { prefixes: ['Silver', 'Star', 'Moon', 'Dawn', 'Briar', 'Alder', 'Birch', 'Rowan'], suffixes: ['glade', 'spire', 'song', 'root', 'bower', 'reach', 'hollow'] },
	stormcradle: { prefixes: ['Thunder', 'Bolt', 'Gale', 'Fulgar', 'Tempest', 'Strike', 'Flash'], suffixes: ['crest', 'ridge', 'fall', 'hold', 'peak', 'watch', 'break'] },
	luminara_ruins: { prefixes: ['Lumen', 'Ash', 'Golden', 'Scroll', 'Ruin', 'Frost', 'Echo'], suffixes: ['arch', 'court', 'spire', 'vault', 'hall', 'rest', 'mark'] },
	duskhollow: { prefixes: ['Dusk', 'Shade', 'Veil', 'Glimmer', 'Wane', 'Haze', 'Mist'], suffixes: ['hollow', 'ford', 'mere', 'shade', 'crossing', 'watch', 'fall'] },
	irongate: { prefixes: ['Iron', 'Anvil', 'Forge', 'Steel', 'Gear', 'Chain', 'Hammer'], suffixes: ['gate', 'hold', 'works', 'keep', 'wall', 'yard', 'march'] },
	arcane_conservatory: { prefixes: ['Spell', 'Rune', 'Arcane', 'Sigil', 'Glyph', 'Lumen', 'Mana', 'Ward'], suffixes: ['hall', 'tower', 'court', 'ward', 'spire', 'gate', 'arch', 'keep'] },
	gallowmere: { prefixes: ['Gallow', 'Voss', 'Crown', 'Ash', 'Twin', 'Throne', 'Red'], suffixes: ['mere', 'field', 'stead', 'hold', 'cross', 'wall', 'rest'] },
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
	glassfields: ['Prismatic Vault', 'Shattered Observatory', 'Luminari Crypt', 'Refraction Maze', 'Crystal Depths', 'Temporal Rift', 'Glass Labyrinth'],
	verdant_deep: ['Vine-Choked Ruins', 'Druid Catacombs', 'Beast Den', 'Ley Line Nexus', 'Living Tunnels', 'Fungal Cathedral', 'Serpent\'s Hollow'],
	mirrow_wastes: ['Vestraad Throne Crypt', 'Korinn War Vault', 'Soldiers\' Charnel Pit', 'Forgery Archives', 'Widow\'s Sanctuary', 'Battlefield Tunnels', 'Crown Smelter'],
	silence_peaks: ['Knotwork Archive', 'Hollow Bell Tower', 'Resonance Chamber', 'Monk\'s Catacombs', 'The Soundless Pit', 'Vibration Vault', 'Undertone Passage'],
	timeless_wastes: ['Moment Tomb', 'Looping Corridors', 'Chronology Library', 'Stasis Chamber', 'Temporal Maze', 'Ghost-Day Archive', 'The Erased Ruins'],
	hollow_sea: ['Sunken Dominion Vault', 'Coral Labyrinth', 'Drowned Archives', 'Leviathan\'s Maw', 'Abyssal Rift', 'Pelagathis Approach', 'Matter-Thin Passage'],
	grey_wastes: ['The Hollow Vein', 'Veiled Laboratory', 'Petrified Grove Depths', 'Ley Line Corpse', 'Pilgrim\'s Catacombs', 'Scar Trench Tunnels', 'Blighted Root Cellar'],
	korthaven: ['City Sewers', 'Thieves\' Catacombs', 'Smuggler\'s Tunnels', 'Arena Undercroft', 'Noble\'s Vault', 'Old Prison', 'Guild Cellar'],
	eldergrove: ['Forgotten Elven Temple', 'Bandit Warrens', 'Rootbound Crypt', 'Spider-Silk Cavern', 'Moonlit Catacombs', 'Beast Lord\'s Den', 'Thorn-Choked Ruins', 'Canopy Stalker\'s Nest', 'Vine-Strangled Vault', 'The Deep Hollow', 'Mushroom Caves', 'Poacher\'s Tunnel', 'Treant\'s Grotto'],
	stormcradle: ['Lightning-Split Cavern', 'Ancient Vein Tunnel', 'Storm Warden\'s Crypt', 'Fulgurite Mines', 'Thunderbird Nest', 'Shattered Observatory', 'Electrified Ruins'],
	luminara_ruins: ['Collapsed Library Vaults', 'Frozen Throne Room', 'Scholar\'s Catacombs', 'Temporal Labyrinth', 'Ash-Choked Archives', 'The Erased Gallery', 'Philosopher\'s Crypts'],
	duskhollow: ['Flickering Catacombs', 'Spirit Bridge Ruins', 'The Half-World Cellar', 'Ghostbloom Cavern', 'Twilight Archive', 'Hollow One\'s Nest', 'The Membrane Breach'],
	irongate: ['Buried Senate Chamber', 'Forge Undercroft', 'Centurion\'s Crypt', 'Clockwork Vault', 'Collapsed Armory', 'The Betrayer\'s Tunnel', 'Siege Engine Graveyard'],
	arcane_conservatory: ['The Practice Vaults', 'Enchantment Laboratory Sublevel', 'The Forbidden Archive', 'Alchemy Cellar', 'Summoning Chamber Ruins', 'Divination Crypt', 'The Headmaster\'s Undercroft', 'Collapsed Dormitory Wing', 'Warding Stone Tunnels', 'The Mana Reservoir', 'Expelled Students\' Hideout', 'Crystal Growth Caves', 'The Final Exam Dungeon'],
	gallowmere: ['Old Capital Undercroft', 'War Tunnel Network', 'Edric\'s Hidden Armory', 'Oswin\'s War Room Cellar', 'Sewer Cistern', 'Disturbed Foundation Vault', 'Burned Granary Basement'],
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
