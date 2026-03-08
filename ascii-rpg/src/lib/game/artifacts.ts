import type { Item, ItemRarity, ItemStats, Enchantment, EnchantmentType, WeaponEffect } from './items';
import { ITEM_CATALOG } from './items';

// ---------------------------------------------------------------------------
// Rarity colors & multipliers
// ---------------------------------------------------------------------------

export const RARITY_COLORS: Record<ItemRarity, string> = {
	common: '#aaa',
	uncommon: '#4f4',
	rare: '#48f',
	epic: '#a4f',
	legendary: '#fa4',
};

export const RARITY_STAT_MULTIPLIER: Record<ItemRarity, number> = {
	common: 1.0,
	uncommon: 1.3,
	rare: 1.6,
	epic: 2.0,
	legendary: 2.5,
};

// ---------------------------------------------------------------------------
// Weapon effect definitions
// ---------------------------------------------------------------------------

export interface WeaponEffectDef {
	name: string;
	description: string;
	damageBonus: number;
	procChance: number;
}

export const WEAPON_EFFECT_DEFS: Record<WeaponEffect, WeaponEffectDef> = {
	vampiric: {
		name: 'Vampiric',
		description: 'Drains life from the target, healing the wielder.',
		damageBonus: 1,
		procChance: 0.25,
	},
	flaming: {
		name: 'Flaming',
		description: 'Wreathed in fire, scorching foes on impact.',
		damageBonus: 3,
		procChance: 0.30,
	},
	freezing: {
		name: 'Freezing',
		description: 'Radiates bitter cold, slowing enemies struck.',
		damageBonus: 2,
		procChance: 0.25,
	},
	thunderstrike: {
		name: 'Thunderstrike',
		description: 'Channels lightning through the blade, stunning on hit.',
		damageBonus: 4,
		procChance: 0.15,
	},
	vorpal: {
		name: 'Vorpal',
		description: 'Impossibly sharp — a chance to deal devastating critical strikes.',
		damageBonus: 8,
		procChance: 0.10,
	},
	phasing: {
		name: 'Phasing',
		description: 'Passes through armor, ignoring physical defenses.',
		damageBonus: 2,
		procChance: 0.35,
	},
	berserker: {
		name: 'Berserker',
		description: 'Grows fiercer with each blow landed in quick succession.',
		damageBonus: 5,
		procChance: 0.20,
	},
	guardian: {
		name: 'Guardian',
		description: 'Retaliates against attackers, dealing damage when the wielder is struck.',
		damageBonus: 3,
		procChance: 0.30,
	},
	venomous: {
		name: 'Venomous',
		description: 'Coated in a virulent toxin that poisons on contact.',
		damageBonus: 2,
		procChance: 0.35,
	},
	lunar: {
		name: 'Lunar',
		description: 'Channels pale moonlight — stronger at night, weaker by day.',
		damageBonus: 4,
		procChance: 0.20,
	},
};

// ---------------------------------------------------------------------------
// Set definitions
// ---------------------------------------------------------------------------

export interface SetBonus {
	piecesRequired: number;
	stats: ItemStats;
	description: string;
}

export interface SetDef {
	id: string;
	name: string;
	pieces: string[];
	bonuses: SetBonus[];
}

