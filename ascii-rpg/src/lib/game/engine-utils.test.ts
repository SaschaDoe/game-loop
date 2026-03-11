import { describe, it, expect, vi } from 'vitest';
import {
	xpForLevel,
	xpReward,
	addMessage,
	isBlocked,
	handlePlayerDeath,
	checkLevelUp,
	effectiveSightRadius,
	applyXpMultiplier,
	processAchievements,
	detectAdjacentSecrets,
	tickEntityEffects,
	tryDropLoot,
} from './engine-utils';
import type { GameState, Entity } from './types';
import { Visibility } from './types';
import { applyEffect } from './status-effects';

function makeEnemy(x: number, y: number, overrides?: Partial<Entity>): Entity {
	return {
		pos: { x, y },
		char: 'G',
		color: '#0f0',
		name: 'Goblin',
		hp: 1,
		maxHp: 3,
		attack: 1,
		statusEffects: [],
		...overrides,
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
			statusEffects: [],
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
		playerRace: 'human' as const,
		permanentBuffs: [],
		npcAttitudeShifts: {},
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
		...overrides,
	};
}

describe('xpForLevel', () => {
	it('returns 25 for level 1 (base case)', () => {
		// xpForLevel(1) = floor(25 * 1.5^0) = 25
		expect(xpForLevel(1)).toBe(25);
	});

	it('returns 37 for level 2', () => {
		// xpForLevel(2) = floor(25 * 1.5^1) = floor(37.5) = 37
		expect(xpForLevel(2)).toBe(37);
	});

	it('scales exponentially', () => {
		const l2 = xpForLevel(2);
		const l3 = xpForLevel(3);
		const l4 = xpForLevel(4);
		expect(l3).toBeGreaterThan(l2);
		expect(l4).toBeGreaterThan(l3);
		expect(l3 / l2).toBeCloseTo(1.5, 1);
	});

	it('always returns a positive integer', () => {
		for (let i = 1; i <= 50; i++) {
			const val = xpForLevel(i);
			expect(val).toBeGreaterThan(0);
			expect(Number.isInteger(val)).toBe(true);
		}
	});
});

describe('xpReward', () => {
	it('increases with dungeon level', () => {
		const enemy = makeEnemy(0, 0, { maxHp: 5 });
		expect(xpReward(enemy, 3)).toBeGreaterThan(xpReward(enemy, 1));
	});

	it('includes enemy maxHp in calculation', () => {
		const weak = makeEnemy(0, 0, { maxHp: 2 });
		const strong = makeEnemy(0, 0, { maxHp: 10 });
		expect(xpReward(strong, 1)).toBeGreaterThan(xpReward(weak, 1));
	});

	it('returns 5 + dungeonLevel*2 + maxHp', () => {
		const enemy = makeEnemy(0, 0, { maxHp: 7 });
		expect(xpReward(enemy, 4)).toBe(5 + 4 * 2 + 7); // 20
	});
});

describe('addMessage', () => {
	it('appends a message to state.messages', () => {
		const state = makeTestState();
		addMessage(state, 'Hello world');
		expect(state.messages).toHaveLength(1);
		expect(state.messages[0].text).toBe('Hello world');
	});

	it('defaults to info type', () => {
		const state = makeTestState();
		addMessage(state, 'Test');
		expect(state.messages[0].type).toBe('info');
	});

	it('accepts a custom message type', () => {
		const state = makeTestState();
		addMessage(state, 'Ouch', 'damage_taken');
		expect(state.messages[0].type).toBe('damage_taken');
	});

	it('keeps at most 50 messages', () => {
		const state = makeTestState();
		for (let i = 0; i < 60; i++) {
			addMessage(state, `msg ${i}`);
		}
		expect(state.messages.length).toBeLessThanOrEqual(50);
		// The latest message should be present
		expect(state.messages[state.messages.length - 1].text).toBe('msg 59');
	});
});

describe('isBlocked', () => {
	it('returns false for floor tiles (.)', () => {
		const state = makeTestState();
		expect(isBlocked(state, 5, 5)).toBe(false);
	});

	it('returns true for wall tiles (#)', () => {
		const state = makeTestState();
		state.map.tiles[3][3] = '#';
		expect(isBlocked(state, 3, 3)).toBe(true);
	});

	it('returns true for out-of-bounds positions', () => {
		const state = makeTestState();
		expect(isBlocked(state, -1, 0)).toBe(true);
		expect(isBlocked(state, 0, -1)).toBe(true);
		expect(isBlocked(state, state.map.width, 0)).toBe(true);
		expect(isBlocked(state, 0, state.map.height)).toBe(true);
	});

	it('allows walking through detected secret walls', () => {
		const state = makeTestState();
		state.map.tiles[2][2] = '#';
		state.map.secretWalls.add('2,2');
		// Not yet detected — still blocked
		expect(isBlocked(state, 2, 2)).toBe(true);
		// Mark as detected — now passable
		state.detectedSecrets.add('2,2');
		expect(isBlocked(state, 2, 2)).toBe(false);
	});
});

