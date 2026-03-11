import type { Item, Equipment, WorldContainer } from './items';

export interface Position {
	x: number;
	y: number;
}

export type CharacterClass = 'warrior' | 'mage' | 'rogue' | 'ranger' | 'cleric' | 'paladin' | 'necromancer' | 'bard' | 'adept' | 'primordial' | 'runesmith' | 'spellblade';

export type CharacterRace = 'elf' | 'dwarf' | 'human';

export type CharacterArchetype = 'arcane' | 'finesse' | 'might';

export type Difficulty = 'easy' | 'normal' | 'hard' | 'permadeath';

export type StartingLocation = 'village' | 'tavern' | 'cave' | 'academy';

export type AttributeName = 'str' | 'int' | 'wil' | 'agi' | 'vit';

export interface CharacterConfig {
	name: string;
	race: CharacterRace;
	characterClass: CharacterClass;
	archetype?: CharacterArchetype;
	difficulty: Difficulty;
	startingLocation: StartingLocation;
	worldSeed: string;
}

export type NPCMood = 'friendly' | 'neutral' | 'hostile' | 'afraid' | 'amused' | 'sad';

export type RumorAccuracy = 'true' | 'exaggerated' | 'false';

export interface Rumor {
	id: string;
	text: string;
	source: string;
	accuracy: RumorAccuracy;
}

export interface Story {
	id: string;
	title: string;
	text: string;
	teller: string;
	type: 'legend' | 'tall_tale' | 'cautionary' | 'personal' | 'lore';
}

export type NPCAction = 'attack' | 'flee' | 'break_down' | 'storm_off';

export interface DialogueEffect {
	hp?: number;
	atk?: number;
	message?: string;
	mood?: NPCMood;
	rumor?: Rumor;
	learnLanguage?: string;
	story?: Story;
	npcAction?: NPCAction;
	enrollAcademy?: boolean;
	startExam?: boolean;
	startTeaching?: boolean;
	completeTeaching?: 'correct' | 'wrong';
	addTitle?: string;
	learnRitual?: string;
	completeLesson?: string;
	learnSpell?: string;    // spell ID to teach (free, no talent point cost)
	acceptQuest?: string;   // quest ID to start
	completeQuest?: string; // quest ID to complete (all objectives marked done)
}

export type DialogueCondition =
	| { type: 'minLevel'; value: number }
	| { type: 'maxLevel'; value: number }
	| { type: 'class'; value: CharacterClass }
	| { type: 'notClass'; value: CharacterClass }
	| { type: 'hpBelow'; value: number }
	| { type: 'knowsLanguage'; value: string }
	| { type: 'hasRumors'; value: number }
	| { type: 'hasStories'; value: number }
	| { type: 'minCharLevel'; value: number }
	| { type: 'npcMood'; value: NPCMood }
	| { type: 'knownLiar'; value: number }
	| { type: 'minEnemiesKilled'; value: number }
	| { type: 'hasBossKills'; value: number }
	| { type: 'minSecretsFound'; value: number }
	| { type: 'hasRumor'; value: string }
	| { type: 'minChestsOpened'; value: number }
	| { type: 'startingLocation'; value: StartingLocation }
	| { type: 'minLevelsCleared'; value: number }
	| { type: 'hasTitle'; value: string }
	| { type: 'academyEnrolled' }
	| { type: 'academyGraduated' }
	| { type: 'academyDay'; value: number }
	| { type: 'academyLessonReady' }
	| { type: 'academyAllLessonsComplete' }
	| { type: 'lessonCompleted'; value: string }
	| { type: 'lessonNotCompleted'; value: string }
	| { type: 'academyExamNotTaken' }
	| { type: 'hasSpell'; value: string }
	| { type: 'hasRitual'; value: string }
	| { type: 'hasQuest'; value: string }
	| { type: 'questCompleted'; value: string }
	| { type: 'race'; value: CharacterRace }
	| { type: 'notRace'; value: CharacterRace }
	| { type: 'minRaceAttitude'; race: CharacterRace; value: number }
	| { type: 'maxRaceAttitude'; race: CharacterRace; value: number }
	| { type: 'allOf'; conditions: DialogueCondition[] };

export type SocialSkill = 'persuade' | 'intimidate' | 'deceive';

export interface SocialCheck {
	skill: SocialSkill;
	difficulty: number; // 1-20, checked against roll + bonuses
	successNode: string;
	failNode: string;
}

