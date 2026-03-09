# Magic System Integration

The Academy teaches real magic. This requires integrating the existing spell catalog (`spells.ts`), alchemy system (`alchemy.ts`), and new mana mechanics into the actual gameplay loop.

---

## Mana System

### US-AA-21: Mana Pool
**As a** player who has learned spells, **I have** a mana pool that fuels my spellcasting, **so that** magic has a resource cost.

**Acceptance Criteria:**
- `mana` and `maxMana` fields added to `GameState.player`
- Starting mana: 0 (until first spell is learned)
- Upon learning first spell: maxMana set based on class:
  - Mage: 20 mana
  - Rogue: 12 mana
  - Warrior: 10 mana
  - Other classes: 10-15 mana (varies)
- Academy enrollment adds +5 bonus mana (the Ley Line convergence helps)
- Mana displayed in HUD alongside HP: `HP: 25/25 | MP: 15/20`

### US-AA-22: Mana Regeneration
**As a** player, **my mana** regenerates over turns, **so that** I can cast spells repeatedly over time without permanent exhaustion.

**Acceptance Criteria:**
- Base regeneration: +1 mana per 5 turns
- Resting at Academy: +1 mana per 2 turns (Ley Line convergence bonus)
- Mana Potion: Restores 10 mana instantly
- Resting at camp/inn: Full mana restore
- Dead zones: No mana regen (future feature for overworld)

### US-AA-23: Mana Overload
**As a** player who tries to cast without sufficient mana, **I receive** a warning and cannot cast, **so that** I must manage my resources.

**Acceptance Criteria:**
- Attempting to cast with insufficient mana: "Not enough mana! (need X, have Y)"
- No partial casting or HP-for-mana substitution (except Blood Magic, future feature)
- UI greys out spell options when mana is insufficient

---

## Spell Casting

### US-AA-24: Learn Spells from Lessons
**As a** student, **I learn** specific spells during Academy lessons that are permanently added to my spellbook, **so that** education has real mechanical value.

**Acceptance Criteria:**
- `learnedSpells: string[]` added to GameState
- Lessons teach specific spells (see `curriculum-and-lessons.md`):
  - Lesson 1: Firebolt
  - Lesson 3: Arcane Ward
  - Lesson 4: Frost Lance
  - Lesson 6: True Sight
- Spells persist through save/load
- Learned spells available in spell menu

### US-AA-25: Spell Casting UI
**As a** player with learned spells, **I can** cast spells during combat using number keys or a spell menu, **so that** magic is a usable combat option.

**Acceptance Criteria:**
- Press `M` to open spell menu (or number keys 1-4 for quick cast)
- Spell menu shows: name, mana cost, cooldown status, brief effect description
- Selecting a spell that needs a target: enter targeting mode (arrow keys to aim, Enter to confirm)
- Self-targeting spells (Arcane Ward, True Sight) cast immediately
- Casting consumes mana and starts cooldown
- Casting counts as the player's turn (enemies then act)

### US-AA-26: Spell Effects in Combat
**As a** player, **my spells** deal real damage, apply real status effects, and interact with the combat system, **so that** magic is a viable combat strategy.

**Acceptance Criteria:**
- Damage spells (Firebolt, Frost Lance) deal their listed damage to targeted enemy
- Status spells (Frost Lance → freeze, Arcane Ward → shield) apply duration-based effects
- Utility spells (True Sight) modify game state (sight radius, reveal hidden)
- Spell damage benefits from elemental weakness system (fire vs ice creature = bonus damage)
- Kill messages: "You cast Firebolt! The Rat takes 4 fire damage and is slain!"

### US-AA-27: Spell Cooldowns
**As a** player, **my spells** have cooldowns that prevent spamming, **so that** I must choose spells tactically.

**Acceptance Criteria:**
- Each spell has a `cooldown` in turns (defined in `spells.ts`)
- After casting, the spell is unavailable for that many turns
- Cooldown shown in spell menu: "Firebolt (2 turns)"
- Cooldown ticks down each player turn
- Different from the existing `abilityCooldown` (class ability on Q key)

### US-AA-28: Counter-Spell Mechanic
**As a** player, **I can** counter enemy magical attacks by casting the opposing element, **so that** spell knowledge provides defensive options.

**Acceptance Criteria:**
- When an enemy "charges" a spell (visible message: "Frost Imp channels Frost Lance!"), the player has 1 turn to react
- Casting the counter-element (Firebolt vs Frost, Frost Lance vs Fire) negates the enemy spell
- Message: "Your Firebolt counters the Frost Lance! The spell fizzles!"
- Costs mana but no cooldown penalty for counter-casts
- Requires the player to have learned the counter-spell
- Only works against elemental spells (not physical attacks or constructs)

---

## Alchemy

### US-AA-29: Alchemy Station
**As a** player with known recipes, **I can** use the alchemy station in the Alchemy Tower to brew potions, **so that** alchemy is a real crafting system.

**Acceptance Criteria:**
- Interacting with the alchemy station (a specific tile in the Alchemy Tower) opens the brewing menu
- Menu shows: known recipes, required ingredients (with availability status), brew button
- Brewing consumes ingredients from inventory and produces the potion
- Failed brew attempt (missing ingredients): "You're missing [ingredient]. Check the practice dungeon or Thornwick's stores."
- Successful brew: potion added to inventory, XP bonus (+5 XP per brew)
- Alchemy station also available at certain dungeon locations (rare find)

### US-AA-30: Learn Recipes
**As a** student, **I learn** alchemy recipes from lessons and from books, **so that** my recipe knowledge grows over time.

**Acceptance Criteria:**
- `knownRecipes: string[]` added to GameState
- Recipes learned through:
  - Academy lessons (Lesson 2: Health Potion, Lesson 5: Antidote + Mana Potion)
  - Books found in the library or dungeons
  - NPC gifts (Thornwick teaches bonus recipes to helpful students)
- Recipes persist through save/load
- Unknown recipes show as "???" in the alchemy menu

### US-AA-31: Reagent Gathering
**As a** player, **I find** alchemical reagents in dungeons, on the overworld, and in shops, **so that** I have ingredients to brew with.

**Acceptance Criteria:**
- Reagent items spawn in dungeon chests and on the ground (low frequency)
- Academy Practice Dungeon has slightly higher reagent drop rate (training ground)
- Thornwick's greenhouse has 2-3 free reagents per visit (refreshes every 5 days)
- Reagents are inventory items (defined in `items.ts`, already exist)
- Reagent types: Starfern, Moonwater Vial, Arcane Dust, Fire Crystal, Frost Essence, Lightning Shard, Phoenix Ash, Void Salt, Mandrake Root, Dreamleaf, Shadowroot

### US-AA-32: Potion Effects
**As a** player, **potions I brew** have real effects when consumed, **so that** alchemy provides tangible combat advantages.

**Acceptance Criteria:**
- Health Potion: Restore 10 HP
- Mana Potion: Restore 10 MP
- Universal Antidote: Remove poison status
- Strength Elixir: +3 ATK for 10 turns
- Fire Resistance: Immune to burn for 20 turns
- Frost Ward: Immune to freeze for 20 turns
- Fortification: +2 DEF for 15 turns (reduces incoming damage)
- Potions are consumed on use (removed from inventory)
- Consuming a potion costs a turn
