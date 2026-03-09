# Ritual System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement US-MS-51 ritual magic — multi-turn channeled rituals with reagent costs, interruption mechanics, and six unique ritual effects.

**Architecture:** New `rituals.ts` module with catalog + pure functions, following the spell system pattern. GameState extended with channeling state, ward zones, teleport anchors, and summon tracking. Engine integrates channeling tick into the turn loop and blocks input during channeling.

**Tech Stack:** TypeScript, Vitest, SvelteKit (renderer in +page.svelte)

---

### Task 1: Types — Add Ritual Interfaces to GameState

**Files:**
- Modify: `ascii-rpg/src/lib/game/types.ts`

**Step 1: Add ritual-related interfaces and GameState fields**

Add after the `SpellTargetingState` interface (line 341):

```typescript
export interface RitualChannelingState {
	ritualId: string;
	turnsRemaining: number;
	turnsTotal: number;
}

export interface WardZone {
	center: Position;
	radius: number;
	damage: number;
	turnsRemaining: number;
}
```

Add these fields to the `GameState` interface, after `spellTargeting: SpellTargetingState | null;` (line 410):

```typescript
	// Ritual system (US-MS-51)
	learnedRituals: string[];
	ritualChanneling: RitualChannelingState | null;
	activeWards: WardZone[];
	teleportAnchors: Record<number, Position>;  // dungeon level → anchor position
	activeSummon: Entity | null;
	scriedLevel: number | null;
```

**Step 2: Verify no type errors**

Run: `cd ascii-rpg && npx tsc --noEmit 2>&1 | head -20`
Expected: Type errors in engine.ts (missing new fields in createGame) — that's fine, we'll fix those in Task 3.

**Step 3: Commit**

```bash
git add ascii-rpg/src/lib/game/types.ts
git commit -m "feat(rituals): add ritual interfaces and GameState fields for US-MS-51"
```

---

### Task 2: Ritual Catalog and Pure Functions

**Files:**
- Create: `ascii-rpg/src/lib/game/rituals.ts`

**Step 1: Create rituals.ts with RitualDef, catalog, and helper functions**

```typescript
/**
 * Ritual system: Multi-turn channeled rituals with reagent costs.
 * Implements US-MS-51 from Epic 79 magic system.
 */

import type { SpellSchool } from './spells';

// ---------------------------------------------------------------------------
// Ritual Definition
// ---------------------------------------------------------------------------

export type RitualEffectType = 'ward' | 'summon' | 'scry' | 'purify' | 'teleport_anchor' | 'seal';

export interface RitualDef {
	id: string;
	name: string;
	school: SpellSchool;
	description: string;
	manaCost: number;
	castTurns: number;
	reagents: { itemId: string; quantity: number }[];
	effectType: RitualEffectType;
}

// ---------------------------------------------------------------------------
// Ritual Catalog — six base rituals per US-MS-51
// ---------------------------------------------------------------------------

export const RITUAL_CATALOG: Record<string, RitualDef> = {
	ritual_ward_of_protection: {
		id: 'ritual_ward_of_protection',
		name: 'Ward of Protection',
		school: 'enchantment',
		description: 'Creates a 5x5 warded zone. Enemies entering take 5 damage and are slowed.',
		manaCost: 12,
		castTurns: 3,
		reagents: [{ itemId: 'arcane_dust', quantity: 3 }],
		effectType: 'ward',
	},
	ritual_summoning_circle: {
		id: 'ritual_summoning_circle',
		name: 'Summoning Circle',
		school: 'conjuration',
		description: 'Summons an allied Arcane Familiar to fight alongside you.',
		manaCost: 20,
		castTurns: 5,
		reagents: [
			{ itemId: 'arcane_dust', quantity: 2 },
			{ itemId: 'moonwater_vial', quantity: 1 },
		],
		effectType: 'summon',
	},
	ritual_scrying: {
		id: 'ritual_scrying',
		name: 'Scrying Ritual',
		school: 'divination',
		description: 'Reveals the complete layout of the next dungeon level.',
		manaCost: 10,
		castTurns: 3,
		reagents: [
			{ itemId: 'moonwater_vial', quantity: 1 },
			{ itemId: 'dreamleaf', quantity: 1 },
		],
		effectType: 'scry',
	},
	ritual_purification: {
		id: 'ritual_purification',
		name: 'Purification Ritual',
		school: 'restoration',
		description: 'Cleanses a 7x7 area of all hazards permanently.',
		manaCost: 15,
		castTurns: 4,
		reagents: [
			{ itemId: 'starfern', quantity: 2 },
			{ itemId: 'moonwater_vial', quantity: 1 },
		],
		effectType: 'purify',
	},
	ritual_teleportation_circle: {
		id: 'ritual_teleportation_circle',
		name: 'Teleportation Circle',
		school: 'conjuration',
		description: 'Creates a permanent anchor point. Return from anywhere on this level for 5 mana.',
		manaCost: 18,
		castTurns: 5,
		reagents: [
			{ itemId: 'arcane_dust', quantity: 3 },
			{ itemId: 'lightning_shard', quantity: 1 },
		],
		effectType: 'teleport_anchor',
	},
	ritual_sealing: {
		id: 'ritual_sealing',
		name: 'Sealing Ritual',
		school: 'shadow',
		description: 'Permanently seals an adjacent door or corridor into impassable wall.',
		manaCost: 14,
		castTurns: 4,
		reagents: [
			{ itemId: 'void_salt', quantity: 1 },
			{ itemId: 'arcane_dust', quantity: 2 },
		],
		effectType: 'seal',
	},
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getRitualDef(ritualId: string): RitualDef | undefined {
	return RITUAL_CATALOG[ritualId];
}

/** Count how many of a given item ID exist in the inventory */
export function countItemInInventory(inventory: ({ id: string } | null)[], itemId: string): number {
	return inventory.filter(item => item !== null && item.id === itemId).length;
}

/** Check if the player has all required reagents for a ritual */
export function hasReagents(inventory: ({ id: string } | null)[], ritual: RitualDef): boolean {
	for (const req of ritual.reagents) {
		if (countItemInInventory(inventory, req.itemId) < req.quantity) {
			return false;
		}
	}
	return true;
}

/** Get a list of missing reagents for display */
export function getMissingReagents(inventory: ({ id: string } | null)[], ritual: RitualDef): string[] {
	const missing: string[] = [];
	for (const req of ritual.reagents) {
		const have = countItemInInventory(inventory, req.itemId);
		if (have < req.quantity) {
			missing.push(`${req.itemId} x${req.quantity - have}`);
		}
	}
	return missing;
}

/** Remove reagents from inventory. Mutates the inventory array. Returns true if successful. */
export function consumeReagents(inventory: ({ id: string } | null)[], ritual: RitualDef): boolean {
	// First verify we have everything
	if (!hasReagents(inventory, ritual)) return false;

	for (const req of ritual.reagents) {
		let remaining = req.quantity;
		for (let i = 0; i < inventory.length && remaining > 0; i++) {
			if (inventory[i] !== null && inventory[i]!.id === req.itemId) {
				inventory[i] = null;
				remaining--;
			}
		}
	}
	return true;
}

/**
 * Roll for ritual interruption when player takes damage during channeling.
 * Returns true if the ritual is interrupted (75% chance), false if resisted (25%).
 */
export function rollInterruption(): boolean {
	return Math.random() < 0.75;
}
```

