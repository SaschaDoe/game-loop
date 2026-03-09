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
**As a** student, **I learn** the Antidote recipe, the Mana Potion recipe, and the Acid Splash spell, **so that** I can brew curative potions and use transmutation in combat.

**Acceptance Criteria:**
- Day 16 (unlocks ~4 days after Lesson 4)
- Thornwick teaches two recipes:
  - Universal Antidote: Mandrake Root + Starfern (cures poison)
  - Mana Potion: Arcane Dust + Moonwater Vial (restores mana)
- Thornwick also introduces combat transmutation: "Alchemy isn't just potions. Watch."
  - Player learns `spell_acid_splash` (3 damage + -1 ATK 3 turns, Alchemy school Tier 1)
  - "Conjured acid from raw reagent energy. The School of Alchemy has teeth."
- **Practical component:** Brew one of the two potions (player chooses which), then cast Acid Splash at a practice dummy
- Ingredients provided for the tutorial brew
- Thornwick discusses the Philosopher's Draught as the pinnacle: "Five ingredients, added in order. Mandrake Root LAST or the solution crystallizes."
- Elara asks about combining alchemy with enchantment. Thornwick gets uncomfortable.
- **Exam relevant:** Ingredient knowledge tested

## US-AA-14: Lesson 6 — Divination Introduction (Librarian Maren)
**As a** student, **I learn** True Sight and Reveal Secrets from the Librarian, **so that** I can see through darkness, illusion, and hidden dangers.

**Acceptance Criteria:**
- Day 19 (unlocks ~3 days after Lesson 5)
- Maren teaches in the library, not a classroom. "Divination isn't about power. It's about seeing what's already there."
- **Practical component:** Cast True Sight, then search a prepared area of the library for hidden messages
- Player learns `spell_true_sight` (+3 sight radius for 10 turns, reveals hidden)
- Maren then teaches detection: "Sight shows you what IS. But some things hide. You have to reach out and feel for them."
- Player learns `spell_reveal_secrets` (detect traps + secrets in 5-tile radius, Divination Tier 1)
- **Practical component 2:** Cast Reveal Secrets in a corridor near the library — detects a hidden bookshelf passage (lore flavor, leads to a small alcove with a minor item)
- Maren hints at the restricted section: "Some books don't want to be found. True Sight helps. Reveal Secrets helps more."
- Elara is suspiciously excited about this lesson
- Fenn whispers: "Maren taught herself divination. Self-taught. Think about what that means."

## US-AA-15: Lesson 7 — Advanced Combat and Dispelling (Professors Ignis & Ashveil)
**As a** student, **I learn** the Dispel spell, the Lightning Arc spell, and the Exam Golem's attack pattern, **so that** I have Tier 2 combat options and can survive the final exam.

**Acceptance Criteria:**
- Day 23 (unlocks ~4 days after Lesson 6)
- **Part 1 — Ashveil teaches Dispel (Enchantment Tier 2):**
  - "Wards protect. But sometimes the enemy has wards too. Dispel strips them away."
  - Player learns `spell_dispel` (remove all status effects from 1 target, 4 mana, 3 cd)
  - "Dispel also works as a counter-spell against ANY school — not just opposing elements. Remember that."
  - **Practical:** Ashveil casts a shield on a training dummy. Player must Dispel it, then destroy the dummy.
- **Part 2 — Ignis teaches Lightning Arc (Elements Tier 2):**
  - "Fire and ice are opposites. Lightning is something else — it hits EVERYTHING nearby."
  - Player learns `spell_lightning_arc` (3 damage to up to 3 adjacent enemies, 6 mana, 4 cd)
  - **Practical:** Three training dummies placed adjacent. Player casts Lightning Arc to hit all three.
  - Rod: "Wait, it just jumps between them?! That's AMAZING." (tries it, hits himself somehow)
- **Part 3 — Ignis teaches the Exam Golem pattern:**
  - 3-turn cycle: Charge (1-2 dmg), Charge (1-2 dmg), BLAST (8-12 dmg)
  - "The blast has melee range only. On every third turn, RETREAT one tile. Or cast a ranged spell from safety."
  - **Practical:** Face a weakened training golem (10 HP, same pattern, reduced damage). Practice the retreat timing.
  - Training golem despawns after 9 turns (3 cycles) regardless of HP
- **Exam relevant:** The golem pattern IS the combat exam. Dispel and Lightning Arc give real tactical options for it.

## US-AA-16: Lesson 8 — Advanced Techniques and Specialization (All Faculty)
**As a** student, **I learn** one advanced spell from my house's school (Tier 2) and choose a specialization, **so that** I leave the Academy with real capability.

**Acceptance Criteria:**
- Day 26 (unlocks ~3 days after Lesson 7)
- All four professors present in the Great Hall for the final combined lesson
- **House-specific advanced spell (Tier 2):** Each professor teaches one advanced spell to students of their house:
  - **Pyraclaw (Ignis):** `spell_glacial_wall` — Glacial Wall (3-tile ice barrier 5 turns, 5 mana, 6 cd). "Fire teaches you to destroy. But a true elementalist also controls the battlefield."
  - **Verdantia (Thornwick):** `spell_transmute_weapon` — Transmute Weapon (+2 ATK 5 turns, 5 mana, 6 cd). "You can change the nature of things. Start with your blade."
  - **Ironveil (Ashveil):** `spell_reflective_shield` — Reflective Shield (reflect 50% melee damage 4 turns, 7 mana, 6 cd). "The best ward doesn't just protect. It punishes."
  - **Glimmershade (Maren):** `spell_foresight` — Foresight (+20% dodge 5 turns, 6 mana, 6 cd). "See what's coming. Then don't be there."
- Players from ALL houses also hear a brief description of the other three spells (knowledge, not learning)
- **Specialization choice** (stored, affects gameplay):
  - Elements: +1 spell damage permanently
  - Alchemy: Potions brewed are +25% effective
  - Enchantment: Ward/shield durations +2 turns
  - Divination: +1 permanent sight radius
- Choice is stored but doesn't lock out any spells
- Review covers: Health Potion recipe, elemental weaknesses, golem pattern, counter-spell reminder
- "The exam begins in a few days. Study. Practice. Help each other."
- Dorian: "Finally, something worth learning." Elara: *quietly studies all four spell descriptions*

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
