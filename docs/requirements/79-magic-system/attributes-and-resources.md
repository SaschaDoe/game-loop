# Attributes and Resources

This document defines the core attribute system and mana resource system that all magic in the game depends on. It introduces five primary attributes to replace the current flat HP/ATK model, derives all combat and magic stats from those attributes, and establishes mana as the universal spellcasting resource. These systems are prerequisites for every other magic epic — spellcasting, schools of magic, forbidden magic, and psychic powers all build on the foundations defined here.

**Epic:** 79 — Magic System
**Stories:** US-MS-01 through US-MS-08
**Dependencies:** Entity type (types.ts), CLASS_BONUSES (engine.ts), HUD (character-status-panel), save system (save.ts)
**Depended on by:** 04-combat-system/magic-spells, 29-forbidden-magic, 52-psychic-powers, 78-arcane-academy

---

## User Stories

### US-MS-01: Core Attributes

**As a** player, **I want** my character to have meaningful attributes that differ by class, **so that** my class choice affects how I interact with every system in the game.

**Acceptance Criteria:**
- [ ] Character creation has two steps: (1) choose an **archetype**, (2) choose a **class**
- [ ] Entity has five new numeric fields: `str` (Strength), `int` (Intellect), `wil` (Willpower), `agi` (Agility), `vit` (Vitality)
- [ ] Starting attribute values are assigned based on **archetype** at character creation:

| Archetype | STR | INT | WIL | AGI | VIT | Primary | Mana Modifier | Description |
|-----------|-----|-----|-----|-----|-----|---------|---------------|-------------|
| Arcane    |   6 |  16 |  14 |   8 |  10 | int     | 1.50          | Born to wield magic. High mana, strong spells, fragile body. |
| Finesse   |   8 |  10 |   8 |  16 |  12 | agi     | 0.75          | Quick and precise. Some magic, excels at evasion and crits. |
| Might     |  14 |   8 |  10 |  10 |  12 | str     | 0.25          | Raw physical power. Minimal mana — relies on steel, not spells. |

- [ ] All archetypes sum to 54 attribute points (balanced)
- [ ] **Classes provide talents, equipment, and affinities — NOT attributes or mana modifiers.** Class profiles:

| Class       | Suggested Archetype | Starting Equipment        | Starting Ability (Q key) | Starting Spell     | Armor Proficiency |
|-------------|--------------------|--------------------------|--------------------------|--------------------|-------------------|
| Warrior     | Might              | Iron Sword, Shield        | Whirlwind                | —                  | Heavy             |
| Paladin     | Might              | Mace, Shield              | Holy Strike              | —                  | Heavy             |
| Mage        | Arcane             | Staff                     | —                        | 1 random T1 spell  | Robes             |
| Necromancer | Arcane             | Dagger                    | —                        | Life Tap           | Light             |
| Cleric      | Arcane             | Mace                      | —                        | Heal               | Medium            |
| Rogue       | Finesse            | Twin Daggers              | Smoke Bomb               | —                  | Light             |
| Ranger      | Finesse            | Bow, Dagger               | Trap Sense               | —                  | Medium            |
| Bard        | Finesse            | Rapier, Lute              | Inspire                  | —                  | Light             |

- [ ] Any class can be combined with any archetype (e.g., an Arcane Warrior is a battle-mage). The UI suggests default pairings but does not enforce them.
- [ ] **Attributes are fixed at character creation** (determined by archetype). They do NOT change on level-up.
- [ ] Attributes can only change through: equipped artifacts/equipment, enchantments, environmental effects (shrine blessings, rest bonuses), and forbidden magic costs.
- [ ] On level-up, the player receives +1 talent point only (no attribute changes).
- [ ] Attributes are stored on Entity and persisted in save files
- [ ] Monsters also have attributes (can be simplified — e.g., derived from their tier and level)
- [ ] Attributes are validated: minimum value is 1, no maximum cap

---

### US-MS-02: Derived Stats

**As a** player, **I want** my HP, attack power, and other combat stats to derive from my attributes, **so that** investing in attributes feels impactful and my build choices matter.

