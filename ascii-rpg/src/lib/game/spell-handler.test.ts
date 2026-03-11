import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	handleSpellTargeting,
	handleRitualChanneling,
	handleSpellMenu,
	learnSpell,
	learnRitual,
	assignQuickCast,
	tickTerrainEffects,
	checkRitualInterrupt,
} from './spell-handler';
import type { GameState, Entity, CharacterClass } from './types';
import { Visibility } from './types';

function makeEnemy(x: number, y: number, overrides?: Partial<Entity>): Entity {
	return {
		pos: { x, y },
		char: 'G',
		color: '#0f0',
		name: 'Goblin',
		hp: 10,
		maxHp: 10,
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
			statusEffects: [],
			mana: 50,
			maxMana: 50,
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
		characterConfig: { name: 'Hero', characterClass: 'mage' as const, difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' },
		abilityCooldown: 0,
		hazards: [],
		npcs: [],
		chests: [],
		lootDrops: [],
		skillPoints: 3,
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
		spellMenuOpen: true,
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
		...overrides
	};
}

// ── tickTerrainEffects ──

describe('tickTerrainEffects', () => {
	it('damages player standing on burning tile', () => {
		const state = makeTestState({
			terrainEffects: [{
				pos: { x: 5, y: 5 },
				type: 'burning',
				duration: 3,
				damagePerTurn: 2,
			}],
		});

		tickTerrainEffects(state);
		expect(state.player.hp).toBe(18);
		expect(state.messages.some(m => m.text.includes('burning ground'))).toBe(true);
	});

	it('damages enemies standing on burning tile', () => {
		const enemy = makeEnemy(3, 3, { hp: 10 });
		const state = makeTestState({
			enemies: [enemy],
			terrainEffects: [{
				pos: { x: 3, y: 3 },
				type: 'burning',
				duration: 3,
				damagePerTurn: 4,
			}],
		});

		tickTerrainEffects(state);
		expect(enemy.hp).toBe(6);
	});

	it('decrements duration each tick', () => {
		const state = makeTestState({
			terrainEffects: [{
				pos: { x: 0, y: 0 },
				type: 'burning',
				duration: 3,
				damagePerTurn: 1,
			}],
		});

		tickTerrainEffects(state);
		expect(state.terrainEffects[0].duration).toBe(2);
	});

	it('removes expired terrain effects', () => {
		const state = makeTestState({
			terrainEffects: [{
				pos: { x: 0, y: 0 },
				type: 'burning',
				duration: 1,
				damagePerTurn: 1,
			}],
		});

		tickTerrainEffects(state);
		expect(state.terrainEffects.length).toBe(0);
	});

	it('does nothing if terrainEffects is empty/undefined', () => {
		const state = makeTestState({ terrainEffects: [] });
		tickTerrainEffects(state);
		expect(state.player.hp).toBe(20);

		const state2 = makeTestState();
		(state2 as any).terrainEffects = undefined;
		tickTerrainEffects(state2);
		expect(state2.player.hp).toBe(20);
	});

	it('kills enemy on burning tile and logs message', () => {
		const enemy = makeEnemy(3, 3, { hp: 2, maxHp: 5 });
		const state = makeTestState({
			enemies: [enemy],
			terrainEffects: [{
				pos: { x: 3, y: 3 },
				type: 'burning',
				duration: 3,
				damagePerTurn: 5,
			}],
		});

		tickTerrainEffects(state);
		expect(enemy.hp).toBeLessThanOrEqual(0);
		expect(state.messages.some(m => m.text.includes('killed by burning ground'))).toBe(true);
	});
});

// ── checkRitualInterrupt ──

describe('checkRitualInterrupt', () => {
	it('does nothing if not channeling', () => {
		const state = makeTestState({ ritualChanneling: null });
		checkRitualInterrupt(state, 5);
		expect(state.ritualChanneling).toBeNull();
	});

	it('does nothing if turnsRemaining <= 0', () => {
		const state = makeTestState({
			ritualChanneling: { ritualId: 'ritual_ward_of_protection', turnsRemaining: 0, turnsTotal: 3 },
		});
		checkRitualInterrupt(state, 5);
		// Still present (not nulled)
		expect(state.ritualChanneling).not.toBeNull();
	});

	it('cancels channeling when interruption roll succeeds', () => {
		const state = makeTestState({
			ritualChanneling: { ritualId: 'ritual_ward_of_protection', turnsRemaining: 2, turnsTotal: 3 },
		});
		// rollInterruption returns true when Math.random() < 0.75, so force it below 0.75
		vi.spyOn(Math, 'random').mockReturnValue(0.1);

		checkRitualInterrupt(state, 5);
		expect(state.ritualChanneling).toBeNull();
		expect(state.messages.some(m => m.text.includes('concentration shatters'))).toBe(true);

		vi.restoreAllMocks();
	});

	it('holds focus when interruption roll fails', () => {
		const state = makeTestState({
			ritualChanneling: { ritualId: 'ritual_ward_of_protection', turnsRemaining: 2, turnsTotal: 3 },
		});
		// rollInterruption returns false when Math.random() >= 0.75
		vi.spyOn(Math, 'random').mockReturnValue(0.9);

		checkRitualInterrupt(state, 5);
		expect(state.ritualChanneling).not.toBeNull();
		expect(state.messages.some(m => m.text.includes('hold your focus'))).toBe(true);

		vi.restoreAllMocks();
	});
});

// ── learnSpell ──

describe('learnSpell', () => {
	it('adds spell to learned list', () => {
		const state = makeTestState({ skillPoints: 1 });
		const result = learnSpell(state, 'spell_firebolt');
		expect(result).toBe(true);
		expect(state.learnedSpells).toContain('spell_firebolt');
	});

	it('assigns first empty quick-cast slot', () => {
		const state = makeTestState({ skillPoints: 1 });
		learnSpell(state, 'spell_firebolt');
		expect(state.quickCastSlots[0]).toBe('spell_firebolt');
	});

	it('rejects duplicate spells', () => {
		const state = makeTestState({ skillPoints: 2, learnedSpells: ['spell_firebolt'] });
		const result = learnSpell(state, 'spell_firebolt');
		expect(result).toBe(false);
		expect(state.skillPoints).toBe(2); // not consumed
	});

	it('rejects unknown spell IDs', () => {
		const state = makeTestState({ skillPoints: 1 });
		const result = learnSpell(state, 'spell_nonexistent');
		expect(result).toBe(false);
	});

	it('requires talent points', () => {
		const state = makeTestState({ skillPoints: 0 });
		const result = learnSpell(state, 'spell_firebolt');
		expect(result).toBe(false);
		expect(state.messages.some(m => m.text.includes('talent point'))).toBe(true);
	});

	it('deducts talent point on success', () => {
		const state = makeTestState({ skillPoints: 2 });
		learnSpell(state, 'spell_firebolt');
		expect(state.skillPoints).toBe(1);
	});

	it('assigns second quick-cast slot if first is taken', () => {
		const state = makeTestState({ skillPoints: 2 });
		learnSpell(state, 'spell_firebolt');
		learnSpell(state, 'spell_frost_lance');
		expect(state.quickCastSlots[0]).toBe('spell_firebolt');
		expect(state.quickCastSlots[1]).toBe('spell_frost_lance');
	});
});

// ── learnRitual ──

describe('learnRitual', () => {
	it('adds ritual to learned list', () => {
		const state = makeTestState({ skillPoints: 1 });
		const result = learnRitual(state, 'ritual_ward_of_protection');
		expect(result).toBe(true);
		expect(state.learnedRituals).toContain('ritual_ward_of_protection');
	});

	it('rejects duplicate rituals', () => {
		const state = makeTestState({ skillPoints: 2, learnedRituals: ['ritual_ward_of_protection'] });
		const result = learnRitual(state, 'ritual_ward_of_protection');
		expect(result).toBe(false);
		expect(state.skillPoints).toBe(2);
	});

	it('rejects unknown ritual IDs', () => {
		const state = makeTestState({ skillPoints: 1 });
		const result = learnRitual(state, 'ritual_nonexistent');
		expect(result).toBe(false);
	});

	it('requires talent points', () => {
		const state = makeTestState({ skillPoints: 0 });
		const result = learnRitual(state, 'ritual_ward_of_protection');
		expect(result).toBe(false);
		expect(state.messages.some(m => m.text.includes('talent point'))).toBe(true);
	});

	it('deducts talent point on success', () => {
		const state = makeTestState({ skillPoints: 2 });
		learnRitual(state, 'ritual_ward_of_protection');
		expect(state.skillPoints).toBe(1);
	});
});

// ── assignQuickCast ──

describe('assignQuickCast', () => {
	it('sets quick-cast slot to given spell', () => {
		const state = makeTestState({ learnedSpells: ['spell_firebolt'] });
		assignQuickCast(state, 0, 'spell_firebolt');
		expect(state.quickCastSlots[0]).toBe('spell_firebolt');
	});

	it('rejects invalid slot numbers', () => {
		const state = makeTestState({ learnedSpells: ['spell_firebolt'] });
		const result = assignQuickCast(state, -1, 'spell_firebolt');
		expect(state.quickCastSlots).toEqual([null, null, null, null]);
	});

	it('rejects slot > 3', () => {
		const state = makeTestState({ learnedSpells: ['spell_firebolt'] });
		assignQuickCast(state, 4, 'spell_firebolt');
		expect(state.quickCastSlots).toEqual([null, null, null, null]);
	});

	it('rejects unlearned spells', () => {
		const state = makeTestState({ learnedSpells: [] });
		assignQuickCast(state, 0, 'spell_firebolt');
		expect(state.quickCastSlots[0]).toBeNull();
	});

	it('adds confirmation message', () => {
		const state = makeTestState({ learnedSpells: ['spell_firebolt'] });
		assignQuickCast(state, 2, 'spell_firebolt');
		expect(state.messages.some(m => m.text.includes('slot 3'))).toBe(true);
	});
});

// ── handleSpellTargeting ──

describe('handleSpellTargeting', () => {
	it('cancels on Escape', () => {
		const state = makeTestState({
			spellTargeting: { spellId: 'spell_firebolt', targetType: 'single_enemy' },
		});

		handleSpellTargeting(state, 'Escape');
		expect(state.spellTargeting).toBeNull();
		expect(state.messages.some(m => m.text.includes('cancelled'))).toBe(true);
	});

	it('reports no enemy on empty tile for single_enemy', () => {
		const state = makeTestState({
			spellTargeting: { spellId: 'spell_firebolt', targetType: 'single_enemy' },
			learnedSpells: ['spell_firebolt'],
		});
		// No enemy at (6,5) — player is at (5,5), pressing 'd' targets (6,5)
		handleSpellTargeting(state, 'd');
		expect(state.messages.some(m => m.text.includes('No enemy'))).toBe(true);
	});

	it('casts single_enemy on valid target', () => {
		const enemy = makeEnemy(6, 5, { hp: 20, maxHp: 20 });
		const state = makeTestState({
			spellTargeting: { spellId: 'spell_firebolt', targetType: 'single_enemy' },
			learnedSpells: ['spell_firebolt'],
			enemies: [enemy],
		});
		(state.player as any).mana = 50;

		handleSpellTargeting(state, 'd');
		// Targeting should be cleared after cast
		expect(state.spellTargeting).toBeNull();
	});

	it('moves area cursor with WASD', () => {
		const state = makeTestState({
			spellTargeting: { spellId: 'spell_fireball', targetType: 'area', cursorPos: { x: 5, y: 5 } },
			learnedSpells: ['spell_fireball'],
		});

		handleSpellTargeting(state, 'w');
		expect(state.spellTargeting!.cursorPos!.y).toBe(4);

		handleSpellTargeting(state, 'd');
		expect(state.spellTargeting!.cursorPos!.x).toBe(6);

		handleSpellTargeting(state, 's');
		expect(state.spellTargeting!.cursorPos!.y).toBe(5);

		handleSpellTargeting(state, 'a');
		expect(state.spellTargeting!.cursorPos!.x).toBe(5);
	});
});

// ── handleRitualChanneling ──

describe('handleRitualChanneling', () => {
	it('ticks channeling down on non-Escape key', () => {
		const state = makeTestState({
			ritualChanneling: { ritualId: 'ritual_ward_of_protection', turnsRemaining: 3, turnsTotal: 3 },
		});

		handleRitualChanneling(state, 'w');
		expect(state.ritualChanneling!.turnsRemaining).toBe(2);
	});

	it('cancels on Escape during active channeling', () => {
		const state = makeTestState({
			ritualChanneling: { ritualId: 'ritual_ward_of_protection', turnsRemaining: 2, turnsTotal: 3 },
		});

		handleRitualChanneling(state, 'Escape');
		expect(state.ritualChanneling).toBeNull();
		expect(state.messages.some(m => m.text.includes('break your concentration'))).toBe(true);
	});

	it('cancels seal direction on Escape', () => {
		const state = makeTestState({
			ritualChanneling: { ritualId: 'ritual_sealing', turnsRemaining: -1, turnsTotal: 4 },
		});

		handleRitualChanneling(state, 'Escape');
		expect(state.ritualChanneling).toBeNull();
		expect(state.messages.some(m => m.text.includes('cancelled'))).toBe(true);
	});
});

// ── handleSpellMenu ──

describe('handleSpellMenu', () => {
	it('closes on Escape', () => {
		const state = makeTestState({ spellMenuOpen: true });
		handleSpellMenu(state, 'Escape');
		expect(state.spellMenuOpen).toBe(false);
	});

	it('closes on m key', () => {
		const state = makeTestState({ spellMenuOpen: true });
		handleSpellMenu(state, 'm');
		expect(state.spellMenuOpen).toBe(false);
	});

	it('navigates up with w', () => {
		const state = makeTestState({
			spellMenuOpen: true,
			spellMenuCursor: 1,
			learnedSpells: ['spell_firebolt', 'spell_frost_lance'],
		});
		handleSpellMenu(state, 'w');
		expect(state.spellMenuCursor).toBe(0);
	});

	it('navigates down with s', () => {
		const state = makeTestState({
			spellMenuOpen: true,
			spellMenuCursor: 0,
			learnedSpells: ['spell_firebolt', 'spell_frost_lance'],
		});
		handleSpellMenu(state, 's');
		expect(state.spellMenuCursor).toBe(1);
	});

	it('does not navigate above 0', () => {
		const state = makeTestState({
			spellMenuOpen: true,
			spellMenuCursor: 0,
			learnedSpells: ['spell_firebolt'],
		});
		handleSpellMenu(state, 'w');
		expect(state.spellMenuCursor).toBe(0);
	});

	it('does not navigate below list end', () => {
		const state = makeTestState({
			spellMenuOpen: true,
			spellMenuCursor: 1,
			learnedSpells: ['spell_firebolt', 'spell_frost_lance'],
		});
		handleSpellMenu(state, 's');
		expect(state.spellMenuCursor).toBe(1);
	});

	it('navigates with ArrowUp/ArrowDown', () => {
		const state = makeTestState({
			spellMenuOpen: true,
			spellMenuCursor: 1,
			learnedSpells: ['spell_firebolt', 'spell_frost_lance'],
		});
		handleSpellMenu(state, 'ArrowUp');
		expect(state.spellMenuCursor).toBe(0);

		handleSpellMenu(state, 'ArrowDown');
		expect(state.spellMenuCursor).toBe(1);
	});
});

// ── True Sight activates trueSightActive ──

describe('True Sight ley line vision', () => {
	it('sets trueSightActive to 10 when True Sight is cast', () => {
		const state = makeTestState({
			learnedSpells: ['spell_true_sight'],
			spellMenuOpen: true,
			spellMenuCursor: 0,
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
			leyLineLevel: 2,
		});
		const result = handleSpellMenu(state, 'Enter');
		expect(result.trueSightActive).toBe(10);
	});
});

// ── Reveal Secrets populates revealedLeyLineTiles ──

describe('Reveal Secrets ley line detection', () => {
	it('populates revealedLeyLineTiles with nearby ley line positions', () => {
		const width = 15;
		const height = 15;
		const tiles: any[][] = Array.from({ length: height }, () =>
			Array.from({ length: width }, () => ({ terrain: 'grass', region: 'hearthlands' })),
		);
		// Place ley line tiles near player position (7,7)
		tiles[7][8] = { terrain: 'grass', region: 'hearthlands', leyLine: 'core' };
		tiles[6][7] = { terrain: 'grass', region: 'hearthlands', leyLine: 'aura' };
		tiles[10][10] = { terrain: 'grass', region: 'hearthlands', leyLine: 'convergence' };

		const worldMap = {
			width,
			height,
			tiles,
			regions: [],
			settlements: [],
			dungeonEntrances: [],
			roads: [],
			pois: [],
			explored: Array.from({ length: height }, () => Array.from({ length: width }, () => true)),
			leyLines: { northSouth: [], westEast: [] },
		};

		const state = makeTestState({
			learnedSpells: ['spell_reveal_secrets'],
			spellMenuOpen: true,
			spellMenuCursor: 0,
			locationMode: 'overworld' as const,
			worldMap: worldMap as any,
			overworldPos: { x: 7, y: 7 },
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
			leyLineLevel: 2,
		});
		const result = handleSpellMenu(state, 'Enter');
		// Tiles at (8,7) and (7,6) are within 5-tile radius; (10,10) is also within 5 tiles
		expect(result.revealedLeyLineTiles.has('8,7')).toBe(true);
		expect(result.revealedLeyLineTiles.has('7,6')).toBe(true);
		expect(result.revealedLeyLineTiles.has('10,10')).toBe(true);
	});

	it('shows magic message when ley lines are found', () => {
		const width = 15;
		const height = 15;
		const tiles: any[][] = Array.from({ length: height }, () =>
			Array.from({ length: width }, () => ({ terrain: 'grass', region: 'hearthlands' })),
		);
		tiles[7][8] = { terrain: 'grass', region: 'hearthlands', leyLine: 'core' };

		const worldMap = {
			width,
			height,
			tiles,
			regions: [],
			settlements: [],
			dungeonEntrances: [],
			roads: [],
			pois: [],
			explored: Array.from({ length: height }, () => Array.from({ length: width }, () => true)),
			leyLines: { northSouth: [], westEast: [] },
		};

		const state = makeTestState({
			learnedSpells: ['spell_reveal_secrets'],
			spellMenuOpen: true,
			spellMenuCursor: 0,
			locationMode: 'overworld' as const,
			worldMap: worldMap as any,
			overworldPos: { x: 7, y: 7 },
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
			leyLineLevel: 2,
		});
		const result = handleSpellMenu(state, 'Enter');
		expect(result.messages.some(m => m.text.includes('streams of magical energy'))).toBe(true);
	});

	it('does not populate revealedLeyLineTiles when not in overworld', () => {
		const state = makeTestState({
			learnedSpells: ['spell_reveal_secrets'],
			spellMenuOpen: true,
			spellMenuCursor: 0,
			locationMode: 'location' as const,
			worldMap: null,
			overworldPos: null,
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
			leyLineLevel: 2,
		});
		const result = handleSpellMenu(state, 'Enter');
		expect(result.revealedLeyLineTiles.size).toBe(0);
	});
});
