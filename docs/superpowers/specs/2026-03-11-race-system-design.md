# Race System Design

## Overview

Add race selection (Elf, Dwarf, Human) to character creation. Race determines base attributes (replacing the archetype system), grants a permanent passive, unlocks one exclusive class, and drives NPC attitude flavor and racial questlines that feed the central lore mystery.

---

## 1. Race Definitions & Stats

Three races replace the archetype system. Race sets base attributes; classes retain their HP/ATK/sight bonuses and abilities unchanged.

### Race Attributes

| Attribute | Elf | Dwarf | Human |
|-----------|-----|-------|-------|
| STR       | 7   | 14    | 10    |
| INT       | 14  | 8     | 11    |
| WIL       | 12  | 11    | 11    |
| AGI       | 14  | 7     | 11    |
| VIT       | 7   | 14    | 11    |
| **Total** | **54** | **54** | **54** |
| Mana Mod  | 1.40 | 0.30 | 0.80 |

All races sum to 54 attribute points (matching the established archetype convention).

**Degenerate combinations**: Some race+class combos will be weak (e.g., Dwarf Mage has INT 8 yielding ~5 mana). This is intentional — picking against your race's strengths is a hard-mode challenge, not a locked door. A minimum mana floor of 5 ensures even the worst combo can cast at least one low-tier spell.

### Racial Passives

- **Elf — Ley Attunement**: +1 sight radius in forests, sense ley lines within 3 tiles without True Sight.
- **Dwarf — Stone Blood**: Poison resistance (50% duration reduction), +2 physical defense in underground/mountain terrain.
- **Human — Adaptable**: Social checks get +1 bonus with any NPC.

### Sight Radius

