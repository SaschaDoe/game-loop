export type EquipmentSlot = 'head' | 'body' | 'trouser' | 'leftHand' | 'rightHand' | 'back' | 'leftFoot' | 'rightFoot';

export type ItemType = 'equipment' | 'book' | 'consumable' | 'misc';

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type EnchantmentType = 'fire_damage' | 'frost_damage' | 'life_steal' | 'mana_steal' | 'thorns' | 'fortify';

export interface Enchantment {
	type: EnchantmentType;
	potency: number;
}

export type WeaponEffect = 'vampiric' | 'flaming' | 'freezing' | 'thunderstrike' | 'vorpal' | 'phasing' | 'berserker' | 'guardian' | 'venomous' | 'lunar';

export interface ItemStats {
	hp?: number;
	atk?: number;
	sight?: number;
	dodgeChance?: number;
	stealthBonus?: number;
	noiseReduction?: number;
}

export interface Item {
	id: string;
	name: string;
	char: string;
	color: string;
	type: ItemType;
	description: string;
	slot?: EquipmentSlot;
	stats?: ItemStats;
	pages?: string[];
	consumeEffect?: { hp?: number; hunger?: number; thirst?: number; mana?: number };
	rarity?: ItemRarity;
	enchantments?: Enchantment[];
	weaponEffect?: WeaponEffect;
	setId?: string;
	isArtifact?: boolean;
	teachesRitual?: string;
}

export type ContainerSize = 'small' | 'medium' | 'big';

export interface WorldContainer {
	id: string;
	pos: { x: number; y: number };
	size: ContainerSize;
	items: Item[];
	char: string;
	color: string;
	name: string;
}

export interface Equipment {
	head: Item | null;
	body: Item | null;
	trouser: Item | null;
	leftHand: Item | null;
	rightHand: Item | null;
	back: Item | null;
	leftFoot: Item | null;
	rightFoot: Item | null;
}

export const INVENTORY_SIZE = 12;

export const CONTAINER_SLOTS: Record<ContainerSize, number> = {
	small: 1,
	medium: 8,
	big: 100,
};

export const SLOT_DISPLAY: Record<EquipmentSlot, { label: string; icon: string }> = {
	head: { label: 'Head', icon: '^' },
	body: { label: 'Body', icon: 'T' },
	trouser: { label: 'Legs', icon: 'H' },
	leftHand: { label: 'L.Hand', icon: '(' },
	rightHand: { label: 'R.Hand', icon: ')' },
	back: { label: 'Back', icon: '}' },
	leftFoot: { label: 'L.Foot', icon: 'L' },
	rightFoot: { label: 'R.Foot', icon: 'J' },
};

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

export function createEmptyEquipment(): Equipment {
	return {
		head: null,
		body: null,
		trouser: null,
		leftHand: null,
		rightHand: null,
		back: null,
		leftFoot: null,
		rightFoot: null,
	};
}

export function createEmptyInventory(): (Item | null)[] {
	return Array.from({ length: INVENTORY_SIZE }, () => null);
}

export function addToInventory(inventory: (Item | null)[], item: Item): boolean {
	const emptyIndex = inventory.indexOf(null);
	if (emptyIndex === -1) return false;
	inventory[emptyIndex] = item;
	return true;
}

export function removeFromInventory(inventory: (Item | null)[], index: number): Item | null {
	if (index < 0 || index >= inventory.length) return null;
	const item = inventory[index];
	inventory[index] = null;
	return item;
}

