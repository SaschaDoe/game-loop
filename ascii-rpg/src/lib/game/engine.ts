import type { GameState, GameMap, Entity, Position, MessageType, CharacterClass, CharacterArchetype, CharacterConfig, Difficulty, ActiveDialogue, NPC, NPCMood, DialogueContext, DialogueCondition, SocialSkill, SocialCheck, LocationMode, CachedLocationState, AttributeName } from './types';
import { Visibility } from './types';
import { generateMap, getSpawnPositions } from './map';
import { createRng, randomSeedString, hashSeed } from './seeded-random';
import { createVisibilityGrid, updateVisibility } from './fov';
import { applyEffect, hasEffect, tickEffects, effectColor } from './status-effects';
import { createMonster, createRareMonster, pickMonsterDef, pickBossDef, isBossLevel, isBoss, isRare, getMonsterTier, RARE_SPAWN_CHANCE, decideMoveDirection, getMonsterBehavior, getMonsterOnHitEffect, MONSTER_DEFS } from './monsters';
import { placeTraps, getTrapAt, detectAdjacentTraps, triggerTrap, disarmTrap, searchForTraps } from './traps';
import { useAbility, tickAbilityCooldown, ABILITY_DEFS } from './abilities';
import { placeHazards, applyHazards, getHazardAt, applyHazardToEntity, hazardChar, hazardColor } from './hazards';
import { applyDifficultyToEnemy, difficultySpawnCount, isPermadeath } from './difficulty';
import { placeChests, getChestAt, openChest, chestChar, chestColor } from './chests';
import { generateStartingLocation, generateSettlementByType } from './locations';
import { NPC_DIALOGUE_TREES } from './dialogue';
import { rollLootDrop, getLootAt, pickupLoot, lootChar, lootColor } from './loot';
import { getSkillBonuses } from './skills';
import { placeLandmarks, getLandmarkAt, getLandmarkDef, getAdjacentLandmarks, examineLandmark, landmarkChar, landmarkColor } from './landmarks';
import { shortRest, longRest } from './rest';
import { checkAchievements, getAchievement, createDefaultStats } from './achievements';
import { recordSeen, recordKill } from './bestiary';
import { tickSurvival, getDehydrationPenalty, restoreHunger, restoreThirst, MAX_SURVIVAL } from './survival';
import { tickTime, getTimePhase, sightModifier, phaseName } from './day-night';
import { generateWorld, TERRAIN_DISPLAY, WORLD_W, WORLD_H, REGION_DEFS, type WorldMap, type OverworldTile, type Settlement, type DungeonEntrance, type PointOfInterest, type RegionId } from './overworld';
import { createEmptyInventory, createEmptyEquipment, addToInventory, removeFromInventory, equipItem, unequipItem, addToContainer, removeFromContainer, getEquipmentBonuses, type WorldContainer, type Item, type EquipmentSlot, ITEM_CATALOG } from './items';
import { BOOK_CATALOG, getAllBookIds } from './books';
import { enterStealth, exitStealth, calculateBackstabDamage, processStealthTurn, generateNoise, getAlertSymbol, getAlertColor, initializeAwareness } from './stealth';
import { updateQuestProgress, checkTimedQuests } from './quests';
import { createAcademyState, getAcademyDay, tickAcademy, enrollAtAcademy, completeLesson, passExamPart1, passExam, canTeach, completeTeachingSession, isLessonReady, allLessonsComplete } from './academy';
import { ARCHETYPE_ATTRIBUTES, CLASS_PROFILES, recalculateDerivedStats, defaultMagicFields, getWeaponBonus, getArmorValue, getEquippedArmorWeight } from './magic';
import { SPELL_CATALOG, getSpellDef, executeSpell, tickManaRegen, tickSpellCooldowns, effectiveManaCost } from './spells';
import type { ArmorWeight } from './spells';

const MAP_W = 50;
const MAP_H = 24;

export function buildDialogueContext(state: GameState, npcMood: NPCMood = 'neutral'): DialogueContext {
	return {
		dungeonLevel: state.level,
		characterLevel: state.characterLevel,
		characterClass: state.characterConfig.characterClass,
		hpPercent: Math.round((state.player.hp / state.player.maxHp) * 100),
		enemyCount: state.enemies.length,
		rumorCount: state.rumors.length,
		rumorIds: state.rumors.map(r => r.id),
		storyCount: state.heardStories.length,
		knownLanguages: state.knownLanguages,
		playerName: state.player.name,
		npcMood,
		lieCount: state.lieCount,
		enemiesKilled: state.stats.enemiesKilled,
		bossesKilled: state.stats.bossesKilled,
		secretsFound: state.stats.secretsFound,
		trapsDisarmed: state.stats.trapsDisarmed,
		chestsOpened: state.stats.chestsOpened,
		levelsCleared: state.stats.levelsCleared,
		maxDungeonLevel: state.stats.maxDungeonLevel,
		startingLocation: state.characterConfig.startingLocation,
		playerTitles: state.playerTitles,
		academyEnrolled: state.academyState?.enrolled ?? false,
		academyGraduated: state.academyState?.graduated ?? false,
		academyDay: getAcademyDay(state),
		academyLessonReady: isLessonReady(state),
		academyAllLessonsComplete: allLessonsComplete(state),
		lessonsCompleted: state.academyState?.lessonsCompleted ?? [],
		academyExamTaken: state.academyState?.examTaken ?? false,
	};
}

export function checkCondition(cond: DialogueCondition, ctx: DialogueContext): boolean {
	switch (cond.type) {
		case 'minLevel': return ctx.dungeonLevel >= cond.value;
		case 'maxLevel': return ctx.dungeonLevel <= cond.value;
		case 'class': return ctx.characterClass === cond.value;
		case 'notClass': return ctx.characterClass !== cond.value;
		case 'hpBelow': return ctx.hpPercent < cond.value;
		case 'knowsLanguage': return ctx.knownLanguages.includes(cond.value);
		case 'hasRumors': return ctx.rumorCount >= cond.value;
		case 'hasStories': return ctx.storyCount >= cond.value;
		case 'minCharLevel': return ctx.characterLevel >= cond.value;
		case 'npcMood': return ctx.npcMood === cond.value;
		case 'knownLiar': return ctx.lieCount >= cond.value;
		case 'minEnemiesKilled': return ctx.enemiesKilled >= cond.value;
		case 'hasBossKills': return ctx.bossesKilled >= cond.value;
		case 'minSecretsFound': return ctx.secretsFound >= cond.value;
		case 'hasRumor': return ctx.rumorIds.includes(cond.value);
		case 'minChestsOpened': return ctx.chestsOpened >= cond.value;
		case 'startingLocation': return ctx.startingLocation === cond.value;
		case 'minLevelsCleared': return ctx.levelsCleared >= cond.value;
		case 'hasTitle': return ctx.playerTitles.includes(cond.value);
		case 'academyEnrolled': return ctx.academyEnrolled;
		case 'academyGraduated': return ctx.academyGraduated;
		case 'academyDay': return ctx.academyDay >= cond.value;
		case 'academyLessonReady': return ctx.academyLessonReady;
		case 'academyAllLessonsComplete': return ctx.academyAllLessonsComplete;
		case 'lessonCompleted': return ctx.lessonsCompleted.includes(cond.value);
		case 'lessonNotCompleted': return !ctx.lessonsCompleted.includes(cond.value);
		case 'academyExamNotTaken': return !ctx.academyExamTaken;
		case 'allOf': return cond.conditions.every(c => checkCondition(c, ctx));
	}
}

const SOCIAL_CLASS_BONUS: Record<CharacterClass, Record<SocialSkill, number>> = {
	warrior:     { persuade: 0, intimidate: 4, deceive: -1 },
	mage:        { persuade: 4, intimidate: -1, deceive: 1 },
	rogue:       { persuade: 1, intimidate: 0, deceive: 4 },
	ranger:      { persuade: 1, intimidate: 1, deceive: 0 },
	cleric:      { persuade: 3, intimidate: 0, deceive: -2 },
	paladin:     { persuade: 2, intimidate: 3, deceive: -3 },
	necromancer: { persuade: -1, intimidate: 4, deceive: 2 },
	bard:        { persuade: 4, intimidate: -1, deceive: 3 },
};

export function rollSocialCheck(check: SocialCheck, state: GameState): { success: boolean; roll: number; bonus: number; total: number } {
	const roll = 1 + Math.floor(Math.random() * 20);
	const classBonus = SOCIAL_CLASS_BONUS[state.characterConfig.characterClass][check.skill];
	const levelBonus = Math.floor(state.characterLevel / 3);
	const bonus = classBonus + levelBonus;
	const total = roll + bonus;
	return { success: total >= check.difficulty, roll, bonus, total };
}

export const SOCIAL_SKILL_DISPLAY: Record<SocialSkill, { label: string; color: string }> = {
	persuade: { label: 'Persuasion', color: '#4cf' },
	intimidate: { label: 'Intimidation', color: '#f84' },
	deceive: { label: 'Deception', color: '#c4f' },
};

function processAchievements(state: GameState): void {
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
	const timeModifier = sightModifier(getTimePhase(state.turnCount));
	const equipBonuses = getEquipmentBonuses(state.equipment);
	return Math.max(2, state.sightRadius + (bonuses.sightRadius ?? 0) + timeModifier + (equipBonuses.sight ?? 0));
}

function checkLevelUp(state: GameState): void {
	let threshold = xpForLevel(state.characterLevel + 1);
	while (state.xp >= threshold && state.characterLevel < 50) {
		state.xp -= threshold;
		state.characterLevel++;

		// Auto-increment primary attribute based on archetype
		const archetypeKey = state.characterConfig.archetype ?? CLASS_PROFILES[state.characterConfig.characterClass].suggestedArchetype;
		const archetype = ARCHETYPE_ATTRIBUTES[archetypeKey];
		const primaryAttr = archetype.primaryAttribute;
		state.player[primaryAttr] = (state.player[primaryAttr] ?? 10) + 1;

		// Grant pending free attribute point
		state.pendingAttributePoint = true;

		state.skillPoints++;

		// Recalculate derived stats (captures new VIT→maxHp, STR→attack, etc.)
		const prevMaxHp = state.player.maxHp;
		const prevMaxMana = state.player.maxMana ?? 0;
		const weaponBonus = getWeaponBonus(state.equipment);
		const armorValue = getArmorValue(state.equipment);
		recalculateDerivedStats(state.player, state.characterLevel, armorValue, weaponBonus, archetype.manaModifier);

		const hpGain = state.player.maxHp - prevMaxHp;
		const manaGain = (state.player.maxMana ?? 0) - prevMaxMana;
		// Restore the HP/mana we gained
		state.player.hp += Math.max(0, hpGain);
		state.player.mana = (state.player.mana ?? 0) + Math.max(0, manaGain);

		let msg = `Level up! Level ${state.characterLevel}. +1 ${primaryAttr.toUpperCase()}, +1 free point`;
		if (hpGain > 0) msg += `, +${hpGain} HP`;
		if (manaGain > 0) msg += `, +${manaGain} MP`;
		msg += ', +1 Skill Point.';
		addMessage(state, msg, 'level_up');
		threshold = xpForLevel(state.characterLevel + 1);
	}
}

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
		pendingAttributePoint: false,
		spellTargeting: null,
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
	recalculateDerivedStats(state.player, state.characterLevel, armorValue, weaponBonus, archetype.manaModifier);
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
const OVERWORLD_SIGHT_RADIUS = 5; // default/plains
const OVERWORLD_VIEWPORT_W = MAP_W;
const OVERWORLD_VIEWPORT_H = MAP_H;

/** Terrain-based overworld sight radius: open terrain = 6, forest/swamp = 3, mountain-adjacent/snow = 2. */
const TERRAIN_SIGHT_RADIUS: Partial<Record<string, number>> = {
	grass: 6,
	farmland: 6,
	sand: 7, // flat desert, good visibility
	oasis: 6,
	forest: 3,
	dead_trees: 3,
	swamp: 3,
	mud: 4,
	snow: 4,
	ice: 4,
	ash: 4,
	scorched: 5,
	rock: 3,
};

/** Get overworld sight radius based on the terrain the player is standing on. */
function getOverworldSightRadius(tile: OverworldTile): number {
	return TERRAIN_SIGHT_RADIUS[tile.terrain] ?? OVERWORLD_SIGHT_RADIUS;
}

// ── Overworld Helpers ──

/** Flavor text shown when entering a new region. */
const REGION_FLAVOR: Record<string, string> = {
	greenweald: 'Ancient trees tower overhead, their canopy filtering emerald light.',
	ashlands: 'The air shimmers with heat. Ash drifts like grey snow.',
	hearthlands: 'Golden fields stretch to the horizon, dotted with farmsteads and church spires.',
	frostpeak: 'A biting wind howls through ice-crusted peaks. Your breath crystallizes.',
	drowned_mire: 'The ground squelches underfoot. A sour mist clings to the dead trees.',
	sunstone_expanse: 'Endless dunes ripple under a blazing sun. Sand whispers against stone.',
	thornlands: 'Rugged highlands choked with thorny undergrowth. Rusted iron relics dot the ridgeline.',
	pale_coast: 'Salt spray stings your face. Grey waves crash against pale cliffs. The Hollow Sea stretches to the horizon.',
	glassfields: 'Shattered prisms catch the light, scattering rainbows across fields of vitrified earth. The air hums with residual magic.',
	verdant_deep: 'The canopy closes overhead like a living ceiling. Bioluminescent fungi pulse along the trunks. Something ancient watches from the green darkness.',
	mirrow_wastes: 'Dead trees claw at a grey sky. The river stones are stained rust-red despite centuries of rain. Griefmoths drift through the silence like living lanterns.',
	silence_peaks: 'The wind dies. Your footsteps make no sound. Snow falls in perfect silence, and the mountains swallow every echo. Something fundamental is broken here.',
	timeless_wastes: 'The sky flickers between noon and dusk. Your shadow moves before you do. The landscape repeats — or did you walk this path already? Time is wounded here.',
	hollow_sea: 'The water stretches beyond sight, impossibly clear. Far below, drowned spires shimmer like a mirage. Where Dro-Mahk was torn, matter itself grew thin.',
	grey_wastes: 'The trees stand like bones, grey and leafless. The ground is ashen and silent. Somewhere beneath your feet, a dead Ley Line lies like a severed nerve — and the land has never stopped grieving.',
	korthaven: 'Golden wheat fields stretch between walled farmsteads and merchant caravans. The spires of Korthaven rise in the distance — the Free Cities\' greatest market, where coin speaks louder than prayer.',
	eldergrove: 'The trees here are immense — silver-barked giants whose canopy swallows the sky. Shafts of green-gold light pierce the perpetual twilight. Somewhere above, elven bridges span the branches like spider silk, and the forest hums with a music older than prayer.',
	stormcradle: 'Lightning splits the sky every few heartbeats. The highlands are scoured bare — only scrub grass and blackened stone survive. Between the thunder, you hear something deeper: a hum from beneath the rock, as if the earth itself remembers the blow that cracked the sky.',
	luminara_ruins: 'Golden spires rise from the dust, half-collapsed and half-frozen in amber light. The air smells of old parchment and ash. In places the ruins shimmer — time pooling like water in the broken streets, preserving moments of beauty a heartbeat before their destruction.',
	duskhollow: 'The trees are wrong. Half-visible, their trunks flickering between solid wood and translucent grey. Mist clings to everything. Buildings appear and vanish at the corner of your eye — there, then not, then there again. The air tastes of two worlds, and neither one is entirely real.',
	irongate: 'Iron and stone rise from the scorched earth — massive walls half-buried under landslide rubble. The air smells of rust and old forge smoke. Somewhere beneath the mountain, gears still turn. The ruins of the Iron Republics\' last free city, buried but not forgotten.',
	arcane_conservatory: 'Towers of pale stone rise from manicured grounds, connected by covered walkways and floating bridges. The air hums with residual enchantment. Students in blue robes cross courtyards where fountain water flows upward. Somewhere a bell tolls — not with sound, but with a pulse of warm light that passes through walls.',
	gallowmere: 'Rotting farmland stretches between ruined villages. Two throne rooms still stand — one north, one south — both empty, both preserved by locals who cannot say why. The province never recovered from its civil war. Ten years of brother against brother left the land scarred and the people quiet. Weeds grow through cobblestones where market squares once thrived.',
};

