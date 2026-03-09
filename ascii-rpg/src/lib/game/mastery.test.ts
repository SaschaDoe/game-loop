import { describe, it, expect } from 'vitest';
import {
	getMasteryLevel,
	createEmptyMastery,
	addMasteryXP,
	canCastTier,
	CLASS_MASTERY_MULTIPLIERS,
	ADEPT_PASSIVES,
	MASTER_PASSIVES,
	ALL_SCHOOLS,
	FORBIDDEN_SCHOOLS,
	MASTERY_THRESHOLDS,
} from './mastery';
import type { CharacterClass } from './types';

// ---------------------------------------------------------------------------
// Mastery Level Thresholds
// ---------------------------------------------------------------------------

describe('getMasteryLevel', () => {
	it('returns "none" for 0 XP', () => {
		expect(getMasteryLevel(0)).toBe('none');
	});

	it('returns "novice" at 1 XP', () => {
		expect(getMasteryLevel(1)).toBe('novice');
	});

	it('returns "novice" at 199 XP', () => {
		expect(getMasteryLevel(199)).toBe('novice');
	});

	it('returns "adept" at 200 XP', () => {
		expect(getMasteryLevel(200)).toBe('adept');
	});

	it('returns "adept" at 999 XP', () => {
		expect(getMasteryLevel(999)).toBe('adept');
	});

	it('returns "master" at 1000 XP', () => {
		expect(getMasteryLevel(1000)).toBe('master');
	});

	it('returns "master" at very high XP', () => {
		expect(getMasteryLevel(99999)).toBe('master');
	});
});

// ---------------------------------------------------------------------------
// createEmptyMastery
// ---------------------------------------------------------------------------

describe('createEmptyMastery', () => {
	it('returns a record with all 12 schools at 0 XP', () => {
		const mastery = createEmptyMastery();
		for (const school of ALL_SCHOOLS) {
			expect(mastery[school]).toBe(0);
		}
	});

	it('contains exactly 12 school entries', () => {
		const mastery = createEmptyMastery();
		expect(Object.keys(mastery).length).toBe(12);
	});

	it('includes all forbidden schools', () => {
		const mastery = createEmptyMastery();
		for (const school of FORBIDDEN_SCHOOLS) {
			expect(school in mastery).toBe(true);
			expect(mastery[school]).toBe(0);
		}
	});
});

// ---------------------------------------------------------------------------
// Class Multipliers & XP Gain
// ---------------------------------------------------------------------------

describe('CLASS_MASTERY_MULTIPLIERS', () => {
	it('mage has 1.5x for all schools', () => {
		for (const school of ALL_SCHOOLS) {
			expect(CLASS_MASTERY_MULTIPLIERS.mage[school]).toBe(1.5);
		}
	});

	it('warrior has 1.0x for all schools', () => {
		for (const school of ALL_SCHOOLS) {
			expect(CLASS_MASTERY_MULTIPLIERS.warrior[school]).toBe(1.0);
		}
	});

	it('paladin has 1.0x for all schools', () => {
		for (const school of ALL_SCHOOLS) {
			expect(CLASS_MASTERY_MULTIPLIERS.paladin[school]).toBe(1.0);
		}
	});

	it('necromancer has 1.5x for shadow and necromancy', () => {
		expect(CLASS_MASTERY_MULTIPLIERS.necromancer.shadow).toBe(1.5);
		expect(CLASS_MASTERY_MULTIPLIERS.necromancer.necromancy).toBe(1.5);
	});

	it('cleric has 1.5x restoration, 1.25x enchantment, 0.5x all forbidden', () => {
		expect(CLASS_MASTERY_MULTIPLIERS.cleric.restoration).toBe(1.5);
		expect(CLASS_MASTERY_MULTIPLIERS.cleric.enchantment).toBe(1.25);
		for (const school of FORBIDDEN_SCHOOLS) {
			expect(CLASS_MASTERY_MULTIPLIERS.cleric[school]).toBe(0.5);
		}
	});

	it('bard has 1.25x enchantment and conjuration', () => {
		expect(CLASS_MASTERY_MULTIPLIERS.bard.enchantment).toBe(1.25);
		expect(CLASS_MASTERY_MULTIPLIERS.bard.conjuration).toBe(1.25);
	});

	it('ranger has 1.25x elements and divination', () => {
		expect(CLASS_MASTERY_MULTIPLIERS.ranger.elements).toBe(1.25);
		expect(CLASS_MASTERY_MULTIPLIERS.ranger.divination).toBe(1.25);
	});

	it('rogue has 1.25x shadow and conjuration', () => {
		expect(CLASS_MASTERY_MULTIPLIERS.rogue.shadow).toBe(1.25);
		expect(CLASS_MASTERY_MULTIPLIERS.rogue.conjuration).toBe(1.25);
	});

	it('all 8 classes have entries for all 12 schools', () => {
		const classes: CharacterClass[] = ['warrior', 'mage', 'rogue', 'ranger', 'cleric', 'paladin', 'necromancer', 'bard'];
		for (const cls of classes) {
			for (const school of ALL_SCHOOLS) {
				expect(typeof CLASS_MASTERY_MULTIPLIERS[cls][school]).toBe('number');
			}
		}
	});
});

