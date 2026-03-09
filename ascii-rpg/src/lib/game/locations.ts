import type { GameMap, Position, Tile, Entity, NPC, StartingLocation } from './types';
import type { SettlementType } from './overworld';

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
	cave: { label: 'CAVE', difficulty: 'Hard', description: 'Start as a goblin prisoner' },
	academy: { label: 'ACADEMY', difficulty: 'Medium', description: 'Enroll at the Arcane Academy' }
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

function generateTemple(width: number, height: number): LocationResult {
	const tiles = makeWallGrid(width, height);

	// Main prayer hall (large open space, extends to x=37 to connect to side chambers)
	fillRect(tiles, 3, 2, 35, 18, '.');

	// Altar platform at the north end
	fillRect(tiles, 14, 3, 12, 3, '#');
	fillRect(tiles, 15, 4, 10, 1, '.');
	tiles[4][20] = '*'; // offering on altar

	// Pew rows (stone benches)
	for (let row = 0; row < 3; row++) {
		fillRect(tiles, 8, 9 + row * 3, 10, 1, '#');
		fillRect(tiles, 22, 9 + row * 3, 10, 1, '#');
	}

	// Side chambers (monk quarters west, reliquary east)
	drawBuilding(tiles, 38, 3, 10, 8, 'west');
	drawBuilding(tiles, 38, 12, 10, 7, 'west');

	// Inner sanctum behind the altar (riddle reward room)
	fillRect(tiles, 16, 1, 8, 1, '#');
	tiles[1][20] = '*'; // hidden blessing potion

	// Dungeon entrance (catacombs below)
	tiles[height - 3][width - 6] = '>';

	const playerPos = { x: 18, y: 14 };

	const npcs: NPC[] = [
		makeNPC(20, 4, 'P', '#ff8', 'High Priest', [
			'Welcome, traveler. This temple has stood since the Age of Ascension.',
			'The gods watch over us... though some say the gods have secrets of their own.',
			'Kneel before the altar, and receive a blessing for your journey.',
			'I sense a great destiny in you. Take this healing prayer.'
		], { hp: 8 }),
		makeNPC(40, 5, 'A', '#aaf', 'Acolyte', [
			'The inscriptions on the walls tell of the Original Seven — beings of pure principle.',
			'Before the Ascended, there were others. The texts speak of stolen thrones...',
			'Shh — the High Priest does not like us discussing the old writings.',
			'If you seek truth, look beyond what the Church teaches.'
		]),
		makeNPC(40, 15, 'K', '#faa', 'Reliquary Keeper', [
			'I guard the relics of ages past. Each one tells a story.',
			'This crystal shard? It predates the Ascended themselves.',
			'The Crystalborn Kingdoms forged wonders we cannot replicate.',
			'Some say the relics still resonate with Ley Line energy...'
		], { atk: 1 }),
		makeNPC(15, 12, 'L', '#8a8', 'Pilgrim', [
			'I walked here from the Hearthlands. Three weeks on the road.',
			'Have you heard the riddle of Verath\'s Scales? "What weighs nothing yet crushes the wicked?"',
			'The answer, they say, is guilt. But I wonder if the god of justice knows guilt himself...',
			'Safe travels, friend.'
		])
	];

	return {
		map: { width, height, tiles, secretWalls: new Set() },
		playerPos,
		npcs,
		enemies: [],
		initialHpFactor: 1.0,
		welcomeMessage: 'A temple of weathered stone. Incense hangs in the air. Speak with the faithful.'
	};
}

