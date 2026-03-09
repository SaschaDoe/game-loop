# Magic System Completion — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete the core magic combat system — all 84 spells, school mastery, tier gating, forbidden magic, AoE targeting, enemy spellcasters, counter-spells, Ley Lines, environment interactions, specializations, and environmental modifiers.

**Architecture:** Extend existing `spells.ts` (spell catalog + execution), `magic.ts` (attributes + mastery), `types.ts` (state), `engine.ts` (input + integration), and `+page.svelte` (UI). New file `mastery.ts` for school mastery/specialization logic. All forbidden schools use the same `SpellDef` interface with added `hpCost`/`stabilityCost`/`strainCost`/`corruptionCost` fields. Enemy spellcasters extend `MonsterDef` with spell lists.

**Tech Stack:** SvelteKit, TypeScript, Vitest

**Existing patterns to follow:**
- `SPELL_CATALOG` is a flat `Record<string, SpellDef>` — add all new spells here
- `executeSpell()` returns `SpellResult` — extend for forbidden costs, AoE shapes, environment effects
- `MonsterDef` in `monsters.ts` — extend with spell fields for caster enemies
- `GameState` in `types.ts` — add mastery, forbidden, Ley Line fields
- `save.ts` — add new fields to `SerializedState` + `deserializeState`
- Tests in `*.test.ts` siblings — use `makeEntity()` helper pattern

---

## Task 1: Complete Spell Catalog — Arcane Tier 4-5

**Files:**
- Modify: `ascii-rpg/src/lib/game/spells.ts` (SPELL_CATALOG)

**Step 1: Add remaining arcane school spells**

Add to `SPELL_CATALOG` after existing spells in each school section:

