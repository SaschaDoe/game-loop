# Five New Character Classes

**Status: DONE**

## User Story
As a player, I want to choose from 8 character classes (Warrior, Mage, Rogue, Ranger, Cleric, Paladin, Necromancer, Bard), so that I have diverse playstyles and build options.

## Acceptance Criteria
- [x] All 8 classes are selectable at character creation
- [x] Each class has unique stat bonuses (HP, ATK, Sight)
- [x] Each class has a unique active ability (Q key)
- [x] Each class has 9 skills across 3 branches (3 tiers each)
- [x] Each class has starting equipment appropriate to its role
- [x] Each class has social skill bonuses (persuade, intimidate, deceive)
- [x] Each class has distinct dodge, block, push, flee, and trap disarm chances

## Implementation Details

### Ranger
- **Bonuses**: +1 HP, +2 Sight
- **Ability**: Rain of Arrows (hit all enemies in 3x3 area)
- **Skill Branches**: Marksman, Survivalist, Beastmaster
- **Starting Gear**: Shortbow, Quiver, Leather Armor

### Cleric
- **Bonuses**: +3 HP, -1 ATK
- **Ability**: Divine Shield (regeneration for 5 turns)
- **Skill Branches**: Zealot, Healer, Oracle
- **Starting Gear**: Holy Mace, Holy Symbol, Chainmail

### Paladin
- **Bonuses**: +5 HP, -1 Sight
- **Ability**: Holy Smite (3x damage to undead, normal to others)
- **Skill Branches**: Bulwark, Crusader, Devotion
- **Starting Gear**: Crusader Blade, Tower Shield, Plate Helm

### Necromancer
- **Bonuses**: -3 HP, +2 ATK, +1 Sight
- **Ability**: Drain Life (steal HP from nearest enemy within 5 tiles)
- **Skill Branches**: Death Magic, Dark Pact, Undeath
- **Starting Gear**: Bone Staff, Death Shroud

### Bard
- **Bonuses**: +1 Sight
- **Ability**: Inspiring Song (+3 ATK and regeneration for 5 turns)
- **Skill Branches**: Warchanter, Spellsinger, Lorekeeper
- **Starting Gear**: Rapier, Lute, Fancy Hat