function generateFortress(width: number, height: number): LocationResult {
	const tiles = makeWallGrid(width, height);

	// Outer courtyard
	fillRect(tiles, 2, 8, 20, 12, '.');

	// Training yard (west courtyard)
	tiles[12][5] = '#'; // training dummy
	tiles[12][9] = '#'; // training dummy
	tiles[14][7] = '#'; // weapon rack

	// Main fortress building (east)
	fillRect(tiles, 24, 2, 24, 18, '.');

	// Barracks (north-east rooms)
	drawBuilding(tiles, 25, 3, 10, 6, 'south');
	// Beds inside barracks
	tiles[5][27] = '#';
	tiles[5][29] = '#';
	tiles[5][31] = '#';
	tiles[7][27] = '#';
	tiles[7][29] = '#';
	tiles[7][31] = '#';

	// Armory (south-east room)
	drawBuilding(tiles, 37, 3, 10, 6, 'south');
	tiles[5][40] = '*'; // weapon
	tiles[5][43] = '*'; // armor piece

	// Commander's quarters (south)
	drawBuilding(tiles, 30, 14, 12, 6, 'north');

	// Connecting corridors
	fillRect(tiles, 22, 10, 2, 4, '.'); // courtyard to building
	fillRect(tiles, 25, 10, 22, 3, '.'); // main hall

	// Gate entrance (south wall of courtyard)
	tiles[19][12] = '.';

	// Dungeon entrance (prison below)
	tiles[height - 3][width - 4] = '>';

	const playerPos = { x: 12, y: 16 };

	const npcs: NPC[] = [
		makeNPC(35, 16, 'C', '#f44', 'Commander Voss', [
			'This fortress guards the border. We hold the line.',
			'Bandits and worse lurk in the wilds. My scouts report movement.',
			'You look capable. Take this — you\'ll need a sharp blade out there.',
			'If you clear the tunnels below, there\'s a reward in it for you.'
		], { atk: 2 }),
		makeNPC(28, 5, 'S', '#88f', 'Sergeant Hale', [
			'Fall in line, recruit! Just kidding — you\'re not enlisted. Yet.',
			'We train every dawn. The creatures in these lands don\'t rest.',
			'The commander lost half a platoon in the Thornwild last month.',
			'Watch yourself in the tunnels. Something down there isn\'t natural.'
		]),
		makeNPC(40, 5, 'Q', '#fa8', 'Quartermaster', [
			'Supplies are tight. The last caravan was ambushed.',
			'I can spare a healing kit — take it, you look like you need it.',
			'The armory has seen better days, but the blades still cut true.'
		], { hp: 5 }),
		makeNPC(6, 12, 'R', '#4a4', 'Scout', [
			'The Thornlands are crawling with creatures displaced from the Ashlands.',
			'I found tracks near the old Iron Republic ruins — something big.',
			'If you see any Iron Republic artifacts, bring them back. Worth a fortune.',
			'The old foundries still smoke sometimes. Nobody knows why.'
		])
	];

	const enemies: Entity[] = [
		{ pos: { x: 46, y: 18 }, char: 'r', color: '#a44', name: 'Dungeon Rat', hp: 3, maxHp: 3, attack: 1, statusEffects: [] }
	];

	return {
		map: { width, height, tiles, secretWalls: new Set() },
		playerPos,
		npcs,
		enemies,
		initialHpFactor: 1.0,
		welcomeMessage: 'A stone fortress bristling with battlements. Soldiers patrol the walls.'
	};
}

function generateMarketTown(width: number, height: number): LocationResult {
	const tiles = makeWallGrid(width, height);

	// Town square (large open area)
	fillRect(tiles, 1, 1, width - 2, height - 2, '.');

	// Market stalls (center)
	fillRect(tiles, 12, 8, 3, 3, '#');  // stall 1
	fillRect(tiles, 18, 8, 3, 3, '#');  // stall 2
	fillRect(tiles, 24, 8, 3, 3, '#');  // stall 3

	// Well in the center
	tiles[12][19] = '#';

	// Town hall (north building)
	drawBuilding(tiles, 14, 1, 14, 5, 'south');

	// Blacksmith (west)
	drawBuilding(tiles, 2, 3, 8, 6, 'east');
	tiles[5][4] = '*'; // weapon for sale

	// General store (east)
	drawBuilding(tiles, 32, 3, 8, 6, 'west');
	tiles[5][35] = '*'; // potion
	tiles[6][36] = '*'; // supplies

	// Houses along south wall
	drawBuilding(tiles, 3, 16, 8, 5, 'north');
	drawBuilding(tiles, 14, 16, 8, 5, 'north');
	drawBuilding(tiles, 30, 16, 8, 5, 'north');

	// Dungeon entrance (sewers)
	tiles[height - 2][width - 3] = '>';

	const playerPos = { x: 19, y: 13 };

	const npcs: NPC[] = [
		makeNPC(14, 9, 'V', '#da4', 'Vendor', [
			'Fresh goods! Potions, herbs, and curiosities!',
			'I trade with caravans from all six — er, seven regions.',
			'The Thornlands traders bring Iron Republic relics. Fascinating stuff.',
			'Be careful what you buy from the hooded merchants. Not everything is as it seems.'
		], { hp: 3 }),
		makeNPC(4, 5, 'B', '#f88', 'Blacksmith', [
			'Need a blade sharpened? Step right up.',
			'I forge steel the old way — none of that Crystalborn nonsense.',
			'Take this dagger. First one\'s on the house for adventurers.',
			'The old Iron foundries made weapons that never dulled. Lost art, that.'
		], { atk: 1 }),
		makeNPC(35, 5, 'G', '#8f8', 'General Merchant', [
			'Welcome! I stock everything a traveler needs.',
			'Rations, rope, torches — the basics keep you alive.',
			'I heard rumors of a hidden vault beneath the old market.',
			'If you\'re heading into the wilds, stock up now.'
		]),
		makeNPC(20, 3, 'M', '#aaf', 'Mayor', [
			'Welcome to our town. We\'re a peaceful folk here.',
			'The roads have grown dangerous. Bandits, monsters, and worse.',
			'If you could help clear the sewers below, the town would be grateful.',
			'There\'s something living down there. The merchants are worried.'
		]),
		makeNPC(6, 18, 'W', '#f4f', 'Wise Woman', [
			'The stars have been strange lately. Do you feel it too?',
			'The gods are not what they seem, child. Remember that.',
			'I was taught by a woman who was taught by a woman who knew the truth.',
			'Seven thrones, seven lies. That\'s all I\'ll say.'
		])
	];

	return {
		map: { width, height, tiles, secretWalls: new Set() },
		playerPos,
		npcs,
		enemies: [],
		initialHpFactor: 1.0,
		welcomeMessage: 'A bustling market town. Merchants hawk their wares in the central square.'
	};
}

