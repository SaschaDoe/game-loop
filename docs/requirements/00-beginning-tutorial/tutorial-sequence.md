# Tutorial Sequence

## Overview
Each starting location naturally teaches core game mechanics through contextual messages and NPC dialogue. There is no separate tutorial mode — the starting location IS the tutorial.

## User Stories

### Contextual Learning
- As a new player, I see a welcome message explaining basic movement when I start
- As a new player, I learn to interact by bumping into NPCs in village/tavern starts
- As a new player, I learn combat by fighting goblins in the cave start
- As a new player, I learn about stairs/descending by finding the dungeon entrance

### Difficulty Progression
- As a player choosing Easy (Village), I have a safe space to learn movement and interaction before combat
- As a player choosing Medium (Tavern), I get information about game mechanics from NPCs before entering the dungeon
- As a player choosing Hard (Cave), I'm thrown into combat immediately and learn by doing

### Starting Location as Level 0
- As a player, the starting location is level 0 before the dungeon
- As a player, descending stairs from the starting location takes me to dungeon level 1
- As a player, restarting after death returns me to my chosen starting location

## Acceptance Criteria
- [x] Each starting location has a contextual welcome message
- [x] NPC dialogue naturally teaches game mechanics
- [x] Starting location is level 0, dungeon begins at level 1
- [x] Restart returns to starting location
