import type { CharacterClass } from './types';

export interface SkillDef {
	id: string;
	name: string;
	characterClass: CharacterClass;
	branch: string;
	tier: 1 | 2 | 3;
	prerequisite: string | null;
	description: string;
	bonus: SkillBonus;
}

export interface SkillBonus {
	maxHp?: number;
	attack?: number;
	dodgeChance?: number;
	blockReduction?: number;
	sightRadius?: number;
	xpMultiplier?: number;
}

export const SKILL_DEFS: SkillDef[] = [
	// Warrior — Arms
	{ id: 'w_arms_1', name: 'Power Strike', characterClass: 'warrior', branch: 'Arms', tier: 1, prerequisite: null, description: '+2 ATK', bonus: { attack: 2 } },
	{ id: 'w_arms_2', name: 'Brutal Force', characterClass: 'warrior', branch: 'Arms', tier: 2, prerequisite: 'w_arms_1', description: '+3 ATK', bonus: { attack: 3 } },
	{ id: 'w_arms_3', name: 'Executioner', characterClass: 'warrior', branch: 'Arms', tier: 3, prerequisite: 'w_arms_2', description: '+5 ATK', bonus: { attack: 5 } },
	// Warrior — Defense
	{ id: 'w_def_1', name: 'Tough Skin', characterClass: 'warrior', branch: 'Defense', tier: 1, prerequisite: null, description: '+5 HP', bonus: { maxHp: 5 } },
	{ id: 'w_def_2', name: 'Iron Wall', characterClass: 'warrior', branch: 'Defense', tier: 2, prerequisite: 'w_def_1', description: '+1 Block, +5 HP', bonus: { blockReduction: 1, maxHp: 5 } },
	{ id: 'w_def_3', name: 'Unstoppable', characterClass: 'warrior', branch: 'Defense', tier: 3, prerequisite: 'w_def_2', description: '+2 Block, +10 HP', bonus: { blockReduction: 2, maxHp: 10 } },
	// Warrior — Tactics
	{ id: 'w_tac_1', name: 'Scout', characterClass: 'warrior', branch: 'Tactics', tier: 1, prerequisite: null, description: '+1 Sight', bonus: { sightRadius: 1 } },
	{ id: 'w_tac_2', name: 'Veteran', characterClass: 'warrior', branch: 'Tactics', tier: 2, prerequisite: 'w_tac_1', description: '+10% XP', bonus: { xpMultiplier: 0.10 } },
	{ id: 'w_tac_3', name: 'Warlord', characterClass: 'warrior', branch: 'Tactics', tier: 3, prerequisite: 'w_tac_2', description: '+3 ATK, +5 HP', bonus: { attack: 3, maxHp: 5 } },

	// Rogue — Stealth
	{ id: 'r_stealth_1', name: 'Shadow Step', characterClass: 'rogue', branch: 'Stealth', tier: 1, prerequisite: null, description: '+5% Dodge', bonus: { dodgeChance: 0.05 } },
	{ id: 'r_stealth_2', name: 'Vanish', characterClass: 'rogue', branch: 'Stealth', tier: 2, prerequisite: 'r_stealth_1', description: '+10% Dodge', bonus: { dodgeChance: 0.10 } },
	{ id: 'r_stealth_3', name: 'Ghost', characterClass: 'rogue', branch: 'Stealth', tier: 3, prerequisite: 'r_stealth_2', description: '+15% Dodge', bonus: { dodgeChance: 0.15 } },
	// Rogue — Combat
	{ id: 'r_combat_1', name: 'Backstab', characterClass: 'rogue', branch: 'Combat', tier: 1, prerequisite: null, description: '+2 ATK', bonus: { attack: 2 } },
	{ id: 'r_combat_2', name: 'Assassinate', characterClass: 'rogue', branch: 'Combat', tier: 2, prerequisite: 'r_combat_1', description: '+3 ATK', bonus: { attack: 3 } },
	{ id: 'r_combat_3', name: 'Death Dealer', characterClass: 'rogue', branch: 'Combat', tier: 3, prerequisite: 'r_combat_2', description: '+5 ATK', bonus: { attack: 5 } },
	// Rogue — Survival
	{ id: 'r_surv_1', name: 'Keen Eyes', characterClass: 'rogue', branch: 'Survival', tier: 1, prerequisite: null, description: '+1 Sight', bonus: { sightRadius: 1 } },
	{ id: 'r_surv_2', name: 'Resilience', characterClass: 'rogue', branch: 'Survival', tier: 2, prerequisite: 'r_surv_1', description: '+5 HP', bonus: { maxHp: 5 } },
	{ id: 'r_surv_3', name: 'Survivor', characterClass: 'rogue', branch: 'Survival', tier: 3, prerequisite: 'r_surv_2', description: '+10% XP, +5 HP', bonus: { xpMultiplier: 0.10, maxHp: 5 } },

	// Mage — Destruction
	{ id: 'm_dest_1', name: 'Arcane Bolt', characterClass: 'mage', branch: 'Destruction', tier: 1, prerequisite: null, description: '+2 ATK', bonus: { attack: 2 } },
	{ id: 'm_dest_2', name: 'Fireball Mastery', characterClass: 'mage', branch: 'Destruction', tier: 2, prerequisite: 'm_dest_1', description: '+3 ATK', bonus: { attack: 3 } },
	{ id: 'm_dest_3', name: 'Archmage', characterClass: 'mage', branch: 'Destruction', tier: 3, prerequisite: 'm_dest_2', description: '+5 ATK', bonus: { attack: 5 } },
	// Mage — Protection
	{ id: 'm_prot_1', name: 'Mana Shield', characterClass: 'mage', branch: 'Protection', tier: 1, prerequisite: null, description: '+5 HP', bonus: { maxHp: 5 } },
	{ id: 'm_prot_2', name: 'Barrier', characterClass: 'mage', branch: 'Protection', tier: 2, prerequisite: 'm_prot_1', description: '+5% Dodge, +5 HP', bonus: { dodgeChance: 0.05, maxHp: 5 } },
	{ id: 'm_prot_3', name: 'Invocation', characterClass: 'mage', branch: 'Protection', tier: 3, prerequisite: 'm_prot_2', description: '+10 HP, +1 Block', bonus: { maxHp: 10, blockReduction: 1 } },
	// Mage — Knowledge
	{ id: 'm_know_1', name: 'Keen Mind', characterClass: 'mage', branch: 'Knowledge', tier: 1, prerequisite: null, description: '+1 Sight', bonus: { sightRadius: 1 } },
	{ id: 'm_know_2', name: 'Sage', characterClass: 'mage', branch: 'Knowledge', tier: 2, prerequisite: 'm_know_1', description: '+10% XP', bonus: { xpMultiplier: 0.10 } },
	{ id: 'm_know_3', name: 'Omniscience', characterClass: 'mage', branch: 'Knowledge', tier: 3, prerequisite: 'm_know_2', description: '+20% XP, +2 Sight', bonus: { xpMultiplier: 0.20, sightRadius: 2 } },
];

