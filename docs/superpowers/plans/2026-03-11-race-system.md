# Race System Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Elf/Dwarf/Human race selection that replaces the archetype stat system, introduces 3 race-exclusive classes, NPC race attitudes with shifting reputation, and 3 racial questlines.

**Architecture:** Race replaces archetype as the source of base attributes. A new `races.ts` module owns race definitions, attribute tables, passives, and flavor lines. The CharacterClass union expands by 3 (primordial, runesmith, spellblade) with entries in all existing Record tables. NPC attitude shifts are stored as deltas in save state.

**Tech Stack:** TypeScript, SvelteKit, Vitest

**Spec:** `docs/superpowers/specs/2026-03-11-race-system-design.md`

---

## Chunk 1: Core Types & Race Foundation

This chunk adds the CharacterRace type, creates the races.ts module, replaces the archetype stat pipeline with race-based stats, and updates save/load. After this chunk, the game runs with race selection but only the 9 existing classes.

### Task 1: Add CharacterRace type and extend CharacterConfig

**Files:**
- Modify: `ascii-rpg/src/lib/game/types.ts`
- Test: `ascii-rpg/src/lib/game/races.test.ts` (create)

- [ ] **Step 1: Add CharacterRace type to types.ts**

In `types.ts`, after line 8 (CharacterClass definition), add:

```typescript
export type CharacterRace = 'elf' | 'dwarf' | 'human';
```

- [ ] **Step 2: Add race field to CharacterConfig**

In `types.ts`, modify CharacterConfig (lines 18-25) to add `race`:

```typescript
export interface CharacterConfig {
	name: string;
	race: CharacterRace;
	characterClass: CharacterClass;
	archetype?: CharacterArchetype;
	difficulty: Difficulty;
	startingLocation: StartingLocation;
	worldSeed: string;
}
```

- [ ] **Step 3: Add PermanentBuff types**

In `types.ts`, after the QuestReward interface (~line 534), add:

```typescript
export type BuffEffect =
	| { type: 'statBonus'; stat: 'spellPower' | 'physicalDefense' | 'socialBonus'; value: number }
	| { type: 'flag'; flag: 'leyLinesAlwaysVisible' | 'runeEnhanceChance' }
	| { type: 'conditional'; trigger: 'hpBelow20Pct'; effect: 'heal25Pct'; usesPerLevel: number };

export interface PermanentBuff {
	id: string;
	source: string;
	effects: BuffEffect[];
}
```

- [ ] **Step 4: Add race-related dialogue conditions to DialogueCondition union**

In `types.ts`, extend the DialogueCondition union (lines 69-101) by adding before the `allOf` entry:

```typescript
	| { type: 'race'; value: CharacterRace }
	| { type: 'notRace'; value: CharacterRace }
	| { type: 'minRaceAttitude'; race: CharacterRace; value: number }
	| { type: 'maxRaceAttitude'; race: CharacterRace; value: number }
```

- [ ] **Step 5: Extend DialogueContext with race fields**

In `types.ts`, add to the DialogueContext interface (lines 137-170):

```typescript
	playerRace: CharacterRace;
	raceAttitude: Record<CharacterRace, number>;
```

- [ ] **Step 6: Add gender, race, and raceAttitude to NPC-related types**

Find the NPC interface in `types.ts` (~lines 184-196) and add:

```typescript
	race?: CharacterRace;
	gender?: 'male' | 'female';
	raceAttitude?: Record<CharacterRace, number>;
```

- [ ] **Step 7: Add permanentBuffs and race to player state**

In the GameState interface in `types.ts`, add:

```typescript
	playerRace: CharacterRace;
	permanentBuffs: PermanentBuff[];
	npcAttitudeShifts: Record<string, Record<CharacterRace, number>>;
```

- [ ] **Step 8: Commit type changes**

```bash
cd ascii-rpg && git add src/lib/game/types.ts && git commit -m "feat(types): add CharacterRace, PermanentBuff, race dialogue conditions"
```

### Task 2: Create races.ts module

**Files:**
- Create: `ascii-rpg/src/lib/game/races.ts`
- Create: `ascii-rpg/src/lib/game/races.test.ts`

- [ ] **Step 1: Write failing test for race attribute totals**

Create `ascii-rpg/src/lib/game/races.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { RACE_ATTRIBUTES, RACE_SIGHT_BONUS, RACE_EXCLUSIVE_CLASSES, RACE_PASSIVES } from './races';
import type { CharacterRace } from './types';

describe('RACE_ATTRIBUTES', () => {
	const races: CharacterRace[] = ['elf', 'dwarf', 'human'];

	it('all races sum to 54 attribute points', () => {
		for (const race of races) {
			const attrs = RACE_ATTRIBUTES[race];
			const total = attrs.str + attrs.int + attrs.wil + attrs.agi + attrs.vit;
			expect(total, `${race} should sum to 54`).toBe(54);
		}
	});

	it('all races have positive manaModifier', () => {
		for (const race of races) {
			expect(RACE_ATTRIBUTES[race].manaModifier).toBeGreaterThan(0);
		}
	});

	it('elf has highest int', () => {
		expect(RACE_ATTRIBUTES.elf.int).toBeGreaterThan(RACE_ATTRIBUTES.dwarf.int);
		expect(RACE_ATTRIBUTES.elf.int).toBeGreaterThan(RACE_ATTRIBUTES.human.int);
	});

	it('dwarf has highest str and vit', () => {
		expect(RACE_ATTRIBUTES.dwarf.str).toBeGreaterThan(RACE_ATTRIBUTES.elf.str);
		expect(RACE_ATTRIBUTES.dwarf.vit).toBeGreaterThan(RACE_ATTRIBUTES.elf.vit);
	});

	it('human has balanced stats', () => {
		const h = RACE_ATTRIBUTES.human;
		const spread = Math.max(h.str, h.int, h.wil, h.agi, h.vit) - Math.min(h.str, h.int, h.wil, h.agi, h.vit);
		expect(spread).toBeLessThanOrEqual(1);
	});
});

describe('RACE_SIGHT_BONUS', () => {
	it('elf gets +2, human +1, dwarf +0', () => {
		expect(RACE_SIGHT_BONUS.elf).toBe(2);
		expect(RACE_SIGHT_BONUS.human).toBe(1);
		expect(RACE_SIGHT_BONUS.dwarf).toBe(0);
	});
});

describe('RACE_EXCLUSIVE_CLASSES', () => {
	it('maps each race to one exclusive class', () => {
		expect(RACE_EXCLUSIVE_CLASSES.elf).toBe('primordial');
		expect(RACE_EXCLUSIVE_CLASSES.dwarf).toBe('runesmith');
		expect(RACE_EXCLUSIVE_CLASSES.human).toBe('spellblade');
	});
});

describe('RACE_PASSIVES', () => {
	it('each race has a passive with id and description', () => {
		for (const race of ['elf', 'dwarf', 'human'] as CharacterRace[]) {
			expect(RACE_PASSIVES[race].id).toBeTruthy();
			expect(RACE_PASSIVES[race].description).toBeTruthy();
		}
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd ascii-rpg && npx vitest run src/lib/game/races.test.ts`
Expected: FAIL — module './races' not found

- [ ] **Step 3: Create races.ts with race definitions**

Create `ascii-rpg/src/lib/game/races.ts`:

```typescript
import type { CharacterRace, CharacterClass } from './types';

export interface RaceDefinition {
	str: number;
	int: number;
	wil: number;
	agi: number;
	vit: number;
	primaryAttribute: 'str' | 'int' | 'wil' | 'agi' | 'vit';
	manaModifier: number;
}

export const RACE_ATTRIBUTES: Record<CharacterRace, RaceDefinition> = {
	elf:   { str:  7, int: 14, wil: 12, agi: 14, vit:  7, primaryAttribute: 'int', manaModifier: 1.40 },
	dwarf: { str: 14, int:  8, wil: 11, agi:  7, vit: 14, primaryAttribute: 'str', manaModifier: 0.30 },
	human: { str: 10, int: 11, wil: 11, agi: 11, vit: 11, primaryAttribute: 'int', manaModifier: 0.80 },
};

export const RACE_SIGHT_BONUS: Record<CharacterRace, number> = {
	elf: 2,
	dwarf: 0,
	human: 1,
};

export const RACE_EXCLUSIVE_CLASSES: Record<CharacterRace, CharacterClass> = {
	elf: 'primordial',
	dwarf: 'runesmith',
	human: 'spellblade',
};

export interface RacePassive {
	id: string;
	description: string;
}

export const RACE_PASSIVES: Record<CharacterRace, RacePassive> = {
	elf: {
		id: 'ley_attunement',
		description: '+1 sight radius in forests, sense ley lines within 3 tiles without True Sight',
	},
	dwarf: {
		id: 'stone_blood',
		description: 'Poison resistance (50% duration reduction), +2 physical defense underground/mountain',
	},
	human: {
		id: 'adaptable',
		description: 'Social checks get +1 bonus with any NPC',
	},
};

export function isClassAvailableForRace(race: CharacterRace, characterClass: CharacterClass): boolean {
	const exclusiveClasses: CharacterClass[] = ['primordial', 'runesmith', 'spellblade'];
	if (!exclusiveClasses.includes(characterClass)) return true;
	return RACE_EXCLUSIVE_CLASSES[race] === characterClass;
}

export const MANA_FLOOR = 5;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd ascii-rpg && npx vitest run src/lib/game/races.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd ascii-rpg && git add src/lib/game/races.ts src/lib/game/races.test.ts && git commit -m "feat(races): create races module with attribute tables and passives"
```

### Task 3: Replace archetype pipeline with race pipeline in magic.ts

**Files:**
- Modify: `ascii-rpg/src/lib/game/magic.ts`
- Modify: `ascii-rpg/src/lib/game/magic.test.ts` (update archetype tests → race tests)

- [ ] **Step 1: Update magic.test.ts — change archetype point-sum test to race point-sum test**

In `magic.test.ts`, find the archetype sum test and update it to test that `RACE_ATTRIBUTES` from `races.ts` sum to 54. Also update any tests that reference `ARCHETYPE_ATTRIBUTES` to use `RACE_ATTRIBUTES`.

- [ ] **Step 2: Run test to verify it fails**

Run: `cd ascii-rpg && npx vitest run src/lib/game/magic.test.ts`
Expected: FAIL — RACE_ATTRIBUTES not exported from magic.ts (or test references updated but code not yet)

- [ ] **Step 3: Update magic.ts**

In `magic.ts`:
- Remove `ARCHETYPE_ATTRIBUTES` (lines 24-28) — it's replaced by `RACE_ATTRIBUTES` in `races.ts`
- Update `CLASS_PROFILES` (lines 42-52): remove `suggestedArchetype` field from each entry (classes no longer imply an archetype)
- Update `recalculateDerivedStats` (lines 62-100): accept race attributes instead of archetype modifier. Apply mana floor of 5:

```typescript
export function recalculateDerivedStats(
	entity: Entity,
	armorValue: number = 0,
	weaponBonus: number = 0,
	manaModifier: number = 1.0
): void {
	const vit = entity.vit ?? 10;
	const str = entity.str ?? 10;
	const int = entity.int ?? 10;
	const wil = entity.wil ?? 10;
	const agi = entity.agi ?? 10;

	entity.maxHp = 10 + (vit * 3);
	entity.attack = str + weaponBonus;
	entity.spellPower = int + Math.floor(wil / 3);
	entity.magicResist = Math.floor(wil / 2);
	entity.dodgeChance = agi * 0.5;
	entity.critChance = agi * 0.3;
	entity.physicalDefense = armorValue + Math.floor(vit / 4);
	entity.maxMana = Math.max(5, Math.floor(int * 2 * manaModifier));
}
```

