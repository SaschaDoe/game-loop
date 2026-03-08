import type { GameState, Trap, TrapType, Position, GameMap, CharacterClass } from './types';
import { applyEffect } from './status-effects';
import type { SeededRandom } from './seeded-random';

interface TrapDef {
	type: TrapType;
	name: string;
	weight: number;
}

const TRAP_DEFS: TrapDef[] = [
	{ type: 'spike', name: 'Spike Trap', weight: 4 },
	{ type: 'poison_dart', name: 'Poison Dart Trap', weight: 3 },
	{ type: 'alarm', name: 'Alarm Trap', weight: 2 },
	{ type: 'teleport', name: 'Teleport Trap', weight: 1 }
];

const totalWeight = TRAP_DEFS.reduce((sum, d) => sum + d.weight, 0);

export function pickTrapType(rng?: SeededRandom): TrapType {
	const rand = rng ? rng.next() : Math.random();
	let roll = Math.floor(rand * totalWeight);
	for (const def of TRAP_DEFS) {
		roll -= def.weight;
		if (roll < 0) return def.type;
	}
	return 'spike';
}

export function trapName(type: TrapType): string {
	return TRAP_DEFS.find((d) => d.type === type)?.name ?? type;
}

export function createTrap(pos: Position, type: TrapType): Trap {
	return { pos, type, triggered: false };
}

export function placeTraps(map: GameMap, level: number, rng?: SeededRandom): Trap[] {
	const count = 1 + Math.floor(level * 0.5);
	const traps: Trap[] = [];
	let attempts = 0;
	while (traps.length < count && attempts < 200) {
		attempts++;
		const rand = rng ? rng.next() : Math.random();
		const rand2 = rng ? rng.next() : Math.random();
		const x = Math.floor(rand * map.width);
		const y = Math.floor(rand2 * map.height);
		if (map.tiles[y][x] !== '.') continue;
		const key = `${x},${y}`;
		if (traps.some((t) => `${t.pos.x},${t.pos.y}` === key)) continue;
		traps.push(createTrap({ x, y }, pickTrapType(rng)));
	}
	return traps;
}

export function getTrapAt(state: GameState, x: number, y: number): Trap | undefined {
	return state.traps.find((t) => t.pos.x === x && t.pos.y === y && !t.triggered);
}

export function detectAdjacentTraps(state: GameState): string[] {
	const messages: string[] = [];
	const { x, y } = state.player.pos;
	const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]];
	for (const [dx, dy] of dirs) {
		const nx = x + dx;
		const ny = y + dy;
		const key = `${nx},${ny}`;
		if (state.detectedTraps.has(key)) continue;
		const trap = getTrapAt(state, nx, ny);
		if (trap) {
			state.detectedTraps.add(key);
			messages.push(`You spot a ${trapName(trap.type)} nearby!`);
		}
	}
	return messages;
}

export interface TriggerResult {
	messages: string[];
	teleportPos?: Position;
}

export function triggerTrap(state: GameState, trap: Trap): TriggerResult {
	trap.triggered = true;
	const messages: string[] = [];
	const name = trapName(trap.type);

	switch (trap.type) {
		case 'spike': {
			const dmg = 3 + state.level;
			state.player.hp -= dmg;
			messages.push(`You step on a ${name}! ${dmg} damage!`);
			break;
		}
		case 'poison_dart': {
			const dmg = 1 + Math.floor(state.level / 2);
			state.player.hp -= dmg;
			applyEffect(state.player, 'poison', 3, 1 + Math.floor(state.level / 3));
			messages.push(`A ${name} fires! ${dmg} damage and poisoned!`);
			break;
		}
		case 'alarm': {
			messages.push(`You trigger an ${name}! Enemies are alerted!`);
			// Move all enemies closer to player
			for (const enemy of state.enemies) {
				const edx = Math.sign(state.player.pos.x - enemy.pos.x);
				const edy = Math.sign(state.player.pos.y - enemy.pos.y);
				const enx = enemy.pos.x + edx;
				const eny = enemy.pos.y + edy;
				if (
					enx >= 0 && eny >= 0 && enx < state.map.width && eny < state.map.height &&
					state.map.tiles[eny][enx] !== '#' &&
					!(enx === state.player.pos.x && eny === state.player.pos.y) &&
					!state.enemies.some((e) => e !== enemy && e.pos.x === enx && e.pos.y === eny)
				) {
					enemy.pos = { x: enx, y: eny };
				}
			}
			break;
		}
		case 'teleport': {
			// Find a random floor tile
			let tx: number, ty: number;
			let teleAttempts = 0;
			do {
				tx = Math.floor(Math.random() * state.map.width);
				ty = Math.floor(Math.random() * state.map.height);
				teleAttempts++;
			} while (
				(state.map.tiles[ty][tx] !== '.' || (tx === state.player.pos.x && ty === state.player.pos.y)) &&
				teleAttempts < 200
			);
			if (teleAttempts < 200) {
				messages.push(`A ${name} activates! You are teleported!`);
				return { messages, teleportPos: { x: tx, y: ty } };
			}
			messages.push(`A ${name} fizzles...`);
			break;
		}
	}

	return { messages };
}

export const DISARM_CHANCE: Record<CharacterClass, number> = {
	rogue: 0.80,
	warrior: 0.50,
	mage: 0.40
};

export interface DisarmResult {
	success: boolean;
	messages: string[];
	triggerResult?: TriggerResult;
}

export function disarmTrap(state: GameState, trap: Trap, characterClass: CharacterClass): DisarmResult {
	const chance = DISARM_CHANCE[characterClass];
	const name = trapName(trap.type);

	if (Math.random() < chance) {
		trap.triggered = true;
		return {
			success: true,
			messages: [`You carefully disarm the ${name}.`]
		};
	}

	const triggerResult = triggerTrap(state, trap);
	return {
		success: false,
		messages: [`You fail to disarm the ${name}!`, ...triggerResult.messages],
		triggerResult
	};
}

const SEARCH_RADIUS = 2;

export function searchForTraps(state: GameState): string[] {
	const messages: string[] = [];
	const { x, y } = state.player.pos;
	for (let dy = -SEARCH_RADIUS; dy <= SEARCH_RADIUS; dy++) {
		for (let dx = -SEARCH_RADIUS; dx <= SEARCH_RADIUS; dx++) {
			if (dx === 0 && dy === 0) continue;
			const nx = x + dx;
			const ny = y + dy;
			const key = `${nx},${ny}`;
			if (state.detectedTraps.has(key)) continue;
			const trap = getTrapAt(state, nx, ny);
			if (trap) {
				state.detectedTraps.add(key);
				messages.push(`You discover a ${trapName(trap.type)} nearby!`);
			}
		}
	}
	return messages;
}
