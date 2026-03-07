# Pressure Mechanics

As a player, I want ocean depth to create pressure challenges that limit how deep I can explore without proper equipment, so that deep-sea exploration requires preparation and progression.

## Details

- **Depth Zones**:
  - **Shallows (0-50 tiles deep)**: no pressure effects; full visibility; most coral and fish; safe zone
  - **Twilight Zone (51-150 tiles)**: dim light; pressure starts (-1 CON per 50 turns without protection); common underwater enemies; moderate resources
  - **Midnight Zone (151-300 tiles)**: complete darkness; significant pressure (-1 CON + -1 STR per 30 turns); bioluminescent creatures; rare resources; deep-sea predators
  - **Abyssal Zone (301-500 tiles)**: crushing pressure (-2 CON + -1 STR + -1 DEX per 20 turns); alien landscapes; ancient ruins; extremely rare materials; eldritch creatures
  - **Hadal Zone (501+ tiles)**: extreme pressure (-3 all physical stats per 10 turns); the deepest trenches; Precursor underwater facilities; legendary loot; the Leviathan's domain
- **Pressure Protection**:
  - **Bubble Helm**: basic; protects to Twilight Zone; crafted from glass + enchantment
  - **Diving Suit**: moderate; protects to Midnight Zone; crafted from treated leather + coral reinforcement
  - **Pressure Shell**: advanced; protects to Abyssal Zone; crafted from deep-sea creature shells + Precursor alloy
  - **Abyssal Ward**: magical protection; full pressure immunity; requires high-level enchanting; or found as rare loot from deep-sea bosses
  - **Merfolk Blessing**: granted by merfolk allies; natural pressure adaptation; protects to any depth but expires after 500 turns
- **Pressure Damage**: if protection is insufficient, stat drain accumulates; at 0 CON from pressure, character implodes (instant death); returning to a safe depth reverses stat drain over time (10 turns per point)
- **Decompression**: ascending too quickly from deep zones causes "the bends" (rapid stat drain + damage); must ascend gradually (spend 10 turns per zone transition) or use decompression potions
- **Underwater Landmarks**: depth markers (glowing coral formations) indicate zone transitions; deep-sea waypoints allow fast travel between explored deep areas

## Acceptance Criteria

- [ ] All depth zones apply correct pressure penalties at correct rates
- [ ] Protection equipment correctly negates pressure for appropriate zones
- [ ] Stat drain accumulates and reverses at correct rates
- [ ] Decompression sickness triggers on rapid ascent
- [ ] Depth markers clearly indicate zone boundaries
