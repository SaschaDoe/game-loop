import { describe, it, expect } from 'vitest';
import { ARCHETYPE_ATTRIBUTES, CLASS_PROFILES, recalculateDerivedStats, monsterAttributes } from './magic';
import { SPELL_CATALOG, calculateSpellDamage, calculateSpellHealing, effectiveManaCost, executeSpell, getLeyLineEffectModifier, getEnvironmentalModifier, createTerrainEffects } from './spells';
import type { SpellDef } from './spells';
import type { Entity, CharacterArchetype } from './types';
import { canCastTier, createEmptyMastery, addMasteryXP, getAvailableSpecializations, getMasteryLevel, checkForbiddenThreshold } from './mastery';

function makeEntity(overrides: Partial<Entity> = {}): Entity {
	return {
		pos: { x: 0, y: 0 }, char: '@', color: '#ff0', name: 'Test',
		hp: 30, maxHp: 30, attack: 10, statusEffects: [],
		str: 10, int: 10, wil: 10, agi: 10, vit: 10,
		mana: 20, maxMana: 20,
		spellPower: 0, magicResist: 0, dodgeChance: 0, critChance: 0, physicalDefense: 0,
		...overrides,
	};
}

describe('Archetype System', () => {
	it('all archetypes sum to 54 attribute points', () => {
		for (const [name, arch] of Object.entries(ARCHETYPE_ATTRIBUTES)) {
			const sum = arch.str + arch.int + arch.wil + arch.agi + arch.vit;
			expect(sum, `${name} should sum to 54`).toBe(54);
		}
	});

	it('each class has a suggested archetype', () => {
		for (const [cls, profile] of Object.entries(CLASS_PROFILES)) {
			expect(ARCHETYPE_ATTRIBUTES[profile.suggestedArchetype], `${cls} should have valid archetype`).toBeDefined();
		}
	});
});

describe('Derived Stats', () => {
	it('calculates maxHp from VIT only (no level component)', () => {
		const entity = makeEntity({ vit: 10 });
		recalculateDerivedStats(entity, 0, 0, 1.0);
		// maxHp = 10 + (10 * 3) = 40
		expect(entity.maxHp).toBe(40);
	});

	it('calculates attack from STR + weapon bonus', () => {
		const entity = makeEntity({ str: 14 });
		recalculateDerivedStats(entity, 0, 3, 1.0);
		expect(entity.attack).toBe(14 + 3);
	});

	it('calculates spellPower from INT + WIL/3', () => {
		const entity = makeEntity({ int: 16, wil: 14 });
		recalculateDerivedStats(entity, 0, 0, 1.5);
		// spellPower = 16 + floor(14/3) = 16 + 4 = 20
		expect(entity.spellPower).toBe(20);
	});

	it('calculates magicResist capped at 50%', () => {
		const entity = makeEntity({ wil: 40, int: 40 });
		recalculateDerivedStats(entity, 0, 0, 1.0);
		expect(entity.magicResist).toBe(50);
	});

	it('calculates maxMana with archetype modifier (no level component)', () => {
		const entity = makeEntity({ int: 16 });
		recalculateDerivedStats(entity, 0, 0, 1.5);
		// maxMana = floor(16 * 2 * 1.5) = 48
		expect(entity.maxMana).toBe(48);
	});

	it('Might archetype gets minimal mana', () => {
		const entity = makeEntity({ int: 8 });
		recalculateDerivedStats(entity, 0, 0, 0.25);
		// maxMana = floor(8 * 2 * 0.25) = 4
		expect(entity.maxMana).toBe(4);
	});

	it('calculates physicalDefense from armor + VIT', () => {
		const entity = makeEntity({ vit: 12 });
		recalculateDerivedStats(entity, 5, 0, 1.0);
		// physicalDefense = 5 + floor(12/4) = 5 + 3 = 8
		expect(entity.physicalDefense).toBe(8);
	});
});