export interface DialogueOption {
	text: string;
	nextNode: string;
	color?: string;
	onSelect?: DialogueEffect;
	once?: boolean;
	showIf?: DialogueCondition;
	socialCheck?: SocialCheck;
}

export interface DialogueNode {
	id: string;
	npcText: string;
	options: DialogueOption[];
	language?: string;
	suspicious?: boolean;
}

export interface DialogueTree {
	startNode: string;
	returnNode?: string;
	conditionalStartNodes?: { condition: DialogueCondition; nodeId: string }[];
	nodes: Record<string, DialogueNode>;
}

export interface DialogueContext {
	dungeonLevel: number;
	characterLevel: number;
	characterClass: CharacterClass;
	hpPercent: number;
	enemyCount: number;
	rumorCount: number;
	rumorIds: string[];
	storyCount: number;
	knownLanguages: string[];
	playerName: string;
	npcMood: NPCMood;
	lieCount: number;
	enemiesKilled: number;
	bossesKilled: number;
	secretsFound: number;
	trapsDisarmed: number;
	chestsOpened: number;
	levelsCleared: number;
	maxDungeonLevel: number;
	startingLocation: StartingLocation;
	playerTitles: string[];
	academyEnrolled: boolean;
	academyGraduated: boolean;
	academyDay: number;
	academyLessonReady: boolean;
	academyAllLessonsComplete: boolean;
	lessonsCompleted: string[];
	academyExamTaken: boolean;
	learnedSpells: string[];
	learnedRituals: string[];
	activeQuestIds: string[];
	completedQuestIds: string[];
	playerRace: CharacterRace;
	raceAttitude: Record<CharacterRace, number>;
}

export interface ActiveDialogue {
	npcName: string;
	npcChar: string;
	npcColor: string;
	currentNodeId: string;
	tree: DialogueTree;
	visitedNodes: Set<string>;
	givenItems: boolean;
	mood: NPCMood;
	context: DialogueContext;
}

export interface NPC {
	pos: Position;
	char: string;
	color: string;
	name: string;
	dialogue: string[];
	dialogueIndex: number;
	gives?: { hp?: number; atk?: number };
	given: boolean;
	dialogueTree?: DialogueTree;
	mood: NPCMood;
	moodTurns: number;
	race?: CharacterRace;
	gender?: 'male' | 'female';
	raceAttitude?: Record<CharacterRace, number>;
}

export type StatusEffectType = 'poison' | 'stun' | 'regeneration' | 'sleep' | 'burn' | 'freeze' | 'blind' | 'curse' | 'inspire';

export interface StatusEffect {
	type: StatusEffectType;
	duration: number;
	potency: number;
}

export type AlertState = 'unaware' | 'suspicious' | 'alert' | 'combat';

export interface EnemyAwareness {
	alertState: AlertState;
	detectionMeter: number;
	lastKnownPlayerPos: Position | null;
	suspicionTurns: number;
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
	awareness?: EnemyAwareness;
	/** Turn counter for special AI patterns (e.g., Exam Golem 3-turn cycle) */
	turnCounter?: number;

	// Core attributes (US-MS-01) — optional for backward compat with monsters/tests
	str?: number;
	int?: number;
	wil?: number;
	agi?: number;
	vit?: number;

	// Mana (US-MS-03)
	mana?: number;
	maxMana?: number;

	// Derived stats (US-MS-02) — recalculated via recalculateDerivedStats()
	spellPower?: number;
	magicResist?: number;
	dodgeChance?: number;
	critChance?: number;
	physicalDefense?: number;

	// Enemy spellcasting AI
	enemySpellCooldowns?: Record<string, number>;
	channeling?: { spellId: string; turnsLeft: number } | null;
}

export type TrapType = 'spike' | 'poison_dart' | 'alarm' | 'teleport';

export interface Trap {
	pos: Position;
	type: TrapType;
	triggered: boolean;
}

export type HazardType = 'lava' | 'poison_gas';

export interface Hazard {
	pos: Position;
	type: HazardType;
}

export type ChestType = 'wooden' | 'iron' | 'gold';

export interface Chest {
	pos: Position;
	type: ChestType;
	opened: boolean;
	trapped: boolean;
	mimic: boolean;
}

export type LootType = 'healing' | 'xp_bonus' | 'atk_bonus';

export interface LootDrop {
	pos: Position;
	type: LootType;
	value: number;
}

export type LandmarkType = 'graffiti' | 'campsite' | 'statue' | 'bones' | 'bloodstain' | 'shrine' | 'riddle_inscription' | 'ancient_mechanism';

