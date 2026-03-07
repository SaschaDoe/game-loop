import type { GameMap, Position, Tile, Entity, NPC, StartingLocation } from './types';

export interface LocationResult {
	map: GameMap;
	playerPos: Position;
	npcs: NPC[];
	enemies: Entity[];
	initialHpFactor: number;
	welcomeMessage: string;
}

export const STARTING_LOCATIONS: Record<StartingLocation, { label: string; difficulty: string; description: string }> = {
	village: { label: 'VILLAGE', difficulty: 'Easy', description: 'Start at home with your parents' },
	tavern: { label: 'TAVERN', difficulty: 'Medium', description: 'Start at an inn with rumors' },
	cave: { label: 'CAVE', difficulty: 'Hard', description: 'Start as a goblin prisoner' }
};

function makeWallGrid(width: number, height: number): Tile[][] {
	return Array.from({ length: height }, () =>
		Array.from({ length: width }, () => '#' as Tile)
	);
}

function fillRect(tiles: Tile[][], x: number, y: number, w: number, h: number, tile: Tile) {
	for (let ry = y; ry < y + h && ry < tiles.length; ry++) {
		for (let rx = x; rx < x + w && rx < tiles[0].length; rx++) {
			tiles[ry][rx] = tile;
		}
	}
}

function drawBuilding(tiles: Tile[][], x: number, y: number, w: number, h: number, doorSide: 'north' | 'south' | 'east' | 'west') {
	fillRect(tiles, x, y, w, h, '#');
	fillRect(tiles, x + 1, y + 1, w - 2, h - 2, '.');
	const mx = x + Math.floor(w / 2);
	const my = y + Math.floor(h / 2);
	switch (doorSide) {
		case 'south': tiles[y + h - 1][mx] = '.'; break;
		case 'north': tiles[y][mx] = '.'; break;
		case 'east': tiles[my][x + w - 1] = '.'; break;
		case 'west': tiles[my][x] = '.'; break;
	}
}

function makeNPC(x: number, y: number, char: string, color: string, name: string, dialogue: string[], gives?: { hp?: number; atk?: number }, mood: NPC['mood'] = 'friendly'): NPC {
	return { pos: { x, y }, char, color, name, dialogue, dialogueIndex: 0, gives, given: false, mood, moodTurns: 0 };
}

function generateVillage(width: number, height: number): LocationResult {
	const tiles = makeWallGrid(width, height);

	// Open village area
	fillRect(tiles, 1, 1, width - 2, height - 2, '.');

	// Player's house (center-left)
	drawBuilding(tiles, 6, 6, 14, 7, 'south');

	// Small buildings (other village homes)
	drawBuilding(tiles, 2, 2, 6, 4, 'south');
	drawBuilding(tiles, 10, 2, 6, 4, 'south');
	drawBuilding(tiles, 24, 2, 6, 4, 'south');
	drawBuilding(tiles, 24, 8, 6, 5, 'west');

	// Potions scattered in village
	tiles[14][4] = '*';
	tiles[14][20] = '*';
	tiles[18][10] = '*';

	// Dungeon entrance
	tiles[height - 4][width - 8] = '>';

	const playerPos = { x: 12, y: 10 };

	const npcs: NPC[] = [
		makeNPC(10, 8, 'M', '#f8a', 'Mother', [
			'Be careful out there, dear.',
			'Take this healing salve. You\'ll need it.',
			'Come back safe...'
		], { hp: 5 }),
		makeNPC(15, 8, 'F', '#8af', 'Father', [
			'Here, take my old sword. It served me well.',
			'The dungeon entrance is to the east.',
			'May the light guide you.'
		], { atk: 1 })
	];

	return {
		map: { width, height, tiles, secretWalls: new Set() },
		playerPos,
		npcs,
		enemies: [],
		initialHpFactor: 1.0,
		welcomeMessage: 'You wake in your family home in Willowmere. Move with WASD. Bump into people to talk.'
	};
}

