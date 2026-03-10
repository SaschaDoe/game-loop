import { describe, it, expect, vi } from 'vitest';
import {
	checkCondition,
	buildDialogueContext,
	rollSocialCheck,
	handleDialogueChoice,
	garbleText,
	canDetectLies,
	closeDialogue,
	npcMoodColor,
	SOCIAL_CLASS_BONUS,
	MOOD_DISPLAY,
} from './dialogue-handler';
import type { GameState, Entity, DialogueCondition, DialogueContext, NPC, SocialCheck, NPCMood } from './types';
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
		...overrides,
	};
}

function makeNpc(overrides?: Partial<NPC>): NPC {
	return {
		pos: { x: 6, y: 5 },
		char: 'N',
		color: '#0ff',
		name: 'TestNPC',
		dialogue: ['Hello!'],
		dialogueIndex: 0,
		given: false,
		mood: 'neutral' as NPCMood,
		moodTurns: 0,
		...overrides,
	};
}

function makeDialogueContext(overrides?: Partial<DialogueContext>): DialogueContext {
	return {
		dungeonLevel: 1,
		characterLevel: 1,
		characterClass: 'warrior',
		hpPercent: 100,
		enemyCount: 0,
		rumorCount: 0,
		rumorIds: [],
		storyCount: 0,
		knownLanguages: [],
		playerName: 'Hero',
		npcMood: 'neutral',
		lieCount: 0,
		enemiesKilled: 0,
		bossesKilled: 0,
		secretsFound: 0,
		trapsDisarmed: 0,
		chestsOpened: 0,
		levelsCleared: 0,
		maxDungeonLevel: 0,
		startingLocation: 'cave',
		playerTitles: [],
		academyEnrolled: false,
		academyGraduated: false,
		academyDay: 0,
		academyLessonReady: false,
		academyAllLessonsComplete: false,
		lessonsCompleted: [],
		academyExamTaken: false,
		learnedSpells: [],
		learnedRituals: [],
		activeQuestIds: [],
		completedQuestIds: [],
		...overrides,
	};
}

