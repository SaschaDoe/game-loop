import type { Entity, LootDrop, LootType, Position, MessageType } from './types';

interface LootEntry {
	type: LootType;
	weight: number;
	minValue: number;
	valuePerLevel: number;
}

const LOOT_TABLE: LootEntry[] = [
	{ type: 'healing', weight: 5, minValue: 3, valuePerLevel: 2 },
	{ type: 'xp_bonus', weight: 4, minValue: 5, valuePerLevel: 3 },
	{ type: 'atk_bonus', weight: 1, minValue: 1, valuePerLevel: 0 }
];

const totalWeight = LOOT_TABLE.reduce((sum, e) => sum + e.weight, 0);

// Drop chance by monster tier (1-3), bosses always drop
const DROP_CHANCE: Record<number, number> = { 1: 0.20, 2: 0.40, 3: 0.60 };

export function rollLootDrop(pos: Position, level: number, tier: number, isBoss: boolean): LootDrop | null {
	const chance = isBoss ? 1.0 : (DROP_CHANCE[tier] ?? 0.20);
	if (Math.random() >= chance) return null;

	let roll = Math.floor(Math.random() * totalWeight);
	let entry: LootEntry = LOOT_TABLE[0];
	for (const e of LOOT_TABLE) {
		roll -= e.weight;
		if (roll < 0) { entry = e; break; }
	}

	// Bosses guarantee atk_bonus
	if (isBoss) {
		entry = LOOT_TABLE.find((e) => e.type === 'atk_bonus') ?? entry;
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