describe('Spell Damage', () => {
	it('calculates spell damage with spellPower scaling', () => {
		const spell = SPELL_CATALOG['spell_firebolt'];
		const caster = makeEntity({ spellPower: 20 });
		const target = makeEntity({ magicResist: 0 });
		// damage = 4 + floor(20/4) = 4 + 5 = 9
		expect(calculateSpellDamage(spell, caster, target)).toBe(9);
	});

	it('applies magic resistance reduction', () => {
		const spell = SPELL_CATALOG['spell_firebolt'];
		const caster = makeEntity({ spellPower: 20 });
		const target = makeEntity({ magicResist: 20 });
		// raw = 9, reduced by 20% → floor(9 * 0.8) = 7
		expect(calculateSpellDamage(spell, caster, target)).toBe(7);
	});

	it('minimum 1 damage always gets through', () => {
		const spell = SPELL_CATALOG['spell_firebolt'];
		const caster = makeEntity({ spellPower: 0 });
		const target = makeEntity({ magicResist: 50 });
		// raw = 4, reduced by 50% → floor(4 * 0.5) = 2
		expect(calculateSpellDamage(spell, caster, target)).toBeGreaterThanOrEqual(1);
	});
});

describe('Spell Healing', () => {
	it('calculates healing with spellPower/3 scaling', () => {
		const spell = SPELL_CATALOG['spell_heal'];
		const caster = makeEntity({ spellPower: 21 });
		// heal = 8 + floor(21/3) = 8 + 7 = 15
		expect(calculateSpellHealing(spell, caster)).toBe(15);
	});
});

describe('Armor Casting Penalty', () => {
	it('heavy armor costs +50%', () => {
		const spell = SPELL_CATALOG['spell_firebolt']; // 3 mana
		expect(effectiveManaCost(spell, 'heavy')).toBe(5); // ceil(3 * 1.5) = 5
	});

	it('robes reduce cost by 10%', () => {
		const spell = SPELL_CATALOG['spell_fireball']; // 10 mana
		expect(effectiveManaCost(spell, 'robes')).toBe(9); // ceil(10 * 0.9) = 9
	});
});

describe('Spell Execution', () => {
	it('deducts mana on successful cast', () => {
		const caster = makeEntity({ mana: 20, maxMana: 20, spellPower: 10 });
		const target = makeEntity({ hp: 30, maxHp: 30, magicResist: 0 });
		const spell = SPELL_CATALOG['spell_firebolt'];
		const result = executeSpell(spell, caster, [target], 'light');
		expect(result.success).toBe(true);
		expect(caster.mana).toBe(20 - 3);
	});

	it('fails when not enough mana', () => {
		const caster = makeEntity({ mana: 1, maxMana: 20, spellPower: 10 });
		const target = makeEntity({ hp: 30, maxHp: 30 });
		const spell = SPELL_CATALOG['spell_firebolt'];
		const result = executeSpell(spell, caster, [target], 'light');
		expect(result.success).toBe(false);
		expect(caster.mana).toBe(1); // unchanged
	});

	it('healing spell restores HP', () => {
		const caster = makeEntity({ hp: 10, maxHp: 30, mana: 20, spellPower: 12 });
		const spell = SPELL_CATALOG['spell_heal'];
		const result = executeSpell(spell, caster, [], 'light');
		expect(result.success).toBe(true);
		expect(caster.hp).toBeGreaterThan(10);
		expect(result.healingDone).toBeGreaterThan(0);
	});

	it('healing does not exceed maxHp', () => {
		const caster = makeEntity({ hp: 29, maxHp: 30, mana: 20, spellPower: 20 });
		const spell = SPELL_CATALOG['spell_heal'];
		executeSpell(spell, caster, [], 'light');
		expect(caster.hp).toBe(30);
	});

	it('damage spell kills enemy', () => {
		const caster = makeEntity({ mana: 20, spellPower: 40 });
		const target = makeEntity({ hp: 1, maxHp: 10, magicResist: 0, name: 'Rat' });
		const spell = SPELL_CATALOG['spell_firebolt'];
		const result = executeSpell(spell, caster, [target], 'light');
		expect(target.hp).toBeLessThanOrEqual(0);
		expect(result.killedEnemies.length).toBe(1);
	});

	it('applies status effects to targets', () => {
		const caster = makeEntity({ mana: 20, spellPower: 10 });
		const target = makeEntity({ hp: 30, maxHp: 30, magicResist: 0 });
		const spell = SPELL_CATALOG['spell_frost_lance'];
		executeSpell(spell, caster, [target], 'light');
		const hasFreeze = target.statusEffects.some(e => e.type === 'freeze');
		expect(hasFreeze).toBe(true);
	});
});