describe('checkCondition', () => {
	it('minLevel — true when dungeon level >= value', () => {
		const ctx = makeDialogueContext({ dungeonLevel: 3 });
		expect(checkCondition({ type: 'minLevel', value: 3 }, ctx)).toBe(true);
		expect(checkCondition({ type: 'minLevel', value: 4 }, ctx)).toBe(false);
	});

	it('maxLevel — true when dungeon level <= value', () => {
		const ctx = makeDialogueContext({ dungeonLevel: 3 });
		expect(checkCondition({ type: 'maxLevel', value: 3 }, ctx)).toBe(true);
		expect(checkCondition({ type: 'maxLevel', value: 2 }, ctx)).toBe(false);
	});

	it('class — true when character class matches', () => {
		const ctx = makeDialogueContext({ characterClass: 'mage' });
		expect(checkCondition({ type: 'class', value: 'mage' }, ctx)).toBe(true);
		expect(checkCondition({ type: 'class', value: 'warrior' }, ctx)).toBe(false);
	});

	it('notClass — true when character class does not match', () => {
		const ctx = makeDialogueContext({ characterClass: 'warrior' });
		expect(checkCondition({ type: 'notClass', value: 'mage' }, ctx)).toBe(true);
		expect(checkCondition({ type: 'notClass', value: 'warrior' }, ctx)).toBe(false);
	});

	it('hpBelow — true when hp percent is below value', () => {
		const ctx = makeDialogueContext({ hpPercent: 30 });
		expect(checkCondition({ type: 'hpBelow', value: 50 }, ctx)).toBe(true);
		expect(checkCondition({ type: 'hpBelow', value: 30 }, ctx)).toBe(false);
	});

	it('knowsLanguage — true when language is known', () => {
		const ctx = makeDialogueContext({ knownLanguages: ['Elvish'] });
		expect(checkCondition({ type: 'knowsLanguage', value: 'Elvish' }, ctx)).toBe(true);
		expect(checkCondition({ type: 'knowsLanguage', value: 'Orcish' }, ctx)).toBe(false);
	});

	it('hasRumors — true when rumor count >= value', () => {
		const ctx = makeDialogueContext({ rumorCount: 3 });
		expect(checkCondition({ type: 'hasRumors', value: 3 }, ctx)).toBe(true);
		expect(checkCondition({ type: 'hasRumors', value: 4 }, ctx)).toBe(false);
	});

	it('hasStories — true when story count >= value', () => {
		const ctx = makeDialogueContext({ storyCount: 5 });
		expect(checkCondition({ type: 'hasStories', value: 5 }, ctx)).toBe(true);
		expect(checkCondition({ type: 'hasStories', value: 6 }, ctx)).toBe(false);
	});

	it('minCharLevel — true when character level >= value', () => {
		const ctx = makeDialogueContext({ characterLevel: 5 });
		expect(checkCondition({ type: 'minCharLevel', value: 5 }, ctx)).toBe(true);
		expect(checkCondition({ type: 'minCharLevel', value: 6 }, ctx)).toBe(false);
	});

	it('npcMood — true when NPC mood matches', () => {
		const ctx = makeDialogueContext({ npcMood: 'hostile' });
		expect(checkCondition({ type: 'npcMood', value: 'hostile' }, ctx)).toBe(true);
		expect(checkCondition({ type: 'npcMood', value: 'friendly' }, ctx)).toBe(false);
	});

	it('knownLiar — true when lie count >= value', () => {
		const ctx = makeDialogueContext({ lieCount: 3 });
		expect(checkCondition({ type: 'knownLiar', value: 3 }, ctx)).toBe(true);
		expect(checkCondition({ type: 'knownLiar', value: 4 }, ctx)).toBe(false);
	});

	it('minEnemiesKilled — true when enemies killed >= value', () => {
		const ctx = makeDialogueContext({ enemiesKilled: 10 });
		expect(checkCondition({ type: 'minEnemiesKilled', value: 10 }, ctx)).toBe(true);
		expect(checkCondition({ type: 'minEnemiesKilled', value: 11 }, ctx)).toBe(false);
	});

	it('hasBossKills — true when bosses killed >= value', () => {
		const ctx = makeDialogueContext({ bossesKilled: 2 });
		expect(checkCondition({ type: 'hasBossKills', value: 2 }, ctx)).toBe(true);
		expect(checkCondition({ type: 'hasBossKills', value: 3 }, ctx)).toBe(false);
	});

	it('minSecretsFound — true when secrets >= value', () => {
		const ctx = makeDialogueContext({ secretsFound: 5 });
		expect(checkCondition({ type: 'minSecretsFound', value: 5 }, ctx)).toBe(true);
		expect(checkCondition({ type: 'minSecretsFound', value: 6 }, ctx)).toBe(false);
	});

	it('hasRumor — true when specific rumor ID is in list', () => {
		const ctx = makeDialogueContext({ rumorIds: ['r1', 'r2'] });
		expect(checkCondition({ type: 'hasRumor', value: 'r1' }, ctx)).toBe(true);
		expect(checkCondition({ type: 'hasRumor', value: 'r3' }, ctx)).toBe(false);
	});

	it('minChestsOpened — true when chests opened >= value', () => {
		const ctx = makeDialogueContext({ chestsOpened: 4 });
		expect(checkCondition({ type: 'minChestsOpened', value: 4 }, ctx)).toBe(true);
		expect(checkCondition({ type: 'minChestsOpened', value: 5 }, ctx)).toBe(false);
	});

	it('startingLocation — true when location matches', () => {
		const ctx = makeDialogueContext({ startingLocation: 'village' });
		expect(checkCondition({ type: 'startingLocation', value: 'village' }, ctx)).toBe(true);
		expect(checkCondition({ type: 'startingLocation', value: 'cave' }, ctx)).toBe(false);
	});

	it('minLevelsCleared — true when levels cleared >= value', () => {
		const ctx = makeDialogueContext({ levelsCleared: 3 });
		expect(checkCondition({ type: 'minLevelsCleared', value: 3 }, ctx)).toBe(true);
		expect(checkCondition({ type: 'minLevelsCleared', value: 4 }, ctx)).toBe(false);
	});

	it('hasTitle — true when player has the title', () => {
		const ctx = makeDialogueContext({ playerTitles: ['Champion'] });
		expect(checkCondition({ type: 'hasTitle', value: 'Champion' }, ctx)).toBe(true);
		expect(checkCondition({ type: 'hasTitle', value: 'King' }, ctx)).toBe(false);
	});

	it('academyEnrolled — true when enrolled', () => {
		expect(checkCondition({ type: 'academyEnrolled' }, makeDialogueContext({ academyEnrolled: true }))).toBe(true);
		expect(checkCondition({ type: 'academyEnrolled' }, makeDialogueContext({ academyEnrolled: false }))).toBe(false);
	});

	it('academyGraduated — true when graduated', () => {
		expect(checkCondition({ type: 'academyGraduated' }, makeDialogueContext({ academyGraduated: true }))).toBe(true);
		expect(checkCondition({ type: 'academyGraduated' }, makeDialogueContext({ academyGraduated: false }))).toBe(false);
	});

	it('academyDay — true when academy day >= value', () => {
		const ctx = makeDialogueContext({ academyDay: 5 });
		expect(checkCondition({ type: 'academyDay', value: 5 }, ctx)).toBe(true);
		expect(checkCondition({ type: 'academyDay', value: 6 }, ctx)).toBe(false);
	});

	it('academyLessonReady — true when a lesson is ready', () => {
		expect(checkCondition({ type: 'academyLessonReady' }, makeDialogueContext({ academyLessonReady: true }))).toBe(true);
		expect(checkCondition({ type: 'academyLessonReady' }, makeDialogueContext({ academyLessonReady: false }))).toBe(false);
	});

	it('academyAllLessonsComplete — true when all lessons done', () => {
		expect(checkCondition({ type: 'academyAllLessonsComplete' }, makeDialogueContext({ academyAllLessonsComplete: true }))).toBe(true);
		expect(checkCondition({ type: 'academyAllLessonsComplete' }, makeDialogueContext({ academyAllLessonsComplete: false }))).toBe(false);
	});

	it('lessonCompleted — true when specific lesson is completed', () => {
		const ctx = makeDialogueContext({ lessonsCompleted: ['lesson1', 'lesson2'] });
		expect(checkCondition({ type: 'lessonCompleted', value: 'lesson1' }, ctx)).toBe(true);
		expect(checkCondition({ type: 'lessonCompleted', value: 'lesson3' }, ctx)).toBe(false);
	});

	it('lessonNotCompleted — true when specific lesson is NOT completed', () => {
		const ctx = makeDialogueContext({ lessonsCompleted: ['lesson1'] });
		expect(checkCondition({ type: 'lessonNotCompleted', value: 'lesson2' }, ctx)).toBe(true);
		expect(checkCondition({ type: 'lessonNotCompleted', value: 'lesson1' }, ctx)).toBe(false);
	});

	it('academyExamNotTaken — true when exam has not been taken', () => {
		expect(checkCondition({ type: 'academyExamNotTaken' }, makeDialogueContext({ academyExamTaken: false }))).toBe(true);
		expect(checkCondition({ type: 'academyExamNotTaken' }, makeDialogueContext({ academyExamTaken: true }))).toBe(false);
	});

	it('allOf — true when all sub-conditions are met', () => {
		const ctx = makeDialogueContext({ dungeonLevel: 3, characterClass: 'mage' });
		const cond: DialogueCondition = {
			type: 'allOf',
			conditions: [
				{ type: 'minLevel', value: 2 },
				{ type: 'class', value: 'mage' },
			],
		};
		expect(checkCondition(cond, ctx)).toBe(true);
	});

	it('allOf — false when any sub-condition fails', () => {
		const ctx = makeDialogueContext({ dungeonLevel: 1, characterClass: 'mage' });
		const cond: DialogueCondition = {
			type: 'allOf',
			conditions: [
				{ type: 'minLevel', value: 2 },
				{ type: 'class', value: 'mage' },
			],
		};
		expect(checkCondition(cond, ctx)).toBe(false);
	});
});

