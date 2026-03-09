import { describe, it, expect } from 'vitest';
import { createGame } from './engine';
import type { CharacterConfig, GameState } from './types';
import {
	isLessonReady, getCurrentLesson, allLessonsComplete, canTakeExam, canTeach,
	enrollAtAcademy, completeLesson, passExam, completeTeachingSession,
	tickAcademy, TURNS_PER_DAY, TEACHING_COOLDOWN_TURNS,
	createAcademyState, getNextTeachingQuestion, TEACHING_QUESTIONS,
	LESSONS, getNextLessonInfo, getPostLessonMessage,
} from './academy';

function makeAcademyConfig(characterClass: CharacterConfig['characterClass'] = 'warrior'): CharacterConfig {
	return { name: 'Test', characterClass, difficulty: 'normal', startingLocation: 'academy', worldSeed: 'academy-test' };
}

function makeState(characterClass: CharacterConfig['characterClass'] = 'warrior'): GameState {
	return createGame(makeAcademyConfig(characterClass));
}

describe('academy initialization', () => {
	it('mage at academy starts as graduate with title', () => {
		const state = makeState('mage');
		expect(state.academyState).not.toBeNull();
		expect(state.academyState!.graduated).toBe(true);
		expect(state.academyState!.enrolled).toBe(false);
		expect(state.playerTitles).toContain('Archmage Apprentice');
	});

	it('non-mage at academy starts enrolled', () => {
		const state = makeState('warrior');
		expect(state.academyState).not.toBeNull();
		expect(state.academyState!.enrolled).toBe(true);
		expect(state.academyState!.graduated).toBe(false);
		expect(state.playerTitles).toEqual([]);
	});

	it('non-mage starts with first lesson available immediately', () => {
		const state = makeState('warrior');
		expect(state.academyState!.nextLessonIndex).toBe(0);
		expect(state.academyState!.nextLessonAvailableTurn).toBe(state.turnCount);
		expect(isLessonReady(state)).toBe(true);
	});

	it('non-academy start has no academy state', () => {
		const state = createGame({ name: 'Test', characterClass: 'warrior', difficulty: 'normal', startingLocation: 'village', worldSeed: 'village-test' });
		expect(state.academyState).toBeNull();
	});
});

describe('sequential lesson system', () => {
	it('first lesson is available immediately on enrollment', () => {
		const state = makeState();
		const lesson = getCurrentLesson(state);
		expect(lesson).not.toBeNull();
		expect(lesson!.id).toBe('alchemy_basics');
	});

	it('completing a lesson advances to next with delay', () => {
		const state = makeState();
		completeLesson(state, 'alchemy_basics');
		expect(state.academyState!.nextLessonIndex).toBe(1);
		expect(state.academyState!.lessonsCompleted).toContain('alchemy_basics');
		// Next lesson (elemental_theory) has delayDays=4
		const expectedTurn = state.turnCount + 4 * TURNS_PER_DAY;
		expect(state.academyState!.nextLessonAvailableTurn).toBe(expectedTurn);
	});

	it('lesson not available before delay expires', () => {
		const state = makeState();
		completeLesson(state, 'alchemy_basics');
		// Still before delay
		state.turnCount += 3 * TURNS_PER_DAY;
		expect(isLessonReady(state)).toBe(false);
		expect(getCurrentLesson(state)).toBeNull();
	});

	it('lesson available after delay expires', () => {
		const state = makeState();
		const startTurn = state.turnCount;
		completeLesson(state, 'alchemy_basics');
		state.turnCount = startTurn + 4 * TURNS_PER_DAY;
		expect(isLessonReady(state)).toBe(true);
		expect(getCurrentLesson(state)!.id).toBe('elemental_theory');
	});

	it('lesson waits indefinitely if player is late', () => {
		const state = makeState();
		completeLesson(state, 'alchemy_basics');
		// Way past the delay — lesson should still be available
		state.turnCount += 100 * TURNS_PER_DAY;
		expect(isLessonReady(state)).toBe(true);
		expect(getCurrentLesson(state)!.id).toBe('elemental_theory');
	});

	it('completed lesson is not re-offered', () => {
		const state = makeState();
		completeLesson(state, 'alchemy_basics');
		expect(state.academyState!.lessonsCompleted).toContain('alchemy_basics');
		// Next lesson has a delay — either null (waiting) or a different lesson
		const next = getCurrentLesson(state);
		expect(next === null || next.id !== 'alchemy_basics').toBe(true);
	});

	it('all 6 lessons can be completed in sequence', () => {
		const state = makeState();
		for (const lesson of LESSONS) {
			completeLesson(state, lesson.id);
			state.turnCount += 10 * TURNS_PER_DAY; // plenty of time
		}
		expect(state.academyState!.lessonsCompleted.length).toBe(6);
		expect(allLessonsComplete(state)).toBe(true);
		expect(isLessonReady(state)).toBe(false);
	});

	it('getNextLessonInfo shows days until available', () => {
		const state = makeState();
		completeLesson(state, 'alchemy_basics');
		const info = getNextLessonInfo(state);
		expect(info).not.toBeNull();
		expect(info!.lesson.id).toBe('elemental_theory');
		expect(info!.availableInDays).toBe(4);
	});

	it('getNextLessonInfo returns 0 days when ready', () => {
		const state = makeState();
		const info = getNextLessonInfo(state);
		expect(info).not.toBeNull();
		expect(info!.availableInDays).toBe(0);
	});

	it('getNextLessonInfo returns null when all complete', () => {
		const state = makeState();
		for (const lesson of LESSONS) {
			completeLesson(state, lesson.id);
			state.turnCount += 10 * TURNS_PER_DAY;
		}
		expect(getNextLessonInfo(state)).toBeNull();
	});

	it('getPostLessonMessage describes next lesson', () => {
		const state = makeState();
		completeLesson(state, 'alchemy_basics');
		const msg = getPostLessonMessage(state);
		expect(msg).toContain('Elemental Weaknesses');
		expect(msg).toContain('4 day');
	});

	it('getPostLessonMessage says exam ready when all complete', () => {
		const state = makeState();
		for (const lesson of LESSONS) {
			completeLesson(state, lesson.id);
			state.turnCount += 10 * TURNS_PER_DAY;
		}
		const msg = getPostLessonMessage(state);
		expect(msg).toContain('exam');
	});
});

