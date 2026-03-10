import { describe, it, expect, vi } from 'vitest';
import { getLeyLineLevelForTile, exitToOverworld, handleOverworldInput, renderOverworldColored } from './overworld-handler';
import type { OverworldTile, WorldMap } from './overworld';
import type { GameState } from './types';
import { Visibility } from './types';

// ── Minimal helpers ──

/** Build a small 5x5 world map with a given tile at the center (2,2). */
function makeSmallWorldMap(centerTile?: Partial<OverworldTile>): WorldMap {
	const defaultTile: OverworldTile = { terrain: 'grass', region: 'hearthlands' };
	const tiles: OverworldTile[][] = Array.from({ length: 5 }, () =>
		Array.from({ length: 5 }, () => ({ ...defaultTile })),
	);
	if (centerTile) {
		tiles[2][2] = { ...defaultTile, ...centerTile };
	}
	const explored = Array.from({ length: 5 }, () =>
		Array.from({ length: 5 }, () => true),
	);
	return {
		width: 5,
		height: 5,
		tiles,
		regions: [{ id: 'hearthlands', name: 'Hearthlands', center: { x: 2, y: 2 }, language: 'common', dangerLevel: 1 }],
		settlements: [],
		dungeonEntrances: [],
		roads: [],
		pois: [],
		explored,
		leyLines: { northSouth: [2, 2, 2, 2, 2], westEast: [2, 2, 2, 2, 2] },
	};
}

function makeOverworldState(overrides?: Partial<GameState>): GameState {
	const width = 10;
	const height = 10;
	const tiles = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => '.' as const),
	);
	const visibility = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => Visibility.Visible),
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
		survivalEnabled: false,
		turnCount: 0,
		locationMode: 'overworld' as const,
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
		leyLineLevel: 2,
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

// ── getLeyLineLevelForTile ──

describe('getLeyLineLevelForTile', () => {
	it('returns 4 for convergence tiles', () => {
		const tile: OverworldTile = { terrain: 'grass', region: 'hearthlands', leyLine: 'convergence' };
		expect(getLeyLineLevelForTile(tile)).toBe(4);
	});

	it('returns 3 for core tiles', () => {
		const tile: OverworldTile = { terrain: 'grass', region: 'hearthlands', leyLine: 'core' };
		expect(getLeyLineLevelForTile(tile)).toBe(3);
	});

	it('returns 2 for aura tiles', () => {
		const tile: OverworldTile = { terrain: 'grass', region: 'hearthlands', leyLine: 'aura' };
		expect(getLeyLineLevelForTile(tile)).toBe(2);
	});

	it('returns 2 for tiles with no ley line', () => {
		const tile: OverworldTile = { terrain: 'grass', region: 'hearthlands' };
		expect(getLeyLineLevelForTile(tile)).toBe(2);
	});
});

// ── handleOverworldInput sets ley line level ──

describe('handleOverworldInput ley line level', () => {
	const noopCreate = () => makeOverworldState();
	const noopNewLevel = () => makeOverworldState();

	it('sets leyLineLevel to 4 when moving onto a convergence tile', () => {
		const worldMap = makeSmallWorldMap({ leyLine: 'convergence' });
		// Player at (1,2), moving right onto convergence tile at (2,2)
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 1, y: 2 },
			leyLineLevel: 2,
		});
		const result = handleOverworldInput(state, 'd', noopCreate, noopNewLevel);
		expect(result.leyLineLevel).toBe(4);
	});

	it('sets leyLineLevel to 3 when moving onto a core tile', () => {
		const worldMap = makeSmallWorldMap({ leyLine: 'core' });
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 1, y: 2 },
			leyLineLevel: 2,
		});
		const result = handleOverworldInput(state, 'd', noopCreate, noopNewLevel);
		expect(result.leyLineLevel).toBe(3);
	});

	it('sets leyLineLevel to 2 for a normal tile', () => {
		const worldMap = makeSmallWorldMap(); // no leyLine on center tile
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 1, y: 2 },
			leyLineLevel: 4, // start high to verify it gets set down
		});
		const result = handleOverworldInput(state, 'd', noopCreate, noopNewLevel);
		expect(result.leyLineLevel).toBe(2);
	});
});