describe('buildDialogueContext', () => {
	it('constructs context from game state', () => {
		const state = makeTestState({
			level: 3,
			characterLevel: 5,
			knownLanguages: ['Elvish'],
			rumors: [{ id: 'r1', text: 'test', source: 'npc', accuracy: 'true' }],
			heardStories: ['s1'],
			lieCount: 2,
		});
		state.player.hp = 10;
		state.player.maxHp = 20;

		const ctx = buildDialogueContext(state, 'friendly');
		expect(ctx.dungeonLevel).toBe(3);
		expect(ctx.characterLevel).toBe(5);
		expect(ctx.characterClass).toBe('warrior');
		expect(ctx.hpPercent).toBe(50);
		expect(ctx.rumorCount).toBe(1);
		expect(ctx.rumorIds).toEqual(['r1']);
		expect(ctx.storyCount).toBe(1);
		expect(ctx.knownLanguages).toEqual(['Elvish']);
		expect(ctx.npcMood).toBe('friendly');
		expect(ctx.lieCount).toBe(2);
	});

	it('defaults npcMood to neutral', () => {
		const state = makeTestState();
		const ctx = buildDialogueContext(state);
		expect(ctx.npcMood).toBe('neutral');
	});

	it('includes stats fields', () => {
		const state = makeTestState();
		state.stats.enemiesKilled = 5;
		state.stats.bossesKilled = 1;
		state.stats.secretsFound = 2;
		state.stats.chestsOpened = 3;
		state.stats.levelsCleared = 4;
		const ctx = buildDialogueContext(state);
		expect(ctx.enemiesKilled).toBe(5);
		expect(ctx.bossesKilled).toBe(1);
		expect(ctx.secretsFound).toBe(2);
		expect(ctx.chestsOpened).toBe(3);
		expect(ctx.levelsCleared).toBe(4);
	});

	it('includes academy fields', () => {
		const state = makeTestState();
		const ctx = buildDialogueContext(state);
		expect(ctx.academyEnrolled).toBe(false);
		expect(ctx.academyGraduated).toBe(false);
		expect(ctx.academyDay).toBe(0);
		expect(ctx.lessonsCompleted).toEqual([]);
	});

	it('includes player titles and starting location', () => {
		const state = makeTestState({ playerTitles: ['Champion'] });
		const ctx = buildDialogueContext(state);
		expect(ctx.playerTitles).toEqual(['Champion']);
		expect(ctx.startingLocation).toBe('cave');
	});
});

