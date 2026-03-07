# Giant Enemies

As a player, I want to fight massive multi-tile enemies that require different tactics than normal-sized foes, so that scale creates unique combat encounters.

## Details

- **Giant Types**:
  - **Hill Giant** (2x2 tiles): dumb, strong; boulder throw (ranged AoE), ground slam (adjacent AoE), picks up and throws smaller enemies; slow, predictable patterns
  - **Frost Giant** (2x2): ice magic, freezing breath (cone), ice armor (regenerates if not broken by fire); found in tundra/mountains
  - **Fire Giant** (2x2): blacksmith, forges weapons mid-combat (improving damage each turn), fire aura (melee attackers take fire damage), throws molten metal
  - **Storm Giant** (3x3): boss-tier; lightning bolt (long line AoE), thunder clap (stun all in 8-tile radius), flight, storm cloud aura (random lightning each turn); can be reasoned with (LLM dialogue)
  - **Titan** (4x4): endgame boss; so large that combat takes place ON the titan (climb its body, attack weak points while it tries to shake you off); earthquake every 3 turns
  - **Cyclops** (2x2): one eye (vulnerable spot — ranged crit for 3x damage if targeted); throws sheep/rocks, club swing (knockback 4 tiles), limited depth perception (-3 ranged accuracy)
- **Multi-Tile Combat Mechanics**:
  - Giant occupies multiple tiles; all occupied tiles are valid attack targets
  - Directional attacks: hitting from behind deals bonus damage (flanking); front attacks may be blocked
  - Body parts: some giants have targetable body parts (legs = slow/topple, arms = reduce damage, head = stun/kill)
  - Topple: dealing enough damage to legs causes the giant to fall prone; 2 turns of free attacks; deals AoE damage to adjacent tiles when falling
- **Environmental Destruction**: giants destroy terrain they walk through (walls, furniture, trees); creates new paths but also destroys cover
- **Giant Loot**: oversized weapons (usable as 2-handed by player, massive damage), giant hide (armor crafting), giant bones (siege weapon construction)
- **Giant Intelligence**: Hill Giants are dumb (exploitable), Storm Giants are genius (negotiate, deceive, challenge to puzzles)

## Acceptance Criteria

- [ ] All giant types occupy correct tile sizes and have unique abilities
- [ ] Multi-tile targeting allows attacking from different positions
- [ ] Body part targeting provides tactical advantages
- [ ] Topple mechanic triggers correctly from leg damage
- [ ] Giants destroy terrain when moving through it
