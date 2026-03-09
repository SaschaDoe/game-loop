# Alchemy and Crafting

The alchemy and crafting system is the hands-on foundation for potion brewing, reagent gathering, and item creation. Epic 79 delivers the core loop: find reagents, learn recipes, brew potions at stations, and use potions with real mechanical effects. It fixes the current problem where all potions just heal HP, and establishes the crafting infrastructure that Epic 26 (Alchemy and Potions) will later extend with advanced mechanics.

## Current State

- `alchemy.ts` defines 12 recipes and a `canBrew()` function, but none of it is wired into gameplay
- `items.ts` has 11 reagent items (fire_crystal, frost_essence, lightning_shard, arcane_dust, moonwater_vial, starfern, shadowroot, phoenix_ash, void_salt, mandrake_root, dreamleaf)
- All potion items currently just heal HP (e.g., Mana Potion heals 8 HP, Strength Elixir heals 5 HP)
- The Academy Alchemy Tower and Professor Thornwick exist in lore but have no crafting integration
- Inventory system supports 12 slots; equipment system exists

---

## User Stories

### Crafting Infrastructure

#### US-MS-34: Alchemy Station Interaction

As a player, I want to interact with alchemy stations in the world, so that I have a dedicated place to brew potions and compounds.

**Details:**
- Alchemy stations are specific tiles represented as `&` rendered in green
- Walking onto a station tile and pressing E or Enter opens the brewing menu
- The Academy Alchemy Tower contains a station (always available to students)
- Additional stations can be found in:
  - Dungeons (rare, roughly 1 in 10 floors)
  - NPC homes (alchemist NPCs have personal stations)
  - Future: player-built stations (out of scope for Epic 79)
- Brewing menu displays:
  - List of all known recipes (unknown recipes show as "???")
  - For each known recipe: ingredient list with color coding (green if ingredient is in inventory, red if missing)
  - "Brew" button (enabled only when all ingredients are present)
- Cannot brew without standing on a station tile
- Brewing consumes 1 game turn

**Acceptance Criteria:**
- [ ] Alchemy station tiles (`&`, green) render correctly on the map
- [ ] Pressing E or Enter on a station tile opens the brewing menu
- [ ] Pressing E or Enter on a non-station tile does not open the menu
- [ ] Brewing menu lists known recipes with correct ingredient availability colors
- [ ] Unknown recipes display as "???" and cannot be selected
- [ ] Attempting to brew away from a station shows "You need an alchemy station to brew."
- [ ] Brewing advances the game by 1 turn

---

#### US-MS-35: Recipe Catalog and Learning

As a player, I want to discover and learn alchemy recipes through multiple paths, so that recipe knowledge feels earned and exploration is rewarded.

**Details:**
- New field on GameState: `knownRecipes: string[]` — starts as an empty array
- Recipes are learned through four channels:
  - **Academy lessons:** Health Potion recipe in Lesson 2; Antidote and Mana Potion recipes in Lesson 5
  - **Books:** Alchemy books found in the world (dungeon loot, bookshelves) teach the recipes described within them when read
  - **NPC gifts:** Professor Thornwick teaches bonus recipes to students who complete tasks for him
  - **Experimentation:** combining reagents at a station can discover unknown recipes (see US-MS-39)
- The base recipe catalog contains 12 recipes (matching the existing alchemy.ts definitions), with room for other epics to register additional recipes
- Unknown recipes appear in the brewing menu as "???" — visible but not selectable
- `knownRecipes` is included in save data and persists across sessions

**Acceptance Criteria:**
- [ ] `knownRecipes` field exists on GameState, initialized to empty array
- [ ] Completing Academy Lesson 2 adds "health_potion" to knownRecipes
- [ ] Completing Academy Lesson 5 adds "antidote" and "mana_potion" to knownRecipes
- [ ] Reading an alchemy book adds its described recipes to knownRecipes
- [ ] NPC dialogue can add recipes to knownRecipes via dialogue effects
- [ ] Duplicate recipe learns are silently ignored (no error, no duplicate entries)
- [ ] Unknown recipes render as "???" in the brewing menu
- [ ] knownRecipes persists through save/load cycles
- [ ] At least 12 base recipes are defined in the catalog