describe('rollSocialCheck', () => {
	it('returns success, roll, bonus, and total', () => {
		const state = makeTestState({ characterLevel: 3 });
		const check: SocialCheck = { skill: 'persuade', difficulty: 5, successNode: 's', failNode: 'f' };
		const result = rollSocialCheck(check, state);
		expect(result).toHaveProperty('success');
		expect(result).toHaveProperty('roll');
		expect(result).toHaveProperty('bonus');
		expect(result).toHaveProperty('total');
		expect(result.total).toBe(result.roll + result.bonus);
	});

	it('includes class bonus for warrior intimidate', () => {
		const state = makeTestState({ characterLevel: 0 });
		const check: SocialCheck = { skill: 'intimidate', difficulty: 100, successNode: 's', failNode: 'f' };
		// Warrior intimidate bonus is 4, level bonus = floor(0/3) = 0
		const result = rollSocialCheck(check, state);
		expect(result.bonus).toBe(4);
	});

	it('includes level bonus (floor of characterLevel / 3)', () => {
		const state = makeTestState({ characterLevel: 9 });
		const check: SocialCheck = { skill: 'persuade', difficulty: 100, successNode: 's', failNode: 'f' };
		// Warrior persuade = 0, level bonus = floor(9/3) = 3
		const result = rollSocialCheck(check, state);
		expect(result.bonus).toBe(3);
	});

	it('succeeds when total >= difficulty', () => {
		// Use deterministic approach: set difficulty to 1 and run until success
		const state = makeTestState({ characterLevel: 30 });
		const check: SocialCheck = { skill: 'intimidate', difficulty: 1, successNode: 's', failNode: 'f' };
		// With level 30 warrior intimidate: bonus = 4 + 10 = 14, min roll 1 -> total 15 >= 1
		const result = rollSocialCheck(check, state);
		expect(result.success).toBe(true);
	});

	it('fails when total < difficulty', () => {
		const state = makeTestState({ characterLevel: 1 });
		const check: SocialCheck = { skill: 'persuade', difficulty: 100, successNode: 's', failNode: 'f' };
		const result = rollSocialCheck(check, state);
		expect(result.success).toBe(false);
	});
});