```typescript
// Elements Tier 4
spell_chain_lightning: {
    id: 'spell_chain_lightning', name: 'Chain Lightning', school: 'elements', tier: 4,
    description: 'Lightning leaps between all nearby enemies.',
    effect: 'Deals 10 damage to all enemies in 5x5 area.',
    manaCost: 14, cooldown: 10, targetType: 'self',
    baseDamage: 10, baseHeal: 0, aoeRadius: 2, element: 'lightning',
    statusEffect: { type: 'stun', duration: 1, potency: 0 },
},
// Elements Tier 5
spell_cataclysm: {
    id: 'spell_cataclysm', name: 'Cataclysm', school: 'elements', tier: 5,
    description: 'Unleash all elements in devastating fury.',
    effect: 'Deals 15 damage in 5x5 area, burn + freeze (3 turns).',
    manaCost: 20, cooldown: 15, targetType: 'self',
    baseDamage: 15, baseHeal: 0, aoeRadius: 2, element: 'fire',
    statusEffect: { type: 'burn', duration: 3, potency: 3 },
},

// Enchantment Tier 2 (missing)
spell_weapon_enchant: {
    id: 'spell_weapon_enchant', name: 'Weapon Enchant', school: 'enchantment', tier: 2,
    description: 'Imbue your weapon with arcane energy.',
    effect: '+3 ATK for 6 turns.',
    manaCost: 5, cooldown: 8, targetType: 'self',
    baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'arcane',
    selfBuff: { type: 'inspire', duration: 6, potency: 3 },
},
// Enchantment Tier 4
spell_sanctum: {
    id: 'spell_sanctum', name: 'Sanctum', school: 'enchantment', tier: 4,
    description: 'Create a 3x3 zone of protective energy.',
    effect: 'Regeneration (3 HP/turn) in area for 6 turns.',
    manaCost: 12, cooldown: 10, targetType: 'self',
    baseDamage: 0, baseHeal: 0, aoeRadius: 1, element: 'arcane',
    selfBuff: { type: 'regeneration', duration: 6, potency: 3 },
},
// Enchantment Tier 5
spell_absolute_ward: {
    id: 'spell_absolute_ward', name: 'Absolute Ward', school: 'enchantment', tier: 5,
    description: 'An impenetrable barrier of pure arcane force.',
    effect: 'Immunity to next 3 hits.',
    manaCost: 18, cooldown: 20, targetType: 'self',
    baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'arcane',
    selfBuff: { type: 'regeneration', duration: 8, potency: 5 },
},

// Restoration Tier 2
spell_bless: {
    id: 'spell_bless', name: 'Bless', school: 'restoration', tier: 2,
    description: 'Call upon divine favor to strengthen yourself.',
    effect: '+2 ATK for 8 turns.',
    manaCost: 5, cooldown: 6, targetType: 'self',
    baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'holy',
    selfBuff: { type: 'inspire', duration: 8, potency: 2 },
},
spell_regenerate: {
    id: 'spell_regenerate', name: 'Regenerate', school: 'restoration', tier: 2,
    description: 'Accelerate natural healing over time.',
    effect: 'Regeneration (2 HP/turn) for 10 turns.',
    manaCost: 6, cooldown: 8, targetType: 'self',
    baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'holy',
    selfBuff: { type: 'regeneration', duration: 10, potency: 2 },
},
// Restoration Tier 3
spell_purify: {
    id: 'spell_purify', name: 'Purify', school: 'restoration', tier: 3,
    description: 'Cleanse all corruption and ailments.',
    effect: 'Removes all negative status effects.',
    manaCost: 8, cooldown: 6, targetType: 'self',
    baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'holy',
},
// Restoration Tier 4
spell_mass_heal: {
    id: 'spell_mass_heal', name: 'Mass Heal', school: 'restoration', tier: 4,
    description: 'A wave of restorative energy heals all nearby.',
    effect: 'Heal 12 HP.',
    manaCost: 14, cooldown: 10, targetType: 'self',
    baseDamage: 0, baseHeal: 12, aoeRadius: 0, element: 'holy',
},
// Restoration Tier 5
spell_resurrection: {
    id: 'spell_resurrection', name: 'Resurrection', school: 'restoration', tier: 5,
    description: 'Cheat death itself with a precast ward.',
    effect: 'Auto-revive at 50% HP when killed (once).',
    manaCost: 20, cooldown: 50, targetType: 'self',
    baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'holy',
    selfBuff: { type: 'regeneration', duration: 1, potency: 0 },
},

// Divination Tier 3
spell_enemy_analysis: {
    id: 'spell_enemy_analysis', name: 'Enemy Analysis', school: 'divination', tier: 3,
    description: 'Reveal an enemy\'s strengths and weaknesses.',
    effect: 'Shows target stats and resistances.',
    manaCost: 6, cooldown: 5, targetType: 'single_enemy',
    baseDamage: 0, baseHeal: 0, aoeRadius: 0,
},
// Divination Tier 4
spell_premonition: {
    id: 'spell_premonition', name: 'Premonition', school: 'divination', tier: 4,
    description: 'See attacks before they land.',
    effect: 'Auto-dodge next 2 attacks.',
    manaCost: 12, cooldown: 15, targetType: 'self',
    baseDamage: 0, baseHeal: 0, aoeRadius: 0,
    selfBuff: { type: 'regeneration', duration: 10, potency: 0 },
},
// Divination Tier 5
spell_astral_projection: {
    id: 'spell_astral_projection', name: 'Astral Projection', school: 'divination', tier: 5,
    description: 'Project your consciousness across the dungeon.',
    effect: 'Reveal entire map for 3 turns.',
    manaCost: 18, cooldown: 30, targetType: 'self',
    baseDamage: 0, baseHeal: 0, aoeRadius: 0,
},

// Alchemy Tier 4
spell_stone_skin: {
    id: 'spell_stone_skin', name: 'Stone Skin', school: 'alchemy', tier: 4,
    description: 'Transmute your skin to living stone.',
    effect: '+5 damage reduction for 8 turns.',
    manaCost: 12, cooldown: 12, targetType: 'self',
    baseDamage: 0, baseHeal: 0, aoeRadius: 0,
    selfBuff: { type: 'inspire', duration: 8, potency: 5 },
},
// Alchemy Tier 5
spell_philosophers_touch: {
    id: 'spell_philosophers_touch', name: "Philosopher's Touch", school: 'alchemy', tier: 5,
    description: 'The pinnacle of transmutation — perfect restoration.',
    effect: 'Full heal + remove all debuffs.',
    manaCost: 22, cooldown: 30, targetType: 'self',
    baseDamage: 0, baseHeal: 99, aoeRadius: 0,
},

// Conjuration Tier 2
spell_phase_step: {
    id: 'spell_phase_step', name: 'Phase Step', school: 'conjuration', tier: 2,
    description: 'Step through the space between spaces.',
    effect: 'Teleport 5 tiles in a direction.',
    manaCost: 4, cooldown: 4, targetType: 'direction',
    baseDamage: 0, baseHeal: 0, aoeRadius: 0,
},
// Conjuration Tier 3
spell_summon_elemental: {
    id: 'spell_summon_elemental', name: 'Summon Elemental', school: 'conjuration', tier: 3,
    description: 'Call forth an elemental from the Ley Lines.',
    effect: 'Summon a powerful allied creature for 15 turns.',
    manaCost: 12, cooldown: 20, targetType: 'self',
    baseDamage: 0, baseHeal: 0, aoeRadius: 0,
},
// Conjuration Tier 4
spell_dimensional_door: {
    id: 'spell_dimensional_door', name: 'Dimensional Door', school: 'conjuration', tier: 4,
    description: 'Open a portal to any explored location.',
    effect: 'Teleport to any previously visited tile.',
    manaCost: 10, cooldown: 15, targetType: 'self',
    baseDamage: 0, baseHeal: 0, aoeRadius: 0,
},
// Conjuration Tier 5
spell_grand_illusion: {
    id: 'spell_grand_illusion', name: 'Grand Illusion', school: 'conjuration', tier: 5,
    description: 'Fill enemy minds with terrifying visions.',
    effect: 'Confuse all enemies in sight for 5 turns.',
    manaCost: 18, cooldown: 20, targetType: 'self',
    baseDamage: 0, baseHeal: 0, aoeRadius: 3,
    statusEffect: { type: 'stun', duration: 3, potency: 0 },
},

// Shadow Tier 2
spell_fear: {
    id: 'spell_fear', name: 'Fear', school: 'shadow', tier: 2,
    description: 'Fill a target with supernatural dread.',
    effect: 'Enemy flees for 4 turns.',
    manaCost: 5, cooldown: 5, targetType: 'single_enemy',
    baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'shadow',
    statusEffect: { type: 'blind', duration: 4, potency: 0 },
},
spell_life_drain: {
    id: 'spell_life_drain', name: 'Life Drain', school: 'shadow', tier: 2,
    description: 'Siphon the life force from your enemy.',
    effect: 'Deals 5 damage, heals you for the amount.',
    manaCost: 6, cooldown: 4, targetType: 'single_enemy',
    baseDamage: 5, baseHeal: 0, aoeRadius: 0, element: 'shadow',
},
// Shadow Tier 3
spell_shadow_cloak: {
    id: 'spell_shadow_cloak', name: 'Shadow Cloak', school: 'shadow', tier: 3,
    description: 'Wrap yourself in living darkness.',
    effect: 'Invisible for 8 turns. Breaks on attack.',
    manaCost: 8, cooldown: 10, targetType: 'self',
    baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'shadow',
},
// Shadow Tier 4
spell_curse_of_weakness: {
    id: 'spell_curse_of_weakness', name: 'Curse of Weakness', school: 'shadow', tier: 4,
    description: 'Wither an enemy\'s strength with dark magic.',
    effect: '-3 ATK for 8 turns.',
    manaCost: 10, cooldown: 8, targetType: 'single_enemy',
    baseDamage: 0, baseHeal: 0, aoeRadius: 0, element: 'shadow',
    statusEffect: { type: 'curse', duration: 8, potency: 3 },
},
// Shadow Tier 5
spell_soul_rip: {
    id: 'spell_soul_rip', name: 'Soul Rip', school: 'shadow', tier: 5,
    description: 'Tear the soul from a living creature.',
    effect: 'Deals 30 damage, ignores magic resistance.',
    manaCost: 20, cooldown: 15, targetType: 'single_enemy',
    baseDamage: 30, baseHeal: 0, aoeRadius: 0, element: 'shadow',
},
```

