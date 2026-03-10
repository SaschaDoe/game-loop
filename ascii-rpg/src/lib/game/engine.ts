import type { GameState, Entity, Position, CharacterClass, CharacterConfig, Difficulty, NPC } from './types';
import { Visibility } from './types';
import { generateMap, getSpawnPositions } from './map';
import { createRng, randomSeedString, hashSeed } from './seeded-random';
import { createVisibilityGrid, updateVisibility } from './fov';
import { applyEffect, hasEffect } from './status-effects';
import { createMonster, createRareMonster, pickMonsterDef, pickBossDef, isBossLevel, RARE_SPAWN_CHANCE } from './monsters';
import { placeTraps, getTrapAt, detectAdjacentTraps, triggerTrap, disarmTrap, searchForTraps } from './traps';
import { useAbility, ABILITY_DEFS } from './abilities';
import { placeHazards } from './hazards';
import { applyDifficultyToEnemy, difficultySpawnCount, isPermadeath } from './difficulty';
import { placeChests, getChestAt, openChest } from './chests';
import { generateStartingLocation } from './locations';
import { NPC_DIALOGUE_TREES } from './dialogue';
import { getLootAt, pickupLoot } from './loot';
import { placeLandmarks, getLandmarkDef, getAdjacentLandmarks, examineLandmark } from './landmarks';
import { shortRest, longRest } from './rest';
import { createDefaultStats } from './achievements';
import { recordSeen } from './bestiary';
import { tickSurvival, getDehydrationPenalty, restoreHunger, restoreThirst, MAX_SURVIVAL } from './survival';
import { tickTime, getTimePhase } from './day-night';
import { generateWorld, type WorldMap } from './overworld';
import { createEmptyInventory, createEmptyEquipment, addToInventory, removeFromInventory, equipItem, unequipItem, addToContainer, removeFromContainer, getEquipmentBonuses, type WorldContainer, type Item, type EquipmentSlot, ITEM_CATALOG } from './items';
import { BOOK_CATALOG, getAllBookIds } from './books';
import { enterStealth, exitStealth, calculateBackstabDamage, processStealthTurn, generateNoise } from './stealth';
import { updateQuestProgress, checkTimedQuests } from './quests';
import { createAcademyState, tickAcademy } from './academy';
import { ARCHETYPE_ATTRIBUTES, CLASS_PROFILES, recalculateDerivedStats, getWeaponBonus, getArmorValue } from './magic';
import { SPELL_CATALOG } from './spells';
import { createEmptyMastery, getAvailableSpecializations } from './mastery';
import type { SchoolMastery } from './mastery';
import { addMessage, handlePlayerDeath, isBlocked, detectAdjacentSecrets, processAchievements, xpForLevel, effectiveSightRadius, checkLevelUp } from './engine-utils';
import { buildDialogueContext, checkCondition } from './dialogue-handler';
import { renderLocationColored } from './renderer';
import { moveEnemies, attemptPush, attemptFlee, processKill, ENVIRONMENTAL_KILL_BONUS } from './combat';
import { handleSpellTargeting, handleRitualChanneling, handleSpellMenu, quickCast, assignQuickCast as _assignQuickCast, learnSpell as _learnSpell, learnRitual } from './spell-handler';
import {
	handleOverworldInput as _handleOverworldInput,
	exitToOverworld,
	spawnRegionalNPCs,
	revealOverworldArea,
	getOverworldSightRadius,
	cacheCurrentLocation,
	renderOverworldColored,
} from './overworld-handler';

const MAP_W = 50;
const MAP_H = 24;

function createEnemy(pos: Position, level: number, difficulty: Difficulty, rng?: { next(): number }): Entity {
	const def = pickMonsterDef(level, rng);
	let enemy: Entity;
	const rareRoll = rng ? rng.next() : Math.random();
	if (rareRoll < RARE_SPAWN_CHANCE) {
		enemy = createRareMonster(pos, level, def, rng);
	} else {
		enemy = createMonster(pos, level, def);
	}
	applyDifficultyToEnemy(enemy, difficulty);
	const sleepRoll = rng ? rng.next() : Math.random();
	if (def.sleepChance && sleepRoll < def.sleepChance) {
		applyEffect(enemy, 'sleep', 999, 0);
	}
	return enemy;
}

function spawnEnemies(positions: Position[], level: number, difficulty: Difficulty, rng?: { next(): number }): Entity[] {
	const enemies = positions.map((p) => createEnemy(p, level, difficulty, rng));
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
	rogue: { hp: 0, atk: 1, sight: 1, description: 'A nimble adventurer with keen senses' },
	ranger: { hp: 1, atk: 0, sight: 2, description: 'A wilderness tracker with sharp eyes' },
	cleric: { hp: 3, atk: -1, sight: 0, description: 'A divine servant who heals and protects' },
	paladin: { hp: 5, atk: 0, sight: -1, description: 'A holy knight of unwavering resolve' },
	necromancer: { hp: -3, atk: 2, sight: 1, description: 'A dark mage who commands death itself' },
	bard: { hp: 0, atk: 0, sight: 1, description: 'A charming performer whose songs shape fate' },
	adept: { hp: 0, atk: 0, sight: 1, description: 'A disciplined practitioner of inner power' },
};

const DEFAULT_CONFIG: CharacterConfig = { name: 'Hero', characterClass: 'warrior', archetype: 'might', difficulty: 'normal', startingLocation: 'cave', worldSeed: '' };

