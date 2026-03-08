import { describe, it, expect } from 'vitest';
import {
	RARITY_COLORS,
	RARITY_STAT_MULTIPLIER,
	WEAPON_EFFECT_DEFS,
	SET_DEFS,
	ARTIFACT_CATALOG,
	rarityColor,
	rarityName,
	getRarityForLevel,
	generateRandomItem,
	addRandomEnchantment,
	getSetBonuses,
	applyWeaponEffect,
} from './artifacts';
import type { Item, ItemRarity, WeaponEffect } from './items';

// ---------------------------------------------------------------------------
// Deterministic RNG helper for reproducible tests
// ---------------------------------------------------------------------------

function makeRng(values: number[]) {
	let i = 0;
	return {
		next() {
			return values[i++ % values.length];
		},
	};
}

// ---------------------------------------------------------------------------
// 1. RARITY_COLORS has all 5 rarity tiers
// ---------------------------------------------------------------------------

describe('RARITY_COLORS', () => {
	it('contains all 5 rarity tiers', () => {
		const tiers: ItemRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
		for (const tier of tiers) {
			expect(RARITY_COLORS[tier]).toBeDefined();
			expect(typeof RARITY_COLORS[tier]).toBe('string');
		}
	});

	it('has exactly 5 entries', () => {
		expect(Object.keys(RARITY_COLORS)).toHaveLength(5);
	});

	it('all values are hex color strings', () => {
		for (const color of Object.values(RARITY_COLORS)) {
			expect(color).toMatch(/^#[0-9a-fA-F]{3,6}$/);
		}
	});
});

// ---------------------------------------------------------------------------
// 2. RARITY_STAT_MULTIPLIER has correct values
// ---------------------------------------------------------------------------

describe('RARITY_STAT_MULTIPLIER', () => {
	it('common has multiplier 1.0', () => {
		expect(RARITY_STAT_MULTIPLIER.common).toBe(1.0);
	});

	it('uncommon has multiplier 1.3', () => {
		expect(RARITY_STAT_MULTIPLIER.uncommon).toBe(1.3);
	});

	it('rare has multiplier 1.6', () => {
		expect(RARITY_STAT_MULTIPLIER.rare).toBe(1.6);
	});

	it('epic has multiplier 2.0', () => {
		expect(RARITY_STAT_MULTIPLIER.epic).toBe(2.0);
	});

	it('legendary has multiplier 2.5', () => {
		expect(RARITY_STAT_MULTIPLIER.legendary).toBe(2.5);
	});

	it('multipliers increase strictly with rarity', () => {
		expect(RARITY_STAT_MULTIPLIER.common).toBeLessThan(RARITY_STAT_MULTIPLIER.uncommon);
		expect(RARITY_STAT_MULTIPLIER.uncommon).toBeLessThan(RARITY_STAT_MULTIPLIER.rare);
		expect(RARITY_STAT_MULTIPLIER.rare).toBeLessThan(RARITY_STAT_MULTIPLIER.epic);
		expect(RARITY_STAT_MULTIPLIER.epic).toBeLessThan(RARITY_STAT_MULTIPLIER.legendary);
	});
});

// ---------------------------------------------------------------------------
// 3. WEAPON_EFFECT_DEFS has all 10 effects
// ---------------------------------------------------------------------------

describe('WEAPON_EFFECT_DEFS', () => {
	const allEffects: WeaponEffect[] = [
		'vampiric', 'flaming', 'freezing', 'thunderstrike', 'vorpal',
		'phasing', 'berserker', 'guardian', 'venomous', 'lunar',
	];

	it('contains all 10 weapon effects', () => {
		for (const effect of allEffects) {
			expect(WEAPON_EFFECT_DEFS[effect]).toBeDefined();
		}
	});

	it('has exactly 10 entries', () => {
		expect(Object.keys(WEAPON_EFFECT_DEFS)).toHaveLength(10);
	});

	it('each effect has name, description, damageBonus, and procChance', () => {
		for (const effect of allEffects) {
			const def = WEAPON_EFFECT_DEFS[effect];
			expect(typeof def.name).toBe('string');
			expect(def.name.length).toBeGreaterThan(0);
			expect(typeof def.description).toBe('string');
			expect(def.description.length).toBeGreaterThan(0);
			expect(typeof def.damageBonus).toBe('number');
			expect(def.damageBonus).toBeGreaterThan(0);
			expect(typeof def.procChance).toBe('number');
			expect(def.procChance).toBeGreaterThan(0);
			expect(def.procChance).toBeLessThanOrEqual(1);
		}
	});
});

// ---------------------------------------------------------------------------
// 4. SET_DEFS has at least 5 sets
// ---------------------------------------------------------------------------

describe('SET_DEFS', () => {
	it('has at least 5 sets', () => {
		expect(SET_DEFS.length).toBeGreaterThanOrEqual(5);
	});

	it('each set has id, name, pieces, and bonuses', () => {
		for (const set of SET_DEFS) {
			expect(typeof set.id).toBe('string');
			expect(typeof set.name).toBe('string');
			expect(Array.isArray(set.pieces)).toBe(true);
			expect(set.pieces.length).toBeGreaterThanOrEqual(2);
			expect(Array.isArray(set.bonuses)).toBe(true);
			expect(set.bonuses.length).toBeGreaterThanOrEqual(1);
		}
	});

	it('each set bonus has piecesRequired >= 2', () => {
		for (const set of SET_DEFS) {
			for (const bonus of set.bonuses) {
				expect(bonus.piecesRequired).toBeGreaterThanOrEqual(2);
			}
		}
	});

	it('all set ids are unique', () => {
		const ids = SET_DEFS.map(s => s.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

// ---------------------------------------------------------------------------
// 5. ARTIFACT_CATALOG has at least 10 artifacts
// ---------------------------------------------------------------------------

describe('ARTIFACT_CATALOG', () => {
	it('has at least 10 artifacts', () => {
		expect(Object.keys(ARTIFACT_CATALOG).length).toBeGreaterThanOrEqual(10);
	});

	it('each artifact key matches its id', () => {
		for (const [key, artifact] of Object.entries(ARTIFACT_CATALOG)) {
			expect(artifact.id).toBe(key);
		}
	});
});

// ---------------------------------------------------------------------------
// 6. All artifacts have isArtifact: true and rarity: 'legendary'
// ---------------------------------------------------------------------------

describe('artifact properties', () => {
	it('all artifacts have isArtifact: true', () => {
		for (const [key, artifact] of Object.entries(ARTIFACT_CATALOG)) {
			expect(artifact.isArtifact, `${key} should have isArtifact: true`).toBe(true);
		}
	});

	it('all artifacts have rarity legendary', () => {
		for (const [key, artifact] of Object.entries(ARTIFACT_CATALOG)) {
			expect(artifact.rarity, `${key} should have rarity: legendary`).toBe('legendary');
		}
	});

	it('all artifacts have type equipment', () => {
		for (const [key, artifact] of Object.entries(ARTIFACT_CATALOG)) {
			expect(artifact.type, `${key} should have type: equipment`).toBe('equipment');
		}
	});

	it('all artifacts have a slot assigned', () => {
		for (const [key, artifact] of Object.entries(ARTIFACT_CATALOG)) {
			expect(artifact.slot, `${key} should have an equipment slot`).toBeDefined();
		}
	});

	it('all artifacts have stats', () => {
		for (const [key, artifact] of Object.entries(ARTIFACT_CATALOG)) {
			expect(artifact.stats, `${key} should have stats`).toBeDefined();
		}
	});

	it('all artifacts use the legendary color', () => {
		for (const [key, artifact] of Object.entries(ARTIFACT_CATALOG)) {
			expect(artifact.color, `${key} should use legendary color`).toBe(RARITY_COLORS.legendary);
		}
	});
});

// ---------------------------------------------------------------------------
// 7. generateRandomItem returns item with rarity
// ---------------------------------------------------------------------------

describe('generateRandomItem', () => {
	it('returns an item with a rarity field', () => {
		const rng = makeRng([0.5, 0.5]);
		const item = generateRandomItem(1, 'iron_sword', rng);
		expect(item.rarity).toBeDefined();
	});

	it('returns an item with a color matching its rarity', () => {
		const rng = makeRng([0.5, 0.5]);
		const item = generateRandomItem(1, 'iron_sword', rng);
		expect(item.color).toBe(RARITY_COLORS[item.rarity!]);
	});

	it('generates a unique id different from the base item', () => {
		const rng = makeRng([0.5, 0.5]);
		const item = generateRandomItem(1, 'iron_sword', rng);
		expect(item.id).not.toBe('iron_sword');
		expect(item.id).toContain('iron_sword');
	});

	it('throws for an unknown base item id', () => {
		const rng = makeRng([0.5]);
		expect(() => generateRandomItem(1, 'nonexistent_item', rng)).toThrow('Unknown base item id');
	});

	it('prefixes name with rarity for non-common items', () => {
		// rng value 0.5 at level 1 => uncommon (0.5 < 0.585 threshold for uncommon)
		// At level 1: uncommonThreshold = max(0.60 - 0.015, 0.30) = 0.585
		// rareThreshold = max(0.85 - 0.015, 0.55) = 0.835
		// 0.5 < 0.585 => common
		// Use a value that lands in uncommon range
		const rng = makeRng([0.6, 0.5, 0.5]);
		const item = generateRandomItem(1, 'iron_sword', rng);
		if (item.rarity !== 'common') {
			expect(item.name).toContain(rarityName(item.rarity!));
		}
	});

	it('common items keep original name', () => {
		// rng value 0.0 always produces common
		const rng = makeRng([0.0, 0.5, 0.5]);
		const item = generateRandomItem(1, 'iron_sword', rng);
		expect(item.rarity).toBe('common');
		expect(item.name).toBe('Iron Sword');
	});
});

// ---------------------------------------------------------------------------
// 8. getRarityForLevel returns valid rarities
// ---------------------------------------------------------------------------

describe('getRarityForLevel', () => {
	const validRarities: ItemRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

	it('always returns a valid rarity', () => {
		for (let level = 0; level <= 20; level++) {
			for (const val of [0.0, 0.25, 0.5, 0.75, 0.99]) {
				const rng = makeRng([val]);
				const rarity = getRarityForLevel(level, rng);
				expect(validRarities).toContain(rarity);
			}
		}
	});

	it('returns common for very low rolls at level 1', () => {
		const rng = makeRng([0.0]);
		expect(getRarityForLevel(1, rng)).toBe('common');
	});

	it('returns legendary for very high rolls', () => {
		const rng = makeRng([0.999]);
		expect(getRarityForLevel(1, rng)).toBe('legendary');
	});

	it('returns epic for rolls just below legendary threshold', () => {
		// Level 1: legendaryThreshold = max(0.99 - 0.005, 0.90) = 0.985
		// epicThreshold = max(0.95 - 0.010, 0.75) = 0.940
		const rng = makeRng([0.95]);
		expect(getRarityForLevel(1, rng)).toBe('epic');
	});
});

// ---------------------------------------------------------------------------
// 9. Higher levels produce better rarities (statistical test)
// ---------------------------------------------------------------------------

describe('rarity distribution by level', () => {
	it('higher levels produce rarer items on average', () => {
		const rarityRank: Record<ItemRarity, number> = {
			common: 0,
			uncommon: 1,
			rare: 2,
			epic: 3,
			legendary: 4,
		};

		const samples = 200;
		let lowLevelSum = 0;
		let highLevelSum = 0;

		for (let i = 0; i < samples; i++) {
			const val = i / samples;
			const rng1 = makeRng([val]);
			const rng2 = makeRng([val]);
			lowLevelSum += rarityRank[getRarityForLevel(1, rng1)];
			highLevelSum += rarityRank[getRarityForLevel(20, rng2)];
		}

		const lowAvg = lowLevelSum / samples;
		const highAvg = highLevelSum / samples;
		expect(highAvg).toBeGreaterThan(lowAvg);
	});

	it('level 20 never returns common for top 50% rolls', () => {
		for (let i = 50; i < 100; i++) {
			const rng = makeRng([i / 100]);
			const rarity = getRarityForLevel(20, rng);
			expect(rarity).not.toBe('common');
		}
	});
});

// ---------------------------------------------------------------------------
// 10. addRandomEnchantment adds an enchantment
// ---------------------------------------------------------------------------

describe('addRandomEnchantment', () => {
	const baseItem: Item = {
		id: 'test_sword',
		name: 'Test Sword',
		char: '/',
		color: '#fff',
		type: 'equipment',
		description: 'A test sword.',
		slot: 'leftHand',
		stats: { atk: 2 },
	};

	it('adds an enchantment to an item without existing enchantments', () => {
		const rng = makeRng([0.0, 0.5]);
		const result = addRandomEnchantment(baseItem, 1, rng);
		expect(result.enchantments).toBeDefined();
		expect(result.enchantments!.length).toBe(1);
	});

	it('appends to existing enchantments', () => {
		const itemWithEnch: Item = {
			...baseItem,
			enchantments: [{ type: 'fire_damage', potency: 2 }],
		};
		const rng = makeRng([0.0, 0.5]);
		const result = addRandomEnchantment(itemWithEnch, 1, rng);
		expect(result.enchantments!.length).toBe(2);
	});

	it('enchantment potency scales with level', () => {
		const rng1 = makeRng([0.0, 0.0]); // enchType index 0, basePotency = 1
		const rng2 = makeRng([0.0, 0.0]);
		const lowLevel = addRandomEnchantment(baseItem, 1, rng1);
		const highLevel = addRandomEnchantment(baseItem, 15, rng2);
		expect(highLevel.enchantments![0].potency).toBeGreaterThan(lowLevel.enchantments![0].potency);
	});

	it('does not mutate the original item', () => {
		const rng = makeRng([0.0, 0.5]);
		const result = addRandomEnchantment(baseItem, 1, rng);
		expect(baseItem.enchantments).toBeUndefined();
		expect(result).not.toBe(baseItem);
	});

	it('enchantment has a valid type', () => {
		const validTypes = ['fire_damage', 'frost_damage', 'life_steal', 'mana_steal', 'thorns', 'fortify'];
		const rng = makeRng([0.3, 0.5]);
		const result = addRandomEnchantment(baseItem, 1, rng);
		expect(validTypes).toContain(result.enchantments![0].type);
	});
});

// ---------------------------------------------------------------------------
// 11. getSetBonuses returns bonuses for matching set pieces
// ---------------------------------------------------------------------------

describe('getSetBonuses', () => {
	it('returns zero stats when no set items are equipped', () => {
		const bonuses = getSetBonuses([null, null, null]);
		expect(bonuses.hp).toBe(0);
		expect(bonuses.atk).toBe(0);
		expect(bonuses.sight).toBe(0);
	});

	it('returns zero stats for only 1 piece of a set', () => {
		const item: Item = {
			id: 'shadow_cowl',
			name: 'Shadow Cowl',
			char: '^',
			color: '#fa4',
			type: 'equipment',
			description: 'A dark cowl.',
			slot: 'head',
			stats: { hp: 3 },
			setId: 'shadow_assassin',
		};
		const bonuses = getSetBonuses([item]);
		expect(bonuses.hp).toBe(0);
		expect(bonuses.atk).toBe(0);
	});

	it('returns 2-piece bonus when 2 pieces of a set are equipped', () => {
		const piece1: Item = {
			id: 'shadow_cowl',
			name: 'Shadow Cowl',
			char: '^',
			color: '#fa4',
			type: 'equipment',
			description: 'A dark cowl.',
			slot: 'head',
			stats: { hp: 3 },
			setId: 'shadow_assassin',
		};
		const piece2: Item = {
			id: 'shadow_leathers',
			name: 'Shadow Leathers',
			char: 'T',
			color: '#fa4',
			type: 'equipment',
			description: 'Dark leathers.',
			slot: 'body',
			stats: { hp: 5 },
			setId: 'shadow_assassin',
		};
		const bonuses = getSetBonuses([piece1, piece2]);
		// Shadow Assassin 2-piece: stealthBonus: 3, noiseReduction: 2
		expect(bonuses.stealthBonus).toBe(3);
		expect(bonuses.noiseReduction).toBe(2);
	});

	it('returns both 2-piece and 3-piece bonuses when 3 pieces equipped', () => {
		const pieces: Item[] = [
			{ id: 'shadow_cowl', name: 'Shadow Cowl', char: '^', color: '#fa4', type: 'equipment', description: '', slot: 'head', stats: {}, setId: 'shadow_assassin' },
			{ id: 'shadow_leathers', name: 'Shadow Leathers', char: 'T', color: '#fa4', type: 'equipment', description: '', slot: 'body', stats: {}, setId: 'shadow_assassin' },
			{ id: 'shadow_cloak', name: 'Shadow Cloak', char: '}', color: '#fa4', type: 'equipment', description: '', slot: 'back', stats: {}, setId: 'shadow_assassin' },
		];
		const bonuses = getSetBonuses(pieces);
		// 2-piece: stealthBonus: 3, noiseReduction: 2
		// 3-piece: dodgeChance: 10, atk: 2
		expect(bonuses.stealthBonus).toBe(3);
		expect(bonuses.noiseReduction).toBe(2);
		expect(bonuses.dodgeChance).toBe(10);
		expect(bonuses.atk).toBe(2);
	});

	it('handles null entries in equipped items', () => {
		const piece1: Item = { id: 'shadow_cowl', name: 'Shadow Cowl', char: '^', color: '#fa4', type: 'equipment', description: '', slot: 'head', stats: {}, setId: 'shadow_assassin' };
		const piece2: Item = { id: 'shadow_leathers', name: 'Shadow Leathers', char: 'T', color: '#fa4', type: 'equipment', description: '', slot: 'body', stats: {}, setId: 'shadow_assassin' };
		const bonuses = getSetBonuses([piece1, null, null, piece2, null]);
		expect(bonuses.stealthBonus).toBe(3);
	});
});

// ---------------------------------------------------------------------------
// 12. applyWeaponEffect returns correct damage and messages
// ---------------------------------------------------------------------------

describe('applyWeaponEffect', () => {
	it('returns base damage when effect does not proc', () => {
		const orig = Math.random;
		Math.random = () => 0.99; // always above procChance
		try {
			const result = applyWeaponEffect('flaming', 10);
			expect(result.damage).toBe(10);
			expect(result.procced).toBe(false);
			expect(result.message).toBe('');
		} finally {
			Math.random = orig;
		}
	});

	it('returns boosted damage when effect procs', () => {
		const orig = Math.random;
		Math.random = () => 0.01; // always below procChance
		try {
			const result = applyWeaponEffect('flaming', 10);
			// flaming damageBonus = 3
			expect(result.damage).toBe(13);
			expect(result.procced).toBe(true);
			expect(result.message).toContain('Flaming');
		} finally {
			Math.random = orig;
		}
	});

	it('vampiric effect mentions draining life', () => {
		const orig = Math.random;
		Math.random = () => 0.01;
		try {
			const result = applyWeaponEffect('vampiric', 5);
			expect(result.procced).toBe(true);
			expect(result.message).toContain('Drained');
			expect(result.damage).toBe(5 + WEAPON_EFFECT_DEFS.vampiric.damageBonus);
		} finally {
			Math.random = orig;
		}
	});

	it('vorpal effect mentions critical strike', () => {
		const orig = Math.random;
		Math.random = () => 0.01;
		try {
			const result = applyWeaponEffect('vorpal', 10);
			expect(result.procced).toBe(true);
			expect(result.message).toContain('critical strike');
			expect(result.damage).toBe(10 + WEAPON_EFFECT_DEFS.vorpal.damageBonus);
		} finally {
			Math.random = orig;
		}
	});

	it('each effect type produces a non-empty message when procced', () => {
		const orig = Math.random;
		Math.random = () => 0.0;
		try {
			const effects: WeaponEffect[] = [
				'vampiric', 'flaming', 'freezing', 'thunderstrike', 'vorpal',
				'phasing', 'berserker', 'guardian', 'venomous', 'lunar',
			];
			for (const effect of effects) {
				const result = applyWeaponEffect(effect, 10);
				expect(result.procced, `${effect} should proc`).toBe(true);
				expect(result.message.length, `${effect} should have a message`).toBeGreaterThan(0);
				expect(result.damage, `${effect} should add damage`).toBeGreaterThan(10);
			}
		} finally {
			Math.random = orig;
		}
	});
});

// ---------------------------------------------------------------------------
// 13. rarityColor returns correct colors
// ---------------------------------------------------------------------------

describe('rarityColor', () => {
	it('returns #aaa for common', () => {
		expect(rarityColor('common')).toBe('#aaa');
	});

	it('returns #4f4 for uncommon', () => {
		expect(rarityColor('uncommon')).toBe('#4f4');
	});

	it('returns #48f for rare', () => {
		expect(rarityColor('rare')).toBe('#48f');
	});

	it('returns #a4f for epic', () => {
		expect(rarityColor('epic')).toBe('#a4f');
	});

	it('returns #fa4 for legendary', () => {
		expect(rarityColor('legendary')).toBe('#fa4');
	});
});

// ---------------------------------------------------------------------------
// 14. rarityName returns correct display names
// ---------------------------------------------------------------------------

describe('rarityName', () => {
	it('returns Common for common', () => {
		expect(rarityName('common')).toBe('Common');
	});

	it('returns Uncommon for uncommon', () => {
		expect(rarityName('uncommon')).toBe('Uncommon');
	});

	it('returns Rare for rare', () => {
		expect(rarityName('rare')).toBe('Rare');
	});

	it('returns Epic for epic', () => {
		expect(rarityName('epic')).toBe('Epic');
	});

	it('returns Legendary for legendary', () => {
		expect(rarityName('legendary')).toBe('Legendary');
	});
});

// ---------------------------------------------------------------------------
// 15. Generated items have stats scaled by rarity multiplier
// ---------------------------------------------------------------------------

describe('stat scaling by rarity', () => {
	it('common item retains original stats (multiplier 1.0)', () => {
		// rng 0.0 => common at level 1
		const rng = makeRng([0.0, 0.5]);
		const item = generateRandomItem(1, 'iron_sword', rng);
		expect(item.rarity).toBe('common');
		// iron_sword base atk: 2, multiplier 1.0 => round(2 * 1.0) = 2
		expect(item.stats!.atk).toBe(2);
	});

	it('legendary item has stats scaled by 2.5x', () => {
		// rng 0.999 => legendary at any level
		const rng = makeRng([0.999, 0.5, 0.5, 0.5, 0.5, 0.5]);
		const item = generateRandomItem(1, 'iron_sword', rng);
		expect(item.rarity).toBe('legendary');
		// iron_sword base atk: 2, multiplier 2.5 => round(2 * 2.5) = 5
		expect(item.stats!.atk).toBe(5);
	});

	it('epic item has stats scaled by 2.0x', () => {
		// At level 1: epicThreshold = 0.940, legendaryThreshold = 0.985
		// rng 0.95 => epic
		const rng = makeRng([0.95, 0.5, 0.5, 0.5, 0.5]);
		const item = generateRandomItem(1, 'iron_sword', rng);
		expect(item.rarity).toBe('epic');
		// iron_sword base atk: 2, multiplier 2.0 => round(2 * 2.0) = 4
		expect(item.stats!.atk).toBe(4);
	});

	it('scales multiple stats when present', () => {
		// mage_staff has atk: 1, sight: 2
		const rng = makeRng([0.999, 0.5, 0.5, 0.5, 0.5, 0.5]);
		const item = generateRandomItem(1, 'mage_staff', rng);
		expect(item.rarity).toBe('legendary');
		// atk: round(1 * 2.5) = 3 (rounds to 3), sight: round(2 * 2.5) = 5
		expect(item.stats!.atk).toBe(Math.round(1 * 2.5));
		expect(item.stats!.sight).toBe(Math.round(2 * 2.5));
	});

	it('does not add stats that are absent on the base item', () => {
		// iron_sword only has atk
		const rng = makeRng([0.999, 0.5, 0.5, 0.5, 0.5, 0.5]);
		const item = generateRandomItem(1, 'iron_sword', rng);
		expect(item.stats!.hp).toBeUndefined();
		expect(item.stats!.sight).toBeUndefined();
	});

	it('legendary and epic items get enchantments', () => {
		const rng = makeRng([0.999, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]);
		const item = generateRandomItem(1, 'iron_sword', rng);
		expect(item.rarity).toBe('legendary');
		expect(item.enchantments).toBeDefined();
		expect(item.enchantments!.length).toBe(2);
	});

	it('common items get no enchantments', () => {
		const rng = makeRng([0.0, 0.5]);
		const item = generateRandomItem(1, 'iron_sword', rng);
		expect(item.rarity).toBe('common');
		expect(item.enchantments).toBeUndefined();
	});
});
