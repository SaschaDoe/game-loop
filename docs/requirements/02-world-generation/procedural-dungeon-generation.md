# Procedural Dungeon Generation

As a player, I want each dungeon level to be procedurally generated, so that every playthrough feels fresh and unpredictable.

## Details

- Generate rooms of varying sizes connected by corridors
- Support different room shapes (rectangular, circular, L-shaped)
- Ensure all rooms are reachable (no disconnected areas)
- Increase complexity (more rooms, longer corridors, dead ends) as dungeon level increases
- Place doors between rooms and corridors
- Support themed dungeon types (cave, crypt, sewer, fortress)
- Use a configurable seed for reproducible generation

## Acceptance Criteria

- [ ] Dungeons are different each playthrough (unless same seed)
- [ ] All rooms are reachable from the spawn point
- [ ] Dungeon complexity scales with level
- [ ] Multiple dungeon themes render with distinct tile sets