**Step 2: Commit**

```bash
git add ascii-rpg/src/lib/game/rituals.ts
git commit -m "feat(rituals): add ritual catalog with 6 base rituals and helper functions"
```

---

### Task 3: Unit Tests for Ritual Pure Functions

**Files:**
- Create: `ascii-rpg/src/lib/game/rituals.test.ts`

**Step 1: Write tests for catalog and helper functions**

```typescript
import { describe, it, expect } from 'vitest';
import {
	RITUAL_CATALOG,
	getRitualDef,
	countItemInInventory,
	hasReagents,
	getMissingReagents,
	consumeReagents,
	rollInterruption,
} from './rituals';

function makeInventory(items: (string | null)[]): ({ id: string } | null)[] {
	return items.map(id => id ? { id } : null);
}

describe('Ritual Catalog', () => {
	it('has exactly 6 rituals', () => {
		expect(Object.keys(RITUAL_CATALOG)).toHaveLength(6);
	});

	it('each ritual has valid fields', () => {
		for (const ritual of Object.values(RITUAL_CATALOG)) {
			expect(ritual.id).toBeTruthy();
			expect(ritual.name).toBeTruthy();
			expect(ritual.manaCost).toBeGreaterThan(0);
			expect(ritual.castTurns).toBeGreaterThan(0);
			expect(ritual.reagents.length).toBeGreaterThan(0);
		}
	});

	it('getRitualDef returns correct ritual', () => {
		const ward = getRitualDef('ritual_ward_of_protection');
		expect(ward).toBeDefined();
		expect(ward!.name).toBe('Ward of Protection');
	});

	it('getRitualDef returns undefined for unknown id', () => {
		expect(getRitualDef('nonexistent')).toBeUndefined();
	});
});

describe('Reagent Checking', () => {
	it('countItemInInventory counts matching items', () => {
		const inv = makeInventory(['arcane_dust', null, 'arcane_dust', 'starfern']);
		expect(countItemInInventory(inv, 'arcane_dust')).toBe(2);
		expect(countItemInInventory(inv, 'starfern')).toBe(1);
		expect(countItemInInventory(inv, 'moonwater_vial')).toBe(0);
	});

	it('hasReagents returns true when all reagents present', () => {
		const ward = RITUAL_CATALOG['ritual_ward_of_protection']; // needs arcane_dust x3
		const inv = makeInventory(['arcane_dust', 'arcane_dust', 'arcane_dust']);
		expect(hasReagents(inv, ward)).toBe(true);
	});

	it('hasReagents returns false when missing reagents', () => {
		const ward = RITUAL_CATALOG['ritual_ward_of_protection'];
		const inv = makeInventory(['arcane_dust', 'arcane_dust']); // only 2, need 3
		expect(hasReagents(inv, ward)).toBe(false);
	});

	it('hasReagents handles multiple reagent types', () => {
		const summon = RITUAL_CATALOG['ritual_summoning_circle']; // arcane_dust x2 + moonwater_vial x1
		const inv = makeInventory(['arcane_dust', 'moonwater_vial', 'arcane_dust']);
		expect(hasReagents(inv, summon)).toBe(true);
	});

	it('getMissingReagents lists what is missing', () => {
		const ward = RITUAL_CATALOG['ritual_ward_of_protection'];
		const inv = makeInventory(['arcane_dust']); // have 1, need 3
		const missing = getMissingReagents(inv, ward);
		expect(missing).toEqual(['arcane_dust x2']);
	});

	it('getMissingReagents returns empty when all present', () => {
		const ward = RITUAL_CATALOG['ritual_ward_of_protection'];
		const inv = makeInventory(['arcane_dust', 'arcane_dust', 'arcane_dust']);
		expect(getMissingReagents(inv, ward)).toEqual([]);
	});
});

describe('Reagent Consumption', () => {
	it('consumeReagents removes correct items from inventory', () => {
		const ward = RITUAL_CATALOG['ritual_ward_of_protection']; // arcane_dust x3
		const inv = makeInventory(['arcane_dust', 'starfern', 'arcane_dust', 'arcane_dust']);
		const result = consumeReagents(inv, ward);
		expect(result).toBe(true);
		expect(countItemInInventory(inv, 'arcane_dust')).toBe(0);
		expect(countItemInInventory(inv, 'starfern')).toBe(1); // untouched
	});

	it('consumeReagents returns false if not enough reagents', () => {
		const ward = RITUAL_CATALOG['ritual_ward_of_protection'];
		const inv = makeInventory(['arcane_dust']);
		const result = consumeReagents(inv, ward);
		expect(result).toBe(false);
	});

	it('consumeReagents handles multiple reagent types', () => {
		const summon = RITUAL_CATALOG['ritual_summoning_circle'];
		const inv = makeInventory(['arcane_dust', 'moonwater_vial', 'arcane_dust', 'starfern']);
		const result = consumeReagents(inv, summon);
		expect(result).toBe(true);
		expect(countItemInInventory(inv, 'arcane_dust')).toBe(0);
		expect(countItemInInventory(inv, 'moonwater_vial')).toBe(0);
		expect(countItemInInventory(inv, 'starfern')).toBe(1);
	});
});

describe('Interruption Roll', () => {
	it('rollInterruption returns boolean', () => {
		const result = rollInterruption();
		expect(typeof result).toBe('boolean');
	});

	it('rollInterruption has approximately 75% interrupt rate over many trials', () => {
		let interrupts = 0;
		const trials = 10000;
		for (let i = 0; i < trials; i++) {
			if (rollInterruption()) interrupts++;
		}
		const rate = interrupts / trials;
		expect(rate).toBeGreaterThan(0.7);
		expect(rate).toBeLessThan(0.8);
	});
});
```

