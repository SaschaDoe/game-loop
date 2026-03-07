# Weather Hazards

As a player, I want extreme weather events to pose real survival threats requiring preparation and quick decision-making, so that weather is a genuine gameplay challenge.

## Details

- **Blizzard**: visibility 1 tile; movement speed halved; 2 cold damage per turn without cold protection; snow drifts block paths; lasts 20-40 turns; warning signs: temperature drop, dark clouds, animals fleeing; preparation: shelter, warm clothing, fire supplies
- **Thunderstorm**: lightning strikes random outdoor tiles (15 damage, stun); heavy rain reduces visibility to 3 tiles; flash floods in low areas (swept away if caught — random relocation + damage); lasts 15-30 turns; warning: dark clouds, static electricity; preparation: stay indoors or in caves, avoid high ground and metal armor
- **Sandstorm (Desert)**: visibility 0 (complete whiteout); 1 damage per turn from abrasion; equipment degrades faster; lasts 10-25 turns; warning: wind picks up, sand swirls; preparation: shelter behind rocks, face covering, sealed containers for items
- **Tornado**: moves across the map along a path; destroys structures in its path; picks up creatures and hurls them (massive damage + random relocation); narrow but devastating; lasts 10 turns; warning: green sky, sudden calm, funnel visible at distance; preparation: underground shelter only (basements, caves)
- **Heatwave**: lasts 30-50 turns; dehydration rate doubles; heavy armor causes exhaustion (CON save every 10 turns or lose 1 STR temporarily); fire risk (dry grass/trees may ignite); water sources shrink; preparation: light clothing, extra water, shade
- **Fog (Dense)**: visibility 2 tiles; Perception checks at disadvantage; enemies harder to detect (ambush chance +30%); gets lost easily (navigation checks required or wander randomly); lasts 10-30 turns; no warning; preparation: compass, lantern (partially helps), rope (tie to landmark)
- **Earthquake**: ground shakes; DEX save or fall prone; structures may collapse (damage if inside); crevasses open (fall damage if unlucky); lasts 3-5 turns but aftershocks continue for 20 turns; triggers cave-ins underground; warning: animals panicking, minor tremors; preparation: open ground, stay away from buildings
- **Volcanic Eruption (Near Volcanoes)**: lava flows advance slowly (5 turns to reach each tile); ash cloud reduces visibility and causes choking (CON save); pyroclastic flow in specific directions (instant death if caught); lasts 100+ turns; warning: increased volcanic activity over 50 turns; preparation: evacuate, ash mask, fire resistance
- **Weather Survival Skill**: dedicated skill; higher levels reveal weather warnings earlier, reduce weather damage, improve shelter effectiveness, and unlock weather prediction (see upcoming weather 50 turns ahead)

## Acceptance Criteria

- [ ] All weather hazards produce correct damage and environmental effects
- [ ] Warning signs appear at correct intervals before each hazard
- [ ] Preparation items and shelter correctly mitigate hazard effects
- [ ] Weather Survival skill reduces damage and reveals warnings at correct levels
- [ ] Earthquakes correctly trigger cave-ins in underground areas
