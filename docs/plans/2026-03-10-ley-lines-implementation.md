# Ley Lines Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add two visible ley lines crossing the overworld at the academy, revealed by divination spells, with an academy quest and a farm side quest.

**Architecture:** Generate ley line coordinates during world creation in `overworld.ts`, store them on `WorldMap`. Extend True Sight / Reveal Secrets in `spell-handler.ts` to reveal ley line tiles with color tinting in `overworld-handler.ts`. Add two new `DialogueEffect` fields (`learnSpell`, `acceptQuest`) so dialogue can grant spells and start quests. Add quest definitions, dialogue trees, NPC, item, and farm POI.

**Tech Stack:** TypeScript, Vitest, SvelteKit

---

### Task 1: Add Ley Line Data to WorldMap and OverworldTile

**Files:**
- Modify: `ascii-rpg/src/lib/game/overworld.ts:23-29` (OverworldTile interface)
- Modify: `ascii-rpg/src/lib/game/overworld.ts:75-85` (WorldMap interface)
- Test: `ascii-rpg/src/lib/game/overworld.test.ts`

**Step 1: Write the failing test**

```typescript
// In overworld.test.ts, add:
import { generateWorld } from './overworld';

describe('ley lines', () => {
	it('generates ley line data on world map', () => {
		const world = generateWorld('test-seed');
		expect(world.leyLines).toBeDefined();
		expect(world.leyLines.northSouth).toHaveLength(world.height);
		expect(world.leyLines.westEast).toHaveLength(world.width);
		// Lines should cross at academy
		const academy = world.settlements.find(s => s.name === 'Arcane Academy');
		expect(academy).toBeDefined();
		const nsX = world.leyLines.northSouth[academy!.pos.y];
		const weY = world.leyLines.westEast[academy!.pos.x];
		// Academy should be within 2 tiles of both lines
		expect(Math.abs(nsX - academy!.pos.x)).toBeLessThanOrEqual(2);
		expect(Math.abs(weY - academy!.pos.y)).toBeLessThanOrEqual(2);
	});

	it('marks tiles with ley line status', () => {
		const world = generateWorld('test-seed');
		const academy = world.settlements.find(s => s.name === 'Arcane Academy')!;
		const tile = world.tiles[academy.pos.y][academy.pos.x];
		expect(tile.leyLine).toBe('convergence');
	});

	it('marks core ley line tiles along the N-S line', () => {
		const world = generateWorld('test-seed');
		// Check a tile on the N-S line far from convergence
		const nsX = world.leyLines.northSouth[10]; // near top edge
		const tile = world.tiles[10][nsX];
		expect(tile.leyLine).toBe('core');
	});

	it('marks aura tiles adjacent to core', () => {
		const world = generateWorld('test-seed');
		const nsX = world.leyLines.northSouth[10];
		// 1-2 tiles away from core should be aura
		const auraTile = world.tiles[10][nsX + 1];
		expect(auraTile.leyLine).toBe('aura');
		const auraTile2 = world.tiles[10][nsX + 2];
		expect(auraTile2.leyLine).toBe('aura');
		// 3 tiles away should be null/undefined
		const normalTile = world.tiles[10][nsX + 3];
		expect(normalTile.leyLine).toBeUndefined();
	});
});
```

**Step 2: Run test to verify it fails**

Run: `cd ascii-rpg && npx vitest run src/lib/game/overworld.test.ts`
Expected: FAIL — `leyLines` property doesn't exist

**Step 3: Implement ley line generation**

Add to `OverworldTile` interface (line 23):
```typescript
export interface OverworldTile {
	terrain: TerrainType;
	region: RegionId;
	road?: RoadType;
	signpost?: boolean;
	locationId?: string;
	leyLine?: 'core' | 'aura' | 'convergence';
}
```

Add to `WorldMap` interface (line 75):
```typescript
export interface WorldMap {
	width: number;
	height: number;
	tiles: OverworldTile[][];
	regions: Region[];
	settlements: Settlement[];
	dungeonEntrances: DungeonEntrance[];
	roads: Road[];
	pois: PointOfInterest[];
	explored: boolean[][];
	leyLines: {
		northSouth: number[]; // x-coordinate per y-row
		westEast: number[];   // y-coordinate per x-column
	};
}
```

Add ley line generation function (after road generation, before POIs):
```typescript
function generateLeyLines(
	tiles: OverworldTile[][],
	academyPos: Position,
	width: number,
	height: number,
	rng: SeededRandom
): { northSouth: number[]; westEast: number[] } {
	// N-S line: one x per y-row, wobbling around academy x
	const northSouth: number[] = [];
	let nsX = academyPos.x;
	for (let y = academyPos.y; y >= 0; y--) {
		northSouth[y] = Math.max(1, Math.min(width - 2, nsX));
		nsX += Math.floor((rng.next() - 0.5) * 3); // wobble -1 to +1
	}
	nsX = academyPos.x;
	for (let y = academyPos.y + 1; y < height; y++) {
		nsX += Math.floor((rng.next() - 0.5) * 3);
		northSouth[y] = Math.max(1, Math.min(width - 2, nsX));
	}

	// W-E line: one y per x-column, wobbling around academy y
	const westEast: number[] = [];
	let weY = academyPos.y;
	for (let x = academyPos.x; x >= 0; x--) {
		westEast[x] = Math.max(1, Math.min(height - 2, weY));
		weY += Math.floor((rng.next() - 0.5) * 3);
	}
	weY = academyPos.y;
	for (let x = academyPos.x + 1; x < width; x++) {
		weY += Math.floor((rng.next() - 0.5) * 3);
		westEast[x] = Math.max(1, Math.min(height - 2, weY));
	}

	// Mark tiles: convergence (3x3 around academy), core, aura
	const convergenceRadius = 1; // 3x3
	const auraWidth = 2;

	// Convergence zone first
	for (let dy = -convergenceRadius; dy <= convergenceRadius; dy++) {
		for (let dx = -convergenceRadius; dx <= convergenceRadius; dx++) {
			const cx = academyPos.x + dx;
			const cy = academyPos.y + dy;
			if (cx >= 0 && cy >= 0 && cx < width && cy < height) {
				tiles[cy][cx].leyLine = 'convergence';
			}
		}
	}

	// N-S line
	for (let y = 0; y < height; y++) {
		const x = northSouth[y];
		if (!tiles[y][x].leyLine) tiles[y][x].leyLine = 'core';
		for (let a = 1; a <= auraWidth; a++) {
			if (x - a >= 0 && !tiles[y][x - a].leyLine) tiles[y][x - a].leyLine = 'aura';
			if (x + a < width && !tiles[y][x + a].leyLine) tiles[y][x + a].leyLine = 'aura';
		}
	}

	// W-E line
	for (let x = 0; x < width; x++) {
		const y = westEast[x];
		if (!tiles[y][x].leyLine) tiles[y][x].leyLine = 'core';
		for (let a = 1; a <= auraWidth; a++) {
			if (y - a >= 0 && !tiles[y - a][x].leyLine) tiles[y - a][x].leyLine = 'aura';
			if (y + a < height && !tiles[y + a][x].leyLine) tiles[y + a][x].leyLine = 'aura';
		}
	}

	return { northSouth, westEast };
}
```

Call it from `generateWorld()` after road generation (line ~461), before POIs:
```typescript
// 10.5. Generate ley lines (need academy position)
const academy = settlements.find(s => s.name === 'Arcane Academy');
const leyLines = generateLeyLines(
	tiles,
	academy?.pos ?? { x: Math.floor(width / 2), y: Math.floor(height / 2) },
	width, height, rng
);
```

