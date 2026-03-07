# Song Effects

As a player bard, I want each song I perform to produce specific magical effects on allies, enemies, and the environment, so that bard music is a powerful and versatile support tool.

## Details

- **Song Mechanics**: playing a song costs 1 action per turn; song effects persist while playing (concentration); moving interrupts the song; taking damage requires CON save to maintain; higher Performance skill = more powerful effects
- **Buff Songs (affect allies in 5-tile radius)**:
  - **Ballad of Courage**: +2 to attack rolls; immune to fear effects; allies feel emboldened (LLM adjusts companion dialogue to be braver)
  - **Hymn of Healing**: allies regenerate 2 HP per turn; cure minor status effects after 3 turns of continuous playing
  - **March of Haste**: allies gain +2 movement speed; action economy improved (bonus minor action per turn)
  - **Song of Shielding**: allies gain +3 AC (armor class); 25% chance to deflect ranged attacks
  - **Anthem of Clarity**: allies immune to confusion, charm, and sleep effects; +2 INT for puzzle-solving
- **Debuff Songs (affect enemies in 5-tile radius)**:
  - **Dirge of Despair**: -2 to enemy attack rolls; 20% chance enemies skip their turn (demoralized); WIS save negates
  - **Cacophony**: enemies can't concentrate on spells; caster enemies lose spells in progress; 50% chance to disrupt enemy abilities; loud — attracts more enemies
  - **Lullaby**: enemies must WIS save each turn or fall asleep (waking on damage); only works on living creatures; gentle and quiet (doesn't attract attention)
  - **Song of Confusion**: enemies attack random targets (including each other); INT save negates; hilarious and chaotic
- **Environmental Songs**:
  - **Nature's Melody**: plants grow rapidly (create vine barriers, fruit grows for food); animals calm and approach peacefully; only works outdoors
  - **Stone Shaper's Tune**: reshape stone and earth within 3 tiles (open passages, create barriers, collapse tunnels); only works underground
  - **Siren's Call**: water creatures and spirits are drawn to you (can attract aquatic allies or enemies); water parts briefly (create path through shallow water)
- **Song Mastery**: performing the same song 20+ times improves it (stronger effects, wider radius, lower interruption chance); mastered songs can be played while walking (no movement interruption)
- **Duets**: playing with a companion musician doubles song effects and extends radius to 8 tiles; requires both musicians to know the same song

## Acceptance Criteria

- [ ] All buff songs apply correct effects within correct radius
- [ ] Debuff songs use correct saves and produce correct enemy behaviors
- [ ] Environmental songs produce correct terrain/creature effects
- [ ] Song mastery tracks usage and grants correct improvements
- [ ] Duets correctly double effects with companion musicians
