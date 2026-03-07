# Petrification

As a player, I want petrification to be a real threat from certain enemies that turns me to stone, requiring rescue or prevention, so that some encounters have stakes beyond just HP loss.

## Details

- Petrification sources: basilisk gaze, medusa gaze, cockatrice touch, cursed items, trap
- Mechanics: accumulative "stone" counter — 3 stacks = fully petrified
  - 1 stack: movement slowed (stone limbs), -2 DEX
  - 2 stacks: cannot attack, -5 DEX, -3 STR
  - 3 stacks: fully petrified — game over unless rescued
- Prevention: avert gaze action (fight blind but immune to gaze), mirror shield (reflect gaze back), stone-ward potion
- Rescue: companion uses a restoration potion on you, or NPC finds your statue and cures it (auto-trigger if you have a companion)
- Stacks decay naturally (1 per 20 turns) or instantly with a restoration potion
- Petrified enemies: player can petrify enemies with the right items/spells, creating permanent stone obstacles on the map
- Petrified NPC quest: find and cure petrified NPCs scattered in dungeons for rewards

## Acceptance Criteria

- [ ] Petrification stacks accumulate correctly
- [ ] Full petrification ends combat without standard death
- [ ] Prevention methods work against gaze attacks
- [ ] Companion rescue mechanic functions
