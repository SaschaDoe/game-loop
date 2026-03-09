import { describe, it, expect } from 'vitest';
import {
	RITUAL_CATALOG,
	getRitualDef,
	countItemInInventory,
	hasReagents,
	getMissingReagents,
	consumeReagents,
	rollInterruption,
} from './rituals';
import type { RitualDef } from './rituals';

// ---------------------------------------------------------------------------
// Test helper
// ---------------------------------------------------------------------------

function makeInventory(items: (string | null)[]): ({ id: string } | null)[] {
	return items.map(id => (id !== null ? { id } : null));
}

// ---------------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------------

describe('Ritual Catalog', () => {
	it('contains exactly 6 rituals', () => {
		expect(Object.keys(RITUAL_CATALOG)).toHaveLength(6);
	});

	it('every ritual has valid required fields', () => {
		for (const ritual of Object.values(RITUAL_CATALOG)) {
			expect(ritual.id).toBeTruthy();
			expect(ritual.name).toBeTruthy();
			expect(ritual.school).toBeTruthy();
			expect(ritual.description).toBeTruthy();
			expect(ritual.channelingTurns).toBeGreaterThan(0);
			expect(ritual.reagents.length).toBeGreaterThan(0);
			expect(ritual.manaCost).toBeGreaterThan(0);
			expect(ritual.effectType).toBeTruthy();
		}
	});

	it('every ritual id matches its catalog key', () => {
		for (const [key, ritual] of Object.entries(RITUAL_CATALOG)) {
			expect(ritual.id).toBe(key);
		}
	});
});

// ---------------------------------------------------------------------------
// getRitualDef
// ---------------------------------------------------------------------------

describe('getRitualDef', () => {
	it('returns the ritual for a known ID', () => {
		const ritual = getRitualDef('ritual_ward_of_protection');
		expect(ritual).toBeDefined();
		expect(ritual!.name).toBe('Ward of Protection');
	});

	it('returns undefined for an unknown ID', () => {
		expect(getRitualDef('ritual_nonexistent')).toBeUndefined();
	});
});

// ---------------------------------------------------------------------------
// countItemInInventory
// ---------------------------------------------------------------------------

describe('countItemInInventory', () => {
	it('counts matching items', () => {
		const inv = makeInventory(['arcane_dust', 'moonwater_vial', 'arcane_dust', null, 'arcane_dust']);
		expect(countItemInInventory(inv, 'arcane_dust')).toBe(3);
	});

	it('returns 0 when item is absent', () => {
		const inv = makeInventory(['moonwater_vial', null]);
		expect(countItemInInventory(inv, 'arcane_dust')).toBe(0);
	});

	it('returns 0 for empty inventory', () => {
		expect(countItemInInventory([], 'arcane_dust')).toBe(0);
	});

	it('ignores null slots', () => {
		const inv = makeInventory([null, null, null]);
		expect(countItemInInventory(inv, 'arcane_dust')).toBe(0);
	});
});

// ---------------------------------------------------------------------------
// hasReagents
// ---------------------------------------------------------------------------

describe('hasReagents', () => {
	it('returns true when all reagents are present (single type)', () => {
		const inv = makeInventory(['arcane_dust', 'arcane_dust', 'arcane_dust']);
		const ritual = getRitualDef('ritual_ward_of_protection')!;
		expect(hasReagents(inv, ritual)).toBe(true);
	});

	it('returns true when all reagents are present (multiple types)', () => {
		const inv = makeInventory(['arcane_dust', 'arcane_dust', 'moonwater_vial', 'health_potion']);
		const ritual = getRitualDef('ritual_summoning_circle')!;
		expect(hasReagents(inv, ritual)).toBe(true);
	});

	it('returns false when a reagent is missing entirely', () => {
		const inv = makeInventory(['arcane_dust', 'arcane_dust']);
		const ritual = getRitualDef('ritual_summoning_circle')!; // needs moonwater_vial
		expect(hasReagents(inv, ritual)).toBe(false);
	});

	it('returns false when a reagent quantity is insufficient', () => {
		const inv = makeInventory(['arcane_dust', 'arcane_dust']); // need 3
		const ritual = getRitualDef('ritual_ward_of_protection')!;
		expect(hasReagents(inv, ritual)).toBe(false);
	});
});

