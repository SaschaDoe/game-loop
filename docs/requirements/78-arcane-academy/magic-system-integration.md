# Magic System Integration (Academy Subset)

> **NOTE:** The base magic system (attributes, mana, spell casting, alchemy, enchanting) is defined in **Epic 79: Magic System** (`docs/requirements/79-magic-system/`). This document describes only the Academy-specific integration — which spells the Academy teaches, how lessons connect to the magic system, and Academy-specific bonuses.

---

## Academy Magic Profile

The Academy is an **Arcanist institution** that teaches 4 of the 7 arcane schools through its house system. It does NOT teach Restoration (temple tradition), Conjuration (too dangerous), or Shadow (morally ambiguous).

### Spells Taught at the Academy

**Tier 1 (Core Curriculum — all students):**

| Lesson | School | Spell | Tier | Epic 79 Reference |
|--------|--------|-------|------|-------------------|
| Lesson 1 (Elements 101) | Elements | Firebolt | 1 | US-MS-17 |
| Lesson 3 (Enchantment Fundamentals) | Enchantment | Arcane Ward | 1 | US-MS-18 |
| Lesson 4 (Elemental Combat) | Elements | Frost Lance | 1 | US-MS-17 |
| Lesson 5 (Advanced Alchemy) | Alchemy | Acid Splash | 1 | US-MS-19 |
| Lesson 6 (Divination) | Divination | True Sight | 1 | US-MS-19 |
| Lesson 6 (Divination) | Divination | Reveal Secrets | 1 | US-MS-19 |

**Tier 2 (Advanced Lessons — all students):**

| Lesson | School | Spell | Tier | Epic 79 Reference |
|--------|--------|-------|------|-------------------|
| Lesson 7 (Advanced Combat) | Enchantment | Dispel | 2 | US-MS-18 |
| Lesson 7 (Advanced Combat) | Elements | Lightning Arc | 2 | US-MS-17 |

**House-Specific Spells (Lesson 8, one per student):**

| House | School | Spell | Tier | Epic 79 Reference |
|-------|--------|-------|------|-------------------|
| Pyraclaw | Elements | Glacial Wall | 2 | US-MS-17 |
| Verdantia | Alchemy | Transmute Weapon | 2 | US-MS-19 |
| Ironveil | Enchantment | Reflective Shield | 3 | US-MS-18 |
| Glimmershade | Divination | Foresight | 2 | US-MS-19 |

Note: Ironveil students receive Reflective Shield at Tier 3 — the only Tier 3 spell taught at the Academy, reflecting the Enchantment school's emphasis on mastery through precision. This is an exception; students must still reach Adept mastery to cast it independently after graduation.

**Total: 10-11 spells per student** (8 shared + 1 house-specific + 2-3 from library books)

### Recipes Taught at the Academy

| Lesson | Recipe | Epic 79 Reference |
|--------|--------|-------------------|
| Lesson 2 (Alchemy Basics) | Health Potion | US-MS-35 |
| Lesson 5 (Advanced Alchemy) | Antidote, Mana Potion | US-MS-35 |
| Thornwick bonus (quest reward) | Strength Elixir | US-MS-35 |

### Academy Alchemy Station

The Alchemy Tower contains an alchemy station (see US-MS-34). Academy students can use it freely. Brewing mechanics, recipe learning, and potion effects are defined in Epic 79 (`alchemy-and-crafting.md`).

### Academy Enchanting

The Enchantment Lab contains an enchanting table (see US-MS-43). Students learn basic enchantment during Ironveil house activities. Enchanting mechanics are defined in Epic 79 (`enchanting.md`).

---

## Academy-Specific User Stories

The following stories are Academy-specific additions that layer on top of Epic 79's base system.

### US-AA-21: Academy Mana Bonus
**As a** student enrolled at the Academy, **I receive** a mana bonus from the Ley Line convergence, **so that** studying at the Academy has a tangible magical benefit.

**Acceptance Criteria:**
- Academy location has magic level = 4 (convergence) as defined in US-MS-54
- While at the Academy: mana regeneration is 2× base rate (US-MS-04 location bonus) — this is a temporary location benefit, NOT a permanent stat change
- HUD shows mana as defined in US-MS-06
- **No permanent attribute or mana changes** from enrollment. The Academy's benefit is access to lessons, the library, the practice dungeon, and the 2× mana regen while on campus.

