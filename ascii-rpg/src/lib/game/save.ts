import type { GameState, Tile, GameStats, LocationMode } from './types';
import type { Item, Equipment, WorldContainer } from './items';
import { createEmptyInventory, createEmptyEquipment } from './items';
import { createDefaultStats } from './achievements';
import { generateWorld, type WorldMap } from './overworld';

export const SAVE_VERSION = 15;
export const SAVE_KEY = 'ascii-rpg-save';

interface SaveData {
	version: number;
	state: SerializedState;
}

interface SerializedState {
	player: GameState['player'];
	enemies: GameState['enemies'];
	map: {
		width: number;
		height: number;
		tiles: Tile[][];
		secretWalls: string[];
	};
	messages: GameState['messages'];
	level: number;
	gameOver: boolean;
	xp: number;
	characterLevel: number;
	visibility: number[][];
	sightRadius: number;
	detectedSecrets: string[];
	traps: GameState['traps'];
	detectedTraps: string[];
	characterConfig: GameState['characterConfig'];
	abilityCooldown: number;
	hazards: GameState['hazards'];
	npcs: GameState['npcs'];
	chests: GameState['chests'];
	lootDrops: GameState['lootDrops'];
	skillPoints: number;
	unlockedSkills: string[];
	rumors: GameState['rumors'];
	knownLanguages: string[];
	landmarks: GameState['landmarks'];
	heardStories: string[];
	lieCount: number;
	stats: GameStats;
	unlockedAchievements: string[];
	bestiary: GameState['bestiary'];
	hunger: number;
	thirst: number;
	survivalEnabled: boolean;
	turnCount: number;
	locationMode: LocationMode;
	overworldPos: { x: number; y: number } | null;
	currentLocationId: string | null;
	waypoint: { x: number; y: number } | null;
	overworldExplored: boolean[][] | null;
	discoveredPois: string[];
	inventory: (Item | null)[];
	equipment: Equipment;
	containers: WorldContainer[];
	activeBookReading: { bookId: string; currentPage: number } | null;
	inventoryOpen: boolean;
	activeContainer: string | null;
	inventoryCursor: number;
	inventoryPanel: 'inventory' | 'equipment' | 'container';
}

export function serializeState(state: GameState): string {
	const data: SaveData = {
		version: SAVE_VERSION,
		state: {
			player: state.player,
			enemies: state.enemies,
			map: {
				width: state.map.width,
				height: state.map.height,
				tiles: state.map.tiles,
				secretWalls: [...state.map.secretWalls]
			},
			messages: state.messages,
			level: state.level,
			gameOver: state.gameOver,
			xp: state.xp,
			characterLevel: state.characterLevel,
			visibility: state.visibility,
			sightRadius: state.sightRadius,
			detectedSecrets: [...state.detectedSecrets],
			traps: state.traps,
			detectedTraps: [...state.detectedTraps],
			characterConfig: state.characterConfig,
			abilityCooldown: state.abilityCooldown,
			hazards: state.hazards,
			npcs: state.npcs,
			chests: state.chests,
			lootDrops: state.lootDrops,
			skillPoints: state.skillPoints,
			unlockedSkills: state.unlockedSkills,
			rumors: state.rumors,
			knownLanguages: state.knownLanguages,
			landmarks: state.landmarks,
			heardStories: state.heardStories,
			lieCount: state.lieCount,
			stats: state.stats,
			unlockedAchievements: state.unlockedAchievements,
			bestiary: state.bestiary,
			hunger: state.hunger,
			thirst: state.thirst,
			survivalEnabled: state.survivalEnabled,
			turnCount: state.turnCount,
			locationMode: state.locationMode,
			overworldPos: state.overworldPos,
			currentLocationId: state.currentLocationId,
			waypoint: state.waypoint,
			overworldExplored: state.worldMap ? (state.worldMap as WorldMap).explored : null,
			discoveredPois: state.worldMap ? (state.worldMap as WorldMap).pois.filter(p => p.discovered).map(p => p.id) : [],
			inventory: state.inventory,
			equipment: state.equipment,
			containers: state.containers,
			activeBookReading: state.activeBookReading,
			inventoryOpen: state.inventoryOpen,
			activeContainer: state.activeContainer,
			inventoryCursor: state.inventoryCursor,
			inventoryPanel: state.inventoryPanel,
		}
	};
	return JSON.stringify(data);
}

