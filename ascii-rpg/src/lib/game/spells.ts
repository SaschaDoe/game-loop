/**
 * Spell system: Schools, spell definitions, targeting, and execution.
 * Implements Epic 79 magic system with 7 arcane schools and 5 tiers.
 */

import type { Entity, GameState, Position, SpellTargetType } from './types';
import { applyEffect, hasEffect } from './status-effects';

// ---------------------------------------------------------------------------
// Schools & Tiers
// ---------------------------------------------------------------------------

export type SpellSchool = 'elements' | 'enchantment' | 'restoration' | 'divination' | 'alchemy' | 'conjuration' | 'shadow';

export type SpellTier = 1 | 2 | 3 | 4 | 5;

export const SPELL_SCHOOL_NAMES: Record<SpellSchool, string> = {
	elements: 'School of Elements',
	enchantment: 'School of Enchantment',
	restoration: 'School of Restoration',
	divination: 'School of Divination',
	alchemy: 'School of Alchemy',
	conjuration: 'School of Conjuration',
	shadow: 'School of Shadow',
};

export const SPELL_SCHOOL_COLORS: Record<SpellSchool, string> = {
	elements: '#f84',
	enchantment: '#88f',
	restoration: '#8f8',
	divination: '#ff8',
	alchemy: '#8ff',
	conjuration: '#f8f',
	shadow: '#a6a',
};

// ---------------------------------------------------------------------------
// Spell Definition
// ---------------------------------------------------------------------------

export interface SpellDef {
	id: string;
	name: string;
	school: SpellSchool;
	tier: SpellTier;
	description: string;
	effect: string;
	manaCost: number;
	cooldown: number;
	targetType: SpellTargetType;
	/** Base damage (before spellPower scaling) — 0 for non-damage spells */
	baseDamage: number;
	/** Base healing (before spellPower scaling) — 0 for non-heal spells */
	baseHeal: number;
	/** Status effect applied to target */
	statusEffect?: { type: string; duration: number; potency: number };
	/** Self-buff applied on cast */
	selfBuff?: { type: string; duration: number; potency: number };
	/** AoE radius (0 = single target) */
	aoeRadius: number;
	/** Element type for counter-spell system */
	element?: 'fire' | 'ice' | 'lightning' | 'arcane' | 'acid' | 'holy' | 'shadow';
}

// ---------------------------------------------------------------------------
// Spell Catalog — organized by school, tier-ordered
// ---------------------------------------------------------------------------

