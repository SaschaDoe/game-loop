# Solitary Confinement

As a player, I want solitary confinement to be a punishing but unique gameplay phase with isolation mechanics and psychological effects, so that it's a meaningful consequence rather than just a time skip.

## Details

- **Solitary Triggers**: failed escape attempt, assaulting a guard, extreme rule violations, warden's punishment
- **Solitary Duration**: 20-100 turns depending on severity; no early release without exceptional circumstances
- **Isolation Mechanics**:
  - Tiny cell (3x3 tiles): bed, bucket, 4 walls; no other objects
  - No NPC interaction: no other inmates, guards only slide food through a slot
  - No inventory access: all items confiscated; returned on release
  - Minimal food: bread and water; hunger debuff accumulates
  - Complete silence: no ambient sound, no music, only your own message feed
- **Psychological Effects** (progressive):
  - Turns 1-20: boredom messages ("You count the cracks in the ceiling")
  - Turns 21-50: anxiety (-1 WIS), talking to yourself (message feed shows your character's inner monologue via LLM)
  - Turns 51-80: hallucinations (phantom NPCs appear in the cell, phantom sounds), -2 WIS, -1 CHA
  - Turns 81-100: severe (-3 WIS, -2 CHA, -1 INT); cell walls seem to move; paranoia messages; possible phobia development (claustrophobia)
- **Solitary Activities** (limited):
  - Exercise: do push-ups/sit-ups to maintain STR/DEX (prevents physical stat decay)
  - Meditation: spend turns meditating for chi/psi recovery and sanity preservation
  - Scratch messages: carve notes into the wall (persist for future playthroughs via legacy system)
  - Plan: mentally rehearse your next escape plan (+10% success to next escape attempt)
  - Pray: if deity worshipper, prayer has a small chance of divine intervention (early release, smuggled tool)
- **Release**: stat penalties recover over 50 turns after release; immediate -5 to guard reputation; +5 with inmates ("solitary survivor" respect)
- **Hidden Passage**: very rare (5% per solitary stint) — discover a loose stone in the wall leading to a hidden tunnel (escape route)

## Acceptance Criteria

- [ ] Solitary triggers from correct rule violations
- [ ] Psychological effects escalate with duration
- [ ] LLM generates inner monologue during isolation
- [ ] Solitary activities provide listed benefits
- [ ] Hidden passage discovery is rare but functional
