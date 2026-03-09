# Classmates and Relationships

Four key NPCs populate the Academy alongside you. They have opinions, evolve over time, and create a living social world. Each reacts to events, your choices, and each other.

---

## Roderick "Rod" Bumblethatch — The Loyal Friend

### US-AA-33: Rod Introduction
**As a** student, **I meet** Rod on Day 1 — a big, clumsy, good-natured oaf who immediately befriends me, **so that** I have an ally from the start.

**Acceptance Criteria:**
- Rod is positioned in the student dormitory, approaches player on first entry
- Opening line: "Hey! You're new too, right? I'm Rod. Roderick, technically, but nobody calls me that. Not since the goat incident."
- Rod explains he was sent by his parents who noticed he could accidentally move objects when sneezing
- He's terrible at magic but determined to try
- Rod has physical dialogue traits: describes breaking things, tripping, knocking things over
- Warm, immediate friendship energy — no suspicion, no games

### US-AA-34: Rod's Class Reactions
**As a** student attending lessons with Rod, **I see** his comedic struggles in each class, **so that** the lessons have personality and not just mechanics.

**Acceptance Criteria:**
- **Elements class:** Rod's Firebolt goes sideways and singes Professor Ignis's eyebrow. Ignis isn't angry — "It happens to the best of us. And to Rod."
- **Alchemy class:** Rod's cauldron explodes. Every single time. Thornwick has a special reinforced station just for him.
- **Enchantment class:** Rod's ward holds for exactly 0.5 seconds. Ashveil makes him do it 30 times. It holds for 0.7 seconds. She calls it "progress."
- **Divination class:** Rod accidentally scries on the kitchen. "I can see lunch! Is that useful?"
- These moments are dialogue vignettes during lessons, not separate scenes

### US-AA-35: Rod's Loyalty Arc
**As a** student, **Rod** helps me during difficult moments throughout the school year, **so that** his friendship has mechanical and narrative value.

**Acceptance Criteria:**
- **Practice dungeon:** If player HP drops below 25%, Rod appears and tanks one hit ("Get behind me!")
- **Dorian confrontation:** Rod stands up for you even when outmatched ("Leave them alone, Blackmere.")
- **Mid-game:** Rod gives you a potion before the exam ("I know I'll fail. But you won't.")
- **Exam day:** Rod doesn't pass Part 1 (alchemy question). His reaction is graceful: "I never was cut out for this. But I'm glad you're here."
- Rod's friendship is unconditional — he never betrays or abandons you regardless of your choices

### US-AA-36: Rod Quest: "Roderick's Disaster"
**As a** student, **I help** Rod clean up after a cauldron explosion before Professor Thornwick discovers it, **so that** our friendship deepens.

(See `quests.md` US-AA-48 for full details)

---

## Elara Nighthollow — The Brilliant Loner

### US-AA-37: Elara Introduction
**As a** student, **I notice** Elara — always alone, always studying, finishing assignments before others start, **so that** a potential deeper friendship is established.

**Acceptance Criteria:**
- Elara doesn't approach the player. She's visible in the library or classroom corners.
- First interaction requires the player to talk to her (she won't initiate)
- Initial dialogue is curt: "I'm busy. Is this about the assignment? I've already finished it."
- If player persists: "You're... talking to me? Most people don't. I'm Elara."
- Elara gradually opens up over multiple conversations (tracked by a `elaraFriendship` counter)
- She's researching cross-school magic theory (Aldric the Unbound's work — forbidden)

### US-AA-38: Elara's Brilliance
**As a** student attending lessons with Elara, **I see** her effortless excellence, **so that** her intelligence is established not through telling but showing.

**Acceptance Criteria:**
- **Elements class:** Elara casts Firebolt on her first try, then immediately asks about fire-ice combination spells. Ignis changes the subject.
- **Alchemy class:** Elara finishes first and quietly corrects Rod's technique without being asked. She doesn't do it for credit — she can't stand seeing it done wrong.
- **Enchantment class:** Ashveil actually praises her: "Nighthollow's ward structure is... superior to mine. I'll study it tonight."
- **Divination class:** Maren looks concerned after Elara's True Sight reveals something she shouldn't be able to see at her level.
- Elara's grades are shown on the notice board: always first.

### US-AA-39: Elara's Secret Research
**As a** friend to Elara, **I discover** she's researching Aldric the Unbound's cross-school experiments, **so that** the player encounters the school's hidden history organically.

**Acceptance Criteria:**
- After friendship level 3+, Elara shares: "I found something. Aldric wasn't crazy. His math was RIGHT."
- She shows the player a torn page from a book — equations proving that cross-school casting should work
- She asks for help accessing the restricted section (see quest US-AA-55)
- Moral choice: help Elara (risk danger) or report her to Veylen (safe but betrayal)
- If helped: Elara discovers information about the Sealed East Wing and the ancient ward
- If reported: Elara is put on academic probation. She stops talking to you. Her research continues secretly without your help.
- **No wrong answer** — both paths lead to different story outcomes

### US-AA-40: Elara's Loneliness
**As a** friend, **I learn** why Elara has no friends — her intensity frightens people, and she's been betrayed before, **so that** the player understands her defensiveness.

**Acceptance Criteria:**
- At friendship level 5+, Elara reveals backstory: "I had a friend at my old school. She stole my research and published it. Got expelled. Since then... I don't let people in."
- If the player has consistently been kind: "You're different. You actually listen."
- Elara gives the player a gift: a rare reagent she found during her research (Dreamleaf or Phoenix Ash)
- This gift is one of the only ways to obtain certain reagents early in the game

---

## Fenn Ashwick — The Observer

