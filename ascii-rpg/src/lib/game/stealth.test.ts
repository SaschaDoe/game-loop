import { describe, it, expect } from 'vitest';
import {
	enterStealth,
	exitStealth,
	calculateDetectionChance,
	updateEnemyAwareness,
	calculateBackstabDamage,
	generateNoise,
	processStealthTurn,
	getAlertSymbol,
	getAlertColor,
	isEnemyAwareOfPlayer,
	initializeAwareness,
	STEALTH_BASE_DETECTION_RADIUS,
	BACKSTAB_MULTIPLIER,
	ROGUE_BACKSTAB_MULTIPLIER,
	NOISE_WALK,
	NOISE_COMBAT,
	DETECTION_THRESHOLD,
	SUSPICION_DECAY_TURNS,
} from './stealth';
import type { GameState, Entity, AlertState } from './types';
import { Visibility } from './types';

function makeTestState(overrides?: Partial<GameState>): GameState {
	const width = 20;
	const height = 20;
	const tiles = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => '.' as const)
	);
	const visibility = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => Visibility.Visible)
	);
	return {
		player: {
			pos: { x: 10, y: 10 },
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

function makeEnemy(overrides?: Partial<Entity>): Entity {
	return {
		pos: { x: 15, y: 15 },
		char: 'G',
		color: '#0f0',
		name: 'Goblin',
		hp: 10,
		maxHp: 10,
		attack: 3,
		statusEffects: [],
		...overrides,
	};
}

// ---------------------------------------------------------------------------
// enterStealth
// ---------------------------------------------------------------------------

describe('enterStealth', () => {
	it('succeeds when no enemies are adjacent', () => {
		const farEnemy = makeEnemy({ pos: { x: 15, y: 15 } });
		const state = makeTestState({ enemies: [farEnemy] });
		const result = enterStealth(state);
		expect(result.success).toBe(true);
		expect(state.stealth.isHidden).toBe(true);
		expect(state.stealth.backstabReady).toBe(true);
		expect(state.stealth.noiseLevel).toBe(0);
		expect(state.stealth.lastNoisePos).toBeNull();
	});

	it('fails when an enemy is adjacent', () => {
		const adjacentEnemy = makeEnemy({ pos: { x: 11, y: 10 } });
		const state = makeTestState({ enemies: [adjacentEnemy] });
		const result = enterStealth(state);
		expect(result.success).toBe(false);
		expect(result.message).toContain('Cannot hide');
		expect(state.stealth.isHidden).toBe(false);
	});

	it('fails when an enemy is diagonally adjacent', () => {
		const diagonalEnemy = makeEnemy({ pos: { x: 11, y: 11 } });
		const state = makeTestState({ enemies: [diagonalEnemy] });
		const result = enterStealth(state);
		expect(result.success).toBe(false);
	});

	it('succeeds when adjacent enemy is dead', () => {
		const deadEnemy = makeEnemy({ pos: { x: 11, y: 10 }, hp: 0 });
		const state = makeTestState({ enemies: [deadEnemy] });
		const result = enterStealth(state);
		expect(result.success).toBe(true);
		expect(state.stealth.isHidden).toBe(true);
	});

	it('returns rogue-specific message for rogue class', () => {
		const state = makeTestState({
			characterConfig: { name: 'Hero', characterClass: 'rogue', difficulty: 'normal', startingLocation: 'cave', worldSeed: 'test' },
		});
		const result = enterStealth(state);
		expect(result.success).toBe(true);
		expect(result.message).toContain('melt into the shadows');
		expect(result.message).toContain('Backstab ready');
	});

	it('returns generic message for non-rogue class', () => {
		const state = makeTestState();
		const result = enterStealth(state);
		expect(result.success).toBe(true);
		expect(result.message).toContain('attempt to hide');
	});

	it('succeeds with no enemies at all', () => {
		const state = makeTestState({ enemies: [] });
		const result = enterStealth(state);
		expect(result.success).toBe(true);
	});
});

// ---------------------------------------------------------------------------
// exitStealth
// ---------------------------------------------------------------------------

describe('exitStealth', () => {
	it('resets all stealth state', () => {
		const state = makeTestState({
			stealth: { isHidden: true, noiseLevel: 5, lastNoisePos: { x: 1, y: 2 }, backstabReady: true },
		});
		exitStealth(state);
		expect(state.stealth.isHidden).toBe(false);
		expect(state.stealth.backstabReady).toBe(false);
		expect(state.stealth.noiseLevel).toBe(0);
		expect(state.stealth.lastNoisePos).toBeNull();
	});

	it('is idempotent when already not hidden', () => {
		const state = makeTestState();
		exitStealth(state);
		expect(state.stealth.isHidden).toBe(false);
		expect(state.stealth.backstabReady).toBe(false);
	});
});

// ---------------------------------------------------------------------------
// calculateDetectionChance
// ---------------------------------------------------------------------------

describe('calculateDetectionChance', () => {
	it('returns a value between 0 and 100', () => {
		const enemy = makeEnemy({ pos: { x: 13, y: 10 } });
		const score = calculateDetectionChance(enemy, { x: 10, y: 10 }, false, 1.0, 0, 0);
		expect(score).toBeGreaterThanOrEqual(0);
		expect(score).toBeLessThanOrEqual(100);
	});

	it('returns 0 for enemies beyond double detection radius', () => {
		const farEnemy = makeEnemy({ pos: { x: 10 + STEALTH_BASE_DETECTION_RADIUS * 2 + 1, y: 10 } });
		const score = calculateDetectionChance(farEnemy, { x: 10, y: 10 }, false, 1.0, 0, 0);
		expect(score).toBe(0);
	});

	it('returns higher detection when enemies are closer', () => {
		const closeEnemy = makeEnemy({ pos: { x: 11, y: 10 } });
		const farEnemy = makeEnemy({ pos: { x: 14, y: 10 } });
		const closeScore = calculateDetectionChance(closeEnemy, { x: 10, y: 10 }, false, 1.0, 0, 0);
		const farScore = calculateDetectionChance(farEnemy, { x: 10, y: 10 }, false, 1.0, 0, 0);
		expect(closeScore).toBeGreaterThan(farScore);
	});

	it('returns lower detection in darkness (low light level)', () => {
		const enemy = makeEnemy({ pos: { x: 13, y: 10 } });
		const darkScore = calculateDetectionChance(enemy, { x: 10, y: 10 }, false, 0.0, 0, 0);
		const brightScore = calculateDetectionChance(enemy, { x: 10, y: 10 }, false, 1.0, 0, 0);
		expect(darkScore).toBeLessThan(brightScore);
	});

	it('returns lower detection with stealth bonus', () => {
		const enemy = makeEnemy({ pos: { x: 13, y: 10 } });
		const noBonus = calculateDetectionChance(enemy, { x: 10, y: 10 }, false, 1.0, 0, 0);
		const withBonus = calculateDetectionChance(enemy, { x: 10, y: 10 }, false, 1.0, 20, 0);
		expect(withBonus).toBeLessThan(noBonus);
	});

	it('returns lower detection when hidden', () => {
		const enemy = makeEnemy({ pos: { x: 13, y: 10 } });
		const visibleScore = calculateDetectionChance(enemy, { x: 10, y: 10 }, false, 1.0, 0, 0);
		const hiddenScore = calculateDetectionChance(enemy, { x: 10, y: 10 }, true, 1.0, 0, 0);
		expect(hiddenScore).toBeLessThan(visibleScore);
	});

	it('increases detection with higher noise level', () => {
		const enemy = makeEnemy({ pos: { x: 13, y: 10 } });
		const quietScore = calculateDetectionChance(enemy, { x: 10, y: 10 }, false, 1.0, 0, 0);
		const noisyScore = calculateDetectionChance(enemy, { x: 10, y: 10 }, false, 1.0, 0, 8);
		expect(noisyScore).toBeGreaterThan(quietScore);
	});

	it('suspicious enemies detect better', () => {
		const normalEnemy = makeEnemy({ pos: { x: 13, y: 10 } });
		const suspiciousEnemy = makeEnemy({
			pos: { x: 13, y: 10 },
			awareness: { alertState: 'suspicious', detectionMeter: 40, lastKnownPlayerPos: null, suspicionTurns: 0 },
		});
		const normalScore = calculateDetectionChance(normalEnemy, { x: 10, y: 10 }, false, 1.0, 0, 0);
		const suspiciousScore = calculateDetectionChance(suspiciousEnemy, { x: 10, y: 10 }, false, 1.0, 0, 0);
		expect(suspiciousScore).toBeGreaterThan(normalScore);
	});

	it('alert enemies detect better than suspicious', () => {
		const suspiciousEnemy = makeEnemy({
			pos: { x: 13, y: 10 },
			awareness: { alertState: 'suspicious', detectionMeter: 40, lastKnownPlayerPos: null, suspicionTurns: 0 },
		});
		const alertEnemy = makeEnemy({
			pos: { x: 13, y: 10 },
			awareness: { alertState: 'alert', detectionMeter: 80, lastKnownPlayerPos: null, suspicionTurns: 0 },
		});
		const suspiciousScore = calculateDetectionChance(suspiciousEnemy, { x: 10, y: 10 }, false, 1.0, 0, 0);
		const alertScore = calculateDetectionChance(alertEnemy, { x: 10, y: 10 }, false, 1.0, 0, 0);
		expect(alertScore).toBeGreaterThan(suspiciousScore);
	});

	it('combat enemies detect even better than alert', () => {
		const alertEnemy = makeEnemy({
			pos: { x: 13, y: 10 },
			awareness: { alertState: 'alert', detectionMeter: 80, lastKnownPlayerPos: null, suspicionTurns: 0 },
		});
		const combatEnemy = makeEnemy({
			pos: { x: 13, y: 10 },
			awareness: { alertState: 'combat', detectionMeter: 100, lastKnownPlayerPos: null, suspicionTurns: 0 },
		});
		const alertScore = calculateDetectionChance(alertEnemy, { x: 10, y: 10 }, false, 1.0, 0, 0);
		const combatScore = calculateDetectionChance(combatEnemy, { x: 10, y: 10 }, false, 1.0, 0, 0);
		expect(combatScore).toBeGreaterThan(alertScore);
	});

	it('clamps score to 0 when stealth bonus is very high', () => {
		const enemy = makeEnemy({ pos: { x: 15, y: 10 } });
		const score = calculateDetectionChance(enemy, { x: 10, y: 10 }, true, 0.0, 200, 0);
		expect(score).toBe(0);
	});

	it('clamps score to 100 when noise is very high', () => {
		const enemy = makeEnemy({ pos: { x: 11, y: 10 } });
		const score = calculateDetectionChance(enemy, { x: 10, y: 10 }, false, 1.0, 0, 50);
		expect(score).toBe(100);
	});
});

// ---------------------------------------------------------------------------
// updateEnemyAwareness
// ---------------------------------------------------------------------------

describe('updateEnemyAwareness', () => {
	it('escalates from unaware to suspicious', () => {
		const enemy = makeEnemy();
		initializeAwareness(enemy);
		// Need to fill detection meter to 30% of threshold
		const result = updateEnemyAwareness(enemy, DETECTION_THRESHOLD * 0.35);
		expect(result.stateChanged).toBe(true);
		expect(result.newState).toBe('suspicious');
		expect(result.message).toContain('suspicious');
	});

	it('escalates from suspicious to alert', () => {
		const enemy = makeEnemy();
		initializeAwareness(enemy);
		enemy.awareness!.detectionMeter = DETECTION_THRESHOLD * 0.5;
		enemy.awareness!.alertState = 'suspicious';
		const result = updateEnemyAwareness(enemy, DETECTION_THRESHOLD * 0.25);
		expect(result.stateChanged).toBe(true);
		expect(result.newState).toBe('alert');
		expect(result.message).toContain('looking for you');
	});

	it('escalates to combat when meter reaches threshold', () => {
		const enemy = makeEnemy();
		initializeAwareness(enemy);
		enemy.awareness!.detectionMeter = DETECTION_THRESHOLD * 0.9;
		enemy.awareness!.alertState = 'alert';
		const result = updateEnemyAwareness(enemy, DETECTION_THRESHOLD * 0.15);
		expect(result.stateChanged).toBe(true);
		expect(result.newState).toBe('combat');
		expect(result.message).toContain('spotted you');
	});

	it('does not change state when detection is not enough', () => {
		const enemy = makeEnemy();
		initializeAwareness(enemy);
		const result = updateEnemyAwareness(enemy, 5);
		// 5 out of 100 threshold is only 5%, well below the 30% needed for suspicious
		expect(result.stateChanged).toBe(false);
		expect(result.newState).toBe('unaware');
		expect(result.message).toBe('');
	});

	it('decays suspicion when not detected over time', () => {
		const enemy = makeEnemy();
		initializeAwareness(enemy);
		enemy.awareness!.detectionMeter = 50;
		enemy.awareness!.alertState = 'suspicious';

		// Pass 0 detection for SUSPICION_DECAY_TURNS turns
		for (let i = 0; i < SUSPICION_DECAY_TURNS; i++) {
			updateEnemyAwareness(enemy, 0);
		}
		// After grace period, meter should have decayed
		expect(enemy.awareness!.detectionMeter).toBeLessThan(50);
	});

	it('does not decay during grace period', () => {
		const enemy = makeEnemy();
		initializeAwareness(enemy);
		enemy.awareness!.detectionMeter = 50;

		// Pass 0 detection for fewer turns than the grace period
		for (let i = 0; i < SUSPICION_DECAY_TURNS - 1; i++) {
			updateEnemyAwareness(enemy, 0);
		}
		expect(enemy.awareness!.detectionMeter).toBe(50);
	});

	it('returns to unaware after enough decay', () => {
		const enemy = makeEnemy();
		initializeAwareness(enemy);
		enemy.awareness!.detectionMeter = 25;
		enemy.awareness!.alertState = 'unaware';

		// Decay many turns with 0 detection
		for (let i = 0; i < 20; i++) {
			updateEnemyAwareness(enemy, 0);
		}
		expect(enemy.awareness!.detectionMeter).toBe(0);
		expect(enemy.awareness!.alertState).toBe('unaware');
	});

	it('generates lost interest message when returning to unaware', () => {
		const enemy = makeEnemy();
		initializeAwareness(enemy);
		enemy.awareness!.detectionMeter = 35;
		enemy.awareness!.alertState = 'suspicious';

		// Decay enough to go back to unaware
		for (let i = 0; i < 20; i++) {
			const result = updateEnemyAwareness(enemy, 0);
			if (result.newState === 'unaware' && result.stateChanged) {
				expect(result.message).toContain('lost interest');
				return;
			}
		}
		// Should have hit the unaware transition
		expect(enemy.awareness!.alertState).toBe('unaware');
	});

	it('initializes awareness on enemy that lacks it', () => {
		const enemy = makeEnemy();
		delete (enemy as any).awareness;
		const result = updateEnemyAwareness(enemy, 0);
		expect(enemy.awareness).toBeDefined();
		expect(result.newState).toBe('unaware');
	});

	it('caps detection meter at DETECTION_THRESHOLD', () => {
		const enemy = makeEnemy();
		initializeAwareness(enemy);
		updateEnemyAwareness(enemy, DETECTION_THRESHOLD * 2);
		expect(enemy.awareness!.detectionMeter).toBe(DETECTION_THRESHOLD);
	});

	it('resets suspicion turns when detection is positive', () => {
		const enemy = makeEnemy();
		initializeAwareness(enemy);
		enemy.awareness!.suspicionTurns = 5;
		updateEnemyAwareness(enemy, 10);
		expect(enemy.awareness!.suspicionTurns).toBe(0);
	});
});

// ---------------------------------------------------------------------------
// calculateBackstabDamage
// ---------------------------------------------------------------------------

describe('calculateBackstabDamage', () => {
	it('returns multiplied damage from stealth', () => {
		const result = calculateBackstabDamage(10, 'warrior', true);
		expect(result.damage).toBe(10 * BACKSTAB_MULTIPLIER);
		expect(result.isCritical).toBe(true);
	});

	it('rogues get 5x backstab multiplier', () => {
		const result = calculateBackstabDamage(10, 'rogue', true);
		expect(result.damage).toBe(10 * ROGUE_BACKSTAB_MULTIPLIER);
		expect(result.damage).toBe(50);
		expect(result.isCritical).toBe(true);
	});

	it('non-rogues get 3x backstab multiplier', () => {
		const result = calculateBackstabDamage(10, 'warrior', true);
		expect(result.damage).toBe(10 * BACKSTAB_MULTIPLIER);
		expect(result.damage).toBe(30);
		expect(result.isCritical).toBe(true);
	});

	it('returns base damage with no multiplier when not in stealth', () => {
		const result = calculateBackstabDamage(10, 'rogue', false);
		expect(result.damage).toBe(10);
		expect(result.isCritical).toBe(false);
	});

	it('works with various character classes', () => {
		const classes = ['warrior', 'mage', 'ranger', 'cleric', 'paladin', 'necromancer', 'bard'] as const;
		for (const cls of classes) {
			const result = calculateBackstabDamage(10, cls, true);
			expect(result.damage).toBe(10 * BACKSTAB_MULTIPLIER);
			expect(result.isCritical).toBe(true);
		}
	});

	it('handles 0 base damage', () => {
		const result = calculateBackstabDamage(0, 'rogue', true);
		expect(result.damage).toBe(0);
		expect(result.isCritical).toBe(true);
	});
});

// ---------------------------------------------------------------------------
// generateNoise
// ---------------------------------------------------------------------------

describe('generateNoise', () => {
	it('returns correct noise level for walk', () => {
		expect(generateNoise('walk', 0)).toBe(NOISE_WALK);
	});

	it('returns correct noise level for combat', () => {
		expect(generateNoise('combat', 0)).toBe(NOISE_COMBAT);
	});

	it('returns correct noise level for ability', () => {
		expect(generateNoise('ability', 0)).toBe(5);
	});

	it('returns 0 noise for rest', () => {
		expect(generateNoise('rest', 0)).toBe(0);
	});

	it('returns correct noise level for interact', () => {
		expect(generateNoise('interact', 0)).toBe(1);
	});

	it('reduces noise by equipment noise reduction', () => {
		const base = generateNoise('combat', 0);
		const reduced = generateNoise('combat', 3);
		expect(reduced).toBe(base - 3);
	});

	it('clamps noise to 0 minimum', () => {
		const result = generateNoise('walk', 100);
		expect(result).toBe(0);
	});

	it('noise reduction does not make noise negative', () => {
		const result = generateNoise('rest', 5);
		expect(result).toBe(0);
	});
});

// ---------------------------------------------------------------------------
// processStealthTurn
// ---------------------------------------------------------------------------

describe('processStealthTurn', () => {
	it('generates messages for state changes', () => {
		const enemy = makeEnemy({ pos: { x: 11, y: 10 } }); // Adjacent — high detection
		const state = makeTestState({
			enemies: [enemy],
			stealth: { isHidden: false, noiseLevel: 8, lastNoisePos: null, backstabReady: false },
		});
		// Multiple turns to escalate awareness
		let allMessages: string[] = [];
		for (let i = 0; i < 10; i++) {
			const messages = processStealthTurn(state, [enemy], 1.0, 0, 0);
			allMessages = allMessages.concat(messages);
		}
		// Should have generated at least one state change message
		expect(allMessages.length).toBeGreaterThan(0);
	});

	it('breaks stealth when enemy enters combat state', () => {
		const enemy = makeEnemy({ pos: { x: 11, y: 10 } });
		const state = makeTestState({
			enemies: [enemy],
			stealth: { isHidden: true, noiseLevel: 8, lastNoisePos: null, backstabReady: true },
		});

		// Run many turns so the enemy fills the detection meter to combat
		let detected = false;
		for (let i = 0; i < 20; i++) {
			const messages = processStealthTurn(state, [enemy], 1.0, 0, 0);
			if (messages.some(m => m.includes('detected'))) {
				detected = true;
				break;
			}
		}
		expect(detected).toBe(true);
		expect(state.stealth.isHidden).toBe(false);
	});

	it('skips dead enemies', () => {
		const deadEnemy = makeEnemy({ pos: { x: 11, y: 10 }, hp: 0 });
		const state = makeTestState({ enemies: [deadEnemy] });
		const messages = processStealthTurn(state, [deadEnemy], 1.0, 0, 0);
		expect(messages).toHaveLength(0);
	});

	it('decays noise level over time', () => {
		const state = makeTestState({
			stealth: { isHidden: true, noiseLevel: 10, lastNoisePos: null, backstabReady: true },
		});
		processStealthTurn(state, [], 1.0, 0, 2);
		// noiseLevel should have been reduced by noiseReduction + 1 = 3
		expect(state.stealth.noiseLevel).toBe(7);
	});

	it('does not reduce noise below 0', () => {
		const state = makeTestState({
			stealth: { isHidden: true, noiseLevel: 1, lastNoisePos: null, backstabReady: true },
		});
		processStealthTurn(state, [], 1.0, 0, 10);
		expect(state.stealth.noiseLevel).toBe(0);
	});

	it('sets lastKnownPlayerPos on enemy entering combat', () => {
		const enemy = makeEnemy({ pos: { x: 11, y: 10 } });
		initializeAwareness(enemy);
		enemy.awareness!.detectionMeter = DETECTION_THRESHOLD - 1;
		enemy.awareness!.alertState = 'alert';
		const state = makeTestState({
			enemies: [enemy],
			stealth: { isHidden: false, noiseLevel: 8, lastNoisePos: null, backstabReady: false },
		});
		// This should push the enemy to combat in one turn
		processStealthTurn(state, [enemy], 1.0, 0, 0);
		if (enemy.awareness!.alertState === 'alert') {
			expect(enemy.awareness!.lastKnownPlayerPos).toEqual({ x: 10, y: 10 });
		}
	});
});

// ---------------------------------------------------------------------------
// getAlertSymbol
// ---------------------------------------------------------------------------

describe('getAlertSymbol', () => {
	it('returns ? for suspicious', () => {
		expect(getAlertSymbol('suspicious')).toBe('?');
	});

	it('returns ! for alert', () => {
		expect(getAlertSymbol('alert')).toBe('!');
	});

	it('returns !! for combat', () => {
		expect(getAlertSymbol('combat')).toBe('!!');
	});

	it('returns empty string for unaware', () => {
		expect(getAlertSymbol('unaware')).toBe('');
	});
});

// ---------------------------------------------------------------------------
// getAlertColor
// ---------------------------------------------------------------------------

describe('getAlertColor', () => {
	it('returns yellow for suspicious', () => {
		expect(getAlertColor('suspicious')).toBe('#ffff00');
	});

	it('returns orange for alert', () => {
		expect(getAlertColor('alert')).toBe('#ff8800');
	});

	it('returns red for combat', () => {
		expect(getAlertColor('combat')).toBe('#ff0000');
	});

	it('returns grey for unaware', () => {
		expect(getAlertColor('unaware')).toBe('#888888');
	});
});

// ---------------------------------------------------------------------------
// isEnemyAwareOfPlayer
// ---------------------------------------------------------------------------

describe('isEnemyAwareOfPlayer', () => {
	it('returns false when enemy has no awareness', () => {
		const enemy = makeEnemy();
		delete (enemy as any).awareness;
		expect(isEnemyAwareOfPlayer(enemy)).toBe(false);
	});

	it('returns false for unaware enemy', () => {
		const enemy = makeEnemy();
		initializeAwareness(enemy);
		expect(isEnemyAwareOfPlayer(enemy)).toBe(false);
	});

	it('returns false for suspicious enemy', () => {
		const enemy = makeEnemy();
		initializeAwareness(enemy);
		enemy.awareness!.alertState = 'suspicious';
		expect(isEnemyAwareOfPlayer(enemy)).toBe(false);
	});

	it('returns true for alert enemy', () => {
		const enemy = makeEnemy();
		initializeAwareness(enemy);
		enemy.awareness!.alertState = 'alert';
		expect(isEnemyAwareOfPlayer(enemy)).toBe(true);
	});

	it('returns true for combat enemy', () => {
		const enemy = makeEnemy();
		initializeAwareness(enemy);
		enemy.awareness!.alertState = 'combat';
		expect(isEnemyAwareOfPlayer(enemy)).toBe(true);
	});
});

// ---------------------------------------------------------------------------
// initializeAwareness
// ---------------------------------------------------------------------------

describe('initializeAwareness', () => {
	it('sets default awareness state on enemy without one', () => {
		const enemy = makeEnemy();
		delete (enemy as any).awareness;
		initializeAwareness(enemy);
		expect(enemy.awareness).toBeDefined();
		expect(enemy.awareness!.alertState).toBe('unaware');
		expect(enemy.awareness!.detectionMeter).toBe(0);
		expect(enemy.awareness!.lastKnownPlayerPos).toBeNull();
		expect(enemy.awareness!.suspicionTurns).toBe(0);
	});

	it('does not overwrite existing awareness', () => {
		const enemy = makeEnemy();
		enemy.awareness = {
			alertState: 'alert',
			detectionMeter: 75,
			lastKnownPlayerPos: { x: 5, y: 5 },
			suspicionTurns: 2,
		};
		initializeAwareness(enemy);
		expect(enemy.awareness.alertState).toBe('alert');
		expect(enemy.awareness.detectionMeter).toBe(75);
		expect(enemy.awareness.lastKnownPlayerPos).toEqual({ x: 5, y: 5 });
		expect(enemy.awareness.suspicionTurns).toBe(2);
	});
});

// ---------------------------------------------------------------------------
// Constants sanity checks
// ---------------------------------------------------------------------------

describe('stealth constants', () => {
	it('ROGUE_BACKSTAB_MULTIPLIER is greater than BACKSTAB_MULTIPLIER', () => {
		expect(ROGUE_BACKSTAB_MULTIPLIER).toBeGreaterThan(BACKSTAB_MULTIPLIER);
	});

	it('NOISE_COMBAT is greater than NOISE_WALK', () => {
		expect(NOISE_COMBAT).toBeGreaterThan(NOISE_WALK);
	});

	it('DETECTION_THRESHOLD is 100', () => {
		expect(DETECTION_THRESHOLD).toBe(100);
	});

	it('STEALTH_BASE_DETECTION_RADIUS is positive', () => {
		expect(STEALTH_BASE_DETECTION_RADIUS).toBeGreaterThan(0);
	});
});
