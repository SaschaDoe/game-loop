export interface Position {
	x: number;
	y: number;
}

export type CharacterClass = 'warrior' | 'mage' | 'rogue';

export type Difficulty = 'easy' | 'normal' | 'hard' | 'permadeath';

export type StartingLocation = 'village' | 'tavern' | 'cave';

export interface CharacterConfig {
	name: string;
	characterClass: CharacterClass;
	difficulty: Difficulty;
	startingLocation: StartingLocation;
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

export interface DialogueEffect {
	hp?: number;
	atk?: number;
	message?: string;
	mood?: NPCMood;
	rumor?: Rumor;
	learnLanguage?: string;
	story?: Story;
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
	| { type: 'minCharLevel'; value: number };

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
}

export interface DialogueTree {
	startNode: string;
	returnNode?: string;
	nodes: Record<string, DialogueNode>;
}

export interface DialogueContext {
	dungeonLevel: number;
	characterLevel: number;
	characterClass: CharacterClass;
	hpPercent: number;
	enemyCount: number;
	rumorCount: number;
	storyCount: number;
	knownLanguages: string[];
	playerName: string;
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
}

export type StatusEffectType = 'poison' | 'stun' | 'regeneration' | 'sleep' | 'burn' | 'freeze' | 'blind' | 'curse';

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

export type LandmarkType = 'graffiti' | 'campsite' | 'statue' | 'bones' | 'bloodstain' | 'shrine';

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

export type MessageType = 'info' | 'player_attack' | 'damage_taken' | 'healing' | 'level_up' | 'discovery' | 'death' | 'trap' | 'npc';

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
	stats: GameStats;
	unlockedAchievements: string[];
}
