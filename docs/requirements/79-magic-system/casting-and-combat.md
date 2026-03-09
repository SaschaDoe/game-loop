# Casting and Combat

This document defines the spell casting UI, targeting system, damage calculations, cooldown mechanics, counter-spell system, enemy spellcasters, and spell-environment interactions. These are the core mechanics that connect the spell catalog (US-MS-17 to US-MS-22) to the player's moment-to-moment gameplay. Every system here builds on the attribute and mana foundations from `attributes-and-resources.md` and the spell definitions from `spell-catalog.md`.

**Epic:** 79 — Magic System
**Stories:** US-MS-23 through US-MS-33
**Dependencies:** Entity attributes (US-MS-01), mana pool (US-MS-03), derived stats (US-MS-02), spell catalog (US-MS-17 to US-MS-22), status effects (status-effects.ts), fog of war (fov.ts), existing combat in engine.ts
**Depended on by:** 78-arcane-academy (Academy combat lessons), 29-forbidden-magic (forbidden spell casting), 48-summoning-and-conjuration (conjured entity combat)

---

## User Stories

### US-MS-23: Spell Menu (M Key)

**As a** player, **I want** to press M to open a spell menu showing all my learned spells, **so that** I can browse my available magic and choose which spell to cast.

**Acceptance Criteria:**
- [ ] Pressing M opens a spell menu overlay on top of the game view (does not replace the map)
- [ ] The menu displays all spells in `learnedSpells[]`, grouped by school (e.g., "Elements", "Enchantment", "Shadow")
- [ ] Each school group has a header showing the school name and its ASCII icon/color
- [ ] Each spell entry displays: spell name, school icon, mana cost (e.g., `"5 MP"`), cooldown status, and tier (T1/T2/T3/T4/T5)
- [ ] Spells with insufficient mana (cost > current mana) are displayed in grey/dimmed text
- [ ] Spells currently on cooldown are displayed in grey/dimmed text with remaining turns shown (e.g., `"Firebolt [2 turns]"`)
- [ ] Spells that are both castable (enough mana, off cooldown) display in their school's color
- [ ] The player can select a spell by pressing number keys 1-9 (mapped to visible list order) or by using arrow keys to highlight and Enter to confirm
- [ ] Pressing M again or Escape closes the menu without casting — no turn consumed
- [ ] Opening the spell menu does NOT consume the player's turn (browsing is free)
- [ ] Selecting a greyed-out spell displays a message explaining why it cannot be cast (`"Not enough mana!"` or `"On cooldown: 3 turns remaining"`) and does NOT consume a turn
- [ ] Selecting a castable spell closes the menu and proceeds to targeting (US-MS-25) or immediate cast for self-targeting spells
- [ ] If the player has no learned spells, pressing M displays the message `"You haven't learned any spells yet."` and does not open the menu
- [ ] The menu is scrollable if the player has more spells than fit on screen
- [ ] Spells display their effective mana cost after armor penalty: heavy armor +50%, medium armor +25%, light armor no change, robes -10%. Example: Firebolt (3 MP) in heavy armor shows as `"Firebolt (5 MP)"`. The Battlemage specialization (US-MS-59) removes medium armor penalty.
- [ ] The first time the player learns a spell, a tutorial message appears: `"You have learned your first spell! Press M to open the spell menu, or assign it to a quick-cast slot (1-4)."`

---

### US-MS-24: Quick-Cast Slots

**As a** player, **I want** to assign spells to quick-cast slots bound to number keys, **so that** I can cast my most-used spells instantly without navigating the full spell menu.

