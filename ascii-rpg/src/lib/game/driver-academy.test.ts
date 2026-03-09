import { describe, it, expect } from 'vitest';
import { GameDriver } from './driver';

// ─────────────────────────────────────────────────────
// Helper: create an adept starting at the academy
// ─────────────────────────────────────────────────────
function createAdept(seed = 'academy-test') {
	return new GameDriver({
		name: 'Lyra',
		characterClass: 'adept',
		difficulty: 'normal',
		startingLocation: 'academy',
		worldSeed: seed,
	});
}

// ─────────────────────────────────────────────────────
// SMALL TESTS — Adept class basics
// ─────────────────────────────────────────────────────
describe('Adept class basics', () => {
	it('creates an adept with correct class', () => {
		const game = createAdept();
		expect(game.state.characterConfig.characterClass).toBe('adept');
	});

	it('adept starts with Summon Light spell', () => {
		const game = createAdept();
		expect(game.state.learnedSpells).toContain('spell_summon_light');
	});

	it('adept has high mana (arcane archetype)', () => {
		const game = createAdept();
		expect(game.state.player.maxMana).toBeGreaterThan(0);
		expect(game.state.player.mana).toBe(game.state.player.maxMana);
	});

	it('adept starts at the academy and is enrolled', () => {
		const game = createAdept();
		expect(game.state.academyState).not.toBeNull();
		expect(game.state.academyState!.enrolled).toBe(true);
		expect(game.state.academyState!.graduated).toBe(false);
	});

	it('adept starts with mage_staff and cloth_robe equipped', () => {
		const game = createAdept();
		expect(game.state.equipment.leftHand?.id).toBe('mage_staff');
		expect(game.state.equipment.body?.id).toBe('cloth_robe');
	});

	it('adept starts with 3 health potions', () => {
		const game = createAdept();
		const potions = game.inventory.filter(i => i?.id === 'health_potion');
		expect(potions.length).toBe(3);
	});
});

// ─────────────────────────────────────────────────────
// SMALL TESTS — Driver dialogue helpers
// ─────────────────────────────────────────────────────
describe('Driver dialogue helpers', () => {
	it('closeDialog() clears active dialogue', () => {
		const game = createAdept();
		// Manually open a dialogue
		game.state.activeDialogue = {
			npcName: 'Test',
			npcChar: 'T',
			npcColor: '#fff',
			currentNodeId: 'start',
			tree: { startNode: 'start', nodes: { start: { id: 'start', npcText: 'Hello', options: [] } } },
			visitedNodes: new Set(),
			givenItems: false,
			mood: 'neutral',
			context: {} as any,
		};
		expect(game.dialog).not.toBeNull();
		game.closeDialog();
		expect(game.dialog).toBeNull();
	});

	it('talkTo() opens dialogue with a named NPC', () => {
		const game = createAdept();
		game.talkTo('Professor Ignis');
		expect(game.dialog).not.toBeNull();
		expect(game.dialog!.npcName).toBe('Professor Ignis');
	});

	it('talkTo() opens dialogue with Archmagus Veylen', () => {
		const game = createAdept();
		game.talkTo('Archmagus Veylen');
		expect(game.dialog).not.toBeNull();
		expect(game.dialog!.npcName).toBe('Archmagus Veylen');
	});

	it('dialogText returns the NPC text of current node', () => {
		const game = createAdept();
		game.talkTo('Professor Ignis');
		expect(game.dialogText).toContain('Professor Ignis');
	});

	it('dialogNodeId returns the current node id', () => {
		const game = createAdept();
		game.talkTo('Professor Ignis');
		expect(game.dialogNodeId).toBe('start');
	});

	it('advanceTurns() advances game time', () => {
		const game = createAdept();
		const start = game.turn;
		game.advanceTurns(500);
		expect(game.turn).toBe(start + 500);
	});
});

// ─────────────────────────────────────────────────────
// SMALL TESTS — Basic game actions via driver
// ─────────────────────────────────────────────────────
describe('Adept basic actions', () => {
	it('can wait a turn without errors', () => {
		const game = createAdept();
		game.command('wait');
		// Wait processes without crashing; turn may not increment at level 0
		expect(game.state.gameOver).toBe(false);
	});

	it('can use godMode', () => {
		const game = createAdept();
		game.godMode();
		expect(game.hp).toBe(99999);
		expect(game.state.player.attack).toBe(9999);
	});

	it('can give items', () => {
		const game = createAdept();
		game.giveItem('rusty_sword');
		expect(game.inventory.some(i => i?.id === 'rusty_sword')).toBe(true);
	});

	it('can learn all spells', () => {
		const game = createAdept();
		game.learnAllSpells();
		expect(game.state.learnedSpells.length).toBeGreaterThan(5);
		expect(game.state.learnedSpells).toContain('spell_firebolt');
	});

	it('can inspect status', () => {
		const game = createAdept();
		game.command('status');
		const log = game.log();
		expect(log).toContain('adept');
		expect(log).toContain('Lyra');
	});
});

