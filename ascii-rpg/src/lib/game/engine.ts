import type { GameState, Entity, Position, MessageType, CharacterClass, CharacterConfig, Difficulty, ActiveDialogue, NPC } from './types';
import { Visibility } from './types';
import { generateMap, getSpawnPositions } from './map';
import { createVisibilityGrid, updateVisibility } from './fov';
import { applyEffect, hasEffect, tickEffects, effectColor } from './status-effects';
import { createMonster, createRareMonster, pickMonsterDef, pickBossDef, isBossLevel, isBoss, isRare, getMonsterTier, RARE_SPAWN_CHANCE, decideMoveDirection, getMonsterBehavior, getMonsterOnHitEffect } from './monsters';
import { placeTraps, getTrapAt, detectAdjacentTraps, triggerTrap, disarmTrap, searchForTraps } from './traps';
import { useAbility, tickAbilityCooldown, ABILITY_DEFS } from './abilities';
import { placeHazards, applyHazards, getHazardAt, applyHazardToEntity, hazardChar, hazardColor } from './hazards';
import { applyDifficultyToEnemy, difficultySpawnCount, isPermadeath } from './difficulty';
import { placeChests, getChestAt, openChest, chestChar, chestColor } from './chests';
import { generateStartingLocation } from './locations';
import { NPC_DIALOGUE_TREES } from './dialogue';
import { rollLootDrop, getLootAt, pickupLoot, lootChar, lootColor } from './loot';
import { getSkillBonuses } from './skills';
import { placeLandmarks, getLandmarkAt, getLandmarkDef, getAdjacentLandmarks, examineLandmark, landmarkChar, landmarkColor } from './landmarks';

const MAP_W = 50;
const MAP_H = 24;

export function xpForLevel(level: number): number {
	return Math.floor(50 * Math.pow(1.4, level - 1));
}

export function xpReward(enemy: Entity, dungeonLevel: number): number {
	return 5 + dungeonLevel * 2 + enemy.maxHp;
}

function applyXpMultiplier(baseXp: number, state: GameState): number {
	const bonuses = getSkillBonuses(state.unlockedSkills);
	const multiplier = 1 + (bonuses.xpMultiplier ?? 0);
	return Math.floor(baseXp * multiplier);
}

export function effectiveSightRadius(state: GameState): number {
	const bonuses = getSkillBonuses(state.unlockedSkills);
	return state.sightRadius + (bonuses.sightRadius ?? 0);
}

function checkLevelUp(state: GameState): void {
	let threshold = xpForLevel(state.characterLevel + 1);
	while (state.xp >= threshold && state.characterLevel < 50) {
		state.xp -= threshold;
		state.characterLevel++;
		const hpGain = 3 + state.characterLevel;
		const atkGain = state.characterLevel % 2 === 0 ? 1 : 0;
		state.player.maxHp += hpGain;
		state.player.hp += hpGain;
		state.player.attack += atkGain;
		state.skillPoints++;
		addMessage(state, `Level up! You are now level ${state.characterLevel}. +${hpGain} HP${atkGain ? `, +${atkGain} ATK` : ''}, +1 Skill Point.`, 'level_up');
		threshold = xpForLevel(state.characterLevel + 1);
	}
}

function createEnemy(pos: Position, level: number, difficulty: Difficulty): Entity {
	const def = pickMonsterDef(level);
	let enemy: Entity;
	if (Math.random() < RARE_SPAWN_CHANCE) {
		enemy = createRareMonster(pos, level, def);
	} else {
		enemy = createMonster(pos, level, def);
	}
	applyDifficultyToEnemy(enemy, difficulty);
	if (def.sleepChance && Math.random() < def.sleepChance) {
		applyEffect(enemy, 'sleep', 999, 0);
	}
	return enemy;
}

function spawnEnemies(positions: Position[], level: number, difficulty: Difficulty): Entity[] {
	const enemies = positions.map((p) => createEnemy(p, level, difficulty));
	if (isBossLevel(level) && positions.length > 0) {
		const bossDef = pickBossDef(level);
		const boss = createMonster(positions[positions.length - 1], level, bossDef);
		applyDifficultyToEnemy(boss, difficulty);
		enemies[enemies.length - 1] = boss;
	}
	return enemies;
}

export const CLASS_BONUSES: Record<CharacterClass, { hp: number; atk: number; sight: number; description: string }> = {
	warrior: { hp: 4, atk: 1, sight: -1, description: 'A sturdy fighter with high endurance' },
	mage: { hp: -2, atk: -1, sight: 3, description: 'A scholar who sees far into the darkness' },
	rogue: { hp: 0, atk: 1, sight: 1, description: 'A nimble adventurer with keen senses' }
};

const DEFAULT_CONFIG: CharacterConfig = { name: 'Hero', characterClass: 'warrior', difficulty: 'normal', startingLocation: 'cave' };

export function createGame(config?: CharacterConfig): GameState {
	const cfg = config ?? DEFAULT_CONFIG;

	// Level 0: starting location; level 1+: dungeon
	const locResult = generateStartingLocation(cfg.startingLocation, MAP_W, MAP_H);
	const sightRadius = DEFAULT_SIGHT_RADIUS;
	const visibility = createVisibilityGrid(MAP_W, MAP_H);

	const state: GameState = {
		player: {
			pos: locResult.playerPos,
			char: '@',
			color: '#ff0',
			name: cfg.name,
			hp: 12,
			maxHp: 12,
			attack: 3,
			statusEffects: []
		},
		enemies: locResult.enemies,
		npcs: locResult.npcs,
		map: locResult.map,
		messages: [{ text: locResult.welcomeMessage, type: 'info' as const }],
		level: 0,
		gameOver: false,
		xp: 0,
		characterLevel: 1,
		visibility,
		sightRadius,
		detectedSecrets: new Set<string>(),
		traps: [],
		detectedTraps: new Set<string>(),
		characterConfig: cfg,
		abilityCooldown: 0,
		hazards: [],
		chests: [],
		lootDrops: [],
		skillPoints: 0,
		unlockedSkills: [],
		activeDialogue: null,
		rumors: [],
		knownLanguages: [],
		landmarks: []
	};

	// Apply class bonuses
	const bonuses = CLASS_BONUSES[cfg.characterClass];
	state.player.hp += bonuses.hp;
	state.player.maxHp += bonuses.hp;
	state.player.attack += bonuses.atk;
	state.sightRadius += bonuses.sight;

	// Apply starting location HP factor (cave start = 60%)
	if (locResult.initialHpFactor < 1.0) {
		state.player.hp = Math.max(1, Math.floor(state.player.hp * locResult.initialHpFactor));
	}

	updateVisibility(state.visibility, state.map, state.player.pos, effectiveSightRadius(state));
	return state;
}