describe('handleDialogueChoice', () => {
	function makeDialogueState(options: any[], overrides?: Partial<GameState>) {
		const npc = makeNpc({ name: 'Elder' });
		const state = makeTestState({
			npcs: [npc],
			activeDialogue: {
				tree: {
					startNode: 'start',
					nodes: {
						start: {
							id: 'start',
							npcText: 'Hello traveler',
							options,
						},
						next: {
							id: 'next',
							npcText: 'Interesting...',
							options: [{ text: 'Bye', nextNode: '__exit__' }],
						},
						success: {
							id: 'success',
							npcText: 'You convinced me.',
							options: [{ text: 'Thanks', nextNode: '__exit__' }],
						},
						fail: {
							id: 'fail',
							npcText: 'I do not believe you.',
							options: [{ text: 'Sorry', nextNode: '__exit__' }],
						},
					},
				},
				currentNodeId: 'start',
				npcName: 'Elder',
				npcChar: 'N',
				npcColor: '#888',
				visitedNodes: new Set<string>(),
				givenItems: false,
				mood: 'neutral' as NPCMood,
				context: makeDialogueContext(),
			},
			...overrides,
		});
		return state;
	}

	it('navigates to next node', () => {
		const state = makeDialogueState([{ text: 'Continue', nextNode: 'next' }]);
		const result = handleDialogueChoice(state, 0);
		expect(result.activeDialogue!.currentNodeId).toBe('next');
	});

	it('exits dialogue on __exit__', () => {
		const state = makeDialogueState([{ text: 'Goodbye', nextNode: '__exit__' }]);
		const result = handleDialogueChoice(state, 0);
		expect(result.activeDialogue).toBeNull();
	});

	it('heals HP via onSelect.hp', () => {
		const state = makeDialogueState([
			{ text: 'Heal me', nextNode: 'next', onSelect: { hp: 5 } },
		]);
		state.player.hp = 15;
		const result = handleDialogueChoice(state, 0);
		expect(result.player.hp).toBe(20); // 15 + 5, capped at maxHp
	});

	it('boosts ATK via onSelect.atk', () => {
		const state = makeDialogueState([
			{ text: 'Bless me', nextNode: 'next', onSelect: { atk: 2 } },
		]);
		const result = handleDialogueChoice(state, 0);
		expect(result.player.attack).toBe(12); // 10 + 2
	});

	it('changes mood via onSelect.mood', () => {
		const state = makeDialogueState([
			{ text: 'Threaten', nextNode: 'next', onSelect: { mood: 'hostile' as NPCMood } },
		]);
		const result = handleDialogueChoice(state, 0);
		expect(result.activeDialogue!.mood).toBe('hostile');
		const npc = result.npcs.find(n => n.name === 'Elder');
		expect(npc!.mood).toBe('hostile');
	});

	it('learns a rumor via onSelect.rumor', () => {
		const state = makeDialogueState([
			{
				text: 'Tell me a rumor',
				nextNode: 'next',
				onSelect: { rumor: { id: 'r_test', text: 'A secret passage exists', source: 'Elder', accuracy: 'true' as const } },
			},
		]);
		const result = handleDialogueChoice(state, 0);
		expect(result.rumors).toHaveLength(1);
		expect(result.rumors[0].id).toBe('r_test');
	});

	it('does not duplicate existing rumors', () => {
		const rumor = { id: 'r_test', text: 'A secret passage exists', source: 'Elder', accuracy: 'true' as const };
		const state = makeDialogueState([
			{ text: 'Tell me a rumor', nextNode: 'next', onSelect: { rumor } },
		], { rumors: [rumor] });
		const result = handleDialogueChoice(state, 0);
		expect(result.rumors).toHaveLength(1);
	});

	it('learns a language via onSelect.learnLanguage', () => {
		const state = makeDialogueState([
			{ text: 'Teach me', nextNode: 'next', onSelect: { learnLanguage: 'Elvish' } },
		]);
		const result = handleDialogueChoice(state, 0);
		expect(result.knownLanguages).toContain('Elvish');
	});

	it('does not duplicate known languages', () => {
		const state = makeDialogueState([
			{ text: 'Teach me', nextNode: 'next', onSelect: { learnLanguage: 'Elvish' } },
		], { knownLanguages: ['Elvish'] });
		const result = handleDialogueChoice(state, 0);
		expect(result.knownLanguages.filter(l => l === 'Elvish')).toHaveLength(1);
	});

	it('collects a story via onSelect.story', () => {
		const state = makeDialogueState([
			{
				text: 'Tell me a tale',
				nextNode: 'next',
				onSelect: { story: { id: 's1', title: 'The Lost King', text: 'Long ago...', teller: 'Elder', type: 'legend' as const } },
			},
		]);
		const result = handleDialogueChoice(state, 0);
		expect(result.heardStories).toContain('s1');
		expect(result.xp).toBe(5); // story gives +5 XP
	});

	it('handles NPC attack action', () => {
		const state = makeDialogueState([
			{ text: 'Insult them', nextNode: 'next', onSelect: { npcAction: 'attack' as const } },
		]);
		const startHp = state.player.hp;
		const result = handleDialogueChoice(state, 0);
		expect(result.player.hp).toBeLessThan(startHp);
		expect(result.activeDialogue).toBeNull();
		const npc = result.npcs.find(n => n.name === 'Elder');
		expect(npc!.mood).toBe('hostile');
	});

	it('handles NPC flee action', () => {
		const state = makeDialogueState([
			{ text: 'Scare them', nextNode: 'next', onSelect: { npcAction: 'flee' as const } },
		]);
		const result = handleDialogueChoice(state, 0);
		expect(result.activeDialogue).toBeNull();
		const npc = result.npcs.find(n => n.name === 'Elder');
		expect(npc!.mood).toBe('afraid');
	});

	it('handles social check — branches on success or failure', () => {
		const state = makeDialogueState([
			{
				text: 'Persuade',
				nextNode: 'next',
				socialCheck: { skill: 'persuade' as const, difficulty: 1, successNode: 'success', failNode: 'fail' },
			},
		], { characterLevel: 30 });
		// Warrior persuade bonus = 0, level bonus = floor(30/3) = 10, total bonus = 10
		// Min roll 1 + 10 = 11 >= 1, always succeeds
		const result = handleDialogueChoice(state, 0);
		expect(result.activeDialogue!.currentNodeId).toBe('success');
	});

	it('social check failure increments lieCount for deceive', () => {
		const state = makeDialogueState([
			{
				text: 'Lie',
				nextNode: 'next',
				socialCheck: { skill: 'deceive' as const, difficulty: 100, successNode: 'success', failNode: 'fail' },
			},
		], { characterLevel: 1 });
		const result = handleDialogueChoice(state, 0);
		expect(result.lieCount).toBe(1);
	});

	it('returns state unchanged if no active dialogue', () => {
		const state = makeTestState({ activeDialogue: null });
		const result = handleDialogueChoice(state, 0);
		expect(result).toBe(state);
	});

	it('returns state unchanged for out-of-range option index', () => {
		const state = makeDialogueState([{ text: 'Only option', nextNode: 'next' }]);
		const result = handleDialogueChoice(state, 5);
		expect(result).toBe(state);
	});
});

