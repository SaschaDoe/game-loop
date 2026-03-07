# Combo Attacks

As a player, I want to chain attacks into combos by performing specific sequences, so that skilled play is rewarded with bonus damage and flashy effects.

## Details

- Combos triggered by: attacking the same target on consecutive turns with specific weapon types
- Combo examples:
  - **Flurry** (dagger, dagger, dagger): 3 quick hits in one turn, reduced damage each but total exceeds single hit
  - **Cleave** (sword + move + sword): hit enemy, reposition, hit again — AoE damage to adjacent enemies
  - **Shieldbreaker** (mace, mace): two heavy hits, ignores 50% of target's armor
  - **Pin and Strike** (bow then melee): ranged shot slows enemy, follow-up melee crits automatically
  - **Arcane Blade** (spell + melee): enchants weapon with element for extra damage on next hit
- Combo meter displayed during combat; resets if player takes damage or switches targets
- Higher-level combos require specific skill investments
- Companion combos: synergy attacks with a companion (e.g., companion stuns, you backstab)
- **Magic Combos**:
  - **Inferno** (fire, fire, fire): massive AoE fire burst, creates burning terrain for 3 turns
  - **Shatter Storm** (ice, ice, lightning): freeze target then shatter for 4x damage
  - **Paladin's Judgment** (heal, shield, smite): heal self, block next attack, deal holy damage
- **Mixed Combos** (melee + magic):
  - **Flame Blade** (slash + fire): imbue weapon with fire for next 3 melee attacks
  - **Frozen Shatter** (ice + bash): freeze then smash for bonus physical + cold damage
- Combo discovery: some combos are taught by trainers, others are found by experimentation (reward: "Innovator" XP bonus)
- Enemy combos: enemies can also perform combos, telegraphed by colored tile indicators so the player can interrupt the chain

## Acceptance Criteria

- [ ] Combo sequences are detected and trigger correctly
- [ ] Bonus damage applies as described
- [ ] Combo meter displays and resets appropriately
- [ ] Companion combos activate with correct positioning
