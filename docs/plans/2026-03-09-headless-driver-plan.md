# Headless Game Driver Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a `GameDriver` class that lets you play & test Aethermoor without the UI — via Vitest tests or a standalone REPL.

**Architecture:** Thin wrapper around `handleInput()` / `handleDialogueChoice()` / `createGame()`. A command parser translates natural language to key sequences. Cheat methods mutate `state` directly. A REPL script uses Node readline for interactive play.

**Tech Stack:** TypeScript, Vitest, Node readline, tsx (for running REPL)

---

### Task 1: Core GameDriver class with key input and message capture

**Files:**
- Create: `src/lib/game/driver.ts`
- Test: `src/lib/game/driver.test.ts`

**Step 1: Write the failing test**

```typescript
// src/lib/game/driver.test.ts
import { describe, it, expect } from 'vitest';
import { GameDriver } from './driver';

describe('GameDriver', () => {
	it('creates a game and provides state access', () => {
		const game = new GameDriver();
		expect(game.state).toBeDefined();
		expect(game.state.player.hp).toBeGreaterThan(0);
		expect(game.state.gameOver).toBe(false);
	});

	it('accepts raw key input and returns this for chaining', () => {
		const game = new GameDriver();
		const result = game.key('.');  // wait
		expect(result).toBe(game);
		expect(game.state.turnCount).toBeGreaterThan(0);
	});

	it('accepts multiple keys via keys()', () => {
		const game = new GameDriver();
		const startPos = { ...game.state.player.pos };
		game.keys('...');  // 3 waits
		expect(game.state.turnCount).toBe(3);
	});

	it('captures new messages', () => {
		const game = new GameDriver();
		// createGame always produces a welcome message
		const msgs = game.newMessages();
		expect(msgs.length).toBeGreaterThan(0);
		// second call should return empty (already read)
		expect(game.newMessages().length).toBe(0);
	});

	it('log() returns formatted message text', () => {
		const game = new GameDriver();
		const text = game.log();
		expect(typeof text).toBe('string');
		expect(text.length).toBeGreaterThan(0);
	});

	it('accepts CharacterConfig overrides', () => {
		const game = new GameDriver({ characterClass: 'mage' });
		expect(game.state.characterConfig.characterClass).toBe('mage');
	});
});
```

**Step 2: Run test to verify it fails**

Run: `cd ascii-rpg && npx vitest run src/lib/game/driver.test.ts`
Expected: FAIL — cannot find module './driver'

**Step 3: Write minimal implementation**

```typescript
// src/lib/game/driver.ts
import { createGame, handleInput, handleDialogueChoice } from './engine';
import type { GameState, CharacterConfig, GameMessage, ActiveDialogue, Entity, Quest } from './types';
import type { Item } from './items';

export class GameDriver {
	state: GameState;
	private _messageIndex: number;

	constructor(config?: Partial<CharacterConfig>) {
		const fullConfig: CharacterConfig = {
			name: 'Hero',
			characterClass: 'warrior',
			difficulty: 'normal',
			startingLocation: 'cave',
			worldSeed: 'test-seed',
			...config,
		};
		this.state = createGame(fullConfig);
		this._messageIndex = 0;
	}

	/** Send a single raw key press */
	key(k: string): this {
		this.state = handleInput(this.state, k);
		return this;
	}

	/** Send multiple raw keys in sequence */
	keys(seq: string): this {
		for (const ch of seq) {
			this.key(ch);
		}
		return this;
	}

	/** Get messages added since last call */
	newMessages(): GameMessage[] {
		const msgs = this.state.messages.slice(this._messageIndex);
		this._messageIndex = this.state.messages.length;
		return msgs;
	}

	/** Get formatted text of new messages */
	log(): string {
		return this.newMessages().map(m => `[${m.type}] ${m.text}`).join('\n');
	}

	/** Current active dialogue (or null) */
	get dialog(): ActiveDialogue | null {
		return this.state.activeDialogue;
	}

	/** Available dialogue option texts */
	get dialogOptions(): string[] {
		if (!this.state.activeDialogue) return [];
		const node = this.state.activeDialogue.tree.nodes[this.state.activeDialogue.currentNodeId];
		return node ? node.options.map(o => o.text) : [];
	}

	/** Choose a dialogue option by index (0-based) */
	choose(index: number): this {
		this.state = handleDialogueChoice(this.state, index);
		return this;
	}

	/** Shorthand accessors */
	get player(): Entity { return this.state.player; }
	get enemies(): Entity[] { return this.state.enemies; }
	get quests(): Quest[] { return this.state.quests; }
	get inventory(): (Item | null)[] { return this.state.inventory; }
	get pos() { return this.state.player.pos; }
	get hp() { return this.state.player.hp; }
	get turn() { return this.state.turnCount; }
}
```