export function equipItem(
	inventory: (Item | null)[],
	equipment: Equipment,
	inventoryIndex: number,
): { success: boolean; message: string } {
	const item = inventory[inventoryIndex];
	if (!item) {
		return { success: false, message: 'No item at that inventory slot.' };
	}
	if (item.type !== 'equipment' || !item.slot) {
		return { success: false, message: `${item.name} cannot be equipped.` };
	}

	const slot = item.slot;
	const currentlyEquipped = equipment[slot];

	// Remove item from inventory
	inventory[inventoryIndex] = null;

	if (currentlyEquipped) {
		// Swap: put the previously equipped item into the now-empty inventory slot
		inventory[inventoryIndex] = currentlyEquipped;
	}

	equipment[slot] = item;

	if (currentlyEquipped) {
		return { success: true, message: `Equipped ${item.name}, unequipped ${currentlyEquipped.name}.` };
	}
	return { success: true, message: `Equipped ${item.name}.` };
}

export function unequipItem(
	inventory: (Item | null)[],
	equipment: Equipment,
	slot: EquipmentSlot,
): { success: boolean; message: string } {
	const item = equipment[slot];
	if (!item) {
		return { success: false, message: 'Nothing equipped in that slot.' };
	}

	const emptyIndex = inventory.indexOf(null);
	if (emptyIndex === -1) {
		return { success: false, message: 'Inventory is full.' };
	}

	inventory[emptyIndex] = item;
	equipment[slot] = null;
	return { success: true, message: `Unequipped ${item.name}.` };
}

export function getEquipmentBonuses(equipment: Equipment): ItemStats {
	const totals: ItemStats = { hp: 0, atk: 0, sight: 0, dodgeChance: 0, stealthBonus: 0, noiseReduction: 0 };

	for (const slot of Object.values(equipment)) {
		if (slot && slot.stats) {
			totals.hp! += slot.stats.hp ?? 0;
			totals.atk! += slot.stats.atk ?? 0;
			totals.sight! += slot.stats.sight ?? 0;
			totals.dodgeChance! += slot.stats.dodgeChance ?? 0;
			totals.stealthBonus! += slot.stats.stealthBonus ?? 0;
			totals.noiseReduction! += slot.stats.noiseReduction ?? 0;
		}
	}

	return totals;
}

export function containerCapacity(size: ContainerSize): number {
	return CONTAINER_SLOTS[size];
}

export function addToContainer(container: WorldContainer, item: Item): boolean {
	if (container.items.length >= containerCapacity(container.size)) return false;
	container.items.push(item);
	return true;
}

export function removeFromContainer(container: WorldContainer, index: number): Item | null {
	if (index < 0 || index >= container.items.length) return null;
	return container.items.splice(index, 1)[0];
}

// ---------------------------------------------------------------------------
// Item catalog
// ---------------------------------------------------------------------------

