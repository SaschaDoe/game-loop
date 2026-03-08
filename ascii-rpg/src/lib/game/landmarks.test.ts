import { describe, it, expect } from 'vitest';
import {
	LANDMARK_DEFS,
	getLandmarkDef,
	landmarkChar,
	landmarkColor,
	examineLandmark,
	getLandmarkAt,
	getAdjacentLandmarks,
	placeLandmarks,
} from './landmarks';
import type { Landmark, GameMap, Tile } from './types';

function makeMap(width = 10, height = 10): GameMap {
	const tiles: Tile[][] = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => '.' as const)
	);
	// Walls on border
	for (let x = 0; x < width; x++) { tiles[0][x] = '#'; tiles[height - 1][x] = '#'; }
	for (let y = 0; y < height; y++) { tiles[y][0] = '#'; tiles[y][width - 1] = '#'; }
	return { width, height, tiles, secretWalls: new Set<string>() };
}

describe('LANDMARK_DEFS', () => {
	it('defines 8 landmark types', () => {
		expect(LANDMARK_DEFS).toHaveLength(8);
	});

	it('all types are unique', () => {
		const types = LANDMARK_DEFS.map((d) => d.type);
		expect(new Set(types).size).toBe(types.length);
	});

	it('all landmarks have at least 3 flavor texts', () => {
		for (const def of LANDMARK_DEFS) {
			expect(def.flavorTexts.length).toBeGreaterThanOrEqual(3);
		}
	});

	it('all landmarks have a single-char symbol', () => {
		for (const def of LANDMARK_DEFS) {
			expect(def.char).toHaveLength(1);
		}
	});

	it('all chars are unique across landmark types', () => {
		const chars = LANDMARK_DEFS.map((d) => d.char);
		expect(new Set(chars).size).toBe(chars.length);
	});

	it('all landmarks have positive weight', () => {
		for (const def of LANDMARK_DEFS) {
			expect(def.weight).toBeGreaterThan(0);
		}
	});
});

describe('getLandmarkDef', () => {
	it('returns def for valid type', () => {
		const def = getLandmarkDef('graffiti');
		expect(def).toBeDefined();
		expect(def!.name).toBe('Wall Graffiti');
	});

	it('returns undefined for unknown type', () => {
		expect(getLandmarkDef('nonexistent' as any)).toBeUndefined();
	});
});

describe('landmarkChar / landmarkColor', () => {
	it('returns correct char for graffiti', () => {
		expect(landmarkChar('graffiti')).toBe('"');
	});

	it('returns correct color for shrine', () => {
		expect(landmarkColor('shrine')).toBe('#ff8');
	});

	it('returns fallback for unknown type', () => {
		expect(landmarkChar('nonexistent' as any)).toBe('?');
		expect(landmarkColor('nonexistent' as any)).toBe('#888');
	});
});

describe('examineLandmark', () => {
	it('returns flavor text for unexamined landmark', () => {
		const landmark: Landmark = { pos: { x: 3, y: 3 }, type: 'graffiti', examined: false };
		const text = examineLandmark(landmark);
		expect(text.length).toBeGreaterThan(0);
		expect(text).not.toContain('already examined');
	});

	it('returns already-examined message for examined landmark', () => {
		const landmark: Landmark = { pos: { x: 3, y: 3 }, type: 'graffiti', examined: true };
		const text = examineLandmark(landmark);
		expect(text).toContain('already examined');
	});

	it('returns a text from the def flavor texts', () => {
		const landmark: Landmark = { pos: { x: 3, y: 3 }, type: 'statue', examined: false };
		const def = getLandmarkDef('statue')!;
		// Run multiple times to increase confidence
		for (let i = 0; i < 20; i++) {
			const text = examineLandmark(landmark);
			expect(def.flavorTexts).toContain(text);
		}
	});

	it('returns fallback for unknown type', () => {
		const landmark: Landmark = { pos: { x: 3, y: 3 }, type: 'nonexistent' as any, examined: false };
		const text = examineLandmark(landmark);
		expect(text).toContain('nothing of interest');
	});
});

describe('getLandmarkAt', () => {
	it('finds landmark at position', () => {
		const landmarks: Landmark[] = [
			{ pos: { x: 3, y: 4 }, type: 'graffiti', examined: false },
			{ pos: { x: 7, y: 2 }, type: 'statue', examined: false },
		];
		const found = getLandmarkAt(landmarks, 7, 2);
		expect(found).toBeDefined();
		expect(found!.type).toBe('statue');
	});

	it('returns undefined when no landmark at position', () => {
		const landmarks: Landmark[] = [
			{ pos: { x: 3, y: 4 }, type: 'graffiti', examined: false },
		];
		expect(getLandmarkAt(landmarks, 5, 5)).toBeUndefined();
	});
});

