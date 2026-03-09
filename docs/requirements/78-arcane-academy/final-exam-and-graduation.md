# Final Exam and Graduation

The exam is the climax of the school year. It tests everything the player learned — spells, alchemy, combat patterns. Graduation opens post-game Academy content.

---

## The Final Exam

### US-AA-73: Exam Eligibility
**As a** student who completed all 8 lessons, **I can** take the final exam, **so that** my education culminates in a meaningful test.

**Acceptance Criteria:**
- Requires all 8 lessons completed (`nextLessonIndex >= LESSONS.length`)
- Available by talking to Archmagus Veylen after all lessons
- Exam is optional — the player can continue without graduating (but misses benefits)
- Exam can be retaken if failed (see below)
- Day ~28-30 typical, but no hard deadline

### US-AA-74: Exam Part 1 — Written Test (Expanded)
**As a** student, **I answer** multiple-choice knowledge questions covering all four schools, **so that** my attention during lessons is tested.

**Acceptance Criteria:**
- 3 questions (one must be the Health Potion recipe — the Academy's signature question):
  1. **Alchemy:** "What are the two ingredients for a Health Potion?" (Starfern + Moonwater Vial)
  2. **Elements:** "What is the Exam Golem's attack cycle?" (Charge, Charge, Blast)
  3. **Enchantment or Divination:** Random from pool:
     - "What causes a ward to fail?" (Disturbing the anchor point)
     - "What element counters frost creatures?" (Fire)
     - "How many concentric circles does the Shieldwall Glyph require?" (Three)
- Must answer at least 2 of 3 correctly to pass Part 1
- Wrong answers: specific feedback ("That's incorrect. The answer was taught in Lesson X.")
- Failing Part 1: "You may try again. Speak to me when you're ready." (No time gate — immediate retry)
  - **Fix bug:** Remove the misleading "try again tomorrow" text
  - **Fix bug:** The `examTaken` flag should NOT be set until Part 2 begins

### US-AA-75: Exam Part 2 — Combat Trial (Improved)
**As a** student who passes Part 1, **I fight** the Exam Golem using patterns learned in class, **so that** the exam tests applied knowledge.

**Acceptance Criteria:**
- Exam Golem spawns in the Practice Arena (NOT on the `>` stairs tile — spawn at arena center)
  - **Fix bug:** Move spawn from (40,17) to arena center tile
- Golem stats: 25 HP, 2 ATK, same 3-turn cycle (Charge, Charge, BLAST)
  - Slightly buffed from current 20 HP to make it a real challenge
- The player should use spells learned during the school year:
  - Firebolt for damage (4 per cast, 3 casts needed minimum)
  - Arcane Ward for blast protection (can absorb one blast if timed right)
  - Frost Lance to freeze on a charge turn (buys an extra turn)
- The retreat-on-blast-turn strategy still works for melee-only players
- Defeating the golem passes the exam. `passExam(state)` called.
- **Exam failure (death):**
  - In the Academy practice arena, death is NOT permanent (same as practice dungeon)
  - Player wakes in the dormitory with 1 HP
  - `examTaken` set to true, `examPassed` stays false
  - **Fix bug:** Player CAN retake the exam. `examTaken` should not lock out retries.
  - Veylen: "The golem bested you. Rest, and try again when you're ready."
  - Retake starts from Part 2 directly (Part 1 already passed)

### US-AA-76: Exam Reactions
**As a** student, **classmates react** to my exam results, **so that** the exam feels socially significant.

**Acceptance Criteria:**
- **Rod:** (didn't pass) "I always knew you'd make it. I'm... I'm proud of you." (genuine, not jealous)
- **Elara:** "Congratulations. You earned it." (if friendship high) / [nods silently] (if friendship low)
- **Fenn:** "Well, well. The [warrior/rogue] graduated mage school. I'll be telling this story for years."
- **Dorian:** "You passed. Good. It would have been embarrassing to lose to someone who failed." (if he respects you) / "Don't think this changes anything." (if rivalry is hostile)
- Professors each say a line: Ignis is proud, Thornwick is relieved (you didn't explode anything), Ashveil gives a curt nod of approval

---

## Graduation

### US-AA-77: Graduation Ceremony
**As a** student who passed the exam, **I attend** a graduation ceremony with Archmagus Veylen, **so that** my achievement is celebrated.

**Acceptance Criteria:**
- Triggered by talking to Veylen after passing the exam
- Veylen delivers a short speech (class-aware):
  - Warrior: "You came here a warrior. You leave a battlemage. The blade and the spell are not enemies — they are partners."
  - Rogue: "You came here a shadow. You leave a spellthief. Your enemies will never see you — or your magic — coming."
  - Mage: "You came here talented. You leave educated. Talent without discipline is a wildfire. Now you are a forge."
  - Generic: "You came here seeking knowledge. You found it. Use it wisely."
- Player receives class-appropriate title (see US-AA-07)
- Player receives graduation gift: Apprentice Robes (body armor, +2 HP, +1 sight)
- +100 XP graduation bonus
- Teaching path unlocked
- Restricted section access granted
- Journal entry: "Graduated from the Arcane Academy"

### US-AA-78: Teaching System (Improved)
**As a** graduate, **I teach** lessons at the Academy using dynamically cycling questions, **so that** teaching is varied and rewarding.

**Acceptance Criteria:**
- Teaching available via Archmagus Veylen dialogue
- **Fix bug:** Questions cycle through all 8 `TEACHING_QUESTIONS` (not hardcoded to one)
- The dialogue tree dynamically generates the teaching question from `getNextTeachingQuestion()`
- 200-turn cooldown between sessions
- Rewards per correct session:
  - +50 XP
  - 1 random reagent (new reward, replaces unused healing potion reward)
- Milestone rewards:
  - 5 sessions: "Master Teacher" title
  - 10 sessions: +1 permanent ATK
  - 15 sessions: "Grand Professor" title (new)
  - 20 sessions: +1 permanent max mana (new)

### US-AA-79: Post-Graduation Campus
**As a** graduate, **the Academy campus** reflects my new status, **so that** returning feels different from being a student.

**Acceptance Criteria:**
- NPCs address you differently: "Professor [Name]!" (Rod), "Colleague." (Ashveil)
- Restricted section accessible
- Thornwick offers reagent discounts
- Alchemy station available anytime
- Practice dungeon has a graduate-difficulty floor (harder enemies, better loot)
- The Sealed East Wing quest becomes available (US-AA-62)

### US-AA-80: Academy as Overworld Location
**As a** graduate exploring the overworld, **I can** return to the Academy as a fast-travel point and resource hub, **so that** the Academy remains useful long-term.

**Acceptance Criteria:**
- Academy appears on the overworld map in the Conservatory region
- Re-entering the Academy loads the campus map
- All post-graduation features accessible on return
- Teaching cooldown continues ticking while away
- NPCs have "post-story" dialogue (what happened after graduation — Rod went home, Elara continued research, Fenn writes a book, Dorian joined the Conservatory)
