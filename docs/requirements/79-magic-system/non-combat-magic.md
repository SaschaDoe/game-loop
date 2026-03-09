# Non-Combat Magic

This document covers all non-combat, utility, and environmental magic — spells and rituals that affect exploration, NPC interaction, the environment, item identification, and magical transportation. These systems give magic a presence outside of combat encounters, making it feel like an integrated part of the world rather than a damage-only mechanic. Ritual magic provides powerful multi-turn effects at the cost of preparation and reagents. Environmental modifiers create location-based variation in magical effectiveness.

**Epic:** 79 — Magic System
**Stories:** US-MS-49 through US-MS-54
**Dependencies:** Spell catalog (US-MS-17 to US-MS-22), casting system (US-MS-23 to US-MS-33), mana pool (US-MS-03), fog of war (fov.ts), secret rooms (map.ts), traps (traps.ts), hazards (hazards.ts), dialogue system (dialogue.ts), NPC moods (US-NPC-ER series), alchemy reagents (US-MS-34 to US-MS-42)
**Depended on by:** 78-arcane-academy (Academy locations use Ley Line convergence), 11-exploration/fast-travel, 29-forbidden-magic (ritual hooks), 48-summoning-and-conjuration (Summoning Circle)

---

## User Stories

### US-MS-49: Exploration Magic

**As a** player, **I want** to use Divination, Conjuration, and Elemental spells to enhance exploration, **so that** magic-focused characters have meaningful advantages when navigating dungeons beyond just dealing damage.

**Acceptance Criteria:**

**Divination — Sight and Detection:**
- [ ] True Sight (Divination, Tier 1): when active, the player's sight radius increases by +3 tiles and hidden walls, secret doors, and invisible enemies within the expanded radius are revealed
- [ ] True Sight lasts 20 turns after casting; while active, secret walls render as a distinct character (e.g., `+` in a highlight color) instead of appearing as normal walls
- [ ] Reveal Secrets (Divination, Tier 1): on cast, all traps and secret walls within a 5-tile Manhattan distance of the player are immediately revealed, bypassing the passive detection roll entirely
- [ ] Revealed traps show their type (spike, poison_dart, alarm, teleport) in the combat log message
- [ ] Astral Projection (Divination, Tier 5): on cast, the entire current level's map is set to `explored` visibility state (as if the player had visited every tile), but the player cannot move, attack, or cast other spells for 3 turns
- [ ] During Astral Projection, the player's character renders with a flickering effect (alternating between `@` and `.` each turn) to indicate the trance state
- [ ] If the player takes damage during Astral Projection, the effect ends early but the explored tiles remain revealed
- [ ] Scryer's Mark (Divination, Tier 3): targets one visible enemy; for 20 turns, that enemy's position is tracked through walls, displayed as a directional indicator on the edge of the visible map area (e.g., arrow character pointing toward the marked enemy)
- [ ] Scryer's Mark can only be active on one enemy at a time; casting it again replaces the previous mark

**Conjuration — Movement:**
- [ ] Phase Step (Conjuration, Tier 1): teleports the player up to 5 tiles in a chosen direction, passing through walls that are 1 tile thick; blocked by walls 2+ tiles thick
- [ ] Phase Step can be used in combat (costs the turn) or out of combat
- [ ] Phase Step cannot teleport the player into unexplored (fog of war) tiles — the destination must be explored or visible
- [ ] Dimensional Door (Conjuration, Tier 4): presents a list of previously visited rooms on the current level; selecting one teleports the player to that room's center tile
- [ ] Dimensional Door can only be cast when no enemies are visible (out-of-combat only)
- [ ] Dimensional Door mana cost: 8. Rooms are identified by the room index from map generation.
- [ ] Summon Light (Conjuration, Tier 1): creates a light source at the player's position that increases the ambient light level in a 6-tile radius for 30 turns
- [ ] Summon Light is relevant on dark dungeon levels (levels where the base sight radius is reduced); it restores normal sight radius within its area of effect

