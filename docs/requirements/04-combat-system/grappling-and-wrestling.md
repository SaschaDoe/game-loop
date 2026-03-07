# Grappling and Wrestling

As a player, I want to grapple enemies to control their movement and pin them, so that Strength-based characters have a non-weapon combat option.

## Details

- **Grapple Initiation**: melee range, Strength vs target's Strength or Dexterity (target chooses); must have one hand free
- **Grapple States**:
  - **Grabbed**: target can't move away but can still attack and cast; grappler can't move without dragging; contested check each turn to maintain
  - **Restrained**: after 2 turns grabbed, upgrade to restrained; target has -4 to attacks and -2 DEX; can't cast somatic spells
  - **Pinned**: after 2 turns restrained, target is pinned; can't take any actions except try to escape; grappler can't take other actions either
- **Grapple Actions** (while grappling):
  - **Throw**: hurl grabbed enemy up to 3 tiles; deals falling damage + stun; requires Strength check
  - **Slam**: smash grabbed enemy into the ground or a wall; damage based on Strength; if near a hazard, slam into it
  - **Choke**: restrained+ enemies can be choked; 3 damage per turn, Constitution save or pass out (non-lethal KO)
  - **Disarm**: take an item from a grabbed enemy's hands; Strength check; item drops or transfers to your inventory
  - **Body Shield**: use a grabbed enemy as cover against ranged attacks; ranged attacks hit the grabbed enemy instead
- **Escape**: contested check each turn; smaller creatures get a bonus; slippery enemies (oiled, greased) get +5; allies can attack the grappler to force release
- **Size Matters**: can only grapple creatures of your size or one size larger; larger creatures require higher Strength; can automatically grapple much smaller creatures
- **Wrestling Skill**: unlockable talent tree; improves grapple checks, unlocks throws and submissions, adds combo grapple moves
- **Environmental Grappling**: grapple near a ledge to throw enemies off; grapple near fire to slam into flames; grapple near water to drown

## Acceptance Criteria

- [ ] Grapple initiation uses correct contested checks
- [ ] State progression (grabbed → restrained → pinned) works with timing
- [ ] All grapple actions (throw, slam, choke, disarm, body shield) function
- [ ] Escape mechanics use correct modifiers
- [ ] Environmental grappling interacts with terrain hazards