### US-AA-22: Learn Spells from Lessons
**As a** student, **I learn** specific spells during Academy lessons that are permanently added to my spellbook, **so that** education has real mechanical value.

**Acceptance Criteria:**
- Spells are learned via the `learnedSpells` system defined in US-MS-55
- Each lesson that teaches a spell triggers: spell added to `learnedSpells`, message "You have learned [Spell Name]!", spell appears in spell menu (US-MS-23)
- If mana is not yet visible (first spell learned), mana bar appears in HUD
- Lessons also advance school mastery XP (+25 XP per lesson in that school, see US-MS-56)

### US-AA-23: Academy Counter-Spell Training
**As a** student in Lesson 4 (Elemental Combat), **I learn** the counter-spell mechanic through a practical demonstration, **so that** I understand defensive magic.

**Acceptance Criteria:**
- Lesson 4 includes a scripted counter-spell exercise (Professor Ignis casts a slow Firebolt, player must cast Frost Lance to counter)
- Counter-spell mechanics are defined in US-MS-31
- Success: "Excellent! You countered my spell. The opposing element cancels the attack."
- Failure: "You'll want to practice that. When someone throws fire, answer with ice."
- This is a tutorial for the counter-spell system, not a new mechanic

### US-AA-24: Academy Spell Restrictions
**As a** student, **I cannot** use combat magic against fellow students or faculty, **so that** the school has rules.

**Acceptance Criteria:**
- Casting offensive spells (damage or negative status) on NPCs flagged as `academyStaff` or `academyStudent` is blocked
- Message: "You can't cast offensive magic on Academy members outside the Practice Arena!"
- Practice Arena tiles are exempt (sparring is allowed)
- Using social magic (Fear, Binding Circle) on Academy NPCs triggers disciplinary action: -10 house points, stern warning from faculty

### US-AA-25: Practice Dungeon Spell Training
**As a** student, **I can** practice spells safely in the Practice Dungeon, **so that** I learn spell mechanics in a low-risk environment.

**Acceptance Criteria:**
- Practice Dungeon enemies are low-HP (easy to defeat with spells)
- Death in Practice Dungeon = respawn at entrance with 1 HP (no real death)
- Spell casting in Practice Dungeon grants normal school mastery XP
- Reagents can be found in Practice Dungeon at a slightly higher rate than normal dungeons (US-MS-38)

### US-AA-26: Magic Not Taught (Library References)
**As a** student exploring the library, **I find** books that reference magic schools not taught at the Academy, **so that** the wider magic world is hinted at.

**Acceptance Criteria:**
- Library contains books mentioning:
  - Restoration magic: "Thaumaturgy: Healing Through Faith" — describes temple healing tradition, mentions Heal and Cure spells. Player cannot learn from this book.
  - Conjuration: "On the Dangers of Summoning" — describes summoning theory, warns against unsupervised practice. Flavor only.
  - Shadow magic: "The Shadow Arts: A Critical Analysis" — in restricted section. Describes Shadow school academically. Mentions Shadow Bolt and Life Drain by name.
  - Forbidden magic: "Prohibited Magical Practices (Advisory)" — lists blood magic, necromancy, void magic, chronomancy, soul magic. Brief descriptions, no teaching.
- These books provide context for magic the player may encounter OUTSIDE the Academy
- None of these books teach spells (that happens through the sources defined in US-MS-55)
- Elara has read the Shadow Arts book and references it in dialogue at high friendship

---

## Removed Stories

The following stories from the original version of this document have been **moved to Epic 79** where they belong:

| Old ID | New Location | Topic |
|--------|-------------|-------|
| US-AA-21 (old) | US-MS-03, US-MS-04, US-MS-05 | Mana pool, regen, overload |
| US-AA-25 (old) | US-MS-23, US-MS-24, US-MS-25 | Spell casting UI, targeting |
| US-AA-26 (old) | US-MS-26, US-MS-27 | Spell effects, damage calc |
| US-AA-27 (old) | US-MS-28 | Spell cooldowns |
| US-AA-28 (old) | US-MS-31 | Counter-spell mechanic |
| US-AA-29 (old) | US-MS-34 | Alchemy station |
| US-AA-30 (old) | US-MS-35 | Recipe learning |
| US-AA-31 (old) | US-MS-38 | Reagent gathering |
| US-AA-32 (old) | US-MS-37 | Potion effects |

The Academy stories US-AA-21 through US-AA-26 are now **renumbered** as shown above — the Academy-specific subset that references Epic 79's base mechanics.
