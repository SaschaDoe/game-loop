# Spell Schools Detail

As a player, I want each spell school to have 8-10 spells with distinct effects and progression, so that magic users have deep, meaningful choices in how they develop.

## Details

### Fire School
1. **Spark** (Lv1): 2 damage to single target, 1 mana
2. **Flame Arrow** (Lv3): 5 damage ranged, ignites target (2 burn), 3 mana
3. **Fireball** (Lv7): 8 damage 3x3 AoE, 8 mana
4. **Fire Wall** (Lv10): creates burning tile barrier for 5 turns, 6 mana
5. **Immolate** (Lv15): 15 damage + heavy burn DoT, 12 mana
6. **Meteor** (Lv20): 25 damage 5x5 AoE, 30 mana, 50-turn cooldown
7. **Phoenix Form** (Lv25): fire immunity, burn aura, if killed revive at 50% HP once, 40 mana

### Ice School
1. **Frost Touch** (Lv1): 2 damage + slow for 2 turns, 1 mana
2. **Ice Shard** (Lv3): 4 damage ranged, 20% freeze chance, 3 mana
3. **Blizzard** (Lv7): 6 damage 3x3 AoE + slow all, 8 mana
4. **Ice Wall** (Lv10): creates impassable ice barrier for 8 turns, 6 mana
5. **Shatter** (Lv13): bonus damage to frozen targets (3x), 5 mana
6. **Absolute Zero** (Lv18): freeze all enemies in radius for 3 turns, 20 mana
7. **Glacial Prison** (Lv25): encase boss in ice, skip their next 5 turns, 35 mana

### Lightning School
1. **Zap** (Lv1): 3 damage single target, 2 mana
2. **Chain Lightning** (Lv5): 4 damage, jumps to 3 nearby enemies, 6 mana
3. **Thunderclap** (Lv8): AoE stun around caster for 2 turns, 7 mana
4. **Lightning Bolt** (Lv12): 12 damage in a line (pierces enemies), 10 mana
5. **Storm Call** (Lv16): outdoor only, 8 damage AoE, 5-turn duration, 15 mana
6. **Ball Lightning** (Lv20): summon mobile orb that zaps nearby enemies for 10 turns, 18 mana
7. **Thor's Wrath** (Lv25): 40 damage single target, guaranteed stun, 30 mana

### Shadow School
1. **Darkness** (Lv1): reduce target's sight range by 3 for 5 turns, 2 mana
2. **Shadow Bolt** (Lv4): 5 damage ranged, ignores armor, 4 mana
3. **Fear** (Lv7): target flees for 3 turns, 6 mana
4. **Life Drain** (Lv10): 8 damage, heal self for 50% of damage dealt, 8 mana
5. **Shadow Cloak** (Lv14): invisibility for 5 turns, 10 mana
6. **Curse of Weakness** (Lv18): all target stats -3 for 20 turns, 12 mana
7. **Soul Rip** (Lv25): 30 damage, creates a spectral minion from the target's soul, 35 mana

### Holy School
1. **Heal** (Lv1): restore 5 HP to self or adjacent ally, 2 mana
2. **Smite** (Lv3): 6 damage to undead/demons (2 to others), 3 mana
3. **Bless** (Lv5): +2 all stats to target for 10 turns, 5 mana
4. **Turn Undead** (Lv8): all undead in radius flee for 5 turns, 7 mana
5. **Divine Shield** (Lv12): absorb next 20 damage, 10 mana
6. **Resurrection** (Lv16): revive a dead companion at 50% HP, 25 mana, 100-turn cooldown
7. **Holy Nova** (Lv20): 15 damage to all enemies + 10 heal to all allies in radius, 20 mana
8. **Judgment** (Lv25): instant kill on target below 20% HP (bosses immune), 30 mana

### Nature School
1. **Vine Whip** (Lv1): 2 damage + root for 2 turns, 1 mana
2. **Thorns** (Lv4): reflect 30% of melee damage back for 10 turns, 4 mana
3. **Regrowth** (Lv6): heal 3 HP per turn for 10 turns, 5 mana
4. **Entangle** (Lv9): root all enemies in 3x3 area for 3 turns, 8 mana
5. **Summon Treant** (Lv13): summon a tree ally (high HP, slow, melee), 12 mana
6. **Earthquake** (Lv17): 10 damage AoE + collapse weak terrain, 15 mana
7. **Force of Nature** (Lv22): transform terrain into forest, buffing nature spells 2x for 20 turns, 20 mana

## Acceptance Criteria

- [ ] All spells per school are learnable at their required level
- [ ] Spell effects (damage, AoE, status, summon) function correctly
- [ ] Mana costs are deducted and cooldowns enforced
- [ ] Spell scaling makes higher-level spells meaningfully stronger
