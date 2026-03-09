# Spell Schools

This document defines **all spell schools** in Aethermoor's magic system: seven arcane schools (derived from the seven Ley Line streams) and five forbidden schools (magic that bypasses or corrupts the Ascended's control). It also defines school interactions, mastery progression, and cross-school mechanics.

This is the **canonical school reference**. Other epics that reference spell schools (78-arcane-academy, 29-forbidden-magic, 48-summoning-and-conjuration, etc.) must remain consistent with the definitions here.

**Lore foundation:** Magic flows through seven Ley Line streams, each the living essence of one of the Original Seven (now controlled by the Ascended). Each stream maps to one arcane school. Forbidden schools draw from corrupted, bypassed, or external sources.

**Stories in this file:** US-MS-09 through US-MS-16

---

## US-MS-09: The Seven Arcane Schools

**As a** player,
**I want** seven distinct spell schools with unique gameplay identities, visual styles, and lore connections,
**so that** my magical specialization feels meaningful and each school offers a different approach to combat and exploration.

### Details

Each of the seven Ley Line streams gives rise to one arcane spell school. Every learnable spell in the game belongs to exactly one school (forbidden spells belong to forbidden schools, detailed in US-MS-11 through US-MS-15).

---

### 1. Elements (Stream of Energy)

| Property | Value |
|----------|-------|
| **Ley Line Stream** | Stream of Energy (Ira-Sethi / Khorvan) |
| **Tradition Affinity** | Arcanists (academic fire/lightning theory), Primordialists (raw elemental communion) |
| **Gameplay Role** | Direct damage, area denial, environmental manipulation. The combat school. |
| **Colors** | Red / Orange (fire), Cyan (ice), Yellow (lightning) |
| **ASCII Effects** | Fire: red `*` and `^`; Ice: cyan `~` and `#`; Lightning: yellow `/` and `\` |

**Lore Identity:** The Stream of Energy is the most violent of the seven streams and the easiest to weaponize. Khorvan (the Ascended who controls it) was a coward in mortal life, and his overcompensating aggression bleeds through — elemental spells are disproportionately destructive. The Academy's Pyraclaw house specializes in this school.

**Gameplay Identity:** Elements is the primary damage school. It offers the highest raw damage output but limited utility outside of combat. Spells target single enemies, lines, or areas. Environmental effects (setting tiles on fire, freezing water, electrifying metal surfaces) add tactical depth.

**Iconic Mechanic — Elemental Affinity:** Casting multiple spells of the same element in sequence increases their potency. Three fire spells in a row triggers Ignition (bonus damage on the third). This rewards commitment to a sub-element rather than switching constantly.

**Sub-elements:**
- **Fire** — Highest single-target damage, leaves burning tiles, damage over time
- **Ice** — Lower damage but slows enemies, creates difficult terrain, freezes water tiles
- **Lightning** — Chains between nearby enemies, bonus damage to targets in water or wearing metal armor

---

### 2. Enchantment (Stream of Order)

| Property | Value |
|----------|-------|
| **Ley Line Stream** | Stream of Order (Aum-Varek / Verath) |
| **Tradition Affinity** | Runeweavers (runic wards), Thaumaturges (divine protection) |
| **Gameplay Role** | Wards, shields, bindings, dispels, weapon/armor enhancement. The defensive/utility school. |
| **Colors** | Silver / Blue |
| **ASCII Effects** | Silver `+` barriers, blue `O` shields, white `=` bindings |

**Lore Identity:** The Stream of Order governs structure, law, and containment. Verath (the Ascended) was a tyrant king in mortal life — his stream excels at imposing control. Enchantment spells feel like locks clicking shut, chains tightening, walls solidifying. The Academy's Ironveil house teaches this school.

**Gameplay Identity:** Enchantment is the primary defensive school. It provides damage mitigation (wards, shields), crowd control (bindings, paralysis), support (weapon enhancement, armor buffing), and anti-magic (dispel, nullification). Low damage output but essential for survival in harder content.

**Iconic Mechanic — Layered Wards:** Enchantment wards can be stacked. Each ward absorbs a set amount of damage before breaking. Casting a new ward while one is active layers it on top. A master Enchanter can maintain three wards simultaneously, creating a multi-layered defense that opponents must burn through.

---

### 3. Restoration (Stream of Change)

| Property | Value |
|----------|-------|
| **Ley Line Stream** | Stream of Change (Kha-Siel / Mireya) |
| **Tradition Affinity** | Thaumaturges (divine healing), Primordialists (nature mending) |
| **Gameplay Role** | Healing, curing, buffing, regeneration, transformation. The support school. |
| **Colors** | Green / Gold |
| **ASCII Effects** | Green `+` heal pulses, gold `*` buff sparkles, green `~` regeneration waves |

**Lore Identity:** The Stream of Change governs transformation and renewal. Mireya (the Ascended) was a plague-bringer in mortal life who killed thousands — her crushing guilt makes healing spells through her stream carry phantom pain in the caster (the Taint). Despite this, Restoration is the most universally valued school. Not taught at the Academy; the temple tradition (Thaumaturges) guards it jealously.

**Gameplay Identity:** Restoration is the only school that reliably heals HP. It also cures status effects, provides stat buffs, and at higher tiers offers transformation (temporary stat redistribution, polymorph). Essential for sustained dungeon exploration; less useful in burst-damage scenarios.

**Iconic Mechanic — Overheal Shield:** Healing beyond max HP creates a temporary overheal shield (green HP bar segment) that absorbs damage for 5 turns. This rewards proactive healing rather than only reactive healing, and gives Restoration a defensive edge.

---

### 4. Divination (Stream of Time)

| Property | Value |
|----------|-------|
| **Ley Line Stream** | Stream of Time (Tho-Rienne / Orinthas) |
| **Tradition Affinity** | Arcanists (systematic analysis), Primordialists (prophetic visions) |
| **Gameplay Role** | Sight, foresight, detection, enemy analysis, slow/haste. The information school. |
| **Colors** | Violet / White |
| **ASCII Effects** | Violet `?` detection pings, white `.` scrying fields, violet `>` haste trails |

**Lore Identity:** The Stream of Time is the most damaged of the seven streams — Orinthas's mortal incompetence as a king left deep scars. Divination spells sometimes show what the caster fears rather than what is true (the Taint). Despite this unreliability, Divination is prized for its unmatched information-gathering capability. The Academy's Glimmershade house specializes here.

**Gameplay Identity:** Divination provides battlefield intelligence: revealing enemy stats, detecting traps, seeing through fog of war, and predicting enemy actions. Its temporal manipulation (haste/slow) provides powerful combat utility without dealing direct damage. The "knowledge is power" school.

**Iconic Mechanic — Foresight Counter:** After casting a Divination analysis spell on an enemy, the player can see that enemy's next intended action (displayed in the combat log). If the player acts to counter it (e.g., stepping out of an attack's path, using a shield before a big hit), they gain a Foresight bonus: +50% effectiveness on their counter-action. Rewards tactical play.

---

### 5. Alchemy (Stream of Matter)

| Property | Value |
|----------|-------|
| **Ley Line Stream** | Stream of Matter (Dro-Mahk / Selvara) |
| **Tradition Affinity** | Arcanists (systematic experimentation), Runeweavers (material inscription) |
| **Gameplay Role** | Transmutation combat spells (acid, poison, petrify) + crafting system. The hybrid school. |
| **Colors** | Green / Copper |
| **ASCII Effects** | Green `%` acid splashes, copper `o` transmutation circles, yellow-green `~` poison clouds |

**Lore Identity:** The Stream of Matter governs physical substance and transformation of materials. Selvara (the Ascended) was a mortal alchemist who created abominations — her stream sometimes produces things that should not exist (plants with teeth, stones that bleed). The Academy's Verdantia house studies this school. Alchemy is unique among schools because it bridges combat magic and crafting.

**Gameplay Identity:** Alchemy is a dual-purpose school. Its combat side provides damage-over-time effects (acid, poison), crowd control (petrify, transmute terrain), and debuffs (corrode armor, weaken). Its crafting side (detailed in `alchemy-and-crafting.md`) provides potion brewing, reagent processing, and material transmutation. Mastering Alchemy rewards both in combat and in preparation.

> **Note:** Alchemy is both a spell school (combat transmutations defined here) and a crafting system (potion brewing, recipes, reagent gathering). The crafting mechanics are detailed in `alchemy-and-crafting.md` (US-MS-34 to US-MS-42). This document defines only the combat spell school identity.

**Iconic Mechanic — Transmute Terrain:** Alchemy combat spells can permanently alter tiles. Acid dissolves walls (opening new paths). Petrify turns water to stone (creating bridges). Poison Cloud lingers for multiple turns. This makes Alchemy the premier exploration-utility school, rewarding creative problem-solving.

---

### 6. Conjuration (Stream of Space)

| Property | Value |
|----------|-------|
| **Ley Line Stream** | Stream of Space (Vel-Nara / Theron) |
| **Tradition Affinity** | Arcanists (summoning theory), Void Touched (dimensional affinity — corrupted form) |
| **Gameplay Role** | Summoning, teleportation, illusion, creating objects. The versatility school. |
| **Colors** | Teal / Purple |
| **ASCII Effects** | Teal `@` summoned entities, purple `*` dimensional rifts, faded/dim characters for illusions |

**Lore Identity:** The Stream of Space governs distance, dimension, and perception. Theron (the Ascended) was a master liar — his stream makes illusions unnervingly convincing and teleportation subtly unreliable (you occasionally arrive somewhere related to a hidden truth). Conjuration is not taught at the Academy because summoning is considered too dangerous for students; it is learned from independent Arcanist masters, ancient texts, or through the forbidden Void Touched tradition (corrupted form).

**Gameplay Identity:** Conjuration is the most versatile school. Summoned creatures act as allies (with their own AI), illusions distract enemies and create false walls, teleportation enables tactical repositioning, and conjured objects (barriers, platforms) reshape the battlefield. Jack-of-all-trades but master of none — lower raw power than specialized schools.

**Iconic Mechanic — Summoned Allies:** Conjuration is the only standard school that creates persistent allied entities on the map. Summoned creatures have their own HP, attacks, and basic AI. They last a set number of turns or until killed. Higher-tier summons are stronger and last longer. Managing summons (positioning, sacrificing, replacing) is the core Conjuration gameplay loop.

---

### 7. Shadow (Stream of Spirit)

| Property | Value |
|----------|-------|
| **Ley Line Stream** | Stream of Spirit (Pho-Lumen / Aelith) |
| **Tradition Affinity** | Blood Singers (emotional manipulation), Primordialists (spirit communion) |
| **Gameplay Role** | Fear, drain, darkness, mind control, curses, debuffs. The debuff/control school. |
| **Colors** | Dark Purple / Black |
| **ASCII Effects** | Dark purple `'` shadow tendrils, black/dim tiles for darkness zones, grey `?` for confusion |

