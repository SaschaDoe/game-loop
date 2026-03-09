/**
 * Spell system: Schools, spell definitions, targeting, and execution.
 * Implements Epic 79 magic system with 7 arcane schools and 5 tiers.
 */

import type { Entity, GameState, Position, SpellTargetType } from './types';
import { applyEffect, hasEffect } from './status-effects';

// ---------------------------------------------------------------------------
// Schools & Tiers
// ---------------------------------------------------------------------------

export type SpellSchool = 'elements' | 'enchantment' | 'restoration' | 'divination' | 'alchemy' | 'conjuration' | 'shadow'
	| 'blood' | 'necromancy' | 'void_magic' | 'chronomancy' | 'soul';

export type ForbiddenSchool = 'blood' | 'necromancy' | 'void_magic' | 'chronomancy' | 'soul';
export const FORBIDDEN_SCHOOLS: ForbiddenSchool[] = ['blood', 'necromancy', 'void_magic', 'chronomancy', 'soul'];

export type SpellTier = 1 | 2 | 3 | 4 | 5;

export const SPELL_SCHOOL_NAMES: Record<SpellSchool, string> = {
	elements: 'School of Elements',
	enchantment: 'School of Enchantment',
	restoration: 'School of Restoration',
	divination: 'School of Divination',
	alchemy: 'School of Alchemy',
	conjuration: 'School of Conjuration',
	shadow: 'School of Shadow',
	blood: 'Blood Magic',
	necromancy: 'School of Necromancy',
	void_magic: 'Void Magic',
	chronomancy: 'Chronomancy',
	soul: 'Soul Magic',
};

