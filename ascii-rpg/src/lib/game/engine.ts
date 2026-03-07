import type { GameState, Entity, Position, MessageType } from './types';
import { Visibility } from './types';
import { generateMap, getSpawnPositions } from './map';
import { createVisibilityGrid, updateVisibility } from './fov';
import { applyEffect, hasEffect, tickEffects, effectColor } from './status-effects';
import { createMonster, pickMonsterDef, decideMoveDirection, getMonsterBehavior, getMonsterOnHitEffect } from './monsters';
import { placeTraps, getTrapAt, detectAdjacentTraps, triggerTrap } from './traps';

const MAP_W = 50;
const MAP_H = 24;

export function xpForLevel(level: number): number {
	return Math.floor(50 * Math.pow(1.4, level - 1));
}

export function xpReward(enemy: Entity, dungeonLevel: number): number {
	return 5 + dungeonLevel * 2 + enemy.maxHp;
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
		addMessage(state, `Level up! You are now level ${state.characterLevel}. +${hpGain} HP${atkGain ? `, +${atkGain} ATK` : ''}.`, 'level_up');
		threshold = xpForLevel(state.characterLevel + 1);
	}
}

function createEnemy(pos: Position, level: number): Entity {
	const def = pickMonsterDef(level);
	return createMonster(pos, level, def);
}

export function createGame(): GameState {
	return newLevel(1);
}

const DEFAULT_SIGHT_RADIUS = 8;

function newLevel(level: number): GameState {
	const map = generateMap(MAP_W, MAP_H, level);
	const spawns = getSpawnPositions(map, 1 + 3 + level);
	const playerPos = spawns[0];
	const enemyPositions = spawns.slice(1);
	const sightRadius = DEFAULT_SIGHT_RADIUS;
	const visibility = createVisibilityGrid(map.width, map.height);
	updateVisibility(visibility, map, playerPos, sightRadius);

	const traps = placeTraps(map, level);
	// Don't place traps on player spawn
	const filteredTraps = traps.filter((t) => !(t.pos.x === playerPos.x && t.pos.y === playerPos.y));

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
		enemies: enemyPositions.map((p) => createEnemy(p, level)),
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
		detectedTraps: new Set<string>()
	};
	detectAdjacentSecrets(state);
	for (const msg of detectAdjacentTraps(state)) {
		addMessage(state, msg);
	}
	return state;
}