export function createGame(config?: CharacterConfig): GameState {
	const rawCfg = config ? { ...config, worldSeed: config.worldSeed || randomSeedString() } : { ...DEFAULT_CONFIG, worldSeed: randomSeedString() };
	// Default archetype from class profile if not specified
	const cfg = { ...rawCfg, archetype: rawCfg.archetype ?? CLASS_PROFILES[rawCfg.characterClass].suggestedArchetype };

	// Generate the overworld
	const worldMap = generateWorld(cfg.worldSeed);

	// Find the starting settlement on the overworld
	const startSettlement = worldMap.settlements.find(s => s.isStartingLocation === cfg.startingLocation)
		?? worldMap.settlements[0];
	const overworldPos = { ...startSettlement.pos };

	// Reveal tiles around starting position (terrain-based sight radius)
	const startTile = worldMap.tiles[overworldPos.y][overworldPos.x];
	revealOverworldArea(worldMap, overworldPos, getOverworldSightRadius(startTile));

	// Generate starting location interior
	const locResult = generateStartingLocation(cfg.startingLocation, MAP_W, MAP_H);
	const sightRadius = DEFAULT_SIGHT_RADIUS;
	const visibility = createVisibilityGrid(MAP_W, MAP_H);

	// Set up archetype attributes
	const archetype = ARCHETYPE_ATTRIBUTES[cfg.archetype];
	const classProfile = CLASS_PROFILES[cfg.characterClass];

	const state: GameState = {
		player: {
			pos: locResult.playerPos,
			char: '@',
			color: '#ff0',
			name: cfg.name,
			hp: 10, // placeholder — recalculated below
			maxHp: 10,
			attack: 0,
			statusEffects: [],
			// Core attributes from archetype
			str: archetype.str,
			int: archetype.int,
			wil: archetype.wil,
			agi: archetype.agi,
			vit: archetype.vit,
			// Mana — calculated below
			mana: 0,
			maxMana: 0,
			// Derived stats — calculated below
			spellPower: 0,
			magicResist: 0,
			dodgeChance: 0,
			critChance: 0,
			physicalDefense: 0,
		},
		enemies: locResult.enemies,
		npcs: spawnRegionalNPCs(locResult.map, startSettlement.region, locResult.npcs),
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
		landmarks: [],
		heardStories: [],
		lieCount: 0,
		stats: createDefaultStats(),
		unlockedAchievements: [],
		bestiary: {},
		hunger: MAX_SURVIVAL,
		thirst: MAX_SURVIVAL,
		survivalEnabled: cfg.difficulty !== 'easy',
		turnCount: 0,
		locationMode: 'location',
		worldMap,
		overworldPos,
		currentLocationId: startSettlement.id,
		waypoint: null,
		inventory: createEmptyInventory(),
		equipment: createEmptyEquipment(),
		containers: [],
		activeBookReading: null,
		inventoryOpen: false,
		activeContainer: null,
		inventoryCursor: 0,
		inventoryPanel: 'inventory' as const,
		locationCache: {},
		quests: [],
		completedQuestIds: [],
		failedQuestIds: [],
		stealth: { isHidden: false, noiseLevel: 0, lastNoisePos: null, backstabReady: false },
		academyState: null,
		playerTitles: [],

		// Magic system (Epic 79)
		learnedSpells: [],
		spellCooldowns: {},
		quickCastSlots: [null, null, null, null],
		manaRegenBaseCounter: 0,
		manaRegenIntCounter: 0,
		spellMenuOpen: false,
		spellMenuCursor: 0,
		spellTargeting: null,

		// Mastery & Forbidden magic
		schoolMastery: createEmptyMastery() as unknown as Record<string, number>,
		forbiddenCosts: {
			corruption: 0,
			paradoxBaseline: 0,
			maxHpLost: 0,
			sanityLost: 0,
			soulCapLost: 0,
		},
		leyLineLevel: 2,

		// Ritual system
		learnedRituals: [],
		ritualChanneling: null,
		activeWards: [],
		teleportAnchors: {},
		activeSummon: null,
		scriedLevel: null,
		terrainEffects: [],

		// Class specialization
		specialization: null,
		pendingSpecialization: false,

		// Forbidden magic passives
		forbiddenPassives: [],
	};

	// Academy initialization
	if (cfg.startingLocation === 'academy') {
		if (cfg.characterClass === 'mage') {
			// Mages are recognized as graduates
			state.academyState = createAcademyState(false, true, 0);
			state.playerTitles.push('Archmage Apprentice');
		} else {
			// Others start enrolled
			state.academyState = createAcademyState(true, false, 0);
		}
	}

	// Give starting equipment based on class
	const CLASS_STARTING_ITEMS: Record<CharacterClass, { equip: [EquipmentSlot, string][]; inventory: string[] }> = {
		warrior:     { equip: [['leftHand', 'iron_sword'], ['rightHand', 'wooden_shield'], ['body', 'leather_armor']], inventory: ['health_potion', 'health_potion'] },
		mage:        { equip: [['leftHand', 'mage_staff'], ['body', 'cloth_robe']], inventory: ['health_potion', 'health_potion', 'health_potion'] },
		rogue:       { equip: [['leftHand', 'dagger'], ['back', 'traveler_cloak']], inventory: ['health_potion', 'health_potion'] },
		ranger:      { equip: [['leftHand', 'shortbow'], ['back', 'quiver'], ['body', 'leather_armor']], inventory: ['health_potion', 'bread'] },
		cleric:      { equip: [['leftHand', 'holy_mace'], ['rightHand', 'holy_symbol'], ['body', 'chainmail']], inventory: ['health_potion', 'health_potion'] },
		paladin:     { equip: [['leftHand', 'paladin_sword'], ['rightHand', 'tower_shield'], ['head', 'plate_helm']], inventory: ['health_potion'] },
		necromancer: { equip: [['leftHand', 'bone_staff'], ['back', 'death_shroud']], inventory: ['health_potion', 'health_potion', 'health_potion'] },
		bard:        { equip: [['leftHand', 'rapier'], ['rightHand', 'lute'], ['head', 'fancy_hat']], inventory: ['health_potion', 'bread', 'water_flask'] },
		adept:       { equip: [['leftHand', 'mage_staff'], ['body', 'cloth_robe']], inventory: ['health_potion', 'health_potion', 'health_potion'] },
	};
	const startingGear = CLASS_STARTING_ITEMS[cfg.characterClass];
	for (const [slot, itemId] of startingGear.equip) {
		const item = ITEM_CATALOG[itemId];
		if (item) state.equipment[slot] = { ...item };
	}
	for (const itemId of startingGear.inventory) {
		const item = ITEM_CATALOG[itemId];
		if (item) addToInventory(state.inventory, { ...item });
	}

	// Calculate derived stats from archetype attributes + equipment
	const weaponBonus = getWeaponBonus(state.equipment);
	const armorValue = getArmorValue(state.equipment);
	recalculateDerivedStats(state.player, armorValue, weaponBonus, archetype.manaModifier);
	state.player.hp = state.player.maxHp; // Start at full HP
	state.player.mana = state.player.maxMana; // Start at full mana

	// Apply sight radius based on archetype (Arcane sees further)
	if (cfg.archetype === 'arcane') state.sightRadius += 2;
	else if (cfg.archetype === 'finesse') state.sightRadius += 1;

	// Grant starting spell from class profile
	if (classProfile.startingSpell && SPELL_CATALOG[classProfile.startingSpell]) {
		state.learnedSpells.push(classProfile.startingSpell);
		state.quickCastSlots[0] = classProfile.startingSpell;
	}

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
	{ char: 'g', color: '#8f4', name: 'Grikkle', dialogue: ['Psst! Hey! You! Big-person! Grikkle has GOODS!', 'Best goods! Premium quality!', 'Fell off back of cart! Very legitimate!'], gives: { hp: 3 }, minLevel: 1, weight: 3 },
];

