import type { GameState } from './types';
import { Visibility } from './types';
import { effectColor } from './status-effects';
import { getChestAt, chestChar, chestColor } from './chests';
import { getLootAt, lootChar, lootColor } from './loot';
import { getLandmarkAt, landmarkChar, landmarkColor } from './landmarks';
import { getHazardAt, hazardChar, hazardColor } from './hazards';
import { getAlertSymbol, getAlertColor } from './stealth';
import { npcMoodColor } from './dialogue-handler';

export function dimColor(hex: string): string {
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

/** Render the dungeon/location view with colors. Does NOT handle overworld mode. */
export function renderLocationColored(state: GameState): { char: string; color: string }[][] {
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
				if (state.ritualChanneling && state.ritualChanneling.turnsRemaining > 0) {
					const pulseChar = state.turnCount % 2 === 0 ? '@' : '*';
					row.push({ char: pulseChar, color: '#c8f' });
				} else {
					const playerColor = effectColor(state.player) ?? state.player.color;
					row.push({ char: '@', color: playerColor });
				}
			} else if (isVisible) {
				const enemy = state.enemies.find((e) => e.pos.x === x && e.pos.y === y);
				const npc = state.npcs.find((n) => n.pos.x === x && n.pos.y === y);
				if (state.activeSummon && state.activeSummon.hp > 0 && state.activeSummon.pos.x === x && state.activeSummon.pos.y === y) {
					row.push({ char: state.activeSummon.char, color: state.activeSummon.color });
				} else if (enemy) {
					const alertSym = enemy.awareness ? getAlertSymbol(enemy.awareness.alertState) : '';
					const isChanneling = !!(enemy.channeling && enemy.channeling.turnsLeft > 0);
					if (isChanneling) {
						// Channeling enemies pulse yellow with their char
						const pulseChar = state.turnCount % 2 === 0 ? enemy.char : '!';
						row.push({ char: pulseChar, color: '#ff0' });
					} else {
						const enemyColor = alertSym ? getAlertColor(enemy.awareness!.alertState) : (effectColor(enemy) ?? enemy.color);
						row.push({ char: alertSym || enemy.char, color: enemyColor });
					}
				} else if (npc) {
					row.push({ char: npc.char, color: npcMoodColor(npc) });
				} else if (getChestAt(state.chests, x, y)) {
					const ch = getChestAt(state.chests, x, y)!;
					row.push({ char: chestChar(ch.type), color: chestColor(ch.type) });
				} else if (getLootAt(state.lootDrops, x, y)) {
					const ld = getLootAt(state.lootDrops, x, y)!;
					row.push({ char: lootChar(ld.type), color: lootColor(ld.type) });
				} else if (state.containers.find(c => c.pos.x === x && c.pos.y === y)) {
					const ct = state.containers.find(c => c.pos.x === x && c.pos.y === y)!;
					row.push({ char: ct.char, color: ct.color });
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
							const terrain = state.terrainEffects?.find(e => e.pos.x === x && e.pos.y === y);
							if (terrain) {
								const tChar = terrain.type === 'burning' ? '~' : terrain.type === 'frozen' ? '.' : '*';
								const tColor = terrain.type === 'burning' ? '#f44' : terrain.type === 'frozen' ? '#0ff' : '#ff0';
								row.push({ char: tChar, color: tColor });
							} else if (state.teleportAnchors[state.level]?.x === x && state.teleportAnchors[state.level]?.y === y) {
								row.push({ char: 'O', color: '#ff8' });
							} else {
								const tile = state.map.tiles[y][x];
								const isSecret = state.detectedSecrets.has(key);
								const inWard = state.activeWards.some(w => Math.abs(x - w.center.x) <= w.radius && Math.abs(y - w.center.y) <= w.radius);
								if (inWard && tile === '.') {
									row.push({ char: tile, color: '#448' });
								} else {
									row.push({ char: tile, color: tileColor(tile, isSecret) });
								}
							}
						}
					}
				}
			} else {
				// Explored but not currently visible: show terrain dimmed, no entities
				const lootDrop = getLootAt(state.lootDrops, x, y);
				if (lootDrop) {
					row.push({ char: lootChar(lootDrop.type), color: dimColor(lootColor(lootDrop.type)) });
				} else if (state.containers.find(c => c.pos.x === x && c.pos.y === y)) {
					const ct = state.containers.find(c => c.pos.x === x && c.pos.y === y)!;
					row.push({ char: ct.char, color: dimColor(ct.color) });
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
							const terrain = state.terrainEffects?.find(e => e.pos.x === x && e.pos.y === y);
							if (terrain) {
								const tChar = terrain.type === 'burning' ? '~' : terrain.type === 'frozen' ? '.' : '*';
								const tColor = terrain.type === 'burning' ? '#f44' : terrain.type === 'frozen' ? '#0ff' : '#ff0';
								row.push({ char: tChar, color: dimColor(tColor) });
							} else {
								const tile = state.map.tiles[y][x];
								const isSecret = state.detectedSecrets.has(key);
								row.push({ char: tile, color: dimColor(tileColor(tile, isSecret)) });
							}
						}
					}
				}
			}
		}
		grid.push(row);
	}
	return grid;
}
