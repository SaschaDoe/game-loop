# Special Abilities

As a player, I want each class to have unique special abilities with cooldowns, so that combat has dramatic moments beyond basic attacking.

## Details

- Each class gets 4-6 special abilities unlocked through leveling:
- **Warrior**: Battle Cry (buff allies, debuff enemies for 3 turns), Whirlwind (hit all adjacent enemies), Last Stand (temporary invincibility at low HP), Ground Slam (AoE stun)
- **Mage**: Teleport (blink 5 tiles), Time Stop (skip all enemy turns for 2 turns, high mana cost), Meteor (massive AoE, long cooldown), Mana Shield (absorb damage with mana)
- **Rogue**: Smoke Bomb (become invisible for 3 turns), Shadow Step (teleport behind an enemy), Poison Cloud (AoE DoT), Evasion (100% dodge for 2 turns)
- **Ranger**: Rain of Arrows (hit 3x3 area), Eagle Eye (double range for 3 turns), Trap Master (place 3 traps instantly), Beast Call (summon a temporary wolf ally)
- **Cleric**: Divine Shield (party-wide damage reduction), Resurrection (revive a dead companion), Smite (massive holy damage to undead), Sanctuary (create a safe zone enemies can't enter for 5 turns)
- **Bard**: Inspiring Song (party-wide stat buff), Lullaby (put enemies to sleep), Discordant Note (confusion AoE), Ballad of Haste (double party actions for 1 turn)
- Cooldowns: 10-50 turns depending on power
- Abilities have ASCII visual effects (expanding rings, flashing tiles)

## Acceptance Criteria

- [ ] All class abilities are implemented and functional
- [ ] Cooldowns track and enforce correctly
- [ ] Visual effects display during ability use
- [ ] Abilities scale with level and relevant stats