**Lore Identity:** The Stream of Spirit governs consciousness, emotion, and the boundary between life and death. Aelith (the Ascended) was a neglectful mother who abandoned her children — her stream carries overwhelming emotional resonance (the Taint), and Shadow magic amplifies fear, despair, and isolation. Not taught at the Academy due to moral ambiguity. Learned from wandering practitioners, dark texts, and those who walk the edge between the Spirit stream and its forbidden corruptions (Necromancy, Soul Magic).

**Gameplay Identity:** Shadow is the offensive counterpart to Enchantment. Where Enchantment protects and strengthens, Shadow weakens and terrifies. Fear effects cause enemies to flee, drains transfer HP from enemy to caster, curses apply long-lasting debuffs, and darkness zones blind enemies within them. Lower burst damage than Elements but unmatched sustained control.

**Iconic Mechanic — Creeping Dread:** Shadow debuffs stack in intensity. Each Shadow spell applied to the same enemy increases the severity of all existing Shadow effects on it. Three stacks of Fear escalate from "occasional skipped turn" to "fleeing in panic." This rewards focusing Shadow magic on priority targets rather than spreading it thin.

---

### Acceptance Criteria

- [ ] All 7 schools are defined as distinct SpellSchool types in the spell system
- [ ] Each school has a unique color palette applied to its spell effects in the ASCII renderer
- [ ] Each school has at least 7 spells across tiers (see `spell-catalog.md` for full list)
- [ ] Each school's iconic mechanic is implemented and functional
- [ ] School identity is displayed in the spell menu (icon, color, description)
- [ ] Spells are tagged with exactly one school; the tag drives interactions (US-MS-10), mastery (US-MS-16), and learning requirements
- [ ] The HUD spell list groups or filters spells by school
- [ ] Academy houses (Pyraclaw, Ironveil, Verdantia, Glimmershade) teach their respective schools and no others

