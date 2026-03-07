import type { GameState, Entity, Position, CharacterClass, MessageType } from './types';
import { Visibility } from './types';
import { applyEffect } from './status-effects';

export interface AbilityDef {
	name: string;
	description: string;
	cooldown: number;
	key: string;
}

export const ABILITY_DEFS: Record<CharacterClass, AbilityDef> = {
	warrior: {
		name: 'Whirlwind',
		description: 'Hit all adjacent enemies',
		cooldown: 8,
		key: 'q'
	},
	mage: {
		name: 'Teleport',
		description: 'Blink to a random visible floor tile',
		cooldown: 12,
		key: 'q'
	},
	rogue: {
		name: 'Smoke Bomb',
		description: 'Stun all nearby enemies for 2 turns',
		cooldown: 10,
		key: 'q'
	}
};

export interface AbilityResult {
	messages: { text: string; type: MessageType }[];
	teleportPos?: Position;
	used: boolean;
}

function getAdjacentEnemies(state: GameState): Entity[] {
	const { x, y } = state.player.pos;
	return state.enemies.filter(
		(e) => Math.abs(e.pos.x - x) <= 1 && Math.abs(e.pos.y - y) <= 1
	);
}

function warriorWhirlwind(state: GameState): AbilityResult {
	const adjacent = getAdjacentEnemies(state);
	if (adjacent.length === 0) {
		return { messages: [{ text: 'No enemies nearby to hit!', type: 'info' }], used: false };
	}

	const messages: AbilityResult['messages'] = [];
	const killed: Entity[] = [];

	for (const enemy of adjacent) {
		const dmg = Math.max(1, state.player.attack);
		enemy.hp -= dmg;
		messages.push({ text: `Whirlwind hits ${enemy.name} for ${dmg}!`, type: 'player_attack' });
		if (enemy.hp <= 0) {
			killed.push(enemy);
		}
	}

	if (killed.length > 0) {
		messages.push({ text: `Whirlwind slays ${killed.length} ${killed.length === 1 ? 'enemy' : 'enemies'}!`, type: 'level_up' });
	}

	return { messages, used: true };
}

function mageTeleport(state: GameState): AbilityResult {
	const RANGE = 5;
	const { x: px, y: py } = state.player.pos;
	const candidates: Position[] = [];

	for (let y = Math.max(0, py - RANGE); y <= Math.min(state.map.height - 1, py + RANGE); y++) {
		for (let x = Math.max(0, px - RANGE); x <= Math.min(state.map.width - 1, px + RANGE); x++) {
			if (x === px && y === py) continue;
			const dist = Math.abs(x - px) + Math.abs(y - py);
			if (dist > RANGE) continue;
			if (state.map.tiles[y][x] !== '.') continue;
			if (state.visibility[y][x] !== Visibility.Visible) continue;
			if (state.enemies.some((e) => e.pos.x === x && e.pos.y === y)) continue;
			candidates.push({ x, y });
		}
	}

	if (candidates.length === 0) {
		return { messages: [{ text: 'No valid teleport destination!', type: 'info' }], used: false };
	}

	const dest = candidates[Math.floor(Math.random() * candidates.length)];
	return {
		messages: [{ text: `You teleport to (${dest.x}, ${dest.y})!`, type: 'discovery' }],
		teleportPos: dest,
		used: true
	};
}

function rogueSmokeBomb(state: GameState): AbilityResult {
	const RADIUS = 3;
	const { x: px, y: py } = state.player.pos;
	const nearby = state.enemies.filter(
		(e) => Math.abs(e.pos.x - px) <= RADIUS && Math.abs(e.pos.y - py) <= RADIUS
	);

	if (nearby.length === 0) {
		return { messages: [{ text: 'No enemies nearby to stun!', type: 'info' }], used: false };
	}

	for (const enemy of nearby) {
		applyEffect(enemy, 'stun', 2, 0);
	}

	return {
		messages: [{ text: `Smoke Bomb stuns ${nearby.length} ${nearby.length === 1 ? 'enemy' : 'enemies'}!`, type: 'player_attack' }],
		used: true
	};
}

export function useAbility(state: GameState): AbilityResult {
	if (state.abilityCooldown > 0) {
		const def = ABILITY_DEFS[state.characterConfig.characterClass];
		return {
			messages: [{ text: `${def.name} on cooldown (${state.abilityCooldown} turns)`, type: 'info' }],
			used: false
		};
	}

	switch (state.characterConfig.characterClass) {
		case 'warrior':
			return warriorWhirlwind(state);
		case 'mage':
			return mageTeleport(state);
		case 'rogue':
			return rogueSmokeBomb(state);
	}
}

export function tickAbilityCooldown(state: GameState): void {
	if (state.abilityCooldown > 0) {
		state.abilityCooldown--;
	}
}