**Step 4: Run test to verify it passes**

Run: `cd ascii-rpg && npx vitest run src/lib/game/driver.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/game/driver.ts src/lib/game/driver.test.ts
git commit -m "feat(driver): add core GameDriver class with key input and message capture"
```

---

### Task 2: Command parser — natural language to key sequences

**Files:**
- Create: `src/lib/game/driver-commands.ts`
- Test: `src/lib/game/driver-commands.test.ts`
- Modify: `src/lib/game/driver.ts` — add `command()` method

**Step 1: Write the failing test**

```typescript
// src/lib/game/driver-commands.test.ts
import { describe, it, expect } from 'vitest';
import { parseCommand } from './driver-commands';

describe('parseCommand', () => {
	it('parses directional movement', () => {
		expect(parseCommand('move north')).toEqual({ type: 'keys', keys: ['w'] });
		expect(parseCommand('go south')).toEqual({ type: 'keys', keys: ['s'] });
		expect(parseCommand('east')).toEqual({ type: 'keys', keys: ['d'] });
		expect(parseCommand('west')).toEqual({ type: 'keys', keys: ['a'] });
		expect(parseCommand('n')).toEqual({ type: 'keys', keys: ['w'] });
		expect(parseCommand('s')).toEqual({ type: 'keys', keys: ['s'] });
		expect(parseCommand('e')).toEqual({ type: 'keys', keys: ['d'] });
		expect(parseCommand('w')).toEqual({ type: 'keys', keys: ['a'] });
	});

	it('parses wait', () => {
		expect(parseCommand('wait')).toEqual({ type: 'keys', keys: ['.'] });
	});

	it('parses rest', () => {
		expect(parseCommand('rest')).toEqual({ type: 'keys', keys: ['r'] });
	});

	it('parses defend', () => {
		expect(parseCommand('defend')).toEqual({ type: 'keys', keys: ['b'] });
	});

	it('parses dialog choice', () => {
		expect(parseCommand('choose 1')).toEqual({ type: 'dialog', index: 0 });
		expect(parseCommand('dialog 3')).toEqual({ type: 'dialog', index: 2 });
		expect(parseCommand('1')).toEqual({ type: 'dialog', index: 0 });
	});

	it('parses inventory', () => {
		expect(parseCommand('inventory')).toEqual({ type: 'keys', keys: ['i'] });
		expect(parseCommand('inv')).toEqual({ type: 'keys', keys: ['i'] });
	});

	it('parses inspect commands', () => {
		expect(parseCommand('status')).toEqual({ type: 'inspect', target: 'status' });
		expect(parseCommand('quests')).toEqual({ type: 'inspect', target: 'quests' });
		expect(parseCommand('look')).toEqual({ type: 'inspect', target: 'look' });
	});

	it('parses escape', () => {
		expect(parseCommand('back')).toEqual({ type: 'keys', keys: ['Escape'] });
		expect(parseCommand('cancel')).toEqual({ type: 'keys', keys: ['Escape'] });
		expect(parseCommand('escape')).toEqual({ type: 'keys', keys: ['Escape'] });
	});

	it('parses stairs', () => {
		expect(parseCommand('descend')).toEqual({ type: 'keys', keys: ['>'] });
		expect(parseCommand('stairs')).toEqual({ type: 'keys', keys: ['>'] });
	});

	it('parses ability keys', () => {
		expect(parseCommand('ability 1')).toEqual({ type: 'keys', keys: ['1'] });
		expect(parseCommand('ability 2')).toEqual({ type: 'keys', keys: ['2'] });
	});

	it('returns unknown for unrecognized input', () => {
		expect(parseCommand('asdfghjkl')).toEqual({ type: 'unknown', raw: 'asdfghjkl' });
	});
});
```

