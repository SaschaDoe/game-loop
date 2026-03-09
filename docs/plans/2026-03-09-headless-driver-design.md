# Headless Game Driver — Design

## Goal

Play and test Aethermoor without the UI. A `GameDriver` class wraps the engine, providing natural commands, raw key input, cheat/god-mode features, scenario shortcuts, and full state inspection. Usable from Vitest tests and as a standalone REPL.

## Core: `GameDriver` class

File: `src/lib/game/driver.ts`

```typescript
class GameDriver {
  state: GameState;              // Direct access for full state manipulation
  private messageIndex: number;  // Tracks read messages

  constructor(config?: Partial<CharacterConfig>)

  // --- Input ---
  key(k: string): this                // Raw key press
  keys(seq: string): this             // Multiple keys: keys('wwwd')
  command(cmd: string): this           // Natural: 'move north', 'attack east', 'talk'

  // --- Output ---
  newMessages(): GameMessage[]         // Messages since last check
  dialog(): ActiveDialogue | null      // Current dialog state
  dialogOptions(): string[]            // Available dialog choices
  log(): string                        // Formatted new messages as text

  // --- State inspection ---
  player: Entity                       // state.player shorthand
  enemies: Entity[]
  quests: QuestEntry[]
  inventory: InventorySlot[]
  pos: Position
}
```

Fluent API: `game.key('d').key('d').log()`

## Cheat / God-Mode Methods

```typescript
// Combat
godMode(): this                        // Player unkillable (maxHp = 99999, hp = 99999)
setStats(overrides: Partial<Entity>): this  // Set any player stat
killAll(): this                        // Kill all enemies on current map
spawnEnemy(name: string, x: number, y: number): this

// Progression
setLevel(n: number): this
completeQuest(questId: string): this
completeAllQuests(): this
graduateAcademy(): this
learnAllSpells(): this
learnAllRituals(): this
addRumor(rumorId: string): this

// Inventory
giveItem(itemId: string, count?: number): this
equipItem(itemId: string): this
clearInventory(): this
giveGold(amount: number): this

// Exploration
teleport(x: number, y: number): this
teleportToLocation(locationId: string): this
enterLocation(locationId: string): this

// NPC / Dialogue
setNpcMood(npcName: string, mood: NPCMood): this
```

All return `this` for chaining: `game.godMode().giveItem('sunstone').teleport(10, 5)`

## Command Parser

Maps natural commands → key sequences:

| Command | Keys |
|---------|------|
| `move north` / `go north` / `north` / `n` | `w` |
| `move south` / `south` / `s` | `s` |
| `move east` / `east` / `e` | `d` |
| `move west` / `west` / `w` | `a` |
| `attack north` | `w` (into enemy) |
| `wait` | `.` |
| `talk` | opens dialog if adjacent NPC |
| `dialog 1` / `choose 1` | `1` (dialog option) |
| `cast <spell>` | appropriate cast key sequence |
| `use <item>` | open inventory + select |
| `rest` | `r` |
| `defend` | `b` |
| `look` | print surroundings info |
| `status` | print player stats |
| `inventory` / `inv` | print inventory |
| `quests` | print quest log |
| `map` | print current location info |

Unknown commands print help.

## REPL Script

File: `src/lib/game/repl.ts`

Runnable via `npx tsx src/lib/game/repl.ts` (or npm script `npm run repl`).

- Uses Node `readline` for input
- Creates a `GameDriver` instance
- Accepts both raw keys and natural commands
- Prefixes cheats with `/`: `/godmode`, `/give sunstone`, `/teleport 10 5`, `/killall`
- Prints new messages after each command
- `/help` lists all commands

## Test Utility

File: `src/lib/game/driver.test.ts` — tests for the driver itself.

Usage from any test file:
```typescript
import { GameDriver } from './driver';

it('player can complete a quest via dialogue', () => {
  const game = new GameDriver({ characterClass: 'warrior' });
  game.godMode().teleportToLocation('eldergrove');
  game.command('move east').command('move east').command('talk');
  expect(game.dialog()?.npcName).toBe('Elder Miravel');
  game.command('choose 1');
  expect(game.log()).toContain('quest');
});
```

## File Structure

```
src/lib/game/
  driver.ts          # GameDriver class + cheat methods
  driver-commands.ts # Command parser (natural → keys)
  repl.ts            # Standalone REPL script
  driver.test.ts     # Tests for the driver
```

## Non-Goals

- No map/ASCII rendering in headless mode
- No save/load through the driver (use state directly)
- No network/multiplayer considerations
