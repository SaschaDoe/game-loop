# Racing

As a player, I want to compete in mounted and on-foot races across varied terrain, so that movement skills and mount training have a competitive outlet.

## Details

- **Race Types**:
  - **Foot Race**: sprint through a course with obstacles (jumps, climbs, narrow ledges); DEX-based; shortest time wins
  - **Mount Race**: horse/griffon/exotic mount races on a track; speed + handling + stamina management; can jostle opponents
  - **Obstacle Course**: combination of combat and parkour; defeat enemies AND navigate obstacles; timed
  - **Water Race**: swimming or boat race through coastal/river courses; currents affect speed; sea creatures as hazards
  - **Cross-Country**: long-distance overworld race between two towns; multiple routes (road is longer but faster, wilderness is shorter but dangerous); strategy in route choice
- **Race Mechanics**:
  - Stamina bar: sprinting costs stamina; depleted stamina = forced walk speed; manage burst vs sustained speed
  - Shortcuts: discoverable alternate paths that save time but have higher difficulty/risk
  - Hazards: other racers, environmental obstacles, random creatures on the course
  - Drafting: running behind another racer reduces stamina cost; break out at the right moment for a speed burst
  - Dirty Tactics: trip opponents (Dexterity contest), throw caltrops behind you, use smoke bombs; risk disqualification
- **Race Locations**: every major town has a racecourse; terrain matches the local biome (desert endurance race, mountain climb race, forest agility race)
- **Rewards**: gold, racing-specific gear (speed boots, lightweight armor, mount upgrades), titles ("Fastest in Ironhold")
- **Racing League**: seasonal ranking across all racecourses; top 3 at season end get legendary speed items
- **Betting**: spectators bet on racers; player can bet on themselves or others; odds based on racer stats

## Acceptance Criteria

- [ ] All race types function with correct mechanics
- [ ] Stamina management creates meaningful pacing decisions
- [ ] Shortcuts are discoverable and provide real advantage
- [ ] Dirty tactics carry risk of disqualification
- [ ] Racing league tracks seasonal rankings correctly
