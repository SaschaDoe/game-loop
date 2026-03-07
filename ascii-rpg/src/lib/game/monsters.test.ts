import { describe, it, expect } from 'vitest';
import {
	MONSTER_DEFS,
	monstersForLevel,
	createMonster,
	pickMonsterDef,
	decideMoveDirection,
	getMonsterBehavior,
	getMonsterOnHitEffect,
	type MonsterDef
} from './monsters';
import type { Entity } from './types';

function makeEntity(name: string, x: number, y: number, overrides?: Partial<Entity>): Entity {
	return {
		pos: { x, y },
		char: name[0],
		color: '#fff',
		name,
		hp: 10,
		maxHp: 10,
		attack: 2,
		statusEffects: [],
		...overrides
	};
}

describe('MONSTER_DEFS', () => {
	it('has unique names for all monsters', () => {
		const names = MONSTER_DEFS.map((m) => m.name);
		expect(new Set(names).size).toBe(names.length);
	});

	it('has unique chars for all monsters', () => {
		const chars = MONSTER_DEFS.map((m) => m.char);
		expect(new Set(chars).size).toBe(chars.length);
	});

	it('has monsters in all three tiers', () => {
		expect(MONSTER_DEFS.filter((m) => m.tier === 1).length).toBeGreaterThanOrEqual(3);
		expect(MONSTER_DEFS.filter((m) => m.tier === 2).length).toBeGreaterThanOrEqual(3);
		expect(MONSTER_DEFS.filter((m) => m.tier === 3).length).toBeGreaterThanOrEqual(2);
	});

	it('tier 2 monsters have higher base stats than tier 1', () => {
		const avgHp1 = average(MONSTER_DEFS.filter((m) => m.tier === 1).map((m) => m.baseHp));
		const avgHp2 = average(MONSTER_DEFS.filter((m) => m.tier === 2).map((m) => m.baseHp));
		expect(avgHp2).toBeGreaterThan(avgHp1);
	});

	it('tier 3 monsters have higher base stats than tier 2', () => {
		const avgHp2 = average(MONSTER_DEFS.filter((m) => m.tier === 2).map((m) => m.baseHp));
		const avgHp3 = average(MONSTER_DEFS.filter((m) => m.tier === 3).map((m) => m.baseHp));
		expect(avgHp3).toBeGreaterThan(avgHp2);
	});
});

function average(nums: number[]): number {
	return nums.reduce((a, b) => a + b, 0) / nums.length;
}

describe('monstersForLevel', () => {
	it('returns only tier 1 for levels 1-3', () => {
		for (const level of [1, 2, 3]) {
			const pool = monstersForLevel(level);
			expect(pool.every((m) => m.tier === 1)).toBe(true);
			expect(pool.length).toBeGreaterThan(0);
		}
	});

	it('returns tier 1 and 2 for levels 4-7', () => {
		for (const level of [4, 5, 6, 7]) {
			const pool = monstersForLevel(level);
			expect(pool.every((m) => m.tier <= 2)).toBe(true);
			expect(pool.some((m) => m.tier === 2)).toBe(true);
		}
	});

	it('returns all tiers for levels 8+', () => {
		const pool = monstersForLevel(8);
		expect(pool.some((m) => m.tier === 1)).toBe(true);
		expect(pool.some((m) => m.tier === 3)).toBe(true);
	});
});

describe('createMonster', () => {
	it('creates entity with stats from the definition', () => {
		const def: MonsterDef = {
			name: 'TestMon', char: 'T', color: '#f00', tier: 1,
			baseHp: 5, hpPerLevel: 2, baseAttack: 3, attackPerLevel: 1,
			behavior: 'aggressive'
		};
		const entity = createMonster({ x: 3, y: 4 }, 5, def);
		expect(entity.name).toBe('TestMon');
		expect(entity.char).toBe('T');
		expect(entity.color).toBe('#f00');
		expect(entity.pos).toEqual({ x: 3, y: 4 });
		expect(entity.maxHp).toBe(5 + Math.floor(2 * 5)); // 15
		expect(entity.hp).toBe(entity.maxHp);
		expect(entity.attack).toBe(3 + Math.floor(1 * 5)); // 8
		expect(entity.statusEffects).toEqual([]);
	});

	it('scales stats with dungeon level', () => {
		const def = MONSTER_DEFS.find((m) => m.name === 'Goblin')!;
		const low = createMonster({ x: 0, y: 0 }, 1, def);
		const high = createMonster({ x: 0, y: 0 }, 10, def);
		expect(high.maxHp).toBeGreaterThan(low.maxHp);
		expect(high.attack).toBeGreaterThan(low.attack);
	});
});

