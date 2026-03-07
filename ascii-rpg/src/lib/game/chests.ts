import type { Entity, Chest, ChestType, GameMap, MessageType } from './types';

interface ChestDef {
	type: ChestType;
	char: string;
	color: string;
	weight: number;
	minLevel: number;
	trapChance: number;
	mimicChance: number;
}

export const CHEST_DEFS: ChestDef[] = [
	{ type: 'wooden', char: 'c', color: '#aa8844', weight: 5, minLevel: 1, trapChance: 0.15, mimicChance: 0.05 },
	{ type: 'iron', char: 'C', color: '#aaaacc', weight: 3, minLevel: 3, trapChance: 0.25, mimicChance: 0.10 },
	{ type: 'gold', char: 'C', color: '#ffcc00', weight: 1, minLevel: 5, trapChance: 0.35, mimicChance: 0.15 }
];

const CHEST_BY_TYPE = new Map(CHEST_DEFS.map((d) => [d.type, d]));

export function chestChar(type: ChestType): string {
	return CHEST_BY_TYPE.get(type)?.char ?? '?';
}

export function chestColor(type: ChestType): string {
	return CHEST_BY_TYPE.get(type)?.color ?? '#ffffff';
}

export function placeChests(map: GameMap, level: number): Chest[] {
	const available = CHEST_DEFS.filter((d) => level >= d.minLevel);
	if (available.length === 0) return [];

	const count = 1 + Math.floor(level * 0.4);
	const totalWeight = available.reduce((sum, d) => sum + d.weight, 0);
	const chests: Chest[] = [];
	let attempts = 0;

	while (chests.length < count && attempts < 200) {
		attempts++;
		const x = Math.floor(Math.random() * map.width);
		const y = Math.floor(Math.random() * map.height);
		if (map.tiles[y][x] !== '.') continue;
		if (chests.some((c) => c.pos.x === x && c.pos.y === y)) continue;

		let roll = Math.floor(Math.random() * totalWeight);
		let def: ChestDef = available[0];
		for (const d of available) {
			roll -= d.weight;
			if (roll < 0) { def = d; break; }
		}

		const trapped = Math.random() < def.trapChance;
		const mimic = !trapped && Math.random() < def.mimicChance;

		chests.push({ pos: { x, y }, type: def.type, opened: false, trapped, mimic });
	}

	return chests;
}

export function getChestAt(chests: Chest[], x: number, y: number): Chest | undefined {
	return chests.find((c) => c.pos.x === x && c.pos.y === y && !c.opened);
}

export interface ChestLoot {
	healing: number;
	atkBonus: number;
	xpBonus: number;
}

function generateLoot(type: ChestType, level: number): ChestLoot {
	switch (type) {
		case 'wooden':
			return { healing: 3 + level, atkBonus: 0, xpBonus: 5 + level * 2 };
		case 'iron':
			return { healing: 5 + level * 2, atkBonus: Math.random() < 0.3 ? 1 : 0, xpBonus: 10 + level * 3 };
		case 'gold':
			return { healing: 8 + level * 3, atkBonus: 1, xpBonus: 20 + level * 5 };
	}
}

export interface OpenChestResult {
	messages: { text: string; type: MessageType }[];
	loot: ChestLoot | null;
	trapDamage: number;
	mimicEnemy: Entity | null;
}

export function openChest(chest: Chest, level: number, isRogue: boolean): OpenChestResult {
	const messages: { text: string; type: MessageType }[] = [];

	if (chest.mimic) {
		chest.opened = true;
		const hp = 5 + level * 3;
		const mimicEnemy: Entity = {
			pos: { ...chest.pos },
			char: 'M',
			color: '#ff4488',
			name: 'Mimic',
			hp,
			maxHp: hp,
			attack: 2 + level,
			statusEffects: []
		};
		messages.push({ text: 'The chest springs to life — it\'s a Mimic!', type: 'damage_taken' });
		return { messages, loot: null, trapDamage: 0, mimicEnemy };
	}

	if (chest.trapped) {
		if (isRogue) {
			messages.push({ text: 'Your keen senses detect and disarm a trap on the chest!', type: 'discovery' });
		} else {
			const dmg = 2 + Math.floor(level * 1.5);
			messages.push({ text: `A trap springs from the chest! You take ${dmg} damage!`, type: 'trap' });
			chest.opened = true;
			const loot = generateLoot(chest.type, level);
			const label = chest.type.charAt(0).toUpperCase() + chest.type.slice(1);
			messages.push({ text: `${label} chest opened: +${loot.healing} HP, +${loot.xpBonus} XP${loot.atkBonus ? `, +${loot.atkBonus} ATK` : ''}.`, type: 'discovery' });
			return { messages, loot, trapDamage: dmg, mimicEnemy: null };
		}
	}

	chest.opened = true;
	const loot = generateLoot(chest.type, level);
	const label = chest.type.charAt(0).toUpperCase() + chest.type.slice(1);
	messages.push({ text: `${label} chest opened: +${loot.healing} HP, +${loot.xpBonus} XP${loot.atkBonus ? `, +${loot.atkBonus} ATK` : ''}.`, type: 'discovery' });
	return { messages, loot, trapDamage: 0, mimicEnemy: null };
}
