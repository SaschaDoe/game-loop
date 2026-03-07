# Foot Races

As a player, I want to compete in foot races through varied terrain with obstacles and hazards, so that DEX and movement speed matter outside of combat.

## Details

- **Race Types**:
  - **Sprint**: short distance (20 tiles); flat terrain; pure speed; DEX + movement speed determines winner
  - **Cross-Country**: medium distance (100 tiles); varied terrain (hills, streams, forest); stamina management matters; CON + DEX determines success
  - **Obstacle Course**: 50 tiles with obstacles every 5 tiles; hurdles (DEX save to clear), mud pits (STR to power through), balance beams (DEX check), walls (STR to climb); failed checks cost time
  - **Rooftop Chase**: city race across rooftops; jumping gaps (DEX), sliding under obstacles (DEX), choosing routes (INT for pathfinding bonus); fall = major time penalty + damage
  - **Endurance Marathon**: 500 tiles; stamina is king; CON primary stat; must manage food/water during the race; can walk to conserve stamina or sprint to gain ground
- **Race Mechanics**: turn-based race simulation; each turn, choose action (sprint, jog, walk, obstacle approach); sprint = fast but drains stamina; jog = moderate pace, sustainable; walk = slow but recovers stamina
- **Competitors**: 4-8 NPC racers with varied stats; some are fast but weak (sprint and fade), others are steady (consistent pace); rivals develop across multiple races
- **Betting**: spectators bet on racers; player can bet on themselves or others; odds reflect stats; upset victories pay big
- **Cheating**: use stealth to take shortcuts, cast spells (haste, slow on opponents), trip competitors; if caught by officials = disqualification + ban from venue; if uncaught = easy win
- **Season Circuit**: 5 race venues across the world; competing in all 5 qualifies for the Grand Championship; champion earns unique boots (permanent +2 movement speed)

## Acceptance Criteria

- [ ] All race types use correct stat checks and terrain mechanics
- [ ] Stamina management affects performance correctly
- [ ] NPC competitors have distinct racing strategies
- [ ] Cheating has appropriate detection risk and consequences
- [ ] Season circuit tracks venues visited and qualifies for championship