**Step 2: Run tests to verify no regressions**

Run: `cd ascii-rpg && npm test`
Expected: All existing tests pass. New spells are in catalog but not referenced by tests yet.

**Step 3: Commit**

```
feat: complete arcane spell catalog with Tier 4-5 spells
```

---

## Task 2: Add Forbidden School Spells

**Files:**
- Modify: `ascii-rpg/src/lib/game/spells.ts` (SpellSchool type, SPELL_CATALOG, school colors/names)

**Step 1: Extend SpellSchool type and add forbidden school metadata**

Change the `SpellSchool` type to include forbidden schools:

```typescript
export type SpellSchool = 'elements' | 'enchantment' | 'restoration' | 'divination' | 'alchemy' | 'conjuration' | 'shadow'
    | 'blood' | 'necromancy' | 'void' | 'chronomancy' | 'soul';

export type ForbiddenSchool = 'blood' | 'necromancy' | 'void' | 'chronomancy' | 'soul';

export const FORBIDDEN_SCHOOLS: ForbiddenSchool[] = ['blood', 'necromancy', 'void', 'chronomancy', 'soul'];
```

Add to `SPELL_SCHOOL_NAMES`:
```typescript
blood: 'Blood Magic',
necromancy: 'School of Necromancy',
void: 'Void Magic',
chronomancy: 'Chronomancy',
soul: 'Soul Magic',
```

Add to `SPELL_SCHOOL_COLORS`:
```typescript
blood: '#c00',
necromancy: '#696',
void: '#609',
chronomancy: '#cc6',
soul: '#6cf',
```

**Step 2: Add SpellDef forbidden cost fields**

Add optional fields to `SpellDef`:
```typescript
/** HP cost instead of mana (Blood Magic) */
hpCost?: number;
/** Corruption cost (Necromancy) — added on cast */
corruptionCost?: number;
/** Stability cost (Void Magic) — reduces sanity */
stabilityCost?: number;
/** Temporal strain (Chronomancy) */
strainCost?: number;
/** Soul fragment cost (Soul Magic) */
fragmentCost?: number;
```

**Step 3: Add all 35 forbidden spells to SPELL_CATALOG**

Add 7 spells each for blood, necromancy, void, chronomancy, soul. Use the patterns from the requirements doc. Key examples:

```typescript
// ===== Blood Magic (HP cost, no mana) =====
spell_blood_bolt: {
    id: 'spell_blood_bolt', name: 'Blood Bolt', school: 'blood', tier: 1,
    description: 'A projectile of hardened blood.',
    effect: 'Deals 6 damage. Scales with missing HP.',
    manaCost: 0, cooldown: 2, targetType: 'single_enemy',
    baseDamage: 6, baseHeal: 0, aoeRadius: 0, element: 'shadow',
    hpCost: 5,
},
// ... (all 7 blood spells)

// ===== Necromancy =====
spell_necro_life_tap: {
    id: 'spell_necro_life_tap', name: 'Life Tap', school: 'necromancy', tier: 1,
    description: 'Convert your life force into mana.',
    effect: 'Lose 5 HP, gain 8 mana.',
    manaCost: 0, cooldown: 3, targetType: 'self',
    baseDamage: 0, baseHeal: 0, aoeRadius: 0,
    hpCost: 5, corruptionCost: 1,
},
// ... (all 7 necromancy spells)

// ===== Void Magic =====
spell_void_bolt: {
    id: 'spell_void_bolt', name: 'Void Bolt', school: 'void', tier: 1,
    description: 'A bolt of pure nothingness.',
    effect: 'Deals 7 damage, ignores magic resistance.',
    manaCost: 3, cooldown: 2, targetType: 'single_enemy',
    baseDamage: 7, baseHeal: 0, aoeRadius: 0,
    stabilityCost: 2,
},
// ... (all 7 void spells)

// ===== Chronomancy =====
spell_haste: {
    id: 'spell_haste', name: 'Haste', school: 'chronomancy', tier: 1,
    description: 'Accelerate your personal timeline.',
    effect: 'Grants an extra action this turn.',
    manaCost: 4, cooldown: 5, targetType: 'self',
    baseDamage: 0, baseHeal: 0, aoeRadius: 0,
    strainCost: 5,
},
// ... (all 7 chronomancy spells)

// ===== Soul Magic =====
spell_soul_sight: {
    id: 'spell_soul_sight', name: 'Soul Sight', school: 'soul', tier: 1,
    description: 'Perceive the souls of all living things.',
    effect: 'See all entities through walls for 10 turns.',
    manaCost: 3, cooldown: 8, targetType: 'self',
    baseDamage: 0, baseHeal: 0, aoeRadius: 0,
    fragmentCost: 0,
},
// ... (all 7 soul spells)
```