And return leyLines in the WorldMap:
```typescript
return { width, height, tiles, regions, settlements, dungeonEntrances, roads, pois, explored, leyLines };
```

**Step 4: Run test to verify it passes**

Run: `cd ascii-rpg && npx vitest run src/lib/game/overworld.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add ascii-rpg/src/lib/game/overworld.ts ascii-rpg/src/lib/game/overworld.test.ts
git commit -m "feat(ley-lines): generate N-S and W-E ley lines crossing at academy"
```

---

### Task 2: Set Ley Line Level Based on Tile When Moving on Overworld

**Files:**
- Modify: `ascii-rpg/src/lib/game/overworld-handler.ts:872` (exitToOverworld leyLineLevel)
- Modify: `ascii-rpg/src/lib/game/overworld-handler.ts:914-916` (handleOverworldInput movement)
- Test: `ascii-rpg/src/lib/game/overworld-handler.test.ts`

**Step 1: Write the failing test**

```typescript
describe('ley line level on overworld', () => {
	it('sets ley line level 3 on core ley line tiles', () => {
		const state = makeOverworldState();
		const worldMap = state.worldMap as WorldMap;
		// Find a core tile
		const coreY = 10;
		const coreX = worldMap.leyLines.northSouth[coreY];
		state.overworldPos = { x: coreX - 1, y: coreY }; // adjacent to core
		worldMap.tiles[coreY][coreX - 1] = { terrain: 'grass', region: 'hearthlands' };
		worldMap.tiles[coreY][coreX] = { terrain: 'grass', region: 'hearthlands', leyLine: 'core' };
		worldMap.explored[coreY][coreX] = true;
		const result = handleOverworldInput(state, 'd', mockCreateGame, mockNewLevel);
		expect(result.leyLineLevel).toBe(3);
	});

	it('sets ley line level 4 on convergence tiles', () => {
		const state = makeOverworldState();
		const worldMap = state.worldMap as WorldMap;
		const academy = worldMap.settlements.find(s => s.name === 'Arcane Academy')!;
		state.overworldPos = { x: academy.pos.x - 1, y: academy.pos.y };
		worldMap.tiles[academy.pos.y][academy.pos.x] = { terrain: 'grass', region: 'arcane_conservatory', leyLine: 'convergence' };
		worldMap.explored[academy.pos.y][academy.pos.x] = true;
		const result = handleOverworldInput(state, 'd', mockCreateGame, mockNewLevel);
		expect(result.leyLineLevel).toBe(4);
	});

	it('sets ley line level 2 on normal tiles', () => {
		const state = makeOverworldState();
		const worldMap = state.worldMap as WorldMap;
		// Move to a tile with no ley line
		state.overworldPos = { x: 5, y: 5 };
		worldMap.tiles[5][6] = { terrain: 'grass', region: 'hearthlands' };
		worldMap.explored[5][6] = true;
		const result = handleOverworldInput(state, 'd', mockCreateGame, mockNewLevel);
		expect(result.leyLineLevel).toBe(2);
	});
});
```

**Step 2: Run test to verify it fails**

Run: `cd ascii-rpg && npx vitest run src/lib/game/overworld-handler.test.ts --grep "ley line level"`
Expected: FAIL — leyLineLevel always 2 on overworld

**Step 3: Implement ley line level from tile**

Add helper function in `overworld-handler.ts`:
```typescript
/** Get ley line level for an overworld tile based on its leyLine marker. */
function getLeyLineLevelForTile(tile: OverworldTile): number {
	switch (tile.leyLine) {
		case 'convergence': return 4;
		case 'core': return 3;
		case 'aura': return 2;
		default: return 2;
	}
}
```

In `handleOverworldInput`, after `state.overworldPos = { x: nx, y: ny };` (line ~915), add:
```typescript
// Update ley line level from tile
state.leyLineLevel = getLeyLineLevelForTile(targetTile);
```

In `exitToOverworld`, change line 872 to use the tile:
```typescript
const currentTile = (state.worldMap as WorldMap).tiles[state.overworldPos!.y]?.[state.overworldPos!.x];
state.leyLineLevel = currentTile ? getLeyLineLevelForTile(currentTile) : 2;
```

**Step 4: Run test to verify it passes**

Run: `cd ascii-rpg && npx vitest run src/lib/game/overworld-handler.test.ts --grep "ley line level"`
Expected: PASS

**Step 5: Commit**

```bash
git add ascii-rpg/src/lib/game/overworld-handler.ts ascii-rpg/src/lib/game/overworld-handler.test.ts
git commit -m "feat(ley-lines): set ley line level based on overworld tile"
```

---

### Task 3: Instant Mana Restore at Convergence Point

**Files:**
- Modify: `ascii-rpg/src/lib/game/overworld-handler.ts` (handleOverworldInput)
- Test: `ascii-rpg/src/lib/game/overworld-handler.test.ts`

**Step 1: Write the failing test**

```typescript
it('restores mana to full when stepping on convergence tile', () => {
	const state = makeOverworldState();
	state.player.mana = 5;
	state.player.maxMana = 30;
	const worldMap = state.worldMap as WorldMap;
	const academy = worldMap.settlements.find(s => s.name === 'Arcane Academy')!;
	// Position player adjacent to academy convergence tile
	state.overworldPos = { x: academy.pos.x - 1, y: academy.pos.y };
	worldMap.tiles[academy.pos.y][academy.pos.x] = {
		terrain: 'grass', region: 'arcane_conservatory', leyLine: 'convergence'
	};
	// Remove locationId so we don't enter the settlement
	delete worldMap.tiles[academy.pos.y][academy.pos.x].locationId;
	worldMap.explored[academy.pos.y][academy.pos.x] = true;
	const result = handleOverworldInput(state, 'd', mockCreateGame, mockNewLevel);
	expect(result.player.mana).toBe(30);
	expect(result.messages.some(m => m.text.includes('mana'))).toBe(true);
});
```

**Step 2: Run test to verify it fails**

Run: `cd ascii-rpg && npx vitest run src/lib/game/overworld-handler.test.ts --grep "restores mana"`
Expected: FAIL — mana stays at 5

**Step 3: Implement convergence mana restore**

In `handleOverworldInput`, after the ley line level update, add:
```typescript
// Convergence: instant full mana restore
if (targetTile.leyLine === 'convergence' && (state.player.mana ?? 0) < (state.player.maxMana ?? 0)) {
	state.player.mana = state.player.maxMana ?? 0;
	addMessage(state, 'Power floods through you as you cross the ley line convergence. Mana fully restored!', 'magic');
}
```

**Step 4: Run test to verify it passes**

Run: `cd ascii-rpg && npx vitest run src/lib/game/overworld-handler.test.ts --grep "restores mana"`
Expected: PASS

**Step 5: Commit**

```bash
git add ascii-rpg/src/lib/game/overworld-handler.ts ascii-rpg/src/lib/game/overworld-handler.test.ts
git commit -m "feat(ley-lines): instant mana restore at convergence point"
```

---

### Task 4: Reveal Ley Lines with True Sight and Reveal Secrets

