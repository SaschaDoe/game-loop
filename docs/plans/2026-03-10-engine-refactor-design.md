# Engine Refactor Design

**Date:** 2026-03-10
**Status:** Approved

## Problem

`engine.ts` is 4506 lines mixing 6 distinct domains: dialogue, combat, overworld, spells/rituals, rendering, and core game setup. This makes it hard to test individual systems, understand responsibilities, and extend safely.

## Solution

Split `engine.ts` into domain-focused modules following Single Responsibility Principle. Zero breaking changes — engine.ts re-exports all public symbols.

## New File Structure

```
src/lib/game/
  engine-utils.ts      (~200 lines) — shared helpers (leaf node, no game imports)
  combat.ts            (~500 lines) — melee, enemy AI, dodge/block/push, kill processing
  dialogue-handler.ts  (~350 lines) — dialogue context, conditions, social checks, choice handling
  overworld-handler.ts (~850 lines) — overworld input, settlements, dungeons, encounters
  spell-handler.ts     (~400 lines) — spell casting, ritual channeling, terrain effects
  renderer.ts          (~250 lines) — all render functions
  engine.ts            (~800 lines) — thin orchestrator: createGame, handleInput routing, newLevel
```

## Module Responsibilities

### engine-utils.ts (shared leaf node)
Extracted from engine.ts to break circular dependencies. No game module imports — only types and external libs.

Exports:
- `addMessage`, `isBlocked`, `effectiveSightRadius`
- `xpForLevel`, `xpReward`, `applyXpMultiplier`
- `checkLevelUp`, `processAchievements`, `handlePlayerDeath`
- `detectAdjacentSecrets`, `tickEntityEffects`, `tryDropLoot`

### combat.ts
Enemy turn processing, melee attack resolution, player combat actions.

Exports:
- `moveEnemies` — full enemy turn (hazards, effects, AI, attacks, spellcaster AI, exam golem)
- `attemptPush`, `attemptFlee`
- `handleMeleeAttack` — extracted from handleInput's inline combat block
- `processKill` — XP reward, loot drop, quest progress, exam golem check
- `DODGE_CHANCE`, `BLOCK_REDUCTION`, `PUSH_CHANCE`

### dialogue-handler.ts
All dialogue logic, currently scattered through engine.ts.

Exports:
- `buildDialogueContext`, `checkCondition` (25 condition types)
- `rollSocialCheck`, `SOCIAL_SKILL_DISPLAY`, `SOCIAL_CLASS_BONUS`
- `handleDialogueChoice` — effect application, social checks, navigation
- `closeDialogue`, `canDetectLies`, `garbleText`
- `MOOD_DISPLAY`, `npcMoodColor`

### overworld-handler.ts
Everything related to the overworld map mode.

Exports:
- `handleOverworldInput` — movement, location entry, waypoints
- `enterSettlement`, `enterDungeon`
- `exitToOverworld`
- `discoverPOI`, `getOverworldInfo`, `dangerDisplay`
- Encounter system: `checkRandomEncounter`, `triggerCombatEncounter`, `triggerNonCombatEncounter`
- Terrain helpers: `getOverworldSightRadius`, `getOverworldMoveCost`
- `REGION_FLAVOR`, `TERRAIN_SIGHT_RADIUS`

### spell-handler.ts
Spell targeting, ritual channeling, and magic actions.

Exports:
- `handleSpellTargeting` — directional/area targeting input
- `handleRitualChanneling` — channeling tick and cancel
- `handleSealDirection` — seal ritual direction picking
- `castSpellById`, `castSpellFromMenu`
- `beginRitual`, `tickRitualChanneling`, `applyRitualEffect`
- `learnSpell`, `learnRitual`, `assignQuickCast`
- `applyTerrainEffectsFromSpell`, `tickTerrainEffects`, `handleSpellKills`

### renderer.ts
Pure rendering — no state mutation.

Exports:
- `render` (plain text), `renderColored` (colored grid)
- `renderOverworldColored`, `renderWorldMap`
- `getWaypointIndicator`
- `dimColor`, `tileColor`

### engine.ts (orchestrator)
Stays as the main entry point. Shrinks from 4506 to ~800 lines.

Contains:
- `createGame` — game initialization
- `handleInput` — thin router (~200 lines, delegates to handlers)
- `newLevel` — dungeon level generation
- Level transition logic (stairs, caching)
- Per-turn tick orchestration (time, academy, survival, stealth, quests)
- Inventory operations (`openInventory`, `closeInventory`, `useInventoryItem`, etc.)
- `CLASS_BONUSES`, `DEFAULT_CONFIG`
- Location caching (`cacheCurrentLocation`, `restoreFromCache`)

Re-exports all public symbols from sub-modules for backward compatibility.

## Import Graph (DAG)

```
engine-utils.ts  ← combat.ts
                 ← dialogue-handler.ts
                 ← overworld-handler.ts
                 ← spell-handler.ts
                 ← renderer.ts
                 ← engine.ts

combat.ts        ← overworld-handler.ts (for moveEnemies in encounters)
                 ← spell-handler.ts (for moveEnemies after casts)
                 ← engine.ts

All modules      ← engine.ts (re-exports for backward compat)
```

No circular dependencies. `engine-utils.ts` is the leaf node.

## Backward Compatibility

Zero breaking changes. engine.ts re-exports all public symbols:

```ts
export { moveEnemies, attemptPush, attemptFlee, DODGE_CHANCE, BLOCK_REDUCTION, PUSH_CHANCE } from './combat';
export { buildDialogueContext, checkCondition, rollSocialCheck, handleDialogueChoice, ... } from './dialogue-handler';
export { handleOverworldInput, exitToOverworld, getOverworldInfo, dangerDisplay, discoverPOI } from './overworld-handler';
// etc.
```

Existing tests, driver.ts, and +page.svelte keep working without import changes.

## Test Plan

Each new module gets a dedicated test file:

| File | Coverage |
|------|----------|
| `engine-utils.test.ts` | xpForLevel, xpReward, effectiveSightRadius, checkLevelUp, isBlocked |
| `combat.test.ts` | moveEnemies, melee resolution, dodge/block/push, enemy AI, exam golem, kill rewards |
| `dialogue-handler.test.ts` | checkCondition (all 25 types), rollSocialCheck, handleDialogueChoice, garbleText, canDetectLies |
| `overworld-handler.test.ts` | overworld movement, settlement/dungeon entry, encounters, POI discovery |
| `spell-handler.test.ts` | spell targeting, ritual channeling, terrain effects, learnSpell/learnRitual |
| `renderer.test.ts` | dimColor, tileColor, renderColored visibility, overworld rendering |

Existing `engine.test.ts` stays as integration tests — exercises full handleInput pipeline.

## Implementation Order

1. Create `engine-utils.ts` — extract shared helpers
2. Create `renderer.ts` — pure functions, no state mutation, safest to extract first
3. Create `dialogue-handler.ts` — self-contained dialogue logic
4. Create `combat.ts` — enemy AI and melee resolution
5. Create `spell-handler.ts` — spell/ritual handling
6. Create `overworld-handler.ts` — overworld mode (largest extraction)
7. Slim down `engine.ts` — add re-exports, verify handleInput is thin router
8. Write unit tests for each new module
9. Run full test suite — verify zero regressions
