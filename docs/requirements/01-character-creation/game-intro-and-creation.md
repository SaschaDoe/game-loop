# Game Introduction & Character Creation

## Overview
When starting a new game, the player experiences a brief narrative introduction followed by a short character creation process before entering the dungeon.

## User Stories

### Intro Sequence
- As a player, I see a brief intro sequence when starting a new game
- As a player, I meet a mysterious hooded figure who speaks to me at the dungeon entrance
- As a player, I advance through dialogue by pressing Space/Enter or tapping the screen
- As a player, the intro is short (4 screens) so I can get into gameplay quickly

### Character Creation
- As a player, I can enter a name for my character (or keep the default "Hero")
- As a player, I choose one of three classes: Warrior, Mage, or Rogue
- As a player, I see a brief description of each class and their stat bonuses
- As a player, my class choice affects my starting HP, attack, and sight radius

### Class Definitions
- **Warrior**: +4 HP, +1 ATK, -1 sight radius (a sturdy fighter with high endurance)
- **Mage**: -2 HP, -1 ATK, +3 sight radius (a scholar who sees far into the darkness)
- **Rogue**: +0 HP, +1 ATK, +1 sight radius (a nimble adventurer with keen senses)

## Acceptance Criteria
- [x] New game shows intro dialogue before dungeon generation
- [x] Player can advance dialogue with Space, Enter, or screen tap
- [x] Character creation allows name input and class selection
- [x] Selected class modifies starting stats appropriately
- [x] Character name and class persist when descending to new dungeon levels
- [x] Pressing R on game over restarts with the same character config
- [x] Default name is "Hero" if none entered

## Implementation Notes
- `CharacterClass` and `CharacterConfig` types in `types.ts`
- `CLASS_BONUSES` in `engine.ts` defines stat modifiers per class
- `createGame(config?)` accepts optional config, defaults to Warrior/Hero
- Game phase managed in UI layer (`+page.svelte`), not in GameState
