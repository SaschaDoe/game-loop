import { describe, it, expect } from 'vitest';
import { computeFOV, createVisibilityGrid, updateVisibility } from './fov';
import { Visibility } from './types';
import type { GameMap, Tile } from './types';

function makeMap(ascii: string[]): GameMap {
	const height = ascii.length;
	const width = ascii[0].length;
	const tiles: Tile[][] = ascii.map((row) =>
		row.split('').map((c) => (c === '#' ? '#' : '.') as Tile)
	);
	return { width, height, tiles };
}

describe('computeFOV', () => {
	it('includes the origin tile', () => {
		const map = makeMap([
			'.....',
			'.....',
			'.....',
			'.....',
			'.....'
		]);
		const fov = computeFOV({ x: 2, y: 2 }, map, 8);
		expect(fov.has('2,2')).toBe(true);
	});

	it('sees all tiles in an open room within radius', () => {
		const map = makeMap([
			'.....',
			'.....',
			'.....',
			'.....',
			'.....'
		]);
		const fov = computeFOV({ x: 2, y: 2 }, map, 8);
		// Should see all 25 tiles in this small room
		for (let y = 0; y < 5; y++) {
			for (let x = 0; x < 5; x++) {
				expect(fov.has(`${x},${y}`)).toBe(true);
			}
		}
	});

	it('does not see through walls', () => {
		const map = makeMap([
			'..#..',
			'..#..',
			'..#..',
			'..#..',
			'..#..'
		]);
		// Player at (0,2), wall column at x=2
		const fov = computeFOV({ x: 0, y: 2 }, map, 8);
		// Should see tiles on our side and the wall itself
		expect(fov.has('0,2')).toBe(true);
		expect(fov.has('1,2')).toBe(true);
		expect(fov.has('2,2')).toBe(true); // wall tile itself is visible
		// Should NOT see tiles behind the wall
		expect(fov.has('3,2')).toBe(false);
		expect(fov.has('4,2')).toBe(false);
	});

	it('respects radius limit', () => {
		const map = makeMap(Array(20).fill('.'.repeat(20)));
		const fov = computeFOV({ x: 10, y: 10 }, map, 3);
		// Tiles at distance > 3 should not be visible
		expect(fov.has('10,10')).toBe(true);
		expect(fov.has('10,7')).toBe(true); // distance 3
		expect(fov.has('10,6')).toBe(false); // distance 4
	});

	it('can see around corners', () => {
		// L-shaped wall
		const map = makeMap([
			'......',
			'.###..',
			'....#.',
			'....#.',
			'......',
			'......'
		]);
		const fov = computeFOV({ x: 0, y: 0 }, map, 8);
		// Should see around the wall to some extent
		expect(fov.has('0,0')).toBe(true);
		expect(fov.has('0,2')).toBe(true); // below the wall, left side
	});

	it('sees walls themselves', () => {
		const map = makeMap([
			'#####',
			'#...#',
			'#...#',
			'#...#',
			'#####'
		]);
		const fov = computeFOV({ x: 2, y: 2 }, map, 8);
		// All walls should be visible from center of room
		expect(fov.has('0,0')).toBe(true);
		expect(fov.has('4,0')).toBe(true);
		expect(fov.has('0,4')).toBe(true);
		expect(fov.has('4,4')).toBe(true);
	});
});

describe('createVisibilityGrid', () => {
	it('creates a grid of unexplored tiles', () => {
		const grid = createVisibilityGrid(5, 3);
		expect(grid.length).toBe(3);
		expect(grid[0].length).toBe(5);
		for (const row of grid) {
			for (const cell of row) {
				expect(cell).toBe(Visibility.Unexplored);
			}
		}
	});
});

describe('updateVisibility', () => {
	it('marks FOV tiles as Visible', () => {
		const map = makeMap([
			'.....',
			'.....',
			'.....',
			'.....',
			'.....'
		]);
		const grid = createVisibilityGrid(5, 5);
		updateVisibility(grid, map, { x: 2, y: 2 }, 8);

		expect(grid[2][2]).toBe(Visibility.Visible);
		expect(grid[0][0]).toBe(Visibility.Visible);
	});

	it('downgrades previously Visible tiles to Explored when player moves', () => {
		const map = makeMap([
			'..........',
			'..........',
			'..........',
			'..........',
			'..........',
			'..........',
			'..........',
			'..........',
			'..........',
			'..........'
		]);
		const grid = createVisibilityGrid(10, 10);

		// First view from (1,1)
		updateVisibility(grid, map, { x: 1, y: 1 }, 3);
		expect(grid[1][1]).toBe(Visibility.Visible);

		// Move to far corner (8,8) — tiles near (1,1) should become Explored
		updateVisibility(grid, map, { x: 8, y: 8 }, 3);
		expect(grid[1][1]).toBe(Visibility.Explored);
		expect(grid[8][8]).toBe(Visibility.Visible);
	});

	it('keeps unexplored tiles unexplored if outside FOV', () => {
		const map = makeMap(Array(20).fill('.'.repeat(20)));
		const grid = createVisibilityGrid(20, 20);
		updateVisibility(grid, map, { x: 2, y: 2 }, 3);

		// Far corner should still be unexplored
		expect(grid[19][19]).toBe(Visibility.Unexplored);
	});

	it('enclosed room blocks visibility of tiles well outside walls', () => {
		// Player in a room — tiles 2+ away from walls in cardinal directions are blocked
		const map = makeMap([
			'..........',
			'..........',
			'..######..',
			'..#....#..',
			'..#....#..',
			'..#....#..',
			'..######..',
			'..........',
			'..........',
			'..........'
		]);
		const grid = createVisibilityGrid(10, 10);
		updateVisibility(grid, map, { x: 4, y: 4 }, 8);

		// Inside room: visible
		expect(grid[4][4]).toBe(Visibility.Visible);
		expect(grid[3][3]).toBe(Visibility.Visible);
		// Walls visible from inside
		expect(grid[2][4]).toBe(Visibility.Visible);
		// Tiles well outside the room (beyond wall + 1 buffer) are not visible
		expect(grid[0][4]).toBe(Visibility.Unexplored);
		expect(grid[9][4]).toBe(Visibility.Unexplored);
		expect(grid[4][0]).toBe(Visibility.Unexplored);
		expect(grid[4][9]).toBe(Visibility.Unexplored);
	});
});
