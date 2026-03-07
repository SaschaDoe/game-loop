# Musical Performances

As a Bard player, I want to perform songs with my instrument that have magical effects on the battlefield and in towns, so that the Bard class has a unique gameplay identity centered on music.

## Details

- Instruments: lute (default), flute, drums, harp, war horn (each with different sound profiles)
- Performance is an action that takes 1 turn to start and sustains over multiple turns
- Songs and effects:
  - **Ballad of Courage**: allies gain +2 ATK and +2 DEF for duration
  - **Lullaby of Peace**: enemies in range fall asleep (Wisdom save to resist)
  - **Dirge of Despair**: enemies suffer -3 to all stats, chance to flee
  - **Anthem of Haste**: allies get +1 action per turn
  - **Requiem of the Fallen**: raise 1 nearby corpse as a temporary ally (weaker than necromancer version)
  - **Song of Healing**: allies regenerate 2 HP per turn
  - **Cacophony**: all creatures in range (friend and foe) are confused for 3 turns
  - **Epic of the Hero**: retell a legendary hero's story, granting the named hero's signature ability to one ally for 5 turns
- Interruption: taking damage has a 50% chance to interrupt the song (Constitution check to maintain)
- Song power scales with Charisma and instrument quality
- Town performances: play in taverns for gold tips, reputation, and rumor access
- Competitive: bard duels where two bards try to out-perform each other (skill check sequence)

## Acceptance Criteria

- [ ] All songs produce correct effects while sustained
- [ ] Interruption mechanics trigger on damage
- [ ] Song power scales with Charisma and instrument quality
- [ ] Town performances earn gold and reputation
