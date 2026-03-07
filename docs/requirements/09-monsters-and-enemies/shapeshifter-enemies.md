# Shapeshifter Enemies

As a player, I want to encounter enemies that change form mid-combat to gain new abilities, so that fighting shapeshifters requires constant adaptation.

## Details

- **Shapeshifter Types**:
  - **Changeling Assassin**: appears as a friendly NPC; strikes when trusted; in combat, shifts between forms (rogue → mage → warrior) every 3 turns, gaining that form's abilities
  - **Chaos Beast**: amorphous, constantly shifting; random attacks each turn (claws, tentacles, acid spit, bite); random resistances each turn (roll on a table); impossible to predict
  - **Phase Spider**: shifts between physical and ethereal; physical: venomous bite + web; ethereal: passes through walls, immune to physical; alternates every 2 turns
  - **Lycanthrope (enemy)**: human form (weapons, tactics) → hybrid form (claws + weapons, faster) → beast form (full animal, savage); shifts when damaged at HP thresholds (75%, 50%, 25%)
  - **Elemental Shifter**: cycles through fire → water → earth → air every 4 turns; each form has corresponding element's abilities and weaknesses; exploit the current weakness before it shifts
  - **Mirror Shade**: copies the player's current equipment and abilities; fights as a dark mirror; changes loadout when the player does; weakness: it can't copy items it hasn't seen (switch to unused equipment)
  - **The Pretender** (boss): multi-phase boss that copies the forms of allies the player has traveled with; fights with their abilities; psychologically unsettling; LLM dialogue taunts using companions' voices
- **Shapeshifter Detection**: Perception check reveals shimmer before transformation; True Sight spell shows true form; silver touch causes pain regardless of form
- **Anti-Shift Tactics**: Dimensional Anchor spell prevents form changes for 5 turns; attacking during a shift (1-turn window) deals double damage; some forms have common weaknesses across all phases
- **Shapeshifter Loot**: essence of change (alchemy ingredient for polymorph potions), shifting skin (armor that changes appearance), mimic core (mechanical companion upgrade)

## Acceptance Criteria

- [ ] All shapeshifter types change forms with correct triggers
- [ ] Each form has distinct abilities and weaknesses
- [ ] Form transitions have exploitable windows
- [ ] Detection methods reveal shapeshifters before transformation
- [ ] Anti-shift tactics prevent or punish form changes