// ─────────────────────────────────────────────────────
// MEDIUM TESTS — Single lesson flow
// ─────────────────────────────────────────────────────
describe('Academy single lesson', () => {
	it('adept can complete the first lesson with Professor Ignis', () => {
		const game = createAdept();
		game.talkTo('Professor Ignis');
		expect(game.dialog!.npcName).toBe('Professor Ignis');
		expect(game.dialogNodeId).toBe('start');

		// Select "I'm ready for my lesson." (index 1, has showIf but raw index works)
		game.choose(1);
		expect(game.dialogNodeId).toBe('check_lesson');

		// Select "Alchemy Fundamentals" (index 0)
		game.choose(0);
		expect(game.dialogNodeId).toBe('lesson_alchemy_basics');

		// Complete the lesson (index 0)
		game.choose(0);
		expect(game.dialogNodeId).toBe('lesson_complete');

		// Verify lesson was recorded
		expect(game.state.academyState!.lessonsCompleted).toContain('alchemy_basics');
		expect(game.state.academyState!.nextLessonIndex).toBe(1);

		// "I won't forget" → farewell
		game.choose(0);
		expect(game.dialogNodeId).toBe('farewell');

		// Close dialogue manually (farewell is a self-loop)
		game.closeDialog();
		expect(game.dialog).toBeNull();
	});

	it('second lesson requires time advancement', () => {
		const game = createAdept();

		// Complete lesson 1
		game.talkTo('Professor Ignis');
		game.choose(1); // "I'm ready for my lesson."
		game.choose(0); // "Alchemy Fundamentals"
		game.choose(0); // Complete lesson
		game.choose(0); // "I won't forget"
		game.closeDialog();

		// The next lesson should be available after a delay
		const nextAvail = game.state.academyState!.nextLessonAvailableTurn;
		expect(nextAvail).toBeGreaterThan(game.turn);

		// Advance time to when the lesson is available
		game.advanceTurns(nextAvail - game.turn);

		// Now take lesson 2
		game.talkTo('Professor Ignis');
		// On return visit, node is 'return'
		expect(game.dialogNodeId).toBe('return');
		game.choose(0); // "I'm ready for my lesson."
		expect(game.dialogNodeId).toBe('check_lesson');

		// Lesson 2 is at index 1 (Elemental Weaknesses)
		game.choose(1);
		expect(game.dialogNodeId).toBe('lesson_elemental_theory');

		game.choose(0); // Complete lesson
		expect(game.state.academyState!.lessonsCompleted).toContain('elemental_theory');
		expect(game.state.academyState!.nextLessonIndex).toBe(2);

		game.choose(0); // "I won't forget"
		game.closeDialog();
	});
});

