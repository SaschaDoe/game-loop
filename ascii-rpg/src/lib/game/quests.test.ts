import { describe, it, expect } from 'vitest';
import {
	QUEST_CATALOG,
	createQuestFromDef,
	acceptQuest,
	updateQuestProgress,
	completeQuest,
	failQuest,
	checkTimedQuests,
	getActiveQuests,
	getAvailableQuests,
} from './quests';
import type { QuestDef } from './quests';
import type { GameState } from './types';
import { Visibility } from './types';

function makeTestState(overrides: Partial<GameState> = {}): GameState {
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
		...overrides,
	};
}

// ---------------------------------------------------------------------------
// QUEST_CATALOG structure
// ---------------------------------------------------------------------------

describe('QUEST_CATALOG', () => {
	const allDefs = Object.values(QUEST_CATALOG);

	it('has the expected number of quests (5 main + 57 side + 9 racial = 71)', () => {
		expect(Object.keys(QUEST_CATALOG).length).toBe(71);
	});

	it('every quest has a valid id that matches its catalog key', () => {
		for (const [key, def] of Object.entries(QUEST_CATALOG)) {
			expect(def.id).toBe(key);
		}
	});

	it('every quest has a non-empty title and description', () => {
		for (const def of allDefs) {
			expect(def.title.length).toBeGreaterThan(0);
			expect(def.description.length).toBeGreaterThan(0);
		}
	});

	it('every quest has at least one objective', () => {
		for (const def of allDefs) {
			expect(def.objectives.length).toBeGreaterThanOrEqual(1);
		}
	});

	it('every objective has a valid type', () => {
		const validTypes = ['kill', 'collect', 'talk', 'explore', 'escort', 'deliver'];
		for (const def of allDefs) {
			for (const obj of def.objectives) {
				expect(validTypes).toContain(obj.type);
			}
		}
	});

	it('every objective has required > 0', () => {
		for (const def of allDefs) {
			for (const obj of def.objectives) {
				expect(obj.required).toBeGreaterThan(0);
			}
		}
	});

	it('every quest has rewards with at least xp defined', () => {
		for (const def of allDefs) {
			expect(def.rewards).toBeDefined();
			expect(def.rewards.xp).toBeGreaterThan(0);
		}
	});

	it('contains a mix of main and side quests', () => {
		const mainQuests = allDefs.filter((d) => d.isMainQuest);
		const sideQuests = allDefs.filter((d) => !d.isMainQuest);
		expect(mainQuests.length).toBe(5);
		expect(sideQuests.length).toBe(66);
	});

	it('main quests form a prerequisite chain', () => {
		const mainIds = ['main_01_whispers', 'main_02_names_erased', 'main_03_seven_masks', 'main_04_blood_price', 'main_05_unmasking'];
		expect(QUEST_CATALOG[mainIds[0]].prerequisiteQuestId).toBeUndefined();
		for (let i = 1; i < mainIds.length; i++) {
			expect(QUEST_CATALOG[mainIds[i]].prerequisiteQuestId).toBe(mainIds[i - 1]);
		}
	});

	it('objective ids are unique within each quest', () => {
		for (const def of allDefs) {
			const ids = def.objectives.map((o) => o.id);
			expect(new Set(ids).size).toBe(ids.length);
		}
	});

	it('all quest ids are globally unique', () => {
		const ids = allDefs.map((d) => d.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

// ---------------------------------------------------------------------------
// createQuestFromDef
// ---------------------------------------------------------------------------

describe('createQuestFromDef', () => {
	it('creates a valid quest from a known catalog id', () => {
		const quest = createQuestFromDef('side_gw_rats', 10);
		expect(quest).not.toBeNull();
		expect(quest!.id).toBe('side_gw_rats');
		expect(quest!.title).toBe('Cellar Troubles');
		expect(quest!.status).toBe('active');
		expect(quest!.turnAccepted).toBe(10);
		expect(quest!.turnLimit).toBe(100);
	});

	it('returns null for an unknown quest id', () => {
		const quest = createQuestFromDef('nonexistent_quest', 0);
		expect(quest).toBeNull();
	});

	it('initialises all objectives with current=0 and completed=false', () => {
		const quest = createQuestFromDef('main_05_unmasking', 0);
		expect(quest).not.toBeNull();
		for (const obj of quest!.objectives) {
			expect(obj.current).toBe(0);
			expect(obj.completed).toBe(false);
		}
	});

	it('copies objective details from the definition', () => {
		const quest = createQuestFromDef('side_gw_rats', 5);
		expect(quest!.objectives).toHaveLength(1);
		expect(quest!.objectives[0].type).toBe('kill');
		expect(quest!.objectives[0].target).toBe('Rat');
		expect(quest!.objectives[0].required).toBe(6);
	});

	it('preserves isMainQuest flag', () => {
		const main = createQuestFromDef('main_01_whispers', 0);
		const side = createQuestFromDef('side_gw_rats', 0);
		expect(main!.isMainQuest).toBe(true);
		expect(side!.isMainQuest).toBe(false);
	});

	it('includes optional fields from the definition', () => {
		const quest = createQuestFromDef('side_gw_rats', 0);
		expect(quest!.giverNpcName).toBe('Marta the Innkeeper');
		expect(quest!.regionId).toBe('greenweald');
	});
});

// ---------------------------------------------------------------------------
// acceptQuest
// ---------------------------------------------------------------------------

describe('acceptQuest', () => {
	it('accepts a valid quest and adds it to state.quests', () => {
		const state = makeTestState();
		const result = acceptQuest(state, 'side_gw_rats');
		expect(result.success).toBe(true);
		expect(result.message).toContain('Cellar Troubles');
		expect(state.quests).toHaveLength(1);
		expect(state.quests[0].id).toBe('side_gw_rats');
	});

	it('rejects a quest that is already active', () => {
		const state = makeTestState();
		acceptQuest(state, 'side_gw_rats');
		const result = acceptQuest(state, 'side_gw_rats');
		expect(result.success).toBe(false);
		expect(result.message).toContain('already on this quest');
		expect(state.quests).toHaveLength(1);
	});

	it('rejects a quest that is already completed', () => {
		const state = makeTestState({ completedQuestIds: ['side_gw_rats'] });
		const result = acceptQuest(state, 'side_gw_rats');
		expect(result.success).toBe(false);
		expect(result.message).toContain('already completed');
	});

	it('rejects an unknown quest id', () => {
		const state = makeTestState();
		const result = acceptQuest(state, 'totally_fake_quest');
		expect(result.success).toBe(false);
		expect(result.message).toContain('Unknown quest');
	});

	it('rejects a quest whose prerequisite is not completed', () => {
		const state = makeTestState();
		const result = acceptQuest(state, 'main_02_names_erased');
		expect(result.success).toBe(false);
		expect(result.message).toContain('not yet ready');
	});

	it('accepts a quest whose prerequisite is completed', () => {
		const state = makeTestState({ completedQuestIds: ['main_01_whispers'] });
		const result = acceptQuest(state, 'main_02_names_erased');
		expect(result.success).toBe(true);
		expect(state.quests).toHaveLength(1);
	});

	it('allows retrying a previously failed quest', () => {
		const state = makeTestState({ failedQuestIds: ['side_gw_rats'] });
		const result = acceptQuest(state, 'side_gw_rats');
		expect(result.success).toBe(true);
		expect(state.failedQuestIds).not.toContain('side_gw_rats');
		expect(state.quests).toHaveLength(1);
	});

	it('sets turnAccepted to the current turnCount', () => {
		const state = makeTestState({ turnCount: 42 });
		acceptQuest(state, 'side_gw_rats');
		expect(state.quests[0].turnAccepted).toBe(42);
	});
});

// ---------------------------------------------------------------------------
// updateQuestProgress
// ---------------------------------------------------------------------------

describe('updateQuestProgress', () => {
	it('advances kill objectives when target matches', () => {
		const state = makeTestState();
		acceptQuest(state, 'side_gw_rats');
		const msgs = updateQuestProgress(state, 'kill', 'Rat', 1);
		expect(state.quests[0].objectives[0].current).toBe(1);
		expect(msgs).toHaveLength(0); // not complete yet
	});

	it('completes a kill objective when required count is reached', () => {
		const state = makeTestState();
		acceptQuest(state, 'side_gw_rats');
		const msgs = updateQuestProgress(state, 'kill', 'Rat', 6);
		expect(state.quests[0].objectives[0].current).toBe(6);
		expect(state.quests[0].objectives[0].completed).toBe(true);
		expect(msgs.length).toBeGreaterThan(0);
		expect(msgs[0]).toContain('complete');
	});

	it('does not exceed required count', () => {
		const state = makeTestState();
		acceptQuest(state, 'side_gw_rats');
		updateQuestProgress(state, 'kill', 'Rat', 100);
		expect(state.quests[0].objectives[0].current).toBe(6);
	});

	it('ignores events that do not match the target', () => {
		const state = makeTestState();
		acceptQuest(state, 'side_gw_rats');
		updateQuestProgress(state, 'kill', 'Wolf', 5);
		expect(state.quests[0].objectives[0].current).toBe(0);
	});

	it('ignores events that do not match the objective type', () => {
		const state = makeTestState();
		acceptQuest(state, 'side_gw_rats');
		updateQuestProgress(state, 'talk', 'Rat', 1);
		expect(state.quests[0].objectives[0].current).toBe(0);
	});

	it('updates talk objectives', () => {
		const state = makeTestState();
		acceptQuest(state, 'side_gw_elder');
		// First objective is explore, second is talk
		updateQuestProgress(state, 'talk', 'Druid Fen', 1);
		const talkObj = state.quests[0].objectives.find((o) => o.type === 'talk');
		expect(talkObj!.current).toBe(1);
		expect(talkObj!.completed).toBe(true);
	});

	it('updates explore objectives', () => {
		const state = makeTestState();
		acceptQuest(state, 'side_gw_elder');
		updateQuestProgress(state, 'explore', 'ancient_tree', 1);
		const exploreObj = state.quests[0].objectives.find((o) => o.type === 'explore');
		expect(exploreObj!.current).toBe(1);
		expect(exploreObj!.completed).toBe(true);
	});

	it('does not update objectives on non-active quests', () => {
		const state = makeTestState();
		acceptQuest(state, 'side_gw_rats');
		state.quests[0].status = 'completed';
		updateQuestProgress(state, 'kill', 'Rat', 6);
		expect(state.quests[0].objectives[0].current).toBe(0);
	});

	it('does not update already-completed objectives', () => {
		const state = makeTestState();
		acceptQuest(state, 'side_gw_rats');
		updateQuestProgress(state, 'kill', 'Rat', 6);
		// Calling again should produce no messages (already complete)
		const msgs = updateQuestProgress(state, 'kill', 'Rat', 1);
		expect(msgs).toHaveLength(0);
	});

	it('can update multiple quests simultaneously', () => {
		const state = makeTestState();
		acceptQuest(state, 'side_gw_rats'); // kill Rat x6
		// Manually add another quest that also involves killing Rats
		const extraQuest = createQuestFromDef('side_th_goblins', 0);
		state.quests.push(extraQuest!);
		updateQuestProgress(state, 'kill', 'Rat', 3);
		expect(state.quests[0].objectives[0].current).toBe(3); // rats quest
		// Goblin quest targets 'Goblin' not 'Rat' — should be unaffected
		expect(state.quests[1].objectives[0].current).toBe(0);
	});
});

// ---------------------------------------------------------------------------
// completeQuest
// ---------------------------------------------------------------------------

describe('completeQuest', () => {
	it('completes a quest when all objectives are done', () => {
		const state = makeTestState();
		acceptQuest(state, 'side_gw_rats');
		updateQuestProgress(state, 'kill', 'Rat', 6);

		const result = completeQuest(state, 'side_gw_rats');
		expect(result.success).toBe(true);
		expect(result.messages[0]).toContain('Quest completed');
		expect(state.quests[0].status).toBe('completed');
		expect(state.completedQuestIds).toContain('side_gw_rats');
	});

	it('fails to complete a quest with incomplete objectives', () => {
		const state = makeTestState();
		acceptQuest(state, 'side_gw_rats');
		updateQuestProgress(state, 'kill', 'Rat', 3);

		const result = completeQuest(state, 'side_gw_rats');
		expect(result.success).toBe(false);
		expect(result.messages[0]).toContain('Not all objectives');
	});

	it('fails for a quest that is not active', () => {
		const state = makeTestState();
		const result = completeQuest(state, 'side_gw_rats');
		expect(result.success).toBe(false);
		expect(result.messages[0]).toContain('not found or not active');
	});

	it('grants XP reward', () => {
		const state = makeTestState();
		acceptQuest(state, 'side_gw_rats');
		updateQuestProgress(state, 'kill', 'Rat', 6);
		completeQuest(state, 'side_gw_rats');
		expect(state.xp).toBe(50);
	});

	it('grants HP reward', () => {
		const state = makeTestState();
		acceptQuest(state, 'side_gw_herbs');
		updateQuestProgress(state, 'collect', 'moonpetal', 4);
		const beforeMaxHp = state.player.maxHp;
		const beforeHp = state.player.hp;
		completeQuest(state, 'side_gw_herbs');
		expect(state.player.maxHp).toBe(beforeMaxHp + 2);
		expect(state.player.hp).toBe(beforeHp + 2);
	});

	it('grants ATK reward', () => {
		const state = makeTestState();
		acceptQuest(state, 'side_hl_wolves');
		updateQuestProgress(state, 'kill', 'Wolf', 5);
		const beforeAtk = state.player.attack;
		completeQuest(state, 'side_hl_wolves');
		expect(state.player.attack).toBe(beforeAtk + 1);
	});

	it('grants rumor reward', () => {
		const state = makeTestState();
		acceptQuest(state, 'side_gw_elder');
		updateQuestProgress(state, 'explore', 'ancient_tree', 1);
		updateQuestProgress(state, 'talk', 'Druid Fen', 1);
		completeQuest(state, 'side_gw_elder');
		expect(state.rumors).toHaveLength(1);
		expect(state.rumors[0].id).toBe('rumor_elder_oak');
	});

	it('grants story reward and adds to heardStories', () => {
		const state = makeTestState({ completedQuestIds: ['main_01_whispers'] });
		acceptQuest(state, 'main_02_names_erased');
		updateQuestProgress(state, 'talk', 'The Archivist', 1);
		updateQuestProgress(state, 'explore', 'sealed_archive_3', 1);
		completeQuest(state, 'main_02_names_erased');
		expect(state.heardStories).toContain('story_erased_names');
	});

	it('does not duplicate heardStories if already heard', () => {
		const state = makeTestState({
			completedQuestIds: ['main_01_whispers'],
			heardStories: ['story_erased_names'],
		});
		acceptQuest(state, 'main_02_names_erased');
		updateQuestProgress(state, 'talk', 'The Archivist', 1);
		updateQuestProgress(state, 'explore', 'sealed_archive_3', 1);
		completeQuest(state, 'main_02_names_erased');
		const count = state.heardStories.filter((s) => s === 'story_erased_names').length;
		expect(count).toBe(1);
	});

	it('increments stats.questsCompleted', () => {
		const state = makeTestState();
		acceptQuest(state, 'side_gw_rats');
		updateQuestProgress(state, 'kill', 'Rat', 6);
		completeQuest(state, 'side_gw_rats');
		expect(state.stats.questsCompleted).toBe(1);
	});
});

// ---------------------------------------------------------------------------
// failQuest
// ---------------------------------------------------------------------------

describe('failQuest', () => {
	it('marks an active quest as failed', () => {
		const state = makeTestState();
		acceptQuest(state, 'side_gw_rats');
		const msg = failQuest(state, 'side_gw_rats');
		expect(msg).toContain('Quest failed');
		expect(msg).toContain('Cellar Troubles');
		expect(state.quests[0].status).toBe('failed');
	});

	it('adds quest id to failedQuestIds', () => {
		const state = makeTestState();
		acceptQuest(state, 'side_gw_rats');
		failQuest(state, 'side_gw_rats');
		expect(state.failedQuestIds).toContain('side_gw_rats');
	});

	it('increments stats.questsFailed', () => {
		const state = makeTestState();
		acceptQuest(state, 'side_gw_rats');
		failQuest(state, 'side_gw_rats');
		expect(state.stats.questsFailed).toBe(1);
	});

	it('returns a message for a non-existent quest', () => {
		const state = makeTestState();
		const msg = failQuest(state, 'nonexistent');
		expect(msg).toContain('not found or not active');
	});
});

// ---------------------------------------------------------------------------
// checkTimedQuests
// ---------------------------------------------------------------------------

describe('checkTimedQuests', () => {
	it('fails quests that have exceeded their turn limit', () => {
		const state = makeTestState({ turnCount: 0 });
		acceptQuest(state, 'side_gw_rats'); // turnLimit: 100, turnAccepted: 0
		state.turnCount = 100;
		const msgs = checkTimedQuests(state);
		expect(msgs.length).toBeGreaterThan(0);
		expect(msgs[0]).toContain('Quest failed');
		expect(state.quests[0].status).toBe('failed');
	});

	it('does not fail quests that are within their turn limit', () => {
		const state = makeTestState({ turnCount: 0 });
		acceptQuest(state, 'side_gw_rats'); // turnLimit: 100
		state.turnCount = 50;
		const msgs = checkTimedQuests(state);
		expect(msgs).toHaveLength(0);
		expect(state.quests[0].status).toBe('active');
	});

	it('ignores quests without a turn limit', () => {
		const state = makeTestState({ turnCount: 0 });
		acceptQuest(state, 'side_gw_elder'); // no turnLimit
		state.turnCount = 99999;
		const msgs = checkTimedQuests(state);
		expect(msgs).toHaveLength(0);
		expect(state.quests[0].status).toBe('active');
	});

	it('ignores non-active quests', () => {
		const state = makeTestState({ turnCount: 0 });
		acceptQuest(state, 'side_gw_rats');
		state.quests[0].status = 'completed';
		state.turnCount = 200;
		const msgs = checkTimedQuests(state);
		expect(msgs).toHaveLength(0);
	});
});

// ---------------------------------------------------------------------------
// getActiveQuests
// ---------------------------------------------------------------------------

describe('getActiveQuests', () => {
	it('returns only active quests', () => {
		const state = makeTestState();
		acceptQuest(state, 'side_gw_rats');
		acceptQuest(state, 'side_gw_elder');
		failQuest(state, 'side_gw_rats');

		const active = getActiveQuests(state);
		expect(active).toHaveLength(1);
		expect(active[0].id).toBe('side_gw_elder');
	});

	it('returns empty array when no quests are active', () => {
		const state = makeTestState();
		expect(getActiveQuests(state)).toHaveLength(0);
	});
});

// ---------------------------------------------------------------------------
// getAvailableQuests
// ---------------------------------------------------------------------------

describe('getAvailableQuests', () => {
	it('returns quests filtered by NPC name', () => {
		const state = makeTestState();
		const available = getAvailableQuests(state, 'Marta the Innkeeper');
		expect(available.length).toBe(1);
		expect(available[0].id).toBe('side_gw_rats');
	});

	it('returns quests filtered by region', () => {
		const state = makeTestState();
		const available = getAvailableQuests(state, undefined, 'greenweald');
		const ids = available.map((d) => d.id);
		expect(ids).toContain('side_gw_rats');
		expect(ids).toContain('side_gw_herbs');
		expect(ids).toContain('side_gw_elder');
	});

	it('excludes active quests', () => {
		const state = makeTestState();
		acceptQuest(state, 'side_gw_rats');
		const available = getAvailableQuests(state, 'Marta the Innkeeper');
		expect(available).toHaveLength(0);
	});

	it('excludes completed quests', () => {
		const state = makeTestState({ completedQuestIds: ['side_gw_rats'] });
		const available = getAvailableQuests(state, 'Marta the Innkeeper');
		expect(available).toHaveLength(0);
	});

	it('includes failed quests (retryable)', () => {
		const state = makeTestState({ failedQuestIds: ['side_gw_rats'] });
		const available = getAvailableQuests(state, 'Marta the Innkeeper');
		expect(available.length).toBe(1);
		expect(available[0].id).toBe('side_gw_rats');
	});

	it('excludes quests whose prerequisites are not met', () => {
		const state = makeTestState();
		const available = getAvailableQuests(state, 'The Archivist');
		// main_02_names_erased requires main_01_whispers to be completed
		const ids = available.map((d) => d.id);
		expect(ids).not.toContain('main_02_names_erased');
	});

	it('includes quests whose prerequisites are met', () => {
		const state = makeTestState({ completedQuestIds: ['main_01_whispers'] });
		const available = getAvailableQuests(state, 'The Archivist');
		const ids = available.map((d) => d.id);
		expect(ids).toContain('main_02_names_erased');
	});

	it('returns all available quests when no filters are provided', () => {
		const state = makeTestState();
		const available = getAvailableQuests(state);
		// Non-prerequisite quests: side quests without prereqs (48) + main_01 (no prereq) = 49
		// Plus 1 racial quest (human_01, since default playerRace is 'human')
		// main_02-05, side_kort_crown, side_eg_beast, 7 arcane_conservatory prereqs, and 6 non-human racial quests are excluded
		expect(available.length).toBe(50);
	});

	it('returns quests filtered by both NPC name and region', () => {
		const state = makeTestState();
		const available = getAvailableQuests(state, 'Druid Fen', 'greenweald');
		expect(available.length).toBe(1);
		expect(available[0].id).toBe('side_gw_elder');
	});
});

// ---------------------------------------------------------------------------
// Ley line quests
// ---------------------------------------------------------------------------

describe('ley line quests', () => {
	it('has threads_of_power quest definition', () => {
		expect(QUEST_CATALOG['threads_of_power']).toBeDefined();
		expect(QUEST_CATALOG['threads_of_power'].title).toBe('Threads of Power');
		expect(QUEST_CATALOG['threads_of_power'].objectives).toHaveLength(3);
		expect(QUEST_CATALOG['threads_of_power'].isMainQuest).toBe(false);
	});

	it('has blighted_harvest quest definition', () => {
		expect(QUEST_CATALOG['blighted_harvest']).toBeDefined();
		expect(QUEST_CATALOG['blighted_harvest'].title).toBe('Blighted Harvest');
		expect(QUEST_CATALOG['blighted_harvest'].objectives).toHaveLength(2);
	});

	it('can accept threads_of_power', () => {
		const state = makeTestState();
		const result = acceptQuest(state, 'threads_of_power');
		expect(result.success).toBe(true);
		expect(state.quests[0].title).toBe('Threads of Power');
	});

	it('can accept blighted_harvest', () => {
		const state = makeTestState();
		const result = acceptQuest(state, 'blighted_harvest');
		expect(result.success).toBe(true);
		expect(state.quests[0].title).toBe('Blighted Harvest');
	});
});

// ---------------------------------------------------------------------------
// Racial questlines
// ---------------------------------------------------------------------------

describe('racial questlines', () => {
	const elfQuests = ['elf_01_withering_grove', 'elf_02_echoes', 'elf_03_unbroken_thread'];
	const dwarfQuests = ['dwarf_01_sealed_gallery', 'dwarf_02_makers_grammar', 'dwarf_03_stone_remembers'];
	const humanQuests = ['human_01_lights_in_mire', 'human_02_kings_folly', 'human_03_crown_of_depths'];
	const allRacialQuests = [...elfQuests, ...dwarfQuests, ...humanQuests];

	it('all 9 racial quests exist in catalog', () => {
		for (const id of allRacialQuests) {
			expect(QUEST_CATALOG[id], `${id} should exist`).toBeDefined();
		}
	});

	it('all racial quests have objectives', () => {
		for (const id of allRacialQuests) {
			expect(QUEST_CATALOG[id].objectives.length, `${id} should have objectives`).toBeGreaterThan(0);
		}
	});

	it('elf quests have elf raceRequirement', () => {
		for (const id of elfQuests) {
			expect(QUEST_CATALOG[id].raceRequirement).toBe('elf');
		}
	});

	it('dwarf quests have dwarf raceRequirement', () => {
		for (const id of dwarfQuests) {
			expect(QUEST_CATALOG[id].raceRequirement).toBe('dwarf');
		}
	});

	it('human quests have human raceRequirement', () => {
		for (const id of humanQuests) {
			expect(QUEST_CATALOG[id].raceRequirement).toBe('human');
		}
	});

	it('elf quest chain has correct prerequisites', () => {
		expect(QUEST_CATALOG.elf_01_withering_grove.prerequisiteQuestId).toBeUndefined();
		expect(QUEST_CATALOG.elf_02_echoes.prerequisiteQuestId).toBe('elf_01_withering_grove');
		expect(QUEST_CATALOG.elf_03_unbroken_thread.prerequisiteQuestId).toBe('elf_02_echoes');
	});

	it('dwarf quest chain has correct prerequisites', () => {
		expect(QUEST_CATALOG.dwarf_01_sealed_gallery.prerequisiteQuestId).toBeUndefined();
		expect(QUEST_CATALOG.dwarf_02_makers_grammar.prerequisiteQuestId).toBe('dwarf_01_sealed_gallery');
		expect(QUEST_CATALOG.dwarf_03_stone_remembers.prerequisiteQuestId).toBe('dwarf_02_makers_grammar');
	});

	it('human quest chain has correct prerequisites', () => {
		expect(QUEST_CATALOG.human_01_lights_in_mire.prerequisiteQuestId).toBeUndefined();
		expect(QUEST_CATALOG.human_02_kings_folly.prerequisiteQuestId).toBe('human_01_lights_in_mire');
		expect(QUEST_CATALOG.human_03_crown_of_depths.prerequisiteQuestId).toBe('human_02_kings_folly');
	});

	it('final quests have permanentBuff rewards', () => {
		expect(QUEST_CATALOG.elf_03_unbroken_thread.rewards.permanentBuff).toBe('ley_resonance');
		expect(QUEST_CATALOG.dwarf_03_stone_remembers.rewards.permanentBuff).toBe('runic_mastery');
		expect(QUEST_CATALOG.human_03_crown_of_depths.rewards.permanentBuff).toBe('sovereigns_will');
	});

	it('race filter excludes quests for other races', () => {
		const elfState = makeTestState({ playerRace: 'elf' as const });
		const available = getAvailableQuests(elfState);
		const ids = available.map(d => d.id);
		expect(ids).toContain('elf_01_withering_grove');
		expect(ids).not.toContain('dwarf_01_sealed_gallery');
		expect(ids).not.toContain('human_01_lights_in_mire');
	});

	it('elf player can accept elf quest', () => {
		const state = makeTestState({ playerRace: 'elf' as const });
		const result = acceptQuest(state, 'elf_01_withering_grove');
		expect(result.success).toBe(true);
	});

	it('dwarf player can accept dwarf quest', () => {
		const state = makeTestState({ playerRace: 'dwarf' as const });
		const result = acceptQuest(state, 'dwarf_01_sealed_gallery');
		expect(result.success).toBe(true);
	});

	it('completing final quest grants permanent buff', () => {
		const state = makeTestState({
			playerRace: 'elf' as const,
			completedQuestIds: ['elf_01_withering_grove', 'elf_02_echoes'],
		});
		acceptQuest(state, 'elf_03_unbroken_thread');
		// Mark all objectives complete
		for (const obj of state.quests[0].objectives) {
			obj.current = obj.required;
			obj.completed = true;
		}
		const result = completeQuest(state, 'elf_03_unbroken_thread');
		expect(result.success).toBe(true);
		expect(state.permanentBuffs.length).toBe(1);
		expect(state.permanentBuffs[0].id).toBe('ley_resonance');
	});
});
