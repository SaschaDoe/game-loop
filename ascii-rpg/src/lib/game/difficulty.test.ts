import { describe, it, expect } from 'vitest';
import {
	DIFFICULTY_DEFS,
	DIFFICULTIES,
	applyDifficultyToEnemy,
	difficultySpawnCount,
	isPermadeath
} from './difficulty';
import type { Entity } from './types';

function makeEnemy(overrides?: Partial<Entity>): Entity {
	return {
		pos: { x: 0, y: 0 },
		char: 'G',
		color: '#0f0',
		name: 'Goblin',
		hp: 10,
		maxHp: 10,
		attack: 4,
		statusEffects: [],
		...overrides
	};
}

describe('DIFFICULTY_DEFS', () => {
	it('defines all four difficulty levels', () => {
		expect(DIFFICULTY_DEFS.easy).toBeDefined();
		expect(DIFFICULTY_DEFS.normal).toBeDefined();
		expect(DIFFICULTY_DEFS.hard).toBeDefined();
		expect(DIFFICULTY_DEFS.permadeath).toBeDefined();
	});

	it('normal has 1.0 multipliers', () => {
		expect(DIFFICULTY_DEFS.normal.hpMultiplier).toBe(1.0);
		expect(DIFFICULTY_DEFS.normal.attackMultiplier).toBe(1.0);
		expect(DIFFICULTY_DEFS.normal.spawnMultiplier).toBe(1.0);
	});

	it('easy has lower multipliers than normal', () => {
		expect(DIFFICULTY_DEFS.easy.hpMultiplier).toBeLessThan(1.0);
		expect(DIFFICULTY_DEFS.easy.attackMultiplier).toBeLessThan(1.0);
		expect(DIFFICULTY_DEFS.easy.spawnMultiplier).toBeLessThan(1.0);
	});

	it('hard has higher multipliers than normal', () => {
		expect(DIFFICULTY_DEFS.hard.hpMultiplier).toBeGreaterThan(1.0);
		expect(DIFFICULTY_DEFS.hard.attackMultiplier).toBeGreaterThan(1.0);
		expect(DIFFICULTY_DEFS.hard.spawnMultiplier).toBeGreaterThan(1.0);
	});

	it('permadeath has same multipliers as hard', () => {
		expect(DIFFICULTY_DEFS.permadeath.hpMultiplier).toBe(DIFFICULTY_DEFS.hard.hpMultiplier);
		expect(DIFFICULTY_DEFS.permadeath.attackMultiplier).toBe(DIFFICULTY_DEFS.hard.attackMultiplier);
	});

	it('all have labels and descriptions', () => {
		for (const def of Object.values(DIFFICULTY_DEFS)) {
			expect(def.label.length).toBeGreaterThan(0);
			expect(def.description.length).toBeGreaterThan(0);
		}
	});

	it('only permadeath has permadeath flag', () => {
		expect(DIFFICULTY_DEFS.easy.permadeath).toBe(false);
		expect(DIFFICULTY_DEFS.normal.permadeath).toBe(false);
		expect(DIFFICULTY_DEFS.hard.permadeath).toBe(false);
		expect(DIFFICULTY_DEFS.permadeath.permadeath).toBe(true);
	});
});

describe('DIFFICULTIES', () => {
	it('lists all four difficulties in order', () => {
		expect(DIFFICULTIES).toEqual(['easy', 'normal', 'hard', 'permadeath']);
	});
});

describe('applyDifficultyToEnemy', () => {
	it('normal leaves stats unchanged', () => {
		const enemy = makeEnemy();
		applyDifficultyToEnemy(enemy, 'normal');
		expect(enemy.hp).toBe(10);
		expect(enemy.maxHp).toBe(10);
		expect(enemy.attack).toBe(4);
	});

	it('easy reduces hp, maxHp, and attack', () => {
		const enemy = makeEnemy();
		applyDifficultyToEnemy(enemy, 'easy');
		expect(enemy.hp).toBeLessThan(10);
		expect(enemy.maxHp).toBeLessThan(10);
		expect(enemy.attack).toBeLessThan(4);
	});

	it('hard increases hp, maxHp, and attack', () => {
		const enemy = makeEnemy();
		applyDifficultyToEnemy(enemy, 'hard');
		expect(enemy.hp).toBeGreaterThan(10);
		expect(enemy.maxHp).toBeGreaterThan(10);
		expect(enemy.attack).toBeGreaterThan(4);
	});

	it('keeps hp and maxHp in sync', () => {
		const enemy = makeEnemy();
		applyDifficultyToEnemy(enemy, 'hard');
		expect(enemy.hp).toBe(enemy.maxHp);
	});

	it('never reduces stats below 1', () => {
		const weakEnemy = makeEnemy({ hp: 1, maxHp: 1, attack: 1 });
		applyDifficultyToEnemy(weakEnemy, 'easy');
		expect(weakEnemy.hp).toBeGreaterThanOrEqual(1);
		expect(weakEnemy.maxHp).toBeGreaterThanOrEqual(1);
		expect(weakEnemy.attack).toBeGreaterThanOrEqual(1);
	});

	it('rounds values correctly', () => {
		const enemy = makeEnemy({ hp: 10, maxHp: 10, attack: 3 });
		applyDifficultyToEnemy(enemy, 'easy');
		expect(Number.isInteger(enemy.hp)).toBe(true);
		expect(Number.isInteger(enemy.maxHp)).toBe(true);
		expect(Number.isInteger(enemy.attack)).toBe(true);
	});
});

describe('difficultySpawnCount', () => {
	it('normal returns same count', () => {
		expect(difficultySpawnCount(10, 'normal')).toBe(10);
	});

	it('easy returns fewer enemies', () => {
		expect(difficultySpawnCount(10, 'easy')).toBeLessThan(10);
	});

	it('hard returns more enemies', () => {
		expect(difficultySpawnCount(10, 'hard')).toBeGreaterThan(10);
	});

	it('never returns less than 1', () => {
		expect(difficultySpawnCount(1, 'easy')).toBeGreaterThanOrEqual(1);
	});

	it('returns integer values', () => {
		for (const diff of DIFFICULTIES) {
			expect(Number.isInteger(difficultySpawnCount(7, diff))).toBe(true);
		}
	});
});

describe('isPermadeath', () => {
	it('returns true for permadeath', () => {
		expect(isPermadeath('permadeath')).toBe(true);
	});

	it('returns false for easy', () => {
		expect(isPermadeath('easy')).toBe(false);
	});

	it('returns false for normal', () => {
		expect(isPermadeath('normal')).toBe(false);
	});

	it('returns false for hard', () => {
		expect(isPermadeath('hard')).toBe(false);
	});
});