**Files:**
- Modify: `ascii-rpg/src/lib/game/types.ts:368` (add `trueSightActive` to GameState)
- Modify: `ascii-rpg/src/lib/game/spell-handler.ts:193` (castSpellById — set trueSightActive)
- Modify: `ascii-rpg/src/lib/game/overworld-handler.ts:1007` (renderOverworldColored — color tint)
- Modify: `ascii-rpg/src/lib/game/spells.ts:319-332` (update spell descriptions)
- Test: `ascii-rpg/src/lib/game/overworld-handler.test.ts`

**Step 1: Write the failing test**

```typescript
describe('ley line visibility', () => {
	it('does not tint ley line tiles when trueSightActive is false', () => {
		const state = makeOverworldState();
		state.trueSightActive = 0;
		const worldMap = state.worldMap as WorldMap;
		// Place player on a core ley line tile
		const coreY = 10;
		const coreX = worldMap.leyLines.northSouth[coreY];
		state.overworldPos = { x: coreX, y: coreY };
		worldMap.tiles[coreY][coreX] = { terrain: 'grass', region: 'hearthlands', leyLine: 'core' };
		worldMap.explored[coreY][coreX] = true;
		const grid = renderOverworldColored(state);
		// Normal grass color, not cyan
		const playerAdjacentTile = grid[/* viewport offset for coreY+1 */];
		// Tile should NOT have cyan color
		// (test the tile at a known offset)
	});

	it('tints ley line tiles cyan when trueSightActive > 0', () => {
		const state = makeOverworldState();
		state.trueSightActive = 5; // 5 turns remaining
		const worldMap = state.worldMap as WorldMap;
		const coreY = state.overworldPos!.y;
		const coreX = state.overworldPos!.x + 1;
		worldMap.tiles[coreY][coreX] = { terrain: 'grass', region: 'hearthlands', leyLine: 'core' };
		worldMap.explored[coreY][coreX] = true;
		const grid = renderOverworldColored(state);
		// Find the viewport position for coreX, coreY
		const halfW = Math.floor(50 / 2);
		const halfH = Math.floor(24 / 2);
		const vx = coreX - (state.overworldPos!.x - halfW);
		const vy = coreY - (state.overworldPos!.y - halfH);
		expect(grid[vy][vx].color).toBe('#4ff'); // cyan for core
	});

	it('tints convergence tiles gold when trueSightActive > 0', () => {
		const state = makeOverworldState();
		state.trueSightActive = 5;
		const worldMap = state.worldMap as WorldMap;
		const convY = state.overworldPos!.y;
		const convX = state.overworldPos!.x + 2;
		worldMap.tiles[convY][convX] = { terrain: 'grass', region: 'arcane_conservatory', leyLine: 'convergence' };
		worldMap.explored[convY][convX] = true;
		const grid = renderOverworldColored(state);
		const halfW = Math.floor(50 / 2);
		const vx = convX - (state.overworldPos!.x - halfW);
		const vy = convY - (state.overworldPos!.y - halfH);
		expect(grid[vy][vx].color).toBe('#fc4'); // gold for convergence
	});
});
```

Note: The exact viewport math may need adjustment based on player position and camera clamping. Adapt during implementation.

**Step 2: Run test to verify it fails**

Run: `cd ascii-rpg && npx vitest run src/lib/game/overworld-handler.test.ts --grep "ley line visibility"`
Expected: FAIL — trueSightActive doesn't exist

**Step 3: Implement**

Add to `GameState` in `types.ts` (after `leyLineLevel`):
```typescript
/** Remaining turns of True Sight buff (reveals ley lines on overworld) */
trueSightActive: number;
/** Set of tile keys ("x,y") with ley lines revealed by Reveal Secrets this turn */
revealedLeyLineTiles: Set<string>;
```

Initialize in `createGame` in `engine.ts`:
```typescript
trueSightActive: 0,
revealedLeyLineTiles: new Set(),
```

In `spell-handler.ts`, in `castSpellById` after the self-cast success block (around line 269), add spell-specific handling:
```typescript
// True Sight: activate ley line vision
if (spell.id === 'spell_true_sight') {
	state.trueSightActive = 10; // 10 turns
}
// Reveal Secrets: ping nearby ley line tiles
if (spell.id === 'spell_reveal_secrets') {
	state.revealedLeyLineTiles = new Set();
	if (state.locationMode === 'overworld' && state.worldMap) {
		const worldMap = state.worldMap as WorldMap;
		const pos = state.overworldPos!;
		for (let dy = -5; dy <= 5; dy++) {
			for (let dx = -5; dx <= 5; dx++) {
				const tx = pos.x + dx;
				const ty = pos.y + dy;
				if (tx >= 0 && ty >= 0 && tx < worldMap.width && ty < worldMap.height) {
					const tile = worldMap.tiles[ty][tx];
					if (tile.leyLine) {
						state.revealedLeyLineTiles.add(`${tx},${ty}`);
					}
				}
			}
		}
		if (state.revealedLeyLineTiles.size > 0) {
			addMessage(state, 'You sense streams of magical energy flowing through the earth!', 'magic');
		}
	}
}
```

Tick down `trueSightActive` in overworld movement (in `handleOverworldInput`, after turn count increment):
```typescript
if (state.trueSightActive > 0) {
	state.trueSightActive--;
	if (state.trueSightActive === 0) {
		addMessage(state, 'Your True Sight fades.', 'info');
	}
}
// Clear revealed tiles each turn (Reveal Secrets is instant)
state.revealedLeyLineTiles = new Set();
```

In `renderOverworldColored` (line ~1084-1087), before the terrain rendering, add ley line color overlay check:
```typescript
// Ley line color overlay (True Sight or Reveal Secrets)
const leyLineVisible = (state.trueSightActive > 0 || state.revealedLeyLineTiles?.has(`${wx},${wy}`));
if (leyLineVisible && tile.leyLine && isNearPlayer) {
	const display = TERRAIN_DISPLAY[tile.terrain];
	const leyColor = tile.leyLine === 'convergence' ? '#fc4' : tile.leyLine === 'core' ? '#4ff' : '#2aa';
	row.push({ char: display.char, color: leyColor });
	continue;
}
```

Place this check in `renderOverworldColored` AFTER road rendering but BEFORE the final terrain rendering block (around line 1083), so ley lines override terrain color but not roads/settlements/POIs.

Update spell descriptions in `spells.ts`:
```typescript
spell_true_sight: {
	...
	effect: '+3 sight radius for 10 turns. Reveals hidden enemies and ley lines.',
},
spell_reveal_secrets: {
	...
	effect: 'Detects all traps, secrets, and ley lines in 5-tile radius.',
},
```

**Step 4: Run test to verify it passes**

Run: `cd ascii-rpg && npx vitest run src/lib/game/overworld-handler.test.ts --grep "ley line visibility"`
Expected: PASS

**Step 5: Run full test suite to check for regressions**

Run: `cd ascii-rpg && npm test`
Expected: All 1441+ tests pass. Fix any failures from missing `trueSightActive`/`revealedLeyLineTiles` init in test helpers.

**Step 6: Commit**

```bash
git add ascii-rpg/src/lib/game/types.ts ascii-rpg/src/lib/game/spell-handler.ts ascii-rpg/src/lib/game/overworld-handler.ts ascii-rpg/src/lib/game/spells.ts ascii-rpg/src/lib/game/engine.ts ascii-rpg/src/lib/game/overworld-handler.test.ts
git commit -m "feat(ley-lines): reveal ley lines with True Sight and Reveal Secrets"
```

---

### Task 5: Add `learnSpell` and `acceptQuest` to DialogueEffect

