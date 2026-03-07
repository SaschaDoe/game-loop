import { describe, it, expect } from 'vitest';
import { pickTrapType, trapName, createTrap, placeTraps, getTrapAt, detectAdjacentTraps, triggerTrap } from './traps';
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
		characterConfig: { name: 'Hero', characterClass: 'warrior' as const, difficulty: 'normal' as const, startingLocation: 'cave' as const },
		abilityCooldown: 0,
		hazards: [],
		npcs: [],
		chests: [],
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
