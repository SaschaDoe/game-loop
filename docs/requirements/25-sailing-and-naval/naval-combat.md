# Naval Combat

As a player, I want to engage in ship-to-ship combat with pirates and sea monsters, so that sailing has dangerous encounters and tactical ship battles.

## Details

- Naval combat triggers when encountering hostile ships or sea creatures on the ocean map
- Combat plays out on a zoomed-in water grid; both ships maneuver and fire
- Actions per turn: steer (change direction), fire cannons (broadside, range 3-8 tiles), ram, board, flee
- Boarding: transitions to melee combat on the enemy deck (standard combat system)
- Ship HP: hull integrity decreases with hits; at zero the ship sinks
- Crew management: crew members man cannons, repair hull, and fight during boarding
- Sea monsters: kraken tentacles attack from multiple tiles, leviathans ram the hull, sirens charm crew
- Loot from defeated ships: cargo, gold, maps to hidden locations
- Sinking: if your ship sinks, you wash up on the nearest shore with only equipped items

## Acceptance Criteria

- [ ] Naval combat grid renders correctly
- [ ] Ship maneuvering and cannon mechanics work
- [ ] Boarding transitions to standard combat
- [ ] Ship destruction results in appropriate consequences