**Step 4: Run tests, commit**

```
feat: add 5 forbidden spell schools with 35 spells
```

---

## Task 3: School Mastery System

**Files:**
- Create: `ascii-rpg/src/lib/game/mastery.ts`
- Create: `ascii-rpg/src/lib/game/mastery.test.ts`
- Modify: `ascii-rpg/src/lib/game/types.ts` (GameState additions)
- Modify: `ascii-rpg/src/lib/game/save.ts` (serialize mastery)

**Step 1: Write mastery tests**

```typescript
// mastery.test.ts
import { describe, it, expect } from 'vitest';
import { getMasteryLevel, addMasteryXP, canCastTier, getSchoolPassive, CLASS_MASTERY_MULTIPLIERS } from './mastery';
import type { SchoolMastery } from './mastery';

describe('School Mastery', () => {
    it('starts at none with 0 XP', () => {
        expect(getMasteryLevel(0)).toBe('none');
    });
    it('reaches novice at 1+ XP with a learned spell', () => {
        expect(getMasteryLevel(1)).toBe('novice');
    });
    it('reaches adept at 200 XP', () => {
        expect(getMasteryLevel(200)).toBe('adept');
    });
    it('reaches master at 1000 XP', () => {
        expect(getMasteryLevel(1000)).toBe('master');
    });
    it('addMasteryXP applies class multiplier', () => {
        const mastery: SchoolMastery = { elements: 0, enchantment: 0, restoration: 0, divination: 0, alchemy: 0, conjuration: 0, shadow: 0, blood: 0, necromancy: 0, void: 0, chronomancy: 0, soul: 0 };
        addMasteryXP(mastery, 'elements', 5, 'mage'); // mage = 1.5x
        expect(mastery.elements).toBe(7); // floor(5 * 1.5) = 7
    });
    it('tier 3 requires adept mastery', () => {
        expect(canCastTier(3, 'adept', 1)).toBe(true);
        expect(canCastTier(3, 'novice', 1)).toBe(false);
    });
    it('tier 5 requires master mastery and level 15+', () => {
        expect(canCastTier(5, 'master', 15)).toBe(true);
        expect(canCastTier(5, 'master', 14)).toBe(false);
        expect(canCastTier(5, 'adept', 15)).toBe(false);
    });
    it('forbidden spells have no tier requirements', () => {
        expect(canCastTier(1, 'none', 1, true)).toBe(true);
    });
});
```

**Step 2: Implement mastery.ts**

```typescript
// mastery.ts
import type { SpellSchool, SpellTier } from './spells';
import type { CharacterClass } from './types';

export type MasteryLevel = 'none' | 'novice' | 'adept' | 'master';

export type SchoolMastery = Record<SpellSchool, number>; // XP per school

export function createEmptyMastery(): SchoolMastery {
    return { elements: 0, enchantment: 0, restoration: 0, divination: 0, alchemy: 0, conjuration: 0, shadow: 0, blood: 0, necromancy: 0, void: 0, chronomancy: 0, soul: 0 };
}

export function getMasteryLevel(xp: number): MasteryLevel {
    if (xp >= 1000) return 'master';
    if (xp >= 200) return 'adept';
    if (xp >= 1) return 'novice';
    return 'none';
}

export const CLASS_MASTERY_MULTIPLIERS: Record<CharacterClass, Partial<Record<SpellSchool, number>>> = {
    mage:        { elements: 1.5, enchantment: 1.5, restoration: 1.5, divination: 1.5, alchemy: 1.5, conjuration: 1.5, shadow: 1.5 },
    necromancer: { shadow: 1.5, necromancy: 1.5 },
    cleric:      { restoration: 1.5, enchantment: 1.25, blood: 0.5, necromancy: 0.5, void: 0.5, chronomancy: 0.5, soul: 0.5 },
    bard:        { enchantment: 1.25, conjuration: 1.25 },
    ranger:      { elements: 1.25, divination: 1.25 },
    rogue:       { shadow: 1.25, conjuration: 1.25 },
    warrior:     {},
    paladin:     {},
};

export function addMasteryXP(mastery: SchoolMastery, school: SpellSchool, baseXP: number, charClass: CharacterClass): void {
    const mult = CLASS_MASTERY_MULTIPLIERS[charClass]?.[school] ?? 1.0;
    mastery[school] += Math.floor(baseXP * mult);
}

export function canCastTier(tier: SpellTier, level: MasteryLevel, charLevel: number, isForbidden?: boolean): boolean {
    if (isForbidden) return true; // No tier requirements for forbidden
    switch (tier) {
        case 1: return true;
        case 2: return level !== 'none';
        case 3: return level === 'adept' || level === 'master';
        case 4: return (level === 'adept' || level === 'master') && charLevel >= 10;
        case 5: return level === 'master' && charLevel >= 15;
    }
}

// School passive bonuses at Adept level
export const ADEPT_PASSIVES: Partial<Record<SpellSchool, { description: string; stat: string; value: number }>> = {
    elements:    { description: '+15% elemental damage', stat: 'elementDmg', value: 0.15 },
    enchantment: { description: '+30% ward/shield duration', stat: 'wardDuration', value: 0.30 },
    restoration: { description: '+20% healing output', stat: 'healBonus', value: 0.20 },
    divination:  { description: '+1 sight radius', stat: 'sightBonus', value: 1 },
    alchemy:     { description: '+25% potion effects', stat: 'potionBonus', value: 0.25 },
    conjuration: { description: '+50% summon duration', stat: 'summonDuration', value: 0.50 },
    shadow:      { description: '+30% debuff duration', stat: 'debuffDuration', value: 0.30 },
};
```