**Elements — Environment Interaction:**
- [ ] Firebolt (Elements, Tier 1): when targeted at a tile containing a wooden door, the door is destroyed and the tile becomes passable; when targeted at a tile containing an oil puddle, the puddle ignites into a fire hazard lasting 10 turns
- [ ] Frost Lance (Elements, Tier 2): when targeted at a water tile, the tile freezes and becomes walkable for 20 turns (ice bridge); when targeted at a fire hazard tile, the fire is extinguished
- [ ] Lightning Arc (Elements, Tier 3): when targeted at an ancient mechanism tile (puzzle element), the mechanism activates; the specific effect depends on the dungeon (e.g., opens a sealed door, extends a bridge, disables a trap grid)
- [ ] All exploration spells cost mana and are cast through the standard spell menu (M key)
- [ ] Spells with out-of-combat-only restrictions show "(non-combat)" in the spell menu and are greyed out when enemies are visible
- [ ] A combat log message confirms each non-combat spell effect (e.g., `"True Sight reveals the dungeon's secrets for 20 turns."`, `"The ice freezes solid — a bridge forms across the water."`)

---

### US-MS-50: Social Magic

**As a** player, **I want** to use magic to influence NPC interactions, **so that** spellcasters have unique dialogue options and information-gathering strategies that non-magical characters lack.

**Acceptance Criteria:**

**Spell Effects on NPCs:**
- [ ] Binding Circle (Enchantment, Tier 3): when cast on an NPC before initiating dialogue, the NPC is forced to give truthful responses for 1 conversation; hidden dialogue branches marked `requiresTruth` become available
- [ ] Binding Circle shifts the NPC's mood by -1 (e.g., friendly to neutral, neutral to wary); some NPCs react with anger and refuse to speak further
- [ ] Fear (Shadow, Tier 2): when cast on an NPC, their mood shifts to `afraid` for 1 conversation; afraid NPCs reveal secrets they would normally withhold (dialogue branches marked `revealsWhenAfraid` become available)
- [ ] If Fear is cast on a hostile NPC, there is a 50% chance they attack instead of becoming afraid; the combat log warns: `"The hostile creature lashes out in defiance!"`
- [ ] Enemy Analysis (Divination, Tier 2): when cast on an NPC (not during dialogue), reveals a tooltip showing: current mood, hidden relationship value (numeric), and whether their last dialogue response contained a lie
- [ ] Enemy Analysis does not alert the NPC — it is a passive observation with no mood or reputation consequence
- [ ] Heal (Restoration, Tier 1): when cast on an injured NPC (HP < maxHP), restores HP and grants +1 mood shift; if the NPC's mood reaches `grateful`, a special dialogue branch (`triggeredByHeal`) becomes available with unique rewards or information
- [ ] Phantom Image (Conjuration, Tier 3): creates a 10-turn illusion at a target tile; NPCs within line of sight turn to face and walk toward the illusion, allowing the player to sneak past or interact with unguarded objects

**Alchemy Social Item:**
- [ ] Truth Serum (alchemy consumable, not a spell): usable during an active dialogue via an inventory option; for the remainder of that conversation, the NPC cannot lie and all hidden dialogue branches marked `requiresTruth` become available
- [ ] Truth Serum is consumed on use (removed from inventory)

**Consequences and Restrictions:**
- [ ] Social magic use is detected: if a guard NPC witnesses the cast (is within line of sight), reputation with that faction decreases by 1
- [ ] Some NPCs are immune to mind-affecting magic (Binding Circle, Fear, Phantom Image) — marked with a `wardProtected: true` flag; casting on them fails with the message: `"A protective ward deflects your spell."`
- [ ] Using mind-affecting magic (Binding Circle or Fear) on any NPC shifts the player's alignment 1 point toward dark
- [ ] At the Arcane Academy, using any social magic on students or faculty triggers a house point penalty (-5 points) and a disciplinary dialogue event; repeated offenses (3+) result in temporary expulsion (locked out of Academy for 200 turns)

---

### US-MS-51: Ritual Magic

**As a** player, **I want** to perform powerful multi-turn rituals that require preparation and reagents, **so that** magic has a strategic layer beyond instant-cast spells and I feel rewarded for gathering rare materials.

**Acceptance Criteria:**

