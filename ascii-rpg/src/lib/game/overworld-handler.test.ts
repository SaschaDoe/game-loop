import { describe, it, expect, vi } from 'vitest';
import { getLeyLineLevelForTile, exitToOverworld, handleOverworldInput, renderOverworldColored, trackLeyLineQuestProgress, trackBlightedHarvestProgress } from './overworld-handler';
import type { OverworldTile, WorldMap } from './overworld';
import type { GameState, Quest } from './types';
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

// ── trackLeyLineQuestProgress ──

/** Create a Threads of Power quest in active state. */
function makeThreadsOfPowerQuest(): Quest {
	return {
		id: 'threads_of_power',
		title: 'Threads of Power',
		description: 'Experience the ley lines firsthand.',
		status: 'active',
		objectives: [
			{ id: 'tp_cast_truesight', description: 'Cast True Sight at the convergence', type: 'explore', target: 'convergence_truesight', current: 0, required: 1, completed: false },
			{ id: 'tp_walk_line', description: 'Walk a ley line core tile', type: 'explore', target: 'leyline_strong', current: 0, required: 1, completed: false },
			{ id: 'tp_return_convergence', description: 'Return to convergence with full mana', type: 'explore', target: 'convergence_restore', current: 0, required: 1, completed: false },
		],
		rewards: { xp: 100 },
		giverNpcName: 'Prof. Ignis',
		regionId: 'arcane_conservatory',
		isMainQuest: false,
		turnAccepted: 0,
	};
}

