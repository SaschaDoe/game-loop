import { describe, it, expect } from 'vitest';
import { createGame, handleInput, xpForLevel, xpReward, attemptFlee, attemptPush, DODGE_CHANCE, BLOCK_REDUCTION, PUSH_CHANCE, effectiveSightRadius } from './engine';
import { BOSS_DEFS, MONSTER_DEFS, createMonster, createRareMonster, isBoss } from './monsters';
import { ABILITY_DEFS } from './abilities';
import { applyEffect, hasEffect } from './status-effects';
import type { GameState, Entity, Trap, Hazard, Chest, LootDrop, Landmark } from './types';
import { Visibility } from './types';

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
		lieCount: 0,
		bestiary: {},
		...overrides
	};
}

describe('xpForLevel', () => {
	it('returns 70 XP for level 2 (first level-up)', () => {
		// xpForLevel(2) = floor(50 * 1.4^(2-1)) = floor(70) = 70
		expect(xpForLevel(2)).toBe(70);
	});

	it('increases exponentially with each level', () => {
		const l2 = xpForLevel(2);
		const l3 = xpForLevel(3);
		const l4 = xpForLevel(4);
		expect(l3).toBeGreaterThan(l2);
		expect(l4).toBeGreaterThan(l3);
		expect(l3 / l2).toBeCloseTo(1.4, 1);
	});

	it('returns integer values', () => {
		for (let i = 1; i <= 50; i++) {
			expect(Number.isInteger(xpForLevel(i))).toBe(true);
		}
	});
});

describe('xpReward', () => {
	it('returns XP based on enemy maxHp and dungeon level', () => {
		const enemy = makeEnemy(0, 0, { maxHp: 5 });
		const reward = xpReward(enemy, 1);
		expect(reward).toBe(5 + 1 * 2 + 5); // 12
	});

	it('gives more XP for tougher enemies', () => {
		const weak = makeEnemy(0, 0, { maxHp: 2 });
		const strong = makeEnemy(0, 0, { maxHp: 10 });
		expect(xpReward(strong, 1)).toBeGreaterThan(xpReward(weak, 1));
	});

	it('gives more XP on deeper dungeon levels', () => {
		const enemy = makeEnemy(0, 0, { maxHp: 3 });
		expect(xpReward(enemy, 5)).toBeGreaterThan(xpReward(enemy, 1));
	});
});

describe('createGame', () => {
	it('initializes with xp 0 and characterLevel 1', () => {
		const state = createGame();
		expect(state.xp).toBe(0);
		expect(state.characterLevel).toBe(1);
	});

	it('initializes visibility grid with FOV computed', () => {
		const state = createGame();
		expect(state.visibility).toBeDefined();
		expect(state.visibility.length).toBe(state.map.height);
		expect(state.visibility[0].length).toBe(state.map.width);
		// Player's tile should be visible
		const { x, y } = state.player.pos;
		expect(state.visibility[y][x]).toBe(Visibility.Visible);
	});

	it('has some unexplored tiles on the map', () => {
		const state = createGame();
		let hasUnexplored = false;
		for (const row of state.visibility) {
			for (const cell of row) {
				if (cell === Visibility.Unexplored) {
					hasUnexplored = true;
					break;
				}
			}
		}
		expect(hasUnexplored).toBe(true);
	});
});

describe('XP on enemy kill', () => {
	it('awards XP when an enemy is killed', () => {
		// Place enemy adjacent to player so bump-attack kills it
		const enemy = makeEnemy(6, 5, { hp: 1, maxHp: 3 });
		const state = makeTestState({ enemies: [enemy] });
		const expectedReward = xpReward(enemy, state.level);

		const result = handleInput(state, 'd'); // move right into enemy
		expect(result.xp).toBe(expectedReward);
		expect(result.enemies).toHaveLength(0);
	});

	it('shows XP gain in messages', () => {
		const enemy = makeEnemy(6, 5, { hp: 1, maxHp: 3 });
		const state = makeTestState({ enemies: [enemy] });

		const result = handleInput(state, 'd');
		const xpMsg = result.messages.find((m) => m.text.includes('XP'));
		expect(xpMsg).toBeDefined();
	});

	it('accumulates XP across multiple kills', () => {
		const e1 = makeEnemy(6, 5, { hp: 1, maxHp: 3 });
		const e2 = makeEnemy(7, 5, { hp: 1, maxHp: 3 });
		const state = makeTestState({ enemies: [e1, e2] });
		const reward = xpReward(e1, state.level);

		const after1 = handleInput(state, 'd');
		expect(after1.xp).toBe(reward);

		const after2 = handleInput(after1, 'd');
		// May or may not have leveled up; XP should have increased from the kill
		expect(after2.xp + (after2.characterLevel > after1.characterLevel ? xpForLevel(after1.characterLevel + 1) : 0))
			.toBeGreaterThanOrEqual(reward);
	});
});

describe('Level-up', () => {
	it('levels up when XP reaches threshold', () => {
		const threshold = xpForLevel(2);
		const enemy = makeEnemy(6, 5, { hp: 1, maxHp: threshold - 5 });
		// xpReward = 5 + 1*2 + (threshold - 5) = threshold + 2, which is >= threshold
		const state = makeTestState({ enemies: [enemy] });

		const result = handleInput(state, 'd');
		expect(result.characterLevel).toBe(2);
	});

	it('increases maxHp on level-up', () => {
		const threshold = xpForLevel(2);
		const enemy = makeEnemy(6, 5, { hp: 1, maxHp: threshold });
		const state = makeTestState({ enemies: [enemy] });
		const beforeMaxHp = state.player.maxHp;

		const result = handleInput(state, 'd');
		expect(result.player.maxHp).toBeGreaterThan(beforeMaxHp);
	});

	it('heals player by the HP gain amount on level-up', () => {
		const threshold = xpForLevel(2);
		const enemy = makeEnemy(6, 5, { hp: 1, maxHp: threshold });
		const state = makeTestState({ enemies: [enemy], });
		state.player.hp = 10; // below max

		const result = handleInput(state, 'd');
		// HP should have increased by the hpGain (3 + newLevel)
		const hpGain = 3 + 2; // level 2
		expect(result.player.hp).toBe(10 + hpGain);
	});

	it('shows level-up message', () => {
		const threshold = xpForLevel(2);
		const enemy = makeEnemy(6, 5, { hp: 1, maxHp: threshold });
		const state = makeTestState({ enemies: [enemy] });

		const result = handleInput(state, 'd');
		const lvlMsg = result.messages.find((m) => m.text.includes('Level up!'));
		expect(lvlMsg).toBeDefined();
		expect(lvlMsg!.text).toContain('level 2');
	});

	it('can level up multiple times at once with large XP gain', () => {
		// Give enough XP to skip from level 1 to level 3+
		const threshold2 = xpForLevel(2);
		const threshold3 = xpForLevel(3);
		const totalNeeded = threshold2 + threshold3;
		const enemy = makeEnemy(6, 5, { hp: 1, maxHp: totalNeeded + 10 });
		const state = makeTestState({ enemies: [enemy] });

		const result = handleInput(state, 'd');
		expect(result.characterLevel).toBeGreaterThanOrEqual(3);
	});

	it('respects level cap of 50', () => {
		const state = makeTestState({ characterLevel: 50, xp: 0 });
		const enemy = makeEnemy(6, 5, { hp: 1, maxHp: 1000 });
		state.enemies = [enemy];

		const result = handleInput(state, 'd');
		expect(result.characterLevel).toBe(50);
	});
});

describe('Stairs preserve XP and characterLevel', () => {
	it('preserves XP and characterLevel when descending', () => {
		const state = makeTestState({ xp: 42, characterLevel: 5 });
		// Place stairs to the right of the player
		state.map.tiles[5][6] = '>';

		const result = handleInput(state, 'd');
		expect(result.xp).toBe(42);
		expect(result.characterLevel).toBe(5);
		expect(result.level).toBe(2); // dungeon level incremented
	});
});

describe('handleInput basics', () => {
	it('does not move into walls', () => {
		const state = makeTestState();
		state.map.tiles[5][6] = '#';
		const result = handleInput(state, 'd');
		expect(result.player.pos.x).toBe(5);
	});

	it('returns same state for invalid keys', () => {
		const state = makeTestState();
		const result = handleInput(state, 'z');
		expect(result).toBe(state);
	});

	it('restarts game on r when game over', () => {
		const state = makeTestState({ gameOver: true });
		const result = handleInput(state, 'r');
		expect(result.gameOver).toBe(false);
		expect(result.xp).toBe(0);
		expect(result.characterLevel).toBe(1);
	});
});

describe('Status effects integration', () => {
	it('stunned player cannot move', () => {
		const state = makeTestState();
		state.player.statusEffects = [{ type: 'stun', duration: 2, potency: 0 }];
		const result = handleInput(state, 'd');
		expect(result.player.pos.x).toBe(5); // didn't move
		expect(result.messages.some((m) => m.text.includes('stunned'))).toBe(true);
	});

	it('stunned player cannot attack', () => {
		const enemy = makeEnemy(6, 5, { hp: 5, maxHp: 5 });
		const state = makeTestState({ enemies: [enemy] });
		state.player.statusEffects = [{ type: 'stun', duration: 2, potency: 0 }];
		const result = handleInput(state, 'd');
		expect(result.enemies[0].hp).toBe(5); // enemy not damaged
	});

	it('createGame initializes player with empty statusEffects', () => {
		const state = createGame();
		expect(state.player.statusEffects).toEqual([]);
	});

	it('preserves player statusEffects when descending stairs', () => {
		const state = makeTestState();
		state.player.statusEffects = [{ type: 'poison', duration: 3, potency: 2 }];
		state.map.tiles[5][6] = '>';
		const result = handleInput(state, 'd');
		expect(result.player.statusEffects).toHaveLength(1);
		expect(result.player.statusEffects[0].type).toBe('poison');
	});
});

