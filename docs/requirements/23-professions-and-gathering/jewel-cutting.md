# Jewel Cutting

As a player, I want to cut raw gems into refined jewels with different cuts that affect their magical properties, so that gemcraft is a precision profession with meaningful choices.

## Details

- **Raw Gems**: mined from deposits, looted from enemies, found in chests; types: ruby, sapphire, emerald, diamond, amethyst, topaz, opal, onyx, moonstone, star sapphire; raw gems have no magical properties
- **Cutting Process**: requires jeweler's tools + magnifying lens; INT + Jewel Cutting skill check; takes 5 turns; failure cracks the gem (50% value, no magical property); critical failure shatters it (total loss)
- **Cut Types** (each cut unlocks at different skill levels):
  - **Rough Cut** (Novice): simple shape; +1 to a stat when socketed; cheapest
  - **Brilliant Cut** (Skilled): maximizes sparkle; +2 to CHA or associated stat; standard jewelry quality
  - **Cabochon** (Skilled): smooth dome; best for magical absorption; +10% to a spell school when socketed
  - **Marquise** (Expert): elongated point; enhances weapon damage; +3 damage when socketed in weapon
  - **Heart Cut** (Expert): heart-shaped; enhances healing; +15% healing when socketed in armor
  - **Star Cut** (Master): six-pointed star facets; creates a star effect in the gem; +2 to two stats when socketed
  - **Perfect Cut** (Grandmaster): flawless; doubles the gem's base magical property; extremely difficult (success only at max skill)
- **Gem Properties by Type**: ruby = fire/STR; sapphire = ice/WIS; emerald = nature/CON; diamond = light/all stats; amethyst = psychic/INT; topaz = lightning/DEX; opal = illusion/CHA; onyx = shadow/stealth; moonstone = divine/healing; star sapphire = arcane/mana
- **Socketing**: cut gems socket into equipment with gem slots; slotted gems can be removed (Jewel Cutting check, failure chance destroys the gem)
- **Gem Combining**: combine 3 gems of the same type and cut into 1 gem of the next tier (e.g., 3 rough rubies = 1 brilliant ruby); conservation of value but increased power density

## Acceptance Criteria

- [ ] All cut types produce correct stat bonuses when socketed
- [ ] Cutting skill checks determine success with correct failure outcomes
- [ ] Gem properties correctly correspond to gem types
- [ ] Socketing and removal work with correct risk mechanics
- [ ] Gem combining correctly upgrades tier from 3 same-type gems