describe('trackLeyLineQuestProgress', () => {
	it('does nothing when quest is not active', () => {
		const worldMap = makeSmallWorldMap({ leyLine: 'convergence' });
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 2, y: 2 },
			trueSightActive: 5,
			quests: [],
		});
		trackLeyLineQuestProgress(state);
		// No crash, no messages added about quest
		expect(state.messages.every(m => !m.text.includes('erupts with light'))).toBe(true);
	});

	it('completes objective 1 when on convergence with True Sight active', () => {
		const worldMap = makeSmallWorldMap({ leyLine: 'convergence' });
		const quest = makeThreadsOfPowerQuest();
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 2, y: 2 },
			trueSightActive: 3,
			quests: [quest],
		});
		trackLeyLineQuestProgress(state);
		const obj = quest.objectives.find(o => o.id === 'tp_cast_truesight')!;
		expect(obj.completed).toBe(true);
		expect(obj.current).toBe(1);
		expect(state.messages.some(m => m.text.includes('erupts with light'))).toBe(true);
	});

	it('does not complete objective 1 without True Sight', () => {
		const worldMap = makeSmallWorldMap({ leyLine: 'convergence' });
		const quest = makeThreadsOfPowerQuest();
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 2, y: 2 },
			trueSightActive: 0,
			quests: [quest],
		});
		trackLeyLineQuestProgress(state);
		const obj = quest.objectives.find(o => o.id === 'tp_cast_truesight')!;
		expect(obj.completed).toBe(false);
	});

	it('does not complete objective 1 on a non-convergence tile', () => {
		const worldMap = makeSmallWorldMap({ leyLine: 'core' });
		const quest = makeThreadsOfPowerQuest();
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 2, y: 2 },
			trueSightActive: 5,
			quests: [quest],
		});
		trackLeyLineQuestProgress(state);
		const obj = quest.objectives.find(o => o.id === 'tp_cast_truesight')!;
		expect(obj.completed).toBe(false);
	});

	it('completes objective 2 when on core tile with True Sight active', () => {
		const worldMap = makeSmallWorldMap({ leyLine: 'core' });
		const quest = makeThreadsOfPowerQuest();
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 2, y: 2 },
			trueSightActive: 2,
			quests: [quest],
		});
		trackLeyLineQuestProgress(state);
		const obj = quest.objectives.find(o => o.id === 'tp_walk_line')!;
		expect(obj.completed).toBe(true);
		expect(obj.current).toBe(1);
		expect(state.messages.some(m => m.text.includes('glow dims but persists'))).toBe(true);
	});

	it('does not complete objective 2 without True Sight', () => {
		const worldMap = makeSmallWorldMap({ leyLine: 'core' });
		const quest = makeThreadsOfPowerQuest();
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 2, y: 2 },
			trueSightActive: 0,
			quests: [quest],
		});
		trackLeyLineQuestProgress(state);
		const obj = quest.objectives.find(o => o.id === 'tp_walk_line')!;
		expect(obj.completed).toBe(false);
	});

	it('completes objective 3 when on convergence with full mana and objectives 1+2 done', () => {
		const worldMap = makeSmallWorldMap({ leyLine: 'convergence' });
		const quest = makeThreadsOfPowerQuest();
		// Pre-complete objectives 1 and 2
		quest.objectives[0].completed = true;
		quest.objectives[0].current = 1;
		quest.objectives[1].completed = true;
		quest.objectives[1].current = 1;
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 2, y: 2 },
			trueSightActive: 0,
			quests: [quest],
			completedQuestIds: [],
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
		trackLeyLineQuestProgress(state);
		const obj3 = quest.objectives.find(o => o.id === 'tp_return_convergence')!;
		expect(obj3.completed).toBe(true);
		expect(obj3.current).toBe(1);
		expect(state.messages.some(m => m.text.includes('Academy was built here'))).toBe(true);
	});

	it('does not complete objective 3 when mana is not full', () => {
		const worldMap = makeSmallWorldMap({ leyLine: 'convergence' });
		const quest = makeThreadsOfPowerQuest();
		quest.objectives[0].completed = true;
		quest.objectives[0].current = 1;
		quest.objectives[1].completed = true;
		quest.objectives[1].current = 1;
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 2, y: 2 },
			trueSightActive: 0,
			quests: [quest],
			player: {
				pos: { x: 5, y: 5 },
				char: '@',
				color: '#ff0',
				name: 'Hero',
				hp: 20,
				maxHp: 20,
				attack: 10,
				statusEffects: [],
				mana: 5,
				maxMana: 20,
			},
		});
		trackLeyLineQuestProgress(state);
		const obj3 = quest.objectives.find(o => o.id === 'tp_return_convergence')!;
		expect(obj3.completed).toBe(false);
	});

	it('does not complete objective 3 when objectives 1+2 are not done', () => {
		const worldMap = makeSmallWorldMap({ leyLine: 'convergence' });
		const quest = makeThreadsOfPowerQuest();
		// Only objective 1 done
		quest.objectives[0].completed = true;
		quest.objectives[0].current = 1;
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 2, y: 2 },
			trueSightActive: 0,
			quests: [quest],
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
		trackLeyLineQuestProgress(state);
		const obj3 = quest.objectives.find(o => o.id === 'tp_return_convergence')!;
		expect(obj3.completed).toBe(false);
	});

	it('auto-completes quest when all objectives are done', () => {
		const worldMap = makeSmallWorldMap({ leyLine: 'convergence' });
		const quest = makeThreadsOfPowerQuest();
		// Pre-complete objectives 1 and 2
		quest.objectives[0].completed = true;
		quest.objectives[0].current = 1;
		quest.objectives[1].completed = true;
		quest.objectives[1].current = 1;
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 2, y: 2 },
			trueSightActive: 0,
			quests: [quest],
			completedQuestIds: [],
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
		trackLeyLineQuestProgress(state);
		// Quest should be completed
		expect(quest.status).toBe('completed');
		expect(state.completedQuestIds).toContain('threads_of_power');
		expect(state.messages.some(m => m.text.includes('Quest completed'))).toBe(true);
	});

	it('does not re-complete already completed objectives', () => {
		const worldMap = makeSmallWorldMap({ leyLine: 'convergence' });
		const quest = makeThreadsOfPowerQuest();
		quest.objectives[0].completed = true;
		quest.objectives[0].current = 1;
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 2, y: 2 },
			trueSightActive: 5,
			quests: [quest],
		});
		const msgCountBefore = state.messages.length;
		trackLeyLineQuestProgress(state);
		// Should not add the "erupts with light" message again
		expect(state.messages.filter(m => m.text.includes('erupts with light')).length).toBe(0);
	});

	it('does nothing when not in overworld mode', () => {
		const worldMap = makeSmallWorldMap({ leyLine: 'convergence' });
		const quest = makeThreadsOfPowerQuest();
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 2, y: 2 },
			locationMode: 'location' as any,
			trueSightActive: 5,
			quests: [quest],
		});
		trackLeyLineQuestProgress(state);
		const obj = quest.objectives.find(o => o.id === 'tp_cast_truesight')!;
		expect(obj.completed).toBe(false);
	});
});

// ── trackBlightedHarvestProgress ──

