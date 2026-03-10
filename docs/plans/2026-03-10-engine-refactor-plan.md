# Engine Refactor Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Split engine.ts (4506 lines) into 6 domain-focused modules with zero breaking changes and full test coverage.

**Architecture:** Extract functions by domain into separate files. engine-utils.ts is the shared leaf node (no game imports). Each domain module imports from engine-utils. engine.ts becomes a thin orchestrator that re-exports all public symbols for backward compatibility.

**Tech Stack:** TypeScript, Vitest, SvelteKit

**Important:** This is a refactor — existing tests MUST keep passing at every step. Run `npm test` after each extraction. The strategy is: extract → verify existing tests pass → write new focused tests.

---

### Task 1: Extract engine-utils.ts (shared helpers)

**Files:**
- Create: `ascii-rpg/src/lib/game/engine-utils.ts`
- Modify: `ascii-rpg/src/lib/game/engine.ts` (remove moved functions, add imports)

**Context:** These are leaf-node helpers used by multiple domain modules. They must NOT import from any game module except types, status-effects, skills, achievements, bestiary, loot, monsters, and survival. This breaks the circular dependency chain.

**Step 1: Create engine-utils.ts with extracted functions**

Move these functions (exact current line ranges in engine.ts):
- `addMessage` (lines 1948-1950)
- `handlePlayerDeath` (lines 1952-1959)
- `isBlocked` (lines 1961-1968)
- `detectAdjacentSecrets` (lines 1970-1983)
- `tryDropLoot` (lines 1985-1992)
- `tickEntityEffects` (lines 1994-2003)
- `processAchievements` (lines 132-141)
- `xpForLevel` (lines 143-146) — currently exported
- `xpReward` (lines 148-150) — currently exported
- `applyXpMultiplier` (lines 152-156)
- `effectiveSightRadius` (lines 158-163) — currently exported
- `checkLevelUp` (lines 165-187)
- `relocateNpc` (lines 2092-2107)
- `tickNpcMoods` (lines 2109-2127)

Import the necessary dependencies in engine-utils.ts:
```typescript
import type { GameState, Entity, Position, MessageType, NPC } from './types';
import { tickEffects, effectColor } from './status-effects';
import { getSkillBonuses } from './skills';
import { checkAchievements, getAchievement } from './achievements';
import { recordKill } from './bestiary';
import { rollLootDrop } from './loot';
import { sightModifier, getTimePhase } from './day-night';
import { getEquipmentBonuses } from './items';
import { getAvailableSpecializations } from './mastery';
import type { SchoolMastery } from './mastery';
```

Export all functions from engine-utils.ts.

**Step 2: Update engine.ts**

- Remove the moved functions from engine.ts
- Add: `import { addMessage, handlePlayerDeath, isBlocked, ... } from './engine-utils';`
- Add re-exports at bottom: `export { xpForLevel, xpReward, effectiveSightRadius, addMessage, isBlocked, ... } from './engine-utils';`

**Step 3: Run tests**

```bash
cd ascii-rpg && npm test
```

Expected: All 1210+ tests pass. No import errors.

**Step 4: Commit**

```bash
git add ascii-rpg/src/lib/game/engine-utils.ts ascii-rpg/src/lib/game/engine.ts
git commit -m "refactor: extract engine-utils.ts shared helpers from engine.ts"
```

---

### Task 2: Extract renderer.ts

**Files:**
- Create: `ascii-rpg/src/lib/game/renderer.ts`
- Modify: `ascii-rpg/src/lib/game/engine.ts`

**Context:** Pure rendering functions with no state mutation. Safest extraction — these only read state and produce output.

**Step 1: Create renderer.ts with extracted functions**

Move these functions from engine.ts:
- `dimColor` (lines 4360-4370)
- `tileColor` (lines 4372-4379)
- `render` (lines 4339-4358) — currently exported
- `renderColored` (lines 4381-4506) — currently exported

Note: `renderColored` calls `renderOverworldColored` (which will move to overworld-handler later). For now, import it from engine.ts. When overworld-handler is created in Task 6, update the import.

renderer.ts imports:
```typescript
import type { GameState } from './types';
import { Visibility } from './types';
import { effectColor } from './status-effects';
import { getChestAt, chestChar, chestColor } from './chests';
import { getLootAt, lootChar, lootColor } from './loot';
import { getLandmarkAt, landmarkChar, landmarkColor } from './landmarks';
import { getHazardAt, hazardChar, hazardColor } from './hazards';
import { getAlertSymbol, getAlertColor } from './stealth';
import { npcMoodColor } from './dialogue-handler'; // will exist after Task 3
```