function generateCamp(width: number, height: number): LocationResult {
	const tiles = makeWallGrid(width, height);

	// Open camp clearing
	fillRect(tiles, 2, 2, width - 4, height - 4, '.');

	// Central campfire
	tiles[10][20] = '#';
	tiles[10][21] = '#';
	tiles[11][20] = '#';
	tiles[11][21] = '#';

	// Tents (scattered around campfire)
	drawBuilding(tiles, 6, 4, 6, 4, 'south');   // tent 1
	drawBuilding(tiles, 28, 4, 6, 4, 'south');   // tent 2
	drawBuilding(tiles, 6, 15, 6, 4, 'north');   // tent 3
	drawBuilding(tiles, 28, 15, 6, 4, 'north');   // tent 4

	// Supply crates
	tiles[8][18] = '#';
	tiles[8][23] = '#';

	// Potion near campfire
	tiles[12][19] = '*';

	// Lookout post (raised platform)
	fillRect(tiles, 38, 2, 6, 4, '#');
	fillRect(tiles, 39, 3, 4, 2, '.');
	tiles[5][41] = '.'; // ladder down

	// Dungeon/cave entrance
	tiles[height - 3][width - 5] = '>';

	const playerPos = { x: 20, y: 13 };

	const npcs: NPC[] = [
		makeNPC(19, 9, 'L', '#f84', 'Camp Leader', [
			'Sit by the fire, traveler. You look road-weary.',
			'We\'re a band of free folk — no lord, no church, no chains.',
			'The wilds are harsh, but we survive. Have some stew.',
			'Watch for wolves at night. They\'ve been bolder since the quakes.'
		], { hp: 4 }),
		makeNPC(8, 6, 'H', '#8af', 'Healer', [
			'I know the old remedies. The forest provides, if you know where to look.',
			'This poultice will ease your wounds. Hold still.',
			'The herbs here are different from the Greenweald. More bitter, but potent.'
		], { hp: 5 }),
		makeNPC(30, 6, 'T', '#fa4', 'Trapper', [
			'I set snares along the ridge. Caught three rabbits this morning.',
			'Something big has been prowling near the old ruins to the east.',
			'If you\'re heading underground, take a torch. It\'s pitch black down there.',
			'The Iron Republic tunnels connect to something deeper. I don\'t go past the first chamber.'
		]),
		makeNPC(40, 3, 'W', '#4af', 'Lookout', [
			'I can see three regions from up here on a clear day.',
			'Smoke rising from the east — could be bandits, could be worse.',
			'A caravan passed through yesterday heading north. They looked scared.',
			'Keep your weapons close. Something\'s stirring in the Thornlands.'
		])
	];

	return {
		map: { width, height, tiles, secretWalls: new Set() },
		playerPos,
		npcs,
		enemies: [],
		initialHpFactor: 1.0,
		welcomeMessage: 'A rough camp in the wilderness. A campfire crackles at its center.'
	};
}