export const SET_DEFS: SetDef[] = [
	{
		id: 'shadow_assassin',
		name: 'Shadow Assassin',
		pieces: ['shadow_cowl', 'shadow_leathers', 'shadow_cloak', 'shadow_dagger', 'shadow_boots_l', 'shadow_boots_r'],
		bonuses: [
			{
				piecesRequired: 2,
				stats: { stealthBonus: 3, noiseReduction: 2 },
				description: 'Footsteps grow silent. +3 Stealth, +2 Noise Reduction.',
			},
			{
				piecesRequired: 3,
				stats: { dodgeChance: 10, atk: 2 },
				description: 'Shadows cling to the wearer. +10% Dodge, +2 ATK.',
			},
		],
	},
	{
		id: 'ironforge_bulwark',
		name: 'Ironforge Bulwark',
		pieces: ['ironforge_helm', 'ironforge_plate', 'ironforge_greaves', 'ironforge_shield', 'ironforge_gauntlets'],
		bonuses: [
			{
				piecesRequired: 2,
				stats: { hp: 8 },
				description: 'Dwarven steel hardens the body. +8 HP.',
			},
			{
				piecesRequired: 3,
				stats: { hp: 5, dodgeChance: -5, atk: 3 },
				description: 'Unyielding as the mountain. +5 HP, +3 ATK, -5% Dodge.',
			},
		],
	},
	{
		id: 'storm_king_regalia',
		name: "Storm King's Regalia",
		pieces: ['storm_crown', 'storm_robe', 'storm_staff', 'storm_ring', 'storm_mantle'],
		bonuses: [
			{
				piecesRequired: 2,
				stats: { sight: 3, atk: 1 },
				description: 'Lightning dances at the fingertips. +3 Sight, +1 ATK.',
			},
			{
				piecesRequired: 3,
				stats: { atk: 4, hp: 3 },
				description: 'The storm answers the caster. +4 ATK, +3 HP.',
			},
		],
	},
	{
		id: 'healers_devotion',
		name: "Healer's Devotion",
		pieces: ['devotion_circlet', 'devotion_vestment', 'devotion_staff', 'devotion_sandals_l', 'devotion_sandals_r'],
		bonuses: [
			{
				piecesRequired: 2,
				stats: { hp: 10 },
				description: 'A warm light surrounds the wearer. +10 HP.',
			},
			{
				piecesRequired: 3,
				stats: { hp: 5, sight: 2 },
				description: 'The devoted see what others cannot. +5 HP, +2 Sight.',
			},
		],
	},
	{
		id: 'rangers_wild',
		name: "Ranger's Wild Set",
		pieces: ['wild_hood', 'wild_jerkin', 'wild_bow', 'wild_cloak', 'wild_boots_l', 'wild_boots_r'],
		bonuses: [
			{
				piecesRequired: 2,
				stats: { sight: 3, stealthBonus: 2 },
				description: 'The wilds welcome a kindred spirit. +3 Sight, +2 Stealth.',
			},
			{
				piecesRequired: 3,
				stats: { atk: 3, dodgeChance: 8, noiseReduction: 3 },
				description: 'One with the forest. +3 ATK, +8% Dodge, +3 Noise Reduction.',
			},
		],
	},
];

// ---------------------------------------------------------------------------
// Artifact catalog — legendary items with lore descriptions
// ---------------------------------------------------------------------------