---

### Brewing and Potion Effects

#### US-MS-36: Brewing Mechanics

As a player, I want to brew potions by combining reagents, so that I can create useful consumables from ingredients I've gathered.

**Details:**
- Brewing flow: select a known recipe -> system checks inventory for all required ingredients -> if all present, consume ingredients from inventory -> produce result item
- Result item is added to inventory; if inventory is full (12 slots), brewing fails with message: "Inventory full! Clear a slot first." (ingredients are NOT consumed on inventory-full failure)
- Successful brewing grants +5 XP
- INT attribute affects quality:
  - If INT > 12: 20% chance the result is a "Superior" version with 1.5x effect magnitude
  - If INT < 8: 10% chance of brewing failure — ingredients are consumed but no potion is produced; message: "The mixture bubbles over and is lost."
- Success message format: "You combine [Ingredient1] and [Ingredient2]... [Potion Name] brewed!"
- Superior result message: "You combine [Ingredient1] and [Ingredient2]... Superior [Potion Name] brewed!"

**Acceptance Criteria:**
- [ ] Selecting a recipe with all ingredients present consumes ingredients and produces the result item
- [ ] Ingredients are removed from inventory on successful brew
- [ ] Result item appears in inventory after brewing
- [ ] Brewing with full inventory shows error message and does not consume ingredients
- [ ] +5 XP is awarded per successful brew
- [ ] INT > 12 gives 20% chance of Superior quality (1.5x effect)
- [ ] INT < 8 gives 10% chance of failure (ingredients consumed, no output)
- [ ] Appropriate messages display for success, superior success, failure, and inventory-full scenarios

---

#### US-MS-37: Real Potion Effects (Fix the HP-Only Problem)

As a player, I want each potion to have a distinct and meaningful effect, so that crafting different potions matters and isn't just another way to heal.

**Details:**
Rework all potion item definitions in items.ts to have real effects:

| Potion | Effect |
|--------|--------|
| Health Potion | Restore 10 HP (keep as-is) |
| Mana Potion | Restore 10 mana (NOT HP) |
| Antidote | Remove poison status effect + restore 3 HP |
| Strength Elixir | +3 ATK for 15 turns (temporary buff) |
| Fire Resistance Draught | Immune to burn status + 50% fire damage reduction for 20 turns |
| Frost Ward Tonic | Immune to freeze status + 50% ice damage reduction for 20 turns |
| Fortification Elixir | +5 damage reduction for 15 turns (shield-like absorb) |
| Invisibility Draught | Invisible for 8 turns; enemies cannot detect you; breaks immediately on attacking |
| Truth Serum | Used on NPC via dialogue; unlocks hidden dialogue options for 1 conversation |
| Dreamwalker Elixir | Reveals the entire current floor map for 20 turns (powerful True Sight) |
| Transmutation Philter | Doubles the effect of the next potion consumed (must be used before the other potion) |
| Philosopher's Draught | Full HP heal + full mana restore + cure all status effects (legendary) |

- Consuming a potion costs 1 game turn (except Truth Serum, which is used within dialogue and does not cost a turn)
- Potion is removed from inventory on use
- Buff potions add entries to the existing status effect system with appropriate durations
- Transmutation Philter sets a flag that doubles the next potion's numeric values

**Acceptance Criteria:**
- [ ] Health Potion restores 10 HP
- [ ] Mana Potion restores 10 mana, does NOT restore HP
- [ ] Antidote removes poison status and restores 3 HP
- [ ] Strength Elixir grants +3 ATK buff lasting 15 turns
- [ ] Fire Resistance Draught grants burn immunity and 50% fire damage reduction for 20 turns
- [ ] Frost Ward Tonic grants freeze immunity and 50% ice damage reduction for 20 turns
- [ ] Fortification Elixir grants +5 damage reduction for 15 turns
- [ ] Invisibility Draught makes player invisible for 8 turns; enemies ignore player; attacking ends invisibility
- [ ] Truth Serum unlocks hidden NPC dialogue options for the current conversation
- [ ] Dreamwalker Elixir reveals entire floor map for 20 turns
- [ ] Transmutation Philter doubles the next potion's effect values
- [ ] Philosopher's Draught fully heals HP, mana, and cures all statuses
- [ ] All potions are consumed from inventory on use
- [ ] Consuming a potion costs 1 turn (except Truth Serum in dialogue)

