import { describe, it, expect } from 'vitest';
import {
	ACHIEVEMENT_DEFS,
	getAchievement,
	checkAchievements,
	getUnlockedByCategory,
	getVisibleAchievements,
	createDefaultStats
} from './achievements';
import type { GameStats } from './types';

function makeStats(overrides?: Partial<GameStats>): GameStats {
	return { ...createDefaultStats(), ...overrides };
}

describe('ACHIEVEMENT_DEFS', () => {
	it('has unique ids', () => {
		const ids = ACHIEVEMENT_DEFS.map((a) => a.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('all have required fields', () => {
		for (const def of ACHIEVEMENT_DEFS) {
			expect(def.id).toBeTruthy();
			expect(def.name).toBeTruthy();
			expect(def.description).toBeTruthy();
			expect(['combat', 'exploration', 'social']).toContain(def.category);
			expect(typeof def.hidden).toBe('boolean');
			expect(typeof def.condition).toBe('function');
		}
	});

	it('includes combat, exploration, and social categories', () => {
		const categories = new Set(ACHIEVEMENT_DEFS.map((a) => a.category));
		expect(categories.has('combat')).toBe(true);
		expect(categories.has('exploration')).toBe(true);
		expect(categories.has('social')).toBe(true);
	});

	it('includes hidden achievements', () => {
		const hidden = ACHIEVEMENT_DEFS.filter((a) => a.hidden);
		expect(hidden.length).toBeGreaterThan(0);
	});
});

describe('getAchievement', () => {
	it('returns definition by id', () => {
		const def = getAchievement('first_blood');
		expect(def).toBeDefined();
		expect(def!.name).toBe('First Blood');
	});

	it('returns undefined for unknown id', () => {
		expect(getAchievement('nonexistent')).toBeUndefined();
	});
});

describe('checkAchievements', () => {
	it('returns empty array when no conditions met', () => {
		const stats = makeStats();
		expect(checkAchievements(stats, [])).toEqual([]);
	});

	it('unlocks first_blood when 1 enemy killed', () => {
		const stats = makeStats({ enemiesKilled: 1 });
		const newly = checkAchievements(stats, []);
		expect(newly).toContain('first_blood');
	});

	it('does not re-unlock already unlocked achievements', () => {
		const stats = makeStats({ enemiesKilled: 1 });
		const newly = checkAchievements(stats, ['first_blood']);
		expect(newly).not.toContain('first_blood');
	});

	it('unlocks multiple achievements at once', () => {
		const stats = makeStats({ enemiesKilled: 25 });
		const newly = checkAchievements(stats, []);
		expect(newly).toContain('first_blood');
		expect(newly).toContain('monster_slayer');
	});

	it('unlocks boss_hunter when boss killed', () => {
		const stats = makeStats({ bossesKilled: 1 });
		const newly = checkAchievements(stats, []);
		expect(newly).toContain('boss_hunter');
	});

	it('unlocks deep_delver at level 5', () => {
		const stats = makeStats({ maxDungeonLevel: 5 });
		const newly = checkAchievements(stats, []);
		expect(newly).toContain('deep_delver');
	});

	it('unlocks hidden abyss_walker at level 10', () => {
		const stats = makeStats({ maxDungeonLevel: 10 });
		const newly = checkAchievements(stats, []);
		expect(newly).toContain('abyss_walker');
	});

	it('unlocks socialite after talking to 5 NPCs', () => {
		const stats = makeStats({ npcsSpokenTo: 5 });
		const newly = checkAchievements(stats, []);
		expect(newly).toContain('socialite');
	});

	it('unlocks damage_dealer at 500 damage', () => {
		const stats = makeStats({ damageDealt: 500 });
		const newly = checkAchievements(stats, []);
		expect(newly).toContain('damage_dealer');
	});

	it('unlocks survivor at 1000 damage taken', () => {
		const stats = makeStats({ damageTaken: 1000 });
		const newly = checkAchievements(stats, []);
		expect(newly).toContain('survivor');
	});

	it('unlocks archaeologist at 20 landmarks examined', () => {
		const stats = makeStats({ landmarksExamined: 20 });
		const newly = checkAchievements(stats, []);
		expect(newly).toContain('archaeologist');
	});

	it('unlocks trap_expert at 10 traps disarmed', () => {
		const stats = makeStats({ trapsDisarmed: 10 });
		const newly = checkAchievements(stats, []);
		expect(newly).toContain('trap_expert');
	});

	it('unlocks treasure_hunter at 15 chests opened', () => {
		const stats = makeStats({ chestsOpened: 15 });
		const newly = checkAchievements(stats, []);
		expect(newly).toContain('treasure_hunter');
	});
});

describe('getUnlockedByCategory', () => {
	it('returns only combat achievements', () => {
		const unlocked = ['first_blood', 'deep_delver', 'socialite'];
		const combat = getUnlockedByCategory(unlocked, 'combat');
		expect(combat.every((a) => a.category === 'combat')).toBe(true);
		expect(combat.map((a) => a.id)).toContain('first_blood');
	});

	it('returns empty for no unlocked in category', () => {
		const result = getUnlockedByCategory(['first_blood'], 'social');
		expect(result).toHaveLength(0);
	});
});

describe('getVisibleAchievements', () => {
	it('shows non-hidden achievements even when not unlocked', () => {
		const visible = getVisibleAchievements([]);
		const nonHidden = ACHIEVEMENT_DEFS.filter((a) => !a.hidden);
		expect(visible.length).toBe(nonHidden.length);
	});

	it('shows hidden achievements once unlocked', () => {
		const visible = getVisibleAchievements(['abyss_walker']);
		expect(visible.find((a) => a.id === 'abyss_walker')).toBeDefined();
	});

	it('hides hidden achievements when not unlocked', () => {
		const visible = getVisibleAchievements([]);
		expect(visible.find((a) => a.id === 'abyss_walker')).toBeUndefined();
	});
});

describe('createDefaultStats', () => {
	it('returns all zeroes', () => {
		const stats = createDefaultStats();
		for (const value of Object.values(stats)) {
			expect(value).toBe(0);
		}
	});
});
