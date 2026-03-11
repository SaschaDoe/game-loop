/**
 * School mastery system: XP tracking, mastery levels, tier gating, class multipliers, and passive bonuses.
 * Implements mastery progression for all 7 arcane schools and 5 forbidden schools.
 */

import type { CharacterClass } from './types';
import type { SpellSchool } from './spells';

// ---------------------------------------------------------------------------
// School Types
// ---------------------------------------------------------------------------

/** Forbidden spell schools — dark magic that bypasses normal tier gating */
export type ForbiddenSchool = 'blood' | 'necromancy' | 'void_magic' | 'chronomancy' | 'soul';

/** All spell schools (arcane + forbidden) tracked by the mastery system */
export type MasterySchool = SpellSchool | ForbiddenSchool;

/** All school identifiers for iteration */
export const ALL_SCHOOLS: MasterySchool[] = [
	'elements', 'enchantment', 'restoration', 'divination', 'alchemy', 'conjuration', 'shadow',
	'blood', 'necromancy', 'void_magic', 'chronomancy', 'soul',
];

export const FORBIDDEN_SCHOOLS: ForbiddenSchool[] = ['blood', 'necromancy', 'void_magic', 'chronomancy', 'soul'];

// ---------------------------------------------------------------------------
// Mastery Levels
// ---------------------------------------------------------------------------

export type MasteryLevel = 'none' | 'novice' | 'adept' | 'master';

/** XP thresholds for each mastery level */
export const MASTERY_THRESHOLDS: Record<MasteryLevel, number> = {
	none: 0,
	novice: 1,
	adept: 200,
	master: 1000,
};

/** Determine mastery level from accumulated XP */
export function getMasteryLevel(xp: number): MasteryLevel {
	if (xp >= MASTERY_THRESHOLDS.master) return 'master';
	if (xp >= MASTERY_THRESHOLDS.adept) return 'adept';
	if (xp >= MASTERY_THRESHOLDS.novice) return 'novice';
	return 'none';
}

// ---------------------------------------------------------------------------
// School Mastery Record
// ---------------------------------------------------------------------------

/** Per-school XP record — tracks mastery progress for all 12 schools */
export type SchoolMastery = Record<MasterySchool, number>;

/** Create a fresh mastery record with 0 XP in every school */
export function createEmptyMastery(): SchoolMastery {
	const mastery = {} as SchoolMastery;
	for (const school of ALL_SCHOOLS) {
		mastery[school] = 0;
	}
	return mastery;
}

// ---------------------------------------------------------------------------
// Class Mastery Multipliers
// ---------------------------------------------------------------------------

/**
 * Per-class XP multipliers for each school.
 * Values > 1.0 mean faster mastery; < 1.0 means slower.
 */
export const CLASS_MASTERY_MULTIPLIERS: Record<CharacterClass, Record<MasterySchool, number>> = {
	mage: {
		elements: 1.5, enchantment: 1.5, restoration: 1.5, divination: 1.5,
		alchemy: 1.5, conjuration: 1.5, shadow: 1.5,
		blood: 1.5, necromancy: 1.5, void_magic: 1.5, chronomancy: 1.5, soul: 1.5,
	},
	necromancer: {
		elements: 1.0, enchantment: 1.0, restoration: 1.0, divination: 1.0,
		alchemy: 1.0, conjuration: 1.0, shadow: 1.5,
		blood: 1.0, necromancy: 1.5, void_magic: 1.0, chronomancy: 1.0, soul: 1.0,
	},
	cleric: {
		elements: 1.0, enchantment: 1.25, restoration: 1.5, divination: 1.0,
		alchemy: 1.0, conjuration: 1.0, shadow: 1.0,
		blood: 0.5, necromancy: 0.5, void_magic: 0.5, chronomancy: 0.5, soul: 0.5,
	},
	bard: {
		elements: 1.0, enchantment: 1.25, restoration: 1.0, divination: 1.0,
		alchemy: 1.0, conjuration: 1.25, shadow: 1.0,
		blood: 1.0, necromancy: 1.0, void_magic: 1.0, chronomancy: 1.0, soul: 1.0,
	},
	ranger: {
		elements: 1.25, enchantment: 1.0, restoration: 1.0, divination: 1.25,
		alchemy: 1.0, conjuration: 1.0, shadow: 1.0,
		blood: 1.0, necromancy: 1.0, void_magic: 1.0, chronomancy: 1.0, soul: 1.0,
	},
	rogue: {
		elements: 1.0, enchantment: 1.0, restoration: 1.0, divination: 1.0,
		alchemy: 1.0, conjuration: 1.25, shadow: 1.25,
		blood: 1.0, necromancy: 1.0, void_magic: 1.0, chronomancy: 1.0, soul: 1.0,
	},
	warrior: {
		elements: 1.0, enchantment: 1.0, restoration: 1.0, divination: 1.0,
		alchemy: 1.0, conjuration: 1.0, shadow: 1.0,
		blood: 1.0, necromancy: 1.0, void_magic: 1.0, chronomancy: 1.0, soul: 1.0,
	},
	paladin: {
		elements: 1.0, enchantment: 1.0, restoration: 1.0, divination: 1.0,
		alchemy: 1.0, conjuration: 1.0, shadow: 1.0,
		blood: 1.0, necromancy: 1.0, void_magic: 1.0, chronomancy: 1.0, soul: 1.0,
	},
	adept: {
		elements: 1.2, enchantment: 1.2, restoration: 1.2, divination: 1.3,
		alchemy: 1.2, conjuration: 1.2, shadow: 1.0,
		blood: 0.8, necromancy: 0.8, void_magic: 0.8, chronomancy: 1.0, soul: 1.0,
	},
	primordial: {
		elements: 1.3, enchantment: 1.0, restoration: 1.3, divination: 1.5,
		alchemy: 1.0, conjuration: 1.3, shadow: 0.8,
		blood: 0.5, necromancy: 0.5, void_magic: 0.5, chronomancy: 1.0, soul: 1.0,
	},
	runesmith: {
		elements: 1.3, enchantment: 1.5, restoration: 1.0, divination: 1.0,
		alchemy: 1.3, conjuration: 1.0, shadow: 0.5,
		blood: 0.5, necromancy: 0.5, void_magic: 0.5, chronomancy: 0.8, soul: 0.5,
	},
	spellblade: {
		elements: 1.3, enchantment: 1.3, restoration: 1.0, divination: 0.8,
		alchemy: 0.8, conjuration: 1.0, shadow: 1.0,
		blood: 1.0, necromancy: 0.8, void_magic: 0.8, chronomancy: 0.8, soul: 0.8,
	},
};

