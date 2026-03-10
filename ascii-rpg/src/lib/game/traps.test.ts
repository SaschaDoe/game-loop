import { describe, it, expect } from 'vitest';
import { pickTrapType, trapName, createTrap, placeTraps, getTrapAt, detectAdjacentTraps, triggerTrap, disarmTrap, searchForTraps, DISARM_CHANCE } from './traps';
import type { GameState, Trap } from './types';
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
		spellTargeting: null,
		schoolMastery: {},
		forbiddenCosts: { corruption: 0, paradoxBaseline: 0, maxHpLost: 0, sanityLost: 0, soulCapLost: 0 },
		leyLineLevel: 0,
		trueSightActive: 0,
		revealedLeyLineTiles: new Set(),
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

describe('pickTrapType', () => {
	it('returns a valid trap type', () => {
		for (let i = 0; i < 20; i++) {
			const type = pickTrapType();
			expect(['spike', 'poison_dart', 'alarm', 'teleport']).toContain(type);
		}
	});
});

describe('trapName', () => {
	it('returns human-readable names', () => {
		expect(trapName('spike')).toBe('Spike Trap');
		expect(trapName('poison_dart')).toBe('Poison Dart Trap');
		expect(trapName('alarm')).toBe('Alarm Trap');
		expect(trapName('teleport')).toBe('Teleport Trap');
	});
});

describe('createTrap', () => {
	it('creates an untriggered trap at position', () => {
		const trap = createTrap({ x: 3, y: 4 }, 'spike');
		expect(trap.pos).toEqual({ x: 3, y: 4 });
		expect(trap.type).toBe('spike');
		expect(trap.triggered).toBe(false);
	});
});

describe('placeTraps', () => {
	it('places traps on floor tiles', () => {
		const state = makeTestState();
		const traps = placeTraps(state.map, 1);
		expect(traps.length).toBeGreaterThanOrEqual(1);
		for (const trap of traps) {
			expect(state.map.tiles[trap.pos.y][trap.pos.x]).toBe('.');
		}
	});

	it('places more traps at higher levels', () => {
		const state = makeTestState();
		const trapsL1 = placeTraps(state.map, 1);
		const trapsL10 = placeTraps(state.map, 10);
		expect(trapsL10.length).toBeGreaterThanOrEqual(trapsL1.length);
	});

	it('does not place duplicate traps at same position', () => {
		const state = makeTestState();
		const traps = placeTraps(state.map, 5);
		const keys = traps.map((t) => `${t.pos.x},${t.pos.y}`);
		expect(new Set(keys).size).toBe(keys.length);
	});
});

describe('getTrapAt', () => {
	it('finds a trap at given position', () => {
		const trap = createTrap({ x: 3, y: 3 }, 'spike');
		const state = makeTestState({ traps: [trap] });
		expect(getTrapAt(state, 3, 3)).toBe(trap);
	});

	it('returns undefined for empty position', () => {
		const state = makeTestState({ traps: [] });
		expect(getTrapAt(state, 3, 3)).toBeUndefined();
	});

	it('ignores triggered traps', () => {
		const trap = createTrap({ x: 3, y: 3 }, 'spike');
		trap.triggered = true;
		const state = makeTestState({ traps: [trap] });
		expect(getTrapAt(state, 3, 3)).toBeUndefined();
	});
});

describe('detectAdjacentTraps', () => {
	it('detects trap adjacent to player', () => {
		const trap = createTrap({ x: 6, y: 5 }, 'spike');
		const state = makeTestState({ traps: [trap] });
		const messages = detectAdjacentTraps(state);
		expect(state.detectedTraps.has('6,5')).toBe(true);
		expect(messages.length).toBe(1);
		expect(messages[0]).toContain('Spike Trap');
	});

	it('does not detect traps far from player', () => {
		const trap = createTrap({ x: 9, y: 9 }, 'spike');
		const state = makeTestState({ traps: [trap] });
		const messages = detectAdjacentTraps(state);
		expect(state.detectedTraps.has('9,9')).toBe(false);
		expect(messages).toHaveLength(0);
	});

	it('detects diagonal traps', () => {
		const trap = createTrap({ x: 6, y: 6 }, 'alarm');
		const state = makeTestState({ traps: [trap] });
		const messages = detectAdjacentTraps(state);
		expect(state.detectedTraps.has('6,6')).toBe(true);
		expect(messages[0]).toContain('Alarm Trap');
	});

	it('does not re-detect already detected traps', () => {
		const trap = createTrap({ x: 6, y: 5 }, 'spike');
		const state = makeTestState({ traps: [trap] });
		state.detectedTraps.add('6,5');
		const messages = detectAdjacentTraps(state);
		expect(messages).toHaveLength(0);
	});
});