const NPC_SPAWN_CHANCE = 0.3;

function spawnDungeonNPCs(map: { width: number; height: number; tiles: string[][] }, level: number, occupied: Set<string>, rng?: { next(): number }): NPC[] {
	const spawnRoll = rng ? rng.next() : Math.random();
	if (spawnRoll > NPC_SPAWN_CHANCE) return [];
	const eligible = DUNGEON_NPCS.filter(d => level >= d.minLevel);
	if (eligible.length === 0) return [];
	const totalWeight = eligible.reduce((s, d) => s + d.weight, 0);
	const weightRoll = rng ? rng.next() : Math.random();
	let roll = weightRoll * totalWeight;
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
	const posRoll = rng ? rng.next() : Math.random();
	const pos = floors[Math.floor(posRoll * floors.length)];
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
		moodTurns: 0,
	}];
}

function newLevel(level: number, difficulty: Difficulty = 'normal', worldSeed: string = ''): GameState {
	// Create a deterministic RNG for this level from worldSeed + level
	const levelSeed = hashSeed(worldSeed + ':level:' + level);
	const rng = createRng(levelSeed);

	const baseEnemyCount = 3 + level;
	const enemyCount = difficultySpawnCount(baseEnemyCount, difficulty);
	const map = generateMap(MAP_W, MAP_H, level, rng);
	const spawns = getSpawnPositions(map, 1 + enemyCount, rng);
	const playerPos = spawns[0];
	const enemyPositions = spawns.slice(1);
	const sightRadius = DEFAULT_SIGHT_RADIUS;
	const visibility = createVisibilityGrid(map.width, map.height);
	updateVisibility(visibility, map, playerPos, sightRadius);

	const traps = placeTraps(map, level, rng);
	// Don't place traps on player spawn
	const filteredTraps = traps.filter((t) => !(t.pos.x === playerPos.x && t.pos.y === playerPos.y));

	const hazards = placeHazards(map, level, rng);
	// Don't place hazards on player spawn
	const filteredHazards = hazards.filter((h) => !(h.pos.x === playerPos.x && h.pos.y === playerPos.y));

	const chests = placeChests(map, level, rng);
	const filteredChests = chests.filter((c) => !(c.pos.x === playerPos.x && c.pos.y === playerPos.y));

	// Build occupied positions set for NPC spawning
	const occupiedPositions = new Set<string>();
	occupiedPositions.add(`${playerPos.x},${playerPos.y}`);
	for (const ep of enemyPositions) occupiedPositions.add(`${ep.x},${ep.y}`);
	for (const t of filteredTraps) occupiedPositions.add(`${t.pos.x},${t.pos.y}`);
	for (const c of filteredChests) occupiedPositions.add(`${c.pos.x},${c.pos.y}`);
	const npcs = spawnDungeonNPCs(map, level, occupiedPositions, rng);
	for (const n of npcs) occupiedPositions.add(`${n.pos.x},${n.pos.y}`);
	const landmarks = placeLandmarks(map, level, occupiedPositions, rng);
	for (const lm of landmarks) occupiedPositions.add(`${lm.pos.x},${lm.pos.y}`);

	// Place containers in dungeon levels
	const containers: WorldContainer[] = [];
	if (level >= 1) {
		const containerCount = Math.floor(rng.next() * 3); // 0-2 containers
		for (let ci = 0; ci < containerCount; ci++) {
			// Find a free floor tile
			let placed = false;
			for (let attempt = 0; attempt < 50 && !placed; attempt++) {
				const cx = Math.floor(rng.next() * map.width);
				const cy = Math.floor(rng.next() * map.height);
				const ckey = `${cx},${cy}`;
				if (map.tiles[cy][cx] === '.' && !occupiedPositions.has(ckey)) {
					let containerChar: string;
					let containerColor: string;
					let containerName: string;
					let containerSize: 'small' | 'medium' = 'small';

					if (level >= 5 && rng.next() < 0.3) {
						// Bookshelf
						containerChar = '#';
						containerColor = '#886644';
						containerName = 'Bookshelf';
						containerSize = 'medium';
					} else if (level >= 3) {
						containerChar = 'O';
						containerColor = '#aa8844';
						containerName = 'Wooden Chest';
						containerSize = 'medium';
					} else {
						containerChar = 'o';
						containerColor = '#aa8844';
						containerName = 'Small Box';
						containerSize = 'small';
					}

					const containerItems: import('./items').Item[] = [];

					// 30% chance of a consumable
					if (rng.next() < 0.30) {
						const consumables = ['health_potion', 'bread', 'water_flask'];
						const pick = consumables[Math.floor(rng.next() * consumables.length)];
						const item = ITEM_CATALOG[pick];
						if (item) containerItems.push({ ...item });
					}

					// 20% chance of equipment (scale with level)
					if (rng.next() < 0.20) {
						const equipKeys = Object.keys(ITEM_CATALOG).filter(k => ITEM_CATALOG[k].type === 'equipment');
						if (equipKeys.length > 0) {
							const eqPick = equipKeys[Math.floor(rng.next() * equipKeys.length)];
							const item = ITEM_CATALOG[eqPick];
							if (item) containerItems.push({ ...item });
						}
					}

					// 15% chance of a book
					if (rng.next() < 0.15) {
						const bookIds = getAllBookIds();
						if (bookIds.length > 0) {
							const bookPick = bookIds[Math.floor(rng.next() * bookIds.length)];
							const book = BOOK_CATALOG[bookPick];
							if (book) containerItems.push({ ...book });
						}
					}

					// 20% chance of a reagent
					if (rng.next() < 0.20) {
						let reagentPool: string[];
						if (level <= 3) {
							reagentPool = ['arcane_dust', 'starfern'];
						} else if (level <= 6) {
							reagentPool = ['arcane_dust', 'starfern', 'moonwater_vial', 'dreamleaf'];
						} else {
							reagentPool = ['arcane_dust', 'moonwater_vial', 'dreamleaf', 'void_salt', 'lightning_shard'];
						}
						const reagentId = reagentPool[Math.floor(rng.next() * reagentPool.length)];
						const reagentItem = ITEM_CATALOG[reagentId];
						if (reagentItem) containerItems.push({ ...reagentItem });
					}

					// 5% chance of a ritual tome (level 3+)
					if (level >= 3 && rng.next() < 0.05) {
						const tomeKeys = Object.keys(ITEM_CATALOG).filter(k => ITEM_CATALOG[k].teachesRitual);
						if (tomeKeys.length > 0) {
							const tomePick = tomeKeys[Math.floor(rng.next() * tomeKeys.length)];
							const tome = ITEM_CATALOG[tomePick];
							if (tome) containerItems.push({ ...tome });
						}
					}

					const container: WorldContainer = {
						id: `container_${level}_${ci}`,
						pos: { x: cx, y: cy },
						size: containerSize,
						items: containerItems,
						char: containerChar,
						color: containerColor,
						name: containerName,
					};
					containers.push(container);
					occupiedPositions.add(ckey);
					placed = true;
				}
			}
		}
	}

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
		enemies: spawnEnemies(enemyPositions, level, difficulty, rng),
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
		landmarks,
		heardStories: [],
		lieCount: 0,
		stats: createDefaultStats(),
		unlockedAchievements: [],
		bestiary: {},
		hunger: MAX_SURVIVAL,
		thirst: MAX_SURVIVAL,
		survivalEnabled: difficulty !== 'easy',
		turnCount: 0,
		locationMode: 'location' as const,
		worldMap: null,
		overworldPos: null,
		currentLocationId: null,
		waypoint: null,
		inventory: createEmptyInventory(),
		equipment: createEmptyEquipment(),
		containers,
		activeBookReading: null,
		inventoryOpen: false,
		activeContainer: null,
		inventoryCursor: 0,
		inventoryPanel: 'inventory' as const,
		locationCache: {},
		quests: [],
		completedQuestIds: [],
		failedQuestIds: [],
		stealth: { isHidden: false, noiseLevel: 0, lastNoisePos: null, backstabReady: false },
		academyState: null,
		playerTitles: [],
		// Magic system defaults
		learnedSpells: [],
		spellCooldowns: {},
		quickCastSlots: [null, null, null, null],
		manaRegenBaseCounter: 0,
		manaRegenIntCounter: 0,
		spellMenuOpen: false,
		spellMenuCursor: 0,
		spellTargeting: null,

		// Mastery & Forbidden magic
		schoolMastery: createEmptyMastery() as unknown as Record<string, number>,
		forbiddenCosts: {
			corruption: 0,
			paradoxBaseline: 0,
			maxHpLost: 0,
			sanityLost: 0,
			soulCapLost: 0,
		},
		leyLineLevel: 2,

		// Ritual system
		learnedRituals: [],
		ritualChanneling: null,
		activeWards: [],
		teleportAnchors: {},
		activeSummon: null,
		scriedLevel: null,
		terrainEffects: [],

		// Class specialization
		specialization: null,
		pendingSpecialization: false,

		// Forbidden magic passives
		forbiddenPassives: [],
	};
	for (const enemy of state.enemies) {
		recordSeen(state.bestiary, enemy);
	}
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