**Step 2: Run test to verify it fails**

Run: `cd ascii-rpg && npx vitest run src/lib/game/driver-commands.test.ts`
Expected: FAIL

**Step 3: Write the command parser**

```typescript
// src/lib/game/driver-commands.ts

export type ParsedCommand =
	| { type: 'keys'; keys: string[] }
	| { type: 'dialog'; index: number }
	| { type: 'inspect'; target: 'status' | 'quests' | 'look' | 'inventory' | 'spells' | 'map' }
	| { type: 'unknown'; raw: string };

const DIRECTION_MAP: Record<string, string> = {
	north: 'w', south: 's', east: 'd', west: 'a',
	up: 'w', down: 's', left: 'a', right: 'd',
	n: 'w', s: 's', e: 'd', w: 'a',
};

export function parseCommand(input: string): ParsedCommand {
	const trimmed = input.trim().toLowerCase();
	const parts = trimmed.split(/\s+/);
	const cmd = parts[0];
	const arg = parts[1];

	// Single digit → dialog choice
	if (/^\d+$/.test(trimmed)) {
		return { type: 'dialog', index: parseInt(trimmed, 10) - 1 };
	}

	// Movement: "move north", "go east", or just "north"
	if (cmd === 'move' || cmd === 'go') {
		const dir = DIRECTION_MAP[arg];
		if (dir) return { type: 'keys', keys: [dir] };
	}
	if (DIRECTION_MAP[cmd] && parts.length === 1) {
		return { type: 'keys', keys: [DIRECTION_MAP[cmd]] };
	}

	// Dialog choices: "choose 1", "dialog 2"
	if ((cmd === 'choose' || cmd === 'dialog' || cmd === 'pick' || cmd === 'select') && arg) {
		const idx = parseInt(arg, 10);
		if (!isNaN(idx)) return { type: 'dialog', index: idx - 1 };
	}

	// Ability: "ability 1"
	if (cmd === 'ability' && arg) {
		const n = parseInt(arg, 10);
		if (n >= 1 && n <= 9) return { type: 'keys', keys: [String(n)] };
	}

	// Simple key mappings
	const SIMPLE: Record<string, string[]> = {
		wait: ['.'],
		rest: ['r'],
		defend: ['b'], block: ['b'],
		inventory: ['i'], inv: ['i'],
		descend: ['>'], stairs: ['>'],
		back: ['Escape'], cancel: ['Escape'], escape: ['Escape'],
		examine: ['x'], interact: ['x'],
		spellmenu: ['m'],
	};
	if (SIMPLE[trimmed]) return { type: 'keys', keys: SIMPLE[trimmed] };

	// Inspect commands (don't send keys, return info)
	const INSPECTS: Record<string, 'status' | 'quests' | 'look' | 'inventory' | 'spells' | 'map'> = {
		status: 'status', stats: 'status',
		quests: 'quests', quest: 'quests',
		look: 'look', surroundings: 'look',
		spells: 'spells',
		map: 'map', location: 'map',
	};
	if (INSPECTS[trimmed]) return { type: 'inspect', target: INSPECTS[trimmed] };

	return { type: 'unknown', raw: trimmed };
}
```

**Step 4: Run test to verify it passes**

Run: `cd ascii-rpg && npx vitest run src/lib/game/driver-commands.test.ts`
Expected: PASS

**Step 5: Add `command()` method to GameDriver**

