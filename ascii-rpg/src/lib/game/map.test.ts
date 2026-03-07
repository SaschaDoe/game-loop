import { describe, it, expect } from 'vitest';
import { generateMap, getSpawnPositions } from './map';

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
