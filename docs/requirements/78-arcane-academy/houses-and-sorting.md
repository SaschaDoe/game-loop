# The Four Houses

The Academy's four spell schools are also its four **houses** — living communities with distinct identities, spaces, rivalries, and traditions. Your house shapes your social world, your daily life, and how every NPC speaks to you.

---

## The Houses

### House Pyraclaw — School of Elements
**Colors:** Red and gold
**Emblem:** A clawed flame
**Motto:** *"Strike first. Strike true."*
**Common Room:** The Hearth — a round stone chamber beneath the Practice Arena. The floor radiates warmth from the Ley Line below. An eternal flame burns in the center pit (fed by the convergence, never extinguished in 847 years). The walls are scorched from centuries of students practicing after curfew. Weapons hang on racks — Pyraclaws respect martial skill alongside magic. Feels like a warrior's lodge crossed with a forge.
**House Head:** Professor Ignis
**Personality:** Bold, competitive, sometimes reckless. Pyraclaws value courage and directness. They're the loudest in the courtyard, the first into the practice dungeon, and the most likely to blow something up. They respect action over theory.
**Reputation:** Other houses call them hotheads. Pyraclaws call it passion.
**Who belongs:** Warriors, fighters, anyone who acts on instinct. Non-mages (especially Warriors) often feel most at home here.

### House Verdantia — School of Alchemy
**Colors:** Green and copper
**Emblem:** A sprouting root wrapped around a vial
**Motto:** *"From patience, transformation."*
**Common Room:** The Greenhouse Loft — the upper floor of the Alchemy Tower, open to Thornwick's rooftop greenhouse through glass panels. Hanging plants dangle from the rafters. Workbenches are covered in half-finished experiments. Something is always bubbling somewhere. The air smells of earth, herbs, and something faintly chemical. Jars of preserved specimens line the shelves. A hammock in the corner belongs to whoever claims it first. Feels like a scientist's workshop merged with a botanical garden.
**House Head:** Professor Thornwick
**Personality:** Patient, curious, pragmatic. Verdantians value process over spectacle. They're the ones who stay late in the lab, who read ingredient labels for fun, who get excited about mold growth. They believe any problem can be solved with the right mixture.
**Reputation:** Other houses call them nerds. Verdantians call it dedication.
**Who belongs:** Healers, herbalists, patient thinkers. Rogues sometimes fit here — alchemy includes poisons.

### House Ironveil — School of Enchantment
**Colors:** Silver and deep blue
**Emblem:** A lattice of interlocking rings
**Motto:** *"Order endures."*
**Common Room:** The Warded Hall — a pristine, geometric chamber in the Enchantment Lab wing. Every surface has faint ward-lines etched into it (Ashveil insists). The furniture is arranged in perfect symmetry. Bookshelves are alphabetized. A practice circle in the floor glows faintly blue — students can practice ward-casting here at any hour. The room is always the exact same temperature. Feels like a library crossed with a precision workshop.
**House Head:** Professor Ashveil
**Personality:** Disciplined, precise, perfectionist. Ironveils value structure and mastery. They plan before acting. They take notes. They revise their notes. Other students think they're uptight; Ironveils think everyone else is sloppy.
**Reputation:** Other houses call them cold. Ironveils call it focused.
**Who belongs:** Strategists, perfectionists, those who value control. Clerics and Paladins resonate with the Order stream.