export const ARTIFACT_CATALOG: Record<string, Item> = {
	shadowfang: {
		id: 'shadowfang',
		name: 'Shadowfang',
		char: '|',
		color: '#fa4',
		type: 'equipment',
		description: 'A dagger forged in the lightless depths beneath the Thornlands. Legend holds it was the blade that the Ascended god Velkar used to sever his mortal name. It drinks blood as eagerly as its maker once drank wine.',
		slot: 'rightHand',
		stats: { atk: 5, stealthBonus: 4 },
		rarity: 'legendary',
		isArtifact: true,
		weaponEffect: 'vampiric',
		setId: 'shadow_assassin',
	},
	crown_of_the_lich_king: {
		id: 'crown_of_the_lich_king',
		name: 'Crown of the Lich King',
		char: '^',
		color: '#fa4',
		type: 'equipment',
		description: 'A circlet of blackened bone, worn by Serathis the Undying before his ascension. Those who wear it hear whispers of the dead — fragments of lives consumed to fuel a mortal\'s climb to godhood.',
		slot: 'head',
		stats: { atk: 4, sight: 3, hp: -3 },
		rarity: 'legendary',
		isArtifact: true,
	},
	aegis_of_dawn: {
		id: 'aegis_of_dawn',
		name: 'Aegis of Dawn',
		char: ']',
		color: '#fa4',
		type: 'equipment',
		description: 'A shield of white steel that never tarnishes, said to be a relic of the age before the Seven claimed their thrones. Its radiance burns the undead and shames creatures of shadow.',
		slot: 'rightHand',
		stats: { hp: 12, atk: 1 },
		rarity: 'legendary',
		isArtifact: true,
		weaponEffect: 'guardian',
	},
	hungering_blade: {
		id: 'hungering_blade',
		name: 'Hungering Blade',
		char: '/',
		color: '#fa4',
		type: 'equipment',
		description: 'A greatsword with a single ravenous eye set in its crossguard. It was wielded by the warlord Kharnn before the gods struck him down — or so the temples claim. The blade still screams for battle.',
		slot: 'leftHand',
		stats: { atk: 7, hp: -5 },
		rarity: 'legendary',
		isArtifact: true,
		weaponEffect: 'berserker',
	},
	veil_of_the_forgotten: {
		id: 'veil_of_the_forgotten',
		name: 'Veil of the Forgotten',
		char: '}',
		color: '#fa4',
		type: 'equipment',
		description: 'A gossamer cloak woven from the dreams of a civilization erased from history by the Ascended. Wearing it makes the bearer difficult to perceive, as though reality itself forgets they exist.',
		slot: 'back',
		stats: { stealthBonus: 8, noiseReduction: 5, dodgeChance: 12 },
		rarity: 'legendary',
		isArtifact: true,
	},
	stormcaller: {
		id: 'stormcaller',
		name: 'Stormcaller',
		char: '|',
		color: '#fa4',
		type: 'equipment',
		description: 'A staff carved from a branch of the Worldtree, struck by divine lightning during the war among the Original Seven. Arcs of electricity still crackle along its length, hungry for a conduit.',
		slot: 'leftHand',
		stats: { atk: 5, sight: 3 },
		rarity: 'legendary',
		isArtifact: true,
		weaponEffect: 'thunderstrike',
		setId: 'storm_king_regalia',
	},
	the_first_nail: {
		id: 'the_first_nail',
		name: 'The First Nail',
		char: '|',
		color: '#fa4',
		type: 'equipment',
		description: 'An iron spike driven through the palm of the god Mordren when he was still mortal and sentenced to die. He pulled it free, killed his executioners, and kept it as a reminder. It grants strength born of spite.',
		slot: 'rightHand',
		stats: { atk: 6 },
		rarity: 'legendary',
		isArtifact: true,
		weaponEffect: 'vorpal',
	},
	mantle_of_false_divinity: {
		id: 'mantle_of_false_divinity',
		name: 'Mantle of False Divinity',
		char: 'T',
		color: '#fa4',
		type: 'equipment',
		description: 'Robes once worn by the high priest who discovered the truth of the Seven — that they were mortals who murdered their way to heaven. He was silenced, but his vestments endure, humming with stolen prayer.',
		slot: 'body',
		stats: { hp: 10, sight: 2, atk: 2 },
		rarity: 'legendary',
		isArtifact: true,
	},
	moonreaver: {
		id: 'moonreaver',
		name: 'Moonreaver',
		char: '/',
		color: '#fa4',
		type: 'equipment',
		description: 'A curved blade that shimmers with pale silver light. Smithed during a lunar eclipse in the old kingdom of Astheriel, it was the weapon of the Moon Wardens before the Ascended disbanded them for knowing too much.',
		slot: 'leftHand',
		stats: { atk: 5, sight: 2 },
		rarity: 'legendary',
		isArtifact: true,
		weaponEffect: 'lunar',
	},
	serpents_kiss: {
		id: 'serpents_kiss',
		name: "Serpent's Kiss",
		char: '/',
		color: '#fa4',
		type: 'equipment',
		description: 'A slender rapier with a blade that weeps green venom. It belonged to Ithara, the poisoner who became a goddess. The faithful say she purified the wicked. The blade tells a different story.',
		slot: 'leftHand',
		stats: { atk: 4, dodgeChance: 6 },
		rarity: 'legendary',
		isArtifact: true,
		weaponEffect: 'venomous',
	},
	frostwardens_grasp: {
		id: 'frostwardens_grasp',
		name: "Frostwarden's Grasp",
		char: '(',
		color: '#fa4',
		type: 'equipment',
		description: 'Gauntlets of ice-blue steel that never warm. Forged by the order sworn to guard the Pale Gate — the passage the Original Seven used to reach the divine realm before the Ascended sealed it forever.',
		slot: 'rightHand',
		stats: { hp: 6, atk: 3 },
		rarity: 'legendary',
		isArtifact: true,
		weaponEffect: 'freezing',
	},
	ashen_crown: {
		id: 'ashen_crown',
		name: 'Ashen Crown',
		char: '^',
		color: '#fa4',
		type: 'equipment',
		description: 'A crown of charred iron, fused from the melted crowns of seven mortal kings who refused to worship the Ascended. Wearing it fills the mind with their final, defiant thoughts.',
		slot: 'head',
		stats: { hp: 8, atk: 2, sight: 1 },
		rarity: 'legendary',
		isArtifact: true,
	},
};

// ---------------------------------------------------------------------------
// Enchantment definitions
// ---------------------------------------------------------------------------

const ENCHANTMENT_TYPES: EnchantmentType[] = [
	'fire_damage',
	'frost_damage',
	'life_steal',
	'mana_steal',
	'thorns',
	'fortify',
];