---

### Reagent Economy

#### US-MS-38: Reagent Gathering

As a player, I want to find reagents throughout the world, so that I have a steady supply of crafting ingredients to fuel my alchemy.

**Details:**
- Reagent sources:
  - **Dungeon chests:** 30% chance to contain 1-2 random reagents
  - **Dungeon floor drops:** 5% chance per room to have a reagent item on the ground (walk over to pick up)
  - **Academy greenhouse:** 3 fixed reagent spawns that refresh every 5 in-game days
  - **Shop NPCs:** Reagent merchants sell reagents at varying prices
  - **Enemy drops:** Certain enemies drop specific reagents (Fire Imp -> fire_crystal, Slime -> mandrake_root, Ice Elemental -> frost_essence, Shadow Wraith -> shadowroot, etc.)
- Reagents are standard inventory items and occupy inventory slots
- Reagent rarity tiers affect spawn frequency:
  - **Common** (3x spawn weight): starfern, mandrake_root, arcane_dust
  - **Uncommon** (1x spawn weight): frost_essence, fire_crystal, moonwater_vial, lightning_shard, shadowroot
  - **Rare** (0.33x spawn weight): phoenix_ash, void_salt, dreamleaf

**Acceptance Criteria:**
- [ ] Dungeon chests have a 30% chance to contain 1-2 reagents
- [ ] Dungeon rooms have a 5% chance to contain a floor reagent
- [ ] Academy greenhouse spawns 3 reagents that refresh every 5 in-game days
- [ ] At least one merchant NPC sells reagents
- [ ] Specific enemy types drop their associated reagents on death
- [ ] Common reagents appear roughly 3x as often as uncommon, and 9x as often as rare
- [ ] Reagents occupy inventory slots and can be picked up, dropped, and stored
- [ ] All 11 existing reagent types are obtainable through at least one source
- [ ] **Reagent Pouch:** A dedicated 8-slot container for reagents, separate from the main 12-slot inventory. Acquired at character creation (all characters start with one) or purchased from merchants.
- [ ] Reagents auto-sort into the reagent pouch when picked up, if the pouch has space
- [ ] If the reagent pouch is full, reagents go to main inventory as a fallback
- [ ] The brewing menu reads from both the pouch and main inventory when checking ingredient availability
- [ ] The reagent pouch is accessible via the inventory screen as a separate tab or section
- [ ] The reagent pouch is included in save/load serialization

---

### Discovery and Experimentation

#### US-MS-39: Alchemical Experimentation

As a player, I want to experiment by combining reagents freely, so that I can discover new recipes through trial and error rather than only being taught.

**Details:**
- At an alchemy station, pressing X enters "experiment mode"
- In experiment mode, select 2-3 reagents from inventory to combine
- Three possible outcomes:
  1. **Known recipe match:** combination matches a recipe in knownRecipes -> brew it normally (same as US-MS-36)
  2. **Unknown recipe match:** combination matches a recipe NOT in knownRecipes -> discover it! Add to knownRecipes + brew the result. Message: "You've discovered the recipe for [Potion Name]!"
  3. **No recipe match:** combination matches no recipe -> ingredients are consumed and produce a "Foul Mixture" item. Message: "The mixture doesn't seem right..."
- Foul Mixture: consumable that deals 2 damage to self when drunk, or can be thrown at an enemy for 3 damage (range 3 tiles)
- INT affects experimentation hints:
  - INT >= 10: "The mixture fizzes warmly — you feel close to something..." when 2 of 3 correct reagents are used
  - INT >= 14: "You sense [Reagent Name] might complete this mixture..." when 2 of 3 correct reagents are used (names the missing reagent)
  - INT < 10: no hints