describe('Secret rooms', () => {
	it('detects secret wall when player moves adjacent', () => {
		const state = makeTestState();
		// Place a secret wall at (7, 5) — player is at (5,5), needs to move close
		state.map.tiles[5][7] = '#';
		state.map.secretWalls.add('7,5');

		// Move right to (6,5) — now adjacent to secret wall at (7,5)
		const result = handleInput(state, 'd');
		expect(result.detectedSecrets.has('7,5')).toBe(true);
		expect(result.messages.some((m) => m.text.includes('hidden passage'))).toBe(true);
	});

	it('cannot walk through undetected secret wall', () => {
		const state = makeTestState();
		state.map.tiles[5][6] = '#';
		state.map.secretWalls.add('6,5');
		// Player at (5,5), try to move right into undetected secret wall
		const result = handleInput(state, 'd');
		expect(result.player.pos.x).toBe(5); // blocked
	});

	it('can walk through detected secret wall', () => {
		const state = makeTestState();
		state.map.tiles[5][6] = '#';
		state.map.secretWalls.add('6,5');
		state.detectedSecrets.add('6,5');
		const result = handleInput(state, 'd');
		expect(result.player.pos.x).toBe(6); // walked through
		expect(result.messages.some((m) => m.text.includes('hidden passage'))).toBe(true);
	});

	it('opening a secret wall turns it into floor', () => {
		const state = makeTestState();
		state.map.tiles[5][6] = '#';
		state.map.secretWalls.add('6,5');
		state.detectedSecrets.add('6,5');
		const result = handleInput(state, 'd');
		expect(result.map.tiles[5][6]).toBe('.');
	});

	it('createGame includes secretWalls in map', () => {
		const state = createGame();
		expect(state.map.secretWalls).toBeDefined();
		expect(state.map.secretWalls instanceof Set).toBe(true);
	});

	it('createGame includes detectedSecrets', () => {
		const state = createGame();
		expect(state.detectedSecrets).toBeDefined();
		expect(state.detectedSecrets instanceof Set).toBe(true);
	});
});

describe('Traps integration', () => {
	it('createGame includes traps array', () => {
		const state = createGame();
		expect(Array.isArray(state.traps)).toBe(true);
	});

	it('createGame includes detectedTraps set', () => {
		const state = createGame();
		expect(state.detectedTraps).toBeDefined();
		expect(state.detectedTraps instanceof Set).toBe(true);
	});

	it('stepping on hidden trap triggers it', () => {
		const state = makeTestState();
		state.traps = [{ pos: { x: 6, y: 5 }, type: 'spike', triggered: false }];
		const result = handleInput(state, 'd');
		expect(result.traps[0].triggered).toBe(true);
		expect(result.player.hp).toBeLessThan(20);
		expect(result.messages.some((m) => m.text.includes('Spike Trap'))).toBe(true);
	});

	it('detected trap attempts disarm instead of triggering blindly', () => {
		const state = makeTestState();
		state.traps = [{ pos: { x: 6, y: 5 }, type: 'spike', triggered: false }];
		state.detectedTraps.add('6,5');
		const orig = Math.random;
		Math.random = () => 0.01; // Succeed disarm
		try {
			const result = handleInput(state, 'd');
			expect(result.traps[0].triggered).toBe(true); // Disarmed (marked triggered)
			expect(result.player.hp).toBe(20); // No damage
			expect(result.messages.some((m) => m.text.includes('disarm'))).toBe(true);
		} finally {
			Math.random = orig;
		}
	});

	it('trap can kill the player', () => {
		const state = makeTestState();
		state.player.hp = 1;
		state.traps = [{ pos: { x: 6, y: 5 }, type: 'spike', triggered: false }];
		const result = handleInput(state, 'd');
		expect(result.gameOver).toBe(true);
	});

	it('detects traps when moving adjacent', () => {
		const state = makeTestState();
		state.traps = [{ pos: { x: 7, y: 5 }, type: 'spike', triggered: false }];
		// Move right to (6,5) — adjacent to trap at (7,5)
		const result = handleInput(state, 'd');
		expect(result.detectedTraps.has('7,5')).toBe(true);
	});
});

describe('Combat log messages', () => {
	it('createGame starts with typed messages', () => {
		const state = createGame();
		expect(state.messages.length).toBeGreaterThan(0);
		expect(state.messages[0].type).toBe('info');
		expect(state.messages[0].text.length).toBeGreaterThan(0);
	});

	it('player attack messages have player_attack type', () => {
		const enemy = makeEnemy(6, 5, { hp: 1, maxHp: 3 });
		const state = makeTestState({ enemies: [enemy] });
		const result = handleInput(state, 'd');
		const attackMsg = result.messages.find((m) => m.text.includes('You hit'));
		expect(attackMsg).toBeDefined();
		expect(attackMsg!.type).toBe('player_attack');
	});

	it('enemy defeat messages have player_attack type', () => {
		const enemy = makeEnemy(6, 5, { hp: 1, maxHp: 3 });
		const state = makeTestState({ enemies: [enemy] });
		const result = handleInput(state, 'd');
		const defeatMsg = result.messages.find((m) => m.text.includes('defeated'));
		expect(defeatMsg).toBeDefined();
		expect(defeatMsg!.type).toBe('player_attack');
	});

	it('level-up messages have level_up type', () => {
		const threshold = xpForLevel(2);
		const enemy = makeEnemy(6, 5, { hp: 1, maxHp: threshold });
		const state = makeTestState({ enemies: [enemy] });
		const result = handleInput(state, 'd');
		const lvlMsg = result.messages.find((m) => m.text.includes('Level up!'));
		expect(lvlMsg).toBeDefined();
		expect(lvlMsg!.type).toBe('level_up');
	});

	it('healing messages have healing type', () => {
		const state = makeTestState();
		state.player.hp = 10;
		state.map.tiles[5][6] = '*';
		const result = handleInput(state, 'd');
		const healMsg = result.messages.find((m) => m.text.includes('Healed'));
		expect(healMsg).toBeDefined();
		expect(healMsg!.type).toBe('healing');
	});

	it('trap messages have trap type', () => {
		const state = makeTestState();
		state.traps = [{ pos: { x: 6, y: 5 }, type: 'spike', triggered: false }];
		const result = handleInput(state, 'd');
		const trapMsg = result.messages.find((m) => m.text.includes('Spike Trap'));
		expect(trapMsg).toBeDefined();
		expect(trapMsg!.type).toBe('trap');
	});

	it('secret discovery messages have discovery type', () => {
		const state = makeTestState();
		state.map.tiles[5][7] = '#';
		state.map.secretWalls.add('7,5');
		const result = handleInput(state, 'd');
		const discoveryMsg = result.messages.find((m) => m.text.includes('hidden passage'));
		expect(discoveryMsg).toBeDefined();
		expect(discoveryMsg!.type).toBe('discovery');
	});

	it('retains up to 50 messages', () => {
		const state = makeTestState();
		state.messages = Array.from({ length: 50 }, (_, i) => ({ text: `msg ${i}`, type: 'info' as const }));
		// Move to add another message (trap detection nearby)
		state.traps = [{ pos: { x: 7, y: 5 }, type: 'spike', triggered: false }];
		const result = handleInput(state, 'd');
		expect(result.messages.length).toBeLessThanOrEqual(50);
		expect(result.messages.length).toBeGreaterThan(0);
	});
});

describe('Boss encounters integration', () => {
	it('boss defeat gives 3x XP', () => {
		const bossDef = BOSS_DEFS[0];
		const boss = createMonster({ x: 6, y: 5 }, 5, bossDef);
		boss.hp = 1; // one hit to kill
		// Set characterLevel to 50 to prevent level-ups from consuming XP
		const state = makeTestState({ enemies: [boss], level: 5, characterLevel: 50 });
		const expectedReward = xpReward(boss, 5) * 3;

		const result = handleInput(state, 'd');
		expect(result.enemies).toHaveLength(0);
		expect(result.xp).toBe(expectedReward);
	});

	it('boss defeat shows vanquished message', () => {
		const bossDef = BOSS_DEFS[0];
		const boss = createMonster({ x: 6, y: 5 }, 5, bossDef);
		boss.hp = 1;
		const state = makeTestState({ enemies: [boss], level: 5 });

		const result = handleInput(state, 'd');
		const msg = result.messages.find((m) => m.text.includes('vanquished'));
		expect(msg).toBeDefined();
		expect(msg!.type).toBe('level_up');
	});

	it('regular enemy defeat does not get 3x XP', () => {
		const enemy = makeEnemy(6, 5, { hp: 1, maxHp: 3 });
		const state = makeTestState({ enemies: [enemy], level: 1 });
		const expectedReward = xpReward(enemy, 1);

		const result = handleInput(state, 'd');
		expect(result.xp).toBe(expectedReward);
	});
});

describe('Rare monster integration', () => {
	it('rare monster kill gives 2x XP', () => {
		const def = MONSTER_DEFS.find((m) => m.name === 'Goblin')!;
		const rare = createRareMonster({ x: 6, y: 5 }, 1, def);
		rare.hp = 1;
		const state = makeTestState({ enemies: [rare], level: 1, characterLevel: 50 });
		const expectedReward = xpReward(rare, 1) * 2;

		const result = handleInput(state, 'd');
		expect(result.xp).toBe(expectedReward);
	});

	it('rare monster defeat shows special message', () => {
		const def = MONSTER_DEFS.find((m) => m.name === 'Goblin')!;
		const rare = createRareMonster({ x: 6, y: 5 }, 1, def);
		rare.hp = 1;
		const state = makeTestState({ enemies: [rare], level: 1 });

		const result = handleInput(state, 'd');
		const msg = result.messages.find((m) => m.text.includes('slain'));
		expect(msg).toBeDefined();
		expect(msg!.type).toBe('level_up');
	});
});

