# Talent System Redesign

**Date**: 2026-03-10
**Status**: Approved

## Summary

Level-up gives ONLY +1 talent point. No stat changes. Stats (STR/INT/WIL/AGI/VIT)
are fixed at character creation and only modified by artifacts, enchantments, and
environmental effects. Talent points buy everything: passive skills, spells, rituals.
One talent per level, no other caps.

## What Changes

### 1. `recalculateDerivedStats()` — Remove level parameter
**File**: `magic.ts:62-100`

Remove `level` from the function signature and formulas:
- `maxHp = 10 + (VIT * 3)` (was: `+ level * floor(VIT/5)`)
- `maxMana = floor(INT * 2 * archetypeMod)` (was: `(INT * 2 + level * 3) * archetypeMod`)

All 4 call sites in `engine.ts` (lines 187, 437, 3421) stop passing `characterLevel`.
All 7 call sites in `magic.test.ts` stop passing level.

### 2. `checkLevelUp()` — Strip to talent point only
**File**: `engine.ts:164-211`

Remove:
- Auto-increment primary attribute (lines 171-174)
- `pendingAttributePoint = true` (line 178)
- Stat recalculation block (lines 182-192)
- HP/mana gain logging

Keep:
- `state.characterLevel++`
- `state.skillPoints++`
- Level-up message (simplified: "Level up! Level X. +1 Talent Point.")

### 3. Remove attribute allocation input handler
**File**: `engine.ts:3410-3425`

Delete the entire `if (state.pendingAttributePoint)` block that handles keys 1-5.

### 4. `learnSpell()` — Require talent point
**File**: `engine.ts:2932-2990`

Add at the top:
```
if (state.skillPoints <= 0) {
    addMessage(state, 'You need a talent point to learn this spell!', 'warning');
    return false;
}
state.skillPoints--;
```

### 5. `learnRitual()` — Require talent point
**File**: `engine.ts:2994-3001`

Same pattern — check and deduct `skillPoints`.

### 6. `unlockSkill()` — Already costs 1 skill point
**File**: `skills.ts` — No changes needed, already deducts 1 point.

### 7. Remove `pendingAttributePoint` from types and state
**Files**:
- `types.ts:433` — Remove field from GameState (or keep as deprecated `false`)
- `engine.ts:369` — Remove from createGame init
- `engine.ts:1931` — Remove from hard reset
- `save.ts:82,239,334` — Remove from serialization/deserialization
- `+page.svelte:1069-1081` — Remove attribute allocation UI overlay

### 8. Starting spells are free
**File**: `engine.ts:446-448`

Starting spells (from CLASS_PROFILES) should NOT cost a talent point.
They're granted as part of character creation, before any talent spending.

### 9. GameDriver cheats — Update `learnSpell()` and `learnRitual()`
**File**: `driver.ts:153-183`

Cheat methods bypass the talent point cost (they push directly to arrays).
This is correct — cheats shouldn't cost points.

### 10. Test updates

| File | What changes |
|------|-------------|
| `engine.test.ts` | Level-up tests: remove attribute gain assertions, update messages |
| `engine.test.ts:3410` | Remove attribute allocation tests |
| `magic.test.ts` | Remove level param from recalculateDerivedStats calls |
| `driver-full-year.test.ts` | Remove `pendingAttributePoint` handling from AI |
| `driver-academy.test.ts` | May need talent point for spell learning |
| `abilities.test.ts` | Remove `pendingAttributePoint: false` from makeTestState |
| `day-night.test.ts` | Same |
| `hazards.test.ts` | Same |
| `quests.test.ts` | Same |
| `rest.test.ts` | Same |
| `save.test.ts` | Remove from serialization tests |
| `stealth.test.ts` | Same |
| `survival.test.ts` | Same |
| `traps.test.ts` | Same |

### 11. REPL `teach_spell` command
**File**: `repl.ts:89`

Currently calls `game.learnSpell()` (GameDriver cheat). This is fine — cheats
bypass talent cost.

## What Does NOT Change

- XP curve (already tuned)
- Skill tree structure (passive bonuses still work the same)
- Spell/ritual catalog
- Combat system
- Equipment/artifact system
- `pendingSpecialization` (class feature at level 10, separate from stats)
- Monster stats (they use monsterAttributes, unrelated)

## Impact on Gameplay

- **Talent budget is tight**: 1 per level, spend wisely
- **Stats are gear-driven**: find VIT artifacts for HP, INT artifacts for mana
- **A level 1 with great gear > level 10 with no gear** (intentional)
- **Starting HP/mana are lower** since level doesn't contribute
  - VIT 10 warrior: 40 HP (was 42 at L1, 60 at L10)
  - INT 14 mage: 28 mana × mod (was 31 at L1, 58 at L10)
- **Difficulty may need rebalancing** — early enemies might be too hard

## File Change Count

- **Modify**: 6 source files (engine.ts, magic.ts, types.ts, save.ts, driver-full-year.test.ts, +page.svelte)
- **Update tests**: 10 test files (remove `pendingAttributePoint`, adjust level-up assertions)
- **No new files**