**Step 2: Run tests**

Run: `cd ascii-rpg && npx vitest run src/lib/game/rituals.test.ts`
Expected: All tests PASS

**Step 3: Commit**

```bash
git add ascii-rpg/src/lib/game/rituals.test.ts
git commit -m "test(rituals): add unit tests for ritual catalog and reagent functions"
```

---

### Task 4: Engine — Initialize Ritual State and Learn Function

**Files:**
- Modify: `ascii-rpg/src/lib/game/engine.ts`

**Step 1: Add ritual imports at top of engine.ts**

After the spell import line (line 30), add:

```typescript
import { RITUAL_CATALOG, getRitualDef, hasReagents, getMissingReagents, consumeReagents, rollInterruption } from './rituals';
```

**Step 2: Initialize ritual fields in createGame()**

In the `createGame()` function, find where `spellTargeting: null,` is initialized (around line 355) and add after it:

```typescript
		learnedRituals: [],
		ritualChanneling: null,
		activeWards: [],
		teleportAnchors: {},
		activeSummon: null,
		scriedLevel: null,
```

Do the same in the permadeath reset state (around line 1848, after `spellTargeting: null,`):

```typescript
		learnedRituals: [],
		ritualChanneling: null,
		activeWards: [],
		teleportAnchors: {},
		activeSummon: null,
		scriedLevel: null,
```

**Step 3: Add learnRitual() function**

After the `learnSpell()` function (around line 2543), add:

```typescript
/** Teach the player a ritual */
export function learnRitual(state: GameState, ritualId: string): boolean {
	if (state.learnedRituals.includes(ritualId)) return false;
	if (!RITUAL_CATALOG[ritualId]) return false;
	state.learnedRituals.push(ritualId);
	const ritual = RITUAL_CATALOG[ritualId];
	addMessage(state, `You have learned the ritual: ${ritual.name}!`, 'magic');
	return true;
}
```

**Step 4: Grant starter rituals for testing**

In `createGame()`, after the starting spell assignment (around line 405), add:

```typescript
	// Grant starting rituals for testing (TODO: replace with discovery system)
	if (state.characterConfig.characterClass === 'mage' || state.characterConfig.characterClass === 'necromancer') {
		state.learnedRituals.push('ritual_ward_of_protection');
		state.learnedRituals.push('ritual_scrying');
	}
```

**Step 5: Run existing tests to confirm nothing breaks**

Run: `cd ascii-rpg && npx vitest run`
Expected: All existing tests PASS

**Step 6: Commit**

```bash
git add ascii-rpg/src/lib/game/engine.ts
git commit -m "feat(rituals): initialize ritual state in createGame and add learnRitual()"
```

---

### Task 5: Engine — Ritual Channeling Mechanics

**Files:**
- Modify: `ascii-rpg/src/lib/game/engine.ts`

**Step 1: Add beginRitual() function**

After `learnRitual()`, add:

