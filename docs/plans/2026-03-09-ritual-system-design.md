# Ritual System Design

**Date:** 2026-03-09
**Epic:** 79 — Magic System
**User Story:** US-MS-51 — Ritual Magic
**Status:** Approved

---

## Overview

Multi-turn channeled rituals that require reagents and uninterrupted casting time. Distinct from instant-cast spells — rituals provide powerful strategic effects at the cost of preparation and vulnerability.

## Architecture

New `rituals.ts` module following the existing spell pattern (catalog + pure functions + engine integration).

### Files

- **New:** `ascii-rpg/src/lib/game/rituals.ts` — RitualDef catalog, channeling logic, tick/interrupt functions
- **New:** `ascii-rpg/src/lib/game/rituals.test.ts` — unit tests
- **Modified:** `ascii-rpg/src/lib/game/types.ts` — GameState additions
- **Modified:** `ascii-rpg/src/lib/game/engine.ts` — ritual menu, channeling tick, interrupt on damage, effect application

## Data Model

### RitualDef (rituals.ts)

```typescript
interface RitualDef {
  id: string;
  name: string;
  school: SpellSchool;
  description: string;
  manaCost: number;
  castTurns: number;
  reagents: { itemId: string; quantity: number }[];
  effect: RitualEffect;
}

type RitualEffect =
  | { type: 'ward'; radius: number; damage: number; duration: number }
  | { type: 'summon'; creatureType: string }
  | { type: 'scry' }
  | { type: 'purify'; radius: number }
  | { type: 'teleport_anchor' }
  | { type: 'seal' };
```

### GameState Additions (types.ts)

```typescript
// New fields on GameState:
learnedRituals: string[];
ritualChanneling: RitualChannelingState | null;
activeWards: WardZone[];
teleportAnchors: Record<number, Position>;  // dungeon level → anchor position
activeSummon: Entity | null;
scriedLevel: number | null;  // level number that has been scried

// New interfaces:
interface RitualChannelingState {
  ritualId: string;
  turnsRemaining: number;
  turnsTotal: number;
}

interface WardZone {
  center: Position;
  radius: number;
  damage: number;
  turnsRemaining: number;
}
```

## Channeling State Machine

1. Player initiates ritual → validate reagents + mana → enter channeling state
2. Each turn: player input blocked (only Escape to cancel), `turnsRemaining--`
3. If player takes damage during channeling: 75% interrupt / 25% resist
4. On completion: consume reagents + mana, apply ritual effect
5. On interrupt/cancel: consume reagents + mana, fail message
6. Visual: renderer checks `state.ritualChanneling !== null` for pulsing `@`/`*` and progress bar

## Six Base Rituals

| Ritual | School | Turns | Reagents | Mana | Effect |
|--------|--------|-------|----------|------|--------|
| Ward of Protection | enchantment | 3 | arcane_dust ×3 | 12 | 5×5 warded zone, 5 dmg + 1-turn slow, 50 turns |
| Summoning Circle | conjuration | 5 | arcane_dust ×2 + moonwater_vial ×1 | 20 | Allied creature (3 HP, 2 ATK) |
| Scrying Ritual | divination | 3 | moonwater_vial ×1 + dreamleaf ×1 | 10 | Reveals next dungeon level on descend |
| Purification Ritual | restoration | 4 | starfern ×2 + moonwater_vial ×1 | 15 | Cleanses 7×7 hazards permanently |
| Teleportation Circle | conjuration | 5 | arcane_dust ×3 + lightning_shard ×1 | 18 | Permanent anchor, return for 5 mana |
| Sealing Ritual | shadow | 4 | void_salt ×1 + arcane_dust ×2 | 14 | Seal adjacent tile to wall |

## Simplifications

- No mastery gate — rituals gated by learning + reagents only
- Summoning: generic "Arcane Familiar" entity, auto-attacks nearest enemy, max 1 active
- Scrying: sets flag, marks all tiles explored on descend (no minimap overlay)
- Sealing: direction-pick targeting (like spell targeting)
- Rituals shown in spell menu under "--- Rituals ---" separator
- All reagent types already exist in alchemy.ts

## Out of Scope

- School mastery tracking system
- Ritual discovery/learning progression (provide `learnRitual()` + starter rituals for testing)
- New UI panels or minimap overlay
- New reagent items