Add test in `driver.test.ts`:
```typescript
describe('command()', () => {
	it('executes natural language commands', () => {
		const game = new GameDriver();
		const startPos = { ...game.pos };
		game.command('wait');
		// wait doesn't move, but advances turn
		expect(game.turn).toBeGreaterThan(0);
	});

	it('handles dialog choices via command', () => {
		const game = new GameDriver();
		// Manually set up a dialog for testing
		game.state.activeDialogue = {
			npcName: 'Test NPC',
			npcChar: 'T',
			npcColor: '#fff',
			currentNodeId: 'start',
			tree: {
				startNode: 'start',
				nodes: {
					start: {
						id: 'start',
						npcText: 'Hello there!',
						options: [
							{ text: 'Hi!', nextNode: 'end' },
							{ text: 'Bye!', nextNode: 'end' },
						],
					},
					end: {
						id: 'end',
						npcText: 'Farewell!',
						options: [],
					},
				},
			},
			visitedNodes: new Set(),
			givenItems: false,
			mood: 'neutral',
			context: {} as any,
		};
		expect(game.dialogOptions).toEqual(['Hi!', 'Bye!']);
		game.command('choose 1');
		expect(game.dialog?.currentNodeId).toBe('end');
	});

	it('returns inspect info for status/look/quests', () => {
		const game = new GameDriver();
		const info = game.command('status');
		// Should still return this for chaining
		expect(info).toBe(game);
	});
});
```

Add to `driver.ts`:
```typescript
import { parseCommand } from './driver-commands';

// In GameDriver class:
	/** Execute a natural language command */
	command(input: string): this {
		const parsed = parseCommand(input);
		switch (parsed.type) {
			case 'keys':
				for (const k of parsed.keys) this.key(k);
				break;
			case 'dialog':
				this.choose(parsed.index);
				break;
			case 'inspect':
				this._inspect(parsed.target);
				break;
			case 'unknown':
				// Try as raw key
				if (input.length === 1) {
					this.key(input);
				}
				break;
		}
		return this;
	}

	/** Print inspect info to internal log */
	private _inspect(target: string): void {
		const s = this.state;
		let info = '';
		switch (target) {
			case 'status':
				info = `${s.player.name} (${s.characterConfig.characterClass}) Lv${s.characterLevel}\n`
					+ `HP: ${s.player.hp}/${s.player.maxHp} | ATK: ${s.player.attack}\n`
					+ `Mana: ${s.player.mana ?? 0}/${s.player.maxMana ?? 0}\n`
					+ `XP: ${s.xp} | Turn: ${s.turnCount}\n`
					+ `Pos: (${s.player.pos.x}, ${s.player.pos.y}) | Level: ${s.level}\n`
					+ `STR:${s.player.str ?? 0} INT:${s.player.int ?? 0} WIL:${s.player.wil ?? 0} AGI:${s.player.agi ?? 0} VIT:${s.player.vit ?? 0}`;
				break;
			case 'quests':
				info = s.quests.length === 0 ? 'No active quests.'
					: s.quests.map(q => `[${q.status}] ${q.title}: ${q.objectives.map(o => `${o.description} (${o.current}/${o.required})`).join(', ')}`).join('\n');
				break;
			case 'look': {
				const nearby = s.enemies.filter(e =>
					Math.abs(e.pos.x - s.player.pos.x) <= 3 && Math.abs(e.pos.y - s.player.pos.y) <= 3
				);
				const npcsNear = s.npcs.filter(n =>
					Math.abs(n.pos.x - s.player.pos.x) <= 3 && Math.abs(n.pos.y - s.player.pos.y) <= 3
				);
				info = `Location: ${s.currentLocationId ?? 'unknown'} (level ${s.level})\n`
					+ `Enemies nearby: ${nearby.length === 0 ? 'none' : nearby.map(e => `${e.name}(${e.hp}hp) at (${e.pos.x},${e.pos.y})`).join(', ')}\n`
					+ `NPCs nearby: ${npcsNear.length === 0 ? 'none' : npcsNear.map(n => `${n.name} at (${n.pos.x},${n.pos.y})`).join(', ')}`;
				break;
			}
			case 'inventory':
				info = s.inventory.map((item, i) => item ? `[${i}] ${item.name}` : null).filter(Boolean).join('\n') || 'Inventory empty.';
				break;
			case 'spells':
				info = s.learnedSpells.length === 0 ? 'No spells learned.'
					: s.learnedSpells.join(', ');
				break;
			case 'map':
				info = `Location: ${s.currentLocationId ?? 'overworld'} | Mode: ${s.locationMode} | Level: ${s.level}`;
				break;
		}
		// Push inspect output as info messages so log() captures it
		if (info) {
			this.state.messages.push({ text: info, type: 'info' });
		}
	}
```

