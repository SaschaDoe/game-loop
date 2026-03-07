import type { GameState, GameMessage } from './types';

const NEARBY_RADIUS = 5;
const SHORT_REST_HEAL_PERCENT = 0.25;
const LONG_REST_AMBUSH_CHANCE = 0.3;

export interface RestResult {
	rested: boolean;
	hpRestored: number;
	messages: GameMessage[];
	ambush: boolean;
}

export function enemiesNearby(state: GameState): boolean {
	const px = state.player.pos.x;
	const py = state.player.pos.y;
	return state.enemies.some(
		(e) => Math.abs(e.pos.x - px) + Math.abs(e.pos.y - py) <= NEARBY_RADIUS
	);
}

export function shortRest(state: GameState): RestResult {
	if (enemiesNearby(state)) {
		return {
			rested: false,
			hpRestored: 0,
			messages: [{ text: 'You can\'t rest with enemies nearby!', type: 'damage_taken' }],
			ambush: false
		};
	}

	if (state.player.hp >= state.player.maxHp) {
		return {
			rested: false,
			hpRestored: 0,
			messages: [{ text: 'You are already at full health.', type: 'info' }],
			ambush: false
		};
	}

	const heal = Math.max(1, Math.floor(state.player.maxHp * SHORT_REST_HEAL_PERCENT));
	const actual = Math.min(heal, state.player.maxHp - state.player.hp);

	return {
		rested: true,
		hpRestored: actual,
		messages: [{ text: `You take a short rest and recover ${actual} HP.`, type: 'healing' }],
		ambush: false
	};
}

export function longRest(state: GameState): RestResult {
	if (enemiesNearby(state)) {
		return {
			rested: false,
			hpRestored: 0,
			messages: [{ text: 'You can\'t rest with enemies nearby!', type: 'damage_taken' }],
			ambush: false
		};
	}

	if (state.player.hp >= state.player.maxHp) {
		return {
			rested: false,
			hpRestored: 0,
			messages: [{ text: 'You are already at full health.', type: 'info' }],
			ambush: false
		};
	}

	const actual = state.player.maxHp - state.player.hp;
	const ambush = Math.random() < LONG_REST_AMBUSH_CHANCE;
	const messages: GameMessage[] = [];

	if (ambush) {
		messages.push({ text: `You set up camp and rest, recovering ${actual} HP.`, type: 'healing' });
		messages.push({ text: 'You are ambushed while sleeping!', type: 'damage_taken' });
	} else {
		messages.push({ text: `You set up camp and rest fully, recovering ${actual} HP.`, type: 'healing' });
	}

	return {
		rested: true,
		hpRestored: actual,
		messages,
		ambush
	};
}