```typescript
/** Start channeling a ritual. Validates reagents and mana, enters channeling state. */
function beginRitual(state: GameState, ritualId: string): GameState {
	const ritual = getRitualDef(ritualId);
	if (!ritual) {
		addMessage(state, 'Unknown ritual!', 'warning');
		return { ...state };
	}

	if (state.ritualChanneling) {
		addMessage(state, 'Already channeling a ritual!', 'warning');
		return { ...state };
	}

	// Check mana
	if ((state.player.mana ?? 0) < ritual.manaCost) {
		addMessage(state, `Not enough mana! (need ${ritual.manaCost}, have ${state.player.mana ?? 0})`, 'warning');
		return { ...state };
	}

	// Check reagents
	if (!hasReagents(state.inventory, ritual)) {
		const missing = getMissingReagents(state.inventory, ritual);
		addMessage(state, `Missing reagents: ${missing.join(', ')}`, 'warning');
		return { ...state };
	}

	// Sealing ritual needs direction targeting first
	if (ritual.effectType === 'seal') {
		state.ritualChanneling = { ritualId, turnsRemaining: -1, turnsTotal: ritual.castTurns };
		addMessage(state, `${ritual.name}: Choose a direction to seal (WASD). Escape to cancel.`, 'magic');
		return { ...state };
	}

	// Enter channeling state
	state.ritualChanneling = {
		ritualId,
		turnsRemaining: ritual.castTurns,
		turnsTotal: ritual.castTurns,
	};
	addMessage(state, `You begin channeling ${ritual.name}... (${ritual.castTurns} turns)`, 'magic');
	state.spellMenuOpen = false;
	moveEnemies(state);
	return { ...state };
}
```

**Step 2: Add tickRitualChanneling() function**

```typescript
/** Tick the ritual channeling state. Called when player "waits" during channeling. */
function tickRitualChanneling(state: GameState): void {
	if (!state.ritualChanneling || state.ritualChanneling.turnsRemaining <= 0) return;

	state.ritualChanneling.turnsRemaining--;

	const ritual = getRitualDef(state.ritualChanneling.ritualId);
	if (!ritual) {
		state.ritualChanneling = null;
		return;
	}

	const remaining = state.ritualChanneling.turnsRemaining;
	const total = state.ritualChanneling.turnsTotal;

	if (remaining > 0) {
		addMessage(state, `Channeling ${ritual.name}... (${total - remaining}/${total})`, 'magic');
		return;
	}

	// Ritual complete!
	// Consume mana and reagents
	state.player.mana = (state.player.mana ?? 0) - ritual.manaCost;
	consumeReagents(state.inventory, ritual);

	addMessage(state, `${ritual.name} complete!`, 'magic');
	applyRitualEffect(state, ritual);
	state.ritualChanneling = null;
}
```

**Step 3: Add interruptRitual() function**

```typescript
/** Called when player takes damage during channeling. 75% chance to interrupt. */
function checkRitualInterrupt(state: GameState, damageAmount: number): void {
	if (!state.ritualChanneling || state.ritualChanneling.turnsRemaining <= 0) return;

	const ritual = getRitualDef(state.ritualChanneling.ritualId);
	if (!ritual) {
		state.ritualChanneling = null;
		return;
	}

	if (rollInterruption()) {
		// Interrupted — consume reagents and mana on failure
		state.player.mana = (state.player.mana ?? 0) - ritual.manaCost;
		consumeReagents(state.inventory, ritual);
		state.ritualChanneling = null;
		addMessage(state, 'Your concentration shatters — the ritual fails!', 'danger');
	} else {
		addMessage(state, 'You hold your focus despite the blow!', 'magic');
	}
}
```

**Step 4: Commit**

```bash
git add ascii-rpg/src/lib/game/engine.ts
git commit -m "feat(rituals): add channeling mechanics — begin, tick, interrupt"
```

---

### Task 6: Engine — Ritual Effect Application

**Files:**
- Modify: `ascii-rpg/src/lib/game/engine.ts`

**Step 1: Add applyRitualEffect() function**

```typescript
/** Apply the completed ritual's effect to the game state */
function applyRitualEffect(state: GameState, ritual: RitualDef): void {
	const px = state.player.pos.x;
	const py = state.player.pos.y;

	switch (ritual.effectType) {
		case 'ward': {
			state.activeWards.push({
				center: { x: px, y: py },
				radius: 2, // 5x5 = radius 2 from center
				damage: 5,
				turnsRemaining: 50,
			});
			addMessage(state, 'A protective ward shimmers into existence around you!', 'magic');
			break;
		}
		case 'summon': {
			// Replace existing summon
			if (state.activeSummon) {
				state.enemies = state.enemies.filter(e => e !== state.activeSummon);
				addMessage(state, 'Your previous familiar fades away.', 'info');
			}
			const summon: Entity = {
				pos: findAdjacentFloor(state, px, py) ?? { x: px, y: py },
				char: 'f',
				color: '#c8f',
				name: 'Arcane Familiar',
				hp: 3,
				maxHp: 3,
				attack: 2,
				statusEffects: [],
			};
			state.activeSummon = summon;
			// We track the summon separately but don't add to enemies
			addMessage(state, 'An Arcane Familiar materializes beside you!', 'magic');
			break;
		}
		case 'scry': {
			state.scriedLevel = state.level + 1;
			addMessage(state, 'Visions of the level below flood your mind. The layout will be revealed when you descend.', 'magic');
			break;
		}
		case 'purify': {
			const radius = 3; // 7x7 = radius 3
			let cleaned = 0;
			state.hazards = state.hazards.filter(h => {
				if (Math.abs(h.pos.x - px) <= radius && Math.abs(h.pos.y - py) <= radius) {
					cleaned++;
					return false;
				}
				return true;
			});
			if (cleaned > 0) {
				addMessage(state, `Purifying light sweeps outward — ${cleaned} hazard${cleaned !== 1 ? 's' : ''} cleansed!`, 'magic');
			} else {
				addMessage(state, 'Purifying light sweeps outward, but finds no hazards nearby.', 'magic');
			}
			break;
		}
		case 'teleport_anchor': {
			state.teleportAnchors[state.level] = { x: px, y: py };
			addMessage(state, 'A glowing circle inscribes itself into the floor. You can return here at will.', 'magic');
			break;
		}
		case 'seal': {
			// seal direction was picked earlier — handled in seal targeting flow
			// This shouldn't be called directly for seal; it's applied during direction pick
			break;
		}
	}
}

/** Find an adjacent floor tile for summoning */
function findAdjacentFloor(state: GameState, x: number, y: number): Position | null {
	const dirs = [{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }];
	for (const d of dirs) {
		const nx = x + d.x;
		const ny = y + d.y;
		if (nx >= 0 && ny >= 0 && nx < state.map.width && ny < state.map.height &&
			state.map.tiles[ny][nx] === '.' &&
			!state.enemies.some(e => e.pos.x === nx && e.pos.y === ny) &&
			!state.npcs.some(n => n.pos.x === nx && n.pos.y === ny)) {
			return { x: nx, y: ny };
		}
	}
	return null;
}
```