describe('Monster Attributes', () => {
	it('generates reasonable monster attributes', () => {
		const attrs = monsterAttributes(1, 5);
		expect(attrs.str).toBeGreaterThan(0);
		expect(attrs.int).toBeGreaterThan(0);
		expect(attrs.vit).toBeGreaterThan(0);
	});

	it('scales with tier and level', () => {
		const low = monsterAttributes(1, 1);
		const high = monsterAttributes(3, 10);
		expect(high.str).toBeGreaterThan(low.str);
		expect(high.vit).toBeGreaterThan(low.vit);
	});
});

describe('Ley Line Effect Modifier', () => {
	it('returns correct values for each level', () => {
		expect(getLeyLineEffectModifier(0)).toBe(0);     // Dead zone
		expect(getLeyLineEffectModifier(1)).toBe(0.9);   // Low
		expect(getLeyLineEffectModifier(2)).toBe(1.0);   // Normal
		expect(getLeyLineEffectModifier(3)).toBe(1.1);   // High
		expect(getLeyLineEffectModifier(4)).toBe(1.25);  // Convergence
	});

	it('dead zone modifier is 0', () => {
		expect(getLeyLineEffectModifier(0)).toBe(0);
	});

	it('returns 1.0 for out-of-range values', () => {
		expect(getLeyLineEffectModifier(5)).toBe(1.0);
		expect(getLeyLineEffectModifier(-1)).toBe(1.0);
	});
});

describe('Environmental Modifier', () => {
	it('boosts shadow spells at night outdoors', () => {
		const shadowSpell = SPELL_CATALOG['spell_shadow_bolt'];
		expect(getEnvironmentalModifier(shadowSpell, 'night', true)).toBe(1.15);
	});

	it('boosts divination spells at night outdoors', () => {
		const divSpell = SPELL_CATALOG['spell_true_sight'];
		expect(getEnvironmentalModifier(divSpell, 'night', true)).toBe(1.15);
	});

	it('boosts element spells during day outdoors', () => {
		const fireSpell = SPELL_CATALOG['spell_firebolt'];
		expect(getEnvironmentalModifier(fireSpell, 'day', true)).toBe(1.15);
	});

	it('no bonus indoors regardless of time', () => {
		const shadowSpell = SPELL_CATALOG['spell_shadow_bolt'];
		expect(getEnvironmentalModifier(shadowSpell, 'night', false)).toBe(1.0);
	});

	it('no bonus for mismatched school/time', () => {
		const fireSpell = SPELL_CATALOG['spell_firebolt'];
		expect(getEnvironmentalModifier(fireSpell, 'night', true)).toBe(1.0);
	});

	it('returns 1.0 for normal conditions', () => {
		const fireSpell = SPELL_CATALOG['spell_firebolt'];
		expect(getEnvironmentalModifier(fireSpell, 'morning', true)).toBe(1.0);
	});
});

describe('Ley Line Spell Effects', () => {
	it('convergence increases spell damage', () => {
		const caster = makeEntity({ mana: 20, maxMana: 20, spellPower: 20 });
		const target = makeEntity({ hp: 100, maxHp: 100, magicResist: 0 });
		const spell = SPELL_CATALOG['spell_firebolt'];
		// Normal (ley 2): base damage
		const normalResult = executeSpell(spell, caster, [target], 'light', 2);
		const normalDmg = normalResult.damageDealt;
		// Reset
		caster.mana = 20;
		target.hp = 100;
		// Convergence (ley 4): 1.25x damage
		const convResult = executeSpell(spell, caster, [target], 'light', 4);
		expect(convResult.damageDealt).toBeGreaterThan(normalDmg);
	});

	it('low ley line reduces spell damage', () => {
		const caster = makeEntity({ mana: 20, maxMana: 20, spellPower: 20 });
		const target = makeEntity({ hp: 100, maxHp: 100, magicResist: 0 });
		const spell = SPELL_CATALOG['spell_firebolt'];
		// Normal (ley 2)
		const normalResult = executeSpell(spell, caster, [target], 'light', 2);
		const normalDmg = normalResult.damageDealt;
		// Reset
		caster.mana = 20;
		target.hp = 100;
		// Low (ley 1): 0.9x damage
		const lowResult = executeSpell(spell, caster, [target], 'light', 1);
		expect(lowResult.damageDealt).toBeLessThan(normalDmg);
	});
});

