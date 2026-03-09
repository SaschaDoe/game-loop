# Enchanting and Rune Inscription

This document defines the enchanting table, item enchantment application, disenchanting, rune inscription, and scroll crafting systems. Enchanting is the practical application of the Stream of Order — imposing permanent magical structure onto physical objects. These mechanics tie directly to the Academy's Ironveil house (School of Enchantment) and provide the foundation that Epic 73 (Enchanting System) extends with cursed enchantments, tiered enchantments, and runic combinations.

**Epic:** 79 — Magic System
**Stories:** US-MS-43 through US-MS-48
**Dependencies:** Equipment/item system (items.ts), EnchantmentType and Enchantment interface (items.ts), attribute system (US-MS-01), mana system (US-MS-03), spell catalog (spell-catalog.md), alchemy reagents (alchemy-and-crafting.md)
**Depended on by:** 73-enchanting-system (cursed enchantments, tiers, runic combinations), 49-magitech-and-artificer (gadget enchanting), 78-arcane-academy (Ironveil house curriculum)

---

## User Stories

### US-MS-43: Enchanting Table

**As a** player, **I want** to find and interact with enchanting tables in the world, **so that** I have dedicated locations where I can enchant, disenchant, and craft scrolls rather than doing it anywhere.

**Acceptance Criteria:**
- [ ] Enchanting tables are rendered as `%` in blue (#4488ff) on the map
- [ ] Enchanting tables are placed at three types of locations:
  - The Academy's Enchantment Lab (always present, tied to Ironveil house)
  - Rare dungeon rooms (5% chance per level, only in rooms, not corridors)
  - Select NPC workshops (specific named NPCs who are enchanters)
- [ ] The player interacts with an enchanting table by bumping into it (same pattern as other interactables)
- [ ] Interaction opens the enchanting menu with three tabs: **Enchant**, **Disenchant**, **Craft Scroll**
- [ ] The Enchant tab displays:
  - List of equipment in inventory eligible for enchantment (items with at least 1 open enchantment slot)
  - Known enchantment types the player has learned (from `knownEnchantments` on GameState)
  - Required reagents for the selected enchantment, with current inventory counts
- [ ] Items at a regular crafting station or alchemy station cannot access the enchanting menu — only enchanting tables provide this interface
- [ ] Enchanting tables are impassable (player cannot walk through them)
- [ ] Enchanting tables are visible through fog of war once discovered (remembered on the map like other landmarks)
- [ ] Tiles containing an enchanting table have a `tileType: 'enchanting_table'` property for interaction detection

---

### US-MS-44: Applying Enchantments

**As a** player, **I want** to apply enchantments to my equipment using reagents and mana, **so that** I can customize my gear with magical properties that complement my build.

**Acceptance Criteria:**
- [ ] Enchanting workflow: select an item from inventory -> select an enchantment type from known enchantments -> review cost -> confirm
- [ ] Enchanting costs both specific reagents and mana. Mana cost is `INT * 2` for base enchantments; more complex enchantments (those requiring 2+ reagents) cost `INT * 3` mana
- [ ] The following enchantment types are available (extending the existing EnchantmentType union):

| Enchantment    | Effect                                         | Reagents Required               |
|----------------|-------------------------------------------------|---------------------------------|
| Fire Damage    | Weapon deals +2 fire damage per hit             | fire_crystal                    |
| Frost Damage   | Weapon deals +2 ice damage + 10% freeze chance  | frost_essence                   |
| Life Steal     | Heal 15% of damage dealt (rounded down, min 1)  | shadowroot + moonwater_vial     |
| Mana Steal     | Restore 1 mana per hit                          | arcane_dust + moonwater_vial    |
| Thorns         | Reflect 20% of melee damage taken back to attacker | fire_crystal + void_salt     |
| Fortify        | +3 max HP while equipped                        | mandrake_root + arcane_dust     |
| Sharpness      | +1 ATK while equipped                           | lightning_shard                  |
| Featherlight   | -1 weight category + 1 AGI while equipped       | starfern + arcane_dust          |
| Warding        | +5% magic resist while equipped                 | arcane_dust + void_salt         |
| Night Vision   | +2 sight radius while equipped                  | moonwater_vial + dreamleaf      |

- [ ] Enchantment slots are determined by item rarity:

| Rarity    | Max Enchantment Slots |
|-----------|-----------------------|
| Common    | 1                     |
| Uncommon  | 1                     |
| Rare      | 2                     |
| Epic      | 2                     |
| Legendary | 3                     |

- [ ] If an item has no remaining enchantment slots, attempting to enchant it displays: `"This item has no enchantment slots remaining."`
- [ ] Success chance is based on INT: base 85% success rate, +1% per point of INT above 10, -2% per point of INT below 10
- [ ] On failure: reagents are consumed, mana is consumed, enchantment is NOT applied. Message: `"The enchantment fizzles. Reagents lost."`
- [ ] On critical failure (only possible when INT < 8, 5% chance among failures): reagents and mana consumed, enchantment not applied, AND the item takes durability damage. Message: `"The enchantment backfires! Your [item name] is damaged."`
- [ ] On success: reagents consumed, mana consumed, enchantment added to item's `enchantments` array. Message: `"You successfully enchant your [item name] with [enchantment name]!"`
- [ ] Enchanting consumes 1 turn (enemies act after enchanting)
- [ ] Only enchantment types present in the player's `knownEnchantments` array can be applied
- [ ] New EnchantmentType values added to the type union: `'sharpness' | 'featherlight' | 'warding' | 'night_vision'`
- [ ] Enchantment effects are applied via the existing equipment stat modifier system — equipping/unequipping an enchanted item recalculates derived stats
- [ ] The player must have all required reagents in inventory; partial reagents are not accepted

---

### US-MS-45: Disenchanting

**As a** player, **I want** to remove enchantments from items and learn new enchantment patterns in the process, **so that** I can recycle enchanted gear and expand my enchanting repertoire.

**Acceptance Criteria:**
- [ ] Disenchanting is available at the enchanting table via the Disenchant tab
- [ ] The Disenchant tab lists all items in inventory that have at least one enchantment
- [ ] Selecting an enchanted item shows its enchantments; the player selects which one to remove
- [ ] Disenchanting removes the selected enchantment from the item's `enchantments` array
- [ ] Disenchanting returns 50% of the original reagents used (rounded down, minimum 1 of each reagent type). For single-reagent enchantments, 1 reagent is always returned
- [ ] If the player does not already know the enchantment type, disenchanting teaches it: the type is added to `knownEnchantments` and the message `"You've learned the [Enchantment Name] enchantment pattern!"` is displayed
- [ ] If the player already knows the enchantment type, display: `"You disenchant the [Enchantment Name] from your [item name]."`
- [ ] Enchantment types must be known (present in `knownEnchantments`) before they can be applied via US-MS-44
- [ ] Sources for learning enchantment types (all add to `knownEnchantments`):
  - Disenchanting an item with that enchantment (this story)
  - Academy Enchantment lessons (Ironveil house curriculum, epic 78)
  - Enchanting books found in dungeons (readable items that teach one type)
  - NPC teachers who teach specific enchantments for gold
- [ ] `knownEnchantments: string[]` is added to GameState
- [ ] `knownEnchantments` is included in save/load serialization
- [ ] `knownEnchantments` persists across level transitions
- [ ] Disenchanting consumes 1 turn

---

### US-MS-46: Rune Inscription

**As a** player, **I want** to inscribe magical runes onto surfaces in the dungeon, **so that** I can set traps, create safe zones, and control the battlefield through strategic placement.

**Acceptance Criteria:**
- [ ] Rune inscription requires: INT 10 or higher, a known rune pattern, and arcane_dust (1 per rune)
- [ ] If INT < 10, attempting to inscribe displays: `"Your mind lacks the focus to inscribe runes. (Requires INT 10)"`
- [ ] Runes can be inscribed on floor tiles, walls, and doors at the player's current position or an adjacent tile
- [ ] Six base rune types are available:

| Rune           | Effect                                                       | Duration / Uses     | Color   |
|----------------|--------------------------------------------------------------|---------------------|---------|
| Ward Rune      | Enemies stepping on it take 3 damage                         | 1 use, then fades   | Red     |
| Alarm Rune     | Alerts the player when any enemy crosses the tile            | Until triggered      | Yellow  |
| Healing Rune   | Standing on the tile heals 2 HP per turn                     | 20 turns            | Green   |
| Light Rune     | Illuminates a 5-tile radius (overrides fog of war)           | 50 turns            | White   |
| Barrier Rune   | Blocks passage like a wall; can be attacked and destroyed (10 HP) | 30 turns or until destroyed | Blue |
| Teleport Rune  | Must be placed in pairs; stepping on one teleports to the other | 10 uses (shared)   | Purple  |

- [ ] Rune inscription takes 3 turns to complete. The player must remain stationary for all 3 turns. Progress message each turn: `"Inscribing rune... (X/3)"`
- [ ] If the player takes damage during inscription, the inscription is interrupted: `"Your concentration is broken! Rune inscription failed."` Arcane_dust is NOT consumed on interruption
- [ ] Arcane_dust is consumed only on successful completion (after the 3rd turn)
- [ ] Runes are rendered as colored `*` on the map, using the color specified in the table above
- [ ] Runes are visible to the player when within FOV (they do not appear through unexplored fog)
- [ ] Maximum 5 active runes at a time. Placing a 6th rune causes the oldest rune to fade: `"Your oldest rune fades as you inscribe a new one."`
- [ ] Teleport Runes count as 1 rune per pair (not 2) toward the 5-rune limit
- [ ] Rune patterns are learned from: Academy Enchantment lessons, dungeon books, NPC teachers. Stored in `knownRunes: string[]` on GameState
- [ ] `knownRunes` is included in save/load serialization and persists across level transitions
- [ ] Active runes are stored as an array on GameState: `activeRunes: Rune[]` where each Rune has position, type, remaining duration/uses, and paired rune reference (for Teleport)
- [ ] Active runes on the current level are serialized in save data; runes on other levels are lost when leaving that level
- [ ] Enemies do not intentionally avoid runes (they are unaware of them)
- [ ] Ward Rune damage bypasses armor (direct magical damage)
- [ ] Alarm Rune triggers a distinct message: `"Your alarm rune was triggered at (X, Y)!"` — does NOT alert enemies
- [ ] Barrier Rune tiles have collision like walls; enemies and the player cannot pass through them. Enemies can attack the barrier (10 HP, no defense)

---

### US-MS-47: Scroll Crafting

**As a** player, **I want** to craft scrolls from spells I know, **so that** I can prepare emergency magic items usable by any class without mana cost or spell knowledge.

**Acceptance Criteria:**
- [ ] Scroll crafting is available at the enchanting table via the Craft Scroll tab
- [ ] The Craft Scroll tab lists all spells in the player's `learnedSpells` that have scroll-craftable versions
- [ ] Crafting a scroll requires: INT 10 or higher, the spell in `learnedSpells`, the spell's reagent components + 1 additional arcane_dust
- [ ] If INT < 10, attempting to craft displays: `"Your mind lacks the precision to bind magic to parchment. (Requires INT 10)"`
- [ ] Crafted scroll is added to inventory as an item with type `'scroll'`, name `"Scroll of [Spell Name]"`, and a reference to the spell it contains
- [ ] Using a scroll from inventory auto-casts the referenced spell:
  - Uses the spell's targeting mode (if the spell requires targeting, the player enters targeting mode)
  - Does NOT consume mana
  - Does NOT require the spell to be in `learnedSpells` (anyone can use a scroll)
  - Does NOT trigger spell cooldowns
  - Is NOT affected by cooldowns (scrolls are always usable)
- [ ] Scroll spells use base damage/healing values only — no spellPower scaling. The spell fires as if cast by a character with 0 spell power bonus
- [ ] Scroll crafting consumes 1 turn
- [ ] Scroll items stack in inventory (e.g., "Scroll of Firebolt x3")
- [ ] Scrolls can be sold to merchants (sell value: 50% of reagent cost in gold equivalent)
- [ ] Scrolls found as dungeon loot are pre-crafted and usable immediately (no INT requirement to use, only to craft)
- [ ] Example scrolls: "Scroll of Firebolt", "Scroll of Arcane Ward", "Scroll of Healing Touch", "Scroll of Frost Lance"
- [ ] Non-caster classes (Warrior, Rogue) benefit most from scrolls — they provide emergency access to healing, damage, and utility magic without needing to invest in INT or learn spells
- [ ] Scroll count is visible in the inventory UI with the scroll icon and quantity

---

### US-MS-48: Enchanting Progression (Hooks for Epic 73)

**As a** developer, **I want** clearly defined extension points in the enchanting system, **so that** Epic 73 (Enchanting System) can add advanced features without restructuring the base mechanics built in Epic 79.

**Acceptance Criteria:**
- [ ] The following features are documented as the extension interface for Epic 73 but are NOT implemented in Epic 79:
  - **Cursed Enchantments:** Enchantments with hidden negative effects that are not revealed until the item is equipped. Requires: `cursed: boolean` flag on Enchantment, identification mechanic to detect curses before equipping, curse removal at specific NPCs or via spell
  - **Enchantment Tiers:** Four tiers of enchantment potency — Faint, Minor, Major, Powerful. Each tier increases reagent cost and effect magnitude. Requires: `tier: EnchantmentTier` field on Enchantment, tier-specific reagent multipliers, INT thresholds per tier (e.g., Powerful requires INT 18+)
  - **Runic Combination Patterns:** When 2 or more runes are placed within 3 tiles of each other, they can create amplified or combined effects (e.g., Ward + Light = enemies take damage AND are revealed). Requires: combination lookup table, proximity detection on rune placement
  - **Ancient Rune Reading:** Discover new rune types by examining dungeon inscriptions and deciphering ancient text. Requires: inscription tile type, INT-based deciphering check, lore-connected rune names
  - **Equipment Set Bonuses:** When multiple equipped items share matching enchantment types, a set bonus activates (e.g., 3 items with Fire Damage enchantment = +10% total fire damage). Requires: set detection on equipment change, set bonus definitions, HUD indicator for active sets
- [ ] Epic 79 provides the following base systems that Epic 73 builds on:
  - Enchanting table interaction and UI (US-MS-43)
  - Base enchantment types with flat effects and single potency (US-MS-44)
  - Disenchanting and enchantment learning (US-MS-45)
  - Rune placement with 6 base types (US-MS-46)
  - Scroll crafting from known spells (US-MS-47)
- [ ] The `Enchantment` interface supports optional fields for future extension:
  ```typescript
  interface Enchantment {
    type: EnchantmentType;
    potency: number;
    tier?: EnchantmentTier;    // Epic 73: Faint | Minor | Major | Powerful
    cursed?: boolean;          // Epic 73: hidden negative effect
    curseEffect?: string;      // Epic 73: effect ID applied on equip
  }
  ```
- [ ] The `Rune` interface supports optional fields for future extension:
  ```typescript
  interface Rune {
    id: string;
    type: RuneType;
    position: { x: number; y: number };
    remainingDuration?: number;
    remainingUses?: number;
    pairedRuneId?: string;
    combinationBonus?: string;  // Epic 73: active combination effect
  }
  ```
- [ ] `EnchantmentTier` type is defined but not used in Epic 79: `type EnchantmentTier = 'faint' | 'minor' | 'major' | 'powerful'`
- [ ] No game logic references `tier`, `cursed`, `curseEffect`, or `combinationBonus` in Epic 79 — these fields exist only for forward compatibility

---

## Data Structures

```typescript
// Expanded EnchantmentType (items.ts)
export type EnchantmentType =
  | 'fire_damage' | 'frost_damage' | 'life_steal' | 'mana_steal'
  | 'thorns' | 'fortify'
  | 'sharpness' | 'featherlight' | 'warding' | 'night_vision';

// Forward-compatible tier type (items.ts)
export type EnchantmentTier = 'faint' | 'minor' | 'major' | 'powerful';

// Extended Enchantment interface (items.ts)
export interface Enchantment {
  type: EnchantmentType;
  potency: number;
  tier?: EnchantmentTier;
  cursed?: boolean;
  curseEffect?: string;
}

// Enchantment recipe definition
export interface EnchantmentRecipe {
  type: EnchantmentType;
  reagents: string[];          // reagent item IDs required
  manaCostMultiplier: number;  // 2 for single-reagent, 3 for multi-reagent
  description: string;
}

// Rune types
export type RuneType = 'ward' | 'alarm' | 'healing' | 'light' | 'barrier' | 'teleport';

// Rune instance
export interface Rune {
  id: string;
  type: RuneType;
  position: { x: number; y: number };
  remainingDuration?: number;
  remainingUses?: number;
  pairedRuneId?: string;
  combinationBonus?: string;
}

// Scroll item (extends Item)
export interface ScrollItem extends Item {
  itemType: 'scroll';
  spellId: string;            // reference to spell definition
  stackCount: number;
}

// New fields on GameState (types.ts)
interface GameState {
  // ... existing fields ...
  knownEnchantments: string[];   // learned enchantment type IDs
  knownRunes: string[];          // learned rune type IDs
  activeRunes: Rune[];           // currently placed runes (max 5)
  runeInscriptionProgress?: {    // non-null while inscribing
    type: RuneType;
    turnsRemaining: number;
    targetPosition: { x: number; y: number };
  };
}
```

## Enchantment Slot Reference

| Rarity    | Slots | Typical Source                     |
|-----------|-------|------------------------------------|
| Common    | 1     | Basic shop items, early drops      |
| Uncommon  | 1     | Mid-level drops, crafted gear      |
| Rare      | 2     | Late dungeon drops, quest rewards  |
| Epic      | 2     | Boss drops, rare quest rewards     |
| Legendary | 3     | Artifacts, unique quest items      |

## Success Rate Formula

```
baseChance = 85
intBonus = max(0, INT - 10) * 1       // +1% per INT above 10
intPenalty = max(0, 10 - INT) * 2      // -2% per INT below 10
successChance = clamp(baseChance + intBonus - intPenalty, 5, 99)

// Critical failure: only when INT < 8, 5% of failed attempts
if (roll > successChance && INT < 8) {
  criticalFailureChance = 5
  if (critRoll <= criticalFailureChance) → item damaged
}
```

## Dependencies

- `items.ts` — EnchantmentType union expansion, Enchantment interface changes, new item types (scrolls)
- `types.ts` — GameState fields: knownEnchantments, knownRunes, activeRunes, runeInscriptionProgress
- `engine.ts` — enchanting table interaction, rune tick processing, scroll usage, rune inscription turn tracking
- `map.ts` — enchanting table tile placement, rune rendering
- `save.ts` — serialize knownEnchantments, knownRunes, activeRunes; version bump
- `+page.svelte` — enchanting menu UI (3 tabs), rune inscription progress indicator, scroll usage from inventory
- `artifacts.ts` — update addRandomEnchantment to include new enchantment types
- `fov.ts` — Light Rune illumination override
- Epic 73 (enchanting-system) — extends with tiers, curses, combinations, ancient runes, set bonuses
- Epic 78 (arcane-academy) — Ironveil house teaches enchantment types and rune patterns