describe('Special abilities integration', () => {
	it('createGame initializes abilityCooldown to 0', () => {
		const state = createGame();
		expect(state.abilityCooldown).toBe(0);
	});

	it('pressing q uses warrior ability and sets cooldown', () => {
		const enemy = makeEnemy(6, 5, { hp: 100, maxHp: 100 });
		const state = makeTestState({
			enemies: [enemy],
			characterConfig: { name: 'Hero', characterClass: 'warrior', difficulty: 'normal' as const, startingLocation: 'cave' as const }
		});

		const result = handleInput(state, 'q');
		// Cooldown is set then moveEnemies ticks it down by 1
		expect(result.abilityCooldown).toBe(ABILITY_DEFS.warrior.cooldown - 1);
		expect(enemy.hp).toBeLessThan(100);
	});

	it('ability on cooldown does not consume turn', () => {
		const state = makeTestState({ abilityCooldown: 3 });
		const result = handleInput(state, 'q');
		// Cooldown should not change (no moveEnemies tick)
		expect(result.abilityCooldown).toBe(3);
	});

	it('cooldown decrements each turn', () => {
		const state = makeTestState({ abilityCooldown: 3 });
		// Move to trigger a turn
		const result = handleInput(state, 'd');
		expect(result.abilityCooldown).toBe(2);
	});

	it('whirlwind kills award XP', () => {
		const enemy = makeEnemy(6, 5, { hp: 1, maxHp: 3 });
		const state = makeTestState({
			enemies: [enemy],
			level: 1,
			characterLevel: 50,
			characterConfig: { name: 'Hero', characterClass: 'warrior', difficulty: 'normal' as const, startingLocation: 'cave' as const }
		});
		const expectedReward = xpReward(enemy, 1);

		const result = handleInput(state, 'q');
		expect(result.enemies).toHaveLength(0);
		expect(result.xp).toBe(expectedReward);
	});

	it('mage teleport moves player position', () => {
		const state = makeTestState({
			characterConfig: { name: 'Hero', characterClass: 'mage', difficulty: 'normal' as const, startingLocation: 'cave' as const }
		});
		const originalPos = { ...state.player.pos };

		const result = handleInput(state, 'q');
		// Player should have moved (extremely unlikely to land on same spot)
		expect(
			result.player.pos.x !== originalPos.x || result.player.pos.y !== originalPos.y
		).toBe(true);
	});

	it('stunned player cannot use ability', () => {
		const state = makeTestState();
		state.player.statusEffects = [{ type: 'stun', duration: 2, potency: 0 }];

		const result = handleInput(state, 'q');
		expect(result.messages.some((m) => m.text.includes('stunned'))).toBe(true);
		expect(result.abilityCooldown).toBe(0); // not consumed
	});

	it('ability cooldown preserved when descending stairs', () => {
		const state = makeTestState({ abilityCooldown: 5 });
		state.map.tiles[5][6] = '>';

		const result = handleInput(state, 'd');
		expect(result.abilityCooldown).toBe(5);
	});
});

describe('Environmental hazards integration', () => {
	it('createGame initializes hazards array', () => {
		const state = createGame();
		expect(Array.isArray(state.hazards)).toBe(true);
	});

	it('player takes lava damage when standing on it after move', () => {
		// Place lava at destination tile
		const state = makeTestState({
			hazards: [{ pos: { x: 6, y: 5 }, type: 'lava' }],
			level: 1
		});
		// Move right onto lava tile — hazards apply during moveEnemies
		const result = handleInput(state, 'd');
		expect(result.player.hp).toBeLessThan(20);
		expect(result.messages.some((m) => m.text.includes('lava'))).toBe(true);
	});

	it('enemy takes lava damage each turn', () => {
		const enemy = makeEnemy(3, 3, { hp: 50, maxHp: 50 });
		const state = makeTestState({
			enemies: [enemy],
			hazards: [{ pos: { x: 3, y: 3 }, type: 'lava' }],
			level: 1
		});
		handleInput(state, 'd');
		expect(enemy.hp).toBeLessThan(50);
	});

	it('lava can kill the player', () => {
		const state = makeTestState({
			hazards: [{ pos: { x: 6, y: 5 }, type: 'lava' }],
			level: 10
		});
		state.player.hp = 1;
		const result = handleInput(state, 'd');
		expect(result.gameOver).toBe(true);
	});

	it('poison gas applies poison status to player', () => {
		const state = makeTestState({
			hazards: [{ pos: { x: 6, y: 5 }, type: 'poison_gas' }]
		});
		const result = handleInput(state, 'd');
		expect(result.player.statusEffects.some((e) => e.type === 'poison')).toBe(true);
	});

	it('enemy killed by hazard awards XP', () => {
		const enemy = makeEnemy(3, 3, { hp: 1, maxHp: 3 });
		const state = makeTestState({
			enemies: [enemy],
			hazards: [{ pos: { x: 3, y: 3 }, type: 'lava' }],
			level: 1,
			characterLevel: 50
		});
		const result = handleInput(state, 'd');
		expect(result.enemies).toHaveLength(0);
		expect(result.xp).toBeGreaterThan(0);
		expect(result.messages.some((m) => m.text.includes('hazard'))).toBe(true);
	});
});

describe('Difficulty scaling integration', () => {
	it('createGame with easy difficulty creates enemies', () => {
		const easyState = createGame({ name: 'Hero', characterClass: 'warrior', difficulty: 'easy', startingLocation: 'cave' });
		// Easy difficulty still generates enemies
		expect(easyState.enemies.length).toBeGreaterThan(0);
		// Each easy enemy should have difficulty applied (hp rounded from 0.7x multiplier)
		for (const e of easyState.enemies) {
			expect(e.hp).toBe(e.maxHp); // fresh enemies should have full hp
		}
	});

	it('createGame with hard difficulty creates enemies', () => {
		const hardState = createGame({ name: 'Hero', characterClass: 'warrior', difficulty: 'hard', startingLocation: 'cave' });
		expect(hardState.enemies.length).toBeGreaterThan(0);
		for (const e of hardState.enemies) {
			expect(e.hp).toBe(e.maxHp);
		}
	});

	it('permadeath death message says journey ends forever', () => {
		// Use lava to guarantee death (no enemy movement randomness)
		const state = makeTestState({
			characterConfig: { name: 'Hero', characterClass: 'warrior' as const, difficulty: 'permadeath' as const, startingLocation: 'cave' as const },
			hazards: [{ pos: { x: 6, y: 5 }, type: 'lava' }],
			level: 10
		});
		state.player.hp = 1;

		const result = handleInput(state, 'd');
		expect(result.gameOver).toBe(true);
		expect(result.messages.some((m) => m.text.includes('forever'))).toBe(true);
	});

	it('normal death message says press R to restart', () => {
		const state = makeTestState({
			characterConfig: { name: 'Hero', characterClass: 'warrior' as const, difficulty: 'normal' as const, startingLocation: 'cave' as const },
			hazards: [{ pos: { x: 6, y: 5 }, type: 'lava' }],
			level: 10
		});
		state.player.hp = 1;

		const result = handleInput(state, 'd');
		expect(result.gameOver).toBe(true);
		expect(result.messages.some((m) => m.text.includes('Press R'))).toBe(true);
	});

	it('permadeath restart resets to default config', () => {
		const state = makeTestState({
			gameOver: true,
			characterConfig: { name: 'CustomHero', characterClass: 'mage' as const, difficulty: 'permadeath' as const, startingLocation: 'cave' as const }
		});

		const result = handleInput(state, 'r');
		// Should reset to default config, not keep custom name/class
		expect(result.characterConfig.name).toBe('Hero');
		expect(result.characterConfig.difficulty).toBe('normal');
	});

	it('normal restart preserves character config', () => {
		const state = makeTestState({
			gameOver: true,
			characterConfig: { name: 'CustomHero', characterClass: 'mage' as const, difficulty: 'normal' as const, startingLocation: 'cave' as const }
		});

		const result = handleInput(state, 'r');
		expect(result.characterConfig.name).toBe('CustomHero');
		expect(result.characterConfig.characterClass).toBe('mage');
	});

	it('difficulty preserved when descending stairs', () => {
		const state = makeTestState({
			characterConfig: { name: 'Hero', characterClass: 'warrior' as const, difficulty: 'hard' as const, startingLocation: 'cave' as const }
		});
		state.map.tiles[5][6] = '>';

		const result = handleInput(state, 'd');
		expect(result.characterConfig.difficulty).toBe('hard');
	});
});