**Important dependency order:** renderer.ts needs `npcMoodColor` which moves to dialogue-handler in Task 3. Since Task 2 runs before Task 3, initially import `npcMoodColor` from engine.ts. After Task 3, update the import to dialogue-handler.ts.

Alternatively, do Task 3 (dialogue-handler) before Task 2. **Revised order: do Task 3 first, then Task 2.**

**Step 2: Update engine.ts**

- Remove moved functions
- Add: `import { render, renderColored, dimColor, tileColor } from './renderer';`
- Re-export: `export { render, renderColored } from './renderer';`

**Step 3: Run tests**

```bash
cd ascii-rpg && npm test
```

Expected: All tests pass.

**Step 4: Commit**

```bash
git add ascii-rpg/src/lib/game/renderer.ts ascii-rpg/src/lib/game/engine.ts
git commit -m "refactor: extract renderer.ts from engine.ts"
```

---

### Task 3: Extract dialogue-handler.ts

**Files:**
- Create: `ascii-rpg/src/lib/game/dialogue-handler.ts`
- Modify: `ascii-rpg/src/lib/game/engine.ts`

**Context:** All dialogue-related logic. Self-contained — only depends on engine-utils for addMessage.

**Step 1: Create dialogue-handler.ts**

Move these from engine.ts:
- `SOCIAL_CLASS_BONUS` (lines 106-115)
- `SOCIAL_SKILL_DISPLAY` (lines 126-130) — exported
- `buildDialogueContext` (lines 40-71) — exported
- `checkCondition` (lines 73-104) — exported
- `rollSocialCheck` (lines 117-124) — exported
- `handleDialogueChoice` (lines 4106-4285) — exported
- `canDetectLies` (lines 4287-4292) — exported
- `MOOD_DISPLAY` (lines 4294-4301) — exported
- `npcMoodColor` (lines 4303-4316 including glyph consts) — exported
- `garbleText` (lines 4318-4332) — exported
- `closeDialogue` (lines 4334-4337) — exported
- `DEEPSCRIPT_GLYPHS`, `ORCISH_GLYPHS`, `ELVISH_GLYPHS` constants (lines 4308-4316)

dialogue-handler.ts imports:
```typescript
import type { GameState, DialogueCondition, DialogueContext, SocialCheck, SocialSkill, CharacterClass, NPCMood, NPC, ActiveDialogue } from './types';
import { addMessage } from './engine-utils';
import { getAcademyDay, isLessonReady, allLessonsComplete, enrollAtAcademy, completeLesson, passExam, completeTeachingSession } from './academy';
import { updateQuestProgress } from './quests';
import { learnRitual } from './spell-handler'; // circular? No — spell-handler doesn't import dialogue-handler
```

**Note on learnRitual:** `handleDialogueChoice` calls `learnRitual` (line 4157). This will live in spell-handler.ts (Task 5). For now, keep the `learnRitual` import from engine.ts. After Task 5, update to import from spell-handler.ts.

**Step 2: Update engine.ts**

- Remove moved functions
- Add import from dialogue-handler
- Re-export all public symbols

**Step 3: Run tests**

```bash
cd ascii-rpg && npm test
```

**Step 4: Commit**

```bash
git add ascii-rpg/src/lib/game/dialogue-handler.ts ascii-rpg/src/lib/game/engine.ts
git commit -m "refactor: extract dialogue-handler.ts from engine.ts"
```

---

### Task 4: Extract combat.ts

**Files:**
- Create: `ascii-rpg/src/lib/game/combat.ts` (note: there is NO existing combat.ts — check with glob first)
- Modify: `ascii-rpg/src/lib/game/engine.ts`

**Context:** Enemy AI, melee resolution, dodge/block/push mechanics. The biggest behavioral extraction — moveEnemies is 335 lines with complex enemy AI.

**Step 1: Create combat.ts**

Move these from engine.ts:
- `DODGE_CHANCE` (lines 2005-2015) — exported
- `BLOCK_REDUCTION` (lines 2017-2027) — exported
- `PUSH_CHANCE` (lines 2029-2039) — exported
- `ENVIRONMENTAL_KILL_BONUS` (line 2041) — constant
- `attemptPush` (lines 2049-2088) — exported
- `moveEnemies` (lines 2129-2463) — was private, now exported from combat.ts
- `attemptFlee` (lines 2464-2527) — exported

