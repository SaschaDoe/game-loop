# Stealth Movement

As a player, I want to sneak past enemies undetected by crouching and staying in shadows, so that I can avoid combat and reach objectives through cunning instead of brute force.

## Details

- Toggle stealth mode with a hotkey (e.g., 'z')
- In stealth: movement speed halved, player symbol changes to a dimmer color
- Detection is based on: distance to enemy, line of sight, light level, player Dexterity, armor weight
- Noise system: heavy armor clanks, stepping on debris alerts nearby enemies
- Shadow tiles (near walls, unlit areas) reduce detection chance significantly
- Detection meter per enemy: fills as they become suspicious, triggers alert when full
- Alert states: unaware, suspicious (? symbol above), alert (! symbol, begins searching), combat
- Backstab: attacking from stealth deals 3x damage (Rogue class gets 5x)
- Pickpocketing: steal items from NPCs and enemies while in stealth

## Acceptance Criteria

- [ ] Stealth mode is togglable and visually distinct
- [ ] Detection scales with distance, light, and stats
- [ ] Enemy alert states transition correctly
- [ ] Backstab damage multiplier applies from stealth