/** Convert numeric danger level to display label and color. */
export function dangerDisplay(dangerLevel: number): { label: string; color: string } {
	if (dangerLevel <= 1) return { label: 'Safe', color: '#4a4' };
	if (dangerLevel <= 2) return { label: 'Low', color: '#aa4' };
	if (dangerLevel <= 4) return { label: 'Medium', color: '#da4' };
	if (dangerLevel <= 6) return { label: 'High', color: '#f84' };
	if (dangerLevel <= 8) return { label: 'Very High', color: '#f44' };
	return { label: 'Extreme', color: '#f08' };
}

/** Get current overworld info for HUD display. */
export function getOverworldInfo(state: GameState): { regionName: string; regionColor: string; dangerLevel: number; dangerLabel: string; dangerColor: string } | null {
	if (state.locationMode !== 'overworld' || !state.worldMap || !state.overworldPos) return null;
	const worldMap = state.worldMap as WorldMap;
	const pos = state.overworldPos;
	const tile = worldMap.tiles[pos.y]?.[pos.x];
	if (!tile) return null;
	const region = worldMap.regions.find(r => r.id === tile.region);
	if (!region) return null;
	const danger = dangerDisplay(region.dangerLevel);
	return {
		regionName: region.name,
		regionColor: REGION_COLORS[tile.region] ?? '#aaa',
		dangerLevel: region.dangerLevel,
		dangerLabel: danger.label,
		dangerColor: danger.color,
	};
}

/** Terrain movement cost: 1 = normal, 2 = slow (costs extra turn), 0.5 = fast (road bonus). */
const TERRAIN_MOVE_COST: Partial<Record<string, number>> = {
	forest: 2,
	swamp: 2,
	snow: 2,
	mud: 2,
	ice: 2,
};

/** Get the movement turn cost for an overworld tile. Roads = 1 but allow double-step. Slow terrain = 2 turns. */
function getOverworldMoveCost(tile: OverworldTile): number {
	if (tile.road) return 1; // roads: normal cost but will double-step
	return TERRAIN_MOVE_COST[tile.terrain] ?? 1;
}

/** Get compass direction name from dx/dy. */
function compassDirection(dx: number, dy: number): string {
	if (dx === 0 && dy < 0) return 'North';
	if (dx === 0 && dy > 0) return 'South';
	if (dx > 0 && dy === 0) return 'East';
	if (dx < 0 && dy === 0) return 'West';
	if (dx > 0 && dy < 0) return 'NE';
	if (dx < 0 && dy < 0) return 'NW';
	if (dx > 0 && dy > 0) return 'SE';
	return 'SW';
}

/** Show signpost information: directions and distances to nearest settlements. */
function showSignpostInfo(state: GameState, worldMap: WorldMap, pos: Position): void {
	addMessage(state, 'A signpost stands at the crossroads:', 'info');
	const nearby = worldMap.settlements
		.map(s => ({ name: s.name, dx: s.pos.x - pos.x, dy: s.pos.y - pos.y, dist: Math.abs(s.pos.x - pos.x) + Math.abs(s.pos.y - pos.y) }))
		.sort((a, b) => a.dist - b.dist)
		.slice(0, 4);
	for (const s of nearby) {
		const dir = compassDirection(s.dx, s.dy);
		addMessage(state, `  ${s.name} — ${dir}, ${s.dist} tiles`, 'info');
	}
}

const REGION_COLORS: Record<string, string> = {
	greenweald: '#4a4',
	ashlands: '#f64',
	hearthlands: '#da4',
	frostpeak: '#8df',
	drowned_mire: '#6a6',
	sunstone_expanse: '#fa4',
	thornlands: '#a86',
	pale_coast: '#8bd',
	glassfields: '#c8f',
	verdant_deep: '#2a6',
	mirrow_wastes: '#a64',
	silence_peaks: '#bbc',
	timeless_wastes: '#da8',
	hollow_sea: '#48a',
	grey_wastes: '#898',
	korthaven: '#da6',
	eldergrove: '#6d8',
	stormcradle: '#99f',
	luminara_ruins: '#ec8',
	duskhollow: '#97a',
	irongate: '#a86',
	arcane_conservatory: '#a8f',
	gallowmere: '#a97',
	underdepths: '#a4f',
};