combat.ts imports:
```typescript
import type { GameState, Entity, Position, Difficulty } from './types';
import { addMessage, handlePlayerDeath, isBlocked, xpReward, applyXpMultiplier,
         checkLevelUp, processAchievements, tickEntityEffects, tryDropLoot,
         tickNpcMoods, relocateNpc } from './engine-utils';
import { hasEffect, applyEffect } from './status-effects';
import { getSkillBonuses } from './skills';
import { tickAbilityCooldown } from './abilities';
import { applyHazards, getHazardAt } from './hazards';
import { isBoss, isRare, getMonsterBehavior, decideMoveDirection, getMonsterDefByName } from './monsters';
import { recordKill } from './bestiary';
import { updateQuestProgress } from './quests';
import { getSpellDef, tickManaRegen, tickSpellCooldowns } from './spells';
import { getEquipmentBonuses } from './items';
import { passExam } from './academy';
import { tickTerrainEffects, checkRitualInterrupt } from './spell-handler'; // after Task 5
```

**Note on spell-handler dependency:** `moveEnemies` calls `tickTerrainEffects` and `checkRitualInterrupt` which will be in spell-handler.ts. Since Task 5 hasn't happened yet, initially import these from engine.ts. After Task 5, update the import.

Also extract a `processKill` helper function to deduplicate the kill-processing logic that appears in 3+ places (melee kills, ability kills, spell kills):

```typescript
export function processKill(state: GameState, enemy: Entity, bonusMultiplier = 1): void {
    tryDropLoot(state, enemy);
    const bossKill = isBoss(enemy);
    const rareKill = isRare(enemy);
    const baseReward = xpReward(enemy, state.level);
    const reward = applyXpMultiplier(
        Math.floor((bossKill ? baseReward * 3 : rareKill ? baseReward * 2 : baseReward) * bonusMultiplier),
        state
    );
    state.xp += reward;
    state.stats.enemiesKilled++;
    if (bossKill) state.stats.bossesKilled++;
    recordKill(state.bestiary, enemy);
    const questMsgs = updateQuestProgress(state, 'kill', enemy.name);
    for (const qm of questMsgs) addMessage(state, qm, 'discovery');
    // Exam golem check
    if (enemy.name === 'Exam Golem' && state.academyState && !state.academyState.examPassed) {
        passExam(state);
        addMessage(state, 'You defeated the Exam Golem! You have passed the combat trial!', 'level_up');
        addMessage(state, 'The Archmagus awaits you for the graduation ceremony.', 'discovery');
    }
    if (bossKill) {
        addMessage(state, `${enemy.name} has been vanquished! +${reward} XP`, 'level_up');
    } else if (rareKill) {
        addMessage(state, `${enemy.name} slain! +${reward} XP`, 'level_up');
    } else {
        addMessage(state, `${enemy.name} defeated! +${reward} XP`, 'player_attack');
    }
}
```

**Step 2: Update engine.ts**

- Remove moved functions
- Import and use `moveEnemies`, `processKill` etc. from combat.ts
- Replace inline kill-processing in handleInput with `processKill` calls
- Re-export public symbols

**Step 3: Run tests**

```bash
cd ascii-rpg && npm test
```

**Step 4: Commit**

```bash
git add ascii-rpg/src/lib/game/combat.ts ascii-rpg/src/lib/game/engine.ts
git commit -m "refactor: extract combat.ts from engine.ts"
```

---

### Task 5: Extract spell-handler.ts

**Files:**
- Create: `ascii-rpg/src/lib/game/spell-handler.ts`
- Modify: `ascii-rpg/src/lib/game/engine.ts`

**Context:** Spell casting, ritual channeling, terrain effects, and spell/ritual learning.

**Step 1: Create spell-handler.ts**

Move these from engine.ts:
- `applyTerrainEffectsFromSpell` (lines 2693-2711)
- `tickTerrainEffects` (lines 2714-2738)
- `handleSpellKills` (lines 2744-2768)
- `castSpellById` (lines 2770-2886)
- `castSpellFromMenu` (lines 2888-2892)
- `assignQuickCast` (lines 2895-2902) — exported
- `learnSpell` (lines 2905-2971) — exported
- `learnRitual` (lines 2974-2989) — exported
- `beginRitual` (lines 2992-3025)
- `tickRitualChanneling` (lines 3028-3066)
- `checkRitualInterrupt` (lines 3069-3084)
- `applyRitualEffect` (lines 3087-3153)
- `findAdjacentFloor` (lines 3156-3168)

Also extract input handling for spell targeting and ritual channeling from handleInput into functions:
- `handleSpellTargeting(state, key)` — extracts lines 3250-3368
- `handleRitualChanneling(state, key)` — extracts lines 3180-3236
- `handleSpellMenu(state, key)` — extracts lines 3371-3397