function generateCity(width: number, height: number): LocationResult {
	const tiles = makeWallGrid(width, height);

	// City streets (open areas forming a cross pattern)
	fillRect(tiles, 1, 1, width - 2, height - 2, '.');

	// Castle keep (north-center, dominant structure)
	drawBuilding(tiles, 16, 1, 18, 7, 'south');
	// Throne room inside
	tiles[4][25] = '#'; // throne

	// Guild hall (west)
	drawBuilding(tiles, 2, 2, 12, 6, 'east');

	// Chapel (east)
	drawBuilding(tiles, 36, 2, 12, 6, 'west');
	tiles[4][42] = '#'; // altar

	// Market stalls (center row)
	fillRect(tiles, 10, 10, 3, 2, '#');
	fillRect(tiles, 16, 10, 3, 2, '#');
	fillRect(tiles, 22, 10, 3, 2, '#');
	fillRect(tiles, 28, 10, 3, 2, '#');
	fillRect(tiles, 34, 10, 3, 2, '#');

	// Tavern (south-west)
	drawBuilding(tiles, 2, 14, 10, 6, 'north');

	// Barracks (south-east)
	drawBuilding(tiles, 38, 14, 10, 6, 'north');

	// Fountain/well in center
	tiles[13][25] = '#';

	// Houses along south wall
	drawBuilding(tiles, 14, 16, 8, 5, 'north');
	drawBuilding(tiles, 26, 16, 8, 5, 'north');

	// Potions
	tiles[4][20] = '*';
	tiles[16][4] = '*';
	tiles[13][30] = '*';

	// Dungeon entrance (catacombs below the castle)
	tiles[height - 2][width - 3] = '>';

	const playerPos = { x: 25, y: 13 };

	const npcs: NPC[] = [
		makeNPC(25, 3, 'K', '#ff4', 'King Aldren', [
			'Welcome to my court, adventurer. These are troubled times.',
			'The Thornlands grow wild, and the old Iron Republic stirs beneath the earth.',
			'My spies report that the Church of the Radiant Sun hides something. But what?',
			'Serve the crown well, and you shall be rewarded.',
			'There are seven gods, yet I am told there were once seven before them. Curious, no?'
		], { hp: 5 }),
		makeNPC(5, 4, 'G', '#8af', 'Guildmaster Petra', [
			'The Adventurers\' Guild welcomes all who seek fortune and glory.',
			'We\'ve posted bounties on the creatures infesting the catacombs below.',
			'Our best scouts have mapped passages connecting to every region.',
			'Take this emblem. It marks you as one of ours.'
		], { atk: 1 }),
		makeNPC(42, 4, 'F', '#ffa', 'Father Cassian', [
			'The Radiant Sun watches over us all, child.',
			'Pray here and receive the blessing of Verath, god of justice.',
			'Some say the gods were once mortal. Heresy, of course. Pure heresy.',
			'...But sometimes I wonder why the old texts are locked away.'
		], { hp: 6 }),
		makeNPC(16, 10, 'V', '#da4', 'Master Trader', [
			'Finest goods from all eight regions! What catches your eye?',
			'The Thornlands traders bring mechanical curiosities. Fascinating, if dangerous.',
			'I once traded with a nomad from the Sunstone Expanse. He paid in starlight. Literally.',
			'The deep roads connect the undercities, if you dare travel them.'
		]),
		makeNPC(4, 16, 'B', '#f88', 'Barkeep', [
			'The city\'s finest ale, right here at The Golden Flagon.',
			'The soldiers in the barracks talk of strange lights in the catacombs.',
			'A hooded figure was asking about Ley Lines last week. Gave me the creeps.',
			'Have a drink. You look like you\'ve seen things.'
		], { hp: 3 }),
		makeNPC(42, 16, 'C', '#88f', 'Captain of the Guard', [
			'Keep order within the walls and we\'ll have no trouble.',
			'The catacombs beneath the castle have been sealed for years. Something broke through.',
			'I\'ve lost three patrols in the past month. Whatever\'s down there is getting stronger.',
			'If you\'re heading below, take this blade. It\'s served me well.'
		], { atk: 2 }),
		makeNPC(30, 13, 'S', '#a8f', 'Hooded Scholar', [
			'I study the gaps between what the Church teaches and what the ruins reveal.',
			'The Original Seven were not gods. They were principles — Order, Spirit, Energy, Change, Space, Matter, Time.',
			'The Ascended took their thrones. But who were the Ascended before they ascended?',
			'Find the Crystalborn archives. The truth is there, if the Veiled Hand hasn\'t destroyed it.'
		])
	];

	return {
		map: { width, height, tiles, secretWalls: new Set() },
		playerPos,
		npcs,
		enemies: [],
		initialHpFactor: 1.0,
		welcomeMessage: 'A walled city thrums with life. Castle spires rise above market stalls and temple domes.'
	};
}

