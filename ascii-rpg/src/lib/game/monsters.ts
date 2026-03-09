import type { Entity, Position, StatusEffectType } from './types';

export interface MonsterPhase {
	hpPercent: number;
	behavior: MonsterBehavior;
	onHitEffect?: { type: StatusEffectType; duration: number; potency: number };
}

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
	sleepChance?: number;
	boss?: boolean;
	phases?: MonsterPhase[];
	spells?: { spellId: string; weight: number; castChance: number }[];
	isSpellcaster?: boolean;
}

export type MonsterBehavior = 'aggressive' | 'cowardly' | 'erratic' | 'pack' | 'relentless';

export const MONSTER_DEFS: MonsterDef[] = [
	// Tier 1 — dungeon levels 1-3
	{ name: 'Rat', char: 'r', color: '#aa8866', tier: 1, baseHp: 2, hpPerLevel: 1, baseAttack: 1, attackPerLevel: 0.3, behavior: 'cowardly' },
	{ name: 'Bat', char: 'b', color: '#ff00ff', tier: 1, baseHp: 1, hpPerLevel: 1, baseAttack: 1, attackPerLevel: 0.2, behavior: 'erratic', sleepChance: 0.5 },
	{ name: 'Slime', char: 's', color: '#00ffff', tier: 1, baseHp: 3, hpPerLevel: 2, baseAttack: 1, attackPerLevel: 0.3, behavior: 'relentless', onHitEffect: { type: 'poison', duration: 3, potency: 1 } },
	{ name: 'Goblin', char: 'g', color: '#00ff00', tier: 1, baseHp: 3, hpPerLevel: 1, baseAttack: 2, attackPerLevel: 0.5, behavior: 'pack' },
	{ name: 'Spider', char: 'x', color: '#886644', tier: 1, baseHp: 2, hpPerLevel: 1, baseAttack: 2, attackPerLevel: 0.4, behavior: 'aggressive', onHitEffect: { type: 'poison', duration: 2, potency: 1 }, sleepChance: 0.3 },

	// Tier 2 — dungeon levels 4-7
	{ name: 'Skeleton', char: 'S', color: '#ffffff', tier: 2, baseHp: 5, hpPerLevel: 2, baseAttack: 3, attackPerLevel: 0.6, behavior: 'relentless' },
	{ name: 'Zombie', char: 'Z', color: '#668866', tier: 2, baseHp: 8, hpPerLevel: 3, baseAttack: 2, attackPerLevel: 0.4, behavior: 'relentless' },
	{ name: 'Wolf', char: 'w', color: '#aaaaaa', tier: 2, baseHp: 4, hpPerLevel: 2, baseAttack: 4, attackPerLevel: 0.7, behavior: 'pack' },
	{ name: 'Ogre', char: 'O', color: '#886600', tier: 2, baseHp: 10, hpPerLevel: 3, baseAttack: 4, attackPerLevel: 0.5, behavior: 'aggressive' },

	// Tier 3 — dungeon levels 8+
	{ name: 'Wraith', char: 'W', color: '#8844ff', tier: 3, baseHp: 8, hpPerLevel: 3, baseAttack: 5, attackPerLevel: 0.8, behavior: 'aggressive', onHitEffect: { type: 'stun', duration: 1, potency: 0 } },
	{ name: 'Troll', char: 'T', color: '#448844', tier: 3, baseHp: 15, hpPerLevel: 4, baseAttack: 5, attackPerLevel: 0.6, behavior: 'relentless' },
	{ name: 'Minotaur', char: 'M', color: '#cc4400', tier: 3, baseHp: 12, hpPerLevel: 3, baseAttack: 6, attackPerLevel: 0.8, behavior: 'aggressive' },

	// Spellcaster enemies
	{ name: 'Frost Imp', char: 'i', color: '#88ccff', tier: 1, baseHp: 3, hpPerLevel: 1, baseAttack: 1, attackPerLevel: 0.2, behavior: 'erratic',
		isSpellcaster: true, spells: [{ spellId: 'spell_frost_lance', weight: 1, castChance: 0.4 }] },
	{ name: 'Fire Mage', char: 'f', color: '#ff6600', tier: 2, baseHp: 5, hpPerLevel: 2, baseAttack: 2, attackPerLevel: 0.3, behavior: 'cowardly',
		isSpellcaster: true, spells: [{ spellId: 'spell_firebolt', weight: 2, castChance: 0.4 }, { spellId: 'spell_fireball', weight: 1, castChance: 0.25 }] },
	{ name: 'Shadow Priest', char: 'p', color: '#a66aff', tier: 2, baseHp: 6, hpPerLevel: 2, baseAttack: 2, attackPerLevel: 0.4, behavior: 'cowardly',
		isSpellcaster: true, spells: [{ spellId: 'spell_shadow_bolt', weight: 2, castChance: 0.4 }, { spellId: 'spell_life_drain', weight: 1, castChance: 0.3 }] },
	{ name: 'Dark Necromancer', char: 'n', color: '#66aa66', tier: 3, baseHp: 8, hpPerLevel: 2, baseAttack: 3, attackPerLevel: 0.5, behavior: 'cowardly',
		isSpellcaster: true, spells: [{ spellId: 'spell_shadow_bolt', weight: 2, castChance: 0.4 }, { spellId: 'spell_curse_of_weakness', weight: 1, castChance: 0.25 }] },
	{ name: 'Void Cultist', char: 'v', color: '#9933cc', tier: 3, baseHp: 7, hpPerLevel: 2, baseAttack: 4, attackPerLevel: 0.6, behavior: 'erratic',
		isSpellcaster: true, spells: [{ spellId: 'spell_shadow_bolt', weight: 2, castChance: 0.4 }] },
];