function generateTavern(width: number, height: number): LocationResult {
	const tiles = makeWallGrid(width, height);

	// Tavern room
	fillRect(tiles, 4, 3, 32, 16, '.');

	// Bar counter (back wall)
	fillRect(tiles, 5, 4, 14, 3, '#');
	fillRect(tiles, 6, 5, 12, 1, '.');

	// Tables
	fillRect(tiles, 10, 10, 2, 2, '#');
	fillRect(tiles, 17, 10, 2, 2, '#');
	fillRect(tiles, 24, 10, 2, 2, '#');
	fillRect(tiles, 13, 14, 2, 2, '#');
	fillRect(tiles, 20, 14, 2, 2, '#');

	// Potion on counter
	tiles[5][11] = '*';

	// Stairs to dungeon
	tiles[16][32] = '>';

	const playerPos = { x: 16, y: 12 };

	const npcs: NPC[] = [
		makeNPC(9, 5, 'B', '#fa8', 'Barkeep', [
			'Welcome to The Rusty Flagon!',
			'Have a drink on the house. Looks like you need it.',
			'The dungeon below has been causing trouble lately...'
		], { hp: 3 }),
		makeNPC(25, 11, '?', '#8ff', 'Hooded Stranger', [
			'The deeper levels hold greater treasures...',
			'Beware the bosses that guard every fifth floor.',
			'Some walls hide secret passages. Stay observant.'
		]),
		makeNPC(12, 15, 'D', '#888', 'Drunk Patron', [
			'*hic* I shee two of you...',
			'The wallsh... they have shecretsh... *hic*',
			'Zzzz...'
		])
	];

	return {
		map: { width, height, tiles, secretWalls: new Set() },
		playerPos,
		npcs,
		enemies: [],
		initialHpFactor: 1.0,
		welcomeMessage: 'The Rusty Flagon tavern. Talk to the patrons before venturing into the dungeon below.'
	};
}

function generateCave(width: number, height: number): LocationResult {
	const tiles = makeWallGrid(width, height);

	// Main cave room (upper area)
	fillRect(tiles, 8, 3, 22, 9, '.');

	// Connecting corridor
	fillRect(tiles, 13, 12, 3, 5, '.');

	// Prison cell (bottom)
	fillRect(tiles, 10, 17, 9, 5, '.');

	// Potion in cell
	tiles[19][16] = '*';

	// Stairs (cave exit to dungeon)
	tiles[5][25] = '>';

	const playerPos = { x: 14, y: 19 };

	const npcs: NPC[] = [
		makeNPC(12, 19, 'T', '#c8f', 'Thessaly', [
			'The goblins... they captured me weeks ago.',
			'I\'m a scholar from the Athenaeum. Kill the Jailer for the key!',
			'Be careful out there...'
		])
	];

	const enemies: Entity[] = [
		{ pos: { x: 15, y: 5 }, char: 'g', color: '#0f0', name: 'Goblin Guard', hp: 4, maxHp: 4, attack: 2, statusEffects: [] },
		{ pos: { x: 22, y: 7 }, char: 'g', color: '#0f0', name: 'Goblin Guard', hp: 3, maxHp: 3, attack: 1, statusEffects: [] },
		{ pos: { x: 18, y: 9 }, char: 'g', color: '#0a0', name: 'Goblin Jailer', hp: 5, maxHp: 5, attack: 2, statusEffects: [] }
	];

	return {
		map: { width, height, tiles, secretWalls: new Set() },
		playerPos,
		npcs,
		enemies,
		initialHpFactor: 0.6,
		welcomeMessage: 'You awaken in a goblin prison cell. Escape through the exit to the north!'
	};
}

export function generateStartingLocation(location: StartingLocation, width: number, height: number): LocationResult {
	switch (location) {
		case 'village': return generateVillage(width, height);
		case 'tavern': return generateTavern(width, height);
		case 'cave': return generateCave(width, height);
	}
}
