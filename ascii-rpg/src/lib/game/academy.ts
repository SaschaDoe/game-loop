/**
 * Arcane Academy system — enrollment, lessons, exams, teaching, graduation.
 *
 * Lessons are sequential: each lesson unlocks a set number of days after the
 * previous one is completed. If the player is late, the lesson waits — the
 * school year simply takes longer. If the player is on time for everything,
 * the total is ~30 days.
 */
import type { GameState, AcademyState, GameMessage } from './types';
import { acceptQuest, updateQuestProgress, completeQuest } from './quests';

// ── Constants ──

export const TURNS_PER_DAY = 100;
export const TEACHING_COOLDOWN_TURNS = 200;
export const TEACHING_XP_REWARD = 50;

// ── Lesson Definitions ──

export interface AcademyLesson {
	id: string;
	index: number;
	/** Days after the *previous* lesson before this one becomes available */
	delayDays: number;
	title: string;
	taughtBy: string;
	type: 'alchemy' | 'combat' | 'lore';
	teachingText: string;
	examRelevant: boolean;
}

export const LESSONS: AcademyLesson[] = [
	{
		id: 'alchemy_basics',
		index: 0,
		delayDays: 0, // available immediately on enrollment
		title: 'Alchemy Fundamentals',
		taughtBy: 'Professor Ignis',
		type: 'alchemy',
		teachingText: 'Today we study the Health Potion. The recipe is precise: combine Starfern with a Moonwater Vial. No substitutes. Starfern provides the restorative essence, Moonwater binds it. Remember: Starfern and Moonwater Vial. This WILL be on the exam.',
		examRelevant: true,
	},
	{
		id: 'elemental_theory',
		index: 1,
		delayDays: 4,
		title: 'Elemental Weaknesses',
		taughtBy: 'Professor Ignis',
		type: 'combat',
		teachingText: 'Every elemental creature has a counter-element. Frost creatures fear fire. Fire creatures fear water. But the Exam Golem is different — it is an arcane construct, not elemental. Do not waste time on elements. Instead, study its attack pattern.',
		examRelevant: false,
	},
	{
		id: 'golem_patterns',
		index: 2,
		delayDays: 5,
		title: 'Arcane Golem Behavioral Patterns',
		taughtBy: 'Professor Ignis',
		type: 'combat',
		teachingText: 'The Arcane Golem follows a strict 3-turn cycle. Turn 1: it CHARGES (low damage, 1-2 HP). Turn 2: it CHARGES again (low damage, 1-2 HP). Turn 3: it unleashes an ARCANE BLAST (massive damage, 8-12 HP). The key to survival: on every third turn, RETREAT one tile away. The blast has melee range only. Charge, charge, BLAST. Retreat on the blast turn. This is how you survive the combat exam.',
		examRelevant: true,
	},
	{
		id: 'transmutation',
		index: 3,
		delayDays: 5,
		title: 'Advanced Transmutation',
		taughtBy: 'Professor Ignis',
		type: 'alchemy',
		teachingText: 'The Philosopher\'s Draught requires five ingredients: Phoenix Ash, Moonwater Vial, Starfern, Mandrake Root, and Dreamleaf. Missing any one of them and the potion becomes volatile. The order of mixing matters: always add Mandrake Root last, or the solution crystallizes.',
		examRelevant: false,
	},
	{
		id: 'ward_theory',
		index: 4,
		delayDays: 5,
		title: 'Protective Wards',
		taughtBy: 'Professor Ignis',
		type: 'lore',
		teachingText: 'A ward is a standing spell anchored to a location. The strongest ward — the Shieldwall Glyph — requires three concentric circles of power. Each circle must face a cardinal direction. Remember: wards fail if the anchor point is disturbed. In the practice dungeon, look for glowing floor tiles — those are ward anchors.',
		examRelevant: false,
	},
	{
		id: 'final_review',
		index: 5,
		delayDays: 4,
		title: 'Final Review',
		taughtBy: 'Professor Ignis',
		type: 'lore',
		teachingText: 'Your exam has two parts. PART ONE: an alchemy question. You will be asked which two ingredients make a Health Potion. The answer is Starfern and Moonwater Vial. PART TWO: combat against an Arcane Golem. Remember its 3-turn cycle — charge, charge, BLAST. Retreat on every third turn to avoid the blast. Good luck.',
		examRelevant: true,
	},
];

// ── Teaching Questions ──

export interface TeachingQuestion {
	id: string;
	studentQuestion: string;
	options: string[];
	correctIndex: number;
	explanation: string;
}