describe('triggerTrap', () => {
	it('spike trap deals damage', () => {
		const trap = createTrap({ x: 5, y: 5 }, 'spike');
		const state = makeTestState({ traps: [trap] });
		const result = triggerTrap(state, trap);
		expect(trap.triggered).toBe(true);
		expect(state.player.hp).toBeLessThan(20);
		expect(result.messages[0]).toContain('Spike Trap');
		expect(result.messages[0]).toContain('damage');
	});

	it('poison dart trap deals damage and applies poison', () => {
		const trap = createTrap({ x: 5, y: 5 }, 'poison_dart');
		const state = makeTestState({ traps: [trap] });
		const result = triggerTrap(state, trap);
		expect(trap.triggered).toBe(true);
		expect(state.player.hp).toBeLessThan(20);
		expect(state.player.statusEffects.some((e) => e.type === 'poison')).toBe(true);
		expect(result.messages[0]).toContain('poisoned');
	});

	it('alarm trap alerts enemies', () => {
		const enemy = {
			pos: { x: 1, y: 1 },
			char: 'G',
			color: '#0f0',
			name: 'Goblin',
			hp: 5,
			maxHp: 5,
			attack: 2,
			statusEffects: []
		};
		const trap = createTrap({ x: 5, y: 5 }, 'alarm');
		const state = makeTestState({ traps: [trap], enemies: [enemy] });
		const origX = enemy.pos.x;
		const origY = enemy.pos.y;
		const result = triggerTrap(state, trap);
		expect(trap.triggered).toBe(true);
		// Enemy should have moved closer to player
		const newDist = Math.abs(enemy.pos.x - 5) + Math.abs(enemy.pos.y - 5);
		const oldDist = Math.abs(origX - 5) + Math.abs(origY - 5);
		expect(newDist).toBeLessThan(oldDist);
		expect(result.messages[0]).toContain('Alarm');
	});

	it('teleport trap moves player to a new position', () => {
		const trap = createTrap({ x: 5, y: 5 }, 'teleport');
		const state = makeTestState({ traps: [trap] });
		const result = triggerTrap(state, trap);
		expect(trap.triggered).toBe(true);
		expect(result.teleportPos).toBeDefined();
		expect(result.messages[0]).toContain('teleported');
	});

	it('spike damage scales with dungeon level', () => {
		const trap1 = createTrap({ x: 5, y: 5 }, 'spike');
		const state1 = makeTestState({ traps: [trap1], level: 1 });
		triggerTrap(state1, trap1);
		const dmg1 = 20 - state1.player.hp;

		const trap5 = createTrap({ x: 5, y: 5 }, 'spike');
		const state5 = makeTestState({ traps: [trap5], level: 5 });
		triggerTrap(state5, trap5);
		const dmg5 = 20 - state5.player.hp;

		expect(dmg5).toBeGreaterThan(dmg1);
	});
});

describe('DISARM_CHANCE', () => {
	it('rogue has highest disarm chance', () => {
		expect(DISARM_CHANCE.rogue).toBeGreaterThan(DISARM_CHANCE.warrior);
		expect(DISARM_CHANCE.rogue).toBeGreaterThan(DISARM_CHANCE.mage);
	});

	it('all classes have a chance between 0 and 1', () => {
		for (const cls of ['rogue', 'warrior', 'mage'] as const) {
			expect(DISARM_CHANCE[cls]).toBeGreaterThan(0);
			expect(DISARM_CHANCE[cls]).toBeLessThanOrEqual(1);
		}
	});
});

