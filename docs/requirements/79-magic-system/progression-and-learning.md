# Magic Progression and Learning

**Epic 79 — Magic System · Progression & Learning**

How players discover, learn, and advance in magic. Covers the seven main spell schools (Elements, Enchantment, Restoration, Divination, Alchemy, Conjuration, Shadow), the five forbidden schools (Blood Magic, Necromancy, Void Magic, Chronomancy, Soul Magic), and class-specific paths through the system. The Academy (Epic 78) provides one structured entry point; the rest of magic progression happens through NPC teachers, scrolls, tomes, quests, experimentation, and forbidden sources scattered across the world.

Each school has five spell tiers and three mastery levels (Novice, Adept, Master). Mastery is earned through practice, study, and quests — not granted automatically. Class affinities shape the speed of progression but rarely gate it outright.

---

## US-MS-55: Learning Spells — Sources

**As a** player,
**I want** multiple ways to learn new spells throughout the game,
**so that** magic discovery feels organic and rewards exploration, relationships, and curiosity.

### Description

Spells can be learned from seven distinct sources, each with its own flavour and requirements:

1. **Academy Lessons** (Epic 78): The structured curriculum teaches 4–6 spells across 8 lessons. This is the gentlest on-ramp for players new to magic. Attending lessons grants spells automatically upon completion.

2. **NPC Teachers**: Certain NPCs teach specific spells through dialogue. Requirements vary — some demand reputation or friendship levels, others ask for gold, and others require a completed quest. Examples: temple priests teach Restoration spells; Primordialist druids teach nature-themed Elements spells; Runeweaver artisans teach Enchantment.

3. **Spell Scrolls**: Found as loot in dungeons, chests, and enemy drops. Reading a spell scroll presents a choice:
   - **Learn** the spell permanently (scroll is consumed, costs 1 skill point).
   - **Save** the scroll for a one-shot emergency cast later (scroll is consumed on cast, no skill point needed).
   A scroll cannot do both — the player must choose.

4. **Spell Tomes**: Found in libraries, dungeons, and shops. Reading a tome teaches the spell permanently, but **costs 1 skill point** to internalize the knowledge. The tome is **not consumed** — it can be traded, sold, or given to an NPC after reading. If the player has 0 skill points: "You read the words but can't focus the knowledge into a spell. You need more experience." (The book remains usable later when a skill point is available.)

5. **Quest Rewards**: Some quests grant spells directly as part of their resolution. For example: *"The grateful mage teaches you Firebolt."* The quest log or dialogue should telegraph the reward where appropriate.

6. **Experimentation** (Mage class only): At a Ley Line nexus, a Mage can spend 50 mana + 10 turns to attempt to discover a random spell from a school in which they have Novice or higher mastery. Base success rate: 30%. Failure: mana is spent, player takes small backlash damage. See US-MS-62 for full details.

7. **Forbidden Sources**: Each forbidden school has its own discovery path:
   - Blood Magic — learned from Blood Singer NPCs or dark texts found in hidden locations.
   - Necromancy — learned in crypts, ossuaries, and death-touched areas.
   - Void Magic — learned at Void Scars and from the whispers that emanate from them.
   - Chronomancy — learned from time anomalies and temporal rifts.
   - Soul Magic — learned at corrupted Spirit nexuses.

### Acceptance Criteria

- [ ] A `learnSpell(state, spellId, source)` function (or equivalent) adds the spell to `state.learnedSpells` and emits the message *"You have learned [Spell Name]!"*.
- [ ] If the player already knows the spell, the function emits *"You already know this spell."* and makes no changes.
- [ ] Academy lessons call `learnSpell` with `source: 'academy'` upon lesson completion.
- [ ] NPC teachers call `learnSpell` with `source: 'npc'` when dialogue conditions are met (reputation, gold, quest flags checked before the option appears).
- [ ] Spell scrolls present a two-option dialogue: "Learn this spell (1 skill point)" / "Save for later". Learning consumes the scroll, deducts 1 skill point, and calls `learnSpell` with `source: 'scroll'`. Option is greyed out if 0 skill points. Saving keeps the scroll as a usable item.
- [ ] Spell tomes call `learnSpell` with `source: 'tome'`, deduct 1 skill point, and remain in the player's inventory after use. If 0 skill points, display message and do not teach the spell.
- [ ] Quest rewards call `learnSpell` with `source: 'quest'` as part of quest completion logic.
- [ ] Experimentation is gated to the Mage class and requires a Ley Line nexus tile, 50+ mana, and Novice+ mastery in the target school.
- [ ] Forbidden sources are gated to their respective locations/NPCs and present a permanent-cost warning before teaching (see US-MS-60).
- [ ] The spell menu updates immediately when a new spell is learned.
- [ ] A unit test confirms that learning the same spell twice does not create a duplicate entry.