**Step 2: Commit**

```bash
git add ascii-rpg/src/lib/game/engine.ts
git commit -m "feat(rituals): add ritual effect application — ward, summon, scry, purify, teleport, seal"
```

---

### Task 7: Engine — Integrate Channeling into Game Loop

**Files:**
- Modify: `ascii-rpg/src/lib/game/engine.ts`

**Step 1: Block input during channeling**

In `handleInput()`, after the dialogue block (line 2553 `if (state.activeDialogue) return state;`), add:

```typescript
	// Ritual channeling: only Escape to cancel, any other key advances channeling
	if (state.ritualChanneling && state.ritualChanneling.turnsRemaining > 0) {
		if (key === 'Escape') {
			const ritual = getRitualDef(state.ritualChanneling.ritualId);
			if (ritual) {
				state.player.mana = (state.player.mana ?? 0) - ritual.manaCost;
				consumeReagents(state.inventory, ritual);
			}
			state.ritualChanneling = null;
			addMessage(state, 'You break your concentration — the ritual fails!', 'danger');
			return { ...state };
		}
		// Any key = wait/continue channeling
		tickRitualChanneling(state);
		moveEnemies(state);
		return { ...state };
	}

	// Seal ritual direction picking
	if (state.ritualChanneling && state.ritualChanneling.turnsRemaining === -1) {
		if (key === 'Escape') {
			state.ritualChanneling = null;
			addMessage(state, 'Ritual cancelled.', 'info');
			return { ...state };
		}
		let sdx = 0, sdy = 0;
		if (key === 'w' || key === 'ArrowUp') sdy = -1;
		else if (key === 's' || key === 'ArrowDown') sdy = 1;
		else if (key === 'a' || key === 'ArrowLeft') sdx = -1;
		else if (key === 'd' || key === 'ArrowRight') sdx = 1;
		else return state;

		const sx = state.player.pos.x + sdx;
		const sy = state.player.pos.y + sdy;
		const tile = state.map.tiles[sy]?.[sx];
		if (tile !== '.' && tile !== '>') {
			addMessage(state, 'Cannot seal that tile — it must be a passable floor or corridor.', 'warning');
			return { ...state };
		}
		// Check no entity on the tile
		if (state.enemies.some(e => e.pos.x === sx && e.pos.y === sy) ||
			state.npcs.some(n => n.pos.x === sx && n.pos.y === sy)) {
			addMessage(state, 'Cannot seal — something is standing there!', 'warning');
			return { ...state };
		}

		// Store target position, start channeling
		const ritual = getRitualDef(state.ritualChanneling.ritualId)!;
		state.ritualChanneling = {
			ritualId: state.ritualChanneling.ritualId,
			turnsRemaining: ritual.castTurns,
			turnsTotal: ritual.castTurns,
		};
		// Store seal target in a temporary way — we'll use the direction
		(state.ritualChanneling as any).sealTarget = { x: sx, y: sy };
		addMessage(state, `You begin channeling ${ritual.name}... (${ritual.castTurns} turns)`, 'magic');
		state.spellMenuOpen = false;
		moveEnemies(state);
		return { ...state };
	}
```

**Step 2: Add ritual interrupt hook in damage-dealing code**

In the `moveEnemies()` function, find where enemy melee damage is applied to the player (around line 2162: `state.player.hp -= dmg;`). After that line, add:

```typescript
			checkRitualInterrupt(state, dmg);
```

Also find the Exam Golem blast damage (around line 2106: `state.player.hp -= blastDmg;`) and add:

```typescript
					checkRitualInterrupt(state, blastDmg);
```

And after the Exam Golem charge damage (around line 2120: `state.player.hp -= chargeDmg;`):

```typescript
					checkRitualInterrupt(state, chargeDmg);
```

**Step 3: Tick ward durations and summon AI in moveEnemies**

At the end of `moveEnemies()` (before the closing `}`), add:

```typescript
	// Tick active wards
	state.activeWards = state.activeWards.filter(ward => {
		ward.turnsRemaining--;
		if (ward.turnsRemaining <= 0) {
			addMessage(state, 'A protective ward fades away.', 'info');
			return false;
		}
		return true;
	});

	// Apply ward damage to enemies entering warded zones
	for (const ward of state.activeWards) {
		for (const enemy of state.enemies) {
			if (Math.abs(enemy.pos.x - ward.center.x) <= ward.radius &&
				Math.abs(enemy.pos.y - ward.center.y) <= ward.radius) {
				enemy.hp -= ward.damage;
				applyEffect(enemy, 'freeze', 1, 0); // 1-turn slow
				addMessage(state, `${enemy.name} is burned by the ward for ${ward.damage} damage!`, 'magic');
			}
		}
	}

	// Summon AI: attack nearest enemy
	if (state.activeSummon && state.activeSummon.hp > 0) {
		const summon = state.activeSummon;
		let nearest: Entity | null = null;
		let nearDist = Infinity;
		for (const enemy of state.enemies) {
			const dist = Math.abs(enemy.pos.x - summon.pos.x) + Math.abs(enemy.pos.y - summon.pos.y);
			if (dist < nearDist) {
				nearDist = dist;
				nearest = enemy;
			}
		}
		if (nearest && nearDist <= 1) {
			// Adjacent — attack
			nearest.hp -= summon.attack;
			addMessage(state, `Arcane Familiar strikes ${nearest.name} for ${summon.attack} damage!`, 'magic');
			if (nearest.hp <= 0) {
				tryDropLoot(state, nearest);
				const reward = applyXpMultiplier(xpReward(nearest, state.level), state);
				state.xp += reward;
				addMessage(state, `${nearest.name} defeated by your familiar! +${reward} XP`, 'player_attack');
				state.enemies = state.enemies.filter(e => e !== nearest);
				checkLevelUp(state);
			}
		} else if (nearest) {
			// Move toward nearest enemy
			const dx = nearest.pos.x - summon.pos.x;
			const dy = nearest.pos.y - summon.pos.y;
			const mx = dx === 0 ? 0 : dx > 0 ? 1 : -1;
			const my = dy === 0 ? 0 : dy > 0 ? 1 : -1;
			const nx = summon.pos.x + mx;
			const ny = summon.pos.y + my;
			if (nx >= 0 && ny >= 0 && nx < state.map.width && ny < state.map.height &&
				state.map.tiles[ny][nx] === '.' &&
				!(nx === state.player.pos.x && ny === state.player.pos.y) &&
				!state.enemies.some(e => e.pos.x === nx && e.pos.y === ny)) {
				summon.pos = { x: nx, y: ny };
			}
		}
	}
```

**Step 4: Handle scried level reveal on descend**

Find where the player descends to next level (search for `state.level++` or `'>''` staircase handling). Add after level generation:

```typescript
	// Reveal scried level
	if (state.scriedLevel !== null && state.level === state.scriedLevel) {
		for (let y = 0; y < state.map.height; y++) {
			for (let x = 0; x < state.map.width; x++) {
				if (state.visibility[y][x] === Visibility.Unexplored) {
					state.visibility[y][x] = Visibility.Explored;
				}
			}
		}
		state.scriedLevel = null;
		addMessage(state, 'Your earlier scrying reveals the layout of this level!', 'magic');
	}
```

**Step 5: Add "Return to Circle" handling**

In `handleInput()`, after the quick-cast key handling (around line 2667), add a key binding for ritual return (R key):

Find an appropriate spot after the existing key handlers (but before the movement keys) and add:

```typescript
	// Return to Teleportation Circle (R key when anchor exists)
	if (key === 'r' && !state.gameOver) {
		const anchor = state.teleportAnchors[state.level];
		if (anchor) {
			if ((state.player.mana ?? 0) < 5) {
				addMessage(state, 'Not enough mana to return to the circle! (need 5)', 'warning');
				return { ...state };
			}
			state.player.mana = (state.player.mana ?? 0) - 5;
			state.player.pos = { x: anchor.x, y: anchor.y };
			updateVisibility(state.visibility, state.map, state.player.pos, effectiveSightRadius(state));
			addMessage(state, 'The circle flares — you are pulled back to your anchor point.', 'magic');
			moveEnemies(state);
			return { ...state };
		}
	}
```

Note: Be careful about the existing 'r' for restart — that's only when `state.gameOver` is true, so the condition `!state.gameOver` prevents conflict.

**Step 6: Run all tests**

Run: `cd ascii-rpg && npx vitest run`
Expected: All tests PASS

**Step 7: Commit**

```bash
git add ascii-rpg/src/lib/game/engine.ts
git commit -m "feat(rituals): integrate channeling into game loop — input blocking, interrupts, effects, summon AI"
```

---

### Task 8: Spell Menu — Show Rituals

**Files:**
- Modify: `ascii-rpg/src/routes/+page.svelte`
- Modify: `ascii-rpg/src/lib/game/engine.ts`

**Step 1: Update spell menu to include rituals**

In `+page.svelte`, find the spell menu section (around line 920). After the spell list `{/each}` block (line 944) and before the "No spells learned yet" check (line 945), add:

```svelte
				{#if state.learnedRituals.length > 0}
					<div class="spell-entry" style="border-left: 3px solid #555; color: #888; pointer-events: none;">
						<span class="spell-name">--- RITUALS ---</span>
					</div>
					{#each state.learnedRituals as ritualId, ri}
						{@const ritual = getRitualDef(ritualId)}
						{@const menuIdx = state.learnedSpells.length + ri}
						{@const noMana = (state.player.mana ?? 0) < (ritual?.manaCost ?? 0)}
						{#if ritual}
							<div
								class="spell-entry"
								class:spell-selected={state.spellMenuCursor === menuIdx}
								class:spell-disabled={noMana}
								style="border-left: 3px solid {SPELL_SCHOOL_COLORS[ritual.school] ?? '#888'}"
							>
								<span class="spell-slot">   </span>
								<span class="spell-name">{ritual.name}</span>
								<span class="spell-cost" style="color:{noMana ? '#f44' : '#4488ff'}">{ritual.manaCost} MP</span>
								<span class="spell-effect">{ritual.castTurns}T · {ritual.description}</span>
							</div>
						{/if}
					{/each}
				{/if}
```