### US-AA-41: Fenn Introduction
**As a** student, **I meet** Fenn — a witty, neutral student who comments on everything and everyone, **so that** the school has a voice of social commentary.

**Acceptance Criteria:**
- Fenn is found in the courtyard, near the notice board, or in hallways — never in classes (he's often late)
- Opening line: "Oh, you're the new one. [Warrior/Rogue/Mage], right? I can tell by the [sword calluses/lockpick stains/ink fingers]. Don't worry — I notice everything. It's a gift. And a curse."
- Fenn provides commentary on other NPCs, school events, and the player's choices
- He's not a friend or enemy — he's an audience. He watches the story unfold.
- Talking to Fenn between lessons gives flavor gossip that hints at quests and secrets

### US-AA-42: Fenn's Commentary System
**As a** student, **Fenn** has unique dialogue that changes based on recent events, **so that** talking to him always feels fresh and relevant.

**Acceptance Criteria:**
- After each lesson, Fenn has a new comment about what happened
- After quest completions, Fenn reacts: "I heard you helped Rod clean up. Noble. Stupid, but noble."
- Fenn comments on classmates:
  - On Rod: "Bumblethatch sneezed in Enchantment class today. Three desks flipped. I counted."
  - On Elara: "Nighthollow hasn't slept in three days. I've seen the library candle burning at all hours. What's she reading?"
  - On Dorian: "Blackmere's father donated a new wing to the Conservatory last month. Coincidence that Dorian passed his entrance exam the same week? I'm just asking questions."
  - On professors: "Ignis burned his lunch again. The man teaches fire magic and can't operate a stove."
- Commentary is driven by `DialogueCondition` checks on quest state, lesson progress, etc.

### US-AA-43: Fenn's Gossip Mechanic
**As a** student, **Fenn** occasionally shares rumors that are actually quest hooks or hidden lore, **so that** his social watching has gameplay value.

**Acceptance Criteria:**
- "Did you know there's a room below the library that's not on any map? Maren pretends it doesn't exist."
- "The Sealed East Wing makes sounds at night. I've heard it. Sounds like... singing. Backwards."
- "Thornwick's greenhouse has plants that shouldn't exist. I saw one move. Not wind-move. REACH-move."
- "Blackmere has a key that he shouldn't have. I've seen him use it on the practice arena lock after hours."
- These rumors are logged in the journal and can trigger or hint at side quests

---

## Dorian Blackmere — The Rival

### US-AA-44: Dorian Introduction
**As a** student, **I encounter** Dorian — wealthy, talented, and arrogant — who immediately establishes himself as my rival, **so that** the school year has conflict and tension.

**Acceptance Criteria:**
- Dorian approaches the player after Lesson 1, uninvited
- "So. You're the [warrior/rogue/commoner] they let in this year. I suppose they'll take anyone now."
- If player is a non-mage: "The Academy used to have standards. Now they're letting [warriors/rogues] play at being mages."
- If player is a mage: "Another mage? Good. At least we'll have some actual competition. Though I doubt you'll be much."
- Dorian's dialogue is designed to make the player want to prove him wrong
- He's not evil — just privileged, insecure, and raised to believe he's superior

### US-AA-45: Dorian's Competition
**As a** student, **Dorian** competes with me at every opportunity — in classes, in the arena, in academic standing, **so that** there's persistent rivalry tension.

**Acceptance Criteria:**
- After each lesson, Dorian makes a comment comparing his performance to yours
- If player did well: "Not bad. For a [class]. I was better, of course."
- If player struggled: "Perhaps the Academy should reconsider its admission standards."
- Notice board shows rankings — Dorian is always near the top
- Dorian challenges the player to a spell duel mid-semester (see quest US-AA-52)
- He practices in the arena after hours (player can observe if exploring at night)

### US-AA-46: Dorian's Vulnerability
**As a** student who investigates, **I discover** Dorian's secret — he's under immense pressure from his family and is not as confident as he appears, **so that** the rival has depth beyond arrogance.

**Acceptance Criteria:**
- Through Fenn's gossip or direct investigation, player learns:
  - Dorian was rejected by the Conservatory (his family's preferred school)
  - His father threatened to disown him if he doesn't graduate top of class
  - He practices alone at night because he's terrified of failing publicly
- Optional: player can find a letter from Dorian's father in his things (morally grey — snooping)
- The letter is brutal: "Do not embarrass this family. The Blackmere name is worth more than your feelings."
- If the player confronts Dorian kindly after learning this: a rare moment of honesty
  - "Don't pretend you understand. You have the luxury of having nothing to lose."
  - Dorian doesn't become a friend, but the rivalry softens — respect replaces contempt
- If the player uses this information against him: Dorian becomes a genuine enemy and sabotages you later

### US-AA-47: Dorian's Cheating
**As a** student, **I can discover** that Dorian has been cheating on assignments, **so that** the rivalry takes a moral dimension.

**Acceptance Criteria:**
- Fenn's hint: "Blackmere's scores are too consistent. Nobody gets perfect marks in EVERY class."
- Investigation reveals: Dorian acquired answer keys from the practice exam archive
- Player choice:
  1. **Report to Veylen:** Dorian is publicly reprimanded. He blames you. He becomes hostile but stops cheating. His final exam grade reflects his real ability (he still passes — he IS talented).
  2. **Confront Dorian directly:** He's furious, then ashamed. Promises to stop. Keeps his word. Your rivalry becomes grudging mutual respect.
  3. **Blackmail him:** Dorian does you a favor (gives rare item) but despises you. This is the "villain" path.
  4. **Ignore it:** Status quo continues. No consequence.
- Each choice affects Dorian's final exam dialogue and post-graduation relationship
