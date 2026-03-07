# Dual Wielding

As a player, I want to wield two weapons simultaneously for aggressive combat, so that offense-focused builds have a distinct fighting style.

## Details

- **Dual Wield Rules**:
  - Main hand attacks at full damage; off-hand attacks at 60% damage (increased with skill)
  - Both weapons attack each turn (two hits per turn); total DPS higher than two-handing but less damage per single hit
  - Cannot use a shield while dual wielding; defense comes from offense (kill before being killed)
  - Only light/medium weapons can be dual wielded (daggers, shortswords, axes, maces); no two-handed weapons
- **Dual Wield Combinations**:
  - **Matched Pair** (same weapon type): +10% attack speed; synchronized strikes
  - **Mismatched** (different types): each weapon keeps its unique properties (e.g., dagger + mace = fast bleed + stun)
  - **Elemental Pair** (different elements): attacks alternate elements; chance for element combo effect (fire+ice = steam burst, poison+fire = toxic explosion)
- **Dual Wield Abilities** (Duelist talent tree):
  - **Whirlwind**: spin attack hitting all adjacent enemies with both weapons
  - **Double Strike**: focused attack on single target with both weapons simultaneously (combined damage + armor piercing)
  - **Parry Dance**: use both weapons defensively; block two attacks per turn instead of none; counterattack after each block
  - **Blade Fury**: 5-turn buff; attack 3 times per turn instead of 2; exhaustion after (-2 DEX for 5 turns)
  - **Final Gambit**: throw both weapons at a target simultaneously; if both hit, deal 4x combined damage; you're now unarmed
- **Off-hand Proficiency**: skill that increases off-hand damage (60% → 70% → 80% → 90% at max); reduces dual wield accuracy penalty
- **Ambidextrous Trait**: character creation option; off-hand starts at 80% damage; eliminates the need for off-hand proficiency investment
- Dual wielding has a unique attack animation: alternating left-right slash indicators in the combat log

## Acceptance Criteria

- [ ] Dual wield attacks calculate correct damage for each hand
- [ ] Weapon combinations apply correct bonuses (matched, mismatched, elemental)
- [ ] All dual wield abilities function with correct effects
- [ ] Off-hand proficiency scales damage correctly
- [ ] Ambidextrous trait provides listed benefit at character creation
