import { Visibility } from './types';
import type { GameMap, Position } from './types';

const SIGHT_RADIUS_DEFAULT = 8;

// Recursive shadow casting multipliers for 8 octants
const OCTANT_MULTIPLIERS = [
	[1, 0, 0, 1],
	[0, 1, 1, 0],
	[0, -1, 1, 0],
	[-1, 0, 0, 1],
	[-1, 0, 0, -1],
	[0, -1, -1, 0],
	[0, 1, -1, 0],
	[1, 0, 0, -1]
];

function isOpaque(map: GameMap, x: number, y: number): boolean {
	if (x < 0 || y < 0 || x >= map.width || y >= map.height) return true;
	return map.tiles[y][x] === '#';
}

function castOctant(
	origin: Position,
	map: GameMap,
	visible: Set<string>,
	radius: number,
	row: number,
	startSlope: number,
	endSlope: number,
	xx: number,
	xy: number,
	yx: number,
	yy: number
): void {
	if (startSlope < endSlope) return;

	let nextStartSlope = startSlope;

	for (let i = row; i <= radius; i++) {
		let blocked = false;
		for (let dx = -i; dx <= 0; dx++) {
			const dy = -i;
			const mapX = origin.x + dx * xx + dy * xy;
			const mapY = origin.y + dx * yx + dy * yy;

			const leftSlope = (dx - 0.5) / (dy + 0.5);
			const rightSlope = (dx + 0.5) / (dy - 0.5);

			if (startSlope < rightSlope) continue;
			if (endSlope > leftSlope) break;

			const distSq = dx * dx + dy * dy;
			if (distSq <= radius * radius) {
				visible.add(`${mapX},${mapY}`);
			}

			if (blocked) {
				if (isOpaque(map, mapX, mapY)) {
					nextStartSlope = rightSlope;
				} else {
					blocked = false;
					startSlope = nextStartSlope;
				}
			} else if (isOpaque(map, mapX, mapY) && i < radius) {
				blocked = true;
				castOctant(origin, map, visible, radius, i + 1, startSlope, rightSlope, xx, xy, yx, yy);
				nextStartSlope = rightSlope;
			}
		}
		if (blocked) break;
	}
}

export function computeFOV(origin: Position, map: GameMap, radius: number = SIGHT_RADIUS_DEFAULT): Set<string> {
	const visible = new Set<string>();
	visible.add(`${origin.x},${origin.y}`);

	for (const [xx, xy, yx, yy] of OCTANT_MULTIPLIERS) {
		castOctant(origin, map, visible, radius, 1, 1.0, 0.0, xx, xy, yx, yy);
	}

	return visible;
}

export function createVisibilityGrid(width: number, height: number): Visibility[][] {
	return Array.from({ length: height }, () =>
		Array.from({ length: width }, () => Visibility.Unexplored)
	);
}

export function updateVisibility(
	visibility: Visibility[][],
	map: GameMap,
	origin: Position,
	radius: number = SIGHT_RADIUS_DEFAULT
): Visibility[][] {
	const width = map.width;
	const height = map.height;

	// Downgrade all currently visible tiles to explored
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (visibility[y][x] === Visibility.Visible) {
				visibility[y][x] = Visibility.Explored;
			}
		}
	}

	// Compute new FOV and mark visible
	const fov = computeFOV(origin, map, radius);
	for (const key of fov) {
		const [x, y] = key.split(',').map(Number);
		if (x >= 0 && y >= 0 && x < width && y < height) {
			visibility[y][x] = Visibility.Visible;
		}
	}

	return visibility;
}