**Step 3: Add mastery fields to GameState (types.ts)**

Add to `GameState`:
```typescript
schoolMastery: Record<string, number>;    // school → XP
forbiddenCosts: { corruption: number; paradoxBaseline: number; maxHpLost: number; sanityLost: number; soulCapLost: number };
leyLineLevel: number;  // 0=dead, 1=low, 2=normal, 3=high, 4=convergence
```

**Step 4: Add to save.ts serialization/deserialization**

Add the new fields to `SerializedState` (optional, with defaults in deserialize).

**Step 5: Run tests, commit**

```
feat: add school mastery system with XP, tier gating, class multipliers
```

---

## Task 4: Forbidden Magic Costs & Tier Gating in Engine

**Files:**
- Modify: `ascii-rpg/src/lib/game/spells.ts` (executeSpell forbidden cost handling)
- Modify: `ascii-rpg/src/lib/game/engine.ts` (castSpellById tier check, forbidden cost application, learn-spell cost)
- Modify: `ascii-rpg/src/lib/game/mastery.test.ts` (add forbidden cost tests)

**Step 1: Add forbidden learning costs to learnSpell**

When a forbidden spell is learned, apply permanent cost:
- Blood: -2 maxHP
- Necromancy: +1 corruption
- Void: -5 sanity (stored as sanityLost)
- Chronomancy: +10 paradox baseline
- Soul: -1 soul gem capacity

**Step 2: Add tier gating to castSpellById**

Before casting, check `canCastTier(spell.tier, getMasteryLevel(state.schoolMastery[spell.school]), state.characterLevel, FORBIDDEN_SCHOOLS.includes(spell.school))`. Block with message if insufficient.

**Step 3: Add mastery XP gain on cast**

After successful cast: `addMasteryXP(state.schoolMastery, spell.school, 5, state.characterConfig.characterClass)`.

**Step 4: Handle hpCost in executeSpell**

For blood magic spells with `hpCost`, deduct HP instead of (or in addition to) mana. Check caster has enough HP.

**Step 5: Paladin restriction**

In `learnSpell`: if class is paladin and school is shadow or forbidden, block with message "This magic is anathema to your oath."

**Step 6: Run tests, commit**

```
feat: integrate tier gating, forbidden costs, mastery XP into spell casting
```

---

## Task 5: AoE Targeting System

**Files:**
- Modify: `ascii-rpg/src/lib/game/types.ts` (SpellTargetingState.cursorPos)
- Modify: `ascii-rpg/src/lib/game/spells.ts` (add AoE shape type)
- Modify: `ascii-rpg/src/lib/game/engine.ts` (area targeting input handler)
- Modify: `ascii-rpg/src/routes/+page.svelte` (AoE cursor rendering)

**Step 1: Add AoE shape to SpellDef**

```typescript
aoeShape?: 'square3' | 'square5' | 'line' | 'cross';
```

**Step 2: Update targeting mode for area spells**

When `targetType === 'area'`, enter cursor-based targeting:
- Initialize cursor at player position
- Arrow keys / WASD move cursor
- Enter confirms, Escape cancels
- Calculate affected tiles based on aoeShape
- Filter enemies in those tiles
- Execute spell on all targets

**Step 3: Render AoE cursor in +page.svelte**

When `state.spellTargeting?.targetType === 'area'`, highlight affected tiles with spell school color at reduced opacity.

**Step 4: Wall blocking for AoE**

Check FOV from AoE center — tiles behind walls are excluded.

**Step 5: Run tests, commit**

```
feat: add cursor-based AoE targeting with shape support
```

---

## Task 6: Enemy Spellcasters