**Step 6: Run tests**

Run: `cd ascii-rpg && npx vitest run src/lib/game/driver.test.ts src/lib/game/driver-commands.test.ts`
Expected: PASS

**Step 7: Commit**

```bash
git add src/lib/game/driver-commands.ts src/lib/game/driver-commands.test.ts src/lib/game/driver.ts src/lib/game/driver.test.ts
git commit -m "feat(driver): add command parser for natural language input"
```

---

### Task 3: Cheat / god-mode methods

**Files:**
- Modify: `src/lib/game/driver.ts`
- Modify: `src/lib/game/driver.test.ts`

**Step 1: Write the failing tests**

Add to `driver.test.ts`:
```typescript
describe('cheats', () => {
	it('godMode() makes player unkillable', () => {
		const game = new GameDriver();
		game.godMode();
		expect(game.hp).toBe(99999);
		expect(game.state.player.maxHp).toBe(99999);
		expect(game.state.player.attack).toBeGreaterThanOrEqual(9999);
	});

	it('setStats() overrides player stats', () => {
		const game = new GameDriver();
		game.setStats({ hp: 42, attack: 100 });
		expect(game.hp).toBe(42);
		expect(game.state.player.attack).toBe(100);
	});

	it('killAll() removes all enemies', () => {
		const game = new GameDriver();
		// Even if no enemies on current map, should not throw
		game.killAll();
		expect(game.enemies.length).toBe(0);
	});

	it('giveItem() adds item to inventory', () => {
		const game = new GameDriver();
		game.giveItem('rusty_sword');
		const items = game.inventory.filter(Boolean);
		expect(items.some(i => i!.id === 'rusty_sword')).toBe(true);
	});

	it('setLevel() sets character level', () => {
		const game = new GameDriver();
		game.setLevel(10);
		expect(game.state.characterLevel).toBe(10);
	});

	it('teleport() moves player to position', () => {
		const game = new GameDriver();
		game.teleport(3, 3);
		expect(game.pos).toEqual({ x: 3, y: 3 });
	});

	it('learnSpell() adds spell to learned list', () => {
		const game = new GameDriver();
		game.learnSpell('spell_firebolt');
		expect(game.state.learnedSpells).toContain('spell_firebolt');
	});

	it('learnAllSpells() learns everything', () => {
		const game = new GameDriver();
		game.learnAllSpells();
		expect(game.state.learnedSpells.length).toBeGreaterThan(5);
	});

	it('addRumor() adds a rumor', () => {
		const game = new GameDriver();
		game.addRumor('test_rumor', 'A test rumor');
		expect(game.state.rumors.some(r => r.id === 'test_rumor')).toBe(true);
	});

	it('methods chain', () => {
		const game = new GameDriver();
		const result = game.godMode().giveItem('rusty_sword').setLevel(5);
		expect(result).toBe(game);
	});
});
```

**Step 2: Run tests to verify they fail**

Run: `cd ascii-rpg && npx vitest run src/lib/game/driver.test.ts`
Expected: FAIL — methods don't exist

**Step 3: Add cheat methods to GameDriver**

