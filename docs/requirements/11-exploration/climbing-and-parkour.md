# Climbing and Parkour

As a player, I want to climb walls, leap across gaps, and traverse vertical terrain, so that exploration rewards agility and opens alternative paths.

## Details

- **Climbing**: certain walls marked with grip points (`) can be climbed; requires Dexterity check
  - Success: move up one tile per turn while climbing
  - Failure: fall, take damage based on height (1d6 per tile fallen)
  - Climbing gear (rope, pitons, grappling hook) reduces difficulty and prevents fatal falls
- **Leaping**: jump across 1-2 tile gaps; wider gaps require running start (must move 2 tiles before the gap)
  - Dexterity check; failure = fall into the gap (pit damage or lower level)
  - Boots of Leaping: +1 tile jump distance
- **Parkour Routes**: some areas have pre-designed parkour sequences (climb wall → leap to ledge → swing on rope → land on platform)
  - Completing a parkour route is faster than the normal path and often leads to hidden loot
  - Each step requires a Dexterity check; failing mid-route means falling to the nearest safe ground
- **Vertical Levels**: dungeons and cities can have multiple vertical layers; climbing connects them
- **Weight Penalty**: heavy armor reduces climbing/jumping success by 15-30%
- **Cat's Grace** spell: temporarily maximizes Dexterity for climbing/parkour sections
- NPCs comment on impressive parkour ("Did you just climb the bell tower?!")

## Acceptance Criteria

- [ ] Climbing works on marked surfaces with correct Dexterity checks
- [ ] Fall damage scales with height
- [ ] Leaping across gaps works with running start mechanic
- [ ] Parkour routes are completable and lead to hidden rewards
- [ ] Weight penalty affects climbing and jumping