export interface Landmark {
	pos: Position;
	type: LandmarkType;
	examined: boolean;
}

export type Tile = '#' | '.' | '>' | '*';

export enum Visibility {
	Unexplored = 0,
	Explored = 1,
	Visible = 2
}

export type MessageType = 'info' | 'player_attack' | 'damage_taken' | 'healing' | 'level_up' | 'discovery' | 'death' | 'trap' | 'npc' | 'danger' | 'magic' | 'warning';

export interface GameMessage {
	text: string;
	type: MessageType;
}

export interface GameMap {
	width: number;
	height: number;
	tiles: Tile[][];
	secretWalls: Set<string>;
}

export interface GameStats {
	enemiesKilled: number;
	bossesKilled: number;
	secretsFound: number;
	trapsDisarmed: number;
	chestsOpened: number;
	levelsCleared: number;
	npcsSpokenTo: number;
	landmarksExamined: number;
	damageDealt: number;
	damageTaken: number;
	maxDungeonLevel: number;
	stealthKills: number;
	backstabs: number;
	questsCompleted: number;
	questsFailed: number;
}

export type LocationMode = 'overworld' | 'location';

export interface CachedLocationState {
	map: GameMap;
	enemies: Entity[];
	npcs: NPC[];
	traps: Trap[];
	detectedTraps: Set<string>;
	hazards: Hazard[];
	chests: Chest[];
	lootDrops: LootDrop[];
	landmarks: Landmark[];
	visibility: Visibility[][];
	detectedSecrets: Set<string>;
	playerPos: Position;
	containers: WorldContainer[];
}

export interface RitualChannelingState {
	ritualId: string;
	turnsRemaining: number;
	turnsTotal: number;
}

export interface WardZone {
	center: Position;
	radius: number;
	damage: number;
	turnsRemaining: number;
}

export interface TerrainEffect {
	pos: Position;
	type: 'burning' | 'frozen' | 'electrified';
	duration: number;
	damagePerTurn: number;
}

export type SpellTargetType = 'self' | 'single_enemy' | 'direction' | 'area' | 'tile';

export interface SpellTargetingState {
	spellId: string;
	targetType: SpellTargetType;
	/** For area spells, the selected position */
	cursorPos?: Position;
}

export interface GameState {
	player: Entity;
	enemies: Entity[];
	map: GameMap;
	messages: GameMessage[];
	level: number;
	gameOver: boolean;
	xp: number;
	characterLevel: number;
	visibility: Visibility[][];
	sightRadius: number;
	detectedSecrets: Set<string>;
	traps: Trap[];
	detectedTraps: Set<string>;
	characterConfig: CharacterConfig;
	abilityCooldown: number;
	hazards: Hazard[];
	npcs: NPC[];
	chests: Chest[];
	lootDrops: LootDrop[];
	skillPoints: number;
	unlockedSkills: string[];
	activeDialogue: ActiveDialogue | null;
	rumors: Rumor[];
	knownLanguages: string[];
	landmarks: Landmark[];
	heardStories: string[];
	lieCount: number;
	stats: GameStats;
	unlockedAchievements: string[];
	bestiary: Record<string, BestiaryEntry>;
	hunger: number;
	thirst: number;
	survivalEnabled: boolean;
	turnCount: number;
	locationMode: LocationMode;
	worldMap: unknown | null;      // WorldMap from overworld.ts (typed as unknown to avoid circular deps)
	overworldPos: Position | null;  // player position on the overworld grid
	currentLocationId: string | null; // which settlement/dungeon we're inside
	waypoint: Position | null;     // overworld waypoint set from world map view
	inventory: (Item | null)[];
	equipment: Equipment;
	containers: WorldContainer[];
	activeBookReading: { bookId: string; currentPage: number } | null;
	inventoryOpen: boolean;
	activeContainer: string | null;  // container id when interacting
	inventoryCursor: number;  // which slot is selected (0-11 for inventory, 12-19 for equipment, 20+ for container)
	inventoryPanel: 'inventory' | 'equipment' | 'container';  // which panel has focus
	locationCache: Record<string, CachedLocationState>;  // cached location states keyed by "locationId:level"
	quests: Quest[];
	completedQuestIds: string[];
	failedQuestIds: string[];
	stealth: StealthState;
	academyState: AcademyState | null;
	playerTitles: string[];

	// Race system
	playerRace: CharacterRace;
	permanentBuffs: PermanentBuff[];
	npcAttitudeShifts: Record<string, Record<CharacterRace, number>>;