---

## US-MS-56: School Mastery System

**As a** player,
**I want** my repeated use and study of a spell school to be tracked and rewarded with mastery levels,
**so that** I feel meaningful progression within my chosen magical disciplines.

### Description

Each spell school tracks mastery independently:

```
schoolMastery: Record<string, { xp: number, level: 'none' | 'novice' | 'adept' | 'master' }>
```

**Mastery XP Sources:**
- Casting a spell from the school: **+5 XP** per cast.
- Completing a school-related quest: **+50–200 XP** (varies by quest).
- Studying at a relevant location (library, ley line, temple): **+1 XP per 10 turns** spent studying.

**Mastery Thresholds:**
| Level | XP Required | Condition |
|-------|-------------|-----------|
| None | — | No spells known from this school |
| Novice | 0 | Know at least one spell from the school |
| Adept | 200 | Accumulated 200+ mastery XP |
| Master | 1000 | Accumulated 1000+ mastery XP |

**Class Affinity Multipliers:**
- Mage / Necromancer: **1.5×** mastery XP gain.
- Cleric / Bard: **1.25×** mastery XP gain.
- Warrior / Rogue / Ranger / Paladin: **1.0×** mastery XP gain.

**Mastery Unlocks — Tier Access:**
- Novice: Can cast Tier 1–2 spells from the school.
- Adept: Can cast Tier 3–4 spells. School passive bonus activates.
- Master: Can cast Tier 5 spells. Mastery passive activates. Can teach this school to NPCs (US-MS-63).

**School Passive Bonuses (activate at Adept):**
| School | Passive |
|--------|---------|
| Elements | Fire/ice/lightning damage +15% |
| Enchantment | Ward and shield durations +30% |
| Restoration | Healing output +20% |
| Divination | Sight radius permanently +1 |
| Alchemy | Potion effects +25% |
| Conjuration | Summon durations +50% |
| Shadow | Debuff durations on enemies +30% |

**Mastery Passives (activate at Master):**
| School | Passive |
|--------|---------|
| Elements | 10% chance to trigger a free follow-up elemental attack after casting |
| Enchantment | Wards absorb the first hit without breaking |
| Restoration | Auto-heal 1 HP when dropping below 25% HP (once per 50 turns) |
| Divination | Permanent passive trap detection (no spell slot needed) |
| Alchemy | 30% chance to not consume reagents when brewing potions |
| Conjuration | Summoned creatures gain +50% HP and +50% damage |
| Shadow | First attack from stealth or invisibility deals 2× damage |

### Acceptance Criteria

- [ ] `schoolMastery` is initialised for each school as `{ xp: 0, level: 'none' }` at game start and persisted in save data.
- [ ] Learning a first spell from a school automatically sets that school to `'novice'`.
- [ ] Casting a spell adds 5 × class multiplier XP to the relevant school's mastery.
- [ ] Quest completion can add 50–200 × class multiplier XP to a specified school.
- [ ] Studying at a relevant location adds 1 × class multiplier XP per 10 turns spent.
- [ ] When mastery XP crosses the 200 threshold, the level transitions to `'adept'` with a message: *"You have reached Adept mastery in [School]!"*
- [ ] When mastery XP crosses the 1000 threshold, the level transitions to `'master'` with a message: *"You have achieved Master mastery in [School]!"*
- [ ] School passive bonuses are applied when the player reaches Adept.
- [ ] Mastery passives are applied when the player reaches Master.
- [ ] The character status panel displays current mastery level and XP progress for each known school.
- [ ] A unit test confirms XP gain, class multiplier application, and level transitions at the correct thresholds.

