# Telekinesis

As a player, I want to move objects and enemies with my mind, so that psychic powers offer a unique non-magical combat and puzzle-solving toolkit.

## Details

- **Telekinesis Abilities** (unlocked through Psychic skill tree):
  - **TK Push** (Lv1): push an object or enemy 1-3 tiles away; damage if they hit a wall (impact damage scales with distance); costs psi points
  - **TK Pull** (Lv3): pull an object or enemy toward you; grab items at range (up to 8 tiles); pull enemies into traps or melee range
  - **TK Lift** (Lv6): levitate an object or small enemy off the ground for 3 turns; lifted targets can't move, melee attacks miss them; drop for fall damage
  - **TK Throw** (Lv10): grab any loose object (barrel, rock, weapon, body) and hurl it at a target; damage scales with object weight; heavy objects need higher skill
  - **TK Crush** (Lv15): compress force around a target; 2 turns to charge, massive damage; target can flee during charge; costs heavy psi points
  - **TK Shield** (Lv8): create a barrier of force; blocks all projectiles from one direction for 5 turns; can be moved each turn
  - **TK Flight** (Lv20): levitate yourself; fly over terrain, gaps, and traps; 10 turns duration; heavy psi cost
- **Psi Points**: separate resource pool from mana; regenerates slowly (1 per 5 turns) or via meditation (skip a turn to regain 5)
- **Environmental TK**: move puzzle blocks, bridge gaps with levitated platforms, clear debris, activate distant switches
- **Combat TK Combos**: TK Pull enemy → melee attack → TK Push into wall = massive damage combo
- **TK vs Enemies**: some enemies resist TK (heavy creatures, anchored enemies, anti-psi zones); bosses can only be pushed 1 tile
- **Psi Overload**: using TK when psi points are depleted drains HP instead; at 0 HP and 0 psi, the character collapses (stunned 3 turns)

## Acceptance Criteria

- [ ] All TK abilities move objects/enemies at correct ranges and damage values
- [ ] Psi point resource pool tracks and regenerates correctly
- [ ] Environmental puzzle solving with TK functions
- [ ] Combat combos work with TK abilities
- [ ] Resistance and overload mechanics function correctly
