# Oxygen and Breathing

As a player, I want underwater and toxic areas to require managing an oxygen supply, so that environmental hazards add urgency to exploration.

## Details

- **Breath Meter**: appears when submerged or in airless environments; default 30 seconds (scaled to turns)
- **Underwater**:
  - Breath drains 1 unit per turn while submerged
  - At 0 breath: drowning — 5 HP damage per turn, increasing to 10, then 20
  - Surface to refill instantly; air pockets in underwater caves refill partially
  - Swimming skill extends breath by 10 units; Constitution modifier adds 1 unit per point
- **Toxic Environments**:
  - Poison gas clouds: breath drains at 2x rate; gas also applies poison debuff if breathed
  - Volcanic areas: sulfur gas reduces breath; fire resistance gear doesn't help (it's suffocation not heat)
  - Void zones (dimensional): no atmosphere at all; breath drains at 3x rate
- **Breathing Equipment**:
  - Water Breathing Potion: breathe underwater for 100 turns
  - Gas Mask: immune to airborne poison, doubles breath in toxic areas; crafted from leather + charcoal filter
  - Gills Enchantment: permanent underwater breathing on a helmet
  - Air Bubble spell: create a breathable zone (3x3) for 20 turns
- **Companion Breathing**: companions also need to breathe; sharing a Water Breathing potion halves its duration
- **Strategic Depth**: some underwater treasures are placed deliberately beyond normal breath range; requires gear investment or creative problem-solving
- Breath meter uses a blue bar that turns red when critically low, with gasping sound effects

## Acceptance Criteria

- [ ] Breath meter appears and drains in correct environments
- [ ] Drowning damage escalates correctly at 0 breath
- [ ] All breathing equipment extends or eliminates breath drain
- [ ] Toxic environments apply both breath drain and poison
- [ ] Companions' breath is tracked independently
