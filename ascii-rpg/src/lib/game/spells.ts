/**
 * Spell system: Schools, spell definitions, and progression.
 * Spells are learned through quests and NPC teachers at the Arcane Conservatory.
 */

export type SpellSchool = 'elements' | 'enchantment' | 'alchemy' | 'divination';

export interface SpellDef {
	id: string;
	name: string;
	school: SpellSchool;
	level: 1 | 2 | 3;
	description: string;
	effect: string;
	manaCost: number;
	cooldown: number;
	components?: string[];
}

export const SPELL_SCHOOL_NAMES: Record<SpellSchool, string> = {
	elements: 'School of Elements',
	enchantment: 'School of Enchantment',
	alchemy: 'School of Alchemy',
	divination: 'School of Divination',
};

export const SPELL_CATALOG: Record<string, SpellDef> = {
	// --- School of Elements ---
	spell_firebolt: {
		id: 'spell_firebolt', name: 'Firebolt', school: 'elements', level: 1,
		description: 'Hurl a bolt of fire at a single target.',
		effect: 'Deals 4 fire damage to one enemy.',
		manaCost: 3, cooldown: 2, components: ['fire_crystal'],
	},
	spell_frost_lance: {
		id: 'spell_frost_lance', name: 'Frost Lance', school: 'elements', level: 1,
		description: 'A shard of conjured ice that pierces and chills.',
		effect: 'Deals 3 damage and applies freeze (1 turn).',
		manaCost: 4, cooldown: 3, components: ['frost_essence'],
	},
	spell_lightning_arc: {
		id: 'spell_lightning_arc', name: 'Lightning Arc', school: 'elements', level: 2,
		description: 'Chain lightning that arcs between nearby targets.',
		effect: 'Deals 3 damage to up to 3 adjacent enemies.',
		manaCost: 6, cooldown: 4, components: ['lightning_shard'],
	},
	spell_glacial_wall: {
		id: 'spell_glacial_wall', name: 'Glacial Wall', school: 'elements', level: 2,
		description: 'Conjure a wall of ice that blocks passage.',
		effect: 'Creates a 3-tile ice barrier for 5 turns.',
		manaCost: 5, cooldown: 6, components: ['frost_essence'],
	},
	spell_inferno: {
		id: 'spell_inferno', name: 'Inferno', school: 'elements', level: 3,
		description: 'Unleash a devastating column of fire in a 3x3 area.',
		effect: 'Deals 8 fire damage in area, applies burn (3 turns).',
		manaCost: 10, cooldown: 8, components: ['fire_crystal', 'phoenix_ash'],
	},
	spell_tempest: {
		id: 'spell_tempest', name: 'Tempest', school: 'elements', level: 3,
		description: 'Summon a raging storm of ice and lightning.',
		effect: 'Deals 6 damage in 5x5 area, freeze + stun (2 turns).',
		manaCost: 14, cooldown: 12, components: ['frost_essence', 'lightning_shard'],
	},

	// --- School of Enchantment ---
	spell_arcane_ward: {
		id: 'spell_arcane_ward', name: 'Arcane Ward', school: 'enchantment', level: 1,
		description: 'Weave a protective barrier around yourself.',
		effect: 'Gain +3 HP shield for 5 turns.',
		manaCost: 3, cooldown: 4, components: ['arcane_dust'],
	},
	spell_binding_circle: {
		id: 'spell_binding_circle', name: 'Binding Circle', school: 'enchantment', level: 1,
		description: 'Trap an enemy in a circle of arcane force.',
		effect: 'Stuns one enemy for 3 turns.',
		manaCost: 5, cooldown: 5, components: ['arcane_dust'],
	},
	spell_dispel: {
		id: 'spell_dispel', name: 'Dispel', school: 'enchantment', level: 2,
		description: 'Remove magical effects from a target.',
		effect: 'Removes all status effects from one entity.',
		manaCost: 4, cooldown: 3,
	},
	spell_reflective_shield: {
		id: 'spell_reflective_shield', name: 'Reflective Shield', school: 'enchantment', level: 2,
		description: 'A shimmering barrier that returns damage to attackers.',
		effect: 'Reflects 50% of melee damage for 4 turns.',
		manaCost: 7, cooldown: 6, components: ['arcane_dust', 'void_salt'],
	},
	spell_sanctum: {
		id: 'spell_sanctum', name: 'Sanctum', school: 'enchantment', level: 3,
		description: 'Create a zone of absolute protection.',
		effect: 'All allies in 3x3 area gain +5 HP shield and regeneration (3 turns).',
		manaCost: 12, cooldown: 10, components: ['arcane_dust', 'moonwater_vial', 'void_salt'],
	},

	// --- School of Alchemy (combat transmutations) ---
	spell_acid_splash: {
		id: 'spell_acid_splash', name: 'Acid Splash', school: 'alchemy', level: 1,
		description: 'Hurl a vial of conjured acid.',
		effect: 'Deals 3 damage, reduces target ATK by 1 for 3 turns.',
		manaCost: 3, cooldown: 2, components: ['mandrake_root'],
	},
	spell_healing_mist: {
		id: 'spell_healing_mist', name: 'Healing Mist', school: 'alchemy', level: 1,
		description: 'Transmute air into a soothing healing vapor.',
		effect: 'Heal 6 HP.',
		manaCost: 4, cooldown: 4, components: ['starfern'],
	},
	spell_transmute_weapon: {
		id: 'spell_transmute_weapon', name: 'Transmute Weapon', school: 'alchemy', level: 2,
		description: 'Temporarily enhance a weapon with alchemical coating.',
		effect: '+2 ATK for 5 turns.',
		manaCost: 5, cooldown: 6, components: ['fire_crystal', 'mandrake_root'],
	},
	spell_corrosive_cloud: {
		id: 'spell_corrosive_cloud', name: 'Corrosive Cloud', school: 'alchemy', level: 2,
		description: 'Release a cloud of transmuted acid gas.',
		effect: 'Poison all enemies in 3x3 area (3 turns, 2 damage/turn).',
		manaCost: 6, cooldown: 5, components: ['mandrake_root', 'shadowroot'],
	},
	spell_petrify: {
		id: 'spell_petrify', name: 'Petrify', school: 'alchemy', level: 3,
		description: 'Turn an enemy partially to stone.',
		effect: 'Stun one enemy for 5 turns.',
		manaCost: 10, cooldown: 8, components: ['void_salt', 'shadowroot', 'mandrake_root'],
	},

	// --- School of Divination ---
	spell_true_sight: {
		id: 'spell_true_sight', name: 'True Sight', school: 'divination', level: 1,
		description: 'Pierce through darkness and illusion.',
		effect: '+3 sight radius for 10 turns. Reveals hidden enemies.',
		manaCost: 3, cooldown: 5, components: ['moonwater_vial'],
	},
	spell_reveal_secrets: {
		id: 'spell_reveal_secrets', name: 'Reveal Secrets', school: 'divination', level: 1,
		description: 'Sense hidden passages and traps nearby.',
		effect: 'Detects all traps and secrets in 5-tile radius.',
		manaCost: 4, cooldown: 8,
	},
	spell_foresight: {
		id: 'spell_foresight', name: 'Foresight', school: 'divination', level: 2,
		description: 'See a moment into the future.',
		effect: '+20% dodge chance for 5 turns.',
		manaCost: 6, cooldown: 6, components: ['moonwater_vial', 'starfern'],
	},
	spell_scryers_mark: {
		id: 'spell_scryers_mark', name: "Scryer's Mark", school: 'divination', level: 2,
		description: 'Mark a creature and track its movements.',
		effect: 'Reveal target position through walls for 20 turns.',
		manaCost: 5, cooldown: 10, components: ['moonwater_vial'],
	},
	spell_astral_projection: {
		id: 'spell_astral_projection', name: 'Astral Projection', school: 'divination', level: 3,
		description: 'Project your consciousness beyond your body.',
		effect: 'Reveal entire map for 3 turns. Cannot take actions.',
		manaCost: 15, cooldown: 20, components: ['moonwater_vial', 'starfern', 'dreamleaf'],
	},
};

export function getSpellsBySchool(school: SpellSchool): SpellDef[] {
	return Object.values(SPELL_CATALOG).filter(s => s.school === school);
}

export function getSpellsByLevel(level: 1 | 2 | 3): SpellDef[] {
	return Object.values(SPELL_CATALOG).filter(s => s.level === level);
}
