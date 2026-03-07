import { describe, it, expect } from 'vitest';
import {
	placeHazards,
	getHazardAt,
	applyHazardToEntity,
	applyHazards,
	hazardName,
	hazardChar,
	hazardColor,
	HAZARD_DEFS
} from './hazards';
import type { GameState, Entity, Hazard } from './types';
import { Visibility } from './types';

function makeEnemy(x: number, y: number, overrides?: Partial<Entity>): Entity {
	return {
		pos: { x, y },
		char: 'G',
		color: '#0f0',
		name: 'Goblin',
		hp: 20,
		maxHp: 20,
		attack: 2,
		statusEffects: [],
		...overrides
	};
}

function makeTestState(overrides?: Partial<GameState>): GameState {
	const width = 10;
	const height = 10;
	const tiles = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => '.' as const)
	);
	const visibility = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => Visibility.Visible)
	);
	return {
		player: {
			pos: { x: 5, y: 5 },
			char: '@',
			color: '#ff0',
			name: 'Hero',
			hp: 20,
			maxHp: 20,
			attack: 10,
			statusEffects: []
		},
		enemies: [],
		map: { width, height, tiles, secretWalls: new Set<string>() },
		messages: [],
		level: 1,
		gameOver: false,
		xp: 0,
		characterLevel: 1,
		visibility,
		sightRadius: 8,
		detectedSecrets: new Set<string>(),
		traps: [],
		detectedTraps: new Set<string>(),
		characterConfig: { name: 'Hero', characterClass: 'warrior' as const, difficulty: 'normal' as const, startingLocation: 'cave' as const },
		abilityCooldown: 0,
		hazards: [],
		npcs: [],
		chests: [],
		lootDrops: [],
		skillPoints: 0,
		unlockedSkills: [],
		activeDialogue: null,
		rumors: [],
		knownLanguages: [],
		landmarks: [],
		heardStories: [],
		stats: { enemiesKilled: 0, bossesKilled: 0, secretsFound: 0, trapsDisarmed: 0, chestsOpened: 0, levelsCleared: 0, npcsSpokenTo: 0, landmarksExamined: 0, damageDealt: 0, damageTaken: 0, maxDungeonLevel: 0 },
		unlockedAchievements: [],
		...overrides
	};
}

describe('HAZARD_DEFS', () => {
	it('defines lava and poison_gas', () => {
		const types = HAZARD_DEFS.map((d) => d.type);
		expect(types).toContain('lava');
		expect(types).toContain('poison_gas');
	});

	it('all have chars, colors, and names', () => {
		for (const def of HAZARD_DEFS) {
			expect(def.char.length).toBe(1);
			expect(def.color.length).toBeGreaterThan(0);
			expect(def.name.length).toBeGreaterThan(0);
		}
	});
});