describe('garbleText', () => {
	it('produces consistent output for the same input', () => {
		const a = garbleText('Hello world', 'Deepscript');
		const b = garbleText('Hello world', 'Deepscript');
		expect(a).toBe(b);
	});

	it('preserves spaces', () => {
		const result = garbleText('Hello world', 'Deepscript');
		expect(result).toContain(' ');
		// Space positions should match
		for (let i = 0; i < result.length; i++) {
			if (result[i] === ' ') {
				expect('Hello world'[i]).toBe(' ');
			}
		}
	});

	it('preserves punctuation (. , ! ?)', () => {
		const result = garbleText('Hello, world! How? Yes.', 'Elvish');
		expect(result).toContain(',');
		expect(result).toContain('!');
		expect(result).toContain('?');
		expect(result).toContain('.');
	});

	it('handles unknown languages by falling back to Deepscript glyphs', () => {
		const result = garbleText('Test', 'UnknownLang');
		const deepResult = garbleText('Test', 'Deepscript');
		// Should use the same glyphs as Deepscript
		expect(result).toBe(deepResult);
	});

	it('uses different glyphs for different languages', () => {
		const deep = garbleText('Hello', 'Deepscript');
		const orcish = garbleText('Hello', 'Orcish');
		const elvish = garbleText('Hello', 'Elvish');
		// At least some of them should differ
		const allSame = deep === orcish && orcish === elvish;
		expect(allSame).toBe(false);
	});

	it('preserves asterisks', () => {
		const result = garbleText('*bold*', 'Deepscript');
		expect(result[0]).toBe('*');
		expect(result[result.length - 1]).toBe('*');
	});
});