**Acceptance Criteria:**
- [ ] Pressing X at an alchemy station enters experiment mode
- [ ] Player can select 2-3 reagents from inventory to combine
- [ ] Matching a known recipe brews it normally
- [ ] Matching an unknown recipe discovers it, adds to knownRecipes, and brews the result
- [ ] Non-matching combinations produce a Foul Mixture and consume ingredients
- [ ] Foul Mixture deals 2 self-damage when consumed or 3 damage when thrown
- [ ] INT >= 10 shows a "close to something" hint when partially correct
- [ ] INT >= 14 names the missing reagent in the hint
- [ ] INT < 10 provides no hints on failed experiments
- [ ] Discovery grants the same +5 XP as regular brewing (plus the recipe knowledge)

---

### Combat Crafting

#### US-MS-40: Poison Crafting

As a player, I want to craft poisons and apply them to weapons, so that my Rogue (or any resourceful character) can add debilitating effects to melee attacks.

**Details:**
- Poison recipes use the same alchemy station and brewing mechanics as potions
- 4 base poisons:

| Poison | Effect | Recipe (indicative) |
|--------|--------|---------------------|
| Paralyzing Poison | Stun target for 3 turns | shadowroot + lightning_shard |
| Weakening Poison | -2 ATK for 10 turns | mandrake_root + void_salt |
| Sleep Poison | Stun for 5 turns (breaks on any damage) | dreamleaf + moonwater_vial |
| Lethal Poison | 3 damage/turn for 5 turns | shadowroot + void_salt + phoenix_ash |

- Applying poison to a weapon: select poison from inventory -> select an equipped weapon -> "Your [Weapon] is coated in [Poison Name] (5 hits remaining)"
- Coated weapon applies the poison's effect on the next 5 successful melee hits, then the coating is consumed
- Poison recipes are NOT taught at the Academy (Thornwick refuses: "Such things are beneath this institution.")
- Learning sources:
  - Books found in restricted library sections or hidden dungeon rooms
  - Rogue-class NPCs encountered in the world may share recipes through dialogue
  - Experimentation with shadowroot + void_salt + other reagents (see US-MS-39)
- Crafting any poison shifts the player's moral alignment slightly toward "dark" (alignment system hook for future use)

**Acceptance Criteria:**
- [ ] 4 poison recipes are defined and brewable at alchemy stations
- [ ] Brewed poisons appear as inventory items
- [ ] Poisons can be applied to equipped weapons via inventory interaction
- [ ] Coated weapons display their poison name and remaining hit count
- [ ] Poison effects trigger on successful melee hits against enemies
- [ ] Coating wears off after 5 hits
- [ ] Poison recipes are not available through Academy lesson progression
- [ ] Poison recipes are learnable through books, NPCs, and experimentation
- [ ] Crafting a poison shifts moral alignment toward dark

---

#### US-MS-41: Explosive Compounds

As a player, I want to craft throwable bombs, so that I have area-of-effect options in combat regardless of my class.

**Details:**
- 3 throwable bombs crafted at alchemy stations:

| Bomb | Recipe | Effect |
|------|--------|--------|
| Fire Bomb | fire_crystal + arcane_dust | 6 fire damage in 3x3 AoE + burn status |
| Frost Bomb | frost_essence + arcane_dust | 4 ice damage in 3x3 AoE + freeze status |
| Smoke Bomb (item) | shadowroot + mandrake_root | No damage; creates fog in 5x5 area (blocks line of sight) |