// ---------------------------------------------------------------------------
// XP Gain
// ---------------------------------------------------------------------------

/**
 * Award mastery XP for casting a spell.
 * Returns a new mastery record with updated XP for the given school.
 *
 * @param mastery  Current mastery record
 * @param school   School of the spell that was cast
 * @param baseXP   Base XP for the cast (default 5)
 * @param charClass  Player's class (determines multiplier)
 * @returns Updated mastery record (new object — does not mutate the original)
 */
export function addMasteryXP(
	mastery: SchoolMastery,
	school: MasterySchool,
	baseXP: number,
	charClass: CharacterClass,
): SchoolMastery {
	const multiplier = CLASS_MASTERY_MULTIPLIERS[charClass][school];
	const xpGain = Math.floor(baseXP * multiplier);
	return {
		...mastery,
		[school]: mastery[school] + xpGain,
	};
}

// ---------------------------------------------------------------------------
// Tier Gating
// ---------------------------------------------------------------------------

/**
 * Check whether a character can cast a spell of the given tier.
 *
 * Forbidden spells bypass arcane tier requirements entirely.
 *
 * @param tier          Spell tier (1-5)
 * @param masteryLevel  Player's mastery level in the spell's school
 * @param charLevel     Player's character level
 * @param isForbidden   Whether the spell belongs to a forbidden school
 */
export function canCastTier(
	tier: number,
	masteryLevel: MasteryLevel,
	charLevel: number,
	isForbidden: boolean = false,
): boolean {
	// Forbidden spells bypass tier gating
	if (isForbidden) return true;

	const levelOrder: Record<MasteryLevel, number> = { none: 0, novice: 1, adept: 2, master: 3 };
	const level = levelOrder[masteryLevel];

	switch (tier) {
		case 1:
			return true; // anyone
		case 2:
			return level >= 1; // novice+
		case 3:
			return level >= 2; // adept+
		case 4:
			return level >= 2 && charLevel >= 10; // adept+ AND char level 10+
		case 5:
			return level >= 3 && charLevel >= 15; // master AND char level 15+
		default:
			return false;
	}
}

// ---------------------------------------------------------------------------
// Passive Bonuses
// ---------------------------------------------------------------------------

export interface PassiveBonus {
	description: string;
	/** Machine-readable bonus key for the game engine to apply */
	key: string;
	/** Numeric value of the bonus (percentage, flat amount, or multiplier) */
	value: number;
}

/** Passive bonuses unlocked at adept mastery level (per arcane school) */
export const ADEPT_PASSIVES: Record<SpellSchool, PassiveBonus> = {
	elements:    { description: '+15% elemental damage',       key: 'elemental_damage_bonus',  value: 0.15 },
	enchantment: { description: '+30% ward/shield duration',   key: 'ward_duration_bonus',     value: 0.30 },
	restoration: { description: '+20% healing output',         key: 'healing_bonus',           value: 0.20 },
	divination:  { description: '+1 sight radius',             key: 'sight_radius_bonus',      value: 1 },
	alchemy:     { description: '+25% potion effects',         key: 'potion_effect_bonus',     value: 0.25 },
	conjuration: { description: '+50% summon duration',        key: 'summon_duration_bonus',   value: 0.50 },
	shadow:      { description: '+30% debuff duration',        key: 'debuff_duration_bonus',   value: 0.30 },
};