describe('canDetectLies', () => {
	it('rogues always detect lies', () => {
		const state = makeTestState({
			characterConfig: { name: 'Hero', characterClass: 'rogue', difficulty: 'normal', startingLocation: 'cave', worldSeed: 'test' },
			characterLevel: 1,
		});
		expect(canDetectLies(state)).toBe(true);
	});

	it('Deepscript speakers detect lies', () => {
		const state = makeTestState({ knownLanguages: ['Deepscript'], characterLevel: 1 });
		expect(canDetectLies(state)).toBe(true);
	});

	it('level 8+ characters detect lies', () => {
		const state = makeTestState({ characterLevel: 8 });
		expect(canDetectLies(state)).toBe(true);
	});

	it('low-level non-rogues without Deepscript cannot detect lies', () => {
		const state = makeTestState({ characterLevel: 5, knownLanguages: [] });
		expect(canDetectLies(state)).toBe(false);
	});

	it('level 7 without other bonuses cannot detect lies', () => {
		const state = makeTestState({ characterLevel: 7, knownLanguages: ['Elvish'] });
		expect(canDetectLies(state)).toBe(false);
	});
});

describe('closeDialogue', () => {
	it('sets activeDialogue to null', () => {
		const state = makeTestState({
			activeDialogue: {
				tree: { startNode: 'start', nodes: {} },
				currentNodeId: 'start',
				npcName: 'Test',
				npcChar: 'N',
				npcColor: '#888',
				visitedNodes: new Set(),
				givenItems: false,
				mood: 'neutral' as NPCMood,
				context: makeDialogueContext(),
			},
		});
		const result = closeDialogue(state);
		expect(result.activeDialogue).toBeNull();
	});

	it('returns a new state object', () => {
		const state = makeTestState({
			activeDialogue: {
				tree: { startNode: 'start', nodes: {} },
				currentNodeId: 'start',
				npcName: 'Test',
				npcChar: 'N',
				npcColor: '#888',
				visitedNodes: new Set(),
				givenItems: false,
				mood: 'neutral' as NPCMood,
				context: makeDialogueContext(),
			},
		});
		const result = closeDialogue(state);
		expect(result).not.toBe(state);
	});
});

describe('dialogue effect: learnSpell', () => {
	function makeDialogueState(options: any[], overrides?: Partial<GameState>) {
		const npc = makeNpc({ name: 'Elder' });
		const state = makeTestState({
			npcs: [npc],
			activeDialogue: {
				tree: {
					startNode: 'start',
					nodes: {
						start: {
							id: 'start',
							npcText: 'Hello traveler',
							options,
						},
						next: {
							id: 'next',
							npcText: 'Interesting...',
							options: [{ text: 'Bye', nextNode: '__exit__' }],
						},
					},
				},
				currentNodeId: 'start',
				npcName: 'Elder',
				npcChar: 'N',
				npcColor: '#888',
				visitedNodes: new Set<string>(),
				givenItems: false,
				mood: 'neutral' as NPCMood,
				context: makeDialogueContext(),
			},
			...overrides,
		});
		return state;
	}

	it('teaches a spell for free via dialogue', () => {
		const state = makeDialogueState([
			{ text: 'Teach me', nextNode: 'next', onSelect: { learnSpell: 'spell_firebolt' } },
		]);
		const result = handleDialogueChoice(state, 0);
		expect(result.learnedSpells).toContain('spell_firebolt');
		expect(result.messages.some(m => m.text.includes('Spell learned'))).toBe(true);
	});

	it('does not duplicate already-known spells', () => {
		const state = makeDialogueState([
			{ text: 'Teach me', nextNode: 'next', onSelect: { learnSpell: 'spell_firebolt' } },
		], { learnedSpells: ['spell_firebolt'] });
		const result = handleDialogueChoice(state, 0);
		expect(result.learnedSpells.filter(s => s === 'spell_firebolt')).toHaveLength(1);
	});

	it('auto-assigns to first empty quick-cast slot', () => {
		const state = makeDialogueState([
			{ text: 'Teach me', nextNode: 'next', onSelect: { learnSpell: 'spell_firebolt' } },
		], { quickCastSlots: ['spell_heal', null, null, null] });
		const result = handleDialogueChoice(state, 0);
		expect(result.quickCastSlots[1]).toBe('spell_firebolt');
	});
});