**Files:**
- Modify: `ascii-rpg/src/lib/game/monsters.ts` (add spellcaster defs, extend MonsterDef)
- Modify: `ascii-rpg/src/lib/game/engine.ts` (enemy spell AI in moveEnemies)
- Create: `ascii-rpg/src/lib/game/enemy-spells.test.ts`

**Step 1: Extend MonsterDef with spell fields**

```typescript
// Add to MonsterDef interface:
spells?: { spellId: string; weight: number; castChance: number }[];
spellCooldowns?: Record<string, number>;
channeling?: { spellId: string; turnsLeft: number } | null;
```

**Step 2: Add 5 spellcaster enemy definitions**

```typescript
// In MONSTER_DEFS:
{ name: 'Frost Imp', char: 'i', color: '#88ccff', tier: 1, baseHp: 3, hpPerLevel: 1, baseAttack: 1, attackPerLevel: 0.2, behavior: 'erratic',
  spells: [{ spellId: 'spell_frost_lance', weight: 1, castChance: 0.4 }] },
{ name: 'Fire Mage', char: 'f', color: '#ff6600', tier: 2, baseHp: 5, hpPerLevel: 2, baseAttack: 2, attackPerLevel: 0.3, behavior: 'cowardly',
  spells: [{ spellId: 'spell_firebolt', weight: 2, castChance: 0.4 }, { spellId: 'spell_inferno', weight: 1, castChance: 0.3 }] },
{ name: 'Shadow Priest', char: 'p', color: '#a66aff', tier: 2, baseHp: 6, hpPerLevel: 2, baseAttack: 2, attackPerLevel: 0.4, behavior: 'cowardly',
  spells: [{ spellId: 'spell_shadow_bolt', weight: 2, castChance: 0.4 }, { spellId: 'spell_life_drain', weight: 1, castChance: 0.3 }] },
{ name: 'Necromancer', char: 'n', color: '#66aa66', tier: 3, baseHp: 8, hpPerLevel: 2, baseAttack: 3, attackPerLevel: 0.5, behavior: 'cowardly',
  spells: [{ spellId: 'spell_shadow_bolt', weight: 2, castChance: 0.4 }, { spellId: 'spell_curse_of_weakness', weight: 1, castChance: 0.3 }] },
{ name: 'Void Cultist', char: 'v', color: '#9933cc', tier: 3, baseHp: 7, hpPerLevel: 2, baseAttack: 4, attackPerLevel: 0.6, behavior: 'erratic',
  spells: [{ spellId: 'spell_void_bolt', weight: 2, castChance: 0.4 }] },
```

**Step 3: Implement enemy spell AI in moveEnemies**

In the enemy movement loop, before normal movement:
1. Check if enemy has `spells` array
2. For each spell, check range (Chebyshev distance), cooldown, castChance roll
3. Tier 3+ spells: start channeling (1-turn delay) instead of instant cast
4. On cast: apply damage to player using `baseDamage * (1 + dungeonLevel/10)`
5. Decrement enemy spell cooldowns each turn

**Step 4: Write tests for enemy casting logic**

Test that:
- Enemy with spells attempts to cast in range
- Enemy without spells does not cast
- Tier 3+ spells channel for 1 turn before resolving

**Step 5: Run tests, commit**

```
feat: add 5 enemy spellcaster types with spell AI and channeling
```

---

## Task 7: Counter-Spell System

**Files:**
- Modify: `ascii-rpg/src/lib/game/engine.ts` (counter-spell check when enemy is channeling)
- Add tests to `ascii-rpg/src/lib/game/enemy-spells.test.ts`

**Step 1: Detect channeling enemies**

When an enemy starts channeling, set `enemy.channeling = { spellId, turnsLeft: 1 }` and display message: `"[Enemy] channels [Spell]!"`.

**Step 2: Counter mechanic**

When player casts a spell targeting a channeling enemy, calculate counter-success rate:
- Same school opposing element: 100%
- Dispel spell: 80%
- Same school: 60%
- Other spell: 40%

On success: enemy spell fizzles, message: `"Your [Spell] counters [Enemy Spell]!"`
On failure: both spells resolve.

**Step 3: Run tests, commit**

```
feat: add counter-spell system for interrupting enemy channeling
```

---

## Task 8: Ley Line Modifiers

**Files:**
- Modify: `ascii-rpg/src/lib/game/types.ts` (leyLineLevel on GameState)
- Modify: `ascii-rpg/src/lib/game/spells.ts` (tickManaRegen Ley Line multiplier, spell effect modifier)
- Modify: `ascii-rpg/src/lib/game/engine.ts` (set leyLineLevel per location)
- Modify: `ascii-rpg/src/routes/+page.svelte` (HUD indicator)

**Step 1: Add leyLineLevel to locations**

- Academy: 4 (convergence)
- Dungeons: varies by level (1-3)
- Overworld: 2 (normal)
- Special rooms: 0 (dead zone)

**Step 2: Modify mana regen**

In `tickManaRegen`, multiply regen amount by Ley Line factor:
- 0 (dead): 0x (no regen)
- 1 (low): 0.5x
- 2 (normal): 1.0x
- 3 (high): 1.5x
- 4 (convergence): 2.0x

**Step 3: Modify spell effects**

In `executeSpell`, multiply damage/healing by Ley Line effect modifier:
- 0: spells cannot cast ("fizzles")
- 1: 0.9x
- 2: 1.0x
- 3: 1.1x
- 4: 1.25x