- Re-export `RACE_ATTRIBUTES` from `races.ts` for backwards compatibility if needed.

- [ ] **Step 4: Audit and update ALL callers of recalculateDerivedStats()**

The function signature changes from `archetypeMod?: number` to `manaModifier: number = 1.0`. Search all callers:

Run: `cd ascii-rpg && grep -rn "recalculateDerivedStats" src/lib/game/`

Update every call site to pass the race's `manaModifier` instead of the old archetype modifier. Key locations:
- `engine.ts` `createGame()` — pass `RACE_ATTRIBUTES[race].manaModifier`
- Any combat/level-up code that recalculates stats
- Any equipment change handlers

- [ ] **Step 5: Run test to verify it passes**

Run: `cd ascii-rpg && npx vitest run src/lib/game/magic.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
cd ascii-rpg && git add src/lib/game/magic.ts src/lib/game/magic.test.ts && git commit -m "feat(magic): replace archetype attributes with race-based stat pipeline"
```

### Task 4: Update createGame() in engine.ts to use race

**Files:**
- Modify: `ascii-rpg/src/lib/game/engine.ts`
- Modify: `ascii-rpg/src/lib/game/engine.test.ts`

- [ ] **Step 1: Write failing test for race-based character creation**

Add to `engine.test.ts`:

```typescript
import { RACE_ATTRIBUTES } from './races';

describe('createGame with race', () => {
	it('creates elf character with elf base attributes', () => {
		const state = createGame({
			name: 'Legolas', race: 'elf', characterClass: 'mage',
			difficulty: 'normal', startingLocation: 'village', worldSeed: 'test',
		});
		expect(state.player.int).toBe(RACE_ATTRIBUTES.elf.int);
		expect(state.playerRace).toBe('elf');
	});

	it('creates dwarf character with dwarf base attributes', () => {
		const state = createGame({
			name: 'Gimli', race: 'dwarf', characterClass: 'warrior',
			difficulty: 'normal', startingLocation: 'village', worldSeed: 'test',
		});
		expect(state.player.str).toBe(RACE_ATTRIBUTES.dwarf.str);
		expect(state.playerRace).toBe('dwarf');
	});

	it('rejects exclusive class for wrong race', () => {
		expect(() => createGame({
			name: 'Bad', race: 'human', characterClass: 'primordial',
			difficulty: 'normal', startingLocation: 'village', worldSeed: 'test',
		})).toThrow();
	});

	it('defaults race to human when not provided', () => {
		const state = createGame({
			name: 'Hero', characterClass: 'warrior',
			difficulty: 'normal', startingLocation: 'cave', worldSeed: 'test',
		} as any);
		expect(state.playerRace).toBe('human');
	});

	it('initializes permanentBuffs as empty array', () => {
		const state = createGame({
			name: 'Hero', race: 'human', characterClass: 'warrior',
			difficulty: 'normal', startingLocation: 'cave', worldSeed: 'test',
		});
		expect(state.permanentBuffs).toEqual([]);
	});

	it('initializes npcAttitudeShifts as empty object', () => {
		const state = createGame({
			name: 'Hero', race: 'human', characterClass: 'warrior',
			difficulty: 'normal', startingLocation: 'cave', worldSeed: 'test',
		});
		expect(state.npcAttitudeShifts).toEqual({});
	});

	it('dwarf mage has at least 5 mana (mana floor)', () => {
		const state = createGame({
			name: 'Odd', race: 'dwarf', characterClass: 'mage',
			difficulty: 'normal', startingLocation: 'village', worldSeed: 'test',
		});
		expect(state.player.maxMana).toBeGreaterThanOrEqual(5);
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd ascii-rpg && npx vitest run src/lib/game/engine.test.ts --reporter=verbose 2>&1 | head -40`
Expected: FAIL

- [ ] **Step 3: Update createGame() in engine.ts**

In `engine.ts` `createGame()` function (~line 92):

1. Import `RACE_ATTRIBUTES`, `RACE_SIGHT_BONUS`, `isClassAvailableForRace`, `MANA_FLOOR` from `./races`
2. At the top of createGame, default race: `const race = config?.race ?? 'human';`
3. Validate race+class combo: `if (!isClassAvailableForRace(race, characterClass)) throw new Error(...)`
4. Replace archetype attribute lookup (~line 115) with race attribute lookup:
   ```typescript
   const raceAttrs = RACE_ATTRIBUTES[race];
   ```
5. Set player base attributes from race instead of archetype
6. Apply race sight bonus alongside class sight bonus
7. Pass `raceAttrs.manaModifier` to `recalculateDerivedStats()` instead of archetype modifier
8. Set `state.playerRace = race`
9. Set `state.permanentBuffs = []`
10. Set `state.npcAttitudeShifts = {}`

- [ ] **Step 4: Update existing tests that create CharacterConfig without race**

Search all test files for CharacterConfig usage and add `race: 'human'` where missing. Most tests use a `makeTestState()` helper — update that helper to include `race: 'human'`.

- [ ] **Step 5: Run full test suite**

Run: `cd ascii-rpg && npm test`
Expected: ALL PASS (existing + new tests)

- [ ] **Step 6: Commit**

```bash
cd ascii-rpg && git add -A && git commit -m "feat(engine): use race attributes in createGame, replace archetype pipeline"
```

### Task 5: Update save.ts for race persistence

**Files:**
- Modify: `ascii-rpg/src/lib/game/save.ts`

- [ ] **Step 1: Bump SAVE_VERSION**

In `save.ts` line 8, change `SAVE_VERSION = 21` to `SAVE_VERSION = 22`.

- [ ] **Step 2: Add race fields to serialization**

In the `serializeState` function, ensure `playerRace`, `permanentBuffs`, and `npcAttitudeShifts` are included in the serialized output.

- [ ] **Step 3: Add migration for old saves**

In the deserialization/loading code, add fallbacks:
```typescript
playerRace: saved.playerRace ?? 'human',
permanentBuffs: saved.permanentBuffs ?? [],
npcAttitudeShifts: saved.npcAttitudeShifts ?? {},
```

- [ ] **Step 4: Run full test suite**

Run: `cd ascii-rpg && npm test`
Expected: ALL PASS

- [ ] **Step 5: Commit**

```bash
cd ascii-rpg && git add src/lib/game/save.ts && git commit -m "feat(save): persist race, permanentBuffs, npcAttitudeShifts (v22)"
```

---

## Chunk 2: New Classes (Primordial, Runesmith, Spellblade)

This chunk extends CharacterClass to include the 3 new race-exclusive classes and adds entries to every Record<CharacterClass, ...> table in the codebase.

### Task 6: Extend CharacterClass type

**Files:**
- Modify: `ascii-rpg/src/lib/game/types.ts`

- [ ] **Step 1: Add 3 new classes to CharacterClass union**

In `types.ts` line 8, change:
```typescript
export type CharacterClass = 'warrior' | 'mage' | 'rogue' | 'ranger' | 'cleric' | 'paladin' | 'necromancer' | 'bard' | 'adept' | 'primordial' | 'runesmith' | 'spellblade';
```

- [ ] **Step 2: Run TypeScript compiler to find all broken Record tables**

Run: `cd ascii-rpg && npx tsc --noEmit 2>&1 | grep "not assignable"`
Expected: Multiple errors showing missing entries in Record<CharacterClass, ...> tables

- [ ] **Step 3: Do NOT commit yet**

The CharacterClass extension will break all `Record<CharacterClass, ...>` tables. Do NOT commit until Tasks 7-10 have added entries to all tables. The commit happens at the end of Task 11.

### Task 7: Add new class entries to engine.ts and magic.ts Records

**Files:**
- Modify: `ascii-rpg/src/lib/game/engine.ts` — `CLASS_BONUSES`, `CLASS_STARTING_ITEMS`
- Modify: `ascii-rpg/src/lib/game/magic.ts` — `CLASS_PROFILES`

- [ ] **Step 1: Add to CLASS_BONUSES in engine.ts (~line 88)**

```typescript
primordial:  { hp: -1, atk: 0, sight: 2, description: 'Ley Line channeler — high magic sight, fragile' },
runesmith:   { hp: 3, atk: 1, sight: -1, description: 'Rune inscriber — durable, strong, limited vision' },
spellblade:  { hp: 2, atk: 1, sight: 0, description: 'Warrior-mage — balanced combat and magic' },
```

- [ ] **Step 2: Add to CLASS_STARTING_ITEMS in engine.ts (~line 261)**

Match the existing structure which uses `equip: [EquipmentSlot, string][]` format:

```typescript
primordial:  { equip: [['leftHand', 'wooden_staff']], inventory: ['mana_potion', 'mana_potion'] },
runesmith:   { equip: [['leftHand', 'iron_hammer']], inventory: ['health_potion', 'health_potion'] },
spellblade:  { equip: [['leftHand', 'iron_sword']], inventory: ['health_potion', 'mana_potion'] },
```

- [ ] **Step 3: Add to CLASS_PROFILES in magic.ts (~line 52)**

```typescript
primordial:  { startingAbility: 'ley_surge', armorProficiency: 'robes' },
runesmith:   { startingAbility: 'rune_ward', armorProficiency: 'heavy' },
spellblade:  { startingAbility: 'arcane_strike', armorProficiency: 'medium' },
```

Note: Remove `suggestedArchetype` from all CLASS_PROFILES entries if not already done in Task 3. Also update `+page.svelte` which reads `profile.suggestedArchetype` — this is handled in Task 21 (Character Creation UI).

- [ ] **Step 4: Commit**

```bash
cd ascii-rpg && git add src/lib/game/engine.ts src/lib/game/magic.ts && git commit -m "feat(classes): add primordial/runesmith/spellblade to engine and magic records"
```

### Task 8: Add new class entries to combat.ts, traps.ts, dialogue-handler.ts

**Files:**
- Modify: `ascii-rpg/src/lib/game/combat.ts` — 4 Records
- Modify: `ascii-rpg/src/lib/game/traps.ts` — 1 Record
- Modify: `ascii-rpg/src/lib/game/dialogue-handler.ts` — 1 Record

- [ ] **Step 1: Add to DODGE_CHANCE in combat.ts (~line 28)**

```typescript
primordial: 0.15, runesmith: 0.08, spellblade: 0.12,
```

- [ ] **Step 2: Add to BLOCK_REDUCTION in combat.ts (~line 40)**

```typescript
primordial: 0, runesmith: 2, spellblade: 1,
```

- [ ] **Step 3: Add to PUSH_CHANCE in combat.ts (~line 52)**

```typescript
primordial: 0.25, runesmith: 0.70, spellblade: 0.55,
```

- [ ] **Step 4: Add to FLEE_CHANCE in combat.ts (~line 66)**

```typescript
primordial: 0.55, runesmith: 0.40, spellblade: 0.50,
```

- [ ] **Step 5: Add to DISARM_CHANCE in traps.ts (~line 155)**

```typescript
primordial: 0.35, runesmith: 0.60, spellblade: 0.45,
```

- [ ] **Step 6: Add to SOCIAL_CLASS_BONUS in dialogue-handler.ts (~line 94)**

```typescript
primordial:  { persuade: 3, intimidate: -2, deceive: 1 },
runesmith:   { persuade: 1, intimidate: 2, deceive: -2 },
spellblade:  { persuade: 2, intimidate: 2, deceive: -1 },
```

- [ ] **Step 7: Run full test suite**

Run: `cd ascii-rpg && npm test`
Expected: Check for remaining Record<CharacterClass, ...> errors

- [ ] **Step 8: Commit**

```bash
cd ascii-rpg && git add src/lib/game/combat.ts src/lib/game/traps.ts src/lib/game/dialogue-handler.ts && git commit -m "feat(classes): add new class entries to combat, traps, social records"
```

### Task 9: Add abilities for new classes