describe('Terrain Effects from Spells', () => {
	it('creates burning terrain effect for fire spells', () => {
		const fireSpell = SPELL_CATALOG['spell_firebolt'];
		const effects = createTerrainEffects(fireSpell, { x: 5, y: 5 });
		expect(effects).toHaveLength(1);
		expect(effects[0].type).toBe('burning');
		expect(effects[0].duration).toBe(3);
		expect(effects[0].damagePerTurn).toBe(2);
		expect(effects[0].pos).toEqual({ x: 5, y: 5 });
	});

	it('creates frozen terrain effect for ice spells', () => {
		const iceSpell = SPELL_CATALOG['spell_frost_lance'];
		const effects = createTerrainEffects(iceSpell, { x: 3, y: 4 });
		expect(effects).toHaveLength(1);
		expect(effects[0].type).toBe('frozen');
		expect(effects[0].duration).toBe(5);
		expect(effects[0].damagePerTurn).toBe(0);
	});

	it('creates electrified terrain effect for lightning spells', () => {
		const lightningSpell = SPELL_CATALOG['spell_lightning_arc'];
		const effects = createTerrainEffects(lightningSpell, { x: 7, y: 2 });
		expect(effects).toHaveLength(1);
		expect(effects[0].type).toBe('electrified');
		expect(effects[0].duration).toBe(2);
		expect(effects[0].damagePerTurn).toBe(1);
	});

	it('returns empty array for non-elemental spells', () => {
		const healSpell = SPELL_CATALOG['spell_heal'];
		const effects = createTerrainEffects(healSpell, { x: 1, y: 1 });
		expect(effects).toHaveLength(0);
	});

	it('returns empty array for zero-damage elemental spells', () => {
		// Create a mock spell with fire element but 0 base damage
		const mockSpell: SpellDef = {
			id: 'test_no_damage_fire', name: 'Test', school: 'elements', tier: 1,
			description: '', effect: '', manaCost: 1, cooldown: 0,
			targetType: 'self', baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'fire',
		};
		const effects = createTerrainEffects(mockSpell, { x: 1, y: 1 });
		expect(effects).toHaveLength(0);
	});
});

// =====================================================================
// Integration Tests
// =====================================================================

describe('Integration: Tier Gating', () => {
	it('blocks tier 3 spell with novice mastery', () => {
		// Novice mastery (XP 1-199), charLevel 5
		expect(canCastTier(3, 'novice', 5)).toBe(false);
	});

	it('allows tier 3 spell with adept mastery', () => {
		expect(canCastTier(3, 'adept', 5)).toBe(true);
	});

	it('blocks tier 4 spell without sufficient level', () => {
		// Adept but only level 5 — tier 4 requires adept AND level 10+
		expect(canCastTier(4, 'adept', 5)).toBe(false);
	});

	it('allows tier 4 spell with adept mastery and level 10', () => {
		expect(canCastTier(4, 'adept', 10)).toBe(true);
	});

	it('blocks tier 5 spell without master mastery', () => {
		expect(canCastTier(5, 'adept', 20)).toBe(false);
	});

	it('allows tier 5 spell with master mastery and level 15', () => {
		expect(canCastTier(5, 'master', 15)).toBe(true);
	});
});

describe('Integration: Forbidden Magic', () => {
	it('forbidden spells bypass tier requirements', () => {
		// Tier 5 spell with no mastery and level 1, but isForbidden = true
		expect(canCastTier(5, 'none', 1, true)).toBe(true);
	});

	it('forbidden spells bypass all tier levels', () => {
		expect(canCastTier(3, 'none', 1, true)).toBe(true);
		expect(canCastTier(4, 'none', 1, true)).toBe(true);
	});
});

