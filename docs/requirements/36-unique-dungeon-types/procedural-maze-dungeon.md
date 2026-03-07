# Procedural Maze Dungeon

As a player, I want some dungeons to be ever-shifting mazes that rearrange themselves, so that exploration requires adaptability and memorization is useless.

## Details

- **Maze Generation**: dungeon layout generated from world seed + dungeon ID; corridors, dead ends, loops, and one-way doors; standard maze algorithms (recursive backtracker, Prim's) with modifications for gameplay
- **Shifting Mechanics**: every 20 turns, portions of the maze rearrange; walls slide, corridors close, new paths open; player receives a rumbling warning 3 turns before a shift; being caught in a shifting wall deals damage and pushes to nearest open tile
- **Navigation Aids**:
  - Chalk/paint: mark walls to track where you've been; marks persist through shifts (the marked wall moves but remains marked)
  - Thread: lay a thread from the entrance; thread shows the path back; thread can be cut by enemies or shifting walls
  - Compass: always points toward the maze exit; doesn't show the path, just direction
  - Map spell: temporarily reveals a 10-tile radius of the maze; expensive mana cost
- **Maze Hazards**: trap corridors, minotaur patrols (stronger in maze terrain), dead-end ambushes, illusory walls (look solid but are passable), gravity shifts in vertical mazes
- **Maze Objectives**: reach the center (boss chamber), collect N keys scattered throughout (keys don't move during shifts), find all loot rooms before time limit, escort an NPC to the exit
- **Maze Difficulty**: Easy (shifts every 40 turns, few dead ends), Medium (shifts every 20 turns, moderate complexity), Hard (shifts every 10 turns, many dead ends, more hazards), Nightmare (shifts every 5 turns, invisible walls, no compass works)
- **Maze Reward**: completing the maze grants a unique "Maze Runner" bonus (permanent +1 to a navigation-related skill); the maze center contains high-value loot proportional to difficulty

## Acceptance Criteria

- [ ] Maze generates correctly from seed with proper connectivity
- [ ] Shifting mechanics rearrange the layout on schedule with warnings
- [ ] Navigation aids function correctly through maze shifts
- [ ] All hazard types trigger appropriately
- [ ] Difficulty levels produce correct shift timings and complexity
