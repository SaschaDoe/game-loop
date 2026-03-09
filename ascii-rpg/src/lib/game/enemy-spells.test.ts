import { describe, it, expect } from 'vitest';
import { MONSTER_DEFS, getMonsterDefByName } from './monsters';
import { SPELL_CATALOG } from './spells';

describe('Enemy Spellcasters', () => {
	it('has 5 spellcaster monster definitions', () => {
		const casters = MONSTER_DEFS.filter(m => m.isSpellcaster);
		expect(casters.length).toBe(5);
	});

	it('all spellcaster spell IDs exist in catalog', () => {
		const casters = MONSTER_DEFS.filter(m => m.isSpellcaster);
		for (const m of casters) {
			for (const s of m.spells!) {
				expect(SPELL_CATALOG[s.spellId], `${m.name} references missing spell ${s.spellId}`).toBeDefined();
			}
		}
	});

	it('getMonsterDefByName finds spellcasters', () => {
		expect(getMonsterDefByName('Frost Imp')).toBeDefined();
		expect(getMonsterDefByName('Fire Mage')).toBeDefined();
		expect(getMonsterDefByName('Void Cultist')).toBeDefined();
	});

	it('non-spellcaster monsters have no spells', () => {
		const rat = getMonsterDefByName('Rat');
		expect(rat).toBeDefined();
		expect(rat!.isSpellcaster).toBeFalsy();
	});
});
