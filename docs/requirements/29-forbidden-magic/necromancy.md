# Necromancy

As a player, I want a deep necromancy system for raising undead armies from fallen enemies, so that the Necromancer class has a unique and powerful playstyle.

## Details

- Core mechanic: any enemy corpse can be raised as an undead minion
- Raised minions retain 50% of the original creature's stats and one ability
- Minion types based on corpse:
  - Humanoid corpse -> Skeleton Warrior (melee) or Skeleton Archer (ranged)
  - Beast corpse -> Zombie Beast (slow, tough, AoE slam)
  - Mage corpse -> Spectral Mage (casts weakened versions of original spells)
  - Boss corpse -> Elite Undead (powerful but drains your mana per turn to maintain)
- Spells:
  - **Raise Dead** (Lv1): raise 1 corpse as a skeleton, 5 mana
  - **Corpse Explosion** (Lv6): detonate a corpse for AoE damage based on corpse's max HP, 8 mana
  - **Soul Harvest** (Lv10): killing enemies restores mana (passive)
  - **Army of the Dead** (Lv15): raise all corpses in sight range simultaneously, 25 mana
  - **Lich Transformation** (Lv25): become a lich — massive stat boost, undead immunities, but permanently reduces Charisma to 1, irreversible
- Maximum minion count: Intelligence / 3 (e.g., 18 INT = 6 minions)
- Minions decay over time (lose HP per turn) unless near a graveyard or with a preservation spell
- Holy areas (temples, blessed ground) damage and weaken undead minions
- All factions except Cult of the Void view necromancy as evil

## Acceptance Criteria

- [ ] Corpses are raisable as type-appropriate undead
- [ ] Minion stats are correctly derived from the original corpse
- [ ] Maximum minion count scales with Intelligence
- [ ] Lich Transformation is permanent and applies all effects