const DEFAULT_SIGHT_RADIUS = 8;

interface DungeonNPCDef {
	char: string;
	color: string;
	name: string;
	dialogue: string[];
	gives?: { hp?: number; atk?: number };
	minLevel: number;
	weight: number;
}

const DUNGEON_NPCS: DungeonNPCDef[] = [
	{ char: '$', color: '#ff8', name: 'Morrigan', dialogue: ['Welcome to Morrigan\'s Mobile Emporium!', 'We go where the customers are!', 'Even monster-infested death traps!'], gives: { hp: 5 }, minLevel: 2, weight: 3 },
	{ char: 'C', color: '#8bf', name: 'Corwin', dialogue: ['Oh thank the gods, a person!', 'I\'ve been lost for days...', 'My maps are completely useless here.'], minLevel: 3, weight: 2 },
	{ char: 'W', color: '#a8f', name: 'Whispering Shade', dialogue: ['*An ethereal figure flickers in the shadows, murmuring in an alien tongue...*'], minLevel: 5, weight: 2 },
];

const NPC_SPAWN_CHANCE = 0.3;

function spawnDungeonNPCs(map: { width: number; height: number; tiles: string[][] }, level: number, occupied: Set<string>): NPC[] {
	if (Math.random() > NPC_SPAWN_CHANCE) return [];
	const eligible = DUNGEON_NPCS.filter(d => level >= d.minLevel);
	if (eligible.length === 0) return [];
	const totalWeight = eligible.reduce((s, d) => s + d.weight, 0);
	let roll = Math.random() * totalWeight;
	let pick = eligible[0];
	for (const def of eligible) {
		roll -= def.weight;
		if (roll <= 0) { pick = def; break; }
	}
	// Find a floor tile not occupied
	const floors: Position[] = [];
	for (let y = 1; y < map.height - 1; y++) {
		for (let x = 1; x < map.width - 1; x++) {
			if (map.tiles[y][x] === '.' && !occupied.has(`${x},${y}`)) {
				floors.push({ x, y });
			}
		}
	}
	if (floors.length === 0) return [];
	const pos = floors[Math.floor(Math.random() * floors.length)];
	return [{
		pos,
		char: pick.char,
		color: pick.color,
		name: pick.name,
		dialogue: pick.dialogue,
		dialogueIndex: 0,
		gives: pick.gives,
		given: false,
		mood: 'neutral' as const,
	}];
}

function newLevel(level: number, difficulty: Difficulty = 'normal'): GameState {
	const baseEnemyCount = 3 + level;
	const enemyCount = difficultySpawnCount(baseEnemyCount, difficulty);
	const map = generateMap(MAP_W, MAP_H, level);
	const spawns = getSpawnPositions(map, 1 + enemyCount);
	const playerPos = spawns[0];
	const enemyPositions = spawns.slice(1);
	const sightRadius = DEFAULT_SIGHT_RADIUS;
	const visibility = createVisibilityGrid(map.width, map.height);
	updateVisibility(visibility, map, playerPos, sightRadius);

	const traps = placeTraps(map, level);
	// Don't place traps on player spawn
	const filteredTraps = traps.filter((t) => !(t.pos.x === playerPos.x && t.pos.y === playerPos.y));

	const hazards = placeHazards(map, level);
	// Don't place hazards on player spawn
	const filteredHazards = hazards.filter((h) => !(h.pos.x === playerPos.x && h.pos.y === playerPos.y));

	const chests = placeChests(map, level);
	const filteredChests = chests.filter((c) => !(c.pos.x === playerPos.x && c.pos.y === playerPos.y));

	// Build occupied positions set for NPC spawning
	const occupiedPositions = new Set<string>();
	occupiedPositions.add(`${playerPos.x},${playerPos.y}`);
	for (const ep of enemyPositions) occupiedPositions.add(`${ep.x},${ep.y}`);
	for (const t of filteredTraps) occupiedPositions.add(`${t.pos.x},${t.pos.y}`);
	for (const c of filteredChests) occupiedPositions.add(`${c.pos.x},${c.pos.y}`);
	const npcs = spawnDungeonNPCs(map, level, occupiedPositions);
	for (const n of npcs) occupiedPositions.add(`${n.pos.x},${n.pos.y}`);
	const landmarks = placeLandmarks(map, level, occupiedPositions);

	const state: GameState = {
		player: {
			pos: playerPos,
			char: '@',
			color: '#ff0',
			name: 'Hero',
			hp: 10 + level * 2,
			maxHp: 10 + level * 2,
			attack: 2 + level,
			statusEffects: []
		},
		enemies: spawnEnemies(enemyPositions, level, difficulty),
		map,
		messages: [{ text: `Welcome to dungeon level ${level}. Use WASD or arrow keys to move.`, type: 'info' as const }],
		level,
		gameOver: false,
		xp: 0,
		characterLevel: 1,
		visibility,
		sightRadius,
		detectedSecrets: new Set<string>(),
		traps: filteredTraps,
		detectedTraps: new Set<string>(),
		characterConfig: DEFAULT_CONFIG,
		abilityCooldown: 0,
		hazards: filteredHazards,
		npcs,
		chests: filteredChests,
		lootDrops: [],
		skillPoints: 0,
		unlockedSkills: [],
		activeDialogue: null,
		rumors: [],
		knownLanguages: [],
		landmarks
	};
	detectAdjacentSecrets(state);
	for (const msg of detectAdjacentTraps(state)) {
		addMessage(state, msg);
	}
	if (isBossLevel(level)) {
		const bossDef = pickBossDef(level);
		addMessage(state, `A powerful presence lurks here... ${bossDef.name} awaits!`, 'death');
	}
	return state;
}