**Files:**
- Modify: `ascii-rpg/src/lib/game/types.ts:48-63` (DialogueEffect interface)
- Modify: `ascii-rpg/src/lib/game/dialogue-handler.ts:122-240` (handleDialogueChoice)
- Test: `ascii-rpg/src/lib/game/dialogue-handler.test.ts`

**Step 1: Write the failing test**

```typescript
describe('dialogue effect: learnSpell', () => {
	it('teaches a spell for free via dialogue', () => {
		const state = makeDialogueState([
			{ text: 'Teach me', nextNode: 'next', onSelect: { learnSpell: 'spell_true_sight' } },
		]);
		state.learnedSpells = [];
		const result = handleDialogueChoice(state, 0);
		expect(result.learnedSpells).toContain('spell_true_sight');
	});

	it('does not teach a spell already known', () => {
		const state = makeDialogueState([
			{ text: 'Teach me', nextNode: 'next', onSelect: { learnSpell: 'spell_true_sight' } },
		]);
		state.learnedSpells = ['spell_true_sight'];
		const result = handleDialogueChoice(state, 0);
		expect(result.learnedSpells).toEqual(['spell_true_sight']); // no duplicate
	});
});

describe('dialogue effect: acceptQuest', () => {
	it('starts a quest via dialogue', () => {
		const state = makeDialogueState([
			{ text: 'Accept quest', nextNode: 'next', onSelect: { acceptQuest: 'threads_of_power' } },
		]);
		state.quests = [];
		const result = handleDialogueChoice(state, 0);
		expect(result.quests.some(q => q.id === 'threads_of_power')).toBe(true);
	});
});
```

**Step 2: Run test to verify it fails**

Run: `cd ascii-rpg && npx vitest run src/lib/game/dialogue-handler.test.ts --grep "learnSpell|acceptQuest"`
Expected: FAIL — properties don't exist on DialogueEffect

**Step 3: Implement**

Add to `DialogueEffect` in `types.ts`:
```typescript
export interface DialogueEffect {
	// ... existing fields ...
	learnSpell?: string;   // spell ID to teach (free, no talent cost)
	acceptQuest?: string;  // quest ID to start
}
```

In `handleDialogueChoice` in `dialogue-handler.ts`, after the `addTitle` block (around line 233), add:
```typescript
// Teach spells from dialogue (free — no talent point cost)
if (option.onSelect.learnSpell) {
	const spellId = option.onSelect.learnSpell;
	if (!state.learnedSpells.includes(spellId)) {
		const spellDef = SPELL_CATALOG[spellId];
		state.learnedSpells.push(spellId);
		// Auto-assign to first empty quick-cast slot
		const emptySlot = state.quickCastSlots.indexOf(null);
		if (emptySlot !== -1) state.quickCastSlots[emptySlot] = spellId;
		addMessage(state, `Spell learned: ${spellDef?.name ?? spellId}!`, 'magic');
	}
}
// Accept quest from dialogue
if (option.onSelect.acceptQuest) {
	const questResult = acceptQuest(state, option.onSelect.acceptQuest);
	if (questResult.success) {
		addMessage(state, questResult.message, 'discovery');
	}
}
```

Add import at top of `dialogue-handler.ts`:
```typescript
import { SPELL_CATALOG } from './spells';
import { acceptQuest } from './quests';
```

**Step 4: Run test to verify it passes**

Run: `cd ascii-rpg && npx vitest run src/lib/game/dialogue-handler.test.ts --grep "learnSpell|acceptQuest"`
Expected: PASS

**Step 5: Commit**

```bash
git add ascii-rpg/src/lib/game/types.ts ascii-rpg/src/lib/game/dialogue-handler.ts ascii-rpg/src/lib/game/dialogue-handler.test.ts
git commit -m "feat(dialogue): add learnSpell and acceptQuest dialogue effects"
```

---

### Task 6: Add Quest Definitions — "Threads of Power" and "Blighted Harvest"

**Files:**
- Modify: `ascii-rpg/src/lib/game/quests.ts` (add quest definitions to QUEST_CATALOG)
- Test: `ascii-rpg/src/lib/game/quests.test.ts`

**Step 1: Write the failing test**

```typescript
describe('ley line quests', () => {
	it('has threads_of_power quest definition', () => {
		expect(QUEST_CATALOG['threads_of_power']).toBeDefined();
		expect(QUEST_CATALOG['threads_of_power'].title).toBe('Threads of Power');
		expect(QUEST_CATALOG['threads_of_power'].objectives).toHaveLength(3);
	});

	it('has blighted_harvest quest definition', () => {
		expect(QUEST_CATALOG['blighted_harvest']).toBeDefined();
		expect(QUEST_CATALOG['blighted_harvest'].title).toBe('Blighted Harvest');
		expect(QUEST_CATALOG['blighted_harvest'].objectives).toHaveLength(2);
	});

	it('can accept threads_of_power', () => {
		const state = makeTestState();
		const result = acceptQuest(state, 'threads_of_power');
		expect(result.success).toBe(true);
		expect(state.quests[0].title).toBe('Threads of Power');
	});
});
```

**Step 2: Run test to verify it fails**

Run: `cd ascii-rpg && npx vitest run src/lib/game/quests.test.ts --grep "ley line quests"`
Expected: FAIL — quest IDs not found

**Step 3: Implement quest definitions**

Add to `QUEST_CATALOG` in `quests.ts`:
```typescript
// ===================================================================
// LEY LINE QUESTS
// ===================================================================
threads_of_power: {
	id: 'threads_of_power',
	title: 'Threads of Power',
	description: 'Prof. Ignis wants you to experience the ley lines firsthand. Cast True Sight at the convergence, walk the line, then return to feel the full power of the crossing point.',
	objectives: [
		{ id: 'tp_cast_truesight', description: 'Cast True Sight at the academy convergence', type: 'explore', target: 'convergence_truesight', required: 1 },
		{ id: 'tp_walk_line', description: 'Walk along a ley line to observe the Strong zone', type: 'explore', target: 'leyline_strong', required: 1 },
		{ id: 'tp_return_convergence', description: 'Return to the convergence and restore your mana', type: 'explore', target: 'convergence_restore', required: 1 },
	],
	rewards: {
		xp: 100,
		items: ['book_ley_lines'],
	},
	giverNpcName: 'Prof. Ignis',
	regionId: 'arcane_conservatory',
	isMainQuest: false,
},

blighted_harvest: {
	id: 'blighted_harvest',
	title: 'Blighted Harvest',
	description: 'A farmer in the Hearthlands reports strange happenings — crops twisting overnight, well water causing visions. Something unnatural runs through his land.',
	objectives: [
		{ id: 'bh_investigate', description: 'Investigate the farm with True Sight or Reveal Secrets', type: 'explore', target: 'farm_investigate', required: 1 },
		{ id: 'bh_resolve', description: 'Ward the well or redirect the ley line', type: 'explore', target: 'farm_resolve', required: 1 },
	],
	rewards: {
		xp: 200,
		items: ['ley_water_vial'],
	},
	giverNpcName: 'Farmer Edric',
	regionId: 'hearthlands',
	isMainQuest: false,
},
```

**Step 4: Run test to verify it passes**

Run: `cd ascii-rpg && npx vitest run src/lib/game/quests.test.ts --grep "ley line quests"`
Expected: PASS

**Step 5: Commit**

