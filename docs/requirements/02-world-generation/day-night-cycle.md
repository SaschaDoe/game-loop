# Day-Night Cycle

As a player, I want the game world to cycle between day and night, so that time of day affects gameplay, NPC behavior, and monster spawns.

## Details

- Full cycle: dawn, morning, afternoon, dusk, evening, night, midnight
- Visual changes: map brightness/color palette shifts per time phase
- NPCs follow schedules (shops open during day, taverns busy at night)
- Certain monsters only appear at night; some are weaker during the day
- Torches and light sources become essential at night (limited visibility)
- Player can rest/sleep to skip time
- In-game clock displayed in HUD

## Acceptance Criteria

- [ ] Time advances with player actions (turn-based time progression)
- [ ] Visual rendering changes between day and night
- [ ] NPC schedules respond to time of day
- [ ] Night-specific monster spawns are active