```typescript
// Add to driver.ts — inside the GameDriver class:

	// ==================== CHEATS ====================

	/** Make player unkillable with massive stats */
	godMode(): this {
		this.state.player.hp = 99999;
		this.state.player.maxHp = 99999;
		this.state.player.attack = 9999;
		this.state.player.mana = 9999;
		this.state.player.maxMana = 9999;
		return this;
	}

	/** Override any player entity fields */
	setStats(overrides: Partial<Entity>): this {
		Object.assign(this.state.player, overrides);
		return this;
	}

	/** Kill all enemies on the current map */
	killAll(): this {
		this.state.enemies = [];
		return this;
	}

	/** Spawn a monster at a given position */
	spawnEnemy(monsterName: string, x: number, y: number): this {
		const def = MONSTER_DEFS.find(m => m.name.toLowerCase() === monsterName.toLowerCase());
		if (def) {
			this.state.enemies.push(createMonster({ x, y }, this.state.level, def));
		}
		return this;
	}

	/** Set character level */
	setLevel(level: number): this {
		this.state.characterLevel = level;
		return this;
	}

	/** Add an item to inventory by ID */
	giveItem(itemId: string, count = 1): this {
		const template = ITEM_CATALOG[itemId];
		if (template) {
			for (let i = 0; i < count; i++) {
				addToInventory(this.state.inventory, { ...template });
			}
		}
		return this;
	}

	/** Clear all items from inventory */
	clearInventory(): this {
		this.state.inventory = Array.from({ length: 12 }, () => null);
		return this;
	}

	/** Teleport player to a position */
	teleport(x: number, y: number): this {
		this.state.player.pos = { x, y };
		return this;
	}

	/** Learn a specific spell */
	learnSpell(spellId: string): this {
		if (!this.state.learnedSpells.includes(spellId)) {
			this.state.learnedSpells.push(spellId);
		}
		return this;
	}

	/** Learn all spells in the game */
	learnAllSpells(): this {
		for (const id of Object.keys(SPELL_CATALOG)) {
			if (!this.state.learnedSpells.includes(id)) {
				this.state.learnedSpells.push(id);
			}
		}
		return this;
	}

	/** Learn a specific ritual */
	learnRitual(ritualId: string): this {
		if (!this.state.learnedRituals.includes(ritualId)) {
			this.state.learnedRituals.push(ritualId);
		}
		return this;
	}

	/** Learn all rituals */
	learnAllRituals(): this {
		for (const id of Object.keys(RITUAL_CATALOG)) {
			if (!this.state.learnedRituals.includes(id)) {
				this.state.learnedRituals.push(id);
			}
		}
		return this;
	}

	/** Add a rumor */
	addRumor(id: string, text: string): this {
		if (!this.state.rumors.some(r => r.id === id)) {
			this.state.rumors.push({ id, text, source: 'cheat', accuracy: 'true' });
		}
		return this;
	}

	/** Set an NPC's mood */
	setNpcMood(npcName: string, mood: NPCMood): this {
		const npc = this.state.npcs.find(n => n.name.toLowerCase() === npcName.toLowerCase());
		if (npc) {
			npc.mood = mood;
			npc.moodTurns = 0;
		}
		return this;
	}

	/** Complete academy graduation */
	graduateAcademy(): this {
		this.state.academyState = {
			enrolled: true,
			enrolledAtTurn: 0,
			lessonsCompleted: ['lesson1', 'lesson2', 'lesson3', 'lesson4', 'lesson5', 'lesson6'],
			nextLessonIndex: 6,
			nextLessonAvailableTurn: 0,
			examTaken: true,
			examPassed: true,
			examPart1Passed: true,
			graduated: true,
			isTeaching: false,
			teachingSessions: 0,
			teachingCooldownTurn: 0,
		};
		return this;
	}

	/** Complete a quest by id */
	completeQuest(questId: string): this {
		const quest = this.state.quests.find(q => q.id === questId);
		if (quest) {
			quest.status = 'completed';
			quest.objectives.forEach(o => { o.completed = true; o.current = o.required; });
			if (!this.state.completedQuestIds.includes(questId)) {
				this.state.completedQuestIds.push(questId);
			}
		}
		return this;
	}
```

