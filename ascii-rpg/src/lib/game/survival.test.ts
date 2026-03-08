import { describe, it, expect } from 'vitest';
import {
	getHungerStage,
	getThirstStage,
	tickSurvival,
	getDehydrationPenalty,
	restoreHunger,
	restoreThirst,
	MAX_SURVIVAL,
	HUNGRY_THRESHOLD,
	STARVING_THRESHOLD,
	THIRSTY_THRESHOLD,
	DEHYDRATED_THRESHOLD,
	HUNGER_DRAIN_PER_TURN,
	THIRST_DRAIN_PER_TURN,
	STARVING_HP_LOSS,
	DEHYDRATED_ATK_PENALTY
} from './survival';
import type { GameState } from './types';
import { Visibility } from './types';

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
		characterConfig: { name: 'Hero', characterClass: 'warrior' as const, difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' },
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
		lieCount: 0,
		bestiary: {},
		hunger: MAX_SURVIVAL,
		thirst: MAX_SURVIVAL,
		survivalEnabled: true,
		turnCount: 0,
		locationMode: 'location' as const,
		worldMap: null,
		overworldPos: null,
		currentLocationId: null,
		waypoint: null,
		inventory: Array.from({ length: 12 }, () => null),
		equipment: { head: null, body: null, trouser: null, leftHand: null, rightHand: null, back: null, leftFoot: null, rightFoot: null },
		containers: [],
		activeBookReading: null,
		inventoryOpen: false,
		activeContainer: null,
		inventoryCursor: 0,
		inventoryPanel: 'inventory' as const,
		locationCache: {},
		...overrides
	};
}

describe('getHungerStage', () => {
	it('returns satisfied when above hungry threshold', () => {
		expect(getHungerStage(51)).toBe('satisfied');
		expect(getHungerStage(100)).toBe('satisfied');
	});

	it('returns hungry between thresholds', () => {
		expect(getHungerStage(HUNGRY_THRESHOLD)).toBe('hungry');
		expect(getHungerStage(STARVING_THRESHOLD + 1)).toBe('hungry');
	});

	it('returns starving at or below starving threshold', () => {
		expect(getHungerStage(STARVING_THRESHOLD)).toBe('starving');
		expect(getHungerStage(0)).toBe('starving');
	});
});

describe('getThirstStage', () => {
	it('returns hydrated when above thirsty threshold', () => {
		expect(getThirstStage(51)).toBe('hydrated');
		expect(getThirstStage(100)).toBe('hydrated');
	});

	it('returns thirsty between thresholds', () => {
		expect(getThirstStage(THIRSTY_THRESHOLD)).toBe('thirsty');
		expect(getThirstStage(DEHYDRATED_THRESHOLD + 1)).toBe('thirsty');
	});

	it('returns dehydrated at or below dehydrated threshold', () => {
		expect(getThirstStage(DEHYDRATED_THRESHOLD)).toBe('dehydrated');
		expect(getThirstStage(0)).toBe('dehydrated');
	});
});

describe('tickSurvival', () => {
	it('decreases hunger and thirst each turn', () => {
		const state = makeTestState();
		tickSurvival(state);
		expect(state.hunger).toBe(MAX_SURVIVAL - HUNGER_DRAIN_PER_TURN);
		expect(state.thirst).toBe(MAX_SURVIVAL - THIRST_DRAIN_PER_TURN);
	});

	it('does not go below 0', () => {
		const state = makeTestState({ hunger: 0.5, thirst: 0.5 });
		tickSurvival(state);
		expect(state.hunger).toBe(0);
		expect(state.thirst).toBe(0);
	});

	it('notifies on transition to hungry', () => {
		const state = makeTestState({ hunger: HUNGRY_THRESHOLD + HUNGER_DRAIN_PER_TURN });
		const result = tickSurvival(state);
		expect(result.messages.some(m => m.text.includes('hungry'))).toBe(true);
	});

	it('notifies on transition to starving', () => {
		const state = makeTestState({ hunger: STARVING_THRESHOLD + HUNGER_DRAIN_PER_TURN });
		const result = tickSurvival(state);
		expect(result.messages.some(m => m.text.includes('starving'))).toBe(true);
	});

	it('notifies on transition to thirsty', () => {
		const state = makeTestState({ thirst: THIRSTY_THRESHOLD + THIRST_DRAIN_PER_TURN });
		const result = tickSurvival(state);
		expect(result.messages.some(m => m.text.includes('thirsty'))).toBe(true);
	});

	it('notifies on transition to dehydrated', () => {
		const state = makeTestState({ thirst: DEHYDRATED_THRESHOLD + THIRST_DRAIN_PER_TURN });
		const result = tickSurvival(state);
		expect(result.messages.some(m => m.text.includes('dehydrated'))).toBe(true);
	});

	it('deals HP damage when starving', () => {
		const state = makeTestState({ hunger: 10 });
		state.player.hp = 15;
		const result = tickSurvival(state);
		expect(result.hpLoss).toBe(STARVING_HP_LOSS);
		expect(state.player.hp).toBe(15 - STARVING_HP_LOSS);
	});

	it('starving damage does not reduce HP below 1', () => {
		const state = makeTestState({ hunger: 5 });
		state.player.hp = 1;
		tickSurvival(state);
		expect(state.player.hp).toBe(1);
	});

	it('does nothing when survival is disabled', () => {
		const state = makeTestState({ survivalEnabled: false });
		const result = tickSurvival(state);
		expect(state.hunger).toBe(MAX_SURVIVAL);
		expect(state.thirst).toBe(MAX_SURVIVAL);
		expect(result.messages).toHaveLength(0);
		expect(result.hpLoss).toBe(0);
	});

	it('no messages when staying in same stage', () => {
		const state = makeTestState({ hunger: 80, thirst: 80 });
		const result = tickSurvival(state);
		expect(result.messages).toHaveLength(0);
	});
});

