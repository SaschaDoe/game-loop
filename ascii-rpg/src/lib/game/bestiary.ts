import type { BestiaryEntry, Entity } from './types';
import { MONSTER_DEFS, BOSS_DEFS, isRare, getRareBaseName } from './monsters';

export function createBestiaryEntry(): BestiaryEntry {
	return { timesSeen: 0, timesKilled: 0, rareEncountered: false, rareKilled: false };
}

function resolveBaseName(enemy: Entity): string {
	return getRareBaseName(enemy.name) ?? enemy.name;
}

export function recordSeen(bestiary: Record<string, BestiaryEntry>, enemy: Entity): void {
	const name = resolveBaseName(enemy);
	if (!bestiary[name]) bestiary[name] = createBestiaryEntry();
	bestiary[name].timesSeen++;
	if (isRare(enemy)) bestiary[name].rareEncountered = true;
}

export function recordKill(bestiary: Record<string, BestiaryEntry>, enemy: Entity): void {
	const name = resolveBaseName(enemy);
	if (!bestiary[name]) bestiary[name] = createBestiaryEntry();
	bestiary[name].timesKilled++;
	if (isRare(enemy)) bestiary[name].rareKilled = true;
}

export function getBestiaryEntry(bestiary: Record<string, BestiaryEntry>, name: string): BestiaryEntry | undefined {
	return bestiary[name];
}

export function getDiscoveredCount(bestiary: Record<string, BestiaryEntry>): number {
	return Object.keys(bestiary).length;
}

export function getTotalMonsterTypes(): number {
	return MONSTER_DEFS.length + BOSS_DEFS.length;
}

export function getCompletionPercent(bestiary: Record<string, BestiaryEntry>): number {
	const total = getTotalMonsterTypes();
	if (total === 0) return 100;
	return Math.floor((getDiscoveredCount(bestiary) / total) * 100);
}

export function getRareDiscoveredCount(bestiary: Record<string, BestiaryEntry>): number {
	return Object.values(bestiary).filter((e) => e.rareEncountered).length;
}
