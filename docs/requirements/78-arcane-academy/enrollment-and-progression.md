# Enrollment and Progression

## US-AA-01: Academy Enrollment (Non-Mage)
**As a** non-mage player who chose the Academy start, **I am** automatically enrolled as a student, **so that** the school year begins immediately without a redundant enrollment dialogue.

**Acceptance Criteria:**
- Non-mages starting at the Academy are pre-enrolled (already implemented in `createGame()`)
- Archmagus Veylen's first dialogue recognizes enrollment: "Welcome, new student! I see you've already signed the rolls."
- A `conditionalStartNode` for `academyEnrolled` routes to the enrolled greeting, not the stranger greeting
- Enrollment sets `academyState.enrolled = true, enrolledAtTurn = 0`
- HUD shows "Academy — Day X" while enrolled
- **Bug fix:** Remove the duplicate "I wish to enroll" option for already-enrolled players

## US-AA-02: Academy Enrollment (Walk-In)
**As a** player who did NOT start at the Academy but visits it later, **I can** enroll through dialogue with Archmagus Veylen, **so that** any player can access the Academy content.

**Acceptance Criteria:**
- Veylen's default start node (for non-enrolled, non-mage visitors) offers enrollment
- Enrollment creates fresh `academyState` and adds first-day quest
- Walk-in students get a brief campus tour prompt
- Class-aware dialogue: "A warrior seeking magical education? Unusual — and welcome."

## US-AA-03: Mage Recognition
**As a** mage who starts at the Academy, **I am** recognized as a graduate, given "Archmage Apprentice" title, and offered teaching and mentorship paths.

**Acceptance Criteria:**
- Mage + Academy start = auto-graduated, titled "Archmage Apprentice" (already implemented)
- Mage-specific dialogue from Veylen acknowledges prior study
- Teaching and advanced quest lines available immediately
- Mage can still attend lessons as a "guest lecturer" (flavor dialogue, no mechanical change)

## US-AA-04: Academy Calendar
**As a** student, **I can** see the current academy day and upcoming events in the HUD, **so that** I know when lessons and deadlines are approaching.

**Acceptance Criteria:**
- 100 turns = 1 day (already defined)
- School year is ~30 days (flexible — extends if player is late to lessons)
- HUD shows: "Academy Day X | Next: [Lesson Name] in Y days"
- Notification message when a lesson becomes available
- Notification when free periods begin (exploration/quest time)

## US-AA-05: Class Schedule
**As a** student, **I attend** 8 lessons across 4 schools of magic, spread across the school year, **so that** I learn a variety of real magical skills.

**Acceptance Criteria:**
- 8 lessons total (2 per school): Elements, Alchemy, Enchantment, Divination
- Each lesson unlocks 3-4 days after the previous one
- Lessons are sequential (must complete lesson N before N+1 unlocks)
- Between lessons: free periods for quests, exploration, practice dungeon, socializing
- See `curriculum-and-lessons.md` for individual lesson details

## US-AA-06: Class-Aware Experience
**As a** non-mage student (Warrior/Rogue/etc.), **I experience** class-specific dialogue and reactions throughout the Academy, **so that** my background is acknowledged.

**Acceptance Criteria:**
- Professors comment on non-mage students: "Unusual for a warrior to study the arcane. But fire doesn't care about your resume."
- Fellow students react: Rod is impressed ("You're braver than me — I was forced to come"), Dorian is dismissive ("A warrior playing at magic")
- Some lessons have class-specific tips: "Warriors — your weapon can channel elemental energy. A fire-enchanted sword hits harder than a pure firebolt."
- Exam difficulty doesn't change, but dialogue acknowledges the challenge

## US-AA-07: Graduation Title
**As a** non-mage graduate, **I earn** a class-appropriate title instead of the generic "Mage" title, **so that** my achievement fits my character identity.

**Acceptance Criteria:**
- Warriors: "Battlemage" title
- Rogues: "Spellthief" title
- Mages: "Archmage Apprentice" (auto-graduated) or "Arcane Scholar" (if they somehow enrolled)
- Rangers: "Arcane Warden"
- Clerics: "Theurgist"
- Other classes: "Academy Graduate"
- Title is stored in `playerTitles` and displayed in character panel

## US-AA-08: Post-Graduation Content
**As a** graduate, **I can** return to the Academy for teaching, advanced quests, and library access, **so that** graduation isn't the end of the Academy's value.

**Acceptance Criteria:**
- Teaching system (see `final-exam-and-graduation.md`)
- Restricted section access unlocked after graduation
- Post-graduation quest: "The East Wing" (see `quests.md`)
- Faculty treat graduate as a peer: "Welcome back, colleague"
- Can purchase reagents from Thornwick's stores at a discount
