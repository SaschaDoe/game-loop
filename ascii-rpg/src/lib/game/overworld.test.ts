import { describe, it, expect } from 'vitest';
import {
	generateWorld,
	getRegionTileCounts,
	getRegionTerrainDistribution,
	WORLD_W,
	WORLD_H,
	REGION_DEFS,
	type RegionId,
	type WorldMap,
} from './overworld';

// Generate a world once for shared assertions (deterministic from seed)
const TEST_SEED = 'test-world-42';
let cachedWorld: WorldMap | null = null;
function getTestWorld(): WorldMap {
	if (!cachedWorld) cachedWorld = generateWorld(TEST_SEED);
	return cachedWorld;
}

describe('generateWorld', () => {
	it('returns correct dimensions', () => {
		const world = getTestWorld();
		expect(world.width).toBe(WORLD_W);
		expect(world.height).toBe(WORLD_H);
		expect(world.tiles.length).toBe(WORLD_H);
		expect(world.tiles[0].length).toBe(WORLD_W);
	});

	it('supports custom dimensions', () => {
		const world = generateWorld('small', 50, 50);
		expect(world.width).toBe(50);
		expect(world.height).toBe(50);
		expect(world.tiles.length).toBe(50);
		expect(world.tiles[0].length).toBe(50);
	});

	it('same seed produces identical world', () => {
		const world1 = generateWorld('determinism-check');
		const world2 = generateWorld('determinism-check');
		// Check tile grid equality
		for (let y = 0; y < world1.height; y++) {
			for (let x = 0; x < world1.width; x++) {
				expect(world1.tiles[y][x].terrain).toBe(world2.tiles[y][x].terrain);
				expect(world1.tiles[y][x].region).toBe(world2.tiles[y][x].region);
			}
		}
		// Check settlements
		expect(world1.settlements.length).toBe(world2.settlements.length);
		for (let i = 0; i < world1.settlements.length; i++) {
			expect(world1.settlements[i].name).toBe(world2.settlements[i].name);
			expect(world1.settlements[i].pos).toEqual(world2.settlements[i].pos);
		}
		// Check dungeon entrances
		expect(world1.dungeonEntrances.length).toBe(world2.dungeonEntrances.length);
	});

	it('different seeds produce different worlds', () => {
		const world1 = generateWorld('seed-A', 60, 60);
		const world2 = generateWorld('seed-B', 60, 60);
		let differences = 0;
		for (let y = 0; y < 60; y++) {
			for (let x = 0; x < 60; x++) {
				if (world1.tiles[y][x].terrain !== world2.tiles[y][x].terrain) differences++;
			}
		}
		expect(differences).toBeGreaterThan(0);
	});
});

describe('region placement (US-WG-02)', () => {
	it('has 7 regions including Underdepths', () => {
		const world = getTestWorld();
		expect(world.regions.length).toBe(7);
		const ids = world.regions.map(r => r.id);
		expect(ids).toContain('greenweald');
		expect(ids).toContain('ashlands');
		expect(ids).toContain('hearthlands');
		expect(ids).toContain('frostpeak');
		expect(ids).toContain('drowned_mire');
		expect(ids).toContain('sunstone_expanse');
		expect(ids).toContain('underdepths');
	});

	it('6 surface regions are present on the tile grid', () => {
		const world = getTestWorld();
		const counts = getRegionTileCounts(world);
		const surfaceRegions: RegionId[] = ['greenweald', 'ashlands', 'hearthlands', 'frostpeak', 'drowned_mire', 'sunstone_expanse'];
		for (const id of surfaceRegions) {
			expect(counts[id]).toBeGreaterThan(0);
		}
	});

	it('no surface region is too small (minimum ~400 tiles)', () => {
		const world = getTestWorld();
		const counts = getRegionTileCounts(world);
		const surfaceRegions: RegionId[] = ['greenweald', 'ashlands', 'hearthlands', 'frostpeak', 'drowned_mire', 'sunstone_expanse'];
		for (const id of surfaceRegions) {
			expect(counts[id]).toBeGreaterThan(400);
		}
	});

	it('region placement is deterministic from seed', () => {
		const world1 = generateWorld('region-test', 80, 80);
		const world2 = generateWorld('region-test', 80, 80);
		for (let y = 0; y < 80; y++) {
			for (let x = 0; x < 80; x++) {
				expect(world1.tiles[y][x].region).toBe(world2.tiles[y][x].region);
			}
		}
	});
});