/** Get adjacent container (within 1 tile of player) */
export function getAdjacentContainer(state: GameState): WorldContainer | null {
	const { x, y } = state.player.pos;
	const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
	for (const [dx, dy] of dirs) {
		const ct = state.containers.find(c => c.pos.x === x + dx && c.pos.y === y + dy);
		if (ct) return ct;
	}
	// Also check current tile
	const ct = state.containers.find(c => c.pos.x === x && c.pos.y === y);
	return ct ?? null;
}

/** Open inventory screen */
export function openInventory(state: GameState): GameState {
	state.inventoryOpen = true;
	state.inventoryCursor = 0;
	state.inventoryPanel = 'inventory';
	state.activeContainer = null;
	return { ...state };
}

/** Close inventory/container screen */
export function closeInventory(state: GameState): GameState {
	state.inventoryOpen = false;
	state.activeContainer = null;
	state.activeBookReading = null;
	return { ...state };
}

/** Open a container (split view) */
export function openContainer(state: GameState, containerId: string): GameState {
	state.inventoryOpen = true;
	state.activeContainer = containerId;
	state.inventoryCursor = 0;
	state.inventoryPanel = 'inventory';
	return { ...state };
}

/** Use/interact with the selected inventory item */
export function useInventoryItem(state: GameState, index: number): GameState {
	const item = state.inventory[index];
	if (!item) return state;

	// Ritual tomes — consume to learn ritual
	if (item.teachesRitual) {
		if (state.learnedRituals.includes(item.teachesRitual)) {
			addMessage(state, `You already know this ritual.`, 'info');
			return { ...state };
		}
		learnRitual(state, item.teachesRitual);
		state.inventory[index] = null;
		return { ...state };
	}

	if (item.type === 'book' && item.pages) {
		state.activeBookReading = { bookId: item.id, currentPage: 0 };
		return { ...state };
	}

	if (item.type === 'consumable' && item.consumeEffect) {
		if (item.consumeEffect.hp) {
			state.player.hp = Math.max(1, Math.min(state.player.maxHp, state.player.hp + item.consumeEffect.hp));
			if (item.consumeEffect.hp > 0) {
				addMessage(state, `Used ${item.name}. +${item.consumeEffect.hp} HP.`, 'healing');
			} else {
				addMessage(state, `Used ${item.name}. ${item.consumeEffect.hp} HP.`, 'damage_taken');
			}
		}
		if (item.consumeEffect.hunger) {
			state.hunger = Math.min(100, state.hunger + item.consumeEffect.hunger);
			addMessage(state, `Ate ${item.name}. Hunger restored.`, 'info');
		}
		if (item.consumeEffect.thirst) {
			state.thirst = Math.min(100, state.thirst + item.consumeEffect.thirst);
			addMessage(state, `Drank ${item.name}. Thirst restored.`, 'info');
		}
		if (item.consumeEffect.mana) {
			const maxMana = state.player.maxMana ?? 0;
			const currentMana = state.player.mana ?? 0;
			const restored = Math.min(item.consumeEffect.mana, maxMana - currentMana);
			state.player.mana = Math.min(maxMana, currentMana + item.consumeEffect.mana);
			if (restored > 0) {
				addMessage(state, `${item.name} restored ${restored} mana.`, 'info');
			}
		}
		state.inventory[index] = null;
		return { ...state };
	}

	if (item.type === 'equipment') {
		const result = equipItem(state.inventory, state.equipment, index);
		addMessage(state, result.message, result.success ? 'info' : 'damage_taken');
		return { ...state };
	}

	addMessage(state, `You can't use ${item.name}.`, 'info');
	return { ...state };
}

