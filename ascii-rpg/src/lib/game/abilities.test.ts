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
		characterConfig: { name: 'Hero', characterClass: 'warrior' as const, difficulty: 'normal' as const, startingLocation: 'cave' as const },
		abilityCooldown: 0,
		hazards: [],
		npcs: [],
		chests: [],
		lootDrops: [],
		skillPoints: 0,
		unlockedSkills: [],
		activeDialogue: null,
		rumors: [],
		...overrides
	};
}

describe('ABILITY_DEFS', () => {
	it('defines abilities for all three classes', () => {
		expect(ABILITY_DEFS.warrior).toBeDefined();
		expect(ABILITY_DEFS.mage).toBeDefined();
		expect(ABILITY_DEFS.rogue).toBeDefined();
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
			characterConfig: { name: 'Hero', characterClass: 'warrior', difficulty: 'normal' as const, startingLocation: 'cave' as const }
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
			characterConfig: { name: 'Hero', characterClass: 'warrior', difficulty: 'normal' as const, startingLocation: 'cave' as const }
		});

		useAbility(state);
		expect(near.hp).toBeLessThan(5);
		expect(far.hp).toBe(5); // untouched
	});

	it('does not use ability when no enemies nearby', () => {
		const state = makeTestState({
			enemies: [makeEnemy(9, 9)],
			characterConfig: { name: 'Hero', characterClass: 'warrior', difficulty: 'normal' as const, startingLocation: 'cave' as const }
		});
		const result = useAbility(state);
		expect(result.used).toBe(false);
	});

	it('deals damage equal to player attack', () => {
		const enemy = makeEnemy(6, 5, { hp: 100, maxHp: 100 });
		const state = makeTestState({
			enemies: [enemy],
			characterConfig: { name: 'Hero', characterClass: 'warrior', difficulty: 'normal' as const, startingLocation: 'cave' as const }
		});
		state.player.attack = 7;

		useAbility(state);
		expect(enemy.hp).toBe(93); // 100 - 7
	});

	it('hits diagonally adjacent enemies', () => {
		const diag = makeEnemy(6, 6); // diagonal
		const state = makeTestState({
			enemies: [diag],
			characterConfig: { name: 'Hero', characterClass: 'warrior', difficulty: 'normal' as const, startingLocation: 'cave' as const }
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
			characterConfig: { name: 'Hero', characterClass: 'warrior', difficulty: 'normal' as const, startingLocation: 'cave' as const }
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
			characterConfig: { name: 'Hero', characterClass: 'mage', difficulty: 'normal' as const, startingLocation: 'cave' as const }
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
			characterConfig: { name: 'Hero', characterClass: 'mage', difficulty: 'normal' as const, startingLocation: 'cave' as const }
		});

		const result = useAbility(state);
		if (result.used && result.teleportPos) {
			expect(result.teleportPos.x).toBe(3);
			expect(result.teleportPos.y).toBe(5);
		}
	});

	it('does not teleport onto walls', () => {
		const state = makeTestState({
			characterConfig: { name: 'Hero', characterClass: 'mage', difficulty: 'normal' as const, startingLocation: 'cave' as const }
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
			characterConfig: { name: 'Hero', characterClass: 'mage', difficulty: 'normal' as const, startingLocation: 'cave' as const }
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
			characterConfig: { name: 'Hero', characterClass: 'mage', difficulty: 'normal' as const, startingLocation: 'cave' as const }
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
			characterConfig: { name: 'Hero', characterClass: 'mage', difficulty: 'normal' as const, startingLocation: 'cave' as const }
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
			characterConfig: { name: 'Hero', characterClass: 'rogue', difficulty: 'normal' as const, startingLocation: 'cave' as const }
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
			characterConfig: { name: 'Hero', characterClass: 'rogue', difficulty: 'normal' as const, startingLocation: 'cave' as const }
		});

		const result = useAbility(state);
		expect(result.used).toBe(false);
	});

	it('stun lasts 2 turns', () => {
		const enemy = makeEnemy(6, 5);
		const state = makeTestState({
			enemies: [enemy],
			characterConfig: { name: 'Hero', characterClass: 'rogue', difficulty: 'normal' as const, startingLocation: 'cave' as const }
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
			characterConfig: { name: 'Hero', characterClass: 'rogue', difficulty: 'normal' as const, startingLocation: 'cave' as const }
		});

		const result = useAbility(state);
		expect(result.messages[0].text).toContain('2');
		expect(result.messages[0].text).toContain('enemies');
	});

	it('uses singular form for one enemy', () => {
		const enemy = makeEnemy(6, 5);
		const state = makeTestState({
			enemies: [enemy],
			characterConfig: { name: 'Hero', characterClass: 'rogue', difficulty: 'normal' as const, startingLocation: 'cave' as const }
		});

		const result = useAbility(state);
		expect(result.messages[0].text).toContain('1 enemy');
	});
});