**Step 4: Add necessary imports to driver.ts**

```typescript
import { MONSTER_DEFS, createMonster } from './monsters';
import { ITEM_CATALOG, addToInventory } from './items';
import { SPELL_CATALOG } from './spells';
import { RITUAL_CATALOG } from './rituals';
import type { NPCMood } from './types';
```

**Step 5: Run tests**

Run: `cd ascii-rpg && npx vitest run src/lib/game/driver.test.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add src/lib/game/driver.ts src/lib/game/driver.test.ts
git commit -m "feat(driver): add cheat and god-mode methods"
```

---

### Task 4: REPL script

**Files:**
- Create: `src/lib/game/repl.ts`
- Modify: `package.json` — add `"repl"` script

**Step 1: Write the REPL**

```typescript
// src/lib/game/repl.ts
import * as readline from 'node:readline';
import { GameDriver } from './driver';
import { parseCommand } from './driver-commands';
import type { CharacterClass } from './types';

const args = process.argv.slice(2);
const classArg = args.find(a => a.startsWith('--class='))?.split('=')[1] as CharacterClass | undefined;
const seedArg = args.find(a => a.startsWith('--seed='))?.split('=')[1];

const game = new GameDriver({
	...(classArg && { characterClass: classArg }),
	...(seedArg && { worldSeed: seedArg }),
});

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: '> ',
});

function printMessages(): void {
	const text = game.log();
	if (text) console.log(text);
}

function printHelp(): void {
	console.log(`
=== Aethermoor Headless REPL ===

MOVEMENT:    north/n, south/s, east/e, west/w  (or raw keys: w,a,s,d)
ACTIONS:     wait, rest, defend, descend/stairs, examine
DIALOG:      choose <n>, or just type a number (1, 2, 3...)
INVENTORY:   inventory/inv
SPELLS:      spellmenu, ability <n>
INSPECT:     status, quests, look, spells, map
NAVIGATION:  back/cancel/escape

CHEATS (prefix with /):
  /godmode          — unkillable, massive stats
  /kill             — kill all enemies
  /give <item_id>   — add item to inventory
  /tp <x> <y>       — teleport to position
  /level <n>        — set character level
  /spell <id>       — learn a spell
  /allspells        — learn all spells
  /allrituals       — learn all rituals
  /ritual <id>      — learn a ritual
  /mood <npc> <mood> — set NPC mood
  /graduate         — complete academy
  /spawn <name> <x> <y> — spawn enemy
  /state <path>     — inspect any state path (e.g. /state player.hp)

  /help             — show this help
  /quit             — exit
