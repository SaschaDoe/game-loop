import type { GameMap, Tile, Position } from './types';

export function generateMap(width: number, height: number, level: number): GameMap {
	const tiles: Tile[][] = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => '#' as Tile)
	);

	const rooms: { x: number; y: number; w: number; h: number }[] = [];
	const roomCount = 5 + level;

	for (let i = 0; i < roomCount; i++) {
		const w = 4 + Math.floor(Math.random() * 6);
		const h = 3 + Math.floor(Math.random() * 4);
		const x = 1 + Math.floor(Math.random() * (width - w - 2));
		const y = 1 + Math.floor(Math.random() * (height - h - 2));

		let overlap = false;
		for (const r of rooms) {
			if (x <= r.x + r.w + 1 && x + w + 1 >= r.x && y <= r.y + r.h + 1 && y + h + 1 >= r.y) {
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

	// scatter some items
	const itemCount = 2 + level;
	let placed = 0;
	while (placed < itemCount) {
		const rx = Math.floor(Math.random() * width);
		const ry = Math.floor(Math.random() * height);
		if (tiles[ry][rx] === '.') {
			tiles[ry][rx] = '*';
			placed++;
		}
	}

	return { width, height, tiles };
}

export function getSpawnPositions(map: GameMap, count: number): Position[] {
	const positions: Position[] = [];
	while (positions.length < count) {
		const x = Math.floor(Math.random() * map.width);
		const y = Math.floor(Math.random() * map.height);
		if (map.tiles[y][x] === '.' && !positions.some((p) => p.x === x && p.y === y)) {
			positions.push({ x, y });
		}
	}
	return positions;
}