function addMessage(state: GameState, msg: string, type: MessageType = 'info') {
	state.messages = [...state.messages.slice(-49), { text: msg, type }];
}

function handlePlayerDeath(state: GameState): void {
	state.gameOver = true;
	if (isPermadeath(state.characterConfig.difficulty)) {
		addMessage(state, 'You have been slain! Your journey ends here forever.', 'death');
	} else {
		addMessage(state, 'You have been slain! Press R to restart.', 'death');
	}
}

function isBlocked(state: GameState, x: number, y: number): boolean {
	if (x < 0 || y < 0 || x >= state.map.width || y >= state.map.height) return true;
	if (state.map.tiles[y][x] !== '#') return false;
	// Detected secret walls can be walked through
	const key = `${x},${y}`;
	if (state.map.secretWalls.has(key) && state.detectedSecrets.has(key)) return false;
	return true;
}

function detectAdjacentSecrets(state: GameState): void {
	const { x, y } = state.player.pos;
	const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]];
	for (const [dx, dy] of dirs) {
		const nx = x + dx;
		const ny = y + dy;
		const key = `${nx},${ny}`;
		if (state.map.secretWalls.has(key) && !state.detectedSecrets.has(key)) {
			state.detectedSecrets.add(key);
			addMessage(state, 'You notice a hidden passage in the wall!', 'discovery');
		}
	}
}

function tryDropLoot(state: GameState, enemy: Entity): void {
	const tier = getMonsterTier(enemy);
	const boss = isBoss(enemy);
	const drop = rollLootDrop(enemy.pos, state.level, tier, boss);
	if (drop) {
		state.lootDrops.push(drop);
	}
}

function tickEntityEffects(state: GameState, entity: Entity): void {
	const result = tickEffects(entity);
	for (const msg of result.messages) {
		const type = entity === state.player ? 'damage_taken' : 'player_attack';
		addMessage(state, msg, type);
	}
	if (entity === state.player && entity.hp <= 0) {
		handlePlayerDeath(state);
	}
}

export const DODGE_CHANCE: Record<CharacterClass, number> = {
	rogue: 0.25,
	mage: 0.15,
	warrior: 0.10
};

export const BLOCK_REDUCTION: Record<CharacterClass, number> = {
	warrior: 2,
	mage: 0,
	rogue: 1
};

export const PUSH_CHANCE: Record<CharacterClass, number> = {
	warrior: 1.0,
	rogue: 0.40,
	mage: 0.30
};

const ENVIRONMENTAL_KILL_BONUS = 1.5;

export interface PushResult {
	pushed: boolean;
	messages: { text: string; type: MessageType }[];
	environmentalKill: boolean;
}

export function attemptPush(
	state: GameState,
	target: Entity,
	dx: number,
	dy: number
): PushResult {
	const messages: { text: string; type: MessageType }[] = [];
	const pushX = target.pos.x + dx;
	const pushY = target.pos.y + dy;

	// Can't push if destination is blocked or occupied
	if (isBlocked(state, pushX, pushY)) return { pushed: false, messages, environmentalKill: false };
	if (state.enemies.some((e) => e !== target && e.pos.x === pushX && e.pos.y === pushY)) {
		return { pushed: false, messages, environmentalKill: false };
	}
	if (pushX === state.player.pos.x && pushY === state.player.pos.y) {
		return { pushed: false, messages, environmentalKill: false };
	}

	const chance = PUSH_CHANCE[state.characterConfig.characterClass];
	if (Math.random() >= chance) return { pushed: false, messages, environmentalKill: false };

	// Push succeeds
	target.pos = { x: pushX, y: pushY };
	messages.push({ text: `You push ${target.name} back!`, type: 'player_attack' });

	let environmentalKill = false;

	// Check hazard at new position
	const hazard = getHazardAt(state.hazards, pushX, pushY);
	if (hazard) {
		const effect = applyHazardToEntity(hazard, target, state.level);
		if (effect) {
			messages.push({ text: effect.text, type: 'player_attack' });
		}
		if (target.hp <= 0) environmentalKill = true;
	}

	return { pushed: true, messages, environmentalKill };
}

