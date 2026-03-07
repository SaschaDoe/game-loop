# Wanted and Bounty System

As a player, I want criminal actions to put a bounty on my head that escalates with severity, so that being an outlaw has real consequences and creates emergent gameplay.

## Details

- Criminal actions: stealing, attacking NPCs, murder, trespassing, breaking out of jail
- Bounty levels: Petty Criminal (50g), Wanted (200g), Notorious (500g), Most Wanted (2000g)
- Consequences per level:
  - Petty: guards give warnings, merchants charge extra
  - Wanted: guards attack on sight in that town, bounty hunters spawn occasionally
  - Notorious: bounty hunters pursue you across towns, faction reputation tanks
  - Most Wanted: elite hunters (mini-boss level), no town is safe, wanted posters appear on walls
- Clearing bounty: pay at a guard station, serve jail time (skip turns), do community service quests
- Bounty is per-town: committing crimes in one town doesn't affect another (unless news spreads)
- Thieves Guild can forge "clean papers" to reset bounty (expensive, one-time)
- Jail: if caught, locked in a cell for X turns; can attempt escape (stealth/lockpick) or serve time

## Acceptance Criteria

- [ ] Criminal actions generate appropriate bounty levels
- [ ] Guard and bounty hunter behavior escalates with bounty
- [ ] Bounty clearing methods all function
- [ ] Bounty is tracked per-town with news spreading over time