**Ritual System:**
- [ ] Rituals are a distinct spell category — they appear in the spell menu under a "Rituals" section, separate from instant-cast spells
- [ ] Each ritual requires: a minimum school mastery level of Adept, specific reagent components in the player's inventory, and uninterrupted casting time (multiple consecutive turns)
- [ ] When a ritual is initiated, the player enters a "channeling" state: they cannot move, attack, cast other spells, or use items until the ritual completes or is interrupted
- [ ] During channeling, the player's tile renders with a pulsing effect (alternating between `@` and `*`) and the HUD shows a progress bar: `"Ritual: [====------] 4/10 turns"`
- [ ] If the player takes damage while channeling, there is a 75% chance the ritual is interrupted; on interruption, the ritual fails, all reagents are consumed, mana is spent, and a message displays: `"Your concentration shatters — the ritual fails!"`
- [ ] The 25% chance to resist interruption displays: `"You hold your focus despite the blow!"`

**Six Base Rituals:**
- [ ] Ward of Protection: 3 turns casting, requires arcane_dust x3, costs 12 mana. Creates a 5x5 warded zone centered on the player's tile. Enemies entering the zone take 5 damage and receive a 1-turn slow debuff. The ward lasts 50 turns, then fades. Visual: warded tiles render with a faint border character.
- [ ] Summoning Circle: 5 turns casting, requires arcane_dust x2 + moonwater_vial x1, costs 20 mana. Summons a permanent allied creature adjacent to the player. The creature type matches the player's highest-mastery school (e.g., fire elemental for Elements, shadow wisp for Shadow). Maximum 1 active summon; casting again replaces the previous summon.
- [ ] Scrying Ritual: 3 turns casting, requires moonwater_vial x1 + dreamleaf x1, costs 10 mana. Reveals the complete layout of the next dungeon level (stores the pre-generated map data and displays it as a minimap overlay). The preview remains accessible until the player descends.
- [ ] Purification Ritual: 4 turns casting, requires starfern x2 + moonwater_vial x1, costs 15 mana. Cleanses a 7x7 area centered on the player of all hazards: lava tiles become stone floor, poison_gas tiles become empty floor, corruption tiles are purified. Permanent effect.
- [ ] Teleportation Circle: 5 turns casting, requires arcane_dust x3 + lightning_shard x1, costs 18 mana. Creates a permanent anchor point at the player's current tile (rendered as a glowing `O` character). The player can teleport back to this tile from anywhere on the same dungeon level by selecting "Return to Circle" from the ritual menu (instant, costs 5 mana). One active circle per level.
- [ ] Sealing Ritual: 4 turns casting, requires void_salt x1 + arcane_dust x2, costs 14 mana. Permanently seals a door or corridor tile adjacent to the player, converting it to an impassable wall. Useful for blocking enemy patrol paths or sealing off dangerous areas.

**Learning and Access:**
- [ ] Ritual knowledge is acquired from: ancient books found in dungeons, NPC quest rewards, or specific lore discoveries — NOT from Academy lessons (too advanced for students)
- [ ] Each ritual has a `learned` boolean tracked in `GameState.learnedRituals: string[]`
- [ ] Rituals that have not been learned do not appear in the ritual menu
- [ ] Attempting to cast a ritual without the required reagents displays: `"Missing reagents: [list of missing items]"`
- [ ] Attempting to cast a ritual without Adept mastery in the relevant school displays: `"Requires Adept mastery in [school name]."`

---

### US-MS-52: Magical Detection and Identification

**As a** player, **I want** spells that identify items and detect magical phenomena, **so that** Divination specialists have a practical advantage in understanding the dungeon's contents and I am rewarded for investing in the Divination school.

**Acceptance Criteria:**

**Identify Spell:**
- [ ] Identify (Divination, Tier 2, utility-only — not in the combat spell catalog): castable on an unidentified item in the player's inventory
- [ ] Without Identify, magic items display generic names: `"Glowing Sword"`, `"Shimmering Ring"`, `"Bubbling Potion"` — their stats and enchantments are hidden
- [ ] Casting Identify on an item reveals its full name, stats, and enchantment details: e.g., `"Sword of Fire (+2 ATK, fire damage enchantment)"`
- [ ] Identify costs 3 mana with no cooldown — it can be cast repeatedly to identify multiple items
- [ ] Identification is permanent: once an item is identified, it stays identified (stored as `identified: true` on the item)
- [ ] Alternative identification method: bring an unidentified item to an NPC sage and pay gold (cost = item tier x 10 gold) to identify it without using mana
- [ ] The spell menu shows Identify only when the player has at least one unidentified item; selecting it presents a list of unidentified items to choose from