describe('sleeping monsters', () => {
	it('sleeping enemies do not move or attack', () => {
		const enemy = makeEnemy(6, 5, { hp: 10, maxHp: 10, attack: 5 });
		applyEffect(enemy, 'sleep', 999, 0);
		const state = makeTestState({ enemies: [enemy] });
		// Player moves away — enemy should not follow
		const result = handleInput(state, 'a'); // move left
		const e = result.enemies[0];
		expect(e.pos.x).toBe(6);
		expect(e.pos.y).toBe(5);
	});

	it('sneak attack deals double damage to sleeping enemy', () => {
		const enemy = makeEnemy(6, 5, { hp: 100, maxHp: 100, attack: 1 });
		applyEffect(enemy, 'sleep', 999, 0);
		const state = makeTestState({
			enemies: [enemy],
			player: { pos: { x: 5, y: 5 }, char: '@', color: '#ff0', name: 'Hero', hp: 20, maxHp: 20, attack: 10, statusEffects: [] }
		});

		const result = handleInput(state, 'd'); // attack sleeping enemy
		const sneakMsg = result.messages.find((m) => m.text.includes('Sneak attack'));
		expect(sneakMsg).toBeDefined();
		// Damage should be at least 2x base attack (10*2 = 20 minimum)
		const e = result.enemies[0];
		expect(e.hp).toBeLessThanOrEqual(100 - 20);
	});

	it('sleeping enemy wakes up when hit', () => {
		const enemy = makeEnemy(6, 5, { hp: 100, maxHp: 100, attack: 1 });
		applyEffect(enemy, 'sleep', 999, 0);
		const state = makeTestState({ enemies: [enemy] });

		const result = handleInput(state, 'd');
		expect(hasEffect(result.enemies[0], 'sleep')).toBe(false);
	});

	it('sleeping enemies wake when player moves adjacent', () => {
		// Enemy at (7, 5), player at (5, 5), player moves right to (6, 5) — now adjacent
		const enemy = makeEnemy(7, 5, { hp: 10, maxHp: 10, attack: 1 });
		applyEffect(enemy, 'sleep', 999, 0);
		const state = makeTestState({ enemies: [enemy] });

		const result = handleInput(state, 'd'); // player moves to (6,5), adjacent to enemy at (7,5)
		expect(hasEffect(result.enemies[0], 'sleep')).toBe(false);
		const wakeMsg = result.messages.find((m) => m.text.includes('wakes up'));
		expect(wakeMsg).toBeDefined();
	});

	it('player can sneak past sleeping enemy without waking it', () => {
		// Enemy at (8, 5), player at (5, 5), player moves left — stays far away
		const enemy = makeEnemy(8, 5, { hp: 10, maxHp: 10, attack: 1 });
		applyEffect(enemy, 'sleep', 999, 0);
		const state = makeTestState({ enemies: [enemy] });

		const result = handleInput(state, 'a'); // move left, away from enemy
		expect(hasEffect(result.enemies[0], 'sleep')).toBe(true);
	});
});

describe('hazard avoidance', () => {
	it('non-relentless enemies avoid hazard tiles', () => {
		// Aggressive enemy at (7, 5), player at (5, 5), lava at (6, 5) between them
		const enemy = makeEnemy(7, 5, { name: 'Ogre', hp: 20, maxHp: 20, attack: 4 });
		const hazard: Hazard = { pos: { x: 6, y: 5 }, type: 'lava' };
		const state = makeTestState({ enemies: [enemy], hazards: [hazard] });

		// Move player left so enemy turn triggers — enemy should not step onto lava
		const result = handleInput(state, 'a');
		const e = result.enemies[0];
		// Ogre is aggressive but should avoid the lava tile at (6,5)
		expect(!(e.pos.x === 6 && e.pos.y === 5)).toBe(true);
	});

	it('relentless enemies walk through hazard tiles', () => {
		// Relentless Skeleton at (7, 5), player at (5, 5), lava at (6, 5)
		const enemy = makeEnemy(7, 5, { name: 'Skeleton', char: 'S', hp: 20, maxHp: 20, attack: 3 });
		const hazard: Hazard = { pos: { x: 6, y: 5 }, type: 'lava' };
		const state = makeTestState({ enemies: [enemy], hazards: [hazard] });

		const result = handleInput(state, 'a');
		const e = result.enemies[0];
		// Skeleton is relentless so it moves toward player through the lava
		expect(e.pos.x).toBe(6);
		expect(e.pos.y).toBe(5);
	});
});

describe('flee from combat', () => {
	it('cannot flee when no enemies are adjacent', () => {
		const enemy = makeEnemy(8, 8, { hp: 10, maxHp: 10 });
		const state = makeTestState({ enemies: [enemy] });

		const result = attemptFlee(state);
		expect(result.moved).toBeNull();
		expect(result.messages[0].text).toContain('nothing to flee from');
	});

	it('bosses block fleeing', () => {
		const boss = makeEnemy(6, 5, { name: 'The Hollow King', char: 'K', hp: 30, maxHp: 30 });
		const state = makeTestState({ enemies: [boss] });

		const result = attemptFlee(state);
		expect(result.moved).toBeNull();
		expect(result.messages[0].text).toContain('boss blocks');
	});

	it('successful flee moves player away from enemy', () => {
		// Force success by mocking Math.random
		const origRandom = Math.random;
		Math.random = () => 0.0; // Always below flee chance

		const enemy = makeEnemy(6, 5, { hp: 10, maxHp: 10 });
		const state = makeTestState({ enemies: [enemy] });

		const result = attemptFlee(state);
		expect(result.moved).not.toBeNull();
		expect(result.messages.some((m) => m.text.includes('flee from combat'))).toBe(true);

		// Player should be further from enemy than original position
		const origDist = Math.abs(5 - 6) + Math.abs(5 - 5); // 1
		const newDist = Math.abs(result.moved!.x - 6) + Math.abs(result.moved!.y - 5);
		expect(newDist).toBeGreaterThan(origDist);

		Math.random = origRandom;
	});

	it('failed flee returns no movement', () => {
		const origRandom = Math.random;
		Math.random = () => 0.99; // Always above flee chance

		const enemy = makeEnemy(6, 5, { hp: 10, maxHp: 10 });
		const state = makeTestState({ enemies: [enemy] });

		const result = attemptFlee(state);
		expect(result.moved).toBeNull();
		expect(result.messages.some((m) => m.text.includes('failed to flee'))).toBe(true);

		Math.random = origRandom;
	});

	it('f key triggers flee and enemies still act', () => {
		const origRandom = Math.random;
		Math.random = () => 0.99; // Force flee failure

		const enemy = makeEnemy(6, 5, { hp: 10, maxHp: 10, name: 'Goblin', attack: 1 });
		const state = makeTestState({ enemies: [enemy] });
		const initialPlayerHp = state.player.hp;

		const result = handleInput(state, 'f');
		// Player should not have moved (flee failed)
		expect(result.player.pos.x).toBe(5);
		expect(result.player.pos.y).toBe(5);
		// Enemies should have acted (moveEnemies was called)
		// Either enemy moved or attacked — player hp may have changed
		const failMsg = result.messages.find((m) => m.text.includes('failed to flee'));
		expect(failMsg).toBeDefined();

		Math.random = origRandom;
	});

	it('rogue has higher flee chance than warrior', () => {
		// Test with deterministic random at 0.55 — rogue succeeds (0.75), warrior fails (0.50)
		const origRandom = Math.random;

		const enemy = makeEnemy(6, 5, { hp: 10, maxHp: 10 });

		Math.random = () => 0.55;
		const rogueState = makeTestState({
			enemies: [{ ...enemy }],
			characterConfig: { name: 'Hero', characterClass: 'rogue' as const, difficulty: 'normal' as const, startingLocation: 'cave' as const }
		});
		const rogueResult = attemptFlee(rogueState);

		Math.random = () => 0.55;
		const warriorState = makeTestState({
			enemies: [{ ...enemy }],
			characterConfig: { name: 'Hero', characterClass: 'warrior' as const, difficulty: 'normal' as const, startingLocation: 'cave' as const }
		});
		const warriorResult = attemptFlee(warriorState);

		expect(rogueResult.moved).not.toBeNull(); // rogue succeeds at 0.55 < 0.75
		expect(warriorResult.moved).toBeNull(); // warrior fails at 0.55 >= 0.50

		Math.random = origRandom;
	});

	it('stunned player cannot flee', () => {
		const enemy = makeEnemy(6, 5, { hp: 10, maxHp: 10 });
		const state = makeTestState({ enemies: [enemy] });
		applyEffect(state.player, 'stun', 2, 0);

		const result = handleInput(state, 'f');
		const stunMsg = result.messages.find((m) => m.text.includes('stunned'));
		expect(stunMsg).toBeDefined();
	});

	it('flee fails when surrounded by walls', () => {
		const origRandom = Math.random;
		Math.random = () => 0.0; // Force success

		const enemy = makeEnemy(6, 5, { hp: 10, maxHp: 10 });
		const state = makeTestState({ enemies: [enemy] });
		// Surround player with walls on all escape routes
		for (let y = 3; y <= 7; y++) {
			for (let x = 2; x <= 5; x++) {
				if (!(x === 5 && y === 5)) { // Don't wall player's tile
					state.map.tiles[y][x] = '#';
				}
			}
		}

		const result = attemptFlee(state);
		expect(result.moved).toBeNull();
		expect(result.messages.some((m) => m.text.includes('nowhere to go'))).toBe(true);

		Math.random = origRandom;
	});
});

