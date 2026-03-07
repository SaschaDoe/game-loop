import { describe, it, expect } from 'vitest';
import { rollLootDrop, lootChar, lootColor, lootName, pickupLoot, getLootAt, getMonsterLootTable, MONSTER_LOOT_TABLES, DEFAULT_LOOT_TABLE } from './loot';
import type { LootDrop } from './types';

describe('rollLootDrop', () => {
	it('boss always drops loot', () => {
		for (let i = 0; i < 20; i++) {
			const drop = rollLootDrop({ x: 5, y: 5 }, 3, 1, true);
			expect(drop).not.toBeNull();
		}
	});

	it('boss always drops atk_bonus', () => {
		for (let i = 0; i < 20; i++) {
			const drop = rollLootDrop({ x: 5, y: 5 }, 3, 1, true);
			expect(drop!.type).toBe('atk_bonus');
		}
	});

	it('non-boss can return null (no drop)', () => {
		const orig = Math.random;
		Math.random = () => 0.99; // Fail drop chance
		try {
			const drop = rollLootDrop({ x: 5, y: 5 }, 1, 1, false);
			expect(drop).toBeNull();
		} finally {
			Math.random = orig;
		}
	});

	it('tier 1 has 20% drop chance', () => {
		const orig = Math.random;
		Math.random = () => 0.19; // Just below 0.20
		try {
			const drop = rollLootDrop({ x: 5, y: 5 }, 1, 1, false);
			expect(drop).not.toBeNull();
		} finally {
			Math.random = orig;
		}
	});

	it('higher tier has higher drop chance', () => {
		let tier1Drops = 0;
		let tier3Drops = 0;
		for (let i = 0; i < 500; i++) {
			if (rollLootDrop({ x: 0, y: 0 }, 1, 1, false)) tier1Drops++;
			if (rollLootDrop({ x: 0, y: 0 }, 1, 3, false)) tier3Drops++;
		}
		expect(tier3Drops).toBeGreaterThan(tier1Drops);
	});

	it('loot value scales with level', () => {
		const orig = Math.random;
		Math.random = () => 0.01; // Succeed, pick healing (first entry)
		try {
			const low = rollLootDrop({ x: 0, y: 0 }, 1, 1, false);
			const high = rollLootDrop({ x: 0, y: 0 }, 10, 1, false);
			expect(high!.value).toBeGreaterThan(low!.value);
		} finally {
			Math.random = orig;
		}
	});

	it('copies position to avoid mutation', () => {
		const pos = { x: 3, y: 4 };
		const orig = Math.random;
		Math.random = () => 0.01;
		try {
			const drop = rollLootDrop(pos, 1, 1, false);
			pos.x = 99;
			expect(drop!.pos.x).toBe(3);
		} finally {
			Math.random = orig;
		}
	});

	it('returns valid loot type', () => {
		const orig = Math.random;
		Math.random = () => 0.01;
		try {
			const drop = rollLootDrop({ x: 0, y: 0 }, 1, 1, false);
			expect(['healing', 'xp_bonus', 'atk_bonus']).toContain(drop!.type);
		} finally {
			Math.random = orig;
		}
	});
});

