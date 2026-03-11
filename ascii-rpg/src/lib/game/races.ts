/**
 * Race system: attribute tables, sight bonuses, exclusive classes, passives.
 */

import type { CharacterClass, CharacterRace } from './types';

// ---------------------------------------------------------------------------
// Race Attribute Definitions
// ---------------------------------------------------------------------------

export interface RaceDefinition {
	str: number;
	int: number;
	wil: number;
	agi: number;
	vit: number;
	manaModifier: number;
	description: string;
}

export const RACE_ATTRIBUTES: Record<CharacterRace, RaceDefinition> = {
	elf: {
		str: 7,
		int: 14,
		wil: 12,
		agi: 14,
		vit: 7,
		manaModifier: 1.40,
		description: 'Graceful and attuned to magic. High intelligence and agility, but fragile.',
	},
	dwarf: {
		str: 14,
		int: 8,
		wil: 11,
		agi: 7,
		vit: 14,
		manaModifier: 0.30,
		description: 'Stout and resilient. Raw physical power with minimal mana.',
	},
	human: {
		str: 10,
		int: 11,
		wil: 11,
		agi: 11,
		vit: 11,
		manaModifier: 0.80,
		description: 'Balanced and adaptable. No extreme strengths or weaknesses.',
	},
};

// ---------------------------------------------------------------------------
// Sight Bonuses
// ---------------------------------------------------------------------------

export const RACE_SIGHT_BONUS: Record<CharacterRace, number> = {
	elf: 2,
	dwarf: 0,
	human: 1,
};

// ---------------------------------------------------------------------------
// Exclusive Classes (future — not yet added to CharacterClass)
// ---------------------------------------------------------------------------

export const RACE_EXCLUSIVE_CLASSES: Record<CharacterRace, string> = {
	elf: 'primordial',
	dwarf: 'runesmith',
	human: 'spellblade',
};

// ---------------------------------------------------------------------------
// Race Passives
// ---------------------------------------------------------------------------

export interface RacePassive {
	id: string;
	description: string;
}

export const RACE_PASSIVES: Record<CharacterRace, RacePassive> = {
	elf: {
		id: 'ley_sight',
		description: 'Ley lines are always visible on the overworld.',
	},
	dwarf: {
		id: 'runic_affinity',
		description: 'Rune-enhanced equipment has a chance to gain extra bonuses.',
	},
	human: {
		id: 'second_wind',
		description: 'When HP drops below 20%, heal 25% of max HP once per level.',
	},
};

// ---------------------------------------------------------------------------
// Class Availability
// ---------------------------------------------------------------------------

/**
 * Check if a class is available for a given race.
 * Race-exclusive classes can only be played by their designated race.
 * All standard classes are available to every race.
 */
export function isClassAvailableForRace(race: CharacterRace, characterClass: CharacterClass | string): boolean {
	// Check if this is a race-exclusive class
	for (const [exclusiveRace, exclusiveClass] of Object.entries(RACE_EXCLUSIVE_CLASSES)) {
		if (characterClass === exclusiveClass) {
			return race === exclusiveRace;
		}
	}
	// All standard classes are available to every race
	return true;
}

// ---------------------------------------------------------------------------
// Mana Floor
// ---------------------------------------------------------------------------

/** Minimum maxMana for any player character, regardless of race/class combo */
export const MANA_FLOOR = 5;