describe('handlePlayerDeath', () => {
	it('sets gameOver to true', () => {
		const state = makeTestState();
		handlePlayerDeath(state);
		expect(state.gameOver).toBe(true);
	});

	it('adds a death message for normal difficulty', () => {
		const state = makeTestState();
		handlePlayerDeath(state);
		const deathMsg = state.messages.find(m => m.type === 'death');
		expect(deathMsg).toBeDefined();
		expect(deathMsg!.text).toContain('Press R to restart');
	});

	it('adds a permadeath message for permadeath difficulty', () => {
		const state = makeTestState({
			characterConfig: { name: 'Hero', characterClass: 'warrior', difficulty: 'permadeath', startingLocation: 'cave', worldSeed: 'test' },
		});
		handlePlayerDeath(state);
		const deathMsg = state.messages.find(m => m.type === 'death');
		expect(deathMsg).toBeDefined();
		expect(deathMsg!.text).toContain('forever');
	});
});

describe('checkLevelUp', () => {
	it('levels up when xp exceeds threshold', () => {
		const state = makeTestState({ xp: 100, characterLevel: 1 });
		checkLevelUp(state);
		expect(state.characterLevel).toBeGreaterThan(1);
	});

	it('grants a talent point on level up', () => {
		const state = makeTestState({ xp: 100, characterLevel: 1, skillPoints: 0 });
		checkLevelUp(state);
		expect(state.skillPoints).toBeGreaterThanOrEqual(1);
	});

	it('adds a level up message', () => {
		const state = makeTestState({ xp: 100, characterLevel: 1 });
		checkLevelUp(state);
		const lvlMsg = state.messages.find(m => m.type === 'level_up');
		expect(lvlMsg).toBeDefined();
	});

	it('respects level 50 cap', () => {
		const state = makeTestState({ xp: 999999, characterLevel: 50 });
		checkLevelUp(state);
		expect(state.characterLevel).toBe(50);
	});

	it('handles multiple level-ups in one call', () => {
		// Give enough XP to level from 1 to at least 3
		const state = makeTestState({ xp: 500, characterLevel: 1, skillPoints: 0 });
		checkLevelUp(state);
		expect(state.characterLevel).toBeGreaterThanOrEqual(3);
		// Should get multiple talent points
		expect(state.skillPoints).toBe(state.characterLevel - 1);
	});
});

describe('effectiveSightRadius', () => {
	it('returns base sight radius during morning (modifier 0, no skills)', () => {
		// turnCount 15 = morning phase, sightModifier = 0
		const state = makeTestState({ turnCount: 15, sightRadius: 8 });
		expect(effectiveSightRadius(state)).toBe(8);
	});

	it('has a minimum of 2', () => {
		// turnCount 95 = midnight phase, sightModifier = -4
		const state = makeTestState({ turnCount: 95, sightRadius: 3 });
		// 3 + 0 (no skills) + (-4) = -1, clamped to 2
		expect(effectiveSightRadius(state)).toBe(2);
	});

	it('accounts for skill bonuses', () => {
		// w_tac_1 gives +1 sight
		const state = makeTestState({ turnCount: 15, sightRadius: 8, unlockedSkills: ['w_tac_1'] });
		expect(effectiveSightRadius(state)).toBe(9);
	});

	it('accounts for time-of-day modifier', () => {
		// turnCount 0 = dawn phase, sightModifier = -1
		const state = makeTestState({ turnCount: 0, sightRadius: 8 });
		expect(effectiveSightRadius(state)).toBe(7);
	});
});

describe('applyXpMultiplier', () => {
	it('returns base XP with no skills', () => {
		const state = makeTestState({ unlockedSkills: [] });
		expect(applyXpMultiplier(100, state)).toBe(100);
	});

	it('applies skill XP bonus', () => {
		// w_tac_2 gives +10% xp multiplier
		const state = makeTestState({ unlockedSkills: ['w_tac_1', 'w_tac_2'] });
		expect(applyXpMultiplier(100, state)).toBe(110);
	});

	it('floors the result', () => {
		const state = makeTestState({ unlockedSkills: ['w_tac_1', 'w_tac_2'] });
		// 33 * 1.10 = 36.3 -> 36
		expect(applyXpMultiplier(33, state)).toBe(36);
	});
});

describe('processAchievements', () => {
	it('detects new achievements based on stats', () => {
		const state = makeTestState();
		state.stats.enemiesKilled = 1;
		processAchievements(state);
		expect(state.unlockedAchievements).toContain('first_blood');
	});

	it('does not duplicate already unlocked achievements', () => {
		const state = makeTestState();
		state.stats.enemiesKilled = 1;
		state.unlockedAchievements = ['first_blood'];
		processAchievements(state);
		const count = state.unlockedAchievements.filter(a => a === 'first_blood').length;
		expect(count).toBe(1);
	});

	it('adds a discovery message for each new achievement', () => {
		const state = makeTestState();
		state.stats.enemiesKilled = 1;
		processAchievements(state);
		const achMsg = state.messages.find(m => m.text.includes('Achievement unlocked'));
		expect(achMsg).toBeDefined();
		expect(achMsg!.type).toBe('discovery');
	});

	it('unlocks multiple achievements at once', () => {
		const state = makeTestState();
		state.stats.enemiesKilled = 25; // first_blood + monster_slayer
		processAchievements(state);
		expect(state.unlockedAchievements).toContain('first_blood');
		expect(state.unlockedAchievements).toContain('monster_slayer');
	});
});