export const BOSS_DEFS: MonsterDef[] = [
	{
		name: 'The Hollow King', char: 'K', color: '#ffcc00', tier: 1,
		baseHp: 30, hpPerLevel: 5, baseAttack: 4, attackPerLevel: 1,
		behavior: 'aggressive', boss: true,
		onHitEffect: { type: 'stun', duration: 1, potency: 0 },
		phases: [
			{ hpPercent: 50, behavior: 'erratic', onHitEffect: { type: 'stun', duration: 2, potency: 0 } },
			{ hpPercent: 25, behavior: 'relentless', onHitEffect: { type: 'stun', duration: 2, potency: 0 } }
		]
	},
	{
		name: 'Magmaw the Devourer', char: 'D', color: '#ff4400', tier: 2,
		baseHp: 40, hpPerLevel: 6, baseAttack: 5, attackPerLevel: 1.2,
		behavior: 'relentless', boss: true,
		phases: [
			{ hpPercent: 50, behavior: 'aggressive', onHitEffect: { type: 'poison', duration: 4, potency: 2 } },
			{ hpPercent: 25, behavior: 'relentless', onHitEffect: { type: 'poison', duration: 4, potency: 3 } }
		]
	},
	{
		name: 'The Weaver Queen', char: 'Q', color: '#cc44ff', tier: 3,
		baseHp: 50, hpPerLevel: 7, baseAttack: 6, attackPerLevel: 1.5,
		behavior: 'cowardly', boss: true,
		onHitEffect: { type: 'poison', duration: 3, potency: 2 },
		phases: [
			{ hpPercent: 50, behavior: 'aggressive', onHitEffect: { type: 'poison', duration: 5, potency: 3 } },
			{ hpPercent: 25, behavior: 'relentless', onHitEffect: { type: 'stun', duration: 2, potency: 0 } }
		]
	}
];

export function isBossLevel(level: number): boolean {
	return level > 0 && level % 5 === 0;
}

export function pickBossDef(level: number): MonsterDef {
	const index = Math.floor((level / 5 - 1) % BOSS_DEFS.length);
	return BOSS_DEFS[index];
}

