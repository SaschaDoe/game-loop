import { describe, it, expect } from 'vitest';
import {
	RITUAL_CATALOG,
	getRitualDef,
	countItemInInventory,
	hasReagents,
	getMissingReagents,
	consumeReagents,
} from './rituals';
import type { RitualDef } from './rituals';
import { createGame, learnRitual, handleInput } from './engine';
import type { GameState } from './types';

// ---------------------------------------------------------------------------
// Unit tests — catalog & helpers
// ---------------------------------------------------------------------------

describe('Ritual Catalog', () => {
	it('has at least 6 rituals defined', () => {
		expect(Object.keys(RITUAL_CATALOG).length).toBeGreaterThanOrEqual(6);
	});

	it('every ritual has required fields', () => {
		for (const [id, ritual] of Object.entries(RITUAL_CATALOG)) {
			expect(ritual.id).toBe(id);
			expect(ritual.name).toBeTruthy();
			expect(ritual.school).toBeTruthy();
			expect(ritual.description).toBeTruthy();
			expect(ritual.castTurns).toBeGreaterThan(0);
			expect(ritual.reagents.length).toBeGreaterThan(0);
			expect(ritual.manaCost).toBeGreaterThan(0);
			expect(ritual.effectType).toBeTruthy();
		}
	});

	it('ward_of_protection costs 3 arcane_dust', () => {
		const ward = RITUAL_CATALOG.ritual_ward_of_protection;
		expect(ward.reagents).toEqual([{ itemId: 'arcane_dust', quantity: 3 }]);
	});

	it('summoning_circle requires two reagent types', () => {
		const sc = RITUAL_CATALOG.ritual_summoning_circle;
		expect(sc.reagents.length).toBe(2);
	});
});

describe('getRitualDef', () => {
	it('returns definition for known ID', () => {
		const r = getRitualDef('ritual_ward_of_protection');
		expect(r).toBeDefined();
		expect(r!.name).toBe('Ward of Protection');
	});

	it('returns undefined for unknown ID', () => {
		expect(getRitualDef('ritual_nonexistent')).toBeUndefined();
	});
});

describe('countItemInInventory', () => {
	const inv = [
		{ id: 'arcane_dust' },
		{ id: 'arcane_dust' },
		null,
		{ id: 'moonwater_vial' },
		null,
	];

	it('counts matching items', () => {
		expect(countItemInInventory(inv, 'arcane_dust')).toBe(2);
	});

	it('returns 0 for missing items', () => {
		expect(countItemInInventory(inv, 'dreamleaf')).toBe(0);
	});

	it('handles empty inventory', () => {
		expect(countItemInInventory([], 'arcane_dust')).toBe(0);
	});

	it('handles all-null inventory', () => {
		expect(countItemInInventory([null, null, null], 'arcane_dust')).toBe(0);
	});
});

describe('hasReagents', () => {
	const ward = RITUAL_CATALOG.ritual_ward_of_protection;

	it('returns true when all reagents present', () => {
		const inv = [
			{ id: 'arcane_dust' },
			{ id: 'arcane_dust' },
			{ id: 'arcane_dust' },
		];
		expect(hasReagents(inv, ward)).toBe(true);
	});

	it('returns false when reagents missing', () => {
		const inv = [{ id: 'arcane_dust' }, { id: 'arcane_dust' }];
		expect(hasReagents(inv, ward)).toBe(false);
	});

	it('returns false on empty inventory', () => {
		expect(hasReagents([], ward)).toBe(false);
	});
});

describe('getMissingReagents', () => {
	const ward = RITUAL_CATALOG.ritual_ward_of_protection;

	it('returns empty array when all reagents met', () => {
		const inv = [
			{ id: 'arcane_dust' },
			{ id: 'arcane_dust' },
			{ id: 'arcane_dust' },
		];
		expect(getMissingReagents(inv, ward)).toEqual([]);
	});

	it('returns shortfall', () => {
		const inv = [{ id: 'arcane_dust' }];
		const missing = getMissingReagents(inv, ward);
		expect(missing).toEqual([{ itemId: 'arcane_dust', quantity: 2 }]);
	});
});