---

## US-MS-57: Spell Tier Requirements

**As a** player,
**I want** higher-tier spells to require appropriate mastery and character level,
**so that** powerful magic feels earned and pacing is preserved.

### Description

Spell tier requirements gate when a player can actually cast a learned spell:

| Tier | Mastery Required | Level Required |
|------|-----------------|----------------|
| 1 | None | None |
| 2 | School Novice | None |
| 3 | School Adept | None |
| 4 | School Adept | Character level 10+ |
| 5 | School Master | Character level 15+ |

If a player learns a spell before meeting its tier requirements, the spell appears in the spell menu but is **greyed out** with a tooltip indicating the unmet requirement (e.g., *"Requires Elements Adept"* or *"Requires level 15"*).

**Exception — Forbidden Spells:** Spells from forbidden schools (Blood Magic, Necromancy, Void Magic, Chronomancy, Soul Magic) have **no tier requirements**. Once learned, they are always castable. Their balancing mechanism is the permanent cost incurred when learning them (see US-MS-60), not tier gates.

### Acceptance Criteria

- [ ] Each spell definition includes a `tier` field (1–5) and a `school` field.
- [ ] The `canCast(state, spellId)` function checks: (a) spell is in `learnedSpells`, (b) school mastery meets or exceeds the tier requirement, (c) character level meets or exceeds the tier requirement.
- [ ] Spells that fail the requirement check appear in the spell menu with a greyed-out visual state.
- [ ] Greyed-out spells display the specific unmet requirement when highlighted or selected.
- [ ] Attempting to cast a greyed-out spell produces the message *"You lack the mastery to cast [Spell Name]."* or *"You need to be level [N] to cast [Spell Name]."* and does not consume mana or a turn.
- [ ] Forbidden-school spells bypass all tier requirement checks — `canCast` returns true as long as the spell is in `learnedSpells` and the player has sufficient mana.
- [ ] A unit test verifies that a Tier 3 spell cannot be cast without Adept mastery, and that a forbidden Tier 3 spell can be cast without any mastery.

---

## US-MS-58: Class-Specific Magic Paths

**As a** player,
**I want** my class to shape my magical identity through starting spells, affinity bonuses, and natural learning paths,
**so that** each class feels distinct in how it approaches magic.

### Description

Each class has a magical profile defining starting spells, mastery XP multipliers per school, and learning restrictions:

**Mage:**
- Starts with 1 random Tier 1 spell from any main school.
- +50% mastery XP in all main schools.
- Can learn all main schools freely.
- Natural path: Arcanist tradition (academic magic).

**Warrior:**
- No starting spells.
- −25% mastery XP in all schools.
- Can learn Elements and Enchantment at normal learning cost. All other schools require 2× learning cost (double gold for NPC teachers, double study time for tomes).
- Natural path: Battle magic (practical combat spells only).

**Rogue:**
- No starting spells.
- Normal mastery XP in Shadow and Conjuration. −25% in all other schools.
- Natural path: Shadow magic and utility spells.

**Ranger:**
- No starting spells.
- +25% mastery XP in Elements (nature-themed spells) and Divination. Normal rate in all others.
- Natural path: Primordialist tradition (Old Magic).

**Cleric:**
- Starts with Heal (Restoration Tier 1).
- +50% mastery XP in Restoration. +25% in Enchantment. −50% in Shadow and all forbidden schools.
- Natural path: Thaumaturge tradition (temple magic).

**Paladin:**
- No starting spells.
- +25% mastery XP in Restoration and Enchantment.
- **Cannot learn Shadow or any forbidden school** unless alignment shifts to dark (separate system).
- Natural path: Holy magic (Restoration + Enchantment only).

**Necromancer:**
- Starts with Life Tap (Necromancy Tier 1).
- +50% mastery XP in Shadow and Necromancy. −25% in Restoration.
- Natural path: Forbidden magic specialist.

**Bard:**
- No starting spells.
- +25% mastery XP in Enchantment and Conjuration. Normal rate in all other schools.
- Natural path: Versatile magic (jack of all schools).

