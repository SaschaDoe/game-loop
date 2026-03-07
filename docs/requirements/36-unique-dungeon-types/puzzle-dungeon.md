# Puzzle Dungeon

As a player, I want to encounter dungeons that are entirely puzzle-focused with minimal combat, so that exploration offers intellectual challenges alongside physical ones.

## Details

- Puzzle dungeons have rooms connected by locked mechanisms rather than monsters
- Puzzle types:
  - **Sequence puzzles**: activate switches in the correct order (clues on walls)
  - **Mirror puzzles**: redirect beams of light using rotatable mirrors to hit a target
  - **Tile puzzles**: step on floor tiles in a pattern (wrong step resets or triggers traps)
  - **Weight puzzles**: place items of specific weights on pressure plates
  - **Musical puzzles**: play notes on instruments in the correct order (bards get hints)
  - **Translation puzzles**: decode ancient inscriptions using lore knowledge
  - **Perspective puzzles**: the map only makes sense when viewed from a specific position
- Each room has a theme and difficulty progression
- Optional combat: puzzle guardians that test both brain and brawn
- Time challenge: optional timer for bonus loot (solve all rooms in X turns)
- Intelligence and Wisdom stats provide subtle environmental hints

## Acceptance Criteria

- [ ] All puzzle types are implemented with clear mechanics
- [ ] Puzzles are solvable without external guides
- [ ] Stat-based hints assist without giving away solutions
- [ ] Timed challenge tracks completion speed
