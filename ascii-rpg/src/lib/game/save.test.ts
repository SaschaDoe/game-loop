import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
	serializeState,
	deserializeState,
	saveGame,
	loadGame,
	hasSaveGame,
	deleteSave,
	SAVE_VERSION,
	SAVE_KEY
} from './save';
import type { GameState, Entity } from './types';
import { Visibility } from './types';

// Mock localStorage for Node environment
const store = new Map<string, string>();
const localStorageMock = {
	getItem: vi.fn((key: string) => store.get(key) ?? null),
	setItem: vi.fn((key: string, value: string) => store.set(key, value)),
	removeItem: vi.fn((key: string) => store.delete(key)),
	clear: vi.fn(() => store.clear())
};
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true });

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
		characterConfig: { name: 'Hero', characterClass: 'warrior' as const, difficulty: 'normal' as const, startingLocation: 'cave' as const },
		abilityCooldown: 0,
		hazards: [],
		npcs: [],
		chests: [],
		...overrides
	};
}

describe('serializeState / deserializeState round-trip', () => {
	it('preserves basic scalar fields', () => {
		const state = makeTestState({ level: 5, xp: 42, characterLevel: 7, sightRadius: 10, abilityCooldown: 3, gameOver: true });
		const restored = deserializeState(serializeState(state));
		expect(restored.level).toBe(5);
		expect(restored.xp).toBe(42);
		expect(restored.characterLevel).toBe(7);
		expect(restored.sightRadius).toBe(10);
		expect(restored.abilityCooldown).toBe(3);
		expect(restored.gameOver).toBe(true);
	});

	it('preserves player entity', () => {
		const state = makeTestState();
		state.player.hp = 15;
		state.player.attack = 8;
		state.player.statusEffects = [{ type: 'poison', duration: 3, potency: 2 }];
		const restored = deserializeState(serializeState(state));
		expect(restored.player.pos).toEqual({ x: 5, y: 5 });
		expect(restored.player.hp).toBe(15);
		expect(restored.player.attack).toBe(8);
		expect(restored.player.name).toBe('Hero');
		expect(restored.player.statusEffects).toHaveLength(1);
		expect(restored.player.statusEffects[0].type).toBe('poison');
	});

	it('preserves enemies', () => {
		const state = makeTestState({
			enemies: [
				makeEnemy(3, 4, { name: 'Rat', hp: 2 }),
				makeEnemy(7, 8, { name: 'Skeleton', hp: 10, statusEffects: [{ type: 'stun', duration: 1, potency: 0 }] })
			]
		});
		const restored = deserializeState(serializeState(state));
		expect(restored.enemies).toHaveLength(2);
		expect(restored.enemies[0].name).toBe('Rat');
		expect(restored.enemies[0].hp).toBe(2);
		expect(restored.enemies[1].name).toBe('Skeleton');
		expect(restored.enemies[1].statusEffects[0].type).toBe('stun');
	});

	it('preserves map tiles', () => {
		const state = makeTestState();
		state.map.tiles[0][0] = '#';
		state.map.tiles[3][4] = '>';
		state.map.tiles[5][6] = '*';
		const restored = deserializeState(serializeState(state));
		expect(restored.map.tiles[0][0]).toBe('#');
		expect(restored.map.tiles[3][4]).toBe('>');
		expect(restored.map.tiles[5][6]).toBe('*');
		expect(restored.map.width).toBe(10);
		expect(restored.map.height).toBe(10);
	});

	it('preserves secretWalls as Set', () => {
		const state = makeTestState();
		state.map.secretWalls.add('3,4');
		state.map.secretWalls.add('7,8');
		const restored = deserializeState(serializeState(state));
		expect(restored.map.secretWalls).toBeInstanceOf(Set);
		expect(restored.map.secretWalls.size).toBe(2);
		expect(restored.map.secretWalls.has('3,4')).toBe(true);
		expect(restored.map.secretWalls.has('7,8')).toBe(true);
	});

	it('preserves detectedSecrets as Set', () => {
		const state = makeTestState();
		state.detectedSecrets.add('1,2');
		const restored = deserializeState(serializeState(state));
		expect(restored.detectedSecrets).toBeInstanceOf(Set);
		expect(restored.detectedSecrets.has('1,2')).toBe(true);
	});

	it('preserves detectedTraps as Set', () => {
		const state = makeTestState();
		state.detectedTraps.add('4,5');
		state.detectedTraps.add('6,7');
		const restored = deserializeState(serializeState(state));
		expect(restored.detectedTraps).toBeInstanceOf(Set);
		expect(restored.detectedTraps.size).toBe(2);
		expect(restored.detectedTraps.has('4,5')).toBe(true);
	});

	it('preserves traps', () => {
		const state = makeTestState({
			traps: [
				{ pos: { x: 3, y: 4 }, type: 'spike', triggered: false },
				{ pos: { x: 5, y: 6 }, type: 'poison_dart', triggered: true }
			]
		});
		const restored = deserializeState(serializeState(state));
		expect(restored.traps).toHaveLength(2);
		expect(restored.traps[0].type).toBe('spike');
		expect(restored.traps[0].triggered).toBe(false);
		expect(restored.traps[1].triggered).toBe(true);
	});

	it('preserves visibility grid', () => {
		const state = makeTestState();
		state.visibility[0][0] = Visibility.Unexplored;
		state.visibility[1][1] = Visibility.Explored;
		state.visibility[2][2] = Visibility.Visible;
		const restored = deserializeState(serializeState(state));
		expect(restored.visibility[0][0]).toBe(Visibility.Unexplored);
		expect(restored.visibility[1][1]).toBe(Visibility.Explored);
		expect(restored.visibility[2][2]).toBe(Visibility.Visible);
	});

	it('preserves messages', () => {
		const state = makeTestState({
			messages: [
				{ text: 'Hello', type: 'info' },
				{ text: 'Ouch', type: 'damage_taken' }
			]
		});
		const restored = deserializeState(serializeState(state));
		expect(restored.messages).toHaveLength(2);
		expect(restored.messages[0].text).toBe('Hello');
		expect(restored.messages[0].type).toBe('info');
		expect(restored.messages[1].type).toBe('damage_taken');
	});

	it('preserves characterConfig', () => {
		const state = makeTestState({
			characterConfig: { name: 'Gandalf', characterClass: 'mage', difficulty: 'hard', startingLocation: 'tavern' }
		});
		const restored = deserializeState(serializeState(state));
		expect(restored.characterConfig.name).toBe('Gandalf');
		expect(restored.characterConfig.characterClass).toBe('mage');
		expect(restored.characterConfig.difficulty).toBe('hard');
		expect(restored.characterConfig.startingLocation).toBe('tavern');
	});

	it('preserves empty Sets', () => {
		const state = makeTestState();
		const restored = deserializeState(serializeState(state));
		expect(restored.map.secretWalls).toBeInstanceOf(Set);
		expect(restored.map.secretWalls.size).toBe(0);
		expect(restored.detectedSecrets).toBeInstanceOf(Set);
		expect(restored.detectedSecrets.size).toBe(0);
		expect(restored.detectedTraps).toBeInstanceOf(Set);
		expect(restored.detectedTraps.size).toBe(0);
	});

	it('produces valid JSON string', () => {
		const state = makeTestState();
		const json = serializeState(state);
		expect(() => JSON.parse(json)).not.toThrow();
	});

	it('includes save version', () => {
		const state = makeTestState();
		const json = serializeState(state);
		const data = JSON.parse(json);
		expect(data.version).toBe(SAVE_VERSION);
	});
});

