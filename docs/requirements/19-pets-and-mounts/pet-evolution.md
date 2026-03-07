# Pet Evolution

As a player, I want my tamed pets to evolve into stronger forms as they gain experience, so that long-term pet companionship is rewarded with powerful allies.

## Details

- **Evolution Stages**: Baby → Juvenile → Adult → Elder → Legendary (each takes progressively more XP)
- **Pet Types and Evolution Lines**:
  - Wolf Pup → Wolf → Dire Wolf → Shadow Wolf → Fenrir (spectral pack leader)
  - Cat Kitten → Cat → Panther → Displacer Beast → Phase Cat (teleports in combat)
  - Hawk Chick → Hawk → Eagle → Thunderbird → Storm Raptor (lightning attacks)
  - Fire Lizard → Salamander → Drake → Wyvern → Dragon (yes, a full dragon)
  - Slime → Gel Cube → Mimic Slime → Shapeshifter → Doppelganger (copies enemy forms)
- **Evolution Triggers**: XP threshold + a specific condition:
  - Wolf: hunt 20 enemies alongside owner
  - Cat: survive 10 stealth missions
  - Hawk: scout 50 unexplored map tiles
  - Fire Lizard: absorb fire damage 15 times
  - Slime: consume 30 different item types
- **Evolution Choice**: at Adult stage, some pets offer a branching evolution (e.g., Wolf → Dire Wolf OR Spirit Wolf) with different abilities
- **Evolved Abilities**: each stage unlocks new skills (AoE attacks, healing auras, elemental breath, mount capability at Adult+)
- **Pet Loyalty**: evolution requires high loyalty; neglected pets refuse to evolve and may eventually leave
- **Visual Progression**: pet's ASCII character changes at each stage (w → W → D for wolf line)

## Acceptance Criteria

- [ ] All evolution lines progress through correct stages
- [ ] Evolution triggers require correct conditions
- [ ] Branching evolutions offer meaningful choices
- [ ] Evolved abilities activate at correct stages
- [ ] Pet loyalty gates evolution correctly
