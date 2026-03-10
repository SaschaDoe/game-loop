import type { GameState, Entity, Position, MessageType, NPC } from './types';
import { tickEffects } from './status-effects';
import { getSkillBonuses } from './skills';
import { checkAchievements, getAchievement } from './achievements';
import { getMonsterTier, isBoss } from './monsters';
import { rollLootDrop } from './loot';
import { isPermadeath } from './difficulty';
import { sightModifier, getTimePhase } from './day-night';
import { getEquipmentBonuses } from './items';
import { getAvailableSpecializations } from './mastery';
import type { SchoolMastery } from './mastery';
import type { WorldMap } from './overworld';

const MOOD_RECOVERY_TURNS = 20;

export function addMessage(state: GameState, msg: string, type: MessageType = 'info') {
	state.messages = [...state.messages.slice(-49), { text: msg, type }];
}

export function handlePlayerDeath(state: GameState): void {
	state.gameOver = true;
	if (isPermadeath(state.characterConfig.difficulty)) {
		addMessage(state, 'You have been slain! Your journey ends here forever.', 'death');
	} else {
		addMessage(state, 'You have been slain! Press R to restart.', 'death');
	}
}

export function isBlocked(state: GameState, x: number, y: number): boolean {
	if (x < 0 || y < 0 || x >= state.map.width || y >= state.map.height) return true;
	if (state.map.tiles[y][x] !== '#') return false;
	// Detected secret walls can be walked through
	const key = `${x},${y}`;
	if (state.map.secretWalls.has(key) && state.detectedSecrets.has(key)) return false;
	return true;
}

export function detectAdjacentSecrets(state: GameState): void {
	const { x, y } = state.player.pos;
	const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]];
	for (const [dx, dy] of dirs) {
		const nx = x + dx;
		const ny = y + dy;
		const key = `${nx},${ny}`;
		if (state.map.secretWalls.has(key) && !state.detectedSecrets.has(key)) {
			state.detectedSecrets.add(key);
			state.stats.secretsFound++;
			addMessage(state, 'You notice a hidden passage in the wall!', 'discovery');
		}
	}
}

export function tryDropLoot(state: GameState, enemy: Entity): void {
	const tier = getMonsterTier(enemy);
	const boss = isBoss(enemy);
	const drop = rollLootDrop(enemy.pos, state.level, tier, boss, enemy.name);
	if (drop) {
		state.lootDrops.push(drop);
	}
}

export function tickEntityEffects(state: GameState, entity: Entity): void {
	const result = tickEffects(entity);
	for (const msg of result.messages) {
		const type = entity === state.player ? 'damage_taken' : 'player_attack';
		addMessage(state, msg, type);
	}
	if (entity === state.player && entity.hp <= 0) {
		handlePlayerDeath(state);
	}
}

export function processAchievements(state: GameState): void {
	const newly = checkAchievements(state.stats, state.unlockedAchievements);
	for (const id of newly) {
		state.unlockedAchievements.push(id);
		const def = getAchievement(id);
		if (def) {
			addMessage(state, `Achievement unlocked: ${def.name}!`, 'discovery');
		}
	}
}

export function xpForLevel(level: number): number {
	// Fast early levels, steep late-game: crossover with old curve around level 11
	return Math.floor(25 * Math.pow(1.5, level - 1));
}

export function xpReward(enemy: Entity, dungeonLevel: number): number {
	return 5 + dungeonLevel * 2 + enemy.maxHp;
}

export function applyXpMultiplier(baseXp: number, state: GameState): number {
	const bonuses = getSkillBonuses(state.unlockedSkills);
	const multiplier = 1 + (bonuses.xpMultiplier ?? 0);
	return Math.floor(baseXp * multiplier);
}

export function effectiveSightRadius(state: GameState): number {
	const bonuses = getSkillBonuses(state.unlockedSkills);
	const timeModifier = sightModifier(getTimePhase(state.turnCount));
	const equipBonuses = getEquipmentBonuses(state.equipment);
	return Math.max(2, state.sightRadius + (bonuses.sightRadius ?? 0) + timeModifier + (equipBonuses.sight ?? 0));
}

export function checkLevelUp(state: GameState): void {
	let threshold = xpForLevel(state.characterLevel + 1);
	while (state.xp >= threshold && state.characterLevel < 50) {
		state.xp -= threshold;
		state.characterLevel++;

		// Only reward: +1 talent point (no stat changes)
		state.skillPoints++;

		addMessage(state, `Level up! Level ${state.characterLevel}. +1 Talent Point.`, 'level_up');

		// Offer specialization at level 10 if none chosen
		if (state.characterLevel >= 10 && state.specialization === null && !state.pendingSpecialization) {
			const specs = getAvailableSpecializations(state.characterLevel, state.schoolMastery as unknown as SchoolMastery, state.specialization);
			if (specs.length > 0) {
				state.pendingSpecialization = true;
				addMessage(state, 'You may choose a specialization! Press 1-' + specs.length + ' to choose, Escape to skip.', 'level_up');
			}
		}

		threshold = xpForLevel(state.characterLevel + 1);
	}
}

export function relocateNpc(state: GameState, npc: NPC) {
	const floors: Position[] = [];
	for (let y = 1; y < state.map.height - 1; y++) {
		for (let x = 1; x < state.map.width - 1; x++) {
			if (state.map.tiles[y][x] !== '.') continue;
			if (x === state.player.pos.x && y === state.player.pos.y) continue;
			if (state.enemies.some(e => e.pos.x === x && e.pos.y === y)) continue;
			if (state.npcs.some(n => n !== npc && n.pos.x === x && n.pos.y === y)) continue;
			const dist = Math.abs(x - state.player.pos.x) + Math.abs(y - state.player.pos.y);
			if (dist >= 6) floors.push({ x, y });
		}
	}
	if (floors.length > 0) {
		npc.pos = floors[Math.floor(Math.random() * floors.length)];
	}
}

export function tickNpcMoods(state: GameState) {
	for (const npc of state.npcs) {
		if (npc.mood !== 'neutral' && npc.mood !== 'friendly') {
			npc.moodTurns++;
			// Afraid NPCs try to flee from the player every 5 turns
			if (npc.mood === 'afraid' && npc.moodTurns % 5 === 0) {
				const dist = Math.abs(npc.pos.x - state.player.pos.x) + Math.abs(npc.pos.y - state.player.pos.y);
				if (dist <= 4) {
					relocateNpc(state, npc);
				}
			}
			if (npc.moodTurns >= MOOD_RECOVERY_TURNS) {
				npc.mood = 'neutral';
				npc.moodTurns = 0;
				addMessage(state, `${npc.name} seems to have calmed down.`, 'npc');
			}
		}
	}
}

export function revealOverworldArea(worldMap: WorldMap, pos: Position, radius: number): void {
	for (let dy = -radius; dy <= radius; dy++) {
		for (let dx = -radius; dx <= radius; dx++) {
			if (dx * dx + dy * dy > radius * radius) continue;
			const wx = pos.x + dx;
			const wy = pos.y + dy;
			if (wx >= 0 && wy >= 0 && wx < worldMap.width && wy < worldMap.height) {
				worldMap.explored[wy][wx] = true;
			}
		}
	}
}

// tickTerrainEffects, checkRitualInterrupt, and learnRitual have moved to ./spell-handler.ts