**Detect Magic (Passive Divination Effect):**
- [ ] While True Sight (US-MS-49) is active, magical items on the ground render in a brighter color (e.g., bright cyan instead of default item color) to indicate they are enchanted
- [ ] While True Sight is active, enemies that can cast spells render with a shimmer effect (alternating between their normal color and a highlight color each turn)
- [ ] While True Sight is active, Ley Line convergence points are visible as pulsing tiles (alternating between `.` and `*` in a blue/purple color)
- [ ] Detect Magic is not a separate castable spell — it is a passive bonus of True Sight, giving Divination specialists added value from a single spell

**Detect Poison:**
- [ ] Detect Poison (Alchemy, Tier 1, utility): castable on a food item or potion in the player's inventory to check if it is poisoned
- [ ] If the item is poisoned, the combat log displays: `"You sense a toxic presence — this [item name] is poisoned!"` and the item's name gains a `(poisoned)` suffix in the inventory
- [ ] If the item is safe, the combat log displays: `"This [item name] is safe to consume."`
- [ ] Detect Poison also has an area effect: on cast, all poison_dart traps within a 3-tile Manhattan distance are revealed (same as trap detection but specifically for poison traps)
- [ ] Detect Poison costs 2 mana with no cooldown

---

### US-MS-53: Magical Transportation

**As a** player, **I want** multiple magical fast-travel options with distinct trade-offs, **so that** I can navigate large dungeon levels efficiently while my travel method reflects my magical specialization and available resources.

**Acceptance Criteria:**

**Transportation Methods:**
- [ ] Phase Step (Conjuration, Tier 1): teleport up to 5 tiles in a chosen direction; can pass through walls up to 1 tile thick; usable in and out of combat; costs 4 mana; cannot teleport into occupied or unexplored tiles; message: `"You step through folded space..."`
- [ ] Dimensional Door (Conjuration, Tier 4): teleport to any previously explored tile on the current dungeon level; out-of-combat only; costs 8 mana; the player selects a destination from a list of visited rooms or by cursor targeting on explored tiles; message: `"You step through folded space and emerge in a familiar place."`
- [ ] Teleportation Circle (ritual, see US-MS-51): creates a permanent anchor on the current level; returning to the circle costs 5 mana and is instant (no casting time for the return trip); same-level only; message: `"The circle flares — you are pulled back to your anchor point."`
- [ ] Town Portal scroll (crafted consumable): instantly teleports the player to the last visited town or safe zone; one-use item consumed on activation; the player's dungeon progress (level, map state, enemy positions) is preserved for return; cooldown: once per in-game day (100 turns); message: `"A shimmering portal opens — the familiar sounds of town welcome you back."`
- [ ] Ley Line Travel (placeholder for epic 27): fast travel between Ley Line nexus points on the overworld; NOT implemented in this epic — included here only as a documented hook for future integration; message template: `"The Ley Lines pull you forward..."`

**Limitations and Rules:**
- [ ] Phase Step validates the destination tile: must be passable floor, must be explored or visible, must not contain another entity; if invalid, the spell fizzles with message: `"The space ahead is blocked — you cannot phase through."` and mana is NOT consumed
- [ ] Dimensional Door requires at least one previously visited room on the current level besides the player's current room; if no valid destinations exist, the spell cannot be cast: `"You have nowhere to project the door."`
- [ ] Teleportation Circle return is available only if an active circle exists on the current level; the option does not appear in the menu otherwise
- [ ] Town Portal cannot be used in combat (greyed out when enemies are visible); using it while in a dungeon saves the player's return coordinates so they can re-enter the dungeon at the same position later
- [ ] All transportation spells require sufficient mana; insufficient mana follows the standard behavior from US-MS-05

---

### US-MS-54: Magic and the Environment

**As a** player, **I want** the world's environment to passively affect my magic, **so that** magic feels like an organic part of the world and I consider location and timing when planning my approach.

**Acceptance Criteria:**

