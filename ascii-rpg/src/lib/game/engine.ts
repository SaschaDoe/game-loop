import type { GameState, Entity, Position } from './types';
import { generateMap, getSpawnPositions } from './map';

const MAP_W = 50;
const MAP_H = 24;

const ENEMY_NAMES = ['Goblin', 'Rat', 'Skeleton', 'Slime', 'Bat'];

function createEnemy(pos: Position, level: number): Entity {
	const name = ENEMY_NAMES[Math.floor(Math.random() * ENEMY_NAMES.length)];
	return {
		pos,
		char: name[0],
		color: name === 'Goblin' ? '#0f0' : name === 'Rat' ? '#a86' : name === 'Skeleton' ? '#fff' : name === 'Slime' ? '#0ff' : '#f0f',
		name,
		hp: 2 + level,
		maxHp: 2 + level,
		attack: 1 + Math.floor(level / 2)
	};
}

export function createGame(): GameState {
	return newLevel(1);
}

function newLevel(level: number): GameState {
	const map = generateMap(MAP_W, MAP_H, level);
	const spawns = getSpawnPositions(map, 1 + 3 + level);
	const playerPos = spawns[0];
	const enemyPositions = spawns.slice(1);

	return {
		player: {
			pos: playerPos,
			char: '@',
			color: '#ff0',
			name: 'Hero',
			hp: 10 + level * 2,
			maxHp: 10 + level * 2,
			attack: 2 + level
		},
		enemies: enemyPositions.map((p) => createEnemy(p, level)),
		map,
		messages: [`Welcome to dungeon level ${level}. Use WASD or arrow keys to move.`],
		level,
		gameOver: false
	};
}

function addMessage(state: GameState, msg: string) {
	state.messages = [...state.messages.slice(-4), msg];
}

function isBlocked(state: GameState, x: number, y: number): boolean {
	if (x < 0 || y < 0 || x >= state.map.width || y >= state.map.height) return true;
	return state.map.tiles[y][x] === '#';
}

function moveEnemies(state: GameState) {
	for (const enemy of state.enemies) {
		const dx = Math.sign(state.player.pos.x - enemy.pos.x);
		const dy = Math.sign(state.player.pos.y - enemy.pos.y);

		// only move ~50% of turns
		if (Math.random() < 0.5) continue;

		const nx = enemy.pos.x + dx;
		const ny = enemy.pos.y + dy;

		if (nx === state.player.pos.x && ny === state.player.pos.y) {
			const dmg = Math.max(1, enemy.attack + Math.floor(Math.random() * 2));
			state.player.hp -= dmg;
			addMessage(state, `${enemy.name} hits you for ${dmg} damage!`);
			if (state.player.hp <= 0) {
				state.gameOver = true;
				addMessage(state, 'You have been slain! Press R to restart.');
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

	const nx = state.player.pos.x + dx;
	const ny = state.player.pos.y + dy;

	// attack enemy?
	const target = state.enemies.find((e) => e.pos.x === nx && e.pos.y === ny);
	if (target) {
		const dmg = Math.max(1, state.player.attack + Math.floor(Math.random() * 3));
		target.hp -= dmg;
		addMessage(state, `You hit ${target.name} for ${dmg}!`);
		if (target.hp <= 0) {
			state.enemies = state.enemies.filter((e) => e !== target);
			addMessage(state, `${target.name} defeated!`);
		}
		moveEnemies(state);
		return { ...state };
	}

	if (isBlocked(state, nx, ny)) return state;

	state.player.pos = { x: nx, y: ny };

	// pick up item
	if (state.map.tiles[ny][nx] === '*') {
		const heal = 3 + state.level;
		state.player.hp = Math.min(state.player.maxHp, state.player.hp + heal);
		state.map.tiles[ny][nx] = '.';
		addMessage(state, `Picked up a potion! Healed ${heal} HP.`);
	}

	// stairs
	if (state.map.tiles[ny][nx] === '>') {
		const next = newLevel(state.level + 1);
		next.player.hp = state.player.hp;
		next.player.maxHp = Math.max(state.player.maxHp, next.player.maxHp);
		next.player.attack = Math.max(state.player.attack, next.player.attack);
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

export function renderColored(state: GameState): { char: string; color: string }[][] {
	const grid: { char: string; color: string }[][] = [];
	for (let y = 0; y < state.map.height; y++) {
		const row: { char: string; color: string }[] = [];
		for (let x = 0; x < state.map.width; x++) {
			if (state.player.pos.x === x && state.player.pos.y === y) {
				row.push({ char: '@', color: state.player.color });
			} else {
				const enemy = state.enemies.find((e) => e.pos.x === x && e.pos.y === y);
				if (enemy) {
					row.push({ char: enemy.char, color: enemy.color });
				} else {
					const tile = state.map.tiles[y][x];
					let color = '#444';
					if (tile === '.') color = '#666';
					else if (tile === '>') color = '#ff0';
					else if (tile === '*') color = '#f0f';
					row.push({ char: tile, color });
				}
			}
		}
		grid.push(row);
	}
	return grid;
}