describe('disarmTrap', () => {
	it('successful disarm marks trap as triggered and returns success', () => {
		const trap = createTrap({ x: 5, y: 5 }, 'spike');
		const state = makeTestState({ traps: [trap] });
		const orig = Math.random;
		Math.random = () => 0.01; // Always succeed
		try {
			const result = disarmTrap(state, trap, 'warrior');
			expect(result.success).toBe(true);
			expect(trap.triggered).toBe(true);
			expect(result.messages[0]).toContain('disarm');
			expect(state.player.hp).toBe(20); // No damage taken
		} finally {
			Math.random = orig;
		}
	});

	it('failed disarm triggers the trap', () => {
		const trap = createTrap({ x: 5, y: 5 }, 'spike');
		const state = makeTestState({ traps: [trap], level: 1 });
		const orig = Math.random;
		Math.random = () => 0.99; // Always fail
		try {
			const result = disarmTrap(state, trap, 'rogue');
			expect(result.success).toBe(false);
			expect(trap.triggered).toBe(true);
			expect(state.player.hp).toBeLessThan(20);
			expect(result.messages.some((m) => m.includes('fail'))).toBe(true);
			expect(result.triggerResult).toBeDefined();
		} finally {
			Math.random = orig;
		}
	});

	it('rogue succeeds more often than mage', () => {
		let rogueSuccesses = 0;
		let mageSuccesses = 0;
		for (let i = 0; i < 200; i++) {
			const trap1 = createTrap({ x: 5, y: 5 }, 'spike');
			const state1 = makeTestState({ traps: [trap1] });
			if (disarmTrap(state1, trap1, 'rogue').success) rogueSuccesses++;

			const trap2 = createTrap({ x: 5, y: 5 }, 'spike');
			const state2 = makeTestState({ traps: [trap2] });
			if (disarmTrap(state2, trap2, 'mage').success) mageSuccesses++;
		}
		expect(rogueSuccesses).toBeGreaterThan(mageSuccesses);
	});

	it('failed teleport disarm returns teleportPos', () => {
		const trap = createTrap({ x: 5, y: 5 }, 'teleport');
		const state = makeTestState({ traps: [trap] });
		const orig = Math.random;
		let callCount = 0;
		Math.random = () => {
			callCount++;
			if (callCount === 1) return 0.99; // Fail disarm
			return 0.1; // For teleport random position
		};
		try {
			const result = disarmTrap(state, trap, 'warrior');
			expect(result.success).toBe(false);
			expect(result.triggerResult?.teleportPos).toBeDefined();
		} finally {
			Math.random = orig;
		}
	});
});

describe('searchForTraps', () => {
	it('detects traps within radius 2', () => {
		const trap = createTrap({ x: 7, y: 5 }, 'spike'); // 2 tiles away
		const state = makeTestState({ traps: [trap] });
		const messages = searchForTraps(state);
		expect(state.detectedTraps.has('7,5')).toBe(true);
		expect(messages.length).toBe(1);
		expect(messages[0]).toContain('Spike Trap');
	});

	it('does not detect traps beyond radius 2', () => {
		const trap = createTrap({ x: 8, y: 5 }, 'spike'); // 3 tiles away
		const state = makeTestState({ traps: [trap] });
		const messages = searchForTraps(state);
		expect(state.detectedTraps.has('8,5')).toBe(false);
		expect(messages).toHaveLength(0);
	});

	it('detects multiple traps at once', () => {
		const trap1 = createTrap({ x: 6, y: 5 }, 'spike');
		const trap2 = createTrap({ x: 4, y: 5 }, 'alarm');
		const state = makeTestState({ traps: [trap1, trap2] });
		const messages = searchForTraps(state);
		expect(messages).toHaveLength(2);
		expect(state.detectedTraps.has('6,5')).toBe(true);
		expect(state.detectedTraps.has('4,5')).toBe(true);
	});

	it('skips already detected traps', () => {
		const trap = createTrap({ x: 6, y: 5 }, 'spike');
		const state = makeTestState({ traps: [trap] });
		state.detectedTraps.add('6,5');
		const messages = searchForTraps(state);
		expect(messages).toHaveLength(0);
	});

	it('wider than passive detection', () => {
		// Trap at distance 2 — passive detect (radius 1) misses, search (radius 2) finds
		const trap = createTrap({ x: 7, y: 5 }, 'spike');
		const state = makeTestState({ traps: [trap] });
		const passiveMessages = detectAdjacentTraps(state);
		expect(passiveMessages).toHaveLength(0);
		const searchMessages = searchForTraps(state);
		expect(searchMessages).toHaveLength(1);
	});
});
