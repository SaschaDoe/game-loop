/**
 * Alchemy system: Recipes for brewing potions and elixirs.
 * Recipes are learned through quests and books at the Arcane Conservatory.
 */

export interface AlchemyRecipe {
	id: string;
	name: string;
	description: string;
	ingredients: string[];
	result: string;
	difficulty: 1 | 2 | 3;
}

export const RECIPE_CATALOG: Record<string, AlchemyRecipe> = {
	recipe_health_potion: {
		id: 'recipe_health_potion', name: 'Health Potion',
		description: 'A basic curative draught that mends wounds.',
		ingredients: ['starfern', 'moonwater_vial'], result: 'health_potion', difficulty: 1,
	},
	recipe_antidote: {
		id: 'recipe_antidote', name: 'Universal Antidote',
		description: 'Neutralizes most known poisons and toxins.',
		ingredients: ['mandrake_root', 'starfern'], result: 'antidote', difficulty: 1,
	},
	recipe_strength_elixir: {
		id: 'recipe_strength_elixir', name: 'Elixir of Strength',
		description: 'A potent brew that temporarily enhances physical power.',
		ingredients: ['fire_crystal', 'mandrake_root'], result: 'strength_elixir', difficulty: 1,
	},
	recipe_mana_potion: {
		id: 'recipe_mana_potion', name: 'Mana Potion',
		description: 'Restores depleted arcane energy.',
		ingredients: ['arcane_dust', 'moonwater_vial'], result: 'mana_potion', difficulty: 1,
	},
	recipe_fire_resistance: {
		id: 'recipe_fire_resistance', name: 'Fire Resistance Draught',
		description: 'Grants temporary immunity to flame.',
		ingredients: ['frost_essence', 'mandrake_root'], result: 'fire_resistance_potion', difficulty: 2,
	},
	recipe_frost_ward: {
		id: 'recipe_frost_ward', name: 'Frost Ward Tonic',
		description: 'Protects the drinker from extreme cold.',
		ingredients: ['fire_crystal', 'starfern'], result: 'frost_ward_potion', difficulty: 2,
	},
	recipe_fortification: {
		id: 'recipe_fortification', name: 'Fortification Elixir',
		description: 'Hardens the skin temporarily, reducing damage taken.',
		ingredients: ['fire_crystal', 'void_salt'], result: 'fortification_elixir', difficulty: 2,
	},
	recipe_invisibility: {
		id: 'recipe_invisibility', name: 'Invisibility Draught',
		description: 'Renders the drinker invisible to the naked eye.',
		ingredients: ['shadowroot', 'moonwater_vial', 'void_salt'], result: 'invisibility_draught', difficulty: 2,
	},
	recipe_truth_serum: {
		id: 'recipe_truth_serum', name: 'Truth Serum',
		description: 'Compels honesty. Banned in most civilized lands.',
		ingredients: ['mandrake_root', 'moonwater_vial', 'starfern'], result: 'truth_serum', difficulty: 2,
	},
	recipe_dreamwalker: {
		id: 'recipe_dreamwalker', name: 'Dreamwalker Elixir',
		description: 'Allows the drinker to enter a trance-like state of heightened perception.',
		ingredients: ['dreamleaf', 'moonwater_vial', 'starfern'], result: 'dreamwalker_elixir', difficulty: 3,
	},
	recipe_transmutation: {
		id: 'recipe_transmutation', name: 'Transmutation Philter',
		description: 'A volatile compound that temporarily alters the molecular structure of objects.',
		ingredients: ['phoenix_ash', 'void_salt', 'lightning_shard'], result: 'transmutation_philter', difficulty: 3,
	},
	recipe_philosophers_draught: {
		id: 'recipe_philosophers_draught', name: "Philosopher's Draught",
		description: 'The pinnacle of alchemical achievement. Heals all wounds and clears the mind.',
		ingredients: ['phoenix_ash', 'moonwater_vial', 'starfern', 'mandrake_root', 'dreamleaf'],
		result: 'philosophers_draught', difficulty: 3,
	},
};

export function getRecipesByDifficulty(difficulty: 1 | 2 | 3): AlchemyRecipe[] {
	return Object.values(RECIPE_CATALOG).filter(r => r.difficulty === difficulty);
}

export function canBrew(recipe: AlchemyRecipe, inventoryItemIds: string[]): boolean {
	const available = [...inventoryItemIds];
	for (const ingredient of recipe.ingredients) {
		const idx = available.indexOf(ingredient);
		if (idx === -1) return false;
		available.splice(idx, 1);
	}
	return true;
}
