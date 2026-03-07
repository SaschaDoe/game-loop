# Environmental Combat

As a player, I want to use the environment as a weapon during combat, so that positioning and surroundings matter tactically.

## Details

- Push enemies into hazards: kick into lava, push off ledges, shove into spike traps
- Destroy pillars to collapse ceiling on enemies (area denial, damage)
- Ignite oil puddles with fire spells for area burn damage
- Freeze water tiles to create slippery surfaces (enemies slide and lose turns)
- Knock trees/boulders onto enemies for crushing damage
- Use narrow corridors as chokepoints (only one enemy can attack at a time)
- Break bridges while enemies cross
- Lure enemies into monster territories (let them fight each other)
- Strength check required for heavy environment interactions
- **Destructible Objects**:
  - Explosive barrels (red *): detonate when hit, chain reaction if adjacent to other barrels
  - Oil barrels: create slippery/flammable terrain patch
  - Chandeliers: cut the rope to drop on enemies below (heavy damage + pin)
  - Cracked walls: break through for new paths or to crush enemies behind them
- **Elevation**: higher ground gives +2 ranged accuracy, -2 to incoming ranged; knockback from height deals fall damage
- **Cover system**: objects provide 50% ranged damage reduction; full cover blocks line of sight
- Environmental kills grant bonus XP ("Creativity" bonus displayed in combat log)
- Enemies use environmental tactics too — avoid standing near ledges against strong enemies

## Acceptance Criteria

- [ ] Push mechanics move enemies into hazard tiles
- [ ] Destructible environment elements deal damage
- [ ] Elemental environment interactions (fire+oil, ice+water) work
- [ ] Chokepoint positioning provides tactical advantage