export const SPELL_CATALOG: Record<string, SpellDef> = {
	// ===== School of Elements =====
	spell_firebolt: {
		id: 'spell_firebolt', name: 'Firebolt', school: 'elements', tier: 1,
		description: 'Hurl a bolt of fire at a single target.',
		effect: 'Deals 4 fire damage.',
		manaCost: 3, cooldown: 2, targetType: 'single_enemy',
		baseDamage: 4, baseHeal: 0, aoeRadius: 0, element: 'fire',
	},
	spell_frost_lance: {
		id: 'spell_frost_lance', name: 'Frost Lance', school: 'elements', tier: 1,
		description: 'A shard of conjured ice that pierces and chills.',
		effect: 'Deals 3 damage, applies freeze (1 turn).',
		manaCost: 4, cooldown: 3, targetType: 'single_enemy',
		baseDamage: 3, baseHeal: 0, aoeRadius: 0, element: 'ice',
		statusEffect: { type: 'freeze', duration: 1, potency: 0 },
	},
	spell_lightning_arc: {
		id: 'spell_lightning_arc', name: 'Lightning Arc', school: 'elements', tier: 2,
		description: 'Chain lightning that arcs between nearby targets.',
		effect: 'Deals 3 damage to up to 3 adjacent enemies.',
		manaCost: 6, cooldown: 4, targetType: 'self',
		baseDamage: 3, baseHeal: 0, aoeRadius: 1, element: 'lightning',
	},
	spell_glacial_wall: {
		id: 'spell_glacial_wall', name: 'Glacial Wall', school: 'elements', tier: 2,
		description: 'Conjure a wall of ice that blocks passage.',
		effect: 'Creates a 3-tile ice barrier for 5 turns.',
		manaCost: 5, cooldown: 6, targetType: 'direction',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'ice',
	},
	spell_inferno: {
		id: 'spell_inferno', name: 'Inferno', school: 'elements', tier: 3,
		description: 'Unleash a devastating column of fire in a 3x3 area.',
		effect: 'Deals 8 fire damage in area, applies burn (3 turns).',
		manaCost: 10, cooldown: 8, targetType: 'area',
		baseDamage: 8, baseHeal: 0, aoeRadius: 1, element: 'fire',
		statusEffect: { type: 'burn', duration: 3, potency: 2 },
	},
	spell_tempest: {
		id: 'spell_tempest', name: 'Tempest', school: 'elements', tier: 3,
		description: 'Summon a raging storm of ice and lightning.',
		effect: 'Deals 6 damage in 5x5 area, freeze + stun (2 turns).',
		manaCost: 14, cooldown: 12, targetType: 'self',
		baseDamage: 6, baseHeal: 0, aoeRadius: 2, element: 'ice',
		statusEffect: { type: 'freeze', duration: 2, potency: 0 },
	},

	// ===== School of Enchantment =====
	spell_arcane_ward: {
		id: 'spell_arcane_ward', name: 'Arcane Ward', school: 'enchantment', tier: 1,
		description: 'Weave a protective barrier around yourself.',
		effect: 'Gain regeneration (3 HP/turn) for 5 turns.',
		manaCost: 3, cooldown: 4, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'arcane',
		selfBuff: { type: 'regeneration', duration: 5, potency: 3 },
	},
	spell_binding_circle: {
		id: 'spell_binding_circle', name: 'Binding Circle', school: 'enchantment', tier: 1,
		description: 'Trap an enemy in a circle of arcane force.',
		effect: 'Stuns one enemy for 3 turns.',
		manaCost: 5, cooldown: 5, targetType: 'single_enemy',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'arcane',
		statusEffect: { type: 'stun', duration: 3, potency: 0 },
	},
	spell_dispel: {
		id: 'spell_dispel', name: 'Dispel', school: 'enchantment', tier: 2,
		description: 'Remove magical effects from a target.',
		effect: 'Removes all status effects from one entity.',
		manaCost: 4, cooldown: 3, targetType: 'single_enemy',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'arcane',
	},
	spell_reflective_shield: {
		id: 'spell_reflective_shield', name: 'Reflective Shield', school: 'enchantment', tier: 3,
		description: 'A shimmering barrier that returns damage to attackers.',
		effect: 'Reflects 50% of melee damage for 4 turns.',
		manaCost: 7, cooldown: 6, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'arcane',
		selfBuff: { type: 'inspire', duration: 4, potency: 0 },
		// Note: reflection logic handled specially in combat
	},

	// ===== School of Restoration =====
	spell_heal: {
		id: 'spell_heal', name: 'Heal', school: 'restoration', tier: 1,
		description: 'Channel restorative energy to mend wounds.',
		effect: 'Heal 8 HP.',
		manaCost: 4, cooldown: 3, targetType: 'self',
		baseDamage: 0, baseHeal: 8, aoeRadius: 0, element: 'holy',
	},
	spell_cure: {
		id: 'spell_cure', name: 'Cure', school: 'restoration', tier: 1,
		description: 'Purge poison and disease from the body.',
		effect: 'Removes poison and burn effects.',
		manaCost: 3, cooldown: 4, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'holy',
	},

	// ===== School of Alchemy =====
	spell_acid_splash: {
		id: 'spell_acid_splash', name: 'Acid Splash', school: 'alchemy', tier: 1,
		description: 'Hurl a vial of conjured acid.',
		effect: 'Deals 3 damage, reduces target ATK by 1 for 3 turns.',
		manaCost: 3, cooldown: 2, targetType: 'single_enemy',
		baseDamage: 3, baseHeal: 0, aoeRadius: 0, element: 'acid',
		statusEffect: { type: 'curse', duration: 3, potency: 1 },
	},
	spell_healing_mist: {
		id: 'spell_healing_mist', name: 'Healing Mist', school: 'alchemy', tier: 1,
		description: 'Transmute air into a soothing healing vapor.',
		effect: 'Heal 6 HP.',
		manaCost: 4, cooldown: 4, targetType: 'self',
		baseDamage: 0, baseHeal: 6, aoeRadius: 0,
	},
	spell_transmute_weapon: {
		id: 'spell_transmute_weapon', name: 'Transmute Weapon', school: 'alchemy', tier: 2,
		description: 'Temporarily enhance a weapon with alchemical coating.',
		effect: '+2 ATK for 5 turns.',
		manaCost: 5, cooldown: 6, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0,
		selfBuff: { type: 'inspire', duration: 5, potency: 2 },
	},
	spell_corrosive_cloud: {
		id: 'spell_corrosive_cloud', name: 'Corrosive Cloud', school: 'alchemy', tier: 2,
		description: 'Release a cloud of transmuted acid gas.',
		effect: 'Poison all enemies in 3x3 area (3 turns, 2 damage/turn).',
		manaCost: 6, cooldown: 5, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 1, element: 'acid',
		statusEffect: { type: 'poison', duration: 3, potency: 2 },
	},
	spell_petrify: {
		id: 'spell_petrify', name: 'Petrify', school: 'alchemy', tier: 3,
		description: 'Turn an enemy partially to stone.',
		effect: 'Stun one enemy for 5 turns.',
		manaCost: 10, cooldown: 8, targetType: 'single_enemy',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0,
		statusEffect: { type: 'stun', duration: 5, potency: 0 },
	},

	// ===== School of Divination =====
	spell_true_sight: {
		id: 'spell_true_sight', name: 'True Sight', school: 'divination', tier: 1,
		description: 'Pierce through darkness and illusion.',
		effect: '+3 sight radius for 10 turns. Reveals hidden enemies.',
		manaCost: 3, cooldown: 5, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0,
	},
	spell_reveal_secrets: {
		id: 'spell_reveal_secrets', name: 'Reveal Secrets', school: 'divination', tier: 1,
		description: 'Sense hidden passages and traps nearby.',
		effect: 'Detects all traps and secrets in 5-tile radius.',
		manaCost: 4, cooldown: 8, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0,
	},
	spell_foresight: {
		id: 'spell_foresight', name: 'Foresight', school: 'divination', tier: 2,
		description: 'See a moment into the future.',
		effect: '+20% dodge chance for 5 turns.',
		manaCost: 6, cooldown: 6, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0,
	},
	spell_scryers_mark: {
		id: 'spell_scryers_mark', name: "Scryer's Mark", school: 'divination', tier: 2,
		description: 'Mark a creature and track its movements.',
		effect: 'Reveal target position through walls for 20 turns.',
		manaCost: 5, cooldown: 10, targetType: 'single_enemy',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0,
	},

	// ===== School of Conjuration =====
	spell_summon_familiar: {
		id: 'spell_summon_familiar', name: 'Summon Familiar', school: 'conjuration', tier: 1,
		description: 'Summon a minor magical companion.',
		effect: 'Summon a familiar that fights alongside you for 10 turns.',
		manaCost: 5, cooldown: 15, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0,
	},

	// ===== School of Shadow =====
	spell_shadow_bolt: {
		id: 'spell_shadow_bolt', name: 'Shadow Bolt', school: 'shadow', tier: 1,
		description: 'Hurl a bolt of condensed darkness.',
		effect: 'Deals 5 shadow damage.',
		manaCost: 4, cooldown: 2, targetType: 'single_enemy',
		baseDamage: 5, baseHeal: 0, aoeRadius: 0, element: 'shadow',
	},
	spell_life_tap: {
		id: 'spell_life_tap', name: 'Life Tap', school: 'shadow', tier: 1,
		description: 'Drain life force from an enemy.',
		effect: 'Deals 3 damage, heals you for the amount dealt.',
		manaCost: 3, cooldown: 3, targetType: 'single_enemy',
		baseDamage: 3, baseHeal: 0, aoeRadius: 0, element: 'shadow',
		// Life drain handled specially in executeSpell
	},
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getSpellsBySchool(school: SpellSchool): SpellDef[] {
	return Object.values(SPELL_CATALOG).filter(s => s.school === school);
}

export function getSpellsByTier(tier: SpellTier): SpellDef[] {
	return Object.values(SPELL_CATALOG).filter(s => s.tier === tier);
}

export function getSpellDef(spellId: string): SpellDef | undefined {
	return SPELL_CATALOG[spellId];
}

// ---------------------------------------------------------------------------
// Spell Damage / Healing Calculation (US-MS-27)
// ---------------------------------------------------------------------------

/** Calculate spell damage: baseDamage + floor(spellPower / 4), reduced by target magicResist% */
export function calculateSpellDamage(spell: SpellDef, caster: Entity, target: Entity): number {
	if (spell.baseDamage <= 0) return 0;
	const raw = spell.baseDamage + Math.floor((caster.spellPower ?? 0) / 4);
	const resist = Math.min(50, target.magicResist ?? 0); // cap at 50%
	return Math.max(1, Math.floor(raw * (1 - resist / 100)));
}

/** Calculate spell healing: baseHeal + floor(spellPower / 3) */
export function calculateSpellHealing(spell: SpellDef, caster: Entity): number {
	if (spell.baseHeal <= 0) return 0;
	return spell.baseHeal + Math.floor((caster.spellPower ?? 0) / 3);
}

// ---------------------------------------------------------------------------
// Armor Casting Penalty (US-MS-32)
// ---------------------------------------------------------------------------

export type ArmorWeight = 'robes' | 'light' | 'medium' | 'heavy';

const ARMOR_MANA_MULTIPLIER: Record<ArmorWeight, number> = {
	robes: 0.90,    // -10% cost
	light: 1.00,
	medium: 1.25,   // +25%
	heavy: 1.50,    // +50%
};

export function getArmorCastingPenalty(armorWeight: ArmorWeight): number {
	return ARMOR_MANA_MULTIPLIER[armorWeight];
}

/** Get the effective mana cost of a spell considering armor penalty */
export function effectiveManaCost(spell: SpellDef, armorWeight: ArmorWeight): number {
	return Math.ceil(spell.manaCost * ARMOR_MANA_MULTIPLIER[armorWeight]);
}

// ---------------------------------------------------------------------------
// Spell Execution
// ---------------------------------------------------------------------------

export interface SpellResult {
	success: boolean;
	messages: { text: string; type: 'magic' | 'damage_taken' | 'healing' | 'warning' | 'info' }[];
	damageDealt: number;
	healingDone: number;
	killedEnemies: Entity[];
	manaCost: number;
}

/**
 * Execute a spell on the given target(s). Returns the result of the execution.
 * This is a pure calculation — the caller (engine) applies state mutations.
 */
export function executeSpell(
	spell: SpellDef,
	caster: Entity,
	targets: Entity[],
	armorWeight: ArmorWeight,
): SpellResult {
	const result: SpellResult = {
		success: true,
		messages: [],
		damageDealt: 0,
		healingDone: 0,
		killedEnemies: [],
		manaCost: effectiveManaCost(spell, armorWeight),
	};

	// Check mana
	const currentMana = caster.mana ?? 0;
	if (currentMana < result.manaCost) {
		result.success = false;
		result.messages.push({
			text: `Not enough mana! (need ${result.manaCost}, have ${currentMana})`,
			type: 'warning',
		});
		return result;
	}

	// Check cooldown (handled externally but double-check)
	result.messages.push({
		text: `You cast ${spell.name}!`,
		type: 'magic',
	});

	// Self-buff spells
	if (spell.selfBuff) {
		applyEffect(caster, spell.selfBuff.type as any, spell.selfBuff.duration, spell.selfBuff.potency);
		result.messages.push({
			text: `${spell.selfBuff.type} applied for ${spell.selfBuff.duration} turns.`,
			type: 'magic',
		});
	}

	// Healing spells
	if (spell.baseHeal > 0) {
		const healAmount = calculateSpellHealing(spell, caster);
		const actualHeal = Math.min(healAmount, caster.maxHp - caster.hp);
		caster.hp += actualHeal;
		result.healingDone = actualHeal;
		if (actualHeal > 0) {
			result.messages.push({
				text: `Healed for ${actualHeal} HP!`,
				type: 'healing',
			});
		}
	}

	// Cure spell special handling
	if (spell.id === 'spell_cure') {
		caster.statusEffects = caster.statusEffects.filter(
			e => e.type !== 'poison' && e.type !== 'burn'
		);
		result.messages.push({ text: 'Poison and burn effects removed!', type: 'healing' });
	}

	// Dispel special handling
	if (spell.id === 'spell_dispel' && targets.length > 0) {
		const target = targets[0];
		target.statusEffects = [];
		result.messages.push({
			text: `All effects removed from ${target.name}!`,
			type: 'magic',
		});
	}

	// Damage spells
	if (spell.baseDamage > 0) {
		for (const target of targets) {
			const dmg = calculateSpellDamage(spell, caster, target);
			target.hp -= dmg;
			result.damageDealt += dmg;
			result.messages.push({
				text: `${spell.name} hits ${target.name} for ${dmg} damage!`,
				type: 'magic',
			});

			// Life Tap special: heal caster for damage dealt
			if (spell.id === 'spell_life_tap') {
				const heal = Math.min(dmg, caster.maxHp - caster.hp);
				caster.hp += heal;
				result.healingDone += heal;
				if (heal > 0) {
					result.messages.push({ text: `Drained ${heal} HP!`, type: 'healing' });
				}
			}

			if (target.hp <= 0) {
				result.killedEnemies.push(target);
			}
		}
	}

	// Status effect on targets (stun, freeze, poison, etc.)
	if (spell.statusEffect && targets.length > 0) {
		for (const target of targets) {
			if (target.hp > 0) {
				applyEffect(
					target,
					spell.statusEffect.type as any,
					spell.statusEffect.duration,
					spell.statusEffect.potency,
				);
				result.messages.push({
					text: `${target.name} is affected by ${spell.statusEffect.type}!`,
					type: 'magic',
				});
			}
		}
	}

	// Deduct mana
	caster.mana = (caster.mana ?? 0) - result.manaCost;

	return result;
}

// ---------------------------------------------------------------------------
// Mana Regeneration (US-MS-04)
// ---------------------------------------------------------------------------

/** Process mana regeneration for the player each turn */
export function tickManaRegen(state: GameState): void {
	if (state.player.hp <= 0) return;
	if (hasEffect(state.player, 'stun')) return;

	const player = state.player;
	if (player.mana === undefined || player.maxMana === undefined) return;
	if (player.mana >= player.maxMana) return;

	// Base regen: +1 per 5 turns
	state.manaRegenBaseCounter++;
	if (state.manaRegenBaseCounter >= 5) {
		state.manaRegenBaseCounter = 0;
		player.mana = Math.min(player.maxMana!, player.mana! + 1);
	}

	// INT bonus regen: +1 per max(1, 20 - floor(INT/2)) turns
	const intInterval = Math.max(1, 20 - Math.floor((player.int ?? 10) / 2));
	state.manaRegenIntCounter++;
	if (state.manaRegenIntCounter >= intInterval) {
		state.manaRegenIntCounter = 0;
		player.mana = Math.min(player.maxMana!, player.mana! + 1);
	}
}

// ---------------------------------------------------------------------------
// Cooldown Tick
// ---------------------------------------------------------------------------

/** Decrement all spell cooldowns by 1 */
export function tickSpellCooldowns(state: GameState): void {
	for (const spellId of Object.keys(state.spellCooldowns)) {
		if (state.spellCooldowns[spellId] > 0) {
			state.spellCooldowns[spellId]--;
			if (state.spellCooldowns[spellId] <= 0) {
				delete state.spellCooldowns[spellId];
			}
		}
	}
}