// ─────────────────────────────────────────────────────
// BIG TEST — Full academy school year as adept
// ─────────────────────────────────────────────────────
describe('Full academy school year (adept)', () => {
	// Lesson IDs in order
	const LESSON_IDS = [
		'alchemy_basics',
		'elemental_theory',
		'golem_patterns',
		'transmutation',
		'ward_theory',
		'final_review',
	];

	// Lesson names corresponding to check_lesson option indices (0-5)
	const LESSON_NODES = [
		'lesson_alchemy_basics',
		'lesson_elemental_theory',
		'lesson_golem_patterns',
		'lesson_transmutation',
		'lesson_ward_theory',
		'lesson_final_review',
	];

	/** Helper: complete one lesson. Returns the game for chaining. */
	function completeLesson(game: GameDriver, lessonIndex: number, isFirstVisit: boolean) {
		game.talkTo('Professor Ignis');

		if (isFirstVisit) {
			// First visit: 'start' node
			expect(game.dialogNodeId).toBe('start');
			game.choose(1); // "I'm ready for my lesson."
		} else {
			// Return visit: 'return' node
			expect(game.dialogNodeId).toBe('return');
			game.choose(0); // "I'm ready for my lesson."
		}
		expect(game.dialogNodeId).toBe('check_lesson');

		// Select the lesson by its raw index
		game.choose(lessonIndex);
		expect(game.dialogNodeId).toBe(LESSON_NODES[lessonIndex]);

		// Complete the lesson (always index 0)
		game.choose(0);
		expect(game.dialogNodeId).toBe('lesson_complete');
		expect(game.state.academyState!.lessonsCompleted).toContain(LESSON_IDS[lessonIndex]);

		// "I won't forget" → farewell
		game.choose(0);
		game.closeDialog();
	}

	it('completes all 6 lessons across the school year', () => {
		const game = createAdept();

		// Verify starting state
		expect(game.state.academyState!.enrolled).toBe(true);
		expect(game.state.academyState!.lessonsCompleted.length).toBe(0);
		expect(game.state.academyState!.nextLessonIndex).toBe(0);

		// ── Lesson 1: Alchemy Fundamentals (available immediately) ──
		completeLesson(game, 0, true);
		expect(game.state.academyState!.nextLessonIndex).toBe(1);

		// ── Lessons 2-6: Each requires advancing time ──
		for (let i = 1; i < 6; i++) {
			const nextAvail = game.state.academyState!.nextLessonAvailableTurn;
			expect(nextAvail).toBeGreaterThan(game.turn);

			// Fast-forward time
			game.advanceTurns(nextAvail - game.turn);

			completeLesson(game, i, false);
			expect(game.state.academyState!.nextLessonIndex).toBe(i + 1);
		}

		// Verify all lessons completed
		expect(game.state.academyState!.lessonsCompleted.length).toBe(6);
		for (const id of LESSON_IDS) {
			expect(game.state.academyState!.lessonsCompleted).toContain(id);
		}
	});

	it('passes the exam after completing all lessons (with godMode)', () => {
		const game = createAdept();

		// Speed-run all 6 lessons
		completeLesson(game, 0, true);
		for (let i = 1; i < 6; i++) {
			game.advanceTurns(game.state.academyState!.nextLessonAvailableTurn - game.turn);
			completeLesson(game, i, false);
		}
		expect(game.state.academyState!.lessonsCompleted.length).toBe(6);

		// ── Go to Archmagus Veylen for the exam ──
		game.talkTo('Archmagus Veylen');
		expect(game.dialog!.npcName).toBe('Archmagus Veylen');
		// Enrolled student: conditionalStartNodes sends to 'return' node
		expect(game.dialogNodeId).toBe('return');

		// Select "I'm ready for the final exam." (index 0)
		game.choose(0);
		expect(game.dialogNodeId).toBe('exam_start');

		// Part 1: Alchemy question — correct answer is index 0
		game.choose(0); // "Starfern and Moonwater Vial."
		expect(game.dialogNodeId).toBe('exam_part1_pass');

		// "I'm ready. Summon the Golem!" (index 0) — triggers startExam
		game.choose(0);

		// Dialogue should be closed (startExam sets activeDialogue = null)
		expect(game.dialog).toBeNull();

		// Exam Golem should be spawned
		const golem = game.enemies.find(e => e.name === 'Exam Golem');
		expect(golem).toBeDefined();
		expect(golem!.hp).toBe(20);

		// examPart1Passed should be true
		expect(game.state.academyState!.examPart1Passed).toBe(true);

		// ── Fight the Exam Golem with godMode ──
		game.godMode();
		// Teleport next to golem and attack
		game.teleport(golem!.pos.x - 1, golem!.pos.y);
		game.key('d'); // Attack east into golem

		// Golem should be dead (9999 attack one-shots it)
		expect(game.enemies.find(e => e.name === 'Exam Golem')).toBeUndefined();

		// ── Verify graduation ──
		expect(game.state.academyState!.graduated).toBe(true);
		expect(game.state.academyState!.examPassed).toBe(true);
		expect(game.state.playerTitles).toContain('Mage');

		// Check the log for graduation message
		const log = game.log();
		expect(log).toContain('Exam Golem');
	});

	it('fails the alchemy question with wrong answer', () => {
		const game = createAdept();

		// Speed-run all 6 lessons
		completeLesson(game, 0, true);
		for (let i = 1; i < 6; i++) {
			game.advanceTurns(game.state.academyState!.nextLessonAvailableTurn - game.turn);
			completeLesson(game, i, false);
		}

		// Talk to Archmagus for exam
		game.talkTo('Archmagus Veylen');
		game.choose(0); // "I'm ready for the final exam."
		expect(game.dialogNodeId).toBe('exam_start');

		// Give wrong answer (index 1)
		game.choose(1); // "Mandrake Root and Fire Crystal."
		expect(game.dialogNodeId).toBe('exam_part1_fail');

		// No golem spawned
		expect(game.enemies.find(e => e.name === 'Exam Golem')).toBeUndefined();
		expect(game.state.academyState!.examPart1Passed).toBe(false);

		game.closeDialog();
	});

	it('fights Exam Golem using the 3-turn retreat strategy', () => {
		const game = createAdept();

		// Speed-run all lessons
		completeLesson(game, 0, true);
		for (let i = 1; i < 6; i++) {
			game.advanceTurns(game.state.academyState!.nextLessonAvailableTurn - game.turn);
			completeLesson(game, i, false);
		}

		// Start exam
		game.talkTo('Archmagus Veylen');
		game.choose(0); // exam
		game.choose(0); // correct alchemy answer
		game.choose(0); // summon golem

		// Golem at (40, 17), 20 HP, attack 2
		const golem = game.enemies.find(e => e.name === 'Exam Golem')!;
		expect(golem).toBeDefined();
		expect(golem.hp).toBe(20);

		// Set player to reasonable combat stats (not godMode)
		game.setStats({ hp: 100, maxHp: 100, attack: 8 });

		// Position player west of golem
		game.teleport(golem.pos.x - 1, golem.pos.y);

		const startHp = game.hp;

		// Fight using 3-turn cycle strategy:
		// Turns 1,2: attack (golem charges, low dmg)
		// Turn 3: retreat west (golem blasts, but we're out of range)
		// Then walk back east to be adjacent again
		let cycles = 0;
		while (game.enemies.some(e => e.name === 'Exam Golem') && cycles < 10) {
			// Attack on turns 1 and 2 of golem's cycle
			game.key('d'); // attack east
			if (!game.enemies.some(e => e.name === 'Exam Golem')) break;
			game.key('d'); // attack east again

			if (!game.enemies.some(e => e.name === 'Exam Golem')) break;

			// Retreat on turn 3 (golem blasts)
			game.key('a'); // move west to dodge blast

			// Walk back east to be adjacent again
			game.key('d'); // move east

			cycles++;
		}

		// Golem should be dead
		expect(game.enemies.find(e => e.name === 'Exam Golem')).toBeUndefined();
		expect(game.state.academyState!.graduated).toBe(true);
		expect(game.state.playerTitles).toContain('Mage');

		// Player should have survived with health remaining
		expect(game.hp).toBeGreaterThan(0);
		// Player should have taken SOME damage (from charge turns)
		expect(game.hp).toBeLessThan(startHp);
	});

	it('tracks full academy timeline correctly', () => {
		const game = createAdept();
		const startTurn = game.turn;

		// Complete all lessons and track the timeline
		const lessonTurns: number[] = [];

		completeLesson(game, 0, true);
		lessonTurns.push(game.turn);

		for (let i = 1; i < 6; i++) {
			const nextAvail = game.state.academyState!.nextLessonAvailableTurn;
			game.advanceTurns(nextAvail - game.turn);
			completeLesson(game, i, false);
			lessonTurns.push(game.turn);
		}

		// Each lesson should happen later than the previous
		for (let i = 1; i < lessonTurns.length; i++) {
			expect(lessonTurns[i]).toBeGreaterThan(lessonTurns[i - 1]);
		}

		// Total time should be significant (lessons have delays of 400-500 turns each)
		const totalTime = lessonTurns[5] - startTurn;
		expect(totalTime).toBeGreaterThan(2000); // at least ~2400 turns for 5 delays
	});

	it('full playthrough: adept enrolls, studies, graduates, then teaches', () => {
		const game = createAdept();

		// ── PHASE 1: Complete all lessons ──
		completeLesson(game, 0, true);
		for (let i = 1; i < 6; i++) {
			game.advanceTurns(game.state.academyState!.nextLessonAvailableTurn - game.turn);
			completeLesson(game, i, false);
		}

		// ── PHASE 2: Pass the exam ──
		game.talkTo('Archmagus Veylen');
		game.choose(0); // exam
		game.choose(0); // correct answer
		game.choose(0); // summon golem
		game.godMode();
		const golem = game.enemies.find(e => e.name === 'Exam Golem')!;
		game.teleport(golem.pos.x - 1, golem.pos.y);
		game.key('d'); // kill golem

		expect(game.state.academyState!.graduated).toBe(true);
		expect(game.state.playerTitles).toContain('Mage');

		// ── PHASE 3: Teach ──
		// On subsequent visit, Archmagus uses returnNode 'return' (conditionalStartNodes only apply on first visit)
		game.talkTo('Archmagus Veylen');
		expect(game.dialogNodeId).toBe('return');

		// "I'd like to teach." is at raw index 2 in the return node
		game.choose(2);
		expect(game.dialogNodeId).toBe('teaching_intro');

		// "Let's begin the lesson."
		game.choose(0);
		expect(game.dialogNodeId).toBe('teaching_q1');

		// Answer correctly: "Starfern and Moonwater Vial." (index 0)
		game.choose(0);
		expect(game.dialogNodeId).toBe('teaching_correct');

		// "My pleasure." — triggers completeTeaching: 'correct'
		game.choose(0);

		// Verify teaching session recorded
		expect(game.state.academyState!.teachingSessions).toBe(1);

		game.closeDialog();
	});
});