function moveEnemies(state: GameState, defending = false) {
	tickAbilityCooldown(state);

	// Apply hazard effects to all entities
	const hazardEffects = applyHazards(state);
	for (const effect of hazardEffects) {
		addMessage(state, effect.text, effect.type);
	}
	if (state.player.hp <= 0) {
		handlePlayerDeath(state);
	}

	// Remove enemies killed by hazards and award XP
	state.enemies = state.enemies.filter((e) => {
		if (e.hp <= 0) {
			tryDropLoot(state, e);
			const reward = applyXpMultiplier(xpReward(e, state.level), state);
			state.xp += reward;
			addMessage(state, `${e.name} perished in a hazard! +${reward} XP`, 'player_attack');
			return false;
		}
		return true;
	});
	if (hazardEffects.length > 0) checkLevelUp(state);

	// Tick enemy status effects and remove dead enemies
	for (const enemy of state.enemies) {
		tickEntityEffects(state, enemy);
	}
	state.enemies = state.enemies.filter((e) => {
		if (e.hp <= 0) {
			tryDropLoot(state, e);
			const reward = applyXpMultiplier(xpReward(e, state.level), state);
			state.xp += reward;
			addMessage(state, `${e.name} died from status effects! +${reward} XP`, 'player_attack');
			return false;
		}
		return true;
	});
	checkLevelUp(state);

	// Tick player status effects
	tickEntityEffects(state, state.player);

	for (const enemy of state.enemies) {
		if (hasEffect(enemy, 'stun') || hasEffect(enemy, 'sleep') || hasEffect(enemy, 'freeze')) continue;

		const behavior = getMonsterBehavior(enemy);
		const move = decideMoveDirection(enemy, state.player.pos, state.enemies, behavior);
		if (move.skip) continue;

		const nx = enemy.pos.x + move.dx;
		const ny = enemy.pos.y + move.dy;

		if (nx === state.player.pos.x && ny === state.player.pos.y) {
			// Blind miss check
			if (hasEffect(enemy, 'blind') && Math.random() < 0.5) {
				addMessage(state, `${enemy.name} swings blindly and misses!`, 'info');
				continue;
			}

			// Dodge check — bosses are undodgeable
			const skillBonuses = getSkillBonuses(state.unlockedSkills);
			const dodgeChance = (DODGE_CHANCE[state.characterConfig.characterClass] + (skillBonuses.dodgeChance ?? 0)) * (defending ? 2 : 1);
			if (!isBoss(enemy) && Math.random() < dodgeChance) {
				addMessage(state, `You dodge ${enemy.name}'s attack!`, 'info');
				continue;
			}

			const curseReduction = enemy.statusEffects.find((e) => e.type === 'curse')?.potency ?? 0;
			const rawDmg = Math.max(1, (enemy.attack - curseReduction) + Math.floor(Math.random() * 2));
			const blockValue = (BLOCK_REDUCTION[state.characterConfig.characterClass] + (skillBonuses.blockReduction ?? 0)) * (defending ? 2 : 1);
			const dmg = Math.max(1, rawDmg - blockValue);
			if (blockValue > 0 && rawDmg > dmg) {
				addMessage(state, `You block ${rawDmg - dmg} damage from ${enemy.name}!`, 'info');
			}
			state.player.hp -= dmg;
			addMessage(state, `${enemy.name} hits you for ${dmg} damage!`, 'damage_taken');
			const onHit = getMonsterOnHitEffect(enemy);
			if (onHit) {
				applyEffect(state.player, onHit.type, onHit.duration, onHit.potency);
				addMessage(state, `${enemy.name}'s attack inflicts ${onHit.type}!`, 'damage_taken');
			}
			if (state.player.hp <= 0) {
				handlePlayerDeath(state);
			}
		} else if (!isBlocked(state, nx, ny) && !state.enemies.some((e) => e !== enemy && e.pos.x === nx && e.pos.y === ny)) {
			// Non-relentless enemies avoid hazard tiles
			if (behavior !== 'relentless' && getHazardAt(state.hazards, nx, ny)) continue;
			// Narrate visible enemy movement
			if (state.visibility[enemy.pos.y]?.[enemy.pos.x] === Visibility.Visible) {
				const distBefore = Math.abs(enemy.pos.x - state.player.pos.x) + Math.abs(enemy.pos.y - state.player.pos.y);
				const distAfter = Math.abs(nx - state.player.pos.x) + Math.abs(ny - state.player.pos.y);
				if (distAfter < distBefore) {
					addMessage(state, `${enemy.name} moves toward you.`, 'info');
				} else if (distAfter > distBefore && behavior === 'cowardly') {
					addMessage(state, `${enemy.name} retreats!`, 'info');
				}
			}
			enemy.pos = { x: nx, y: ny };
		}
	}
}

const FLEE_CHANCE: Record<CharacterClass, number> = {
	rogue: 0.75,
	mage: 0.60,
	warrior: 0.50
};

interface FleeResult {
	moved: Position | null;
	messages: { text: string; type: MessageType }[];
}

export function attemptFlee(state: GameState): FleeResult {
	const messages: { text: string; type: MessageType }[] = [];
	const { player, enemies } = state;

	// Must be adjacent to at least one enemy
	const adjacent = enemies.filter(
		(e) => Math.abs(e.pos.x - player.pos.x) <= 1 && Math.abs(e.pos.y - player.pos.y) <= 1
	);
	if (adjacent.length === 0) {
		messages.push({ text: 'There is nothing to flee from.', type: 'info' });
		return { moved: null, messages };
	}

	// Bosses block fleeing
	if (adjacent.some((e) => isBoss(e))) {
		messages.push({ text: 'The boss blocks your escape!', type: 'damage_taken' });
		return { moved: null, messages };
	}

	const chance = FLEE_CHANCE[state.characterConfig.characterClass];
	if (Math.random() >= chance) {
		messages.push({ text: 'You failed to flee!', type: 'damage_taken' });
		return { moved: null, messages };
	}

	// Find the nearest enemy and move 2 tiles away from it
	const nearest = adjacent.reduce((a, b) => {
		const da = Math.abs(a.pos.x - player.pos.x) + Math.abs(a.pos.y - player.pos.y);
		const db = Math.abs(b.pos.x - player.pos.x) + Math.abs(b.pos.y - player.pos.y);
		return da <= db ? a : b;
	});

	const awayX = Math.sign(player.pos.x - nearest.pos.x);
	const awayY = Math.sign(player.pos.y - nearest.pos.y);

	// Try 2 tiles away, then 1 tile, in away direction and perpendicular directions
	const candidates: Position[] = [];
	if (awayX !== 0 || awayY !== 0) {
		candidates.push({ x: player.pos.x + awayX * 2, y: player.pos.y + awayY * 2 });
		candidates.push({ x: player.pos.x + awayX, y: player.pos.y + awayY });
	}
	// Perpendicular options
	const perps = awayX !== 0 && awayY !== 0
		? [{ x: awayX, y: 0 }, { x: 0, y: awayY }]
		: awayX !== 0
			? [{ x: 0, y: 1 }, { x: 0, y: -1 }]
			: [{ x: 1, y: 0 }, { x: -1, y: 0 }];
	for (const p of perps) {
		candidates.push({ x: player.pos.x + p.x * 2, y: player.pos.y + p.y * 2 });
		candidates.push({ x: player.pos.x + p.x, y: player.pos.y + p.y });
	}

	const dest = candidates.find(
		(c) => !isBlocked(state, c.x, c.y) && !enemies.some((e) => e.pos.x === c.x && e.pos.y === c.y)
	);

	if (!dest) {
		messages.push({ text: 'You try to flee but there is nowhere to go!', type: 'damage_taken' });
		return { moved: null, messages };
	}

	messages.push({ text: 'You flee from combat!', type: 'info' });
	return { moved: dest, messages };
}