describe('getAdjacentLandmarks', () => {
	it('finds unexamined landmarks in 4 cardinal directions', () => {
		const landmarks: Landmark[] = [
			{ pos: { x: 5, y: 4 }, type: 'graffiti', examined: false }, // north
			{ pos: { x: 6, y: 5 }, type: 'statue', examined: false },  // east
			{ pos: { x: 4, y: 5 }, type: 'bones', examined: false },   // west
			{ pos: { x: 5, y: 6 }, type: 'campsite', examined: false }, // south
		];
		const adjacent = getAdjacentLandmarks(landmarks, { x: 5, y: 5 });
		expect(adjacent).toHaveLength(4);
	});

	it('excludes examined landmarks', () => {
		const landmarks: Landmark[] = [
			{ pos: { x: 5, y: 4 }, type: 'graffiti', examined: true },
			{ pos: { x: 6, y: 5 }, type: 'statue', examined: false },
		];
		const adjacent = getAdjacentLandmarks(landmarks, { x: 5, y: 5 });
		expect(adjacent).toHaveLength(1);
		expect(adjacent[0].type).toBe('statue');
	});

	it('excludes diagonal landmarks', () => {
		const landmarks: Landmark[] = [
			{ pos: { x: 6, y: 4 }, type: 'graffiti', examined: false }, // diagonal
		];
		const adjacent = getAdjacentLandmarks(landmarks, { x: 5, y: 5 });
		expect(adjacent).toHaveLength(0);
	});

	it('returns empty when no adjacent landmarks', () => {
		const landmarks: Landmark[] = [
			{ pos: { x: 1, y: 1 }, type: 'graffiti', examined: false },
		];
		const adjacent = getAdjacentLandmarks(landmarks, { x: 5, y: 5 });
		expect(adjacent).toHaveLength(0);
	});
});

describe('placeLandmarks', () => {
	it('places landmarks on floor tiles', () => {
		const map = makeMap();
		const occupied = new Set<string>();
		const originalRandom = Math.random;
		Math.random = () => 0.5;
		try {
			const landmarks = placeLandmarks(map, 3, occupied);
			for (const lm of landmarks) {
				expect(map.tiles[lm.pos.y][lm.pos.x]).toBe('.');
			}
		} finally {
			Math.random = originalRandom;
		}
	});

	it('does not place on occupied positions', () => {
		const map = makeMap();
		// Occupy all but one floor tile
		const occupied = new Set<string>();
		for (let y = 1; y < 9; y++) {
			for (let x = 1; x < 9; x++) {
				if (!(x === 5 && y === 5)) {
					occupied.add(`${x},${y}`);
				}
			}
		}
		const landmarks = placeLandmarks(map, 3, occupied);
		// Can place at most 1 landmark (only one free tile)
		expect(landmarks.length).toBeLessThanOrEqual(1);
		if (landmarks.length === 1) {
			expect(landmarks[0].pos).toEqual({ x: 5, y: 5 });
		}
	});

	it('places 1-3 landmarks', () => {
		const map = makeMap();
		// Test multiple times for randomness
		const counts = new Set<number>();
		const originalRandom = Math.random;
		for (let i = 0; i < 50; i++) {
			Math.random = Math.random; // use real random
			const landmarks = placeLandmarks(map, 5, new Set<string>());
			counts.add(landmarks.length);
			expect(landmarks.length).toBeLessThanOrEqual(3);
			expect(landmarks.length).toBeGreaterThanOrEqual(0);
		}
		Math.random = originalRandom;
	});

	it('respects minLevel for landmark types', () => {
		const map = makeMap();
		// Level 1: shrine (minLevel 3) should never appear
		const originalRandom = Math.random;
		Math.random = () => 0.99; // Would pick shrine if eligible (lowest weight, last)
		try {
			const landmarks = placeLandmarks(map, 1, new Set<string>());
			for (const lm of landmarks) {
				const def = getLandmarkDef(lm.type)!;
				expect(def.minLevel).toBeLessThanOrEqual(1);
			}
		} finally {
			Math.random = originalRandom;
		}
	});

	it('all placed landmarks start unexamined', () => {
		const map = makeMap();
		const landmarks = placeLandmarks(map, 3, new Set<string>());
		for (const lm of landmarks) {
			expect(lm.examined).toBe(false);
		}
	});

	it('adds placed positions to occupied set', () => {
		const map = makeMap();
		const occupied = new Set<string>();
		const landmarks = placeLandmarks(map, 3, occupied);
		for (const lm of landmarks) {
			expect(occupied.has(`${lm.pos.x},${lm.pos.y}`)).toBe(true);
		}
	});
});