**Weather Effects:**
*Weather and time-of-day modifiers apply only in outdoor areas and overworld encounters. Inside dungeons and buildings, only the Ley Line magic level modifier applies. This keeps indoor combat (the majority of gameplay) to a manageable modifier stack: base → spellPower → elemental → magicResist → crit → Ley Line.*
- [ ] Fire spells (Elements school, fire-tagged): -15% damage in rain weather; the combat log notes: `"The rain dampens your flames."`
- [ ] Lightning spells (Elements school, lightning-tagged): +15% damage in rain weather; the combat log notes: `"The storm amplifies your lightning!"`
- [ ] Ice spells (Elements school, ice-tagged): +15% damage in cold biomes (tundra, mountain peaks); the combat log notes: `"The bitter cold empowers your ice magic."`
- [ ] Weather modifiers apply to both damage and healing values (e.g., a fire heal spell is also reduced in rain)

**Time of Day Effects:**
*Outdoor areas only. See note above.*
- [ ] Divination and Shadow school spells: +15% effect (damage, duration, or range as appropriate) during night (turns 50-99 of each 100-turn day cycle)
- [ ] Elements school spells: +15% effect during daytime (turns 0-49 of each 100-turn day cycle)
- [ ] Time-of-day bonuses stack with weather bonuses (multiplicatively: 1.15 x 1.15 = 1.3225 maximum combined bonus)
- [ ] The combat log notes time-of-day bonuses when they apply: `"The night strengthens your divination."` or `"Daylight fuels your elemental magic."`

**Ley Line Proximity:**
- [ ] The game tracks a `magicLevel` for each tile or region, with 5 levels: dead (0), low (1), normal (2), high (3), convergence (4)
- [ ] All spell effects receive a modifier based on magic level: dead = spells cannot be cast at all, low = -10% effect, normal = no modifier, high = +10% effect, convergence = +25% effect
- [ ] The Arcane Academy is a convergence zone (magicLevel 4); Ley Line paths between nexuses are high (3); most dungeons are normal (2); anti-magic areas are dead (0)
- [ ] Attempting to cast in a dead zone displays: `"The magic here is dead — your spell fizzles into nothing."` and the turn is not consumed and mana is not spent
- [ ] The HUD displays the current magic level when it differs from normal: `"Ley Line: Strong"` (high), `"Ley Line: Convergence"` (convergence), `"Dead Zone"` (dead), `"Weak Magic"` (low); normal magic level shows nothing (to reduce HUD noise)

**Corruption Zones:**
- [ ] In corrupted areas (marked tiles or regions tied to lore doc 05), each spell cast has a 5% chance of applying a minor corruption debuff to the caster
- [ ] Corruption debuffs are school-specific: Elements = burn (2 damage/turn for 3 turns), Shadow = paranoia (sight radius -2 for 10 turns), Divination = false vision (random tiles appear as enemies for 5 turns), Enchantment = charm rebound (random mood shift on self), Restoration = mana drain (lose 3 mana/turn for 3 turns), Conjuration = unstable summon (summoned creature attacks randomly), Alchemy = toxic fumes (poison for 3 turns)
- [ ] When a corruption debuff triggers, the combat log warns: `"The corrupted magic lashes back — [debuff description]!"`

**Ambient Magic Effects:**
- [ ] In high-magic areas (magicLevel 3+): passive wound healing is slightly faster (+1 HP regen per 10 turns), poison durations are reduced by 1 turn, and light radius is increased by +1 tile
- [ ] In low-magic areas (magicLevel 1): poison durations are extended by 1 turn and light radius is reduced by -1 tile
- [ ] Ambient effects are passive — they apply automatically with no player action required

**Implementation:**
- [ ] `magicLevel` is stored per-tile or per-region in the map data and persisted in save files
- [ ] A `getMagicModifier(magicLevel: number): number` function returns the multiplier (0 for dead, 0.9, 1.0, 1.1, 1.25)
- [ ] All spell effect calculations call `getMagicModifier()` and `getWeatherModifier()` and `getTimeModifier()` and multiply them together before applying the final effect
- [ ] Environmental modifiers are displayed in the spell tooltip when hovering over a spell in the menu: `"Fireball (8 MP) — 12 base dmg, -15% rain, +10% Ley Line = ~11 effective"`
