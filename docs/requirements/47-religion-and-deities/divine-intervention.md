# Divine Intervention

As a player, I want my deity to occasionally intervene in gameplay based on my devotion level, so that worship feels alive and impactful beyond just stat bonuses.

## Details

- **Intervention Triggers** (chance based on devotion level):
  - Near-death: deity may shield the player from a killing blow (10% chance at Tier 2, 25% at Tier 3, 50% at Tier 4)
  - Boss fights: deity grants a temporary buff at the start (damage boost, resistance, extra HP)
  - Moral choices: deity whispers guidance through the message feed ("Solaris urges mercy...")
  - Prayer: actively praying at a shrine can request specific help (heal, reveal map, smite an enemy) — chance of being answered scales with devotion
- **Intervention Types** (deity-specific):
  - Solaris: beam of light heals party and damages undead in area
  - Noctis: shadow cloak makes party invisible for 5 turns
  - Ferrum: spectral weapon appears and fights alongside player for 10 turns
  - Verdana: entangling roots immobilize all enemies for 3 turns
  - Mortis: slain enemies rise as temporary undead allies
  - Fortuna: all rolls become critical successes for 3 turns
  - Lexis: reveals all hidden objects, traps, and secret doors on the floor
  - Mercatus: doubles all gold found for 50 turns
- **Divine Wrath**: if devotion is negative (from sins), the deity may intervene against the player instead
  - Solaris: blindness in critical moments
  - Ferrum: weapon shatters mid-combat
  - Mortis: undead ignore other enemies and target only the player
- **Atheist Path**: choosing no deity avoids all intervention (positive and negative); unlocks unique "Self-Reliant" perks
- Interventions are rare enough to feel special — at most once every 100 turns even at max devotion

## Acceptance Criteria

- [ ] Interventions trigger at correct probability per devotion tier
- [ ] Each deity's intervention has unique effects
- [ ] Divine wrath triggers for sinful players
- [ ] Atheist path provides alternative benefits
- [ ] Intervention frequency is appropriately rare