export const ITEM_CATALOG: Record<string, Item> = {
	// --- Equipment: Weapons ---
	rusty_sword: {
		id: 'rusty_sword',
		name: 'Rusty Sword',
		char: '/',
		color: '#aa8844',
		type: 'equipment',
		description: 'A sword covered in rust. Still sharp enough to cut.',
		slot: 'leftHand',
		stats: { atk: 1 },
	},
	iron_sword: {
		id: 'iron_sword',
		name: 'Iron Sword',
		char: '/',
		color: '#aaaacc',
		type: 'equipment',
		description: 'A solid iron blade, reliable in combat.',
		slot: 'leftHand',
		stats: { atk: 2 },
	},
	steel_sword: {
		id: 'steel_sword',
		name: 'Steel Sword',
		char: '/',
		color: '#ccccee',
		type: 'equipment',
		description: 'A finely forged steel sword with a keen edge.',
		slot: 'leftHand',
		stats: { atk: 3 },
	},
	dagger: {
		id: 'dagger',
		name: 'Dagger',
		char: '|',
		color: '#cccccc',
		type: 'equipment',
		description: 'A short blade suited for quick strikes.',
		slot: 'rightHand',
		stats: { atk: 1 },
	},
	mage_staff: {
		id: 'mage_staff',
		name: 'Mage Staff',
		char: '|',
		color: '#aa88ff',
		type: 'equipment',
		description: 'A staff imbued with faint arcane energy. Sharpens the senses.',
		slot: 'leftHand',
		stats: { atk: 1, sight: 2 },
	},

	// --- Equipment: Shields ---
	wooden_shield: {
		id: 'wooden_shield',
		name: 'Wooden Shield',
		char: ']',
		color: '#aa8844',
		type: 'equipment',
		description: 'A round shield of sturdy oak.',
		slot: 'rightHand',
		stats: { hp: 3 },
	},
	iron_shield: {
		id: 'iron_shield',
		name: 'Iron Shield',
		char: ']',
		color: '#aaaacc',
		type: 'equipment',
		description: 'A heavy iron shield that absorbs punishment.',
		slot: 'rightHand',
		stats: { hp: 5 },
	},

	// --- Equipment: Head ---
	leather_cap: {
		id: 'leather_cap',
		name: 'Leather Cap',
		char: '^',
		color: '#aa8844',
		type: 'equipment',
		description: 'A simple cap of tanned leather.',
		slot: 'head',
		stats: { hp: 1 },
	},
	iron_helm: {
		id: 'iron_helm',
		name: 'Iron Helm',
		char: '^',
		color: '#aaaacc',
		type: 'equipment',
		description: 'A sturdy iron helmet that limits peripheral vision.',
		slot: 'head',
		stats: { hp: 3 },
	},

	// --- Equipment: Body ---
	cloth_robe: {
		id: 'cloth_robe',
		name: 'Cloth Robe',
		char: 'T',
		color: '#8888cc',
		type: 'equipment',
		description: 'A light robe favoured by scholars and wanderers.',
		slot: 'body',
		stats: { hp: 1, sight: 1 },
	},
	leather_armor: {
		id: 'leather_armor',
		name: 'Leather Armor',
		char: 'T',
		color: '#aa8844',
		type: 'equipment',
		description: 'Hardened leather plates stitched together for protection.',
		slot: 'body',
		stats: { hp: 3 },
	},
	chainmail: {
		id: 'chainmail',
		name: 'Chainmail',
		char: 'T',
		color: '#aaaacc',
		type: 'equipment',
		description: 'Interlocking iron rings. Heavy, but protective.',
		slot: 'body',
		stats: { hp: 5, sight: -1 },
	},

	// --- Equipment: Legs ---
	iron_greaves: {
		id: 'iron_greaves',
		name: 'Iron Greaves',
		char: 'H',
		color: '#aaaacc',
		type: 'equipment',
		description: 'Iron leg guards that protect the shins and thighs.',
		slot: 'trouser',
		stats: { hp: 2 },
	},

	// --- Equipment: Feet ---
	leather_boot_left: {
		id: 'leather_boot_left',
		name: 'Leather Boot (L)',
		char: 'b',
		color: '#aa8844',
		type: 'equipment',
		description: 'A sturdy leather boot for the left foot.',
		slot: 'leftFoot',
		stats: { hp: 1 },
	},
	leather_boot_right: {
		id: 'leather_boot_right',
		name: 'Leather Boot (R)',
		char: 'b',
		color: '#aa8844',
		type: 'equipment',
		description: 'A sturdy leather boot for the right foot.',
		slot: 'rightFoot',
		stats: { hp: 1 },
	},

	// --- Equipment: Back ---
	traveler_cloak: {
		id: 'traveler_cloak',
		name: "Traveler's Cloak",
		char: '}',
		color: '#668844',
		type: 'equipment',
		description: 'A weathered cloak that sharpens awareness of the surroundings.',
		slot: 'back',
		stats: { sight: 1 },
	},

	// --- Equipment: Ranger ---
	shortbow: {
		id: 'shortbow',
		name: 'Shortbow',
		char: ')',
		color: '#aa8844',
		type: 'equipment',
		description: 'A compact bow suited for quick shots in the wild.',
		slot: 'leftHand',
		stats: { atk: 2, sight: 1 },
		rarity: 'common',
	},
	quiver: {
		id: 'quiver',
		name: 'Quiver',
		char: '}',
		color: '#aa8844',
		type: 'equipment',
		description: 'A leather quiver stocked with arrows.',
		slot: 'back',
		stats: { atk: 1 },
		rarity: 'common',
	},
	ranger_cloak: {
		id: 'ranger_cloak',
		name: "Ranger's Cloak",
		char: '}',
		color: '#4a6',
		type: 'equipment',
		description: 'A camouflage cloak woven with forest fibers.',
		slot: 'back',
		stats: { sight: 1, stealthBonus: 10 },
		rarity: 'uncommon',
	},

	// --- Equipment: Cleric ---
	holy_mace: {
		id: 'holy_mace',
		name: 'Holy Mace',
		char: '/',
		color: '#ffd700',
		type: 'equipment',
		description: 'A blunt weapon blessed by prayer. Effective against the undead.',
		slot: 'leftHand',
		stats: { atk: 2, hp: 1 },
		rarity: 'common',
	},
	holy_symbol: {
		id: 'holy_symbol',
		name: 'Holy Symbol',
		char: '+',
		color: '#ffd700',
		type: 'equipment',
		description: 'A sacred emblem that channels divine light.',
		slot: 'rightHand',
		stats: { hp: 3 },
		rarity: 'common',
	},

	// --- Equipment: Paladin ---
	paladin_sword: {
		id: 'paladin_sword',
		name: 'Crusader Blade',
		char: '/',
		color: '#eeeeff',
		type: 'equipment',
		description: 'A broad sword inscribed with oaths of protection.',
		slot: 'leftHand',
		stats: { atk: 2 },
		rarity: 'common',
	},
	tower_shield: {
		id: 'tower_shield',
		name: 'Tower Shield',
		char: ']',
		color: '#ccccdd',
		type: 'equipment',
		description: 'A massive shield that can block nearly anything.',
		slot: 'rightHand',
		stats: { hp: 7 },
		rarity: 'common',
	},
	plate_helm: {
		id: 'plate_helm',
		name: 'Plate Helm',
		char: '^',
		color: '#ccccdd',
		type: 'equipment',
		description: 'A heavy helm of forged steel plates.',
		slot: 'head',
		stats: { hp: 4, sight: -1 },
		rarity: 'common',
	},

	// --- Equipment: Necromancer ---
	bone_staff: {
		id: 'bone_staff',
		name: 'Bone Staff',
		char: '|',
		color: '#aaa088',
		type: 'equipment',
		description: 'A staff carved from the femur of a giant. Hums with death magic.',
		slot: 'leftHand',
		stats: { atk: 3 },
		rarity: 'uncommon',
	},
	death_shroud: {
		id: 'death_shroud',
		name: 'Death Shroud',
		char: '}',
		color: '#666',
		type: 'equipment',
		description: 'A tattered cloak that reeks of the grave.',
		slot: 'back',
		stats: { hp: 2, stealthBonus: 5 },
		rarity: 'common',
	},

	// --- Equipment: Bard ---
	rapier: {
		id: 'rapier',
		name: 'Rapier',
		char: '/',
		color: '#ccddff',
		type: 'equipment',
		description: 'A slender blade for dashing swordplay.',
		slot: 'leftHand',
		stats: { atk: 2 },
		rarity: 'common',
	},
	lute: {
		id: 'lute',
		name: 'Lute',
		char: 'J',
		color: '#da8',
		type: 'equipment',
		description: 'A well-tuned instrument that inspires courage in allies.',
		slot: 'rightHand',
		stats: { hp: 2 },
		rarity: 'common',
	},
	fancy_hat: {
		id: 'fancy_hat',
		name: 'Fancy Hat',
		char: '^',
		color: '#f4a',
		type: 'equipment',
		description: 'A flamboyant hat with a long feather. Boosts confidence.',
		slot: 'head',
		stats: { sight: 1 },
		rarity: 'common',
	},

	// --- Consumables ---
	health_potion: {
		id: 'health_potion',
		name: 'Health Potion',
		char: '!',
		color: '#ff88aa',
		type: 'consumable',
		description: 'A bubbling red liquid that mends wounds.',
		consumeEffect: { hp: 10 },
	},
	bread: {
		id: 'bread',
		name: 'Bread',
		char: '%',
		color: '#cc9944',
		type: 'consumable',
		description: 'A hearty loaf of bread. Filling and simple.',
		consumeEffect: { hunger: 20 },
	},
	water_flask: {
		id: 'water_flask',
		name: 'Water Flask',
		char: 'u',
		color: '#4488ff',
		type: 'consumable',
		description: 'A flask of clean water.',
		consumeEffect: { thirst: 25 },
	},
	antidote: {
		id: 'antidote',
		name: 'Antidote',
		char: '!',
		color: '#44ff88',
		type: 'consumable',
		description: 'A bitter draught that purges toxins from the body.',
		consumeEffect: { hp: 3 },
	},
	elixir: {
		id: 'elixir',
		name: 'Elixir',
		char: '!',
		color: '#ffaa44',
		type: 'consumable',
		description: 'A potent golden elixir that restores vitality.',
		consumeEffect: { hp: 20 },
	},

	// --- Eldergrove Harvestable Plants ---
	moonpetal: {
		id: 'moonpetal',
		name: 'Moonpetal',
		char: '*',
		color: '#c8f8ff',
		type: 'consumable',
		description: 'A luminous flower that blooms only under starlight. Heals wounds and soothes pain.',
		consumeEffect: { hp: 12 },
	},
	silverleaf: {
		id: 'silverleaf',
		name: 'Silverleaf',
		char: '"',
		color: '#c0e0c0',
		type: 'consumable',
		description: 'A broad silver-veined leaf from the great silverwood trees. Restores vitality when chewed.',
		consumeEffect: { hp: 6 },
	},
	rootbark_tea: {
		id: 'rootbark_tea',
		name: 'Rootbark Tea',
		char: 'u',
		color: '#8a6040',
		type: 'consumable',
		description: 'A bitter infusion brewed from silverwood rootbark. Mends deep injuries.',
		consumeEffect: { hp: 15 },
	},
	starbloom: {
		id: 'starbloom',
		name: 'Starbloom',
		char: '*',
		color: '#ffe080',
		type: 'consumable',
		description: 'A tiny golden flower found only near Ley Line convergences. Fills the body with warmth.',
		consumeEffect: { hp: 8, hunger: 10 },
	},
	thornberry: {
		id: 'thornberry',
		name: 'Thornberry',
		char: 'o',
		color: '#c04060',
		type: 'consumable',
		description: 'Dark red berries from the briar thickets. Tart and filling, but the thorns draw blood.',
		consumeEffect: { hunger: 25 },
	},
	glowcap_mushroom: {
		id: 'glowcap_mushroom',
		name: 'Glowcap Mushroom',
		char: ',',
		color: '#60ffa0',
		type: 'consumable',
		description: 'A bioluminescent fungus that grows at the base of ancient trees. Mildly restorative.',
		consumeEffect: { hp: 5, hunger: 5 },
	},
	whispering_moss: {
		id: 'whispering_moss',
		name: 'Whispering Moss',
		char: '~',
		color: '#80c080',
		type: 'misc',
		description: 'Soft green moss that absorbs and stores sound. The elves use it to soundproof their archives. Some say the right ritual can make it speak.',
	},
	voidbloom: {
		id: 'voidbloom',
		name: 'Voidbloom',
		char: '*',
		color: '#a040ff',
		type: 'misc',
		description: 'A flower that drinks something other than sunlight. Its petals are cold to the touch and seem to pull at the edges of your vision. A sign the cage is weakening.',
	},
	elven_waybread: {
		id: 'elven_waybread',
		name: 'Elven Waybread',
		char: '%',
		color: '#e0d8a0',
		type: 'consumable',
		description: 'Thin golden bread baked by the Sylvan Elves. A single bite sustains for hours.',
		consumeEffect: { hunger: 40, hp: 3 },
	},
	spider_silk: {
		id: 'spider_silk',
		name: 'Spider Silk Bundle',
		char: '~',
		color: '#e0e0e0',
		type: 'misc',
		description: 'Strong, flexible silk harvested from giant spider webs. The elves weave it into rope and bowstrings.',
	},

	// --- Eldergrove Equipment ---
	silverwood_bow: {
		id: 'silverwood_bow',
		name: 'Silverwood Bow',
		char: ')',
		color: '#c0e0c0',
		type: 'equipment',
		description: 'A longbow carved from living silverwood. It hums faintly when drawn.',
		slot: 'leftHand',
		stats: { atk: 3, sight: 2 },
		rarity: 'rare',
	},
	warden_cloak: {
		id: 'warden_cloak',
		name: "Warden's Cloak",
		char: '}',
		color: '#6d8',
		type: 'equipment',
		description: 'A cloak woven from living vines and silverleaf. The forest itself hides you.',
		slot: 'back',
		stats: { sight: 2, stealthBonus: 15, hp: 2 },
		rarity: 'rare',
	},
	thorn_dagger: {
		id: 'thorn_dagger',
		name: 'Thorn Dagger',
		char: '|',
		color: '#4a6',
		type: 'equipment',
		description: 'A blade grown from hardened briar thorns. Wickedly sharp and laced with natural toxin.',
		slot: 'rightHand',
		stats: { atk: 2 },
		rarity: 'uncommon',
	},

	// --- Arcane Conservatory: Reagents ---
	fire_crystal: {
		id: 'fire_crystal', name: 'Fire Crystal', char: '*', color: '#f84',
		type: 'misc', description: 'A shard of crystallized flame. Warm to the touch and faintly luminous. Essential for elemental spellwork.',
	},
	frost_essence: {
		id: 'frost_essence', name: 'Frost Essence', char: '*', color: '#8df',
		type: 'misc', description: 'A vial of liquid cold that never warms. Condenses from the air in places where ice magic lingers.',
	},
	lightning_shard: {
		id: 'lightning_shard', name: 'Lightning Shard', char: '*', color: '#ff4',
		type: 'misc', description: 'A fulgurite fragment still crackling with static. Handle with dry hands.',
	},
	arcane_dust: {
		id: 'arcane_dust', name: 'Arcane Dust', char: '*', color: '#a8f',
		type: 'misc', description: 'Fine iridescent powder that shimmers between colors. The base reagent for most enchantment work.',
	},
	moonwater_vial: {
		id: 'moonwater_vial', name: 'Moonwater Vial', char: '!', color: '#ccf',
		type: 'misc', description: 'Water collected under a full moon and sealed in glass. Amplifies divination and healing recipes.',
	},
	starfern: {
		id: 'starfern', name: 'Starfern', char: '"', color: '#8fa',
		type: 'misc', description: 'A luminous fern that grows only in places touched by starlight. Its leaves are used in healing draughts.',
	},
	shadowroot: {
		id: 'shadowroot', name: 'Shadowroot', char: '"', color: '#668',
		type: 'misc', description: 'A dark, gnarled root that grows in lightless caves. Absorbs and stores magical energy.',
	},
	phoenix_ash: {
		id: 'phoenix_ash', name: 'Phoenix Ash', char: '*', color: '#fa4',
		type: 'misc', description: 'Ash from the nest of a firebird. Contains trace amounts of regenerative magic. Extremely rare.',
	},
	void_salt: {
		id: 'void_salt', name: 'Void Salt', char: '*', color: '#88a',
		type: 'misc', description: 'Black crystalline salt harvested from places where the world is thin. Tastes of nothing. Literally nothing.',
	},
	mandrake_root: {
		id: 'mandrake_root', name: 'Mandrake Root', char: '"', color: '#a84',
		type: 'misc', description: 'A gnarled root with an unsettling resemblance to a screaming face. Foundation of many alchemical brews.',
	},
	dreamleaf: {
		id: 'dreamleaf', name: 'Dreamleaf', char: '"', color: '#c8f',
		type: 'misc', description: 'Translucent leaves that curl into spirals when touched. Used in divination and dream-walking elixirs.',
	},

	// --- Ritual Tomes ---
	tome_ward_of_protection: {
		id: 'tome_ward_of_protection', name: 'Tome of Warding', char: '+', color: '#88f',
		type: 'consumable', description: 'An ancient text describing the Ward of Protection ritual.',
		teachesRitual: 'ritual_ward_of_protection',
	},
	tome_summoning_circle: {
		id: 'tome_summoning_circle', name: 'Tome of Summoning', char: '+', color: '#f8f',
		type: 'consumable', description: 'A forbidden text on summoning arcane familiars.',
		teachesRitual: 'ritual_summoning_circle',
	},
	tome_scrying: {
		id: 'tome_scrying', name: 'Tome of Scrying', char: '+', color: '#ff8',
		type: 'consumable', description: 'Crystal-etched pages reveal the art of far-sight.',
		teachesRitual: 'ritual_scrying',
	},
	tome_purification: {
		id: 'tome_purification', name: 'Tome of Purification', char: '+', color: '#8f8',
		type: 'consumable', description: 'Restoration texts from a forgotten healer-order.',
		teachesRitual: 'ritual_purification',
	},
	tome_teleportation_circle: {
		id: 'tome_teleportation_circle', name: 'Tome of Teleportation', char: '+', color: '#8ff',
		type: 'consumable', description: 'Conjuration diagrams for anchoring spatial portals.',
		teachesRitual: 'ritual_teleportation_circle',
	},
	tome_sealing: {
		id: 'tome_sealing', name: 'Tome of Sealing', char: '+', color: '#a6a',
		type: 'consumable', description: 'Shadow-bound pages describing the sealing of passages.',
		teachesRitual: 'ritual_sealing',
	},

	// --- Arcane Conservatory: Potions & Elixirs ---
	mana_potion: {
		id: 'mana_potion', name: 'Mana Potion', char: '!', color: '#88f',
		type: 'consumable', description: 'A shimmering blue draught that restores arcane energy.',
		consumeEffect: { hp: 8 },
	},
	strength_elixir: {
		id: 'strength_elixir', name: 'Elixir of Strength', char: '!', color: '#f88',
		type: 'consumable', description: 'A crimson elixir that surges through the muscles. Temporary but potent.',
		consumeEffect: { hp: 5 },
	},
	fire_resistance_potion: {
		id: 'fire_resistance_potion', name: 'Fire Resistance Draught', char: '!', color: '#f64',
		type: 'consumable', description: 'Coats the insides with a cooling film. Fire damage is halved for a time.',
		consumeEffect: { hp: 10 },
	},
	frost_ward_potion: {
		id: 'frost_ward_potion', name: 'Frost Ward Tonic', char: '!', color: '#4af',
		type: 'consumable', description: 'Warms the blood from within. Grants resistance to cold damage.',
		consumeEffect: { hp: 10 },
	},
	invisibility_draught: {
		id: 'invisibility_draught', name: 'Invisibility Draught', char: '!', color: '#ddd',
		type: 'consumable', description: 'A clear, odorless liquid that bends light around the drinker.',
		consumeEffect: { hp: 3 },
	},
	truth_serum: {
		id: 'truth_serum', name: 'Truth Serum', char: '!', color: '#ff8',
		type: 'consumable', description: 'A golden draught that loosens the tongue. Banned in most civilized courts.',
		consumeEffect: { hp: 2 },
	},
	dreamwalker_elixir: {
		id: 'dreamwalker_elixir', name: 'Dreamwalker Elixir', char: '!', color: '#c8f',
		type: 'consumable', description: 'The world goes soft at the edges. Perception sharpens beyond the physical.',
		consumeEffect: { hp: 15 },
	},
	transmutation_philter: {
		id: 'transmutation_philter', name: 'Transmutation Philter', char: '!', color: '#fa8',
		type: 'consumable', description: 'Volatile. The label says DO NOT SHAKE. Someone has underlined it three times.',
		consumeEffect: { hp: 8 },
	},
	philosophers_draught: {
		id: 'philosophers_draught', name: "Philosopher's Draught", char: '!', color: '#ff4',
		type: 'consumable', description: 'The pinnacle of alchemical achievement. Every wound heals. Every doubt clears.',
		consumeEffect: { hp: 30 },
		rarity: 'legendary',
	},
	fortification_elixir: {
		id: 'fortification_elixir', name: 'Fortification Elixir', char: '!', color: '#a86',
		type: 'consumable', description: 'The skin hardens momentarily. Not comfortable, but effective.',
		consumeEffect: { hp: 12 },
	},

	// --- Arcane Conservatory: Equipment ---
	apprentice_robes: {
		id: 'apprentice_robes', name: 'Apprentice Robes', char: 'T', color: '#88f',
		type: 'equipment', description: 'Standard-issue Conservatory robes. The embroidered sigils provide minor magical protection.',
		slot: 'body', stats: { hp: 2, sight: 1 }, rarity: 'uncommon',
	},
	scholar_hat: {
		id: 'scholar_hat', name: "Scholar's Hat", char: '^', color: '#a8f',
		type: 'equipment', description: 'A pointed hat favored by Conservatory academics. The brim is enchanted to keep rain off manuscripts.',
		slot: 'head', stats: { sight: 1, hp: 1 }, rarity: 'uncommon',
	},
	enchanted_wand: {
		id: 'enchanted_wand', name: 'Enchanted Wand', char: '/', color: '#c8f',
		type: 'equipment', description: 'A wand of white oak inlaid with arcane silver. Focuses magical energy with precision.',
		slot: 'rightHand', stats: { atk: 2, sight: 1 }, rarity: 'rare',
	},
	archmage_staff: {
		id: 'archmage_staff', name: "Archmage's Staff", char: '|', color: '#fa8',
		type: 'equipment', description: 'The staff of the Conservatory Archmage. Seven gemstones orbit the headpiece, each a different color.',
		slot: 'leftHand', stats: { atk: 4, sight: 2, hp: 3 }, rarity: 'epic',
	},
	conservatory_cloak: {
		id: 'conservatory_cloak', name: 'Conservatory Cloak', char: '}', color: '#88f',
		type: 'equipment', description: 'Deep blue with silver thread. The sigil of the Conservatory glows faintly on the clasp.',
		slot: 'back', stats: { hp: 2, stealthBonus: 5 }, rarity: 'uncommon',
	},
	diviner_lens: {
		id: 'diviner_lens', name: "Diviner's Lens", char: 'o', color: '#ccf',
		type: 'equipment', description: 'A crystal monocle that reveals hidden things. Professor Dawnwhisper wears one just like it.',
		slot: 'head', stats: { sight: 3 }, rarity: 'rare',
	},
	alchemist_boots: {
		id: 'alchemist_boots', name: "Alchemist's Boots", char: 'L', color: '#a84',
		type: 'equipment', description: 'Acid-resistant leather with reinforced soles. Essential in Professor Thornwick\'s laboratory.',
		slot: 'leftFoot', stats: { hp: 1, noiseReduction: 5 }, rarity: 'uncommon',
	},

	// --- Ley Line Items ---
	ley_water_vial: {
		id: 'ley_water_vial',
		name: 'Ley Water Vial',
		char: '!',
		color: '#4ff',
		type: 'consumable',
		description: 'Water drawn from a well over a ley line. Restores mana but clouds the mind with strange visions.',
		consumeEffect: { mana: 15, hp: -3 },
		rarity: 'rare',
	},
};