describe('exam eligibility', () => {
	it('cannot take exam before all lessons complete', () => {
		const state = makeState();
		// Only complete 3 lessons
		for (let i = 0; i < 3; i++) {
			completeLesson(state, LESSONS[i].id);
			state.turnCount += 10 * TURNS_PER_DAY;
		}
		expect(canTakeExam(state)).toBe(false);
	});

	it('can take exam after all lessons complete', () => {
		const state = makeState();
		for (const lesson of LESSONS) {
			completeLesson(state, lesson.id);
			state.turnCount += 10 * TURNS_PER_DAY;
		}
		expect(canTakeExam(state)).toBe(true);
	});

	it('cannot take exam if already graduated', () => {
		const state = makeState('mage'); // auto-graduated
		expect(canTakeExam(state)).toBe(false);
	});
});

describe('graduation', () => {
	it('passExam grants Mage title', () => {
		const state = makeState();
		passExam(state);
		expect(state.academyState!.graduated).toBe(true);
		expect(state.academyState!.enrolled).toBe(false);
		expect(state.playerTitles).toContain('Mage');
	});
});

describe('teaching', () => {
	it('graduate can teach', () => {
		const state = makeState('mage');
		expect(canTeach(state)).toBe(true);
	});

	it('enrolled student cannot teach', () => {
		const state = makeState('warrior');
		expect(canTeach(state)).toBe(false);
	});

	it('correct teaching awards XP', () => {
		const state = makeState('mage');
		const initialXp = state.xp;
		const msgs = completeTeachingSession(state, true);
		expect(state.xp).toBe(initialXp + 50);
		expect(state.academyState!.teachingSessions).toBe(1);
		expect(msgs.some(m => m.text.includes('+50 XP'))).toBe(true);
	});

	it('wrong teaching gives no XP', () => {
		const state = makeState('mage');
		const initialXp = state.xp;
		completeTeachingSession(state, false);
		expect(state.xp).toBe(initialXp);
	});

	it('teaching sets cooldown', () => {
		const state = makeState('mage');
		completeTeachingSession(state, true);
		expect(state.academyState!.teachingCooldownTurn).toBe(TEACHING_COOLDOWN_TURNS);
		expect(canTeach(state)).toBe(false);
	});

	it('5 sessions grants Master Teacher title', () => {
		const state = makeState('mage');
		for (let i = 0; i < 5; i++) {
			state.academyState!.teachingCooldownTurn = 0;
			state.turnCount = 0;
			completeTeachingSession(state, true);
		}
		expect(state.playerTitles).toContain('Master Teacher');
	});

	it('10 sessions grants +1 ATK', () => {
		const state = makeState('mage');
		const initialAtk = state.player.attack;
		for (let i = 0; i < 10; i++) {
			state.academyState!.teachingCooldownTurn = 0;
			state.turnCount = 0;
			completeTeachingSession(state, true);
		}
		expect(state.player.attack).toBe(initialAtk + 1);
	});

	it('getNextTeachingQuestion cycles through questions', () => {
		const state = makeState('mage');
		const q1 = getNextTeachingQuestion(state);
		expect(q1.id).toBe(TEACHING_QUESTIONS[0].id);
		state.academyState!.teachingSessions = 1;
		const q2 = getNextTeachingQuestion(state);
		expect(q2.id).toBe(TEACHING_QUESTIONS[1].id);
	});
});

describe('tickAcademy', () => {
	it('notifies when lesson becomes available', () => {
		const state = makeState();
		completeLesson(state, 'alchemy_basics');
		// Fast forward to the exact turn the next lesson unlocks
		state.turnCount = state.academyState!.nextLessonAvailableTurn;
		const msgs = tickAcademy(state);
		expect(msgs.some(m => m.text.includes('Elemental Weaknesses'))).toBe(true);
	});

	it('no notification before lesson is ready', () => {
		const state = makeState();
		completeLesson(state, 'alchemy_basics');
		state.turnCount = state.academyState!.nextLessonAvailableTurn - 1;
		const msgs = tickAcademy(state);
		expect(msgs.length).toBe(0);
	});

	it('returns empty for non-enrolled', () => {
		const state = makeState('mage'); // graduated, not enrolled
		state.turnCount = TURNS_PER_DAY;
		const msgs = tickAcademy(state);
		expect(msgs).toEqual([]);
	});
});