/** Drop an inventory item on the ground */
export function dropInventoryItem(state: GameState, index: number): GameState {
	const item = removeFromInventory(state.inventory, index);
	if (!item) return state;
	// Item is simply removed (for now, no ground items)
	addMessage(state, `Dropped ${item.name}.`, 'info');
	return { ...state };
}

/** Unequip an item from equipment to inventory */
export function unequipToInventory(state: GameState, slot: EquipmentSlot): GameState {
	const result = unequipItem(state.inventory, state.equipment, slot);
	addMessage(state, result.message, result.success ? 'info' : 'damage_taken');
	return { ...state };
}

/** Take an item from the active container into inventory */
export function takeFromContainer(state: GameState, containerIndex: number): GameState {
	const container = state.containers.find(c => c.id === state.activeContainer);
	if (!container) return state;
	const item = container.items[containerIndex];
	if (!item) return state;
	if (!addToInventory(state.inventory, item)) {
		addMessage(state, 'Inventory is full!', 'damage_taken');
		return { ...state };
	}
	removeFromContainer(container, containerIndex);
	addMessage(state, `Took ${item.name}.`, 'info');
	return { ...state };
}

/** Store an inventory item into the active container */
export function storeInContainer(state: GameState, inventoryIndex: number): GameState {
	const container = state.containers.find(c => c.id === state.activeContainer);
	if (!container) return state;
	const item = state.inventory[inventoryIndex];
	if (!item) return state;
	if (!addToContainer(container, item)) {
		addMessage(state, `${container.name} is full!`, 'damage_taken');
		return { ...state };
	}
	state.inventory[inventoryIndex] = null;
	addMessage(state, `Stored ${item.name}.`, 'info');
	return { ...state };
}

/** Flip book page */
export function flipBookPage(state: GameState, direction: number): GameState {
	if (!state.activeBookReading) return state;
	const book = Object.values(ITEM_CATALOG).find(i => i.id === state.activeBookReading!.bookId)
		?? Object.values(BOOK_CATALOG).find(i => i.id === state.activeBookReading!.bookId);
	if (!book?.pages) return state;
	const newPage = state.activeBookReading.currentPage + direction;
	if (newPage < 0 || newPage >= book.pages.length) return state;
	state.activeBookReading = { ...state.activeBookReading, currentPage: newPage };
	return { ...state };
}

/** Close book reader */
export function closeBook(state: GameState): GameState {
	state.activeBookReading = null;
	return { ...state };
}

/** Get the current book being read */
export function getActiveBook(state: GameState): Item | null {
	if (!state.activeBookReading) return null;
	return Object.values(ITEM_CATALOG).find(i => i.id === state.activeBookReading!.bookId)
		?? Object.values(BOOK_CATALOG).find(i => i.id === state.activeBookReading!.bookId)
		?? null;
}

