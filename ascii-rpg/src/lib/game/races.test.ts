import { describe, it, expect } from 'vitest';
import {
	RACE_ATTRIBUTES,
	RACE_SIGHT_BONUS,
	RACE_EXCLUSIVE_CLASSES,
	RACE_PASSIVES,
	isClassAvailableForRace,
	MANA_FLOOR,
} from './races';
import type { CharacterRace } from './types';

describe('Race Attributes', () => {
	it('all races sum to 54 attribute points', () => {
		for (const [name, race] of Object.entries(RACE_ATTRIBUTES)) {
			const sum = race.str + race.int + race.wil + race.agi + race.vit;
			expect(sum, `${name} should sum to 54`).toBe(54);
		}
	});

	it('elf has highest int', () => {
		expect(RACE_ATTRIBUTES.elf.int).toBeGreaterThan(RACE_ATTRIBUTES.dwarf.int);
		expect(RACE_ATTRIBUTES.elf.int).toBeGreaterThan(RACE_ATTRIBUTES.human.int);
	});

	it('dwarf has highest str and vit', () => {
		expect(RACE_ATTRIBUTES.dwarf.str).toBeGreaterThan(RACE_ATTRIBUTES.elf.str);
		expect(RACE_ATTRIBUTES.dwarf.str).toBeGreaterThan(RACE_ATTRIBUTES.human.str);
		expect(RACE_ATTRIBUTES.dwarf.vit).toBeGreaterThan(RACE_ATTRIBUTES.elf.vit);
		expect(RACE_ATTRIBUTES.dwarf.vit).toBeGreaterThan(RACE_ATTRIBUTES.human.vit);
	});

	it('human has balanced attributes', () => {
		const h = RACE_ATTRIBUTES.human;
		const spread = Math.max(h.str, h.int, h.wil, h.agi, h.vit) - Math.min(h.str, h.int, h.wil, h.agi, h.vit);
		// Human spread should be small (1 point difference)
		expect(spread).toBeLessThanOrEqual(1);
	});

	it('elf has highest mana modifier', () => {
		expect(RACE_ATTRIBUTES.elf.manaModifier).toBeGreaterThan(RACE_ATTRIBUTES.human.manaModifier);
		expect(RACE_ATTRIBUTES.elf.manaModifier).toBeGreaterThan(RACE_ATTRIBUTES.dwarf.manaModifier);
	});

	it('dwarf has lowest mana modifier', () => {
		expect(RACE_ATTRIBUTES.dwarf.manaModifier).toBeLessThan(RACE_ATTRIBUTES.human.manaModifier);
		expect(RACE_ATTRIBUTES.dwarf.manaModifier).toBeLessThan(RACE_ATTRIBUTES.elf.manaModifier);
	});
});

describe('Race Sight Bonuses', () => {
	it('elf has highest sight bonus', () => {
		expect(RACE_SIGHT_BONUS.elf).toBe(2);
	});

	it('dwarf has no sight bonus', () => {
		expect(RACE_SIGHT_BONUS.dwarf).toBe(0);
	});

	it('human has moderate sight bonus', () => {
		expect(RACE_SIGHT_BONUS.human).toBe(1);
	});

	it('all races have defined sight bonuses', () => {
		const races: CharacterRace[] = ['elf', 'dwarf', 'human'];
		for (const race of races) {
			expect(RACE_SIGHT_BONUS[race]).toBeDefined();
		}
	});
});

describe('Race Exclusive Classes', () => {
	it('elf exclusive class is primordial', () => {
		expect(RACE_EXCLUSIVE_CLASSES.elf).toBe('primordial');
	});

	it('dwarf exclusive class is runesmith', () => {
		expect(RACE_EXCLUSIVE_CLASSES.dwarf).toBe('runesmith');
	});

	it('human exclusive class is spellblade', () => {
		expect(RACE_EXCLUSIVE_CLASSES.human).toBe('spellblade');
	});
});

describe('isClassAvailableForRace', () => {
	it('standard classes available to all races', () => {
		const standardClasses = ['warrior', 'mage', 'rogue', 'ranger', 'cleric', 'paladin', 'necromancer', 'bard', 'adept'] as const;
		const races: CharacterRace[] = ['elf', 'dwarf', 'human'];
		for (const race of races) {
			for (const cls of standardClasses) {
				expect(isClassAvailableForRace(race, cls), `${cls} should be available for ${race}`).toBe(true);
			}
		}
	});

	it('primordial only available to elf', () => {
		expect(isClassAvailableForRace('elf', 'primordial')).toBe(true);
		expect(isClassAvailableForRace('dwarf', 'primordial')).toBe(false);
		expect(isClassAvailableForRace('human', 'primordial')).toBe(false);
	});

	it('runesmith only available to dwarf', () => {
		expect(isClassAvailableForRace('dwarf', 'runesmith')).toBe(true);
		expect(isClassAvailableForRace('elf', 'runesmith')).toBe(false);
		expect(isClassAvailableForRace('human', 'runesmith')).toBe(false);
	});

	it('spellblade only available to human', () => {
		expect(isClassAvailableForRace('human', 'spellblade')).toBe(true);
		expect(isClassAvailableForRace('elf', 'spellblade')).toBe(false);
		expect(isClassAvailableForRace('dwarf', 'spellblade')).toBe(false);
	});
});

describe('Race Passives', () => {
	it('elf has ley_sight passive', () => {
		expect(RACE_PASSIVES.elf.id).toBe('ley_sight');
		expect(RACE_PASSIVES.elf.description).toContain('Ley lines');
	});

	it('dwarf has runic_affinity passive', () => {
		expect(RACE_PASSIVES.dwarf.id).toBe('runic_affinity');
		expect(RACE_PASSIVES.dwarf.description).toContain('Rune');
	});

	it('human has second_wind passive', () => {
		expect(RACE_PASSIVES.human.id).toBe('second_wind');
		expect(RACE_PASSIVES.human.description).toContain('HP');
	});

	it('all races have passives', () => {
		const races: CharacterRace[] = ['elf', 'dwarf', 'human'];
		for (const race of races) {
			expect(RACE_PASSIVES[race]).toBeDefined();
			expect(RACE_PASSIVES[race].id).toBeTruthy();
			expect(RACE_PASSIVES[race].description).toBeTruthy();
		}
	});
});

describe('Mana Floor', () => {
	it('MANA_FLOOR is 5', () => {
		expect(MANA_FLOOR).toBe(5);
	});
});