describe('hazardName / hazardChar / hazardColor', () => {
	it('returns correct name for lava', () => {
		expect(hazardName('lava')).toBe('Lava Pool');
	});

	it('returns correct char for lava', () => {
		expect(hazardChar('lava')).toBe('~');
	});

	it('returns correct char for poison_gas', () => {
		expect(hazardChar('poison_gas')).toBe('%');
	});

	it('returns a color string', () => {
		expect(hazardColor('lava')).toMatch(/^#/);
		expect(hazardColor('poison_gas')).toMatch(/^#/);
	});
});

describe('placeHazards', () => {
	it('returns no hazards on level 1 (below min level for all)', () => {
		const state = makeTestState();
		const hazards = placeHazards(state.map, 1);
		expect(hazards).toHaveLength(0);
	});

	it('places hazards on level 3+', () => {
		const state = makeTestState();
		const hazards = placeHazards(state.map, 5);
		expect(hazards.length).toBeGreaterThan(0);
	});

	it('places hazards on floor tiles only', () => {
		const state = makeTestState();
		state.map.tiles[0][0] = '#';
		state.map.tiles[1][1] = '#';
		const hazards = placeHazards(state.map, 5);
		for (const h of hazards) {
			expect(state.map.tiles[h.pos.y][h.pos.x]).toBe('.');
		}
	});

	it('does not place duplicate hazards at same position', () => {
		const state = makeTestState();
		const hazards = placeHazards(state.map, 10);
		const keys = hazards.map((h) => `${h.pos.x},${h.pos.y}`);
		expect(new Set(keys).size).toBe(keys.length);
	});

	it('places more hazards at higher levels', () => {
		const state = makeTestState();
		const h3 = placeHazards(state.map, 3);
		const h10 = placeHazards(state.map, 10);
		expect(h10.length).toBeGreaterThanOrEqual(h3.length);
	});
});

describe('getHazardAt', () => {
	it('finds hazard at given position', () => {
		const hazard: Hazard = { pos: { x: 3, y: 4 }, type: 'lava' };
		expect(getHazardAt([hazard], 3, 4)).toBe(hazard);
	});

	it('returns undefined for empty position', () => {
		expect(getHazardAt([], 3, 4)).toBeUndefined();
	});

	it('returns undefined for wrong position', () => {
		const hazard: Hazard = { pos: { x: 3, y: 4 }, type: 'lava' };
		expect(getHazardAt([hazard], 5, 5)).toBeUndefined();
	});
});

describe('applyHazardToEntity', () => {
	it('lava deals fire damage', () => {
		const entity = makeEnemy(3, 4);
		const hazard: Hazard = { pos: { x: 3, y: 4 }, type: 'lava' };
		const effect = applyHazardToEntity(hazard, entity, 1);
		expect(entity.hp).toBeLessThan(20);
		expect(effect).not.toBeNull();
		expect(effect!.text).toContain('burns');
		expect(effect!.text).toContain('lava');
	});

	it('lava damage scales with level', () => {
		const e1 = makeEnemy(0, 0);
		const e5 = makeEnemy(0, 0);
		const hazard: Hazard = { pos: { x: 0, y: 0 }, type: 'lava' };
		applyHazardToEntity(hazard, e1, 1);
		applyHazardToEntity(hazard, e5, 5);
		expect(e5.hp).toBeLessThan(e1.hp);
	});

	it('poison gas applies poison effect', () => {
		const entity = makeEnemy(3, 4);
		const hazard: Hazard = { pos: { x: 3, y: 4 }, type: 'poison_gas' };
		const effect = applyHazardToEntity(hazard, entity, 1);
		expect(entity.statusEffects.some((e) => e.type === 'poison')).toBe(true);
		expect(effect).not.toBeNull();
		expect(effect!.text).toContain('poison gas');
	});
});

describe('applyHazards', () => {
	it('damages player standing on lava', () => {
		const state = makeTestState({
			hazards: [{ pos: { x: 5, y: 5 }, type: 'lava' }]
		});
		const effects = applyHazards(state);
		expect(state.player.hp).toBeLessThan(20);
		expect(effects.length).toBeGreaterThan(0);
		expect(effects[0].text).toContain('Hero');
	});

	it('damages enemy standing on lava', () => {
		const enemy = makeEnemy(3, 3);
		const state = makeTestState({
			enemies: [enemy],
			hazards: [{ pos: { x: 3, y: 3 }, type: 'lava' }]
		});
		const effects = applyHazards(state);
		expect(enemy.hp).toBeLessThan(20);
		expect(effects.some((e) => e.text.includes('Goblin'))).toBe(true);
	});

	it('does not affect entities not on hazards', () => {
		const enemy = makeEnemy(7, 7);
		const state = makeTestState({
			enemies: [enemy],
			hazards: [{ pos: { x: 1, y: 1 }, type: 'lava' }]
		});
		applyHazards(state);
		expect(state.player.hp).toBe(20);
		expect(enemy.hp).toBe(20);
	});

	it('applies poison to enemy on poison gas', () => {
		const enemy = makeEnemy(2, 2);
		const state = makeTestState({
			enemies: [enemy],
			hazards: [{ pos: { x: 2, y: 2 }, type: 'poison_gas' }]
		});
		applyHazards(state);
		expect(enemy.statusEffects.some((e) => e.type === 'poison')).toBe(true);
	});

	it('affects multiple entities on different hazards', () => {
		const enemy = makeEnemy(3, 3);
		const state = makeTestState({
			enemies: [enemy],
			hazards: [
				{ pos: { x: 5, y: 5 }, type: 'lava' },
				{ pos: { x: 3, y: 3 }, type: 'lava' }
			]
		});
		const effects = applyHazards(state);
		expect(state.player.hp).toBeLessThan(20);
		expect(enemy.hp).toBeLessThan(20);
		expect(effects).toHaveLength(2);
	});

	it('enemy hazard effects use player_attack message type', () => {
		const enemy = makeEnemy(3, 3);
		const state = makeTestState({
			enemies: [enemy],
			hazards: [{ pos: { x: 3, y: 3 }, type: 'lava' }]
		});
		const effects = applyHazards(state);
		const enemyEffect = effects.find((e) => e.text.includes('Goblin'));
		expect(enemyEffect).toBeDefined();
		expect(enemyEffect!.type).toBe('player_attack');
	});
});