/** Create a Blighted Harvest quest in active state. */
function makeBlightedHarvestQuest(): Quest {
	return {
		id: 'blighted_harvest',
		title: 'Blighted Harvest',
		description: 'Investigate the strange happenings at Thornfield Farm.',
		status: 'active',
		objectives: [
			{ id: 'bh_investigate', description: 'Investigate the farm with True Sight or Reveal Secrets', type: 'explore', target: 'farm_investigate', current: 0, required: 1, completed: false },
			{ id: 'bh_resolve', description: 'Ward the well or redirect the ley line', type: 'explore', target: 'farm_resolve', current: 0, required: 1, completed: false },
		],
		rewards: { xp: 200, items: ['ley_water_vial'] },
		giverNpcName: 'Farmer Edric',
		regionId: 'hearthlands',
		isMainQuest: false,
		turnAccepted: 0,
	};
}

/** Create a small world map with Thornfield Farm settlement at a given position. */
function makeWorldMapWithFarm(farmPos: { x: number; y: number } = { x: 2, y: 2 }): WorldMap {
	const wm = makeSmallWorldMap();
	wm.settlements.push({
		id: 'thornfield_farm',
		name: 'Thornfield Farm',
		region: 'hearthlands',
		pos: farmPos,
		type: 'village',
	});
	return wm;
}

describe('trackBlightedHarvestProgress', () => {
	it('does nothing when quest is not active', () => {
		const worldMap = makeWorldMapWithFarm();
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 2, y: 2 },
			trueSightActive: 5,
			quests: [],
		});
		trackBlightedHarvestProgress(state);
		expect(state.messages.every(m => !m.text.includes('magical sight'))).toBe(true);
	});

	it('completes bh_investigate when near farm with True Sight active', () => {
		const worldMap = makeWorldMapWithFarm({ x: 2, y: 2 });
		const quest = makeBlightedHarvestQuest();
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 2, y: 2 },
			trueSightActive: 3,
			quests: [quest],
		});
		trackBlightedHarvestProgress(state);
		const obj = quest.objectives.find(o => o.id === 'bh_investigate')!;
		expect(obj.completed).toBe(true);
		expect(obj.current).toBe(1);
		expect(state.messages.some(m => m.text.includes('magical sight'))).toBe(true);
	});

	it('completes bh_investigate when near farm with Reveal Secrets pinged tiles', () => {
		const worldMap = makeWorldMapWithFarm({ x: 2, y: 2 });
		const quest = makeBlightedHarvestQuest();
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 3, y: 2 },
			trueSightActive: 0,
			revealedLeyLineTiles: new Set(['2,2', '3,3']),
			quests: [quest],
		});
		trackBlightedHarvestProgress(state);
		const obj = quest.objectives.find(o => o.id === 'bh_investigate')!;
		expect(obj.completed).toBe(true);
	});

	it('completes bh_investigate when within 2 tiles of farm', () => {
		const worldMap = makeWorldMapWithFarm({ x: 2, y: 2 });
		const quest = makeBlightedHarvestQuest();
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 4, y: 2 },  // 2 tiles away on x axis
			trueSightActive: 1,
			quests: [quest],
		});
		trackBlightedHarvestProgress(state);
		const obj = quest.objectives.find(o => o.id === 'bh_investigate')!;
		expect(obj.completed).toBe(true);
	});

	it('does not complete bh_investigate when too far from farm', () => {
		const worldMap = makeWorldMapWithFarm({ x: 0, y: 0 });
		const quest = makeBlightedHarvestQuest();
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 4, y: 4 },  // far from farm at 0,0
			trueSightActive: 5,
			quests: [quest],
		});
		trackBlightedHarvestProgress(state);
		const obj = quest.objectives.find(o => o.id === 'bh_investigate')!;
		expect(obj.completed).toBe(false);
	});

	it('does not complete bh_investigate without True Sight or Reveal Secrets', () => {
		const worldMap = makeWorldMapWithFarm({ x: 2, y: 2 });
		const quest = makeBlightedHarvestQuest();
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 2, y: 2 },
			trueSightActive: 0,
			revealedLeyLineTiles: new Set(),
			quests: [quest],
		});
		trackBlightedHarvestProgress(state);
		const obj = quest.objectives.find(o => o.id === 'bh_investigate')!;
		expect(obj.completed).toBe(false);
	});

	it('does not re-complete already completed bh_investigate', () => {
		const worldMap = makeWorldMapWithFarm({ x: 2, y: 2 });
		const quest = makeBlightedHarvestQuest();
		quest.objectives[0].completed = true;
		quest.objectives[0].current = 1;
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 2, y: 2 },
			trueSightActive: 5,
			quests: [quest],
		});
		const msgCountBefore = state.messages.length;
		trackBlightedHarvestProgress(state);
		expect(state.messages.filter(m => m.text.includes('magical sight')).length).toBe(0);
	});

	it('completes bh_investigate when inside farm location', () => {
		const worldMap = makeWorldMapWithFarm({ x: 2, y: 2 });
		const quest = makeBlightedHarvestQuest();
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 0, y: 0 },  // far from farm on overworld
			currentLocationId: 'thornfield_farm',
			trueSightActive: 3,
			quests: [quest],
		});
		trackBlightedHarvestProgress(state);
		const obj = quest.objectives.find(o => o.id === 'bh_investigate')!;
		expect(obj.completed).toBe(true);
	});

	it('does nothing when not in overworld mode', () => {
		const worldMap = makeWorldMapWithFarm({ x: 2, y: 2 });
		const quest = makeBlightedHarvestQuest();
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 2, y: 2 },
			locationMode: 'location' as any,
			trueSightActive: 5,
			quests: [quest],
		});
		trackBlightedHarvestProgress(state);
		const obj = quest.objectives.find(o => o.id === 'bh_investigate')!;
		expect(obj.completed).toBe(false);
	});

	it('does nothing when Thornfield Farm settlement is missing', () => {
		const worldMap = makeSmallWorldMap();  // no farm settlement
		const quest = makeBlightedHarvestQuest();
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 2, y: 2 },
			trueSightActive: 5,
			quests: [quest],
		});
		trackBlightedHarvestProgress(state);
		const obj = quest.objectives.find(o => o.id === 'bh_investigate')!;
		expect(obj.completed).toBe(false);
	});
});

