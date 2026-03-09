import { describe, it, expect } from 'vitest';
import { useAbility, tickAbilityCooldown, ABILITY_DEFS } from './abilities';
import type { GameState, Entity } from './types';
import { Visibility } from './types';

function makeEnemy(x: number, y: number, overrides?: Partial<Entity>): Entity {
	return {
		pos: { x, y },
		char: 'G',
		color: '#0f0',
		name: 'Goblin',
		hp: 5,
		maxHp: 5,
		attack: 2,
		statusEffects: [],
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
		learnedSpells: [],
		spellCooldowns: {},
		quickCastSlots: [null, null, null, null],
		manaRegenBaseCounter: 0,
		manaRegenIntCounter: 0,
		spellMenuOpen: false,
		spellMenuCursor: 0,
		pendingAttributePoint: false,
		spellTargeting: null,
		schoolMastery: {},
		forbiddenCosts: { corruption: 0, paradoxBaseline: 0, maxHpLost: 0, sanityLost: 0, soulCapLost: 0 },
		leyLineLevel: 0,
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

describe('ABILITY_DEFS', () => {
	it('defines abilities for all eight classes', () => {
		expect(ABILITY_DEFS.warrior).toBeDefined();
		expect(ABILITY_DEFS.mage).toBeDefined();
		expect(ABILITY_DEFS.rogue).toBeDefined();
		expect(ABILITY_DEFS.ranger).toBeDefined();
		expect(ABILITY_DEFS.cleric).toBeDefined();
		expect(ABILITY_DEFS.paladin).toBeDefined();
		expect(ABILITY_DEFS.necromancer).toBeDefined();
		expect(ABILITY_DEFS.bard).toBeDefined();
	});

	it('all abilities have positive cooldowns', () => {
		for (const def of Object.values(ABILITY_DEFS)) {
			expect(def.cooldown).toBeGreaterThan(0);
		}
	});

	it('all abilities have names and descriptions', () => {
		for (const def of Object.values(ABILITY_DEFS)) {
			expect(def.name.length).toBeGreaterThan(0);
			expect(def.description.length).toBeGreaterThan(0);
		}
	});
});

describe('tickAbilityCooldown', () => {
	it('decrements cooldown by 1', () => {
		const state = makeTestState({ abilityCooldown: 5 });
		tickAbilityCooldown(state);
		expect(state.abilityCooldown).toBe(4);
	});

	it('does not go below 0', () => {
		const state = makeTestState({ abilityCooldown: 0 });
		tickAbilityCooldown(state);
		expect(state.abilityCooldown).toBe(0);
	});

	it('reaches 0 after cooldown turns', () => {
		const state = makeTestState({ abilityCooldown: 3 });
		tickAbilityCooldown(state);
		tickAbilityCooldown(state);
		tickAbilityCooldown(state);
		expect(state.abilityCooldown).toBe(0);
	});
});

describe('useAbility on cooldown', () => {
	it('returns not-used when on cooldown', () => {
		const state = makeTestState({ abilityCooldown: 3 });
		const result = useAbility(state);
		expect(result.used).toBe(false);
		expect(result.messages[0].text).toContain('cooldown');
	});

	it('includes turns remaining in cooldown message', () => {
		const state = makeTestState({ abilityCooldown: 5 });
		const result = useAbility(state);
		expect(result.messages[0].text).toContain('5');
	});
});

describe('Warrior Whirlwind', () => {
	it('hits all adjacent enemies', () => {
		const e1 = makeEnemy(6, 5); // right
		const e2 = makeEnemy(4, 5); // left
		const e3 = makeEnemy(5, 4); // above
		const state = makeTestState({
			enemies: [e1, e2, e3],
			characterConfig: { name: 'Hero', characterClass: 'warrior', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		const result = useAbility(state);
		expect(result.used).toBe(true);
		// All three should be damaged
		expect(e1.hp).toBeLessThan(5);
		expect(e2.hp).toBeLessThan(5);
		expect(e3.hp).toBeLessThan(5);
	});

	it('does not hit distant enemies', () => {
		const near = makeEnemy(6, 5);
		const far = makeEnemy(8, 5); // 3 tiles away
		const state = makeTestState({
			enemies: [near, far],
			characterConfig: { name: 'Hero', characterClass: 'warrior', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		useAbility(state);
		expect(near.hp).toBeLessThan(5);
		expect(far.hp).toBe(5); // untouched
	});

	it('does not use ability when no enemies nearby', () => {
		const state = makeTestState({
			enemies: [makeEnemy(9, 9)],
			characterConfig: { name: 'Hero', characterClass: 'warrior', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});
		const result = useAbility(state);
		expect(result.used).toBe(false);
	});

	it('deals damage equal to player attack', () => {
		const enemy = makeEnemy(6, 5, { hp: 100, maxHp: 100 });
		const state = makeTestState({
			enemies: [enemy],
			characterConfig: { name: 'Hero', characterClass: 'warrior', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});
		state.player.attack = 7;

		useAbility(state);
		expect(enemy.hp).toBe(93); // 100 - 7
	});

	it('hits diagonally adjacent enemies', () => {
		const diag = makeEnemy(6, 6); // diagonal
		const state = makeTestState({
			enemies: [diag],
			characterConfig: { name: 'Hero', characterClass: 'warrior', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		const result = useAbility(state);
		expect(result.used).toBe(true);
		expect(diag.hp).toBeLessThan(5);
	});

	it('reports kill count in message', () => {
		const e1 = makeEnemy(6, 5, { hp: 1 });
		const e2 = makeEnemy(4, 5, { hp: 1 });
		const state = makeTestState({
			enemies: [e1, e2],
			characterConfig: { name: 'Hero', characterClass: 'warrior', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		const result = useAbility(state);
		const killMsg = result.messages.find((m) => m.text.includes('slays'));
		expect(killMsg).toBeDefined();
		expect(killMsg!.text).toContain('2');
	});
});

describe('Mage Teleport', () => {
	it('teleports to a visible floor tile', () => {
		const state = makeTestState({
			characterConfig: { name: 'Hero', characterClass: 'mage', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		const result = useAbility(state);
		expect(result.used).toBe(true);
		expect(result.teleportPos).toBeDefined();
		// Should be a different position than the player
		const samePos = result.teleportPos!.x === 5 && result.teleportPos!.y === 5;
		expect(samePos).toBe(false);
	});

	it('does not teleport onto enemies', () => {
		// Fill most tiles with enemies to limit options
		const enemies: Entity[] = [];
		for (let x = 0; x < 10; x++) {
			for (let y = 0; y < 10; y++) {
				if (x === 5 && y === 5) continue; // player pos
				if (x === 3 && y === 5) continue; // leave one spot open
				enemies.push(makeEnemy(x, y));
			}
		}
		const state = makeTestState({
			enemies,
			characterConfig: { name: 'Hero', characterClass: 'mage', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		const result = useAbility(state);
		if (result.used && result.teleportPos) {
			expect(result.teleportPos.x).toBe(3);
			expect(result.teleportPos.y).toBe(5);
		}
	});

	it('does not teleport onto walls', () => {
		const state = makeTestState({
			characterConfig: { name: 'Hero', characterClass: 'mage', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});
		// Put walls everywhere except player pos and one floor tile
		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				if (x === 5 && y === 5) continue;
				if (x === 4 && y === 5) continue;
				state.map.tiles[y][x] = '#';
			}
		}

		const result = useAbility(state);
		if (result.used && result.teleportPos) {
			expect(state.map.tiles[result.teleportPos.y][result.teleportPos.x]).toBe('.');
		}
	});

	it('fails when no valid destination exists', () => {
		const state = makeTestState({
			characterConfig: { name: 'Hero', characterClass: 'mage', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});
		// Walls everywhere except player pos
		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				if (x === 5 && y === 5) continue;
				state.map.tiles[y][x] = '#';
			}
		}

		const result = useAbility(state);
		expect(result.used).toBe(false);
		expect(result.messages[0].text).toContain('No valid');
	});

	it('only teleports within range 5', () => {
		const state = makeTestState({
			characterConfig: { name: 'Hero', characterClass: 'mage', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		// Run many times to verify range constraint
		for (let i = 0; i < 20; i++) {
			state.abilityCooldown = 0;
			const result = useAbility(state);
			if (result.used && result.teleportPos) {
				const dist = Math.abs(result.teleportPos.x - 5) + Math.abs(result.teleportPos.y - 5);
				expect(dist).toBeLessThanOrEqual(5);
			}
		}
	});

	it('does not teleport to non-visible tiles', () => {
		const state = makeTestState({
			characterConfig: { name: 'Hero', characterClass: 'mage', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});
		// Make all tiles except player area unexplored
		for (let y = 0; y < 10; y++) {
			for (let x = 0; x < 10; x++) {
				if (Math.abs(x - 5) <= 1 && Math.abs(y - 5) <= 1) continue;
				state.visibility[y][x] = Visibility.Unexplored;
			}
		}

		const result = useAbility(state);
		if (result.used && result.teleportPos) {
			expect(state.visibility[result.teleportPos.y][result.teleportPos.x]).toBe(Visibility.Visible);
		}
	});
});

describe('Rogue Smoke Bomb', () => {
	it('stuns all enemies within radius 3', () => {
		const e1 = makeEnemy(6, 5); // distance 1
		const e2 = makeEnemy(8, 5); // distance 3
		const state = makeTestState({
			enemies: [e1, e2],
			characterConfig: { name: 'Hero', characterClass: 'rogue', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		const result = useAbility(state);
		expect(result.used).toBe(true);
		expect(e1.statusEffects.some((e) => e.type === 'stun')).toBe(true);
		expect(e2.statusEffects.some((e) => e.type === 'stun')).toBe(true);
	});

	it('does not stun distant enemies', () => {
		const far = makeEnemy(9, 9); // distance 8
		const state = makeTestState({
			enemies: [far],
			characterConfig: { name: 'Hero', characterClass: 'rogue', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		const result = useAbility(state);
		expect(result.used).toBe(false);
	});

	it('stun lasts 2 turns', () => {
		const enemy = makeEnemy(6, 5);
		const state = makeTestState({
			enemies: [enemy],
			characterConfig: { name: 'Hero', characterClass: 'rogue', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		useAbility(state);
		const stun = enemy.statusEffects.find((e) => e.type === 'stun');
		expect(stun).toBeDefined();
		expect(stun!.duration).toBe(2);
	});

	it('reports number of stunned enemies', () => {
		const e1 = makeEnemy(6, 5);
		const e2 = makeEnemy(4, 5);
		const state = makeTestState({
			enemies: [e1, e2],
			characterConfig: { name: 'Hero', characterClass: 'rogue', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		const result = useAbility(state);
		expect(result.messages[0].text).toContain('2');
		expect(result.messages[0].text).toContain('enemies');
	});

	it('uses singular form for one enemy', () => {
		const enemy = makeEnemy(6, 5);
		const state = makeTestState({
			enemies: [enemy],
			characterConfig: { name: 'Hero', characterClass: 'rogue', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		const result = useAbility(state);
		expect(result.messages[0].text).toContain('1 enemy');
	});
});

describe('Ranger Rain of Arrows', () => {
	it('hits all enemies in a 3x3 area', () => {
		const e1 = makeEnemy(6, 5); // distance 1
		const e2 = makeEnemy(7, 5); // distance 2
		const e3 = makeEnemy(5, 7); // distance 2
		const state = makeTestState({
			enemies: [e1, e2, e3],
			characterConfig: { name: 'Hero', characterClass: 'ranger', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		const result = useAbility(state);
		expect(result.used).toBe(true);
		expect(e1.hp).toBeLessThan(5);
		expect(e2.hp).toBeLessThan(5);
		expect(e3.hp).toBeLessThan(5);
	});

	it('does not hit enemies outside radius 3', () => {
		const near = makeEnemy(6, 5);
		const far = makeEnemy(9, 9); // well outside radius
		const state = makeTestState({
			enemies: [near, far],
			characterConfig: { name: 'Hero', characterClass: 'ranger', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		useAbility(state);
		expect(near.hp).toBeLessThan(5);
		expect(far.hp).toBe(5); // untouched
	});

	it('does not use ability when no enemies in range', () => {
		const state = makeTestState({
			enemies: [makeEnemy(9, 9)],
			characterConfig: { name: 'Hero', characterClass: 'ranger', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});
		const result = useAbility(state);
		expect(result.used).toBe(false);
		expect(result.messages[0].text).toContain('No enemies in range');
	});

	it('deals 80% of player attack damage', () => {
		const enemy = makeEnemy(6, 5, { hp: 100, maxHp: 100 });
		const state = makeTestState({
			enemies: [enemy],
			characterConfig: { name: 'Hero', characterClass: 'ranger', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});
		state.player.attack = 10;

		useAbility(state);
		expect(enemy.hp).toBe(92); // 100 - floor(10 * 0.8)
	});

	it('reports kill count in message', () => {
		const e1 = makeEnemy(6, 5, { hp: 1 });
		const e2 = makeEnemy(4, 5, { hp: 1 });
		const state = makeTestState({
			enemies: [e1, e2],
			characterConfig: { name: 'Hero', characterClass: 'ranger', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		const result = useAbility(state);
		const killMsg = result.messages.find((m) => m.text.includes('slays'));
		expect(killMsg).toBeDefined();
		expect(killMsg!.text).toContain('2');
	});

	it('uses cooldown of 10', () => {
		expect(ABILITY_DEFS.ranger.cooldown).toBe(10);
	});
});

describe('Cleric Divine Shield', () => {
	it('grants regeneration effect', () => {
		const state = makeTestState({
			characterConfig: { name: 'Hero', characterClass: 'cleric', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		const result = useAbility(state);
		expect(result.used).toBe(true);
		expect(state.player.statusEffects.some((e) => e.type === 'regeneration')).toBe(true);
	});

	it('regeneration lasts 5 turns', () => {
		const state = makeTestState({
			characterConfig: { name: 'Hero', characterClass: 'cleric', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		useAbility(state);
		const regen = state.player.statusEffects.find((e) => e.type === 'regeneration');
		expect(regen).toBeDefined();
		expect(regen!.duration).toBe(5);
	});

	it('always succeeds (no target needed)', () => {
		const state = makeTestState({
			enemies: [],
			characterConfig: { name: 'Hero', characterClass: 'cleric', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		const result = useAbility(state);
		expect(result.used).toBe(true);
		expect(result.messages[0].type).toBe('healing');
	});

	it('message mentions regeneration', () => {
		const state = makeTestState({
			characterConfig: { name: 'Hero', characterClass: 'cleric', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		const result = useAbility(state);
		expect(result.messages[0].text).toContain('Regeneration');
	});
});

describe('Paladin Holy Smite', () => {
	it('deals extra damage to undead enemies', () => {
		const undead = makeEnemy(6, 5, { hp: 100, maxHp: 100, name: 'Skeleton' });
		const state = makeTestState({
			enemies: [undead],
			characterConfig: { name: 'Hero', characterClass: 'paladin', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});
		state.player.attack = 10;

		useAbility(state);
		expect(undead.hp).toBe(70); // 100 - 10*3
	});

	it('deals normal damage to non-undead', () => {
		const enemy = makeEnemy(6, 5, { hp: 100, maxHp: 100, name: 'Goblin' });
		const state = makeTestState({
			enemies: [enemy],
			characterConfig: { name: 'Hero', characterClass: 'paladin', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});
		state.player.attack = 10;

		useAbility(state);
		expect(enemy.hp).toBe(90); // 100 - 10
	});

	it('hits all adjacent enemies', () => {
		const e1 = makeEnemy(6, 5, { hp: 50, maxHp: 50, name: 'Zombie' });
		const e2 = makeEnemy(4, 5, { hp: 50, maxHp: 50, name: 'Goblin' });
		const state = makeTestState({
			enemies: [e1, e2],
			characterConfig: { name: 'Hero', characterClass: 'paladin', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		const result = useAbility(state);
		expect(result.used).toBe(true);
		expect(e1.hp).toBeLessThan(50);
		expect(e2.hp).toBeLessThan(50);
	});

	it('does not use ability when no enemies nearby', () => {
		const state = makeTestState({
			enemies: [makeEnemy(9, 9)],
			characterConfig: { name: 'Hero', characterClass: 'paladin', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});
		const result = useAbility(state);
		expect(result.used).toBe(false);
		expect(result.messages[0].text).toContain('No enemies nearby');
	});

	it('uses "sears" for undead and "strikes" for others in message', () => {
		const undead = makeEnemy(6, 5, { hp: 100, maxHp: 100, name: 'Wraith' });
		const normal = makeEnemy(4, 5, { hp: 100, maxHp: 100, name: 'Goblin' });
		const state = makeTestState({
			enemies: [undead, normal],
			characterConfig: { name: 'Hero', characterClass: 'paladin', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		const result = useAbility(state);
		const searsMsg = result.messages.find((m) => m.text.includes('sears'));
		const strikesMsg = result.messages.find((m) => m.text.includes('strikes'));
		expect(searsMsg).toBeDefined();
		expect(strikesMsg).toBeDefined();
	});

	it('reports kill count in message', () => {
		const e1 = makeEnemy(6, 5, { hp: 1, name: 'Skeleton' });
		const state = makeTestState({
			enemies: [e1],
			characterConfig: { name: 'Hero', characterClass: 'paladin', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		const result = useAbility(state);
		const killMsg = result.messages.find((m) => m.text.includes('destroys'));
		expect(killMsg).toBeDefined();
	});
});

describe('Necromancer Drain Life', () => {
	it('steals HP from nearest enemy', () => {
		const enemy = makeEnemy(6, 5, { hp: 20, maxHp: 20 });
		const state = makeTestState({
			enemies: [enemy],
			characterConfig: { name: 'Hero', characterClass: 'necromancer', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});
		state.player.hp = 10;
		state.player.attack = 5;

		const result = useAbility(state);
		expect(result.used).toBe(true);
		expect(enemy.hp).toBe(13); // 20 - max(2, 5+2) = 20 - 7
		expect(state.player.hp).toBe(17); // 10 + 7
	});

	it('targets the nearest enemy among multiple', () => {
		const far = makeEnemy(8, 5, { hp: 50, maxHp: 50 }); // distance 3
		const near = makeEnemy(6, 5, { hp: 50, maxHp: 50 }); // distance 1
		const state = makeTestState({
			enemies: [far, near],
			characterConfig: { name: 'Hero', characterClass: 'necromancer', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		useAbility(state);
		expect(near.hp).toBeLessThan(50); // near enemy should be drained
		expect(far.hp).toBe(50); // far enemy untouched
	});

	it('does not heal beyond maxHp', () => {
		const enemy = makeEnemy(6, 5, { hp: 20, maxHp: 20 });
		const state = makeTestState({
			enemies: [enemy],
			characterConfig: { name: 'Hero', characterClass: 'necromancer', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});
		state.player.hp = 20; // already at max
		state.player.attack = 5;

		useAbility(state);
		expect(state.player.hp).toBe(20); // should not exceed maxHp
	});

	it('does not use ability when no enemies exist', () => {
		const state = makeTestState({
			enemies: [],
			characterConfig: { name: 'Hero', characterClass: 'necromancer', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});
		const result = useAbility(state);
		expect(result.used).toBe(false);
		expect(result.messages[0].text).toContain('No enemies to drain');
	});

	it('does not use ability when nearest enemy is beyond range 5', () => {
		const enemy = makeEnemy(0, 0); // distance 10
		const state = makeTestState({
			enemies: [enemy],
			characterConfig: { name: 'Hero', characterClass: 'necromancer', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});
		const result = useAbility(state);
		expect(result.used).toBe(false);
		expect(result.messages[0].text).toContain('No enemies close enough');
	});

	it('shows healing message when HP is recovered', () => {
		const enemy = makeEnemy(6, 5, { hp: 20, maxHp: 20 });
		const state = makeTestState({
			enemies: [enemy],
			characterConfig: { name: 'Hero', characterClass: 'necromancer', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});
		state.player.hp = 10;

		const result = useAbility(state);
		const healMsg = result.messages.find((m) => m.type === 'healing');
		expect(healMsg).toBeDefined();
		expect(healMsg!.text).toContain('recover');
	});
});

describe('Bard Inspiring Song', () => {
	it('boosts ATK by 3', () => {
		const state = makeTestState({
			characterConfig: { name: 'Hero', characterClass: 'bard', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});
		const originalAtk = state.player.attack;

		const result = useAbility(state);
		expect(result.used).toBe(true);
		expect(state.player.attack).toBe(originalAtk + 3);
	});

	it('grants regeneration effect', () => {
		const state = makeTestState({
			characterConfig: { name: 'Hero', characterClass: 'bard', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		useAbility(state);
		expect(state.player.statusEffects.some((e) => e.type === 'regeneration')).toBe(true);
	});

	it('regeneration lasts 5 turns', () => {
		const state = makeTestState({
			characterConfig: { name: 'Hero', characterClass: 'bard', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		useAbility(state);
		const regen = state.player.statusEffects.find((e) => e.type === 'regeneration');
		expect(regen).toBeDefined();
		expect(regen!.duration).toBe(5);
	});

	it('always succeeds (no target needed)', () => {
		const state = makeTestState({
			enemies: [],
			characterConfig: { name: 'Hero', characterClass: 'bard', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		const result = useAbility(state);
		expect(result.used).toBe(true);
	});

	it('produces two messages (melody + ATK boost)', () => {
		const state = makeTestState({
			characterConfig: { name: 'Hero', characterClass: 'bard', difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
		});

		const result = useAbility(state);
		expect(result.messages).toHaveLength(2);
		expect(result.messages[0].text).toContain('inspiring melody');
		expect(result.messages[1].text).toContain('+3 ATK');
	});
});

describe('All abilities handle no-target case', () => {
	const classesWithNoTarget: Array<{ characterClass: 'warrior' | 'rogue' | 'ranger' | 'paladin' | 'necromancer'; noTargetText: string }> = [
		{ characterClass: 'warrior', noTargetText: 'No enemies nearby' },
		{ characterClass: 'rogue', noTargetText: 'No enemies nearby' },
		{ characterClass: 'ranger', noTargetText: 'No enemies in range' },
		{ characterClass: 'paladin', noTargetText: 'No enemies nearby' },
		{ characterClass: 'necromancer', noTargetText: 'No enemies to drain' },
	];

	for (const { characterClass, noTargetText } of classesWithNoTarget) {
		it(`${characterClass} returns used=false with no enemies`, () => {
			const state = makeTestState({
				enemies: [],
				characterConfig: { name: 'Hero', characterClass, difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
			});
			const result = useAbility(state);
			expect(result.used).toBe(false);
			expect(result.messages[0].text).toContain(noTargetText);
		});
	}

	const selfBuffClasses: Array<'cleric' | 'bard'> = ['cleric', 'bard'];

	for (const characterClass of selfBuffClasses) {
		it(`${characterClass} always succeeds even with no enemies`, () => {
			const state = makeTestState({
				enemies: [],
				characterConfig: { name: 'Hero', characterClass, difficulty: 'normal' as const, startingLocation: 'cave' as const, worldSeed: 'test' }
			});
			const result = useAbility(state);
			expect(result.used).toBe(true);
		});
	}
});