// ── exitToOverworld uses tile ley line level ──

describe('exitToOverworld ley line level', () => {
	it('sets leyLineLevel from current overworld tile on exit', () => {
		const worldMap = makeSmallWorldMap({ leyLine: 'core' });
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 2, y: 2 },
			locationMode: 'location',
			leyLineLevel: 0,
		});
		const result = exitToOverworld(state);
		expect(result.leyLineLevel).toBe(3);
	});

	it('defaults to 2 if tile lookup fails', () => {
		const worldMap = makeSmallWorldMap();
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 99, y: 99 }, // out of bounds
			locationMode: 'location',
			leyLineLevel: 0,
		});
		const result = exitToOverworld(state);
		expect(result.leyLineLevel).toBe(2);
	});
});

// ── Convergence instant mana restore ──

describe('handleOverworldInput convergence mana restore', () => {
	const noopCreate = () => makeOverworldState();
	const noopNewLevel = () => makeOverworldState();

	it('restores mana to full when stepping on a convergence tile', () => {
		const worldMap = makeSmallWorldMap({ leyLine: 'convergence' });
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 1, y: 2 },
			player: {
				pos: { x: 5, y: 5 },
				char: '@',
				color: '#ff0',
				name: 'Hero',
				hp: 20,
				maxHp: 20,
				attack: 10,
				statusEffects: [],
				mana: 3,
				maxMana: 20,
			},
		});
		const result = handleOverworldInput(state, 'd', noopCreate, noopNewLevel);
		expect(result.player.mana).toBe(20);
		expect(result.messages.some(m => m.text.includes('Mana fully restored'))).toBe(true);
	});

	it('does not show message when mana is already full', () => {
		const worldMap = makeSmallWorldMap({ leyLine: 'convergence' });
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 1, y: 2 },
			player: {
				pos: { x: 5, y: 5 },
				char: '@',
				color: '#ff0',
				name: 'Hero',
				hp: 20,
				maxHp: 20,
				attack: 10,
				statusEffects: [],
				mana: 20,
				maxMana: 20,
			},
		});
		const result = handleOverworldInput(state, 'd', noopCreate, noopNewLevel);
		expect(result.messages.every(m => !m.text.includes('Mana fully restored'))).toBe(true);
	});

	it('does not restore mana on a non-convergence tile', () => {
		const worldMap = makeSmallWorldMap({ leyLine: 'core' });
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 1, y: 2 },
			player: {
				pos: { x: 5, y: 5 },
				char: '@',
				color: '#ff0',
				name: 'Hero',
				hp: 20,
				maxHp: 20,
				attack: 10,
				statusEffects: [],
				mana: 3,
				maxMana: 20,
			},
		});
		const result = handleOverworldInput(state, 'd', noopCreate, noopNewLevel);
		expect(result.player.mana).toBe(3);
	});
});

// ── True Sight tick-down on overworld movement ──

describe('trueSightActive tick-down on overworld movement', () => {
	const noopCreate = () => makeOverworldState();
	const noopNewLevel = () => makeOverworldState();

	it('decrements trueSightActive by 1 on movement', () => {
		const worldMap = makeSmallWorldMap();
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 1, y: 2 },
			trueSightActive: 5,
		});
		const result = handleOverworldInput(state, 'd', noopCreate, noopNewLevel);
		expect(result.trueSightActive).toBe(4);
	});

	it('shows fade message when trueSightActive reaches 0', () => {
		const worldMap = makeSmallWorldMap();
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 1, y: 2 },
			trueSightActive: 1,
		});
		const result = handleOverworldInput(state, 'd', noopCreate, noopNewLevel);
		expect(result.trueSightActive).toBe(0);
		expect(result.messages.some(m => m.text.includes('True Sight fades'))).toBe(true);
	});

	it('does not decrement trueSightActive when already 0', () => {
		const worldMap = makeSmallWorldMap();
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 1, y: 2 },
			trueSightActive: 0,
		});
		const result = handleOverworldInput(state, 'd', noopCreate, noopNewLevel);
		expect(result.trueSightActive).toBe(0);
	});
});

