# Sea Monsters

As a player, I want to encounter massive sea creatures during ocean travel that threaten my ship, so that sailing has dramatic and dangerous encounters.

## Details

- **Sea Monster Types**:
  - **Kraken**: tentacles emerge around the ship (8 tiles), each tentacle attacks independently; must sever all tentacles to drive it off; ink spray blinds crew
  - **Leviathan**: massive whale-like creature that surfaces beneath the ship; ram attack (heavy hull damage), tidal wave (knocks crew overboard); vulnerable while surfacing
  - **Sea Serpent**: coils around the ship (constrict damage to hull each turn); fast, hard to hit; weak to fire
  - **Charybdis**: living whirlpool creature; pulls ship toward center (unavoidable unless at full sail away); at center = ship destroyed; must attack the "eye" at the vortex center
  - **Ghost Ship**: spectral vessel crewed by undead; boards your ship for melee combat; sails through your ship dealing cold AoE; can only be damaged by holy/silver/fire
  - **Dragon Turtle**: armored shell (almost immune to ranged), fire/steam breath, can capsize small ships; retreats into shell to regenerate
- **Encounter Triggers**: deep ocean travel, storms, certain sea regions, carrying cursed cargo, blood in the water
- **Ship Damage**: sea monsters deal hull damage; if hull reaches 0, the ship sinks (swim to nearest land or drown)
- **Crew Involvement**: crew members man cannons, repair hull, fight boarders during encounters
- **Loot**: sea monster parts are extremely valuable (kraken ink, leviathan bone, sea serpent scale) for crafting and selling
- **Avoidance**: some monsters can be avoided with navigation checks or by throwing food overboard as a distraction

## Acceptance Criteria

- [ ] All sea monster types have unique ship-scale combat mechanics
- [ ] Ship hull damage system functions during encounters
- [ ] Crew AI performs assigned roles during combat
- [ ] Sea monster loot drops and is usable
- [ ] Avoidance options work with correct skill checks
