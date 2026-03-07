import { describe, it, expect } from 'vitest';
import { placeChests, getChestAt, openChest, chestChar, chestColor, CHEST_DEFS } from './chests';
import type { Chest, GameMap } from './types';

function makeMap(width = 20, height = 20): GameMap {
	return {
		width,
		height,
		tiles: Array.from({ length: height }, () =>
			Array.from({ length: width }, () => '.' as const)
		),
		secretWalls: new Set<string>()
	};
}

describe('CHEST_DEFS', () => {
	it('defines 3 chest types', () => {
		expect(CHEST_DEFS).toHaveLength(3);
		const types = CHEST_DEFS.map((d) => d.type);
		expect(types).toContain('wooden');
		expect(types).toContain('iron');
		expect(types).toContain('gold');
	});

	it('wooden has highest weight (most common)', () => {
		const wooden = CHEST_DEFS.find((d) => d.type === 'wooden')!;
		const gold = CHEST_DEFS.find((d) => d.type === 'gold')!;
		expect(wooden.weight).toBeGreaterThan(gold.weight);
	});

	it('gold has highest trap and mimic chance', () => {
		const wooden = CHEST_DEFS.find((d) => d.type === 'wooden')!;
		const gold = CHEST_DEFS.find((d) => d.type === 'gold')!;
		expect(gold.trapChance).toBeGreaterThan(wooden.trapChance);
		expect(gold.mimicChance).toBeGreaterThan(wooden.mimicChance);
	});
});

describe('placeChests', () => {
	it('places no chests at level 0', () => {
		const chests = placeChests(makeMap(), 0);
		expect(chests).toHaveLength(0);
	});

	it('places chests at level 1+', () => {
		const chests = placeChests(makeMap(), 1);
		expect(chests.length).toBeGreaterThan(0);
	});

	it('places more chests at higher levels', () => {
		// Run many times and average to account for randomness
		let lowCount = 0;
		let highCount = 0;
		for (let i = 0; i < 20; i++) {
			lowCount += placeChests(makeMap(), 1).length;
			highCount += placeChests(makeMap(), 10).length;
		}
		expect(highCount).toBeGreaterThan(lowCount);
	});

	it('only places on floor tiles', () => {
		const map = makeMap();
		// Fill most of the map with walls
		for (let y = 0; y < 20; y++) {
			for (let x = 0; x < 20; x++) {
				if (x !== 10 || y !== 10) map.tiles[y][x] = '#';
			}
		}
		const chests = placeChests(map, 5);
		for (const c of chests) {
			expect(map.tiles[c.pos.y][c.pos.x]).toBe('.');
		}
	});

	it('no duplicate positions', () => {
		const chests = placeChests(makeMap(), 10);
		const keys = chests.map((c) => `${c.pos.x},${c.pos.y}`);
		expect(new Set(keys).size).toBe(keys.length);
	});
});

describe('getChestAt', () => {
	it('returns chest at position', () => {
		const chest: Chest = { pos: { x: 5, y: 5 }, type: 'wooden', opened: false, trapped: false, mimic: false };
		expect(getChestAt([chest], 5, 5)).toBe(chest);
	});

	it('returns undefined for wrong position', () => {
		const chest: Chest = { pos: { x: 5, y: 5 }, type: 'wooden', opened: false, trapped: false, mimic: false };
		expect(getChestAt([chest], 6, 5)).toBeUndefined();
	});

	it('skips opened chests', () => {
		const chest: Chest = { pos: { x: 5, y: 5 }, type: 'wooden', opened: true, trapped: false, mimic: false };
		expect(getChestAt([chest], 5, 5)).toBeUndefined();
	});
});

describe('openChest', () => {
	it('normal wooden chest gives loot', () => {
		const chest: Chest = { pos: { x: 0, y: 0 }, type: 'wooden', opened: false, trapped: false, mimic: false };
		const result = openChest(chest, 1, false);
		expect(chest.opened).toBe(true);
		expect(result.loot).not.toBeNull();
		expect(result.loot!.healing).toBeGreaterThan(0);
		expect(result.loot!.xpBonus).toBeGreaterThan(0);
		expect(result.trapDamage).toBe(0);
		expect(result.mimicEnemy).toBeNull();
		expect(result.messages.some((m) => m.text.includes('Wooden chest opened'))).toBe(true);
	});

	it('gold chest gives better loot than wooden', () => {
		const wooden: Chest = { pos: { x: 0, y: 0 }, type: 'wooden', opened: false, trapped: false, mimic: false };
		const gold: Chest = { pos: { x: 0, y: 0 }, type: 'gold', opened: false, trapped: false, mimic: false };
		const wResult = openChest(wooden, 5, false);
		const gResult = openChest(gold, 5, false);
		expect(gResult.loot!.healing).toBeGreaterThan(wResult.loot!.healing);
		expect(gResult.loot!.xpBonus).toBeGreaterThan(wResult.loot!.xpBonus);
	});

	it('trapped chest deals damage to non-rogue', () => {
		const chest: Chest = { pos: { x: 0, y: 0 }, type: 'iron', opened: false, trapped: true, mimic: false };
		const result = openChest(chest, 3, false);
		expect(result.trapDamage).toBeGreaterThan(0);
		expect(result.loot).not.toBeNull(); // Still gets loot
		expect(result.messages.some((m) => m.text.includes('trap springs'))).toBe(true);
	});

	it('rogue disarms trapped chest without damage', () => {
		const chest: Chest = { pos: { x: 0, y: 0 }, type: 'iron', opened: false, trapped: true, mimic: false };
		const result = openChest(chest, 3, true);
		expect(result.trapDamage).toBe(0);
		expect(result.loot).not.toBeNull();
		expect(result.messages.some((m) => m.text.includes('disarm'))).toBe(true);
	});

	it('mimic spawns enemy instead of loot', () => {
		const chest: Chest = { pos: { x: 5, y: 5 }, type: 'gold', opened: false, trapped: false, mimic: true };
		const result = openChest(chest, 3, false);
		expect(result.mimicEnemy).not.toBeNull();
		expect(result.mimicEnemy!.name).toBe('Mimic');
		expect(result.mimicEnemy!.pos.x).toBe(5);
		expect(result.mimicEnemy!.pos.y).toBe(5);
		expect(result.loot).toBeNull();
		expect(chest.opened).toBe(true);
		expect(result.messages.some((m) => m.text.includes('Mimic'))).toBe(true);
	});

	it('mimic scales with dungeon level', () => {
		const low: Chest = { pos: { x: 0, y: 0 }, type: 'gold', opened: false, trapped: false, mimic: true };
		const high: Chest = { pos: { x: 0, y: 0 }, type: 'gold', opened: false, trapped: false, mimic: true };
		const lowResult = openChest(low, 1, false);
		const highResult = openChest(high, 10, false);
		expect(highResult.mimicEnemy!.hp).toBeGreaterThan(lowResult.mimicEnemy!.hp);
	});
});

describe('chestChar and chestColor', () => {
	it('returns correct char for each type', () => {
		expect(chestChar('wooden')).toBe('c');
		expect(chestChar('iron')).toBe('C');
		expect(chestChar('gold')).toBe('C');
	});

	it('returns distinct colors', () => {
		const colors = new Set([chestColor('wooden'), chestColor('iron'), chestColor('gold')]);
		expect(colors.size).toBe(3);
	});
});