// ---------------------------------------------------------------------------
// getMissingReagents
// ---------------------------------------------------------------------------

describe('getMissingReagents', () => {
	it('returns empty array when all reagents are present', () => {
		const inv = makeInventory(['arcane_dust', 'arcane_dust', 'arcane_dust']);
		const ritual = getRitualDef('ritual_ward_of_protection')!;
		expect(getMissingReagents(inv, ritual)).toEqual([]);
	});

	it('lists missing reagents with shortfall quantities', () => {
		const inv = makeInventory(['arcane_dust']); // need 3, have 1
		const ritual = getRitualDef('ritual_ward_of_protection')!;
		const missing = getMissingReagents(inv, ritual);
		expect(missing).toEqual([{ itemId: 'arcane_dust', quantity: 2 }]);
	});

	it('lists multiple missing reagent types', () => {
		const inv = makeInventory([]); // empty
		const ritual = getRitualDef('ritual_scrying')!; // moonwater_vial ×1 + dreamleaf ×1
		const missing = getMissingReagents(inv, ritual);
		expect(missing).toHaveLength(2);
		expect(missing).toContainEqual({ itemId: 'moonwater_vial', quantity: 1 });
		expect(missing).toContainEqual({ itemId: 'dreamleaf', quantity: 1 });
	});
});

// ---------------------------------------------------------------------------
// consumeReagents
// ---------------------------------------------------------------------------

describe('consumeReagents', () => {
	it('removes correct items and returns true', () => {
		const inv = makeInventory(['arcane_dust', 'health_potion', 'arcane_dust', 'arcane_dust']);
		const ritual = getRitualDef('ritual_ward_of_protection')!; // 3x arcane_dust
		const result = consumeReagents(inv, ritual);
		expect(result).toBe(true);
		// All 3 arcane_dust slots should be null, health_potion remains
		expect(countItemInInventory(inv, 'arcane_dust')).toBe(0);
		expect(countItemInInventory(inv, 'health_potion')).toBe(1);
	});

	it('leaves unrelated items untouched', () => {
		const inv = makeInventory(['moonwater_vial', 'dreamleaf', 'starfern', 'arcane_dust']);
		const ritual = getRitualDef('ritual_scrying')!; // moonwater_vial ×1 + dreamleaf ×1
		consumeReagents(inv, ritual);
		expect(countItemInInventory(inv, 'starfern')).toBe(1);
		expect(countItemInInventory(inv, 'arcane_dust')).toBe(1);
	});

	it('returns false and does not modify inventory when reagents are insufficient', () => {
		const inv = makeInventory(['arcane_dust']); // need 3
		const ritual = getRitualDef('ritual_ward_of_protection')!;
		const result = consumeReagents(inv, ritual);
		expect(result).toBe(false);
		// Inventory should be unchanged
		expect(countItemInInventory(inv, 'arcane_dust')).toBe(1);
	});

	it('consumes only needed quantity when extras exist', () => {
		const inv = makeInventory([
			'arcane_dust', 'arcane_dust', 'arcane_dust', 'arcane_dust', 'arcane_dust',
		]);
		const ritual = getRitualDef('ritual_ward_of_protection')!; // needs 3
		consumeReagents(inv, ritual);
		expect(countItemInInventory(inv, 'arcane_dust')).toBe(2);
	});
});

// ---------------------------------------------------------------------------
// rollInterruption
// ---------------------------------------------------------------------------

describe('rollInterruption', () => {
	it('returns a boolean', () => {
		const result = rollInterruption();
		expect(typeof result).toBe('boolean');
	});

	it('has approximately 75% interruption rate over many trials', () => {
		const trials = 10000;
		let interruptions = 0;
		for (let i = 0; i < trials; i++) {
			if (rollInterruption()) interruptions++;
		}
		const rate = interruptions / trials;
		// Allow generous tolerance for randomness
		expect(rate).toBeGreaterThan(0.65);
		expect(rate).toBeLessThan(0.85);
	});
});