spell-handler.ts imports:
```typescript
import type { GameState, Position, MessageType, Entity } from './types';
import { addMessage, checkLevelUp, processAchievements, handlePlayerDeath, tryDropLoot,
         xpReward, applyXpMultiplier } from './engine-utils';
import { moveEnemies, processKill } from './combat';
import { SPELL_CATALOG, getSpellDef, executeSpell, effectiveManaCost, createTerrainEffects,
         getLeyLineEffectModifier, getEnvironmentalModifier, FORBIDDEN_SCHOOLS } from './spells';
import type { ArmorWeight, ForbiddenSchool } from './spells';
import { getEquippedArmorWeight, CLASS_PROFILES } from './magic';
import { addMasteryXP, checkForbiddenThreshold, getMasteryLevel, canCastTier } from './mastery';
import { RITUAL_CATALOG, getRitualDef, hasReagents, getMissingReagents, consumeReagents, rollInterruption } from './rituals';
import { applyEffect, hasEffect } from './status-effects';
import { isBoss, isRare } from './monsters';
import { recordKill } from './bestiary';
import { updateQuestProgress } from './quests';
import { getTimePhase } from './day-night';
import { getEquipmentBonuses } from './items';
import { updateVisibility } from './fov';
```

**Step 2: Update engine.ts handleInput**

Replace the spell targeting block (lines 3250-3368) with:
```typescript
if (state.spellTargeting) {
    return handleSpellTargeting(state, key);
}
```

Replace ritual channeling block (lines 3180-3236) with:
```typescript
if (state.ritualChanneling) {
    return handleRitualChanneling(state, key);
}
```

Replace spell menu block (lines 3370-3397) with:
```typescript
if (state.spellMenuOpen) {
    return handleSpellMenu(state, key);
}
```

**Step 3: Update dialogue-handler.ts**

Change `learnRitual` import from engine.ts to spell-handler.ts.

**Step 4: Update combat.ts**

Change `tickTerrainEffects` and `checkRitualInterrupt` imports from engine.ts to spell-handler.ts.

**Step 5: Run tests**

```bash
cd ascii-rpg && npm test
```

**Step 6: Commit**

```bash
git add ascii-rpg/src/lib/game/spell-handler.ts ascii-rpg/src/lib/game/engine.ts ascii-rpg/src/lib/game/dialogue-handler.ts ascii-rpg/src/lib/game/combat.ts
git commit -m "refactor: extract spell-handler.ts from engine.ts"
```

---

### Task 6: Extract overworld-handler.ts

**Files:**
- Create: `ascii-rpg/src/lib/game/overworld-handler.ts`
- Modify: `ascii-rpg/src/lib/game/engine.ts`
- Modify: `ascii-rpg/src/lib/game/renderer.ts` (update renderOverworldColored import)

**Context:** Largest extraction (~850 lines). All overworld mode logic including rendering, encounters, settlements, dungeons, and POI discovery.

**Step 1: Create overworld-handler.ts**

Move these from engine.ts:
- Constants: `OVERWORLD_SIGHT_RADIUS` (435), `OVERWORLD_VIEWPORT_W/H` (436-437), `TERRAIN_SIGHT_RADIUS` (440-454), `REGION_FLAVOR` (464-488)
- `getOverworldSightRadius` (457-459)
- `dangerDisplay` (491-498) — exported
- `getOverworldInfo` (501-527) — exported
- `getOverworldMoveCost` (529-533)
- `compassDirection` (535-545)
- `showSignpostInfo` (547-585)
- `revealOverworldArea` (587-599)
- `revealRumorLocation` (601-620)
- `isOverworldPassable` (622-625)
- `getOverworldLocation` (627-638)
- `handleOverworldInput` (640-757)
- `REGIONAL_NPCS` data + `RegionalNPCDef` interface (760-892)
- `spawnRegionalNPCs` (893-927)
- `enterSettlement` (930-963)
- `enterDungeon` (965-1099)
- `discoverPOI` (1101-1223) — exported
- `rollEncounter` (1225-1231)
- `triggerCombatEncounter` (1233-1292)
- `triggerNonCombatEncounter` (1294-1315)
- `checkRandomEncounter` (1317-1338)
- `locationCacheKey` (1340-1342)
- `cacheCurrentLocation` (1345-1364)
- `restoreFromCache` (1366-1385)
- `exitToOverworld` (1388-1410) — exported
- `renderOverworldColored` (1412-1498) — exported
- `renderWorldMap` (1500-1613) — exported
- `getWaypointIndicator` (1615-1645) — exported