describe('consumeReagents', () => {
	it('consumes reagents and nulls slots', () => {
		const inv: ({ id: string } | null)[] = [
			{ id: 'arcane_dust' },
			{ id: 'arcane_dust' },
			{ id: 'arcane_dust' },
			{ id: 'moonwater_vial' },
		];
		const ward = RITUAL_CATALOG.ritual_ward_of_protection;
		expect(consumeReagents(inv, ward)).toBe(true);
		expect(inv[0]).toBeNull();
		expect(inv[1]).toBeNull();
		expect(inv[2]).toBeNull();
		expect(inv[3]).toEqual({ id: 'moonwater_vial' });
	});

	it('returns false and does not modify inventory when reagents missing', () => {
		const inv: ({ id: string } | null)[] = [
			{ id: 'arcane_dust' },
		];
		const ward = RITUAL_CATALOG.ritual_ward_of_protection;
		expect(consumeReagents(inv, ward)).toBe(false);
		expect(inv[0]).toEqual({ id: 'arcane_dust' });
	});
});

// ---------------------------------------------------------------------------
// Integration tests — ritual system through engine
// ---------------------------------------------------------------------------

function setupRitualGame(): GameState {
	const state = createGame({
		name: 'Test', characterClass: 'mage', difficulty: 'normal',
		startingLocation: 'cave', worldSeed: 'test', archetype: 'arcane',
	});
	state.player.mana = 50;
	state.player.maxMana = 50;
	learnRitual(state, 'ritual_ward_of_protection');
	// Give reagents: arcane_dust x3
	state.inventory[0] = { id: 'arcane_dust', name: 'Arcane Dust', char: '*', color: '#a8f', type: 'reagent', weight: 0.1 } as any;
	state.inventory[1] = { id: 'arcane_dust', name: 'Arcane Dust', char: '*', color: '#a8f', type: 'reagent', weight: 0.1 } as any;
	state.inventory[2] = { id: 'arcane_dust', name: 'Arcane Dust', char: '*', color: '#a8f', type: 'reagent', weight: 0.1 } as any;
	return state;
}

describe('Ritual Integration', () => {
	it('learnRitual adds to learnedRituals', () => {
		const state = createGame({
			name: 'Test', characterClass: 'warrior', difficulty: 'normal',
			startingLocation: 'cave', worldSeed: 'test', archetype: 'might',
		});
		const result = learnRitual(state, 'ritual_summoning_circle');
		expect(result).toBe(true);
		expect(state.learnedRituals).toContain('ritual_summoning_circle');
	});

	it('learnRitual rejects duplicates', () => {
		const state = createGame({
			name: 'Test', characterClass: 'warrior', difficulty: 'normal',
			startingLocation: 'cave', worldSeed: 'test', archetype: 'might',
		});
		const first = learnRitual(state, 'ritual_ward_of_protection');
		const second = learnRitual(state, 'ritual_ward_of_protection');
		expect(first).toBe(true);
		expect(second).toBe(false);
	});

	it('learnRitual rejects unknown IDs', () => {
		const state = createGame({
			name: 'Test', characterClass: 'warrior', difficulty: 'normal',
			startingLocation: 'cave', worldSeed: 'test', archetype: 'might',
		});
		const result = learnRitual(state, 'ritual_nonexistent');
		expect(result).toBe(false);
	});

	it('ritual state fields initialized correctly', () => {
		const state = createGame({
			name: 'Test', characterClass: 'warrior', difficulty: 'normal',
			startingLocation: 'cave', worldSeed: 'test', archetype: 'might',
		});
		expect(state.ritualChanneling).toBeNull();
		expect(state.activeWards).toEqual([]);
		expect(state.teleportAnchors).toEqual({});
		expect(state.activeSummon).toBeNull();
		expect(state.scriedLevel).toBeNull();
	});

	it('mage starts with starter rituals', () => {
		const state = createGame({
			name: 'Test', characterClass: 'mage', difficulty: 'normal',
			startingLocation: 'cave', worldSeed: 'test', archetype: 'arcane',
		});
		expect(state.learnedRituals).toContain('ritual_ward_of_protection');
		expect(state.learnedRituals).toContain('ritual_scrying');
	});

	it('warrior starts with no rituals', () => {
		const state = createGame({
			name: 'Test', characterClass: 'warrior', difficulty: 'normal',
			startingLocation: 'cave', worldSeed: 'test', archetype: 'might',
		});
		expect(state.learnedRituals).toEqual([]);
	});
});
