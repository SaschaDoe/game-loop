import { describe, it, expect } from 'vitest';
import { SKILL_DEFS, getSkill, getClassSkills, getClassBranches, canUnlock, unlockSkill, getSkillBonuses } from './skills';

describe('SKILL_DEFS', () => {
	it('defines 9 skills per class (3 branches x 3 tiers)', () => {
		expect(getClassSkills('warrior')).toHaveLength(9);
		expect(getClassSkills('rogue')).toHaveLength(9);
		expect(getClassSkills('mage')).toHaveLength(9);
	});

	it('each class has 3 branches', () => {
		expect(getClassBranches('warrior')).toHaveLength(3);
		expect(getClassBranches('rogue')).toHaveLength(3);
		expect(getClassBranches('mage')).toHaveLength(3);
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
