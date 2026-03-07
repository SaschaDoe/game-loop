# Fog of War

As a player, I want unexplored areas to be hidden and previously visited areas to be dimmed, so that exploration feels like genuine discovery and I can track where I've been.

## Details

- Three visibility states: unexplored (completely hidden), explored (dimmed, shows layout but not entities), visible (fully lit within sight range)
- Sight range is a circle around the player (default radius 8 tiles)
- Sight range affected by: light sources, time of day, weather, spells, racial traits (darkvision)
- Walls block line of sight (shadow casting algorithm)
- Torches and lanterns extend sight range in dark areas
- Explored tiles remember layout but not current monster positions

## Acceptance Criteria

- [ ] Unexplored tiles are completely hidden
- [ ] Explored tiles show terrain but not entities
- [ ] Sight range calculates correctly with modifiers
- [ ] Line of sight is blocked by walls
