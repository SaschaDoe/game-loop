import type { Entity, Difficulty } from './types';

export interface DifficultyModifiers {
	hpMultiplier: number;
	attackMultiplier: number;
	spawnMultiplier: number;
	permadeath: boolean;
	label: string;
	description: string;
}

export const DIFFICULTY_DEFS: Record<Difficulty, DifficultyModifiers> = {
	easy: {
		hpMultiplier: 0.7,
		attackMultiplier: 0.7,
		spawnMultiplier: 0.7,
		permadeath: false,
		label: 'Easy',
		description: 'Reduced enemy strength and numbers'
	},
	normal: {
		hpMultiplier: 1.0,
		attackMultiplier: 1.0,
		spawnMultiplier: 1.0,
		permadeath: false,
		label: 'Normal',
		description: 'The standard dungeon experience'
	},
	hard: {
		hpMultiplier: 1.5,
		attackMultiplier: 1.3,
		spawnMultiplier: 1.3,
		permadeath: false,
		label: 'Hard',
		description: 'Tougher enemies, more of them'
	},
	permadeath: {
		hpMultiplier: 1.5,
		attackMultiplier: 1.3,
		spawnMultiplier: 1.3,
		permadeath: true,
		label: 'Permadeath',
		description: 'One life. Death is permanent.'
	}
};

export const DIFFICULTIES: Difficulty[] = ['easy', 'normal', 'hard', 'permadeath'];

export function applyDifficultyToEnemy(enemy: Entity, difficulty: Difficulty): void {
	const mods = DIFFICULTY_DEFS[difficulty];
	enemy.hp = Math.max(1, Math.round(enemy.hp * mods.hpMultiplier));
	enemy.maxHp = Math.max(1, Math.round(enemy.maxHp * mods.hpMultiplier));
	enemy.attack = Math.max(1, Math.round(enemy.attack * mods.attackMultiplier));
}

export function difficultySpawnCount(baseCount: number, difficulty: Difficulty): number {
	return Math.max(1, Math.round(baseCount * DIFFICULTY_DEFS[difficulty].spawnMultiplier));
}

export function isPermadeath(difficulty: Difficulty): boolean {
	return DIFFICULTY_DEFS[difficulty].permadeath;
}