export const TEACHING_QUESTIONS: TeachingQuestion[] = [
	{
		id: 'tq_health_potion',
		studentQuestion: 'Professor, which two ingredients are needed for a basic Health Potion?',
		options: ['Starfern and Moonwater Vial', 'Mandrake Root and Fire Crystal', 'Phoenix Ash and Void Salt', 'Dreamleaf and Shadowroot'],
		correctIndex: 0,
		explanation: 'Correct! Starfern provides restorative essence, Moonwater Vial binds it.',
	},
	{
		id: 'tq_golem_cycle',
		studentQuestion: 'How many turns are in the Arcane Golem\'s attack cycle?',
		options: ['2 turns', '3 turns', '4 turns', '5 turns'],
		correctIndex: 1,
		explanation: 'Correct! Charge, charge, blast — a 3-turn cycle.',
	},
	{
		id: 'tq_golem_blast',
		studentQuestion: 'What should you do on the Golem\'s third turn?',
		options: ['Attack aggressively', 'Retreat one tile away', 'Use a potion', 'Stand still and block'],
		correctIndex: 1,
		explanation: 'Correct! The blast has melee range only — retreating avoids it entirely.',
	},
	{
		id: 'tq_mandrake',
		studentQuestion: 'When brewing the Philosopher\'s Draught, which ingredient must be added last?',
		options: ['Phoenix Ash', 'Starfern', 'Mandrake Root', 'Dreamleaf'],
		correctIndex: 2,
		explanation: 'Correct! Adding Mandrake Root last prevents crystallization.',
	},
	{
		id: 'tq_ward_circles',
		studentQuestion: 'How many concentric circles does the Shieldwall Glyph require?',
		options: ['One', 'Two', 'Three', 'Seven'],
		correctIndex: 2,
		explanation: 'Correct! Three concentric circles, each facing a cardinal direction.',
	},
	{
		id: 'tq_frost_weakness',
		studentQuestion: 'What element are frost creatures weak to?',
		options: ['Water', 'Shadow', 'Fire', 'Lightning'],
		correctIndex: 2,
		explanation: 'Correct! Fire counters frost, always.',
	},
	{
		id: 'tq_ward_failure',
		studentQuestion: 'What causes a ward to fail?',
		options: ['Loud noises', 'Disturbing the anchor point', 'Moonlight exposure', 'Enemy proximity'],
		correctIndex: 1,
		explanation: 'Correct! Wards fail when their anchor point is disturbed.',
	},
	{
		id: 'tq_golem_charge_dmg',
		studentQuestion: 'How much damage does the Golem\'s charge attack deal?',
		options: ['0 damage', '1-2 damage', '5-7 damage', '8-12 damage'],
		correctIndex: 1,
		explanation: 'Correct! The charge is weak — only 1-2 damage. The blast is the real threat.',
	},
];

// ── Exam Alchemy Question ──

export const EXAM_QUESTION = {
	question: 'What are the two ingredients required to brew a basic Health Potion?',
	options: [
		'Starfern and Moonwater Vial',
		'Mandrake Root and Fire Crystal',
		'Phoenix Ash and Void Salt',
		'Dreamleaf and Shadowroot',
	],
	correctIndex: 0,
};

// ── Helper Functions ──

export function createAcademyState(enrolled: boolean, graduated: boolean, turn: number): AcademyState {
	return {
		enrolled,
		enrolledAtTurn: turn,
		lessonsCompleted: [],
		nextLessonIndex: graduated ? LESSONS.length : 0,
		nextLessonAvailableTurn: turn, // first lesson available immediately
		examTaken: false,
		examPassed: false,
		examPart1Passed: false,
		graduated,
		isTeaching: false,
		teachingSessions: 0,
		teachingCooldownTurn: 0,
	};
}

/** Days since enrollment — still useful for flavor display. */
export function getAcademyDay(state: GameState): number {
	if (!state.academyState) return 0;
	return Math.floor((state.turnCount - state.academyState.enrolledAtTurn) / TURNS_PER_DAY) + 1;
}

/** Get the current lesson that's available (if any). */
export function getCurrentLesson(state: GameState): AcademyLesson | null {
	if (!state.academyState || !state.academyState.enrolled) return null;
	const idx = state.academyState.nextLessonIndex;
	if (idx >= LESSONS.length) return null; // all done
	if (state.turnCount < state.academyState.nextLessonAvailableTurn) return null; // not yet
	return LESSONS[idx];
}

/** Check if a lesson is currently available for the player. */
export function isLessonReady(state: GameState): boolean {
	return getCurrentLesson(state) !== null;
}

/** Check if all 6 lessons have been completed. */
export function allLessonsComplete(state: GameState): boolean {
	if (!state.academyState) return false;
	return state.academyState.nextLessonIndex >= LESSONS.length;
}

/** Get info about the next upcoming lesson (even if not yet available). */
export function getNextLessonInfo(state: GameState): { lesson: AcademyLesson; availableInDays: number } | null {
	if (!state.academyState || !state.academyState.enrolled) return null;
	const idx = state.academyState.nextLessonIndex;
	if (idx >= LESSONS.length) return null;
	const lesson = LESSONS[idx];
	const turnsLeft = Math.max(0, state.academyState.nextLessonAvailableTurn - state.turnCount);
	const daysLeft = Math.ceil(turnsLeft / TURNS_PER_DAY);
	return { lesson, availableInDays: daysLeft };
}

export function canTakeExam(state: GameState): boolean {
	if (!state.academyState) return false;
	if (state.academyState.graduated) return false;
	if (state.academyState.examPassed) return false;
	// All lessons must be completed before the exam
	return state.academyState.nextLessonIndex >= LESSONS.length;
}

