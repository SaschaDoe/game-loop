import type { Entity, LootDrop, LootType, Position, MessageType } from './types';

export interface LootEntry {
	type: LootType;
	weight: number;
	minValue: number;
	valuePerLevel: number;
}

export const DEFAULT_LOOT_TABLE: LootEntry[] = [
	{ type: 'healing', weight: 5, minValue: 3, valuePerLevel: 2 },
	{ type: 'xp_bonus', weight: 4, minValue: 5, valuePerLevel: 3 },
	{ type: 'atk_bonus', weight: 1, minValue: 1, valuePerLevel: 0 }
];

// Per-monster loot tables: monsters not listed use DEFAULT_LOOT_TABLE
export const MONSTER_LOOT_TABLES: Record<string, LootEntry[]> = {
	Rat:      [{ type: 'healing', weight: 8, minValue: 1, valuePerLevel: 1 }, { type: 'xp_bonus', weight: 2, minValue: 2, valuePerLevel: 1 }],
	Bat:      [{ type: 'healing', weight: 7, minValue: 1, valuePerLevel: 1 }, { type: 'xp_bonus', weight: 3, minValue: 3, valuePerLevel: 1 }],
	Slime:    [{ type: 'healing', weight: 4, minValue: 3, valuePerLevel: 2 }, { type: 'xp_bonus', weight: 5, minValue: 5, valuePerLevel: 2 }, { type: 'atk_bonus', weight: 1, minValue: 1, valuePerLevel: 0 }],
	Spider:   [{ type: 'healing', weight: 6, minValue: 2, valuePerLevel: 1 }, { type: 'xp_bonus', weight: 3, minValue: 4, valuePerLevel: 2 }, { type: 'atk_bonus', weight: 1, minValue: 1, valuePerLevel: 0 }],
	Goblin:   [{ type: 'xp_bonus', weight: 5, minValue: 5, valuePerLevel: 3 }, { type: 'healing', weight: 3, minValue: 2, valuePerLevel: 1 }, { type: 'atk_bonus', weight: 2, minValue: 1, valuePerLevel: 0 }],
	Skeleton: [{ type: 'atk_bonus', weight: 3, minValue: 1, valuePerLevel: 1 }, { type: 'xp_bonus', weight: 4, minValue: 6, valuePerLevel: 3 }, { type: 'healing', weight: 3, minValue: 3, valuePerLevel: 2 }],
	Wolf:     [{ type: 'healing', weight: 5, minValue: 4, valuePerLevel: 2 }, { type: 'xp_bonus', weight: 4, minValue: 5, valuePerLevel: 3 }, { type: 'atk_bonus', weight: 1, minValue: 1, valuePerLevel: 1 }],
	Ogre:     [{ type: 'atk_bonus', weight: 3, minValue: 1, valuePerLevel: 1 }, { type: 'healing', weight: 4, minValue: 5, valuePerLevel: 3 }, { type: 'xp_bonus', weight: 3, minValue: 8, valuePerLevel: 4 }],
	Wraith:   [{ type: 'xp_bonus', weight: 5, minValue: 10, valuePerLevel: 5 }, { type: 'atk_bonus', weight: 3, minValue: 2, valuePerLevel: 1 }, { type: 'healing', weight: 2, minValue: 5, valuePerLevel: 3 }],
	Troll:    [{ type: 'healing', weight: 4, minValue: 8, valuePerLevel: 4 }, { type: 'atk_bonus', weight: 3, minValue: 2, valuePerLevel: 1 }, { type: 'xp_bonus', weight: 3, minValue: 8, valuePerLevel: 4 }],
	Minotaur: [{ type: 'atk_bonus', weight: 4, minValue: 2, valuePerLevel: 1 }, { type: 'xp_bonus', weight: 4, minValue: 10, valuePerLevel: 5 }, { type: 'healing', weight: 2, minValue: 5, valuePerLevel: 3 }],
};

// Drop chance by monster tier (1-3), bosses always drop
const DROP_CHANCE: Record<number, number> = { 1: 0.20, 2: 0.40, 3: 0.60 };

export function getMonsterLootTable(monsterName: string): LootEntry[] {
	return MONSTER_LOOT_TABLES[monsterName] ?? DEFAULT_LOOT_TABLE;
}

function rollFromTable(table: LootEntry[]): LootEntry {
	const total = table.reduce((sum, e) => sum + e.weight, 0);
	let roll = Math.floor(Math.random() * total);
	for (const e of table) {
		roll -= e.weight;
		if (roll < 0) return e;
	}
	return table[0];
}

export function rollLootDrop(pos: Position, level: number, tier: number, isBoss: boolean, monsterName?: string): LootDrop | null {
	const chance = isBoss ? 1.0 : (DROP_CHANCE[tier] ?? 0.20);
	if (Math.random() >= chance) return null;

	const table = monsterName ? getMonsterLootTable(monsterName) : DEFAULT_LOOT_TABLE;
	let entry = rollFromTable(table);

	// Bosses guarantee atk_bonus
	if (isBoss) {
		entry = table.find((e) => e.type === 'atk_bonus') ?? DEFAULT_LOOT_TABLE.find((e) => e.type === 'atk_bonus') ?? entry;
	}

	const value = entry.minValue + Math.floor(entry.valuePerLevel * level);
	return { pos: { ...pos }, type: entry.type, value };
}

export function lootChar(type: LootType): string {
	switch (type) {
		case 'healing': return '!';
		case 'xp_bonus': return '$';
		case 'atk_bonus': return '+';
	}
}

export function lootColor(type: LootType): string {
	switch (type) {
		case 'healing': return '#ff88aa';
		case 'xp_bonus': return '#ffdd44';
		case 'atk_bonus': return '#44ffff';
	}
}

export function lootName(type: LootType): string {
	switch (type) {
		case 'healing': return 'Health Potion';
		case 'xp_bonus': return 'XP Shard';
		case 'atk_bonus': return 'Weapon Fragment';
	}
}

export interface PickupResult {
	message: { text: string; type: MessageType };
}

export function pickupLoot(drop: LootDrop): PickupResult {
	const name = lootName(drop.type);
	switch (drop.type) {
		case 'healing':
			return { message: { text: `Picked up ${name}! +${drop.value} HP`, type: 'healing' } };
		case 'xp_bonus':
			return { message: { text: `Picked up ${name}! +${drop.value} XP`, type: 'discovery' } };
		case 'atk_bonus':
			return { message: { text: `Picked up ${name}! +${drop.value} ATK`, type: 'level_up' } };
	}
}

export function getLootAt(drops: LootDrop[], x: number, y: number): LootDrop | undefined {
	return drops.find((d) => d.pos.x === x && d.pos.y === y);
}