describe('getDehydrationPenalty', () => {
	it('returns penalty when dehydrated', () => {
		const state = makeTestState({ thirst: 10 });
		expect(getDehydrationPenalty(state)).toBe(DEHYDRATED_ATK_PENALTY);
	});

	it('returns 0 when thirsty but not dehydrated', () => {
		const state = makeTestState({ thirst: 30 });
		expect(getDehydrationPenalty(state)).toBe(0);
	});

	it('returns 0 when hydrated', () => {
		const state = makeTestState({ thirst: 80 });
		expect(getDehydrationPenalty(state)).toBe(0);
	});

	it('returns 0 when survival is disabled', () => {
		const state = makeTestState({ thirst: 5, survivalEnabled: false });
		expect(getDehydrationPenalty(state)).toBe(0);
	});
});

describe('restoreHunger', () => {
	it('restores hunger by given amount', () => {
		const state = makeTestState({ hunger: 50 });
		const msg = restoreHunger(state, 30);
		expect(state.hunger).toBe(80);
		expect(msg.text).toContain('30');
		expect(msg.type).toBe('healing');
	});

	it('caps at MAX_SURVIVAL', () => {
		const state = makeTestState({ hunger: 90 });
		const msg = restoreHunger(state, 50);
		expect(state.hunger).toBe(MAX_SURVIVAL);
		expect(msg.text).toContain('10');
	});

	it('does nothing when survival is disabled', () => {
		const state = makeTestState({ hunger: 50, survivalEnabled: false });
		restoreHunger(state, 30);
		expect(state.hunger).toBe(50);
	});
});

describe('restoreThirst', () => {
	it('restores thirst by given amount', () => {
		const state = makeTestState({ thirst: 40 });
		const msg = restoreThirst(state, 25);
		expect(state.thirst).toBe(65);
		expect(msg.text).toContain('25');
		expect(msg.type).toBe('healing');
	});

	it('caps at MAX_SURVIVAL', () => {
		const state = makeTestState({ thirst: 95 });
		const msg = restoreThirst(state, 20);
		expect(state.thirst).toBe(MAX_SURVIVAL);
		expect(msg.text).toContain('5');
	});

	it('does nothing when survival is disabled', () => {
		const state = makeTestState({ thirst: 40, survivalEnabled: false });
		restoreThirst(state, 25);
		expect(state.thirst).toBe(40);
	});
});

describe('survival over many turns', () => {
	it('hunger drains to 0 over enough turns', () => {
		const state = makeTestState();
		const turnsToStarve = Math.ceil(MAX_SURVIVAL / HUNGER_DRAIN_PER_TURN);
		for (let i = 0; i < turnsToStarve; i++) {
			tickSurvival(state);
		}
		expect(state.hunger).toBe(0);
	});

	it('thirst drains to 0 over enough turns', () => {
		const state = makeTestState();
		const turnsToDry = Math.ceil(MAX_SURVIVAL / THIRST_DRAIN_PER_TURN);
		for (let i = 0; i < turnsToDry; i++) {
			tickSurvival(state);
		}
		expect(state.thirst).toBe(0);
	});

	it('thirst drains faster than hunger', () => {
		const state = makeTestState();
		for (let i = 0; i < 20; i++) {
			tickSurvival(state);
		}
		expect(state.thirst).toBeLessThan(state.hunger);
	});
});