export function canTeach(state: GameState): boolean {
	if (!state.academyState) return false;
	if (!state.academyState.graduated) return false;
	return state.turnCount >= state.academyState.teachingCooldownTurn;
}

export function enrollAtAcademy(state: GameState): void {
	state.academyState = createAcademyState(true, false, state.turnCount);
	// Auto-accept the school year quest
	acceptQuest(state, 'side_ac_school_year');
}

export function completeLesson(state: GameState, lessonId: string): void {
	if (!state.academyState) return;
	if (state.academyState.lessonsCompleted.includes(lessonId)) return;

	state.academyState.lessonsCompleted.push(lessonId);
	state.academyState.nextLessonIndex++;

	// Schedule next lesson
	if (state.academyState.nextLessonIndex < LESSONS.length) {
		const nextLesson = LESSONS[state.academyState.nextLessonIndex];
		state.academyState.nextLessonAvailableTurn = state.turnCount + nextLesson.delayDays * TURNS_PER_DAY;
	}

	// When all lessons complete, update school year quest
	if (state.academyState.nextLessonIndex >= LESSONS.length) {
		updateQuestProgress(state, 'explore', 'academy_lessons_complete');
	}
}

/** Build a message describing what comes next after completing a lesson. */
export function getPostLessonMessage(state: GameState): string {
	const info = getNextLessonInfo(state);
	if (!info) {
		return 'All lessons complete! You may now take the final exam. Speak to the Archmagus when ready.';
	}
	if (info.availableInDays === 0) {
		return `Your next lesson "${info.lesson.title}" with ${info.lesson.taughtBy} is available now!`;
	}
	return `Your next lesson "${info.lesson.title}" with ${info.lesson.taughtBy} will be available in ${info.availableInDays} day${info.availableInDays > 1 ? 's' : ''}.`;
}

export function passExamPart1(state: GameState): void {
	if (!state.academyState) return;
	state.academyState.examPart1Passed = true;
}

export function passExam(state: GameState): void {
	if (!state.academyState) return;
	state.academyState.examTaken = true;
	state.academyState.examPassed = true;
	state.academyState.graduated = true;
	state.academyState.enrolled = false;
	if (!state.playerTitles.includes('Mage')) {
		state.playerTitles.push('Mage');
	}
	// Complete the school year quest
	updateQuestProgress(state, 'explore', 'academy_exam_passed');
	completeQuest(state, 'side_ac_school_year');
}

export function completeTeachingSession(state: GameState, correct: boolean): GameMessage[] {
	if (!state.academyState) return [];
	const messages: GameMessage[] = [];

	state.academyState.teachingCooldownTurn = state.turnCount + TEACHING_COOLDOWN_TURNS;

	if (correct) {
		state.academyState.teachingSessions++;
		state.xp += TEACHING_XP_REWARD;
		messages.push({ text: `Teaching session complete! +${TEACHING_XP_REWARD} XP.`, type: 'level_up' });

		// Update teaching quest progress
		updateQuestProgress(state, 'explore', 'academy_teaching_session');
		// Auto-complete teaching quest if all objectives done
		const teachQuest = state.quests.find(q => q.id === 'side_ac_teaching' && q.status === 'active');
		if (teachQuest && teachQuest.objectives.every(o => o.completed)) {
			const result = completeQuest(state, 'side_ac_teaching');
			if (result.success) {
				for (const msg of result.messages) {
					messages.push({ text: msg, type: 'discovery' });
				}
			}
		}

		if (state.academyState.teachingSessions === 5 && !state.playerTitles.includes('Master Teacher')) {
			state.playerTitles.push('Master Teacher');
			messages.push({ text: 'You earned the title: Master Teacher!', type: 'discovery' });
		}

		if (state.academyState.teachingSessions === 10) {
			state.player.attack += 1;
			messages.push({ text: 'Your teaching mastery grants +1 ATK permanently!', type: 'level_up' });
		}
	} else {
		messages.push({ text: 'The student looks confused. Better review the material...', type: 'info' });
	}

	return messages;
}

export function getNextTeachingQuestion(state: GameState): TeachingQuestion {
	if (!state.academyState) return TEACHING_QUESTIONS[0];
	const idx = state.academyState.teachingSessions % TEACHING_QUESTIONS.length;
	return TEACHING_QUESTIONS[idx];
}

/** Called each turn to notify the player about lesson availability. */
export function tickAcademy(state: GameState): GameMessage[] {
	if (!state.academyState || !state.academyState.enrolled) return [];

	const messages: GameMessage[] = [];

	// Check if a lesson just became available this turn
	const idx = state.academyState.nextLessonIndex;
	if (idx < LESSONS.length && state.turnCount === state.academyState.nextLessonAvailableTurn) {
		const lesson = LESSONS[idx];
		messages.push({
			text: `Lesson available: "${lesson.title}" with ${lesson.taughtBy}. Speak to them at the Academy.`,
			type: 'discovery',
		});
	}

	return messages;
}