const SKILL_BY_ID = new Map(SKILL_DEFS.map((s) => [s.id, s]));

export function getSkill(id: string): SkillDef | undefined {
	return SKILL_BY_ID.get(id);
}

export function getClassSkills(characterClass: CharacterClass): SkillDef[] {
	return SKILL_DEFS.filter((s) => s.characterClass === characterClass);
}

export function getClassBranches(characterClass: CharacterClass): string[] {
	const branches = new Set(getClassSkills(characterClass).map((s) => s.branch));
	return [...branches];
}

export function canUnlock(skillId: string, unlockedSkills: string[], characterClass: CharacterClass): boolean {
	const skill = SKILL_BY_ID.get(skillId);
	if (!skill) return false;
	if (skill.characterClass !== characterClass) return false;
	if (unlockedSkills.includes(skillId)) return false;
	if (skill.prerequisite && !unlockedSkills.includes(skill.prerequisite)) return false;
	return true;
}

export interface UnlockResult {
	success: boolean;
	message: string;
}

export function unlockSkill(skillId: string, unlockedSkills: string[], skillPoints: number, characterClass: CharacterClass): UnlockResult {
	if (skillPoints <= 0) {
		return { success: false, message: 'No skill points available.' };
	}
	if (!canUnlock(skillId, unlockedSkills, characterClass)) {
		const skill = SKILL_BY_ID.get(skillId);
		if (!skill) return { success: false, message: 'Unknown skill.' };
		if (unlockedSkills.includes(skillId)) return { success: false, message: `${skill.name} is already unlocked.` };
		if (skill.characterClass !== characterClass) return { success: false, message: 'That skill belongs to another class.' };
		return { success: false, message: `Prerequisite not met for ${skill.name}.` };
	}
	const skill = SKILL_BY_ID.get(skillId)!;
	return { success: true, message: `Unlocked ${skill.name}: ${skill.description}` };
}

export function getSkillBonuses(unlockedSkills: string[]): SkillBonus {
	const totals: SkillBonus = {};
	for (const id of unlockedSkills) {
		const skill = SKILL_BY_ID.get(id);
		if (!skill) continue;
		const b = skill.bonus;
		if (b.maxHp) totals.maxHp = (totals.maxHp ?? 0) + b.maxHp;
		if (b.attack) totals.attack = (totals.attack ?? 0) + b.attack;
		if (b.dodgeChance) totals.dodgeChance = (totals.dodgeChance ?? 0) + b.dodgeChance;
		if (b.blockReduction) totals.blockReduction = (totals.blockReduction ?? 0) + b.blockReduction;
		if (b.sightRadius) totals.sightRadius = (totals.sightRadius ?? 0) + b.sightRadius;
		if (b.xpMultiplier) totals.xpMultiplier = (totals.xpMultiplier ?? 0) + b.xpMultiplier;
	}
	return totals;
}