**Step 4: HUD display**

Show "Ley Line: Dead/Weak/Normal/Strong/Convergence" when not at normal level.

**Step 5: Run tests, commit**

```
feat: add Ley Line mana regen and spell effect modifiers
```

---

## Task 9: Spell-Environment Interactions

**Files:**
- Modify: `ascii-rpg/src/lib/game/engine.ts` (post-spell environment effects)
- Modify: `ascii-rpg/src/lib/game/types.ts` (terrain effect tiles)

**Step 1: Fire spell effects**

After fire spell hits:
- Create burning terrain at impact tile (2 dmg/turn, 3 turns)
- Add `terrainEffects` array to GameState for tracking

**Step 2: Ice spell effects**

After ice spell hits:
- Extinguish fire hazards/terrain at impact tile
- Freeze water tiles to walkable ice (if water tiles exist)

**Step 3: Lightning effects**

- If target is on water tile: chain 50% damage to adjacent water tiles
- Apply 1.5x damage to wet targets

**Step 4: Apply terrain effects each turn**

In the turn loop, tick terrain effects:
- Damage entities standing on burning tiles
- Reduce terrain effect durations
- Remove expired effects

**Step 5: Run tests, commit**

```
feat: add spell-environment interactions (fire, ice, lightning)
```

---

## Task 10: Environmental Modifiers (Weather, Time, Corruption)

**Files:**
- Modify: `ascii-rpg/src/lib/game/spells.ts` (environmental modifier calc)
- Modify: `ascii-rpg/src/lib/game/engine.ts` (pass modifiers to spell execution)
- Modify: `ascii-rpg/src/routes/+page.svelte` (show active modifiers)

**Step 1: Create environmental modifier function**

```typescript
export function getEnvironmentalModifier(
    spell: SpellDef,
    timePhase: string,       // from day-night system
    leyLineLevel: number,
    locationMode: string
): number {
    let mod = 1.0;
    // Time of day (outdoor only)
    if (locationMode === 'overworld') {
        if ((spell.school === 'divination' || spell.school === 'shadow') && timePhase === 'night') mod *= 1.15;
        if (spell.school === 'elements' && timePhase === 'day') mod *= 1.15;
    }
    // Ley Line
    const leyMods = [0, 0.9, 1.0, 1.1, 1.25];
    mod *= leyMods[leyLineLevel] ?? 1.0;
    return mod;
}
```

**Step 2: Apply modifier in executeSpell**

Pass modifier as parameter, multiply damage and healing by it.

**Step 3: Run tests, commit**

```
feat: add environmental spell modifiers (time of day, Ley Line)
```

---

## Task 11: Class Specializations

**Files:**
- Modify: `ascii-rpg/src/lib/game/mastery.ts` (specialization definitions)
- Modify: `ascii-rpg/src/lib/game/types.ts` (specialization field on GameState)
- Modify: `ascii-rpg/src/lib/game/engine.ts` (specialization selection at level 10)
- Modify: `ascii-rpg/src/lib/game/save.ts` (serialize specialization)

**Step 1: Define 7 specializations**

```typescript
export interface Specialization {
    id: string;
    name: string;
    description: string;
    requirements: { minLevel: number; minMastery: MasteryLevel; schools: SpellSchool[] };
    bonuses: { description: string; stat: string; value: number }[];
}

export const SPECIALIZATIONS: Record<string, Specialization> = {
    archmage: { id: 'archmage', name: 'Archmage', description: '-20% spell mana cost', requirements: { minLevel: 10, minMastery: 'adept', schools: [] }, bonuses: [{ description: '-20% mana cost', stat: 'manaCostReduction', value: 0.20 }] },
    elementalist: { id: 'elementalist', name: 'Elementalist', description: '+50% elemental damage', requirements: { minLevel: 10, minMastery: 'adept', schools: ['elements'] }, bonuses: [{ description: '+50% element damage', stat: 'elementDmgBonus', value: 0.50 }] },
    battlemage: { id: 'battlemage', name: 'Battlemage', description: 'No armor casting penalty for medium', requirements: { minLevel: 10, minMastery: 'adept', schools: [] }, bonuses: [{ description: 'Medium armor no penalty', stat: 'armorPenaltyReduction', value: 1 }] },
    healer: { id: 'healer', name: 'Healer', description: '+50% healing output', requirements: { minLevel: 10, minMastery: 'adept', schools: ['restoration'] }, bonuses: [{ description: '+50% healing', stat: 'healBonus', value: 0.50 }] },
    shadowcaster: { id: 'shadowcaster', name: 'Shadowcaster', description: '2x invisibility duration', requirements: { minLevel: 10, minMastery: 'adept', schools: ['shadow'] }, bonuses: [{ description: '2x stealth duration', stat: 'stealthBonus', value: 2 }] },
    artificer: { id: 'artificer', name: 'Artificer', description: '100% enchanting success', requirements: { minLevel: 10, minMastery: 'adept', schools: ['enchantment'] }, bonuses: [{ description: 'Perfect enchanting', stat: 'enchantSuccess', value: 1 }] },
    seer: { id: 'seer', name: 'Seer', description: 'Permanent enemy analysis', requirements: { minLevel: 10, minMastery: 'adept', schools: ['divination'] }, bonuses: [{ description: 'See enemy stats', stat: 'autoAnalysis', value: 1 }] },
};
```