Class restrictions are **soft gates** — any class can learn any spell from any main school (with varying effort), except Paladin's hard restriction on Shadow and forbidden schools.

### Acceptance Criteria

- [ ] A `CLASS_MAGIC_PROFILES` constant (or equivalent) defines starting spells, per-school XP multipliers, and learning cost multipliers for each of the 8 classes.
- [ ] Character creation grants starting spells based on the class profile (Mage gets 1 random Tier 1 spell, Cleric gets Heal, Necromancer gets Life Tap, others get none).
- [ ] School mastery XP gains are multiplied by the class-specific modifier before being applied.
- [ ] Learning cost multipliers are applied when paying gold to NPC teachers and when calculating study time for tomes.
- [ ] Paladin is hard-blocked from learning Shadow or forbidden-school spells: the learn option does not appear in dialogue, and spell scrolls/tomes for those schools display *"This magic is anathema to your oath."*
- [ ] A Mage selecting Experimentation (US-MS-62) gains the +50% XP bonus on any resulting mastery XP.
- [ ] The character creation screen or journal displays a brief description of the class's magical affinity.
- [ ] A unit test confirms that a Warrior pays 2× gold for an NPC-taught Restoration spell compared to a Cleric.
- [ ] A unit test confirms that a Paladin cannot learn a Shadow spell via any source.

---

## US-MS-59: Specialization (Advanced — Level 10+)

**As a** player who has invested deeply in magic,
**I want** to choose a magical specialization that amplifies my strengths,
**so that** late-game magic feels powerful and my build choices are rewarded.

### Description

At character level 10 or above, if the player has reached Adept mastery in at least one school, they may choose a magical specialization. Specialization is **permanent** and **optional** — players who prefer a generalist path can decline. Only one specialization is allowed per character.

**Available Specializations:**

| Specialization | Requirement | Benefits |
|---|---|---|
| **Archmage** | Adept in 3+ schools | All spell mana costs −20%. Can maintain 2 concentration effects simultaneously (normally 1). |
| **Elementalist** | Adept in Elements | Choose one element (fire, ice, or lightning). That element's spells deal +50% damage. Player is immune to that element's damage. |
| **Battlemage** | Adept in Enchantment + Elements | Can cast spells while wearing medium armour without penalty. Melee attacks have a chance to trigger spell effects (bound spell proc). |
| **Healer** | Adept in Restoration | All healing output +50%. Resurrection spell cooldown halved. Can heal allies at range (2 tiles). |
| **Shadowcaster** | Adept in Shadow | Invisibility duration doubled. Shadow spells do not break stealth. Life Drain heals 75% of damage dealt (up from 50%). |
| **Artificer** | Adept in Enchantment + Alchemy | Enchanting success rate becomes 100%. Can create magical constructs (golem, turret). Double enchantment slots on crafted items. |
| **Seer** | Adept in Divination | Permanent Enemy Analysis on all visible enemies (show HP/weakness). Premonition becomes passive: auto-dodge 1 attack per 20 turns. Show enemy intended actions for the next turn. |

The specialization prompt appears the first time the player opens the spell menu or levels up after meeting the prerequisites. The player can dismiss it and choose later via the spell menu.

### Acceptance Criteria

- [ ] A `specialization` field is added to the player state (type: `string | null`, default `null`), persisted in save data.
- [ ] When the player reaches level 10+ and has Adept in at least one school, a prompt or menu option appears offering available specializations.
- [ ] Only specializations whose prerequisites are met appear as selectable options.
- [ ] Selecting a specialization sets `state.specialization` and emits a confirmation message: *"You have become a [Specialization]!"*
- [ ] The specialization's bonuses are immediately applied to all relevant game mechanics.
- [ ] Attempting to select a second specialization produces *"You have already specialised as a [Specialization]."*
- [ ] Dismissing the prompt allows the player to access it later from the spell menu.
- [ ] Elementalist specialization presents a sub-choice of element (fire / ice / lightning) and stores the chosen element.
- [ ] The character status panel displays the active specialization (or "None" if unchosen).
- [ ] A unit test confirms that a player with Adept in Elements and Enchantment can select Battlemage, and that the resulting melee-spell proc functions.
- [ ] A unit test confirms that a player who already has a specialization cannot select another.

