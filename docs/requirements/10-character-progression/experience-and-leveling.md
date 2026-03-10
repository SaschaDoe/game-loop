# Experience and Leveling

As a player, I want to earn experience points from combat, quests, and exploration, so that I unlock talent points to expand my abilities.

## Details

- XP gained from: killing monsters, completing quests, discovering locations, solving puzzles
- Level-up thresholds increase with each level (exponential curve: `25 × 1.5^(level-1)`)
- On level-up: **+1 talent point only**. No stat increases. No attribute changes.
- Talent points are spent on: passive skills (class tree), spells (from mentors/books), rituals (from mentors/books)
- Stats (STR/INT/WIL/AGI/VIT) are fixed at character creation and only change through artifacts, enchantments, and environmental effects
- Derived stats (maxHp, maxMana, attack, etc.) are purely attribute-based — they do not scale with level
- Level-up notification: "Level up! Level X. +1 Talent Point."
- XP bar displayed in the HUD
- Level cap of 50 with endgame content balanced for max level

## Acceptance Criteria

- [ ] XP is awarded from all valid sources
- [ ] Level-up occurs at the correct thresholds
- [ ] Only +1 talent point is granted on level-up (no stat changes)
- [ ] No attributes (STR/INT/WIL/AGI/VIT) change on level-up
- [ ] XP bar and level display correctly in HUD