export { _assignQuickCast as assignQuickCast, _learnSpell as learnSpell };

export function handleInput(state: GameState, key: string): GameState {
	// Overworld mode: delegate to overworld handler
	if (state.locationMode === 'overworld') {
		return _handleOverworldInput(state, key, createGame, newLevel);
	}

	// Block game input during dialogue
	if (state.activeDialogue) return state;

	// Ritual channeling in progress — delegate to spell-handler
	if (state.ritualChanneling) return handleRitualChanneling(state, key);

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

	// Spell targeting mode — delegate to spell-handler
	if (state.spellTargeting) return handleSpellTargeting(state, key);

	// Spell menu open — delegate to spell-handler
	if (state.spellMenuOpen) return handleSpellMenu(state, key);

	// Specialization selection mode
	if (state.pendingSpecialization) {
		const specs = getAvailableSpecializations(state.characterLevel, state.schoolMastery as unknown as SchoolMastery, state.specialization);
		const index = parseInt(key) - 1;
		if (index >= 0 && index < specs.length) {
			state.specialization = specs[index].id;
			state.pendingSpecialization = false;
			addMessage(state, `You have become a ${specs[index].name}! ${specs[index].description}`, 'level_up');
			return { ...state };
		}
		if (key === 'Escape') {
			state.pendingSpecialization = false; // skip for now
			return { ...state };
		}
		return state;
	}

	// Open spell menu (M key)
	if (key === 'm') {
		if (state.learnedSpells.length === 0) {
			addMessage(state, 'You have not learned any spells yet.', 'info');
			return { ...state };
		}
		state.spellMenuOpen = true;
		state.spellMenuCursor = 0;
		return { ...state };
	}

	// Quick-cast keys (1-4)
	if (key >= '1' && key <= '4') {
		return quickCast(state, parseInt(key) - 1);
	}

	// Teleportation Circle return (R key)
	if (key === 'r' && !state.gameOver) {
		const anchor = state.teleportAnchors[state.level];
		if (anchor) {
			if ((state.player.mana ?? 0) < 5) {
				addMessage(state, 'Not enough mana to teleport! (need 5)', 'warning');
				return { ...state };
			}
			state.player.mana = (state.player.mana ?? 0) - 5;
			state.player.pos = { x: anchor.x, y: anchor.y };
			updateVisibility(state.visibility, state.map, state.player.pos, effectiveSightRadius(state));
			addMessage(state, 'You step through the teleportation circle and reappear at your anchor point!', 'magic');
			moveEnemies(state);
			return { ...state };
		}
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
			// Handle kills from abilities (whirlwind, rain of arrows, holy smite, etc.)
			const killed = state.enemies.filter((e) => e.hp <= 0);
			for (const enemy of killed) {
				processKill(state, enemy);
			}
			state.enemies = state.enemies.filter((e) => e.hp > 0);
			if (killed.length > 0) {
				checkLevelUp(state);
				processAchievements(state);
			}
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
			state.stats.landmarksExamined++;
			addMessage(state, `[${def?.name ?? 'Landmark'}] ${text}`, 'discovery');

			// Reward landmarks grant gameplay bonuses
			if (lm.type === 'riddle_inscription') {
				const xpGain = 8 + state.characterLevel * 3;
				state.xp += xpGain;
				addMessage(state, `The riddle's wisdom grants you +${xpGain} XP.`, 'level_up');
				checkLevelUp(state);
			} else if (lm.type === 'ancient_mechanism') {
				state.player.attack += 1;
				addMessage(state, 'You salvage a weapon component. (+1 ATK)', 'discovery');
			}
		}

		// Check for adjacent containers
		const adjacentContainer = getAdjacentContainer(state);
		if (adjacentContainer) {
			return openContainer(state, adjacentContainer.id);
		}

		if (found.length === 0 && nearbyLandmarks.length === 0 && !adjacentContainer) {
			addMessage(state, 'You search the area but find nothing.', 'info');
		}
		moveEnemies(state);
		return { ...state };
	}

	// Short rest key
	if (key === 'r') {
		if (hasEffect(state.player, 'stun')) {
			addMessage(state, 'You are stunned and cannot act!', 'damage_taken');
			moveEnemies(state);
			return { ...state };
		}
		const result = shortRest(state);
		for (const msg of result.messages) {
			addMessage(state, msg.text, msg.type);
		}
		if (result.rested) {
			state.player.hp += result.hpRestored;
			moveEnemies(state);
		}
		return { ...state };
	}

	// Long rest key
	if (key === 'R') {
		if (hasEffect(state.player, 'stun')) {
			addMessage(state, 'You are stunned and cannot act!', 'damage_taken');
			moveEnemies(state);
			return { ...state };
		}
		const result = longRest(state);
		for (const msg of result.messages) {
			addMessage(state, msg.text, msg.type);
		}
		if (result.rested) {
			state.player.hp += result.hpRestored;
			// Long rest restores hunger and thirst
			const foodMsg = restoreHunger(state, 30);
			if (foodMsg.text) addMessage(state, foodMsg.text, foodMsg.type);
			const waterMsg = restoreThirst(state, 30);
			if (waterMsg.text) addMessage(state, waterMsg.text, waterMsg.type);
			if (result.ambush) {
				// Spawn ambush enemies near player
				const ambushCount = 1 + Math.floor(Math.random() * 2);
				for (let i = 0; i < ambushCount; i++) {
					const ox = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 2));
					const oy = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 2));
					const ex = state.player.pos.x + ox;
					const ey = state.player.pos.y + oy;
					if (ex >= 0 && ex < state.map.width && ey >= 0 && ey < state.map.height && state.map.tiles[ey][ex] === '.') {
						const def = pickMonsterDef(state.level);
						const enemy = createMonster({ x: ex, y: ey }, state.level, def);
						applyDifficultyToEnemy(enemy, state.characterConfig.difficulty);
						state.enemies.push(enemy);
					}
				}
			}
			moveEnemies(state);
		}
		return { ...state };
	}

	// Stealth toggle (Z key)
	if (key === 'z') {
		if (state.stealth.isHidden) {
			exitStealth(state);
			addMessage(state, 'You step out of the shadows.', 'info');
		} else {
			const result = enterStealth(state);
			addMessage(state, result.message, result.success ? 'discovery' : 'info');
		}
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
			let startId = (npc.dialogueIndex > 0 && tree.returnNode) ? tree.returnNode : tree.startNode;
			// Mood-specific return nodes: if NPC has been spoken to and has a mood-specific return node, use it
			if (npc.dialogueIndex > 0 && npc.mood !== 'neutral') {
				const moodReturnId = `return_${npc.mood}`;
				if (tree.nodes[moodReturnId]) {
					startId = moodReturnId;
				}
			}
			// Conditional start nodes (e.g. mage at academy gets different greeting)
			if (tree.conditionalStartNodes && npc.dialogueIndex === 0) {
				const ctx = buildDialogueContext(state, npc.mood);
				for (const csn of tree.conditionalStartNodes) {
					if (checkCondition(csn.condition, ctx) && tree.nodes[csn.nodeId]) {
						startId = csn.nodeId;
						break;
					}
				}
			}
			// Hostile NPCs may refuse dialogue entirely
			if (npc.mood === 'hostile' && npc.dialogueIndex > 0 && !tree.nodes[`return_hostile`]) {
				addMessage(state, `${npc.name} glares at you and refuses to speak.`, 'npc');
				moveEnemies(state);
				return { ...state };
			}
			state.activeDialogue = {
				npcName: npc.name,
				npcChar: npc.char,
				npcColor: npc.color,
				currentNodeId: startId,
				tree,
				visitedNodes: new Set<string>(),
				givenItems: npc.given,
				mood: npc.mood,
				context: buildDialogueContext(state, npc.mood),
			};
			if (npc.dialogueIndex === 0) {
				npc.dialogueIndex = 1;
				state.stats.npcsSpokenTo++;
				const talkMsgs = updateQuestProgress(state, 'talk', npc.name);
				for (const tm of talkMsgs) addMessage(state, tm, 'discovery');
			}
			return { ...state };
		}
		// Fallback for NPCs without dialogue trees
		if (npc.dialogueIndex === 0) {
			state.stats.npcsSpokenTo++;
			const talkMsgs = updateQuestProgress(state, 'talk', npc.name);
			for (const tm of talkMsgs) addMessage(state, tm, 'discovery');
		}
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
		state.stats.chestsOpened++;
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
		const dehydrationPenalty = getDehydrationPenalty(state);
		const baseDmg = Math.max(1, (state.player.attack - curseReduction - dehydrationPenalty) + Math.floor(Math.random() * 3));

		// Backstab check: if player is hidden and has backstab ready
		const isBackstab = state.stealth.isHidden && state.stealth.backstabReady;
		let dmg: number;
		if (isBackstab) {
			const backstabResult = calculateBackstabDamage(baseDmg, state.characterConfig.characterClass, true);
			dmg = backstabResult.damage;
			state.stats.backstabs++;
			if (target.hp - dmg <= 0) state.stats.stealthKills++;
			exitStealth(state);
			addMessage(state, `Backstab! You strike ${target.name} from the shadows for ${dmg}!`, 'player_attack');
		} else if (isSneakAttack) {
			dmg = baseDmg * 2;
			addMessage(state, `Sneak attack! You hit ${target.name} for ${dmg}!`, 'player_attack');
		} else {
			dmg = baseDmg;
			// Break stealth on attack even if not backstab
			if (state.stealth.isHidden) exitStealth(state);
			addMessage(state, `You hit ${target.name} for ${dmg}!`, 'player_attack');
		}
		target.hp -= dmg;
		state.stats.damageDealt += dmg;
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
			const multiplier = envKill ? ENVIRONMENTAL_KILL_BONUS : 1;
			processKill(state, target, multiplier);
			state.enemies = state.enemies.filter((e) => e !== target);
			checkLevelUp(state);
			processAchievements(state);
		}
		// Generate combat noise for stealth detection
		if (state.stealth.isHidden) {
			const equipBonuses = getEquipmentBonuses(state.equipment);
			state.stealth.noiseLevel = generateNoise('combat', equipBonuses.noiseReduction ?? 0);
			state.stealth.lastNoisePos = { ...state.player.pos };
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
	// Generate walk noise for stealth detection
	if (state.stealth.isHidden) {
		const equipBonuses = getEquipmentBonuses(state.equipment);
		state.stealth.noiseLevel = generateNoise('walk', equipBonuses.noiseReduction ?? 0);
		state.stealth.lastNoisePos = { ...state.player.pos };
	}
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
			if (disarmResult.success) state.stats.trapsDisarmed++;
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
		// Potions also restore some thirst
		const thirstMsg = restoreThirst(state, 15);
		if (thirstMsg.text) addMessage(state, thirstMsg.text, thirstMsg.type);
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
		// Level 0 stairs: exit to overworld (if we have one)
		if (state.level === 0 && state.worldMap && state.overworldPos) {
			return exitToOverworld(state);
		}

		// Cache current dungeon level before descending
		cacheCurrentLocation(state);

		const nextLevel = state.level === 0 ? 1 : state.level + 1;
		const next = newLevel(nextLevel, state.characterConfig.difficulty, state.characterConfig.worldSeed);
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
		next.knownLanguages = [...state.knownLanguages];
		next.heardStories = [...state.heardStories];
		next.lieCount = state.lieCount;
		next.stats = { ...state.stats };
		next.stats.levelsCleared++;
		next.stats.maxDungeonLevel = Math.max(next.stats.maxDungeonLevel, next.level);
		next.unlockedAchievements = [...state.unlockedAchievements];
		next.bestiary = { ...state.bestiary };
		next.hunger = state.hunger;
		next.thirst = state.thirst;
		next.survivalEnabled = state.survivalEnabled;
		next.turnCount = state.turnCount;
		// Carry overworld state through dungeon levels
		next.worldMap = state.worldMap;
		next.overworldPos = state.overworldPos;
		next.locationMode = 'location';
		next.currentLocationId = state.currentLocationId;
		next.waypoint = state.waypoint;
		// Carry inventory state through dungeon levels
		next.inventory = [...state.inventory];
		next.equipment = { ...state.equipment };
		next.containers = [...state.containers];
		next.locationCache = state.locationCache;
		// Carry ritual state through dungeon levels
		next.learnedRituals = [...state.learnedRituals];
		next.ritualChanneling = null; // Cancel any active channeling on descend
		next.activeWards = []; // Wards don't carry between levels
		next.teleportAnchors = { ...state.teleportAnchors };
		next.activeSummon = null; // Summon doesn't follow between levels
		next.scriedLevel = state.scriedLevel;
		// Set ley line level based on dungeon depth
		const isAcademyDungeon = (state.currentLocationId ?? '').includes('academy');
		if (isAcademyDungeon) {
			next.leyLineLevel = 4;
		} else if (nextLevel >= 8) {
			next.leyLineLevel = 1 + (nextLevel % 3); // 1, 2, or 3
		} else if (nextLevel >= 4) {
			next.leyLineLevel = nextLevel % 2 === 0 ? 2 : 3;
		} else {
			next.leyLineLevel = 2;
		}
		processAchievements(next);
		addMessage(next, `Descended to dungeon level ${next.level}.`);

		// Apply scrying — reveal layout of the new level
		if (next.scriedLevel === next.level) {
			for (let sy = 0; sy < next.map.height; sy++) {
				for (let sx = 0; sx < next.map.width; sx++) {
					if (next.visibility[sy][sx] === Visibility.Unexplored) {
						next.visibility[sy][sx] = Visibility.Explored;
					}
				}
			}
			next.scriedLevel = null;
			addMessage(next, 'Your scrying visions crystallize — the layout of this level is revealed!', 'magic');
		}

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

	// Tick time (day-night cycle) — also increments turnCount
	const timeResult = tickTime(state);
	if (timeResult.phaseChanged && timeResult.message) {
		addMessage(state, timeResult.message);
	}

	// Tick academy day transitions
	const academyMsgs = tickAcademy(state);
	for (const msg of academyMsgs) {
		state.messages.push(msg);
	}

	// Tick survival (hunger/thirst)
	const survivalResult = tickSurvival(state);
	for (const msg of survivalResult.messages) {
		state.messages.push(msg);
	}

	// Process stealth detection per turn
	if (state.stealth.isHidden) {
		const equipBonuses = getEquipmentBonuses(state.equipment);
		const lightLevel = getTimePhase(state.turnCount) === 'night' ? 0.3 : 0.8;
		const stealthMsgs = processStealthTurn(state, state.enemies, lightLevel, equipBonuses.stealthBonus ?? 0, equipBonuses.noiseReduction ?? 0);
		for (const sm of stealthMsgs) addMessage(state, sm, 'danger');
	}

	// Check timed quests
	const timedQuestMsgs = checkTimedQuests(state);
	for (const tqm of timedQuestMsgs) addMessage(state, tqm, 'danger');

	// Auto-return to overworld after clearing encounter arena
	if (state.currentLocationId === 'encounter' && state.worldMap && state.overworldPos && state.enemies.length === 0 && state.locationMode === 'location') {
		addMessage(state, 'The encounter is over. You return to the overworld.', 'discovery');
		return exitToOverworld(state);
	}

	return { ...state };
}

