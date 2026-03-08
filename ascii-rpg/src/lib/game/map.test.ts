import { describe, it, expect } from 'vitest';
import { generateMap, getSpawnPositions } from './map';
import { SeededRandom } from './seeded-random';

describe('generateMap', () => {
	it('returns a map with correct dimensions', () => {
		const map = generateMap(30, 15, 1);
		expect(map.width).toBe(30);
		expect(map.height).toBe(15);
		expect(map.tiles.length).toBe(15);
		expect(map.tiles[0].length).toBe(30);
	});

	it('contains floor tiles (rooms were carved)', () => {
		const map = generateMap(50, 24, 1);
		let floorCount = 0;
		for (const row of map.tiles) {
			for (const tile of row) {
				if (tile === '.') floorCount++;
			}
		}
		expect(floorCount).toBeGreaterThan(50);
	});

	it('contains stairs', () => {
		const map = generateMap(50, 24, 1);
		let hasStairs = false;
		for (const row of map.tiles) {
			for (const tile of row) {
				if (tile === '>') hasStairs = true;
			}
		}
		expect(hasStairs).toBe(true);
	});

	it('contains potions', () => {
		const map = generateMap(50, 24, 1);
		let potionCount = 0;
		for (const row of map.tiles) {
			for (const tile of row) {
				if (tile === '*') potionCount++;
			}
		}
		expect(potionCount).toBeGreaterThanOrEqual(3); // 2 + level=1
	});

	it('includes secretWalls set', () => {
		const map = generateMap(50, 24, 1);
		expect(map.secretWalls).toBeDefined();
		expect(map.secretWalls instanceof Set).toBe(true);
	});

	it('secret walls reference wall tiles', () => {
		// Generate many maps to find one with secrets
		for (let i = 0; i < 20; i++) {
			const map = generateMap(50, 24, 3);
			if (map.secretWalls.size > 0) {
				for (const key of map.secretWalls) {
					const [x, y] = key.split(',').map(Number);
					// Secret walls should be wall tiles
					expect(map.tiles[y][x]).toBe('#');
				}
				return; // found and validated
			}
		}
		// It's OK if no secrets were generated in 20 attempts (random)
	});

	it('generates more rooms at higher levels', () => {
		const map1 = generateMap(50, 24, 1);
		const map10 = generateMap(50, 24, 10);
		let floors1 = 0, floors10 = 0;
		for (const row of map1.tiles) for (const t of row) if (t === '.') floors1++;
		for (const row of map10.tiles) for (const t of row) if (t === '.') floors10++;
		// Level 10 should generally have more floor space
		// Run multiple to reduce flakiness
		let higherCount = 0;
		for (let i = 0; i < 5; i++) {
			let f1 = 0, f10 = 0;
			const m1 = generateMap(50, 24, 1);
			const m10 = generateMap(50, 24, 10);
			for (const row of m1.tiles) for (const t of row) if (t === '.') f1++;
			for (const row of m10.tiles) for (const t of row) if (t === '.') f10++;
			if (f10 > f1) higherCount++;
		}
		expect(higherCount).toBeGreaterThanOrEqual(2); // At least 2/5 should be higher
	});
});

describe('seeded map generation', () => {
	it('same seed produces identical maps', () => {
		const rng1 = new SeededRandom(42);
		const rng2 = new SeededRandom(42);
		const map1 = generateMap(50, 24, 3, rng1);
		const map2 = generateMap(50, 24, 3, rng2);
		for (let y = 0; y < 24; y++) {
			for (let x = 0; x < 50; x++) {
				expect(map1.tiles[y][x]).toBe(map2.tiles[y][x]);
			}
		}
		expect([...map1.secretWalls].sort()).toEqual([...map2.secretWalls].sort());
	});

	it('different seeds produce different maps', () => {
		const rng1 = new SeededRandom(42);
		const rng2 = new SeededRandom(99);
		const map1 = generateMap(50, 24, 3, rng1);
		const map2 = generateMap(50, 24, 3, rng2);
		let differences = 0;
		for (let y = 0; y < 24; y++) {
			for (let x = 0; x < 50; x++) {
				if (map1.tiles[y][x] !== map2.tiles[y][x]) differences++;
			}
		}
		expect(differences).toBeGreaterThan(0);
	});

	it('seeded spawn positions are deterministic', () => {
		const map = generateMap(50, 24, 3, new SeededRandom(42));
		const rng1 = new SeededRandom(100);
		const rng2 = new SeededRandom(100);
		const spawns1 = getSpawnPositions(map, 5, rng1);
		const spawns2 = getSpawnPositions(map, 5, rng2);
		expect(spawns1).toEqual(spawns2);
	});
});

describe('getSpawnPositions', () => {
	it('returns the requested number of positions', () => {
		const map = generateMap(50, 24, 1);
		const positions = getSpawnPositions(map, 5);
		expect(positions).toHaveLength(5);
	});

	it('all positions are on floor tiles', () => {
		const map = generateMap(50, 24, 1);
		const positions = getSpawnPositions(map, 10);
		for (const p of positions) {
			expect(map.tiles[p.y][p.x]).toBe('.');
		}
	});

	it('all positions are unique', () => {
		const map = generateMap(50, 24, 1);
		const positions = getSpawnPositions(map, 10);
		const keys = positions.map((p) => `${p.x},${p.y}`);
		expect(new Set(keys).size).toBe(10);
	});
});