```bash
git add ascii-rpg/src/lib/game/quests.ts ascii-rpg/src/lib/game/quests.test.ts
git commit -m "feat(quests): add Threads of Power and Blighted Harvest quest definitions"
```

---

### Task 7: Add Ley Water Vial Item

**Files:**
- Modify: `ascii-rpg/src/lib/game/items.ts` (add to ITEM_CATALOG)
- Test: `ascii-rpg/src/lib/game/items.test.ts` (or inline test)

**Step 1: Write the failing test**

```typescript
it('ley_water_vial exists in ITEM_CATALOG', () => {
	expect(ITEM_CATALOG['ley_water_vial']).toBeDefined();
	expect(ITEM_CATALOG['ley_water_vial'].type).toBe('consumable');
	expect(ITEM_CATALOG['ley_water_vial'].consumeEffect).toBeDefined();
});
```

**Step 2: Run test to verify it fails**

Run: `cd ascii-rpg && npx vitest run src/lib/game/items.test.ts --grep "ley_water_vial"`
Expected: FAIL

**Step 3: Implement**

Add to `ITEM_CATALOG` in `items.ts`:
```typescript
ley_water_vial: {
	id: 'ley_water_vial',
	name: 'Ley Water Vial',
	char: '!',
	color: '#4ff',
	type: 'consumable',
	description: 'Water drawn from a well over a ley line. Restores mana but clouds the mind with strange visions.',
	consumeEffect: { hp: -3 },
	rarity: 'rare',
},
```

Note: The mana restore + confusion effect will need custom handling in the consume logic. For the `consumeEffect`, use `hp: -3` as a placeholder for the confusion damage. The actual mana restore needs a `mana` field added to `consumeEffect` — check if that exists, otherwise add it.

Check if `consumeEffect` supports mana:

If not, add `mana?: number` to the `consumeEffect` type in `items.ts` and handle it in the consume function. Then set:
```typescript
consumeEffect: { mana: 15, hp: -3 },
```

This gives 15 mana back but costs 3 HP (representing confusion/visions).

**Step 4: Run test to verify it passes**

Run: `cd ascii-rpg && npx vitest run src/lib/game/items.test.ts --grep "ley_water_vial"`
Expected: PASS

**Step 5: Commit**

```bash
git add ascii-rpg/src/lib/game/items.ts ascii-rpg/src/lib/game/items.test.ts
git commit -m "feat(items): add Ley Water Vial consumable"
```

---

### Task 8: Add Prof. Ignis Dialogue for "Threads of Power" Quest

**Files:**
- Modify: `ascii-rpg/src/lib/game/dialogue.ts` (add dialogue tree nodes to Prof. Ignis)
- Test: `ascii-rpg/src/lib/game/dialogue.test.ts`

**Step 1: Write the failing test**

```typescript
describe('Prof. Ignis ley line dialogue', () => {
	it('has ley_lines_intro node in ignis dialogue', () => {
		const ignisTree = getDialogueTree('Prof. Ignis');
		expect(ignisTree.nodes['ley_lines_intro']).toBeDefined();
	});

	it('teaches True Sight spell via dialogue effect', () => {
		const ignisTree = getDialogueTree('Prof. Ignis');
		const teachNode = ignisTree.nodes['ley_teach_truesight'];
		expect(teachNode).toBeDefined();
		const teachOption = teachNode.options.find(o => o.onSelect?.learnSpell === 'spell_true_sight');
		expect(teachOption).toBeDefined();
	});

	it('starts threads_of_power quest via dialogue', () => {
		const ignisTree = getDialogueTree('Prof. Ignis');
		const questNode = ignisTree.nodes['ley_quest_start'];
		expect(questNode).toBeDefined();
		const questOption = questNode.options.find(o => o.onSelect?.acceptQuest === 'threads_of_power');
		expect(questOption).toBeDefined();
	});
});
```

**Step 2: Run test to verify it fails**

Run: `cd ascii-rpg && npx vitest run src/lib/game/dialogue.test.ts --grep "ley line dialogue"`
Expected: FAIL

**Step 3: Implement dialogue nodes**

Find Prof. Ignis's dialogue tree in `dialogue.ts` and add new nodes. Add a conditional start node that checks `academyEnrolled` and `lessonCompleted: 'lesson_02'` (after Elemental Weaknesses lesson). Add these dialogue nodes:

```typescript
ley_lines_intro: node('ley_lines_intro',
	'The Academy was built here for a reason. Two great ley lines — rivers of raw mana flowing through the earth — cross beneath our very feet. I want you to see them for yourself.',
	[
		opt('How do I see them?', 'ley_teach_truesight', '#4ff'),
		opt('What are ley lines exactly?', 'ley_explanation', '#ff8'),
		opt('Maybe later.', 'return', '#888'),
	]
),

ley_explanation: node('ley_explanation',
	'Ley lines are currents of pure magical energy that flow through the earth like underground rivers. Where they run, magic is stronger — spells hit harder, mana regenerates faster. And where two lines cross... that is a convergence. The most powerful magical focus in the world.',
	[
		opt('Teach me to see them.', 'ley_teach_truesight', '#4ff'),
		opt('Back to other topics.', 'return', '#888'),
	]
),

ley_teach_truesight: node('ley_teach_truesight',
	'The School of Divination has a spell called True Sight. It pierces illusion and reveals hidden things — including the ley lines themselves. Here, I will teach it to you.',
	[
		opt('[Learn True Sight]', 'ley_quest_start', '#4ff', { onSelect: { learnSpell: 'spell_true_sight', message: 'Prof. Ignis traces a sigil in the air. Knowledge floods your mind. You have learned True Sight!' } }),
		opt('I already know True Sight.', 'ley_quest_start', '#888', { showIf: { type: 'hasSpell', value: 'spell_true_sight' } }),
	]
),

ley_quest_start: node('ley_quest_start',
	'Good. Now for the practical lesson. Go to the center of the academy grounds — the convergence point. Cast True Sight there and observe. Then walk outward along one of the ley lines until the glow dims. Finally, return to the convergence and feel the power restore you.',
	[
		opt('[Accept: Threads of Power]', 'ley_quest_accepted', '#4f4', { onSelect: { acceptQuest: 'threads_of_power' } }),
		opt('I will do this later.', 'return', '#888'),
	]
),

ley_quest_accepted: node('ley_quest_accepted',
	'Take your time. Observe carefully. When you return, I will have something for you — a book that explains the deeper theory behind what you will see.',
	[
		opt('Thank you, Professor.', 'return', '#4ff'),
	]
),
```

Note: The `hasSpell` condition type doesn't exist yet. Add it to `DialogueCondition` in `types.ts`:
```typescript
| { type: 'hasSpell'; value: string }
```
And handle it in `checkCondition` in `dialogue-handler.ts`:
```typescript
case 'hasSpell': return state.learnedSpells.includes(cond.value);
```

**Step 4: Run test to verify it passes**

Run: `cd ascii-rpg && npx vitest run src/lib/game/dialogue.test.ts --grep "ley line dialogue"`
Expected: PASS

**Step 5: Commit**

```bash
git add ascii-rpg/src/lib/game/dialogue.ts ascii-rpg/src/lib/game/dialogue.test.ts ascii-rpg/src/lib/game/types.ts ascii-rpg/src/lib/game/dialogue-handler.ts
git commit -m "feat(dialogue): add Prof. Ignis ley line quest dialogue with True Sight teaching"
```

---

