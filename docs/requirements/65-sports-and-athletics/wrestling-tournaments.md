# Wrestling Tournaments

As a player, I want to compete in wrestling matches using grappling mechanics separate from weapon combat, so that STR-focused characters have a dedicated competitive arena.

## Details

- **Wrestling Rules**: no weapons, no magic, no armor; pure body-to-body combat; win by pinning opponent (3-turn hold), knockout (HP to 0, non-lethal), or submission (target taps out from pain)
- **Wrestling Moves**:
  - **Grapple**: initiate a hold; STR vs STR contest; winner controls position
  - **Throw**: from grapple, hurl opponent; STR + DEX; deals moderate damage; opponent loses next turn (prone)
  - **Pin**: attempt to hold opponent's shoulders down; STR vs STR; if held for 3 consecutive turns, automatic win
  - **Submission Hold**: lock a joint or choke; STR + technique vs target's CON; increasing pain each turn; target can tap out or try to break free (STR check, increasing difficulty each turn)
  - **Counter**: when grappled, reverse the hold; DEX check; success turns the tables
  - **Dirty Trick**: eye gouge, groin strike, hair pull; effective but referee may catch it (50% chance = warning, 3 warnings = disqualification); some underground matches have no referee
- **Wrestling Styles**: choose a stance each match — Power (STR bonuses, slower), Technical (more moves available, balanced), Speed (DEX bonuses, harder to grapple), Brawler (more damage, less technique)
- **Tournament Structure**: single elimination, 8-16 competitors; 3 rounds per match (best of 3 pins/KOs); prize pool increases per round
- **Wrestling Reputation**: wins build wrestling fame; famous wrestlers get challenged in the street; unlock advanced moves from veteran grapplers; eventually invited to the legendary "Iron Cage" match (steel cage, no escape, last one standing)
- **Weight Classes**: light (small races), middle (medium races), heavy (large races); fighting outside your weight class allowed but opponent gets stat bonus

## Acceptance Criteria

- [ ] All wrestling moves resolve with correct stat contests
- [ ] Pin mechanic tracks consecutive hold turns correctly
- [ ] Dirty tricks have correct detection probability
- [ ] Tournament brackets advance correctly through elimination
- [ ] Weight class modifiers apply when mismatched
