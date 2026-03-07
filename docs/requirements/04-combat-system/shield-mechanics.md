# Shield Mechanics

As a player, I want shields to have active blocking, bashing, and positioning mechanics, so that defensive combat is engaging rather than just a passive stat bonus.

## Details

- **Shield Types**:
  - **Buckler**: small, +1 armor, can parry (negate one melee attack, timing-based); very light, no movement penalty
  - **Round Shield**: medium, +3 armor, block (reduce damage by 50% from one direction); bash (3 damage + stagger)
  - **Tower Shield**: large, +5 armor, full cover (immune to ranged from front), mobile wall (allies behind you get cover); -2 movement speed
  - **Magical Shield**: enchanted, can absorb spells (stores 1 spell, release later); +2 armor; lightweight
  - **Spiked Shield**: +2 armor, bash deals 5 damage + bleed; enemies that melee you take 1 damage (thorn effect)
- **Active Shield Abilities**:
  - **Block**: reduce incoming damage from a chosen direction by shield's block value; costs 1 action
  - **Bash**: melee attack with shield; low damage but stagger (enemy loses next turn); breaks enemy combos
  - **Shield Wall** (with companion): stand adjacent to a shield-wielding companion; both gain +50% block value; enemies can't pass between you
  - **Reflect**: magical shields can bounce a spell back at the caster (timing-based, 1 turn window)
  - **Shield Charge**: sprint 3 tiles forward with shield raised; pushes enemies back, deals bash damage, immune to frontal damage during charge
- **Shield Durability**: shields take damage when blocking; broken shields provide no bonus; repairable at blacksmith
- **Shield Proficiency**: skill that unlocks advanced techniques (block → bash → shield wall → reflect → shield charge as proficiency rises)
- **Two-Shield Fighting** (rare style): dual-wield shields; double block value, double bash, no weapon attacks; unlocked via specific trainer

## Acceptance Criteria

- [ ] All shield types provide correct passive armor bonuses
- [ ] Active shield abilities (block, bash, wall, reflect, charge) function correctly
- [ ] Shield durability tracks damage and affects functionality
- [ ] Shield proficiency gates advanced techniques
- [ ] Shield wall combo works with adjacent shield-wielding companion