---

## US-MS-10: School Interactions and Oppositions

**As a** player,
**I want** spell schools to have meaningful interactions — oppositions, weaknesses, synergies, and counters,
**so that** I am rewarded for understanding the magic system and planning my spell usage tactically.

### Details

#### Elemental Oppositions

Within and between schools, certain forces oppose each other:

| Force A | Force B | Relationship |
|---------|---------|-------------|
| Fire (Elements) | Ice (Elements) | Opposing elements |
| Lightning (Elements) | Earth/Stone (Alchemy) | Opposing elements |
| Light (Restoration/Enchantment) | Shadow | Opposing schools |
| Order (Enchantment) | Chaos (Conjuration) | Philosophical opposition |
| Life (Restoration) | Death (Necromancy — forbidden) | Fundamental opposition |

#### Counter-Spell Effectiveness

When using a counter-spell or dispel against an incoming spell:
- **Opposing school counters** are **2x effective** (costs half the mana to counter, or counters spells up to 2 tiers higher)
- **Same school counters** are **1.5x effective** (familiarity advantage)
- **Neutral school counters** are **1x effective** (base counter rate)
- **Synergistic school counters** are **0.5x effective** (the magic reinforces rather than cancels)

#### Elemental Weaknesses

Enemies (and the player) can have elemental affinities. An affinity grants resistance to that element but vulnerability to its opposite:

| Affinity | Resists (0.5x damage) | Vulnerable (1.5x damage) |
|----------|----------------------|--------------------------|
| Fire | Fire, Burn effects | Ice spells, Freeze effects |
| Ice | Ice, Freeze effects | Fire spells, Burn effects |
| Lightning | Lightning, Shock | Earth/Stone (Alchemy transmutation) |
| Earth | Earth, Petrify | Lightning spells |
| Light | Restoration, Enchantment buffs | Shadow spells, Curses |
| Shadow | Shadow, Fear, Curses | Restoration, Enchantment dispels |

#### Combo Synergies

Casting spells from complementary schools in sequence (within 3 turns) triggers combo bonuses:

| Combo | Schools | Effect |
|-------|---------|--------|
| **Empowered Strike** | Enchantment (weapon buff) + Elements (attack) | +30% damage on the elemental attack |
| **Fortified Healing** | Enchantment (ward) + Restoration (heal) | Ward gains +50% durability |
| **Revealing Flame** | Divination (detect) + Elements (fire) | Fire spell ignores enemy evasion |
| **Toxic Transmutation** | Alchemy (poison/acid) + Shadow (curse) | Poison/acid duration doubled |
| **Guided Summon** | Divination (foresight) + Conjuration (summon) | Summoned creature gains +25% stats |
| **Shadow Veil** | Shadow (darkness) + Conjuration (illusion) | Illusion is undetectable for its full duration |
| **Nature's Wrath** | Restoration (regeneration on self) + Alchemy (terrain transmute) | Transmuted terrain also applies regeneration to allies standing on it |

### Acceptance Criteria

- [ ] Opposing school counter-spells are 2x effective (half mana cost or +2 tier reach)
- [ ] Same-school counters are 1.5x effective
- [ ] Enemies with elemental affinities take 1.5x damage from opposing elements and 0.5x from their own
- [ ] Player elemental affinity (if acquired via items/buffs) follows the same rules
- [ ] Casting complementary school spells within 3 turns triggers the correct combo bonus
- [ ] Combo bonuses are displayed in the combat log with a distinct color/label
- [ ] The spell menu indicates which combos are currently available (based on recent casts)
- [ ] Opposition/synergy data is defined in a data structure (not hardcoded per-spell)

---

## US-MS-11: Forbidden School — Blood Magic

**As a** player,
**I want** to discover and wield Blood Magic — a forbidden school that costs HP instead of mana,
**so that** I have a high-risk, high-reward alternative magic path with meaningful moral consequences.

### Details

**Lore:** Blood Magic is the oldest mortal magical tradition. It draws on the caster's life force (a remnant of Ira-Sethi's original gift of life-energy), bypassing the Ascended entirely. The Ascended fear it because it proves divinity is not required for power. The Blood Singers tradition preserves this art in secret.

**Resource:** HP, not mana. Blood spells cost a percentage of current or max HP. This makes Blood Magic accessible to non-mage classes (no mana pool required) but inherently dangerous.

#### Spells (7 spells, tiered)

| Spell | Tier | HP Cost | Effect |
|-------|------|---------|--------|
| **Blood Bolt** | 1 | 8% current HP | Ranged attack, moderate damage. Ignores magic resistance (it is not Ley Line magic). |
| **Hemorrhage** | 2 | 12% current HP | Single target — enemy bleeds for 5 turns (damage per turn, stacks with reapplication). |
| **Blood Shield** | 2 | 15% max HP | Creates a barrier that absorbs damage equal to the HP spent. Lasts 8 turns. |
| **Sanguine Whip** | 3 | 10% current HP | Melee-range attack that heals the caster for 50% of damage dealt. |
| **Blood Pact** | 4 | 25% max HP | Sacrifice HP to massively buff ATK and speed for 10 turns. |
| **Crimson Tide** | 5 | 20% current HP | AoE — all enemies in a 3-tile radius take heavy damage and are slowed. |
| **Heart Stop** | 6 | 30% max HP | Single target — attempts to instantly kill a non-boss enemy (WIL check vs. target VIT). On failure, still deals massive damage. |

#### Blood Frenzy Passive

When the caster is below **25% HP**, Blood Frenzy activates:
- Blood spell HP costs are reduced by **50%**
- Blood spell damage/effect potency increased by **50%**
- Visual indicator: screen border flickers red, character glyph pulses

This creates a risk/reward loop: spending HP on blood spells brings you closer to Blood Frenzy, which makes the spells cheaper and stronger, but leaves you vulnerable to death.

#### Moral Consequences

