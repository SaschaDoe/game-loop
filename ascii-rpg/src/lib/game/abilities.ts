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
	},
	ranger: {
		name: 'Rain of Arrows',
		description: 'Hit all enemies in a 3x3 area',
		cooldown: 10,
		key: 'q'
	},
	cleric: {
		name: 'Divine Shield',
		description: 'Gain regeneration for 5 turns',
		cooldown: 12,
		key: 'q'
	},
	paladin: {
		name: 'Holy Smite',
		description: 'Deal massive holy damage to adjacent undead, normal to others',
		cooldown: 10,
		key: 'q'
	},
	necromancer: {
		name: 'Drain Life',
		description: 'Steal HP from the nearest enemy',
		cooldown: 8,
		key: 'q'
	},
	bard: {
		name: 'Inspiring Song',
		description: 'Boost your ATK by 3 for 5 turns',
		cooldown: 12,
		key: 'q'
	},
	adept: {
		name: 'Mana Surge',
		description: 'Channel raw mana to restore 5 mana instantly',
		cooldown: 10,
		key: 'q'
	},
	primordial: {
		name: 'Ley Surge',
		description: 'Burst of raw Ley energy damaging all adjacent enemies',
		cooldown: 8,
		key: 'q'
	},
	runesmith: {
		name: 'Rune Ward',
		description: 'Inscribe a protective rune — blocks enemy movement for 3 turns',
		cooldown: 10,
		key: 'q'
	},
	spellblade: {
		name: 'Arcane Strike',
		description: 'Melee attack dealing bonus spell-power damage',
		cooldown: 6,
		key: 'q'
	},
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

function rangerRainOfArrows(state: GameState): AbilityResult {
	const RADIUS = 3;
	const { x: px, y: py } = state.player.pos;
	const inArea = state.enemies.filter(
		(e) => Math.abs(e.pos.x - px) <= RADIUS && Math.abs(e.pos.y - py) <= RADIUS
	);

	if (inArea.length === 0) {
		return { messages: [{ text: 'No enemies in range!', type: 'info' }], used: false };
	}

	const messages: AbilityResult['messages'] = [];
	const killed: Entity[] = [];
	for (const enemy of inArea) {
		const dmg = Math.max(1, Math.floor(state.player.attack * 0.8));
		enemy.hp -= dmg;
		messages.push({ text: `Arrow strikes ${enemy.name} for ${dmg}!`, type: 'player_attack' });
		if (enemy.hp <= 0) killed.push(enemy);
	}
	if (killed.length > 0) {
		messages.push({ text: `Rain of Arrows slays ${killed.length} ${killed.length === 1 ? 'enemy' : 'enemies'}!`, type: 'level_up' });
	}
	return { messages, used: true };
}

function clericDivineShield(state: GameState): AbilityResult {
	applyEffect(state.player, 'regeneration', 5, 2);
	return {
		messages: [{ text: 'Divine light surrounds you! Regeneration for 5 turns.', type: 'healing' }],
		used: true
	};
}

function paladinHolySmite(state: GameState): AbilityResult {
	const adjacent = getAdjacentEnemies(state);
	if (adjacent.length === 0) {
		return { messages: [{ text: 'No enemies nearby to smite!', type: 'info' }], used: false };
	}

	const messages: AbilityResult['messages'] = [];
	const killed: Entity[] = [];
	const UNDEAD = ['Skeleton', 'Zombie', 'Wraith', 'The Hollow King'];

	for (const enemy of adjacent) {
		const isUndead = UNDEAD.some(u => enemy.name.includes(u));
		const dmg = isUndead ? state.player.attack * 3 : Math.max(1, state.player.attack);
		enemy.hp -= dmg;
		messages.push({ text: `Holy Smite ${isUndead ? 'sears' : 'strikes'} ${enemy.name} for ${dmg}!`, type: 'player_attack' });
		if (enemy.hp <= 0) killed.push(enemy);
	}
	if (killed.length > 0) {
		messages.push({ text: `Holy Smite destroys ${killed.length} ${killed.length === 1 ? 'enemy' : 'enemies'}!`, type: 'level_up' });
	}
	return { messages, used: true };
}