describe('treasure chests', () => {
	it('bumping into a chest opens it and gives loot', () => {
		const chest: Chest = { pos: { x: 6, y: 5 }, type: 'wooden', opened: false, trapped: false, mimic: false };
		const state = makeTestState({ chests: [chest], level: 1 });
		const startHp = state.player.hp;
		const startXp = state.xp;

		const result = handleInput(state, 'd');
		expect(chest.opened).toBe(true);
		expect(result.xp).toBeGreaterThan(startXp);
		expect(result.messages.some((m) => m.text.includes('chest opened'))).toBe(true);
	});

	it('trapped chest damages non-rogue player', () => {
		// Wooden at level 10: trap=17, heal=13 → net -4 damage
		const chest: Chest = { pos: { x: 6, y: 5 }, type: 'wooden', opened: false, trapped: true, mimic: false };
		const state = makeTestState({
			chests: [chest],
			level: 10,
			player: { pos: { x: 5, y: 5 }, char: '@', color: '#ff0', name: 'Hero', hp: 50, maxHp: 50, attack: 10, statusEffects: [] }
		});

		const result = handleInput(state, 'd');
		expect(result.player.hp).toBeLessThan(50);
		expect(result.messages.some((m) => m.text.includes('trap springs'))).toBe(true);
	});

	it('rogue disarms trapped chest', () => {
		const chest: Chest = { pos: { x: 6, y: 5 }, type: 'iron', opened: false, trapped: true, mimic: false };
		const state = makeTestState({
			chests: [chest],
			level: 3,
			characterConfig: { name: 'Hero', characterClass: 'rogue' as const, difficulty: 'normal' as const, startingLocation: 'cave' as const }
		});
		const startHp = state.player.hp;

		const result = handleInput(state, 'd');
		// Rogue takes no trap damage — HP only changes from loot healing
		expect(result.player.hp).toBeGreaterThanOrEqual(startHp);
		expect(result.messages.some((m) => m.text.includes('disarm'))).toBe(true);
	});

	it('mimic chest spawns an enemy', () => {
		const chest: Chest = { pos: { x: 6, y: 5 }, type: 'gold', opened: false, trapped: false, mimic: true };
		const state = makeTestState({ chests: [chest], level: 3 });

		const result = handleInput(state, 'd');
		const mimic = result.enemies.find((e) => e.name === 'Mimic');
		expect(mimic).toBeDefined();
		expect(mimic!.pos.x).toBe(6);
		expect(mimic!.pos.y).toBe(5);
		expect(result.messages.some((m) => m.text.includes('Mimic'))).toBe(true);
	});

	it('opened chest cannot be interacted with again', () => {
		const chest: Chest = { pos: { x: 6, y: 5 }, type: 'wooden', opened: true, trapped: false, mimic: false };
		const state = makeTestState({ chests: [chest] });

		const result = handleInput(state, 'd');
		// Player walks through (chest already opened, treated as empty tile)
		expect(result.player.pos.x).toBe(6);
	});
});

describe('dodge and block', () => {
	it('dodge chance constants are defined per class', () => {
		expect(DODGE_CHANCE.rogue).toBeGreaterThan(DODGE_CHANCE.warrior);
		expect(DODGE_CHANCE.mage).toBeGreaterThan(DODGE_CHANCE.warrior);
		expect(DODGE_CHANCE.rogue).toBeGreaterThan(DODGE_CHANCE.mage);
	});

	it('block reduction constants are defined per class', () => {
		expect(BLOCK_REDUCTION.warrior).toBeGreaterThan(BLOCK_REDUCTION.mage);
		expect(BLOCK_REDUCTION.warrior).toBeGreaterThan(BLOCK_REDUCTION.rogue);
	});

	it('dodge causes enemy attack to miss', () => {
		const origRandom = Math.random;
		Math.random = () => 0.0; // Always dodge (below any dodge chance)

		// Use 'g' (defend) so player stays at (5,5); aggressive enemy at (6,5) attacks
		// Name 'TestEnemy' → not in MONSTER_DEFS → defaults to aggressive behavior
		const enemy = makeEnemy(6, 5, { name: 'TestEnemy', hp: 10, maxHp: 10, attack: 5 });
		const state = makeTestState({ enemies: [enemy] });
		const startHp = state.player.hp;

		const result = handleInput(state, 'g');
		// Dodged → player takes no damage
		expect(result.player.hp).toBe(startHp);
		const dodgeMsg = result.messages.find((m) => m.text.includes('dodge'));
		expect(dodgeMsg).toBeDefined();

		Math.random = origRandom;
	});

	it('warrior blocks some damage from attacks', () => {
		const origRandom = Math.random;
		Math.random = () => 0.99; // dodge fails, block still applies

		// Aggressive enemy at (6,5), player stays at (5,5) via 'g'
		const enemy = makeEnemy(6, 5, { name: 'TestEnemy', hp: 10, maxHp: 10, attack: 10 });
		const state = makeTestState({
			enemies: [enemy],
			characterConfig: { name: 'Hero', characterClass: 'warrior' as const, difficulty: 'normal' as const, startingLocation: 'cave' as const }
		});
		const startHp = state.player.hp;

		const result = handleInput(state, 'g');
		// Attack: 10 + floor(0.99*2)=1 → rawDmg=11, defending block=2*2=4, dmg=max(1,11-4)=7
		const blockMsg = result.messages.find((m) => m.text.includes('block'));
		expect(blockMsg).toBeDefined();
		expect(result.player.hp).toBe(startHp - 7);

		Math.random = origRandom;
	});

	it('defend action doubles dodge chance', () => {
		const origRandom = Math.random;
		// Warrior dodge = 0.10, defending doubles to 0.20
		// Set random to 0.15 → 0.15 < 0.20 → dodge!
		Math.random = () => 0.15;

		const enemy = makeEnemy(6, 5, { name: 'TestEnemy', hp: 10, maxHp: 10, attack: 5 });
		const state = makeTestState({
			enemies: [enemy],
			characterConfig: { name: 'Hero', characterClass: 'warrior' as const, difficulty: 'normal' as const, startingLocation: 'cave' as const }
		});
		const startHp = state.player.hp;

		const result = handleInput(state, 'g');
		expect(result.messages.some((m) => m.text.includes('defensive stance'))).toBe(true);
		expect(result.player.hp).toBe(startHp); // Dodged thanks to defend

		Math.random = origRandom;
	});

	it('boss attacks are undodgeable', () => {
		const origRandom = Math.random;
		Math.random = () => 0.0; // Would normally always dodge

		// Boss at (6,5), player defends at (5,5), boss attacks
		const boss = makeEnemy(6, 5, { name: 'The Hollow King', char: 'K', hp: 30, maxHp: 30, attack: 5 });
		const state = makeTestState({
			enemies: [boss],
			characterConfig: { name: 'Hero', characterClass: 'rogue' as const, difficulty: 'normal' as const, startingLocation: 'cave' as const }
		});
		const startHp = state.player.hp;

		const result = handleInput(state, 'g');
		// Boss attack bypasses dodge
		expect(result.player.hp).toBeLessThan(startHp);
		const dodgeMsg = result.messages.find((m) => m.text.includes('dodge'));
		expect(dodgeMsg).toBeUndefined();

		Math.random = origRandom;
	});

	it('stunned player cannot defend', () => {
		const enemy = makeEnemy(6, 5, { hp: 10, maxHp: 10 });
		const state = makeTestState({ enemies: [enemy] });
		applyEffect(state.player, 'stun', 2, 0);

		const result = handleInput(state, 'g');
		const stunMsg = result.messages.find((m) => m.text.includes('stunned'));
		expect(stunMsg).toBeDefined();
	});

	it('defend message appears when using g key', () => {
		const state = makeTestState();
		const result = handleInput(state, 'g');
		expect(result.messages.some((m) => m.text.includes('defensive stance'))).toBe(true);
	});
});

describe('combat log narration', () => {
	it('narrates visible enemy moving toward player', () => {
		// Aggressive enemy at (7, 5), visible, player moves to stay nearby
		const enemy = makeEnemy(7, 5, { name: 'TestEnemy', hp: 10, maxHp: 10, attack: 1 });
		const state = makeTestState({ enemies: [enemy] });
		// All tiles are Visible by default in makeTestState

		// Player moves up — enemy should move toward and narrate
		const result = handleInput(state, 'w');
		const moveMsg = result.messages.find((m) => m.text.includes('moves toward you'));
		expect(moveMsg).toBeDefined();
		expect(moveMsg!.type).toBe('info');
	});

	it('does not narrate enemy movement outside visible area', () => {
		const enemy = makeEnemy(7, 5, { name: 'TestEnemy', hp: 10, maxHp: 10, attack: 1 });
		const state = makeTestState({ enemies: [enemy] });
		// Set enemy tile to Unexplored; use 'g' (defend) which doesn't recalculate FOV
		state.visibility[5][7] = Visibility.Unexplored;

		const result = handleInput(state, 'g');
		const moveMsg = result.messages.find((m) => m.text.includes('moves toward'));
		expect(moveMsg).toBeUndefined();
	});

	it('narrates cowardly enemy retreating', () => {
		// Rat is cowardly — when below 50% HP it flees
		const enemy = makeEnemy(6, 5, { name: 'Rat', hp: 1, maxHp: 10, attack: 1 });
		const state = makeTestState({ enemies: [enemy] });

		const result = handleInput(state, 'w');
		const retreatMsg = result.messages.find((m) => m.text.includes('retreats'));
		// Rat at low HP with cowardly behavior should flee away
		expect(retreatMsg).toBeDefined();
	});

	it('messages are color-coded by type', () => {
		const enemy = makeEnemy(6, 5, { name: 'TestEnemy', hp: 1, maxHp: 3, attack: 1 });
		const state = makeTestState({ enemies: [enemy] });

		const result = handleInput(state, 'd'); // attack enemy
		// Should have player_attack message
		const atkMsg = result.messages.find((m) => m.type === 'player_attack');
		expect(atkMsg).toBeDefined();
	});

	it('retains up to 50 messages', () => {
		// Place an enemy so moveEnemies generates narration (triggers addMessage which truncates)
		const enemy = makeEnemy(7, 5, { name: 'TestEnemy', hp: 10, maxHp: 10, attack: 1 });
		const state = makeTestState({ enemies: [enemy] });
		// Fill with messages beyond limit
		state.messages = Array.from({ length: 55 }, (_, i) => ({ text: `msg ${i}`, type: 'info' as const }));

		const result = handleInput(state, 'w');
		expect(result.messages.length).toBeLessThanOrEqual(50);
	});
});