Currently, archetypes add sight bonuses (arcane +2, finesse +1, might +0). With archetypes removed, races absorb this:
- **Elf**: +2 global sight (replaces arcane's +2, reflecting keen elven eyes)
- **Dwarf**: +0 global sight (replaces might's +0, dwarves see in the dark but not far)
- **Human**: +1 global sight (replaces finesse's +1, balanced)

Class sight bonuses (e.g., mage +3, ranger +2) remain unchanged and stack on top.

### Stat Pipeline Change

- `CharacterConfig` gains a `race: CharacterRace` field.
- `ARCHETYPE_ATTRIBUTES` is replaced by `RACE_ATTRIBUTES` keyed by `CharacterRace`.
- `recalculateDerivedStats()` pulls base attributes from race instead of archetype.
- Classes no longer assign an archetype. They keep HP/ATK/sight bonuses, starting abilities, skill trees, and social bonuses.
- Race sight bonus is applied alongside class sight bonus in `createGame()`.

---

## 2. Class Availability & Exclusive Classes

All 9 existing classes (warrior, mage, rogue, ranger, cleric, paladin, necromancer, bard, adept) remain available to all 3 races. Each race adds 1 exclusive class.

### Primordial (Elf only)

Old Magic channeler drawing raw power from Ley Lines, bypassing the Ascended.

- **Bonuses**: HP -1, ATK +0, Sight +2
- **Starting ability**: `ley_surge` — burst of raw Ley energy damaging all adjacent enemies
- **Skill branches**:
  - Ley Channeling (raw damage):
    - T1 `ley_spark`: +2 spell power when standing on ley line tiles
    - T2 `ley_torrent`: ley_surge hits 2-tile radius instead of adjacent
    - T3 `ley_storm`: channel a 3-turn AOE that deals escalating ley damage
  - Verdant Communion (nature healing/buffs):
    - T1 `root_mend`: heal 15% HP when entering forest tiles
    - T2 `bark_ward`: +3 physical defense for 5 turns (self-buff)
    - T3 `ancient_growth`: summon entangling roots in 3x3 area, immobilizing enemies 2 turns
  - Veil Walking (phase/utility):
    - T1 `fade_step`: move through one wall/obstacle tile once per level
    - T2 `spirit_sight`: reveal all hidden enemies and traps in sight radius for 10 turns
    - T3 `between_worlds`: become untargetable for 2 turns (can move but not attack)
- **Social**: persuade +3, intimidate -2, deceive +1

### Runesmith (Dwarf only)

Inscribes runes into equipment and terrain for lasting magical effects.

- **Bonuses**: HP +3, ATK +1, Sight -1
- **Starting ability**: `rune_ward` — inscribe a protective rune on current tile (blocks enemy movement for 3 turns)
- **Skill branches**:
  - Runecraft (offensive runes):
    - T1 `rune_of_fire`: inscribe a fire rune on a tile — explodes when enemy steps on it (trap-like)
    - T2 `rune_of_shattering`: melee attacks have 20% chance to ignore physical defense
    - T3 `rune_of_annihilation`: inscribe a rune that detonates after 2 turns, dealing massive AOE damage
  - Stonebinding (defensive runes):
    - T1 `rune_of_mending`: inscribe a healing rune — standing on it restores 3 HP/turn
    - T2 `rune_of_anchoring`: +4 physical defense, immune to push/knockback effects
    - T3 `rune_of_the_mountain`: create a 3x3 zone where all allies gain +3 defense for 8 turns
  - Forgemastery (equipment enhancement):
    - T1 `runic_temper`: permanently add +1 ATK or +1 defense to one equipped item (once per item)
    - T2 `resonant_craft`: equipment rune bonuses doubled
    - T3 `masterwork`: once per dungeon, upgrade an item's rarity by one tier
- **Social**: persuade +1, intimidate +2, deceive -2

### Spellblade (Human only)

Warrior-mage of the lost Aetherian Empire, weaving sword and spell.

- **Bonuses**: HP +2, ATK +1, Sight +0
- **Starting ability**: `arcane_strike` — melee attack that deals bonus spell-power damage
- **Skill branches**:
  - Battle Channeling (elemental melee):
    - T1 `flame_blade`: melee attacks deal +3 fire damage for 5 turns
    - T2 `frost_edge`: melee attacks have 25% chance to freeze enemy for 1 turn
    - T3 `storm_strike`: melee attack chains lightning to up to 2 nearby enemies
  - Aegis Arts (magical defense):
    - T1 `spell_parry`: 15% chance to negate incoming spell damage
    - T2 `arcane_riposte`: on successful spell parry, reflect 50% damage back
    - T3 `null_field`: create a 2-tile aura that reduces all magic damage by 40% for 6 turns
  - War Casting (hybrid combat):
    - T1 `battle_focus`: casting spells no longer ends your turn (can move after casting)
    - T2 `channeled_blade`: arcane_strike scales with highest of ATK or spell power
    - T3 `blade_storm`: cast a spell and make a melee attack in the same turn
- **Social**: persuade +2, intimidate +2, deceive -1

---

## 3. NPC Race Attitude System

### Data Model

Each NPC gets a `raceAttitude` object:

```typescript
raceAttitude: { elf: number, dwarf: number, human: number }  // range: -5 to +5
```

Starting values are authored per-NPC based on lore and location. Examples:
- Dwarven blacksmith: `{ elf: -2, dwarf: 4, human: 0 }`
- Forest hermit: `{ elf: 3, dwarf: -1, human: -1 }`
- Cosmopolitan merchant: `{ elf: 1, dwarf: 1, human: 1 }`

### Attitude Shifts

Player actions shift NPC attitudes toward the player's race:
- Complete a quest for an NPC: +1
- Help their faction/settlement: +1
- Threaten or steal from them: -1
- Complete racial questline in their region: +1 for all NPCs in that region

Shifts are clamped to [-5, +5] and persisted in save state per NPC.

### Dialogue Flavor Injection

Flavor lines injected before/after NPC regular speech based on current attitude score:

| Score    | Tone              | Example (dwarf player, elf NPC)                              |
|----------|-------------------|---------------------------------------------------------------|
| -5 to -4 | Openly hostile    | "...not that I'd expect a tunnelrat to understand."          |
| -3 to -2 | Dismissive/cold   | "Hmph. Your kind always reek of soot."                       |
| -1 to +1 | Neutral           | *(no race comment)*                                          |
| +2 to +3 | Warm/respectful   | "You've more honor than most of your kin."                   |
| +4 to +5 | Deep kinship      | "I'd trust a dwarf-friend with my life. You've proven that." |

Lines are drawn from a pool per race-pair combination (~5 negative, ~5 positive per pair). Human women NPCs additionally have flirtatious innuendo lines:

*Human woman NPC -> Elf player (innuendo about elven height/length):*
- "They say elves are... gifted in many ways. I can see why the tales persist."
- "My friend married an elf. She says she could never go back. To human cooking, I mean."
- "You're tall for a traveler. Tall in all the ways that matter, I'd wager."

*Human woman NPC -> Dwarf player (innuendo about dwarven thickness):*
- "Dwarves may be short, but I hear they make up for it in... girth of character."
- "My sister spent a winter in the Holds. Came back walking funny. Said it was the stairs."
- "They say dwarven craftsmanship is all about thickness and endurance. I believe it."

These trigger on female human NPCs only, mixed into the normal flavor pool so they don't fire every conversation.

### New Dialogue Conditions

- `{ type: 'race', value: CharacterRace }` — show option only if player is that race
- `{ type: 'notRace', value: CharacterRace }` — hide option for a race
- `{ type: 'minRaceAttitude', race: CharacterRace, value: number }` — gate on minimum attitude score
- `{ type: 'maxRaceAttitude', race: CharacterRace, value: number }` — gate on maximum attitude score (for negative gates)

### DialogueContext Extension

- Add `playerRace: CharacterRace`
- Add `raceAttitude: Record<CharacterRace, number>` (current NPC's attitudes)

### NPC Gender

NPCs gain an optional `gender?: 'male' | 'female'` field. Only needed for NPCs that have gender-specific flavor lines (human women innuendo pool). NPCs without a gender field skip gendered flavor pools. Existing NPCs get gender assigned where it's obvious from their name/description (e.g., "Madame Vesper" → female); the rest default to undefined.

---

## 4. Racial Questlines

Three quest chains, one per race, each with 3 parts at levels 5, 15, and 25. Each reveals the race's deep history and connects to the central mystery of the false gods.

### Elf: "Roots of the First Song" (Eldergrove)

**Part 1 — "The Withering Grove" (Lv 5)**
An elder tree spirit is dying. The player discovers something is draining the Ley Line that feeds the grove. Investigate, fight corrupted forest creatures, find an ancient elven shrine defaced with Ascended symbols.

**Part 2 — "Echoes Before the Thrones" (Lv 15)**
Following the shrine's clues, enter a hidden spirit-glade where pre-Ascension elven ghosts linger. They speak of a time when magic flowed freely — before "the thieves took the thrones." Protect the glade from Ascended cultists who want to silence these witnesses.

**Part 3 — "The Unbroken Thread" (Lv 25)**
Deep in Eldergrove, find the oldest Ley Line nexus. The player learns that elven Old Magic predates the Ascended because the Ascended are not true gods.

**Reward — Ley Resonance**: Permanent +3 to all spell power, ley lines visible without True Sight.

### Dwarf: "The Runes Beneath" (Irongate)

**Part 1 — "The Sealed Gallery" (Lv 5)**
A collapsed mine shaft reveals a pre-Ascension dwarven hall covered in runes no living dwarf can read. Clear creatures nesting inside and recover a runic tablet that doesn't match any known divine script.

**Part 2 — "The Maker's Grammar" (Lv 15)**
A dwarven lorekeeper helps decipher the tablet. The runes describe seven fundamental forces — not seven gods. Delve deeper to find the full inscription, fighting ancient constructs still guarding it.

**Part 3 — "What the Stone Remembers" (Lv 25)**
The deepest chamber holds a rune-covered forge built around a raw Ley Line. The inscriptions prove dwarven runes predate the Ascended and correspond to the Original Seven — the true divine principles.

**Reward — Runic Mastery**: Permanent +2 physical defense, crafted/found equipment has a chance to gain bonus rune effects.

### Human: "The Drowned Throne" (Drowned Mire)

**Part 1 — "Lights in the Mire" (Lv 5)**
Strange lights appear over the marshes at night. Locals whisper about the sunken city of Valdris, capital of the first human kingdom, destroyed when the Spellblade-King challenged an entity of immense power. Wade into the ruins, fight marsh creatures, find a royal seal still radiating magic.

**Part 2 — "The King's Folly" (Lv 15)**
The seal unlocks a partially-submerged palace wing. Wall carvings tell the story: the Spellblade-King discovered the Ascended were false and gathered an army of Spellblades to storm the heavens. The "evil wizard" who destroyed Valdris was no wizard — it was divine retribution from the Ascended. Survive traps and guardians left to suppress this truth.

**Part 3 — "Crown of the Depths" (Lv 25)**
In the submerged throne room, find the king's final message and his crown — proof that a mortal once knew the truth and was annihilated for it.

**Reward — Sovereign's Will**: Permanent +2 to all social checks, once per dungeon level recover 25% HP when dropping below 20%.

### Quest Objective Mapping

Racial quest objectives use existing `QuestObjectiveType` values:
- "Investigate" / "Find" → `explore`
- "Fight corrupted creatures" / "Clear creatures" → `kill`
- "Protect the glade" → `kill` (survive waves of enemies)
- "Recover tablet/seal" → `collect`
- "Talk to lorekeeper" → `talk`
- "Survive traps" → `explore` (navigate a dungeon area)

No new objective types needed.

### Permanent Racial Rewards

Quest rewards like "+3 spell power permanently" require a new `permanentBuffs` array on the Player:

```typescript
interface PermanentBuff {
  id: string;              // e.g., 'ley_resonance', 'runic_mastery', 'sovereigns_will'
  source: string;          // quest ID that granted it
  effects: BuffEffect[];   // what it does
}

type BuffEffect =
  | { type: 'statBonus'; stat: 'spellPower' | 'physicalDefense' | 'socialBonus'; value: number }
  | { type: 'flag'; flag: 'leyLinesAlwaysVisible' | 'runeEnhanceChance' }
  | { type: 'conditional'; trigger: 'hpBelow20Pct'; effect: 'heal25Pct'; usesPerLevel: 1 };
```

The `QuestReward` interface gains an optional `permanentBuff?: string` field (buff ID). On quest completion, the buff is added to the player's `permanentBuffs` array. `recalculateDerivedStats()` reads this array and applies bonuses.

---

## 5. Race Lore

### Elves — The Remembering People

The eldest of the mortal races. Elven lifespans stretch centuries, and their oral traditions reach back to the Age of Silence — before the Ascended claimed their thrones. They settled the great forests where Ley Lines run shallow beneath root systems, and their Primordialists learned to draw magic directly from these currents. The Luminari civilization, co-founded with humans, was the golden age of art and knowledge, but elves remember older things — songs that name no gods, rituals that need no prayer. The Verdant Reach, their modern homeland, is ruled jointly by elven elders and druids. Many elves harbor a quiet distrust of divine institutions, though they rarely speak of why. The Church of the Radiant Sun considers elven "Old Ways" to be primitive superstition. The elves know better.

### Dwarves — The Makers Beneath

Dwarves built their civilization underground, around mineral veins and the deep Ley Lines that pulse through bedrock. Their Runeweaver tradition is the oldest written magic — runes carved into stone that channel fundamental forces. The Undermountain Holds control major mineral deposits and several underground Ley Line junctions. The Iron Republics, co-founded with humans, rejected dependence on divine magic in favor of engineering and runecraft. Dwarves are pragmatic, stubborn, and deeply proud of self-reliance. Their theologians have long noted that dwarven runes describe seven forces, not seven gods — a discrepancy the Church dismisses as "incomplete understanding." Dwarves don't argue the point. They just keep carving.

### Humans — The Inheritors

The youngest and most numerous race. Humans built the Aetherian Empire, the largest dominion in recorded history, through sheer adaptability — they mastered every magical tradition, allied with every race, and settled every terrain. Their greatest achievement was the Spellblade corps, warrior-mages who combined martial discipline with arcane power. Their greatest tragedy was Valdris, the shining capital, swallowed by marshland in a single night. Official histories blame a mad wizard's hubris. The Church preaches it as divine punishment for mortal arrogance. The ruins still glow on moonless nights. Humans are found in every faction, every tradition, every corner of the world. They adapt, they endure, and they forget — which may be why the truth stays hidden.

---

## 6. Architectural Impact

### New Types

```typescript
type CharacterRace = 'elf' | 'dwarf' | 'human';
```

Adding `'primordial' | 'runesmith' | 'spellblade'` to the `CharacterClass` union. This requires updating **every** `Record<CharacterClass, ...>` in the codebase.

### Complete Files to Modify

**Core type changes:**
- **types.ts** — Add `CharacterRace`, extend `CharacterClass` union, extend `CharacterConfig` with `race` field, extend `DialogueCondition` union with race/attitude conditions, extend `DialogueContext`, add `gender?` to NPC type, add `permanentBuffs` to Player, add `raceAttitude` to NPC type, add `PermanentBuff`/`BuffEffect` types

**Stat pipeline (archetype → race):**
- **magic.ts** — Replace `ARCHETYPE_ATTRIBUTES` with `RACE_ATTRIBUTES`, update `CLASS_PROFILES` to remove archetype assignment, add `primaryAttribute` per race, update `recalculateDerivedStats()` to apply permanent buffs
- **engine.ts** — Update `createGame()` to use race lookup, add race sight bonuses, enforce race-exclusive class validation, add mana floor of 5, update `CLASS_BONUSES` with 3 new class entries, update `CLASS_STARTING_ITEMS` with 3 new class entries

**All Record<CharacterClass, ...> tables needing new entries:**
- **engine.ts** — `CLASS_BONUSES`, `CLASS_STARTING_ITEMS`
- **magic.ts** — `CLASS_PROFILES`
- **combat.ts** — `DODGE_CHANCE`, `BLOCK_REDUCTION`, `PUSH_CHANCE`, `FLEE_CHANCE`
- **traps.ts** — `DISARM_CHANCE`
- **abilities.ts** — `ABILITY_DEFS` (new abilities: `ley_surge`, `rune_ward`, `arcane_strike`)
- **dialogue-handler.ts** — `SOCIAL_CLASS_BONUS`
- **mastery.ts** — `CLASS_MASTERY_MULTIPLIERS`
- **skills.ts** — `SKILL_DEFS` (27 new skill entries: 9 per new class)

**Dialogue system:**
- **dialogue-handler.ts** — Add `race`/`notRace`/`minRaceAttitude`/`maxRaceAttitude` condition checks in `checkCondition()`, add flavor text injection function, populate `DialogueContext` with `playerRace` and `raceAttitude`
- **dialogue.ts** — Add `raceAttitude` and `gender` to NPC definitions, add racial flavor line pools, add racial quest dialogue trees, add innuendo pools for female human NPCs

**Quest & overworld:**
- **quests.ts** — Add 9 quest definitions (3 chains × 3 parts), add `permanentBuff` field to `QuestReward`
- **overworld.ts** — Place racial quest trigger locations in Eldergrove, Irongate, Drowned Mire

**Persistence:**
- **save.ts** — Persist `race`, `permanentBuffs`, per-NPC `raceAttitudeShifts` (delta from authored base), bump `SAVE_VERSION`

### New Files

- **docs/lore/races.md** — Race lore entries (elf, dwarf, human)
- **ascii-rpg/src/lib/game/races.ts** — `RACE_ATTRIBUTES` table, `RACE_SIGHT_BONUS` table, passive effect application, racial class validation, flavor line pools, `RACE_EXCLUSIVE_CLASSES` mapping

### NPC Attitude Persistence

NPCs are regenerated from definition data on each location visit. Attitude shifts are stored as **deltas** in the save state:

```typescript
// In save state
npcAttitudeShifts: Record<string, Record<CharacterRace, number>>
// key = npc ID, value = delta from authored base
```

On NPC creation, the authored base `raceAttitude` is loaded, then the saved delta is applied. This avoids serializing full NPC state while preserving player-earned shifts.

### Character Creation UI

Race selection is presented as the **first step** of character creation, before class selection. The UI shows:
1. Pick race (Elf / Dwarf / Human) with stat preview and passive description
2. Pick class — all 9 base classes shown, plus the race-exclusive class highlighted with a `[Race Exclusive]` tag
3. Pick difficulty and starting location (unchanged)

### Backwards Compatibility

- Existing saves without a `race` field default to `'human'` on load (human has balanced stats closest to average archetype).
- The `archetype` field on `CharacterConfig` becomes optional. Phase 1: race is added alongside archetype (archetype ignored if race is present). Phase 2 (future): remove archetype entirely after all tests are migrated.
- Existing saves without `permanentBuffs` default to empty array.
- Existing saves without `npcAttitudeShifts` default to empty object.

### Test Impact

Existing test files requiring updates:
- **magic.test.ts** — Archetype point-sum test → race point-sum test (verify all races sum to 54)
- Any test creating `CharacterConfig` without a `race` field needs updating (add `race: 'human'` as default)
- **combat.test.ts**, **dialogue-handler.test.ts** — New class entries in Record tables
- New test coverage needed: race-exclusive class validation, passive effects, attitude shift persistence, flavor line injection, permanent buff application
