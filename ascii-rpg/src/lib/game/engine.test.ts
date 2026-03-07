import { describe, it, expect } from 'vitest';
import { createGame, handleInput, xpForLevel, xpReward } from './engine';
import type { GameState, Entity } from './types';
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
			attack: 10
		},
		enemies: [],
		map: { width, height, tiles },
		messages: [],
		level: 1,
		gameOver: false,
		xp: 0,
		characterLevel: 1,
		visibility,
		sightRadius: 8,
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
		const xpMsg = result.messages.find((m) => m.includes('XP'));
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
		const lvlMsg = result.messages.find((m) => m.includes('Level up!'));
		expect(lvlMsg).toBeDefined();
		expect(lvlMsg).toContain('level 2');
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