	// Magic system (Epic 79)
	learnedSpells: string[];            // spell IDs the player has learned
	spellCooldowns: Record<string, number>;  // spell ID → remaining cooldown turns
	quickCastSlots: (string | null)[];  // 4 quick-cast slots (keys 1-4), each holds a spell ID or null
	manaRegenBaseCounter: number;       // turn counter for base mana regen (+1 per 5 turns)
	manaRegenIntCounter: number;        // turn counter for INT-based mana regen
	spellMenuOpen: boolean;             // whether the spell selection menu is open
	spellMenuCursor: number;            // selected spell index in the menu
	/** Targeting mode for spells that need a direction/position */
	spellTargeting: SpellTargetingState | null;

	// Mastery & Forbidden magic (Epic 79 extended)
	schoolMastery: Record<string, number>;
	forbiddenCosts: {
		corruption: number;
		paradoxBaseline: number;
		maxHpLost: number;
		sanityLost: number;
		soulCapLost: number;
	};
	leyLineLevel: number;
	/** Remaining turns of True Sight ley line vision (reveals ley lines on overworld) */
	trueSightActive: number;
	/** Tile keys ("x,y") with ley lines revealed by Reveal Secrets this turn */
	revealedLeyLineTiles: Set<string>;

	// Ritual system (Epic 79)
	learnedRituals: string[];
	ritualChanneling: RitualChannelingState | null;
	activeWards: WardZone[];
	teleportAnchors: Record<number, Position>;  // dungeon level → anchor position
	activeSummon: Entity | null;
	scriedLevel: number | null;

	// Terrain effects from spells
	terrainEffects: TerrainEffect[];

	// Class specialization
	specialization: string | null;
	pendingSpecialization: boolean;

	// Forbidden magic passives
	forbiddenPassives: string[]; // e.g. ['Blood Frenzy', 'Temporal Sense']
}

// ---------------------------------------------------------------------------
// Academy system
// ---------------------------------------------------------------------------

export interface AcademyState {
	enrolled: boolean;
	enrolledAtTurn: number;
	lessonsCompleted: string[];
	/** Index of the next lesson (0-5), or 6 if all complete */
	nextLessonIndex: number;
	/** Turn at which the next lesson becomes available */
	nextLessonAvailableTurn: number;
	examTaken: boolean;
	examPassed: boolean;
	examPart1Passed: boolean;
	graduated: boolean;
	isTeaching: boolean;
	teachingSessions: number;
	teachingCooldownTurn: number;
}

export interface BestiaryEntry {
	timesSeen: number;
	timesKilled: number;
	rareEncountered: boolean;
	rareKilled: boolean;
}

// ---------------------------------------------------------------------------
// Quest system
// ---------------------------------------------------------------------------

export type QuestStatus = 'active' | 'completed' | 'failed';

export type QuestObjectiveType = 'kill' | 'collect' | 'talk' | 'explore' | 'escort' | 'deliver';

export interface QuestObjective {
	id: string;
	description: string;
	type: QuestObjectiveType;
	target?: string;
	current: number;
	required: number;
	completed: boolean;
}

export interface QuestReward {
	xp?: number;
	hp?: number;
	atk?: number;
	items?: string[];
	rumor?: Rumor;
	story?: Story;
	learnRitual?: string;
	permanentBuff?: string;
}

export type BuffEffect =
	| { type: 'statBonus'; stat: 'spellPower' | 'physicalDefense' | 'socialBonus'; value: number }
	| { type: 'flag'; flag: 'leyLinesAlwaysVisible' | 'runeEnhanceChance' }
	| { type: 'conditional'; trigger: 'hpBelow20Pct'; effect: 'heal25Pct'; usesPerLevel: number };

export interface PermanentBuff {
	id: string;
	source: string;
	effects: BuffEffect[];
}

export interface Quest {
	id: string;
	title: string;
	description: string;
	status: QuestStatus;
	objectives: QuestObjective[];
	rewards: QuestReward;
	giverNpcName?: string;
	regionId?: string;
	isMainQuest: boolean;
	turnAccepted: number;
	turnLimit?: number;
	raceRequirement?: CharacterRace;
}

// ---------------------------------------------------------------------------
// Stealth system
// ---------------------------------------------------------------------------

export interface StealthState {
	isHidden: boolean;
	noiseLevel: number;
	lastNoisePos: Position | null;
	backstabReady: boolean;
}
