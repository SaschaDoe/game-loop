# Summon Creatures

As a player, I want to summon magical creatures to fight alongside me, so that I can build a summoner playstyle with tactical minion control.

## Details

- **Summoning Tiers** (unlocked by level and Summoning skill):
  - Tier 1 (Lv3): Summon familiar — tiny creature (rat, cat, owl) that scouts and provides minor buff
  - Tier 2 (Lv8): Summon elemental — fire/water/earth/air elemental (medium combat ally, 15 HP, elemental attacks)
  - Tier 3 (Lv14): Summon beast — dire wolf, giant scorpion, or cave bear (strong melee ally, 30 HP)
  - Tier 4 (Lv20): Summon outsider — angel, demon, or fey creature (powerful ally with unique abilities, 50 HP)
  - Tier 5 (Lv28): Summon avatar — aspect of a deity or elemental lord (boss-tier ally, 100 HP, limited to 10 turns)
- **Summoning Mechanics**:
  - Costs mana to summon and a small mana drain per turn to maintain
  - Maximum active summons: 1 at base, +1 at Summoning skill 5, +1 at skill 10 (max 3)
  - Summons act on their own turn with basic AI; player can issue commands: Attack, Defend, Follow, Hold Position
  - Summons take damage independently; at 0 HP they dissipate (cooldown before re-summoning same type)
- **Binding Rituals**: permanent summons require rare components (demon heart, elemental core, fey crystal) + a ritual at a summoning circle
- **Summon Customization**: at high skill, choose elemental affinity for summons (fire wolf, ice bear, lightning scorpion)
- **Hostile Summoning Failure**: botched summoning (low skill + high tier) spawns an uncontrolled hostile creature
- **Anti-Summoning**: Dispel Magic instantly destroys summons; some enemies have auras that prevent summoning
- Summoned creatures have unique ASCII characters with a color tint matching their element

## Acceptance Criteria

- [ ] All summoning tiers unlock at correct levels
- [ ] Mana cost and maintenance drain work correctly
- [ ] Summon AI follows issued commands
- [ ] Maximum active summon limit is enforced
- [ ] Failed summons spawn hostile creatures
