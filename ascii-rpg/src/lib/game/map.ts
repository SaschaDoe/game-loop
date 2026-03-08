import type { GameMap, Tile, Position } from './types';
import { SeededRandom } from './seeded-random';

export function generateMap(width: number, height: number, level: number, rng?: SeededRandom): GameMap {
	const r = rng ?? new SeededRandom(Date.now());
	const tiles: Tile[][] = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => '#' as Tile)
	);

	const rooms: { x: number; y: number; w: number; h: number }[] = [];
	const roomCount = 5 + level;

	for (let i = 0; i < roomCount; i++) {
		const w = 4 + r.nextInt(6);
		const h = 3 + r.nextInt(4);
		const x = 1 + r.nextInt(width - w - 2);
		const y = 1 + r.nextInt(height - h - 2);

		let overlap = false;
		for (const room of rooms) {
			if (x <= room.x + room.w + 1 && x + w + 1 >= room.x && y <= room.y + room.h + 1 && y + h + 1 >= room.y) {
				overlap = true;
				break;
			}
		}
		if (overlap) continue;

		for (let ry = y; ry < y + h; ry++) {
			for (let rx = x; rx < x + w; rx++) {
				tiles[ry][rx] = '.';
			}
		}
		rooms.push({ x, y, w, h });
	}

	// connect rooms with corridors
	for (let i = 1; i < rooms.length; i++) {
		const a = { x: Math.floor(rooms[i - 1].x + rooms[i - 1].w / 2), y: Math.floor(rooms[i - 1].y + rooms[i - 1].h / 2) };
		const b = { x: Math.floor(rooms[i].x + rooms[i].w / 2), y: Math.floor(rooms[i].y + rooms[i].h / 2) };

		let cx = a.x;
		while (cx !== b.x) {
			tiles[a.y][cx] = '.';
			cx += cx < b.x ? 1 : -1;
		}
		let cy = a.y;
		while (cy !== b.y) {
			tiles[cy][b.x] = '.';
			cy += cy < b.y ? 1 : -1;
		}
	}

	// place stairs in last room
	if (rooms.length > 0) {
		const last = rooms[rooms.length - 1];
		tiles[last.y + 1][last.x + 1] = '>';
	}

	// add secret rooms (0-2 per level)
	const secretWalls = new Set<string>();
	const secretRoomCount = r.nextInt(3); // 0, 1, or 2
	for (let s = 0; s < secretRoomCount && rooms.length >= 2; s++) {
		const result = placeSecretRoom(tiles, rooms, width, height, r);
		if (result) {
			for (const key of result.walls) {
				secretWalls.add(key);
			}
			// Place a potion in the secret room
			const centerX = result.room.x + Math.floor(result.room.w / 2);
			const centerY = result.room.y + Math.floor(result.room.h / 2);
			if (tiles[centerY][centerX] === '.') {
				tiles[centerY][centerX] = '*';
			}
		}
	}

	// scatter some items
	const itemCount = 2 + level;
	let placed = 0;
	while (placed < itemCount) {
		const rx = r.nextInt(width);
		const ry = r.nextInt(height);
		if (tiles[ry][rx] === '.') {
			tiles[ry][rx] = '*';
			placed++;
		}
	}

	return { width, height, tiles, secretWalls };
}

function placeSecretRoom(
	tiles: Tile[][],
	existingRooms: { x: number; y: number; w: number; h: number }[],
	width: number,
	height: number,
	r: SeededRandom
): { room: { x: number; y: number; w: number; h: number }; walls: string[] } | null {
	// Try to place a small secret room adjacent to an existing room
	for (let attempt = 0; attempt < 20; attempt++) {
		const sourceRoom = r.pick(existingRooms);
		const sw = 2 + r.nextInt(2); // 2-3 wide
		const sh = 2 + r.nextInt(2); // 2-3 tall

		// Pick a side of the source room to attach to
		const side = r.nextInt(4);
		let sx: number, sy: number, wallX: number, wallY: number;

		switch (side) {
			case 0: // north
				sx = sourceRoom.x + r.nextInt(Math.max(1, sourceRoom.w - sw));
				sy = sourceRoom.y - sh - 1;
				wallX = sx + Math.floor(sw / 2);
				wallY = sourceRoom.y - 1;
				break;
			case 1: // south
				sx = sourceRoom.x + r.nextInt(Math.max(1, sourceRoom.w - sw));
				sy = sourceRoom.y + sourceRoom.h + 1;
				wallX = sx + Math.floor(sw / 2);
				wallY = sourceRoom.y + sourceRoom.h;
				break;
			case 2: // west
				sx = sourceRoom.x - sw - 1;
				sy = sourceRoom.y + r.nextInt(Math.max(1, sourceRoom.h - sh));
				wallX = sourceRoom.x - 1;
				wallY = sy + Math.floor(sh / 2);
				break;
			default: // east
				sx = sourceRoom.x + sourceRoom.w + 1;
				sy = sourceRoom.y + r.nextInt(Math.max(1, sourceRoom.h - sh));
				wallX = sourceRoom.x + sourceRoom.w;
				wallY = sy + Math.floor(sh / 2);
				break;
		}

		// Bounds check
		if (sx < 1 || sy < 1 || sx + sw >= width - 1 || sy + sh >= height - 1) continue;
		if (wallX < 0 || wallY < 0 || wallX >= width || wallY >= height) continue;

		// Check the secret room area is all walls (not overlapping anything)
		let valid = true;
		for (let ry = sy; ry < sy + sh; ry++) {
			for (let rx = sx; rx < sx + sw; rx++) {
				if (tiles[ry][rx] !== '#') {
					valid = false;
					break;
				}
			}
			if (!valid) break;
		}
		if (!valid) continue;

		// The wall between the source room and secret room must be a wall tile
		if (tiles[wallY][wallX] !== '#') continue;

		// Carve out the secret room
		for (let ry = sy; ry < sy + sh; ry++) {
			for (let rx = sx; rx < sx + sw; rx++) {
				tiles[ry][rx] = '.';
			}
		}

		const secretWallKeys = [`${wallX},${wallY}`];

		return { room: { x: sx, y: sy, w: sw, h: sh }, walls: secretWallKeys };
	}
	return null;
}

export function getSpawnPositions(map: GameMap, count: number, rng?: SeededRandom): Position[] {
	const r = rng ?? new SeededRandom(Date.now());
	const positions: Position[] = [];
	while (positions.length < count) {
		const x = r.nextInt(map.width);
		const y = r.nextInt(map.height);
		if (map.tiles[y][x] === '.' && !positions.some((p) => p.x === x && p.y === y)) {
			positions.push({ x, y });
		}
	}
	return positions;
}