export function handleInput(state: GameState, key: string): GameState {
	// Block game input during dialogue
	if (state.activeDialogue) return state;

	if (state.gameOver) {
		if (key === 'r') {
			if (isPermadeath(state.characterConfig.difficulty)) {
				// Permadeath: reset to default config (forces new character creation in UI)
				return createGame();
			}
			return createGame(state.characterConfig);
		}
		return state;
	}

	// Ability key
	if (key === 'q') {
		if (hasEffect(state.player, 'stun')) {
			addMessage(state, 'You are stunned and cannot act!', 'damage_taken');
			moveEnemies(state);
			return { ...state };
		}
		const result = useAbility(state);
		for (const msg of result.messages) {
			addMessage(state, msg.text, msg.type);
		}
		if (result.used) {
			const def = ABILITY_DEFS[state.characterConfig.characterClass];
			state.abilityCooldown = def.cooldown;
			// Handle kills from warrior whirlwind
			const killed = state.enemies.filter((e) => e.hp <= 0);
			for (const enemy of killed) {
				tryDropLoot(state, enemy);
				const bossKill = isBoss(enemy);
				const rareKill = isRare(enemy);
				const baseReward = xpReward(enemy, state.level);
				const reward = applyXpMultiplier(bossKill ? baseReward * 3 : rareKill ? baseReward * 2 : baseReward, state);
				state.xp += reward;
				addMessage(state, `${enemy.name} defeated! +${reward} XP`, 'player_attack');
			}
			state.enemies = state.enemies.filter((e) => e.hp > 0);
			if (killed.length > 0) checkLevelUp(state);
			if (result.teleportPos) {
				state.player.pos = result.teleportPos;
				updateVisibility(state.visibility, state.map, state.player.pos, effectiveSightRadius(state));
				detectAdjacentSecrets(state);
			}
			moveEnemies(state);
		}
		return { ...state };
	}

	// Defend key
	if (key === 'g') {
		if (hasEffect(state.player, 'stun')) {
			addMessage(state, 'You are stunned and cannot act!', 'damage_taken');
			moveEnemies(state);
			return { ...state };
		}
		addMessage(state, 'You take a defensive stance!', 'info');
		moveEnemies(state, true);
		return { ...state };
	}

	// Flee key
	if (key === 'f') {
		if (hasEffect(state.player, 'stun')) {
			addMessage(state, 'You are stunned and cannot act!', 'damage_taken');
			moveEnemies(state);
			return { ...state };
		}
		const fleeResult = attemptFlee(state);
		for (const msg of fleeResult.messages) {
			addMessage(state, msg.text, msg.type);
		}
		if (fleeResult.moved) {
			state.player.pos = fleeResult.moved;
			updateVisibility(state.visibility, state.map, state.player.pos, effectiveSightRadius(state));
			detectAdjacentSecrets(state);
		}
		moveEnemies(state);
		return { ...state };
	}

	// Search key
	if (key === 'e') {
		if (hasEffect(state.player, 'stun')) {
			addMessage(state, 'You are stunned and cannot act!', 'damage_taken');
			moveEnemies(state);
			return { ...state };
		}
		const found = searchForTraps(state);
		for (const msg of found) {
			addMessage(state, msg, 'discovery');
		}

		// Examine adjacent landmarks
		const nearbyLandmarks = getAdjacentLandmarks(state.landmarks, state.player.pos);
		for (const lm of nearbyLandmarks) {
			const def = getLandmarkDef(lm.type);
			const text = examineLandmark(lm);
			lm.examined = true;
			addMessage(state, `[${def?.name ?? 'Landmark'}] ${text}`, 'discovery');
		}

		if (found.length === 0 && nearbyLandmarks.length === 0) {
			addMessage(state, 'You search the area but find nothing.', 'info');
		}
		moveEnemies(state);
		return { ...state };
	}

	let dx = 0;
	let dy = 0;
	if (key === 'w' || key === 'ArrowUp') dy = -1;
	else if (key === 's' || key === 'ArrowDown') dy = 1;
	else if (key === 'a' || key === 'ArrowLeft') dx = -1;
	else if (key === 'd' || key === 'ArrowRight') dx = 1;
	else return state;

	// Stunned or frozen player loses their turn
	if (hasEffect(state.player, 'stun')) {
		addMessage(state, 'You are stunned and cannot act!', 'damage_taken');
		moveEnemies(state);
		return { ...state };
	}
	if (hasEffect(state.player, 'freeze')) {
		addMessage(state, 'You are frozen and cannot move!', 'damage_taken');
		moveEnemies(state);
		return { ...state };
	}

	const nx = state.player.pos.x + dx;
	const ny = state.player.pos.y + dy;

	// Talk to NPC?
	const npc = state.npcs.find((n) => n.pos.x === nx && n.pos.y === ny);
	if (npc) {
		// Block dialogue when enemies are adjacent to the player
		const adjacentEnemy = state.enemies.some(
			(e) => Math.abs(e.pos.x - state.player.pos.x) <= 1 && Math.abs(e.pos.y - state.player.pos.y) <= 1
		);
		if (adjacentEnemy) {
			addMessage(state, 'You can\'t talk while enemies are nearby!', 'damage_taken');
			moveEnemies(state);
			return { ...state };
		}
		const tree = npc.dialogueTree ?? NPC_DIALOGUE_TREES[npc.name];
		if (tree) {
			const startId = (npc.dialogueIndex > 0 && tree.returnNode) ? tree.returnNode : tree.startNode;
			state.activeDialogue = {
				npcName: npc.name,
				npcChar: npc.char,
				npcColor: npc.color,
				currentNodeId: startId,
				tree,
				visitedNodes: new Set<string>(),
				givenItems: npc.given,
				mood: npc.mood,
			};
			if (npc.dialogueIndex === 0) npc.dialogueIndex = 1;
			return { ...state };
		}
		// Fallback for NPCs without dialogue trees
		const lineIdx = Math.min(npc.dialogueIndex, npc.dialogue.length - 1);
		addMessage(state, `${npc.name}: "${npc.dialogue[lineIdx]}"`, 'npc');
		if (npc.dialogueIndex < npc.dialogue.length - 1) npc.dialogueIndex++;
		if (!npc.given && npc.gives) {
			if (npc.gives.hp) {
				state.player.hp = Math.min(state.player.maxHp, state.player.hp + npc.gives.hp);
				addMessage(state, `${npc.name} healed you for ${npc.gives.hp} HP!`, 'healing');
			}
			if (npc.gives.atk) {
				state.player.attack += npc.gives.atk;
				addMessage(state, `${npc.name} gave you a weapon! +${npc.gives.atk} ATK`, 'level_up');
			}
			npc.given = true;
		}
		moveEnemies(state);
		return { ...state };
	}

	// Open chest?
	const chest = getChestAt(state.chests, nx, ny);
	if (chest) {
		const isRogue = state.characterConfig.characterClass === 'rogue';
		const result = openChest(chest, state.level, isRogue);
		for (const msg of result.messages) {
			addMessage(state, msg.text, msg.type);
		}
		if (result.trapDamage > 0) {
			state.player.hp -= result.trapDamage;
			if (state.player.hp <= 0) {
				handlePlayerDeath(state);
				return { ...state };
			}
		}
		if (result.loot) {
			state.player.hp = Math.min(state.player.maxHp, state.player.hp + result.loot.healing);
			state.player.attack += result.loot.atkBonus;
			state.xp += result.loot.xpBonus;
			checkLevelUp(state);
		}
		if (result.mimicEnemy) {
			state.enemies.push(result.mimicEnemy);
		}
		moveEnemies(state);
		return { ...state };
	}

	// attack enemy?
	const target = state.enemies.find((e) => e.pos.x === nx && e.pos.y === ny);
	if (target) {
		// Blind miss check for player
		if (hasEffect(state.player, 'blind') && Math.random() < 0.5) {
			addMessage(state, 'You swing blindly and miss!', 'damage_taken');
			moveEnemies(state);
			return { ...state };
		}
		const isSneakAttack = hasEffect(target, 'sleep');
		if (isSneakAttack) {
			target.statusEffects = target.statusEffects.filter((e) => e.type !== 'sleep');
		}
		const curseReduction = state.player.statusEffects.find((e) => e.type === 'curse')?.potency ?? 0;
		const baseDmg = Math.max(1, (state.player.attack - curseReduction) + Math.floor(Math.random() * 3));
		const dmg = isSneakAttack ? baseDmg * 2 : baseDmg;
		target.hp -= dmg;
		if (isSneakAttack) {
			addMessage(state, `Sneak attack! You hit ${target.name} for ${dmg}!`, 'player_attack');
		} else {
			addMessage(state, `You hit ${target.name} for ${dmg}!`, 'player_attack');
		}
		let envKill = false;
		if (target.hp > 0) {
			// Attempt push on surviving enemy
			const pushResult = attemptPush(state, target, dx, dy);
			for (const msg of pushResult.messages) {
				addMessage(state, msg.text, msg.type);
			}
			envKill = pushResult.environmentalKill;
		}
		if (target.hp <= 0) {
			tryDropLoot(state, target);
			const bossKill = isBoss(target);
			const rareKill = isRare(target);
			const baseReward = xpReward(target, state.level);
			const multiplier = envKill ? ENVIRONMENTAL_KILL_BONUS : 1;
			const reward = applyXpMultiplier(Math.floor((bossKill ? baseReward * 3 : rareKill ? baseReward * 2 : baseReward) * multiplier), state);
			state.xp += reward;
			state.enemies = state.enemies.filter((e) => e !== target);
			if (envKill) {
				addMessage(state, `${target.name} perished in the environment! +${reward} XP (Creativity bonus!)`, 'level_up');
			} else if (bossKill) {
				addMessage(state, `${target.name} has been vanquished! +${reward} XP`, 'level_up');
			} else if (rareKill) {
				addMessage(state, `${target.name} slain! +${reward} XP`, 'level_up');
			} else {
				addMessage(state, `${target.name} defeated! +${reward} XP`, 'player_attack');
			}
			checkLevelUp(state);
		}
		moveEnemies(state);
		return { ...state };
	}

	if (isBlocked(state, nx, ny)) return state;

	// Walking through a detected secret wall opens it
	const tileKey = `${nx},${ny}`;
	if (state.map.tiles[ny][nx] === '#' && state.map.secretWalls.has(tileKey) && state.detectedSecrets.has(tileKey)) {
		state.map.tiles[ny][nx] = '.';
		addMessage(state, 'You push through the hidden passage!', 'discovery');
	}

	state.player.pos = { x: nx, y: ny };
	updateVisibility(state.visibility, state.map, state.player.pos, effectiveSightRadius(state));
	detectAdjacentSecrets(state);
	for (const msg of detectAdjacentTraps(state)) {
		addMessage(state, msg, 'discovery');
	}

	// Check for trap at new position
	const trap = getTrapAt(state, nx, ny);
	if (trap) {
		const trapKey = `${nx},${ny}`;
		if (state.detectedTraps.has(trapKey)) {
			// Detected trap: attempt disarm
			const disarmResult = disarmTrap(state, trap, state.characterConfig.characterClass);
			for (const msg of disarmResult.messages) {
				addMessage(state, msg, disarmResult.success ? 'discovery' : 'trap');
			}
			if (!disarmResult.success && disarmResult.triggerResult?.teleportPos) {
				state.player.pos = disarmResult.triggerResult.teleportPos;
				updateVisibility(state.visibility, state.map, state.player.pos, effectiveSightRadius(state));
				detectAdjacentSecrets(state);
				for (const msg2 of detectAdjacentTraps(state)) {
					addMessage(state, msg2, 'discovery');
				}
			}
		} else {
			// Undetected trap: trigger normally
			const result = triggerTrap(state, trap);
			for (const msg of result.messages) {
				addMessage(state, msg, 'trap');
			}
			if (result.teleportPos) {
				state.player.pos = result.teleportPos;
				updateVisibility(state.visibility, state.map, state.player.pos, effectiveSightRadius(state));
				detectAdjacentSecrets(state);
				for (const msg2 of detectAdjacentTraps(state)) {
					addMessage(state, msg2, 'discovery');
				}
			}
		}
		if (state.player.hp <= 0) {
			handlePlayerDeath(state);
			return { ...state };
		}
	}

	// pick up item
	if (state.map.tiles[ny][nx] === '*') {
		const heal = 3 + state.level;
		state.player.hp = Math.min(state.player.maxHp, state.player.hp + heal);
		state.map.tiles[ny][nx] = '.';
		addMessage(state, `Picked up a potion! Healed ${heal} HP.`, 'healing');
	}

	// pick up loot drop
	const loot = getLootAt(state.lootDrops, nx, ny);
	if (loot) {
		const result = pickupLoot(loot);
		addMessage(state, result.message.text, result.message.type);
		switch (loot.type) {
			case 'healing':
				state.player.hp = Math.min(state.player.maxHp, state.player.hp + loot.value);
				break;
			case 'xp_bonus':
				state.xp += loot.value;
				checkLevelUp(state);
				break;
			case 'atk_bonus':
				state.player.attack += loot.value;
				break;
		}
		state.lootDrops = state.lootDrops.filter((d) => d !== loot);
	}

	// stairs
	if (state.map.tiles[ny][nx] === '>') {
		const nextLevel = state.level === 0 ? 1 : state.level + 1;
		const next = newLevel(nextLevel, state.characterConfig.difficulty);
		next.player.hp = state.player.hp;
		next.player.maxHp = Math.max(state.player.maxHp, next.player.maxHp);
		next.player.attack = Math.max(state.player.attack, next.player.attack);
		next.xp = state.xp;
		next.characterLevel = state.characterLevel;
		next.sightRadius = state.sightRadius;
		next.player.statusEffects = [...state.player.statusEffects];
		next.characterConfig = state.characterConfig;
		next.player.name = state.player.name;
		next.abilityCooldown = state.abilityCooldown;
		next.skillPoints = state.skillPoints;
		next.unlockedSkills = [...state.unlockedSkills];
		next.rumors = [...state.rumors];
		addMessage(next, `Descended to dungeon level ${next.level}.`);
		return next;
	}

	// Wake sleeping enemies adjacent to the player
	for (const enemy of state.enemies) {
		if (hasEffect(enemy, 'sleep') &&
			Math.abs(enemy.pos.x - state.player.pos.x) <= 1 &&
			Math.abs(enemy.pos.y - state.player.pos.y) <= 1) {
			enemy.statusEffects = enemy.statusEffects.filter((e) => e.type !== 'sleep');
			addMessage(state, `${enemy.name} wakes up!`, 'info');
		}
	}

	moveEnemies(state);
	return { ...state };
}

