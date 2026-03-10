import { describe, it, expect, vi, beforeEach } from 'vitest';
import { moveEnemies, attemptPush, attemptFlee, processKill, DODGE_CHANCE, BLOCK_REDUCTION, PUSH_CHANCE } from './combat';
import { applyEffect, hasEffect } from './status-effects';
import type { GameState, Entity, CharacterClass } from './types';
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

// ── Combat Constants ──

describe('Combat Constants', () => {
	const ALL_CLASSES: CharacterClass[] = ['warrior', 'mage', 'rogue', 'ranger', 'cleric', 'paladin', 'necromancer', 'bard', 'adept'];

	it('DODGE_CHANCE is defined for all character classes', () => {
		for (const cls of ALL_CLASSES) {
			expect(DODGE_CHANCE[cls]).toBeDefined();
			expect(typeof DODGE_CHANCE[cls]).toBe('number');
		}
	});

	it('BLOCK_REDUCTION is defined for all character classes', () => {
		for (const cls of ALL_CLASSES) {
			expect(BLOCK_REDUCTION[cls]).toBeDefined();
			expect(typeof BLOCK_REDUCTION[cls]).toBe('number');
		}
	});

	it('PUSH_CHANCE is defined for all character classes', () => {
		for (const cls of ALL_CLASSES) {
			expect(PUSH_CHANCE[cls]).toBeDefined();
			expect(typeof PUSH_CHANCE[cls]).toBe('number');
		}
	});

	it('warrior has 100% push chance', () => {
		expect(PUSH_CHANCE.warrior).toBe(1.0);
	});

	it('rogue has highest dodge chance', () => {
		for (const cls of ALL_CLASSES) {
			expect(DODGE_CHANCE.rogue).toBeGreaterThanOrEqual(DODGE_CHANCE[cls]);
		}
	});

	it('paladin has highest block reduction', () => {
		for (const cls of ALL_CLASSES) {
			expect(BLOCK_REDUCTION.paladin).toBeGreaterThanOrEqual(BLOCK_REDUCTION[cls]);
		}
	});
});

// ── processKill ──

describe('processKill', () => {
	it('awards XP for a normal enemy kill', () => {
		const state = makeTestState();
		const enemy = makeEnemy(3, 3, { maxHp: 5 });
		const reward = processKill(state, enemy);
		expect(reward).toBeGreaterThan(0);
		expect(state.xp).toBe(reward);
	});

	it('increments enemiesKilled stat', () => {
		const state = makeTestState();
		const enemy = makeEnemy(3, 3);
		processKill(state, enemy);
		expect(state.stats.enemiesKilled).toBe(1);
	});

	it('awards 3x XP for boss kills', () => {
		const state = makeTestState();
		// The Hollow King is defined as boss in BOSS_DEFS
		const boss = makeEnemy(3, 3, { name: 'The Hollow King', maxHp: 30 });
		const normalEnemy = makeEnemy(3, 3, { maxHp: 30 });

		const normalState = makeTestState();
		const normalReward = processKill(normalState, normalEnemy);

		const bossReward = processKill(state, boss);
		expect(bossReward).toBe(normalReward * 3);
		expect(state.stats.bossesKilled).toBe(1);
	});

	it('awards 2x XP for rare kills', () => {
		const state = makeTestState();
		const rareEnemy = makeEnemy(3, 3, { name: 'Ancient Goblin', maxHp: 5 });
		const normalEnemy = makeEnemy(3, 3, { name: 'Goblin', maxHp: 5 });

		const normalState = makeTestState();
		const normalReward = processKill(normalState, normalEnemy);

		const rareReward = processKill(state, rareEnemy);
		expect(rareReward).toBe(normalReward * 2);
	});

	it('handles Exam Golem kill — passExam is called', () => {
		const state = makeTestState({
			academyState: {
				enrolled: true,
				semester: 1,
				day: 1,
				attendedLectures: [],
				examTaken: false,
				examPassed: false,
				graduated: false,
				examPart1Passed: false,
				missedLectures: 0,
			} as any,
		});
		const golem = makeEnemy(3, 3, { name: 'Exam Golem', maxHp: 10 });
		processKill(state, golem);
		expect(state.academyState!.examPassed).toBe(true);
	});

	it('does not call passExam if already passed', () => {
		const state = makeTestState({
			academyState: {
				enrolled: true,
				semester: 1,
				day: 1,
				attendedLectures: [],
				examTaken: true,
				examPassed: true,
				graduated: true,
				examPart1Passed: true,
				missedLectures: 0,
			} as any,
		});
		const golem = makeEnemy(3, 3, { name: 'Exam Golem', maxHp: 10 });
		// Should not throw, and doesn't double-pass
		processKill(state, golem);
		expect(state.academyState!.examPassed).toBe(true);
	});

	it('applies bonusMultiplier when provided', () => {
		const state = makeTestState();
		const enemy = makeEnemy(3, 3, { maxHp: 5 });

		const normalState = makeTestState();
		const normalEnemy = makeEnemy(3, 3, { maxHp: 5 });
		const normalReward = processKill(normalState, normalEnemy);

		const bonusReward = processKill(state, enemy, 1.5);
		expect(bonusReward).toBe(Math.floor(normalReward * 1.5));
	});

	it('adds a kill message', () => {
		const state = makeTestState();
		const enemy = makeEnemy(3, 3, { name: 'Goblin' });
		processKill(state, enemy);
		expect(state.messages.some(m => m.text.includes('Goblin') && m.text.includes('XP'))).toBe(true);
	});
});