**Acceptance Criteria:**
- [ ] The player has 4 quick-cast slots, bound to keys 1, 2, 3, and 4
- [ ] Quick-cast slots are stored as `quickCastSlots: [string | null, string | null, string | null, string | null]` on GameState (spell ID or null for empty)
- [ ] The HUD displays a quick-cast bar below or beside the HP/MP bars in the format: `[1:Firebolt 5mp] [2:Ward 3mp] [3:---] [4:---]`
- [ ] Empty slots display `"---"` in the quick-cast bar
- [ ] Slots with spells on cooldown display in grey with remaining turns: `[1:Firebolt (2t)]`
- [ ] Slots with spells that cost more than current mana display in grey
- [ ] Pressing 1-4 during normal gameplay immediately begins casting the assigned spell (skips the spell menu entirely)
- [ ] If the pressed slot is empty, display `"No spell in slot X"` — no turn consumed
- [ ] If the assigned spell is on cooldown or the player lacks mana, display the appropriate warning — no turn consumed
- [ ] The player can assign spells to slots from within the spell menu (M key): highlight a spell, then press Shift+1 through Shift+4 to assign it to that slot
- [ ] When the player learns a new spell, if any quick-cast slot is empty, the spell is auto-assigned to the first empty slot
- [ ] If a spell is unlearned or removed, its quick-cast slot is cleared to `null`
- [ ] Quick-cast slots persist in save files
- [ ] Quick-cast keys (1-4) do NOT conflict with the spell menu's 1-9 selection (1-4 only work when the spell menu is closed; inside the menu, 1-9 select from the list)

---

### US-MS-25: Targeting System

**As a** player, **I want** a targeting system that lets me aim spells at specific enemies or locations, **so that** I have tactical control over where my magic lands.

**Acceptance Criteria:**
- [ ] Self-targeting spells (wards, buffs, self-heals) cast immediately on selection — no targeting phase, proceed directly to execution (US-MS-26)
- [ ] Single-target spells enter targeting mode upon selection: a cursor appears on the map at the player's position
- [ ] In targeting mode, arrow keys move the cursor tile by tile across the map
- [ ] Pressing Enter confirms the target; pressing Escape cancels targeting and returns to normal play — no mana spent, no turn consumed
- [ ] The cursor is rendered as a blinking or highlighted tile (distinct from the normal map rendering)
- [ ] Valid target tiles (within range, in line of sight, not blocked by walls) are highlighted or tinted to show the spell's reach
- [ ] Out-of-range tiles are visually greyed out or unmarked when the cursor moves over them
- [ ] Line of sight uses the existing FOV system — targets behind walls cannot be selected
- [ ] When the cursor is on a tile containing an enemy, the HUD displays: `"Target: [name] (HP: X/Y)"` — e.g., `"Target: Goblin (HP: 12/15)"`
- [ ] When the cursor is on an empty valid tile (for AoE placement or terrain-targeting spells), the HUD displays: `"Target: [tile type] (range: N)"`
- [ ] Range is displayed as the number of tiles (Chebyshev distance) from the player to the cursor
- [ ] Attempting to confirm a target that is out of range or out of line of sight displays: `"Invalid target — out of range"` or `"Invalid target — no line of sight"` — cursor stays in targeting mode
- [ ] AoE spells show the affected area as highlighted tiles around the cursor while in targeting mode (e.g., a 3x3 highlight for a 3x3 AoE)
- [ ] AoE highlighting respects walls — tiles behind walls within the AoE are not highlighted
- [ ] Targeting mode does not consume turns — only the final confirmed cast consumes a turn

---

### US-MS-26: Spell Execution

**As a** player, **I want** spells to execute with clear feedback when I cast them, **so that** I understand what happened and can follow the flow of magical combat.

**Acceptance Criteria:**
- [ ] On successful cast: mana is deducted by the spell's `manaCost`, the spell's cooldown timer is set in `spellCooldowns`, and the spell effect is executed
- [ ] Casting a spell counts as the player's action for the turn — after the spell resolves, enemies take their turn (standard turn order)
- [ ] The message log displays a cast message: `"You cast [SpellName]!"` followed by the effect result
- [ ] Damage spells show: `"You cast Firebolt! The Goblin takes 6 fire damage!"` — includes spell name, target name, damage amount, and element
- [ ] If a spell kills the target, the kill message uses a school-appropriate verb:
  - Elements (fire): `"The Goblin is incinerated!"`
  - Elements (ice): `"The Goblin is frozen solid and shatters!"`
  - Elements (lightning): `"The Goblin is struck down!"`
  - Shadow: `"The Goblin is consumed by darkness!"`
  - Conjuration: `"The Goblin is torn apart!"`
  - Enchantment: `"The Goblin's mind is shattered!"`
  - Restoration (damage via smite): `"The Goblin is purified!"`
  - Divination: `"The Goblin is unraveled!"`
  - Alchemy (acid/poison): `"The Goblin dissolves!"`
