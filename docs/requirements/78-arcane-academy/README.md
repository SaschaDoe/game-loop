# Epic 78: Arcane Academy

## Overview

The Arcane Academy is a full magical education experience. Players enroll as students, attend real classes across four schools of magic, build relationships with classmates (friends, rivals, neutral observers), explore the campus, complete quests, uncover the school's history, and graduate through a challenging final exam.

**Supersedes:** `ascii-rpg/docs/requirements/17-academy/arcane-academy-game-loop.md` (original 11 user stories, now expanded)

## Design Pillars

1. **Learn Real Mechanics** — Every lesson teaches something the player actually uses (spells, alchemy recipes, combat techniques). No decorative trivia.
2. **Living School** — NPCs have routines, opinions, relationships. The school feels inhabited, not static.
3. **Discoverable History** — The Academy has layers of secrets. Curious players find more. Nothing is dumped.
4. **Class-Aware** — Non-mages get unique dialogue, challenges, and reactions. A Warrior at magic school is unusual and the world acknowledges it.
5. **Player Agency** — Choices matter. Befriend Elara or report her. Help Rod or mock him. Challenge Dorian or ignore him.

## Feature Areas

| File | Area | Stories |
|------|------|---------|
| `enrollment-and-progression.md` | Enrollment, calendar, class schedule, graduation | US-AA-01 to US-AA-08 |
| `curriculum-and-lessons.md` | 8 real lessons across 4 schools, spells learned, alchemy brewed | US-AA-09 to US-AA-20 |
| `magic-system-integration.md` | Academy-specific magic (references Epic 79 for base system) | US-AA-21 to US-AA-26 |
| `classmates-and-relationships.md` | 4 key NPCs: Rod, Elara, Fenn, Dorian — friendship/rivalry arcs | US-AA-33 to US-AA-44 |
| `quests.md` | Main quest chain (10) + side quests (8+) | US-AA-45 to US-AA-62 |
| `campus-and-exploration.md` | Campus layout, sealed wing, ancient ward, library secrets | US-AA-63 to US-AA-72 |
| `final-exam-and-graduation.md` | Multi-part exam, graduation ceremony, post-graduation content | US-AA-73 to US-AA-80 |
| `school-history.md` | Discoverable lore, books, inscriptions, NPC stories | US-AA-81 to US-AA-88 |
| `houses-and-sorting.md` | 4 houses, sorting ceremony, common rooms, house reps, house quests, house points | US-AA-89 to US-AA-95 |
| `teachers-and-school-life.md` | Faculty deep dives, school rituals, meals, curfew, background students | US-AA-96 to US-AA-107 |

**Total: 101 user stories** (6 moved to Epic 79)

## Key NPCs

### Students — Core Four
- **Roderick "Rod" Bumblethatch** — Clumsy, loyal friend. Big heart, no magical talent. Warrior temperament at a mage school. House: Pyraclaw.
- **Elara Nighthollow** — Brilliant loner. Top of every class. Researching forbidden topics. Needs a real friend. House: Glimmershade.
- **Fenn Ashwick** — Witty observer. Knows everyone's business. Comments on everything. Neither friend nor foe. House: Verdantia.
- **Dorian Blackmere** — Wealthy rival. Talented, arrogant. Looks down on non-mages. Competes with you at every turn. House: Ironveil.

### Students — House Representatives
- **Sera Brightforge** (Pyraclaw) — Bold, competitive, informal. Speaks in short bursts. Challenges everyone.
- **Moss Thistledown** (Verdantia) — Gentle, curious, nature-metaphors. Pauses mid-sentence to observe things.
- **Wrenn Ashford** (Ironveil) — Precise, formal, structured. Speaks in complete paragraphs. High standards.
- **Lumi Starweave** (Glimmershade) — Dreamy, cryptic, prophetic. Finishes others' sentences. Stares past you.

### Faculty (Expanded)
- **Archmagus Veylen** — Headmaster. Keeper of secrets. Carries more than he shows.
- **Professor Corvan Ignis** (52) — Elements / Pyraclaw head. Former battle mage. Scarred hands from holding a fire ward. Researching void-flame in secret.
- **Professor Bramwell Thornwick** (67) — Alchemy / Verdantia head. Gentle healer. Talks to plants — and some talk back. 20-year cryptic message from East Wing specimens.
- **Professor Seraphina Ashveil** (45) — Enchantment / Ironveil head. Former Guild ward-architect. Secretly reinforcing degrading East Wing wards alone for 5 years.
- **Librarian Maren Halcyon** (62) — Divination / Glimmershade head. Zero-talent student who taught herself divination from books. True guardian of the founding compact. Library arrangement IS a secondary ward.

## Houses

| House | School | Colors | Common Room | Head | Rep | Trait |
|-------|--------|--------|-------------|------|-----|-------|
| Pyraclaw | Elements | Red/Gold | The Hearth (fireplaces, warm stone) | Ignis | Sera Brightforge | Courage, passion, action |
| Verdantia | Alchemy | Green/Copper | Greenhouse Loft (living walls, herbs) | Thornwick | Moss Thistledown | Patience, curiosity, growth |
| Ironveil | Enchantment | Silver/Blue | The Warded Hall (glowing runes, precision) | Ashveil | Wrenn Ashford | Discipline, precision, protection |
| Glimmershade | Divination | Violet/Silver | The Observatory (scrying pool, star maps) | Maren | Lumi Starweave | Intuition, mystery, vision |

Sorting: 4-question philosophical ceremony. No wrong answers — choices reveal temperament.

## Dependencies

**Epic 79: Magic System** — The Academy's magic system is a subset of Epic 79. All base mechanics (archetypes, attributes, mana, spell casting, alchemy, enchanting) are defined there. The Academy teaches:
- 8 shared spells (Tier 1–2) from 4 of the 7 schools + 1 house-specific spell (Tier 2–3)
- 3 alchemy recipes
- Basic enchantment concepts
- Counter-spell awareness (with practice opportunities)
- Additional spells available via library books (optional, cost skill points)

**Note on archetypes:** Character stats come from the archetype (Arcane/Finesse/Might), not the class. A Might-archetype student at the Academy has minimal mana (~4 at level 1) and relies more on Q-key abilities, scrolls, potions, and alchemy. The Academy's class-aware dialogue acknowledges this. The 2× mana regen on campus helps but does not replace the fundamental archetype difference.

See `79-magic-system/README.md` for the full magic system.

**Code dependencies:**
- Spell system (`spells.ts`) — expanded in Epic 79, used by Academy lessons
- Alchemy system (`alchemy.ts`) — crafting mechanics in Epic 79, recipes taught at Academy
- Items system (`items.ts`) — reagent items exist, potion effects fixed in Epic 79
- Attribute system — new in Epic 79 (STR/INT/WIL/AGI/VIT)
- Mana system — new in Epic 79 (mana/maxMana on Entity)