const RARE_PREFIXES = ['Ancient', 'Shadow', 'Enraged', 'Cursed', 'Spectral'];
const RARE_COLORS = ['#ffaa00', '#aa44ff', '#ff2222', '#44ffaa', '#aaaaff'];

export const RARE_SPAWN_CHANCE = 0.05;

export function isRare(enemy: Entity): boolean {
	return RARE_PREFIXES.some((p) => enemy.name.startsWith(p + ' '));
}

export function getRareBaseName(name: string): string | undefined {
	for (const prefix of RARE_PREFIXES) {
		if (name.startsWith(prefix + ' ')) {
			return name.slice(prefix.length + 1);
		}
	}
	return undefined;
}

export function createRareMonster(pos: Position, level: number, def: MonsterDef, rng?: { next(): number }): Entity {
	const rand = rng ? rng.next() : Math.random();
	const prefix = RARE_PREFIXES[Math.floor(rand * RARE_PREFIXES.length)];
	const color = RARE_COLORS[RARE_PREFIXES.indexOf(prefix)];
	const hp = (def.baseHp + Math.floor(def.hpPerLevel * level)) * 2;
	const attack = Math.floor((def.baseAttack + Math.floor(def.attackPerLevel * level)) * 1.5);
	return {
		pos,
		char: def.char.toUpperCase(),
		color,
		name: `${prefix} ${def.name}`,
		hp,
		maxHp: hp,
		attack,
		statusEffects: []
	};
}

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

export function pickMonsterDef(level: number, rng?: { next(): number }): MonsterDef {
	const pool = monstersForLevel(level);
	const rand = rng ? rng.next() : Math.random();
	return pool[Math.floor(rand * pool.length)];
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

const MONSTER_BY_NAME = new Map(
	[...MONSTER_DEFS, ...BOSS_DEFS].map((m) => [m.name, m])
);

export function getMonsterDef(enemy: Entity): MonsterDef | undefined {
	const direct = MONSTER_BY_NAME.get(enemy.name);
	if (direct) return direct;
	// Check for rare variant — strip prefix to find base def
	const baseName = getRareBaseName(enemy.name);
	if (baseName) return MONSTER_BY_NAME.get(baseName);
	return undefined;
}

export function getMonsterDefByName(name: string): MonsterDef | undefined {
	const allDefs = [...MONSTER_DEFS, ...BOSS_DEFS];
	return allDefs.find(m => name === m.name) ?? allDefs.find(m => name.includes(m.name));
}

function getActivePhase(def: MonsterDef, enemy: Entity): MonsterPhase | undefined {
	if (!def.phases) return undefined;
	const hpPercent = (enemy.hp / enemy.maxHp) * 100;
	// Return the phase with the highest hpPercent that the enemy is at or below
	let active: MonsterPhase | undefined;
	for (const phase of def.phases) {
		if (hpPercent <= phase.hpPercent) {
			if (!active || phase.hpPercent > active.hpPercent) {
				active = phase;
			}
		}
	}
	return active;
}

export function getMonsterBehavior(enemy: Entity): MonsterBehavior {
	const def = getMonsterDef(enemy);
	if (!def) return 'aggressive';
	const phase = getActivePhase(def, enemy);
	return phase?.behavior ?? def.behavior;
}

export function getMonsterOnHitEffect(enemy: Entity): MonsterDef['onHitEffect'] {
	const def = getMonsterDef(enemy);
	if (!def) return undefined;
	const phase = getActivePhase(def, enemy);
	if (phase) return phase.onHitEffect ?? def.onHitEffect;
	return def.onHitEffect;
}

export function isBoss(enemy: Entity): boolean {
	return getMonsterDef(enemy)?.boss === true;
}

export function getMonsterTier(enemy: Entity): number {
	return getMonsterDef(enemy)?.tier ?? 1;
}