describe('dialogue effect: acceptQuest', () => {
	function makeDialogueState(options: any[], overrides?: Partial<GameState>) {
		const npc = makeNpc({ name: 'Elder' });
		const state = makeTestState({
			npcs: [npc],
			activeDialogue: {
				tree: {
					startNode: 'start',
					nodes: {
						start: {
							id: 'start',
							npcText: 'Hello traveler',
							options,
						},
						next: {
							id: 'next',
							npcText: 'Interesting...',
							options: [{ text: 'Bye', nextNode: '__exit__' }],
						},
					},
				},
				currentNodeId: 'start',
				npcName: 'Elder',
				npcChar: 'N',
				npcColor: '#888',
				visitedNodes: new Set<string>(),
				givenItems: false,
				mood: 'neutral' as NPCMood,
				context: makeDialogueContext(),
			},
			...overrides,
		});
		return state;
	}

	it('starts a quest via dialogue', () => {
		const state = makeDialogueState([
			{ text: 'Accept quest', nextNode: 'next', onSelect: { acceptQuest: 'main_01_whispers' } },
		]);
		const result = handleDialogueChoice(state, 0);
		expect(result.quests.some(q => q.id === 'main_01_whispers')).toBe(true);
		expect(result.messages.some(m => m.text.includes('Quest accepted'))).toBe(true);
	});
});

describe('dialogue conditions: hasSpell/hasRitual/hasQuest/questCompleted', () => {
	it('hasSpell returns true when spell is learned', () => {
		const ctx = makeDialogueContext({ learnedSpells: ['spell_firebolt'] });
		expect(checkCondition({ type: 'hasSpell', value: 'spell_firebolt' }, ctx)).toBe(true);
		expect(checkCondition({ type: 'hasSpell', value: 'spell_heal' }, ctx)).toBe(false);
	});

	it('hasRitual returns true when ritual is learned', () => {
		const ctx = makeDialogueContext({ learnedRituals: ['ritual_ward'] });
		expect(checkCondition({ type: 'hasRitual', value: 'ritual_ward' }, ctx)).toBe(true);
		expect(checkCondition({ type: 'hasRitual', value: 'ritual_summon' }, ctx)).toBe(false);
	});

	it('hasQuest returns true when quest is active', () => {
		const ctx = makeDialogueContext({ activeQuestIds: ['main_01_whispers'] });
		expect(checkCondition({ type: 'hasQuest', value: 'main_01_whispers' }, ctx)).toBe(true);
		expect(checkCondition({ type: 'hasQuest', value: 'side_01' }, ctx)).toBe(false);
	});

	it('questCompleted returns true when quest is done', () => {
		const ctx = makeDialogueContext({ completedQuestIds: ['main_01_whispers'] });
		expect(checkCondition({ type: 'questCompleted', value: 'main_01_whispers' }, ctx)).toBe(true);
		expect(checkCondition({ type: 'questCompleted', value: 'side_01' }, ctx)).toBe(false);
	});
});

describe('npcMoodColor', () => {
	it('returns NPC default color for neutral mood', () => {
		const npc = makeNpc({ color: '#0ff', mood: 'neutral' });
		expect(npcMoodColor(npc)).toBe('#0ff');
	});

	it('returns friendly color for friendly mood', () => {
		const npc = makeNpc({ mood: 'friendly' });
		expect(npcMoodColor(npc)).toBe(MOOD_DISPLAY.friendly.color);
	});

	it('returns hostile color for hostile mood', () => {
		const npc = makeNpc({ mood: 'hostile' });
		expect(npcMoodColor(npc)).toBe(MOOD_DISPLAY.hostile.color);
	});

	it('returns afraid color for afraid mood', () => {
		const npc = makeNpc({ mood: 'afraid' });
		expect(npcMoodColor(npc)).toBe(MOOD_DISPLAY.afraid.color);
	});

	it('returns amused color for amused mood', () => {
		const npc = makeNpc({ mood: 'amused' });
		expect(npcMoodColor(npc)).toBe(MOOD_DISPLAY.amused.color);
	});

	it('returns sad color for sad mood', () => {
		const npc = makeNpc({ mood: 'sad' });
		expect(npcMoodColor(npc)).toBe(MOOD_DISPLAY.sad.color);
	});
});