**Step 2: Update spell menu cursor navigation to include rituals**

In `engine.ts`, in the spell menu input handling (around line 2621), update the down-arrow cursor max:

Change:
```typescript
state.spellMenuCursor = Math.min(state.learnedSpells.length - 1, state.spellMenuCursor + 1);
```
To:
```typescript
state.spellMenuCursor = Math.min(state.learnedSpells.length + state.learnedRituals.length - 1, state.spellMenuCursor + 1);
```

**Step 3: Update Enter/cast to handle ritual selection**

In the spell menu Enter handler (around line 2624), change:

```typescript
		if (key === 'Enter' || key === ' ') {
			return castSpellFromMenu(state, state.spellMenuCursor);
		}
```

To:

```typescript
		if (key === 'Enter' || key === ' ') {
			if (state.spellMenuCursor >= state.learnedSpells.length) {
				// Ritual selected
				const ritualIdx = state.spellMenuCursor - state.learnedSpells.length;
				const ritualId = state.learnedRituals[ritualIdx];
				if (ritualId) {
					return beginRitual(state, ritualId);
				}
				return state;
			}
			return castSpellFromMenu(state, state.spellMenuCursor);
		}
```

**Step 4: Add getRitualDef import to +page.svelte**

In `+page.svelte`, find the imports from the game engine (search for `import.*spells`). Add:

```typescript
import { getRitualDef } from '$lib/game/rituals';
```

**Step 5: Run all tests**

Run: `cd ascii-rpg && npx vitest run`
Expected: All tests PASS

**Step 6: Commit**

```bash
git add ascii-rpg/src/lib/game/engine.ts ascii-rpg/src/routes/+page.svelte
git commit -m "feat(rituals): show rituals in spell menu with navigation and casting"
```

---

### Task 9: Renderer — Channeling Visual and HUD

**Files:**
- Modify: `ascii-rpg/src/lib/game/engine.ts` (renderColored)
- Modify: `ascii-rpg/src/routes/+page.svelte` (HUD progress bar)

**Step 1: Pulsing player character during channeling**

In `renderColored()` (around line 3576), change the player rendering:

```typescript
			if (state.player.pos.x === x && state.player.pos.y === y) {
				const playerColor = effectColor(state.player) ?? state.player.color;
				row.push({ char: '@', color: playerColor });
```

To:

```typescript
			if (state.player.pos.x === x && state.player.pos.y === y) {
				const playerColor = effectColor(state.player) ?? state.player.color;
				if (state.ritualChanneling && state.ritualChanneling.turnsRemaining > 0) {
					// Pulsing effect during ritual channeling
					const pulseChar = state.turnCount % 2 === 0 ? '@' : '*';
					row.push({ char: pulseChar, color: '#c8f' });
				} else {
					row.push({ char: '@', color: playerColor });
				}
```

**Step 2: Render teleportation anchors**

In `renderColored()`, in the visible tile section after hazard rendering (around line 3610), before the default tile rendering, add a check for teleport anchors:

Find the line with `const tile = state.map.tiles[y][x];` inside the visible branch (around line 3611) and before it add:

```typescript
						const anchorHere = state.teleportAnchors[state.level]?.x === x && state.teleportAnchors[state.level]?.y === y;
						if (anchorHere) {
							row.push({ char: 'O', color: '#ff8' });
						} else {
```

And close with an `}` after the default tile push.

**Step 3: Render ward zones**

In `renderColored()`, for visible floor tiles, after checking for anchors and before the default tile, add ward zone rendering:

```typescript
						const inWard = state.activeWards.some(w =>
							Math.abs(x - w.center.x) <= w.radius && Math.abs(y - w.center.y) <= w.radius
						);
```

Use this to tint ward tiles — when `inWard` is true and the tile is a floor `.`, render it as `.` with color `#448` instead of the default.

**Step 4: Add channeling progress bar to HUD**

In `+page.svelte`, find the HUD area where HP/MP are displayed. After the mana display, add:

```svelte
{#if state.ritualChanneling && state.ritualChanneling.turnsRemaining > 0}
	{@const ch = state.ritualChanneling}
	{@const ritual = getRitualDef(ch.ritualId)}
	{@const done = ch.turnsTotal - ch.turnsRemaining}
	{@const bar = '='.repeat(done) + '-'.repeat(ch.turnsRemaining)}
	<span style="color:#c8f"> Ritual: [{bar}] {done}/{ch.turnsTotal}</span>
	<span style="color:#888"> {ritual?.name ?? ''} (any key to continue, ESC cancel)</span>
{/if}
```

**Step 5: Render summoned familiar**

In `renderColored()`, after enemy rendering but before NPC rendering (around line 3582), add:

```typescript
				const isSummon = state.activeSummon && state.activeSummon.pos.x === x && state.activeSummon.pos.y === y && state.activeSummon.hp > 0;
				if (isSummon) {
					row.push({ char: state.activeSummon!.char, color: state.activeSummon!.color });
				} else if (enemy) {
```

(Adjust the existing `if (enemy)` to `else if (enemy)`)

