# Gravity Magic

As a player, I want access to gravity manipulation spells that alter weight and pull, so that combat and puzzle-solving have a physics-bending toolkit.

## Details

- **Gravity Spells**:
  - **Heavy** (Lv4): double a target's weight; -4 movement speed, -3 DEX, can't jump, sinks in water; 15 turns; Strength save halves duration
  - **Featherweight** (Lv4): halve a target's weight; +2 movement, immune to fall damage, blown by wind; can be cast on self for exploration
  - **Gravity Well** (Lv10): create a point of intense gravity at target location; all creatures within 4 tiles are pulled 1 tile toward center each turn; moving away costs double; lasts 8 turns
  - **Reverse Gravity** (Lv14): flip gravity in a 5x5 area; everything "falls" to the ceiling (3 tiles up = 3d6 damage on impact); when spell ends, they fall back down (more damage); 3 turn duration
  - **Gravity Crush** (Lv18): intensify gravity on a single target; 5x normal gravity; 8 damage per turn, target is prone (can't stand), armor is crushed (-2 armor permanently); concentration spell
  - **Orbit** (Lv12): chosen objects orbit around the caster at high speed; creates a defensive barrier (enemies hit for 3 damage when approaching) and ranged attack (launch an orbiting object)
  - **Singularity** (Lv25): ultimate gravity spell; create a mini black hole at target location; pulls all creatures toward it (3 tiles per turn), deals 10 damage per turn to anything adjacent; lasts 5 turns; everything caught at center takes 50 damage; friendly fire; enormous mana cost
- **Gravity Puzzles**: some dungeons have gravity-shifted rooms (walk on walls/ceiling); gravity switches that rotate the room; objects that float in zero-G zones
- **Weight-Based Interactions**: heavy spell on a bridge = bridge collapses; featherweight on a boulder = push it easily; gravity well + pit trap = instant environmental kill
- **Gravity Sickness**: NPCs and companions not used to gravity shifts get nauseous (-2 CON for 10 turns after being affected)

## Acceptance Criteria

- [ ] All gravity spells apply correct movement and damage effects
- [ ] Gravity puzzles in dungeons are solvable with gravity spells
- [ ] Weight-based environmental interactions function
- [ ] Singularity pulls creatures and deals correct AoE damage
- [ ] Gravity sickness applies to affected NPCs