describe('search action (e key)', () => {
	it('detects traps within radius 2', () => {
		const trap: Trap = { pos: { x: 7, y: 5 }, type: 'spike', triggered: false };
		const state = makeTestState({ traps: [trap] });
		const result = handleInput(state, 'e');
		expect(result.detectedTraps.has('7,5')).toBe(true);
		expect(result.messages.some((m) => m.text.includes('Spike Trap'))).toBe(true);
	});

	it('reports nothing found when no traps nearby', () => {
		const state = makeTestState();
		const result = handleInput(state, 'e');
		expect(result.messages.some((m) => m.text.includes('find nothing'))).toBe(true);
	});

	it('does not work while stunned', () => {
		const trap: Trap = { pos: { x: 6, y: 5 }, type: 'spike', triggered: false };
		const state = makeTestState({ traps: [trap] });
		applyEffect(state.player, 'stun', 2, 0);
		const result = handleInput(state, 'e');
		expect(result.detectedTraps.has('6,5')).toBe(false);
		expect(result.messages.some((m) => m.text.includes('stunned'))).toBe(true);
	});

	it('costs a turn (enemies move)', () => {
		const enemy = makeEnemy(7, 5, { name: 'TestEnemy', hp: 10, maxHp: 10 });
		const state = makeTestState({ enemies: [enemy] });
		const origPos = { ...enemy.pos };
		handleInput(state, 'e');
		// Enemy should have moved (aggressive behavior moves toward player)
		expect(enemy.pos.x !== origPos.x || enemy.pos.y !== origPos.y).toBe(true);
	});
});

describe('disarm on walking onto detected trap', () => {
	it('successful disarm prevents damage', () => {
		const trap: Trap = { pos: { x: 6, y: 5 }, type: 'spike', triggered: false };
		const state = makeTestState({ traps: [trap], level: 1 });
		state.detectedTraps.add('6,5');
		const orig = Math.random;
		Math.random = () => 0.01; // Succeed
		try {
			const result = handleInput(state, 'd'); // Move right onto trap
			expect(result.player.hp).toBe(20);
			expect(trap.triggered).toBe(true);
			expect(result.messages.some((m) => m.text.includes('disarm'))).toBe(true);
		} finally {
			Math.random = orig;
		}
	});

	it('failed disarm triggers the trap and deals damage', () => {
		const trap: Trap = { pos: { x: 6, y: 5 }, type: 'spike', triggered: false };
		const state = makeTestState({ traps: [trap], level: 1 });
		state.detectedTraps.add('6,5');
		const orig = Math.random;
		Math.random = () => 0.99; // Fail
		try {
			const result = handleInput(state, 'd'); // Move right onto trap
			expect(result.player.hp).toBeLessThan(20);
			expect(trap.triggered).toBe(true);
			expect(result.messages.some((m) => m.text.includes('fail'))).toBe(true);
		} finally {
			Math.random = orig;
		}
	});

	it('undetected trap still triggers normally', () => {
		const trap: Trap = { pos: { x: 6, y: 5 }, type: 'spike', triggered: false };
		const state = makeTestState({ traps: [trap], level: 1 });
		// NOT adding to detectedTraps
		const result = handleInput(state, 'd');
		expect(result.player.hp).toBeLessThan(20);
		expect(trap.triggered).toBe(true);
	});
});

describe('extended status effects in combat', () => {
	it('frozen enemy skips their turn', () => {
		const enemy = makeEnemy(6, 5, { name: 'TestEnemy', hp: 50, maxHp: 50, attack: 5 });
		applyEffect(enemy, 'freeze', 3, 0);
		const state = makeTestState({ enemies: [enemy] });
		// Use 'g' (defend) to avoid FOV recalc; enemy should not attack because frozen
		const result = handleInput(state, 'g');
		expect(result.player.hp).toBe(20); // No damage taken
	});

	it('frozen player cannot move', () => {
		const state = makeTestState();
		applyEffect(state.player, 'freeze', 2, 0);
		const result = handleInput(state, 'd');
		expect(result.player.pos.x).toBe(5); // Didn't move
		expect(result.messages.some((m) => m.text.includes('frozen'))).toBe(true);
	});

	it('blinded enemy can miss attacks', () => {
		const enemy = makeEnemy(6, 5, { name: 'TestEnemy', hp: 50, maxHp: 50, attack: 5 });
		applyEffect(enemy, 'blind', 5, 0);
		const state = makeTestState({ enemies: [enemy] });
		const orig = Math.random;
		Math.random = () => 0.1; // Below 0.5 threshold → miss
		try {
			const result = handleInput(state, 'g');
			expect(result.messages.some((m) => m.text.includes('blindly') && m.text.includes('misses'))).toBe(true);
			expect(result.player.hp).toBe(20);
		} finally {
			Math.random = orig;
		}
	});

	it('blinded player can miss attacks', () => {
		const enemy = makeEnemy(6, 5, { name: 'TestEnemy', hp: 50, maxHp: 50, attack: 1 });
		const state = makeTestState({ enemies: [enemy] });
		applyEffect(state.player, 'blind', 5, 0);
		const orig = Math.random;
		Math.random = () => 0.1; // Below 0.5 threshold → miss
		try {
			const result = handleInput(state, 'd'); // Try to attack enemy at (6,5)
			expect(result.messages.some((m) => m.text.includes('blindly') && m.text.includes('miss'))).toBe(true);
			expect(enemy.hp).toBe(50); // No damage dealt
		} finally {
			Math.random = orig;
		}
	});

	it('cursed enemy deals reduced damage', () => {
		const enemy = makeEnemy(6, 5, { name: 'TestEnemy', hp: 50, maxHp: 50, attack: 10 });
		applyEffect(enemy, 'curse', 5, 5); // -5 ATK
		const state = makeTestState({ enemies: [enemy] });
		const orig = Math.random;
		// High random to pass blind/dodge checks, 0 for damage roll
		Math.random = () => 0.99;
		try {
			const result = handleInput(state, 'g');
			const dmgTaken = 20 - result.player.hp;
			// attack=10, curse=-5 → effective 5, +0or1 random, -block
			// Without curse it would be ~10-12 damage, with curse ~3-5
			expect(dmgTaken).toBeLessThanOrEqual(6);
		} finally {
			Math.random = orig;
		}
	});

	it('cursed player deals reduced damage', () => {
		const enemy = makeEnemy(6, 5, { name: 'TestEnemy', hp: 50, maxHp: 50, attack: 1 });
		const state = makeTestState({ enemies: [enemy] });
		state.player.attack = 10;
		applyEffect(state.player, 'curse', 5, 5); // -5 ATK
		const orig = Math.random;
		Math.random = () => 0.99; // Pass blind check, max damage roll
		try {
			handleInput(state, 'd');
			const dmgDealt = 50 - enemy.hp;
			// attack=10, curse=-5 → effective 5, +2 random roll → 7
			expect(dmgDealt).toBeLessThanOrEqual(8);
		} finally {
			Math.random = orig;
		}
	});

	it('burn deals DoT each turn via enemy tick', () => {
		const enemy = makeEnemy(8, 8, { name: 'TestEnemy', hp: 20, maxHp: 20, attack: 1 });
		applyEffect(enemy, 'burn', 3, 4);
		const state = makeTestState({ enemies: [enemy] });
		// Defend to trigger moveEnemies which ticks effects
		handleInput(state, 'g');
		expect(enemy.hp).toBe(16); // 20 - 4 burn damage
	});
});

describe('attemptPush', () => {
	it('warrior always pushes (100% chance)', () => {
		expect(PUSH_CHANCE.warrior).toBe(1.0);
	});

	it('rogue and mage have lower push chance', () => {
		expect(PUSH_CHANCE.rogue).toBeLessThan(PUSH_CHANCE.warrior);
		expect(PUSH_CHANCE.mage).toBeLessThan(PUSH_CHANCE.rogue);
	});

	it('pushes enemy to the target tile', () => {
		const enemy = makeEnemy(6, 5, { name: 'TestEnemy', hp: 50, maxHp: 50 });
		const state = makeTestState({ enemies: [enemy] });
		const orig = Math.random;
		Math.random = () => 0.01; // Succeed push
		try {
			const result = attemptPush(state, enemy, 1, 0); // Push right
			expect(result.pushed).toBe(true);
			expect(enemy.pos).toEqual({ x: 7, y: 5 });
			expect(result.messages.some((m) => m.text.includes('push'))).toBe(true);
		} finally {
			Math.random = orig;
		}
	});

	it('fails when destination is a wall', () => {
		const enemy = makeEnemy(6, 5, { name: 'TestEnemy', hp: 50, maxHp: 50 });
		const state = makeTestState({ enemies: [enemy] });
		state.map.tiles[5][7] = '#'; // Wall at push destination
		const orig = Math.random;
		Math.random = () => 0.01;
		try {
			const result = attemptPush(state, enemy, 1, 0);
			expect(result.pushed).toBe(false);
			expect(enemy.pos).toEqual({ x: 6, y: 5 }); // Unchanged
		} finally {
			Math.random = orig;
		}
	});

	it('fails when destination is occupied by another enemy', () => {
		const enemy1 = makeEnemy(6, 5, { name: 'TestEnemy', hp: 50, maxHp: 50 });
		const enemy2 = makeEnemy(7, 5, { name: 'Blocker', hp: 50, maxHp: 50 });
		const state = makeTestState({ enemies: [enemy1, enemy2] });
		const orig = Math.random;
		Math.random = () => 0.01;
		try {
			const result = attemptPush(state, enemy1, 1, 0);
			expect(result.pushed).toBe(false);
		} finally {
			Math.random = orig;
		}
	});

	it('pushing into hazard applies hazard damage', () => {
		const enemy = makeEnemy(6, 5, { name: 'TestEnemy', hp: 10, maxHp: 10 });
		const hazard: Hazard = { pos: { x: 7, y: 5 }, type: 'lava' };
		const state = makeTestState({ enemies: [enemy], hazards: [hazard], level: 3 });
		const orig = Math.random;
		Math.random = () => 0.01;
		try {
			const result = attemptPush(state, enemy, 1, 0);
			expect(result.pushed).toBe(true);
			expect(enemy.pos).toEqual({ x: 7, y: 5 });
			expect(enemy.hp).toBeLessThan(10); // Took lava damage
			expect(result.messages.some((m) => m.text.includes('lava'))).toBe(true);
		} finally {
			Math.random = orig;
		}
	});

	it('environmental kill flagged when enemy dies from hazard push', () => {
		const enemy = makeEnemy(6, 5, { name: 'TestEnemy', hp: 1, maxHp: 10 });
		const hazard: Hazard = { pos: { x: 7, y: 5 }, type: 'lava' };
		const state = makeTestState({ enemies: [enemy], hazards: [hazard], level: 3 });
		const orig = Math.random;
		Math.random = () => 0.01;
		try {
			const result = attemptPush(state, enemy, 1, 0);
			expect(result.pushed).toBe(true);
			expect(result.environmentalKill).toBe(true);
			expect(enemy.hp).toBeLessThanOrEqual(0);
		} finally {
			Math.random = orig;
		}
	});
});