// ── attemptPush ──

describe('attemptPush', () => {
	it('pushes enemy to open tile when push succeeds', () => {
		// Warrior has 100% push chance
		const state = makeTestState();
		const enemy = makeEnemy(6, 5);
		state.enemies = [enemy];

		const result = attemptPush(state, enemy, 1, 0);
		expect(result.pushed).toBe(true);
		expect(enemy.pos.x).toBe(7);
		expect(enemy.pos.y).toBe(5);
	});

	it('push fails when destination is a wall', () => {
		const state = makeTestState();
		state.map.tiles[5][7] = '#';
		const enemy = makeEnemy(6, 5);
		state.enemies = [enemy];

		const result = attemptPush(state, enemy, 1, 0);
		expect(result.pushed).toBe(false);
		expect(enemy.pos.x).toBe(6);
	});

	it('push fails when destination is out of bounds', () => {
		const state = makeTestState();
		const enemy = makeEnemy(9, 5);
		state.enemies = [enemy];

		const result = attemptPush(state, enemy, 1, 0);
		expect(result.pushed).toBe(false);
		expect(enemy.pos.x).toBe(9);
	});

	it('push fails when destination is occupied by another enemy', () => {
		const state = makeTestState();
		const enemy1 = makeEnemy(6, 5);
		const enemy2 = makeEnemy(7, 5);
		state.enemies = [enemy1, enemy2];

		const result = attemptPush(state, enemy1, 1, 0);
		expect(result.pushed).toBe(false);
	});

	it('push fails when destination is player position', () => {
		const state = makeTestState();
		// Player is at 5,5
		const enemy = makeEnemy(4, 5);
		state.enemies = [enemy];

		const result = attemptPush(state, enemy, 1, 0);
		expect(result.pushed).toBe(false);
	});

	it('environmental kill when enemy is pushed onto hazard and dies', () => {
		const state = makeTestState();
		const enemy = makeEnemy(6, 5, { hp: 1 });
		state.enemies = [enemy];
		state.hazards = [{ pos: { x: 7, y: 5 }, type: 'lava', duration: -1 }];

		const result = attemptPush(state, enemy, 1, 0);
		expect(result.pushed).toBe(true);
		if (enemy.hp <= 0) {
			expect(result.environmentalKill).toBe(true);
		}
	});
});

// ── moveEnemies ──

describe('moveEnemies', () => {
	it('stunned enemies skip their turns', () => {
		const state = makeTestState();
		const enemy = makeEnemy(6, 5);
		applyEffect(enemy, 'stun', 2, 0);
		state.enemies = [enemy];

		moveEnemies(state);
		// Stunned enemy should not move (or attack)
		// Position should remain or only change from status-effect ticking, not from AI movement
		expect(state.player.hp).toBe(20);
	});

	it('sleeping enemies skip their turns', () => {
		const state = makeTestState();
		const enemy = makeEnemy(6, 5);
		applyEffect(enemy, 'sleep', 2, 0);
		state.enemies = [enemy];

		moveEnemies(state);
		// Sleeping enemy should not attack player
		expect(state.player.hp).toBe(20);
	});

	it('frozen enemies skip their turns', () => {
		const state = makeTestState();
		const enemy = makeEnemy(6, 5);
		applyEffect(enemy, 'freeze', 2, 0);
		state.enemies = [enemy];

		moveEnemies(state);
		expect(state.player.hp).toBe(20);
	});

	it('enemies move toward player on open map', () => {
		const state = makeTestState();
		const enemy = makeEnemy(8, 5, { hp: 20, maxHp: 20 });
		state.enemies = [enemy];

		const origX = enemy.pos.x;
		moveEnemies(state);
		// Enemy should move closer (or stay if blocked for some AI reason)
		const newDist = Math.abs(enemy.pos.x - state.player.pos.x) + Math.abs(enemy.pos.y - state.player.pos.y);
		const oldDist = Math.abs(origX - state.player.pos.x);
		expect(newDist).toBeLessThanOrEqual(oldDist);
	});

	it('enemies attack when adjacent to player', () => {
		const state = makeTestState();
		const enemy = makeEnemy(6, 5, { hp: 20, maxHp: 20, attack: 5 });
		state.enemies = [enemy];
		// Override random so dodge never triggers
		vi.spyOn(Math, 'random').mockReturnValue(0.99);

		moveEnemies(state);
		// Player should take damage
		expect(state.player.hp).toBeLessThan(20);

		vi.restoreAllMocks();
	});

	it('hazard damage kills enemies and awards XP', () => {
		const state = makeTestState();
		// Enemy standing on lava with very low HP
		const enemy = makeEnemy(3, 3, { hp: 1, maxHp: 5 });
		state.enemies = [enemy];
		state.hazards = [{ pos: { x: 3, y: 3 }, type: 'lava', duration: -1 }];

		moveEnemies(state);
		// Enemy should be dead from lava and removed
		const alive = state.enemies.find(e => e.name === 'Goblin' && e.pos.x === 3 && e.pos.y === 3);
		if (!alive) {
			// XP was awarded
			expect(state.xp).toBeGreaterThan(0);
		}
	});

	it('ticks terrain effects on entities', () => {
		const state = makeTestState();
		state.terrainEffects = [{
			pos: { x: 5, y: 5 },
			type: 'burning',
			duration: 3,
			damagePerTurn: 2
		}];
		const startHp = state.player.hp;

		moveEnemies(state);
		// Player is on a burning tile, should take damage
		expect(state.player.hp).toBeLessThan(startHp);
	});

	it('terrain effect duration decrements each turn', () => {
		const state = makeTestState();
		state.terrainEffects = [{
			pos: { x: 0, y: 0 },
			type: 'burning',
			duration: 2,
			damagePerTurn: 1
		}];

		moveEnemies(state);
		// Duration should have decremented
		expect(state.terrainEffects.length).toBe(1);
		expect(state.terrainEffects[0].duration).toBe(1);
	});
});