function necromancerDrainLife(state: GameState): AbilityResult {
	if (state.enemies.length === 0) {
		return { messages: [{ text: 'No enemies to drain!', type: 'info' }], used: false };
	}

	// Find nearest enemy
	const { x: px, y: py } = state.player.pos;
	let nearest = state.enemies[0];
	let bestDist = Infinity;
	for (const e of state.enemies) {
		const dist = Math.abs(e.pos.x - px) + Math.abs(e.pos.y - py);
		if (dist < bestDist) { bestDist = dist; nearest = e; }
	}

	if (bestDist > 5) {
		return { messages: [{ text: 'No enemies close enough to drain!', type: 'info' }], used: false };
	}

	const dmg = Math.max(2, state.player.attack + 2);
	nearest.hp -= dmg;
	const healed = Math.min(dmg, state.player.maxHp - state.player.hp);
	state.player.hp += healed;

	const messages: AbilityResult['messages'] = [
		{ text: `Drain Life siphons ${dmg} HP from ${nearest.name}!`, type: 'player_attack' },
	];
	if (healed > 0) {
		messages.push({ text: `You recover ${healed} HP!`, type: 'healing' });
	}
	return { messages, used: true };
}

function bardInspiringSong(state: GameState): AbilityResult {
	// Temporary ATK boost tracked as 'inspire' status effect; reverted when it expires
	applyEffect(state.player, 'inspire', 5, 3);
	state.player.attack += 3;
	applyEffect(state.player, 'regeneration', 5, 1);
	return {
		messages: [
			{ text: 'You play an inspiring melody!', type: 'discovery' },
			{ text: '+3 ATK for 5 turns! Regeneration for 5 turns.', type: 'level_up' },
		],
		used: true
	};
}

function adeptManaSurge(state: GameState): AbilityResult {
	const restored = Math.min(5, (state.player.maxMana ?? 0) - (state.player.mana ?? 0));
	state.player.mana = (state.player.mana ?? 0) + restored;
	return {
		messages: [{ text: `You channel raw mana, restoring ${restored} mana!`, type: 'magic' }],
		used: true
	};
}

function primordialLeySurge(state: GameState): AbilityResult {
	const adjacent = getAdjacentEnemies(state);
	if (adjacent.length === 0) {
		return { messages: [{ text: 'No enemies nearby to hit!', type: 'info' }], used: false };
	}

	const messages: AbilityResult['messages'] = [];
	const killed: Entity[] = [];
	const spellPower = state.player.spellPower ?? 0;

	for (const enemy of adjacent) {
		const dmg = Math.max(1, state.player.attack + Math.floor(spellPower * 0.5));
		enemy.hp -= dmg;
		messages.push({ text: `Ley Surge blasts ${enemy.name} for ${dmg}!`, type: 'player_attack' });
		if (enemy.hp <= 0) {
			killed.push(enemy);
		}
	}

	if (killed.length > 0) {
		messages.push({ text: `Ley Surge destroys ${killed.length} ${killed.length === 1 ? 'enemy' : 'enemies'}!`, type: 'level_up' });
	}

	return { messages, used: true };
}

function runesmithRuneWard(state: GameState): AbilityResult {
	const { x, y } = state.player.pos;
	state.activeWards.push({
		center: { x, y },
		radius: 1,
		damage: 2,
		turnsRemaining: 3,
	});
	return {
		messages: [{ text: 'You inscribe a Rune Ward! Enemies nearby will be slowed for 3 turns.', type: 'magic' }],
		used: true
	};
}

function spellbladeArcaneStrike(state: GameState): AbilityResult {
	const adjacent = getAdjacentEnemies(state);
	if (adjacent.length === 0) {
		return { messages: [{ text: 'No enemies nearby to strike!', type: 'info' }], used: false };
	}

	const messages: AbilityResult['messages'] = [];
	const killed: Entity[] = [];
	const spellPower = state.player.spellPower ?? 0;
	const target = adjacent[0]; // strike the first adjacent enemy
	const dmg = Math.max(1, state.player.attack + spellPower);
	target.hp -= dmg;
	messages.push({ text: `Arcane Strike hits ${target.name} for ${dmg}!`, type: 'player_attack' });
	if (target.hp <= 0) {
		killed.push(target);
	}

	if (killed.length > 0) {
		messages.push({ text: `Arcane Strike slays ${target.name}!`, type: 'level_up' });
	}

	return { messages, used: true };
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
		case 'ranger':
			return rangerRainOfArrows(state);
		case 'cleric':
			return clericDivineShield(state);
		case 'paladin':
			return paladinHolySmite(state);
		case 'necromancer':
			return necromancerDrainLife(state);
		case 'bard':
			return bardInspiringSong(state);
		case 'adept':
			return adeptManaSurge(state);
		case 'primordial':
			return primordialLeySurge(state);
		case 'runesmith':
			return runesmithRuneWard(state);
		case 'spellblade':
			return spellbladeArcaneStrike(state);
	}
}

export function tickAbilityCooldown(state: GameState): void {
	if (state.abilityCooldown > 0) {
		state.abilityCooldown--;
	}
}
