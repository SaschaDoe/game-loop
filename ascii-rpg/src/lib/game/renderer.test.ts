import { describe, it, expect } from 'vitest';
import { dimColor, render, renderLocationColored } from './renderer';
import type { GameState, Entity, NPC, Landmark, LootDrop, Hazard, Chest } from './types';
import { Visibility } from './types';
import type { WorldContainer } from './items';

function makeEnemy(x: number, y: number, overrides?: Partial<Entity>): Entity {
	return {
		pos: { x, y },
		char: 'G',
		color: '#0f0',
		name: 'Goblin',
		hp: 1,
		maxHp: 3,
		attack: 1,
		statusEffects: [],
		...overrides
	};
}

function makeNPC(x: number, y: number, overrides?: Partial<NPC>): NPC {
	return {
		pos: { x, y },
		char: 'N',
		color: '#88f',
		name: 'Sage',
		dialogue: ['Hello.'],
		dialogueIndex: 0,
		given: false,
		mood: 'neutral',
		moodTurns: 0,
		...overrides
	};
}

function makeTestState(overrides?: Partial<GameState>): GameState {
	const width = 10;
	const height = 10;
	const tiles = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => '.' as const)
	);
	const visibility = Array.from({ length: height }, () =>
		Array.from({ length: width }, () => Visibility.Visible)
	);
	return {
		player: {
			pos: { x: 5, y: 5 },
			char: '@',
			color: '#ff0',
			name: 'Hero',
			hp: 20,
			maxHp: 20,
			attack: 10,
			statusEffects: []
		},
		enemies: [],
		map: { width, height, tiles, secretWalls: new Set<string>() },
		messages: [],
		level: 1,
		gameOver: false,
		xp: 0,
		characterLevel: 1,
		visibility,
		sightRadius: 8,
		detectedSecrets: new Set<string>(),
		traps: [],
		detectedTraps: new Set<string>(),
		characterConfig: { name: 'Hero', characterClass: 'warrior' as const, difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' },
		abilityCooldown: 0,
		hazards: [],
		npcs: [],
		chests: [],
		lootDrops: [],
		skillPoints: 0,
		unlockedSkills: [],
		activeDialogue: null,
		rumors: [],
		knownLanguages: [],
		landmarks: [],
		heardStories: [],
		stats: { enemiesKilled: 0, bossesKilled: 0, secretsFound: 0, trapsDisarmed: 0, chestsOpened: 0, levelsCleared: 0, npcsSpokenTo: 0, landmarksExamined: 0, damageDealt: 0, damageTaken: 0, maxDungeonLevel: 0, stealthKills: 0, backstabs: 0, questsCompleted: 0, questsFailed: 0 },
		unlockedAchievements: [],
		lieCount: 0,
		bestiary: {},
		hunger: 100,
		thirst: 100,
		survivalEnabled: true,
		turnCount: 0,
		locationMode: 'location' as const,
		worldMap: null,
		overworldPos: null,
		currentLocationId: null,
		waypoint: null,
		inventory: Array.from({ length: 12 }, () => null),
		equipment: { head: null, body: null, trouser: null, leftHand: null, rightHand: null, back: null, leftFoot: null, rightFoot: null },
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
		playerRace: 'human' as const,
		permanentBuffs: [],
		npcAttitudeShifts: {},
		learnedSpells: [],
		spellCooldowns: {},
		quickCastSlots: [null, null, null, null],
		manaRegenBaseCounter: 0,
		manaRegenIntCounter: 0,
		spellMenuOpen: false,
		spellMenuCursor: 0,
		spellTargeting: null,
		schoolMastery: {},
		forbiddenCosts: { corruption: 0, paradoxBaseline: 0, maxHpLost: 0, sanityLost: 0, soulCapLost: 0 },
		leyLineLevel: 0,
		trueSightActive: 0,
		revealedLeyLineTiles: new Set(),
		learnedRituals: [],
		ritualChanneling: null,
		activeWards: [],
		teleportAnchors: {},
		activeSummon: null,
		scriedLevel: null,
		terrainEffects: [],
		specialization: null,
		pendingSpecialization: false,
		forbiddenPassives: [],
		...overrides
	};
}

// ── dimColor ──