overworld-handler.ts imports:
```typescript
import type { GameState, Position, NPC, NPCMood, CachedLocationState, Difficulty } from './types';
import { Visibility } from './types';
import { addMessage, handlePlayerDeath, effectiveSightRadius, detectAdjacentSecrets } from './engine-utils';
import { moveEnemies } from './combat';
import { generateMap, getSpawnPositions } from './map';
import { createVisibilityGrid, updateVisibility } from './fov';
import { generateSettlementByType } from './locations';
import { NPC_DIALOGUE_TREES } from './dialogue';
import { placeTraps, detectAdjacentTraps } from './traps';
import { placeHazards } from './hazards';
import { placeChests } from './chests';
import { placeLandmarks } from './landmarks';
import { tickSurvival } from './survival';
import { tickAcademy, createAcademyState } from './academy';
import { difficultySpawnCount, applyDifficultyToEnemy } from './difficulty';
import { createMonster, pickMonsterDef, pickBossDef, isBossLevel } from './monsters';
import { createRng, hashSeed } from './seeded-random';
import { generateWorld, TERRAIN_DISPLAY, WORLD_W, WORLD_H, type WorldMap, type OverworldTile, type Settlement, type DungeonEntrance, type PointOfInterest, type RegionId } from './overworld';
import { ITEM_CATALOG, addToInventory, createEmptyInventory, createEmptyEquipment, getEquipmentBonuses, type WorldContainer } from './items';
import { BOOK_CATALOG, getAllBookIds } from './books';
import { updateQuestProgress } from './quests';
import { createDefaultStats } from './achievements';
import { MAX_SURVIVAL } from './survival';
import { createEmptyMastery } from './mastery';
```

**Step 2: Update engine.ts**

- Remove all moved functions
- Import: `handleOverworldInput`, `exitToOverworld`, `spawnRegionalNPCs`, `revealOverworldArea`, `getOverworldSightRadius`, `cacheCurrentLocation`, `restoreFromCache`, `locationCacheKey` from overworld-handler
- Re-export public symbols
- `createGame` now calls `spawnRegionalNPCs` and `revealOverworldArea` imported from overworld-handler

**Step 3: Update renderer.ts**

- Import `renderOverworldColored` from overworld-handler.ts instead of engine.ts
- `renderColored` delegates to `renderOverworldColored` when `locationMode === 'overworld'`

**Step 4: Run tests**

```bash
cd ascii-rpg && npm test
```

**Step 5: Commit**

```bash
git add ascii-rpg/src/lib/game/overworld-handler.ts ascii-rpg/src/lib/game/engine.ts ascii-rpg/src/lib/game/renderer.ts
git commit -m "refactor: extract overworld-handler.ts from engine.ts"
```

---

### Task 7: Slim down engine.ts and verify

**Files:**
- Modify: `ascii-rpg/src/lib/game/engine.ts`

**Context:** After Tasks 1-6, engine.ts should be ~800 lines. This task cleans up: verify all re-exports work, remove dead imports, verify handleInput is a thin router.

**Step 1: Audit remaining engine.ts**

Verify these remain in engine.ts:
- `createGame` — game initialization
- `handleInput` — thin router (~200 lines), delegates to domain handlers
- `newLevel` — dungeon level generation
- `createEnemy`, `spawnEnemies`, `spawnDungeonNPCs` — helpers for newLevel
- `CLASS_BONUSES`, `DEFAULT_CONFIG`, `MAP_W`, `MAP_H` — constants
- Inventory operations: `openInventory`, `closeInventory`, `openContainer`, `useInventoryItem`, `dropInventoryItem`, `unequipToInventory`, `takeFromContainer`, `storeInContainer`, `getAdjacentContainer`
- Book operations: `flipBookPage`, `closeBook`, `getActiveBook`

**Step 2: Verify re-exports**

Ensure engine.ts re-exports everything that was previously exported:
```typescript
// Re-exports for backward compatibility
export { xpForLevel, xpReward, effectiveSightRadius, addMessage } from './engine-utils';
export { moveEnemies, attemptPush, attemptFlee, DODGE_CHANCE, BLOCK_REDUCTION, PUSH_CHANCE, processKill } from './combat';
export { buildDialogueContext, checkCondition, rollSocialCheck, handleDialogueChoice, closeDialogue, canDetectLies, garbleText, SOCIAL_SKILL_DISPLAY, MOOD_DISPLAY, npcMoodColor } from './dialogue-handler';
export { handleOverworldInput, exitToOverworld, getOverworldInfo, dangerDisplay, discoverPOI, renderOverworldColored, renderWorldMap, getWaypointIndicator, spawnRegionalNPCs, revealOverworldArea, getOverworldSightRadius } from './overworld-handler';
export { assignQuickCast, learnSpell, learnRitual, handleSpellTargeting, handleRitualChanneling, handleSpellMenu } from './spell-handler';
export { render, renderColored } from './renderer';
```