// ── Ley line terrain flavor text ──

describe('handleOverworldInput ley line flavor text', () => {
	const noopCreate = () => makeOverworldState();
	const noopNewLevel = () => makeOverworldState();

	it('shows ley line flavor text when walking on core tile with True Sight', () => {
		const worldMap = makeSmallWorldMap({ leyLine: 'core', terrain: 'farmland' });
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 1, y: 2 },
			trueSightActive: 5,
		});
		const result = handleOverworldInput(state, 'd', noopCreate, noopNewLevel);
		expect(result.messages.some(m => m.text.includes('unnaturally tall'))).toBe(true);
	});

	it('shows flavor text on convergence tile with True Sight', () => {
		const worldMap = makeSmallWorldMap({ leyLine: 'convergence', terrain: 'forest' });
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 1, y: 2 },
			trueSightActive: 3,
		});
		const result = handleOverworldInput(state, 'd', noopCreate, noopNewLevel);
		expect(result.messages.some(m => m.text.includes('trees hum faintly'))).toBe(true);
	});

	it('shows generic flavor when terrain has no specific text', () => {
		const worldMap = makeSmallWorldMap({ leyLine: 'core', terrain: 'mud' as any });
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 1, y: 2 },
			trueSightActive: 5,
		});
		const result = handleOverworldInput(state, 'd', noopCreate, noopNewLevel);
		expect(result.messages.some(m => m.text.includes('raw magical energy'))).toBe(true);
	});

	it('does not show flavor text without True Sight', () => {
		const worldMap = makeSmallWorldMap({ leyLine: 'core', terrain: 'grass' });
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 1, y: 2 },
			trueSightActive: 0,
		});
		const result = handleOverworldInput(state, 'd', noopCreate, noopNewLevel);
		expect(result.messages.every(m => !m.text.includes('ground pulses'))).toBe(true);
	});

	it('does not show flavor text on aura tiles', () => {
		const worldMap = makeSmallWorldMap({ leyLine: 'aura', terrain: 'grass' });
		const state = makeOverworldState({
			worldMap,
			overworldPos: { x: 1, y: 2 },
			trueSightActive: 5,
		});
		const result = handleOverworldInput(state, 'd', noopCreate, noopNewLevel);
		expect(result.messages.every(m => !m.text.includes('ground pulses') && !m.text.includes('raw magical energy'))).toBe(true);
	});
});
