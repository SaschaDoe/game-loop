# Campus and Exploration

The Academy campus is a living, explorable space — not just a room with NPCs. Every building has interactable elements, secrets to find, and reasons to revisit.

---

## Campus Layout

### US-AA-63: Expanded Campus Map
**As a** student, **I explore** a campus with distinct, meaningful buildings, **so that** the Academy feels like a real place.

**Acceptance Criteria:**
- Expanded map (60×30 or larger) with clear building boundaries:
  - **Great Hall** (north center): Lessons 1, 4, 7, 8 held here. Headmaster's office above (locked). Assembly area.
  - **Library Wing** (west): 3 "floors" (sections). Main stacks, rare books, restricted section (locked). Maren's desk near entrance. Reading tables. Hidden alcove behind a bookshelf.
  - **Alchemy Tower** (east): Ground floor: brewing stations (3 alchemy tables). Upper floor: Thornwick's office + greenhouse (rooftop, accessible by stairs). Ingredient stores (some locked).
  - **Enchantment Lab** (southeast): Ward-testing circles on the floor (visible as floor patterns). Practice targets. Professor Ashveil's desk. Small room with the East Wing access door (sealed, glowing).
  - **Student Dormitory** (southwest): Beds (interactable — rest to restore HP/mana). Common room with fireplace. Notice board. Personal storage chest. Rod's bed is identifiable (messy). Elara's is in the corner (books piled high). Dorian's is conspicuously tidy.
  - **Practice Arena** (south center): Open floor for duels. Training dummies (interactable — test spells). Practice dungeon entrance (`>`). Exam chamber (marked area for final exam golem fight).
  - **Courtyard** (center): Fountain (the water shimmers — Ley Line convergence). Benches. Fenn's usual spot. Paths connecting all buildings.
  - **Sealed East Wing** (northeast): Visible wall/door with magical shimmer. Cannot be entered until post-graduation quest. Examining it: "The door hums with ancient wards. Something behind it is... waiting."

### US-AA-64: Interactable Objects
**As a** student, **I interact** with objects on campus that provide information, items, or atmosphere, **so that** exploration is rewarded.

**Acceptance Criteria:**
- **Notice board:** Read new postings (updated every few days). Quest hooks.
- **Beds:** Rest to restore HP and mana (uses turns).
- **Alchemy stations:** Open brewing menu (see magic-system-integration.md).
- **Training dummies:** Test spells without risk. Shows damage numbers.
- **Bookshelves:** Some contain readable books (lore entries).
- **Fountain:** "The water sparkles with an inner light. You feel your mana stir." (+1 mana on first interaction per day).
- **Thornwick's greenhouse:** Examine plants. Some are labeled ("WARNING: BITES"). 2-3 free reagents per visit.
- **Sealed door:** Examine reveals ward description. True Sight reveals faint inscriptions.
- **Portraits:** Hallway paintings of past headmasters with plaques giving names and dates.
- **Personal chests:** Store items. Only the player's chest is usable.

### US-AA-65: NPC Positions and Routines
**As a** student, **NPCs** are in different locations depending on the time of day and school schedule, **so that** the campus feels dynamic.

**Acceptance Criteria:**
- **Morning (turns 0-30 of day):** Faculty in offices/classrooms. Students in dormitory or courtyard.
- **Class time (turns 30-60):** Everyone in the Great Hall (lesson days) or scattered (free days).
- **Afternoon (turns 60-80):** Faculty in labs/offices. Rod in arena (practicing badly). Elara in library. Fenn in courtyard. Dorian in arena (practicing well).
- **Evening (turns 80-100):** Everyone in dormitory. Rod by the fireplace. Elara reading. Dorian absent (secretly practicing in the arena). Fenn writing notes.
- NPC positions are determined by `turnCount % TURNS_PER_DAY` ranges
- This is approximate — not all positions need to change, but at least 2-3 NPCs should move between day phases

---

## The Library

### US-AA-66: Library Books
**As a** student, **I find and read** books in the library that contain lore, recipes, and spell knowledge, **so that** the library is mechanically rewarding to explore.

**Acceptance Criteria:**
- 8-12 readable books on library shelves:
  1. "A Brief History of the Arcane Academy" — founding story, Celestine Voss
  2. "Elemental Theory for Beginners" — reviews fire/ice/lightning weaknesses
  3. "The Alchemy Compendium" — hints at recipes not yet learned
  4. "Ward Construction: A Practical Guide" — enchantment lore
  5. "Famous Graduates of the Academy" — list of notable alumni (some names connect to other game content)
  6. "The Incident of Year 647" — sanitized official account of the East Wing explosion
  7. "Ley Lines and Their Properties" — magic system lore from docs/lore/05
  8. "A Student's Journal" (hidden in the alcove) — unsanitized account of the Incident
- Books use the existing `activeBookReading` system (page flip with A/D)
- Some books contain recipes: reading "The Alchemy Compendium" teaches `recipe_strength_elixir`

### US-AA-67: The Restricted Section
**As a** graduate or permitted student, **I access** the restricted section for advanced books, **so that** deeper lore and spells are available.