- Each Blood Magic cast shifts the player's alignment toward **dark** (minor per cast, cumulative)
- At high Blood Magic usage: temple NPCs refuse healing services, Thaumaturge NPCs become hostile, Inquisitor encounters increase
- Blood Magic use is tracked as a hidden stat; certain dialogue options and quest branches unlock (or close) based on it
- The alignment shift is **not** reversible through Restoration magic — only through narrative choices and quest completion

#### Learning Sources

Blood Magic **cannot** be learned at any institution. Sources:
- Forbidden texts found in hidden locations (dungeons, restricted library sections)
- Blood Singer NPCs encountered in the wild or underground
- Desperate experimentation: at critically low HP near a Ley Line dead zone, a one-time event can teach Blood Bolt
- Each subsequent spell requires finding a new source or advancing Blood Singer reputation

#### Visual Identity

- Deep red `*` projectiles and `%` blood splatter effects
- Screen border briefly flickers red on cast
- Blood Shield renders as dark red `O` around the caster
- Blood Frenzy: character glyph alternates between normal and red-highlighted each turn

### Acceptance Criteria

- [ ] All 7 Blood Magic spells are implemented with HP-based costs (not mana)
- [ ] HP costs are calculated correctly (percentage of current HP or max HP as specified)
- [ ] Blood Frenzy activates at 25% HP: costs reduced 50%, potency increased 50%
- [ ] Blood Frenzy visual indicator (red border flicker) displays correctly
- [ ] Alignment shifts toward dark with each Blood Magic cast
- [ ] Temple NPCs track Blood Magic usage and refuse services at high usage
- [ ] Blood Magic spells ignore standard magic resistance (they bypass Ley Lines)
- [ ] Blood Magic cannot be learned from Academy, temples, or standard spell vendors
- [ ] At least 3 distinct learning sources exist in the game world
- [ ] Heart Stop instant-kill performs a WIL vs. VIT check; bosses are immune to the instant-kill effect
- [ ] Blood Magic spells use the deep red ASCII visual effects
- [ ] Save/load correctly persists Blood Magic learned spells and usage counter

---

## US-MS-12: Forbidden School — Necromancy

**As a** player,
**I want** to discover Necromancy — a forbidden school that corrupts Spirit and Matter to raise the dead and drain life,
**so that** I can pursue a dark power fantasy with significant gameplay and social consequences.

### Details

**Lore:** Necromancy perverts two streams simultaneously — Spirit (Pho-Lumen's gift of consciousness) and Matter (Dro-Mahk's gift of substance) — forcing awareness back into dead flesh. The Ascended publicly condemn it but secretly tolerate it because necromantic energy strengthens the cage around Xal-Nepheth (death energy and void energy are opposites).

**Resource:** Mana + corpse availability. Most Necromancy spells require standard mana. Raise Dead and its variants additionally require a corpse on or adjacent to the caster's tile.

#### Spells (7 spells, tiered)

| Spell | Tier | Cost | Effect |
|-------|------|------|--------|
| **Life Tap** | 1 | 15 mana | Drain HP from target enemy, healing caster for 50% of damage dealt. Range: 3 tiles. |
| **Bone Shield** | 2 | 20 mana | Summon a ring of bone fragments that absorb the next 3 hits (any damage). Lasts 10 turns. |
| **Corpse Explosion** | 3 | 25 mana + corpse | Detonate a corpse on an adjacent tile. All enemies within 2 tiles take heavy damage. Corpse consumed. |
| **Wither** | 3 | 30 mana | Single target — reduce enemy ATK and DEF by 30% for 8 turns. Living targets also lose HP per turn. |
| **Raise Dead** | 4 | 40 mana + corpse | Reanimate a corpse as an undead ally. Stats based on the original creature (50% of original). Lasts 15 turns or until destroyed. Max 2 active undead. |
| **Plague Cloud** | 5 | 50 mana | AoE 3x3: enemies in the cloud take poison damage per turn and have a 30% chance per turn to be stunned. Cloud lasts 4 turns. |
| **Army of the Dead** | 6 | 80 mana + all corpses in range | Raise ALL corpses within 5 tiles as undead allies (50% original stats). Lasts 10 turns. No maximum count. |

#### Corpse Mechanic

- When an enemy dies, its tile is marked as containing a corpse (rendered as grey `,` on the map)
- Corpses persist for 20 turns, then decay (disappear)
- Corpse-consuming spells remove the corpse marker
- Corpses block new enemy spawns on that tile
- Player can see corpse locations in their FOV

#### Moral Consequences

Necromancy carries the **strongest standard alignment shift** among mana-based forbidden schools:
- Each Necromancy cast shifts alignment significantly toward dark
- **Temple consequences:** All temple NPCs refuse service after moderate Necromancy use
- **NPC hostility:** Inquisitor NPCs become immediately hostile on sight if the player has raised undead in their presence
- **Faction impact:** Reputation with religious factions drops sharply; reputation with underground factions (Crimson Pact, Root Singers) increases slightly
- **Unique consequence:** Undead allies unnerve living NPC companions, reducing their morale and effectiveness

#### Learning Sources

- Hidden NPCs in deep dungeons (necromancer lairs)
- Forbidden section of the Academy library (lore books that teach Life Tap only; advanced spells require seeking out practitioners)
- Dark artifacts that grant a spell on equip (but cannot be unlearned once used)
- Completing certain morally grey quest chains

#### Visual Identity

- Grey/bone-white `%` for bone effects, dark green `~` for plague
- Raised undead rendered as grey versions of their original glyph (e.g., grey `s` for a skeleton from a slime corpse)
- Corpse Explosion: expanding ring of grey `*` and red `.`
- Wither: target glyph dims/flickers for the duration

### Acceptance Criteria

- [ ] All 7 Necromancy spells are implemented with mana costs
- [ ] Corpse system tracks dead enemy positions; corpses render as grey `,`
- [ ] Corpses decay after 20 turns
- [ ] Raise Dead and Army of the Dead require corpses and consume them
- [ ] Raised undead have 50% of original creature stats and act as AI-controlled allies
- [ ] Maximum 2 active undead from Raise Dead (no limit for Army of the Dead)
- [ ] Alignment shift is heavier than Blood Magic per cast
- [ ] Temple NPCs refuse service at moderate Necromancy usage threshold
- [ ] Inquisitor NPCs become hostile if undead are raised in their presence
- [ ] At least 3 distinct learning sources exist
- [ ] Necromancy visual effects use the grey/bone-white/dark-green palette
- [ ] Save/load correctly persists corpse positions, active undead, and Necromancy usage counter