export function handleDialogueChoice(state: GameState, optionIndex: number): GameState {
	if (!state.activeDialogue) return state;
	const { tree, currentNodeId, visitedNodes } = state.activeDialogue;
	const currentNode = tree.nodes[currentNodeId];
	if (!currentNode || optionIndex < 0 || optionIndex >= currentNode.options.length) return state;

	const option = currentNode.options[optionIndex];
	visitedNodes.add(currentNodeId);

	// Apply dialogue effects
	if (option.onSelect) {
		// Item gifts only once
		if (!state.activeDialogue.givenItems && (option.onSelect.hp || option.onSelect.atk)) {
			if (option.onSelect.hp) {
				state.player.hp = Math.min(state.player.maxHp, state.player.hp + option.onSelect.hp);
				addMessage(state, option.onSelect.message ?? `Healed ${option.onSelect.hp} HP!`, 'healing');
			}
			if (option.onSelect.atk) {
				state.player.attack += option.onSelect.atk;
				addMessage(state, option.onSelect.message ?? `+${option.onSelect.atk} ATK!`, 'level_up');
			}
			state.activeDialogue.givenItems = true;
			const npc = state.npcs.find((n) => n.name === state.activeDialogue!.npcName);
			if (npc) npc.given = true;
		}
		// Mood changes always apply
		if (option.onSelect.mood) {
			state.activeDialogue.mood = option.onSelect.mood;
			const npc = state.npcs.find((n) => n.name === state.activeDialogue!.npcName);
			if (npc) npc.mood = option.onSelect.mood;
		}
		// Learn rumors
		if (option.onSelect.rumor && !state.rumors.some(r => r.id === option.onSelect!.rumor!.id)) {
			state.rumors = [...state.rumors, option.onSelect.rumor];
			addMessage(state, `Rumor learned: "${option.onSelect.rumor.text}"`, 'discovery');
		}
		// Learn languages
		if (option.onSelect.learnLanguage && !state.knownLanguages.includes(option.onSelect.learnLanguage)) {
			state.knownLanguages = [...state.knownLanguages, option.onSelect.learnLanguage];
			addMessage(state, `Language learned: ${option.onSelect.learnLanguage}! You can now understand speakers of this tongue.`, 'discovery');
		}
	}

	// Exit dialogue
	if (option.nextNode === '__exit__') {
		state.activeDialogue = null;
		return { ...state };
	}

	// Navigate to next node
	if (tree.nodes[option.nextNode]) {
		state.activeDialogue = { ...state.activeDialogue, currentNodeId: option.nextNode };
	}
	return { ...state };
}