const ENCHANTMENT_NAMES: Record<EnchantmentType, string> = {
	fire_damage: 'Fire Damage',
	frost_damage: 'Frost Damage',
	life_steal: 'Life Steal',
	mana_steal: 'Mana Steal',
	thorns: 'Thorns',
	fortify: 'Fortify',
};

// ---------------------------------------------------------------------------
// Helper: RNG abstraction
// ---------------------------------------------------------------------------

interface Rng {
	next(): number;
}

const defaultRng: Rng = {
	next: () => Math.random(),
};

// ---------------------------------------------------------------------------
// Rarity helpers
// ---------------------------------------------------------------------------

export function rarityColor(rarity: ItemRarity): string {
	return RARITY_COLORS[rarity];
}

export function rarityName(rarity: ItemRarity): string {
	switch (rarity) {
		case 'common': return 'Common';
		case 'uncommon': return 'Uncommon';
		case 'rare': return 'Rare';
		case 'epic': return 'Epic';
		case 'legendary': return 'Legendary';
	}
}

/**
 * Roll a rarity based on dungeon level.
 * Higher levels shift the distribution toward rarer tiers.
 */
export function getRarityForLevel(level: number, rng?: Rng): ItemRarity {
	const r = (rng ?? defaultRng).next();

	// Thresholds shift with level — each level adds ~1.5% to higher tiers
	const legendaryThreshold = Math.max(0.99 - level * 0.005, 0.90);
	const epicThreshold = Math.max(0.95 - level * 0.010, 0.75);
	const rareThreshold = Math.max(0.85 - level * 0.015, 0.55);
	const uncommonThreshold = Math.max(0.60 - level * 0.015, 0.30);

	if (r >= legendaryThreshold) return 'legendary';
	if (r >= epicThreshold) return 'epic';
	if (r >= rareThreshold) return 'rare';
	if (r >= uncommonThreshold) return 'uncommon';
	return 'common';
}

// ---------------------------------------------------------------------------
// Item generation
// ---------------------------------------------------------------------------

/**
 * Create a copy of a base item with randomised rarity, scaled stats,
 * and possible enchantments based on dungeon level.
 */
export function generateRandomItem(level: number, baseItemId: string, rng?: Rng): Item {
	const base = ITEM_CATALOG[baseItemId];
	if (!base) {
		throw new Error(`Unknown base item id: ${baseItemId}`);
	}

	const r = rng ?? defaultRng;
	const rarity = getRarityForLevel(level, r);
	const multiplier = RARITY_STAT_MULTIPLIER[rarity];

	// Deep-copy and scale stats
	const scaledStats: ItemStats | undefined = base.stats
		? {
			hp: base.stats.hp !== undefined ? Math.round(base.stats.hp * multiplier) : undefined,
			atk: base.stats.atk !== undefined ? Math.round(base.stats.atk * multiplier) : undefined,
			sight: base.stats.sight !== undefined ? Math.round(base.stats.sight * multiplier) : undefined,
			dodgeChance: base.stats.dodgeChance !== undefined ? Math.round(base.stats.dodgeChance * multiplier) : undefined,
			stealthBonus: base.stats.stealthBonus !== undefined ? Math.round(base.stats.stealthBonus * multiplier) : undefined,
			noiseReduction: base.stats.noiseReduction !== undefined ? Math.round(base.stats.noiseReduction * multiplier) : undefined,
		}
		: undefined;

	let item: Item = {
		...base,
		id: `${base.id}_${Date.now()}_${Math.floor(r.next() * 100000)}`,
		stats: scaledStats,
		rarity,
		color: RARITY_COLORS[rarity],
	};

	// Add enchantments for uncommon+ items
	const enchantCount =
		rarity === 'legendary' ? 2 :
		rarity === 'epic' ? 2 :
		rarity === 'rare' ? 1 :
		rarity === 'uncommon' ? (r.next() < 0.5 ? 1 : 0) :
		0;

	for (let i = 0; i < enchantCount; i++) {
		item = addRandomEnchantment(item, level, r);
	}

	// Prefix name with rarity for non-common items
	if (rarity !== 'common') {
		item.name = `${rarityName(rarity)} ${base.name}`;
	}

	return item;
}

/**
 * Add a random enchantment to an item. Returns a new Item with the enchantment appended.
 */