### Task 9: Add Quest Objective Tracking for Threads of Power

**Files:**
- Modify: `ascii-rpg/src/lib/game/overworld-handler.ts` (track convergence_truesight, leyline_strong, convergence_restore objectives)
- Modify: `ascii-rpg/src/lib/game/quests.ts` (updateQuestProgress)
- Test: `ascii-rpg/src/lib/game/overworld-handler.test.ts`

**Step 1: Write the failing test**

```typescript
describe('threads_of_power quest tracking', () => {
	it('completes convergence_truesight when casting True Sight on convergence tile', () => {
		const state = makeOverworldState();
		acceptQuest(state, 'threads_of_power');
		state.trueSightActive = 0;
		state.overworldPos = { x: 100, y: 100 };
		const worldMap = state.worldMap as WorldMap;
		worldMap.tiles[100][100] = { terrain: 'grass', region: 'arcane_conservatory', leyLine: 'convergence' };
		// Simulate casting True Sight on convergence
		state.trueSightActive = 10;
		// Call the tracking function
		trackLeyLineQuestProgress(state);
		const quest = state.quests.find(q => q.id === 'threads_of_power')!;
		const obj = quest.objectives.find(o => o.id === 'tp_cast_truesight')!;
		expect(obj.current).toBe(1);
		expect(obj.completed).toBe(true);
	});

	it('completes leyline_strong when on core tile with True Sight active', () => {
		const state = makeOverworldState();
		acceptQuest(state, 'threads_of_power');
		state.trueSightActive = 5;
		const worldMap = state.worldMap as WorldMap;
		state.overworldPos = { x: 50, y: 50 };
		worldMap.tiles[50][50] = { terrain: 'grass', region: 'hearthlands', leyLine: 'core' };
		trackLeyLineQuestProgress(state);
		const quest = state.quests.find(q => q.id === 'threads_of_power')!;
		const obj = quest.objectives.find(o => o.id === 'tp_walk_line')!;
		expect(obj.current).toBe(1);
	});

	it('completes convergence_restore when mana is full on convergence', () => {
		const state = makeOverworldState();
		acceptQuest(state, 'threads_of_power');
		state.player.mana = state.player.maxMana;
		const worldMap = state.worldMap as WorldMap;
		state.overworldPos = { x: 100, y: 100 };
		worldMap.tiles[100][100] = { terrain: 'grass', region: 'arcane_conservatory', leyLine: 'convergence' };
		trackLeyLineQuestProgress(state);
		const quest = state.quests.find(q => q.id === 'threads_of_power')!;
		const obj = quest.objectives.find(o => o.id === 'tp_return_convergence')!;
		expect(obj.current).toBe(1);
	});
});
```

**Step 2: Run test to verify it fails**

Run: `cd ascii-rpg && npx vitest run src/lib/game/overworld-handler.test.ts --grep "threads_of_power"`
Expected: FAIL

**Step 3: Implement**

Add a `trackLeyLineQuestProgress` function in `overworld-handler.ts`:
```typescript
export function trackLeyLineQuestProgress(state: GameState): void {
	const quest = state.quests.find(q => q.id === 'threads_of_power' && q.status === 'active');
	if (!quest) return;

	const worldMap = state.worldMap as WorldMap;
	const pos = state.overworldPos;
	if (!pos || state.locationMode !== 'overworld') return;
	const tile = worldMap.tiles[pos.y]?.[pos.x];
	if (!tile) return;

	// Objective 1: Cast True Sight at convergence
	if (tile.leyLine === 'convergence' && state.trueSightActive > 0) {
		const obj = quest.objectives.find(o => o.id === 'tp_cast_truesight');
		if (obj && !obj.completed) {
			obj.current = 1;
			obj.completed = true;
			addMessage(state, 'The ground erupts with light. Two brilliant streams of energy cross beneath you, stretching to the horizon.', 'magic');
		}
	}

	// Objective 2: Walk the line (core tile, not convergence, with True Sight)
	if (tile.leyLine === 'core' && state.trueSightActive > 0) {
		const obj = quest.objectives.find(o => o.id === 'tp_walk_line');
		if (obj && !obj.completed) {
			obj.current = 1;
			obj.completed = true;
			addMessage(state, 'The glow dims but persists — the ley line continues, weaker but steady.', 'magic');
		}
	}

	// Objective 3: Return to convergence with full mana
	if (tile.leyLine === 'convergence' && (state.player.mana ?? 0) >= (state.player.maxMana ?? 1)) {
		const obj = quest.objectives.find(o => o.id === 'tp_return_convergence');
		const obj1 = quest.objectives.find(o => o.id === 'tp_cast_truesight');
		const obj2 = quest.objectives.find(o => o.id === 'tp_walk_line');
		if (obj && !obj.completed && obj1?.completed && obj2?.completed) {
			obj.current = 1;
			obj.completed = true;
			addMessage(state, 'Now you understand why the academy was built here. The convergence is the finest place to study magic.', 'magic');
			// Auto-complete quest
			completeQuest(state, 'threads_of_power');
		}
	}
}
```

Call `trackLeyLineQuestProgress(state)` from `handleOverworldInput` after the ley line level update and mana restore.

Import `completeQuest` from `quests.ts`.

**Step 4: Run test to verify it passes**

Run: `cd ascii-rpg && npx vitest run src/lib/game/overworld-handler.test.ts --grep "threads_of_power"`
Expected: PASS

**Step 5: Commit**

```bash
git add ascii-rpg/src/lib/game/overworld-handler.ts ascii-rpg/src/lib/game/overworld-handler.test.ts ascii-rpg/src/lib/game/quests.ts
git commit -m "feat(quests): implement Threads of Power quest objective tracking"
```

---

### Task 10: Place Thornfield Farm on the W-E Ley Line in Hearthlands

**Files:**
- Modify: `ascii-rpg/src/lib/game/overworld.ts` (placeSettlements or after ley lines)
- Test: `ascii-rpg/src/lib/game/overworld.test.ts`

**Step 1: Write the failing test**

```typescript
describe('Thornfield Farm placement', () => {
	it('places Thornfield Farm on the W-E ley line in hearthlands', () => {
		const world = generateWorld('test-seed');
		const farm = world.settlements.find(s => s.name === 'Thornfield Farm');
		expect(farm).toBeDefined();
		expect(farm!.region).toBe('hearthlands');
		// Farm should be on the W-E ley line
		const weY = world.leyLines.westEast[farm!.pos.x];
		expect(Math.abs(farm!.pos.y - weY)).toBeLessThanOrEqual(1);
	});
});
```

**Step 2: Run test to verify it fails**

Run: `cd ascii-rpg && npx vitest run src/lib/game/overworld.test.ts --grep "Thornfield Farm"`
Expected: FAIL

**Step 3: Implement**