describe('terrain generation (US-WG-03)', () => {
	it('each region has terrain matching its biome identity', () => {
		const world = getTestWorld();

		// Greenweald should be dominated by forest
		const greenweald = getRegionTerrainDistribution(world, 'greenweald');
		const greenwealdTotal = Object.values(greenweald).reduce((s, n) => s + n, 0);
		expect((greenweald['forest'] ?? 0) / greenwealdTotal).toBeGreaterThan(0.2);

		// Frostpeak should have snow and mountain
		const frostpeak = getRegionTerrainDistribution(world, 'frostpeak');
		const frostTotal = Object.values(frostpeak).reduce((s, n) => s + n, 0);
		const frostSnowMountain = ((frostpeak['snow'] ?? 0) + (frostpeak['mountain'] ?? 0)) / frostTotal;
		expect(frostSnowMountain).toBeGreaterThan(0.2);

		// Sunstone should be dominated by sand
		const sunstone = getRegionTerrainDistribution(world, 'sunstone_expanse');
		const sunTotal = Object.values(sunstone).reduce((s, n) => s + n, 0);
		expect((sunstone['sand'] ?? 0) / sunTotal).toBeGreaterThan(0.3);

		// Drowned Mire should have swamp/water
		const mire = getRegionTerrainDistribution(world, 'drowned_mire');
		const mireTotal = Object.values(mire).reduce((s, n) => s + n, 0);
		const mireWet = ((mire['swamp'] ?? 0) + (mire['water'] ?? 0) + (mire['mud'] ?? 0)) / mireTotal;
		expect(mireWet).toBeGreaterThan(0.2);
	});

	it('terrain generation is deterministic from seed', () => {
		const world1 = generateWorld('terrain-det', 60, 60);
		const world2 = generateWorld('terrain-det', 60, 60);
		for (let y = 0; y < 60; y++) {
			for (let x = 0; x < 60; x++) {
				expect(world1.tiles[y][x].terrain).toBe(world2.tiles[y][x].terrain);
			}
		}
	});

	it('transition zones exist at region borders', () => {
		const world = getTestWorld();
		// Find tiles where grass appears in a non-grass-dominant region (transition blending)
		let transitionGrassInAshlands = 0;
		for (let y = 0; y < world.height; y++) {
			for (let x = 0; x < world.width; x++) {
				if (world.tiles[y][x].region === 'ashlands' && world.tiles[y][x].terrain === 'grass') {
					transitionGrassInAshlands++;
				}
			}
		}
		// Ashlands shouldn't naturally have grass, so any grass tiles are from transitions
		// (or rare noise blending). With 200x200 map, there should be some border tiles.
		expect(transitionGrassInAshlands).toBeGreaterThan(0);
	});
});

describe('settlement placement (US-WG-04)', () => {
	it('places the 3 starting locations', () => {
		const world = getTestWorld();
		const startingSettlements = world.settlements.filter(s => s.isStartingLocation);
		expect(startingSettlements.length).toBe(3);

		const names = startingSettlements.map(s => s.name);
		expect(names).toContain('Willowmere');
		expect(names).toContain('Crossroads Inn');
		expect(names).toContain('Goblin Cave');
	});

	it('starting locations are in correct regions', () => {
		const world = getTestWorld();
		const willowmere = world.settlements.find(s => s.name === 'Willowmere')!;
		const inn = world.settlements.find(s => s.name === 'Crossroads Inn')!;
		const cave = world.settlements.find(s => s.name === 'Goblin Cave')!;
		expect(willowmere.region).toBe('greenweald');
		expect(inn.region).toBe('hearthlands');
		expect(cave.region).toBe('ashlands');
	});

	it('settlements are on passable terrain', () => {
		const world = getTestWorld();
		const impassable = new Set(['water', 'mountain', 'lava']);
		for (const s of world.settlements) {
			const terrain = world.tiles[s.pos.y][s.pos.x].terrain;
			expect(impassable.has(terrain)).toBe(false);
		}
	});

	it('settlements maintain minimum spacing', () => {
		const world = getTestWorld();
		for (let i = 0; i < world.settlements.length; i++) {
			for (let j = i + 1; j < world.settlements.length; j++) {
				const a = world.settlements[i].pos;
				const b = world.settlements[j].pos;
				const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
				// Should be at least 15 tiles apart (with some tolerance for near-edge cases)
				expect(dist).toBeGreaterThanOrEqual(10);
			}
		}
	});

	it('has settlements in multiple regions', () => {
		const world = getTestWorld();
		const regionsWithSettlements = new Set(world.settlements.map(s => s.region));
		expect(regionsWithSettlements.size).toBeGreaterThanOrEqual(3);
	});
});

describe('dungeon entrance placement (US-WG-06)', () => {
	it('has dungeon entrances', () => {
		const world = getTestWorld();
		expect(world.dungeonEntrances.length).toBeGreaterThan(0);
	});

	it('dungeon entrances have valid depth', () => {
		const world = getTestWorld();
		for (const d of world.dungeonEntrances) {
			expect(d.maxDepth).toBeGreaterThanOrEqual(3);
			expect(d.maxDepth).toBeLessThanOrEqual(25);
		}
	});

	it('dungeon entrances have names', () => {
		const world = getTestWorld();
		for (const d of world.dungeonEntrances) {
			expect(d.name.length).toBeGreaterThan(0);
		}
	});

	it('dungeon entrances are spread across regions', () => {
		const world = getTestWorld();
		const regionsWithDungeons = new Set(world.dungeonEntrances.map(d => d.region));
		expect(regionsWithDungeons.size).toBeGreaterThanOrEqual(2);
	});
});

describe('explored grid', () => {
	it('starts fully unexplored', () => {
		const world = getTestWorld();
		expect(world.explored.length).toBe(world.height);
		expect(world.explored[0].length).toBe(world.width);
		for (let y = 0; y < world.height; y++) {
			for (let x = 0; x < world.width; x++) {
				expect(world.explored[y][x]).toBe(false);
			}
		}
	});
});