**Files:**
- Modify: `ascii-rpg/src/lib/game/abilities.ts` — ABILITY_DEFS
- Test: `ascii-rpg/src/lib/game/abilities.test.ts`

- [ ] **Step 1: Write failing test**

Add to `abilities.test.ts`:

```typescript
it('has ability definitions for all new classes', () => {
	expect(ABILITY_DEFS.primordial).toBeDefined();
	expect(ABILITY_DEFS.primordial.name).toBe('Ley Surge');
	expect(ABILITY_DEFS.runesmith).toBeDefined();
	expect(ABILITY_DEFS.runesmith.name).toBe('Rune Ward');
	expect(ABILITY_DEFS.spellblade).toBeDefined();
	expect(ABILITY_DEFS.spellblade.name).toBe('Arcane Strike');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd ascii-rpg && npx vitest run src/lib/game/abilities.test.ts`
Expected: FAIL

- [ ] **Step 3: Add ability definitions in abilities.ts**

```typescript
primordial: {
	name: 'Ley Surge',
	description: 'Burst of raw Ley energy damaging all adjacent enemies',
	cooldown: 8,
	key: 'q',
},
runesmith: {
	name: 'Rune Ward',
	description: 'Inscribe a protective rune — blocks enemy movement for 3 turns',
	cooldown: 10,
	key: 'q',
},
spellblade: {
	name: 'Arcane Strike',
	description: 'Melee attack dealing bonus spell-power damage',
	cooldown: 6,
	key: 'q',
},
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd ascii-rpg && npx vitest run src/lib/game/abilities.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd ascii-rpg && git add src/lib/game/abilities.ts src/lib/game/abilities.test.ts && git commit -m "feat(abilities): add ley_surge, rune_ward, arcane_strike abilities"
```

### Task 10: Add mastery multipliers for new classes (and fix missing adept)

**Files:**
- Modify: `ascii-rpg/src/lib/game/mastery.ts`

- [ ] **Step 1: Add entries to CLASS_MASTERY_MULTIPLIERS (~line 114)**

First, verify the existing `adept` entry exists. If it's missing or all 1.0, add a proper entry:

```typescript
adept: {
	elements: 1.2, enchantment: 1.2, restoration: 1.2, divination: 1.3,
	alchemy: 1.2, conjuration: 1.2, shadow: 1.0,
	blood: 0.8, necromancy: 0.8, void_magic: 0.8, chronomancy: 1.0, soul: 1.0,
},
```

Then add the 3 new class entries:

```typescript
primordial: {
	elements: 1.3, enchantment: 1.0, restoration: 1.3, divination: 1.5,
	alchemy: 1.0, conjuration: 1.3, shadow: 0.8,
	blood: 0.5, necromancy: 0.5, void_magic: 0.5, chronomancy: 1.0, soul: 1.0,
},
runesmith: {
	elements: 1.3, enchantment: 1.5, restoration: 1.0, divination: 1.0,
	alchemy: 1.3, conjuration: 1.0, shadow: 0.5,
	blood: 0.5, necromancy: 0.5, void_magic: 0.5, chronomancy: 0.8, soul: 0.5,
},
spellblade: {
	elements: 1.3, enchantment: 1.3, restoration: 1.0, divination: 0.8,
	alchemy: 0.8, conjuration: 1.0, shadow: 1.0,
	blood: 1.0, necromancy: 0.8, void_magic: 0.8, chronomancy: 0.8, soul: 0.8,
},
```

- [ ] **Step 2: Run tests**

