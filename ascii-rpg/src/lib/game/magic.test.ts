import { describe, it, expect } from 'vitest';
import { ARCHETYPE_ATTRIBUTES, CLASS_PROFILES, recalculateDerivedStats, monsterAttributes } from './magic';
import { SPELL_CATALOG, calculateSpellDamage, calculateSpellHealing, effectiveManaCost, executeSpell } from './spells';
import type { Entity, CharacterArchetype } from './types';

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
	it('calculates maxHp from VIT and level', () => {
		const entity = makeEntity({ vit: 10 });
		recalculateDerivedStats(entity, 1, 0, 0, 1.0);
		// maxHp = 10 + (10 * 3) + (1 * floor(10/5)) = 10 + 30 + 2 = 42
		expect(entity.maxHp).toBe(42);
	});

	it('calculates attack from STR + weapon bonus', () => {
		const entity = makeEntity({ str: 14 });
		recalculateDerivedStats(entity, 1, 0, 3, 1.0);
		expect(entity.attack).toBe(14 + 3);
	});

	it('calculates spellPower from INT + WIL/3', () => {
		const entity = makeEntity({ int: 16, wil: 14 });
		recalculateDerivedStats(entity, 1, 0, 0, 1.5);
		// spellPower = 16 + floor(14/3) = 16 + 4 = 20
		expect(entity.spellPower).toBe(20);
	});

	it('calculates magicResist capped at 50%', () => {
		const entity = makeEntity({ wil: 40, int: 40 });
		recalculateDerivedStats(entity, 1, 0, 0, 1.0);
		expect(entity.magicResist).toBe(50);
	});

	it('calculates maxMana with archetype modifier', () => {
		const entity = makeEntity({ int: 16 });
		recalculateDerivedStats(entity, 1, 0, 0, 1.5);
		// maxMana = floor((16*2 + 1*3) * 1.5) = floor(35 * 1.5) = 52
		expect(entity.maxMana).toBe(52);
	});

	it('Might archetype gets minimal mana', () => {
		const entity = makeEntity({ int: 8 });
		recalculateDerivedStats(entity, 1, 0, 0, 0.25);
		// maxMana = floor((8*2 + 1*3) * 0.25) = floor(19 * 0.25) = 4
		expect(entity.maxMana).toBe(4);
	});

	it('calculates physicalDefense from armor + VIT', () => {
		const entity = makeEntity({ vit: 12 });
		recalculateDerivedStats(entity, 1, 5, 0, 1.0);
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
		const spell = SPELL_CATALOG['spell_inferno']; // 10 mana
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
