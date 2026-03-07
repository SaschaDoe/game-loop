import type { GameStats } from './types';

export type AchievementCategory = 'combat' | 'exploration' | 'social';

export interface AchievementDef {
	id: string;
	name: string;
	description: string;
	category: AchievementCategory;
	hidden: boolean;
	condition: (stats: GameStats) => boolean;
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
	// Combat
	{ id: 'first_blood', name: 'First Blood', description: 'Defeat your first enemy', category: 'combat', hidden: false, condition: (s) => s.enemiesKilled >= 1 },
	{ id: 'monster_slayer', name: 'Monster Slayer', description: 'Defeat 25 enemies', category: 'combat', hidden: false, condition: (s) => s.enemiesKilled >= 25 },
	{ id: 'warrior_legend', name: 'Warrior Legend', description: 'Defeat 100 enemies', category: 'combat', hidden: false, condition: (s) => s.enemiesKilled >= 100 },
	{ id: 'boss_hunter', name: 'Boss Hunter', description: 'Defeat a boss', category: 'combat', hidden: false, condition: (s) => s.bossesKilled >= 1 },
	{ id: 'boss_slayer', name: 'Boss Slayer', description: 'Defeat 5 bosses', category: 'combat', hidden: false, condition: (s) => s.bossesKilled >= 5 },
	{ id: 'damage_dealer', name: 'Heavy Hitter', description: 'Deal 500 total damage', category: 'combat', hidden: false, condition: (s) => s.damageDealt >= 500 },

	// Exploration
	{ id: 'secret_finder', name: 'Secret Finder', description: 'Find a secret wall', category: 'exploration', hidden: false, condition: (s) => s.secretsFound >= 1 },
	{ id: 'master_explorer', name: 'Master Explorer', description: 'Find 10 secrets', category: 'exploration', hidden: false, condition: (s) => s.secretsFound >= 10 },
	{ id: 'trap_expert', name: 'Trap Expert', description: 'Disarm 10 traps', category: 'exploration', hidden: false, condition: (s) => s.trapsDisarmed >= 10 },
	{ id: 'treasure_hunter', name: 'Treasure Hunter', description: 'Open 15 chests', category: 'exploration', hidden: false, condition: (s) => s.chestsOpened >= 15 },
	{ id: 'deep_delver', name: 'Deep Delver', description: 'Reach dungeon level 5', category: 'exploration', hidden: false, condition: (s) => s.maxDungeonLevel >= 5 },
	{ id: 'abyss_walker', name: 'Abyss Walker', description: 'Reach dungeon level 10', category: 'exploration', hidden: true, condition: (s) => s.maxDungeonLevel >= 10 },
	{ id: 'archaeologist', name: 'Archaeologist', description: 'Examine 20 landmarks', category: 'exploration', hidden: false, condition: (s) => s.landmarksExamined >= 20 },

	// Social
	{ id: 'socialite', name: 'Socialite', description: 'Talk to 5 NPCs', category: 'social', hidden: false, condition: (s) => s.npcsSpokenTo >= 5 },
	{ id: 'survivor', name: 'Survivor', description: 'Take 1000 damage and live to tell the tale', category: 'combat', hidden: true, condition: (s) => s.damageTaken >= 1000 },
];

export function getAchievement(id: string): AchievementDef | undefined {
	return ACHIEVEMENT_DEFS.find((a) => a.id === id);
}

export function checkAchievements(stats: GameStats, unlocked: string[]): string[] {
	const newlyUnlocked: string[] = [];
	for (const def of ACHIEVEMENT_DEFS) {
		if (!unlocked.includes(def.id) && def.condition(stats)) {
			newlyUnlocked.push(def.id);
		}
	}
	return newlyUnlocked;
}

export function getUnlockedByCategory(unlocked: string[], category: AchievementCategory): AchievementDef[] {
	return ACHIEVEMENT_DEFS.filter((a) => a.category === category && unlocked.includes(a.id));
}

export function getVisibleAchievements(unlocked: string[]): AchievementDef[] {
	return ACHIEVEMENT_DEFS.filter((a) => !a.hidden || unlocked.includes(a.id));
}

export function createDefaultStats(): GameStats {
	return {
		enemiesKilled: 0,
		bossesKilled: 0,
		secretsFound: 0,
		trapsDisarmed: 0,
		chestsOpened: 0,
		levelsCleared: 0,
		npcsSpokenTo: 0,
		landmarksExamined: 0,
		damageDealt: 0,
		damageTaken: 0,
		maxDungeonLevel: 0
	};
}
