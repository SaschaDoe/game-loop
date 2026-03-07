# Enchantment Engineering

As a player, I want to reverse-engineer magical items to learn their enchantments and apply them to mundane equipment, so that artificers can create custom magical gear.

## Details

- **Disenchanting**: destroy a magical item at a workbench to extract its enchantment as a schematic
  - Success rate: based on Artificer skill vs enchantment complexity (50-95%)
  - Failure: item destroyed, no schematic gained
  - The original item is always consumed
- **Enchantment Schematics** (learnable):
  - Flaming: +fire damage to weapons, fire resistance to armor
  - Frost: +cold damage, slow on hit
  - Vampiric: lifesteal on weapons (5-15% of damage)
  - Featherlight: reduce equipment weight by 50%
  - Fortified: +durability, slower degradation
  - Silent: eliminate noise from armor (stealth bonus)
  - Returning: thrown weapons return to hand
  - Seeking: ranged weapons auto-adjust trajectory (+2 accuracy)
- **Application Process**: requires workbench, enchantment schematic, target item, and catalysts (gems, arcane dust, elemental essences)
  - Mundane items can hold 1 enchantment; rare items can hold 2; legendary items can hold 3
  - Overwriting an existing enchantment destroys the previous one
- **Enchantment Tiers**: Faint → Moderate → Strong → Powerful; tier depends on catalyst quality and Artificer skill
- **Unstable Enchantments**: rushing the process or using mismatched catalysts creates unstable enchantments (random positive + negative effect)
- **Scrolls of Enchanting**: consumable alternative for non-artificers; one-time use, applies a fixed enchantment

## Acceptance Criteria

- [ ] Disenchanting extracts schematics at correct success rates
- [ ] All enchantment types apply correct effects
- [ ] Enchantment slot limits are enforced per item rarity
- [ ] Enchantment tiers scale with catalyst quality
- [ ] Unstable enchantments produce random mixed effects
