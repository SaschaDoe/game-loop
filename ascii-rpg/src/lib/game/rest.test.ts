import { describe, it, expect } from 'vitest';
import { enemiesNearby, shortRest, longRest } from './rest';
import type { GameState, Entity } from './types';
import { Visibility } from './types';

function makeEnemy(x: number, y: number, overrides?: Partial<Entity>): Entity {
	return {
		pos: { x, y },
		char: 'G',
		color: '#0f0',
		name: 'Goblin',
		hp: 5,
		maxHp: 5,
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
		stats: { enemiesKilled: 0, bossesKilled: 0, secretsFound: 0, trapsDisarmed: 0, chestsOpened: 0, levelsCleared: 0, npcsSpokenTo: 0, landmarksExamined: 0, damageDealt: 0, damageTaken: 0, maxDungeonLevel: 0, stealthKills: 0, backstabs: 0, questsCompleted: 0, questsFailed: 0 },
		unlockedAchievements: [],
		lieCount: 0,
		bestiary: {},
		hunger: 100,
		thirst: 100,
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
		quests: [],
		completedQuestIds: [],
		failedQuestIds: [],
		stealth: { isHidden: false, noiseLevel: 0, lastNoisePos: null, backstabReady: false },
		academyState: null,
		playerTitles: [],
		learnedSpells: [],
		spellCooldowns: {},
		quickCastSlots: [null, null, null, null],
		manaRegenBaseCounter: 0,
		manaRegenIntCounter: 0,
		spellMenuOpen: false,
		spellMenuCursor: 0,
		pendingAttributePoint: false,
		spellTargeting: null,
		schoolMastery: {},
		forbiddenCosts: { corruption: 0, paradoxBaseline: 0, maxHpLost: 0, sanityLost: 0, soulCapLost: 0 },
		leyLineLevel: 0,
		learnedRituals: [],
		ritualChanneling: null,
		activeWards: [],
		teleportAnchors: {},
		activeSummon: null,
		scriedLevel: null,
		terrainEffects: [],
		specialization: null,
		pendingSpecialization: false,
		forbiddenPassives: [],
		...overrides
	};
}

describe('enemiesNearby', () => {
	it('returns false when no enemies exist', () => {
		const state = makeTestState();
		expect(enemiesNearby(state)).toBe(false);
	});

	it('returns true when enemy is within 5 Manhattan distance', () => {
		const state = makeTestState({ enemies: [makeEnemy(8, 5)] }); // distance = 3
		expect(enemiesNearby(state)).toBe(true);
	});

	it('returns true when enemy is exactly at distance 5', () => {
		const state = makeTestState({ enemies: [makeEnemy(8, 7)] }); // |3|+|2| = 5
		expect(enemiesNearby(state)).toBe(true);
	});

	it('returns false when enemy is beyond radius 5', () => {
		const state = makeTestState({ enemies: [makeEnemy(0, 0)] }); // |5|+|5| = 10
		expect(enemiesNearby(state)).toBe(false);
	});

	it('returns true if any enemy is nearby even if others are far', () => {
		const state = makeTestState({
			enemies: [makeEnemy(0, 0), makeEnemy(6, 5)] // far, near (distance=1)
		});
		expect(enemiesNearby(state)).toBe(true);
	});
});

describe('shortRest', () => {
	it('restores 25% of maxHp', () => {
		const state = makeTestState();
		state.player.hp = 10;
		state.player.maxHp = 20;
		const result = shortRest(state);
		expect(result.rested).toBe(true);
		expect(result.hpRestored).toBe(5); // floor(20 * 0.25) = 5
		expect(result.messages[0].type).toBe('healing');
	});

	it('restores at least 1 HP', () => {
		const state = makeTestState();
		state.player.hp = 2;
		state.player.maxHp = 3; // floor(3 * 0.25) = 0, clamped to 1
		const result = shortRest(state);
		expect(result.rested).toBe(true);
		expect(result.hpRestored).toBe(1);
	});

	it('does not exceed maxHp', () => {
		const state = makeTestState();
		state.player.hp = 19;
		state.player.maxHp = 20; // would heal 5, but only 1 missing
		const result = shortRest(state);
		expect(result.rested).toBe(true);
		expect(result.hpRestored).toBe(1);
	});

	it('fails when enemies are nearby', () => {
		const state = makeTestState({ enemies: [makeEnemy(6, 5)] });
		state.player.hp = 10;
		const result = shortRest(state);
		expect(result.rested).toBe(false);
		expect(result.hpRestored).toBe(0);
		expect(result.messages[0].type).toBe('damage_taken');
	});

	it('fails when already at full health', () => {
		const state = makeTestState();
		state.player.hp = 20;
		state.player.maxHp = 20;
		const result = shortRest(state);
		expect(result.rested).toBe(false);
		expect(result.messages[0].type).toBe('info');
	});

	it('never triggers ambush', () => {
		const state = makeTestState();
		state.player.hp = 10;
		const result = shortRest(state);
		expect(result.ambush).toBe(false);
	});

	it('message includes HP amount', () => {
		const state = makeTestState();
		state.player.hp = 10;
		state.player.maxHp = 20;
		const result = shortRest(state);
		expect(result.messages[0].text).toContain('5 HP');
	});
});

describe('longRest', () => {
	it('restores full HP', () => {
		const state = makeTestState();
		state.player.hp = 5;
		state.player.maxHp = 20;
		const orig = Math.random;
		Math.random = () => 0.9; // no ambush
		try {
			const result = longRest(state);
			expect(result.rested).toBe(true);
			expect(result.hpRestored).toBe(15);
		} finally {
			Math.random = orig;
		}
	});

	it('fails when enemies are nearby', () => {
		const state = makeTestState({ enemies: [makeEnemy(6, 5)] });
		state.player.hp = 10;
		const result = longRest(state);
		expect(result.rested).toBe(false);
		expect(result.hpRestored).toBe(0);
	});

	it('fails when already at full health', () => {
		const state = makeTestState();
		const result = longRest(state);
		expect(result.rested).toBe(false);
	});

	it('triggers ambush when random < 0.3', () => {
		const state = makeTestState();
		state.player.hp = 10;
		const orig = Math.random;
		Math.random = () => 0.1;
		try {
			const result = longRest(state);
			expect(result.rested).toBe(true);
			expect(result.ambush).toBe(true);
			expect(result.messages).toHaveLength(2);
			expect(result.messages[1].text).toContain('ambushed');
		} finally {
			Math.random = orig;
		}
	});

	it('no ambush when random >= 0.3', () => {
		const state = makeTestState();
		state.player.hp = 10;
		const orig = Math.random;
		Math.random = () => 0.5;
		try {
			const result = longRest(state);
			expect(result.rested).toBe(true);
			expect(result.ambush).toBe(false);
			expect(result.messages).toHaveLength(1);
		} finally {
			Math.random = orig;
		}
	});

	it('message includes HP amount', () => {
		const state = makeTestState();
		state.player.hp = 5;
		state.player.maxHp = 20;
		const orig = Math.random;
		Math.random = () => 0.9;
		try {
			const result = longRest(state);
			expect(result.messages[0].text).toContain('15 HP');
		} finally {
			Math.random = orig;
		}
	});
});