describe('pickMonsterDef', () => {
	it('returns a monster from the appropriate tier', () => {
		// Run multiple times to account for randomness
		for (let i = 0; i < 20; i++) {
			const def = pickMonsterDef(1);
			expect(def.tier).toBe(1);
		}
	});

	it('can return tier 2 monsters at level 5', () => {
		const results = new Set<number>();
		for (let i = 0; i < 50; i++) {
			results.add(pickMonsterDef(5).tier);
		}
		expect(results.has(2)).toBe(true);
	});
});

describe('decideMoveDirection', () => {
	const playerPos = { x: 5, y: 5 };

	describe('aggressive', () => {
		it('always moves toward player', () => {
			const enemy = makeEntity('Ogre', 3, 5);
			const move = decideMoveDirection(enemy, playerPos, [], 'aggressive');
			expect(move.dx).toBe(1); // toward player
			expect(move.skip).toBe(false);
		});
	});

	describe('cowardly', () => {
		it('flees when below 50% HP', () => {
			const enemy = makeEntity('Rat', 3, 5, { hp: 2, maxHp: 10 });
			const move = decideMoveDirection(enemy, playerPos, [], 'cowardly');
			expect(move.dx).toBe(-1); // away from player
			expect(move.skip).toBe(false);
		});

		it('moves toward player when healthy', () => {
			const enemy = makeEntity('Rat', 3, 5, { hp: 8, maxHp: 10 });
			const move = decideMoveDirection(enemy, playerPos, [], 'cowardly');
			expect(move.dx).toBe(1); // toward player
			// skip is random, so just check dx direction
		});
	});

	describe('relentless', () => {
		it('always moves toward player and never skips', () => {
			const enemy = makeEntity('Skeleton', 3, 5);
			for (let i = 0; i < 20; i++) {
				const move = decideMoveDirection(enemy, playerPos, [], 'relentless');
				expect(move.dx).toBe(1);
				expect(move.skip).toBe(false);
			}
		});
	});

	describe('pack', () => {
		it('always charges when ally is nearby', () => {
			const enemy = makeEntity('Goblin', 3, 5);
			const ally = makeEntity('Goblin', 4, 5);
			for (let i = 0; i < 20; i++) {
				const move = decideMoveDirection(enemy, playerPos, [enemy, ally], 'pack');
				expect(move.dx).toBe(1);
				expect(move.skip).toBe(false);
			}
		});

		it('is cautious when alone (may skip)', () => {
			const enemy = makeEntity('Goblin', 3, 5);
			const move = decideMoveDirection(enemy, playerPos, [enemy], 'pack');
			expect(move.dx).toBe(1); // direction is still toward player
		});
	});

	describe('erratic', () => {
		it('sometimes moves in a random direction', () => {
			const enemy = makeEntity('Bat', 5, 3);
			const directions = new Set<string>();
			for (let i = 0; i < 100; i++) {
				const move = decideMoveDirection(enemy, playerPos, [], 'erratic');
				directions.add(`${move.dx},${move.dy}`);
			}
			// Should have at least 2 different directions due to randomness
			expect(directions.size).toBeGreaterThanOrEqual(2);
		});
	});
});

describe('getMonsterBehavior', () => {
	it('returns correct behavior for known monsters', () => {
		expect(getMonsterBehavior(makeEntity('Rat', 0, 0))).toBe('cowardly');
		expect(getMonsterBehavior(makeEntity('Skeleton', 0, 0))).toBe('relentless');
		expect(getMonsterBehavior(makeEntity('Goblin', 0, 0))).toBe('pack');
		expect(getMonsterBehavior(makeEntity('Bat', 0, 0))).toBe('erratic');
	});

	it('defaults to aggressive for unknown monsters', () => {
		expect(getMonsterBehavior(makeEntity('UnknownThing', 0, 0))).toBe('aggressive');
	});
});

describe('getMonsterOnHitEffect', () => {
	it('returns poison for Slime', () => {
		const effect = getMonsterOnHitEffect(makeEntity('Slime', 0, 0));
		expect(effect).toBeDefined();
		expect(effect!.type).toBe('poison');
	});

	it('returns stun for Wraith', () => {
		const effect = getMonsterOnHitEffect(makeEntity('Wraith', 0, 0));
		expect(effect).toBeDefined();
		expect(effect!.type).toBe('stun');
	});

	it('returns undefined for monsters without on-hit effects', () => {
		expect(getMonsterOnHitEffect(makeEntity('Skeleton', 0, 0))).toBeUndefined();
		expect(getMonsterOnHitEffect(makeEntity('Goblin', 0, 0))).toBeUndefined();
	});
});
