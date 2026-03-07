# Set Items

As a player, I want to collect matching equipment sets that grant bonus effects when multiple pieces are worn together, so that collecting full sets is a rewarding long-term goal.

## Details

- **Set Structure**: each set has 3-6 pieces spread across equipment slots (weapon, shield, helmet, armor, boots, ring)
- **Set Bonus Tiers**: wearing 2 pieces = minor bonus; 3-4 = moderate bonus; full set = major bonus + unique visual effect
- **Example Sets**:
  - **Dragon Slayer's Regalia** (5 pieces): 2pc: +10% damage to dragons; 3pc: fire resistance 50%; 5pc: Dragon Bane aura (nearby dragons are weakened -3 all stats)
  - **Shadow Walker's Garb** (4 pieces): 2pc: +3 stealth; 3pc: invisibility for 3 turns after killing from stealth; 4pc: Shadow Step (teleport behind any enemy within 8 tiles, 1/combat)
  - **Healer's Devotion** (3 pieces): 2pc: +20% healing power; 3pc: Resurrection passive (once per day, auto-revive at 50% HP on death)
  - **Berserker's Wrath** (4 pieces): 2pc: +5% damage per 10% HP missing; 3pc: immune to fear and charm while below 50% HP; 4pc: Undying Rage (cannot die for 5 turns, then collapse)
  - **Archmage's Legacy** (6 pieces): 2pc: +10% spell damage; 3pc: spells cost 20% less mana; 4pc: spell cooldowns reduced by 1 turn; 6pc: Arcane Overload (triple next spell's damage, 1/day)
  - **Ironforge Bulwark** (5 pieces): 2pc: +5 armor; 3pc: reflect 20% melee damage; 5pc: Fortress Mode (root in place, become immune to knockback, +50% armor, can't move for 5 turns)
  - **Trickster's Ensemble** (4 pieces): 2pc: +3 CHA; 3pc: merchants always offer best prices; 4pc: Lucky Break (once per day, turn a critical failure into a critical success)
- **Set Piece Distribution**: pieces are scattered across different content types (dungeons, bosses, quests, merchants, crafting) to encourage diverse gameplay
- **Set Tracker**: equipment screen shows discovered and missing set pieces with hints for where to find them
- **Mixed Sets**: wearing pieces from two different sets gives partial bonuses from both but no full-set bonus from either
- **Legendary Sets**: 2 world-unique sets with lore-significant pieces; completing one triggers a special questline

## Acceptance Criteria

- [ ] Set bonuses activate at correct piece thresholds
- [ ] All listed sets provide described effects
- [ ] Set tracker shows collection progress with discovery hints
- [ ] Mixed set wearing provides partial bonuses correctly
- [ ] Legendary set completion triggers unique content