describe('dimColor', () => {
	it('dims #ffffff to ~35% on each channel', () => {
		const result = dimColor('#ffffff');
		// 255 * 0.35 = 89.25 → floor = 89 = 0x59
		expect(result).toBe('#595959');
	});

	it('expands 3-char hex (#fff) then dims', () => {
		const result = dimColor('#fff');
		// #fff → #ffffff → 255 * 0.35 = 89 = 0x59
		expect(result).toBe('#595959');
	});

	it('dims #000000 to #000000', () => {
		const result = dimColor('#000');
		expect(result).toBe('#000000');
	});

	it('dims a colored hex correctly', () => {
		// #ff0000 → r=255, g=0, b=0
		// r = floor(255 * 0.35) = 89 = 0x59
		const result = dimColor('#ff0000');
		expect(result).toBe('#590000');
	});

	it('dims mid-range values correctly', () => {
		// #808080 → r=128, g=128, b=128
		// floor(128 * 0.35) = floor(44.8) = 44 = 0x2c
		const result = dimColor('#808080');
		expect(result).toBe('#2c2c2c');
	});

	it('expands 3-char hex with different channels', () => {
		// #f00 → #ff0000
		const result = dimColor('#f00');
		expect(result).toBe('#590000');
	});
});

// ── render ──

describe('render', () => {
	it('produces a string array grid with player @ at their position', () => {
		const state = makeTestState();
		const lines = render(state);
		expect(lines).toHaveLength(10);
		expect(lines[5][5]).toBe('@');
	});

	it('shows enemies by their char', () => {
		const enemy = makeEnemy(3, 2, { char: 'S' });
		const state = makeTestState({ enemies: [enemy] });
		const lines = render(state);
		expect(lines[2][3]).toBe('S');
	});

	it('shows tiles for empty positions', () => {
		const state = makeTestState();
		const lines = render(state);
		// position (0,0) has no player or enemy, should show tile '.'
		expect(lines[0][0]).toBe('.');
	});

	it('player takes precedence over enemy at same position', () => {
		const enemy = makeEnemy(5, 5); // same as player
		const state = makeTestState({ enemies: [enemy] });
		const lines = render(state);
		expect(lines[5][5]).toBe('@');
	});

	it('shows wall tiles', () => {
		const state = makeTestState();
		state.map.tiles[0][0] = '#';
		const lines = render(state);
		expect(lines[0][0]).toBe('#');
	});

	it('each line has correct width', () => {
		const state = makeTestState();
		const lines = render(state);
		for (const line of lines) {
			expect(line).toHaveLength(10);
		}
	});

	it('shows multiple enemies', () => {
		const e1 = makeEnemy(1, 1, { char: 'R' });
		const e2 = makeEnemy(8, 8, { char: 'D' });
		const state = makeTestState({ enemies: [e1, e2] });
		const lines = render(state);
		expect(lines[1][1]).toBe('R');
		expect(lines[8][8]).toBe('D');
	});
});

// ── renderLocationColored ──