export function addRandomEnchantment(item: Item, level: number, rng?: Rng): Item {
	const r = rng ?? defaultRng;
	const enchType = ENCHANTMENT_TYPES[Math.floor(r.next() * ENCHANTMENT_TYPES.length)];

	// Potency scales with level: base 1-3, +1 per 3 levels
	const basePotency = Math.floor(r.next() * 3) + 1;
	const levelBonus = Math.floor(level / 3);
	const potency = basePotency + levelBonus;

	const enchantment: Enchantment = { type: enchType, potency };
	const existing = item.enchantments ?? [];

	return {
		...item,
		enchantments: [...existing, enchantment],
	};
}

// ---------------------------------------------------------------------------
// Set bonus calculation
// ---------------------------------------------------------------------------

/**
 * Given the player's equipped items (including nulls for empty slots),
 * determine which sets are partially or fully active and sum their bonuses.
 */
export function getSetBonuses(equippedItems: (Item | null)[]): ItemStats {
	const totals: ItemStats = {
		hp: 0,
		atk: 0,
		sight: 0,
		dodgeChance: 0,
		stealthBonus: 0,
		noiseReduction: 0,
	};

	// Count equipped pieces per set
	const setCounts: Record<string, number> = {};
	for (const item of equippedItems) {
		if (item?.setId) {
			setCounts[item.setId] = (setCounts[item.setId] ?? 0) + 1;
		}
	}

	// Apply qualifying bonuses
	for (const setDef of SET_DEFS) {
		const count = setCounts[setDef.id] ?? 0;
		if (count < 2) continue;

		for (const bonus of setDef.bonuses) {
			if (count >= bonus.piecesRequired) {
				totals.hp! += bonus.stats.hp ?? 0;
				totals.atk! += bonus.stats.atk ?? 0;
				totals.sight! += bonus.stats.sight ?? 0;
				totals.dodgeChance! += bonus.stats.dodgeChance ?? 0;
				totals.stealthBonus! += bonus.stats.stealthBonus ?? 0;
				totals.noiseReduction! += bonus.stats.noiseReduction ?? 0;
			}
		}
	}

	return totals;
}

// ---------------------------------------------------------------------------
// Weapon effect resolution
// ---------------------------------------------------------------------------

export interface WeaponEffectResult {
	damage: number;
	procced: boolean;
	message: string;
}

/**
 * Resolve a weapon effect during combat. Returns the final damage,
 * whether the special effect procced, and a descriptive message.
 */
export function applyWeaponEffect(effect: WeaponEffect, baseDamage: number, rng?: () => number): WeaponEffectResult {
	const def = WEAPON_EFFECT_DEFS[effect];
	const roll = (rng ?? Math.random)();
	const procced = roll < def.procChance;

	if (!procced) {
		return { damage: baseDamage, procced: false, message: '' };
	}

	const totalDamage = baseDamage + def.damageBonus;

	switch (effect) {
		case 'vampiric':
			return { damage: totalDamage, procced: true, message: `${def.name}! Drained ${def.damageBonus} life from the enemy.` };
		case 'flaming':
			return { damage: totalDamage, procced: true, message: `${def.name}! The target is engulfed in flame for ${def.damageBonus} extra damage.` };
		case 'freezing':
			return { damage: totalDamage, procced: true, message: `${def.name}! The target is chilled, slowed by biting frost.` };
		case 'thunderstrike':
			return { damage: totalDamage, procced: true, message: `${def.name}! Lightning arcs through the target for ${def.damageBonus} extra damage.` };
		case 'vorpal':
			return { damage: totalDamage, procced: true, message: `${def.name}! A devastating critical strike for ${def.damageBonus} extra damage!` };
		case 'phasing':
			return { damage: totalDamage, procced: true, message: `${def.name}! The blade passes through armor, ignoring defenses.` };
		case 'berserker':
			return { damage: totalDamage, procced: true, message: `${def.name}! Battle frenzy surges — ${def.damageBonus} extra damage.` };
		case 'guardian':
			return { damage: totalDamage, procced: true, message: `${def.name}! A retaliatory strike lashes out for ${def.damageBonus} extra damage.` };
		case 'venomous':
			return { damage: totalDamage, procced: true, message: `${def.name}! Venom seeps into the wound for ${def.damageBonus} extra damage.` };
		case 'lunar':
			return { damage: totalDamage, procced: true, message: `${def.name}! Moonlight flares, dealing ${def.damageBonus} extra damage.` };
	}
}