**Acceptance Criteria:**
- [ ] `maxHp` is calculated as: `10 + (VIT * 3)` (level does not contribute — HP scales with VIT from gear/effects)
- [ ] Physical `attack` is calculated as: `STR + weaponBonus` (weaponBonus defaults to 0 when no weapon equipped)
- [ ] `spellPower` is calculated as: `INT + floor(WIL / 3)` — used to scale all spell damage and healing
- [ ] `magicResist` is calculated as: `WIL + floor(INT / 4)` — incoming spell damage reduced by `magicResist`%, capped at 50%
- [ ] `dodgeChance` is calculated as: `AGI * 0.5`% base (before equipment modifiers)
- [ ] `critChance` is calculated as: `AGI * 0.3`% base (before equipment modifiers)
- [ ] `physicalDefense` is calculated as: `armorValue + floor(VIT / 4)` — incoming physical damage is reduced by this flat amount (minimum 1 damage always gets through)
- [ ] Derived stats are recalculated whenever attributes change (level up, buff, debuff, equipment) — includes physicalDefense
- [ ] The existing flat `hp`, `maxHp`, and `attack` fields on Entity become derived values — no game system sets them directly anymore
- [ ] A `recalculateDerivedStats(entity)` function exists and is called after any attribute mutation
- [ ] Save migration: existing saves without attributes get attributes reverse-calculated from their current HP and ATK values:
  - VIT is estimated from maxHp: `VIT = round((maxHp - 10) / 3)` (clamping to reasonable range 6-18)
  - STR is estimated from attack: `STR = attack` (assuming no weapon bonus in old saves)
  - INT, WIL, AGI default to 10 for migrated saves
- [ ] Save version is incremented for the new attribute fields
- [ ] All existing combat calculations continue to work — physical damage still uses `attack`, monsters still have meaningful HP

---

### US-MS-03: Mana Pool

**As a** player, **I want** a mana pool that fuels my spellcasting, **so that** I must manage my magical resources strategically rather than casting unlimited spells.

**Acceptance Criteria:**
- [ ] Entity has two new numeric fields: `mana` and `maxMana`
- [ ] Base `maxMana` is calculated as: `INT * 2` (level does not contribute — mana scales with INT from gear/effects)
- [ ] Archetype modifier applied to maxMana after base calculation:
  - Arcane: ×1.50 (multiply by 1.5, round down)
  - Finesse: ×0.75 (multiply by 0.75, round down)
  - Might: ×0.25 (multiply by 0.25, round down)
- [ ] Mana starts at maxMana when creating a new game
- [ ] Mana is restored to maxMana on rest at inn or camp
- [ ] Mana persists across level transitions (not reset on stairs)
- [ ] Mana is included in save/load serialization
- [ ] If the player has zero learned spells, mana fields still exist on Entity but the HUD hides the MP bar (see US-MS-06)
- [ ] On learning the first spell, the MP bar becomes visible without requiring any manual toggle
- [ ] maxMana recalculates when INT changes (from equipment, enchantments, etc.)
- [ ] Current mana is clamped to maxMana after recalculation (never exceeds max)

---

### US-MS-04: Mana Regeneration

**As a** player, **I want** mana to regenerate over time, **so that** I can recover from extended spellcasting without needing to constantly find consumables.

