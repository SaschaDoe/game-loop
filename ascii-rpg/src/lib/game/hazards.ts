import type { GameState, Entity, Hazard, HazardType, GameMap, Position, MessageType } from './types';
import { applyEffect } from './status-effects';
import type { SeededRandom } from './seeded-random';

interface HazardDef {
	type: HazardType;
	name: string;
	char: string;
	color: string;
	weight: number;
	minLevel: number;
}

export const HAZARD_DEFS: HazardDef[] = [
	{ type: 'lava', name: 'Lava Pool', char: '~', color: '#ff4400', weight: 3, minLevel: 3 },
	{ type: 'poison_gas', name: 'Poison Gas', char: '%', color: '#44ff44', weight: 2, minLevel: 2 }
];

const HAZARD_BY_TYPE = new Map(HAZARD_DEFS.map((d) => [d.type, d]));

export function hazardName(type: HazardType): string {
	return HAZARD_BY_TYPE.get(type)?.name ?? type;
}

export function hazardChar(type: HazardType): string {
	return HAZARD_BY_TYPE.get(type)?.char ?? '?';
}

export function hazardColor(type: HazardType): string {
	return HAZARD_BY_TYPE.get(type)?.color ?? '#ffffff';
}

export function placeHazards(map: GameMap, level: number, rng?: SeededRandom): Hazard[] {
	const available = HAZARD_DEFS.filter((d) => level >= d.minLevel);
	if (available.length === 0) return [];

	const count = Math.floor(level * 0.3) + 1;
	const totalWeight = available.reduce((sum, d) => sum + d.weight, 0);
	const hazards: Hazard[] = [];
	let attempts = 0;

	while (hazards.length < count && attempts < 200) {
		attempts++;
		const rand = rng ? rng.next() : Math.random();
		const rand2 = rng ? rng.next() : Math.random();
		const x = Math.floor(rand * map.width);
		const y = Math.floor(rand2 * map.height);
		if (map.tiles[y][x] !== '.') continue;
		const key = `${x},${y}`;
		if (hazards.some((h) => `${h.pos.x},${h.pos.y}` === key)) continue;

		const rand3 = rng ? rng.next() : Math.random();
		let roll = Math.floor(rand3 * totalWeight);
		let type: HazardType = available[0].type;
		for (const def of available) {
			roll -= def.weight;
			if (roll < 0) { type = def.type; break; }
		}
		hazards.push({ pos: { x, y }, type });
	}

	return hazards;
}

export function getHazardAt(hazards: Hazard[], x: number, y: number): Hazard | undefined {
	return hazards.find((h) => h.pos.x === x && h.pos.y === y);
}

export interface HazardEffect {
	text: string;
	type: MessageType;
}

export function applyHazardToEntity(hazard: Hazard, entity: Entity, level: number): HazardEffect | null {
	switch (hazard.type) {
		case 'lava': {
			const dmg = 2 + level;
			entity.hp -= dmg;
			return { text: `${entity.name} burns in lava for ${dmg} damage!`, type: 'damage_taken' };
		}
		case 'poison_gas': {
			applyEffect(entity, 'poison', 3, 1 + Math.floor(level / 3));
			return { text: `${entity.name} inhales poison gas!`, type: 'damage_taken' };
		}
	}
}

export function applyHazards(state: GameState): HazardEffect[] {
	const effects: HazardEffect[] = [];

	// Player hazard
	const playerHazard = getHazardAt(state.hazards, state.player.pos.x, state.player.pos.y);
	if (playerHazard) {
		const effect = applyHazardToEntity(playerHazard, state.player, state.level);
		if (effect) effects.push(effect);
	}

	// Enemy hazards
	for (const enemy of state.enemies) {
		const hazard = getHazardAt(state.hazards, enemy.pos.x, enemy.pos.y);
		if (hazard) {
			const effect = applyHazardToEntity(hazard, enemy, state.level);
			if (effect) {
				// Override message type — enemy damage is player_attack for the log
				effects.push({ ...effect, type: 'player_attack' });
			}
		}
	}

	return effects;
}