describe('monster loot tables', () => {
	it('getMonsterLootTable returns specific table for known monsters', () => {
		const ratTable = getMonsterLootTable('Rat');
		expect(ratTable).not.toBe(DEFAULT_LOOT_TABLE);
		expect(ratTable.length).toBeGreaterThan(0);
	});

	it('getMonsterLootTable returns default for unknown monsters', () => {
		const table = getMonsterLootTable('UnknownBeast');
		expect(table).toBe(DEFAULT_LOOT_TABLE);
	});

	it('all monster loot tables have valid entries', () => {
		for (const [name, table] of Object.entries(MONSTER_LOOT_TABLES)) {
			expect(table.length).toBeGreaterThan(0);
			for (const entry of table) {
				expect(['healing', 'xp_bonus', 'atk_bonus']).toContain(entry.type);
				expect(entry.weight).toBeGreaterThan(0);
				expect(entry.minValue).toBeGreaterThanOrEqual(0);
			}
		}
	});

	it('all base monsters have loot tables', () => {
		const expected = ['Rat', 'Bat', 'Slime', 'Goblin', 'Spider', 'Skeleton', 'Wolf', 'Ogre', 'Wraith', 'Troll', 'Minotaur'];
		for (const name of expected) {
			expect(MONSTER_LOOT_TABLES[name]).toBeDefined();
		}
	});

	it('rollLootDrop uses monster-specific table when name provided', () => {
		// Rat table has no atk_bonus, so drops should never be atk_bonus
		const orig = Math.random;
		let drops = 0;
		let atkDrops = 0;
		Math.random = () => 0.01; // always drops, picks first entry (healing for Rat)
		try {
			for (let i = 0; i < 20; i++) {
				const drop = rollLootDrop({ x: 0, y: 0 }, 1, 1, false, 'Rat');
				if (drop) {
					drops++;
					if (drop.type === 'atk_bonus') atkDrops++;
				}
			}
		} finally {
			Math.random = orig;
		}
		expect(drops).toBe(20);
		expect(atkDrops).toBe(0); // Rat table doesn't have atk_bonus
	});

	it('boss drop uses monster table but guarantees atk_bonus', () => {
		// Skeleton table has atk_bonus, so boss skeleton should get it
		const orig = Math.random;
		Math.random = () => 0.01;
		try {
			const drop = rollLootDrop({ x: 0, y: 0 }, 5, 2, true, 'Skeleton');
			expect(drop).not.toBeNull();
			expect(drop!.type).toBe('atk_bonus');
		} finally {
			Math.random = orig;
		}
	});

	it('boss drop falls back to default atk_bonus if monster table lacks it', () => {
		// Rat table has no atk_bonus — boss should fall back to default
		const orig = Math.random;
		Math.random = () => 0.01;
		try {
			const drop = rollLootDrop({ x: 0, y: 0 }, 5, 1, true, 'Rat');
			expect(drop).not.toBeNull();
			expect(drop!.type).toBe('atk_bonus');
		} finally {
			Math.random = orig;
		}
	});

	it('higher-tier monsters have better loot values', () => {
		const orig = Math.random;
		Math.random = () => 0.01;
		try {
			const ratDrop = rollLootDrop({ x: 0, y: 0 }, 5, 1, false, 'Rat');
			const wraith = rollLootDrop({ x: 0, y: 0 }, 5, 3, false, 'Wraith');
			// Wraith's first entry (xp_bonus: minValue 10 + 5*5 = 35) > Rat's first (healing: 1 + 1*5 = 6)
			expect(wraith!.value).toBeGreaterThan(ratDrop!.value);
		} finally {
			Math.random = orig;
		}
	});
});

describe('lootChar', () => {
	it('returns distinct chars for each type', () => {
		const chars = new Set([lootChar('healing'), lootChar('xp_bonus'), lootChar('atk_bonus')]);
		expect(chars.size).toBe(3);
	});
});

describe('lootColor', () => {
	it('returns distinct colors for each type', () => {
		const colors = new Set([lootColor('healing'), lootColor('xp_bonus'), lootColor('atk_bonus')]);
		expect(colors.size).toBe(3);
	});
});

describe('lootName', () => {
	it('returns human-readable names', () => {
		expect(lootName('healing')).toContain('Potion');
		expect(lootName('xp_bonus')).toContain('XP');
		expect(lootName('atk_bonus')).toContain('Weapon');
	});
});

describe('pickupLoot', () => {
	it('healing drop gives HP message', () => {
		const drop: LootDrop = { pos: { x: 0, y: 0 }, type: 'healing', value: 5 };
		const result = pickupLoot(drop);
		expect(result.message.text).toContain('+5 HP');
		expect(result.message.type).toBe('healing');
	});

	it('xp_bonus drop gives XP message', () => {
		const drop: LootDrop = { pos: { x: 0, y: 0 }, type: 'xp_bonus', value: 10 };
		const result = pickupLoot(drop);
		expect(result.message.text).toContain('+10 XP');
		expect(result.message.type).toBe('discovery');
	});

	it('atk_bonus drop gives ATK message', () => {
		const drop: LootDrop = { pos: { x: 0, y: 0 }, type: 'atk_bonus', value: 1 };
		const result = pickupLoot(drop);
		expect(result.message.text).toContain('+1 ATK');
		expect(result.message.type).toBe('level_up');
	});
});

describe('getLootAt', () => {
	it('finds loot at position', () => {
		const drop: LootDrop = { pos: { x: 3, y: 4 }, type: 'healing', value: 5 };
		expect(getLootAt([drop], 3, 4)).toBe(drop);
	});

	it('returns undefined for empty position', () => {
		expect(getLootAt([], 3, 4)).toBeUndefined();
	});

	it('returns undefined for wrong position', () => {
		const drop: LootDrop = { pos: { x: 3, y: 4 }, type: 'healing', value: 5 };
		expect(getLootAt([drop], 5, 5)).toBeUndefined();
	});
});
