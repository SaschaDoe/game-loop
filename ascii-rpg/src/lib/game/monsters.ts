import type { Entity, Position, StatusEffectType } from './types';

export interface MonsterDef {
	name: string;
	char: string;
	color: string;
	tier: 1 | 2 | 3;
	baseHp: number;
	hpPerLevel: number;
	baseAttack: number;
	attackPerLevel: number;
	behavior: MonsterBehavior;
	onHitEffect?: { type: StatusEffectType; duration: number; potency: number };
}

export type MonsterBehavior = 'aggressive' | 'cowardly' | 'erratic' | 'pack' | 'relentless';

export const MONSTER_DEFS: MonsterDef[] = [
	// Tier 1 — dungeon levels 1-3
	{ name: 'Rat', char: 'r', color: '#aa8866', tier: 1, baseHp: 2, hpPerLevel: 1, baseAttack: 1, attackPerLevel: 0.3, behavior: 'cowardly' },
	{ name: 'Bat', char: 'b', color: '#ff00ff', tier: 1, baseHp: 1, hpPerLevel: 1, baseAttack: 1, attackPerLevel: 0.2, behavior: 'erratic' },
	{ name: 'Slime', char: 's', color: '#00ffff', tier: 1, baseHp: 3, hpPerLevel: 2, baseAttack: 1, attackPerLevel: 0.3, behavior: 'relentless', onHitEffect: { type: 'poison', duration: 3, potency: 1 } },
	{ name: 'Goblin', char: 'g', color: '#00ff00', tier: 1, baseHp: 3, hpPerLevel: 1, baseAttack: 2, attackPerLevel: 0.5, behavior: 'pack' },
	{ name: 'Spider', char: 'x', color: '#886644', tier: 1, baseHp: 2, hpPerLevel: 1, baseAttack: 2, attackPerLevel: 0.4, behavior: 'aggressive', onHitEffect: { type: 'poison', duration: 2, potency: 1 } },

	// Tier 2 — dungeon levels 4-7
	{ name: 'Skeleton', char: 'S', color: '#ffffff', tier: 2, baseHp: 5, hpPerLevel: 2, baseAttack: 3, attackPerLevel: 0.6, behavior: 'relentless' },
	{ name: 'Zombie', char: 'Z', color: '#668866', tier: 2, baseHp: 8, hpPerLevel: 3, baseAttack: 2, attackPerLevel: 0.4, behavior: 'relentless' },
	{ name: 'Wolf', char: 'w', color: '#aaaaaa', tier: 2, baseHp: 4, hpPerLevel: 2, baseAttack: 4, attackPerLevel: 0.7, behavior: 'pack' },
	{ name: 'Ogre', char: 'O', color: '#886600', tier: 2, baseHp: 10, hpPerLevel: 3, baseAttack: 4, attackPerLevel: 0.5, behavior: 'aggressive' },

	// Tier 3 — dungeon levels 8+
	{ name: 'Wraith', char: 'W', color: '#8844ff', tier: 3, baseHp: 8, hpPerLevel: 3, baseAttack: 5, attackPerLevel: 0.8, behavior: 'aggressive', onHitEffect: { type: 'stun', duration: 1, potency: 0 } },
	{ name: 'Troll', char: 'T', color: '#448844', tier: 3, baseHp: 15, hpPerLevel: 4, baseAttack: 5, attackPerLevel: 0.6, behavior: 'relentless' },
	{ name: 'Minotaur', char: 'M', color: '#cc4400', tier: 3, baseHp: 12, hpPerLevel: 3, baseAttack: 6, attackPerLevel: 0.8, behavior: 'aggressive' },
];

export function monstersForLevel(level: number): MonsterDef[] {
	if (level <= 3) return MONSTER_DEFS.filter((m) => m.tier === 1);
	if (level <= 7) return MONSTER_DEFS.filter((m) => m.tier <= 2);
	return MONSTER_DEFS;
}

export function createMonster(pos: Position, level: number, def: MonsterDef): Entity {
	const hp = def.baseHp + Math.floor(def.hpPerLevel * level);
	return {
		pos,
		char: def.char,
		color: def.color,
		name: def.name,
		hp,
		maxHp: hp,
		attack: def.baseAttack + Math.floor(def.attackPerLevel * level),
		statusEffects: []
	};
}

export function pickMonsterDef(level: number): MonsterDef {
	const pool = monstersForLevel(level);
	return pool[Math.floor(Math.random() * pool.length)];
}

export interface MoveDecision {
	dx: number;
	dy: number;
	skip: boolean;
}

export function decideMoveDirection(
	enemy: Entity,
	playerPos: Position,
	allEnemies: Entity[],
	behavior: MonsterBehavior
): MoveDecision {
	const toPlayerX = Math.sign(playerPos.x - enemy.pos.x);
	const toPlayerY = Math.sign(playerPos.y - enemy.pos.y);

	switch (behavior) {
		case 'aggressive':
			// Always moves toward player
			return { dx: toPlayerX, dy: toPlayerY, skip: false };

		case 'cowardly': {
			// Flees when below 50% HP, otherwise cautious (moves 30% of turns)
			if (enemy.hp < enemy.maxHp * 0.5) {
				return { dx: -toPlayerX, dy: -toPlayerY, skip: false };
			}
			return { dx: toPlayerX, dy: toPlayerY, skip: Math.random() < 0.7 };
		}

		case 'erratic':
			// Random movement 40% of the time, otherwise chase
			if (Math.random() < 0.4) {
				const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
				const [rx, ry] = dirs[Math.floor(Math.random() * dirs.length)];
				return { dx: rx, dy: ry, skip: false };
			}
			return { dx: toPlayerX, dy: toPlayerY, skip: false };

		case 'pack': {
			// Moves toward player but prefers to be near allies
			const nearbyAlly = allEnemies.find(
				(e) => e !== enemy &&
					Math.abs(e.pos.x - enemy.pos.x) <= 2 &&
					Math.abs(e.pos.y - enemy.pos.y) <= 2
			);
			if (nearbyAlly) {
				// Has a buddy, charge confidently
				return { dx: toPlayerX, dy: toPlayerY, skip: false };
			}
			// Alone, move cautiously (50% skip)
			return { dx: toPlayerX, dy: toPlayerY, skip: Math.random() < 0.5 };
		}

		case 'relentless':
			// Always moves toward player, never skips
			return { dx: toPlayerX, dy: toPlayerY, skip: false };
	}
}

const MONSTER_BY_NAME = new Map(MONSTER_DEFS.map((m) => [m.name, m]));

export function getMonsterDef(enemy: Entity): MonsterDef | undefined {
	return MONSTER_BY_NAME.get(enemy.name);
}

export function getMonsterBehavior(enemy: Entity): MonsterBehavior {
	return getMonsterDef(enemy)?.behavior ?? 'aggressive';
}

export function getMonsterOnHitEffect(enemy: Entity): MonsterDef['onHitEffect'] {
	return getMonsterDef(enemy)?.onHitEffect;
}
