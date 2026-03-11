import { describe, it, expect } from 'vitest';
import {
	RACE_ATTRIBUTES,
	RACE_SIGHT_BONUS,
	RACE_EXCLUSIVE_CLASSES,
	RACE_PASSIVES,
	isClassAvailableForRace,
	MANA_FLOOR,
	getRaceFlavorLine,
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

describe('getRaceFlavorLine', () => {
	it('returns null for same-race interactions', () => {
		expect(getRaceFlavorLine('elf', 'elf', -5)).toBeNull();
		expect(getRaceFlavorLine('dwarf', 'dwarf', 5)).toBeNull();
		expect(getRaceFlavorLine('human', 'human', 3)).toBeNull();
	});

	it('returns null for neutral attitude (-1 to +1)', () => {
		expect(getRaceFlavorLine('elf', 'dwarf', 0)).toBeNull();
		expect(getRaceFlavorLine('elf', 'dwarf', 1)).toBeNull();
		expect(getRaceFlavorLine('elf', 'dwarf', -1)).toBeNull();
	});

	it('returns a string for hostile attitude', () => {
		// Run multiple times to handle randomness
		let found = false;
		for (let i = 0; i < 20; i++) {
			const line = getRaceFlavorLine('elf', 'dwarf', -5);
			if (line !== null) {
				expect(typeof line).toBe('string');
				expect(line.length).toBeGreaterThan(0);
				found = true;
				break;
			}
		}
		expect(found).toBe(true);
	});

	it('returns a string for warm attitude (+2 to +3)', () => {
		let found = false;
		for (let i = 0; i < 20; i++) {
			const line = getRaceFlavorLine('dwarf', 'elf', 3);
			if (line !== null) {
				expect(typeof line).toBe('string');
				expect(line.length).toBeGreaterThan(0);
				found = true;
				break;
			}
		}
		expect(found).toBe(true);
	});

	it('returns a string for kinship attitude (+4 to +5)', () => {
		let found = false;
		for (let i = 0; i < 20; i++) {
			const line = getRaceFlavorLine('human', 'elf', 5);
			if (line !== null) {
				expect(typeof line).toBe('string');
				expect(line.length).toBeGreaterThan(0);
				found = true;
				break;
			}
		}
		expect(found).toBe(true);
	});

	it('returns a string for cold attitude (-2 to -3)', () => {
		let found = false;
		for (let i = 0; i < 20; i++) {
			const line = getRaceFlavorLine('human', 'dwarf', -2);
			if (line !== null) {
				expect(typeof line).toBe('string');
				expect(line.length).toBeGreaterThan(0);
				found = true;
				break;
			}
		}
		expect(found).toBe(true);
	});

	it('may return innuendo for female human NPC with attitude >= 2 toward non-human', () => {
		// Run many times — 30% chance each time
		let innuendoFound = false;
		for (let i = 0; i < 100; i++) {
			const line = getRaceFlavorLine('human', 'elf', 3, 'female');
			if (line !== null && line.includes('gifted') || line?.includes('cooking') || line?.includes('Tall')) {
				innuendoFound = true;
				break;
			}
		}
		// With 100 attempts at 30% chance, probability of never getting one is 0.7^100 ≈ 0
		expect(innuendoFound).toBe(true);
	});

	it('does not return innuendo for male human NPC', () => {
		// Male NPCs should only return regular flavor lines
		for (let i = 0; i < 50; i++) {
			const line = getRaceFlavorLine('human', 'elf', 3, 'male');
			if (line !== null) {
				// Regular warm lines for human→elf don't contain innuendo keywords
				expect(line).not.toContain('gifted');
				expect(line).not.toContain('cooking');
			}
		}
	});

	it('all race pairs have flavor lines for non-neutral tiers', () => {
		const races: CharacterRace[] = ['elf', 'dwarf', 'human'];
		for (const npcRace of races) {
			for (const playerRace of races) {
				if (npcRace === playerRace) continue;
				// Check hostile tier returns lines
				let hostileFound = false;
				for (let i = 0; i < 20; i++) {
					if (getRaceFlavorLine(npcRace, playerRace, -5) !== null) {
						hostileFound = true;
						break;
					}
				}
				expect(hostileFound, `${npcRace} → ${playerRace} hostile`).toBe(true);
			}
		}
	});
});