`);
}

function handleCheat(input: string): void {
	const parts = input.slice(1).split(/\s+/);
	const cmd = parts[0];
	switch (cmd) {
		case 'godmode': case 'god':
			game.godMode();
			console.log('GOD MODE activated.');
			break;
		case 'kill': case 'killall':
			game.killAll();
			console.log('All enemies killed.');
			break;
		case 'give':
			if (parts[1]) {
				game.giveItem(parts[1], parseInt(parts[2] || '1', 10));
				console.log(`Gave ${parts[1]}.`);
			}
			break;
		case 'tp': case 'teleport':
			if (parts[1] && parts[2]) {
				game.teleport(parseInt(parts[1], 10), parseInt(parts[2], 10));
				console.log(`Teleported to (${parts[1]}, ${parts[2]}).`);
			}
			break;
		case 'level':
			if (parts[1]) {
				game.setLevel(parseInt(parts[1], 10));
				console.log(`Level set to ${parts[1]}.`);
			}
			break;
		case 'spell':
			if (parts[1]) {
				game.learnSpell(parts[1]);
				console.log(`Learned spell ${parts[1]}.`);
			}
			break;
		case 'allspells':
			game.learnAllSpells();
			console.log('All spells learned.');
			break;
		case 'allrituals':
			game.learnAllRituals();
			console.log('All rituals learned.');
			break;
		case 'ritual':
			if (parts[1]) {
				game.learnRitual(parts[1]);
				console.log(`Learned ritual ${parts[1]}.`);
			}
			break;
		case 'mood':
			if (parts[1] && parts[2]) {
				game.setNpcMood(parts[1], parts[2] as any);
				console.log(`Set ${parts[1]} mood to ${parts[2]}.`);
			}
			break;
		case 'graduate':
			game.graduateAcademy();
			console.log('Academy graduated.');
			break;
		case 'spawn':
			if (parts[1] && parts[2] && parts[3]) {
				game.spawnEnemy(parts[1], parseInt(parts[2], 10), parseInt(parts[3], 10));
				console.log(`Spawned ${parts[1]} at (${parts[2]}, ${parts[3]}).`);
			}
			break;
		case 'state': {
			if (parts[1]) {
				const path = parts[1].split('.');
				let val: any = game.state;
				for (const p of path) {
					if (val == null) break;
					val = val[p];
				}
				console.log(JSON.stringify(val, null, 2));
			}
			break;
		}
		case 'help':
			printHelp();
			break;
		case 'quit': case 'exit':
			process.exit(0);
		default:
			console.log(`Unknown cheat: ${cmd}. Type /help for commands.`);
	}
}

// Startup
console.log(`Aethermoor REPL — ${game.state.characterConfig.characterClass} "${game.state.player.name}"`);
console.log(`Type /help for commands.\n`);
printMessages();

// Show dialog if active
function showDialogPrompt(): void {
	if (game.dialog) {
		const node = game.dialog.tree.nodes[game.dialog.currentNodeId];
		if (node) {
			console.log(`\n[${game.dialog.npcName}]: ${node.npcText}`);
			node.options.forEach((opt, i) => {
				console.log(`  ${i + 1}. ${opt.text}`);
			});
		}
	}
}

showDialogPrompt();
rl.prompt();

rl.on('line', (line) => {
	const input = line.trim();
	if (!input) {
		rl.prompt();
		return;
	}

	if (input.startsWith('/')) {
		handleCheat(input);
	} else {
		// Try as natural command first; if single char, send as raw key
		game.command(input);
		printMessages();
		showDialogPrompt();
	}

	// Show game over
	if (game.state.gameOver) {
		console.log('\n=== GAME OVER ===');
		console.log('Press r to restart or /quit to exit.');
	}

	rl.prompt();
});

rl.on('close', () => {
	console.log('\nGoodbye!');
	process.exit(0);
});
```

**Step 2: Add npm script to package.json**

Add to `scripts` in `package.json`:
```json
"repl": "tsx src/lib/game/repl.ts"
```

**Step 3: Install tsx as devDependency**

Run: `cd ascii-rpg && npm install -D tsx`

**Step 4: Test the REPL manually**

Run: `cd ascii-rpg && npx tsx src/lib/game/repl.ts --class=warrior`
Expected: Shows welcome message and prompt. Type `/help`, `status`, `look`, `wait`, `/godmode`, `/quit`.

**Step 5: Commit**

```bash
git add src/lib/game/repl.ts package.json package-lock.json
git commit -m "feat(driver): add interactive REPL for headless play"
```

---

### Task 5: Run all existing tests to verify nothing is broken

**Step 1: Run full test suite**

Run: `cd ascii-rpg && npm test`
Expected: All existing tests PASS, plus new driver tests.

**Step 2: Commit if any fixes needed**

---

### Summary

| Task | Files | Description |
|------|-------|-------------|
| 1 | driver.ts, driver.test.ts | Core class: key input, message capture, state access |
| 2 | driver-commands.ts, driver-commands.test.ts, driver.ts | Natural language command parser + command() method |
| 3 | driver.ts, driver.test.ts | Cheat/god-mode methods (combat, progression, inventory, etc.) |
| 4 | repl.ts, package.json | Interactive REPL with cheat prefix (/) |
| 5 | — | Full regression test run |
