# Map Drawing

As a player, I want to draw and annotate my own maps as I explore, so that cartography is both a useful tool and a satisfying profession.

## Details

- **Map Tools**: parchment (consumable, holds one map) + quill (reusable); better parchment = more detail; magical ink = maps update automatically
- **Drawing Mechanics**:
  - As the player explores, visited tiles can be recorded on parchment
  - Manual annotation: add custom symbols for points of interest, danger zones, resource locations, NPC positions
  - Auto-map option: automatically records tiles as explored (requires magical parchment or Cartography skill level 5+)
  - Color coding: mark areas by danger level, resource type, or personal categories
- **Map Types**:
  - **Local Map**: single dungeon or town; shows room layout, doors, traps (if detected), enemy positions (last known)
  - **Regional Map**: overworld area; shows terrain, roads, towns, dungeon entrances, points of interest
  - **World Map**: full overworld; unlocked areas fill in; trade routes, faction territories, weather patterns
  - **Treasure Map**: created from clues; mark the X based on riddle interpretations
- **Cartography Skill**:
  - Level 1-3: basic maps (rough, missing details)
  - Level 4-6: detailed maps (accurate proportions, hidden room indicators)
  - Level 7-9: master maps (auto-updating, trap locations, secret door hints, elevation markers)
  - Level 10: legendary cartographer (maps show NPC movement patterns, resource respawn timers, dynamic event predictions)
- **Map Trading**: sell copies of your maps to NPCs; NPC cartographers buy accurate maps for gold; other players (multiplayer) can trade maps
- **Map Accuracy**: maps drawn at low skill may have errors (wrong distances, missing rooms); Perception check when drawing
- **Antique Maps**: found in the world; drawn by historical NPCs; may be outdated (terrain has changed) but reveal historical dungeon layouts or long-lost locations
- **Map Board**: pin maps to a wall in player housing for a visual overview of your exploration progress

## Acceptance Criteria

- [ ] Map drawing records explored tiles on parchment
- [ ] Custom annotations are placeable and persistent
- [ ] Cartography skill improves map accuracy and detail
- [ ] Maps are tradable to NPCs for gold
- [ ] Antique maps reveal historical location information
