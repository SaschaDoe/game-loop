# Epic 79: Magic System

## Single Source of Truth

This epic defines the **complete magic system** for Aethermoor. All other epics that involve magic (combat spells, alchemy, enchanting, forbidden magic, class abilities, the Academy curriculum, etc.) **must reference this epic** for base mechanics, stats, and spell definitions.

**Supersedes / consolidates:**
- `04-combat-system/magic-spells.md` (now references this epic)
- `04-combat-system/spell-schools-detail.md` (absorbed into spell catalog here)
- `04-combat-system/ritual-magic.md` (absorbed into advanced magic here)
- `04-combat-system/illusion-magic.md` (absorbed into spell catalog here)
- `75-class-system/mage-class.md` (mana/spells now defined here; class doc keeps specializations)

**Referenced by:**
- `78-arcane-academy/` — Academy teaches a curated subset of this system
- `26-alchemy-and-potions/` — Alchemy mechanics defined here; epic 26 adds advanced recipes, poisons, addiction
- `29-forbidden-magic/` — Forbidden schools defined here; epic 29 adds deep lore and progression
- `48-summoning-and-conjuration/` — Conjuration school defined here; epic 48 adds familiars, planar binding
- `49-magitech-and-artificer/` — Enchanting basics defined here; epic 49 adds gadgets, golems
- `50-weather-and-elemental-mastery/` — Elemental attunement references this epic
- `52-psychic-powers/` — Psi points are an alternate resource system (see advanced magic)
- `64-time-travel/` — Chronomancy is a forbidden school defined here
- `72-necromancy-gameplay/` — Necromancy is a forbidden school defined here
- `73-enchanting-system/` — Enchanting mechanics defined here; epic 73 adds cursed enchantments

## Design Pillars

1. **Lore-Consistent** — Magic flows from Ley Lines (the Original Seven). The 7 streams map to 7 spell schools. Forbidden magic bypasses the Ascended's filter. Every mechanic has a lore reason.
2. **One Foundation, Many Paths** — All magic shares the same attribute system, mana pool, and casting mechanics. Schools, traditions, and forbidden arts are layers on top.
3. **Spells Are Tools, Not Decorations** — Every spell does something real in the game engine. No flavor-only spells.
4. **Progressive Complexity** — Start with 1-2 spells and bump-to-attack. End with spell weaving, counter-spells, and ritual magic. The system grows with the player.
5. **Class Agnostic** — Any class can learn magic (Warriors at the Academy, Rogues from scrolls). Mages are better at it, not the only ones who can do it.

## Feature Areas

| File | Area | Stories |
|------|------|---------|
| `attributes-and-resources.md` | Core attributes, mana pool, mana regen, magic stats | US-MS-01 to US-MS-08 |
| `spell-schools.md` | 7 arcane schools + 5 forbidden schools, school identity, interactions | US-MS-09 to US-MS-16 |
| `spell-catalog.md` | Complete spell list (all schools, all tiers), spell definitions | US-MS-17 to US-MS-22 |
| `casting-and-combat.md` | Cast UI, targeting, damage calc, cooldowns, counter-spells, enemy casters | US-MS-23 to US-MS-33 |
| `alchemy-and-crafting.md` | Alchemy stations, brewing, recipes, reagents, potion effects | US-MS-34 to US-MS-42 |
| `enchanting.md` | Item enchantment, rune inscription, disenchanting | US-MS-43 to US-MS-48 |
| `non-combat-magic.md` | Utility spells, exploration, ritual magic, social magic | US-MS-49 to US-MS-54 |
| `progression-and-learning.md` | Learning sources, spell tiers, specialization, mastery, forbidden access | US-MS-55 to US-MS-63 |

**Total: 63 user stories**

## How It Connects to Lore

| Lore Concept | Game Mechanic |
|-------------|---------------|
| 7 Ley Line streams (Order, Change, Time, Space, Matter, Energy, Spirit) | 7 spell schools (Enchantment, Restoration, Divination, Conjuration, Alchemy, Elements, Shadow) |
| 6 magical traditions (Thaumaturges, Arcanists, Primordialists, Blood Singers, Void Touched, Runeweavers) | Learning paths — where and how you acquire spells |
| Old Magic vs New Magic | Primordialist spells are stronger but unpredictable; Arcanist spells are consistent |
| Magical corruption per stream | Overuse penalty: casting too many spells from one school causes stream-specific debuffs |
| Forbidden streams (Blood, Soul, Void, Chronomancy, Necromancy) | Forbidden schools — powerful but with unique costs and consequences |
| Convergence Prophecy (all streams as one) | Endgame: player can learn cross-school mastery |
| Mana as Ley Line buffer | Mana pool scales with Intellect; regens faster near Ley Lines |

## How It Connects to the Academy (Epic 78)

The Academy is an **Arcanist institution**. It teaches 4 of the 7 schools through its house system:

| Academy House | Spell School | Stream |
|--------------|-------------|--------|
| Pyraclaw | Elements | Energy (Ira-Sethi) |
| Ironveil | Enchantment | Order (Aum-Varek) |
| Verdantia | Alchemy | Matter (Dro-Mahk) |
| Glimmershade | Divination | Time (Tho-Rienne) |

Schools **not taught** at the Academy: Restoration (temple tradition), Conjuration (too dangerous for students), Shadow (morally ambiguous). These are mentioned in library books and referenced by NPCs but not available as lessons.

Forbidden schools are referenced in the Academy's restricted section and East Wing lore but never taught.

## Dependencies (Code Changes Required)

- **New:** Attribute system (STR/INT/WIL/AGI/VIT) on Entity
- **New:** `mana` / `maxMana` on Entity
- **New:** `learnedSpells: string[]` on GameState
- **New:** `spellCooldowns: Record<string, number>` on GameState
- **New:** `knownRecipes: string[]` on GameState
- **New:** Spell execution engine (converts SpellDef → actual game effects)
- **New:** Spell casting UI (M key menu, targeting mode)
- **New:** Alchemy crafting UI (station interaction)
- **Modify:** `spells.ts` — expand catalog, add execution functions
- **Modify:** `alchemy.ts` — add crafting integration
- **Modify:** `items.ts` — real potion effects (not just HP)
- **Modify:** `engine.ts` — mana tick, spell cooldown tick, spell damage in combat
- **Modify:** `types.ts` — new fields on Entity and GameState
- **Modify:** `save.ts` — persist new fields
- **Modify:** HUD — mana bar, spell slots display
