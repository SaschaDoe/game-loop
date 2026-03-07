import { describe, it, expect } from 'vitest';
import {
	createBestiaryEntry,
	recordSeen,
	recordKill,
	getBestiaryEntry,
	getDiscoveredCount,
	getTotalMonsterTypes,
	getCompletionPercent,
	getRareDiscoveredCount
} from './bestiary';
import type { BestiaryEntry, Entity } from './types';
import { MONSTER_DEFS, BOSS_DEFS } from './monsters';

function makeEntity(name: string, overrides?: Partial<Entity>): Entity {
	return {
		pos: { x: 0, y: 0 }, char: 'G', color: '#0f0', name,
		hp: 5, maxHp: 5, attack: 2, statusEffects: [],
		...overrides
	};
}

describe('createBestiaryEntry', () => {
	it('returns zeroed entry', () => {
		const entry = createBestiaryEntry();
		expect(entry.timesSeen).toBe(0);
		expect(entry.timesKilled).toBe(0);
		expect(entry.rareEncountered).toBe(false);
		expect(entry.rareKilled).toBe(false);
	});
});

describe('recordSeen', () => {
	it('creates entry for new monster', () => {
		const bestiary: Record<string, BestiaryEntry> = {};
		recordSeen(bestiary, makeEntity('Goblin'));
		expect(bestiary['Goblin']).toBeDefined();
		expect(bestiary['Goblin'].timesSeen).toBe(1);
	});

	it('increments timesSeen for existing monster', () => {
		const bestiary: Record<string, BestiaryEntry> = {};
		recordSeen(bestiary, makeEntity('Goblin'));
		recordSeen(bestiary, makeEntity('Goblin'));
		expect(bestiary['Goblin'].timesSeen).toBe(2);
	});

	it('resolves rare variant to base name', () => {
		const bestiary: Record<string, BestiaryEntry> = {};
		recordSeen(bestiary, makeEntity('Ancient Goblin'));
		expect(bestiary['Goblin']).toBeDefined();
		expect(bestiary['Goblin'].rareEncountered).toBe(true);
	});

	it('does not set rareEncountered for normal monster', () => {
		const bestiary: Record<string, BestiaryEntry> = {};
		recordSeen(bestiary, makeEntity('Goblin'));
		expect(bestiary['Goblin'].rareEncountered).toBe(false);
	});

	it('tracks rare and normal under same base name', () => {
		const bestiary: Record<string, BestiaryEntry> = {};
		recordSeen(bestiary, makeEntity('Goblin'));
		recordSeen(bestiary, makeEntity('Shadow Goblin'));
		expect(bestiary['Goblin'].timesSeen).toBe(2);
		expect(bestiary['Goblin'].rareEncountered).toBe(true);
	});
});

describe('recordKill', () => {
	it('creates entry and increments timesKilled', () => {
		const bestiary: Record<string, BestiaryEntry> = {};
		recordKill(bestiary, makeEntity('Rat'));
		expect(bestiary['Rat'].timesKilled).toBe(1);
	});

	it('tracks rare kill', () => {
		const bestiary: Record<string, BestiaryEntry> = {};
		recordKill(bestiary, makeEntity('Enraged Rat'));
		expect(bestiary['Rat'].rareKilled).toBe(true);
	});

	it('does not set rareKilled for normal monster', () => {
		const bestiary: Record<string, BestiaryEntry> = {};
		recordKill(bestiary, makeEntity('Rat'));
		expect(bestiary['Rat'].rareKilled).toBe(false);
	});
});

describe('getBestiaryEntry', () => {
	it('returns entry for known monster', () => {
		const bestiary: Record<string, BestiaryEntry> = {};
		recordSeen(bestiary, makeEntity('Wolf'));
		const entry = getBestiaryEntry(bestiary, 'Wolf');
		expect(entry).toBeDefined();
		expect(entry!.timesSeen).toBe(1);
	});

	it('returns undefined for unknown monster', () => {
		expect(getBestiaryEntry({}, 'Dragon')).toBeUndefined();
	});
});

describe('getDiscoveredCount', () => {
	it('returns 0 for empty bestiary', () => {
		expect(getDiscoveredCount({})).toBe(0);
	});

	it('counts distinct monster types', () => {
		const bestiary: Record<string, BestiaryEntry> = {};
		recordSeen(bestiary, makeEntity('Rat'));
		recordSeen(bestiary, makeEntity('Wolf'));
		recordSeen(bestiary, makeEntity('Rat'));
		expect(getDiscoveredCount(bestiary)).toBe(2);
	});
});

describe('getTotalMonsterTypes', () => {
	it('returns sum of regular and boss monsters', () => {
		expect(getTotalMonsterTypes()).toBe(MONSTER_DEFS.length + BOSS_DEFS.length);
	});
});

describe('getCompletionPercent', () => {
	it('returns 0 for empty bestiary', () => {
		expect(getCompletionPercent({})).toBe(0);
	});

	it('calculates percentage correctly', () => {
		const bestiary: Record<string, BestiaryEntry> = {};
		const total = getTotalMonsterTypes();
		// Add entries for half the monsters
		const halfCount = Math.floor(total / 2);
		for (let i = 0; i < halfCount; i++) {
			bestiary[`Monster${i}`] = createBestiaryEntry();
		}
		const pct = getCompletionPercent(bestiary);
		expect(pct).toBe(Math.floor((halfCount / total) * 100));
	});
});

describe('getRareDiscoveredCount', () => {
	it('returns 0 for empty bestiary', () => {
		expect(getRareDiscoveredCount({})).toBe(0);
	});

	it('counts only entries with rare encountered', () => {
		const bestiary: Record<string, BestiaryEntry> = {};
		recordSeen(bestiary, makeEntity('Rat'));
		recordSeen(bestiary, makeEntity('Cursed Wolf'));
		recordSeen(bestiary, makeEntity('Spectral Skeleton'));
		expect(getRareDiscoveredCount(bestiary)).toBe(2); // Wolf and Skeleton have rare
	});
});