function generateHarbor(width: number, height: number): LocationResult {
	const tiles = makeWallGrid(width, height);

	// Open harbor area
	fillRect(tiles, 1, 1, width - 2, height - 2, '.');

	// Dock piers extending south (water at bottom)
	fillRect(tiles, 1, height - 3, width - 2, 2, '#'); // water wall
	fillRect(tiles, 5, height - 6, 2, 4, '.'); // pier 1
	fillRect(tiles, 15, height - 6, 2, 4, '.'); // pier 2
	fillRect(tiles, 25, height - 6, 2, 4, '.'); // pier 3
	fillRect(tiles, 35, height - 6, 2, 4, '.'); // pier 4

	// Warehouse (west)
	drawBuilding(tiles, 2, 2, 12, 6, 'south');
	tiles[4][6] = '*'; // cargo
	tiles[4][10] = '*'; // supplies

	// Harbormaster's office (east)
	drawBuilding(tiles, 30, 2, 12, 6, 'south');

	// Tavern (center-north)
	drawBuilding(tiles, 16, 2, 10, 5, 'south');

	// Fish market stalls
	fillRect(tiles, 10, 10, 3, 2, '#');
	fillRect(tiles, 18, 10, 3, 2, '#');
	fillRect(tiles, 26, 10, 3, 2, '#');

	// Rope coils and crates on the dock
	tiles[14][8] = '#';
	tiles[14][38] = '#';

	// Dungeon entrance (smuggler tunnels below docks)
	tiles[height - 4][width - 5] = '>';

	const playerPos = { x: 20, y: 12 };

	const npcs: NPC[] = [
		makeNPC(34, 4, 'H', '#8bd', 'Harbormaster Kael', [
			'Every ship that docks pays the harbor tax. No exceptions.',
			'The Hollow Sea has been rough lately. Three ships lost this season.',
			'Smugglers use the tunnels beneath the docks. I look the other way — for a price.',
			'If you\'re heading south, book passage on the morning tide.'
		], { hp: 3 }),
		makeNPC(20, 4, 'B', '#fa8', 'Dockside Barkeep', [
			'Sailors drink here before and after every voyage. Sometimes during.',
			'The old captain in the corner claims he sailed to the edge of the Hollow Sea.',
			'He says the water turns to glass out there. You can see straight to the bottom.',
			'Whatever you do, don\'t drink the grog. Stick to ale.'
		], { hp: 2 }),
		makeNPC(12, 10, 'F', '#4af', 'Fish Monger', [
			'Fresh catch! Straight from the shallows! Only slightly haunted!',
			'The fish have been strange lately. Some glow. Some have extra eyes.',
			'It\'s the Hollow Sea. Dro-Mahk\'s death changed the water itself.',
			'Still tastes fine though. Probably.'
		]),
		makeNPC(40, 14, 'C', '#aaf', 'Old Captain', [
			'I\'ve sailed every coast and harbor in this world.',
			'Out past the reef, the water changes. It gets... thin. Like reality is stretched.',
			'I saw a city beneath the waves once. Spires of crystal reaching up. Then the fog rolled in.',
			'The Sunken Dominion, they call it. Pelagathis. A civilization swallowed whole.',
			'Don\'t go looking for it. The sea doesn\'t give back what it takes.'
		]),
		makeNPC(6, 4, 'W', '#886', 'Warehouse Clerk', [
			'We store cargo from every region. Thornlands iron, Greenweald timber, Sunstone spices.',
			'Some crates arrive sealed with warnings in Tidespeak. We don\'t open those.',
			'A shipment of Crystalborn artifacts went missing last month. The Veiled Hand, I reckon.'
		], { atk: 1 })
	];

	return {
		map: { width, height, tiles, secretWalls: new Set() },
		playerPos,
		npcs,
		enemies: [],
		initialHpFactor: 1.0,
		welcomeMessage: 'A bustling harbor. Salt-crusted docks stretch into grey water. Seabirds cry overhead.'
	};
}