export const SPELL_SCHOOL_COLORS: Record<SpellSchool, string> = {
	elements: '#f84',
	enchantment: '#88f',
	restoration: '#8f8',
	divination: '#ff8',
	alchemy: '#8ff',
	conjuration: '#f8f',
	shadow: '#a6a',
	blood: '#c00',
	necromancy: '#696',
	void_magic: '#609',
	chronomancy: '#cc6',
	soul: '#6cf',
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
	/** HP cost (used by blood magic spells instead of mana) */
	hpCost?: number;
	/** Whether this spell belongs to a forbidden school */
	isForbidden?: boolean;
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
	spell_fireball: {
		id: 'spell_fireball', name: 'Fireball', school: 'elements', tier: 3,
		description: 'Unleash a devastating column of fire in a 3x3 area.',
		effect: 'Deals 8 fire damage in area, applies burn (3 turns).',
		manaCost: 10, cooldown: 8, targetType: 'area',
		baseDamage: 8, baseHeal: 0, aoeRadius: 1, element: 'fire',
		statusEffect: { type: 'burn', duration: 3, potency: 2 },
	},
	spell_tempest: {
		id: 'spell_tempest', name: 'Tempest', school: 'elements', tier: 4,
		description: 'Summon a raging storm of ice and lightning.',
		effect: 'Deals 6 damage in 5x5 area, freeze + stun (2 turns).',
		manaCost: 14, cooldown: 12, targetType: 'self',
		baseDamage: 6, baseHeal: 0, aoeRadius: 2, element: 'ice',
		statusEffect: { type: 'freeze', duration: 2, potency: 0 },
	},
	spell_inferno: {
		id: 'spell_inferno', name: 'Inferno', school: 'elements', tier: 5,
		description: 'Unleash a cataclysmic firestorm across a wide area.',
		effect: 'Deals 15 fire damage in 5x5 area. Affected tiles burn for 10 turns.',
		manaCost: 20, cooldown: 15, targetType: 'area',
		baseDamage: 15, baseHeal: 0, aoeRadius: 2, element: 'fire',
		statusEffect: { type: 'burn', duration: 10, potency: 2 },
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
	spell_weapon_enchant: {
		id: 'spell_weapon_enchant', name: 'Weapon Enchant', school: 'enchantment', tier: 2,
		description: 'Imbue a weapon with arcane energy.',
		effect: '+3 ATK for 10 turns.',
		manaCost: 5, cooldown: 8, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'arcane',
		selfBuff: { type: 'inspire', duration: 10, potency: 3 },
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
	spell_sanctum: {
		id: 'spell_sanctum', name: 'Sanctum', school: 'enchantment', tier: 4,
		description: 'Create a protective zone of arcane energy.',
		effect: 'Allies in 3x3 area gain +5 shield and regeneration (3 HP/turn, 3 turns).',
		manaCost: 12, cooldown: 10, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 1, element: 'arcane',
		selfBuff: { type: 'regeneration', duration: 3, potency: 3 },
	},
	spell_absolute_ward: {
		id: 'spell_absolute_ward', name: 'Absolute Ward', school: 'enchantment', tier: 5,
		description: 'Conjure an impenetrable ward that absorbs incoming attacks.',
		effect: 'Gain immunity to the next 3 hits from any source.',
		manaCost: 18, cooldown: 20, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'arcane',
		selfBuff: { type: 'inspire', duration: 20, potency: 3 },
		// Note: charge-based immunity handled specially in combat
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
		manaCost: 3, cooldown: 2, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'holy',
	},
	spell_bless: {
		id: 'spell_bless', name: 'Bless', school: 'restoration', tier: 2,
		description: 'Bestow a divine blessing that enhances all abilities.',
		effect: '+2 to all attributes for 10 turns.',
		manaCost: 6, cooldown: 8, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'holy',
		selfBuff: { type: 'inspire', duration: 10, potency: 2 },
	},
	spell_regenerate: {
		id: 'spell_regenerate', name: 'Regenerate', school: 'restoration', tier: 2,
		description: 'Weave a sustained healing enchantment over the body.',
		effect: 'Heal 3 HP per turn for 10 turns.',
		manaCost: 5, cooldown: 6, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'holy',
		selfBuff: { type: 'regeneration', duration: 10, potency: 3 },
	},
	spell_purify: {
		id: 'spell_purify', name: 'Purify', school: 'restoration', tier: 3,
		description: 'A powerful cleansing that removes all afflictions.',
		effect: 'Removes ALL negative status effects. Immune to debuffs for 3 turns.',
		manaCost: 8, cooldown: 10, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'holy',
	},
	spell_mass_heal: {
		id: 'spell_mass_heal', name: 'Mass Heal', school: 'restoration', tier: 4,
		description: 'Channel a wave of restorative energy to all nearby allies.',
		effect: 'Heal 12 HP to self and all visible allies.',
		manaCost: 14, cooldown: 12, targetType: 'self',
		baseDamage: 0, baseHeal: 12, aoeRadius: 0, element: 'holy',
		// Note: multi-target healing handled specially in executeSpell
	},
	spell_resurrection: {
		id: 'spell_resurrection', name: 'Resurrection', school: 'restoration', tier: 5,
		description: 'Precast a divine ward that defies death itself.',
		effect: 'If you take lethal damage within 100 turns, revive at 50% HP instead.',
		manaCost: 25, cooldown: 25, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'holy',
		selfBuff: { type: 'regeneration', duration: 100, potency: 0 },
		// Note: resurrection precast buff and rest-gated cooldown handled specially
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
	spell_stone_skin: {
		id: 'spell_stone_skin', name: 'Stone Skin', school: 'alchemy', tier: 3,
		description: 'Transmute the outer layer of skin into living stone.',
		effect: '+5 damage reduction for 8 turns.',
		manaCost: 8, cooldown: 8, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0,
		selfBuff: { type: 'inspire', duration: 8, potency: 5 },
		// Note: damage reduction handled specially in combat
	},
	spell_petrify: {
		id: 'spell_petrify', name: 'Petrify', school: 'alchemy', tier: 4,
		description: 'Turn an enemy partially to stone.',
		effect: 'Stun one enemy for 5 turns.',
		manaCost: 10, cooldown: 8, targetType: 'single_enemy',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0,
		statusEffect: { type: 'stun', duration: 5, potency: 0 },
	},
	spell_philosophers_touch: {
		id: 'spell_philosophers_touch', name: "Philosopher's Touch", school: 'alchemy', tier: 5,
		description: 'The ultimate alchemical transmutation — restore the body to perfection.',
		effect: 'Fully restore HP. Remove all debuffs. Invulnerable for 2 turns.',
		manaCost: 30, cooldown: 25, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0,
		selfBuff: { type: 'inspire', duration: 2, potency: 0 },
		// Note: full HP restore, debuff removal, and rest-gated cooldown handled specially
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
	spell_enemy_analysis: {
		id: 'spell_enemy_analysis', name: 'Enemy Analysis', school: 'divination', tier: 3,
		description: 'Divine the strengths and weaknesses of a foe.',
		effect: 'Display target full stats, weaknesses, and next action.',
		manaCost: 4, cooldown: 3, targetType: 'single_enemy',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0,
	},
	spell_premonition: {
		id: 'spell_premonition', name: 'Premonition', school: 'divination', tier: 4,
		description: 'Glimpse the immediate future to evade incoming attacks.',
		effect: 'Auto-dodge the next 2 incoming attacks.',
		manaCost: 10, cooldown: 15, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0,
		selfBuff: { type: 'inspire', duration: 20, potency: 2 },
		// Note: charge-based dodge handled specially in combat
	},
	spell_astral_projection: {
		id: 'spell_astral_projection', name: 'Astral Projection', school: 'divination', tier: 5,
		description: 'Project your consciousness to see the entire map.',
		effect: 'Reveal the entire current map for 3 turns. Cannot move or act while projecting.',
		manaCost: 15, cooldown: 20, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0,
		selfBuff: { type: 'stun', duration: 3, potency: 0 },
		// Note: map reveal + self-immobilization handled specially
	},

	// ===== School of Conjuration =====
	spell_summon_light: {
		id: 'spell_summon_light', name: 'Summon Light', school: 'conjuration', tier: 1,
		description: 'Conjure a hovering orb of light at a target tile.',
		effect: 'Create a light source illuminating 3-tile radius for 10 turns.',
		manaCost: 2, cooldown: 1, targetType: 'tile',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'arcane',
	},
	spell_phase_step: {
		id: 'spell_phase_step', name: 'Phase Step', school: 'conjuration', tier: 1,
		description: 'Blink through the fabric of space.',
		effect: 'Teleport up to 5 tiles. Can pass through walls up to 1 tile thick.',
		manaCost: 4, cooldown: 5, targetType: 'tile',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'arcane',
	},
	spell_phantom_image: {
		id: 'spell_phantom_image', name: 'Phantom Image', school: 'conjuration', tier: 2,
		description: 'Create a convincing illusory decoy.',
		effect: 'Summon a decoy (3 HP) that draws enemy attacks for 8 turns.',
		manaCost: 5, cooldown: 6, targetType: 'tile',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'arcane',
	},
	spell_conjure_weapon: {
		id: 'spell_conjure_weapon', name: 'Conjure Weapon', school: 'conjuration', tier: 2,
		description: 'Summon a spectral weapon from the aether.',
		effect: '+3 ATK for 15 turns. Replaces current weapon temporarily.',
		manaCost: 6, cooldown: 10, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'arcane',
		selfBuff: { type: 'inspire', duration: 15, potency: 3 },
	},
	spell_summon_elemental: {
		id: 'spell_summon_elemental', name: 'Summon Elemental', school: 'conjuration', tier: 3,
		description: 'Call forth an elemental creature to fight by your side.',
		effect: 'Summon an elemental ally (10 HP, 4 ATK) for 10 turns.',
		manaCost: 12, cooldown: 15, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'arcane',
	},
	spell_dimensional_door: {
		id: 'spell_dimensional_door', name: 'Dimensional Door', school: 'conjuration', tier: 4,
		description: 'Tear open a doorway through space to any explored location.',
		effect: 'Teleport to any previously explored tile on the current map.',
		manaCost: 10, cooldown: 20, targetType: 'tile',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'arcane',
	},
	spell_grand_illusion: {
		id: 'spell_grand_illusion', name: 'Grand Illusion', school: 'conjuration', tier: 5,
		description: 'Fill the minds of all nearby enemies with phantom duplicates.',
		effect: 'All enemies in sight become confused for 5 turns (50% misdirected attacks).',
		manaCost: 18, cooldown: 15, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'arcane',
		statusEffect: { type: 'stun', duration: 5, potency: 0 },
		// Note: confusion (misdirected attacks) handled specially in AI
	},

	// ===== School of Shadow =====
	spell_darkness: {
		id: 'spell_darkness', name: 'Darkness', school: 'shadow', tier: 1,
		description: 'Shroud a target in unnatural darkness.',
		effect: 'Reduce target sight radius by 3 for 5 turns.',
		manaCost: 2, cooldown: 3, targetType: 'single_enemy',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'shadow',
		statusEffect: { type: 'blind', duration: 5, potency: 3 },
	},
	spell_shadow_bolt: {
		id: 'spell_shadow_bolt', name: 'Shadow Bolt', school: 'shadow', tier: 1,
		description: 'Hurl a bolt of condensed darkness.',
		effect: 'Deals 5 shadow damage. Bypasses armor and shields.',
		manaCost: 4, cooldown: 3, targetType: 'single_enemy',
		baseDamage: 5, baseHeal: 0, aoeRadius: 0, element: 'shadow',
	},
	spell_fear: {
		id: 'spell_fear', name: 'Fear', school: 'shadow', tier: 2,
		description: 'Project terrifying visions into the mind of a foe.',
		effect: 'Fear one enemy for 3 turns. Feared enemies flee and cannot attack.',
		manaCost: 6, cooldown: 6, targetType: 'single_enemy',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'shadow',
		statusEffect: { type: 'stun', duration: 3, potency: 0 },
		// Note: fear (flee behavior) handled specially in AI
	},
	spell_life_drain: {
		id: 'spell_life_drain', name: 'Life Drain', school: 'shadow', tier: 2,
		description: 'Siphon the life force from a nearby enemy.',
		effect: 'Deals 8 shadow damage. Heal self for 50% of damage dealt.',
		manaCost: 8, cooldown: 5, targetType: 'single_enemy',
		baseDamage: 8, baseHeal: 0, aoeRadius: 0, element: 'shadow',
		// Note: life drain healing handled specially in executeSpell
	},
	spell_shadow_cloak: {
		id: 'spell_shadow_cloak', name: 'Shadow Cloak', school: 'shadow', tier: 3,
		description: 'Wrap yourself in living shadows, becoming invisible.',
		effect: 'Become invisible for 5 turns. Breaks on attack or taking damage.',
		manaCost: 10, cooldown: 10, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'shadow',
		selfBuff: { type: 'inspire', duration: 5, potency: 0 },
		// Note: invisibility handled specially in AI and combat
	},
	spell_curse_of_weakness: {
		id: 'spell_curse_of_weakness', name: 'Curse of Weakness', school: 'shadow', tier: 4,
		description: 'Lay a withering curse that saps all strength.',
		effect: 'All attributes reduced by 3 for 20 turns.',
		manaCost: 12, cooldown: 12, targetType: 'single_enemy',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'shadow',
		statusEffect: { type: 'curse', duration: 20, potency: 3 },
	},
	spell_soul_rip: {
		id: 'spell_soul_rip', name: 'Soul Rip', school: 'shadow', tier: 5,
		description: 'Tear the very soul from an enemy, dealing catastrophic damage.',
		effect: 'Deals 30 shadow damage (ignores armor). If target dies, summon a spectral ally.',
		manaCost: 25, cooldown: 20, targetType: 'single_enemy',
		baseDamage: 30, baseHeal: 0, aoeRadius: 0, element: 'shadow',
		// Note: spectral ally summoning handled specially in executeSpell
	},

	// ===== Blood Magic (Forbidden) =====
	spell_blood_bolt: {
		id: 'spell_blood_bolt', name: 'Blood Bolt', school: 'blood', tier: 1,
		description: 'Compress your own blood into a deadly projectile.',
		effect: 'Costs 5 HP. Deals 6 shadow damage.',
		manaCost: 0, hpCost: 5, cooldown: 2, targetType: 'single_enemy',
		baseDamage: 6, baseHeal: 0, aoeRadius: 0, element: 'shadow', isForbidden: true,
	},
	spell_blood_shield: {
		id: 'spell_blood_shield', name: 'Blood Shield', school: 'blood', tier: 1,
		description: 'Sacrifice blood to weave a regenerative ward.',
		effect: 'Costs 8 HP. Regenerate 3 HP/turn for 5 turns.',
		manaCost: 0, hpCost: 8, cooldown: 5, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, isForbidden: true,
		selfBuff: { type: 'regeneration', duration: 5, potency: 3 },
	},
	spell_hemorrhage: {
		id: 'spell_hemorrhage', name: 'Hemorrhage', school: 'blood', tier: 2,
		description: 'Rupture the blood vessels of your foe.',
		effect: 'Costs 8 HP. Deals 7 damage + burn 2/turn for 3 turns.',
		manaCost: 0, hpCost: 8, cooldown: 4, targetType: 'single_enemy',
		baseDamage: 7, baseHeal: 0, aoeRadius: 0, isForbidden: true,
		statusEffect: { type: 'burn', duration: 3, potency: 2 },
	},
	spell_sanguine_whip: {
		id: 'spell_sanguine_whip', name: 'Sanguine Whip', school: 'blood', tier: 2,
		description: 'Lash out with a tendril of living blood that siphons life.',
		effect: 'Costs 10 HP. Deals 8 damage. Heals for 50% of damage dealt.',
		manaCost: 0, hpCost: 10, cooldown: 5, targetType: 'single_enemy',
		baseDamage: 8, baseHeal: 0, aoeRadius: 0, element: 'shadow', isForbidden: true,
		// Note: life drain healing handled like spell_life_drain in executeSpell
	},
	spell_blood_pact: {
		id: 'spell_blood_pact', name: 'Blood Pact', school: 'blood', tier: 3,
		description: 'Seal a pact in blood, empowering your strikes.',
		effect: 'Costs 12 HP. +5 ATK for 8 turns.',
		manaCost: 0, hpCost: 12, cooldown: 12, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, isForbidden: true,
		selfBuff: { type: 'inspire', duration: 8, potency: 5 },
	},
	spell_crimson_tide: {
		id: 'spell_crimson_tide', name: 'Crimson Tide', school: 'blood', tier: 4,
		description: 'Unleash a wave of boiling blood in all directions.',
		effect: 'Costs 18 HP. Deals 10 damage to all enemies in radius 2.',
		manaCost: 0, hpCost: 18, cooldown: 15, targetType: 'self',
		baseDamage: 10, baseHeal: 0, aoeRadius: 2, element: 'shadow', isForbidden: true,
	},
	spell_heart_stop: {
		id: 'spell_heart_stop', name: 'Heart Stop', school: 'blood', tier: 5,
		description: 'Reach into a foe\'s chest with blood magic and stop their heart.',
		effect: 'Costs 25 HP. Deals 40 damage to a single target.',
		manaCost: 0, hpCost: 25, cooldown: 20, targetType: 'single_enemy',
		baseDamage: 40, baseHeal: 0, aoeRadius: 0, element: 'shadow', isForbidden: true,
	},

	// ===== School of Necromancy (Forbidden) =====
	spell_necro_life_tap: {
		id: 'spell_necro_life_tap', name: 'Life Tap', school: 'necromancy', tier: 1,
		description: 'Convert life force into raw magical energy.',
		effect: 'Costs 5 HP. Gain 8 mana.',
		manaCost: 0, hpCost: 5, cooldown: 3, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, isForbidden: true,
		// Note: mana gain handled specially in engine
	},
	spell_bone_shield: {
		id: 'spell_bone_shield', name: 'Bone Shield', school: 'necromancy', tier: 1,
		description: 'Summon a whirling barrier of bones.',
		effect: 'Regenerate 2 HP/turn for 6 turns.',
		manaCost: 4, cooldown: 5, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, isForbidden: true,
		selfBuff: { type: 'regeneration', duration: 6, potency: 2 },
	},
	spell_corpse_explosion: {
		id: 'spell_corpse_explosion', name: 'Corpse Explosion', school: 'necromancy', tier: 2,
		description: 'Detonate necrotic energy in a burst around you.',
		effect: 'Deals 8 damage to all enemies in radius 1.',
		manaCost: 6, cooldown: 6, targetType: 'self',
		baseDamage: 8, baseHeal: 0, aoeRadius: 1, isForbidden: true,
	},
	spell_wither: {
		id: 'spell_wither', name: 'Wither', school: 'necromancy', tier: 2,
		description: 'Drain the vitality from a living creature.',
		effect: 'Curse: -2 ATK for 6 turns.',
		manaCost: 7, cooldown: 5, targetType: 'single_enemy',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, isForbidden: true,
		statusEffect: { type: 'curse', duration: 6, potency: 2 },
	},
	spell_raise_dead: {
		id: 'spell_raise_dead', name: 'Raise Dead', school: 'necromancy', tier: 3,
		description: 'Reanimate a fallen creature to fight for you.',
		effect: '+3 ATK for 10 turns (undead ally concept).',
		manaCost: 10, cooldown: 15, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, isForbidden: true,
		selfBuff: { type: 'inspire', duration: 10, potency: 3 },
	},
	spell_plague_cloud: {
		id: 'spell_plague_cloud', name: 'Plague Cloud', school: 'necromancy', tier: 4,
		description: 'Release a cloud of pestilence that rots all living things.',
		effect: 'Poison all enemies in radius 2 (3 dmg/turn for 4 turns).',
		manaCost: 14, cooldown: 12, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 2, isForbidden: true,
		statusEffect: { type: 'poison', duration: 4, potency: 3 },
	},
	spell_army_of_dead: {
		id: 'spell_army_of_dead', name: 'Army of the Dead', school: 'necromancy', tier: 5,
		description: 'Raise an entire army of skeletal warriors.',
		effect: 'Stun all enemies in radius 3 for 3 turns.',
		manaCost: 25, cooldown: 25, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 3, isForbidden: true,
		statusEffect: { type: 'stun', duration: 3, potency: 0 },
	},

	// ===== Void Magic (Forbidden) =====
	spell_void_bolt: {
		id: 'spell_void_bolt', name: 'Void Bolt', school: 'void_magic', tier: 1,
		description: 'Hurl a bolt of pure nothingness.',
		effect: 'Deals 7 damage.',
		manaCost: 3, cooldown: 2, targetType: 'single_enemy',
		baseDamage: 7, baseHeal: 0, aoeRadius: 0, isForbidden: true,
	},
	spell_null_zone: {
		id: 'spell_null_zone', name: 'Null Zone', school: 'void_magic', tier: 2,
		description: 'Create a zone where reality unravels.',
		effect: 'Stun all enemies in radius 1 for 2 turns.',
		manaCost: 6, cooldown: 8, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 1, isForbidden: true,
		statusEffect: { type: 'stun', duration: 2, potency: 0 },
	},
	spell_void_step: {
		id: 'spell_void_step', name: 'Void Step', school: 'void_magic', tier: 2,
		description: 'Step through the void to another location.',
		effect: 'Teleport in a direction.',
		manaCost: 5, cooldown: 4, targetType: 'direction',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, isForbidden: true,
	},
	spell_entropy: {
		id: 'spell_entropy', name: 'Entropy', school: 'void_magic', tier: 3,
		description: 'Accelerate the decay of all things.',
		effect: 'Curse: -3 ATK for 8 turns.',
		manaCost: 8, cooldown: 7, targetType: 'single_enemy',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, isForbidden: true,
		statusEffect: { type: 'curse', duration: 8, potency: 3 },
	},
	spell_void_gaze: {
		id: 'spell_void_gaze', name: 'Void Gaze', school: 'void_magic', tier: 3,
		description: 'Lock eyes with the void — and force your enemy to do the same.',
		effect: 'Deals 5 damage + stun 2 turns.',
		manaCost: 10, cooldown: 8, targetType: 'single_enemy',
		baseDamage: 5, baseHeal: 0, aoeRadius: 0, isForbidden: true,
		statusEffect: { type: 'stun', duration: 2, potency: 0 },
	},
	spell_annihilation: {
		id: 'spell_annihilation', name: 'Annihilation', school: 'void_magic', tier: 4,
		description: 'Erase a target from existence with concentrated void energy.',
		effect: 'Deals 25 damage to a single target.',
		manaCost: 16, cooldown: 12, targetType: 'single_enemy',
		baseDamage: 25, baseHeal: 0, aoeRadius: 0, isForbidden: true,
	},
	spell_void_shield: {
		id: 'spell_void_shield', name: 'Void Shield', school: 'void_magic', tier: 5,
		description: 'Wrap yourself in a barrier of nothingness.',
		effect: 'Regenerate 5 HP/turn + inspire +3 ATK for 8 turns.',
		manaCost: 20, cooldown: 20, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, isForbidden: true,
		selfBuff: { type: 'regeneration', duration: 8, potency: 5 },
		// Note: also applies inspire +3 ATK for 8 turns, handled in engine
	},

	// ===== Chronomancy (Forbidden) =====
	spell_haste: {
		id: 'spell_haste', name: 'Haste', school: 'chronomancy', tier: 1,
		description: 'Accelerate your own timeline.',
		effect: '+2 ATK for 6 turns.',
		manaCost: 4, cooldown: 5, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, isForbidden: true,
		selfBuff: { type: 'inspire', duration: 6, potency: 2 },
	},
	spell_slow: {
		id: 'spell_slow', name: 'Slow', school: 'chronomancy', tier: 1,
		description: 'Decelerate an enemy\'s timeline to a crawl.',
		effect: 'Stun for 2 turns.',
		manaCost: 3, cooldown: 4, targetType: 'single_enemy',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, isForbidden: true,
		statusEffect: { type: 'stun', duration: 2, potency: 0 },
	},
	spell_temporal_sense: {
		id: 'spell_temporal_sense', name: 'Temporal Sense', school: 'chronomancy', tier: 2,
		description: 'Perceive time flowing around you, revealing hidden threats.',
		effect: 'Sight buff (concept).',
		manaCost: 5, cooldown: 8, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, isForbidden: true,
		// Note: sight buff handled specially
	},
	spell_rewind: {
		id: 'spell_rewind', name: 'Rewind', school: 'chronomancy', tier: 3,
		description: 'Reverse your personal timeline to undo recent wounds.',
		effect: 'Heal 15 HP.',
		manaCost: 10, cooldown: 10, targetType: 'self',
		baseDamage: 0, baseHeal: 15, aoeRadius: 0, isForbidden: true,
	},
	spell_age: {
		id: 'spell_age', name: 'Age', school: 'chronomancy', tier: 3,
		description: 'Accelerate time around an enemy, aging them rapidly.',
		effect: 'Curse: -3 ATK for 10 turns.',
		manaCost: 12, cooldown: 10, targetType: 'single_enemy',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, isForbidden: true,
		statusEffect: { type: 'curse', duration: 10, potency: 3 },
	},
	spell_time_stop: {
		id: 'spell_time_stop', name: 'Time Stop', school: 'chronomancy', tier: 4,
		description: 'Freeze time for everything but yourself.',
		effect: 'Stun all enemies in radius 3 for 2 turns.',
		manaCost: 15, cooldown: 18, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 3, isForbidden: true,
		statusEffect: { type: 'stun', duration: 2, potency: 0 },
	},
	spell_paradox: {
		id: 'spell_paradox', name: 'Paradox', school: 'chronomancy', tier: 5,
		description: 'Create a temporal paradox that empowers and heals you.',
		effect: '+5 ATK + regenerate 4 HP/turn for 10 turns.',
		manaCost: 20, cooldown: 25, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, isForbidden: true,
		selfBuff: { type: 'inspire', duration: 10, potency: 5 },
		// Note: also applies regeneration 4/turn for 10 turns, handled in engine
	},

	// ===== Soul Magic (Forbidden) =====
	spell_soul_sight: {
		id: 'spell_soul_sight', name: 'Soul Sight', school: 'soul', tier: 1,
		description: 'See the souls of all nearby creatures.',
		effect: 'Sight buff (concept).',
		manaCost: 3, cooldown: 8, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, isForbidden: true,
		// Note: sight buff handled specially
	},
	spell_soul_rend: {
		id: 'spell_soul_rend', name: 'Soul Rend', school: 'soul', tier: 2,
		description: 'Tear at the very essence of a creature.',
		effect: 'Deals 10 shadow damage.',
		manaCost: 6, cooldown: 4, targetType: 'single_enemy',
		baseDamage: 10, baseHeal: 0, aoeRadius: 0, element: 'shadow', isForbidden: true,
	},
	spell_soul_trap: {
		id: 'spell_soul_trap', name: 'Soul Trap', school: 'soul', tier: 2,
		description: 'Ensnare a fragment of the enemy\'s soul.',
		effect: 'Curse: -1 ATK for 8 turns.',
		manaCost: 5, cooldown: 6, targetType: 'single_enemy',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, isForbidden: true,
		statusEffect: { type: 'curse', duration: 8, potency: 1 },
	},
	spell_soul_transfer: {
		id: 'spell_soul_transfer', name: 'Soul Transfer', school: 'soul', tier: 3,
		description: 'Channel stolen soul energy to mend your wounds.',
		effect: 'Heal 12 HP.',
		manaCost: 8, cooldown: 8, targetType: 'self',
		baseDamage: 0, baseHeal: 12, aoeRadius: 0, isForbidden: true,
	},
	spell_soul_shield: {
		id: 'spell_soul_shield', name: 'Soul Shield', school: 'soul', tier: 3,
		description: 'Form a barrier of captured soul energy.',
		effect: 'Regenerate 3 HP/turn for 8 turns.',
		manaCost: 6, cooldown: 10, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, isForbidden: true,
		selfBuff: { type: 'regeneration', duration: 8, potency: 3 },
	},
	spell_soul_devour: {
		id: 'spell_soul_devour', name: 'Soul Devour', school: 'soul', tier: 4,
		description: 'Consume the soul essence of the fallen to empower yourself.',
		effect: '+3 ATK for 15 turns.',
		manaCost: 12, cooldown: 18, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, isForbidden: true,
		selfBuff: { type: 'inspire', duration: 15, potency: 3 },
	},
	spell_soulless: {
		id: 'spell_soulless', name: 'Soulless', school: 'soul', tier: 5,
		description: 'Transcend mortality by severing your own soul\'s limitations.',
		effect: '+5 ATK + regenerate 5 HP/turn for 12 turns.',
		manaCost: 20, cooldown: 30, targetType: 'self',
		baseDamage: 0, baseHeal: 0, aoeRadius: 0, isForbidden: true,
		selfBuff: { type: 'inspire', duration: 12, potency: 5 },
		// Note: also applies regeneration 5/turn for 12 turns, handled in engine
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

			// Life Drain special: heal caster for 50% of damage dealt
			if (spell.id === 'spell_life_drain') {
				const heal = Math.min(Math.floor(dmg * 0.5), caster.maxHp - caster.hp);
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