export const MOOD_DISPLAY: Record<string, { label: string; color: string }> = {
	friendly: { label: 'Friendly', color: '#4f4' },
	neutral: { label: 'Neutral', color: '#888' },
	hostile: { label: 'Hostile', color: '#f44' },
	afraid: { label: 'Afraid', color: '#f8f' },
	amused: { label: 'Amused', color: '#ff4' },
	sad: { label: 'Sad', color: '#48f' },
};

const DEEPSCRIPT_GLYPHS = 'ᚠᚡᚢᚣᚤᚥᚦᚧᚨᚩᚪᚫᚬᚭᚮᚯᚰᚱᚲᚳᚴᚵᚶᚷᚸᚹᚺᚻᚼᚽᚾᚿ';
const ORCISH_GLYPHS = 'ɤʁʂʃʇʈʊʋʌʍʎʏɯɰɱɲɳɴɵɶɷɸɹɺɻɼɽɾɿ';

export function garbleText(text: string, language: string): string {
	const glyphs = language === 'Deepscript' ? DEEPSCRIPT_GLYPHS : language === 'Orcish' ? ORCISH_GLYPHS : DEEPSCRIPT_GLYPHS;
	let result = '';
	for (const ch of text) {
		if (ch === ' ' || ch === '\n' || ch === '.' || ch === ',' || ch === '!' || ch === '?') {
			result += ch;
		} else if (ch === '*') {
			result += ch;
		} else {
			const idx = (ch.charCodeAt(0) * 7 + result.length * 3) % glyphs.length;
			result += glyphs[idx];
		}
	}
	return result;
}