**Step 3: Clean up imports**

Remove any now-unused imports from engine.ts (status-effects, monsters, stealth, etc. that were only used by moved functions).

**Step 4: Run tests**

```bash
cd ascii-rpg && npm test
```

Expected: All 1210+ tests pass.

**Step 5: Commit**

```bash
git add ascii-rpg/src/lib/game/engine.ts
git commit -m "refactor: slim engine.ts to thin orchestrator with re-exports"
```

---

### Task 8: Write engine-utils tests

**Files:**
- Create: `ascii-rpg/src/lib/game/engine-utils.test.ts`

**Step 1: Write tests**

```typescript
import { describe, it, expect } from 'vitest';
import { xpForLevel, xpReward, effectiveSightRadius, addMessage, isBlocked,
         checkLevelUp, applyXpMultiplier, handlePlayerDeath, processAchievements,
         tryDropLoot, detectAdjacentSecrets, tickEntityEffects } from './engine-utils';
import type { GameState, Entity } from './types';
import { Visibility } from './types';

// Use makeTestState helper pattern from engine.test.ts

describe('xpForLevel', () => {
    it('returns 25 for level 2', () => {
        expect(xpForLevel(2)).toBe(25);
    });
    it('scales exponentially', () => {
        expect(xpForLevel(3)).toBeGreaterThan(xpForLevel(2));
        expect(xpForLevel(10)).toBeGreaterThan(xpForLevel(5));
    });
    it('is always positive', () => {
        for (let i = 1; i <= 50; i++) {
            expect(xpForLevel(i)).toBeGreaterThan(0);
        }
    });
});

describe('xpReward', () => {
    it('increases with dungeon level', () => {
        const enemy = { maxHp: 10 } as Entity;
        expect(xpReward(enemy, 5)).toBeGreaterThan(xpReward(enemy, 1));
    });
    it('includes enemy maxHp', () => {
        const weak = { maxHp: 5 } as Entity;
        const strong = { maxHp: 20 } as Entity;
        expect(xpReward(strong, 1)).toBeGreaterThan(xpReward(weak, 1));
    });
});

describe('addMessage', () => {
    it('appends message to state', () => {
        const state = { messages: [] } as unknown as GameState;
        addMessage(state, 'hello', 'info');
        expect(state.messages).toHaveLength(1);
        expect(state.messages[0]).toEqual({ text: 'hello', type: 'info' });
    });
    it('defaults to info type', () => {
        const state = { messages: [] } as unknown as GameState;
        addMessage(state, 'test');
        expect(state.messages[0].type).toBe('info');
    });
});

describe('isBlocked', () => {
    it('returns true for walls', () => {
        const state = {
            map: { width: 5, height: 5, tiles: Array.from({ length: 5 }, () => ['#', '#', '#', '#', '#']), secretWalls: new Set() },
            detectedSecrets: new Set(),
        } as unknown as GameState;
        expect(isBlocked(state, 0, 0)).toBe(true);
    });
    it('returns false for floor', () => {
        const state = {
            map: { width: 5, height: 5, tiles: Array.from({ length: 5 }, () => ['.', '.', '.', '.', '.']), secretWalls: new Set() },
            detectedSecrets: new Set(),
        } as unknown as GameState;
        expect(isBlocked(state, 0, 0)).toBe(false);
    });
    it('returns true for out of bounds', () => {
        const state = {
            map: { width: 5, height: 5, tiles: [[]], secretWalls: new Set() },
            detectedSecrets: new Set(),
        } as unknown as GameState;
        expect(isBlocked(state, -1, 0)).toBe(true);
        expect(isBlocked(state, 5, 0)).toBe(true);
    });
});

describe('handlePlayerDeath', () => {
    it('sets gameOver and adds death message', () => {
        const state = { gameOver: false, messages: [], characterConfig: { difficulty: 'normal' } } as unknown as GameState;
        handlePlayerDeath(state);
        expect(state.gameOver).toBe(true);
        expect(state.messages.some(m => m.type === 'death')).toBe(true);
    });
});

describe('checkLevelUp', () => {
    it('grants talent point on level up', () => {
        const state = {
            xp: 100, characterLevel: 1, skillPoints: 0, messages: [],
            specialization: null, pendingSpecialization: false,
            schoolMastery: {},
        } as unknown as GameState;
        checkLevelUp(state);
        expect(state.characterLevel).toBeGreaterThan(1);
        expect(state.skillPoints).toBeGreaterThan(0);
    });
    it('does not level past 50', () => {
        const state = {
            xp: 999999, characterLevel: 50, skillPoints: 0, messages: [],
            specialization: null, pendingSpecialization: false,
            schoolMastery: {},
        } as unknown as GameState;
        checkLevelUp(state);
        expect(state.characterLevel).toBe(50);
    });
});

describe('effectiveSightRadius', () => {
    it('accounts for skill bonuses and time', () => {
        const state = {
            sightRadius: 8, unlockedSkills: [], turnCount: 0,
            equipment: { head: null, body: null, trouser: null, leftHand: null, rightHand: null, back: null, leftFoot: null, rightFoot: null },
        } as unknown as GameState;
        const result = effectiveSightRadius(state);
        expect(result).toBeGreaterThanOrEqual(2);
    });
});
```

