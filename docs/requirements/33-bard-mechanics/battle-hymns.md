# Battle Hymns

As a player, I want to sing powerful battle hymns during combat that buff allies and debuff enemies, so that bards are valued combat support with unique audio-driven mechanics.

## Details

- **Hymn Types** (one active at a time; switching hymns takes 1 turn):
  - **Hymn of Valor**: all allies +3 damage, +2 morale; enemies at <25% HP flee; warm, major key melody
  - **Hymn of Shielding**: all allies +3 armor, +20% healing received; reduces incoming critical hit chance by 50%; steady, rhythmic drone
  - **Hymn of Haste**: all allies +2 movement speed, +1 action per turn; enemies -1 speed; fast, driving tempo
  - **Hymn of Fear**: all enemies in 8 tiles make Wisdom save or flee for 2 turns; -2 to enemy morale; dissonant, minor key wail
  - **Hymn of Healing**: all allies regenerate 2 HP/turn; status effect duration reduced by 50%; gentle, soothing melody
  - **Hymn of Disruption**: enemy spellcasters must make concentration check to cast; spell costs +50%; cacophonous noise
  - **Hymn of the Dead** (forbidden): raise fallen enemies as temporary undead allies; allies are uneasy (-1 morale); eerie funeral dirge
- **Hymn Mechanics**:
  - Singing costs 2 mana per turn (maintained); interrupted if the bard takes damage (Concentration check to maintain)
  - Hymn range: 8 tiles from the bard; allies/enemies must be within range to be affected
  - Hymn mastery: each hymn has proficiency; higher mastery = stronger effects, easier concentration checks
  - Cannot attack while singing; can move at half speed; can be combined with instrument playing for +50% effect
- **Crescendo** (ultimate): after singing the same hymn for 5 consecutive turns, the bard can trigger a Crescendo — a one-time powerful burst:
  - Valor Crescendo: all allies deal double damage for 1 turn
  - Shielding Crescendo: all allies become immune to damage for 1 turn
  - Haste Crescendo: all allies get an extra full turn
  - Fear Crescendo: all enemies in range flee and can't return for 5 turns
- **Counter-Hymn**: enemy bards can sing opposing hymns; effects cancel out; bard vs bard duels are resolved by a Charisma contest

## Acceptance Criteria

- [ ] All hymn types apply correct buffs/debuffs in range
- [ ] Concentration check mechanic works when bard takes damage
- [ ] Crescendo triggers after 5 consecutive turns of the same hymn
- [ ] Hymn mastery improves effects with use
- [ ] Counter-hymn mechanic cancels opposing bard effects