- Throwing: select bomb from inventory -> press T to enter targeting mode -> move cursor to target tile (range 5 tiles) -> confirm with Enter -> bomb detonates at target
- Uses the same targeting system as spell casting (cursor movement, range indicator, confirm/cancel)
- Bombs are single-use consumables (removed from inventory on throw)
- No INT requirement — any character class can throw bombs
- The Rogue class Q-ability Smoke Bomb is a separate mechanic: it is cooldown-based, centered on self, and costs no inventory slot. The crafted Smoke Bomb item has a larger area (5x5 vs ability's area), can be targeted at range, but uses an inventory slot and is consumed

**Acceptance Criteria:**
- [ ] 3 bomb recipes are defined and brewable at alchemy stations
- [ ] Bombs appear as inventory items after brewing
- [ ] Pressing T with a bomb selected enters targeting mode
- [ ] Targeting cursor can be moved within a 5-tile range
- [ ] Confirming a target detonates the bomb at the chosen tile
- [ ] Fire Bomb deals 6 fire damage in a 3x3 area and applies burn
- [ ] Frost Bomb deals 4 ice damage in a 3x3 area and applies freeze
- [ ] Smoke Bomb creates a 5x5 fog zone that blocks line of sight
- [ ] Bombs are consumed on use
- [ ] Crafted Smoke Bomb item and Rogue Q-ability Smoke Bomb function independently

---

### Extension Points

#### US-MS-42: Advanced Alchemy (Hooks for Epic 26)

As a developer, I want Epic 79's alchemy system to define clean extension points, so that Epic 26 (Alchemy and Potions) can build advanced mechanics on top of the foundation without rewriting it.

**Details:**
This story does NOT implement any advanced alchemy features. It documents the interface contract between Epic 79 and Epic 26.

Epic 79 provides the base layer:
- Brewing UI and station interaction (US-MS-34)
- Recipe catalog with learn/discover mechanics (US-MS-35)
- Ingredient management and inventory integration (US-MS-38)
- Core potion effects with the status effect system (US-MS-37)
- Experimentation and discovery loop (US-MS-39)

Epic 26 will extend this with:
- **Potion quality tiers:** Standard (base), Superior (+50% effect), Masterwork (+100% effect). Epic 79 implements the Superior tier via INT check; Epic 26 generalizes this into a full quality system with explicit tier tracking.
- **Base liquids:** Water, alcohol, oil, and blood as recipe modifiers that alter a potion's delivery mechanism (e.g., oil-based potions last longer, alcohol-based potions act faster but have side effects).
- **Catalyst gems:** Ruby, sapphire, emerald, and diamond as optional additions during brewing that boost potency, add secondary effects, or guarantee quality tiers.
- **Potion addiction:** Overuse of the same potion type causes dependency — withdrawal symptoms (stat penalties) when the effect expires, escalating with repeated use.
- **Transmutation:** Convert materials between types at a station (e.g., 3 common reagents -> 1 uncommon reagent, reagent + catalyst -> different reagent).

To support these extensions, Epic 79 recipes should use a data-driven format that Epic 26 can extend:

```typescript
interface AlchemyRecipe {
  id: string;
  name: string;
  ingredients: string[];       // reagent item IDs
  result: string;              // result item ID
  category: 'potion' | 'poison' | 'bomb' | 'advanced';  // extensible
  baseLiquid?: string;         // Epic 26: optional base liquid modifier
  catalyst?: string;           // Epic 26: optional catalyst gem
  qualityTier?: 'standard' | 'superior' | 'masterwork';  // Epic 26: quality system
}
```

**Acceptance Criteria:**
- [ ] AlchemyRecipe interface is defined with optional fields for Epic 26 extensions
- [ ] Recipe registration is data-driven (recipes defined as data, not hardcoded switch statements)
- [ ] Brewing function accepts optional parameters for base liquid and catalyst (ignored in Epic 79, used by Epic 26)
- [ ] Potion effect application is modular (effect logic separated from brewing logic, so Epic 26 can intercept and modify effects)
- [ ] Quality tier field exists on crafted potion items (Epic 79 sets "standard" or "superior"; Epic 26 adds "masterwork")
- [ ] No Epic 26 features are implemented — only the extension points and interfaces are defined

---

## Dependencies

- `alchemy.ts` — existing recipe catalog (12 recipes, `canBrew()`)
- `items.ts` — existing reagent and potion item definitions
- `status-effects.ts` — buff/debuff system for potion effects
- `engine.ts` — turn system, input handling, game loop
- `inventory` system — 12-slot inventory, item use
- `dialogue.ts` — NPC interactions (Thornwick, recipe teaching, Truth Serum)
- `save.ts` — persistence of knownRecipes and crafted items
- Academy Alchemy Tower / Professor Thornwick — existing lore and location
- Epic 26 (Alchemy and Potions) — consumes the extension points defined in US-MS-42