**Acceptance Criteria:**
- [ ] Base mana regeneration: +1 mana every 5 turns
- [ ] INT bonus regeneration: +1 mana every `max(1, 20 - floor(INT / 2))` turns (higher INT = faster regen; at INT 16, regen every 12 turns; at INT 40, regen every 1 turn)
- [ ] Base regen and INT bonus regen are tracked with separate turn counters and stack additively
- [ ] Location-based regen multiplier applied to total regen amount:
  - Ley Line convergence (Arcane Academy): 2.0x regen rate
  - Near a Ley Line (within the Academy's region or marked tiles): 1.5x regen rate
  - Normal locations: 1.0x regen rate
  - Dead zone (anti-magic area): 0x regen (no mana regeneration at all)
- [ ] Resting at an inn or camp restores mana to full (maxMana) instantly
- [ ] **Rest action:** Interact with a bed, campfire, or inn tile and choose "Rest" to spend 20 turns resting. Restores HP and mana to full. Cannot rest when enemies are within sight range. Rest can be interrupted by enemy approach (player is woken/alerted).
- [ ] Mana Potion consumable: restores 10 mana immediately, cannot exceed maxMana
- [ ] Mana regeneration functions identically in and out of combat (no special combat regen rules)
- [ ] Regen is processed during the turn update loop alongside status effect ticks
- [ ] Regen does not occur when the player is dead or stunned

---

### US-MS-05: Mana Overload (Insufficient Mana)

**As a** player, **I want** clear feedback when I lack mana to cast a spell, **so that** I understand the resource constraint and can plan accordingly.

**Acceptance Criteria:**
- [ ] If `mana < spellCost`, the spell cannot be cast
- [ ] Attempting to cast with insufficient mana displays the message: `"Not enough mana! (need X, have Y)"` where X is the spell's cost and Y is current mana
- [ ] The insufficient-mana message uses a distinct message type (e.g., `'warning'`) for color-coding in the combat log
- [ ] In the spell selection menu, spells with cost > current mana are visually greyed out (dimmed text or grey color)
- [ ] Greyed-out spells can still be selected (to show the "not enough mana" message) but do NOT consume the player's turn
- [ ] Spells that the player has enough mana for show their cost in the menu: `"Fireball (8 MP)"`
- [ ] There is no HP-to-mana conversion in the base system (this is reserved for Blood Magic in epic 29-forbidden-magic)
- [ ] If the player has exactly enough mana (mana == spellCost), the spell casts successfully and mana drops to 0

---

### US-MS-06: Mana Display in HUD

**As a** player, **I want** to see my mana alongside my health in the HUD, **so that** I can monitor my spellcasting resources at a glance.

**Acceptance Criteria:**
- [ ] The HUD displays an MP bar alongside the existing HP bar in the format: `"HP: 25/30 | MP: 15/20"`
- [ ] The MP bar uses blue color (#4488ff) to visually distinguish it from the HP bar
- [ ] The MP bar is only displayed when the player has learned at least 1 spell OR has mana > 0
- [ ] If the player has no learned spells and mana equals 0, the MP bar is hidden entirely (shows only HP)
- [ ] The MP bar shows current mana / max mana as integers
- [ ] When a mana potion is consumed, the MP bar flashes briefly (CSS animation, ~300ms highlight) to draw attention to the mana gain
- [ ] On small screens (mobile/compact layout), the MP bar uses a compact format: `"MP:15/20"` (no spaces)
- [ ] The MP bar updates immediately when mana changes (casting, regen, potion) — no stale display
- [ ] When mana drops below 20% of maxMana, the MP bar text changes to a warning color (e.g., red or orange) to signal low resources

---

### US-MS-07: Attribute Display

**As a** player, **I want** to see my attributes and derived stats in the character panel, **so that** I understand my character's strengths and can make informed build decisions.

**Acceptance Criteria:**
- [ ] The character status panel displays all 5 core attributes with their current values: STR, INT, WIL, AGI, VIT
- [ ] Attributes are displayed with abbreviated labels (e.g., `"STR: 14  INT: 8  WIL: 10  AGI: 10  VIT: 12"`)
- [ ] Derived stats are shown below attributes: spellPower, magicResist, critChance (%), dodgeChance (%)
- [ ] Derived stats display their calculated values (e.g., `"Spell Power: 19  Magic Resist: 18%  Crit: 4.8%  Dodge: 5.0%"`)
- [ ] On hover or inspect (keyboard shortcut), each derived stat shows a tooltip/breakdown explaining its calculation (e.g., `"Spell Power: 16 (INT) + 3 (WIL/3) = 19"`)
- [ ] Temporary attribute modifiers (buffs/debuffs) are shown in a different color: green for bonuses, red for penalties
- [ ] The level-up screen shows "+1 Talent Point" (no attribute allocation — attributes are fixed)
- [ ] Attributes only change when equipping/unequipping gear or receiving enchantments/effects

---

### US-MS-08: Alternate Magic Resources (Hooks for Other Epics)

**As a** developer, **I want** a well-defined interface for alternate magic resources, **so that** future epics (forbidden magic, psychic powers) can add new resource types without restructuring the core system.

**Acceptance Criteria:**
- [ ] An `AlternateResource` interface is defined in types.ts with the following shape:
  ```typescript
  interface AlternateResource {
    id: string;              // unique identifier (e.g., 'blood_points', 'sanity')
    name: string;            // display name
    current: number;         // current value
    max: number;             // maximum value
    regenRate: number;       // per-turn regeneration (can be 0 or negative)
    depletionEffect: string; // effect ID triggered when resource hits 0
    color: string;           // HUD display color
  }
  ```
- [ ] Entity has an optional `alternateResources: AlternateResource[]` field (empty array by default)
- [ ] The following resource templates are documented as reference specifications (NOT implemented — just defined as comments or a design doc section):
  - **Blood Points:** `max = VIT * 3`, regenRate = 0, depletionEffect = `'death'` — casting drains HP equal to spell cost; referenced by epic 29-forbidden-magic
  - **Sanity:** `max = WIL * 5`, regenRate = +1 per 100 turns, depletionEffect = `'madness'` — lost on void spell cast, low sanity causes hallucinations; referenced by epic 29-forbidden-magic
  - **Psi Points:** `max = (INT + WIL) * 2`, regenRate = 0 (recovered via meditation action), depletionEffect = `'psychic_burnout'` — powers psychic abilities; referenced by epic 52-psychic-powers
  - **Soul Gems:** discrete items, NOT a pool — `max` represents inventory count, consumed on use, depletionEffect = `'none'`; referenced by epic 29-forbidden-magic
- [ ] The HUD rendering logic supports displaying additional resource bars from `alternateResources` (but no resources are added by this epic)
- [ ] The save/load system serializes and deserializes `alternateResources` correctly
- [ ] Adding a new alternate resource requires no changes to the core engine — only the epic-specific module needs to push to the array
- [ ] Unit tests verify the AlternateResource interface: creation, serialization round-trip, and depletion effect triggering

---

## Data Structures

```typescript
// New fields on Entity (types.ts)
interface Entity {
  // ... existing fields ...

  // Core attributes (US-MS-01)
  str: number;    // Strength — physical damage
  int: number;    // Intellect — spell power, mana pool, mana regen
  wil: number;    // Willpower — magic resist, spell power secondary, sanity
  agi: number;    // Agility — dodge, crit, initiative
  vit: number;    // Vitality — max HP, blood magic pool

  // Mana (US-MS-03)
  mana: number;
  maxMana: number;

  // Derived stats (US-MS-02) — recalculated, not stored directly
  // maxHp: derived from VIT only (no level component)
  // attack: derived from STR + weapon
  // physicalDefense: derived from armorValue + VIT
  spellPower: number;
  magicResist: number;
  dodgeChance: number;
  critChance: number;

  // Alternate resources (US-MS-08)
  alternateResources: AlternateResource[];
}

interface AlternateResource {
  id: string;
  name: string;
  current: number;
  max: number;
  regenRate: number;
  depletionEffect: string;
  color: string;
}

// Archetype definitions (replaces old CLASS_ATTRIBUTES)
const ARCHETYPE_ATTRIBUTES: Record<string, {
  str: number; int: number; wil: number; agi: number; vit: number;
  primaryAttribute: 'str' | 'int' | 'wil' | 'agi' | 'vit';
  manaModifier: number;
}> = {
  arcane:  { str:  6, int: 16, wil: 14, agi:  8, vit: 10, primaryAttribute: 'int', manaModifier: 1.50 },
  finesse: { str:  8, int: 10, wil:  8, agi: 16, vit: 12, primaryAttribute: 'agi', manaModifier: 0.75 },
  might:   { str: 14, int:  8, wil: 10, agi: 10, vit: 12, primaryAttribute: 'str', manaModifier: 0.25 },
};

// Class profiles — provide talents, equipment, and mastery affinity (NOT attributes)
const CLASS_PROFILES: Record<string, {
  suggestedArchetype: string;
  startingAbility: string | null;    // Q-key innate ability
  startingSpell: string | null;      // first learned spell
  armorProficiency: 'robes' | 'light' | 'medium' | 'heavy';
  masteryMultipliers: Partial<Record<string, number>>;  // school name → XP multiplier
}> = {
  warrior:     { suggestedArchetype: 'might',   startingAbility: 'whirlwind',   startingSpell: null,          armorProficiency: 'heavy',  masteryMultipliers: {} },
  paladin:     { suggestedArchetype: 'might',   startingAbility: 'holy_strike', startingSpell: null,          armorProficiency: 'heavy',  masteryMultipliers: { restoration: 1.25, enchantment: 1.25 } },
  mage:        { suggestedArchetype: 'arcane',  startingAbility: null,          startingSpell: 'random_t1',   armorProficiency: 'robes',  masteryMultipliers: { elements: 1.5, enchantment: 1.5, restoration: 1.5, divination: 1.5, alchemy: 1.5, conjuration: 1.5, shadow: 1.5 } },
  necromancer: { suggestedArchetype: 'arcane',  startingAbility: null,          startingSpell: 'spell_life_tap', armorProficiency: 'light', masteryMultipliers: { shadow: 1.5, necromancy: 1.5 } },
  cleric:      { suggestedArchetype: 'arcane',  startingAbility: null,          startingSpell: 'spell_heal',  armorProficiency: 'medium', masteryMultipliers: { restoration: 1.5, enchantment: 1.25 } },
  rogue:       { suggestedArchetype: 'finesse', startingAbility: 'smoke_bomb',  startingSpell: null,          armorProficiency: 'light',  masteryMultipliers: { shadow: 1.25, conjuration: 1.25 } },
  ranger:      { suggestedArchetype: 'finesse', startingAbility: 'trap_sense',  startingSpell: null,          armorProficiency: 'medium', masteryMultipliers: { elements: 1.25, divination: 1.25 } },
  bard:        { suggestedArchetype: 'finesse', startingAbility: 'inspire',     startingSpell: null,          armorProficiency: 'light',  masteryMultipliers: { enchantment: 1.25, conjuration: 1.25 } },
};
```

## Formulas Quick Reference

| Derived Stat   | Formula                                         | Example (Mage, INT 16, WIL 14, AGI 8, VIT 8) |
|----------------|------------------------------------------------|---------------------------------------------------|
| maxHp          | `10 + (VIT * 3)`                               | 10 + 24 = 34                                      |
| attack         | `STR + weaponBonus`                             | 6 + 0 = 6                                         |
| spellPower     | `INT + floor(WIL / 3)`                          | 16 + 4 = 20                                       |
| magicResist    | `WIL + floor(INT / 4)` (capped 50%)            | 14 + 4 = 18%                                      |
| dodgeChance    | `AGI * 0.5`%                                    | 4.0%                                               |
| critChance     | `AGI * 0.3`%                                    | 2.4%                                               |
| physicalDefense | `armorValue + floor(VIT / 4)` | 0 + floor(8/4) = 2 (Mage, no armor) |
| maxMana (base) | `INT * 2`                                       | 32                                                 |
| maxMana (mod)  | `base * archetypeModifier`                      | 32 * 1.5 = 48 (Arcane)                             |
| mana regen (base) | `+1 per 5 turns`                             | +1 every 5 turns                                   |
| mana regen (INT) | `+1 per max(1, 20 - floor(INT/2)) turns`      | +1 every 12 turns                                  |

## Implementation Notes

- **Backward compatibility:** The transition from flat stats to derived stats must not break existing combat. Run the full test suite after implementation to verify.
- **Monster attributes:** Monsters can use simplified attributes derived from their tier and level rather than full 5-attribute spreads. A helper function `monsterAttributes(tier, level)` should generate reasonable defaults.
- **Performance:** `recalculateDerivedStats()` will be called frequently. Keep it a simple arithmetic function with no allocations.
- **Save migration:** Bump SAVE_VERSION. Old saves without attributes get reverse-calculated values. Test migration with saves from the current version.
- **Turn counter for regen:** Use modular arithmetic (`turnCount % interval === 0`) rather than decrementing counters, to avoid drift.

## Dependencies

- `types.ts` — Entity interface changes
- `engine.ts` — derived stat calculation, level-up changes, mana regen in turn loop
- `save.ts` — serialization, migration, version bump
- `+page.svelte` — HUD changes (MP bar, attribute display, level-up UI)
- `CharacterConfig` (types.ts) — add archetype field alongside class
- `abilities.ts` — spells will consume mana (but spell definitions are in a separate epic)
- Epic 29 (forbidden-magic) — depends on AlternateResource interface for Blood Points, Sanity, Soul Gems
- Epic 52 (psychic-powers) — depends on AlternateResource interface for Psi Points
- Epic 78 (arcane-academy) — Academy location provides Ley Line convergence mana regen bonus
