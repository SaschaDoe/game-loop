# Curriculum and Lessons

Each lesson teaches a **real game mechanic** — a spell, a recipe, a combat technique. No more decorative trivia. Every lesson has a practical component where the player does the thing, not just hears about it.

---

## US-AA-09: Lesson 1 — Elements 101 (Professor Ignis)
**As a** student, **I attend** my first Elements class and learn the Firebolt spell, **so that** I gain my first real combat spell.

**Acceptance Criteria:**
- Day 1 (available immediately upon enrollment)
- Professor Ignis teaches the theory of elemental magic — fire responds to willpower
- **Practical component:** Cast Firebolt at a target dummy in the practice arena
- Player learns `spell_firebolt` (added to `learnedSpells` array)
- Class-aware: "Warriors — channel the fire through your weapon. It'll hit harder."
- Rod accidentally sets his own robes on fire (comedy moment)
- Dorian demonstrates first, perfectly, and smirks

## US-AA-10: Lesson 2 — Alchemy Basics (Professor Thornwick)
**As a** student, **I attend** my first Alchemy class and learn the Health Potion recipe, **so that** I can brew healing potions from reagents.

**Acceptance Criteria:**
- Day 4 (unlocks ~3-4 days after Lesson 1)
- Professor Thornwick teaches the Health Potion recipe: Starfern + Moonwater Vial
- **Practical component:** Player brews a Health Potion at the alchemy station
- Thornwick provides the ingredients for the first brew (tutorial)
- Recipe `recipe_health_potion` added to `knownRecipes`
- Rod's cauldron explodes. Thornwick sighs.
- Elara finishes early and quietly corrects another student's technique
- **Exam relevant:** This recipe WILL be on the final exam

## US-AA-11: Lesson 3 — Enchantment Fundamentals (Professor Ashveil)
**As a** student, **I learn** the Arcane Ward spell and the basics of protective magic, **so that** I can defend myself with magical barriers.

**Acceptance Criteria:**
- Day 8 (unlocks ~4 days after Lesson 2)
- Professor Ashveil teaches ward theory — Order stream, precision, intention
- **Practical component:** Cast Arcane Ward on yourself. Stand in the practice arena while a training bolt fires at you.
- Player learns `spell_arcane_ward` (+3 HP shield for 5 turns)
- Ashveil is demanding: "Again. The pattern was sloppy. Again."
- Dorian's ward is flawless. He makes sure everyone knows.
- Fenn mutters: "She made me do it fourteen times. Fourteen."

## US-AA-12: Lesson 4 — Elemental Combat (Professor Ignis)
**As a** student, **I learn** about elemental weaknesses and counter-spells, **so that** I can exploit enemy vulnerabilities in combat.

**Acceptance Criteria:**
- Day 12 (unlocks ~4 days after Lesson 3)
- Professor Ignis teaches the counter-element system:
  - Fire counters Ice/Frost creatures
  - Ice/Frost counters Fire creatures
  - Lightning is effective against armored/metallic enemies
  - Arcane constructs (golems) are NOT elemental — pattern matters, not element
- **Practical component:** Fight an elemental training dummy. Use the right spell type for bonus damage.
- Player learns `spell_frost_lance` (3 dmg + freeze)
- Ignis warns about the Exam Golem: "It's arcane, not elemental. Don't waste fire on it. Study its PATTERN."
- Teaches the concept of **counter-spells**: casting the opposing element while an enemy is casting negates their spell

## US-AA-13: Lesson 5 — Advanced Alchemy (Professor Thornwick)
**As a** student, **I learn** the Antidote recipe and the Mana Potion recipe, **so that** I can brew curative and restorative potions.

**Acceptance Criteria:**
- Day 16 (unlocks ~4 days after Lesson 4)
- Thornwick teaches two recipes:
  - Universal Antidote: Mandrake Root + Starfern (cures poison)
  - Mana Potion: Arcane Dust + Moonwater Vial (restores mana)
- **Practical component:** Brew one of the two potions (player chooses which)
- Ingredients provided for the tutorial brew
- Thornwick discusses the Philosopher's Draught as the pinnacle: "Five ingredients, added in order. Mandrake Root LAST or the solution crystallizes."
- Elara asks about combining alchemy with enchantment. Thornwick gets uncomfortable.
- **Exam relevant:** Ingredient knowledge tested