Run: `cd ascii-rpg && npm test`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
cd ascii-rpg && git add src/lib/game/mastery.ts && git commit -m "feat(mastery): add mastery multipliers for primordial, runesmith, spellblade"
```

### Task 11: Add skill trees for new classes

**Files:**
- Modify: `ascii-rpg/src/lib/game/skills.ts`
- Modify: `ascii-rpg/src/lib/game/skills.test.ts`

- [ ] **Step 1: Write failing test**

Add to `skills.test.ts`:

```typescript
describe('new class skill trees', () => {
	const newClasses = ['primordial', 'runesmith', 'spellblade'] as const;

	for (const cls of newClasses) {
		it(`${cls} has 9 skills (3 branches x 3 tiers)`, () => {
			const skills = SKILL_DEFS.filter(s => s.characterClass === cls);
			expect(skills.length).toBe(9);
		});

		it(`${cls} has 3 branches`, () => {
			const branches = new Set(SKILL_DEFS.filter(s => s.characterClass === cls).map(s => s.branch));
			expect(branches.size).toBe(3);
		});

		it(`${cls} has tiers 1-3 in each branch`, () => {
			const skills = SKILL_DEFS.filter(s => s.characterClass === cls);
			const branches = [...new Set(skills.map(s => s.branch))];
			for (const branch of branches) {
				const tiers = skills.filter(s => s.branch === branch).map(s => s.tier).sort();
				expect(tiers).toEqual([1, 2, 3]);
			}
		});
	}
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd ascii-rpg && npx vitest run src/lib/game/skills.test.ts`
Expected: FAIL

- [ ] **Step 3: Add Primordial skill tree**

Add to `SKILL_DEFS` array in `skills.ts`:

```typescript
// Primordial — Ley Channeling
{ id: 'pr_ley_1', name: 'Ley Spark', characterClass: 'primordial', branch: 'Ley Channeling', tier: 1, prerequisite: null, description: '+2 spell power on ley line tiles', bonus: { spellPower: 2 } },
{ id: 'pr_ley_2', name: 'Ley Torrent', characterClass: 'primordial', branch: 'Ley Channeling', tier: 2, prerequisite: 'pr_ley_1', description: 'Ley Surge hits 2-tile radius', bonus: { aoeRange: 1 } },
{ id: 'pr_ley_3', name: 'Ley Storm', characterClass: 'primordial', branch: 'Ley Channeling', tier: 3, prerequisite: 'pr_ley_2', description: 'Channel 3-turn escalating AOE', bonus: { spellPower: 5 } },
// Primordial — Verdant Communion
{ id: 'pr_verd_1', name: 'Root Mend', characterClass: 'primordial', branch: 'Verdant Communion', tier: 1, prerequisite: null, description: 'Heal 15% HP entering forest tiles', bonus: { hp: 3 } },
{ id: 'pr_verd_2', name: 'Bark Ward', characterClass: 'primordial', branch: 'Verdant Communion', tier: 2, prerequisite: 'pr_verd_1', description: '+3 physical defense for 5 turns', bonus: { defense: 3 } },
{ id: 'pr_verd_3', name: 'Ancient Growth', characterClass: 'primordial', branch: 'Verdant Communion', tier: 3, prerequisite: 'pr_verd_2', description: 'Summon entangling roots 3x3, immobilize 2 turns', bonus: { defense: 5 } },
// Primordial — Veil Walking
{ id: 'pr_veil_1', name: 'Fade Step', characterClass: 'primordial', branch: 'Veil Walking', tier: 1, prerequisite: null, description: 'Move through one wall per level', bonus: { sight: 1 } },
{ id: 'pr_veil_2', name: 'Spirit Sight', characterClass: 'primordial', branch: 'Veil Walking', tier: 2, prerequisite: 'pr_veil_1', description: 'Reveal hidden enemies and traps for 10 turns', bonus: { sight: 2 } },
{ id: 'pr_veil_3', name: 'Between Worlds', characterClass: 'primordial', branch: 'Veil Walking', tier: 3, prerequisite: 'pr_veil_2', description: 'Untargetable for 2 turns', bonus: { dodge: 10 } },
```

- [ ] **Step 4: Add Runesmith skill tree**

```typescript
// Runesmith — Runecraft
{ id: 'rs_rune_1', name: 'Rune of Fire', characterClass: 'runesmith', branch: 'Runecraft', tier: 1, prerequisite: null, description: 'Inscribe fire trap rune on tile', bonus: { attack: 2 } },
{ id: 'rs_rune_2', name: 'Rune of Shattering', characterClass: 'runesmith', branch: 'Runecraft', tier: 2, prerequisite: 'rs_rune_1', description: '20% chance to ignore physical defense', bonus: { attack: 3 } },
{ id: 'rs_rune_3', name: 'Rune of Annihilation', characterClass: 'runesmith', branch: 'Runecraft', tier: 3, prerequisite: 'rs_rune_2', description: 'Massive AOE rune detonation after 2 turns', bonus: { attack: 5 } },
// Runesmith — Stonebinding
{ id: 'rs_stone_1', name: 'Rune of Mending', characterClass: 'runesmith', branch: 'Stonebinding', tier: 1, prerequisite: null, description: 'Inscribe healing rune: 3 HP/turn on tile', bonus: { hp: 3 } },
{ id: 'rs_stone_2', name: 'Rune of Anchoring', characterClass: 'runesmith', branch: 'Stonebinding', tier: 2, prerequisite: 'rs_stone_1', description: '+4 defense, immune to push/knockback', bonus: { defense: 4 } },
{ id: 'rs_stone_3', name: 'Rune of the Mountain', characterClass: 'runesmith', branch: 'Stonebinding', tier: 3, prerequisite: 'rs_stone_2', description: '3x3 zone: +3 defense for 8 turns', bonus: { defense: 5 } },
// Runesmith — Forgemastery
{ id: 'rs_forge_1', name: 'Runic Temper', characterClass: 'runesmith', branch: 'Forgemastery', tier: 1, prerequisite: null, description: 'Permanently +1 ATK or DEF to one item', bonus: { attack: 1 } },
{ id: 'rs_forge_2', name: 'Resonant Craft', characterClass: 'runesmith', branch: 'Forgemastery', tier: 2, prerequisite: 'rs_forge_1', description: 'Equipment rune bonuses doubled', bonus: { attack: 2 } },
{ id: 'rs_forge_3', name: 'Masterwork', characterClass: 'runesmith', branch: 'Forgemastery', tier: 3, prerequisite: 'rs_forge_2', description: 'Upgrade item rarity by one tier once per dungeon', bonus: { attack: 3 } },
```

- [ ] **Step 5: Add Spellblade skill tree**

```typescript
// Spellblade — Battle Channeling
{ id: 'sb_battle_1', name: 'Flame Blade', characterClass: 'spellblade', branch: 'Battle Channeling', tier: 1, prerequisite: null, description: '+3 fire damage on melee for 5 turns', bonus: { attack: 3 } },
{ id: 'sb_battle_2', name: 'Frost Edge', characterClass: 'spellblade', branch: 'Battle Channeling', tier: 2, prerequisite: 'sb_battle_1', description: '25% chance to freeze enemy 1 turn', bonus: { attack: 2 } },
{ id: 'sb_battle_3', name: 'Storm Strike', characterClass: 'spellblade', branch: 'Battle Channeling', tier: 3, prerequisite: 'sb_battle_2', description: 'Melee chains lightning to 2 nearby enemies', bonus: { attack: 5 } },
// Spellblade — Aegis Arts
{ id: 'sb_aegis_1', name: 'Spell Parry', characterClass: 'spellblade', branch: 'Aegis Arts', tier: 1, prerequisite: null, description: '15% chance to negate incoming spell damage', bonus: { defense: 2 } },
{ id: 'sb_aegis_2', name: 'Arcane Riposte', characterClass: 'spellblade', branch: 'Aegis Arts', tier: 2, prerequisite: 'sb_aegis_1', description: 'On spell parry, reflect 50% damage', bonus: { spellPower: 2 } },
{ id: 'sb_aegis_3', name: 'Null Field', characterClass: 'spellblade', branch: 'Aegis Arts', tier: 3, prerequisite: 'sb_aegis_2', description: '2-tile aura: -40% magic damage for 6 turns', bonus: { defense: 5 } },
// Spellblade — War Casting
{ id: 'sb_war_1', name: 'Battle Focus', characterClass: 'spellblade', branch: 'War Casting', tier: 1, prerequisite: null, description: 'Casting spells no longer ends turn', bonus: { spellPower: 1 } },
{ id: 'sb_war_2', name: 'Channeled Blade', characterClass: 'spellblade', branch: 'War Casting', tier: 2, prerequisite: 'sb_war_1', description: 'Arcane Strike uses max of ATK or spell power', bonus: { attack: 2 } },
{ id: 'sb_war_3', name: 'Blade Storm', characterClass: 'spellblade', branch: 'War Casting', tier: 3, prerequisite: 'sb_war_2', description: 'Cast spell + melee attack in same turn', bonus: { attack: 3, spellPower: 3 } },
```

- [ ] **Step 6: Run tests**

Run: `cd ascii-rpg && npx vitest run src/lib/game/skills.test.ts`
Expected: PASS

- [ ] **Step 7: Run full test suite**

Run: `cd ascii-rpg && npm test`
Expected: ALL PASS

- [ ] **Step 8: Commit**

```bash
cd ascii-rpg && git add src/lib/game/skills.ts src/lib/game/skills.test.ts && git commit -m "feat(skills): add 27 skills for primordial, runesmith, spellblade classes"
```

---

## Chunk 3: NPC Race Attitude System

This chunk implements the NPC race attitude system: authored base attitudes, dialogue condition checks, flavor text injection, attitude shifts from player actions, and the innuendo pools.

### Task 12: Add race dialogue conditions to dialogue-handler.ts

**Files:**
- Modify: `ascii-rpg/src/lib/game/dialogue-handler.ts`
- Modify: `ascii-rpg/src/lib/game/dialogue-handler.test.ts`

- [ ] **Step 1: Write failing tests for race conditions**

Add to `dialogue-handler.test.ts`:

```typescript
describe('race dialogue conditions', () => {
	it('checks race condition', () => {
		const ctx = { ...baseContext, playerRace: 'elf' as const };
		expect(checkCondition({ type: 'race', value: 'elf' }, ctx)).toBe(true);
		expect(checkCondition({ type: 'race', value: 'dwarf' }, ctx)).toBe(false);
	});

	it('checks notRace condition', () => {
		const ctx = { ...baseContext, playerRace: 'dwarf' as const };
		expect(checkCondition({ type: 'notRace', value: 'elf' }, ctx)).toBe(true);
		expect(checkCondition({ type: 'notRace', value: 'dwarf' }, ctx)).toBe(false);
	});

	it('checks minRaceAttitude condition', () => {
		const ctx = { ...baseContext, playerRace: 'elf' as const, raceAttitude: { elf: 3, dwarf: -2, human: 0 } };
		expect(checkCondition({ type: 'minRaceAttitude', race: 'elf', value: 2 }, ctx)).toBe(true);
		expect(checkCondition({ type: 'minRaceAttitude', race: 'elf', value: 5 }, ctx)).toBe(false);
	});

	it('checks maxRaceAttitude condition', () => {
		const ctx = { ...baseContext, playerRace: 'elf' as const, raceAttitude: { elf: 3, dwarf: -2, human: 0 } };
		expect(checkCondition({ type: 'maxRaceAttitude', race: 'dwarf', value: -1 }, ctx)).toBe(true);
		expect(checkCondition({ type: 'maxRaceAttitude', race: 'elf', value: 2 }, ctx)).toBe(false);
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd ascii-rpg && npx vitest run src/lib/game/dialogue-handler.test.ts`
Expected: FAIL

- [ ] **Step 3: Add race condition handling to checkCondition()**

In `dialogue-handler.ts` `checkCondition()` function (~lines 47-82), add cases:

```typescript
case 'race': return ctx.playerRace === cond.value;
case 'notRace': return ctx.playerRace !== cond.value;
case 'minRaceAttitude': return (ctx.raceAttitude?.[cond.race] ?? 0) >= cond.value;
case 'maxRaceAttitude': return (ctx.raceAttitude?.[cond.race] ?? 0) <= cond.value;
```

- [ ] **Step 4: Update buildDialogueContext() to include race fields**

In `buildDialogueContext()` (~lines 10-44), add:

```typescript
playerRace: state.playerRace ?? 'human',
raceAttitude: npc?.raceAttitude ?? { elf: 0, dwarf: 0, human: 0 },
```

Where `npc` is passed in or extracted from context. May need to update function signature to accept NPC data.

- [ ] **Step 5: Run tests**

Run: `cd ascii-rpg && npx vitest run src/lib/game/dialogue-handler.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
cd ascii-rpg && git add src/lib/game/dialogue-handler.ts src/lib/game/dialogue-handler.test.ts && git commit -m "feat(dialogue): add race, notRace, minRaceAttitude, maxRaceAttitude conditions"
```

### Task 13: Add race flavor line pools to races.ts

**Files:**
- Modify: `ascii-rpg/src/lib/game/races.ts`
- Modify: `ascii-rpg/src/lib/game/races.test.ts`

- [ ] **Step 1: Write failing test**

Add to `races.test.ts`:

```typescript
import { getRaceFlavorLine } from './races';

describe('getRaceFlavorLine', () => {
	it('returns hostile line for very negative attitude', () => {
		const line = getRaceFlavorLine('elf', 'dwarf', -5, 'male');
		expect(line).toBeTruthy();
		expect(typeof line).toBe('string');
	});

	it('returns null for neutral attitude', () => {
		const line = getRaceFlavorLine('elf', 'dwarf', 0, 'male');
		expect(line).toBeNull();
	});

	it('returns positive line for high attitude', () => {
		const line = getRaceFlavorLine('elf', 'dwarf', 4, 'male');
		expect(line).toBeTruthy();
	});

	it('returns innuendo for female human NPC toward elf player', () => {
		// Call many times to overcome 30% random chance — statistically certain to hit
		const lines = new Set<string | null>();
		for (let i = 0; i < 200; i++) {
			lines.add(getRaceFlavorLine('human', 'elf', 2, 'female'));
		}
		// Should have gotten at least one non-null line
		const nonNull = [...lines].filter(l => l !== null);
		expect(nonNull.length).toBeGreaterThan(0);
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd ascii-rpg && npx vitest run src/lib/game/races.test.ts`
Expected: FAIL

- [ ] **Step 3: Add flavor line pools and getRaceFlavorLine() to races.ts**

Add to `races.ts`:

```typescript
type AttitudeTier = 'hostile' | 'cold' | 'neutral' | 'warm' | 'kinship';

function getAttitudeTier(score: number): AttitudeTier {
	if (score <= -4) return 'hostile';
	if (score <= -2) return 'cold';
	if (score <= 1) return 'neutral';
	if (score <= 3) return 'warm';
	return 'kinship';
}

// Lines keyed by [npcRace][playerRace][tier]
const RACE_FLAVOR_LINES: Record<CharacterRace, Record<CharacterRace, Partial<Record<AttitudeTier, string[]>>>> = {
	elf: {
		elf: {},
		dwarf: {
			hostile: [
				'...not that I\'d expect a tunnelrat to understand.',
				'Your kind grubs in the dark while the world turns above.',
			],
			cold: [
				'Hmph. Your kind always reek of soot.',
				'Stone-deaf and stone-headed, the lot of you.',
			],
			warm: [
				'You\'ve more honor than most of your kin.',
				'The Makers have always been more honest than they know.',
			],
			kinship: [
				'I\'d trust a dwarf-friend with my life. You\'ve proven that.',
				'Few bridges span the gulf between our peoples. You are one.',
			],
		},
		human: {
			hostile: [
				'Mayflies. You breed, you forget, you die.',
				'Your kind can\'t even remember last century, let alone learn from it.',
			],
			cold: [
				'Humans always want things explained quickly. How tiresome.',
				'Your eagerness would be charming if it weren\'t so destructive.',
			],
			warm: [
				'For one so brief, you carry surprising depth.',
				'There\'s wisdom in you. Unusual for your kind.',
			],
			kinship: [
				'You remind me of the Luminari humans — the best of your kind.',
				'In another age, we\'d have called you elf-friend. I call you that now.',
			],
		},
	},
	dwarf: {
		elf: {
			hostile: [
				'Centuries of life and still no common sense.',
				'Go hug a tree, leaf-ear. Leave real work to real folk.',
			],
			cold: [
				'Tree-hugger. At least stone doesn\'t rot.',
				'Your people talk much and build little.',
			],
			warm: [
				'The elder folk remember things worth remembering.',
				'Your people\'s patience — I\'ll grant you that much.',
			],
			kinship: [
				'You\'re sturdy for a surface-dweller. High praise from a dwarf.',
				'My grandsire would\'ve been proud to share ale with you.',
			],
		},
		dwarf: {},
		human: {
			hostile: [
				'Humans build on sand and wonder why it crumbles.',
				'Your empires rise and fall like bad souffle.',
			],
			cold: [
				'Always in such a rush. Try building something that lasts.',
				'You talk big for someone whose grandparents are already forgotten.',
			],
			warm: [
				'You\'ve got the stubbornness of a dwarf. Respect.',
				'Not bad for someone with such soft hands.',
			],
			kinship: [
				'The Iron Republics were our finest hour together. You honor that legacy.',
				'You\'d survive a winter in the Holds. That\'s the highest compliment I give.',
			],
		},
	},
	human: {
		elf: {
			hostile: [
				'Must be nice, living long enough to look down on everyone.',
				'Your kind hoards knowledge like dragons hoard gold.',
			],
			cold: [
				'Elves always act like they know something we don\'t.',
				'Pretty words from someone who watched our cities burn and did nothing.',
			],
			warm: [
				'The elves taught us to listen before we speak. Some of us learned.',
				'There\'s wisdom in the old forests. I see it in you.',
			],
			kinship: [
				'The world needs the long memory of the elves. Never stop remembering.',
				'You are proof that time deepens the soul.',
			],
		},
		dwarf: {
			hostile: [
				'Another mole come up for air? Go back to your tunnels.',
				'Short in stature, short in vision.',
			],
			cold: [
				'Dwarves. Stubborn as the stone they worship.',
				'Everything\'s a nail when you\'re born with a hammer for a brain.',
			],
			warm: [
				'Dwarven work outlasts empires. I respect that.',
				'There\'s something solid about your people. Literally.',
			],
			kinship: [
				'The Iron Republics wouldn\'t have stood without dwarven grit. Thank you.',
				'If I had to hold a wall, I\'d want your people beside me.',
			],
		},
		human: {},
	},
};

const INNUENDO_LINES: Record<CharacterRace, string[]> = {
	elf: [
		'They say elves are... gifted in many ways. I can see why the tales persist.',
		'My friend married an elf. She says she could never go back. To human cooking, I mean.',
		'You\'re tall for a traveler. Tall in all the ways that matter, I\'d wager.',
		'Elven grace extends to... everything, or so I\'ve heard.',
		'They say what elves lack in girth they make up for in... endurance.',
	],
	dwarf: [
		'Dwarves may be short, but I hear they make up for it in... girth of character.',
		'My sister spent a winter in the Holds. Came back walking funny. Said it was the stairs.',
		'They say dwarven craftsmanship is all about thickness and endurance. I believe it.',
		'Short but... stout, they say. In all regards.',
		'A dwarf\'s stamina underground is legendary. I wonder if that applies... elsewhere.',
	],
	human: [],
};

export function getRaceFlavorLine(
	npcRace: CharacterRace,
	playerRace: CharacterRace,
	attitudeScore: number,
	npcGender?: 'male' | 'female',
): string | null {
	const tier = getAttitudeTier(attitudeScore);
	if (tier === 'neutral') return null;

	// Innuendo pool: female human NPCs toward non-human players
	if (npcRace === 'human' && npcGender === 'female' && playerRace !== 'human' && attitudeScore >= 2) {
		const pool = INNUENDO_LINES[playerRace];
		if (pool.length > 0 && Math.random() < 0.3) {
			return pool[Math.floor(Math.random() * pool.length)];
		}
	}

	const lines = RACE_FLAVOR_LINES[npcRace]?.[playerRace]?.[tier];
	if (!lines || lines.length === 0) return null;
	return lines[Math.floor(Math.random() * lines.length)];
}
```

- [ ] **Step 4: Run tests**

Run: `cd ascii-rpg && npx vitest run src/lib/game/races.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd ascii-rpg && git add src/lib/game/races.ts src/lib/game/races.test.ts && git commit -m "feat(races): add race flavor line pools with NPC attitude tiers and innuendo"
```

### Task 14: Add raceAttitude to existing NPC definitions

**Files:**
- Modify: `ascii-rpg/src/lib/game/dialogue.ts`

- [ ] **Step 1: Add raceAttitude and gender to existing NPC definitions**

In `dialogue.ts`, update each NPC definition to include `race`, `raceAttitude`, and optional `gender`. Base attitudes on NPC lore/location:

```typescript
// Examples (update each NPC's definition object):
// Barkeep — cosmopolitan human, slight human preference
race: 'human', raceAttitude: { elf: 0, dwarf: 0, human: 1 }, gender: 'male',

// Mother — human villager, cautious of non-humans
race: 'human', raceAttitude: { elf: -1, dwarf: -1, human: 2 }, gender: 'female',

// Stranger — mysterious human, neutral
race: 'human', raceAttitude: { elf: 0, dwarf: 0, human: 0 }, gender: 'male',

// Merchant — human, likes everyone's coin equally
race: 'human', raceAttitude: { elf: 1, dwarf: 1, human: 1 }, gender: 'male',

// Hermit Vael — human, lives in forest, elf sympathies
race: 'human', raceAttitude: { elf: 3, dwarf: -1, human: 0 }, gender: 'male',

// Prof. Ignis — human academic, slight elf respect
race: 'human', raceAttitude: { elf: 2, dwarf: 1, human: 0 }, gender: 'male',

// Farmer Edric — rural human, suspicious of outsiders
race: 'human', raceAttitude: { elf: -2, dwarf: 0, human: 3 }, gender: 'male',

// Madame Vesper — human cosmopolitan, appreciates all
race: 'human', raceAttitude: { elf: 2, dwarf: 1, human: 1 }, gender: 'female',

// Guildmaster Nyx — human pragmatic, respects competence
race: 'human', raceAttitude: { elf: 0, dwarf: 2, human: 1 }, gender: 'female',

// Inspector Kaelen — human authority, biased
race: 'human', raceAttitude: { elf: -1, dwarf: -1, human: 2 }, gender: 'male',

// Duke Arandel — human nobility, human-centric
race: 'human', raceAttitude: { elf: 1, dwarf: -2, human: 3 }, gender: 'male',
```

Assign `race`, attitudes, and gender to all NPCs following their character and setting. Most existing NPCs are human. NPCs without clear lore get `race: 'human'` and `{ elf: 0, dwarf: 0, human: 0 }`.

- [ ] **Step 2: Run full test suite**

Run: `cd ascii-rpg && npm test`
Expected: ALL PASS

- [ ] **Step 3: Commit**

```bash
cd ascii-rpg && git add src/lib/game/dialogue.ts && git commit -m "feat(dialogue): add raceAttitude and gender to all NPC definitions"
```

### Task 15: Implement attitude shift mechanics

**Files:**
- Modify: `ascii-rpg/src/lib/game/engine.ts` or create `ascii-rpg/src/lib/game/race-attitudes.ts`
- Test: add to `ascii-rpg/src/lib/game/races.test.ts`

- [ ] **Step 1: Write failing test**

Add to `races.test.ts`:

```typescript
import { shiftNpcAttitude, getEffectiveAttitude } from './races';

describe('NPC attitude shifts', () => {
	it('shifts attitude toward player race', () => {
		const shifts: Record<string, Record<CharacterRace, number>> = {};
		shiftNpcAttitude(shifts, 'barkeep', 'elf', 1);
		expect(shifts['barkeep'].elf).toBe(1);
	});

	it('clamps shifts to [-5, 5]', () => {
		const shifts: Record<string, Record<CharacterRace, number>> = {};
		for (let i = 0; i < 10; i++) shiftNpcAttitude(shifts, 'barkeep', 'elf', 1);
		expect(shifts['barkeep'].elf).toBe(5);
	});

	it('combines base attitude with shift', () => {
		const base = { elf: -2, dwarf: 3, human: 0 };
		const shifts = { test_npc: { elf: 3, dwarf: 0, human: 0 } };
		expect(getEffectiveAttitude(base, shifts, 'test_npc', 'elf')).toBe(1);
	});

	it('clamps effective attitude to [-5, 5]', () => {
		const base = { elf: 4, dwarf: 0, human: 0 };
		const shifts = { test_npc: { elf: 3, dwarf: 0, human: 0 } };
		expect(getEffectiveAttitude(base, shifts, 'test_npc', 'elf')).toBe(5);
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd ascii-rpg && npx vitest run src/lib/game/races.test.ts`
Expected: FAIL

- [ ] **Step 3: Add shift functions to races.ts**

```typescript
export function shiftNpcAttitude(
	shifts: Record<string, Record<CharacterRace, number>>,
	npcId: string,
	race: CharacterRace,
	delta: number,
): void {
	if (!shifts[npcId]) shifts[npcId] = { elf: 0, dwarf: 0, human: 0 };
	shifts[npcId][race] = Math.max(-5, Math.min(5, shifts[npcId][race] + delta));
}

export function getEffectiveAttitude(
	baseAttitude: Record<CharacterRace, number>,
	shifts: Record<string, Record<CharacterRace, number>>,
	npcId: string,
	race: CharacterRace,
): number {
	const base = baseAttitude[race] ?? 0;
	const shift = shifts[npcId]?.[race] ?? 0;
	return Math.max(-5, Math.min(5, base + shift));
}
```

- [ ] **Step 4: Run tests**

Run: `cd ascii-rpg && npx vitest run src/lib/game/races.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd ascii-rpg && git add src/lib/game/races.ts src/lib/game/races.test.ts && git commit -m "feat(races): add NPC attitude shift and effective attitude functions"
```

### Task 16: Inject flavor lines into dialogue flow

**Files:**
- Modify: `ascii-rpg/src/lib/game/dialogue-handler.ts`

- [ ] **Step 1: Add flavor injection to dialogue rendering**

In `dialogue-handler.ts`, where dialogue text is assembled for display, add a call to `getRaceFlavorLine()`:

```typescript
import { getRaceFlavorLine, getEffectiveAttitude } from './races';

// In the dialogue display logic, after building the NPC's speech text:
function injectRaceFlavorLine(
	npcText: string,
	npcRace: CharacterRace | undefined,
	npcGender: 'male' | 'female' | undefined,
	baseAttitude: Record<CharacterRace, number> | undefined,
	npcId: string,
	playerRace: CharacterRace,
	shifts: Record<string, Record<CharacterRace, number>>,
): string {
	if (!npcRace || !baseAttitude) return npcText;
	const attitude = getEffectiveAttitude(baseAttitude, shifts, npcId, playerRace);
	const flavor = getRaceFlavorLine(npcRace, playerRace, attitude, npcGender);
	if (!flavor) return npcText;
	return `${flavor}\n\n${npcText}`;
}
```

Wire this function into the existing dialogue display path — prepend flavor text before the NPC's regular speech.

- [ ] **Step 2: Run full test suite**

Run: `cd ascii-rpg && npm test`
Expected: ALL PASS

- [ ] **Step 3: Commit**

```bash
cd ascii-rpg && git add src/lib/game/dialogue-handler.ts && git commit -m "feat(dialogue): inject race flavor lines into NPC speech"
```

---

## Chunk 4: Racial Questlines, Permanent Buffs & Lore

This chunk adds the 9 racial quests (3 chains × 3 parts), the permanent buff system for quest rewards, and the lore document.

### Task 17: Add permanent buff system

**Files:**
- Modify: `ascii-rpg/src/lib/game/magic.ts` (recalculateDerivedStats)
- Modify: `ascii-rpg/src/lib/game/engine.ts` (apply buffs)
- Test: add to `ascii-rpg/src/lib/game/races.test.ts`

- [ ] **Step 1: Write failing test**

Add to `races.test.ts`:

```typescript
import { applyPermanentBuffs } from './races';

describe('permanent buffs', () => {
	it('applies spellPower stat bonus', () => {
		const player = { spellPower: 10 } as any;
		const buffs = [{ id: 'ley_resonance', source: 'quest', effects: [{ type: 'statBonus' as const, stat: 'spellPower' as const, value: 3 }] }];
		const result = applyPermanentBuffs(player, buffs);
		expect(result.spellPowerBonus).toBe(3);
	});

	it('applies physicalDefense stat bonus', () => {
		const buffs = [{ id: 'runic_mastery', source: 'quest', effects: [{ type: 'statBonus' as const, stat: 'physicalDefense' as const, value: 2 }] }];
		const result = applyPermanentBuffs({} as any, buffs);
		expect(result.physicalDefenseBonus).toBe(2);
	});

	it('detects flags', () => {
		const buffs = [{ id: 'ley_resonance', source: 'quest', effects: [{ type: 'flag' as const, flag: 'leyLinesAlwaysVisible' as const }] }];
		const result = applyPermanentBuffs({} as any, buffs);
		expect(result.flags).toContain('leyLinesAlwaysVisible');
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd ascii-rpg && npx vitest run src/lib/game/races.test.ts`
Expected: FAIL

- [ ] **Step 3: Add applyPermanentBuffs to races.ts**

```typescript
export interface BuffResult {
	spellPowerBonus: number;
	physicalDefenseBonus: number;
	socialBonus: number;
	flags: string[];
}

export function applyPermanentBuffs(player: Entity, buffs: PermanentBuff[]): BuffResult {
	const result: BuffResult = { spellPowerBonus: 0, physicalDefenseBonus: 0, socialBonus: 0, flags: [] };
	for (const buff of buffs) {
		for (const effect of buff.effects) {
			if (effect.type === 'statBonus') {
				if (effect.stat === 'spellPower') result.spellPowerBonus += effect.value;
				if (effect.stat === 'physicalDefense') result.physicalDefenseBonus += effect.value;
				if (effect.stat === 'socialBonus') result.socialBonus += effect.value;
			} else if (effect.type === 'flag') {
				result.flags.push(effect.flag);
			}
		}
	}
	return result;
}
```

- [ ] **Step 4: Wire into recalculateDerivedStats or the engine**

In `engine.ts`, after calling `recalculateDerivedStats()`, apply permanent buff bonuses:

```typescript
const buffResult = applyPermanentBuffs(state.player, state.permanentBuffs);
state.player.spellPower = (state.player.spellPower ?? 0) + buffResult.spellPowerBonus;
state.player.physicalDefense = (state.player.physicalDefense ?? 0) + buffResult.physicalDefenseBonus;
```

- [ ] **Step 5: Run tests**

Run: `cd ascii-rpg && npx vitest run src/lib/game/races.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
cd ascii-rpg && git add src/lib/game/races.ts src/lib/game/races.test.ts src/lib/game/engine.ts && git commit -m "feat(buffs): add permanent buff system with stat bonuses and flags"
```

### Task 18: Add racial quest definitions

**Files:**
- Modify: `ascii-rpg/src/lib/game/types.ts` — Add `permanentBuff` to QuestReward, `raceRequirement` to Quest
- Modify: `ascii-rpg/src/lib/game/quests.ts` — Add `raceRequirement` to QuestDef, add 9 quest defs
- Modify: `ascii-rpg/src/lib/game/quests.test.ts`

**IMPORTANT:** The quest catalog variable is `QUEST_CATALOG` (not `QUESTS`) in `quests.ts`. Quest definitions use the `QuestDef` interface from `quests.ts`, not the runtime `Quest` type from `types.ts`.

- [ ] **Step 1: Add permanentBuff to QuestReward and raceRequirement to Quest types**

In `types.ts` QuestReward interface, add:
```typescript
permanentBuff?: string;
```

In `types.ts` Quest interface, add:
```typescript
raceRequirement?: CharacterRace;
```

In `quests.ts` QuestDef interface, add:
```typescript
raceRequirement?: CharacterRace;
```

- [ ] **Step 2: Write failing test**

Add to `quests.test.ts`:

```typescript
import { QUEST_CATALOG } from './quests';

describe('racial questlines', () => {
	const racialQuestIds = [
		'elf_01_withering_grove', 'elf_02_echoes', 'elf_03_unbroken_thread',
		'dwarf_01_sealed_gallery', 'dwarf_02_makers_grammar', 'dwarf_03_stone_remembers',
		'human_01_lights_in_mire', 'human_02_kings_folly', 'human_03_crown_of_depths',
	];

	for (const id of racialQuestIds) {
		it(`quest ${id} exists and has objectives`, () => {
			expect(QUEST_CATALOG[id]).toBeDefined();
			expect(QUEST_CATALOG[id].objectives.length).toBeGreaterThan(0);
		});
	}

	it('elf final quest rewards ley_resonance buff', () => {
		expect(QUEST_CATALOG['elf_03_unbroken_thread'].rewards.permanentBuff).toBe('ley_resonance');
	});

	it('dwarf final quest rewards runic_mastery buff', () => {
		expect(QUEST_CATALOG['dwarf_03_stone_remembers'].rewards.permanentBuff).toBe('runic_mastery');
	});

	it('human final quest rewards sovereigns_will buff', () => {
		expect(QUEST_CATALOG['human_03_crown_of_depths'].rewards.permanentBuff).toBe('sovereigns_will');
	});
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd ascii-rpg && npx vitest run src/lib/game/quests.test.ts`
Expected: FAIL

- [ ] **Step 4: Add 9 racial quest definitions to QUEST_CATALOG in quests.ts**

Add to the QUEST_CATALOG object in `quests.ts`. Use `QuestDef` structure (no `current` or `completed` fields on objectives — those are runtime):

```typescript
// === ELF QUESTLINE: Roots of the First Song ===
elf_01_withering_grove: {
	id: 'elf_01_withering_grove',
	title: 'The Withering Grove',
	description: 'An elder tree spirit is dying in the Eldergrove. Something drains the Ley Line beneath its roots.',
	objectives: [
		{ id: 'elf01_investigate', description: 'Investigate the dying tree spirit in Eldergrove', type: 'explore', target: 'eldergrove_spirit_tree', required: 1 },
		{ id: 'elf01_kill_corrupted', description: 'Defeat corrupted forest creatures', type: 'kill', target: 'corrupted_beast', required: 3 },
		{ id: 'elf01_find_shrine', description: 'Find the defaced elven shrine', type: 'explore', target: 'eldergrove_shrine', required: 1 },
	],
	rewards: { xp: 300, rumor: { id: 'rumor_ley_drain', text: 'Something is draining the old ley lines... and someone defaced the elder shrines with Ascended symbols.', source: 'Eldergrove investigation', accuracy: 'true' } },
	giverNpcName: 'Elder Thandril',
	isMainQuest: false,
	raceRequirement: 'elf',
},
elf_02_echoes: {
	id: 'elf_02_echoes',
	title: 'Echoes Before the Thrones',
	description: 'The shrine\'s clues lead to a hidden spirit-glade where pre-Ascension ghosts linger.',
	objectives: [
		{ id: 'elf02_find_glade', description: 'Find the hidden spirit-glade', type: 'explore', target: 'eldergrove_spirit_glade', required: 1 },
		{ id: 'elf02_talk_ghosts', description: 'Speak with the pre-Ascension spirits', type: 'talk', target: 'ancient_elf_ghost', required: 1 },
		{ id: 'elf02_defend_glade', description: 'Defeat Ascended cultists attacking the glade', type: 'kill', target: 'ascended_cultist', required: 5 },
	],
	rewards: { xp: 800, story: { id: 'story_before_thrones', title: 'Before the Thrones', text: 'The spirits spoke of an age when magic flowed freely through the world, before the thieves took the thrones and filtered all power through themselves.', teller: 'Ancient spirits', type: 'lore' } },
	giverNpcName: 'Elder Thandril',
	isMainQuest: false,
	raceRequirement: 'elf',
},
elf_03_unbroken_thread: {
	id: 'elf_03_unbroken_thread',
	title: 'The Unbroken Thread',
	description: 'Deep in the Eldergrove lies the oldest Ley Line nexus. The truth waits there.',
	objectives: [
		{ id: 'elf03_find_nexus', description: 'Reach the oldest Ley Line nexus', type: 'explore', target: 'eldergrove_ley_nexus', required: 1 },
		{ id: 'elf03_channel', description: 'Channel the raw Ley energy', type: 'collect', target: 'ley_nexus_fragment', required: 1 },
	],
	rewards: { xp: 1500, permanentBuff: 'ley_resonance' },
	giverNpcName: 'Elder Thandril',
	isMainQuest: false,
	raceRequirement: 'elf',
},

// === DWARF QUESTLINE: The Runes Beneath ===
dwarf_01_sealed_gallery: {
	id: 'dwarf_01_sealed_gallery',
	title: 'The Sealed Gallery',
	description: 'A collapsed mine shaft in Irongate reveals a pre-Ascension dwarven hall covered in unreadable runes.',
	objectives: [
		{ id: 'dwarf01_explore_hall', description: 'Explore the revealed dwarven hall', type: 'explore', target: 'irongate_sealed_hall', required: 1 },
		{ id: 'dwarf01_clear_creatures', description: 'Clear nesting creatures from the hall', type: 'kill', target: 'cave_crawler', required: 4 },
		{ id: 'dwarf01_recover_tablet', description: 'Recover the runic tablet', type: 'collect', target: 'ancient_runic_tablet', required: 1 },
	],
	rewards: { xp: 300, rumor: { id: 'rumor_unknown_runes', text: 'The runes on the tablet don\'t match any known divine script. They seem... older.', source: 'Sealed Gallery discovery', accuracy: 'true' } },
	giverNpcName: 'Forgemaster Brynn',
	isMainQuest: false,
	raceRequirement: 'dwarf',
},
dwarf_02_makers_grammar: {
	id: 'dwarf_02_makers_grammar',
	title: 'The Maker\'s Grammar',
	description: 'A dwarven lorekeeper can help decipher the tablet. The runes describe seven forces — not seven gods.',
	objectives: [
		{ id: 'dwarf02_talk_lorekeeper', description: 'Bring the tablet to the dwarven lorekeeper', type: 'talk', target: 'lorekeeper_durin', required: 1 },
		{ id: 'dwarf02_deep_delve', description: 'Delve deeper to find the full inscription', type: 'explore', target: 'irongate_deep_inscription', required: 1 },
		{ id: 'dwarf02_defeat_constructs', description: 'Defeat ancient constructs guarding the inscription', type: 'kill', target: 'ancient_construct', required: 3 },
	],
	rewards: { xp: 800, story: { id: 'story_seven_forces', title: 'Seven Forces, Not Seven Gods', text: 'The full inscription describes seven fundamental forces that govern reality: Order, Change, Time, Space, Matter, Energy, Spirit. No gods. Just forces.', teller: 'Ancient inscription', type: 'lore' } },
	giverNpcName: 'Forgemaster Brynn',
	isMainQuest: false,
	raceRequirement: 'dwarf',
},
dwarf_03_stone_remembers: {
	id: 'dwarf_03_stone_remembers',
	title: 'What the Stone Remembers',
	description: 'The deepest chamber holds a rune-covered forge built around a raw Ley Line.',
	objectives: [
		{ id: 'dwarf03_reach_forge', description: 'Reach the ancient forge chamber', type: 'explore', target: 'irongate_ancient_forge', required: 1 },
		{ id: 'dwarf03_read_runes', description: 'Decipher the forge runes', type: 'collect', target: 'forge_rune_knowledge', required: 1 },
	],
	rewards: { xp: 1500, permanentBuff: 'runic_mastery' },
	giverNpcName: 'Forgemaster Brynn',
	isMainQuest: false,
	raceRequirement: 'dwarf',
},

// === HUMAN QUESTLINE: The Drowned Throne ===
human_01_lights_in_mire: {
	id: 'human_01_lights_in_mire',
	title: 'Lights in the Mire',
	description: 'Strange lights appear over the Drowned Mire at night. Locals whisper about the sunken city of Valdris.',
	objectives: [
		{ id: 'human01_investigate_lights', description: 'Investigate the strange lights in the Drowned Mire', type: 'explore', target: 'drowned_mire_lights', required: 1 },
		{ id: 'human01_fight_marsh', description: 'Fight off marsh creatures', type: 'kill', target: 'marsh_horror', required: 3 },
		{ id: 'human01_find_seal', description: 'Find the royal seal of Valdris', type: 'collect', target: 'valdris_royal_seal', required: 1 },
	],
	rewards: { xp: 300, rumor: { id: 'rumor_valdris_seal', text: 'The royal seal of Valdris still radiates power after all these centuries. Whatever happened here was no mere wizard\'s folly.', source: 'Drowned Mire expedition', accuracy: 'true' } },
	giverNpcName: 'Old Margret',
	isMainQuest: false,
	raceRequirement: 'human',
},
human_02_kings_folly: {
	id: 'human_02_kings_folly',
	title: 'The King\'s Folly',
	description: 'The seal unlocks a partially-submerged palace wing. Wall carvings tell the true story of Valdris.',
	objectives: [
		{ id: 'human02_enter_palace', description: 'Enter the submerged palace wing', type: 'explore', target: 'valdris_palace_wing', required: 1 },
		{ id: 'human02_read_carvings', description: 'Read the wall carvings', type: 'collect', target: 'valdris_wall_carving', required: 3 },
		{ id: 'human02_survive_traps', description: 'Survive the Ascended\'s traps', type: 'explore', target: 'valdris_trap_corridor', required: 1 },
	],
	rewards: { xp: 800, story: { id: 'story_spellblade_king', title: 'The Spellblade-King\'s Truth', text: 'The Spellblade-King discovered the Ascended were false gods — mortal usurpers on stolen thrones. He gathered his warriors to storm the heavens. What destroyed Valdris was not a mad wizard but divine retribution.', teller: 'Palace wall carvings', type: 'lore' } },
	giverNpcName: 'Old Margret',
	isMainQuest: false,
	raceRequirement: 'human',
},
human_03_crown_of_depths: {
	id: 'human_03_crown_of_depths',
	title: 'Crown of the Depths',
	description: 'In the submerged throne room, the Spellblade-King\'s final message waits.',
	objectives: [
		{ id: 'human03_reach_throne', description: 'Reach the submerged throne room', type: 'explore', target: 'valdris_throne_room', required: 1 },
		{ id: 'human03_claim_crown', description: 'Claim the Crown of Valdris', type: 'collect', target: 'crown_of_valdris', required: 1 },
	],
	rewards: { xp: 1500, permanentBuff: 'sovereigns_will' },
	giverNpcName: 'Old Margret',
	isMainQuest: false,
	raceRequirement: 'human',
},
```

- [ ] **Step 5: Define the 3 permanent buff objects in races.ts**

Add to `races.ts`:

```typescript
export const RACIAL_QUEST_BUFFS: Record<string, PermanentBuff> = {
	ley_resonance: {
		id: 'ley_resonance',
		source: 'elf_03_unbroken_thread',
		effects: [
			{ type: 'statBonus', stat: 'spellPower', value: 3 },
			{ type: 'flag', flag: 'leyLinesAlwaysVisible' },
		],
	},
	runic_mastery: {
		id: 'runic_mastery',
		source: 'dwarf_03_stone_remembers',
		effects: [
			{ type: 'statBonus', stat: 'physicalDefense', value: 2 },
			{ type: 'flag', flag: 'runeEnhanceChance' },
		],
	},
	sovereigns_will: {
		id: 'sovereigns_will',
		source: 'human_03_crown_of_depths',
		effects: [
			{ type: 'statBonus', stat: 'socialBonus', value: 2 },
			{ type: 'conditional', trigger: 'hpBelow20Pct', effect: 'heal25Pct', usesPerLevel: 1 },
		],
	},
};
```

- [ ] **Step 6: Run tests**

Run: `cd ascii-rpg && npx vitest run src/lib/game/quests.test.ts`
Expected: PASS

- [ ] **Step 7: Run full test suite**

Run: `cd ascii-rpg && npm test`
Expected: ALL PASS

- [ ] **Step 8: Commit**

```bash
cd ascii-rpg && git add src/lib/game/quests.ts src/lib/game/types.ts src/lib/game/races.ts src/lib/game/quests.test.ts && git commit -m "feat(quests): add 9 racial questlines with permanent buff rewards"
```

### Task 19: Add racial quest giver NPCs and dialogue trees

**Files:**
- Modify: `ascii-rpg/src/lib/game/dialogue.ts`

- [ ] **Step 1: Add 3 new quest giver NPCs to dialogue.ts**

Each racial questline needs a quest giver NPC with dialogue tree for quest acceptance/progression:

```typescript
// Elder Thandril — Elf quest giver in Eldergrove
elder_thandril: {
	name: 'Elder Thandril',
	race: 'elf',
	gender: 'male',
	raceAttitude: { elf: 4, dwarf: -1, human: 0 },
	greeting: 'The grove speaks... if you know how to listen.',
	nodes: {
		start: {
			text: 'The elder elf regards you with ancient eyes.',
			options: [
				opt('What troubles the grove?', 'grove_trouble'),
				opt('[Elf] Elder, I feel the Ley Lines weakening.', 'elf_quest_start', '#8f4', { showIf: { type: 'allOf', conditions: [{ type: 'race', value: 'elf' }, { type: 'notQuest', value: 'elf_01_withering_grove' }] } }),
				opt('I completed the task you gave me.', 'quest_complete', undefined, { showIf: { type: 'hasQuest', value: 'elf_01_withering_grove' } }),
				opt('Farewell.', 'end'),
			],
		},
		grove_trouble: { text: 'Something drains the old roots. The Ley Lines falter.', options: [opt('Back', 'start')] },
		elf_quest_start: { text: 'You feel it too? Then you must investigate. The Withering Grove — the eldest trees are dying. Find out why.', options: [opt('I will go.', 'end', undefined, { onSelect: { type: 'acceptQuest', questId: 'elf_01_withering_grove' } })] },
		quest_complete: { text: 'You have done well. The grove remembers your service.', options: [opt('What is next?', 'end')] },
		end: { text: '', options: [] },
	},
},

// Forgemaster Brynn — Dwarf quest giver in Irongate
forgemaster_brynn: {
	name: 'Forgemaster Brynn',
	race: 'dwarf',
	gender: 'female',
	raceAttitude: { elf: -2, dwarf: 4, human: 1 },
	greeting: 'The forge never sleeps. Neither do I.',
	nodes: {
		start: {
			text: 'A stout dwarf covered in soot looks up from her anvil.',
			options: [
				opt('What happened in the mines?', 'mine_trouble'),
				opt('[Dwarf] I heard a sealed gallery was uncovered.', 'dwarf_quest_start', '#fa0', { showIf: { type: 'allOf', conditions: [{ type: 'race', value: 'dwarf' }, { type: 'notQuest', value: 'dwarf_01_sealed_gallery' }] } }),
				opt('I have news about the gallery.', 'quest_complete', undefined, { showIf: { type: 'hasQuest', value: 'dwarf_01_sealed_gallery' } }),
				opt('Farewell.', 'end'),
			],
		},
		mine_trouble: { text: 'A collapse revealed something old. Very old. Runes nobody can read.', options: [opt('Back', 'start')] },
		dwarf_quest_start: { text: 'Aye. Runes older than any record. Clear the vermin out and bring me that tablet. I need to see those markings myself.', options: [opt('Consider it done.', 'end', undefined, { onSelect: { type: 'acceptQuest', questId: 'dwarf_01_sealed_gallery' } })] },
		quest_complete: { text: 'Let me see... by the Makers, these runes... they describe forces, not gods.', options: [opt('What does that mean?', 'end')] },
		end: { text: '', options: [] },
	},
},

// Old Margret — Human quest giver in Drowned Mire
old_margret: {
	name: 'Old Margret',
	race: 'human',
	gender: 'female',
	raceAttitude: { elf: -1, dwarf: 0, human: 3 },
	greeting: 'The mire keeps its secrets... most of the time.',
	nodes: {
		start: {
			text: 'An old woman wrapped in a tattered shawl stares out at the marshes.',
			options: [
				opt('What are those lights?', 'mire_lights'),
				opt('[Human] My grandmother told stories of Valdris.', 'human_quest_start', '#48f', { showIf: { type: 'allOf', conditions: [{ type: 'race', value: 'human' }, { type: 'notQuest', value: 'human_01_lights_in_mire' }] } }),
				opt('I found something in the ruins.', 'quest_complete', undefined, { showIf: { type: 'hasQuest', value: 'human_01_lights_in_mire' } }),
				opt('Farewell.', 'end'),
			],
		},
		mire_lights: { text: 'Valdris. The sunken city. They say a mad wizard destroyed it. I say that\'s what they want you to believe.', options: [opt('Back', 'start')] },
		human_quest_start: { text: 'Then you know the old name. Go into the mire. Find what the Church buried under all that mud and lies. Look for the royal seal.', options: [opt('I will find the truth.', 'end', undefined, { onSelect: { type: 'acceptQuest', questId: 'human_01_lights_in_mire' } })] },
		quest_complete: { text: 'The seal... it still glows. After all these years. Whatever happened here was no wizard\'s folly.', options: [opt('What happened next?', 'end')] },
		end: { text: '', options: [] },
	},
},
```

Note: These are initial dialogue trees. Later quest stages (parts 2 and 3) extend these NPCs' dialogue with additional nodes gated by quest completion conditions.

- [ ] **Step 2: Run full test suite**

Run: `cd ascii-rpg && npm test`
Expected: ALL PASS

- [ ] **Step 3: Commit**

```bash
cd ascii-rpg && git add src/lib/game/dialogue.ts && git commit -m "feat(dialogue): add racial quest giver NPCs with dialogue trees"
```

### Task 20: Add race lore document

**Files:**
- Create: `docs/lore/races.md`

- [ ] **Step 1: Write lore document**

Create `docs/lore/races.md`:

```markdown
# The Mortal Races of Aethermoor

## Elves — The Remembering People

The eldest of the mortal races. Elven lifespans stretch centuries, and their oral traditions reach back to the Age of Silence — before the Ascended claimed their thrones. They settled the great forests where Ley Lines run shallow beneath root systems, and their Primordialists learned to draw magic directly from these currents. The Luminari civilization, co-founded with humans, was the golden age of art and knowledge, but elves remember older things — songs that name no gods, rituals that need no prayer. The Verdant Reach, their modern homeland, is ruled jointly by elven elders and druids. Many elves harbor a quiet distrust of divine institutions, though they rarely speak of why. The Church of the Radiant Sun considers elven "Old Ways" to be primitive superstition. The elves know better.

### Elven Traits
- **Longevity**: Elves live for centuries, carrying memories that other races have long forgotten.
- **Ley Attunement**: A natural sensitivity to Ley Lines, allowing them to sense magical currents in forests and ancient places.
- **Old Magic**: The Primordialist tradition draws power directly from Ley Lines, bypassing the Ascended entirely.
- **Cultural Memory**: Oral traditions preserve knowledge from before the Ascension — a dangerous inheritance.

### The Primordial Class
Elite practitioners of the oldest magic. Primordials draw raw power from Ley Lines without the intermediary of gods or academic formulas. Their magic is older than the Ascended, older than the temples, older than written language. It is also unpredictable — the Ley Lines were never meant to be channeled by mortal hands.

---

## Dwarves — The Makers Beneath

Dwarves built their civilization underground, around mineral veins and the deep Ley Lines that pulse through bedrock. Their Runeweaver tradition is the oldest written magic — runes carved into stone that channel fundamental forces. The Undermountain Holds control major mineral deposits and several underground Ley Line junctions. The Iron Republics, co-founded with humans, rejected dependence on divine magic in favor of engineering and runecraft. Dwarves are pragmatic, stubborn, and deeply proud of self-reliance. Their theologians have long noted that dwarven runes describe seven forces, not seven gods — a discrepancy the Church dismisses as "incomplete understanding." Dwarves don't argue the point. They just keep carving.

### Dwarven Traits
- **Stone Blood**: A natural resistance to poisons and toxins, born from generations of exposure to deep mineral fumes.
- **Runic Heritage**: An innate understanding of runic patterns that channel fundamental forces.
- **Deep Knowledge**: Living close to Ley Lines, dwarves have accumulated observations that the surface world has forgotten.
- **Self-Reliance**: The dwarven philosophy of building rather than praying has produced the most enduring civilization in history.

### The Runesmith Class
Master inscribers who carve magical runes into stone, metal, and equipment. Runesmiths discovered that their ancient runes correspond to the seven fundamental forces of reality — not the seven Ascended gods. This theological discrepancy is the most dangerous secret in dwarven scholarship, and the most carefully kept.

---

## Humans — The Inheritors

The youngest and most numerous race. Humans built the Aetherian Empire, the largest dominion in recorded history, through sheer adaptability — they mastered every magical tradition, allied with every race, and settled every terrain. Their greatest achievement was the Spellblade corps, warrior-mages who combined martial discipline with arcane power. Their greatest tragedy was Valdris, the shining capital, swallowed by marshland in a single night. Official histories blame a mad wizard's hubris. The Church preaches it as divine punishment for mortal arrogance. The ruins still glow on moonless nights. Humans are found in every faction, every tradition, every corner of the world. They adapt, they endure, and they forget — which may be why the truth stays hidden.

### Human Traits
- **Adaptable**: Humans excel at learning any skill, joining any faction, and mastering any tradition.
- **Social Versatility**: Natural diplomats, humans navigate the complex web of racial politics with ease.
- **Short Memory**: Human lifespans mean that inconvenient truths are forgotten within a few generations — a trait the Ascended rely upon.
- **Ambition**: What humans lack in specialization, they make up for in drive. This ambition built empires — and destroyed them.

### The Spellblade Class
The legendary warrior-mages of the Aetherian Empire. Spellblades weave sword and spell into a single deadly art, channeling arcane energy through their weapons. The tradition was thought destroyed with Valdris, but its techniques survived in scattered training manuals and the muscle memory of old bloodlines. The last Spellblade-King died challenging the Ascended. His successors carry his legacy — and perhaps his cause.

---

## Racial Tensions

The three races coexist uneasily across Aethermoor. Ancient grievances, cultural misunderstandings, and competing interests create friction that manifests in everyday interactions:

- **Elves and Dwarves**: The oldest rivalry. Elves see dwarves as crude materialists; dwarves see elves as impractical dreamers. Yet both traditions preserve knowledge of the pre-Ascension world, making them natural — if reluctant — allies in the search for truth.
- **Elves and Humans**: Elves remember human empires rising and falling, each one repeating the same mistakes. Humans resent elven condescension. Yet the Luminari partnership proved what the two races can achieve together.
- **Dwarves and Humans**: The Iron Republics forged strong bonds between these practical peoples. Dwarves respect human industriousness; humans admire dwarven craftsmanship. The friction is subtler — humans forget too quickly, and dwarves never forget at all.
```

- [ ] **Step 2: Commit**

```bash
cd ascii-rpg && cd .. && git add docs/lore/races.md && git commit -m "docs(lore): add race lore for elves, dwarves, and humans"
```

### Task 21: Implement racial passive gameplay effects

**Files:**
- Modify: `ascii-rpg/src/lib/game/engine.ts` (sight radius for elf forests)
- Modify: `ascii-rpg/src/lib/game/combat.ts` or `status-effects.ts` (dwarf poison resistance)
- Modify: `ascii-rpg/src/lib/game/dialogue-handler.ts` (human social bonus)
- Test: add to `ascii-rpg/src/lib/game/races.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
describe('racial passive effects', () => {
	it('elf gets +1 sight in forest terrain', () => {
		// Test that sight radius calculation adds 1 when player race is elf and terrain is forest
	});

	it('dwarf gets 50% poison duration reduction', () => {
		// Test that poison status effect duration is halved for dwarf race
	});

	it('human gets +1 to social check rolls', () => {
		// Test that rollSocialCheck adds 1 to the roll when player race is human
	});
});
```

- [ ] **Step 2: Implement elf forest sight bonus**

In the sight radius calculation (likely in `engine.ts` or `overworld-handler.ts`), add:
```typescript
if (state.playerRace === 'elf' && currentTerrain === 'forest') {
	sightRadius += 1;
}
```

- [ ] **Step 3: Implement dwarf poison resistance**

Where poison status effects are applied, check for dwarf race and halve duration:
```typescript
if (state.playerRace === 'dwarf' && effect.type === 'poisoned') {
	effect.duration = Math.max(1, Math.floor(effect.duration / 2));
}
```

- [ ] **Step 4: Implement human social bonus**

In `dialogue-handler.ts` `rollSocialCheck()`, add +1 when `playerRace === 'human'`:
```typescript
const raceBonus = ctx.playerRace === 'human' ? 1 : 0;
const totalBonus = classBonus + raceBonus;
```

- [ ] **Step 5: Implement elf ley line sensing (3-tile range without True Sight)**

In the overworld rendering or FOV code, if `playerRace === 'elf'`, reveal ley line tiles within 3 tiles even without True Sight active.

- [ ] **Step 6: Implement dwarf +2 physical defense underground/mountain**

In `recalculateDerivedStats()` or combat defense calculation, add +2 when dwarf is in dungeon or mountain terrain.

- [ ] **Step 7: Run tests**

Run: `cd ascii-rpg && npm test`
Expected: ALL PASS

- [ ] **Step 8: Commit**

```bash
cd ascii-rpg && git add -A && git commit -m "feat(races): implement racial passive gameplay effects"
```

### Task 22: Wire attitude shift triggers into game logic

**Files:**
- Modify: `ascii-rpg/src/lib/game/engine.ts` (quest completion handler)
- Modify: `ascii-rpg/src/lib/game/dialogue-handler.ts` (theft/threat detection)

- [ ] **Step 1: On quest completion, shift NPC attitude +1**

In the quest completion handler (where quest rewards are given), add:
```typescript
import { shiftNpcAttitude } from './races';

// After completing a quest for an NPC:
if (quest.giverNpcName) {
	shiftNpcAttitude(state.npcAttitudeShifts, quest.giverNpcName, state.playerRace, 1);
}
```

- [ ] **Step 2: On racial questline completion, shift all region NPCs +1**

When a racial quest part is completed, find all NPCs in the quest's region and shift their attitudes:
```typescript
// For regional quests, shift all NPCs in the same region
if (quest.raceRequirement) {
	// Find region from quest location, shift all NPCs in region
	for (const npcId of getRegionNpcIds(state, questRegion)) {
		shiftNpcAttitude(state.npcAttitudeShifts, npcId, state.playerRace, 1);
	}
}
```

- [ ] **Step 3: On intimidation/theft in dialogue, shift attitude -1**

In `dialogue-handler.ts`, when a social check of type `intimidate` succeeds or a theft-related dialogue effect triggers:
```typescript
shiftNpcAttitude(state.npcAttitudeShifts, npcId, state.playerRace, -1);
```

- [ ] **Step 4: Run tests**

Run: `cd ascii-rpg && npm test`
Expected: ALL PASS

- [ ] **Step 5: Commit**

```bash
cd ascii-rpg && git add -A && git commit -m "feat(attitudes): wire NPC attitude shifts into quest and dialogue events"
```

### Task 23: Implement permanent buff runtime effects

**Files:**
- Modify: `ascii-rpg/src/lib/game/combat.ts` (conditional heal trigger)
- Modify: `ascii-rpg/src/lib/game/dialogue-handler.ts` (social bonus from buffs)
- Modify: `ascii-rpg/src/lib/game/overworld-handler.ts` or `spell-handler.ts` (ley lines always visible)
- Modify: `ascii-rpg/src/lib/game/loot.ts` or `items.ts` (rune enhance chance)

- [ ] **Step 1: Implement Sovereign's Will conditional heal**

In combat damage handling, after applying damage to the player:
```typescript
const buffResult = applyPermanentBuffs(state.player, state.permanentBuffs);
if (buffResult.flags.includes('sovereigns_will_conditional')) {
	// Check if HP dropped below 20% and heal hasn't been used this level
	if (state.player.hp <= state.player.maxHp * 0.2 && !state.sovereignsWillUsedThisLevel) {
		state.player.hp += Math.floor(state.player.maxHp * 0.25);
		state.sovereignsWillUsedThisLevel = true;
		addMessage(state, 'The Crown of Valdris flares — ancient power restores your strength!');
	}
}
```

Reset `sovereignsWillUsedThisLevel` when entering a new dungeon level.

- [ ] **Step 2: Implement ley lines always visible flag**

In the ley line rendering code (overworld-handler.ts or spell-handler.ts), check:
```typescript
const buffResult = applyPermanentBuffs(state.player, state.permanentBuffs);
if (buffResult.flags.includes('leyLinesAlwaysVisible') || state.trueSightActive) {
	// Show ley lines
}
```

- [ ] **Step 3: Implement rune enhance chance on loot/equipment**

When items are found or crafted, check for `runeEnhanceChance` flag and add a small probability of bonus rune effects.

- [ ] **Step 4: Implement social bonus from permanent buffs**

In `rollSocialCheck()`, add the buff social bonus:
```typescript
const buffResult = applyPermanentBuffs(state.player, state.permanentBuffs);
const totalBonus = classBonus + raceBonus + buffResult.socialBonus;
```

- [ ] **Step 5: Run tests**

Run: `cd ascii-rpg && npm test`
Expected: ALL PASS

- [ ] **Step 6: Commit**

```bash
cd ascii-rpg && git add -A && git commit -m "feat(buffs): implement permanent buff runtime effects"
```

### Task 24: Place racial quest trigger locations in overworld

**Files:**
- Modify: `ascii-rpg/src/lib/game/overworld.ts` or `overworld-handler.ts`

- [ ] **Step 1: Add quest trigger points of interest**

In the region/settlement definitions for Eldergrove, Irongate, and Drowned Mire, add points of interest that serve as quest trigger locations:

```typescript
// In Eldergrove: spirit tree, shrine, spirit glade, ley nexus
// In Irongate: sealed hall, deep inscription, ancient forge
// In Drowned Mire: marsh lights area, palace wing, throne room
```

These are explore targets referenced by the quest objectives. They should appear as discoverable locations when the player enters the relevant region with the active quest.

- [ ] **Step 2: Gate quest location visibility by race and quest status**

Locations only appear if:
- Player has the matching race
- Player has accepted the relevant quest
- Player meets the level requirement

- [ ] **Step 3: Run tests**

Run: `cd ascii-rpg && npm test`
Expected: ALL PASS

- [ ] **Step 4: Commit**

```bash
cd ascii-rpg && git add -A && git commit -m "feat(overworld): add racial quest trigger locations in regions"
```

### Task 25: Character creation UI — add race selection

**Files:**
- Modify: `ascii-rpg/src/routes/+page.svelte`

- [ ] **Step 1: Add race selection as first step**

In `+page.svelte`, the character creation flow currently has steps for class, difficulty, and starting location. Add a race selection step **before** class selection:

- Show 3 race cards (Elf, Dwarf, Human) with:
  - Race name and ASCII portrait
  - Stat preview (STR/INT/WIL/AGI/VIT values)
  - Passive ability description
  - Exclusive class callout
- Store selected race in component state

- [ ] **Step 2: Filter class selection by race**

After race is selected, show class selection with:
- All 9 base classes available to everyone
- The race-exclusive class highlighted with `[Race Exclusive]` tag and distinct color
- Classes that conflict with the selected race (other races' exclusives) hidden

- [ ] **Step 3: Remove archetype selection**

The archetype selection (might/arcane/finesse) is no longer needed since race determines base stats. Remove it from the creation flow. Remove any references to `profile.suggestedArchetype`.

- [ ] **Step 4: Pass race to CharacterConfig**

When creating the game, include the selected race:
```typescript
const config: CharacterConfig = {
	name: playerName,
	race: selectedRace,
	characterClass: selectedClass,
	difficulty: selectedDifficulty,
	startingLocation: selectedLocation,
	worldSeed: generateSeed(),
};
```

- [ ] **Step 5: Run dev server and manually test**

Run: `cd ascii-rpg && npm run dev`
Verify: Race selection appears, stats preview works, exclusive classes show correctly.

- [ ] **Step 6: Commit**

```bash
cd ascii-rpg && git add src/routes/+page.svelte && git commit -m "feat(ui): add race selection to character creation screen"
```

### Task 26: Save/load backward compatibility test

**Files:**
- Modify: `ascii-rpg/src/lib/game/save.test.ts` (or create)

- [ ] **Step 1: Write backward compatibility test**

```typescript
describe('save migration to v22', () => {
	it('loads v21 save without race field, defaults to human', () => {
		const oldSave = { /* minimal v21 serialized state without race fields */ };
		const state = deserializeState(oldSave);
		expect(state.playerRace).toBe('human');
		expect(state.permanentBuffs).toEqual([]);
		expect(state.npcAttitudeShifts).toEqual({});
	});
});
```

- [ ] **Step 2: Run test and verify**

Run: `cd ascii-rpg && npx vitest run src/lib/game/save.test.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
cd ascii-rpg && git add -A && git commit -m "test(save): add backward compatibility test for race system migration"
```

### Task 27: Final integration test and cleanup

**Files:**
- Modify: various test files (add `race: 'human'` to existing CharacterConfig usages)

- [ ] **Step 1: Run full test suite**

Run: `cd ascii-rpg && npm test`

- [ ] **Step 2: Fix any remaining test failures**

Most failures will be existing tests that create CharacterConfig without a `race` field. Add `race: 'human'` to all such usages. Check for any `Record<CharacterClass, ...>` tables that still need the 3 new entries.

- [ ] **Step 3: Run TypeScript compiler check**

Run: `cd ascii-rpg && npx tsc --noEmit 2>&1 | grep -v "mastery.ts\|repl.ts\|vite.config" | head -20`
Expected: No new errors beyond the known pre-existing ones

- [ ] **Step 4: Run full test suite one final time**

Run: `cd ascii-rpg && npm test`
Expected: ALL PASS

- [ ] **Step 5: Commit any fixups**

```bash
cd ascii-rpg && git add -A && git commit -m "fix: update existing tests for race system compatibility"
```

- [ ] **Step 6: Push**

```bash
git push
```
