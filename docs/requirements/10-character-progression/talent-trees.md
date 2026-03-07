# Talent Trees

As a player, I want deep talent trees with meaningful choices and build-defining abilities, so that character customization goes far beyond class and stats.

## Details

- **Three Trees Per Class** (player picks one primary, can dabble in others):
  - **Warrior**: Berserker (damage, rage) / Guardian (defense, taunt, shields) / Warlord (buffs, formations, leadership)
  - **Mage**: Elementalist (fire/ice/lightning) / Enchanter (buffs, debuffs, mind control) / Arcanist (raw magic, teleportation, time manipulation)
  - **Rogue**: Shadow (stealth, assassination, shadow magic) / Trickster (traps, gadgets, deception) / Duelist (finesse melee, riposte, speed)
  - **Ranger**: Beastmaster (pet buffs, animal summoning) / Marksman (ranged damage, trick shots) / Survivalist (tracking, traps, terrain mastery)
  - **Cleric**: Zealot (holy damage, smiting) / Healer (restoration, purification) / Oracle (divination, foresight, prophecy)
  - **Bard**: Warchanter (combat buffs, morale) / Spellsinger (casting through music) / Lorekeeper (knowledge buffs, identify, languages)
- **Talent Points**: 1 per level; 30 max level = 30 points; full tree requires ~20 points, so you can't max two trees
- **Keystone Talents** (tier 5, one per tree): build-defining abilities that fundamentally change playstyle
  - Berserker keystone: "Undying Fury" — cannot die while raging (HP can go negative; death occurs when rage ends if still negative)
  - Shadow keystone: "Death's Shadow" — first attack from stealth is an automatic critical with 5x damage
  - Healer keystone: "Martyr's Gift" — can transfer all damage from an ally to yourself
- **Respec**: available at trainer NPCs for increasing gold cost (first respec free, then 100, 500, 2000...)
- **Synergy Bonuses**: certain talents across different trees combine for bonus effects (Guardian's shield + Warlord's formation = "Phalanx")
- Talents are visualized as a branching tree in the UI with locked/unlocked states

## Acceptance Criteria

- [ ] All class talent trees have 3 branches with unique abilities
- [ ] Talent point allocation and requirements work correctly
- [ ] Keystone talents provide build-defining power
- [ ] Respec functions with escalating cost
- [ ] Synergy bonuses activate for correct talent combinations
