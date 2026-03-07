# Weapon Special Effects

As a player, I want weapons to have unique special effects beyond base damage, so that finding a new weapon feels exciting and changes how I play.

## Details

- Special effects are tied to specific named weapons or random rare drops:
  - **Vampiric**: heal 20% of damage dealt
  - **Flaming**: adds fire damage, chance to ignite target
  - **Freezing**: adds ice damage, chance to slow target
  - **Thunderstrike**: every 5th hit triggers a lightning bolt on the target
  - **Vorpal**: 5% chance of instant kill on non-boss enemies
  - **Returning**: thrown weapons return to inventory after each throw
  - **Phasing**: attacks pass through armor (ignores defense stat)
  - **Berserker**: damage increases by 10% per consecutive hit on the same target, resets on miss
  - **Guardian**: wielder takes 15% less damage while this weapon is equipped
  - **Siphon**: restores 1 mana per hit
  - **Venomous**: applies poison DoT on hit
  - **Lunar**: damage doubles at night, halved during the day
  - **Mirrored**: reflects 25% of incoming ranged damage
  - **Hungry**: weapon grows +1 permanent base damage for every 100 kills (max +10)
- Effects are visible as particle-like ASCII effects during combat
- Rare weapons can have 2 effects simultaneously
- Legendary weapons have a unique named effect not found elsewhere

## Acceptance Criteria

- [ ] All weapon effects trigger correctly in combat
- [ ] Effect probabilities match described rates
- [ ] Dual-effect weapons apply both effects
- [ ] Visual indicators show active effects