In `generateWorld()`, after ley line generation, place Thornfield Farm:
```typescript
// 10.6. Place Thornfield Farm on the W-E ley line in hearthlands
const hearthCenter = regionSeeds.get('hearthlands');
if (hearthCenter) {
	// Find a point on the W-E ley line within hearthlands
	let farmX = hearthCenter.x;
	let farmY = leyLines.westEast[farmX];
	// Search around hearthlands center for a valid ley line tile in the region
	for (let dx = 0; dx < 30; dx++) {
		for (const sign of [1, -1]) {
			const tx = hearthCenter.x + dx * sign;
			if (tx >= 5 && tx < width - 5) {
				const ty = leyLines.westEast[tx];
				if (tiles[ty]?.[tx]?.region === 'hearthlands' && !tiles[ty][tx].locationId) {
					farmX = tx;
					farmY = ty;
					break;
				}
			}
		}
		if (tiles[farmY]?.[farmX]?.region === 'hearthlands' && !tiles[farmY][farmX].locationId) break;
	}
	const farmPos = { x: farmX, y: farmY };
	if (tiles[farmPos.y]?.[farmPos.x]?.region === 'hearthlands') {
		const farmId = `settlement_${settlements.length}`;
		settlements.push({ id: farmId, name: 'Thornfield Farm', region: 'hearthlands', pos: farmPos, type: 'village' });
		tiles[farmPos.y][farmPos.x].locationId = farmId;
	}
}
```

**Step 4: Run test to verify it passes**

Run: `cd ascii-rpg && npx vitest run src/lib/game/overworld.test.ts --grep "Thornfield Farm"`
Expected: PASS

**Step 5: Commit**

```bash
git add ascii-rpg/src/lib/game/overworld.ts ascii-rpg/src/lib/game/overworld.test.ts
git commit -m "feat(ley-lines): place Thornfield Farm on W-E ley line in hearthlands"
```

---

### Task 11: Add Farmer Edric NPC and Blighted Harvest Dialogue

**Files:**
- Modify: `ascii-rpg/src/lib/game/overworld-handler.ts` (add Farmer Edric to hearthlands NPCs)
- Modify: `ascii-rpg/src/lib/game/dialogue.ts` (add Farmer Edric dialogue tree)
- Test: `ascii-rpg/src/lib/game/dialogue.test.ts`

**Step 1: Write the failing test**

```typescript
describe('Farmer Edric dialogue', () => {
	it('has blighted_harvest dialogue tree', () => {
		const edricTree = getDialogueTree('Farmer Edric');
		expect(edricTree).toBeDefined();
		expect(edricTree.nodes['start']).toBeDefined();
	});

	it('offers quest accept option', () => {
		const edricTree = getDialogueTree('Farmer Edric');
		const helpNode = edricTree.nodes['help_request'];
		const questOpt = helpNode.options.find(o => o.onSelect?.acceptQuest === 'blighted_harvest');
		expect(questOpt).toBeDefined();
	});
});
```

**Step 2: Run test to verify it fails**

**Step 3: Implement**

Add Farmer Edric to hearthlands regional NPCs in `overworld-handler.ts`:
```typescript
hearthlands: [
	// ... existing NPCs ...
	{ char: 'F', color: '#a84', name: 'Farmer Edric', dialogue: ['Something is wrong with my land... the crops, the well... please, can you help?'], mood: 'afraid' },
],
```

Add Farmer Edric's dialogue tree in `dialogue.ts`:
```typescript
'Farmer Edric': {
	startNode: 'start',
	nodes: {
		start: node('start',
			'Thank the gods, a traveler! Please, I need help. Something is wrong with my farm — the crops grow twisted overnight, the well water makes people see things. My daughter drank from it and she has been feverish for days.',
			[
				opt('Tell me more about what is happening.', 'symptoms', '#ff8'),
				opt('I will look into it. [Accept: Blighted Harvest]', 'quest_accepted', '#4f4', { onSelect: { acceptQuest: 'blighted_harvest' } }),
				opt('I cannot help right now.', '__exit__', '#888'),
			]
		),
		symptoms: node('symptoms',
			'The crops in the west field — they grow twice as fast as normal. But they are wrong. Twisted stalks, glowing at night. And the well... my neighbor drew water last week and saw visions of seven figures in a ring of fire. He will not go near it now.',
			[
				opt('Seven figures? What did he see exactly?', 'vision_detail', '#c8f'),
				opt('I will investigate your farm.', 'help_request', '#4f4'),
				opt('Goodbye.', '__exit__', '#888'),
			]
		),
		vision_detail: node('vision_detail',
			'He said they stood in a circle of light — seven of them, wearing masks. One was weeping. He could not tell if it was a memory or a prophecy. He has not slept well since.',
			[
				opt('I will help you. [Accept: Blighted Harvest]', 'quest_accepted', '#4f4', { onSelect: { acceptQuest: 'blighted_harvest' } }),
				opt('Interesting. I will look into this.', 'help_request', '#ff8'),
			]
		),
		help_request: node('help_request',
			'Please, anything you can do. I do not understand magic, but whatever is beneath my field is poisoning everything it touches.',
			[
				opt('[Accept: Blighted Harvest]', 'quest_accepted', '#4f4', { onSelect: { acceptQuest: 'blighted_harvest' } }),
				opt('I need to prepare first. I will return.', '__exit__', '#888'),
			]
		),
		quest_accepted: node('quest_accepted',
			'Thank you! The farm is just west of here. You will see the field — the crops that glow at night. The well is in the center of the yard. Please, help my daughter.',
			[
				opt('I will do what I can.', '__exit__', '#4f4'),
			]
		),
		// Post-investigation nodes (reached when player returns after using True Sight/Reveal Secrets)
		investigation_done: node('investigation_done',
			'Did you find anything? What is causing this?',
			[
				opt('A ley line runs directly under your farm. Raw magical energy is bleeding through.', 'ley_explained', '#4ff'),
			]
		),
		ley_explained: node('ley_explained',
			'A ley line? I have heard the scholars speak of such things, but I never imagined one ran beneath my field. Can you stop it? Can you make it safe?',
			[
				opt('[Ward the Well] (Requires: Ward of Protection ritual)', 'ward_well', '#88f', { showIf: { type: 'hasRitual', value: 'ward_of_protection' } }),
				opt('[Redirect the Flow] (Requires: Ley Line knowledge, INT 14+)', 'redirect_flow', '#4ff', { showIf: { type: 'allOf', conditions: [{ type: 'hasTitle', value: 'Ley Line Scholar' }, { type: 'minLevel', value: 1 }] } }),
				opt('I need to find a way to help. I will return.', '__exit__', '#888'),
			]
		),
		ward_well: node('ward_well',
			'You trace protective sigils around the well. The water stills, losing its eerie shimmer. The farm girl sips cautiously — no visions. Edric weeps with relief.',
			[
				opt('[Quest complete — partial fix]', '__exit__', '#4f4', { onSelect: { message: 'The well is safe, but the crops still grow strangely. Farmer Edric gives you a vial of the old well water as thanks.' } }),
			]
		),
		redirect_flow: node('redirect_flow',
			'Drawing on your knowledge of ley lines, you channel the energy around the farm. The glow fades from the crops. The well water runs clear. Even the livestock return to graze.',
			[
				opt('[Quest complete — full fix]', '__exit__', '#4f4', { onSelect: { message: 'The farm is restored. Farmer Edric gives you a vial of the old well water — the last of its power, safely contained.' } }),
			]
		),
	},
},
```

Note: `hasRitual` condition type needs to be added to `DialogueCondition` in `types.ts` and `checkCondition` in `dialogue-handler.ts`, similar to `hasSpell`.

**Step 4: Run test to verify it passes**

**Step 5: Commit**

```bash
git add ascii-rpg/src/lib/game/overworld-handler.ts ascii-rpg/src/lib/game/dialogue.ts ascii-rpg/src/lib/game/dialogue.test.ts ascii-rpg/src/lib/game/types.ts ascii-rpg/src/lib/game/dialogue-handler.ts
git commit -m "feat(dialogue): add Farmer Edric NPC and Blighted Harvest dialogue tree"
```