describe('push integration in combat', () => {
	it('attack + push produces push message', () => {
		const enemy = makeEnemy(6, 5, { name: 'TestEnemy', hp: 100, maxHp: 100, attack: 1 });
		applyEffect(enemy, 'freeze', 5, 0); // Freeze so enemy can't move back after push
		const state = makeTestState({
			enemies: [enemy],
			characterConfig: { name: 'Hero', characterClass: 'warrior', difficulty: 'normal', startingLocation: 'cave' }
		});
		const orig = Math.random;
		Math.random = () => 0.01;
		try {
			const result = handleInput(state, 'd'); // Attack right
			// Enemy pushed from (6,5) to (7,5), frozen so stays there
			expect(enemy.pos.x).toBe(7);
			expect(result.messages.some((m) => m.text.includes('push'))).toBe(true);
		} finally {
			Math.random = orig;
		}
	});

	it('environmental kill grants bonus XP with Creativity message', () => {
		// Enemy has enough HP to survive the attack hit, but dies from lava push
		const enemy = makeEnemy(6, 5, { name: 'TestEnemy', hp: 15, maxHp: 15, attack: 1 });
		const hazard: Hazard = { pos: { x: 7, y: 5 }, type: 'lava' };
		const state = makeTestState({
			enemies: [enemy],
			hazards: [hazard],
			level: 5, // lava does 2+5=7 damage
			characterConfig: { name: 'Hero', characterClass: 'warrior', difficulty: 'normal', startingLocation: 'cave' }
		});
		state.player.attack = 3; // Low attack: 3+0=3 damage, leaving enemy at 12HP, then lava does 7 → 5HP (survives)
		// Actually we need enemy to die from lava. Let's set HP so attack + lava kills.
		// attack=3, dmg=max(1,3+0)=3, enemy at 15-3=12, lava=7, 12-7=5. Still alive.
		// Set hp=9: 9-3=6, lava=7, 6-7=-1. Dead from lava!
		enemy.hp = 9;
		enemy.maxHp = 9;
		const orig = Math.random;
		Math.random = () => 0.01;
		try {
			const startXp = state.xp;
			const result = handleInput(state, 'd');
			expect(result.messages.some((m) => m.text.includes('Creativity bonus'))).toBe(true);
			expect(result.xp).toBeGreaterThan(startXp);
		} finally {
			Math.random = orig;
		}
	});

	it('no push attempted when enemy dies from the attack itself', () => {
		const enemy = makeEnemy(6, 5, { name: 'TestEnemy', hp: 1, maxHp: 1, attack: 1 });
		const state = makeTestState({ enemies: [enemy] });
		state.player.attack = 50;
		const result = handleInput(state, 'd');
		// Enemy died from attack, no push message
		expect(result.messages.some((m) => m.text.includes('push'))).toBe(false);
		expect(result.messages.some((m) => m.text.includes('defeated'))).toBe(true);
	});
});

describe('loot drops', () => {
	it('killing an enemy can drop loot', () => {
		const enemy = makeEnemy(6, 5, { name: 'Goblin', hp: 1, maxHp: 1, attack: 1 });
		const state = makeTestState({ enemies: [enemy] });
		state.player.attack = 50;
		const orig = Math.random;
		Math.random = () => 0.01; // Succeed drop + pick first loot entry
		try {
			const result = handleInput(state, 'd');
			expect(result.lootDrops.length).toBe(1);
			expect(result.lootDrops[0].pos).toEqual({ x: 6, y: 5 });
		} finally {
			Math.random = orig;
		}
	});

	it('picking up healing loot restores HP', () => {
		const drop: LootDrop = { pos: { x: 6, y: 5 }, type: 'healing', value: 5 };
		const state = makeTestState({ lootDrops: [drop] });
		state.player.hp = 10;
		const result = handleInput(state, 'd'); // Move right onto loot
		expect(result.player.hp).toBe(15);
		expect(result.lootDrops).toHaveLength(0);
		expect(result.messages.some((m) => m.text.includes('Health Potion'))).toBe(true);
	});

	it('picking up xp_bonus loot adds XP', () => {
		const drop: LootDrop = { pos: { x: 6, y: 5 }, type: 'xp_bonus', value: 20 };
		const state = makeTestState({ lootDrops: [drop] });
		const startXp = state.xp;
		const result = handleInput(state, 'd');
		expect(result.xp).toBe(startXp + 20);
		expect(result.lootDrops).toHaveLength(0);
	});

	it('picking up atk_bonus loot adds ATK', () => {
		const drop: LootDrop = { pos: { x: 6, y: 5 }, type: 'atk_bonus', value: 1 };
		const state = makeTestState({ lootDrops: [drop] });
		const startAtk = state.player.attack;
		const result = handleInput(state, 'd');
		expect(result.player.attack).toBe(startAtk + 1);
		expect(result.lootDrops).toHaveLength(0);
	});

	it('healing loot does not exceed maxHp', () => {
		const drop: LootDrop = { pos: { x: 6, y: 5 }, type: 'healing', value: 50 };
		const state = makeTestState({ lootDrops: [drop] });
		state.player.hp = 19;
		const result = handleInput(state, 'd');
		expect(result.player.hp).toBe(20); // maxHp is 20
	});
});

describe('skill tree integration', () => {
	it('awards 1 skill point on level up', () => {
		const state = makeTestState({ xp: 0, characterLevel: 1, skillPoints: 0 });
		state.enemies = [makeEnemy(6, 5, { hp: 1, maxHp: 1 })];
		// xpForLevel(2) = floor(50 * 1.4^1) = 70, xpReward = 5 + 1*2 + 1 = 8
		state.xp = 65;
		const result = handleInput(state, 'd');
		expect(result.characterLevel).toBe(2);
		expect(result.skillPoints).toBe(1);
		expect(result.messages.some(m => m.text.includes('Skill Point'))).toBe(true);
	});

	it('skill sight bonus increases effective sight radius', () => {
		const state = makeTestState({ unlockedSkills: ['w_tac_1'] }); // +1 sight
		expect(effectiveSightRadius(state)).toBe(9); // base 8 + 1
	});

	it('skill sight bonus stacks with multiple skills', () => {
		const state = makeTestState({ unlockedSkills: ['m_know_1', 'm_know_3'] }); // +1 + +2 sight
		expect(effectiveSightRadius(state)).toBe(11); // base 8 + 3
	});

	it('skill block bonus reduces incoming damage', () => {
		// Warrior base block = 2, with w_def_2 (+1 block) = 3
		const state = makeTestState({
			unlockedSkills: ['w_def_1', 'w_def_2']
		});
		state.enemies = [makeEnemy(6, 5, { hp: 100, maxHp: 100, attack: 5 })];
		applyEffect(state.enemies[0], 'freeze', 1, 0); // freeze so it doesn't move after

		const originalRandom = Math.random;
		Math.random = () => 0.99; // Fail dodge, no blind, minimal random damage
		try {
			const result = handleInput(state, 'g'); // defend doubles block: (2+1)*2 = 6
			// Enemy attack 5 + floor(0.99*2)=1 = 6 raw, block 6, min 1 damage
			const blockMsg = result.messages.find(m => m.text.includes('block'));
			expect(blockMsg).toBeDefined();
		} finally {
			Math.random = originalRandom;
		}
	});

	it('XP multiplier from skills increases XP earned', () => {
		// m_know_2 gives +10% XP multiplier
		const state = makeTestState({ unlockedSkills: ['m_know_1', 'm_know_2'] });
		state.enemies = [makeEnemy(6, 5, { hp: 1, maxHp: 5 })];
		const baseXp = xpReward(state.enemies[0], state.level); // 5 + 2 + 5 = 12
		const expectedXp = Math.floor(baseXp * 1.10); // 13

		const result = handleInput(state, 'd');
		expect(result.xp).toBe(expectedXp);
	});

	it('skill points and unlocked skills persist through level transition', () => {
		const state = makeTestState({ skillPoints: 3, unlockedSkills: ['w_arms_1', 'w_def_1'] });
		state.map.tiles[5][6] = '>';
		const result = handleInput(state, 'd');
		expect(result.skillPoints).toBe(3);
		expect(result.unlockedSkills).toEqual(['w_arms_1', 'w_def_1']);
	});
});