// ── revealedLeyLineTiles clears on movement ──

describe('revealedLeyLineTiles clears on movement', () => {
	const noopCreate = () => makeOverworldState();
	const noopNewLevel = () => makeOverworldState();

	it('clears revealedLeyLineTiles on movement', () => {
		const worldMap = makeSmallWorldMap();
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 1, y: 2 },
			revealedLeyLineTiles: new Set(['3,3', '4,4']),
		});
		const result = handleOverworldInput(state, 'd', noopCreate, noopNewLevel);
		expect(result.revealedLeyLineTiles.size).toBe(0);
	});
});

// ── renderOverworldColored ley line visibility ──

describe('renderOverworldColored ley line tinting', () => {
	it('shows ley line color when trueSightActive > 0', () => {
		const worldMap = makeSmallWorldMap({ leyLine: 'core' });
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 2, y: 2 },
			trueSightActive: 5,
		});
		const grid = renderOverworldColored(state);
		// The player is at (2,2) which renders as '@'. Ley line tile is also at (2,2).
		// Check an adjacent ley line tile — set one up manually.
		// Actually, center tile is player '@', so test a tile near but not on the player.
		// Let's place a ley line on tile (1,2) instead.
		worldMap.tiles[2][1] = { terrain: 'grass', region: 'hearthlands', leyLine: 'core' };
		const grid2 = renderOverworldColored(state);
		// Tile (1,2) relative to viewport: player at (2,2), viewport centered on player.
		// With a 5x5 world, camX=2, camY=2, startX=2-halfW, startY=2-halfH.
		// halfW depends on OVERWORLD_VIEWPORT_W. Let's just search the grid for the expected color.
		const flatCells = grid2.flat();
		const coreCells = flatCells.filter(c => c.color === '#4ff');
		expect(coreCells.length).toBeGreaterThan(0);
	});

	it('shows convergence ley line as gold', () => {
		const worldMap = makeSmallWorldMap();
		worldMap.tiles[2][1] = { terrain: 'grass', region: 'hearthlands', leyLine: 'convergence' };
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 2, y: 2 },
			trueSightActive: 3,
		});
		const grid = renderOverworldColored(state);
		const flatCells = grid.flat();
		const convergenceCells = flatCells.filter(c => c.color === '#fc4');
		expect(convergenceCells.length).toBeGreaterThan(0);
	});

	it('shows aura ley line as teal', () => {
		const worldMap = makeSmallWorldMap();
		worldMap.tiles[2][1] = { terrain: 'grass', region: 'hearthlands', leyLine: 'aura' };
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 2, y: 2 },
			trueSightActive: 3,
		});
		const grid = renderOverworldColored(state);
		const flatCells = grid.flat();
		const auraCells = flatCells.filter(c => c.color === '#2aa');
		expect(auraCells.length).toBeGreaterThan(0);
	});

	it('does not show ley line color when trueSightActive is 0 and no revealed tiles', () => {
		const worldMap = makeSmallWorldMap();
		worldMap.tiles[2][1] = { terrain: 'grass', region: 'hearthlands', leyLine: 'core' };
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 2, y: 2 },
			trueSightActive: 0,
			revealedLeyLineTiles: new Set(),
		});
		const grid = renderOverworldColored(state);
		const flatCells = grid.flat();
		const coreCells = flatCells.filter(c => c.color === '#4ff');
		expect(coreCells.length).toBe(0);
	});

	it('shows ley line color for tiles in revealedLeyLineTiles', () => {
		const worldMap = makeSmallWorldMap();
		worldMap.tiles[2][1] = { terrain: 'grass', region: 'hearthlands', leyLine: 'core' };
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 2, y: 2 },
			trueSightActive: 0,
			revealedLeyLineTiles: new Set(['1,2']),
		});
		const grid = renderOverworldColored(state);
		const flatCells = grid.flat();
		const coreCells = flatCells.filter(c => c.color === '#4ff');
		expect(coreCells.length).toBeGreaterThan(0);
	});
});
