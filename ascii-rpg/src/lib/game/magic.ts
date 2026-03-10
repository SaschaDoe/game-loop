/**
 * Magic system foundation: archetypes, class profiles, derived stats, mana calculations.
 * Implements US-MS-01 through US-MS-04 from Epic 79.
 */

import type { Entity, CharacterArchetype, CharacterClass, AttributeName } from './types';
import type { ArmorWeight } from './spells';

// ---------------------------------------------------------------------------
// Archetype Definitions (US-MS-01)
// ---------------------------------------------------------------------------

export interface ArchetypeDefinition {
	str: number;
	int: number;
	wil: number;
	agi: number;
	vit: number;
	primaryAttribute: AttributeName;
	manaModifier: number;
	description: string;
}

export const ARCHETYPE_ATTRIBUTES: Record<CharacterArchetype, ArchetypeDefinition> = {
	arcane:  { str:  6, int: 16, wil: 14, agi:  8, vit: 10, primaryAttribute: 'int', manaModifier: 1.50, description: 'Born to wield magic. High mana, strong spells, fragile body.' },
	finesse: { str:  8, int: 10, wil:  8, agi: 16, vit: 12, primaryAttribute: 'agi', manaModifier: 0.75, description: 'Quick and precise. Some magic, excels at evasion and crits.' },
	might:   { str: 14, int:  8, wil: 10, agi: 10, vit: 12, primaryAttribute: 'str', manaModifier: 0.25, description: 'Raw physical power. Minimal mana — relies on steel, not spells.' },
};

// ---------------------------------------------------------------------------
// Class Profiles (US-MS-01)
// ---------------------------------------------------------------------------

export interface ClassProfile {
	suggestedArchetype: CharacterArchetype;
	startingAbility: string | null;
	startingSpell: string | null;
	armorProficiency: ArmorWeight;
	description: string;
}

export const CLASS_PROFILES: Record<CharacterClass, ClassProfile> = {
	warrior:     { suggestedArchetype: 'might',   startingAbility: 'whirlwind',   startingSpell: null,              armorProficiency: 'heavy',  description: 'A sturdy fighter with high endurance' },
	paladin:     { suggestedArchetype: 'might',   startingAbility: 'holy_strike', startingSpell: null,              armorProficiency: 'heavy',  description: 'A holy knight of unwavering resolve' },
	mage:        { suggestedArchetype: 'arcane',  startingAbility: null,          startingSpell: 'spell_firebolt',  armorProficiency: 'robes',  description: 'A scholar who wields arcane forces' },
	necromancer: { suggestedArchetype: 'arcane',  startingAbility: null,          startingSpell: 'spell_shadow_bolt',  armorProficiency: 'light',  description: 'A dark mage who commands death itself' },
	cleric:      { suggestedArchetype: 'arcane',  startingAbility: null,          startingSpell: 'spell_heal',      armorProficiency: 'medium', description: 'A divine servant who heals and protects' },
	rogue:       { suggestedArchetype: 'finesse', startingAbility: 'smoke_bomb',  startingSpell: null,              armorProficiency: 'light',  description: 'A nimble adventurer with keen senses' },
	ranger:      { suggestedArchetype: 'finesse', startingAbility: 'trap_sense',  startingSpell: null,              armorProficiency: 'medium', description: 'A wilderness tracker with sharp eyes' },
	bard:        { suggestedArchetype: 'finesse', startingAbility: 'inspire',     startingSpell: null,              armorProficiency: 'light',  description: 'A charming performer whose songs shape fate' },
	adept:       { suggestedArchetype: 'arcane',  startingAbility: null,          startingSpell: 'spell_summon_light', armorProficiency: 'robes',  description: 'A dedicated student of the arcane arts, brimming with untapped potential' },
};

// ---------------------------------------------------------------------------
// Derived Stats (US-MS-02)
// ---------------------------------------------------------------------------