**Acceptance Criteria:**
- Locked door in the library. Maren has the key.
- Access granted via: graduation, quest reward (US-AA-55), or lock-picking (risk)
- Contains 4-5 restricted books:
  1. "Celestine's Journal" — the TRUE founding story (the dream, the compact, the ward)
  2. "Aldric's Research Notes" — cross-school magic equations
  3. "The Seven Streams" — connects to core game lore (Ascended gods)
  4. "Forbidden Practices: A History" — overview of blood, void, and soul magic
  5. "The Convergence Prophecy: Academy Variant" — "When the four schools speak as one..."
- Reading restricted books adds lore entries and may unlock dialogue options with Elara and Veylen

---

## The Practice Dungeon

### US-AA-68: Academy Practice Dungeon
**As a** student, **I descend** into the practice dungeon beneath the arena for combat training, reagent gathering, and quest objectives, **so that** the Academy has genuine gameplay content between lessons.

**Acceptance Criteria:**
- 5 floors of procedurally generated dungeon (using existing `newLevel()` system)
- Monsters are "training" variants: lower HP/ATK than overworld equivalents
  - Floor 1-2: Training Rats, Training Slimes (weak, ~5 HP)
  - Floor 3-4: Training Golems, Training Wisps (moderate, ~10 HP)
  - Floor 5: Training Elite — a mini-boss that respawns every 10 days
- Reagent drops more frequent than normal dungeons (Academy mines the Ley Line convergence)
- Quest items spawn on specific floors (overdue book on floor 1-2, Dreamleaf on floor 3+)
- Death in the practice dungeon is NOT permanent — you wake up in the dormitory with 1 HP
- "The practice dungeon's dangers are real, but the Academy wards prevent true death within its walls."

### US-AA-69: The Sub-Basement
**As an** explorer, **I discover** a hidden passage below the practice dungeon that leads to ancient pre-Academy chambers, **so that** the school's deepest secrets are accessible.

**Acceptance Criteria:**
- Hidden passage on practice dungeon floor 5 (secret wall detection or quest-triggered)
- Ancient chamber: different tileset (stone blocks instead of rough cave)
- The ward chamber: a special room with the glowing sigil in the bedrock
- First visit triggers a vision (flavored text/message sequence)
- Connects to quest US-AA-56 "Beneath the Academy"
- The sub-basement has no monsters — just atmosphere, inscriptions, and the ward

---

## The Sealed East Wing

### US-AA-70: The Sealed East Wing (Exploration Phase)
**As a** curious student, **I examine** the sealed East Wing from outside, discovering clues about what happened there, **so that** mystery builds naturally.

**Acceptance Criteria:**
- The sealed door is visible in the Enchantment Lab area
- Examining the door: "Ancient wards pulse with blue-white light. The door is warm to the touch."
- With True Sight: "Inscriptions cover the door — warnings in three languages. One phrase repeats: DO NOT OPEN UNTIL THE SINGER RETURNS."
- Sounds audible on some visits: "A faint hum. Almost like... a voice."
- Ashveil, if asked: "The East Wing was sealed after a student's experiment went catastrophically wrong. The wards must not be disturbed."
- Veylen, if asked: "Some doors are closed for good reason. Focus on your studies."
- These interactions build the mystery for the post-graduation quest

### US-AA-71: Portraits and Inscriptions
**As a** student, **I examine** historical elements around campus, **so that** the school's history reveals itself through environmental storytelling.

**Acceptance Criteria:**
- **Hallway portraits:** 6 past headmasters, each with a name plaque and a one-line description
  1. "Celestine Voss, Founder. 'Magic belongs to all.'"
  2. "Archmage Thessian. Died sealing the East Wing."
  3. "Archmage Delia Corsair. Expanded the library wing."
  4. "Archmage Sorin Kael. Established the practice dungeon."
  5. "Archmage Yara Fenn. Survived the Night of Whispers." (mysterious — no further explanation)
  6. "Archmagus Veylen. Current headmaster."
- **Courtyard fountain inscription:** "Where the streams cross, knowledge flows."
- **Above the Great Hall entrance:** "Learn. Fail. Learn again."
- **On the sealed East Wing door:** Visible runes. With True Sight, readable as warnings.
- **In the sub-basement:** Ancient script, pre-dating the Academy. Untranslatable without special knowledge.

### US-AA-72: Campus Secrets
**As an** observant student, **I find** hidden areas and secret interactions around campus, **so that** exploration is rewarded.

**Acceptance Criteria:**
- **Secret behind the bookshelf:** Hidden alcove in the library (secret wall mechanic). Contains the student journal.
- **Thornwick's locked cabinet:** Contains rare reagents. Can be lock-picked or accessed via quest.
- **The Arena's hidden room:** Below the practice arena, accessible via a floor tile that responds to Arcane Ward. Contains Dorian's stash (evidence for cheating quest).
- **The Fountain's secret:** At midnight (turn 95-100 of day cycle), the fountain water reveals a map of the Ley Lines beneath the campus for 5 turns. Viewing this adds a lore entry.
- **Veylen's office:** Locked. Contains the Academy charter and a sealed letter addressed to "the next Convergence." Post-graduation content.