### House Glimmershade — School of Divination
**Colors:** Violet and starlight silver
**Emblem:** An open eye within a crescent moon
**Motto:** *"See what is hidden."*
**Common Room:** The Observatory — the topmost room of the Library Wing tower. The ceiling is enchanted to show the night sky regardless of time (a divination effect maintained by Maren). Cushions and low tables replace chairs — Glimmershades sit on the floor. Candles float in the air. A scrying pool occupies one corner (usually showing static, but sometimes... not). Dream-catchers hang from the ceiling — not decorative, functional. The room is quiet. Always quiet. Feels like a meditation retreat crossed with a fortune-teller's parlor.
**House Head:** Librarian Maren (informal — the Academy can't afford a Divination professor, so Maren fills both roles)
**Personality:** Observant, intuitive, introspective. Glimmershades are the watchers. They notice things others miss. They trust feelings over evidence. They're the most likely to believe in prophecies, dreams, and signs — and the most likely to be right about them.
**Reputation:** Other houses call them weird. Glimmershades say "you just can't see what we see."
**Who belongs:** Seekers, mystics, the perceptive. Rangers fit here (tracking is divination with extra steps). Rogues who rely on observation over brute force.

---

## US-AA-89: The Sorting Ceremony

**As a** new student, **I participate** in a choosing ritual on Day 1 that assigns me to one of four houses, **so that** I gain a social identity, a home base, and a community within the school.

### The Ceremony

The ceremony takes place in the Great Hall after enrollment. All four professors stand at the front. Archmagus Veylen presides.

**Veylen speaks:** *"Since Celestine's day, every student has found their place among the four houses. Each house embodies a path of magic — not a limitation, but a home. Step forward, and the Convergence Flame will show you where you belong."*

### The Ritual

The player approaches the eternal flame (brought up from the Pyraclaw common room for the ceremony). The flame changes color — cycling through red, green, silver, violet. The player is presented with four statements and must choose the one that resonates most:

**Choose your truth:**
1. *"When danger comes, I act."* → **Pyraclaw** (Elements)
2. *"When problems arise, I study them."* → **Verdantia** (Alchemy)
3. *"When chaos spreads, I bring order."* → **Ironveil** (Enchantment)
4. *"When others look away, I look closer."* → **Glimmershade** (Divination)

The flame locks on the corresponding color. The house head steps forward to welcome the player.

### Acceptance Criteria:
- Ceremony is a dialogue sequence with Veylen on Day 1, after enrollment
- Player's choice is stored in `GameState.academyHouse: 'pyraclaw' | 'verdantia' | 'ironveil' | 'glimmershade'`
- Choice is permanent (no re-sorting)
- After sorting, the player gets access to their house common room (a door that was previously locked)
- The house head greets you with a unique welcome speech
- Other students react based on which house you chose
- Class-aware suggestion: Veylen hints at which house suits your class ("The flame seems drawn to red. Your warrior spirit calls to Pyraclaw. But the choice is yours.")
- The player CAN choose against type (a Warrior in Glimmershade, a Mage in Pyraclaw) — and the world reacts to that
- Rod goes to Pyraclaw (he was hoping for Verdantia — "At least the common room is warm")
- Elara goes to Glimmershade (she wanted Ironveil for the structure, but the flame chose for her)
- Fenn goes to Verdantia (he claims he chose it because "the chairs are comfiest")
- Dorian goes to Ironveil (of course — it's the "prestige" house)

---

## US-AA-90: House Common Rooms

**As a** student, **I access** my house's common room — a unique physical space with distinct aesthetics, interactable objects, and social encounters, **so that** my house feels like home.

### Acceptance Criteria:
- Each house common room is a separate map area (entered through a door on the main campus)
- Only your house's door opens for you (others: "The door doesn't respond. This isn't your house.")
- Each common room has:
  - **A bed/rest area** (restoring HP and mana)
  - **A storage chest** (personal item storage)
  - **A unique interactable object:**
    - Pyraclaw: The Eternal Flame (meditate for +1 ATK for 50 turns)
    - Verdantia: A living herb garden (harvest 1 random reagent per day)
    - Ironveil: A practice ward circle (cast Arcane Ward for free — no mana cost — while in the room)
    - Glimmershade: The Scrying Pool (glimpse the next dungeon floor layout before descending)
  - **House notice board** (house-specific postings and challenges)
  - **1-2 house NPCs** (the house representative + occasional visiting students)
- The room visually matches the house aesthetic (described in house entries above)
- Different ASCII character sets and color schemes per room:
  - Pyraclaw: warm reds (#f44), `~` for fire effects, `†` for weapons
  - Verdantia: greens (#4f4), `♣` for plants, `○` for vials
  - Ironveil: cool blues (#88f), `◊` for ward patterns, clean geometry
  - Glimmershade: purples (#c8f), `*` for stars, `≈` for the scrying pool

---

## US-AA-91: House Representatives

**As a** student, **I interact** with a named student from each house who embodies that house's values and speaks differently based on the situation, my house, and the current events, **so that** each house feels inhabited by real people.

### The Representatives

#### Sera Brightforge (Pyraclaw)
**Personality:** Fiery, direct, competitive, warm underneath the bravado. Sera challenges people — not out of malice but because she believes struggle makes you stronger. She respects anyone who doesn't back down, regardless of house.

**Appearance:** NPC char `S`, color #f84 (orange-red). Found in Pyraclaw common room or the Practice Arena.

**Speaking Style:** Short, punchy sentences. Often starts with an action verb. Uses fire metaphors. "You survived Ashveil's class? Good. That woman could freeze a volcano with her disapproval."

**Reacts to your house:**
- **Player is Pyraclaw:** "One of us! Welcome to the forge. We burn bright or we don't burn at all." (instant warmth, shared identity)
- **Player is Verdantia:** "A potions person. You know fire is just very fast alchemy, right?" (friendly teasing)
- **Player is Ironveil:** "Ironveil. All rules, no guts. But I've seen a few of you fight. Prove me wrong." (skeptical respect)
- **Player is Glimmershade:** "The quiet house. I don't get you people. But Maren's scarier than she looks, so you must be tougher than you seem." (confusion + grudging respect)

**Situational Dialogue Examples:**
- After Lesson 1 (Elements): "Ignis says you've got potential. Coming from him, that means he only almost burned you."
- After Rod's disaster: "Bumblethatch blew up another cauldron? That boy is Pyraclaw at heart — too much energy, not enough aim."
- After Dorian's challenge: (if you won) "You beat Blackmere? HA! I'll be telling that story until graduation." / (if you lost) "Blackmere cheats. Everyone knows. Next time, hit harder."
- Before the exam: "The golem doesn't care about your grades. It cares about whether you can take a hit and get back up. That's Pyraclaw thinking."

#### Moss Thistledown (Verdantia)
**Personality:** Calm, methodical, quietly passionate about growing things. Moss speaks slowly and deliberately, as if each word is an ingredient being measured. He's the student who stays in the greenhouse past curfew, who names his experiments, who apologizes to plants before pruning them. Not timid — just unhurried.

**Appearance:** NPC char `M`, color #6c4 (muted green). Found in Verdantia common room or Thornwick's greenhouse.

**Speaking Style:** Long, meandering sentences with botanical analogies. Often trails off mid-thought. "The thing about alchemy is... well, it's like gardening, isn't it? You plant a seed — the ingredients — and you wait. Rushing a potion is like rushing a seedling. You get... hmm... something, but not what you wanted."

**Reacts to your house:**
- **Player is Verdantia:** "Ah, good. Another patient soul. Thornwick says patience is the first reagent. I believe him." (kinship)
- **Player is Pyraclaw:** "You're... energetic. Energy is useful in alchemy — carefully contained energy. VERY carefully." (gentle worry)
- **Player is Ironveil:** "Ashveil's students understand precision. That's half of alchemy. The other half is knowing when to let the mixture surprise you." (appreciation)
- **Player is Glimmershade:** "Divination and alchemy aren't so different. Both involve seeing what isn't visible yet. You'll like our greenhouse. The plants there see more than most people." (philosophical kinship)

**Situational Dialogue Examples:**
- After Lesson 2 (Alchemy): "Starfern and Moonwater. Simple. Beautiful. Most people rush past beauty because it seems too easy. Don't."
- After Rod's disaster: "That poor cauldron. I've been trying to repair the crack. Speaking to it, mostly. Cauldrons respond to gentleness. ...Don't tell Thornwick I talk to the equipment."
- After the Missing Ingredient quest: "Someone stole from the tower? That's... that's like stealing from a garden. You don't take what you didn't grow."
- Before the exam: "I brewed you something. For luck. Well, not really for luck — for calm. It's chamomile with a drop of Moonwater. Drink it before the golem fight. It won't help mechanically. But you'll feel better."

#### Wrenn Ashford (Ironveil)
**Personality:** Composed, analytical, competitive in a quiet way. Wrenn doesn't boast like Dorian — she simply states facts and lets the implications land. She believes in systems, rules, and earned merit. She respects competence above all else. Not cold — precise. She'll compliment you exactly once if you earn it, and you'll remember it forever.

**Appearance:** NPC char `W`, color #8af (steel blue). Found in Ironveil common room or the Enchantment Lab.

**Speaking Style:** Measured, formal-adjacent. Uses "one" instead of "you" sometimes. Avoids contractions when making a point. "One does not simply 'try' a ward. One either constructs it correctly or one does not. There is no partial credit in enchantment."

**Reacts to your house:**
- **Player is Ironveil:** "Welcome. Ashveil's standards are exacting. If you're here, you've already passed the first test — choosing discipline over excitement." (approval)
- **Player is Pyraclaw:** "Pyraclaw. All fire, no structure. I've seen your house's common room. The scorch marks are... concerning." (cool disapproval)
- **Player is Verdantia:** "Alchemy requires precision. That's an Ironveil quality. You chose the wrong house — or rather, the right house chose differently." (backhanded respect)
- **Player is Glimmershade:** "Divination is difficult to quantify. I respect Maren, but I prefer magic I can measure. Still — you see patterns others miss. That has value." (grudging acknowledgment)

**Situational Dialogue Examples:**
- After Lesson 3 (Enchantment): "Ashveil praised Nighthollow's ward. She has never praised mine. I will improve." (no bitterness — just resolve)
- After Dorian's challenge: (if you won) "Blackmere's ward technique was sloppy. You exploited that. Well done." / (if you lost) "Blackmere's ward technique was sloppy, but yours was worse. Study."
- After discovering Dorian's cheating: "Cheating undermines the entire merit system. If you report it, I will corroborate. If you don't... I will reconsider my assessment of your character."
- Before the exam: "I've analyzed the golem's pattern seventeen times. The retreat window on the blast turn is exactly 1.2 seconds. Don't be late."

#### Lumi Starweave (Glimmershade)
**Personality:** Dreamy, perceptive, says things that sound like nonsense until three days later when they turn out to be true. Lumi operates on a different wavelength. She stares at things too long. She finishes sentences you haven't started yet. She's kind, but in a way that feels like she already knows you'll need kindness tomorrow. Slightly unnerving. Entirely genuine.

**Appearance:** NPC char `L`, color #c8f (soft violet). Found in Glimmershade common room or wandering the courtyard at odd hours.

**Speaking Style:** Elliptical. Drops mid-sentence into something that sounds unrelated but isn't. Uses the word "feel" a lot. Sometimes speaks in questions she clearly already knows the answer to. "You went to the library last night, didn't you? I know because... I dreamed about pages turning. Do you dream about pages? They're louder than people think."

**Reacts to your house:**
- **Player is Glimmershade:** "I knew you'd choose us. Not because I scried it — because you paused at the flame. Glimmershades always pause." (serene knowing)
- **Player is Pyraclaw:** "Fire is easy to see. But do you know what's behind the fire? What the fire is afraid of? Come find me when you want to know." (cryptic invitation)
- **Player is Verdantia:** "Plants know things before we do. They feel the rain coming. Alchemy is divination with dirt. You'll understand eventually." (gentle prophecy)
- **Player is Ironveil:** "You like patterns. Good. Magic is a pattern. The gods are a pattern. But who wrote the pattern? ...Don't answer yet. You're not ready." (unsettling)

**Situational Dialogue Examples:**
- After Lesson 6 (Divination): "Maren taught you True Sight. But there are things True Sight doesn't show you. Things that hide from seeing. The ward beneath us, for instance. It sees you looking and... closes its eye."
- After the Ghost in the Library quest: "You heard the singing. I hear it every night. It's not sad. It's waiting. For someone who can sing back."
- After Elara's secret research is revealed: "Nighthollow is close. Very close. Closer than Aldric was. But the thing that stopped Aldric is watching her too. I can feel it watching."
- Before the exam: "The golem will charge twice, then blast. But that's not what I want to tell you. I want to tell you: after the exam, something changes. Not in the school. In you. I don't know what. I just know."

---

## US-AA-92: House Points and Competition

**As a** student, **I earn** points for my house through academic performance, quests, and activities, **so that** there's a communal goal and inter-house rivalry.

### Acceptance Criteria:
- `housePoints: Record<AcademyHouse, number>` tracked in GameState
- Points earned by:
  - Completing a lesson: +10 points for your house
  - Winning a duel/tournament round: +15 points
  - Completing a quest: +5-20 points (varies)
  - Answering a teaching question correctly (post-graduation): +5 points
  - Getting caught breaking rules (sneaking into restricted section, etc.): -10 points
- Other houses earn points passively (simulated NPC performance)
- Standings displayed on the Great Hall notice board
- **End-of-year House Cup:** Announced at graduation. Winning house gets bragging rights and a unique item:
  - Pyraclaw wins: Flame Pendant (+1 ATK passive)
  - Verdantia wins: Living Seed (regrows 1 reagent per day in inventory)
  - Ironveil wins: Ward Signet (Arcane Ward costs -1 mana permanently)
  - Glimmershade wins: Starlight Lens (+1 sight radius permanently)
- Player can influence outcomes heavily through quest choices and performance
- House reps react to standings: Sera gloats if Pyraclaw leads, Wrenn silently adjusts strategy, Moss says "Points aren't everything... but winning IS nice," Lumi says "The cup knows who will hold it. I just hope it's right this time."

---

## US-AA-93: House-Specific Side Quests

Each house has a unique quest available only to members of that house. These quests explore the house's history and values.

### Pyraclaw Quest: "The Eternal Flame"
**Trigger:** Day 10. Sera notices the Eternal Flame in the common room is dimming — something it hasn't done in 847 years.

**Objectives:**
1. Sera asks you to investigate. "If that flame goes out, Pyraclaw loses its identity. We NEED fire."
2. Descend into the practice dungeon to the sub-level where the Ley Line convergence feeds the flame
3. Discover a crack in the Ley Line channel (caused by the Incident 200 years ago, slowly worsening)
4. Choose: seal the crack with Arcane Ward (temporary fix, requires spell) OR feed the crack a Fire Crystal (permanent fix, uses rare ingredient)
5. Return to Sera with the result

**Rewards:** +50 XP, +15 house points, Sera friendship +3. If permanent fix: the Eternal Flame burns brighter than ever — Pyraclaw's meditation bonus increases to +2 ATK for 50 turns.

**Lore:** The crack reveals that the Ley Line feeds MORE than just the flame — it feeds the ancient ward below. The flame is a canary. If it dies, the ward is next.

### Verdantia Quest: "Thornwick's Secret Garden"
**Trigger:** Day 10. Moss discovers a locked greenhouse compartment that Thornwick forbids students from entering.

**Objectives:**
1. Moss: "I heard something GROWING in there. Not normal growing. Fast. Wrong. Beautiful. I need to see it."
2. Gain access: pick the lock (Rogue), ask Thornwick directly (requires quest "Professor's Pet" completed for him), or find the spare key in his office
3. Inside: plants from the Sealed East Wing. They grew through cracks in the wall. They're alive in ways that normal plants aren't — they react to magic, they change color based on emotion, one of them writes words in its leaves.
4. One plant has a message growing in its bark: "HE IS STILL HERE" (referring to Aldric)
5. Thornwick catches you (unavoidable). He's not angry — he's relieved. "I've been tending them alone for twenty years. It's time someone else knew."

**Rewards:** +50 XP, +15 house points, Moss friendship +3, 2 unique reagents (East Wing specimens — ingredients for advanced potions not in the normal catalog), lore entry about the East Wing's living magic.

### Ironveil Quest: "The Imperfect Ward"
**Trigger:** Day 10. Wrenn discovers that one of the wards protecting the Sealed East Wing is degrading.

**Objectives:**
1. Wrenn: "The third-layer ward on the East Wing door is losing coherence. I've run the calculations. If it fails, the containment drops by 33%. That is... unacceptable."
2. Examine the failing ward with Wrenn (requires Arcane Ward spell)
3. Discover the ward was cast by Archmage Thessian — and he was wounded when he cast it. The ward carries his pain, literally. A crack of grief runs through the pattern.
4. Choose: repair the ward using standard technique (stabilizes for years, clinical) OR repair it by acknowledging Thessian's sacrifice (stronger repair, but you feel a flash of his final moments — discovering what Aldric saw)
5. Report to Ashveil

**Rewards:** +50 XP, +15 house points, Wrenn friendship +3. If emotional repair: +1 max mana (Thessian's gratitude), vision lore entry. Ashveil is visibly shaken when you describe the vision: "You felt what I've feared. The ward is more than a door. It's a memorial."

### Glimmershade Quest: "The Dreaming Pool"
**Trigger:** Day 10. Lumi tells you the scrying pool has been showing the same image for three days straight — and it's never done that before.

**Objectives:**
1. Lumi: "It's showing a room. Underground. There's a light in the floor. And someone standing in the light. But they have no face. ...I think the pool wants us to go there."
2. Use True Sight on the scrying pool (if you have it) — reveals the sub-basement and the ancient ward
3. Descend to the sub-basement (if not yet discovered, this opens the path)
4. In the ward chamber, Lumi sees something you can't: "There are seven of them. Were seven of them. They're still here. They ARE the ground."
5. The scrying pool stops showing the image. It shows something new: your face, older, standing in front of the Sealed East Wing door. Then static.

**Rewards:** +50 XP, +15 house points, Lumi friendship +3, early access to the sub-basement (if not yet found), major lore entry. Lumi whispers after: "The pool showed me your future. I won't tell you what I saw. But... I'm glad I'm in your house. Or glad you're in mine."

---

## US-AA-94: House-Specific Dialogue Variations

**As a** student, **every NPC** adjusts their dialogue based on my house, **so that** the house choice permeates the entire experience.

### Acceptance Criteria:
- `academyHouse` is added to `DialogueContext` and available as a `DialogueCondition`
- Key dialogue moments that change by house:

**Archmagus Veylen:**
- Pyraclaw: "Pyraclaw. The house of action. Remember — courage without wisdom is just recklessness."
- Verdantia: "Verdantia. The house of patience. The world needs more people who know when not to act."
- Ironveil: "Ironveil. The house of order. Just remember — some rules exist to be broken. Carefully."
- Glimmershade: "Glimmershade. The house of sight. Be cautious what you look for. You might find it."

**Rod (Pyraclaw):**
- To Pyraclaw player: "We're in the same house! This is going to be great! I'll try not to set the common room on fire. ...Again."
- To other houses: "Pyraclaw's common room is SO warm. Yours is probably nice too. Is it warm? Ours is really warm."

**Elara (Glimmershade):**
- To Glimmershade player: "We're... housemates. I suppose you'll want to talk. The scrying pool is mine between midnight and dawn. That's my only rule."
- To Ironveil player: "Ironveil suits you. Ashveil's methods are rigorous. I respect that, even if I find them limiting."
- To other houses: "Your house is... fine. But the library is neutral territory. That's where the real work happens."

**Dorian (Ironveil):**
- To Ironveil player: "At least you chose well. Ironveil is the only house with real standards. Try to keep up."
- To Pyraclaw player: "Pyraclaw. Fitting — all heat, no substance."
- To Verdantia player: "Verdantia? The gardeners? How... quaint."
- To Glimmershade player: "Glimmershade. The house of staring at candles and pretending it's wisdom."

**Professors adjust too:**
- Ignis to Pyraclaw student: "One of mine! I expect great things. Or at least spectacular failures."
- Ignis to other houses: "You're not Pyraclaw, but fire doesn't discriminate. Show me what you've got."
- Ashveil to Ironveil student: "You chose structure. Good. I will hold you to a higher standard than the others."
- Thornwick to Verdantia student: "My house! Come by the greenhouse anytime. The mandrakes are being difficult again."
- Maren to Glimmershade student: "Welcome, seeker. The pool has been waiting for new eyes. Be gentle with what it shows you."

---

## US-AA-95: House Rivalries and Alliances

**As a** student, **houses** have natural rivalries and alliances that create social dynamics beyond individual relationships, **so that** the school feels politically alive.

### The Dynamic:
- **Pyraclaw vs. Ironveil:** The classic fire-vs-ice rivalry. Sera and Wrenn have an ongoing argument about whether courage or discipline matters more. Their debates in the courtyard are legendary.
- **Verdantia vs. Glimmershade:** Friendly alliance. Both are "quiet" houses. Moss and Lumi get along — "She talks to stars, I talk to plants. We understand each other."
- **Pyraclaw + Verdantia:** Tentative friendship. Fire feeds growth. Sera respects Moss's quiet strength.
- **Ironveil + Glimmershade:** Respect but distance. Wrenn appreciates Lumi's pattern recognition but doesn't trust her "feelings."
- **Cross-house friendships:** Rod (Pyraclaw) is friends with everyone regardless of house. Dorian (Ironveil) looks down on all other houses but especially Pyraclaw ("undisciplined") and Verdantia ("irrelevant").

### Acceptance Criteria:
- House rivalries manifest in:
  - Courtyard debates between Sera and Wrenn (observable events)
  - Cross-house competition in the tournament (house reps cheer for their members)
  - Notice board trash talk postings between houses
  - Practice dungeon leaderboards separated by house
- The player can broker peace or stoke rivalry through dialogue choices
- House alliance affects the "Academy Tournament" quest — your house rep helps coach you before your matches
