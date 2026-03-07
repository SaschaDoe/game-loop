import type { GameState, GameMessage } from './types';

export const MAX_SURVIVAL = 100;
export const HUNGER_DRAIN_PER_TURN = 1;
export const THIRST_DRAIN_PER_TURN = 1.5;

// Stage thresholds (below these values)
export const HUNGRY_THRESHOLD = 50;
export const STARVING_THRESHOLD = 20;
export const THIRSTY_THRESHOLD = 50;
export const DEHYDRATED_THRESHOLD = 20;

// Penalties
export const STARVING_HP_LOSS = 1;
export const DEHYDRATED_ATK_PENALTY = 2;

export type HungerStage = 'satisfied' | 'hungry' | 'starving';
export type ThirstStage = 'hydrated' | 'thirsty' | 'dehydrated';

export function getHungerStage(hunger: number): HungerStage {
	if (hunger <= STARVING_THRESHOLD) return 'starving';
	if (hunger <= HUNGRY_THRESHOLD) return 'hungry';
	return 'satisfied';
}

export function getThirstStage(thirst: number): ThirstStage {
	if (thirst <= DEHYDRATED_THRESHOLD) return 'dehydrated';
	if (thirst <= THIRSTY_THRESHOLD) return 'thirsty';
	return 'hydrated';
}

export interface SurvivalTickResult {
	messages: GameMessage[];
	hpLoss: number;
}

export function tickSurvival(state: GameState): SurvivalTickResult {
	if (!state.survivalEnabled) return { messages: [], hpLoss: 0 };

	const messages: GameMessage[] = [];
	let hpLoss = 0;

	const prevHungerStage = getHungerStage(state.hunger);
	const prevThirstStage = getThirstStage(state.thirst);

	state.hunger = Math.max(0, state.hunger - HUNGER_DRAIN_PER_TURN);
	state.thirst = Math.max(0, state.thirst - THIRST_DRAIN_PER_TURN);

	const newHungerStage = getHungerStage(state.hunger);
	const newThirstStage = getThirstStage(state.thirst);

	// Notify on stage transitions
	if (prevHungerStage !== newHungerStage) {
		if (newHungerStage === 'hungry') {
			messages.push({ text: 'You are getting hungry.', type: 'info' });
		} else if (newHungerStage === 'starving') {
			messages.push({ text: 'You are starving! Find food or lose HP each turn.', type: 'damage_taken' });
		}
	}

	if (prevThirstStage !== newThirstStage) {
		if (newThirstStage === 'thirsty') {
			messages.push({ text: 'You are getting thirsty.', type: 'info' });
		} else if (newThirstStage === 'dehydrated') {
			messages.push({ text: 'You are dehydrated! Your attacks are weakened.', type: 'damage_taken' });
		}
	}

	// Apply starving damage
	if (newHungerStage === 'starving') {
		hpLoss = STARVING_HP_LOSS;
		state.player.hp = Math.max(1, state.player.hp - hpLoss);
		if (messages.length === 0 || !messages.some(m => m.text.includes('starving'))) {
			messages.push({ text: `You lose ${hpLoss} HP from starvation.`, type: 'damage_taken' });
		}
	}

	return { messages, hpLoss };
}

export function getDehydrationPenalty(state: GameState): number {
	if (!state.survivalEnabled) return 0;
	if (getThirstStage(state.thirst) === 'dehydrated') return DEHYDRATED_ATK_PENALTY;
	return 0;
}

export function restoreHunger(state: GameState, amount: number): GameMessage {
	if (!state.survivalEnabled) return { text: '', type: 'info' };
	const before = state.hunger;
	state.hunger = Math.min(MAX_SURVIVAL, state.hunger + amount);
	const restored = state.hunger - before;
	return { text: `You eat and restore ${restored} hunger.`, type: 'healing' };
}

export function restoreThirst(state: GameState, amount: number): GameMessage {
	if (!state.survivalEnabled) return { text: '', type: 'info' };
	const before = state.thirst;
	state.thirst = Math.min(MAX_SURVIVAL, state.thirst + amount);
	const restored = state.thirst - before;
	return { text: `You drink and restore ${restored} thirst.`, type: 'healing' };
}