/**
 * Recalculate all derived stats on an entity from its base attributes.
 * Call after any attribute change (level up, buff, equipment change).
 */
export function recalculateDerivedStats(entity: Entity, armorValue: number = 0, weaponBonus: number = 0, archetypeMod?: number): void {
	const vit = entity.vit ?? 10;
	const str = entity.str ?? 10;
	const int = entity.int ?? 10;
	const wil = entity.wil ?? 10;
	const agi = entity.agi ?? 10;

	// maxHp = 10 + (VIT * 3) — purely attribute-driven, no level component
	entity.maxHp = 10 + (vit * 3);

	// attack = STR + weaponBonus
	entity.attack = str + weaponBonus;

	// spellPower = INT + floor(WIL / 3)
	entity.spellPower = int + Math.floor(wil / 3);

	// magicResist = WIL + floor(INT / 4), capped at 50%
	entity.magicResist = Math.min(50, wil + Math.floor(int / 4));

	// dodgeChance = AGI * 0.5%
	entity.dodgeChance = agi * 0.5;

	// critChance = AGI * 0.3%
	entity.critChance = agi * 0.3;

	// physicalDefense = armorValue + floor(VIT / 4)
	entity.physicalDefense = armorValue + Math.floor(vit / 4);

	// maxMana = INT * 2 * archetypeModifier — purely attribute-driven
	if (archetypeMod !== undefined) {
		entity.maxMana = Math.floor(int * 2 * archetypeMod);
	}

	// Clamp HP and mana to max
	if (entity.hp > entity.maxHp) entity.hp = entity.maxHp;
	if (entity.mana !== undefined && entity.maxMana !== undefined && entity.mana > entity.maxMana) {
		entity.mana = entity.maxMana;
	}
}

// ---------------------------------------------------------------------------
// Monster Attribute Helper
// ---------------------------------------------------------------------------

/** Generate simplified attributes for a monster from its tier and level */
export function monsterAttributes(tier: number, level: number): { str: number; int: number; wil: number; agi: number; vit: number } {
	const base = 6 + tier * 2 + Math.floor(level / 3);
	return {
		str: base + (tier >= 2 ? 2 : 0),
		int: Math.max(1, base - 2),
		wil: Math.max(1, base - 1),
		agi: base,
		vit: base + tier,
	};
}

/** Create a default entity with zeroed-out magic fields (for backward compatibility) */
export function defaultMagicFields(): Pick<Entity, 'str' | 'int' | 'wil' | 'agi' | 'vit' | 'mana' | 'maxMana' | 'spellPower' | 'magicResist' | 'dodgeChance' | 'critChance' | 'physicalDefense'> {
	return {
		str: 10, int: 10, wil: 10, agi: 10, vit: 10,
		mana: 0, maxMana: 0,
		spellPower: 0, magicResist: 0, dodgeChance: 0, critChance: 0, physicalDefense: 0,
	};
}

// ---------------------------------------------------------------------------
// Weapon Bonus Calculation
// ---------------------------------------------------------------------------

/** Get the weapon bonus from equipped items. Returns ATK bonus from the weapon. */
export function getWeaponBonus(equipment: Record<string, any>): number {
	let bonus = 0;
	for (const item of Object.values(equipment)) {
		if (item && item.stats?.atk) {
			bonus += item.stats.atk;
		}
	}
	return bonus;
}

/** Get the armor value from equipped items. */
export function getArmorValue(equipment: Record<string, any>): number {
	let value = 0;
	for (const item of Object.values(equipment)) {
		if (item && item.stats?.def) {
			value += item.stats.def;
		}
	}
	return value;
}

/** Get the armor weight category from equipped body armor */
export function getEquippedArmorWeight(equipment: Record<string, any>, classProfile: ClassProfile): ArmorWeight {
	const body = equipment?.body;
	if (body?.armorWeight) return body.armorWeight;
	// Default to class proficiency
	return classProfile.armorProficiency;
}