describe('addMasteryXP', () => {
	it('adds base XP with 1.0x multiplier (warrior)', () => {
		const mastery = createEmptyMastery();
		const result = addMasteryXP(mastery, 'elements', 5, 'warrior');
		expect(result.elements).toBe(5);
	});

	it('applies mage 1.5x multiplier (floor)', () => {
		const mastery = createEmptyMastery();
		const result = addMasteryXP(mastery, 'elements', 5, 'mage');
		// floor(5 * 1.5) = 7
		expect(result.elements).toBe(7);
	});

	it('applies cleric 0.5x multiplier to forbidden schools', () => {
		const mastery = createEmptyMastery();
		const result = addMasteryXP(mastery, 'blood', 5, 'cleric');
		// floor(5 * 0.5) = 2
		expect(result.blood).toBe(2);
	});

	it('applies ranger 1.25x to divination', () => {
		const mastery = createEmptyMastery();
		const result = addMasteryXP(mastery, 'divination', 5, 'ranger');
		// floor(5 * 1.25) = 6
		expect(result.divination).toBe(6);
	});

	it('does not mutate the original mastery record', () => {
		const mastery = createEmptyMastery();
		const result = addMasteryXP(mastery, 'shadow', 5, 'warrior');
		expect(mastery.shadow).toBe(0);
		expect(result.shadow).toBe(5);
	});

	it('accumulates XP across multiple casts', () => {
		let mastery = createEmptyMastery();
		mastery = addMasteryXP(mastery, 'restoration', 5, 'cleric');
		mastery = addMasteryXP(mastery, 'restoration', 5, 'cleric');
		mastery = addMasteryXP(mastery, 'restoration', 5, 'cleric');
		// 3 casts at floor(5 * 1.5) = 7 each → 21
		expect(mastery.restoration).toBe(21);
	});

	it('only modifies the targeted school', () => {
		const mastery = createEmptyMastery();
		const result = addMasteryXP(mastery, 'conjuration', 5, 'bard');
		// conjuration should increase, all others stay at 0
		expect(result.conjuration).toBe(6); // floor(5 * 1.25)
		expect(result.elements).toBe(0);
		expect(result.shadow).toBe(0);
	});
});

// ---------------------------------------------------------------------------
// Tier Gating
// ---------------------------------------------------------------------------

describe('canCastTier', () => {
	describe('arcane spells (not forbidden)', () => {
		it('tier 1: anyone can cast', () => {
			expect(canCastTier(1, 'none', 1)).toBe(true);
		});

		it('tier 2: requires novice', () => {
			expect(canCastTier(2, 'none', 1)).toBe(false);
			expect(canCastTier(2, 'novice', 1)).toBe(true);
			expect(canCastTier(2, 'adept', 1)).toBe(true);
			expect(canCastTier(2, 'master', 1)).toBe(true);
		});

		it('tier 3: requires adept', () => {
			expect(canCastTier(3, 'none', 1)).toBe(false);
			expect(canCastTier(3, 'novice', 1)).toBe(false);
			expect(canCastTier(3, 'adept', 1)).toBe(true);
			expect(canCastTier(3, 'master', 1)).toBe(true);
		});

		it('tier 4: requires adept AND character level 10+', () => {
			expect(canCastTier(4, 'adept', 9)).toBe(false);
			expect(canCastTier(4, 'adept', 10)).toBe(true);
			expect(canCastTier(4, 'master', 10)).toBe(true);
			expect(canCastTier(4, 'novice', 10)).toBe(false);
			expect(canCastTier(4, 'none', 15)).toBe(false);
		});

		it('tier 5: requires master AND character level 15+', () => {
			expect(canCastTier(5, 'master', 14)).toBe(false);
			expect(canCastTier(5, 'master', 15)).toBe(true);
			expect(canCastTier(5, 'adept', 15)).toBe(false);
			expect(canCastTier(5, 'master', 20)).toBe(true);
		});

		it('invalid tier returns false', () => {
			expect(canCastTier(6, 'master', 20)).toBe(false);
			expect(canCastTier(0, 'master', 20)).toBe(false);
		});
	});

	describe('forbidden spells bypass tier gating', () => {
		it('tier 1 forbidden: always true', () => {
			expect(canCastTier(1, 'none', 1, true)).toBe(true);
		});

		it('tier 5 forbidden: bypasses mastery and level requirements', () => {
			expect(canCastTier(5, 'none', 1, true)).toBe(true);
		});

		it('all tiers pass when isForbidden is true', () => {
			for (let tier = 1; tier <= 5; tier++) {
				expect(canCastTier(tier, 'none', 1, true)).toBe(true);
			}
		});
	});
});

// ---------------------------------------------------------------------------
// Passive Bonuses
// ---------------------------------------------------------------------------

describe('Passive Bonuses', () => {
	it('ADEPT_PASSIVES covers all 7 arcane schools', () => {
		const arcaneSchools = ['elements', 'enchantment', 'restoration', 'divination', 'alchemy', 'conjuration', 'shadow'] as const;
		for (const school of arcaneSchools) {
			expect(ADEPT_PASSIVES[school]).toBeDefined();
			expect(ADEPT_PASSIVES[school].key).toBeTruthy();
			expect(ADEPT_PASSIVES[school].description).toBeTruthy();
		}
	});

	it('MASTER_PASSIVES covers all 7 arcane schools', () => {
		const arcaneSchools = ['elements', 'enchantment', 'restoration', 'divination', 'alchemy', 'conjuration', 'shadow'] as const;
		for (const school of arcaneSchools) {
			expect(MASTER_PASSIVES[school]).toBeDefined();
			expect(MASTER_PASSIVES[school].key).toBeTruthy();
			expect(MASTER_PASSIVES[school].description).toBeTruthy();
		}
	});

	it('adept elements bonus is +15% elemental damage', () => {
		expect(ADEPT_PASSIVES.elements.value).toBe(0.15);
	});

	it('master shadow bonus is 2x stealth damage', () => {
		expect(MASTER_PASSIVES.shadow.value).toBe(2.0);
	});
});