/** Passive bonuses unlocked at master mastery level (per arcane school) */
export const MASTER_PASSIVES: Record<SpellSchool, PassiveBonus> = {
	elements:    { description: '10% chance free follow-up elemental cast',  key: 'elemental_followup_chance',  value: 0.10 },
	enchantment: { description: 'Wards absorb first hit completely',         key: 'ward_absorb_first_hit',      value: 1 },
	restoration: { description: 'Auto-heal at low HP (below 20%)',           key: 'auto_heal_low_hp',           value: 0.20 },
	divination:  { description: 'Permanent trap detection',                  key: 'permanent_trap_detect',      value: 1 },
	alchemy:     { description: '30% chance to not consume potion',          key: 'potion_no_consume_chance',   value: 0.30 },
	conjuration: { description: '+50% summon HP and damage',                 key: 'summon_stat_bonus',          value: 0.50 },
	shadow:      { description: '2x damage from stealth',                    key: 'stealth_damage_multiplier',  value: 2.0 },
};

// ---------------------------------------------------------------------------
// Class Specializations
// ---------------------------------------------------------------------------

export interface Specialization {
	id: string;
	name: string;
	description: string;
	requiredSchool?: MasterySchool;  // must be adept+ in this school
	bonuses: string; // description of bonuses
}

export const SPECIALIZATIONS: Record<string, Specialization> = {
	archmage:      { id: 'archmage',      name: 'Archmage',      description: '-20% spell mana cost',                                    bonuses: 'manaCostReduction' },
	elementalist:  { id: 'elementalist',   name: 'Elementalist',  description: '+50% elemental damage',         requiredSchool: 'elements',    bonuses: 'elementDmgBonus' },
	battlemage:    { id: 'battlemage',     name: 'Battlemage',    description: 'No armor penalty for medium',                             bonuses: 'armorPenaltyFree' },
	healer:        { id: 'healer',         name: 'Healer',        description: '+50% healing output',           requiredSchool: 'restoration', bonuses: 'healBonus' },
	shadowcaster:  { id: 'shadowcaster',   name: 'Shadowcaster',  description: '2x invisibility duration',     requiredSchool: 'shadow',      bonuses: 'stealthBonus' },
	artificer:     { id: 'artificer',      name: 'Artificer',     description: '100% enchanting success',       requiredSchool: 'enchantment', bonuses: 'enchantSuccess' },
	seer:          { id: 'seer',           name: 'Seer',          description: 'Permanent enemy analysis',      requiredSchool: 'divination',  bonuses: 'autoAnalysis' },
};

export function getAvailableSpecializations(
	charLevel: number,
	mastery: SchoolMastery,
	currentSpec: string | null
): Specialization[] {
	if (currentSpec !== null) return []; // already specialized
	if (charLevel < 10) return []; // must be level 10+

	return Object.values(SPECIALIZATIONS).filter(spec => {
		if (!spec.requiredSchool) return true; // no school requirement (archmage, battlemage)
		const level = getMasteryLevel(mastery[spec.requiredSchool] ?? 0);
		return level === 'adept' || level === 'master';
	});
}

// ---------------------------------------------------------------------------
// Forbidden Magic Threshold Events
// ---------------------------------------------------------------------------

export interface ForbiddenThreshold {
	school: ForbiddenSchool;
	spellCount: number; // triggers at 5
	passiveName: string;
	description: string;
}

export const FORBIDDEN_THRESHOLDS: ForbiddenThreshold[] = [
	{ school: 'blood', spellCount: 5, passiveName: 'Blood Frenzy', description: 'Attacks heal 1 HP' },
	{ school: 'necromancy', spellCount: 5, passiveName: 'Undead Accord', description: 'Undead enemies ignore you' },
	{ school: 'void_magic', spellCount: 5, passiveName: 'Void Whisper', description: 'Periodically reveal nearby secrets' },
	{ school: 'chronomancy', spellCount: 5, passiveName: 'Temporal Sense', description: 'Automatic trap awareness' },
	{ school: 'soul', spellCount: 5, passiveName: 'Soul Sight', description: 'See all entities through walls' },
];

export function checkForbiddenThreshold(
	learnedSpells: string[],
	school: ForbiddenSchool,
	spellCatalog: Record<string, { school: string }>
): ForbiddenThreshold | null {
	const count = learnedSpells.filter(id => spellCatalog[id]?.school === school).length;
	const threshold = FORBIDDEN_THRESHOLDS.find(t => t.school === school);
	if (threshold && count >= threshold.spellCount) return threshold;
	return null;
}