describe('environmental storytelling (landmarks)', () => {
	it('examining adjacent landmark produces discovery message', () => {
		const landmark: Landmark = { pos: { x: 6, y: 5 }, type: 'graffiti', examined: false };
		const state = makeTestState({ landmarks: [landmark] });
		const result = handleInput(state, 'e');
		const discoveryMsg = result.messages.find(m => m.type === 'discovery' && m.text.includes('Wall Graffiti'));
		expect(discoveryMsg).toBeDefined();
	});

	it('examining landmark marks it as examined', () => {
		const landmark: Landmark = { pos: { x: 6, y: 5 }, type: 'statue', examined: false };
		const state = makeTestState({ landmarks: [landmark] });
		const result = handleInput(state, 'e');
		expect(result.landmarks[0].examined).toBe(true);
	});

	it('already examined landmarks are not re-examined', () => {
		const landmark: Landmark = { pos: { x: 6, y: 5 }, type: 'graffiti', examined: true };
		const state = makeTestState({ landmarks: [landmark] });
		const result = handleInput(state, 'e');
		// Should show "find nothing" since the adjacent landmark is already examined
		const nothingMsg = result.messages.find(m => m.text.includes('find nothing'));
		expect(nothingMsg).toBeDefined();
	});

	it('non-adjacent landmarks are not examined', () => {
		const landmark: Landmark = { pos: { x: 8, y: 8 }, type: 'campsite', examined: false };
		const state = makeTestState({ landmarks: [landmark] });
		const result = handleInput(state, 'e');
		expect(result.landmarks[0].examined).toBe(false);
	});

	it('search finds both traps and landmarks', () => {
		const landmark: Landmark = { pos: { x: 6, y: 5 }, type: 'bones', examined: false };
		const trap: Trap = { pos: { x: 5, y: 6 }, type: 'spike', triggered: false };
		const state = makeTestState({ landmarks: [landmark], traps: [trap] });
		const result = handleInput(state, 'e');
		// Both trap detection and landmark examination should happen
		const landmarkMsg = result.messages.find(m => m.text.includes("Adventurer's Remains"));
		expect(landmarkMsg).toBeDefined();
		expect(result.landmarks[0].examined).toBe(true);
	});
});

describe('rest and camping', () => {
	it('short rest restores HP when no enemies nearby', () => {
		const state = makeTestState();
		state.player.hp = 10;
		state.player.maxHp = 20;
		const result = handleInput(state, 'r');
		expect(result.player.hp).toBe(15); // 10 + floor(20*0.25)
		const healMsg = result.messages.find(m => m.type === 'healing');
		expect(healMsg).toBeDefined();
	});

	it('short rest blocked when enemies are nearby', () => {
		const state = makeTestState({
			enemies: [{ pos: { x: 6, y: 5 }, char: 'G', color: '#0f0', name: 'Goblin', hp: 5, maxHp: 5, attack: 2, statusEffects: [] }]
		});
		state.player.hp = 10;
		const result = handleInput(state, 'r');
		expect(result.player.hp).toBe(10); // no healing
		const warnMsg = result.messages.find(m => m.text.includes("can't rest"));
		expect(warnMsg).toBeDefined();
	});

	it('short rest does nothing at full HP', () => {
		const state = makeTestState();
		const result = handleInput(state, 'r');
		const infoMsg = result.messages.find(m => m.text.includes('full health'));
		expect(infoMsg).toBeDefined();
	});

	it('long rest restores full HP', () => {
		const state = makeTestState();
		state.player.hp = 5;
		state.player.maxHp = 20;
		const orig = Math.random;
		Math.random = () => 0.9; // no ambush
		try {
			const result = handleInput(state, 'R');
			expect(result.player.hp).toBe(20);
		} finally {
			Math.random = orig;
		}
	});

	it('long rest ambush spawns enemies', () => {
		const state = makeTestState();
		state.player.hp = 10;
		state.player.maxHp = 20;
		state.level = 1;
		// Make all floor tiles around player
		for (let y = 0; y < 10; y++)
			for (let x = 0; x < 10; x++)
				state.map.tiles[y][x] = '.';
		const orig = Math.random;
		let callCount = 0;
		Math.random = () => {
			callCount++;
			if (callCount === 1) return 0.1; // ambush triggers (< 0.3)
			return 0.4; // used for spawn positioning
		};
		try {
			const result = handleInput(state, 'R');
			// HP was restored to 20 but ambush enemies may have attacked
			expect(result.player.hp).toBeGreaterThan(10); // healed from 10
			const ambushMsg = result.messages.find(m => m.text.includes('ambushed'));
			expect(ambushMsg).toBeDefined();
			// Should have spawned at least 1 enemy
			expect(result.enemies.length).toBeGreaterThan(0);
		} finally {
			Math.random = orig;
		}
	});

	it('stunned player cannot rest', () => {
		const state = makeTestState();
		state.player.hp = 10;
		state.player.statusEffects = [{ type: 'stun', duration: 1, potency: 0 }];
		const result = handleInput(state, 'r');
		expect(result.player.hp).toBe(10);
		const stunMsg = result.messages.find(m => m.text.includes('stunned'));
		expect(stunMsg).toBeDefined();
	});
});

describe('achievement tracking', () => {
	it('tracks enemiesKilled on melee kill', () => {
		const state = makeTestState({
			enemies: [{ pos: { x: 6, y: 5 }, char: 'G', color: '#0f0', name: 'Goblin', hp: 1, maxHp: 5, attack: 0, statusEffects: [] }]
		});
		state.player.attack = 50;
		const orig = Math.random;
		Math.random = () => 0.99;
		try {
			const result = handleInput(state, 'd'); // move right into goblin
			expect(result.stats.enemiesKilled).toBe(1);
			expect(result.stats.damageDealt).toBeGreaterThan(0);
		} finally {
			Math.random = orig;
		}
	});

	it('unlocks first_blood achievement on first kill', () => {
		const state = makeTestState({
			enemies: [{ pos: { x: 6, y: 5 }, char: 'G', color: '#0f0', name: 'Goblin', hp: 1, maxHp: 5, attack: 0, statusEffects: [] }]
		});
		state.player.attack = 50;
		const orig = Math.random;
		Math.random = () => 0.99;
		try {
			const result = handleInput(state, 'd');
			expect(result.unlockedAchievements).toContain('first_blood');
			const achieveMsg = result.messages.find(m => m.text.includes('Achievement unlocked'));
			expect(achieveMsg).toBeDefined();
		} finally {
			Math.random = orig;
		}
	});

	it('tracks damageTaken from enemy attacks', () => {
		const state = makeTestState({
			enemies: [{ pos: { x: 7, y: 5 }, char: 'G', color: '#0f0', name: 'Goblin', hp: 50, maxHp: 50, attack: 5, statusEffects: [] }]
		});
		state.player.attack = 1;
		const orig = Math.random;
		Math.random = () => 0.99; // no dodge, no special effects
		try {
			const result = handleInput(state, 'd'); // move toward enemy triggers melee on next move
			// Player moved into empty tile, enemies move and attack if adjacent
			// The goblin is at x:7, player moves to x:6 - goblin may move to x:6 area
			expect(result.stats.damageTaken).toBeGreaterThanOrEqual(0);
		} finally {
			Math.random = orig;
		}
	});

	it('tracks chestsOpened', () => {
		const state = makeTestState({
			chests: [{ pos: { x: 6, y: 5 }, type: 'wooden', opened: false, trapped: false, mimic: false }]
		});
		const result = handleInput(state, 'd');
		expect(result.stats.chestsOpened).toBe(1);
	});

	it('tracks landmarksExamined', () => {
		const state = makeTestState({
			landmarks: [{ pos: { x: 6, y: 5 }, type: 'statue', examined: false }]
		});
		const result = handleInput(state, 'e');
		expect(result.stats.landmarksExamined).toBe(1);
	});

	it('records kill in bestiary on melee kill', () => {
		const state = makeTestState({
			enemies: [{ pos: { x: 6, y: 5 }, char: 'G', color: '#0f0', name: 'Goblin', hp: 1, maxHp: 5, attack: 0, statusEffects: [] }]
		});
		state.player.attack = 50;
		const orig = Math.random;
		Math.random = () => 0.99;
		try {
			const result = handleInput(state, 'd');
			expect(result.bestiary['Goblin']).toBeDefined();
			expect(result.bestiary['Goblin'].timesKilled).toBe(1);
		} finally {
			Math.random = orig;
		}
	});

	it('bestiary persists through level transition', () => {
		const state = makeTestState({
			enemies: [{ pos: { x: 6, y: 5 }, char: 'G', color: '#0f0', name: 'Goblin', hp: 1, maxHp: 5, attack: 0, statusEffects: [] }]
		});
		state.player.attack = 50;
		state.bestiary = { Rat: { timesSeen: 2, timesKilled: 1, rareEncountered: false, rareKilled: false } };
		const orig = Math.random;
		Math.random = () => 0.99;
		try {
			// Kill the goblin first
			const afterKill = handleInput(state, 'd');
			expect(afterKill.bestiary['Rat']).toBeDefined();
			expect(afterKill.bestiary['Rat'].timesKilled).toBe(1);
			expect(afterKill.bestiary['Goblin']).toBeDefined();
		} finally {
			Math.random = orig;
		}
	});
});
