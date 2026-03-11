import { describe, it, expect } from 'vitest';
import { SKILL_DEFS, getSkill, getClassSkills, getClassBranches, canUnlock, unlockSkill, getSkillBonuses } from './skills';

describe('SKILL_DEFS', () => {
	it('defines 9 skills per class (3 branches x 3 tiers)', () => {
		expect(getClassSkills('warrior')).toHaveLength(9);
		expect(getClassSkills('rogue')).toHaveLength(9);
		expect(getClassSkills('mage')).toHaveLength(9);
		expect(getClassSkills('ranger')).toHaveLength(9);
		expect(getClassSkills('cleric')).toHaveLength(9);
		expect(getClassSkills('paladin')).toHaveLength(9);
		expect(getClassSkills('necromancer')).toHaveLength(9);
		expect(getClassSkills('bard')).toHaveLength(9);
	});

	it('each class has 3 branches', () => {
		expect(getClassBranches('warrior')).toHaveLength(3);
		expect(getClassBranches('rogue')).toHaveLength(3);
		expect(getClassBranches('mage')).toHaveLength(3);
		expect(getClassBranches('ranger')).toHaveLength(3);
		expect(getClassBranches('cleric')).toHaveLength(3);
		expect(getClassBranches('paladin')).toHaveLength(3);
		expect(getClassBranches('necromancer')).toHaveLength(3);
		expect(getClassBranches('bard')).toHaveLength(3);
	});

	it('all skill IDs are unique', () => {
		const ids = SKILL_DEFS.map((s) => s.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('tier 1 skills have no prerequisite', () => {
		const tier1 = SKILL_DEFS.filter((s) => s.tier === 1);
		for (const s of tier1) {
			expect(s.prerequisite).toBeNull();
		}
	});

	it('tier 2+ skills reference valid prerequisites', () => {
		const ids = new Set(SKILL_DEFS.map((s) => s.id));
		for (const s of SKILL_DEFS.filter((s) => s.tier > 1)) {
			expect(s.prerequisite).not.toBeNull();
			expect(ids.has(s.prerequisite!)).toBe(true);
		}
	});

	it('prerequisites are from the same branch and class', () => {
		for (const skill of SKILL_DEFS.filter((s) => s.prerequisite)) {
			const prereq = getSkill(skill.prerequisite!)!;
			expect(prereq.characterClass).toBe(skill.characterClass);
			expect(prereq.branch).toBe(skill.branch);
			expect(prereq.tier).toBe(skill.tier - 1);
		}
	});
});

describe('getSkill', () => {
	it('returns skill by id', () => {
		const skill = getSkill('w_arms_1');
		expect(skill).toBeDefined();
		expect(skill!.name).toBe('Power Strike');
	});

	it('returns undefined for unknown id', () => {
		expect(getSkill('nonexistent')).toBeUndefined();
	});
});

describe('canUnlock', () => {
	it('tier 1 skill with no prereqs can be unlocked', () => {
		expect(canUnlock('w_arms_1', [], 'warrior')).toBe(true);
	});

	it('tier 2 skill requires tier 1 unlocked', () => {
		expect(canUnlock('w_arms_2', [], 'warrior')).toBe(false);
		expect(canUnlock('w_arms_2', ['w_arms_1'], 'warrior')).toBe(true);
	});

	it('tier 3 skill requires tier 2 unlocked', () => {
		expect(canUnlock('w_arms_3', ['w_arms_1'], 'warrior')).toBe(false);
		expect(canUnlock('w_arms_3', ['w_arms_1', 'w_arms_2'], 'warrior')).toBe(true);
	});

	it('cannot unlock skill from another class', () => {
		expect(canUnlock('r_stealth_1', [], 'warrior')).toBe(false);
	});

	it('cannot unlock already unlocked skill', () => {
		expect(canUnlock('w_arms_1', ['w_arms_1'], 'warrior')).toBe(false);
	});

	it('returns false for unknown skill', () => {
		expect(canUnlock('nonexistent', [], 'warrior')).toBe(false);
	});
});

describe('unlockSkill', () => {
	it('succeeds with valid conditions', () => {
		const result = unlockSkill('w_arms_1', [], 1, 'warrior');
		expect(result.success).toBe(true);
		expect(result.message).toContain('Power Strike');
	});

	it('fails with no skill points', () => {
		const result = unlockSkill('w_arms_1', [], 0, 'warrior');
		expect(result.success).toBe(false);
		expect(result.message).toContain('No skill points');
	});

	it('fails for already unlocked skill', () => {
		const result = unlockSkill('w_arms_1', ['w_arms_1'], 1, 'warrior');
		expect(result.success).toBe(false);
		expect(result.message).toContain('already unlocked');
	});

	it('fails for missing prerequisite', () => {
		const result = unlockSkill('w_arms_2', [], 1, 'warrior');
		expect(result.success).toBe(false);
		expect(result.message).toContain('Prerequisite');
	});

	it('fails for wrong class', () => {
		const result = unlockSkill('r_stealth_1', [], 1, 'warrior');
		expect(result.success).toBe(false);
		expect(result.message).toContain('another class');
	});

	it('fails for unknown skill', () => {
		const result = unlockSkill('nonexistent', [], 1, 'warrior');
		expect(result.success).toBe(false);
		expect(result.message).toContain('Unknown');
	});
});

describe('getSkillBonuses', () => {
	it('returns empty bonuses for no skills', () => {
		const bonuses = getSkillBonuses([]);
		expect(bonuses.maxHp).toBeUndefined();
		expect(bonuses.attack).toBeUndefined();
	});

	it('returns bonuses for a single skill', () => {
		const bonuses = getSkillBonuses(['w_arms_1']);
		expect(bonuses.attack).toBe(2);
	});

	it('accumulates bonuses from multiple skills', () => {
		const bonuses = getSkillBonuses(['w_arms_1', 'w_arms_2']);
		expect(bonuses.attack).toBe(5); // 2 + 3
	});

	it('accumulates different bonus types', () => {
		const bonuses = getSkillBonuses(['w_arms_1', 'w_def_1']);
		expect(bonuses.attack).toBe(2);
		expect(bonuses.maxHp).toBe(5);
	});

	it('accumulates xpMultiplier', () => {
		const bonuses = getSkillBonuses(['m_know_2', 'm_know_3']);
		expect(bonuses.xpMultiplier).toBeCloseTo(0.30);
	});

	it('ignores unknown skill IDs', () => {
		const bonuses = getSkillBonuses(['nonexistent', 'w_arms_1']);
		expect(bonuses.attack).toBe(2);
	});

	it('full warrior arms branch gives +10 ATK', () => {
		const bonuses = getSkillBonuses(['w_arms_1', 'w_arms_2', 'w_arms_3']);
		expect(bonuses.attack).toBe(10);
	});
});

describe('Ranger skills', () => {
	it('has branches Marksman, Survivalist, Beastmaster', () => {
		const branches = getClassBranches('ranger');
		expect(branches).toContain('Marksman');
		expect(branches).toContain('Survivalist');
		expect(branches).toContain('Beastmaster');
	});

	it('getClassSkills returns 9 ranger skills', () => {
		const skills = getClassSkills('ranger');
		expect(skills).toHaveLength(9);
		for (const s of skills) {
			expect(s.characterClass).toBe('ranger');
		}
	});

	it('tier 2 skills have correct prerequisites', () => {
		expect(canUnlock('rn_mark_2', [], 'ranger')).toBe(false);
		expect(canUnlock('rn_mark_2', ['rn_mark_1'], 'ranger')).toBe(true);
		expect(canUnlock('rn_surv_2', ['rn_surv_1'], 'ranger')).toBe(true);
		expect(canUnlock('rn_beast_2', ['rn_beast_1'], 'ranger')).toBe(true);
	});

	it('tier 3 skills require tier 2', () => {
		expect(canUnlock('rn_mark_3', ['rn_mark_1'], 'ranger')).toBe(false);
		expect(canUnlock('rn_mark_3', ['rn_mark_1', 'rn_mark_2'], 'ranger')).toBe(true);
	});

	it('full marksman branch accumulates bonuses', () => {
		const bonuses = getSkillBonuses(['rn_mark_1', 'rn_mark_2', 'rn_mark_3']);
		expect(bonuses.attack).toBe(9); // 2 + 3 + 4
		expect(bonuses.sightRadius).toBe(2);
	});
});

describe('Cleric skills', () => {
	it('has branches Zealot, Healer, Oracle', () => {
		const branches = getClassBranches('cleric');
		expect(branches).toContain('Zealot');
		expect(branches).toContain('Healer');
		expect(branches).toContain('Oracle');
	});

	it('getClassSkills returns 9 cleric skills', () => {
		const skills = getClassSkills('cleric');
		expect(skills).toHaveLength(9);
		for (const s of skills) {
			expect(s.characterClass).toBe('cleric');
		}
	});

	it('tier 2 skills have correct prerequisites', () => {
		expect(canUnlock('c_zeal_2', ['c_zeal_1'], 'cleric')).toBe(true);
		expect(canUnlock('c_heal_2', ['c_heal_1'], 'cleric')).toBe(true);
		expect(canUnlock('c_orac_2', ['c_orac_1'], 'cleric')).toBe(true);
	});

	it('full healer branch gives massive HP and block', () => {
		const bonuses = getSkillBonuses(['c_heal_1', 'c_heal_2', 'c_heal_3']);
		expect(bonuses.maxHp).toBe(33); // 8 + 10 + 15
		expect(bonuses.blockReduction).toBe(3); // 1 + 2
	});

	it('full oracle branch gives sight and XP', () => {
		const bonuses = getSkillBonuses(['c_orac_1', 'c_orac_2', 'c_orac_3']);
		expect(bonuses.sightRadius).toBe(5); // 2 + 1 + 2
		expect(bonuses.xpMultiplier).toBeCloseTo(0.30); // 0.10 + 0.20
	});
});

describe('Paladin skills', () => {
	it('has branches Bulwark, Crusader, Devotion', () => {
		const branches = getClassBranches('paladin');
		expect(branches).toContain('Bulwark');
		expect(branches).toContain('Crusader');
		expect(branches).toContain('Devotion');
	});

	it('getClassSkills returns 9 paladin skills', () => {
		const skills = getClassSkills('paladin');
		expect(skills).toHaveLength(9);
		for (const s of skills) {
			expect(s.characterClass).toBe('paladin');
		}
	});

	it('tier 2 skills have correct prerequisites', () => {
		expect(canUnlock('p_bulk_2', ['p_bulk_1'], 'paladin')).toBe(true);
		expect(canUnlock('p_crus_2', ['p_crus_1'], 'paladin')).toBe(true);
		expect(canUnlock('p_devo_2', ['p_devo_1'], 'paladin')).toBe(true);
	});

	it('full bulwark branch gives massive HP and block', () => {
		const bonuses = getSkillBonuses(['p_bulk_1', 'p_bulk_2', 'p_bulk_3']);
		expect(bonuses.maxHp).toBe(33); // 8 + 10 + 15
		expect(bonuses.blockReduction).toBe(5); // 2 + 3
	});

	it('cannot unlock paladin skills as another class', () => {
		expect(canUnlock('p_bulk_1', [], 'warrior')).toBe(false);
		expect(canUnlock('p_crus_1', [], 'mage')).toBe(false);
	});
});

describe('Necromancer skills', () => {
	it('has branches Death Magic, Dark Pact, Undeath', () => {
		const branches = getClassBranches('necromancer');
		expect(branches).toContain('Death Magic');
		expect(branches).toContain('Dark Pact');
		expect(branches).toContain('Undeath');
	});

	it('getClassSkills returns 9 necromancer skills', () => {
		const skills = getClassSkills('necromancer');
		expect(skills).toHaveLength(9);
		for (const s of skills) {
			expect(s.characterClass).toBe('necromancer');
		}
	});

	it('tier 2 skills have correct prerequisites', () => {
		expect(canUnlock('n_death_2', ['n_death_1'], 'necromancer')).toBe(true);
		expect(canUnlock('n_pact_2', ['n_pact_1'], 'necromancer')).toBe(true);
		expect(canUnlock('n_und_2', ['n_und_1'], 'necromancer')).toBe(true);
	});

	it('full death magic branch gives +13 ATK', () => {
		const bonuses = getSkillBonuses(['n_death_1', 'n_death_2', 'n_death_3']);
		expect(bonuses.attack).toBe(13); // 3 + 4 + 6
	});

	it('full undeath branch gives HP, XP, and sight', () => {
		const bonuses = getSkillBonuses(['n_und_1', 'n_und_2', 'n_und_3']);
		expect(bonuses.maxHp).toBe(30); // 5 + 10 + 15
		expect(bonuses.xpMultiplier).toBeCloseTo(0.10);
		expect(bonuses.sightRadius).toBe(1);
	});
});

describe('Bard skills', () => {
	it('has branches Warchanter, Spellsinger, Lorekeeper', () => {
		const branches = getClassBranches('bard');
		expect(branches).toContain('Warchanter');
		expect(branches).toContain('Spellsinger');
		expect(branches).toContain('Lorekeeper');
	});

	it('getClassSkills returns 9 bard skills', () => {
		const skills = getClassSkills('bard');
		expect(skills).toHaveLength(9);
		for (const s of skills) {
			expect(s.characterClass).toBe('bard');
		}
	});

	it('tier 2 skills have correct prerequisites', () => {
		expect(canUnlock('b_war_2', ['b_war_1'], 'bard')).toBe(true);
		expect(canUnlock('b_spell_2', ['b_spell_1'], 'bard')).toBe(true);
		expect(canUnlock('b_lore_2', ['b_lore_1'], 'bard')).toBe(true);
	});

	it('full warchanter branch gives ATK and HP', () => {
		const bonuses = getSkillBonuses(['b_war_1', 'b_war_2', 'b_war_3']);
		expect(bonuses.attack).toBe(9); // 2 + 3 + 4
		expect(bonuses.maxHp).toBe(15); // 5 + 10
	});

	it('full lorekeeper branch gives sight and XP', () => {
		const bonuses = getSkillBonuses(['b_lore_1', 'b_lore_2', 'b_lore_3']);
		expect(bonuses.sightRadius).toBe(5); // 1 + 2 + 2
		expect(bonuses.xpMultiplier).toBeCloseTo(0.30); // 0.10 + 0.20
		expect(bonuses.maxHp).toBe(5);
	});

	it('cannot unlock bard skills as another class', () => {
		expect(canUnlock('b_war_1', [], 'warrior')).toBe(false);
		expect(canUnlock('b_spell_1', [], 'necromancer')).toBe(false);
	});
});

describe('Primordial skills', () => {
	it('has 9 skills', () => {
		expect(getClassSkills('primordial')).toHaveLength(9);
	});

	it('has 3 branches', () => {
		const branches = getClassBranches('primordial');
		expect(branches).toHaveLength(3);
		expect(branches).toContain('Ley Channeling');
		expect(branches).toContain('Verdant Communion');
		expect(branches).toContain('Veil Walking');
	});

	it('each branch has tiers 1-3', () => {
		const skills = getClassSkills('primordial');
		for (const branch of getClassBranches('primordial')) {
			const branchSkills = skills.filter(s => s.branch === branch);
			expect(branchSkills).toHaveLength(3);
			expect(branchSkills.map(s => s.tier).sort()).toEqual([1, 2, 3]);
		}
	});

	it('tier 2 skills have correct prerequisites', () => {
		expect(canUnlock('pr_ley_2', ['pr_ley_1'], 'primordial')).toBe(true);
		expect(canUnlock('pr_verd_2', ['pr_verd_1'], 'primordial')).toBe(true);
		expect(canUnlock('pr_veil_2', ['pr_veil_1'], 'primordial')).toBe(true);
	});

	it('tier 3 skills require tier 2', () => {
		expect(canUnlock('pr_ley_3', ['pr_ley_1'], 'primordial')).toBe(false);
		expect(canUnlock('pr_ley_3', ['pr_ley_1', 'pr_ley_2'], 'primordial')).toBe(true);
	});
});

describe('Runesmith skills', () => {
	it('has 9 skills', () => {
		expect(getClassSkills('runesmith')).toHaveLength(9);
	});

	it('has 3 branches', () => {
		const branches = getClassBranches('runesmith');
		expect(branches).toHaveLength(3);
		expect(branches).toContain('Runecraft');
		expect(branches).toContain('Stonebinding');
		expect(branches).toContain('Forgemastery');
	});

	it('each branch has tiers 1-3', () => {
		const skills = getClassSkills('runesmith');
		for (const branch of getClassBranches('runesmith')) {
			const branchSkills = skills.filter(s => s.branch === branch);
			expect(branchSkills).toHaveLength(3);
			expect(branchSkills.map(s => s.tier).sort()).toEqual([1, 2, 3]);
		}
	});

	it('tier 2 skills have correct prerequisites', () => {
		expect(canUnlock('rs_rune_2', ['rs_rune_1'], 'runesmith')).toBe(true);
		expect(canUnlock('rs_stone_2', ['rs_stone_1'], 'runesmith')).toBe(true);
		expect(canUnlock('rs_forge_2', ['rs_forge_1'], 'runesmith')).toBe(true);
	});

	it('tier 3 skills require tier 2', () => {
		expect(canUnlock('rs_rune_3', ['rs_rune_1'], 'runesmith')).toBe(false);
		expect(canUnlock('rs_rune_3', ['rs_rune_1', 'rs_rune_2'], 'runesmith')).toBe(true);
	});
});

describe('Spellblade skills', () => {
	it('has 9 skills', () => {
		expect(getClassSkills('spellblade')).toHaveLength(9);
	});

	it('has 3 branches', () => {
		const branches = getClassBranches('spellblade');
		expect(branches).toHaveLength(3);
		expect(branches).toContain('Battle Channeling');
		expect(branches).toContain('Aegis Arts');
		expect(branches).toContain('War Casting');
	});

	it('each branch has tiers 1-3', () => {
		const skills = getClassSkills('spellblade');
		for (const branch of getClassBranches('spellblade')) {
			const branchSkills = skills.filter(s => s.branch === branch);
			expect(branchSkills).toHaveLength(3);
			expect(branchSkills.map(s => s.tier).sort()).toEqual([1, 2, 3]);
		}
	});

	it('tier 2 skills have correct prerequisites', () => {
		expect(canUnlock('sb_battle_2', ['sb_battle_1'], 'spellblade')).toBe(true);
		expect(canUnlock('sb_aegis_2', ['sb_aegis_1'], 'spellblade')).toBe(true);
		expect(canUnlock('sb_war_2', ['sb_war_1'], 'spellblade')).toBe(true);
	});

	it('tier 3 skills require tier 2', () => {
		expect(canUnlock('sb_battle_3', ['sb_battle_1'], 'spellblade')).toBe(false);
		expect(canUnlock('sb_battle_3', ['sb_battle_1', 'sb_battle_2'], 'spellblade')).toBe(true);
	});
});