function generateKorthaven(width: number, height: number): LocationResult {
	const tiles = makeWallGrid(width, height);

	// Open the entire interior
	fillRect(tiles, 1, 1, width - 2, height - 2, '.');

	// === Duke's Palace (north-center) ===
	drawBuilding(tiles, 17, 1, 16, 7, 'south');
	tiles[3][25] = '#'; // throne
	tiles[3][24] = '#'; // throne dais
	tiles[3][26] = '#'; // throne dais

	// === Temple of Mercatus (west side) ===
	drawBuilding(tiles, 2, 3, 12, 7, 'east');
	tiles[6][7] = '#'; // altar
	tiles[6][8] = '#'; // altar

	// === The Crucible Arena (east side) ===
	drawBuilding(tiles, 36, 3, 12, 7, 'west');
	// Fighting pit (open floor inside)
	fillRect(tiles, 39, 5, 6, 3, '.');
	tiles[6][42] = '#'; // arena pillar

	// === Grand Market (center, 6 stalls) ===
	fillRect(tiles, 10, 10, 3, 2, '#');
	fillRect(tiles, 16, 10, 3, 2, '#');
	fillRect(tiles, 22, 10, 3, 2, '#');
	fillRect(tiles, 28, 10, 3, 2, '#');
	fillRect(tiles, 34, 10, 3, 2, '#');
	fillRect(tiles, 40, 10, 3, 2, '#');

	// === Fountain plaza (center) ===
	tiles[13][25] = '#'; // fountain center
	tiles[12][25] = '#'; // fountain north
	tiles[14][25] = '#'; // fountain south
	tiles[13][24] = '#'; // fountain west
	tiles[13][26] = '#'; // fountain east

	// === Apothecary (mid-west) ===
	drawBuilding(tiles, 2, 12, 7, 5, 'east');
	tiles[14][4] = '*'; // potion on shelf

	// === The Gilded Flagon tavern (south-west) ===
	drawBuilding(tiles, 2, 18, 12, 6, 'north');
	tiles[20][5] = '*'; // ale barrel
	tiles[20][10] = '#'; // bar counter
	tiles[21][10] = '#'; // bar counter

	// === Guard Barracks (south-east) ===
	drawBuilding(tiles, 36, 18, 12, 6, 'north');
	tiles[20][40] = '#'; // weapon rack
	tiles[20][44] = '#'; // weapon rack

	// === Thieves' Guild hideout (south, small hidden building) ===
	drawBuilding(tiles, 18, 20, 6, 4, 'north');

	// === Dock warehouse (south-center-east) ===
	drawBuilding(tiles, 26, 18, 8, 5, 'north');
	tiles[20][28] = '#'; // crate
	tiles[20][31] = '#'; // crate

	// === Inspector's post (near Palace, north-east) ===
	// Just a small open area near the palace with some furnishing
	tiles[8][30] = '#'; // desk

	// Scattered potions
	tiles[6][4] = '*';
	tiles[20][42] = '*';
	tiles[13][30] = '*';

	// Dungeon entrance
	tiles[height - 2][width - 3] = '>';

	const playerPos = { x: 25, y: 13 };

	const npcs: NPC[] = [
		// 1. Duke Arandel — Palace
		makeNPC(25, 3, 'D', '#ff4', 'Duke Arandel', [
			'Korthaven stands at the crossroads of trade and power. I intend to keep it that way.',
			'The merchant guilds grow bold. They forget who granted their charters.',
			'There are whispers of an old throne beneath the city — older than any duke.',
			'Serve Korthaven faithfully and you will find me a generous patron.',
			'Tell no one, but I\'ve seen documents that suggest the gods themselves once walked these docks.'
		], { hp: 5 }),

		// 2. Arena Master Gorath — Arena
		makeNPC(41, 5, 'G', '#f84', 'Arena Master Gorath', [
			'Welcome to the Crucible! Blood and glory, that\'s what we deal in.',
			'Kael is my best fighter. Undefeated in thirty bouts.',
			'The crowd loves spectacle. Give them a show and the coin flows.',
			'Some fighters come from the Thornlands with mechanical limbs. Hard to beat.',
			'I once saw a man fight with light in his fists. Church shut that down fast.'
		]),

		// 3. Pit Fighter Kael — Arena
		makeNPC(43, 7, 'K', '#fa4', 'Pit Fighter Kael', [
			'You want to challenge me? Get in line.',
			'I fight because it\'s honest. No politics, no schemes — just steel.',
			'The Arena Master says I\'m his best. I say I haven\'t met my match yet.',
			'There\'s a fighter in the underground circuit who uses shadow magic. I want that bout.'
		]),

		// 4. Brother Aldric — Temple
		makeNPC(7, 6, 'A', '#ffa', 'Brother Aldric', [
			'Mercatus teaches that fair exchange elevates the soul.',
			'Every coin spent honestly is a prayer. Every swindle, a sin.',
			'The old texts speak of a time before Mercatus held the throne of commerce.',
			'I sometimes wonder — what was Mercatus before becoming a god?',
			'Take this blessing. May your trades be just.'
		], { hp: 3 }),

		// 5. Merchant Prince Zara — Market
		makeNPC(16, 10, 'Z', '#da4', 'Merchant Prince Zara', [
			'I control half the trade flowing through Korthaven. The Duke controls the other half.',
			'The Sunstone Expanse sends spices worth more than gold. If you can survive the delivery.',
			'Competition is healthy. Monopoly is divine. Guess which I prefer.',
			'A shipment from the Hollow Sea coast arrived last week. The goods were... changed.',
			'Buy low, sell high, and never trust a smiling merchant. Including me.'
		]),

		// 6. Traveling Merchant — Market
		makeNPC(28, 10, 'T', '#da4', 'Traveling Merchant', [
			'I\'ve walked every road from the Grey Wastes to the Greenweald.',
			'The strangest thing I ever traded? A bottled memory. Don\'t ask where I got it.',
			'Roads are getting dangerous. Bandits near the Thornlands, worse things elsewhere.',
			'If you need supplies, I\'m your best bet this side of the mountains.'
		]),

		// 7. Madame Vesper — Tavern
		makeNPC(5, 20, 'V', '#c8f', 'Madame Vesper', [
			'The Gilded Flagon has served Korthaven for three generations. My grandmother built it.',
			'Every secret in this city passes through my tavern eventually.',
			'The Duke\'s inspector drinks here when he thinks no one is watching.',
			'Old Daven in the corner knows more than he lets on. Buy him an ale.',
			'I hear things. For the right price, you might hear them too.'
		]),

		// 8. Old Daven — Tavern
		makeNPC(10, 22, 'O', '#888', 'Old Daven', [
			'I\'ve been drinking at this bar since before your parents were born.',
			'The tunnels under Korthaven... they connect to something old. Very old.',
			'I was a sailor once. Saw the Hollow Sea turn to glass under a full moon.',
			'The Thieves\' Guild thinks they\'re hidden. Everyone knows where they are.',
			'Buy me another ale and I\'ll tell you about the god who drowned.'
		]),

		// 9. Inspector Kaelen — near Palace
		makeNPC(30, 8, 'I', '#8af', 'Inspector Kaelen', [
			'I keep order in Korthaven. The Duke\'s eyes and ears, they call me.',
			'The Thieves\' Guild operates brazenly. I\'ll shut them down — eventually.',
			'Something stirs in the catacombs beneath the old quarter. I need capable hands.',
			'Take this. Consider it a retainer for services to the city.'
		], { hp: 2 }),

		// 10. Apothecary Mora — Apothecary
		makeNPC(4, 14, 'M', '#4a4', 'Apothecary Mora', [
			'Herbs, tinctures, and remedies for every ailment. Step inside.',
			'The Grey Wastes yield rare mosses that cure what no prayer can.',
			'I distill essences from Hollow Sea kelp. The properties are... unusual.',
			'A healthy adventurer is a living adventurer. Take this draught.',
			'Some say my potions work too well. I say the plants know what they\'re doing.'
		], { hp: 4 }),

		// 11. Guildmaster Nyx — Thieves' Guild
		makeNPC(20, 22, 'N', '#a4f', 'Guildmaster Nyx', [
			'You found us. Impressive. Or someone told you. Less impressive.',
			'The Guild offers services the law cannot. Discretion is our currency.',
			'Inspector Kaelen thinks he\'ll shut us down. He\'s been saying that for years.',
			'We have eyes in every faction. The Church, the Crown, even the merchant houses.',
			'There\'s a vault beneath the Duke\'s Palace that no one speaks of. I want in.'
		]),

		// 12. Sera the Fence — near Thieves' Guild
		makeNPC(17, 19, 'S', '#a8f', 'Sera the Fence', [
			'I buy what others can\'t sell. No questions asked.',
			'Nyx runs a tight ship. Cross the Guild and you disappear.',
			'I once fenced a relic from a Crystalborn ruin. Buyer went mad within a week.',
			'Need something moved quietly? I know people who know people.'
		]),

		// 13. Captain Harsk — Barracks
		makeNPC(42, 20, 'C', '#88f', 'Captain Harsk', [
			'Korthaven\'s guard keeps the peace. What passes for peace, anyway.',
			'My soldiers are stretched thin. Patrols, dock security, arena crowd control.',
			'The Duke wants more guards. The treasury says otherwise.',
			'You look capable. Take this — consider it a field commission.',
			'Something\'s been coming up from the catacombs at night. We need to seal those tunnels.'
		], { atk: 2 }),

		// 14. Dock Foreman Bram — Dock warehouse
		makeNPC(29, 20, 'B', '#886', 'Dock Foreman Bram', [
			'Every crate that enters Korthaven passes through my warehouse.',
			'The harbor fees are robbery, but the Duke insists.',
			'A shipment went missing last week. The seals were intact but the contents... gone.',
			'I don\'t ask what\'s in the sealed crates from the Hollow Sea coast. Neither should you.'
		]),

		// 15. The Masked Figure — hidden corner
		makeNPC(width - 3, height - 3, '?', '#ff0', 'The Masked Figure', [
			'You see me. Few do. That means you\'re either perceptive or doomed.',
			'The seven thrones were not always occupied by the current gods.',
			'Mercatus was a mortal once. A swindler. The worst of them.',
			'The truth is buried in seven places. Korthaven sits atop one.',
			'Find the others before the Veiled Hand erases them forever.'
		]),

		// 16. Elira the Bard — Market area
		makeNPC(22, 12, 'E', '#f8a', 'Elira the Bard', [
			'A song for a coin? I know ballads from every region.',
			'The sailors sing of Dro-Mahk\'s fall and the sea that swallowed a god.',
			'My favorite tale? The one about seven mortals who stole heaven. Just a story, of course.',
			'Music carries truth where words alone cannot. Listen between the notes.'
		])
	];

	return {
		map: { width, height, tiles, secretWalls: new Set() },
		playerPos,
		npcs,
		enemies: [],
		initialHpFactor: 1.0,
		welcomeMessage: 'Korthaven sprawls before you — a city of coin and ambition. Market stalls jostle beneath the Duke\'s palace spires, and the salt breeze carries voices from a hundred trades.'
	};
}