/** Reveal tiles in a radius around a position on the overworld explored grid. */
function revealOverworldArea(worldMap: WorldMap, pos: Position, radius: number): void {
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

/** Reveal a random undiscovered settlement on the overworld when a rumor is learned. */
function revealRumorLocation(state: GameState): void {
	const worldMap = state.worldMap as WorldMap;
	const pos = state.overworldPos;
	// Find settlements not yet revealed (center tile unexplored)
	const unrevealed = worldMap.settlements.filter(s => !worldMap.explored[s.pos.y]?.[s.pos.x]);
	if (unrevealed.length === 0) return;
	// Pick the nearest unrevealed settlement (rumors tend to be about nearby places)
	let target = unrevealed[0];
	if (pos) {
		let bestDist = Infinity;
		for (const s of unrevealed) {
			const dist = Math.abs(s.pos.x - pos.x) + Math.abs(s.pos.y - pos.y);
			if (dist < bestDist) { bestDist = dist; target = s; }
		}
	}
	// Reveal area around the settlement
	revealOverworldArea(worldMap, target.pos, 8);
	addMessage(state, `The rumor reveals the location of ${target.name} on your map.`, 'discovery');
}

/** Check if overworld terrain is passable for walking. */
function isOverworldPassable(tile: OverworldTile): boolean {
	return tile.terrain !== 'water' && tile.terrain !== 'mountain' && tile.terrain !== 'lava';
}

/** Get the location (settlement/dungeon/poi) at an overworld position, if any. */
function getOverworldLocation(worldMap: WorldMap, pos: Position): { type: 'settlement'; data: Settlement } | { type: 'dungeon'; data: DungeonEntrance } | { type: 'poi'; data: PointOfInterest } | null {
	const tile = worldMap.tiles[pos.y]?.[pos.x];
	if (!tile?.locationId) return null;
	const settlement = worldMap.settlements.find(s => s.id === tile.locationId);
	if (settlement) return { type: 'settlement', data: settlement };
	const dungeon = worldMap.dungeonEntrances.find(d => d.id === tile.locationId);
	if (dungeon) return { type: 'dungeon', data: dungeon };
	const poi = worldMap.pois.find(p => p.id === tile.locationId);
	if (poi) return { type: 'poi', data: poi };
	return null;
}

/** Handle overworld movement and location entry. */
function handleOverworldInput(state: GameState, key: string): GameState {
	if (state.gameOver) {
		if (key === 'r') return createGame(state.characterConfig);
		return state;
	}

	let dx = 0, dy = 0;
	if (key === 'w' || key === 'ArrowUp') dy = -1;
	else if (key === 's' || key === 'ArrowDown') dy = 1;
	else if (key === 'a' || key === 'ArrowLeft') dx = -1;
	else if (key === 'd' || key === 'ArrowRight') dx = 1;
	else return state;

	const worldMap = state.worldMap as WorldMap;
	const pos = state.overworldPos!;
	const nx = pos.x + dx;
	const ny = pos.y + dy;

	if (nx < 0 || ny < 0 || nx >= worldMap.width || ny >= worldMap.height) return state;
	const targetTile = worldMap.tiles[ny][nx];
	if (!isOverworldPassable(targetTile)) {
		addMessage(state, `The ${targetTile.terrain} blocks your path.`, 'info');
		return { ...state };
	}

	// Detect region transition before moving
	const prevRegion = worldMap.tiles[pos.y][pos.x].region;
	const nextRegion = targetTile.region;

	// Move on overworld
	state.overworldPos = { x: nx, y: ny };
	revealOverworldArea(worldMap, state.overworldPos, getOverworldSightRadius(targetTile));

	// Region transition announcement
	if (nextRegion !== prevRegion) {
		const regionDef = worldMap.regions.find(r => r.id === nextRegion);
		if (regionDef) {
			addMessage(state, `— You enter ${regionDef.name} —`, 'discovery');
			const flavorMsg = REGION_FLAVOR[nextRegion];
			if (flavorMsg) addMessage(state, flavorMsg, 'info');
			// Danger warning for high-danger regions
			if (regionDef.dangerLevel >= 4) {
				const danger = dangerDisplay(regionDef.dangerLevel);
				addMessage(state, `Warning: Danger level ${danger.label}. Creatures here are level ${regionDef.dangerLevel}+.`, 'danger');
			}
		}
	}

	// Terrain movement cost
	const moveCost = getOverworldMoveCost(targetTile);
	if (moveCost > 1) {
		const terrainName = targetTile.terrain === 'mud' ? 'mud' : targetTile.terrain === 'ice' ? 'ice' : targetTile.terrain;
		addMessage(state, `The ${terrainName} slows your progress.`, 'info');
	}

	// Road bonus: double-step when on a road moving onto another road tile
	const currentTile = worldMap.tiles[pos.y]?.[pos.x];
	if (targetTile.road && currentTile?.road && !targetTile.locationId) {
		const nx2 = nx + dx;
		const ny2 = ny + dy;
		if (nx2 >= 0 && ny2 >= 0 && nx2 < worldMap.width && ny2 < worldMap.height) {
			const secondTile = worldMap.tiles[ny2][nx2];
			if (isOverworldPassable(secondTile) && secondTile.road) {
				// Check region transition for second step too
				const secondRegion = secondTile.region;
				state.overworldPos = { x: nx2, y: ny2 };
				revealOverworldArea(worldMap, state.overworldPos, getOverworldSightRadius(secondTile));
				if (secondRegion !== nextRegion) {
					const regionDef = worldMap.regions.find(r => r.id === secondRegion);
					if (regionDef) {
						addMessage(state, `— You enter ${regionDef.name} —`, 'discovery');
						const flavorMsg = REGION_FLAVOR[secondRegion];
						if (flavorMsg) addMessage(state, flavorMsg, 'info');
					}
				}
			}
		}
	}

	// Signpost interaction: show nearby settlement directions
	const finalTile = worldMap.tiles[state.overworldPos.y]?.[state.overworldPos.x];
	if (finalTile?.signpost) {
		showSignpostInfo(state, worldMap, state.overworldPos);
	}

	// Tick survival on overworld movement (extra tick for slow terrain)
	if (state.survivalEnabled) {
		const survivalResult = tickSurvival(state);
		for (const msg of survivalResult.messages) {
			addMessage(state, msg.text, msg.type);
		}
	}

	state.turnCount += moveCost;

	// Tick academy notifications on overworld
	const academyOWMsgs = tickAcademy(state);
	for (const msg of academyOWMsgs) state.messages.push(msg);

	// Random encounter check (before location entry)
	if (checkRandomEncounter(state)) {
		return { ...state }; // Combat encounter — player is now in arena
	}

	// Check for location entry
	const location = getOverworldLocation(worldMap, state.overworldPos);
	if (location) {
		if (location.type === 'settlement') {
			enterSettlement(state, location.data);
		} else if (location.type === 'dungeon') {
			enterDungeon(state, location.data);
		} else if (location.type === 'poi') {
			discoverPOI(state, location.data);
		}
	}

	return { ...state };
}

// ── Regional NPCs for settlements ──

interface RegionalNPCDef {
	char: string;
	color: string;
	name: string;
	dialogue: string[];
	gives?: { hp?: number; atk?: number };
	mood: NPC['mood'];
}

const REGIONAL_NPCS: Record<string, RegionalNPCDef[]> = {
	greenweald: [
		{ char: 'E', color: '#8f8', name: 'Elven Ranger', dialogue: ['The forest watches over those who respect it.', 'I patrol these woods daily. The corruption spreads from the east.', 'May the canopy shelter you.'], mood: 'friendly' },
		{ char: 'D', color: '#4a4', name: 'Druid', dialogue: ['The Elder Oak speaks of dark times ahead.', 'Nature provides, if you know where to look.', 'Have you visited the Fey Circle? The stones hum with power.'], gives: { hp: 3 }, mood: 'friendly' },
		{ char: 'H', color: '#6a4', name: 'Forest Hermit', dialogue: ['I\'ve lived among these trees for forty years. They remember things we\'ve forgotten.', 'The Prismatic Ruins glow at midnight. Crystalborn magic still lives there.', 'Old Magic doesn\'t need a god\'s permission. Remember that.'], mood: 'neutral' },
	],
	ashlands: [
		{ char: 'O', color: '#f84', name: 'Orc Blacksmith', dialogue: ['You want weapon? I forge best steel in Ashlands.', 'The goblin clans grow restless. War comes.', 'Respect the fire, outsider, and it will not burn you.'], gives: { atk: 1 }, mood: 'neutral' },
		{ char: 'G', color: '#a64', name: 'Goblin Trader', dialogue: ['Cheap goods! Good goods! Only slightly stolen!', 'The Charred Fortress has treasures... and death.', 'Boss not happy lately. Bad sign for everyone.'], mood: 'friendly' },
		{ char: 'W', color: '#f44', name: 'War Shaman', dialogue: ['Ira-Sethi burned here long ago. The land still remembers.', 'The Ashblooms grow only where divine fire once touched the earth.', 'The god of war came after — a mortal thing wearing a throne it did not earn. The Ashlands knew fire before he ever claimed it.'], mood: 'neutral' },
	],
	hearthlands: [
		{ char: 'M', color: '#da4', name: 'Merchant', dialogue: ['Trade is the lifeblood of the Hearthlands.', 'The roads have become dangerous — bandits everywhere.', 'I hear the King\'s Stones hold ancient magic.'], mood: 'friendly' },
		{ char: 'G', color: '#8a4', name: 'Guard Captain', dialogue: ['Keep your weapons sheathed within town walls.', 'We\'ve had reports of strange creatures on the roads.', 'The Old Watchtower was abandoned years ago. Haunted, they say.'], gives: { hp: 2 }, mood: 'neutral' },
		{ char: 'B', color: '#fa8', name: 'Wandering Bard', dialogue: ['Seven thrones sit in shadow deep, where stolen gods their vigil keep...', 'It\'s just a song, friend. Nobody takes it seriously. Well, almost nobody.', 'I collect stories from every region. The ones that match across borders — those are the true ones.'], mood: 'friendly' },
	],
	frostpeak: [
		{ char: 'D', color: '#8df', name: 'Dwarven Smith', dialogue: ['These mountains hold iron that sings when struck.', 'The frozen halls above... even we dare not enter.', 'Take this — you\'ll need warmth where you\'re going.'], gives: { hp: 3 }, mood: 'friendly' },
		{ char: 'R', color: '#aaf', name: 'Runekeeper', dialogue: ['The runes speak truths that words cannot.', 'Frostpeak was old when the world was young.', 'The ice holds secrets of the First Age.'], mood: 'neutral' },
		{ char: 'I', color: '#4af', name: 'Ice Fisher', dialogue: ['The lakes beneath the glaciers hold fish that glow.', 'I once pulled up an artifact from the deep ice. Sold it. Wish I hadn\'t.', 'The dwarves say there\'s a frozen throne beneath the Glacial Stones. I believe them.'], gives: { hp: 2 }, mood: 'friendly' },
	],
	drowned_mire: [
		{ char: 'W', color: '#6a6', name: 'Swamp Witch', dialogue: ['The mire gives and takes in equal measure.', 'Drink this. It tastes foul but wards off the plague.', 'The bog spirits are restless tonight...'], gives: { hp: 4 }, mood: 'friendly' },
		{ char: 'H', color: '#886', name: 'Herbalist', dialogue: ['These mushrooms cure most poisons. Most.', 'Don\'t stray from the stilts after dark.', 'The Sunken Altar holds power over the drowned dead.'], mood: 'neutral' },
		{ char: 'B', color: '#464', name: 'Bog Walker', dialogue: ['I walk the deep paths where others won\'t go.', 'The spirits here aren\'t evil — they\'re confused. They died before the Ascension and don\'t recognize the new gods.', 'Whispertongue is the language of the dead. Learn it, and they\'ll talk to you.'], mood: 'neutral' },
	],
	sunstone_expanse: [
		{ char: 'N', color: '#fa4', name: 'Nomad Guide', dialogue: ['The desert tests all who cross it.', 'Follow the stars — they never lie, unlike the sands.', 'The buried temples hold treasures of forgotten kings.'], mood: 'friendly' },
		{ char: 'S', color: '#ff8', name: 'Stargazer', dialogue: ['The constellations shifted last night. A bad omen.', 'Sandscript cannot be learned from books alone.', 'The oasis shrines were built by the Sand Mages long ago.'], gives: { hp: 2 }, mood: 'neutral' },
	],
	thornlands: [
		{ char: 'E', color: '#a86', name: 'Iron Remnant Engineer', dialogue: ['The Republic fell, but its principles endure.', 'These machines once powered an entire civilization. Now they rust.', 'Magic is a crutch. Gears and steel — that\'s real power.'], gives: { atk: 1 }, mood: 'neutral' },
		{ char: 'S', color: '#da8', name: 'Thorn Ranger', dialogue: ['The undergrowth here is alive — and not friendly.', 'The old Iron roads are still the safest path through these highlands.', 'I\'ve seen foundry smoke rising from ruins that should be dead. Unsettling.'], gives: { hp: 2 }, mood: 'friendly' },
	],
	pale_coast: [
		{ char: 'H', color: '#8bd', name: 'Harbor Master', dialogue: ['Welcome to the coast, traveler. Mind the tides — they\'re unnatural here.', 'Ships vanish in the Hollow Sea. Whole crews gone without a trace.', 'The sea gives back things it shouldn\'t have. Artifacts from before the Ascension wash ashore.'], gives: { hp: 3 }, mood: 'friendly' },
		{ char: 'F', color: '#68a', name: 'Old Fisherman', dialogue: ['Been fishing these waters fifty years. They\'ve changed.', 'Sometimes the water goes clear — perfectly clear — down to the bottom. Miles of nothing. That\'s the Hollow Sea.', 'Dro-Mahk died here, they say. The Principle of Matter itself. That\'s why things feel... thin.'], mood: 'neutral' },
		{ char: 'D', color: '#4af', name: 'Diver', dialogue: ['I dive for salvage in the shallows. The deeper wrecks are too dangerous.', 'Found a crystal last week that hummed when I held it. Crystalborn make, I reckon.', 'There\'s a sunken city out past the reef. On clear days you can see the spires beneath the waves.'], gives: { atk: 1 }, mood: 'friendly' },
	],
	glassfields: [
		{ char: 'L', color: '#c8f', name: 'Luminari Remnant', dialogue: ['We are echoes of a people who tried to outrun time itself.', 'The Crystal Citadel was our greatest work — and our undoing.', 'Prismatic is not merely language. It is light shaped into meaning.'], mood: 'neutral' },
		{ char: 'C', color: '#f8f', name: 'Chrono-Warden', dialogue: ['Time flows strangely here. You may have already spoken to me tomorrow.', 'The Temporal Rifts are scars from the Luminari\'s last experiment.', 'Do not touch the fractured prisms. They replay moments that should stay buried.'], gives: { hp: 4 }, mood: 'friendly' },
		{ char: 'S', color: '#adf', name: 'Shard Collector', dialogue: ['Each crystal fragment holds a frozen memory. Most are mundane — but some...', 'I found one that showed the Ascension itself. Seven mortals, climbing a stair of light. The horror on the faces of those they displaced.', 'The Luminari saw the truth before anyone. That\'s why the gods shattered them.'], gives: { atk: 1 }, mood: 'neutral' },
	],
	verdant_deep: [
		{ char: 'D', color: '#2a6', name: 'Elder Druid', dialogue: ['The Old Magic needs no gods. It was here before them and will outlast them.', 'The Heartwood remembers every footstep taken beneath its canopy — for ten thousand years.', 'The Verdant Reach shelters those who still practice the First Ways.'], gives: { hp: 4 }, mood: 'friendly' },
		{ char: 'P', color: '#6a4', name: 'Grey Pilgrim', dialogue: ['We walk the paths the gods forbade. Someone must.', 'Primordialists are not heretics. We simply remember what came before the theft.', 'The Ley Lines converge here. Can you feel it? The earth itself hums with power.'], mood: 'neutral' },
		{ char: 'R', color: '#4a2', name: 'Jungle Tracker', dialogue: ['Watch where you step. The Voidblooms drink more than sunlight.', 'Crystalline Stags still roam the deep paths. They\'re almost extinct now — hunted for their antlers.', 'The River Thal sings at dawn. Not a metaphor. Actual singing.'], gives: { hp: 2 }, mood: 'friendly' },
	],
	mirrow_wastes: [
		{ char: 'W', color: '#a64', name: 'Mirrow Widow', dialogue: ['One strand light, one strand dark. That\'s what we weave. That\'s what we remember.', 'The Mirrow wives still sing, if you know where to listen. The Church banned us, but grief outlasts doctrine.', 'Ash-Velk the liar, who wore truth like a borrowed coat... That\'s from the oldest verse. Page fourteen.'], mood: 'neutral' },
		{ char: 'G', color: '#88a', name: 'Ghost Whisperer', dialogue: ['The soldiers still fight here. They don\'t know the war was a lie.', 'Vestraad and Korinn were allies for three centuries. Then one man\'s forgeries turned them to slaughter.', 'The griefmoths gather thickest at Mirrow Ford. Four hundred thousand dead will do that.'], gives: { hp: 3 }, mood: 'friendly' },
		{ char: 'A', color: '#864', name: 'Ashen Circle Scholar', dialogue: ['We keep the forbidden records. The forgery workshop. The proof that the God of Truth built his throne on lies.', 'Theron Ash-Velk manufactured the entire Brother War. Fake documents, planted evidence, disguised mercenaries.', 'The complete Mirrow Widows\' song is in our library. Every verse — including the ones that name the god.'], gives: { atk: 1 }, mood: 'neutral' },
	],
	silence_peaks: [
		{ char: 'M', color: '#bbc', name: 'Blind Monk', dialogue: ['We burned our eyes to see what matters. The knotted strings hold a melody older than the gods.', 'The Undertone grows fainter each year. Seven voices singing themselves into the world\'s foundation — the Original Seven.', 'Knotweave is not language. It is vibration given form. You read it with your fingertips.'], gives: { hp: 3 }, mood: 'friendly' },
		{ char: 'A', color: '#99a', name: 'Abbot of Closed Eyes', dialogue: ['Pho-Lumen screamed here. The Principle of Spirit, wounded unto death. And sound itself shattered.', 'We have spent a thousand years transcribing what remains. A seven-voiced dirge beneath the silence.', 'The Ascended filter it. Degrade it. But they cannot silence what was woven into the world itself.'], mood: 'neutral' },
		{ char: 'P', color: '#aab', name: 'Pilgrim of Stillness', dialogue: ['I came to hear the silence. Instead I heard what hides beneath it.', 'In the deepest caves, if you press your ear to the stone, you can feel them — the Original Seven, still singing.', 'The monks say the melody is a map. Seven streams of magic converging on a point no one has found.'], gives: { hp: 2 }, mood: 'friendly' },
	],
	hollow_sea: [
		{ char: 'S', color: '#48a', name: 'Salvage Captain', dialogue: ['I\'ve pulled Dominion artifacts from the shallows for twenty years. The deep wrecks? Nobody comes back from those.', 'On calm days the water goes glass-clear. You can see the spires of Pelagathis a mile below. They still glow.', 'The Sunken Dominion didn\'t sink. It was swallowed. When Dro-Mahk was wounded here, matter stopped being reliable.'], gives: { hp: 3 }, mood: 'friendly' },
		{ char: 'L', color: '#4af', name: 'Leviathan Whisperer', dialogue: ['The great ones still remember the Dominion. They carry its memories in their songs — frequencies we can barely perceive.', 'Dominion Aquatic is not spoken. It is felt — pressure changes, current shifts, the language of deep water.', 'One of the leviathans showed me Pelagathis as it was. Crystal domes, coral highways, light that came from everywhere. Then the Principle of Matter died and it all became... thin.'], mood: 'neutral' },
		{ char: 'C', color: '#68d', name: 'Coral Archaeologist', dialogue: ['These coral formations aren\'t natural. They\'re Dominion architecture — buildings that grew rather than were built.', 'I found a crystal that plays back the last moments before the sinking. Screaming. Then silence. Then the sound of water rushing in from everywhere.', 'The Restoration wants what the Dominion knew. Magic without gods. Civilization built on principles, not prayer.'], gives: { atk: 1 }, mood: 'friendly' },
	],
	timeless_wastes: [
		{ char: 'T', color: '#da8', name: 'Temporal Scholar', dialogue: ['I have lived this conversation before. Or I will. The tenses collapse here.', 'Tho-Rienne was wounded — the Principle of Time itself. The wound never healed. It never will. It never has.', 'Orinthas — the god who calls himself lord of Time — once erased an entire day from the calendar. But Time remembers what gods forget.'], mood: 'neutral' },
		{ char: 'L', color: '#fa8', name: 'Loop-Trapped Wanderer', dialogue: ['I have been walking this path for... I don\'t know. Years? Centuries? The sun rises and sets in the wrong order.', 'There is a day that doesn\'t exist. Once a year I slip into it — burning libraries, screaming, shadows of a golden age dying.', 'If you find the Moment Tombs, don\'t touch the frozen people. They\'re not dead. They\'re caught between seconds.'], gives: { hp: 4 }, mood: 'friendly' },
		{ char: 'C', color: '#ca8', name: 'Chronoscript Cartographer', dialogue: ['Chronoscript reads backwards and forwards simultaneously. The meaning changes depending on which direction you read.', 'I\'m mapping the temporal anomalies. Some zones loop. Some skip. Some run backwards. None are stable.', 'The Fractured Hours stones predate everything. They\'re markers for where time broke — and where it might break again.'], gives: { atk: 1 }, mood: 'neutral' },
	],
	grey_wastes: [
		{ char: 'E', color: '#898', name: 'Elder Thorn', dialogue: ['We\'ve sung to the Ley Line for three centuries. It doesn\'t sing back anymore. But the stones still listen.', 'Seven monoliths stand at Grief\'s Circle — one for each of the Original gods. The Ascended want them torn down. We refuse.', 'Old Primal is the language of the land itself. You don\'t learn it. You remember it.'], gives: { hp: 4 }, mood: 'friendly' },
		{ char: 'V', color: '#686', name: 'Scar-Walker', dialogue: ['The grey gets in your bones. Changes you. Some call it corruption. I call it the land\'s grief made physical.', 'I found a journal in the Veiled Hand outpost. Someone ordered the Ley Line killed. Deliberately. The signature was burned away.', 'The scavengers strip what they can. The Pilgrims heal what they can. Nobody asks who killed it in the first place.'], gives: { atk: 1 }, mood: 'neutral' },
		{ char: 'C', color: '#7a7', name: 'Cairn-Keeper Moss', dialogue: ['The Pilgrims heal. The scavengers take. The Veiled Hand watches. And beneath it all, the dead Ley Line dreams of what it was.', 'Can you hear it? That hum beneath the silence? The Ley Line is trying to remember itself. After all these centuries.', 'The Petrified Grove was alive once. Oldest forest in the world. Now it\'s stone and memory and grief.'], gives: { hp: 2 }, mood: 'friendly' },
	],
	eldergrove: [
		{ char: 'E', color: '#8fc', name: 'Warden Ithilra', dialogue: ['You walk beneath the Eldest Trees. Step softly — the roots remember every footfall.', 'The Eldergrove sheltered our people when the Ascended burned our libraries. We will not forget.', 'Sylvan is the tongue the trees speak. Learn it, and the forest opens paths no outsider can find.'], gives: { hp: 3 }, mood: 'neutral' },
		{ char: 'A', color: '#6ea', name: 'Archivist Faelorn', dialogue: ['The Moonlit Archives hold texts the Veiled Hand believes they destroyed. We let them believe it.', 'Before the Ascension, the elves practiced magic without prayer. We still do — quietly.', 'Selvara claims she grew the World Oak. The trees laugh at that. They remember who truly planted the first seeds.'], mood: 'friendly' },
		{ char: 'R', color: '#4a6', name: 'Ranger Thandril', dialogue: ['Bandits on the south road again. The Briarwood Gang — they prey on pilgrims heading for the temples.', 'Crystalline Stags still roam the deep paths. If you see one, do not follow. They lead the unworthy to their deaths.', 'Something prowls the Thornveil at night. Larger than a bear. The tracks vanish at the treeline, as if it climbs.'], gives: { atk: 1 }, mood: 'friendly' },
	],
	korthaven: [
		{ char: 'A', color: '#da6', name: 'Aldric Fenn', dialogue: ['Have you seen anything unusual? Anything that glows? Anything that\'s warm when it shouldn\'t be?', 'Eight centuries of collecting curiosities. You\'d be amazed what washes up in markets — artifacts from before the Ascension, still humming with power.', 'The Merchants\' Guild thinks I\'m eccentric. They\'re not wrong. But I remember when this city was a crossroads camp and the gods wore different faces.'], gives: { hp: 3 }, mood: 'friendly' },
		{ char: 'G', color: '#fa8', name: 'Guild Factor', dialogue: ['Korthaven moves more coin in a day than most kingdoms see in a year. The Free Cities built that.', 'Mercatus blesses the harvest and the ledger alike. Though between you and me, gold prays louder than grain.', 'We don\'t ask where goods come from. We ask what they\'re worth. That\'s Trade Common for you.'], gives: { atk: 1 }, mood: 'neutral' },
		{ char: 'H', color: '#ca8', name: 'Caravan Master Halda', dialogue: ['Twelve years I\'ve carried this coin. Won\'t leave my pocket. Won\'t spend. Won\'t melt. My uninvited guest.', 'The roads between cities are the real kingdom. Whoever controls the caravans controls everything.', 'I\'ve seen impossible things on the trade roads. Merchants learn to accept the impossible and price it accordingly.'], gives: { hp: 2 }, mood: 'friendly' },
	],
	stormcradle: [
		{ char: 'W', color: '#aaf', name: 'Storm Warden Kael', dialogue: ['The lightning is not random. It follows the veins beneath the rock — something down there conducts it, something old. The scholars in Korthaven go quiet when I describe it.', 'We harvest fulgurite from the strike points. Each piece remembers the shape of the bolt that made it. Some of them hum.', 'The sky broke here during the Primordial War. It never healed. That is why the storms never stop.'], gives: { hp: 2 }, mood: 'neutral' },
		{ char: 'L', color: '#ccf', name: 'Lightning Harvester Yenn', dialogue: ['Storm Cant is not spoken — it is shouted between thunderclaps. You learn to say everything that matters in three syllables.', 'The Fulgurite Spire was not built. A single bolt struck the hilltop and fused the sand into a tower. Perfectly symmetrical. Perfectly hollow.', 'I sell lightning-glass to the merchants in Korthaven. They call it jewelry. I call it frozen screaming.'], gives: { atk: 1 }, mood: 'friendly' },
		{ char: 'D', color: '#88c', name: 'Tunnel Delver Mossrig', dialogue: ['The tunnels beneath the Stormcradle are older than anything on the surface. The walls pulse with a rhythm — not a heartbeat, but close.', 'Something carved these tunnels with heat, not tools. The stone is glazed smooth, like the inside of a kiln.', 'I found markings down there that match nothing in any language above ground. The scholars in Korthaven offered me gold. I kept the rubbings.'], gives: { hp: 3 }, mood: 'friendly' },
	],
	luminara_ruins: [
		{ char: 'S', color: '#ec8', name: 'Arcanist Veyla', dialogue: ['Five hundred thousand scrolls. The greatest library the world has ever known. Burned because a fool could not bear to be corrected.', 'We Arcanists trace our lineage to the scholars who survived. We preserved what fragments we could. It was not enough.', 'Many of my order pray to Lexis for the wisdom we lost. I find I cannot bring myself to pray. I don\'t know why.'], gives: { hp: 2 }, mood: 'neutral' },
		{ char: 'T', color: '#da6', name: 'Temporal Guide Essra', dialogue: ['The time pockets are beautiful and terrible. You step through and for a moment you are in the golden age — the gardens, the music, the light. Then it tears you back.', 'Do not linger in the frozen moments. Some scholars have been trapped for hours that felt like years. They came back... different.', 'The Frozen Fountain still runs, if you can call it running. The water hangs in the air, mid-splash, and has for two thousand years.'], gives: { hp: 3 }, mood: 'friendly' },
		{ char: 'M', color: '#ca8', name: 'Ruin-Keeper Daven', dialogue: ['I guard the Inscription Wall. Most visitors read it and walk away confused. A few read it and go very, very quiet.', 'The last king destroyed things that took centuries to build. Not in war. Not by accident. By decree. Read the wall and judge for yourself.', 'Someone tried to chisel the Inscription off the wall last month. Hired hands — professional. I did not ask who sent them.'], gives: { atk: 1 }, mood: 'neutral' },
	],
	duskhollow: [
		{ char: 'E', color: '#a8b', name: 'Elder Miravel', dialogue: ['We could see both worlds once. The living and the dead, walking the same streets. Now the veil thickens year by year, and we lose a little more of ourselves each time.', 'My grandmother spoke to ancestors as easily as I speak to you. My children cannot see them at all. Something is being taken from us — slowly, deliberately.', 'The Dusk Markets traded goods between worlds. Spirit-silk, dreamglass, bottled memory. Now the stalls stand empty, flickering.'], gives: { hp: 3 }, mood: 'neutral' },
		{ char: 'W', color: '#8ac', name: 'Spirit-Walker Thessyn', dialogue: ['I can still cross, but barely. The passage grows narrower each year. Like squeezing through a closing door.', 'The ghosts on the other side remember things. Old things. They try to tell me, but the veil muffles their voices. I catch fragments — names, warnings, apologies.', 'Do not trust the exorcists who come in official robes. The ones they banish are always the oldest — the ones who remember before. I do not know why. I only know they do not leave by choice.'], gives: { atk: 1 }, mood: 'friendly' },
		{ char: 'V', color: '#667', name: 'Watcher Coravel', dialogue: ['I am here to ensure the boundary remains stable. Nothing more.', 'The Division of Silence monitors thin-spots for public safety. The spirit world is dangerous to the untrained.', 'The twilight folk are a dying culture. Unfortunate, but the veil exists for a reason. Some doors should stay closed.'], mood: 'hostile' },
	],
	irongate: [
		{ char: 'R', color: '#a86', name: 'Remnant Engineer Tova', dialogue: ['The Great Forge still works. Eight hundred years buried under a mountain and the gears still turn. Iron Republic engineering — no magic, just precision.', 'The Republics proved you don\'t need gods to build a civilization. Elected senate, term limits, public debate. We had it all. Then one coward destroyed it in a single night.', 'The broken chain is our symbol. We were free once. We will be again.'], gives: { atk: 1 }, mood: 'neutral' },
		{ char: 'C', color: '#ca8', name: 'Artificer Brennik', dialogue: ['The rune system predates the Ascended. The most basic inscriptions correspond to older patterns — older than any god currently sitting on a throne. The Clockwork Creed has known this for centuries.', 'The device was destroyed before it was ever tested. They say it was sabotage — internal. But the Creed\'s records, what survive, suggest the sabotage came from outside. Someone did not want that device to exist.', 'Iron Republic engineering manuals are worth more than gold. Each one is a proof that mortals can build without prayer.'], gives: { hp: 2 }, mood: 'friendly' },
		{ char: 'S', color: '#886', name: 'Soldier Harsk', dialogue: ['I hear him sometimes. In the deep tunnels, where the collapsed gate still stands. A voice reciting names. Eight thousand names.', 'The soldiers who died here followed a general they trusted. He fled through a hidden tunnel while they fought and died. No monument. No accounting. Just the machine, still running, as if it didn\'t notice.', 'Someone buried this entire city under a mountain. That takes power beyond any mortal means. Ask yourself: who had that kind of power, and what were they trying to hide?'], gives: { hp: 3 }, mood: 'neutral' },
	],
	arcane_conservatory: [
		{ char: 'I', color: '#f84', name: 'Professor Ignis Valdren', dialogue: ['The first lesson of elemental magic is this: fire does not obey you. You negotiate with it. My hands are proof of what happens when negotiations fail.', 'Lightning is energy seeking ground. Ice is heat being stolen. Fire is matter remembering what it was before the world cooled. Understand the principle and the spell follows.', 'The Conservatory teaches three streams of elemental magic. The fourth — void manipulation — is forbidden. Officially because it is dangerous. Unofficially... I have my suspicions about who decided that.'], gives: { atk: 1 }, mood: 'neutral' },
		{ char: 'S', color: '#a8f', name: 'Professor Seraphina Ashveil', dialogue: ['Enchantment is not flashy. There are no explosions, no dramatic gestures. You weave a ward correctly and nothing happens. That is the point — nothing happens to you.', 'The Conservatory wards are layered fourteen deep. I maintain them personally. The outermost was set by the first Archmage. The innermost... the innermost I did not set. It was already here when the school was built.', 'I have noticed certain topics missing from our curriculum. Certain books removed from shelves. I say nothing. Paranoia is unbecoming of a professor. But I notice.'], gives: { hp: 2 }, mood: 'neutral' },
		{ char: 'B', color: '#8a4', name: 'Professor Bramwell Thornwick', dialogue: ['Welcome to the greenhouse! Mind the Screaming Mandrakes — they are teething. And the Venomous Ivy. And the... actually, touch nothing. Just stand there and absorb knowledge through proximity.', 'Alchemy is the most practical school. Ignis can throw fire, yes, very impressive. But can fire cure snakebite? Can lightning mend a broken bone? My potions can.', 'The rarest ingredient I have ever worked with was Phoenix Ash. Genuine Phoenix Ash. I brewed a single draught from it and the patient recovered from wounds that should have been fatal. I have been trying to source more ever since.'], gives: { hp: 3 }, mood: 'friendly' },
		{ char: 'M', color: '#ff8', name: 'Professor Mirael Dawnwhisper', dialogue: ['You have questions. I know what they are. I will not answer them yet — not because I am being mysterious, but because you are not ready to hear the answers without going quite mad.', 'Divination is not seeing the future. The future does not exist yet. Divination is seeing the patterns that make certain futures more likely than others. The distinction matters.', 'I looked through the Astral Observatory last night and saw something I have not seen in thirty years of scrying. Seven shadows where there should be none, seated on thrones that do not belong to them. I wrote it in my journal and the ink vanished.'], mood: 'neutral' },
		{ char: 'A', color: '#ec8', name: 'Archmage Aldric Voss', dialogue: ['The Conservatory has stood for four centuries. In that time we have produced some of the finest minds in the known world. Our curriculum is carefully designed — every subject balanced against every other.', 'Cross-stream mastery is a romantic idea but impractical. No mind can hold more than two or three magical disciplines without risking catastrophic instability. This is settled science.', 'I trust you are finding your studies satisfying? Good, good. Remember: the Conservatory exists to serve the greater good. And the greater good is best served by following the established curriculum.'], gives: { hp: 2 }, mood: 'friendly' },
	],
	gallowmere: [
		{ char: 'P', color: '#a97', name: 'Pol\'s Granddaughter Maren', dialogue: ['My family has lived in this cottage for five generations. Grandmother said never to dig under the hearthstone. I don\'t know why. I don\'t ask.', 'The twins\' war ended the same day it should have never started. Both kings dead by their own hand. Everyone says it was grief. Nobody says what caused the grief.', 'A rider came. Nobody knew him. He delivered letters to both throne rooms on the same morning. By evening, both kings were dead. The rider was never seen again.'], gives: { hp: 2 }, mood: 'neutral' },
		{ char: 'H', color: '#ca8', name: 'Chronicler Haleth', dialogue: ['The accounts contradict each other in almost every detail. Edric\'s men say Oswin provoked every escalation. Oswin\'s men say the same of Edric. But three witnesses — independently, decades apart — mentioned a rider neither court recognized. That detail I cannot explain away.', 'The evidence that started the war — the poisoned wife, the planted vial, the forged letters — none of it survives. Every original document has vanished. Copies of copies is all we have. That pattern does not happen by accident.', 'There were excavations under the capital during the war. Official records call them sewer maintenance. Ten years of sewer maintenance. During a siege. I have written it in my notes and I still don\'t know what to make of it.'], gives: { atk: 1 }, mood: 'friendly' },
		{ char: 'W', color: '#886', name: 'Old Soldier Corben', dialogue: ['I fought for Edric. My brother fought for Oswin. We didn\'t speak for ten years. Then both kings died and we had nothing left to fight about. We still don\'t speak. The silence is different now.', 'The farmers\' army against the professional army. We had numbers. They had training. It was perfectly matched — as if someone had designed it to last as long as possible.', 'After the war, strangers came through and bought land for nothing. Built estates where villages used to be. They didn\'t farm the land. They just... owned it. Watched it. Some of those estates are still occupied.'], gives: { hp: 3 }, mood: 'neutral' },
	],
	underdepths: [
		{ char: '?', color: '#a4f', name: 'Deep Scholar', dialogue: ['The Void Monolith predates all civilizations above.', 'Deepscript is not merely language — it reshapes thought.', 'Light is a crutch. True sight comes in darkness.'], mood: 'neutral' },
		{ char: 'F', color: '#4af', name: 'Fungal Farmer', dialogue: ['These glowing caps are safe to eat. Probably.', 'The mushroom forests stretch for miles in every direction.', 'Something stirs in the deep. Even the fungi tremble.'], gives: { hp: 3 }, mood: 'friendly' },
	],
};

/** Spawn regional NPCs in a settlement based on its region. */
function spawnRegionalNPCs(map: GameMap, region: string, existingNPCs: NPC[]): NPC[] {
	const defs = REGIONAL_NPCS[region];
	if (!defs) return existingNPCs;

	const occupied = new Set<string>();
	for (const npc of existingNPCs) occupied.add(`${npc.pos.x},${npc.pos.y}`);

	const result = [...existingNPCs];
	for (const def of defs) {
		// Find a free floor tile for this NPC
		let placed = false;
		for (let attempt = 0; attempt < 100 && !placed; attempt++) {
			const x = 2 + Math.floor(Math.random() * (map.width - 4));
			const y = 2 + Math.floor(Math.random() * (map.height - 4));
			const key = `${x},${y}`;
			if (map.tiles[y]?.[x] === '.' && !occupied.has(key)) {
				result.push({
					pos: { x, y },
					char: def.char,
					color: def.color,
					name: def.name,
					dialogue: def.dialogue,
					dialogueIndex: 0,
					gives: def.gives,
					given: false,
					mood: def.mood,
					moodTurns: 0,
				});
				occupied.add(key);
				placed = true;
			}
		}
	}
	return result;
}

/** Enter a settlement from the overworld. */
function enterSettlement(state: GameState, settlement: Settlement): void {
	state.level = 0;
	state.locationMode = 'location';
	state.currentLocationId = settlement.id;

	// Try to restore from cache
	if (restoreFromCache(state, settlement.id, 0)) {
		updateVisibility(state.visibility, state.map, state.player.pos, effectiveSightRadius(state));
		addMessage(state, `You return to ${settlement.name}.`, 'discovery');
		return;
	}

	// Generate fresh — use starting location generator for starting settlements, type-based for others
	const locResult = settlement.isStartingLocation
		? generateStartingLocation(settlement.isStartingLocation, MAP_W, MAP_H)
		: generateSettlementByType(settlement.type, MAP_W, MAP_H, settlement.name);
	state.map = locResult.map;
	state.player.pos = locResult.playerPos;
	state.enemies = locResult.enemies;
	state.npcs = spawnRegionalNPCs(locResult.map, settlement.region, locResult.npcs);
	state.visibility = createVisibilityGrid(MAP_W, MAP_H);
	state.traps = [];
	state.detectedTraps = new Set();
	state.detectedSecrets = new Set();
	state.hazards = [];
	state.chests = [];
	state.lootDrops = [];
	state.landmarks = [];
	updateVisibility(state.visibility, state.map, state.player.pos, effectiveSightRadius(state));
	addMessage(state, `You enter ${settlement.name}.`, 'discovery');
}

/** Enter a dungeon from the overworld. */
function enterDungeon(state: GameState, dungeon: DungeonEntrance): void {
	// Region danger level offsets the starting dungeon level
	const regionDef = REGION_DEFS[dungeon.region as RegionId];
	const dangerOffset = regionDef ? Math.max(0, regionDef.dangerLevel - 1) : 0;
	const startLevel = 1 + dangerOffset;

	state.locationMode = 'location';
	state.currentLocationId = dungeon.id;

	// Try to restore from cache
	if (restoreFromCache(state, dungeon.id, startLevel)) {
		state.level = startLevel;
		updateVisibility(state.visibility, state.map, state.player.pos, effectiveSightRadius(state));
		addMessage(state, `You return to ${dungeon.name}...`, 'discovery');
		return;
	}

	const next = newLevel(startLevel, state.characterConfig.difficulty, state.characterConfig.worldSeed);
	// Carry over player state
	next.player.hp = state.player.hp;
	next.player.maxHp = Math.max(state.player.maxHp, next.player.maxHp);
	next.player.attack = Math.max(state.player.attack, next.player.attack);
	next.player.name = state.player.name;
	next.player.statusEffects = [...state.player.statusEffects];
	next.xp = state.xp;
	next.characterLevel = state.characterLevel;
	next.sightRadius = state.sightRadius;
	next.characterConfig = state.characterConfig;
	next.abilityCooldown = state.abilityCooldown;
	next.skillPoints = state.skillPoints;
	next.unlockedSkills = [...state.unlockedSkills];
	next.rumors = [...state.rumors];
	next.knownLanguages = [...state.knownLanguages];
	next.heardStories = [...state.heardStories];
	next.lieCount = state.lieCount;
	next.stats = { ...state.stats };
	next.unlockedAchievements = [...state.unlockedAchievements];
	next.bestiary = { ...state.bestiary };
	next.hunger = state.hunger;
	next.thirst = state.thirst;
	next.survivalEnabled = state.survivalEnabled;
	next.turnCount = state.turnCount;
	next.worldMap = state.worldMap;
	next.overworldPos = state.overworldPos;
	next.locationMode = 'location';
	next.currentLocationId = dungeon.id;
	// Carry inventory state into dungeon
	next.inventory = [...state.inventory];
	next.equipment = { ...state.equipment };
	next.containers = [...state.containers];
	next.waypoint = state.waypoint;
	next.locationCache = state.locationCache;
	// Copy into state (mutate in place since we're inside handleOverworldInput)
	Object.assign(state, next);
	addMessage(state, `You descend into ${dungeon.name}...`, 'discovery');
	// Region-specific dungeon atmosphere
	const dungeonFlavor = DUNGEON_ENTRANCE_FLAVOR[dungeon.region];
	if (dungeonFlavor) {
		addMessage(state, dungeonFlavor, 'info');
	}
	if (dangerOffset > 0) {
		const dangerLabel = dangerOffset >= 8 ? 'overwhelming' : dangerOffset >= 5 ? 'very dangerous' : dangerOffset >= 3 ? 'dangerous' : 'challenging';
		addMessage(state, `The creatures here seem ${dangerLabel}. (Level ${startLevel}+)`, 'danger');
	}
}

/** Region-specific atmospheric text when entering a dungeon. */
const DUNGEON_ENTRANCE_FLAVOR: Record<string, string> = {
	greenweald:       'Roots claw through crumbling stone. The air smells of damp earth and old magic.',
	ashlands:         'Heat rises from below. The walls glow faintly orange, and the air tastes of sulfur.',
	hearthlands:      'Cobblestones give way to rough-hewn passages. Rats scatter before your torchlight.',
	frostpeak:        'Ice coats the walls in crystalline sheets. Your breath hangs in frozen clouds.',
	drowned_mire:     'Water seeps through the ceiling in a steady drip. The walls are slick with algae.',
	sunstone_expanse: 'Sand hisses through cracks in the ancient stonework. Hieroglyphs line the walls.',
	thornlands:       'Rusted pipes run along the ceiling. Somewhere deep below, gears still grind.',
	pale_coast:       'Salt crust lines the entrance. The sound of waves echoes from somewhere below.',
	glassfields:      'Crystal shards crunch underfoot. Prismatic light dances across the walls, revealing and concealing passages in turn.',
	verdant_deep:     'Vines slither aside as you descend. Bioluminescent moss bathes the tunnels in sickly green light. Roots pulse like veins.',
	mirrow_wastes:    'Bones crunch beneath your feet. The walls are scratched with tally marks — soldiers counting days they never finished.',
	silence_peaks:    'Your footsteps vanish into nothing. The tunnels swallow sound so completely that your own heartbeat is the loudest thing in the world.',
	timeless_wastes:  'The entrance flickers — there, then not, then there again. Inside, torchlight illuminates dust that falls upward.',
	hollow_sea:       'The tunnel slopes down into brackish water. Bioluminescent coral lines the walls, pulsing in rhythms that feel like breathing.',
	grey_wastes:      'The stone is veined with dull crystal — dead Ley Line fragments. The deeper you go, the more the walls seem to weep grey dust.',
	korthaven:        'Brick gives way to older stone. The smell of sewage fades into something mustier — old vaults, forgotten cellars, the bones of the city beneath the city.',
	eldergrove:       'Roots twist into a staircase descending beneath the forest floor. The walls are living wood, and sap glows faintly amber in the crevices. Something ancient breathes below.',
	stormcradle:      'The tunnel walls are fused glass — lightning-bored through solid rock. Static raises every hair on your body. The deeper you go, the louder the hum.',
	luminara_ruins:   'The stairs descend through layers of history — gilded mosaic gives way to charred stone gives way to something older. Time stutters here. Your torch flame freezes, then leaps forward.',
	duskhollow:       'The tunnel entrance flickers — solid stone one moment, translucent the next. Inside, you can see through the walls to a second tunnel overlaid on the first, like two drawings on the same page.',
	irongate:              'Iron rivets line the passage walls. The air is hot and dry — forge heat, centuries old, still radiating from the stone. Gears click in the darkness ahead. Something mechanical is still running.',
	arcane_conservatory:   'The stairs descend beneath the campus into older stone. Sigils glow along the walls — ward-work, still active after centuries. The air hums with latent enchantment, and somewhere below, something is practicing spells unsupervised.',
	gallowmere:            'The passage descends into old foundation stone — older than the war, older than the twin kingdoms. Someone has been down here recently: fresh torch marks on the walls, swept floors, and a single boot print in the dust heading deeper.',
	underdepths:           'The darkness here is absolute. Even your torch seems to shrink from the void.',
};

/** POI-type-specific reward text for grave sites. */
const GRAVE_LORE: Record<string, string> = {
	greenweald:       'An ancient elven ranger who fell defending the forest from corruption.',
	ashlands:         'An orc warlord whose dying wish was for peace between the clans.',
	hearthlands:      'A merchant prince who hid a fortune beneath the crossroads.',
	frostpeak:        'A dwarven runesmith whose final creation was never completed.',
	drowned_mire:     'A swamp witch who sacrificed herself to seal a plague beneath the waters.',
	sunstone_expanse: 'A nomadic stargazer who mapped the constellations into the desert stones.',
	thornlands:       'An Iron Republic founder who swore that gears would outlast gods.',
	pale_coast:       'A lighthouse keeper who watched the Hollow Sea swallow the old harbor.',
	glassfields:      'A Luminari chronomancer who froze herself mid-spell, hoping the future would know how to finish it.',
	verdant_deep:     'A Grey Pilgrim who walked the forbidden Ley Lines until the jungle itself grew over her, preserving her in roots and silence.',
	mirrow_wastes:    'A soldier who carried letters from both sides — and realized, too late, that the handwriting in the declarations of war was the same.',
	silence_peaks:    'A monk who transcribed the Undertone for sixty years. Her final knot-string reads: "The seventh voice is not singing. It is screaming."',
	timeless_wastes:  'A cartographer who mapped every version of this place. Her final entry: "The map is correct. The land has moved."',
	hollow_sea:       'A Dominion navigator who surfaced once to warn the land-dwellers. Her final log: "The membrane thins. Pelagathis sinks not into water but into nothing."',
	grey_wastes:      'A Grey Pilgrim who sang to the dead Ley Line every dawn for forty years. Her final words: "It answered. Once. Then went silent forever."',
	korthaven:        'A merchant prince who funded expeditions to every corner of the world. His ledger\'s last entry: "The gods trade in souls. We merely trade in coin. I wonder which currency is more honest."',
	eldergrove:       'An elven archivist who hid the last pre-Ascension texts beneath the roots. Her final note: "They burned the library at Ashfall. They will come for these next. The trees will not let them take them."',
	stormcradle:      'A storm warden who mapped the lightning patterns for thirty years. Her final chart note: "The bolts are not striking the ground. They are striking back at the sky."',
	luminara_ruins:   'A Luminari mathematician buried with her equations. Her epitaph: "The king said my proofs were sedition. I said they were truth. The ruins prove which of us was right."',
	duskhollow:       'A twilight midwife who delivered children in both worlds. Her epitaph: "Born in flesh and spirit both. Now neither world will claim her."',
	irongate:              'A Republic centurion buried standing upright, shield on arm. His epitaph is a single word scratched into the iron: "REMEMBER."',
	arcane_conservatory:   'A student who attempted to master all four schools simultaneously. Her tombstone reads: "She reached for everything and grasped the infinite. It did not let go."',
	gallowmere:            'A servant buried without a name. The headstone reads only: "He could not read, but he listened. And he never forgot."',
	underdepths:           'A Deepscript scholar who went mad deciphering the Void Monolith.',
};

/** Discover a POI on the overworld — gives type-specific rewards. */
export function discoverPOI(state: GameState, poi: PointOfInterest): void {
	const worldMap = state.worldMap as WorldMap;

	if (!poi.discovered) {
		poi.discovered = true;
		addMessage(state, `Discovered: ${poi.name}!`, 'discovery');
		state.stats.secretsFound++;

		// Base XP reward for discovery
		const xpGain = 10 + (state.characterLevel * 2);
		state.xp += xpGain;
		addMessage(state, `+${xpGain} XP for exploration.`, 'level_up');

		// Type-specific first-visit rewards
		const regionDef = REGION_DEFS[poi.region];

		switch (poi.type) {
			case 'shrine':
				applyEffect(state.player, 'regeneration', 10, 2);
				addMessage(state, 'You pray at the shrine. A warm light envelops you. (Regeneration 10 turns)', 'healing');
				break;

			case 'standing_stones': {
				const lang = regionDef?.language ?? 'Common';
				if (lang !== 'Common' && !state.knownLanguages.includes(lang)) {
					state.knownLanguages = [...state.knownLanguages, lang];
					addMessage(state, `The stone inscriptions whisper in your mind. Language learned: ${lang}!`, 'discovery');
				} else {
					// Already know the language — extra XP instead
					const bonusXp = 15 + (state.characterLevel * 3);
					state.xp += bonusXp;
					addMessage(state, `The inscriptions are familiar to you. +${bonusXp} bonus XP.`, 'level_up');
				}
				break;
			}

			case 'ruins':
				state.player.attack += 1;
				addMessage(state, 'Among the rubble you find a well-preserved weapon. (+1 ATK)', 'discovery');
				break;

			case 'hidden_cave':
				state.player.hp = state.player.maxHp;
				addMessage(state, 'A sheltered cave with a clear spring. You rest and recover fully.', 'healing');
				break;

			case 'ancient_tree':
				state.player.hp = state.player.maxHp;
				applyEffect(state.player, 'regeneration', 15, 3);
				addMessage(state, 'The ancient tree radiates life energy. You feel renewed. (Full HP + Regen 15 turns)', 'healing');
				break;

			case 'hot_spring':
				state.player.hp = state.player.maxHp;
				addMessage(state, 'You soak in the warm waters. All weariness fades. (Full HP)', 'healing');
				break;

			case 'grave_site': {
				const storyId = `grave_${poi.region}`;
				if (!state.heardStories.includes(storyId)) {
					state.heardStories = [...state.heardStories, storyId];
				}
				const lore = GRAVE_LORE[poi.region] ?? 'A forgotten soul rests here.';
				addMessage(state, `The epitaph reads: "${lore}"`, 'npc');
				break;
			}

			case 'obelisk':
				revealOverworldArea(worldMap, poi.pos, 15);
				addMessage(state, 'Atop the obelisk, you survey the land. A vast area is revealed on your map!', 'discovery');
				break;
		}

		checkLevelUp(state);
		processAchievements(state);
	} else {
		// Revisit rewards for certain POI types
		switch (poi.type) {
			case 'shrine':
				state.player.hp = Math.min(state.player.maxHp, state.player.hp + 3);
				addMessage(state, `${poi.name} — you pray quietly. (+3 HP)`, 'healing');
				break;
			case 'hot_spring':
				state.player.hp = Math.min(state.player.maxHp, state.player.hp + 10);
				addMessage(state, `${poi.name} — the warm waters soothe you. (+10 HP)`, 'healing');
				break;
			default:
				addMessage(state, `${poi.name} — you've been here before.`, 'info');
				break;
		}
	}
}

// ── Overworld Random Encounters ──

/** Region-specific encounter monster names (matched from MONSTER_DEFS or custom). */
const REGION_ENCOUNTERS: Record<string, { combat: string[]; nonCombat: string[] }> = {
	greenweald:       { combat: ['Wolf', 'Spider', 'Bat'], nonCombat: ['A wandering herbalist offers you a healing potion.', 'A lost elven traveler thanks you for directions.'] },
	hearthlands:      { combat: ['Goblin', 'Rat', 'Wolf'], nonCombat: ['A merchant caravan passes by and offers to trade.', 'A farmer shares bread and cheese with you.'] },
	ashlands:         { combat: ['Goblin', 'Ogre', 'Slime'], nonCombat: ['An orc scout watches you from a distance, then nods.', 'You find a discarded war banner — the forge clans passed here.'] },
	frostpeak:        { combat: ['Wolf', 'Skeleton', 'Troll'], nonCombat: ['A dwarven prospector shares warmth by a campfire.', 'You discover a frozen shrine and warm your hands.'] },
	drowned_mire:     { combat: ['Slime', 'Spider', 'Zombie'], nonCombat: ['A swamp witch offers a bitter tonic that restores health.', 'You find dry ground and an abandoned camp with supplies.'] },
	sunstone_expanse: { combat: ['Skeleton', 'Rat', 'Ogre'], nonCombat: ['A nomadic stargazer reads your fortune.', 'A desert trader sells you water from an oasis.'] },
	thornlands:       { combat: ['Wolf', 'Goblin', 'Spider'], nonCombat: ['An Iron Remnant tinker offers to repair your gear.', 'You find a rusted automaton half-buried in thorns — its gears still turn slowly.'] },
	pale_coast:       { combat: ['Slime', 'Rat', 'Skeleton'], nonCombat: ['A fisherman shares his catch with you. "The sea provides," he says.', 'You find a washed-up chest half-buried in sand. Inside: a crystal that hums faintly.'] },
	glassfields:      { combat: ['Wraith', 'Skeleton', 'Troll'], nonCombat: ['A fractured prism replays a moment of kindness from centuries ago. You feel restored.', 'A Luminari echo offers cryptic guidance before dissolving into light.'] },
	verdant_deep:     { combat: ['Spider', 'Troll', 'Slime'], nonCombat: ['A druid offers a poultice brewed from jungle herbs. Your wounds close.', 'A Crystalline Stag watches you from the undergrowth, then vanishes in a flash of prismatic light.'] },
	mirrow_wastes:    { combat: ['Wraith', 'Zombie', 'Skeleton'], nonCombat: ['Griefmoths swirl around you, absorbing your weariness. You feel lighter.', 'The wind carries a melody — two melodies, nearly identical, almost harmonizing. The Mirrow wives\' song.'] },
	silence_peaks:    { combat: ['Wolf', 'Wraith', 'Skeleton'], nonCombat: ['A blind monk presses a knotted string into your hand. You feel vibrations travel through your fingers.', 'You press your ear to the stone and feel a deep, subsonic pulse — the Undertone, still singing.'] },
	timeless_wastes:  { combat: ['Wraith', 'Skeleton', 'Troll'], nonCombat: ['A traveler walks past you — then walks past you again, wearing different clothes. She doesn\'t notice.', 'You find a campfire still warm with yesterday\'s embers. Your journal says you lit it tomorrow.'] },
	hollow_sea:       { combat: ['Slime', 'Wraith', 'Troll'], nonCombat: ['The water goes crystal-clear. Far below, you see drowned spires glowing faintly — then the clarity passes, and there is only dark sea.', 'A coral artifact washes ashore at your feet, still warm. It hums a melody in a language you almost understand.'] },
	grey_wastes:      { combat: ['Wraith', 'Zombie', 'Spider'], nonCombat: ['A Grey Pilgrim kneels beside a dead tree, whispering in Old Primal. For a moment, a single grey leaf unfurls — then crumbles.', 'The ground hums beneath your feet. A faint warmth rises through your boots — the dead Ley Line, dreaming.'] },
	korthaven:        { combat: ['Rat', 'Goblin', 'Wolf'], nonCombat: ['A merchant caravan rumbles past, guards eyeing you warily. The factor tips his hat and tosses you a bread roll.', 'A street performer juggles coins that catch the light strangely — one of them hums. She winks and pockets it before you can look closer.'] },
	eldergrove:       { combat: ['Spider', 'Wolf', 'Troll'], nonCombat: ['A silver-barked tree shifts its branches, revealing a hidden path that was not there a moment ago.', 'An elven scout drops from the canopy, studies you in silence, then vanishes back into the leaves with a curt nod.'] },
	stormcradle:      { combat: ['Wolf', 'Troll', 'Ogre'], nonCombat: ['Lightning strikes a boulder twenty paces ahead. When the afterimage fades, a fulgurite sculpture stands where the rock was — shaped like a hand reaching upward.', 'A storm warden signals you from a ridge, pointing toward a safe path between the strike zones. She vanishes before you can shout thanks.'] },
	luminara_ruins:   { combat: ['Wraith', 'Skeleton', 'Golem'], nonCombat: ['The air shimmers and for a heartbeat you see the street as it was — golden, alive, filled with scholars in white robes. Then ash.', 'A charred scroll fragment tumbles past your feet. The visible text reads: "...and the king decreed that henceforth all books shall..." The rest is burned away.'] },
	duskhollow:       { combat: ['Wraith', 'Spider', 'Wolf'], nonCombat: ['A figure walks beside you for several paces — translucent, grey, mouthing words you cannot hear. It reaches toward you, then the veil thickens and it is gone.', 'A building appears between two trees, solid and warm with candlelight. You blink and it is a ruin, dark and overgrown. You blink again and the candles return, briefly.'] },
	irongate:              { combat: ['Golem', 'Troll', 'Skeleton'], nonCombat: ['A gear the size of a wagon wheel grinds slowly in the wall beside you, driven by some mechanism deep underground. Oil drips from its teeth — fresh oil, recently applied by someone.', 'You find a Republic-era coin half-buried in ash. One side shows a broken chain. The other side has been scratched blank — deliberately, methodically, as if someone wanted a face erased from history.'] },
	arcane_conservatory:   { combat: ['Skeleton', 'Slime', 'Spider'], nonCombat: ['A student rushes past muttering about a failed transmutation exam. Sparks trail from her fingers.', 'An enchanted broom sweeps the path ahead of you, then pauses, seems to regard you, and sweeps off in the opposite direction.'] },
	gallowmere:            { combat: ['Wolf', 'Rat', 'Goblin'], nonCombat: ['A crow lands on a broken fence post and caws twice. An old woman in a nearby field stops working and counts something on her fingers, then resumes as if nothing happened.', 'You pass a crossroads marker listing two villages in opposite directions. Both villages have the same name — scratched out, rewritten, scratched out again.'] },
	underdepths:      { combat: ['Wraith', 'Troll', 'Minotaur'], nonCombat: ['A fungal glow illuminates a small alcove with a healing spring.', 'An echo from the deep whispers ancient knowledge.'] },
};

/** Encounter chance: ~5% off-road, ~2% on roads. Returns true if encounter triggers. */
function rollEncounter(tile: OverworldTile, turnCount: number): boolean {
	// Use turnCount as a simple pseudo-random source to keep it deterministic-ish
	const hash = ((turnCount * 2654435761) >>> 0) / 4294967296;
	const chance = tile.road ? 0.02 : 0.05;
	return hash < chance;
}

/** Generate a random combat encounter on the overworld. */
function triggerCombatEncounter(state: GameState, regionId: string): void {
	const worldMap = state.worldMap as WorldMap;
	const regionDef = REGION_DEFS[regionId as RegionId];
	if (!regionDef) return;

	const dangerLevel = regionDef.dangerLevel;
	const encounterLevel = Math.max(1, dangerLevel);
	const encounterDefs = REGION_ENCOUNTERS[regionId]?.combat ?? ['Rat', 'Goblin'];

	// Generate a small 15x10 arena
	const arenaW = 15;
	const arenaH = 10;
	const rng = createRng(hashSeed((state.characterConfig.worldSeed || 'enc') + ':enc:' + state.turnCount));
	const arenaMap = generateMap(arenaW, arenaH, 0, rng);
	// Remove stairs from encounter arena (no descending)
	for (let y = 0; y < arenaH; y++) {
		for (let x = 0; x < arenaW; x++) {
			if (arenaMap.tiles[y][x] === '>') {
				arenaMap.tiles[y][x] = '.';
			}
		}
	}

	const enemyCount = 1 + Math.floor(rng.next() * Math.min(3, 1 + Math.floor(dangerLevel / 3)));
	const positions = getSpawnPositions(arenaMap, 1 + enemyCount, rng);

	// Place player
	const playerPos = positions[0] ?? { x: 1, y: 1 };

	// Create enemies from region encounter table
	const enemies: Entity[] = [];
	for (let i = 1; i < positions.length && i <= enemyCount; i++) {
		const monsterName = encounterDefs[Math.floor(rng.next() * encounterDefs.length)];
		const def = MONSTER_DEFS.find(m => m.name === monsterName) ?? pickMonsterDef(encounterLevel, rng);
		const enemy = createMonster(positions[i], encounterLevel, def);
		applyDifficultyToEnemy(enemy, state.characterConfig.difficulty);
		enemies.push(enemy);
	}

	// Save overworld state and switch to encounter
	state.map = arenaMap;
	state.player.pos = playerPos;
	state.enemies = enemies;
	state.locationMode = 'location';
	state.currentLocationId = 'encounter';
	state.level = 0; // level 0 so stairs will exit back to overworld
	state.visibility = createVisibilityGrid(arenaW, arenaH);
	state.sightRadius = DEFAULT_SIGHT_RADIUS;
	updateVisibility(state.visibility, arenaMap, playerPos, state.sightRadius);
	state.traps = [];
	state.hazards = [];
	state.chests = [];
	state.lootDrops = [];
	state.npcs = [];
	state.landmarks = [];

	const enemyNames = enemies.map(e => e.name).join(', ');
	addMessage(state, `Ambush! You are attacked by ${enemyNames}!`, 'danger');
}

/** Trigger a non-combat encounter — healing, XP, or flavor. */
function triggerNonCombatEncounter(state: GameState, regionId: string): void {
	const encounters = REGION_ENCOUNTERS[regionId]?.nonCombat ?? ['You see something in the distance, but it vanishes.'];
	// Use turnCount for deterministic selection
	const hash = ((state.turnCount * 1664525 + 1013904223) >>> 0) / 4294967296;
	const text = encounters[Math.floor(hash * encounters.length)];
	addMessage(state, text, 'npc');

	// 50% chance: heal some HP, 50% chance: small XP reward
	if (hash < 0.5) {
		const healAmt = Math.min(5 + state.characterLevel, state.player.maxHp - state.player.hp);
		if (healAmt > 0) {
			state.player.hp += healAmt;
			addMessage(state, `You recover ${healAmt} HP.`, 'healing');
		}
	} else {
		const xpGain = 3 + state.characterLevel * 2;
		state.xp += xpGain;
		addMessage(state, `+${xpGain} XP from the encounter.`, 'level_up');
		checkLevelUp(state);
	}
}

/** Check and trigger random encounter on overworld movement. Returns true if encounter occurred. */
function checkRandomEncounter(state: GameState): boolean {
	const worldMap = state.worldMap as WorldMap;
	const pos = state.overworldPos!;
	const tile = worldMap.tiles[pos.y]?.[pos.x];
	if (!tile) return false;
	// No encounters on settlement/dungeon/POI tiles
	if (tile.locationId) return false;

	if (!rollEncounter(tile, state.turnCount)) return false;

	// 70% combat, 30% non-combat
	const combatHash = (((state.turnCount + 7) * 2246822519) >>> 0) / 4294967296;
	if (combatHash < 0.7) {
		triggerCombatEncounter(state, tile.region);
	} else {
		triggerNonCombatEncounter(state, tile.region);
	}
	return combatHash < 0.7; // return true only if combat (blocks further movement)
}

// ── Location State Caching ──

/** Build a cache key for a location + level combination. */
function locationCacheKey(locationId: string, level: number): string {
	return `${locationId}:${level}`;
}

/** Snapshot the current location state into the cache. */
function cacheCurrentLocation(state: GameState): void {
	if (!state.currentLocationId || state.currentLocationId === 'encounter') return;
	const key = locationCacheKey(state.currentLocationId, state.level);
	state.locationCache[key] = {
		map: state.map,
		enemies: [...state.enemies],
		npcs: [...state.npcs],
		traps: [...state.traps],
		detectedTraps: new Set(state.detectedTraps),
		hazards: [...state.hazards],
		chests: [...state.chests],
		lootDrops: [...state.lootDrops],
		landmarks: [...state.landmarks],
		visibility: state.visibility.map(row => [...row]),
		detectedSecrets: new Set(state.detectedSecrets),
		playerPos: { ...state.player.pos },
		containers: [...state.containers],
	};
}

/** Restore a cached location state. Returns true if cache existed. */
function restoreFromCache(state: GameState, locationId: string, level: number): boolean {
	const key = locationCacheKey(locationId, level);
	const cached = state.locationCache[key];
	if (!cached) return false;

	state.map = cached.map;
	state.enemies = cached.enemies;
	state.npcs = cached.npcs;
	state.traps = cached.traps;
	state.detectedTraps = cached.detectedTraps;
	state.hazards = cached.hazards;
	state.chests = cached.chests;
	state.lootDrops = cached.lootDrops;
	state.landmarks = cached.landmarks;
	state.visibility = cached.visibility;
	state.detectedSecrets = cached.detectedSecrets;
	state.player.pos = cached.playerPos;
	state.containers = cached.containers;
	return true;
}

/** Return to the overworld from a location. */
export function exitToOverworld(state: GameState): GameState {
	if (!state.worldMap || !state.overworldPos) return state;
	// Block exit during exam combat
	if (state.enemies.some(e => e.name === 'Exam Golem')) {
		addMessage(state, 'You cannot leave during the combat trial!', 'danger');
		return { ...state };
	}
	// Cache current location state before leaving
	cacheCurrentLocation(state);
	state.locationMode = 'overworld';
	state.currentLocationId = null;
	state.enemies = [];
	state.npcs = [];
	state.traps = [];
	state.hazards = [];
	state.chests = [];
	state.lootDrops = [];
	state.landmarks = [];
	addMessage(state, 'You return to the overworld.', 'info');
	return { ...state };
}

/** Render the overworld as a viewport-sized colored grid. */
export function renderOverworldColored(state: GameState): { char: string; color: string }[][] {
	const worldMap = state.worldMap as WorldMap;
	const pos = state.overworldPos!;
	const halfW = Math.floor(OVERWORLD_VIEWPORT_W / 2);
	const halfH = Math.floor(OVERWORLD_VIEWPORT_H / 2);
	const camX = Math.max(halfW, Math.min(worldMap.width - halfW - 1, pos.x));
	const camY = Math.max(halfH, Math.min(worldMap.height - halfH - 1, pos.y));
	const startX = camX - halfW;
	const startY = camY - halfH;

	const grid: { char: string; color: string }[][] = [];
	for (let vy = 0; vy < OVERWORLD_VIEWPORT_H; vy++) {
		const row: { char: string; color: string }[] = [];
		const wy = startY + vy;
		for (let vx = 0; vx < OVERWORLD_VIEWPORT_W; vx++) {
			const wx = startX + vx;

			if (wx < 0 || wy < 0 || wx >= worldMap.width || wy >= worldMap.height) {
				row.push({ char: ' ', color: '#000' });
				continue;
			}

			if (!worldMap.explored[wy][wx]) {
				row.push({ char: ' ', color: '#000' });
				continue;
			}

			// Player position
			if (wx === pos.x && wy === pos.y) {
				row.push({ char: '@', color: '#ff0' });
				continue;
			}

			const tile = worldMap.tiles[wy][wx];
			const isNearPlayer = Math.abs(wx - pos.x) <= OVERWORLD_SIGHT_RADIUS && Math.abs(wy - pos.y) <= OVERWORLD_SIGHT_RADIUS;

			// Locations
			if (tile.locationId) {
				const settlement = worldMap.settlements.find(s => s.id === tile.locationId);
				if (settlement) {
					const char = settlement.type === 'city' ? 'C' : settlement.type === 'town' ? 'T' : settlement.type === 'fortress' ? 'F' : settlement.type === 'village' ? 'v' : 'c';
					const color = isNearPlayer ? '#ff8' : '#886';
					row.push({ char, color });
					continue;
				}
				const dungeon = worldMap.dungeonEntrances.find(d => d.id === tile.locationId);
				if (dungeon) {
					row.push({ char: '>', color: isNearPlayer ? '#f88' : '#844' });
					continue;
				}
				const poi = worldMap.pois.find(p => p.id === tile.locationId);
				if (poi) {
					if (poi.hidden && !isNearPlayer) {
						// Hidden POI: render as normal terrain unless adjacent
						const display = TERRAIN_DISPLAY[tile.terrain];
						row.push({ char: display.char, color: dimColor(display.color) });
						continue;
					}
					row.push({ char: '?', color: isNearPlayer ? '#af8' : '#585' });
					continue;
				}
			}

			// Signpost
			if (tile.signpost) {
				row.push({ char: '+', color: isNearPlayer ? '#db8' : '#864' });
				continue;
			}

			// Road
			if (tile.road) {
				const roadChar = tile.road === 'main' ? '=' : '-';
				const roadColor = isNearPlayer ? '#ca8' : '#654';
				row.push({ char: roadChar, color: roadColor });
				continue;
			}

			// Terrain
			const display = TERRAIN_DISPLAY[tile.terrain];
			const color = isNearPlayer ? display.color : dimColor(display.color);
			row.push({ char: display.char, color });
		}
		grid.push(row);
	}
	return grid;
}

/** Render the zoomed-out world map (200×200 → MAP_W×MAP_H). */
export function renderWorldMap(state: GameState): { grid: { char: string; color: string }[][]; labels: { text: string; x: number; y: number; color: string }[] } {
	const worldMap = state.worldMap as WorldMap;
	const pos = state.overworldPos;
	const scaleX = WORLD_W / MAP_W;  // 4
	const scaleY = WORLD_H / MAP_H;  // ~8.33

	const grid: { char: string; color: string }[][] = [];
	const labels: { text: string; x: number; y: number; color: string }[] = [];

	// Track which regions we've placed labels for
	const labeledRegions = new Set<string>();

	for (let vy = 0; vy < MAP_H; vy++) {
		const row: { char: string; color: string }[] = [];
		const wy = Math.min(Math.floor(vy * scaleY), WORLD_H - 1);
		for (let vx = 0; vx < MAP_W; vx++) {
			const wx = Math.min(Math.floor(vx * scaleX), WORLD_W - 1);

			// Player position (check if player falls within this cell)
			if (pos) {
				const pvx = Math.floor(pos.x / scaleX);
				const pvy = Math.floor(pos.y / scaleY);
				if (vx === pvx && vy === pvy) {
					row.push({ char: '@', color: '#ff0' });
					continue;
				}
			}

			// Waypoint
			if (state.waypoint) {
				const wpvx = Math.floor(state.waypoint.x / scaleX);
				const wpvy = Math.floor(state.waypoint.y / scaleY);
				if (vx === wpvx && vy === wpvy) {
					row.push({ char: 'X', color: '#f0f' });
					continue;
				}
			}

			// Check if any tile in this cell is explored
			let explored = false;
			for (let sy = 0; sy < Math.ceil(scaleY) && !explored; sy++) {
				for (let sx = 0; sx < scaleX && !explored; sx++) {
					const ey = Math.min(wy + sy, WORLD_H - 1);
					const ex = Math.min(wx + sx, WORLD_W - 1);
					if (worldMap.explored[ey]?.[ex]) explored = true;
				}
			}

			if (!explored) {
				row.push({ char: ' ', color: '#000' });
				continue;
			}

			const tile = worldMap.tiles[wy][wx];

			// Settlements (check all tiles in this cell)
			let foundSettlement: Settlement | undefined;
			let foundDungeon: DungeonEntrance | undefined;
			let foundPOI: PointOfInterest | undefined;
			for (let sy = 0; sy < Math.ceil(scaleY) && !foundSettlement; sy++) {
				for (let sx = 0; sx < scaleX && !foundSettlement; sx++) {
					const ey = Math.min(wy + sy, WORLD_H - 1);
					const ex = Math.min(wx + sx, WORLD_W - 1);
					const ct = worldMap.tiles[ey]?.[ex];
					if (ct?.locationId) {
						const s = worldMap.settlements.find(s => s.id === ct.locationId);
						if (s) { foundSettlement = s; break; }
						const d = worldMap.dungeonEntrances.find(d => d.id === ct.locationId);
						if (d) { foundDungeon = d; break; }
						const p = worldMap.pois.find(p => p.id === ct.locationId && p.discovered);
						if (p) { foundPOI = p; break; }
					}
				}
			}

			if (foundSettlement) {
				const char = foundSettlement.type === 'city' ? 'C' : foundSettlement.type === 'town' ? 'T' : 'v';
				row.push({ char, color: '#ff8' });
				continue;
			}
			if (foundDungeon) {
				row.push({ char: '>', color: '#f88' });
				continue;
			}
			if (foundPOI) {
				row.push({ char: '?', color: '#af8' });
				continue;
			}

			// Region label placement (first explored cell per region)
			if (!labeledRegions.has(tile.region)) {
				labeledRegions.add(tile.region);
				const region = worldMap.regions.find(r => r.id === tile.region);
				if (region) {
					const danger = dangerDisplay(region.dangerLevel);
					labels.push({ text: `${region.name} [${danger.label}]`, x: vx, y: vy, color: REGION_COLORS[tile.region] ?? '#aaa' });
				}
			}

			// Roads
			if (tile.road) {
				row.push({ char: tile.road === 'main' ? '=' : '-', color: '#a86' });
				continue;
			}

			// Terrain
			const display = TERRAIN_DISPLAY[tile.terrain];
			row.push({ char: display.char, color: dimColor(display.color) });
		}
		grid.push(row);
	}
	return { grid, labels };
}

/** Get waypoint direction indicator for HUD display. */
export function getWaypointIndicator(state: GameState): { direction: string; distance: number } | null {
	if (!state.waypoint || !state.overworldPos) return null;
	const dx = state.waypoint.x - state.overworldPos.x;
	const dy = state.waypoint.y - state.overworldPos.y;
	const dist = Math.abs(dx) + Math.abs(dy);
	if (dist < 3) return { direction: 'HERE', distance: dist };
	let dir: string;
	const adx = Math.abs(dx);
	const ady = Math.abs(dy);
	if (ady < adx * 0.4) dir = dx > 0 ? 'E' : 'W';
	else if (adx < ady * 0.4) dir = dy > 0 ? 'S' : 'N';
	else if (dx > 0) dir = dy > 0 ? 'SE' : 'NE';
	else dir = dy > 0 ? 'SW' : 'NW';
	return { direction: dir, distance: dist };
}

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
		pendingAttributePoint: false,
		spellTargeting: null,
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
			state.stats.secretsFound++;
			addMessage(state, 'You notice a hidden passage in the wall!', 'discovery');
		}
	}
}

