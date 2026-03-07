# Instrument Variety

As a player, I want to find and play different instruments with unique sound effects and gameplay bonuses, so that bard gameplay has collectible depth.

## Details

- **Instrument Types**:
  - **Lute** (starter): balanced, +1 CHA while playing, standard song range (5 tiles)
  - **War Drum**: +2 STR to all allies in range (8 tiles), intimidates enemies (-1 morale), loud (alerts enemies from far away)
  - **Flute**: +2 DEX to allies, charm animals (pacify beast-type enemies), quiet (doesn't alert enemies)
  - **Harp**: +2 WIS to allies, healing melody (slow HP regen to party), calms hostile NPCs
  - **Bagpipes**: +3 to morale, AoE fear effect on enemies, extremely loud (alerts everything on the floor)
  - **Ocarina**: weather manipulation (play songs to change weather), teleportation melodies (fast travel when playing specific tunes)
  - **Violin**: +2 INT, enhances magic (allies' spells cost 20% less mana while playing), eerie sound unsettles undead
  - **Legendary Instruments** (unique, one per world):
    - Orpheus's Lyre: charm any creature (even bosses) for 3 turns
    - The Doom Horn: one-time use, instantly kills all non-boss enemies in the room (breaks after use, can be repaired)
    - The Songblade: a sword that plays music when swung; combines melee damage with bard buffs
- **Instrument Proficiency**: each instrument has a separate skill level; higher proficiency = stronger effects, more song options
- **Instrument Condition**: instruments degrade with use; broken instruments play badly (debuff instead of buff); repaired by luthier NPCs
- **Ensemble Bonus**: multiple instruments playing together (multiplayer or companion bards) stack effects with a harmony multiplier

## Acceptance Criteria

- [ ] All instruments produce unique effects when played
- [ ] Legendary instruments are discoverable with powerful abilities
- [ ] Proficiency system scales effects per instrument
- [ ] Instrument condition affects performance quality
- [ ] Ensemble bonus applies when multiple instruments play