---

## US-MS-60: Forbidden Magic Progression

**As a** player tempted by power,
**I want** forbidden magic to offer immense strength at a meaningful permanent cost,
**so that** choosing to walk the dark path feels like a genuine, weighty decision.

### Description

Forbidden schools do not use the standard mastery tier system. There are no Novice/Adept/Master levels — you either know a forbidden spell or you don't. Instead, each spell learned from a forbidden school exacts a **permanent cost** that cannot be reversed:

| School | Cost per Spell Learned |
|--------|----------------------|
| Blood Magic | Permanently reduces maxHP by 3 |
| Necromancy | Increases corruption score by 1 (visual changes accumulate: pale skin → sunken eyes → chill aura; NPCs react with fear/hostility) |
| Void Magic | Permanently reduces maxSanity by 5 (sanity starts at WIL × 5) |
| Chronomancy | Adds +10 to paradox baseline (random time glitches — turns skipped, monsters displaced — become more frequent) |
| Soul Magic | Reduces maximum soul gem capacity by 1 (starts at 10) |

**Disclosure:** Before learning any forbidden spell, a confirmation dialogue appears:
> *"Learning [Spell Name] will permanently reduce your maximum [resource] by [amount]. Proceed? (Y/N)"*

The player must explicitly confirm. Pressing N cancels the learning with no penalty.

**Threshold Event:** When a player has learned 5 or more spells from a single forbidden school, a special event triggers:

| School | Event at 5 Spells |
|--------|-------------------|
| Blood Magic | **Blood Frenzy** passive — attacks that draw blood heal 1 HP |
| Necromancy | **Undead Accord** — undead enemies stop attacking you (treat you as one of them) |
| Void Magic | **Void Whisper** passive — periodic whispers reveal hidden secrets on the current level |
| Chronomancy | **Temporal Sense** — permanent awareness of time anomalies and hidden temporal events |
| Soul Magic | **Soul Sight** — can see the souls of all living entities (reveals invisible/hidden enemies, shows NPC alignment) |

### Acceptance Criteria

- [ ] Forbidden spells have no mastery-tier requirement — once learned, they can be cast immediately regardless of school mastery level.
- [ ] Learning a forbidden spell applies the permanent cost to the relevant player stat (maxHP, corruption, maxSanity, paradoxBaseline, maxSoulGems).
- [ ] A confirmation dialogue with the exact cost is displayed before any forbidden spell is learned. Declining cancels learning with no side effect.
- [ ] Corruption score changes are reflected visually in the character's ASCII representation and/or status panel.
- [ ] NPCs react to corruption level: low corruption (1–2) draws uneasy comments, moderate corruption (3–4) makes some NPCs refuse to trade, high corruption (5+) causes guards to become hostile.
- [ ] Paradox baseline increases manifest as random gameplay glitches: occasionally skip a turn, teleport a nearby monster, duplicate an item briefly.
- [ ] When the player learns their 5th spell from a single forbidden school, the threshold event triggers with a dramatic message and the passive is permanently granted.
- [ ] The character status panel shows active forbidden costs (e.g., "Corruption: 3", "Paradox: 20") and any threshold passives.
- [ ] Save data includes all forbidden-magic state: corruption, paradox baseline, maxSanity reduction, maxHP reduction, soul gem reduction, and threshold flags.
- [ ] A unit test confirms that learning a Blood Magic spell reduces maxHP by 3.
- [ ] A unit test confirms that the 5th Necromancy spell triggers the Undead Accord event.

---

## US-MS-61: The Academy's Place in Magic Progression

**As a** player who attended the Academy,
**I want** my Academy education to give me a solid magical foundation that I can build upon in the wider world,
**so that** the Academy feels like a meaningful starting chapter rather than the whole story.

### Description

The Academy (Epic 78) teaches a curated subset of the full magic system, focused on beginner-level spells from four schools:

| School | Spells Taught | Tier |
|--------|--------------|------|
| Elements | Firebolt, Frost Lance | 1–2 |
| Enchantment | Arcane Ward | 1 |
| Alchemy | Acid Splash, Healing Mist + potion recipes | 1 |
| Divination | True Sight, Reveal Secrets | 1 |

