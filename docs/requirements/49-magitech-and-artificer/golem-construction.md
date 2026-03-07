# Golem Construction

As a player, I want to construct golems from different materials to serve as powerful guardians, so that artificers can create their own boss-tier allies.

## Details

- **Golem Materials** (each creates a different golem with unique properties):
  - **Clay Golem**: cheapest; 50 HP, medium damage; regenerates 2 HP/turn; can reshape limbs (hammerfist, blade arm, shield); weak to fire (hardens, stops regen)
  - **Stone Golem**: durable; 80 HP, high damage; ground slam AoE; extremely slow (moves every 2 turns); immune to piercing; weak to blunt
  - **Iron Golem**: 70 HP, high damage; immune to all magic; poison breath (3x3 cone); magnetic field (pulls metal-armored enemies); weak to acid/rust
  - **Crystal Golem**: 40 HP; reflects 40% spell damage; prismatic beam attack; shatters on death (AoE damage to everyone nearby); weak to sonic
  - **Flesh Golem**: 60 HP; berserk at low HP (double damage, attacks randomly); absorbs lightning (heals); horrifies NPCs on sight; weak to fire/holy
  - **Mithril Golem**: legendary; 100 HP; fast (same speed as player); magic-resistant (50%); enchantable (can be given spell abilities); requires legendary materials + master artificer skill
- **Construction Process**:
  1. Gather materials (ore, clay, crystals, etc. — large quantities)
  2. Build body at an artificer workbench (10 turns per golem)
  3. Inscribe command runes (determines golem's orders: guard area, follow player, patrol path)
  4. Animate with an arcane core (consumable, found in Precursor ruins or crafted at high Artificer skill)
- **Golem Commands**: Guard (stationary, attacks anything hostile), Follow (combat companion), Patrol (walk a set path), Carry (use as pack mule, extra inventory)
- **Golem Limit**: 1 active golem at a time (2 at master Artificer); additional golems can be stored in standby
- **Golem Repair**: damaged golems must be repaired at a workbench with matching materials; 5 turns per 20 HP restored
- **Golem Upgrades**: add modules (spike fists, embedded weapon, runic plating, elemental core for breath weapon)
- NPCs react to golems with fascination or fear depending on the material type

## Acceptance Criteria

- [ ] All golem types construct with correct materials and stats
- [ ] Command rune system directs golem behavior correctly
- [ ] Golem limit is enforced with standby storage
- [ ] Repair and upgrade systems function at workbench
- [ ] NPC reactions vary by golem material
