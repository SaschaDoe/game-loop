# Army Morale

As a player commanding troops in warfare, I want army morale to dynamically affect combat performance based on leadership, victories, supplies, and conditions, so that commanding an army requires attention beyond raw numbers.

## Details

- **Morale Scale**: 0-100 per unit; starts at 50 (neutral); modifiers push up or down; morale checked at key moments (combat start, taking casualties, leader actions)
- **Morale Modifiers (Positive)**:
  - Victory in previous battle: +15
  - Leader present (player on field): +10
  - Well-supplied (food, equipment): +10
  - Battle Cry ability used: +5 (temporary, 10 turns)
  - Outnumber the enemy: +5
  - Fighting on home territory: +5
  - Inspiring speech (CHA check before battle): +5 to +15 based on check quality
  - Religious blessing (priest in army): +5
- **Morale Modifiers (Negative)**:
  - Heavy casualties (>30% losses): -20
  - Leader flees or dies: -25
  - No food/supply shortage: -15
  - Outnumbered: -10
  - Fighting supernatural enemies: -10 (unless troops have been prepared)
  - Ally unit routed: -10
  - Siege (defending for 50+ turns): -5 per 50 turns
  - Weather (fighting in storm/blizzard): -5
- **Morale Effects**:
  - 80-100 (Inspired): +15% damage, +15% defense, will fight to the last; may pursue fleeing enemies
  - 50-79 (Steady): normal performance; will hold line
  - 25-49 (Wavering): -10% damage, -10% defense; may refuse dangerous orders; units at the edges may flee
  - 1-24 (Breaking): -25% damage, -25% defense; units flee if given the chance; only elite units hold
  - 0 (Routed): army flees the battlefield; combat ends in defeat; scattered troops must be regathered (30% lost permanently, deserted)
- **Rally Mechanic**: when morale drops below 25, player can attempt a Rally (CHA + Leadership check); success raises morale by 15; failure = route; can only attempt rally once per battle
- **Elite Units**: special units (royal guard, berserkers, undead) have morale immunity or modification (berserkers fight harder at low morale instead of fleeing; undead have no morale)

## Acceptance Criteria

- [ ] All positive and negative modifiers apply correctly to morale score
- [ ] Morale effects produce correct combat performance changes
- [ ] Rout triggers correctly at 0 morale with correct troop loss
- [ ] Rally mechanic uses correct check and applies correct morale restoration
- [ ] Elite units correctly modify or ignore morale effects
