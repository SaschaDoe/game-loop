/**
 * Ritual system: Multi-turn channeled rituals with reagent costs.
 * Implements US-MS-51 — rituals require reagents, channeling turns, and mana.
 */

import type { SpellSchool } from './spells';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RitualEffectType = 'ward' | 'summon' | 'scry' | 'purify' | 'teleport_anchor' | 'seal';

export interface ReagentCost {
	itemId: string;
	quantity: number;
}

export interface RitualDef {
	id: string;
	name: string;
	school: SpellSchool;
	description: string;
	channelingTurns: number;
	reagents: ReagentCost[];
	manaCost: number;
	effectType: RitualEffectType;
}

// ---------------------------------------------------------------------------
// Ritual Catalog
// ---------------------------------------------------------------------------

export const RITUAL_CATALOG: Record<string, RitualDef> = {
	ritual_ward_of_protection: {
		id: 'ritual_ward_of_protection',
		name: 'Ward of Protection',
		school: 'enchantment',
		description: 'Inscribe a protective ward on the ground that damages enemies who enter.',
		channelingTurns: 3,
		reagents: [{ itemId: 'arcane_dust', quantity: 3 }],
		manaCost: 12,
		effectType: 'ward',
	},
	ritual_summoning_circle: {
		id: 'ritual_summoning_circle',
		name: 'Summoning Circle',
		school: 'conjuration',
		description: 'Draw a summoning circle to call forth an arcane ally.',
		channelingTurns: 5,
		reagents: [
			{ itemId: 'arcane_dust', quantity: 2 },
			{ itemId: 'moonwater_vial', quantity: 1 },
		],
		manaCost: 20,
		effectType: 'summon',
	},
	ritual_scrying: {
		id: 'ritual_scrying',
		name: 'Scrying Ritual',
		school: 'divination',
		description: 'Peer through the veil to reveal a dungeon level.',
		channelingTurns: 3,
		reagents: [
			{ itemId: 'moonwater_vial', quantity: 1 },
			{ itemId: 'dreamleaf', quantity: 1 },
		],
		manaCost: 10,
		effectType: 'scry',
	},
	ritual_purification: {
		id: 'ritual_purification',
		name: 'Purification Ritual',
		school: 'restoration',
		description: 'Cleanse an area of corruption and negative effects.',
		channelingTurns: 4,
		reagents: [
			{ itemId: 'starfern', quantity: 2 },
			{ itemId: 'moonwater_vial', quantity: 1 },
		],
		manaCost: 15,
		effectType: 'purify',
	},
	ritual_teleportation_circle: {
		id: 'ritual_teleportation_circle',
		name: 'Teleportation Circle',
		school: 'conjuration',
		description: 'Anchor a teleportation circle to this dungeon level.',
		channelingTurns: 5,
		reagents: [
			{ itemId: 'arcane_dust', quantity: 3 },
			{ itemId: 'lightning_shard', quantity: 1 },
		],
		manaCost: 18,
		effectType: 'teleport_anchor',
	},
	ritual_sealing: {
		id: 'ritual_sealing',
		name: 'Sealing Ritual',
		school: 'shadow',
		description: 'Seal a passage or doorway with dark binding magic.',
		channelingTurns: 4,
		reagents: [
			{ itemId: 'void_salt', quantity: 1 },
			{ itemId: 'arcane_dust', quantity: 2 },
		],
		manaCost: 14,
		effectType: 'seal',
	},
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Look up a ritual definition by ID. Returns undefined for unknown IDs. */
export function getRitualDef(ritualId: string): RitualDef | undefined {
	return RITUAL_CATALOG[ritualId];
}

/** Count how many inventory slots contain an item with the given ID. */
export function countItemInInventory(
	inventory: ({ id: string } | null)[],
	itemId: string,
): number {
	let count = 0;
	for (const slot of inventory) {
		if (slot !== null && slot.id === itemId) {
			count++;
		}
	}
	return count;
}

/** Check whether the inventory contains all reagents for a ritual. */
export function hasReagents(
	inventory: ({ id: string } | null)[],
	ritual: RitualDef,
): boolean {
	for (const reagent of ritual.reagents) {
		if (countItemInInventory(inventory, reagent.itemId) < reagent.quantity) {
			return false;
		}
	}
	return true;
}

/** Return a list of missing reagents (itemId + shortfall quantity). */
export function getMissingReagents(
	inventory: ({ id: string } | null)[],
	ritual: RitualDef,
): ReagentCost[] {
	const missing: ReagentCost[] = [];
	for (const reagent of ritual.reagents) {
		const have = countItemInInventory(inventory, reagent.itemId);
		if (have < reagent.quantity) {
			missing.push({ itemId: reagent.itemId, quantity: reagent.quantity - have });
		}
	}
	return missing;
}

/**
 * Consume reagents from the inventory for a ritual.
 * Verifies reagents are present first; if not, returns false without modifying inventory.
 * On success, sets consumed slots to null and returns true.
 */
export function consumeReagents(
	inventory: ({ id: string } | null)[],
	ritual: RitualDef,
): boolean {
	// Verify all reagents are present before consuming
	if (!hasReagents(inventory, ritual)) {
		return false;
	}

	// Consume reagents by setting slots to null
	for (const reagent of ritual.reagents) {
		let remaining = reagent.quantity;
		for (let i = 0; i < inventory.length && remaining > 0; i++) {
			if (inventory[i] !== null && inventory[i]!.id === reagent.itemId) {
				inventory[i] = null;
				remaining--;
			}
		}
	}

	return true;
}

/**
 * Roll for channeling interruption when the player takes damage.
 * Returns true if the ritual is interrupted (75% chance),
 * false if the caster resists the interruption (25% chance).
 */
export function rollInterruption(): boolean {
	return Math.random() < 0.75;
}