function generateAcademy(width: number, height: number): LocationResult {
	const tiles = makeWallGrid(width, height);

	// Open courtyard
	fillRect(tiles, 1, 1, width - 2, height - 2, '.');

	// Main hall (top center) — the great lecture hall
	drawBuilding(tiles, 14, 1, 22, 7, 'south');

	// Library wing (left)
	drawBuilding(tiles, 2, 3, 10, 8, 'east');

	// Alchemy tower (right)
	drawBuilding(tiles, 38, 3, 10, 8, 'west');

	// Student dormitory (bottom left)
	drawBuilding(tiles, 2, 14, 14, 7, 'north');

	// Practice arena (bottom right)
	drawBuilding(tiles, 34, 14, 14, 7, 'north');

	// Courtyard fountain (decorative walls in center)
	fillRect(tiles, 22, 12, 6, 3, '#');
	fillRect(tiles, 23, 13, 4, 1, '.');

	// Potions in the alchemy tower
	tiles[6][42] = '*';
	tiles[6][44] = '*';

	// Potion in the library
	tiles[7][6] = '*';

	// Dungeon entrance (practice dungeon beneath the arena)
	tiles[17][40] = '>';

	const playerPos = { x: 25, y: 10 };

	const npcs: NPC[] = [
		makeNPC(24, 4, 'A', '#ff0', 'Archmagus Veylen', [
			'Welcome, new student! The autumn term begins today.',
			'At this Academy, we forge both mind and spirit.',
			'Study hard. The practice dungeon awaits when you are ready.'
		], { hp: 3 }),
		makeNPC(6, 6, 'L', '#8cf', 'Librarian Maren', [
			'The library holds centuries of arcane knowledge.',
			'Read carefully — some tomes bite back.',
			'If you find any books in the dungeon, bring them to me.'
		]),
		makeNPC(42, 6, 'P', '#f8f', 'Professor Ignis', [
			'Alchemy is the art of transformation!',
			'Take those potions — you\'ll need them below.',
			'The practice dungeon has real dangers. Don\'t be reckless.'
		], { atk: 1 }),
		makeNPC(8, 17, 'S', '#8f8', 'Fellow Student', [
			'You\'re new too? I heard the practice dungeon is no joke.',
			'The Archmagus says the deeper floors have actual monsters.',
			'Good luck down there. I\'m still studying...'
		])
	];

	return {
		map: { width, height, tiles, secretWalls: new Set() },
		playerPos,
		npcs,
		enemies: [],
		initialHpFactor: 1.0,
		welcomeMessage: 'The Arcane Academy. Term begins today! Explore the campus and descend into the practice dungeon when ready.'
	};
}

export function generateStartingLocation(location: StartingLocation, width: number, height: number): LocationResult {
	switch (location) {
		case 'village': return generateVillage(width, height);
		case 'tavern': return generateTavern(width, height);
		case 'cave': return generateCave(width, height);
		case 'academy': return generateAcademy(width, height);
	}
}

/** Generate a settlement interior based on the settlement type. */
export function generateSettlementByType(type: SettlementType, width: number, height: number, name?: string): LocationResult {
	if (name === 'Korthaven') return generateKorthaven(width, height);
	switch (type) {
		case 'village': return generateVillage(width, height);
		case 'town': return generateMarketTown(width, height);
		case 'city': return generateCity(width, height);
		case 'camp': return generateCamp(width, height);
		case 'fortress': return generateFortress(width, height);
		case 'temple': return generateTemple(width, height);
		case 'harbor': return generateHarbor(width, height);
		default: return generateVillage(width, height);
	}
}
