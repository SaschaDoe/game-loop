# Enchantment Table

As a player, I want to enchant weapons, armor, and accessories at an enchanting table with a wide variety of magical effects, so that gear customization has deep magical options.

## Details

- **Enchanting Requirements**: enchanting table (found in mage guilds, crafted for player home); soul gem or mana crystal (fuel); the item to enchant; Enchanting skill level determines available enchantments
- **Weapon Enchantments**:
  - **Flaming** (+fire damage per hit; ignites flammable targets)
  - **Frost** (+ice damage; 15% chance to slow target)
  - **Shocking** (+lightning damage; 10% chance to stun)
  - **Venomous** (+poison DoT on hit; 3 turns)
  - **Vampiric** (heal 15% of damage dealt)
  - **Keen** (+5% critical hit chance)
  - **Banishing** (+50% damage vs extraplanar creatures)
  - **Disrupting** (+50% damage vs undead; chance to instantly destroy weak undead)
  - **Vorpal** (5% chance of instant kill on critical hit; doesn't work on bosses)
  - **Returning** (thrown weapons return to hand after throw)
  - **Silencing** (hits prevent target from casting spells for 2 turns)
  - **Gravity** (hits pull nearby enemies 1 tile toward the target)
- **Armor Enchantments**:
  - **Fortification** (reduce critical hit damage by 50%)
  - **Resistance** (choose element: +25% resistance)
  - **Thorns** (reflect 20% of melee damage back to attacker)
  - **Featherfall** (negate fall damage)
  - **Shadow** (+3 stealth; blend into darkness)
  - **Regeneration** (heal 1 HP per 5 turns while worn)
  - **Spell Absorption** (10% chance to absorb incoming spell as mana)
  - **Freedom** (immune to paralysis and immobilization)
- **Accessory Enchantments** (rings, amulets, cloaks):
  - **Waterwalking**, **Night Vision**, **Feather Step** (no sound while walking), **Chameleon** (+stealth, blend with surroundings), **Mana Well** (+20% max mana), **Lucky** (+3% to all skill checks)
- **Enchantment Slots**: each item has 1-3 enchantment slots based on quality; common = 1, rare = 2, legendary = 3; filling all slots on an item creates a "fully enchanted" glow effect
- **Enchantment Failure**: low skill + high-tier enchantment = risk of failure; failure destroys the soul gem and may damage the item (-1 slot permanently); critical failure destroys the item
- **Disenchanting**: destroy an enchanted item to learn its enchantment permanently; once learned, can apply that enchantment to other items; the destroyed item is lost

## Acceptance Criteria

- [ ] All enchantments apply correct effects to correct item types
- [ ] Enchantment slots correctly limit number of enchantments per item
- [ ] Failure chance calculates correctly from skill vs enchantment tier
- [ ] Disenchanting permanently learns the enchantment and destroys the source item
- [ ] Enchantment fuel (soul gems/mana crystals) consumed correctly