---

## US-MS-13: Forbidden School — Void Magic

**As a** player,
**I want** to discover Void Magic — the most powerful and most dangerous forbidden school, drawing power from the Void Serpent,
**so that** I can access reality-breaking abilities at the cost of my character's sanity.

### Details

**Lore:** Void Magic draws power from Xal-Nepheth, the Void Serpent caged beneath the world. It is the one forbidden school the Ascended suppress for genuinely legitimate reasons — each Void spell weakens the cage slightly. The Void Touched tradition preserves this knowledge, and the Void Serpent itself whispers fragments of truth (and power) to those who listen. Void Magic can see through divine deception, making it existentially threatening to the Ascended's secret.

**Resource:** Mana + Sanity. Each Void spell costs mana AND reduces the caster's Sanity stat. Maximum Sanity = WIL x 5. Sanity regenerates slowly (1 per rest, 2 near Ley Line nexuses). Sanity cannot be restored by Restoration magic.

#### Spells (7 spells, tiered)

| Spell | Tier | Mana Cost | Sanity Cost | Effect |
|-------|------|-----------|-------------|--------|
| **Void Bolt** | 1 | 15 | 3 | Ranged attack that deals damage ignoring armor and magic resistance. Damage type: void (nothing resists it, nothing is vulnerable). |
| **Null Zone** | 2 | 25 | 5 | Create a 3x3 anti-magic area for 5 turns. No spells (ally or enemy) can be cast within. Existing magical effects are suppressed. |
| **Void Step** | 3 | 20 | 4 | Teleport up to 8 tiles, passing through walls and enemies. Cannot land inside a wall. Brief invulnerability during transit. |
| **Entropy** | 3 | 30 | 6 | Single target — apply accelerating damage over time. Starts at 2 damage/turn; doubles each turn for 5 turns (2, 4, 8, 16, 32). |
| **Void Gaze** | 4 | 35 | 8 | For 10 turns: see through walls (full map visibility in FOV range), see invisible/illusory enemies, see enemy HP/stats. |
| **Annihilation** | 5 | 60 | 12 | Single target — massive void damage. The highest single-target damage in the game. Leaves a Void Scar on the tile (permanent anti-magic zone, 1 tile). |
| **Void Shield** | 6 | 50 | 10 | Absorb the next instance of damage regardless of type or amount. Lasts until triggered or 15 turns. Only one can be active. |

#### Sanity System

| Sanity Level | Threshold | Effects |
|-------------|-----------|---------|
| **Stable** | 75-100% | No effects |
| **Uneasy** | 50-74% | Occasional whisper messages in the combat log (Void Serpent flavor text) |
| **Disturbed** | 25-49% | Visual distortions: random tiles briefly flicker to void glyphs. 10% chance per turn of a hallucinated enemy appearing (deals no real damage but the player cannot tell) |
| **Fractured** | 1-24% | Constant whispers. 25% chance of hallucinated enemies. Random stat fluctuations (+/- 2 to any stat each turn). Screen occasionally inverts colors (1 turn). |
| **Shattered** | 0% | Cannot cast Void spells. All other spells cost 50% more mana. Permanent hallucinated enemy presence until sanity recovers above 0. |

Sanity recovery:
- **Rest:** +1 sanity per rest action
- **Ley Line proximity:** +2 sanity per rest near a Ley Line nexus
- **Time:** +1 sanity per 50 turns of not casting Void spells
- **Restoration magic does NOT restore sanity** (it is not a physical or magical ailment — it is existential damage)

#### Learning Sources (Endgame Content)

Void Magic is the hardest school to learn. Sources:
- **Void Scars:** Meditating at a Void Scar location triggers a sanity-check event. Success teaches Void Bolt.
- **Ancient texts:** Extremely rare dungeon loot in deep levels (15+). Each text teaches one spell.
- **The Void Serpent's whispers:** At low sanity (below 25%), the Void Serpent offers to teach spells directly — but each lesson costs additional permanent max sanity reduction (-5 max sanity).
- **Void Touched NPCs:** Exceedingly rare encounters. Will teach one spell in exchange for a quest or sacrifice.

#### Visual Identity

- Dark purple/black `*` void projectiles that briefly erase the tile they cross (render as empty space for 1 frame)
- Null Zone: 3x3 area of dim/darkened tiles with flickering `_` borders
- Void Step: brief trail of empty tiles between origin and destination
- Annihilation: target tile permanently rendered as dark `X` (Void Scar)
- Void Shield: dark purple `O` orbiting the caster

### Acceptance Criteria

- [ ] All 7 Void Magic spells are implemented with mana + sanity dual cost
- [ ] Sanity stat exists on GameState: max = WIL x 5, tracked and persisted
- [ ] Sanity level thresholds trigger the correct visual/gameplay effects
- [ ] Hallucinated enemies appear at low sanity; they are visually indistinguishable from real enemies
- [ ] Sanity regenerates via rest (+1), Ley Line proximity (+2), and time (+1 per 50 turns)
- [ ] Restoration magic explicitly does NOT restore sanity
- [ ] Void Bolt ignores armor and magic resistance
- [ ] Null Zone suppresses all spell casting and existing magical effects in its area
- [ ] Void Step allows passage through walls (but not landing inside walls)
- [ ] Entropy damage correctly doubles each turn (2, 4, 8, 16, 32)
- [ ] Annihilation creates a permanent Void Scar tile
- [ ] Void Gaze reveals through walls and shows enemy stats
- [ ] Void Shield absorbs one hit of any size, then dissipates
- [ ] At least 4 distinct learning sources exist; Void Serpent whisper-learning costs permanent max sanity
- [ ] Visual effects use the dark purple/black/void palette
- [ ] Save/load correctly persists sanity, max sanity modifications, and Void Scar tile positions

---

## US-MS-14: Forbidden School — Chronomancy

**As a** player,
**I want** to discover Chronomancy — forbidden time magic that manipulates turns, undoes damage, and breaks the action economy,
**so that** I can access the most tactically powerful forbidden school at the cost of accumulating dangerous paradox.

### Details

