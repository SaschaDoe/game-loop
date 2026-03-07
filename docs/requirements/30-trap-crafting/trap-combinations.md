# Trap Combinations

As a player, I want to combine multiple traps into chain reactions and complex setups, so that trap-building rewards creativity and planning.

## Details

- **Trigger Chains**: traps can be linked so one triggering activates the next:
  - Tripwire → triggers arrow trap behind the enemy (pincer attack)
  - Pressure plate → activates ceiling drop + pit trap (double hit)
  - Noise maker → lures enemy → into spike trap
  - Oil slick → enemy slips → into fire trap (massive fire AoE)
- **Elemental Combos**:
  - Water trap + Lightning trap = electrified area (AoE damage to all in water)
  - Oil trap + Fire trap = inferno corridor (blocks passage for 10 turns)
  - Ice trap + Spike trap = enemies slip into spikes (bonus damage)
  - Poison gas trap + Fire trap = explosion (one-time massive AoE)
- **Advanced Trap Builds**:
  - **Kill Box**: 4 traps surrounding a single tile — any enemy stepping on the center triggers all four
  - **Funnel**: noise maker lures enemies down a corridor lined with alternating traps
  - **Decoy Chest**: treasure chest + hidden bear trap — enemies and players trying to loot trigger the trap
  - **Escape Route**: traps set behind you as you flee, punishing pursuers
- **Trap Synergy Skill**: unlockable talent that increases chain reaction damage by 25% and allows linking traps up to 5 tiles apart
- **Blueprint System**: successful chain combos are recorded as blueprints; can be redeployed faster in future
- **Trap Limit**: maximum 8 active traps per dungeon floor (prevents infinite trap spam)
- Enemies with high Perception can detect and avoid traps; trap disguise skill reduces this chance

## Acceptance Criteria

- [ ] Trigger chains activate connected traps in sequence
- [ ] Elemental combos produce correct combined effects
- [ ] Advanced trap builds (kill box, funnel, etc.) function as described
- [ ] Blueprint system records and allows redeployment
- [ ] Trap limit is enforced per dungeon floor