export function closeDialogue(state: GameState): GameState {
	state.activeDialogue = null;
	return { ...state };
}

export function render(state: GameState): string[] {
	const lines: string[] = [];
	for (let y = 0; y < state.map.height; y++) {
		let line = '';
		for (let x = 0; x < state.map.width; x++) {
			if (state.player.pos.x === x && state.player.pos.y === y) {
				line += '@';
			} else {
				const enemy = state.enemies.find((e) => e.pos.x === x && e.pos.y === y);
				if (enemy) {
					line += enemy.char;
				} else {
					line += state.map.tiles[y][x];
				}
			}
		}
		lines.push(line);
	}
	return lines;
}

function dimColor(hex: string): string {
	// Expand 3-char hex to 6-char: #abc → #aabbcc
	if (hex.length === 4) {
		hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
	}
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	const dim = (v: number) => Math.floor(v * 0.35).toString(16).padStart(2, '0');
	return `#${dim(r)}${dim(g)}${dim(b)}`;
}

function tileColor(tile: string, isDetectedSecret: boolean = false): string {
	if (tile === '#') return isDetectedSecret ? '#665577' : '#444444';
	if (tile === '.') return '#666666';
	if (tile === '>') return '#ffff00';
	if (tile === '*') return '#ff00ff';
	if (tile === '^') return '#ff4444';
	return '#444444';
}

export function renderColored(state: GameState): { char: string; color: string }[][] {
	const grid: { char: string; color: string }[][] = [];
	for (let y = 0; y < state.map.height; y++) {
		const row: { char: string; color: string }[] = [];
		for (let x = 0; x < state.map.width; x++) {
			const vis = state.visibility[y][x];

			if (vis === Visibility.Unexplored) {
				row.push({ char: ' ', color: '#000' });
				continue;
			}

			const isVisible = vis === Visibility.Visible;

			if (state.player.pos.x === x && state.player.pos.y === y) {
				const playerColor = effectColor(state.player) ?? state.player.color;
				row.push({ char: '@', color: playerColor });
			} else if (isVisible) {
				const enemy = state.enemies.find((e) => e.pos.x === x && e.pos.y === y);
				const npc = state.npcs.find((n) => n.pos.x === x && n.pos.y === y);
				if (enemy) {
					const enemyColor = effectColor(enemy) ?? enemy.color;
					row.push({ char: enemy.char, color: enemyColor });
				} else if (npc) {
					row.push({ char: npc.char, color: npc.color });
				} else if (getChestAt(state.chests, x, y)) {
					const ch = getChestAt(state.chests, x, y)!;
					row.push({ char: chestChar(ch.type), color: chestColor(ch.type) });
				} else if (getLootAt(state.lootDrops, x, y)) {
					const ld = getLootAt(state.lootDrops, x, y)!;
					row.push({ char: lootChar(ld.type), color: lootColor(ld.type) });
				} else if (getLandmarkAt(state.landmarks, x, y)) {
					const lm = getLandmarkAt(state.landmarks, x, y)!;
					const lmColor = lm.examined ? dimColor(landmarkColor(lm.type)) : landmarkColor(lm.type);
					row.push({ char: landmarkChar(lm.type), color: lmColor });
				} else {
					const key = `${x},${y}`;
					const detectedTrap = state.detectedTraps.has(key) && state.traps.some((t) => t.pos.x === x && t.pos.y === y && !t.triggered);
					if (detectedTrap) {
						row.push({ char: '^', color: tileColor('^') });
					} else {
						const hazard = getHazardAt(state.hazards, x, y);
						if (hazard) {
							row.push({ char: hazardChar(hazard.type), color: hazardColor(hazard.type) });
						} else {
							const tile = state.map.tiles[y][x];
							const isSecret = state.detectedSecrets.has(key);
							row.push({ char: tile, color: tileColor(tile, isSecret) });
						}
					}
				}
			} else {
				// Explored but not currently visible: show terrain dimmed, no entities
				const lootDrop = getLootAt(state.lootDrops, x, y);
				if (lootDrop) {
					row.push({ char: lootChar(lootDrop.type), color: dimColor(lootColor(lootDrop.type)) });
				} else if (getLandmarkAt(state.landmarks, x, y)) {
					const lm = getLandmarkAt(state.landmarks, x, y)!;
					row.push({ char: landmarkChar(lm.type), color: dimColor(landmarkColor(lm.type)) });
				} else {
					const key = `${x},${y}`;
					const detectedTrap = state.detectedTraps.has(key) && state.traps.some((t) => t.pos.x === x && t.pos.y === y && !t.triggered);
					if (detectedTrap) {
						row.push({ char: '^', color: dimColor(tileColor('^')) });
					} else {
						const hazard = getHazardAt(state.hazards, x, y);
						if (hazard) {
							row.push({ char: hazardChar(hazard.type), color: dimColor(hazardColor(hazard.type)) });
						} else {
							const tile = state.map.tiles[y][x];
							const isSecret = state.detectedSecrets.has(key);
							row.push({ char: tile, color: dimColor(tileColor(tile, isSecret)) });
						}
					}
				}
			}
		}
		grid.push(row);
	}
	return grid;
}