**Lore:** Chronomancy is forbidden because Tho-Rienne's temporal Ley Lines are the most damaged of the seven streams. Every use of Chronomancy widens cracks in the temporal fabric. The Ascended suppress it not only to protect the timeline but because time magic is the most likely to reveal historical truths they want buried. Orinthas (the Ascended who controls the Time stream) was a foolish king whose incompetence destroyed the Luminari civilization — Chronomancy can reveal this.

**Resource:** Mana + Paradox. Each Chronomancy spell costs mana and generates Paradox points. Maximum Paradox tolerance = WIL x 3. Paradox decays naturally (1 point per 10 turns).

#### Spells (7 spells, tiered)

| Spell | Tier | Mana Cost | Paradox Generated | Effect |
|-------|------|-----------|-------------------|--------|
| **Haste** | 1 | 15 | 2 | Self buff — gain an extra action per turn for 5 turns. |
| **Slow** | 2 | 20 | 3 | Single target enemy — target acts every other turn for 6 turns. |
| **Temporal Sense** | 2 | 15 | 2 | For 8 turns: the combat log shows each visible enemy's next intended action before they act. |
| **Rewind** | 3 | 35 | 6 | Undo the last 3 turns of damage to self. HP is restored to what it was 3 turns ago (if higher). Does not undo position, status effects, or mana spent. |
| **Time Stop** | 4 | 50 | 10 | Freeze ALL enemies for 2 turns. Player acts freely. Enemies cannot be damaged during Time Stop (they are outside the time stream) but can be repositioned around and debuffed. |
| **Age** | 5 | 45 | 8 | Single target — rapidly age a living target. Massive damage to living enemies; reduced effect on undead, constructs, and elementals. Visually: target glyph changes color to grey. |
| **Paradox** | 6 | 60 | 15 | Summon a temporal copy of yourself for 5 turns. The copy has 100% of your stats, can cast any spell you know (costs your mana), and acts independently with basic AI. Only one copy at a time. |

#### Paradox System

| Paradox Level | Threshold | Effects |
|-------------- |-----------|---------|
| **Stable** | 0-25% | No effects |
| **Flickering** | 26-50% | Occasional turn-skip glitches: 5% chance per turn that the player's turn is skipped (displayed as "Time stutters...") |
| **Unstable** | 51-75% | Turn-skip chance increases to 15%. Temporary random stat changes (+/- 3 to a random stat for 3 turns, each turn). Timeline echoes: ghostly versions of enemies from 5 turns ago briefly appear (visual only, no gameplay effect). |
| **Critical** | 76-99% | Turn-skip chance 25%. Stat fluctuations constant. 10% chance per turn of a **Temporal Anomaly** spawning: a hostile enemy from a random timeline (scaled to player level) appears adjacent to the player. |
| **Paradox Collapse** | 100% | Immediate: all active Chronomancy effects end. Player is stunned for 3 turns. All Paradox resets to 0. One random stat permanently reduced by 1 (until next level-up). |

Paradox decay:
- **Natural:** -1 paradox per 10 turns
- **Rest:** -5 paradox per rest action
- **Ley Line nexus:** -10 paradox per rest near a Time-aligned Ley Line nexus
- **No spell or item can directly reduce Paradox** (time damage cannot be magicked away)

#### Learning Sources (Extremely Rare)

- **Time anomalies:** Rare dungeon events where time visibly distorts. Interacting teaches Haste (first anomaly) or Slow (second).
- **The Timeless Wastes:** A specific overworld region where Tho-Rienne's lines are most damaged. Exploring deep within reveals Chronomancy texts.
- **Orinthas's hidden texts:** Lore items scattered in ancient Luminari ruins. Each teaches one advanced spell.
- **The Temporal Observatory:** A hidden dungeon that serves as the Chronomancy endgame learning location.

#### Visual Identity

- Blue-white `>` and `<` for haste/slow effects (arrows indicating time direction)
- Rewind: brief reverse-animation of recent combat log messages
- Time Stop: all enemy glyphs rendered in dim/frozen appearance; a blue border on the screen
- Age: target glyph transitions from its normal color to grey
- Paradox copy: a flickering duplicate of the player glyph (alternates visible/invisible each frame)
- Temporal Anomalies: glitchy, color-shifting enemy glyphs

### Acceptance Criteria

- [ ] All 7 Chronomancy spells are implemented with mana + paradox dual cost
- [ ] Paradox stat exists on GameState: max tolerance = WIL x 3, tracked and persisted
- [ ] Paradox level thresholds trigger the correct effects (turn skips, stat changes, anomaly spawns)
- [ ] Paradox decays at 1 per 10 turns naturally, 5 per rest, 10 per rest at Time nexus
- [ ] Paradox Collapse triggers at 100%: stun 3 turns, end effects, reduce random stat by 1
- [ ] Haste grants an extra action per turn for 5 turns
- [ ] Slow causes target to act every other turn for 6 turns
- [ ] Temporal Sense displays enemy next-actions in the combat log
- [ ] Rewind restores HP to the value from 3 turns ago (engine must track HP history)
- [ ] Time Stop freezes enemies for 2 turns; frozen enemies cannot be damaged
- [ ] Age deals massive damage to living targets; reduced effect on undead/constructs
- [ ] Paradox summons a copy with full player stats and independent AI
- [ ] At least 3 distinct learning sources exist in the game world
- [ ] Visual effects use the blue-white/temporal palette
- [ ] Save/load correctly persists paradox level, HP history (for Rewind), and temporal copy state

---

## US-MS-15: Forbidden School — Soul Magic

**As a** player,
**I want** to discover Soul Magic — the most morally consequential forbidden school, which manipulates consciousness and harvests souls,
**so that** I can wield tremendous power while confronting the ethical weight of using sentient energy as a resource.

### Details

**Lore:** Soul Magic accesses the Spirit stream (Pho-Lumen / Aelith) so deeply that it touches the original Ley Line essence beneath the Ascended's filter. Practitioners sometimes glimpse fragments of truth about Aelith — who was a mother that abandoned her children. Soul gems, the school's unique resource, contain actual fragments of consciousness. They are, in a very real sense, sentient. Using them is a choice the game does not make for the player.

