import type { GameMap, Landmark, LandmarkType, Position } from './types';

export interface LandmarkDef {
	type: LandmarkType;
	char: string;
	color: string;
	name: string;
	flavorTexts: string[];
	minLevel: number;
	weight: number;
}

export const LANDMARK_DEFS: LandmarkDef[] = [
	{
		type: 'graffiti',
		char: '"',
		color: '#888',
		name: 'Wall Graffiti',
		flavorTexts: [
			'"Turn back!" — scratched into the wall by a trembling hand.',
			'"The king lies" — carved in rough letters.',
			'"Brenor was here, level 12. Good luck." — faded charcoal scrawl.',
			'"If you can read this, you\'re already lost."',
			'"Three lefts make a right." — dubious navigational advice.',
			'"Beware the mimic. Not the chest — the door."',
		],
		minLevel: 1,
		weight: 5,
	},
	{
		type: 'campsite',
		char: '%',
		color: '#b84',
		name: 'Abandoned Campsite',
		flavorTexts: [
			'A cold fire pit with scattered bedrolls. Someone left in a hurry.',
			'Charred bones and empty ration tins. The adventurers who camped here are long gone.',
			'A tidy campsite, recently abandoned. A half-eaten meal sits on a flat stone.',
			'Torn canvas and broken tent poles. Whatever happened here was violent.',
		],
		minLevel: 1,
		weight: 3,
	},
	{
		type: 'statue',
		char: '&',
		color: '#aaa',
		name: 'Crumbling Statue',
		flavorTexts: [
			'A weathered statue of a forgotten hero. The inscription reads: "To those who dared."',
			'A stone figure with outstretched arms. Its face has been chipped away by time.',
			'An imposing warrior carved in granite. One arm has broken off and lies at its feet.',
			'A robed figure clutching a staff. Despite the decay, its expression is serene.',
		],
		minLevel: 2,
		weight: 2,
	},
	{
		type: 'bones',
		char: ',',
		color: '#ddc',
		name: 'Adventurer\'s Remains',
		flavorTexts: [
			'Picked-clean bones of a former adventurer. A rusted sword lies nearby.',
			'A skeleton slumped against the wall, a journal clutched in bony fingers. The pages are too damaged to read.',
			'Scattered bones and a shattered shield. This one put up a fight.',
			'A pile of bones near a monster nest. A warning to those who follow.',
		],
		minLevel: 1,
		weight: 4,
	},
	{
		type: 'bloodstain',
		char: '~',
		color: '#a33',
		name: 'Bloodstain',
		flavorTexts: [
			'A dark stain on the stone floor. It leads toward a dead end...',
			'Dried blood spatters the walls. Whatever happened here was recent.',
			'A trail of blood drops leading from a struggle. The trail ends abruptly.',
			'Dark smears across the floor. Drag marks lead deeper into the dungeon.',
		],
		minLevel: 1,
		weight: 3,
	},
	{
		type: 'shrine',
		char: '+',
		color: '#ff8',
		name: 'Ancient Shrine',
		flavorTexts: [
			'A small stone altar with burnt offerings. A faint warmth radiates from it.',
			'A shrine to an unknown deity. Faded runes glow dimly in the darkness.',
			'Candle stubs surround a carved idol. Someone has been worshipping here recently.',
			'A cracked altar bearing strange symbols. You feel watched.',
		],
		minLevel: 3,
		weight: 1,
	},
];

const LANDMARK_BY_TYPE = new Map(LANDMARK_DEFS.map((d) => [d.type, d]));

export function getLandmarkDef(type: LandmarkType): LandmarkDef | undefined {
	return LANDMARK_BY_TYPE.get(type);
}

export function landmarkChar(type: LandmarkType): string {
	return getLandmarkDef(type)?.char ?? '?';
}

export function landmarkColor(type: LandmarkType): string {
	return getLandmarkDef(type)?.color ?? '#888';
}

export function examineLandmark(landmark: Landmark): string {
	const def = getLandmarkDef(landmark.type);
	if (!def) return 'You see nothing of interest.';

	if (landmark.examined) {
		return `You've already examined this ${def.name.toLowerCase()}.`;
	}

	const text = def.flavorTexts[Math.floor(Math.random() * def.flavorTexts.length)];
	return text;
}

export function getLandmarkAt(landmarks: Landmark[], x: number, y: number): Landmark | undefined {
	return landmarks.find((l) => l.pos.x === x && l.pos.y === y);
}

export function getAdjacentLandmarks(landmarks: Landmark[], pos: Position): Landmark[] {
	const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
	const result: Landmark[] = [];
	for (const [dx, dy] of dirs) {
		const lm = getLandmarkAt(landmarks, pos.x + dx, pos.y + dy);
		if (lm && !lm.examined) {
			result.push(lm);
		}
	}
	return result;
}

export function placeLandmarks(map: GameMap, level: number, occupied: Set<string>): Landmark[] {
	const eligible = LANDMARK_DEFS.filter((d) => level >= d.minLevel);
	if (eligible.length === 0) return [];

	// 1-3 landmarks per level, scaling slightly with level
	const count = Math.min(1 + Math.floor(Math.random() * Math.min(3, 1 + Math.floor(level / 2))), 3);

	const totalWeight = eligible.reduce((s, d) => s + d.weight, 0);
	const landmarks: Landmark[] = [];

	for (let i = 0; i < count; i++) {
		// Weighted random pick
		let roll = Math.random() * totalWeight;
		let pick = eligible[0];
		for (const def of eligible) {
			roll -= def.weight;
			if (roll <= 0) { pick = def; break; }
		}

		// Find a floor tile not occupied
		const floors: Position[] = [];
		for (let y = 1; y < map.height - 1; y++) {
			for (let x = 1; x < map.width - 1; x++) {
				const key = `${x},${y}`;
				if (map.tiles[y][x] === '.' && !occupied.has(key)) {
					floors.push({ x, y });
				}
			}
		}
		if (floors.length === 0) break;

		const pos = floors[Math.floor(Math.random() * floors.length)];
		occupied.add(`${pos.x},${pos.y}`);
		landmarks.push({ pos, type: pick.type, examined: false });
	}

	return landmarks;
}