function addMessage(state: GameState, msg: string, type: MessageType = 'info') {
	state.messages = [...state.messages.slice(-49), { text: msg, type }];
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

function tickEntityEffects(state: GameState, entity: Entity): void {
	const result = tickEffects(entity);
	for (const msg of result.messages) {
		const type = entity === state.player ? 'damage_taken' : 'player_attack';
		addMessage(state, msg, type);
	}
	if (entity === state.player && entity.hp <= 0) {
		state.gameOver = true;
		addMessage(state, 'You have been slain! Press R to restart.', 'death');
	}
}

function moveEnemies(state: GameState) {
	// Tick enemy status effects and remove dead enemies
	for (const enemy of state.enemies) {
		tickEntityEffects(state, enemy);
	}
	state.enemies = state.enemies.filter((e) => {
		if (e.hp <= 0) {
			const reward = xpReward(e, state.level);
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
		if (hasEffect(enemy, 'stun')) continue;

		const behavior = getMonsterBehavior(enemy);
		const move = decideMoveDirection(enemy, state.player.pos, state.enemies, behavior);
		if (move.skip) continue;

		const nx = enemy.pos.x + move.dx;
		const ny = enemy.pos.y + move.dy;

		if (nx === state.player.pos.x && ny === state.player.pos.y) {
			const dmg = Math.max(1, enemy.attack + Math.floor(Math.random() * 2));
			state.player.hp -= dmg;
			addMessage(state, `${enemy.name} hits you for ${dmg} damage!`, 'damage_taken');
			const onHit = getMonsterOnHitEffect(enemy);
			if (onHit) {
				applyEffect(state.player, onHit.type, onHit.duration, onHit.potency);
				addMessage(state, `${enemy.name}'s attack inflicts ${onHit.type}!`, 'damage_taken');
			}
			if (state.player.hp <= 0) {
				state.gameOver = true;
				addMessage(state, 'You have been slain! Press R to restart.', 'death');
			}
		} else if (!isBlocked(state, nx, ny) && !state.enemies.some((e) => e !== enemy && e.pos.x === nx && e.pos.y === ny)) {
			enemy.pos = { x: nx, y: ny };
		}
	}
}

export function handleInput(state: GameState, key: string): GameState {
	if (state.gameOver) {
		if (key === 'r') return createGame();
		return state;
	}

	let dx = 0;
	let dy = 0;
	if (key === 'w' || key === 'ArrowUp') dy = -1;
	else if (key === 's' || key === 'ArrowDown') dy = 1;
	else if (key === 'a' || key === 'ArrowLeft') dx = -1;
	else if (key === 'd' || key === 'ArrowRight') dx = 1;
	else return state;

	// Stunned player loses their turn
	if (hasEffect(state.player, 'stun')) {
		addMessage(state, 'You are stunned and cannot act!', 'damage_taken');
		moveEnemies(state);
		return { ...state };
	}

	const nx = state.player.pos.x + dx;
	const ny = state.player.pos.y + dy;

	// attack enemy?
	const target = state.enemies.find((e) => e.pos.x === nx && e.pos.y === ny);
	if (target) {
		const dmg = Math.max(1, state.player.attack + Math.floor(Math.random() * 3));
		target.hp -= dmg;
		addMessage(state, `You hit ${target.name} for ${dmg}!`, 'player_attack');
		if (target.hp <= 0) {
			const reward = xpReward(target, state.level);
			state.xp += reward;
			state.enemies = state.enemies.filter((e) => e !== target);
			addMessage(state, `${target.name} defeated! +${reward} XP`, 'player_attack');
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
	updateVisibility(state.visibility, state.map, state.player.pos, state.sightRadius);
	detectAdjacentSecrets(state);
	for (const msg of detectAdjacentTraps(state)) {
		addMessage(state, msg, 'discovery');
	}

	// Check for trap at new position
	const trap = getTrapAt(state, nx, ny);
	if (trap && !state.detectedTraps.has(`${nx},${ny}`)) {
		const result = triggerTrap(state, trap);
		for (const msg of result.messages) {
			addMessage(state, msg, 'trap');
		}
		if (result.teleportPos) {
			state.player.pos = result.teleportPos;
			updateVisibility(state.visibility, state.map, state.player.pos, state.sightRadius);
			detectAdjacentSecrets(state);
			for (const msg2 of detectAdjacentTraps(state)) {
				addMessage(state, msg2, 'discovery');
			}
		}
		if (state.player.hp <= 0) {
			state.gameOver = true;
			addMessage(state, 'You have been slain! Press R to restart.', 'death');
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

	// stairs
	if (state.map.tiles[ny][nx] === '>') {
		const next = newLevel(state.level + 1);
		next.player.hp = state.player.hp;
		next.player.maxHp = Math.max(state.player.maxHp, next.player.maxHp);
		next.player.attack = Math.max(state.player.attack, next.player.attack);
		next.xp = state.xp;
		next.characterLevel = state.characterLevel;
		next.sightRadius = state.sightRadius;
		next.player.statusEffects = [...state.player.statusEffects];
		addMessage(next, `Descended to level ${next.level}.`);
		return next;
	}

	moveEnemies(state);
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
				if (enemy) {
					const enemyColor = effectColor(enemy) ?? enemy.color;
					row.push({ char: enemy.char, color: enemyColor });
				} else {
					const key = `${x},${y}`;
					const detectedTrap = state.detectedTraps.has(key) && state.traps.some((t) => t.pos.x === x && t.pos.y === y && !t.triggered);
					if (detectedTrap) {
						row.push({ char: '^', color: tileColor('^') });
					} else {
						const tile = state.map.tiles[y][x];
						const isSecret = state.detectedSecrets.has(key);
						row.push({ char: tile, color: tileColor(tile, isSecret) });
					}
				}
			} else {
				// Explored but not currently visible: show terrain dimmed, no entities
				const key = `${x},${y}`;
				const detectedTrap = state.detectedTraps.has(key) && state.traps.some((t) => t.pos.x === x && t.pos.y === y && !t.triggered);
				if (detectedTrap) {
					row.push({ char: '^', color: dimColor(tileColor('^')) });
				} else {
					const tile = state.map.tiles[y][x];
					const isSecret = state.detectedSecrets.has(key);
					row.push({ char: tile, color: dimColor(tileColor(tile, isSecret)) });
				}
			}
		}
		grid.push(row);
	}
	return grid;
}