describe('detectAdjacentSecrets', () => {
	it('detects secret walls adjacent to the player', () => {
		const state = makeTestState();
		state.map.tiles[5][6] = '#';
		state.map.secretWalls.add('6,5');
		detectAdjacentSecrets(state);
		expect(state.detectedSecrets.has('6,5')).toBe(true);
	});

	it('increments secretsFound stat', () => {
		const state = makeTestState();
		state.map.tiles[5][6] = '#';
		state.map.secretWalls.add('6,5');
		detectAdjacentSecrets(state);
		expect(state.stats.secretsFound).toBe(1);
	});

	it('adds a discovery message', () => {
		const state = makeTestState();
		state.map.tiles[5][6] = '#';
		state.map.secretWalls.add('6,5');
		detectAdjacentSecrets(state);
		const msg = state.messages.find(m => m.text.includes('hidden passage'));
		expect(msg).toBeDefined();
		expect(msg!.type).toBe('discovery');
	});

	it('does not re-detect already found secrets', () => {
		const state = makeTestState();
		state.map.tiles[5][6] = '#';
		state.map.secretWalls.add('6,5');
		state.detectedSecrets.add('6,5');
		detectAdjacentSecrets(state);
		expect(state.stats.secretsFound).toBe(0);
	});

	it('detects diagonal secrets', () => {
		const state = makeTestState();
		state.map.tiles[4][4] = '#';
		state.map.secretWalls.add('4,4');
		detectAdjacentSecrets(state);
		expect(state.detectedSecrets.has('4,4')).toBe(true);
	});
});

describe('tickEntityEffects', () => {
	it('processes poison damage on an entity', () => {
		const state = makeTestState();
		const enemy = makeEnemy(3, 3, { hp: 10, maxHp: 10 });
		state.enemies.push(enemy);
		applyEffect(enemy, 'poison', 3, 2);
		tickEntityEffects(state, enemy);
		expect(enemy.hp).toBe(8); // 10 - 2 poison damage
	});

	it('adds messages for status effects', () => {
		const state = makeTestState();
		const enemy = makeEnemy(3, 3, { hp: 10, maxHp: 10 });
		state.enemies.push(enemy);
		applyEffect(enemy, 'poison', 3, 2);
		tickEntityEffects(state, enemy);
		expect(state.messages.length).toBeGreaterThan(0);
		expect(state.messages[0].text).toContain('poison');
	});

	it('triggers player death when player hp drops to 0', () => {
		const state = makeTestState();
		state.player.hp = 1;
		applyEffect(state.player, 'poison', 3, 2);
		tickEntityEffects(state, state.player);
		expect(state.gameOver).toBe(true);
	});

	it('uses damage_taken type for player effects', () => {
		const state = makeTestState();
		applyEffect(state.player, 'burn', 2, 1);
		tickEntityEffects(state, state.player);
		const msg = state.messages.find(m => m.text.includes('burn'));
		expect(msg).toBeDefined();
		expect(msg!.type).toBe('damage_taken');
	});

	it('uses player_attack type for enemy effects', () => {
		const state = makeTestState();
		const enemy = makeEnemy(3, 3, { hp: 10, maxHp: 10 });
		state.enemies.push(enemy);
		applyEffect(enemy, 'burn', 2, 1);
		tickEntityEffects(state, enemy);
		const msg = state.messages.find(m => m.text.includes('burn'));
		expect(msg).toBeDefined();
		expect(msg!.type).toBe('player_attack');
	});
});

describe('tryDropLoot', () => {
	it('calls loot system and may add drops', () => {
		const state = makeTestState();
		const enemy = makeEnemy(3, 3, { name: 'Goblin', maxHp: 3 });
		// Run many times — with random drops, at least check it does not throw
		for (let i = 0; i < 20; i++) {
			tryDropLoot(state, enemy);
		}
		// lootDrops array should be populated (or not, depending on RNG)
		// At minimum, verify the function runs without error
		expect(Array.isArray(state.lootDrops)).toBe(true);
	});

	it('adds loot to state.lootDrops when a drop occurs', () => {
		const state = makeTestState();
		const enemy = makeEnemy(3, 3, { name: 'Goblin', maxHp: 3 });
		// Force many attempts to increase chance of a drop
		for (let i = 0; i < 100; i++) {
			tryDropLoot(state, enemy);
		}
		// With 100 attempts and ~20% drop rate, we should get at least one
		expect(state.lootDrops.length).toBeGreaterThan(0);
	});
});
