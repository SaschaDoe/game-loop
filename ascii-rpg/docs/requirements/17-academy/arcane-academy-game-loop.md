# Arcane Academy Game Loop (v1 — Superseded)

> **NOTE:** This epic has been superseded by **Epic 78: Arcane Academy** in `docs/requirements/78-arcane-academy/`. The stories below represent the initial implementation (US-AA-01 through US-AA-11). The new epic expands to 88 user stories covering real spell/alchemy integration, 4 classmate NPCs, 18+ quests, campus exploration, and discoverable school history.

## Overview
The Arcane Academy provides a magical education path. Non-mage players enroll in a school year, attend lessons, learn alchemy and combat knowledge, then pass a final exam to graduate with the "Mage" title. Mage-class players are recognized as graduates and can teach instead.

## User Stories

### US-AA-01: Academy Enrollment
**As a** non-mage player at the academy, **I can** enroll in a school year through dialogue with the Archmagus, **so that** I begin the magical education path.

**Acceptance Criteria:**
- Talking to the Archmagus presents an "Enroll" option for non-mages
- Enrollment sets up academy state tracking (current day, lessons completed, etc.)
- HUD shows "Academy Day X/30" while enrolled

### US-AA-02: Calendar System
**As a** player, **I can** see the current day of my school year in the HUD, **so that** I know when lessons and exams are available.

**Acceptance Criteria:**
- 100 turns = 1 day (matches existing day-night cycle)
- School year lasts 30 days (3000 turns)
- HUD displays current academy day when enrolled

### US-AA-03: Attend Lessons
**As an** enrolled student, **I can** attend scheduled lessons by talking to professors on lesson days, **so that** I learn alchemy recipes and monster weaknesses needed for the exam.

**Acceptance Criteria:**
- 6 lessons scheduled across the 30-day school year
- Each lesson teaches a specific fact (alchemy ingredient, monster weakness)
- Lessons are presented as dialogue branches with the professor NPCs
- Completed lessons are tracked in academy state

### US-AA-04: Knowledge Retention (Player Skill)
**As a** student, the game teaches me specific facts during lessons that I must memorize as a real player, **so that** the exam tests my actual knowledge rather than stored game state.

**Acceptance Criteria:**
- Lesson content is displayed in dialogue only — no journal/notes feature for exam answers
- The human player must remember the answers, not the game character
- Revisiting the professor on lesson day allows re-reading the lesson

### US-AA-05: Final Exam Part 1 — Alchemy Question
**As a** student near the end of the school year (day 28+), **I can** take an alchemy knowledge test, **so that** my attention during lessons is tested.

**Acceptance Criteria:**
- Dialogue-based multiple choice question
- Correct answer was explicitly taught in a lesson
- Wrong answer fails Part 1 (can retry next day)
- Correct answer advances to Part 2

### US-AA-06: Final Exam Part 2 — Combat Trial
**As a** student who passes the alchemy test, **I face** a combat trial against a magical monster whose weakness was taught during lessons, **so that** I apply learned strategies.

**Acceptance Criteria:**
- Exam Golem spawns in a special arena
- Monster has a deterministic 3-turn attack cycle (taught in lessons)
- Player who learned the pattern can survive; unprepared players likely die
- Defeating the monster completes the exam

### US-AA-07: Graduation Ceremony
**As a** student who passes both exam parts, **I receive** the "Mage" title in a ceremony, **so that** my achievement is recognized.

**Acceptance Criteria:**
- Graduation dialogue with the Archmagus plays automatically after exam victory
- Player receives the "Mage" title (stored in playerTitles)
- XP reward granted
- Teaching path unlocked

### US-AA-08: Mage Graduate Recognition
**As a** mage who starts at the academy, **I am** recognized as a graduate by the Archmagus, given the "Archmage Apprentice" title, and offered the teaching path.

**Acceptance Criteria:**
- Mage class + academy start = auto-graduated, titled "Archmage Apprentice"
- Archmagus dialogue acknowledges the mage's prior study
- Teaching option available immediately
- Enrollment option is NOT shown

### US-AA-09: Teaching Game Loop
**As a** graduate, **I can** teach lessons at the academy for rewards by answering student questions correctly.

**Acceptance Criteria:**
- Dialogue-based: student asks a question, player picks the correct answer
- Questions draw from the same lesson content
- 200-turn cooldown between teaching sessions
- Available to mages (auto-graduated) and exam-passers

### US-AA-10: Teaching Rewards
**As a** teacher, **I earn** XP and items per session, with milestone rewards, **so that** teaching has meaningful progression.

**Acceptance Criteria:**
- Each correct teaching session: +50 XP, +1 healing potion
- After 5 sessions: "Master Teacher" title
- After 10 sessions: permanent +1 ATK (one-time)
- Wrong answers: no reward, still consume cooldown

### US-AA-11: Player Titles
**As a** player, **I can** earn and display titles, **so that** my achievements are visible.

**Acceptance Criteria:**
- Titles: "Archmage Apprentice", "Mage", "Master Teacher"
- Shown in character status panel
- Stored in save data
- Dialogue conditions can check for titles