**Step 2: Run tests**

```bash
cd ascii-rpg && npm test -- --reporter=verbose engine-utils
```

Expected: All new tests pass.

**Step 3: Commit**

```bash
git add ascii-rpg/src/lib/game/engine-utils.test.ts
git commit -m "test: add engine-utils unit tests"
```

---

### Task 9: Write dialogue-handler tests

**Files:**
- Create: `ascii-rpg/src/lib/game/dialogue-handler.test.ts`

**Step 1: Write tests**

Test all 25 condition types in `checkCondition`, `rollSocialCheck` mechanics, `handleDialogueChoice` effects (HP heal, ATK boost, mood change, rumor learning, language learning, story collection, NPC actions, academy effects), `garbleText` consistency, `canDetectLies` rules, `closeDialogue`, `npcMoodColor`.

Key tests:
```typescript
describe('checkCondition', () => {
    // Test each of 25 condition types
    it('minLevel checks dungeon level', () => { ... });
    it('class checks character class', () => { ... });
    it('knowsLanguage checks language list', () => { ... });
    it('allOf requires all sub-conditions', () => { ... });
    // ... all 25 types
});

describe('rollSocialCheck', () => {
    it('includes class bonus', () => { ... });
    it('includes level bonus', () => { ... });
    it('returns success when total >= difficulty', () => { ... });
});

describe('handleDialogueChoice', () => {
    it('heals player on hp effect', () => { ... });
    it('adds rumor on rumor effect', () => { ... });
    it('navigates to next node', () => { ... });
    it('exits on __exit__ node', () => { ... });
    it('handles social check success/fail', () => { ... });
});

describe('garbleText', () => {
    it('produces consistent output for same input', () => { ... });
    it('preserves spaces', () => { ... });
});

describe('canDetectLies', () => {
    it('rogues always detect', () => { ... });
    it('Deepscript speakers detect', () => { ... });
    it('level 8+ detects', () => { ... });
});
```

**Step 2: Run tests**

```bash
cd ascii-rpg && npm test -- --reporter=verbose dialogue-handler
```

**Step 3: Commit**

```bash
git add ascii-rpg/src/lib/game/dialogue-handler.test.ts
git commit -m "test: add dialogue-handler unit tests"
```

---

### Task 10: Write combat tests

**Files:**
- Create: `ascii-rpg/src/lib/game/combat.test.ts` (if not exists — check glob, there may be no existing combat.test.ts)

**Step 1: Write tests**

Test moveEnemies behavior, attemptPush, attemptFlee, processKill, dodge/block mechanics.

Key tests:
```typescript
describe('moveEnemies', () => {
    it('moves enemies toward player', () => { ... });
    it('enemies attack when adjacent', () => { ... });
    it('stunned enemies skip turn', () => { ... });
    it('sleeping enemies skip turn', () => { ... });
    it('spellcaster enemies cast spells in range', () => { ... });
    it('exam golem follows 3-turn cycle', () => { ... });
    it('hazard damage kills enemies and awards XP', () => { ... });
    it('ticks status effects on all entities', () => { ... });
});

describe('attemptPush', () => {
    it('pushes enemy into hazard', () => { ... });
    it('does not push through walls', () => { ... });
});

describe('attemptFlee', () => {
    it('moves player to open tile', () => { ... });
    it('fails when surrounded', () => { ... });
});

describe('processKill', () => {
    it('awards XP and increments stats', () => { ... });
    it('awards triple XP for bosses', () => { ... });
    it('awards double XP for rares', () => { ... });
    it('handles exam golem kill', () => { ... });
});
```

