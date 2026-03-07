# Elemental Attunement

As a player, I want to attune my character to a specific element to gain permanent passive bonuses and unlock unique abilities, so that elemental identity shapes my build.

## Details

- **Attunement Options** (choose one; can change at elemental shrines for a heavy cost):
  - **Fire Attuned**: +15% fire damage, fire resistance 30%, immune to burning; passive: body warmth (immune to cold weather debuffs); hands glow orange
  - **Water Attuned**: +15% cold/water damage, water resistance 30%, breathe underwater; passive: swim at full speed; skin has blue sheen
  - **Earth Attuned**: +15% physical damage, +10% max HP, immune to knockback; passive: detect ores and minerals within 5 tiles; skin appears rocky
  - **Air Attuned**: +15% lightning damage, +20% movement speed, immune to falling damage; passive: always land on feet, feather fall; hair floats
  - **Shadow Attuned**: +15% necrotic damage, stealth +5, invisible in darkness; passive: see in the dark, reduced sanity drain; eyes glow purple
  - **Light Attuned**: +15% holy damage, healing spells +25%, undead flee on sight; passive: glow softly (built-in light source, 3 tiles); golden aura
- **Attunement Progression** (deepens over time with use):
  - Stage 1 (Base): passive bonuses listed above
  - Stage 2 (500 elemental actions): unlock an elemental active ability (fire: flame dash, water: tidal wave, earth: stone skin, air: gust jump, shadow: shadow step, light: radiant burst)
  - Stage 3 (2000 elemental actions): physical appearance changes permanently; elemental form available (transform for 10 turns into pure element — massive stat boost, immune to physical)
- **Attunement Conflicts**: fire attuned takes +50% cold damage; water takes +50% fire; earth takes +50% air; etc.
- **Elemental Zones**: areas with strong elemental energy boost attuned characters (+5 all stats when in your element's zone)
- **Multi-Element** (forbidden, hidden quest): attune to two elements simultaneously; extremely powerful but unstable (random elemental surges in combat)

## Acceptance Criteria

- [ ] All six attunement options provide correct bonuses
- [ ] Attunement progression stages unlock at correct thresholds
- [ ] Elemental vulnerability from attunement conflicts applies
- [ ] Elemental zones boost attuned characters
- [ ] Multi-element attunement is discoverable and unstable as described