function tryDropLoot(state: GameState, enemy: Entity): void {
	const tier = getMonsterTier(enemy);
	const boss = isBoss(enemy);
	const drop = rollLootDrop(enemy.pos, state.level, tier, boss, enemy.name);
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
	warrior: 0.10,
	ranger: 0.20,
	cleric: 0.08,
	paladin: 0.05,
	necromancer: 0.12,
	bard: 0.18,
};

export const BLOCK_REDUCTION: Record<CharacterClass, number> = {
	warrior: 2,
	mage: 0,
	rogue: 1,
	ranger: 1,
	cleric: 1,
	paladin: 3,
	necromancer: 0,
	bard: 0,
};

export const PUSH_CHANCE: Record<CharacterClass, number> = {
	warrior: 1.0,
	rogue: 0.40,
	mage: 0.30,
	ranger: 0.45,
	cleric: 0.35,
	paladin: 0.80,
	necromancer: 0.20,
	bard: 0.25,
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

const MOOD_RECOVERY_TURNS = 20;

function relocateNpc(state: GameState, npc: NPC) {
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

function tickNpcMoods(state: GameState) {
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

function moveEnemies(state: GameState, defending = false) {
	tickAbilityCooldown(state);
	tickNpcMoods(state);

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

	// Tick mana regeneration and spell cooldowns
	tickManaRegen(state);
	tickSpellCooldowns(state);

	for (const enemy of state.enemies) {
		if (hasEffect(enemy, 'stun') || hasEffect(enemy, 'sleep') || hasEffect(enemy, 'freeze')) continue;

		// Exam Golem: 3-turn cycle AI (charge, charge, blast)
		if (enemy.name === 'Exam Golem' && enemy.turnCounter !== undefined) {
			enemy.turnCounter++;
			const cycle = ((enemy.turnCounter - 1) % 3) + 1; // 1, 2, 3
			const dx = state.player.pos.x - enemy.pos.x;
			const dy = state.player.pos.y - enemy.pos.y;
			const dist = Math.abs(dx) + Math.abs(dy);

			if (cycle === 3) {
				// BLAST turn — only hits if adjacent
				if (dist <= 1) {
					const blastDmg = 8 + Math.floor(Math.random() * 5); // 8-12
					state.player.hp -= blastDmg;
					state.stats.damageTaken += blastDmg;
					addMessage(state, `Exam Golem unleashes ARCANE BLAST for ${blastDmg} damage!`, 'damage_taken');
				} else {
					addMessage(state, 'Exam Golem unleashes ARCANE BLAST — but you\'re out of range!', 'info');
				}
			} else {
				// CHARGE turn — move toward player and deal low damage if adjacent
				const moveX = dx === 0 ? 0 : dx > 0 ? 1 : -1;
				const moveY = dy === 0 ? 0 : dy > 0 ? 1 : -1;
				const nx = enemy.pos.x + moveX;
				const ny = enemy.pos.y + moveY;
				if (nx === state.player.pos.x && ny === state.player.pos.y) {
					const chargeDmg = 1 + Math.floor(Math.random() * 2); // 1-2
					state.player.hp -= chargeDmg;
					state.stats.damageTaken += chargeDmg;
					addMessage(state, `Exam Golem charges! ${chargeDmg} damage.`, 'damage_taken');
				} else if (nx >= 0 && ny >= 0 && nx < state.map.width && ny < state.map.height &&
					state.map.tiles[ny][nx] === '.') {
					enemy.pos = { x: nx, y: ny };
					addMessage(state, `Exam Golem charges toward you...`, 'info');
				}
			}
			if (state.player.hp <= 0) handlePlayerDeath(state);
			continue;
		}

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
			state.stats.damageTaken += dmg;
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
	warrior: 0.50,
	ranger: 0.70,
	cleric: 0.45,
	paladin: 0.40,
	necromancer: 0.55,
	bard: 0.65,
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

	if (item.type === 'book' && item.pages) {
		state.activeBookReading = { bookId: item.id, currentPage: 0 };
		return { ...state };
	}

	if (item.type === 'consumable' && item.consumeEffect) {
		if (item.consumeEffect.hp) {
			state.player.hp = Math.min(state.player.maxHp, state.player.hp + item.consumeEffect.hp);
			addMessage(state, `Used ${item.name}. +${item.consumeEffect.hp} HP.`, 'healing');
		}
		if (item.consumeEffect.hunger) {
			state.hunger = Math.min(100, state.hunger + item.consumeEffect.hunger);
			addMessage(state, `Ate ${item.name}. Hunger restored.`, 'info');
		}
		if (item.consumeEffect.thirst) {
			state.thirst = Math.min(100, state.thirst + item.consumeEffect.thirst);
			addMessage(state, `Drank ${item.name}. Thirst restored.`, 'info');
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

// ---------------------------------------------------------------------------
// Spell casting helpers
// ---------------------------------------------------------------------------

function handleSpellKills(state: GameState, killed: Entity[]): void {
	for (const enemy of killed) {
		tryDropLoot(state, enemy);
		const bossKill = isBoss(enemy);
		const rareKill = isRare(enemy);
		const baseReward = xpReward(enemy, state.level);
		const reward = applyXpMultiplier(bossKill ? baseReward * 3 : rareKill ? baseReward * 2 : baseReward, state);
		state.xp += reward;
		state.stats.enemiesKilled++;
		if (bossKill) state.stats.bossesKilled++;
		recordKill(state.bestiary, enemy);
		const questMsgs = updateQuestProgress(state, 'kill', enemy.name);
		for (const qm of questMsgs) addMessage(state, qm, 'discovery');
		addMessage(state, `${enemy.name} defeated! +${reward} XP`, 'player_attack');
		if (enemy.name === 'Exam Golem' && state.academyState && !state.academyState.examPassed) {
			passExam(state);
			addMessage(state, 'You defeated the Exam Golem! You have passed the combat trial!', 'level_up');
		}
	}
	state.enemies = state.enemies.filter(e => !killed.includes(e));
	if (killed.length > 0) {
		checkLevelUp(state);
		processAchievements(state);
	}
}

function castSpellById(state: GameState, spellId: string): GameState {
	const spell = getSpellDef(spellId);
	if (!spell) {
		addMessage(state, 'Unknown spell!', 'warning');
		return { ...state };
	}

	if (hasEffect(state.player, 'stun')) {
		addMessage(state, 'You are stunned and cannot cast!', 'damage_taken');
		moveEnemies(state);
		return { ...state };
	}

	// Check cooldown
	if (state.spellCooldowns[spellId] > 0) {
		addMessage(state, `${spell.name} on cooldown (${state.spellCooldowns[spellId]} turns).`, 'warning');
		return { ...state };
	}

	// Check mana
	const armorWeight = getEquippedArmorWeight(state.equipment, CLASS_PROFILES[state.characterConfig.characterClass]);
	const cost = effectiveManaCost(spell, armorWeight);
	if ((state.player.mana ?? 0) < cost) {
		addMessage(state, `Not enough mana! (need ${cost}, have ${state.player.mana ?? 0})`, 'warning');
		return { ...state };
	}

	// Self-targeting spells cast immediately
	if (spell.targetType === 'self') {
		// AoE self-centered: hit all enemies in radius
		let targets: Entity[] = [];
		if (spell.aoeRadius > 0 && (spell.baseDamage > 0 || spell.statusEffect)) {
			const { x: px, y: py } = state.player.pos;
			targets = state.enemies.filter(e =>
				Math.abs(e.pos.x - px) <= spell.aoeRadius && Math.abs(e.pos.y - py) <= spell.aoeRadius
			);
		}
		const result = executeSpell(spell, state.player, targets, armorWeight);
		for (const msg of result.messages) addMessage(state, msg.text, msg.type);
		if (result.success) {
			state.spellCooldowns[spell.id] = spell.cooldown;
			handleSpellKills(state, result.killedEnemies);
		}
		state.spellMenuOpen = false;
		moveEnemies(state);
		return { ...state };
	}

	// Directional/targeted spells enter targeting mode
	if (spell.targetType === 'single_enemy' || spell.targetType === 'direction') {
		state.spellTargeting = { spellId: spell.id, targetType: spell.targetType };
		state.spellMenuOpen = false;
		addMessage(state, `${spell.name}: Choose a direction (WASD). Escape to cancel.`, 'magic');
		return { ...state };
	}

	// Fallback: cast on self
	const result = executeSpell(spell, state.player, [], armorWeight);
	for (const msg of result.messages) addMessage(state, msg.text, msg.type);
	if (result.success) state.spellCooldowns[spell.id] = spell.cooldown;
	state.spellMenuOpen = false;
	moveEnemies(state);
	return { ...state };
}

function castSpellFromMenu(state: GameState, menuIndex: number): GameState {
	if (menuIndex < 0 || menuIndex >= state.learnedSpells.length) return state;
	const spellId = state.learnedSpells[menuIndex];
	return castSpellById(state, spellId);
}

/** Export for external use (assign quick-cast slots) */
export function assignQuickCast(state: GameState, slot: number, spellId: string): GameState {
	if (slot < 0 || slot > 3) return state;
	if (!state.learnedSpells.includes(spellId)) return state;
	state.quickCastSlots[slot] = spellId;
	const spell = getSpellDef(spellId);
	addMessage(state, `${spell?.name ?? spellId} assigned to slot ${slot + 1}.`, 'info');
	return { ...state };
}

/** Export: teach the player a spell */
export function learnSpell(state: GameState, spellId: string): boolean {
	if (state.learnedSpells.includes(spellId)) return false;
	if (!SPELL_CATALOG[spellId]) return false;
	state.learnedSpells.push(spellId);
	// Auto-assign to first empty quick-cast slot
	const emptySlot = state.quickCastSlots.indexOf(null);
	if (emptySlot !== -1) {
		state.quickCastSlots[emptySlot] = spellId;
	}
	const spell = SPELL_CATALOG[spellId];
	addMessage(state, `You have learned ${spell.name}!`, 'magic');
	return true;
}

export function handleInput(state: GameState, key: string): GameState {
	// Overworld mode: delegate to overworld handler
	if (state.locationMode === 'overworld') {
		return handleOverworldInput(state, key);
	}

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

	// Spell targeting mode: WASD picks direction, Escape cancels
	if (state.spellTargeting) {
		if (key === 'Escape') {
			state.spellTargeting = null;
			addMessage(state, 'Spell cancelled.', 'info');
			return { ...state };
		}
		const targeting = state.spellTargeting;
		const spell = getSpellDef(targeting.spellId);
		if (!spell) { state.spellTargeting = null; return { ...state }; }

		if (targeting.targetType === 'single_enemy' || targeting.targetType === 'direction') {
			let tdx = 0, tdy = 0;
			if (key === 'w' || key === 'ArrowUp') tdy = -1;
			else if (key === 's' || key === 'ArrowDown') tdy = 1;
			else if (key === 'a' || key === 'ArrowLeft') tdx = -1;
			else if (key === 'd' || key === 'ArrowRight') tdx = 1;
			else return state;

			const tx = state.player.pos.x + tdx;
			const ty = state.player.pos.y + tdy;

			if (targeting.targetType === 'single_enemy') {
				const target = state.enemies.find(e => e.pos.x === tx && e.pos.y === ty);
				if (!target) {
					addMessage(state, 'No enemy in that direction.', 'warning');
					return { ...state };
				}
				const armorWeight = getEquippedArmorWeight(state.equipment, CLASS_PROFILES[state.characterConfig.characterClass]);
				const result = executeSpell(spell, state.player, [target], armorWeight);
				for (const msg of result.messages) addMessage(state, msg.text, msg.type);
				if (result.success) {
					state.spellCooldowns[spell.id] = spell.cooldown;
					handleSpellKills(state, result.killedEnemies);
				}
			}

			state.spellTargeting = null;
			moveEnemies(state);
			return { ...state };
		}
		return state;
	}

	// Spell menu open: navigate and cast
	if (state.spellMenuOpen) {
		if (key === 'Escape' || key === 'm') {
			state.spellMenuOpen = false;
			return { ...state };
		}
		if (key === 'w' || key === 'ArrowUp') {
			state.spellMenuCursor = Math.max(0, state.spellMenuCursor - 1);
			return { ...state };
		}
		if (key === 's' || key === 'ArrowDown') {
			state.spellMenuCursor = Math.min(state.learnedSpells.length - 1, state.spellMenuCursor + 1);
			return { ...state };
		}
		if (key === 'Enter' || key === ' ') {
			return castSpellFromMenu(state, state.spellMenuCursor);
		}
		return state;
	}

	// Attribute allocation mode
	if (state.pendingAttributePoint) {
		const attrMap: Record<string, AttributeName> = { '1': 'str', '2': 'int', '3': 'wil', '4': 'agi', '5': 'vit' };
		if (attrMap[key]) {
			const attr = attrMap[key];
			state.player[attr] = (state.player[attr] ?? 10) + 1;
			state.pendingAttributePoint = false;
			const weaponBonus = getWeaponBonus(state.equipment);
			const armorValue = getArmorValue(state.equipment);
			const archetype = ARCHETYPE_ATTRIBUTES[state.characterConfig.archetype ?? CLASS_PROFILES[state.characterConfig.characterClass].suggestedArchetype];
			recalculateDerivedStats(state.player, state.characterLevel, armorValue, weaponBonus, archetype.manaModifier);
			addMessage(state, `+1 ${attr.toUpperCase()} allocated! (now ${state.player[attr]})`, 'level_up');
			return { ...state };
		}
		return state; // Block other input during attribute allocation
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
		const slotIndex = parseInt(key) - 1;
		const spellId = state.quickCastSlots[slotIndex];
		if (!spellId) {
			addMessage(state, `Quick-cast slot ${key} is empty. Open spell menu (M) to assign.`, 'info');
			return { ...state };
		}
		return castSpellById(state, spellId);
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
				tryDropLoot(state, enemy);
				const bossKill = isBoss(enemy);
				const rareKill = isRare(enemy);
				const baseReward = xpReward(enemy, state.level);
				const reward = applyXpMultiplier(bossKill ? baseReward * 3 : rareKill ? baseReward * 2 : baseReward, state);
				state.xp += reward;
				state.stats.enemiesKilled++;
				if (bossKill) state.stats.bossesKilled++;
				recordKill(state.bestiary, enemy);
				// Quest progress on ability kills
				const questMsgs = updateQuestProgress(state, 'kill', enemy.name);
				for (const qm of questMsgs) addMessage(state, qm, 'discovery');
				addMessage(state, `${enemy.name} defeated! +${reward} XP`, 'player_attack');
				// Check for exam golem kill
				if (enemy.name === 'Exam Golem' && state.academyState && !state.academyState.examPassed) {
					passExam(state);
					addMessage(state, 'You defeated the Exam Golem! You have passed the combat trial!', 'level_up');
					addMessage(state, 'The Archmagus awaits you for the graduation ceremony.', 'discovery');
				}
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
			tryDropLoot(state, target);
			const bossKill = isBoss(target);
			const rareKill = isRare(target);
			const baseReward = xpReward(target, state.level);
			const multiplier = envKill ? ENVIRONMENTAL_KILL_BONUS : 1;
			const reward = applyXpMultiplier(Math.floor((bossKill ? baseReward * 3 : rareKill ? baseReward * 2 : baseReward) * multiplier), state);
			state.xp += reward;
			state.stats.enemiesKilled++;
			if (bossKill) state.stats.bossesKilled++;
			recordKill(state.bestiary, target);
			state.enemies = state.enemies.filter((e) => e !== target);
			// Quest progress on kill
			const questMsgs = updateQuestProgress(state, 'kill', target.name);
			for (const qm of questMsgs) addMessage(state, qm, 'discovery');
			// Check for exam golem kill
			if (target.name === 'Exam Golem' && state.academyState && !state.academyState.examPassed) {
				passExam(state);
				addMessage(state, 'You defeated the Exam Golem! You have passed the combat trial!', 'level_up');
				addMessage(state, 'The Archmagus awaits you for the graduation ceremony.', 'discovery');
			}
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
		processAchievements(next);
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
			state.activeDialogue.context = { ...state.activeDialogue.context, npcMood: option.onSelect.mood };
			const npc = state.npcs.find((n) => n.name === state.activeDialogue!.npcName);
			if (npc) {
				npc.mood = option.onSelect.mood;
				npc.moodTurns = 0;
			}
		}
		// Learn rumors
		if (option.onSelect.rumor && !state.rumors.some(r => r.id === option.onSelect!.rumor!.id)) {
			state.rumors = [...state.rumors, option.onSelect.rumor];
			addMessage(state, `Rumor learned: "${option.onSelect.rumor.text}"`, 'discovery');
			// Rumors reveal a distant location on the overworld map
			if (state.worldMap) {
				revealRumorLocation(state);
			}
		}
		// Learn languages
		if (option.onSelect.learnLanguage && !state.knownLanguages.includes(option.onSelect.learnLanguage)) {
			state.knownLanguages = [...state.knownLanguages, option.onSelect.learnLanguage];
			addMessage(state, `Language learned: ${option.onSelect.learnLanguage}! You can now understand speakers of this tongue.`, 'discovery');
		}
		// Collect stories
		if (option.onSelect.story && !state.heardStories.includes(option.onSelect.story.id)) {
			state.heardStories = [...state.heardStories, option.onSelect.story.id];
			addMessage(state, `Story collected: "${option.onSelect.story.title}" (+5 XP)`, 'discovery');
			state.xp += 5;
		}
		// NPC extreme emotional actions
		if (option.onSelect.npcAction) {
			const npcName = state.activeDialogue!.npcName;
			const npc = state.npcs.find((n) => n.name === npcName);
			state.activeDialogue = null;
			if (npc) {
				switch (option.onSelect.npcAction) {
					case 'attack': {
						const dmg = Math.max(1, Math.floor(state.player.attack * 0.3));
						state.player.hp -= dmg;
						addMessage(state, `${npcName} attacks you in a fury! You take ${dmg} damage!`, 'damage_taken');
						npc.mood = 'hostile';
						npc.moodTurns = 0;
						if (state.player.hp <= 0) handlePlayerDeath(state);
						break;
					}
					case 'flee': {
						addMessage(state, `${npcName} backs away in terror and flees!`, 'npc');
						npc.mood = 'afraid';
						npc.moodTurns = 0;
						relocateNpc(state, npc);
						break;
					}
					case 'break_down': {
						addMessage(state, `${npcName} breaks down sobbing uncontrollably...`, 'npc');
						npc.mood = 'sad';
						npc.moodTurns = 0;
						break;
					}
					case 'storm_off': {
						addMessage(state, `${npcName} storms off in disgust!`, 'npc');
						npc.mood = 'hostile';
						npc.moodTurns = 0;
						relocateNpc(state, npc);
						break;
					}
				}
			}
			return { ...state };
		}
		// Academy effects
		if (option.onSelect.enrollAcademy) {
			enrollAtAcademy(state);
			addMessage(state, 'You are now enrolled at the Arcane Academy! Your school year begins.', 'discovery');
		}
		if (option.onSelect.completeLesson) {
			completeLesson(state, option.onSelect.completeLesson);
			addMessage(state, 'Lesson complete! Remember what you learned.', 'discovery');
		}
		if (option.onSelect.addTitle && !state.playerTitles.includes(option.onSelect.addTitle)) {
			state.playerTitles.push(option.onSelect.addTitle);
			addMessage(state, `Title earned: ${option.onSelect.addTitle}!`, 'discovery');
		}
		if (option.onSelect.startExam) {
			// Spawn exam golem in the arena area
			const examGolem: Entity = {
				pos: { x: 40, y: 17 },
				char: 'G',
				color: '#f0f',
				name: 'Exam Golem',
				hp: 20,
				maxHp: 20,
				attack: 2,
				statusEffects: [],
				turnCounter: 0,
			};
			state.enemies.push(examGolem);
			addMessage(state, 'An Arcane Golem materializes in the practice arena! Defeat it to pass!', 'danger');
			if (state.academyState) {
				state.academyState.examTaken = true;
				state.academyState.examPart1Passed = true;
			}
			state.activeDialogue = null;
			return { ...state };
		}
		if (option.onSelect.startTeaching) {
			// Teaching handled through dialogue flow — just mark the intent
		}
		if (option.onSelect.completeTeaching) {
			const correct = option.onSelect.completeTeaching === 'correct';
			const teachMsgs = completeTeachingSession(state, correct);
			for (const tm of teachMsgs) state.messages.push(tm);
		}
	}

	// Social skill check — overrides normal navigation
	if (option.socialCheck) {
		const result = rollSocialCheck(option.socialCheck, state);
		const display = SOCIAL_SKILL_DISPLAY[option.socialCheck.skill];
		const bonusStr = result.bonus >= 0 ? `+${result.bonus}` : `${result.bonus}`;
		if (result.success) {
			addMessage(state, `[${display.label} Check: ${result.roll}${bonusStr}=${result.total} vs ${option.socialCheck.difficulty}] Success!`, 'discovery');
		} else {
			addMessage(state, `[${display.label} Check: ${result.roll}${bonusStr}=${result.total} vs ${option.socialCheck.difficulty}] Failed!`, 'damage_taken');
			// Track failed deception attempts for liar reputation
			if (option.socialCheck.skill === 'deceive') {
				state.lieCount++;
				if (state.lieCount >= 3) {
					addMessage(state, 'Your reputation as a liar is spreading...', 'trap');
				}
			}
		}
		const targetNode = result.success ? option.socialCheck.successNode : option.socialCheck.failNode;
		if (tree.nodes[targetNode]) {
			state.activeDialogue = { ...state.activeDialogue, currentNodeId: targetNode };
		}
		return { ...state };
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

export function canDetectLies(state: GameState): boolean {
	if (state.characterConfig.characterClass === 'rogue') return true;
	if (state.knownLanguages.includes('Deepscript')) return true;
	if (state.characterLevel >= 8) return true;
	return false;
}

export const MOOD_DISPLAY: Record<string, { label: string; color: string; icon: string }> = {
	friendly: { label: 'Friendly', color: '#4f4', icon: '\u2665' },
	neutral: { label: 'Neutral', color: '#888', icon: '' },
	hostile: { label: 'Hostile', color: '#f44', icon: '!' },
	afraid: { label: 'Afraid', color: '#f8f', icon: '~' },
	amused: { label: 'Amused', color: '#ff4', icon: '*' },
	sad: { label: 'Sad', color: '#48f', icon: ',' },
};

export function npcMoodColor(npc: NPC): string {
	if (npc.mood === 'neutral') return npc.color;
	return MOOD_DISPLAY[npc.mood]?.color ?? npc.color;
}

const DEEPSCRIPT_GLYPHS = 'ᚠᚡᚢᚣᚤᚥᚦᚧᚨᚩᚪᚫᚬᚭᚮᚯᚰᚱᚲᚳᚴᚵᚶᚷᚸᚹᚺᚻᚼᚽᚾᚿ';
const ORCISH_GLYPHS = 'ɤʁʂʃʇʈʊʋʌʍʎʏɯɰɱɲɳɴɵɶɷɸɹɺɻɼɽɾɿ';
const ELVISH_GLYPHS = 'ꝏꝑꝓꝕꝗꝙꝛꝝꝟꝡꝣꝥꝧꝩꝫꝭꝯꜣꜥꜧꜩꜫꜭꜯꜱꜳꜵꜷꜹꜻꜽ';

const LANGUAGE_GLYPHS: Record<string, string> = {
	Deepscript: DEEPSCRIPT_GLYPHS,
	Orcish: ORCISH_GLYPHS,
	Elvish: ELVISH_GLYPHS,
};

export function garbleText(text: string, language: string): string {
	const glyphs = LANGUAGE_GLYPHS[language] ?? DEEPSCRIPT_GLYPHS;
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
	if (state.locationMode === 'overworld') {
		return renderOverworldColored(state);
	}
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
					const alertSym = enemy.awareness ? getAlertSymbol(enemy.awareness.alertState) : '';
					const enemyColor = alertSym ? getAlertColor(enemy.awareness!.alertState) : (effectColor(enemy) ?? enemy.color);
					row.push({ char: alertSym || enemy.char, color: enemyColor });
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
