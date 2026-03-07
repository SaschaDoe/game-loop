import type { GameState } from './types';

export const TURNS_PER_CYCLE = 100;

export type TimePhase = 'dawn' | 'morning' | 'afternoon' | 'dusk' | 'evening' | 'night' | 'midnight';

// Each phase occupies a portion of the cycle
const PHASE_RANGES: { phase: TimePhase; start: number; end: number }[] = [
	{ phase: 'dawn', start: 0, end: 10 },
	{ phase: 'morning', start: 10, end: 25 },
	{ phase: 'afternoon', start: 25, end: 45 },
	{ phase: 'dusk', start: 45, end: 55 },
	{ phase: 'evening', start: 55, end: 70 },
	{ phase: 'night', start: 70, end: 90 },
	{ phase: 'midnight', start: 90, end: 100 }
];

export function getTimePhase(turnCount: number): TimePhase {
	const t = ((turnCount % TURNS_PER_CYCLE) + TURNS_PER_CYCLE) % TURNS_PER_CYCLE;
	for (const range of PHASE_RANGES) {
		if (t >= range.start && t < range.end) return range.phase;
	}
	return 'dawn'; // cycle wraps
}

export function isNightTime(phase: TimePhase): boolean {
	return phase === 'night' || phase === 'midnight' || phase === 'evening';
}

export function isDayTime(phase: TimePhase): boolean {
	return phase === 'morning' || phase === 'afternoon';
}

export function phaseName(phase: TimePhase): string {
	switch (phase) {
		case 'dawn': return 'Dawn';
		case 'morning': return 'Morning';
		case 'afternoon': return 'Afternoon';
		case 'dusk': return 'Dusk';
		case 'evening': return 'Evening';
		case 'night': return 'Night';
		case 'midnight': return 'Midnight';
	}
}

// Sight radius modifier: negative at night, 0 during day
export function sightModifier(phase: TimePhase): number {
	switch (phase) {
		case 'dawn': return -1;
		case 'morning': return 0;
		case 'afternoon': return 0;
		case 'dusk': return -1;
		case 'evening': return -2;
		case 'night': return -3;
		case 'midnight': return -4;
	}
}

// Monster aggression multiplier: higher at night
export function aggressionMultiplier(phase: TimePhase): number {
	switch (phase) {
		case 'dawn': return 1.0;
		case 'morning': return 0.8;
		case 'afternoon': return 0.8;
		case 'dusk': return 1.0;
		case 'evening': return 1.2;
		case 'night': return 1.5;
		case 'midnight': return 1.8;
	}
}

// Color tint for rendering (hex string)
export function phaseColor(phase: TimePhase): string {
	switch (phase) {
		case 'dawn': return '#ffd0a0';
		case 'morning': return '#ffffff';
		case 'afternoon': return '#fffff0';
		case 'dusk': return '#ff9060';
		case 'evening': return '#8080c0';
		case 'night': return '#4040a0';
		case 'midnight': return '#202060';
	}
}

export interface TimeTransitionResult {
	phaseChanged: boolean;
	newPhase: TimePhase;
	message: string | null;
}

export function tickTime(state: GameState): TimeTransitionResult {
	const prevPhase = getTimePhase(state.turnCount);
	state.turnCount++;
	const newPhase = getTimePhase(state.turnCount);

	if (prevPhase !== newPhase) {
		return {
			phaseChanged: true,
			newPhase,
			message: `The time shifts to ${phaseName(newPhase).toLowerCase()}.`
		};
	}

	return { phaseChanged: false, newPhase, message: null };
}

export function advanceToPhase(state: GameState, targetPhase: TimePhase): number {
	let turnsSkipped = 0;
	while (getTimePhase(state.turnCount) !== targetPhase && turnsSkipped < TURNS_PER_CYCLE) {
		state.turnCount++;
		turnsSkipped++;
	}
	return turnsSkipped;
}