## US-AA-14: Lesson 6 — Divination Introduction (Librarian Maren)
**As a** student, **I learn** the True Sight spell from the Librarian, **so that** I can see through darkness and illusion.

**Acceptance Criteria:**
- Day 19 (unlocks ~3 days after Lesson 5)
- Maren teaches in the library, not a classroom. "Divination isn't about power. It's about seeing what's already there."
- **Practical component:** Cast True Sight, then search a prepared area of the library for hidden messages
- Player learns `spell_true_sight` (+3 sight radius for 10 turns, reveals hidden)
- Maren hints at the restricted section: "Some books don't want to be found. True Sight helps."
- Elara is suspiciously excited about this lesson
- Fenn whispers: "Maren taught herself divination. Self-taught. Think about what that means."

## US-AA-15: Lesson 7 — Golem Patterns and Construct Combat (Professor Ignis)
**As a** student, **I learn** the Exam Golem's 3-turn attack cycle, **so that** I can survive the combat portion of the final exam.

**Acceptance Criteria:**
- Day 23 (unlocks ~4 days after Lesson 6)
- Professor Ignis teaches the 3-turn cycle: Charge (1-2 dmg), Charge (1-2 dmg), BLAST (8-12 dmg)
- "The blast has melee range only. On every third turn, RETREAT one tile."
- **Practical component:** Face a weakened training golem (10 HP, same pattern, reduced damage). Practice the retreat timing.
- Training golem despawns after 9 turns (3 cycles) regardless of HP
- The lesson teaches through gameplay, not just dialogue
- **Exam relevant:** This IS the combat exam pattern

## US-AA-16: Lesson 8 — Final Review and Specialization (All Faculty)
**As a** student, **I attend** the final review session and optionally choose a school to specialize in, **so that** I'm prepared for the exam and have a sense of identity.

**Acceptance Criteria:**
- Day 26 (unlocks ~3 days after Lesson 7)
- All four professors present in the Great Hall
- Review covers: Health Potion recipe, elemental weaknesses, golem pattern, ward casting
- **Specialization choice** (optional, flavor + small bonus):
  - Elements: +1 spell damage
  - Alchemy: Potions heal +2 more
  - Enchantment: Wards last 2 more turns
  - Divination: +1 permanent sight radius
- Choice is stored but doesn't lock out any spells
- "The exam begins in a few days. Study. Practice. Help each other."

---

## US-AA-17: Lesson Practical Components
**As a** student, **I perform** a practical exercise during each lesson, **so that** learning is active rather than passive.

**Acceptance Criteria:**
- Each lesson includes a "do the thing" step (cast a spell, brew a potion, fight a dummy)
- Practicals use the existing game mechanics (spell casting, alchemy system)
- Failure in a practical doesn't fail the lesson — professor encourages retry
- Success grants a small XP bonus (+10-25 XP per lesson)

## US-AA-18: Lesson Notes in Journal
**As a** student, **I can** review key lesson facts in my journal, **so that** I don't have to memorize everything from one dialogue.

**Acceptance Criteria:**
- After each lesson, a note is added to the journal under "Academy Notes"
- Notes contain the key fact (recipe, weakness, pattern) but NOT the exam answers directly
- Example: "Health Potion: Two common reagents. Professor said the exam would test this."
- The notes are memory aids, not cheat sheets — the player still needs to pay attention

## US-AA-19: Between-Lesson Activities
**As a** student during free periods, **I have** meaningful things to do between lessons, **so that** the waiting time isn't empty.

**Acceptance Criteria:**
- Practice dungeon available (real combat, loot, XP)
- Classmate dialogue changes each day (new conversations, reactions to recent lessons)
- Notice board updates with new postings
- Side quests available (see `quests.md`)
- Library exploration (find books, lore)
- Alchemy station open for free brewing (if you have ingredients)
- Spell practice on training dummies (test spells, no risk)

## US-AA-20: Lesson Attendance Tracking
**As a** student, **I can** see which lessons I've completed and which are upcoming, **so that** I know my academic progress.

**Acceptance Criteria:**
- Character panel or journal shows: "Lessons: 4/8 completed"
- Each completed lesson shows a checkmark and title
- Next lesson shows name and availability date
- Exam eligibility shown: "Final exam available after all 8 lessons"
