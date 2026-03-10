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
			characterConfig: { name: 'Gandalf', characterClass: 'mage', difficulty: 'hard', startingLocation: 'tavern', worldSeed: 'test' }
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

	it('preserves landmarks', () => {
		const state = makeTestState({
			landmarks: [
				{ pos: { x: 3, y: 4 }, type: 'graffiti', examined: false },
				{ pos: { x: 7, y: 2 }, type: 'statue', examined: true },
			]
		});
		const restored = deserializeState(serializeState(state));
		expect(restored.landmarks).toHaveLength(2);
		expect(restored.landmarks[0].type).toBe('graffiti');
		expect(restored.landmarks[0].examined).toBe(false);
		expect(restored.landmarks[1].examined).toBe(true);
	});

	it('preserves skillPoints and unlockedSkills', () => {
		const state = makeTestState({ skillPoints: 3, unlockedSkills: ['w_arms_1', 'w_def_1'] });
		const restored = deserializeState(serializeState(state));
		expect(restored.skillPoints).toBe(3);
		expect(restored.unlockedSkills).toEqual(['w_arms_1', 'w_def_1']);
	});

	it('preserves stats and unlockedAchievements', () => {
		const state = makeTestState({
			stats: { enemiesKilled: 42, bossesKilled: 3, secretsFound: 7, trapsDisarmed: 5, chestsOpened: 10, levelsCleared: 4, npcsSpokenTo: 8, landmarksExamined: 12, damageDealt: 350, damageTaken: 200, maxDungeonLevel: 5, stealthKills: 0, backstabs: 0, questsCompleted: 0, questsFailed: 0 },
			unlockedAchievements: ['first_blood', 'boss_hunter']
		});
		const restored = deserializeState(serializeState(state));
		expect(restored.stats.enemiesKilled).toBe(42);
		expect(restored.stats.bossesKilled).toBe(3);
		expect(restored.stats.maxDungeonLevel).toBe(5);
		expect(restored.unlockedAchievements).toEqual(['first_blood', 'boss_hunter']);
	});

	it('preserves hunger, thirst, and survivalEnabled', () => {
		const state = makeTestState({ hunger: 35, thirst: 78, survivalEnabled: false });
		const restored = deserializeState(serializeState(state));
		expect(restored.hunger).toBe(35);
		expect(restored.thirst).toBe(78);
		expect(restored.survivalEnabled).toBe(false);
	});

	it('preserves turnCount', () => {
		const state = makeTestState({ turnCount: 150 });
		const restored = deserializeState(serializeState(state));
		expect(restored.turnCount).toBe(150);
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

	it('round-trips trueSightActive', () => {
		const state = makeTestState({ trueSightActive: 7 });
		const restored = deserializeState(serializeState(state));
		expect(restored.trueSightActive).toBe(7);
	});

	it('defaults trueSightActive to 0 for old saves', () => {
		const state = makeTestState();
		const json = serializeState(state);
		const data = JSON.parse(json);
		delete data.state.trueSightActive;
		const restored = deserializeState(JSON.stringify(data));
		expect(restored.trueSightActive).toBe(0);
	});

	it('does not persist revealedLeyLineTiles (transient)', () => {
		const state = makeTestState();
		state.revealedLeyLineTiles.add('3,4');
		state.revealedLeyLineTiles.add('5,6');
		const restored = deserializeState(serializeState(state));
		expect(restored.revealedLeyLineTiles).toBeInstanceOf(Set);
		expect(restored.revealedLeyLineTiles.size).toBe(0);
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

	it('preserves bestiary through save/load', () => {
		const state = makeTestState({
			bestiary: {
				Goblin: { timesSeen: 5, timesKilled: 3, rareEncountered: true, rareKilled: false },
				Rat: { timesSeen: 2, timesKilled: 2, rareEncountered: false, rareKilled: false }
			}
		});
		saveGame(state);
		const restored = loadGame();
		expect(restored).not.toBeNull();
		expect(restored!.bestiary['Goblin'].timesSeen).toBe(5);
		expect(restored!.bestiary['Goblin'].timesKilled).toBe(3);
		expect(restored!.bestiary['Goblin'].rareEncountered).toBe(true);
		expect(restored!.bestiary['Rat'].timesKilled).toBe(2);
	});

	it('preserves survival state through save/load', () => {
		const state = makeTestState({ hunger: 42, thirst: 65, survivalEnabled: true });
		saveGame(state);
		const restored = loadGame();
		expect(restored).not.toBeNull();
		expect(restored!.hunger).toBe(42);
		expect(restored!.thirst).toBe(65);
		expect(restored!.survivalEnabled).toBe(true);
	});

	it('preserves turnCount through save/load', () => {
		const state = makeTestState({ turnCount: 73 });
		saveGame(state);
		const restored = loadGame();
		expect(restored).not.toBeNull();
		expect(restored!.turnCount).toBe(73);
	});

	it('preserves locationCache through round-trip', () => {
		const state = makeTestState({
			locationCache: {
				'settlement_1:0': {
					map: { width: 10, height: 10, tiles: Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => '.' as const)), secretWalls: new Set<string>(['3,4']) },
					enemies: [{ pos: { x: 2, y: 3 }, char: 'G', color: '#0f0', name: 'Goblin', hp: 5, maxHp: 5, attack: 2, statusEffects: [] }],
					npcs: [],
					traps: [],
					detectedTraps: new Set<string>(['1,1']),
					hazards: [],
					chests: [],
					lootDrops: [],
					landmarks: [],
					visibility: Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => 0)),
					detectedSecrets: new Set<string>(['5,5']),
					playerPos: { x: 3, y: 3 },
					containers: [],
				}
			}
		});
		const restored = deserializeState(serializeState(state));
		const cached = restored.locationCache['settlement_1:0'];
		expect(cached).toBeDefined();
		expect(cached.enemies).toHaveLength(1);
		expect(cached.enemies[0].name).toBe('Goblin');
		expect(cached.playerPos).toEqual({ x: 3, y: 3 });
		expect(cached.detectedTraps).toBeInstanceOf(Set);
		expect(cached.detectedTraps.has('1,1')).toBe(true);
		expect(cached.detectedSecrets.has('5,5')).toBe(true);
		expect(cached.map.secretWalls).toBeInstanceOf(Set);
		expect(cached.map.secretWalls.has('3,4')).toBe(true);
	});
});