export function deserializeState(json: string): GameState {
	const data: SaveData = JSON.parse(json);
	if (data.version !== SAVE_VERSION) {
		throw new Error(`Incompatible save version: ${data.version} (expected ${SAVE_VERSION})`);
	}
	const s = data.state;
	return {
		player: s.player,
		enemies: s.enemies,
		map: {
			width: s.map.width,
			height: s.map.height,
			tiles: s.map.tiles,
			secretWalls: new Set(s.map.secretWalls)
		},
		messages: s.messages,
		level: s.level,
		gameOver: s.gameOver,
		xp: s.xp,
		characterLevel: s.characterLevel,
		visibility: s.visibility,
		sightRadius: s.sightRadius,
		detectedSecrets: new Set(s.detectedSecrets),
		traps: s.traps,
		detectedTraps: new Set(s.detectedTraps),
		characterConfig: s.characterConfig,
		abilityCooldown: s.abilityCooldown,
		hazards: s.hazards,
		npcs: (s.npcs ?? []).map((n: any) => ({ ...n, moodTurns: n.moodTurns ?? 0 })),
		chests: s.chests ?? [],
		lootDrops: s.lootDrops ?? [],
		skillPoints: s.skillPoints ?? 0,
		unlockedSkills: s.unlockedSkills ?? [],
		rumors: s.rumors ?? [],
		knownLanguages: s.knownLanguages ?? [],
		landmarks: s.landmarks ?? [],
		heardStories: s.heardStories ?? [],
		lieCount: s.lieCount ?? 0,
		stats: s.stats ?? createDefaultStats(),
		unlockedAchievements: s.unlockedAchievements ?? [],
		bestiary: s.bestiary ?? {},
		hunger: s.hunger ?? 100,
		thirst: s.thirst ?? 100,
		survivalEnabled: s.survivalEnabled ?? true,
		turnCount: s.turnCount ?? 0,
		activeDialogue: null,
		locationMode: s.locationMode ?? 'location',
		worldMap: null,
		overworldPos: s.overworldPos ?? null,
		currentLocationId: s.currentLocationId ?? null,
		waypoint: s.waypoint ?? null,
		inventory: s.inventory ?? createEmptyInventory(),
		equipment: s.equipment ?? createEmptyEquipment(),
		containers: s.containers ?? [],
		activeBookReading: s.activeBookReading ?? null,
		inventoryOpen: s.inventoryOpen ?? false,
		activeContainer: s.activeContainer ?? null,
		inventoryCursor: s.inventoryCursor ?? 0,
		inventoryPanel: s.inventoryPanel ?? 'inventory',
	};

	// Regenerate world from seed and restore explored/discovered state
	if (result.characterConfig.worldSeed) {
		const worldMap = generateWorld(result.characterConfig.worldSeed);
		if (s.overworldExplored) {
			for (let y = 0; y < Math.min(worldMap.height, s.overworldExplored.length); y++) {
				for (let x = 0; x < Math.min(worldMap.width, s.overworldExplored[y].length); x++) {
					worldMap.explored[y][x] = s.overworldExplored[y][x];
				}
			}
		}
		if (s.discoveredPois) {
			for (const poiId of s.discoveredPois) {
				const poi = worldMap.pois.find(p => p.id === poiId);
				if (poi) poi.discovered = true;
			}
		}
		result.worldMap = worldMap;
	}

	return result;
}

export function saveGame(state: GameState): boolean {
	try {
		const json = serializeState(state);
		localStorage.setItem(SAVE_KEY, json);
		return true;
	} catch {
		return false;
	}
}

export function loadGame(): GameState | null {
	try {
		const json = localStorage.getItem(SAVE_KEY);
		if (!json) return null;
		return deserializeState(json);
	} catch {
		return null;
	}
}

export function hasSaveGame(): boolean {
	return localStorage.getItem(SAVE_KEY) !== null;
}

export function deleteSave(): void {
	localStorage.removeItem(SAVE_KEY);
}
