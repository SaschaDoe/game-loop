import { describe, it, expect } from 'vitest';
import { ITEM_CATALOG } from './items';
import { useInventoryItem } from './engine';
import type { GameState } from './types';
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
			statusEffects: [],
			mana: 10,
			maxMana: 30,
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
		...overrides,
	};
}

describe('ITEM_CATALOG - Ley Water Vial', () => {
	it('ley_water_vial exists in ITEM_CATALOG', () => {
		expect(ITEM_CATALOG['ley_water_vial']).toBeDefined();
		expect(ITEM_CATALOG['ley_water_vial'].type).toBe('consumable');
		expect(ITEM_CATALOG['ley_water_vial'].consumeEffect?.mana).toBe(15);
	});

	it('ley_water_vial has correct properties', () => {
		const item = ITEM_CATALOG['ley_water_vial'];
		expect(item.name).toBe('Ley Water Vial');
		expect(item.char).toBe('!');
		expect(item.color).toBe('#4ff');
		expect(item.rarity).toBe('rare');
		expect(item.consumeEffect?.hp).toBe(-3);
	});
});

describe('Consuming Ley Water Vial', () => {
	it('restores mana and reduces hp when consumed', () => {
		const state = makeTestState();
		state.player.mana = 10;
		state.player.maxMana = 30;
		state.player.hp = 20;
		state.player.maxHp = 20;
		state.inventory[0] = { ...ITEM_CATALOG['ley_water_vial'] };

		const result = useInventoryItem(state, 0);

		expect(result.player.mana).toBe(25); // 10 + 15
		expect(result.player.hp).toBe(17); // 20 - 3
		expect(result.inventory[0]).toBeNull(); // consumed
	});

	it('caps mana at maxMana', () => {
		const state = makeTestState();
		state.player.mana = 25;
		state.player.maxMana = 30;
		state.player.hp = 20;
		state.player.maxHp = 20;
		state.inventory[0] = { ...ITEM_CATALOG['ley_water_vial'] };

		const result = useInventoryItem(state, 0);

		expect(result.player.mana).toBe(30); // capped at maxMana
	});

	it('does not reduce hp below 1', () => {
		const state = makeTestState();
		state.player.mana = 10;
		state.player.maxMana = 30;
		state.player.hp = 2;
		state.player.maxHp = 20;
		state.inventory[0] = { ...ITEM_CATALOG['ley_water_vial'] };

		const result = useInventoryItem(state, 0);

		expect(result.player.hp).toBeGreaterThanOrEqual(1);
	});
});