- [ ] Visual feedback: affected tiles flash in the spell's color for one render cycle (e.g., red flash for fire, cyan for ice, yellow for lightning)
- [ ] The flash is cosmetic only — it does not delay gameplay or block input
- [ ] Healing/buff spells show: `"You cast Ward! You gain a shield absorbing 10 damage."` or `"You cast Heal! You restore 8 HP."`
- [ ] Cast failure — if the target entity has moved or died between target selection and execution (edge case with simultaneous events): refund the full mana cost, do NOT start cooldown, display `"Target lost! Spell fizzles."` — the turn is still consumed (player acted, but the spell failed)
- [ ] Spell messages use the `'spell'` message type for consistent color coding in the combat log
- [ ] XP is awarded normally for spell kills (same as melee kills)

---

### US-MS-27: Spell Damage Calculation

**As a** player, **I want** spell damage to scale with my stats and interact with enemy defenses, **so that** building magical power feels rewarding and enemy resistances create tactical choices.

**Acceptance Criteria:**
- [ ] Base spell damage formula: `damage = baseDamage + floor(spellPower / 4)` where `baseDamage` comes from the SpellDef and `spellPower` is the caster's derived stat (INT + floor(WIL / 3))
- [ ] Magic resistance reduction: `finalDamage = damage * (1 - targetMagicResist / 100)` where `targetMagicResist` is capped at 50 (50% maximum reduction)
- [ ] Elemental weakness: if the target has a weakness to the spell's element (defined on MonsterDef), damage is multiplied by 1.5 (applied before magic resistance)
- [ ] Elemental resistance: if the target has a resistance to the spell's element (defined on MonsterDef), damage is multiplied by 0.5 (applied before magic resistance)
- [ ] Elemental weakness and resistance are mutually exclusive per element — a target cannot be both weak and resistant to the same element
- [ ] Critical spell hit: chance = `AGI * 0.2`% (caster's AGI); on crit, final damage is multiplied by 1.5
- [ ] Critical hits display a distinct message: `"Critical cast! You cast Firebolt! The Goblin takes 9 fire damage!"`
- [ ] Minimum damage after all reductions is 1 (no spell deals 0 damage unless blocked by a specific mechanic)
- [ ] Overkill damage is wasted — excess damage beyond the target's remaining HP has no additional effect
- [ ] Damage calculation order: baseDamage + spellPower bonus → elemental multiplier → magic resistance reduction → critical multiplier → floor → clamp to minimum 1
- [ ] All damage values are floored to integers at the final step (no fractional HP)
- [ ] Healing spells use a parallel formula: `healing = baseHeal + floor(spellPower / 3)` — not reduced by magic resistance

---

### US-MS-28: Spell Cooldowns

**As a** player, **I want** each spell to have its own cooldown timer, **so that** I must rotate between spells rather than spamming a single powerful spell every turn.

**Acceptance Criteria:**
- [ ] `spellCooldowns` is a `Record<string, number>` on GameState, keyed by spell ID
- [ ] After casting a spell, its entry in `spellCooldowns` is set to the spell's `cooldown` value from SpellDef (e.g., Firebolt cooldown = 2 means 2 turns until available)
- [ ] Each player turn, all entries in `spellCooldowns` with a value > 0 are decremented by 1
- [ ] When a cooldown reaches 0, it is removed from the record (or left at 0) — the spell is available to cast again
- [ ] Spell cooldowns are tracked separately from the existing `abilityCooldown` field (Q key class ability) — they do not share timers
- [ ] In the spell menu, cooldown status is displayed per spell:
  - Available: `"Firebolt (ready)"` in normal color
  - On cooldown: `"Firebolt (3 turns)"` in grey
- [ ] In quick-cast slots, cooldown is shown: `[1:Firebolt (2t)]`
- [ ] A spell on cooldown cannot be cast — attempting to do so displays `"Firebolt is on cooldown (3 turns remaining)"` and does NOT consume a turn
- [ ] Cooldown timers are persisted in save files and restored on load
- [ ] Cooldowns tick even when out of combat (the timer is per player turn, not per combat encounter)
- [ ] Cooldown of 0 on a SpellDef means the spell has no cooldown and can be cast every turn (as long as mana allows)

---

### US-MS-29: Area of Effect (AoE) Spells

**As a** player, **I want** some spells to affect an area rather than a single target, **so that** I can deal with groups of enemies and make tactical use of positioning.

**Acceptance Criteria:**
- [ ] AoE spells have an `aoeShape` property on SpellDef: `'square3'` (3x3), `'square5'` (5x5), `'line'` (1-wide line from caster to max range), or `'cross'` (+ shape of radius N)
- [ ] During targeting (US-MS-25), AoE spells highlight all tiles in the affected area around the cursor position
- [ ] The player places the center of the AoE (for square/cross shapes) or the endpoint (for line shapes) using the targeting cursor
- [ ] All enemy entities within the AoE area take the spell's effect (damage, status effect, or both)
- [ ] AoE spells do NOT hit the player (no friendly fire in the base system) — the player's tile is excluded from damage even if within the AoE
- [ ] Walls block AoE: tiles behind walls relative to the AoE center do not receive the effect. Use the existing FOV/LOS system to determine wall blocking from the AoE center.
- [ ] AoE damage is uniform — all affected targets take the same damage (no falloff from center)
- [ ] Each affected target applies damage calculation independently (US-MS-27): elemental weakness/resistance and magic resistance are checked per target
- [ ] The message log lists all affected targets: `"You cast Fireball! The Goblin takes 8 fire damage! The Rat takes 8 fire damage! The Skeleton takes 4 fire damage!"`
- [ ] If the AoE kills multiple enemies, each kill is reported with the appropriate kill verb
- [ ] XP is awarded for each enemy killed by the AoE (full XP per kill, no splitting)
- [ ] AoE visual: all affected tiles flash the spell's color simultaneously for one render cycle
- [ ] Line-shaped AoE: affects all tiles in a straight line from the caster to the targeted endpoint, stopping at walls

---

### US-MS-30: Status Effect Spells

**As a** player, **I want** spells that inflict status effects on enemies, **so that** magic offers control and debuff options beyond raw damage.

**Acceptance Criteria:**
- [ ] Spells can apply one or more status effects as defined in their SpellDef (via an `appliesEffect` field containing effect type and base duration)
- [ ] Status effect duration from spells: `effectiveDuration = baseDuration + floor(INT / 10)` bonus turns from the caster's Intellect
- [ ] Status effects applied by spells integrate with the existing StatusEffect system in `status-effects.ts` — they tick, expire, and display identically to non-spell status effects
- [ ] New status effects added to the system:
  - **Burn:** 2 fire damage per turn, lasts N turns. Visual: red `~` overlay on affected entity
  - **Freeze:** target skips their next turn entirely (1 action lost), then thaws. While frozen, target takes 1.5x physical damage. Visual: cyan color on entity character
  - **Slow:** target acts every other turn (alternates between acting and skipping). Visual: entity character rendered in dim/dark color on skipped turns
  - **Shield:** absorbs X incoming damage (where X is defined by the spell), then breaks. Not duration-based — lasts until damage absorbed equals shield amount. Visual: `+` symbol rendered adjacent to entity
- [ ] Existing status effects (poison, stun, regeneration) can also be applied by spells using the same system
- [ ] Stacking rule: if the same status effect is applied to an entity that already has it (from any source), the duration is refreshed to the new duration (whichever is longer). Damage/magnitude does NOT stack — the effect runs at its defined rate, not doubled.
- [ ] Different status effects from different sources stack normally (e.g., an entity can be both burned and poisoned simultaneously)
- [ ] Status effect spells that also deal direct damage apply both: damage resolves first, then the status effect is applied (if the target survives)
- [ ] If the target dies from the direct damage, the status effect is not applied (no wasted effect on a corpse)
- [ ] Message log for status effects: `"You cast Frost Lance! The Goblin takes 5 ice damage and is frozen!"`
- [ ] Enemies can also apply these status effects to the player via their spells (US-MS-32)
- [ ] **Hard cap on crowd control:** Stun, freeze, and fear effects have a maximum duration of 5 turns after all scaling (INT bonus, mastery passives, specialization). No entity can be stunned, frozen, or feared for more than 5 consecutive turns.

---

### US-MS-31: Counter-Spell System

**As a** player, **I want** the ability to counter enemy spells during a charge-up window, **so that** magical combat has an interactive back-and-forth rather than just trading damage.

**Acceptance Criteria:**
- [ ] When an enemy spellcaster begins casting a powerful spell (tier 3+), a 1-turn charge warning is displayed in the message log: `"[Enemy Name] channels [Spell Name]!"` (e.g., `"Frost Imp channels Frost Lance!"`)
- [ ] The charging state is stored on the enemy entity (e.g., `channeling: { spellId: string, turnsLeft: number }`)
- [ ] During the 1-turn charge window (the player's next turn), the player can attempt a counter-spell by casting any spell at the channeling enemy
- [ ] Counter-spell success chance depends on the relationship between the player's spell and the enemy's spell:
  - **Opposing element** (fire vs ice, ice vs fire): 100% counter success
  - **Opposing school** (Restoration vs Shadow): 90% counter success
  - **Same-school Dispel spell:** 80% counter success
  - **Same-school other spell:** 60% counter success
  - **Any other spell cast at the channeling enemy:** 40% counter success
- [ ] On counter success: the enemy's channeled spell is canceled (fizzles), the player's counter-spell consumes mana and starts cooldown normally, and the message log displays: `"Your [Spell] counters the [Enemy Spell]! The spell fizzles!"`
- [ ] On counter failure: both spells resolve — the player's spell hits the enemy normally, and the enemy's channeled spell completes and hits the player on the enemy's turn. Message: `"Your [Spell] fails to counter the [Enemy Spell]!"`
- [ ] Counter-casting consumes the player's turn (it is the player's action for that turn)
- [ ] The player can choose NOT to counter — they can take any other action (melee, move, use item, cast a spell at a different target). The enemy's spell will then complete on the enemy's next turn.
- [ ] Counter-casting does NOT trigger counter-spells from enemies (no infinite counter loops)
- [ ] Counter-spells only work against spell channeling — physical attacks, instant spells, and non-spell abilities cannot be countered
- [ ] If the channeling enemy is killed during the charge window (by any means), the channeled spell is canceled automatically
- [ ] Visual indicator: channeling enemies display a pulsing or distinct color to indicate they are mid-cast

---

### US-MS-32: Enemy Spellcasters

**As a** player, **I want** to face enemies that cast spells, **so that** magical combat is a two-sided experience with enemies that challenge my defenses and reward counter-play.

**Acceptance Criteria:**
- [ ] Enemy spellcasters are defined by adding a `spells: SpellRef[]` array to their MonsterDef, where each SpellRef contains: `{ spellId: string, weight: number }` (weight influences cast frequency)
- [ ] Enemy spell AI logic: on the enemy's turn, if at least one spell is off cooldown AND the target (player) is within that spell's range, the enemy has a 40% chance to cast a spell instead of moving/meleeing
- [ ] When the enemy decides to cast, it selects from available (off cooldown, in range) spells weighted by the `weight` field
- [ ] Enemy spells do NOT cost mana — enemies do not track a mana resource. Cooldowns still apply.
- [ ] Enemy spell damage formula: `damage = baseDamage * (1 + dungeonLevel / 10)` — enemy spell damage scales with dungeon level, not with enemy attributes
- [ ] Charge mechanic: spells of tier 3 or higher require a 1-turn charge before firing (this creates the counter-spell window from US-MS-31). The enemy announces the spell, then it resolves on their next turn.
- [ ] Quick spells (tier 1-2): cast instantly on the enemy's turn with no charge warning and no counter-spell opportunity
- [ ] During charging, the enemy does not move or take other actions — they are committed to the spell
- [ ] If the charging enemy is stunned, frozen, or killed during the charge window, the spell is canceled
- [ ] New spellcaster enemies added to the monster catalog:

| Monster        | Tier | ASCII | Color   | School    | Spells                                       | Behavior       |
|---------------|------|-------|---------|-----------|----------------------------------------------|----------------|
| Frost Imp      | 2    | `i`   | Cyan    | Elements  | Frost Lance (T1), Glacial Wall (T2)          | Ranged kiter   |
| Fire Mage      | 2    | `m`   | Red     | Elements  | Firebolt (T1), Fireball (T3)                 | Ranged kiter   |
| Shadow Priest  | 3    | `p`   | Magenta | Shadow    | Shadow Bolt (T1), Life Drain (T2), Curse of Weakness (T4) | Ranged cautious |
| Necromancer    | 3    | `n`   | Grey    | Necromancy| Life Tap (T1), Wither (T2), Raise Dead (T3)  | Stationary summoner |
| Void Cultist   | 3    | `c`   | Purple  | Void      | Void Bolt (T1), Entropy (T3), Annihilation (T4) | Erratic caster |

- [ ] Ranged kiter behavior: enemy tries to maintain distance (2-3 tiles from player), casts when in range, retreats if player closes in
- [ ] Stationary summoner behavior: enemy stays in place and prioritizes casting; only moves if player is adjacent and enemy HP is low
- [ ] Erratic caster behavior: moves randomly between casts, unpredictable positioning
- [ ] Enemy spellcaster monsters appear starting at dungeon levels appropriate to their tier (Tier 2: level 3+, Tier 3: level 6+)
- [ ] Enemy spell effects use the same visual system as player spells (colored tile flashes)

---

### US-MS-33: Spell Interaction with Environment

**As a** player, **I want** my spells to interact with the dungeon environment, **so that** magic feels like a versatile tool for exploration and tactics, not just a damage button.

**Acceptance Criteria:**
- [ ] **Fire spells — terrain ignition:** Fire spells that hit a floor tile have a chance to create a fire hazard (burning tile) that deals 2 fire damage per turn to any entity entering or standing on it. Fire hazard lasts 3-5 turns, then burns out. Uses the existing hazard system from `hazards.ts`.
- [ ] **Fire spells — ice interaction:** Fire spells destroy ice walls and ice floor tiles, converting them back to normal floor
- [ ] **Fire spells — illumination:** Fire spells temporarily increase the player's sight radius by +2 tiles for 3 turns (light from the flames) when cast in a dark room (room with no existing light source)
- [ ] **Ice spells — water freezing:** Ice spells cast on water tiles convert them to frozen floor (walkable) for 10 turns, then they revert to water
- [ ] **Ice spells — ice bridge:** Casting an ice spell on a gap/chasm tile creates an ice bridge (walkable) for 5 turns — enables crossing otherwise impassable terrain
- [ ] **Ice spells — extinguish fires:** Ice spells cast on fire hazard tiles extinguish them immediately
- [ ] **Lightning spells — water chaining:** Lightning spells that hit a water tile chain to all connected water tiles within the spell's range, dealing 50% damage to any entity standing on those connected water tiles
- [ ] **Lightning spells — wet bonus:** Lightning spells deal 1.5x damage to targets standing on water tiles or targets with the "wet" status effect
- [ ] **Divination spells — reveal hidden rooms:** Casting a divination spell reveals secret room walls within the spell's range (functions like detecting secret doors from `secret-rooms` exploration)
- [ ] **Divination spells — detect traps:** Casting a divination spell reveals all traps within range, marking them as visible on the map (uses the existing trap visibility system from `traps.ts`)
- [ ] **Divination spells — extended sight:** Casting a divination spell temporarily reveals all tiles within a large radius (e.g., 15 tiles) through fog of war for 5 turns, ignoring walls for visibility purposes
- [ ] **Conjuration spells — create terrain:** Specific conjuration spells can create terrain: Ice Wall spell places a wall tile at the target location (blocks movement and LOS, lasts 8 turns then crumbles). Phase Step spell teleports the player across a gap tile (1-tile teleport).
- [ ] **Conjuration spells — destroy terrain:** A Shatter spell can destroy weak/cracked wall tiles, opening new passages (only works on walls explicitly flagged as destructible in the map data)
- [ ] **Shadow spells — extinguish light:** Shadow spells reduce the player's sight radius by 2 tiles for 5 turns when cast (creates a tactical darkness zone). Enemies in the darkened area have reduced detection range.
- [ ] **Shadow spells — darkness zone:** Shadow AoE creates a 3x3 area of darkness that persists for 5 turns. Entities inside cannot be targeted by non-AoE spells from outside. Entities outside cannot be targeted by entities inside. Movement through the zone is unaffected.
- [ ] Environmental interactions are logged in the message log: `"The fire ignites the ground!"`, `"The water freezes into a bridge!"`, `"The shadows swallow the light!"`
- [ ] Environmental effects persist across turns (with defined durations) and are included in save/load serialization
- [ ] Environmental effects are rendered on the ASCII map: fire hazards as red `^`, frozen tiles as cyan `.`, ice walls as white `#`, darkness zones as dark ` ` (space character)

---

### US-MS-33b: Innate Abilities (Q-Key Class Abilities)

**As a** player, **I want** my class-specific Q-key abilities to coexist with the spell system, **so that** my class identity remains distinct even as I learn new spells.

**Acceptance Criteria:**
- [ ] Existing class abilities (Whirlwind, Teleport, Smoke Bomb, Holy Strike, Trap Sense, Inspire, etc.) become **innate abilities** — a category separate from spells
- [ ] Innate abilities are activated by pressing Q (unchanged from current system)
- [ ] Innate abilities do NOT cost mana — they use their existing cooldown-only system
- [ ] Innate abilities also appear in the spell menu (M key) under a separate "Innate" section header, for discoverability
- [ ] Innate abilities are NOT affected by: spellPower scaling, armor casting penalty, magic resistance, school mastery, counter-spells, or Ley Line modifiers
- [ ] Innate abilities ARE affected by: their own cooldown timer (existing system), status effects that prevent actions (stun, freeze)
- [ ] The quick-cast slots (1-4) are reserved for spells only — innate abilities stay on Q
- [ ] Innate abilities cannot be unlearned, replaced, or overwritten
- [ ] Classes that start with a spell instead of an ability (Mage, Necromancer, Cleric) do not have a Q-key ability — their Q key does nothing until they learn one through gameplay or it remains unused
- [ ] Save/load preserves innate ability state (cooldown timers)

---

## Data Structures

```typescript
// Targeting mode state (types.ts or engine.ts)
interface TargetingState {
  active: boolean;
  spellId: string;
  cursorX: number;
  cursorY: number;
  range: number;
  aoeShape: 'none' | 'square3' | 'square5' | 'line' | 'cross';
  validTiles: Set<string>;   // "x,y" keys for tiles in range + LOS
  affectedTiles: Set<string>; // "x,y" keys for current AoE highlight
}

// Quick-cast slots (types.ts — on GameState)
quickCastSlots: [string | null, string | null, string | null, string | null];

// Channeling state (types.ts — on Entity)
channeling: {
  spellId: string;
  turnsLeft: number;
  targetX: number;
  targetY: number;
} | null;

// Enemy spellcaster reference (monsters.ts — on MonsterDef)
spells?: Array<{
  spellId: string;
  weight: number;  // relative frequency
}>;

// Armor casting penalty (engine.ts)
const ARMOR_CASTING_PENALTY: Record<string, number> = {
  heavy:  1.50,  // +50% mana cost
  medium: 1.25,  // +25% mana cost
  light:  1.00,  // no change
  robes:  0.90,  // -10% mana cost (bonus)
};
// Effective mana cost = ceil(spell.manaCost * ARMOR_CASTING_PENALTY[equippedArmorType])

// Environmental effect (hazards.ts extension)
interface EnvironmentalEffect {
  type: 'fire' | 'ice_floor' | 'ice_bridge' | 'ice_wall' | 'darkness_zone';
  x: number;
  y: number;
  turnsRemaining: number;
  sourceSpellId: string;
}
```

## Damage Calculation Reference

```
Spell Damage Pipeline:
  1. raw        = baseDamage + floor(spellPower / 4)
  2. elemental  = raw * elementalMultiplier      (1.5 if weak, 0.5 if resistant, 1.0 otherwise)
  3. resisted   = elemental * (1 - targetMagicResist/100)   (magicResist capped at 50)
  4. critical   = resisted * critMultiplier      (1.5 if crit, 1.0 otherwise; crit chance = AGI * 0.2%)
  5. final      = max(1, floor(critical))

Enemy Spell Damage:
  1. raw        = baseDamage * (1 + dungeonLevel / 10)
  2-5. same pipeline (elemental, resist, crit skipped for enemies, floor, clamp)

Healing:
  1. raw        = baseHeal + floor(spellPower / 3)
  2. final      = floor(raw)
  (no resistance, no crit)

Physical Defense:
  1. raw        = attacker.attack (STR + weaponBonus)
  2. reduced    = max(1, raw - target.physicalDefense)
  (armorValue + floor(VIT / 4))
```

## Counter-Spell Pairs

Counter-spell success depends on the relationship between the counter-spell and the channeled spell:

| Counter Method | Success Rate | Examples |
|---|---|---|
| **Opposing element** (fire-tagged vs ice-tagged, ice-tagged vs fire-tagged) | 100% | Frost Lance counters a fire spell; Firebolt counters an ice spell |
| **Opposing school** (Restoration vs Shadow, Shadow vs Restoration) | 90% | Heal cast at a Shadow Priest channeling Life Drain |
| **Dispel spell** (Enchantment school) | 80% | Dispel counters any school |
| **Same-school spell** | 60% | Firebolt vs enemy Fireball |
| **Any other spell** cast at the channeling enemy | 40% | Acid Splash vs enemy Frost Lance |

Element tags exist within schools: fire, ice, lightning (Elements); acid (Alchemy); shadow (Shadow); holy (Restoration). Spells without an element tag use the "any other spell" rate.

## Monster Elemental Properties

Monsters have optional elemental weakness and resistance tags on their MonsterDef:

| Monster Type | Weakness | Resistance | Rationale |
|---|---|---|---|
| Fire Imp, Fire Elemental | Ice | Fire | Fire creatures fear cold |
| Ice Elemental, Frost creatures | Fire | Ice | Ice melts to fire |
| Slime, Ooze | Lightning | Acid | Electrical shock disrupts ooze |
| Skeleton, Undead | Holy (Restoration) | Shadow | Undead are weak to holy |
| Golem, Construct | Lightning | Physical | Electrical disruption, armored body |
| Ghost, Wraith | Shadow | Physical | Shadow touches the spirit; physical passes through |
| Troll, Beast | Fire | — | Trolls fear fire (regen stopped) |
| Metal-armored enemies | Lightning | — | Metal conducts |

- Weakness: incoming damage of that element ×1.5
- Resistance: incoming damage of that element ×0.5
- Defined as optional fields on MonsterDef: `weakness?: string`, `resistance?: string`
- Monster definitions in `monsters.ts` are updated to include these tags

## Implementation Notes

- **Input handling:** The M key, 1-4 quick-cast keys, and targeting mode must be integrated into the existing `handleInput()` flow in `engine.ts`. Use a state machine: `normal → spellMenu → targeting → execution → normal`.
- **Targeting reuse:** The targeting cursor system should be generic enough to reuse for ranged physical attacks in the future.
- **AoE wall blocking:** Reuse `isInLineOfSight()` from `fov.ts` to determine which AoE tiles are blocked by walls. Check LOS from the AoE center, not from the player.
- **Enemy spell AI:** Keep enemy spellcasting logic in a dedicated function (e.g., `enemySpellAI(enemy, state)`) separate from existing melee/movement AI, called at the start of the enemy's turn decision.
- **Environmental effects:** Extend the existing `hazards` array on GameState to include spell-created environmental effects. Add a `turnsRemaining` field and decrement each turn.
- **Performance:** Targeting mode recalculates valid/affected tiles only when the cursor moves, not every frame.
- **Save compatibility:** Bump SAVE_VERSION. Old saves without `quickCastSlots`, `channeling`, or `EnvironmentalEffect` fields get sensible defaults (empty slots, null channeling, empty array).

## Dependencies

- `types.ts` — TargetingState, quickCastSlots, channeling on Entity, EnvironmentalEffect
- `engine.ts` — handleInput state machine, spell execution, cooldown ticking, enemy spell AI
- `monsters.ts` — new spellcaster MonsterDefs (Frost Imp, Fire Mage, Shadow Priest, Necromancer, Void Cultist)
- `status-effects.ts` — new effects (burn, freeze, slow, shield)
- `hazards.ts` — spell-created hazards and environmental effects
- `fov.ts` — LOS checks for targeting, AoE wall blocking, divination sight extension
- `traps.ts` — divination trap reveal integration
- `save.ts` — persist new fields, version migration
- `+page.svelte` — spell menu UI, targeting cursor rendering, quick-cast bar, channeling visual indicators
- `attributes-and-resources.md` (US-MS-01 to US-MS-08) — spellPower, magicResist, mana, INT, WIL, AGI
- `spell-catalog.md` (US-MS-17 to US-MS-22) — SpellDef definitions referenced by all stories here