**Resource:** Mana + Soul Gems. Soul Gems are harvested from defeated enemies using Soul Trap. They are consumed by advanced Soul Magic spells. Each soul gem retains the identity of the creature it was harvested from (displayed as "Soul Gem (Goblin)" etc.).

#### Spells (7 spells, tiered)

| Spell | Tier | Mana Cost | Soul Gem Cost | Effect |
|-------|------|-----------|---------------|--------|
| **Soul Sight** | 1 | 10 | 0 | Reveal target enemy's full stats: HP, ATK, DEF, resistances, abilities, weaknesses. Lasts until the enemy dies or leaves FOV. |
| **Soul Rend** | 2 | 25 | 0 | Single target — deal damage that **bypasses armor and magic resistance entirely**. Pure soul damage. Moderate base damage but nothing reduces it. |
| **Soul Trap** | 2 | 20 | 0 | Must be cast on an enemy within 3 turns of its death (or as a killing blow). Captures its soul in a gem. Gem added to inventory. |
| **Soul Transfer** | 3 | 40 | 1 | Possess a non-boss enemy for 5 turns. Player controls the enemy's body (using its stats/abilities). Player's body is vulnerable and unconscious during possession. |
| **Soul Shield** | 4 | 30 | 1 | Absorb all incoming damage as soul energy for 8 turns. Damage absorbed is stored; when the shield expires, 50% of stored damage is dealt to the nearest enemy. |
| **Soul Devour** | 5 | 20 | 1-3 | Consume 1-3 soul gems. Per gem: heal 25% max HP and gain +2 to a random stat for 20 turns. Stacks. |
| **Soulless** | 6 | 80 | 3 | Single target — remove the target's will. Non-boss enemies are permanently stunned (effectively removed from combat without killing). Bosses are immune. The target's glyph turns grey and it stands motionless. |

#### Soul Gem System

- Soul Gems are inventory items with a name tag (e.g., "Soul Gem (Fire Elemental)")
- Maximum soul gem capacity: 10 (spiritual carrying capacity)
- Soul gems can be viewed in inventory; each displays the creature's name and a brief flavor text ("A faint warmth pulses within..." / "You hear distant screaming...")
- Soul gems are **consumed** by spells that cost them; consumed gems are gone permanently
- Unused soul gems can be sold to dark merchants for high prices (further moral dimension)
- NPCs with Spirit sensitivity (certain Primordialists, Void Touched) will comment on the player carrying soul gems

#### Moral Consequences

Soul Magic carries the **heaviest moral weight** of all forbidden schools:
- Each Soul Trap cast shifts alignment toward dark (moderate)
- Each Soul Devour/Soulless cast shifts alignment toward dark (heavy)
- Soul Sight and Soul Rend are alignment-neutral (observation and combat, no soul consumption)
- **Temple consequences:** All temples and religious NPCs refuse service after any soul gem consumption
- **Companion consequences:** Good-aligned companions will object to Soul Magic use; continued use causes them to leave
- **Unique NPC reactions:** Spirit-sensitive NPCs can detect soul gems in the player's inventory and react with horror, fascination, or bargaining
- **Endgame flag:** Extensive Soul Magic use unlocks unique dialogue options with Aelith-related lore encounters

#### Learning Sources

- **Spirit stream corruption events:** Rare dungeon events where the Spirit Ley Line is visibly corrupted. Interacting teaches Soul Sight.
- **Void Touched contacts:** Certain Void Touched NPCs know Soul Magic as a secondary discipline. They teach it in exchange for favors.
- **Dark artifacts:** Soul gems found in ancient tombs occasionally "teach" the player Soul Trap on first contact.
- **The Soul Wellspring:** A hidden endgame location tied to Aelith/Pho-Lumen lore. Contains the most advanced Soul Magic texts.

#### Visual Identity