**Step 6: Run all tests**

Run: `cd ascii-rpg && npx vitest run`
Expected: All tests PASS

**Step 7: Commit**

```bash
git add ascii-rpg/src/lib/game/engine.ts ascii-rpg/src/routes/+page.svelte
git commit -m "feat(rituals): add channeling visuals — pulsing char, progress bar, ward/anchor/summon rendering"
```

---

### Task 10: Seal Ritual — Apply Effect on Direction Pick

**Files:**
- Modify: `ascii-rpg/src/lib/game/engine.ts`

**Step 1: Apply seal when channeling completes**

In `tickRitualChanneling()`, before `applyRitualEffect(state, ritual)`, add a special case for seal:

```typescript
	if (ritual.effectType === 'seal') {
		const sealTarget = (state.ritualChanneling as any).sealTarget as Position | undefined;
		if (sealTarget) {
			state.map.tiles[sealTarget.y][sealTarget.x] = '#' as any;
			addMessage(state, 'Ancient stone surges from the ground — the passage is sealed!', 'magic');
		}
		state.ritualChanneling = null;
		return;
	}
```

**Step 2: Commit**

```bash
git add ascii-rpg/src/lib/game/engine.ts
git commit -m "feat(rituals): implement seal ritual effect — convert tile to wall"
```

---

### Task 11: Integration Tests

**Files:**
- Modify: `ascii-rpg/src/lib/game/rituals.test.ts`

**Step 1: Add integration-level tests for channeling flow**

Add to the existing test file:

```typescript
import { createGame, learnRitual, handleInput } from './engine';
import type { GameState } from './types';

function setupRitualGame(): GameState {
	const state = createGame({
		name: 'Test', characterClass: 'mage', difficulty: 'normal',
		startingLocation: 'cave', worldSeed: 'test', archetype: 'arcane',
	});
	// Give enough mana
	state.player.mana = 50;
	state.player.maxMana = 50;
	// Learn a ritual
	learnRitual(state, 'ritual_ward_of_protection');
	// Give reagents (arcane_dust x3)
	state.inventory[0] = { id: 'arcane_dust', name: 'Arcane Dust', char: '*', color: '#a8f', type: 'reagent', weight: 0.1 } as any;
	state.inventory[1] = { id: 'arcane_dust', name: 'Arcane Dust', char: '*', color: '#a8f', type: 'reagent', weight: 0.1 } as any;
	state.inventory[2] = { id: 'arcane_dust', name: 'Arcane Dust', char: '*', color: '#a8f', type: 'reagent', weight: 0.1 } as any;
	return state;
}

describe('Ritual Channeling Integration', () => {
	it('learnRitual adds ritual to learnedRituals', () => {
		const state = createGame({
			name: 'Test', characterClass: 'mage', difficulty: 'normal',
			startingLocation: 'cave', worldSeed: 'test',
		});
		const result = learnRitual(state, 'ritual_purification');
		expect(result).toBe(true);
		expect(state.learnedRituals).toContain('ritual_purification');
	});

	it('learnRitual rejects duplicates', () => {
		const state = createGame({
			name: 'Test', characterClass: 'mage', difficulty: 'normal',
			startingLocation: 'cave', worldSeed: 'test',
		});
		learnRitual(state, 'ritual_purification');
		const result = learnRitual(state, 'ritual_purification');
		expect(result).toBe(false);
	});

	it('learnRitual rejects unknown ritual ids', () => {
		const state = createGame({
			name: 'Test', characterClass: 'mage', difficulty: 'normal',
			startingLocation: 'cave', worldSeed: 'test',
		});
		const result = learnRitual(state, 'ritual_nonexistent');
		expect(result).toBe(false);
	});

	it('ritual state fields are initialized correctly', () => {
		const state = createGame({
			name: 'Test', characterClass: 'warrior', difficulty: 'normal',
			startingLocation: 'cave', worldSeed: 'test',
		});
		expect(state.ritualChanneling).toBeNull();
		expect(state.activeWards).toEqual([]);
		expect(state.teleportAnchors).toEqual({});
		expect(state.activeSummon).toBeNull();
		expect(state.scriedLevel).toBeNull();
	});
});
```

**Step 2: Run all tests**

Run: `cd ascii-rpg && npx vitest run`
Expected: All tests PASS

**Step 3: Commit**

```bash
git add ascii-rpg/src/lib/game/rituals.test.ts
git commit -m "test(rituals): add integration tests for channeling flow and state initialization"
```

---

### Task 12: Manual Testing and Final Verification

**Step 1: Run the full test suite**

Run: `cd ascii-rpg && npx vitest run`
Expected: All tests PASS with no regressions

**Step 2: Start dev server and manual test**

Run: `cd ascii-rpg && npm run dev`

Manual test checklist:
- Create a mage character (starts with Ward of Protection and Scrying rituals)
- Press M to open spell menu — verify rituals appear under "--- RITUALS ---" separator
- Navigate to a ritual with W/S, press Enter
- Verify "Missing reagents" message if you lack reagents
- Give yourself reagents via dev tools or find them
- Start a ritual — verify channeling progress bar appears
- Verify player pulses between `@` and `*`
- Press any key to advance turns — verify progress bar updates
- Verify ritual completes and effect applies
- Press Escape during channeling — verify ritual fails
- If enemies are nearby, get hit during channeling — verify 75/25 interrupt chance

**Step 3: Final commit and push**

```bash
git add -A
git commit -m "feat(rituals): complete ritual system implementation (US-MS-51)"
git push
```