describe('Integration: Mastery XP', () => {
	it('addMasteryXP applies mage multiplier', () => {
		const mastery = createEmptyMastery();
		const updated = addMasteryXP(mastery, 'elements', 10, 'mage');
		expect(updated.elements).toBe(15); // 10 * 1.5
	});

	it('addMasteryXP applies cleric forbidden penalty', () => {
		const mastery = createEmptyMastery();
		const updated = addMasteryXP(mastery, 'blood', 10, 'cleric');
		expect(updated.blood).toBe(5); // 10 * 0.5
	});

	it('addMasteryXP applies warrior neutral multiplier', () => {
		const mastery = createEmptyMastery();
		const updated = addMasteryXP(mastery, 'elements', 10, 'warrior');
		expect(updated.elements).toBe(10); // 10 * 1.0
	});

	it('addMasteryXP does not mutate original mastery', () => {
		const mastery = createEmptyMastery();
		const updated = addMasteryXP(mastery, 'elements', 10, 'mage');
		expect(mastery.elements).toBe(0);
		expect(updated.elements).toBe(15);
	});

	it('getMasteryLevel returns correct levels', () => {
		expect(getMasteryLevel(0)).toBe('none');
		expect(getMasteryLevel(1)).toBe('novice');
		expect(getMasteryLevel(199)).toBe('novice');
		expect(getMasteryLevel(200)).toBe('adept');
		expect(getMasteryLevel(999)).toBe('adept');
		expect(getMasteryLevel(1000)).toBe('master');
	});
});

describe('Integration: Specializations', () => {
	it('no specializations below level 10', () => {
		const mastery = createEmptyMastery();
		const specs = getAvailableSpecializations(5, mastery, null);
		expect(specs.length).toBe(0);
	});

	it('archmage available at level 10 without school requirement', () => {
		const mastery = createEmptyMastery();
		const specs = getAvailableSpecializations(10, mastery, null);
		expect(specs.some(s => s.id === 'archmage')).toBe(true);
	});

	it('battlemage available at level 10 without school requirement', () => {
		const mastery = createEmptyMastery();
		const specs = getAvailableSpecializations(10, mastery, null);
		expect(specs.some(s => s.id === 'battlemage')).toBe(true);
	});

	it('elementalist requires adept elements mastery', () => {
		const mastery = createEmptyMastery();
		mastery.elements = 200; // adept threshold
		const specs = getAvailableSpecializations(10, mastery, null);
		expect(specs.some(s => s.id === 'elementalist')).toBe(true);
	});

	it('elementalist not available without elements mastery', () => {
		const mastery = createEmptyMastery();
		const specs = getAvailableSpecializations(10, mastery, null);
		expect(specs.some(s => s.id === 'elementalist')).toBe(false);
	});

	it('healer requires adept restoration mastery', () => {
		const mastery = createEmptyMastery();
		mastery.restoration = 200;
		const specs = getAvailableSpecializations(10, mastery, null);
		expect(specs.some(s => s.id === 'healer')).toBe(true);
	});

	it('no specializations if already specialized', () => {
		const mastery = createEmptyMastery();
		mastery.elements = 1000; // master
		const specs = getAvailableSpecializations(10, mastery, 'archmage');
		expect(specs.length).toBe(0);
	});
});

describe('Integration: Forbidden Thresholds', () => {
	it('no threshold below 5 spells', () => {
		const result = checkForbiddenThreshold(['spell_blood_bolt', 'spell_blood_shield'], 'blood', SPELL_CATALOG);
		expect(result).toBeNull();
	});

	it('threshold triggers at 5 blood spells', () => {
		// Create a list with 5 blood school spells
		const bloodSpells = Object.keys(SPELL_CATALOG).filter(id => SPELL_CATALOG[id].school === 'blood');
		// Ensure we have at least 5 blood spells
		expect(bloodSpells.length).toBeGreaterThanOrEqual(5);
		const fiveBlood = bloodSpells.slice(0, 5);
		const result = checkForbiddenThreshold(fiveBlood, 'blood', SPELL_CATALOG);
		expect(result).not.toBeNull();
		expect(result!.passiveName).toBe('Blood Frenzy');
	});

	it('threshold triggers for necromancy at 5 spells', () => {
		const necroSpells = Object.keys(SPELL_CATALOG).filter(id => SPELL_CATALOG[id].school === 'necromancy');
		expect(necroSpells.length).toBeGreaterThanOrEqual(5);
		const fiveNecro = necroSpells.slice(0, 5);
		const result = checkForbiddenThreshold(fiveNecro, 'necromancy', SPELL_CATALOG);
		expect(result).not.toBeNull();
		expect(result!.passiveName).toBe('Undead Accord');
	});

	it('non-matching school spells do not count', () => {
		// Use fire spells but check blood threshold
		const fireSpells = Object.keys(SPELL_CATALOG).filter(id => SPELL_CATALOG[id].school === 'elements').slice(0, 5);
		const result = checkForbiddenThreshold(fireSpells, 'blood', SPELL_CATALOG);
		expect(result).toBeNull();
	});
});