describe('deserializeState error handling', () => {
	it('throws on incompatible version', () => {
		const state = makeTestState();
		const json = serializeState(state);
		const data = JSON.parse(json);
		data.version = 999;
		expect(() => deserializeState(JSON.stringify(data))).toThrow('Incompatible save version');
	});

	it('throws on invalid JSON', () => {
		expect(() => deserializeState('not valid json')).toThrow();
	});
});

describe('localStorage integration', () => {
	beforeEach(() => {
		store.clear();
		vi.clearAllMocks();
	});

	it('hasSaveGame returns false when no save exists', () => {
		expect(hasSaveGame()).toBe(false);
	});

	it('saveGame stores and loadGame restores state', () => {
		const state = makeTestState({ level: 3, xp: 100 });
		state.detectedSecrets.add('2,3');
		const saved = saveGame(state);
		expect(saved).toBe(true);

		const restored = loadGame();
		expect(restored).not.toBeNull();
		expect(restored!.level).toBe(3);
		expect(restored!.xp).toBe(100);
		expect(restored!.detectedSecrets.has('2,3')).toBe(true);
	});

	it('hasSaveGame returns true after saving', () => {
		saveGame(makeTestState());
		expect(hasSaveGame()).toBe(true);
	});

	it('loadGame returns null when no save exists', () => {
		expect(loadGame()).toBeNull();
	});

	it('deleteSave removes the save', () => {
		saveGame(makeTestState());
		expect(hasSaveGame()).toBe(true);
		deleteSave();
		expect(hasSaveGame()).toBe(false);
		expect(loadGame()).toBeNull();
	});

	it('loadGame returns null for corrupted data', () => {
		localStorage.setItem(SAVE_KEY, 'corrupted data');
		expect(loadGame()).toBeNull();
	});

	it('saveGame uses the correct storage key', () => {
		saveGame(makeTestState());
		expect(localStorage.getItem(SAVE_KEY)).not.toBeNull();
	});
});