export function renderColored(state: GameState): { char: string; color: string }[][] {
	if (state.locationMode === 'overworld') {
		return renderOverworldColored(state);
	}
	return renderLocationColored(state);
}

export { xpForLevel, xpReward, effectiveSightRadius, addMessage, isBlocked, handlePlayerDeath, checkLevelUp, applyXpMultiplier, processAchievements, detectAdjacentSecrets, tryDropLoot, tickEntityEffects, relocateNpc, tickNpcMoods } from './engine-utils';
export { learnRitual, handleSpellTargeting, handleRitualChanneling, handleSpellMenu, tickTerrainEffects, checkRitualInterrupt } from './spell-handler';
export { buildDialogueContext, checkCondition, rollSocialCheck, SOCIAL_SKILL_DISPLAY, handleDialogueChoice, canDetectLies, MOOD_DISPLAY, npcMoodColor, garbleText, closeDialogue, SOCIAL_CLASS_BONUS } from './dialogue-handler';
export { render, dimColor, renderLocationColored } from './renderer';
export { moveEnemies, attemptPush, attemptFlee, processKill, DODGE_CHANCE, BLOCK_REDUCTION, PUSH_CHANCE, ENVIRONMENTAL_KILL_BONUS } from './combat';
export type { PushResult } from './combat';
export { handleOverworldInput, exitToOverworld, dangerDisplay, getOverworldInfo, renderOverworldColored, renderWorldMap, getWaypointIndicator, discoverPOI, revealOverworldArea, spawnRegionalNPCs, getOverworldSightRadius, cacheCurrentLocation, restoreFromCache, locationCacheKey } from './overworld-handler';