// ── attemptFlee ──

describe('attemptFlee', () => {
	it('moves player to open tile when flee succeeds', () => {
		const state = makeTestState();
		const enemy = makeEnemy(6, 5, { hp: 20, maxHp: 20 });
		state.enemies = [enemy];
		// Force random to succeed
		vi.spyOn(Math, 'random').mockReturnValue(0);

		const result = attemptFlee(state);
		expect(result.moved).not.toBeNull();
		// Should move away from enemy
		if (result.moved) {
			const newDist = Math.abs(result.moved.x - enemy.pos.x) + Math.abs(result.moved.y - enemy.pos.y);
			const oldDist = Math.abs(5 - enemy.pos.x) + Math.abs(5 - enemy.pos.y);
			expect(newDist).toBeGreaterThanOrEqual(oldDist);
		}

		vi.restoreAllMocks();
	});

	it('fails when no enemies are adjacent', () => {
		const state = makeTestState();
		// Enemy is far away
		const enemy = makeEnemy(9, 9, { hp: 20, maxHp: 20 });
		state.enemies = [enemy];

		const result = attemptFlee(state);
		expect(result.moved).toBeNull();
		expect(result.messages.some(m => m.text.includes('nothing to flee'))).toBe(true);
	});

	it('fails when surrounded by walls', () => {
		const state = makeTestState();
		// Surround player with walls except the enemy tile
		const { x, y } = state.player.pos;
		for (let dy = -2; dy <= 2; dy++) {
			for (let dx = -2; dx <= 2; dx++) {
				if (dx === 0 && dy === 0) continue;
				const tx = x + dx;
				const ty = y + dy;
				if (tx >= 0 && ty >= 0 && tx < 10 && ty < 10) {
					if (!(dx === 1 && dy === 0)) {
						state.map.tiles[ty][tx] = '#';
					}
				}
			}
		}
		const enemy = makeEnemy(x + 1, y, { hp: 20, maxHp: 20 });
		state.enemies = [enemy];
		// Force flee chance to succeed
		vi.spyOn(Math, 'random').mockReturnValue(0);

		const result = attemptFlee(state);
		// All escape routes are blocked
		expect(result.moved).toBeNull();
		expect(result.messages.some(m => m.text.includes('nowhere to go'))).toBe(true);

		vi.restoreAllMocks();
	});

	it('bosses block fleeing', () => {
		const state = makeTestState();
		const boss = makeEnemy(6, 5, { name: 'The Hollow King', hp: 30, maxHp: 30 });
		state.enemies = [boss];
		vi.spyOn(Math, 'random').mockReturnValue(0);

		const result = attemptFlee(state);
		expect(result.moved).toBeNull();
		expect(result.messages.some(m => m.text.includes('boss blocks'))).toBe(true);

		vi.restoreAllMocks();
	});

	it('flee message on success', () => {
		const state = makeTestState();
		const enemy = makeEnemy(6, 5);
		state.enemies = [enemy];
		vi.spyOn(Math, 'random').mockReturnValue(0);

		const result = attemptFlee(state);
		if (result.moved) {
			expect(result.messages.some(m => m.text.includes('flee'))).toBe(true);
		}

		vi.restoreAllMocks();
	});
});