---

### Task 12: Add Blighted Harvest Quest Objective Tracking

**Files:**
- Modify: `ascii-rpg/src/lib/game/overworld-handler.ts` (track farm investigation and resolution)
- Test: `ascii-rpg/src/lib/game/overworld-handler.test.ts`

**Step 1: Write the failing test**

```typescript
describe('blighted_harvest quest tracking', () => {
	it('completes investigate objective when using True Sight at Thornfield Farm', () => {
		const state = makeOverworldState();
		acceptQuest(state, 'blighted_harvest');
		state.trueSightActive = 5;
		state.currentLocationId = 'settlement_thornfield'; // inside Thornfield Farm
		// Simulate being at the farm with True Sight
		trackBlightedHarvestProgress(state);
		const quest = state.quests.find(q => q.id === 'blighted_harvest')!;
		const obj = quest.objectives.find(o => o.id === 'bh_investigate')!;
		expect(obj.completed).toBe(true);
	});
});
```

**Step 2: Run test to verify it fails**

**Step 3: Implement**

Add tracking function (can be combined with the ley line quest tracking):
```typescript
export function trackBlightedHarvestProgress(state: GameState): void {
	const quest = state.quests.find(q => q.id === 'blighted_harvest' && q.status === 'active');
	if (!quest) return;

	// Inside Thornfield Farm with True Sight or Reveal Secrets active
	const atFarm = state.currentLocationId?.includes('thornfield') ||
		(state.worldMap && state.overworldPos &&
		(state.worldMap as WorldMap).settlements.find(s => s.name === 'Thornfield Farm' &&
			s.pos.x === state.overworldPos!.x && s.pos.y === state.overworldPos!.y));

	if (atFarm && (state.trueSightActive > 0 || state.revealedLeyLineTiles?.size > 0)) {
		const obj = quest.objectives.find(o => o.id === 'bh_investigate');
		if (obj && !obj.completed) {
			obj.current = 1;
			obj.completed = true;
			addMessage(state, 'Through your magical sight, you see it clearly — a brilliant stream of energy runs directly through the field and under the well.', 'magic');
		}
	}
}
```

The resolution objective (`bh_resolve`) is completed via dialogue choices (ward_well or redirect_flow nodes), so add `completeQuest` calls to those dialogue effects. This can be handled by adding a `completeQuest` field to `DialogueEffect` or by directly updating the quest objective in the dialogue handler when the resolution dialogue is reached.

**Step 4: Run test to verify it passes**

**Step 5: Commit**

```bash
git add ascii-rpg/src/lib/game/overworld-handler.ts ascii-rpg/src/lib/game/overworld-handler.test.ts
git commit -m "feat(quests): implement Blighted Harvest quest objective tracking"
```

---

### Task 13: Persist New Fields in Save/Load

**Files:**
- Modify: `ascii-rpg/src/lib/game/save.ts` (add trueSightActive to serialization)
- Test: `ascii-rpg/src/lib/game/save.test.ts`

**Step 1: Write the failing test**

```typescript
it('round-trips trueSightActive', () => {
	const state = makeTestState({ trueSightActive: 5 });
	const saved = serializeGameState(state);
	const loaded = deserializeGameState(saved);
	expect(loaded.trueSightActive).toBe(5);
});
```

**Step 2: Run test to verify it fails**

**Step 3: Implement**

In `save.ts` serialization (around line 238):
```typescript
trueSightActive: state.trueSightActive ?? 0,
```

In deserialization (around line 341):
```typescript
trueSightActive: s.trueSightActive ?? 0,
revealedLeyLineTiles: new Set(), // transient, not persisted
```

The `leyLines` data on `WorldMap` is regenerated from the world seed, so no save changes needed for that. The `OverworldTile.leyLine` field is part of the tile grid which is regenerated.

However, check if `worldMap` is re-generated on load or serialized. If the world is regenerated from seed, ley lines will be regenerated too. If not, the `leyLine` field needs to be saved on each tile.

Based on the save code (line 216-217), only `explored` and `discoveredPois` are saved from the world map — the rest is regenerated. So ley lines will be regenerated from the same seed. Good.

**Step 4: Run test to verify it passes**

**Step 5: Commit**

```bash
git add ascii-rpg/src/lib/game/save.ts ascii-rpg/src/lib/game/save.test.ts
git commit -m "feat(save): persist trueSightActive across save/load"
```

---

### Task 14: Ley Line Flavor Text on Overworld Tiles

**Files:**
- Modify: `ascii-rpg/src/lib/game/overworld-handler.ts` (add flavor text when stepping on ley line with True Sight)
- Test: `ascii-rpg/src/lib/game/overworld-handler.test.ts`

**Step 1: Write the failing test**

```typescript
it('shows ley line flavor text when walking on core tile with True Sight', () => {
	const state = makeOverworldState();
	state.trueSightActive = 5;
	const worldMap = state.worldMap as WorldMap;
	const coreY = state.overworldPos!.y;
	const coreX = state.overworldPos!.x + 1;
	worldMap.tiles[coreY][coreX] = { terrain: 'farmland', region: 'hearthlands', leyLine: 'core' };
	worldMap.explored[coreY][coreX] = true;
	const result = handleOverworldInput(state, 'd', mockCreateGame, mockNewLevel);
	expect(result.messages.some(m => m.text.includes('unnaturally tall') || m.text.includes('energy'))).toBe(true);
});
```

**Step 2: Run test to verify it fails**

**Step 3: Implement**

In `handleOverworldInput`, after the ley line level update:
```typescript
// Ley line flavor text (when visible via True Sight)
if (state.trueSightActive > 0 && targetTile.leyLine === 'core') {
	const flavorMap: Partial<Record<TerrainType, string>> = {
		farmland: 'The crops grow unnaturally tall here, fed by unseen energy.',
		forest: 'The trees hum faintly, leaves trembling without wind.',
		grass: 'The ground pulses with faint warmth beneath your feet.',
		rock: 'Veins of light trace through the stone.',
		water: 'The surface shimmers with an inner glow.',
	};
	const flavor = flavorMap[targetTile.terrain] ?? 'You sense raw magical energy flowing through this place.';
	addMessage(state, flavor, 'magic');
}
```

**Step 4: Run test to verify it passes**

**Step 5: Commit**

```bash
git add ascii-rpg/src/lib/game/overworld-handler.ts ascii-rpg/src/lib/game/overworld-handler.test.ts
git commit -m "feat(ley-lines): add terrain-specific flavor text on ley line tiles"
```

---

### Task 15: Final Integration — Run Full Test Suite and Fix Regressions

**Files:**
- All modified files
- Test: Full test suite

**Step 1: Run full test suite**

Run: `cd ascii-rpg && npm test`

**Step 2: Fix any failing tests**

Common issues to check:
- Test helpers missing `trueSightActive: 0` and `revealedLeyLineTiles: new Set()` in makeTestState
- `WorldMap` type assertions failing due to new `leyLines` field
- Snapshot tests affected by new dialogue nodes
- Save/load tests needing the new field

**Step 3: Run TypeScript compiler check**

Run: `cd ascii-rpg && npx tsc --noEmit`

Fix any new type errors (expect ~14 pre-existing, ensure no new ones).

**Step 4: Commit all fixes**

```bash
git add -A
git commit -m "fix: resolve test regressions from ley line integration"
```

**Step 5: Push**

```bash
git push
```
