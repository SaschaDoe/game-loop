# Psi Points System

As a player, I want a dedicated psi point resource pool for psychic abilities with unique regeneration and management mechanics, so that psychic characters have a distinct resource economy.

## Details

- **Psi Pool**: separate from mana; max psi points = (INT + WIS) x 2; starts full on rest; does NOT regenerate passively (unlike mana); must be actively recovered
- **Psi Recovery Methods**:
  - **Meditation**: spend 5 turns meditating; recover 25% of max psi; can't be interrupted or psi is lost; can meditate during combat (risky — any damage cancels it)
  - **Psychic Drain**: drain psi from a willing or helpless creature; recovers psi equal to target's INT score; morally questionable on unwilling targets; killing via drain = 100% psi recovery
  - **Psi Crystals**: consumable items that restore 10-30 psi; found in psychic-sensitive locations (ley line intersections, crystal caves, psychic creature nests); can be crafted from raw crystals + mental focus
  - **Emotional Absorption**: in social situations, absorb ambient emotional energy; crowds restore psi slowly (+1 per turn in a populated area); intense emotions (combat, argument, romance scene) restore faster (+3 per turn)
  - **Sleep Recovery**: full rest recovers 100% psi; partial rest (interrupted) recovers 50%
- **Psi Expenditure**: different powers cost different psi amounts:
  - Minor powers (telepathic ping, minor telekinesis): 2-5 psi
  - Standard powers (mind read, force push, precognitive dodge): 8-15 psi
  - Major powers (dominate mind, psychic blast, temporal vision): 20-35 psi
  - Ultimate powers (mass mind control, psychic storm, reality bend): 50+ psi
- **Overcharge**: spend HP as psi when pool is empty (2 HP per 1 psi); causes nosebleeds, headaches, and eventually brain damage (-1 INT permanently per 20 HP spent this way); emergency measure only
- **Psi Efficiency**: INT modifier reduces psi costs; WIS modifier increases psi recovery; high-level psychics can sustain powers longer and recover faster
- **Anti-Psi Zones**: certain areas block psi recovery and increase costs (lead-lined rooms, psi-dampening fields, near anti-psychic creatures); forces resource conservation

## Acceptance Criteria

- [ ] Psi pool calculates correctly from INT and WIS
- [ ] All recovery methods restore correct amounts under correct conditions
- [ ] Power costs scale correctly by tier
- [ ] Overcharge converts HP to psi with correct penalties
- [ ] Anti-psi zones apply correct modifiers
