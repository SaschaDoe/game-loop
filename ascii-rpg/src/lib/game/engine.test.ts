import { describe, it, expect } from 'vitest';
import { createGame, handleInput, xpForLevel, xpReward } from './engine';
import { BOSS_DEFS, createMonster, isBoss } from './monsters';
import type { GameState, Entity, Trap } from './types';
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

	it('detected trap is not triggered when walking onto it', () => {
		const state = makeTestState();
		state.traps = [{ pos: { x: 6, y: 5 }, type: 'spike', triggered: false }];
		state.detectedTraps.add('6,5');
		const result = handleInput(state, 'd');
		expect(result.traps[0].triggered).toBe(false);
		expect(result.player.hp).toBe(20);
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
		expect(state.messages[0].text).toContain('Welcome');
		expect(state.messages[0].type).toBe('info');
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