**Step 2: Add specialization to GameState**

```typescript
specialization: string | null;  // specialization id
```

**Step 3: Offer specialization choice at level 10**

When player levels to 10 and has no specialization, present choice UI (similar to attribute allocation). Only show specializations whose requirements are met.

**Step 4: Apply specialization bonuses**

Integrate bonuses into relevant systems (mana cost, damage, healing calculations).

**Step 5: Run tests, commit**

```
feat: add 7 class specializations selectable at level 10
```

---

## Task 12: Forbidden Magic Threshold Events

**Files:**
- Modify: `ascii-rpg/src/lib/game/engine.ts` (check threshold on forbidden spell learn)
- Modify: `ascii-rpg/src/lib/game/mastery.ts` (threshold definitions)

**Step 1: Define threshold events**

At 5 spells learned from one forbidden school, grant a permanent passive:
- Blood Magic: Blood Frenzy (attacks heal 1 HP)
- Necromancy: Undead Accord (undead don't attack you)
- Void: Void Whisper (reveal secrets periodically)
- Chronomancy: Temporal Sense (trap awareness)
- Soul: Soul Sight (see entities through walls)

**Step 2: Track forbidden spell counts**

Count learned spells per forbidden school. When count reaches 5, trigger event with message and apply passive.

**Step 3: Run tests, commit**

```
feat: add forbidden magic threshold events at 5 spells per school
```

---

## Task 13: Spell Menu & UI Enhancements

**Files:**
- Modify: `ascii-rpg/src/routes/+page.svelte`

**Step 1: Group spells by school in menu**

Instead of flat list, group learned spells by school with school name headers and color coding.

**Step 2: Show mastery level per school**

Display "Elements (Adept)" next to school header.

**Step 3: Show tier lock indicators**

Greyed-out spells with lock icon if tier requirement not met.

**Step 4: Show forbidden spell costs**

For blood/forbidden spells, show HP cost in red instead of mana cost in blue.

**Step 5: Add mastery progress bar**

In spell menu, show XP progress toward next mastery level.

**Step 6: Show channeling enemies**

Render channeling enemies with a pulsing color effect.

**Step 7: Show Ley Line and specialization in HUD**

Add Ley Line indicator and specialization name to the right of the mana bar.

**Step 8: Run tests, commit**

```
feat: enhanced spell menu with school grouping, mastery display, forbidden costs
```

---

## Task 14: Save System Update

**Files:**
- Modify: `ascii-rpg/src/lib/game/save.ts`

**Step 1: Bump SAVE_VERSION**

Increment to 20.

**Step 2: Add all new fields to SerializedState**

```typescript
schoolMastery?: Record<string, number>;
forbiddenCosts?: { corruption: number; paradoxBaseline: number; maxHpLost: number; sanityLost: number; soulCapLost: number };
leyLineLevel?: number;
specialization?: string | null;
terrainEffects?: any[];
```

**Step 3: Add defaults in deserializeState**

All new fields get safe defaults (empty mastery, zero costs, normal Ley Line, null specialization).

**Step 4: Run all tests, commit**

```
feat: update save system for magic system completion (v20)
```

---

## Task 15: Integration Testing & Final Verification

**Files:**
- Modify: `ascii-rpg/src/lib/game/magic.test.ts` (add integration tests)

**Step 1: Add integration tests**

- Test: casting Tier 3 spell with Novice mastery fails
- Test: casting Tier 3 spell with Adept mastery succeeds
- Test: forbidden spell learning costs HP/corruption
- Test: Paladin cannot learn shadow/forbidden spells
- Test: environmental modifier changes damage output
- Test: mastery XP gained on successful cast
- Test: Ley Line dead zone blocks casting

**Step 2: Run full test suite**

```
cd ascii-rpg && npm test
```

**Step 3: Run dev server and smoke test**

```
cd ascii-rpg && npm run dev
```

Verify: character creation, spell menu, casting, AoE, HUD elements.

**Step 4: Final commit**

```
feat: complete magic system core — 84 spells, mastery, forbidden, AoE, enemy casters
```

---

## Execution Order & Dependencies

```
Task 1 (Arcane T4-5) ─────┐
Task 2 (Forbidden spells) ─┼─→ Task 3 (Mastery) ──→ Task 4 (Forbidden costs + tier gating)
                           │                                    │
Task 5 (AoE targeting) ───┘                                    │
                                                                ↓
Task 6 (Enemy casters) ──→ Task 7 (Counter-spells)     Task 8 (Ley Lines)
                                                                │
Task 9 (Environment) ─────────────────────────────────→ Task 10 (Env modifiers)
                                                                │
Task 11 (Specializations) ──→ Task 12 (Forbidden thresholds)   │
                                                                ↓
                                                        Task 13 (UI)
                                                                │
                                                        Task 14 (Save)
                                                                │
                                                        Task 15 (Integration)
```

**Parallelizable groups:**
- Group A: Tasks 1, 2, 5 (independent spell/targeting additions)
- Group B: Tasks 6, 9 (enemy casters, environment — no deps on mastery)
- Group C: Tasks 3, 4, 8, 10 (mastery chain)
- Group D: Tasks 11, 12 (specializations)
- Sequential: Tasks 13, 14, 15 (must come last)
