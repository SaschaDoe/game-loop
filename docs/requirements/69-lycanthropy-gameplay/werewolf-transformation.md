# Werewolf Transformation

As a player, I want lycanthropy to feature involuntary and voluntary transformations with distinct beast-form abilities and social consequences, so that being a werewolf is a complex gameplay experience.

## Details

- **Infection**: bitten by a werewolf (30% chance per bite); first transformation occurs on the next full moon (every 200 turns); can be cured within 72 hours with wolfsbane potion
- **Involuntary Transformation**: on full moon nights, player transforms regardless of intent; lasts the entire night (20 turns); during involuntary transformation, player has reduced control (auto-attacks nearby creatures, may attack friendly NPCs); memory is hazy afterward (LLM describes what happened from fragments)
- **Voluntary Transformation**: after surviving 3 full moon transformations, gain ability to shift at will; voluntary transformations last 15 turns; full player control; costs stamina (can't transform while exhausted)
- **Wolf Form Abilities**:
  - +5 STR, +3 DEX, +3 CON, -4 INT, -3 CHA (beast mind)
  - Bite attack: heavy damage + bleed; chance to infect humanoid targets with lycanthropy
  - Claw swipe: fast attack, lower damage, hits adjacent tiles
  - Howl: AoE fear (WIS save) + summon nearby wolves as allies (2-4 wolves)
  - Scent tracking: follow any creature's trail by scent; reveals hidden enemies within 10 tiles
  - Regeneration: heal 2 HP per turn while in wolf form
  - Sprint: triple movement speed for 3 turns; cooldown 10 turns
- **Weaknesses**: silver weapons deal 2x damage; wolfsbane causes nausea and stat drain in proximity; fire deals 1.5x damage; hunters with silver specifically target werewolves
- **Moon Phases**: new moon = weakest (no transformation possible, -1 STR); waxing = growing power; full moon = forced transformation + maximum power; waning = decreasing
- **Social Impact**: if anyone witnesses your transformation, word spreads; NPCs fear you; some attack on sight; werewolf hunters pursue you; but lycanthrope-friendly factions welcome you
- **Pack Mechanics**: find other werewolves; join a pack; pack grants bonuses (shared XP, coordinated hunts, territory); become pack alpha through combat challenge (leadership of NPC werewolves)
- **Cure**: advanced cure requires: wolfsbane flower + silver dust + holy water + ritual under a blood moon; administered by a master alchemist or priest; permanent cure removes all wolf abilities and weaknesses

## Acceptance Criteria

- [ ] Involuntary transformation triggers on full moon with reduced control
- [ ] Voluntary transformation unlocks after 3 moon cycles
- [ ] Wolf form abilities apply correct stat changes and combat moves
- [ ] Silver and wolfsbane weaknesses apply correct damage multipliers
- [ ] Pack mechanics track membership and alpha challenges