**Step 2: Run tests**

```bash
cd ascii-rpg && npm test -- --reporter=verbose combat
```

**Step 3: Commit**

```bash
git add ascii-rpg/src/lib/game/combat.test.ts
git commit -m "test: add combat unit tests"
```

---

### Task 11: Write spell-handler tests

**Files:**
- Create: `ascii-rpg/src/lib/game/spell-handler.test.ts`

**Step 1: Write tests**

Test spell targeting flow, ritual channeling, terrain effects, learn spell/ritual.

Key tests:
```typescript
describe('handleSpellTargeting', () => {
    it('cancels on Escape', () => { ... });
    it('casts single_enemy spell on valid target', () => { ... });
    it('reports no enemy when targeting empty tile', () => { ... });
    it('moves area cursor with WASD', () => { ... });
    it('casts area spell on Enter', () => { ... });
});

describe('handleRitualChanneling', () => {
    it('ticks channeling down each turn', () => { ... });
    it('cancels on Escape', () => { ... });
    it('applies effect on completion', () => { ... });
});

describe('learnSpell', () => {
    it('adds spell to learned list', () => { ... });
    it('assigns to first empty quick-cast slot', () => { ... });
    it('rejects duplicate spells', () => { ... });
    it('checks tier requirements', () => { ... });
});

describe('learnRitual', () => {
    it('adds ritual to learned list', () => { ... });
    it('rejects duplicate rituals', () => { ... });
});

describe('tickTerrainEffects', () => {
    it('damages entities on burning tiles', () => { ... });
    it('decrements duration each tick', () => { ... });
    it('removes expired effects', () => { ... });
});
```

**Step 2: Run tests**

```bash
cd ascii-rpg && npm test -- --reporter=verbose spell-handler
```

**Step 3: Commit**

```bash
git add ascii-rpg/src/lib/game/spell-handler.test.ts
git commit -m "test: add spell-handler unit tests"
```

---

### Task 12: Write renderer tests

**Files:**
- Create: `ascii-rpg/src/lib/game/renderer.test.ts`

**Step 1: Write tests**

Test rendering logic: visibility, entity display, color calculations.

Key tests:
```typescript
describe('dimColor', () => {
    it('dims #fff to approximately 35%', () => { ... });
    it('handles 3-char hex codes', () => { ... });
    it('dims #000 to #000', () => { ... });
});

describe('tileColor', () => {
    it('returns grey for walls', () => { ... });
    it('returns yellow for stairs', () => { ... });
    it('highlights detected secrets', () => { ... });
});

describe('renderColored', () => {
    it('shows player as @ with correct color', () => { ... });
    it('hides unexplored tiles', () => { ... });
    it('dims explored but not visible tiles', () => { ... });
    it('shows enemies in visible area', () => { ... });
    it('shows NPCs with mood colors', () => { ... });
});

describe('render', () => {
    it('produces grid with player @', () => { ... });
    it('shows enemies by char', () => { ... });
});
```

**Step 2: Run tests**

```bash
cd ascii-rpg && npm test -- --reporter=verbose renderer
```

**Step 3: Commit**

```bash
git add ascii-rpg/src/lib/game/renderer.test.ts
git commit -m "test: add renderer unit tests"
```

---

### Task 13: Final verification and integration test

**Files:**
- No new files

**Step 1: Run full test suite**

```bash
cd ascii-rpg && npm test
```

Expected: All 1210+ original tests pass + all new tests pass. Zero regressions.

**Step 2: Verify engine.ts line count**

```bash
wc -l ascii-rpg/src/lib/game/engine.ts
```

Expected: ~800 lines (down from 4506).

**Step 3: Verify no circular imports**

```bash
# Check that each new module can be imported independently
cd ascii-rpg && npx tsc --noEmit
```

**Step 4: Verify dev server works**

```bash
cd ascii-rpg && npm run dev
```

Manually confirm the game loads and basic gameplay works (move, attack, open spell menu, talk to NPC).

**Step 5: Final commit**

```bash
git add -A
git commit -m "refactor: complete engine.ts decomposition into domain modules

Splits engine.ts (4506 lines) into:
- engine-utils.ts: shared helpers
- combat.ts: enemy AI, melee, dodge/block/push
- dialogue-handler.ts: dialogue system
- overworld-handler.ts: overworld mode
- spell-handler.ts: spells, rituals
- renderer.ts: rendering

All 1210+ original tests pass. New unit tests added for each module."
```

```bash
git push
```