Completing the Academy's 8-lesson curriculum brings the player to **Novice mastery** in these four schools — enough to cast Tier 1–2 spells but nowhere near Adept or Master.

**Academy Library — Hints at the Wider World:**
The Academy's library contains books that reference schools and traditions beyond the curriculum:
- **Restoration**: Books describe the temple tradition of the Thaumaturges. *"For proper training, seek the priests of Solara."* Mentions but does not teach.
- **Conjuration**: Books warn of the dangers. *"Summoning is banned on Academy grounds after the Incident of Year 342."* Theory only, no spells.
- **Shadow**: Books are in the restricted section. Accessing them requires a quest or high reputation with a specific teacher. Lore only, no spells.
- **Forbidden schools**: Books in the deeply restricted section. Accessible only through specific Academy quests. Contain lore and hints about where to find forbidden knowledge in the world, but do not teach spells.

To progress beyond Novice in any school, the player must leave the Academy and pursue knowledge through the wider world's NPC teachers, spell tomes, scrolls, quests, and experimentation.

### Acceptance Criteria

- [ ] Academy lessons grant exactly the spells listed above (Firebolt, Frost Lance, Arcane Ward, Acid Splash, Healing Mist, True Sight, Reveal Secrets) and no others.
- [ ] Completing the full Academy curriculum results in Novice mastery in Elements, Enchantment, Alchemy, and Divination (with some mastery XP accumulated from classes, but not enough for Adept).
- [ ] The Academy does not teach Restoration, Conjuration, Shadow, or any forbidden school spells.
- [ ] Academy library book interactions provide lore text about Restoration, Conjuration, Shadow, and forbidden schools without teaching any spells.
- [ ] Library books about forbidden schools are gated behind a quest flag or reputation check.
- [ ] After leaving the Academy, higher-tier spells (Tier 3+) must be acquired through non-Academy sources.
- [ ] Academy-learned spells use the same `learnSpell` function as all other sources (source: `'academy'`).
- [ ] A unit test confirms that the Academy curriculum results in Novice mastery (not Adept or higher) in the four taught schools.

---

## US-MS-62: Spell Research (Mage Class Feature)

**As a** Mage,
**I want** to research and discover new spells through study and experimentation,
**so that** I have a unique path to magical knowledge that rewards my class identity.

### Description

Spell Research is exclusive to the Mage class. At a Ley Line nexus or library tile, the Mage can spend resources to attempt to discover an unknown spell:

**Process:**
1. Player selects "Research Spell" from the interaction menu at a valid location.
2. Player chooses a target school (must have Novice+ mastery in that school).
3. 50 mana is deducted. The Mage spends 10 turns concentrating (turns pass, enemies can interrupt).
4. Roll for success.

**Success Rates:**
- Base: **30%**
- +2% per point of INT above 12 (e.g., INT 16 = 30% + 8% = 38%)
- +10% if researching at the Academy library (Ley Line convergence bonus)
- Capped at 75% maximum

**Outcomes:**
- **Success (normal):** Learn a random unlearned spell from the target school at the lowest available tier. Message: *"Your research yields results — you have learned [Spell Name]!"*
- **Critical Success (5% of successful rolls):** Learn the spell AND gain +25 mastery XP in that school. Message: *"A breakthrough! You have learned [Spell Name] and deepened your understanding of [School]."*
- **Failure:** Mana is spent, player takes 5 arcane backlash damage, and research goes on a **100-turn cooldown** before the next attempt. Message: *"The magic slips from your grasp. Arcane backlash singes you for 5 damage."*

**Restrictions:**
- Mage class only. Other classes see *"Only a trained Mage can conduct spell research."*
- Cannot research forbidden-school spells. Selecting a forbidden school produces: *"The forbidden arts cannot be uncovered through academic research. They must be found in the world."*
- Cannot research if all spells in the target school are already known.
- Cannot research during the 100-turn cooldown.

### Acceptance Criteria