- White/pale blue `o` for soul gems (faintly pulsing)
- Soul Rend: white `\` slash effect that passes through the target
- Soul Trap: spiraling white `.` particles converging on the target's position
- Soul Transfer: player glyph dims, possessed enemy glyph gains a white border/highlight
- Soul Devour: consumed gem `o` shatters into white `*` fragments absorbed by the player
- Soulless: target glyph turns grey and static

### Acceptance Criteria

- [ ] All 7 Soul Magic spells are implemented with mana + soul gem costs
- [ ] Soul Gem inventory system: items with creature name tags, max capacity 10
- [ ] Soul Trap requires casting within 3 turns of enemy death (or as killing blow)
- [ ] Soul Rend bypasses armor and magic resistance completely
- [ ] Soul Transfer allows player to control an enemy body for 5 turns; player body is vulnerable
- [ ] Soul Shield absorbs damage for 8 turns and releases 50% as damage on expiry
- [ ] Soul Devour consumes 1-3 gems: heals 25% max HP per gem and grants +2 random stat per gem
- [ ] Soulless permanently stuns non-boss enemies; bosses are immune
- [ ] Moral consequences: alignment shifts are heavier than any other forbidden school for soul consumption spells
- [ ] Temple NPCs refuse service after soul gem consumption
- [ ] Spirit-sensitive NPCs react to soul gems in inventory
- [ ] At least 4 distinct learning sources exist
- [ ] Visual effects use the white/pale-blue soul palette
- [ ] Save/load correctly persists soul gem inventory (with creature names) and Soul Magic usage counter

---

## US-MS-16: School Mastery and Cross-School Magic

**As a** player,
**I want** a mastery progression system for spell schools and the ability to combine spells across schools,
**so that** my investment in magic feels rewarding over time and I can eventually access powerful cross-school abilities.

### Details

#### Mastery Tiers

Each of the 7 arcane schools has 3 mastery tiers. Mastery determines which spell tiers are accessible:

| Mastery Tier | Accessible Spell Tiers | Passive Bonus |
|-------------|----------------------|---------------|
| **Novice** | Tier 1-2 | None |
| **Adept** | Tier 1-4 | School-specific passive (see below) |
| **Master** | Tier 1-6 (all) | School-specific mastery passive (see below) |

#### Mastery Advancement

- Mastery XP is earned by **casting spells from that school** (not by reading books or leveling up)
- Each spell cast grants mastery XP proportional to the spell's tier: Tier 1 = 5 XP, Tier 2 = 10 XP, Tier 3 = 20 XP, Tier 4 = 35 XP, Tier 5 = 55 XP, Tier 6 = 80 XP
- Mastery thresholds: Novice → Adept at **200 XP**, Adept → Master at **800 XP**
- Mastery XP is tracked per school independently

#### Class Affinity

- **Mage class:** Gains mastery XP at **1.5x rate** in all schools (natural magical aptitude)
- **Warrior class:** Gains mastery XP at **0.5x rate** in all schools **except Elements** (which is 1.0x — warriors understand destructive force)
- **Rogue class:** Gains mastery XP at **0.5x rate** in all schools **except Shadow** (which is 1.0x — rogues have natural affinity for shadow arts)
- Other classes (if added): defined per class in the class system epic

#### Adept Passives (per school)

| School | Adept Passive |
|--------|--------------|
| Elements | **Elemental Attunement:** +10% damage with your most-cast element (fire, ice, or lightning) |
| Enchantment | **Persistent Wards:** Wards last 3 additional turns |
| Restoration | **Healing Efficiency:** Healing spells restore 15% more HP |
| Divination | **Lingering Foresight:** Foresight Counter bonus window extended from 1 turn to 2 turns |
| Alchemy | **Efficient Transmutation:** Alchemy spell mana costs reduced by 15% |
| Conjuration | **Empowered Summons:** Summoned creatures gain +20% HP and ATK |
| Shadow | **Deepening Dread:** Creeping Dread stacks build 50% faster |

#### Master Passives (per school)

| School | Master Passive |
|--------|---------------|
| Elements | **Elemental Mastery:** Can cast two different elements in the same turn (e.g., Fire + Ice combo). Triggers unique Elemental Clash effect: AoE damage at the intersection point. |
| Enchantment | **Unbreakable Will:** Maximum ward layers increased from 3 to 5. Wards regenerate 10% of their absorbed damage each turn. |
| Restoration | **Font of Life:** Overheal Shield cap doubled. When the player heals an ally, the player also heals for 25% of the amount. |
| Divination | **Temporal Mastery:** Haste/Slow durations doubled. Foresight Counter bonus increased to +75%. |
| Alchemy | **Philosopher's Insight:** Transmute Terrain effects are permanent (do not revert). Alchemy combat spells have a 20% chance to apply a random secondary effect (poison, slow, or corrode). |
| Conjuration | **Planar Authority:** Maximum summons increased by 1. Summons gain the ability to cast one Tier 1 spell from any school the player knows. |
| Shadow | **Umbral Dominion:** At 5 Creeping Dread stacks, the target is automatically Feared (no save). Shadow drain spells heal for 75% instead of 50%. |

#### Cross-School Casting — Spell Weaving

When the player has learned spells from **3 or more different schools**, the Spell Weaving system unlocks:

- **Spell Weaving:** On the spell menu, the player can select two spells from different schools and cast them as a single combined action. The combined spell costs 150% of both spells' mana costs combined (premium for the power of combination).
- **Hybrid effects:** The combined spell applies both effects simultaneously and gains a bonus based on the school combination (see combo table in US-MS-10).
- **Cooldown:** Spell Weaving has a 5-turn cooldown after each use (separate from individual spell cooldowns).
- **Unlocks progressively:** 3 schools learned = can weave Tier 1-2 spells. 5 schools = Tier 1-4. All 7 schools = any tier.

#### The Convergence

**Lore-critical endgame content.** A character who achieves **Master** rank in all 7 arcane schools can access a hidden spell:

- **Convergence:** Channels all seven Ley Line streams simultaneously. The effect depends on the narrative context in which it is cast (it is a lore event, not a standard combat spell). When cast, the player briefly accesses the raw Ley Lines beneath the Ascended's filter — and sees the truth.
- **This connects to the Convergence Prophecy** (see lore docs `05-magic-system.md` and `14-prophecies-and-endtimes.md`): "all streams become one river, all voices become one song, and the Singer unmakes the Mask."
- Convergence is **not** required to complete the game. It is an optional endgame achievement that unlocks unique lore and an alternate ending path.
- Learning Convergence triggers a unique cutscene/dialogue sequence revealing key lore about the Ascended and the Original Seven.

#### Forbidden School Mastery

Forbidden schools (Blood, Necromancy, Void, Chronomancy, Soul) also track mastery but use separate thresholds and do not contribute to the Convergence requirement:
- Forbidden mastery thresholds: Novice → Adept at **300 XP**, Adept → Master at **1200 XP** (higher than standard schools due to the power of forbidden magic)
- Forbidden school passives are not defined here (see their respective user stories and `29-forbidden-magic` epic for endgame forbidden mastery content)
- Class affinity modifiers do not apply to forbidden schools (all classes learn them at 1.0x rate — forbidden magic is outside normal tradition)

### Acceptance Criteria

- [ ] Mastery system tracks per-school XP independently for all 7 arcane schools
- [ ] Casting a spell grants mastery XP to its school (Tier 1 = 5 XP through Tier 6 = 80 XP)
- [ ] Mastery tiers gate spell access: Novice (Tier 1-2), Adept (Tier 1-4), Master (Tier 1-6)
- [ ] Mastery tier transitions (Novice → Adept at 200 XP, Adept → Master at 800 XP) trigger a notification
- [ ] Class affinity modifiers apply correctly: Mage 1.5x, Warrior 0.5x (1.0x Elements), Rogue 0.5x (1.0x Shadow)
- [ ] All 7 Adept passives are implemented and activate upon reaching Adept tier
- [ ] All 7 Master passives are implemented and activate upon reaching Master tier
- [ ] Spell Weaving unlocks when 3+ schools have at least 1 learned spell
- [ ] Spell Weaving correctly combines two spells: applies both effects, costs 150% combined mana, 5-turn cooldown
- [ ] Spell Weaving tier limits: 3 schools = Tier 1-2, 5 schools = Tier 1-4, 7 schools = all tiers
- [ ] Convergence spell unlocks when all 7 arcane schools reach Master rank
- [ ] Convergence triggers a lore sequence (not a standard damage spell)
- [ ] Forbidden school mastery is tracked separately with higher thresholds (300/1200 XP)
- [ ] Forbidden school mastery does not count toward Convergence
- [ ] Mastery XP, tiers, and passives persist correctly through save/load
- [ ] The spell menu or character sheet displays current mastery tier and XP progress for each known school
