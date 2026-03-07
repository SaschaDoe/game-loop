# Environmental Hazards

As a player, I want dungeons and the overworld to contain environmental hazards, so that navigation itself is a challenge and I can use the environment tactically.

## Details

- Hazard types:
  - **Lava pools**: deal fire damage each turn standing in them
  - **Poison gas**: clouds that deal poison damage and reduce visibility
  - **Spike traps**: triggered by stepping on them, deal piercing damage
  - **Pit traps**: hidden holes that drop the player to a lower level
  - **Collapsing floors**: crumble after being stepped on, becoming impassable
  - **Electric tiles**: deal shock damage periodically
  - **Quicksand**: slows movement, eventually kills if stuck too long
- Hazards can affect both players and monsters
- Luring enemies into hazards is a valid tactic
- Some hazards are visible; others require Perception checks to spot

## Acceptance Criteria

- [ ] All hazard types deal appropriate damage/effects
- [ ] Hazards affect monsters and players equally
- [ ] Hidden hazards can be detected with Perception
- [ ] Tactical use of hazards against enemies is possible