- [ ] "Research Spell" option appears in the interaction menu only when the player is a Mage standing on a Ley Line nexus or library tile.
- [ ] The research UI presents only schools where the player has Novice+ mastery and at least one unlearned spell.
- [ ] Initiating research deducts 50 mana immediately. If mana is insufficient, display *"Not enough mana to conduct research."*
- [ ] 10 turns pass during research. If an enemy enters melee range during this time, research is interrupted: mana is still spent, no spell is learned, no backlash damage, no cooldown applied. Message: *"Your concentration is broken!"*
- [ ] Success rate is calculated as `min(75, 30 + max(0, INT - 12) * 2 + (isAcademyLibrary ? 10 : 0))`.
- [ ] On success, a random unlearned spell from the lowest available tier in the chosen school is learned via `learnSpell`.
- [ ] On critical success (5% chance within the success roll), the spell is learned and +25 mastery XP is awarded.
- [ ] On failure, 5 damage is dealt to the player and a 100-turn cooldown is set on `state.researchCooldown`.
- [ ] Forbidden schools are not selectable in the research menu.
- [ ] Non-Mage classes cannot access the research option.
- [ ] A unit test verifies the success rate formula with different INT values.
- [ ] A unit test verifies that research cannot target a school with all spells already learned.

---

## US-MS-63: Teaching Magic to Others (Post-Game Hook)

**As a** master-level mage,
**I want** to teach spells to NPC students,
**so that** my mastery has tangible impact on the world and I feel like a true authority in magic.

### Description

Players who achieve Master mastery in any school can teach spells from that school to NPC students. This extends the Academy's teaching game loop (US-AA-09 in Epic 78) with real spell content instead of trivia questions.

**Where:** Available at the Academy (if the player has progressed to a teaching role) and at Mages' Guild locations throughout the world.

**Process:**
1. Interact with an NPC student at a teaching location.
2. Select a spell you know from a school in which you have Master mastery.
3. The teaching takes 5 turns.
4. The NPC student "learns" the spell (flagged on the NPC).
5. You receive XP and gold as a reward.

**Rewards:**
- Teaching a spell from a school you have Master mastery in: **+30 XP, +25 gold**.
- Teaching any other known spell (from a school where you have less than Master): **+15 XP, +10 gold**.
- Each NPC student can learn up to 3 spells from you before they "graduate" and leave.

**Teaching Forbidden Spells:**
- It is possible to teach forbidden spells to NPC students.
- Doing so has consequences: Inquisitor NPCs may start investigating, the player's alignment shifts toward dark, and the student may later become a hostile NPC if the forbidden magic corrupts them.
- A warning is displayed: *"Teaching forbidden magic is dangerous — for you and your student. Are you sure?"*

**Emergent Storytelling:**
- NPC students who "graduate" can later be encountered in the world.
- They use the spells you taught them (friendly or hostile depending on circumstances).
- If you taught them forbidden magic, there is a chance they appear as a corrupted enemy in a later dungeon.

### Acceptance Criteria

- [ ] The "Teach Spell" option appears when interacting with an NPC student at a valid teaching location, and the player has Master mastery in at least one school.
- [ ] The teaching menu shows only spells from schools where the player has Master mastery.
- [ ] Teaching deducts 5 turns and grants the appropriate XP and gold reward.
- [ ] Each NPC student tracks how many spells they have learned from the player (max 3).
- [ ] After learning 3 spells, the NPC student "graduates" with a farewell message and is removed from the teaching location.
- [ ] Graduated students are added to a world encounter pool with their learned spells.
- [ ] Teaching a forbidden spell triggers a warning dialogue. If confirmed, the player's alignment shifts and an Inquisitor investigation flag is set.
- [ ] Graduated students who learned forbidden spells have a chance (e.g., 30%) to appear as corrupted enemies in later dungeon levels.
- [ ] Teaching rewards are correctly scaled: Master-mastery school spells give +30 XP / +25 gold; others give +15 XP / +10 gold.
- [ ] The teaching system integrates with the Academy's existing US-AA-09 teaching loop, extending it with spell-based content.
- [ ] A unit test confirms XP and gold rewards for teaching a spell.
- [ ] A unit test confirms that forbidden-spell teaching sets the Inquisitor investigation flag.