describe('renderLocationColored', () => {
	it('shows player as @ with correct color', () => {
		const state = makeTestState();
		const grid = renderLocationColored(state);
		const cell = grid[5][5];
		expect(cell.char).toBe('@');
		expect(cell.color).toBe('#ff0'); // player default color, no status effects
	});

	it('hides unexplored tiles as blank/black', () => {
		const state = makeTestState();
		state.visibility[0][0] = Visibility.Unexplored;
		const grid = renderLocationColored(state);
		expect(grid[0][0].char).toBe(' ');
		expect(grid[0][0].color).toBe('#000');
	});

	it('dims explored-but-not-visible tiles', () => {
		const state = makeTestState();
		state.visibility[0][0] = Visibility.Explored;
		const grid = renderLocationColored(state);
		// Floor tile '.' has tileColor '#666666'
		// dimmed: floor(0x66 * 0.35) = floor(102 * 0.35) = floor(35.7) = 35 = 0x23
		expect(grid[0][0].char).toBe('.');
		expect(grid[0][0].color).toBe('#232323');
	});

	it('shows enemies in visible area', () => {
		const enemy = makeEnemy(3, 3);
		const state = makeTestState({ enemies: [enemy] });
		const grid = renderLocationColored(state);
		expect(grid[3][3].char).toBe('G');
		expect(grid[3][3].color).toBe('#0f0');
	});

	it('shows NPCs with mood colors', () => {
		const npc = makeNPC(2, 2, { mood: 'friendly' });
		const state = makeTestState({ npcs: [npc] });
		const grid = renderLocationColored(state);
		expect(grid[2][2].char).toBe('N');
		// friendly mood color is '#4f4'
		expect(grid[2][2].color).toBe('#4f4');
	});

	it('shows NPCs with neutral mood using their own color', () => {
		const npc = makeNPC(2, 2, { mood: 'neutral', color: '#88f' });
		const state = makeTestState({ npcs: [npc] });
		const grid = renderLocationColored(state);
		expect(grid[2][2].char).toBe('N');
		expect(grid[2][2].color).toBe('#88f');
	});

	it('shows chests at their position', () => {
		const chest: Chest = { pos: { x: 4, y: 4 }, type: 'wooden', opened: false, trapped: false, mimic: false };
		const state = makeTestState({ chests: [chest] });
		const grid = renderLocationColored(state);
		// wooden chest char='c', color='#aa8844'
		expect(grid[4][4].char).toBe('c');
		expect(grid[4][4].color).toBe('#aa8844');
	});

	it('shows loot drops at their position', () => {
		const loot: LootDrop = { pos: { x: 6, y: 6 }, type: 'healing', value: 5 };
		const state = makeTestState({ lootDrops: [loot] });
		const grid = renderLocationColored(state);
		// healing loot: char='!', color='#ff88aa'
		expect(grid[6][6].char).toBe('!');
		expect(grid[6][6].color).toBe('#ff88aa');
	});

	it('shows landmarks at their position', () => {
		const landmark: Landmark = { pos: { x: 7, y: 7 }, type: 'statue', examined: false };
		const state = makeTestState({ landmarks: [landmark] });
		const grid = renderLocationColored(state);
		// statue: char='&', color='#aaa'
		expect(grid[7][7].char).toBe('&');
		expect(grid[7][7].color).toBe('#aaa');
	});

	it('dims examined landmarks', () => {
		const landmark: Landmark = { pos: { x: 7, y: 7 }, type: 'statue', examined: true };
		const state = makeTestState({ landmarks: [landmark] });
		const grid = renderLocationColored(state);
		expect(grid[7][7].char).toBe('&');
		// statue color '#aaa' → expand to '#aaaaaa' → dim: floor(0xaa * 0.35) = floor(170*0.35) = 59 = 0x3b
		expect(grid[7][7].color).toBe('#3b3b3b');
	});

	it('shows hazards at their position', () => {
		const hazard: Hazard = { pos: { x: 8, y: 8 }, type: 'lava' };
		const state = makeTestState({ hazards: [hazard] });
		const grid = renderLocationColored(state);
		// lava: char='~', color='#ff4400'
		expect(grid[8][8].char).toBe('~');
		expect(grid[8][8].color).toBe('#ff4400');
	});

	it('shows terrain effects (burning)', () => {
		const state = makeTestState({
			terrainEffects: [{ pos: { x: 1, y: 1 }, type: 'burning', duration: 3, damagePerTurn: 1 }]
		});
		const grid = renderLocationColored(state);
		expect(grid[1][1].char).toBe('~');
		expect(grid[1][1].color).toBe('#f44');
	});

	it('shows terrain effects (frozen)', () => {
		const state = makeTestState({
			terrainEffects: [{ pos: { x: 1, y: 1 }, type: 'frozen', duration: 3, damagePerTurn: 1 }]
		});
		const grid = renderLocationColored(state);
		expect(grid[1][1].char).toBe('.');
		expect(grid[1][1].color).toBe('#0ff');
	});

	it('shows ritual channeling pulse on even turn', () => {
		const state = makeTestState({
			turnCount: 4, // even
			ritualChanneling: { ritualId: 'test', turnsRemaining: 3, turnsTotal: 3 }
		});
		const grid = renderLocationColored(state);
		// Even turn: char '@', color '#c8f'
		expect(grid[5][5].char).toBe('@');
		expect(grid[5][5].color).toBe('#c8f');
	});

	it('shows ritual channeling pulse on odd turn', () => {
		const state = makeTestState({
			turnCount: 3, // odd
			ritualChanneling: { ritualId: 'test', turnsRemaining: 3, turnsTotal: 3 }
		});
		const grid = renderLocationColored(state);
		// Odd turn: char '*', color '#c8f'
		expect(grid[5][5].char).toBe('*');
		expect(grid[5][5].color).toBe('#c8f');
	});

	it('shows player with status effect color override', () => {
		const state = makeTestState();
		state.player.statusEffects = [{ type: 'poison', duration: 3, potency: 1 }];
		const grid = renderLocationColored(state);
		expect(grid[5][5].char).toBe('@');
		expect(grid[5][5].color).toBe('#00ff00'); // poison color
	});

	it('does not show enemies in explored-but-not-visible area', () => {
		const enemy = makeEnemy(0, 0);
		const state = makeTestState({ enemies: [enemy] });
		state.visibility[0][0] = Visibility.Explored;
		const grid = renderLocationColored(state);
		// Should show dimmed tile, not the enemy
		expect(grid[0][0].char).toBe('.');
		// dimmed floor color
		expect(grid[0][0].color).toBe('#232323');
	});

	it('shows loot drops dimmed in explored-but-not-visible area', () => {
		const loot: LootDrop = { pos: { x: 0, y: 0 }, type: 'xp_bonus', value: 10 };
		const state = makeTestState({ lootDrops: [loot] });
		state.visibility[0][0] = Visibility.Explored;
		const grid = renderLocationColored(state);
		// xp_bonus: char='$', color='#ffdd44'
		expect(grid[0][0].char).toBe('$');
		// dimmed: r=ff→255*0.35=89=0x59, g=dd→221*0.35=77=0x4d, b=44→68*0.35=23=0x17
		expect(grid[0][0].color).toBe('#594d17');
	});

	it('shows containers at their position', () => {
		const container: WorldContainer = {
			id: 'barrel-1',
			pos: { x: 3, y: 3 },
			size: 'small',
			items: [],
			char: 'B',
			color: '#884',
			name: 'Barrel'
		};
		const state = makeTestState({ containers: [container] });
		const grid = renderLocationColored(state);
		expect(grid[3][3].char).toBe('B');
		expect(grid[3][3].color).toBe('#884');
	});

	it('shows landmarks dimmed in explored-but-not-visible area', () => {
		const landmark: Landmark = { pos: { x: 0, y: 0 }, type: 'graffiti', examined: false };
		const state = makeTestState({ landmarks: [landmark] });
		state.visibility[0][0] = Visibility.Explored;
		const grid = renderLocationColored(state);
		// graffiti: char='"', color='#888' → expand '#888888' → dim: floor(0x88 * 0.35) = floor(136*0.35) = 47 = 0x2f
		expect(grid[0][0].char).toBe('"');
		expect(grid[0][0].color).toBe('#2f2f2f');
	});

	it('shows terrain effects dimmed in explored-but-not-visible area', () => {
		const state = makeTestState({
			terrainEffects: [{ pos: { x: 0, y: 0 }, type: 'burning', duration: 3, damagePerTurn: 1 }]
		});
		state.visibility[0][0] = Visibility.Explored;
		const grid = renderLocationColored(state);
		expect(grid[0][0].char).toBe('~');
		// '#f44' → '#ff4444' → dim: r=floor(255*0.35)=89=0x59, g=floor(68*0.35)=23=0x17, b=0x17
		expect(grid[0][0].color).toBe('#591717');
	});

	it('shows detected secret wall with special color', () => {
		const state = makeTestState();
		state.map.tiles[1][1] = '#';
		state.detectedSecrets.add('1,1');
		const grid = renderLocationColored(state);
		expect(grid[1][1].char).toBe('#');
		expect(grid[1][1].color).toBe('#665577'); // secret wall tileColor
	});

	it('shows normal wall tile without secret detection', () => {
		const state = makeTestState();
		state.map.tiles[1][1] = '#';
		const grid = renderLocationColored(state);
		expect(grid[1][1].char).toBe('#');
		expect(grid[1][1].color).toBe('#444444');
	});
});
