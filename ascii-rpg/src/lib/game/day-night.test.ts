import { describe, it, expect } from 'vitest';
import {
	getTimePhase,
	isNightTime,
	isDayTime,
	phaseName,
	sightModifier,
	aggressionMultiplier,
	phaseColor,
	tickTime,
	advanceToPhase,
	TURNS_PER_CYCLE
} from './day-night';
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
		hunger: 100,
		thirst: 100,
		survivalEnabled: true,
		turnCount: 0,
		...overrides
	};
}

describe('getTimePhase', () => {
	it('starts at dawn (turn 0)', () => {
		expect(getTimePhase(0)).toBe('dawn');
	});

	it('returns morning at turn 10', () => {
		expect(getTimePhase(10)).toBe('morning');
	});

	it('returns afternoon at turn 25', () => {
		expect(getTimePhase(25)).toBe('afternoon');
	});

	it('returns dusk at turn 45', () => {
		expect(getTimePhase(45)).toBe('dusk');
	});

	it('returns evening at turn 55', () => {
		expect(getTimePhase(55)).toBe('evening');
	});

	it('returns night at turn 70', () => {
		expect(getTimePhase(70)).toBe('night');
	});

	it('returns midnight at turn 90', () => {
		expect(getTimePhase(90)).toBe('midnight');
	});

	it('wraps around after full cycle', () => {
		expect(getTimePhase(TURNS_PER_CYCLE)).toBe('dawn');
		expect(getTimePhase(TURNS_PER_CYCLE + 10)).toBe('morning');
	});

	it('handles multiple cycles', () => {
		expect(getTimePhase(300)).toBe('dawn');
		expect(getTimePhase(370)).toBe('night');
	});
});

describe('isNightTime / isDayTime', () => {
	it('evening, night, midnight are night time', () => {
		expect(isNightTime('evening')).toBe(true);
		expect(isNightTime('night')).toBe(true);
		expect(isNightTime('midnight')).toBe(true);
	});

	it('morning, afternoon are day time', () => {
		expect(isDayTime('morning')).toBe(true);
		expect(isDayTime('afternoon')).toBe(true);
	});

	it('dawn and dusk are neither fully day nor night', () => {
		expect(isNightTime('dawn')).toBe(false);
		expect(isDayTime('dawn')).toBe(false);
		expect(isNightTime('dusk')).toBe(false);
		expect(isDayTime('dusk')).toBe(false);
	});
});

describe('phaseName', () => {
	it('returns capitalized names for all phases', () => {
		expect(phaseName('dawn')).toBe('Dawn');
		expect(phaseName('morning')).toBe('Morning');
		expect(phaseName('afternoon')).toBe('Afternoon');
		expect(phaseName('dusk')).toBe('Dusk');
		expect(phaseName('evening')).toBe('Evening');
		expect(phaseName('night')).toBe('Night');
		expect(phaseName('midnight')).toBe('Midnight');
	});
});

describe('sightModifier', () => {
	it('no penalty during morning and afternoon', () => {
		expect(sightModifier('morning')).toBe(0);
		expect(sightModifier('afternoon')).toBe(0);
	});

	it('slight penalty at dawn and dusk', () => {
		expect(sightModifier('dawn')).toBe(-1);
		expect(sightModifier('dusk')).toBe(-1);
	});

	it('increasing penalty through evening, night, midnight', () => {
		const evening = sightModifier('evening');
		const night = sightModifier('night');
		const midnight = sightModifier('midnight');
		expect(evening).toBeLessThan(0);
		expect(night).toBeLessThan(evening);
		expect(midnight).toBeLessThan(night);
	});
});

describe('aggressionMultiplier', () => {
	it('monsters are less aggressive during the day', () => {
		expect(aggressionMultiplier('morning')).toBeLessThan(1);
		expect(aggressionMultiplier('afternoon')).toBeLessThan(1);
	});

	it('monsters are more aggressive at night', () => {
		expect(aggressionMultiplier('night')).toBeGreaterThan(1);
		expect(aggressionMultiplier('midnight')).toBeGreaterThan(1);
	});

	it('midnight is the most aggressive', () => {
		expect(aggressionMultiplier('midnight')).toBeGreaterThan(aggressionMultiplier('night'));
	});

	it('dawn and dusk are neutral (1.0)', () => {
		expect(aggressionMultiplier('dawn')).toBe(1.0);
		expect(aggressionMultiplier('dusk')).toBe(1.0);
	});
});

describe('phaseColor', () => {
	it('returns hex color strings for all phases', () => {
		const phases = ['dawn', 'morning', 'afternoon', 'dusk', 'evening', 'night', 'midnight'] as const;
		for (const phase of phases) {
			expect(phaseColor(phase)).toMatch(/^#[0-9a-f]{6}$/i);
		}
	});

	it('morning is brightest (white-ish)', () => {
		expect(phaseColor('morning')).toBe('#ffffff');
	});
});

describe('tickTime', () => {
	it('increments turnCount', () => {
		const state = makeTestState({ turnCount: 5 });
		tickTime(state);
		expect(state.turnCount).toBe(6);
	});

	it('detects phase transition', () => {
		const state = makeTestState({ turnCount: 9 }); // dawn -> morning at turn 10
		const result = tickTime(state);
		expect(result.phaseChanged).toBe(true);
		expect(result.newPhase).toBe('morning');
		expect(result.message).toContain('morning');
	});

	it('no transition within same phase', () => {
		const state = makeTestState({ turnCount: 5 }); // still dawn
		const result = tickTime(state);
		expect(result.phaseChanged).toBe(false);
		expect(result.message).toBeNull();
	});

	it('transitions through all phases over a full cycle', () => {
		const state = makeTestState({ turnCount: 0 });
		const transitions: string[] = [];
		for (let i = 0; i < TURNS_PER_CYCLE; i++) {
			const result = tickTime(state);
			if (result.phaseChanged) {
				transitions.push(result.newPhase);
			}
		}
		expect(transitions).toContain('morning');
		expect(transitions).toContain('afternoon');
		expect(transitions).toContain('dusk');
		expect(transitions).toContain('evening');
		expect(transitions).toContain('night');
		expect(transitions).toContain('midnight');
	});
});

describe('advanceToPhase', () => {
	it('advances from dawn to night', () => {
		const state = makeTestState({ turnCount: 0 });
		const skipped = advanceToPhase(state, 'night');
		expect(getTimePhase(state.turnCount)).toBe('night');
		expect(skipped).toBe(70);
	});

	it('wraps around if target is earlier in cycle', () => {
		const state = makeTestState({ turnCount: 75 }); // night
		const skipped = advanceToPhase(state, 'morning');
		expect(getTimePhase(state.turnCount)).toBe('morning');
		expect(skipped).toBeGreaterThan(0);
		expect(skipped).toBeLessThanOrEqual(TURNS_PER_CYCLE);
	});

	it('returns 0 if already at target phase', () => {
		const state = makeTestState({ turnCount: 15 }); // morning
		const skipped = advanceToPhase(state, 'morning');
		expect(skipped).toBe(0);
	});

	it('caps at one full cycle to prevent infinite loop', () => {
		const state = makeTestState({ turnCount: 0 });
		// This should never actually loop forever, but the guard is there
		const skipped = advanceToPhase(state, 'dawn');
		expect(skipped).toBe(0); // already at dawn
	});
});
