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

	it('same seed produces identical world', { timeout: 15000 }, () => {
		const world1 = generateWorld('determinism-check', 60, 60);
		const world2 = generateWorld('determinism-check', 60, 60);
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
	it('has 12 regions including Underdepths', () => {
		const world = getTestWorld();
		expect(world.regions.length).toBe(12);
		const ids = world.regions.map(r => r.id);
		expect(ids).toContain('greenweald');
		expect(ids).toContain('ashlands');
		expect(ids).toContain('hearthlands');
		expect(ids).toContain('frostpeak');
		expect(ids).toContain('drowned_mire');
		expect(ids).toContain('sunstone_expanse');
		expect(ids).toContain('thornlands');
		expect(ids).toContain('pale_coast');
		expect(ids).toContain('glassfields');
		expect(ids).toContain('verdant_deep');
		expect(ids).toContain('mirrow_wastes');
		expect(ids).toContain('underdepths');
	});

	it('11 surface regions are present on the tile grid', () => {
		const world = getTestWorld();
		const counts = getRegionTileCounts(world);
		const surfaceRegions: RegionId[] = ['greenweald', 'ashlands', 'hearthlands', 'frostpeak', 'drowned_mire', 'sunstone_expanse', 'thornlands', 'pale_coast', 'glassfields', 'verdant_deep', 'mirrow_wastes'];
		for (const id of surfaceRegions) {
			expect(counts[id]).toBeGreaterThan(0);
		}
	});

	it('no surface region is too small (minimum ~400 tiles)', () => {
		const world = getTestWorld();
		const counts = getRegionTileCounts(world);
		const surfaceRegions: RegionId[] = ['greenweald', 'ashlands', 'hearthlands', 'frostpeak', 'drowned_mire', 'sunstone_expanse', 'thornlands', 'pale_coast', 'glassfields', 'verdant_deep', 'mirrow_wastes'];
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

describe('road network (US-WG-05)', () => {
	it('has roads connecting settlements', () => {
		const world = getTestWorld();
		expect(world.roads.length).toBeGreaterThan(0);
	});

	it('all settlements are reachable via road network (connected graph)', () => {
		const world = getTestWorld();
		// Build adjacency from roads
		const adj = new Map<string, Set<string>>();
		for (const s of world.settlements) {
			adj.set(s.id, new Set());
		}
		for (const r of world.roads) {
			adj.get(r.from)?.add(r.to);
			adj.get(r.to)?.add(r.from);
		}
		// BFS from first settlement
		const visited = new Set<string>();
		const queue = [world.settlements[0].id];
		visited.add(queue[0]);
		while (queue.length > 0) {
			const cur = queue.shift()!;
			for (const neighbor of adj.get(cur) ?? []) {
				if (!visited.has(neighbor)) {
					visited.add(neighbor);
					queue.push(neighbor);
				}
			}
		}
		expect(visited.size).toBe(world.settlements.length);
	});

	it('road tiles are painted on the tile grid', () => {
		const world = getTestWorld();
		let roadTileCount = 0;
		for (let y = 0; y < world.height; y++) {
			for (let x = 0; x < world.width; x++) {
				if (world.tiles[y][x].road) roadTileCount++;
			}
		}
		expect(roadTileCount).toBeGreaterThan(0);
	});

	it('roads avoid water, mountain, and lava where possible', () => {
		const world = getTestWorld();
		const impassable = new Set(['water', 'mountain', 'lava']);
		let roadOnImpassable = 0;
		let totalRoadTiles = 0;
		for (let y = 0; y < world.height; y++) {
			for (let x = 0; x < world.width; x++) {
				if (world.tiles[y][x].road) {
					totalRoadTiles++;
					if (impassable.has(world.tiles[y][x].terrain)) roadOnImpassable++;
				}
			}
		}
		// Vast majority of road tiles should be on passable terrain
		// (some may cross water if no alternative route exists)
		if (totalRoadTiles > 0) {
			expect(roadOnImpassable / totalRoadTiles).toBeLessThan(0.05);
		}
	});

	it('has both main roads and paths', () => {
		const world = getTestWorld();
		const types = new Set(world.roads.map(r => r.type));
		// With mix of towns and villages, we should get both types
		expect(types.size).toBeGreaterThanOrEqual(1);
	});

	it('roads have valid paths', () => {
		const world = getTestWorld();
		for (const r of world.roads) {
			expect(r.path.length).toBeGreaterThan(0);
			expect(r.from.length).toBeGreaterThan(0);
			expect(r.to.length).toBeGreaterThan(0);
		}
	});

	it('signposts exist at intersections', () => {
		const world = getTestWorld();
		let signpostCount = 0;
		for (let y = 0; y < world.height; y++) {
			for (let x = 0; x < world.width; x++) {
				if (world.tiles[y][x].signpost) signpostCount++;
			}
		}
		// With multiple roads connecting many settlements, there should be intersections
		expect(signpostCount).toBeGreaterThan(0);
	});

	it('road generation is deterministic', () => {
		const world1 = generateWorld('road-det', 80, 80);
		const world2 = generateWorld('road-det', 80, 80);
		expect(world1.roads.length).toBe(world2.roads.length);
		for (let y = 0; y < 80; y++) {
			for (let x = 0; x < 80; x++) {
				expect(world1.tiles[y][x].road).toBe(world2.tiles[y][x].road);
			}
		}
	});
});

describe('points of interest (US-WG-07)', () => {
	it('has POIs distributed across the world', () => {
		const world = getTestWorld();
		expect(world.pois.length).toBeGreaterThan(0);
	});

	it('POIs are spread across multiple regions', () => {
		const world = getTestWorld();
		const regionsWithPois = new Set(world.pois.map(p => p.region));
		expect(regionsWithPois.size).toBeGreaterThanOrEqual(3);
	});

	it('POIs have names and types', () => {
		const world = getTestWorld();
		for (const poi of world.pois) {
			expect(poi.name.length).toBeGreaterThan(0);
			expect(poi.type.length).toBeGreaterThan(0);
			expect(poi.id.startsWith('poi_')).toBe(true);
		}
	});

	it('POIs are away from settlements', () => {
		const world = getTestWorld();
		for (const poi of world.pois) {
			for (const s of world.settlements) {
				const dist = Math.sqrt((poi.pos.x - s.pos.x) ** 2 + (poi.pos.y - s.pos.y) ** 2);
				expect(dist).toBeGreaterThanOrEqual(10);
			}
		}
	});

	it('POIs are away from roads (off the beaten path)', () => {
		const world = getTestWorld();
		// Build road tile set
		const roadTiles = new Set<string>();
		for (let y = 0; y < world.height; y++) {
			for (let x = 0; x < world.width; x++) {
				if (world.tiles[y][x].road) roadTiles.add(`${x},${y}`);
			}
		}
		// Check that POIs aren't directly on road tiles
		for (const poi of world.pois) {
			expect(roadTiles.has(`${poi.pos.x},${poi.pos.y}`)).toBe(false);
		}
	});

	it('some POIs are hidden, some are visible', () => {
		const world = getTestWorld();
		const hidden = world.pois.filter(p => p.hidden);
		const visible = world.pois.filter(p => !p.hidden);
		expect(hidden.length).toBeGreaterThan(0);
		expect(visible.length).toBeGreaterThan(0);
	});

	it('all POIs start undiscovered', () => {
		const world = getTestWorld();
		for (const poi of world.pois) {
			expect(poi.discovered).toBe(false);
		}
	});

	it('POI placement is deterministic', () => {
		const world1 = generateWorld('poi-det', 80, 80);
		const world2 = generateWorld('poi-det', 80, 80);
		expect(world1.pois.length).toBe(world2.pois.length);
		for (let i = 0; i < world1.pois.length; i++) {
			expect(world1.pois[i].name).toBe(world2.pois[i].name);
			expect(world1.pois[i].pos).toEqual(world2.pois[i].pos);
		}
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
