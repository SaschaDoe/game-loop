import { describe, it, expect } from 'vitest';
import { rollLootDrop, lootChar, lootColor, lootName, pickupLoot, getLootAt } from './loot';
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
