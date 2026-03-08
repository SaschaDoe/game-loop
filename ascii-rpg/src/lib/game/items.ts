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
	consumeEffect?: { hp?: number; hunger?: number; thirst?: number };
	rarity?: ItemRarity;
	enchantments?: Enchantment[];
	weaponEffect?: WeaponEffect;
	setId?: string;
	isArtifact?: boolean;
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
	const totals: ItemStats = { hp: 0, atk: 0, sight: 0 };

	for (const slot of Object.values(equipment)) {
		if (slot && slot.stats) {
			totals.hp! += slot.stats.hp ?? 0;
			totals.atk! += slot.stats.atk ?? 0;
			totals.sight! += slot.stats.sight ?? 0;
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
};
