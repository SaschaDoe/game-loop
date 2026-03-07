# Melee Attacks

As a player, I want to perform melee attacks with equipped weapons, so that I can deal damage to adjacent enemies using swords, axes, maces, and other close-range weapons.

## Details

- Melee attacks hit adjacent tiles (4-directional or 8-directional based on weapon)
- Damage calculated from: weapon base damage + Strength modifier + random roll
- Critical hits on high rolls (double damage, special message)
- Different weapon types have different properties:
  - Swords: balanced damage and speed
  - Axes: high damage, slower
  - Daggers: low damage, high crit chance
  - Maces: ignores partial armor
- Weapon durability degrades with use

## Acceptance Criteria

- [ ] Melee attacks only hit adjacent enemies
- [ ] Damage formula is correctly applied
- [ ] Critical hits trigger with appropriate probability
- [ ] Weapon properties differ meaningfully
