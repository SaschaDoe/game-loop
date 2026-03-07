export interface Position {
	x: number;
	y: number;
}

export type StatusEffectType = 'poison' | 'stun' | 'regeneration';

export interface StatusEffect {
	type: StatusEffectType;
	duration: number;
	potency: number;
}

export interface Entity {
	pos: Position;
	char: string;
	color: string;
	name: string;
	hp: number;
	maxHp: number;
	attack: number;
	statusEffects: StatusEffect[];
}

export type Tile = '#' | '.' | '>' | '*';

export enum Visibility {
	Unexplored = 0,
	Explored = 1,
	Visible = 2
}

export interface GameMap {
	width: number;
	height: number;
	tiles: Tile[][];
}

export interface GameState {
	player: Entity;
	enemies: Entity[];
	map: GameMap;
	messages: string[];
	level: number;
	gameOver: boolean;
	xp: number;
	characterLevel: number;
	visibility: Visibility[][];
	sightRadius: number;
}
