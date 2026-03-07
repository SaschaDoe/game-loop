# Nightmare Encounters

As a player, I want nightmares to be dangerous encounters that can damage my character, so that sleep carries risk and horror elements enrich the game.

## Details

- **Nightmare Triggers**: sleeping in haunted locations, being cursed, low sanity, possession by dark entities
- **Nightmare Types**:
  - **Reliving Death**: if the player has died before, nightmare recreates the death scene with amplified enemies
  - **Shadow Self**: fight a dark mirror of the player character with identical stats and abilities
  - **Endless Corridor**: must find the exit while being chased by an unkillable entity; wrong turns lead to damage
  - **Memory Corruption**: NPCs the player has killed appear to accuse them; Wisdom saves or take psychic damage
  - **The Abyss**: falling dream — must cast feather fall or find solid ground before hitting bottom (instant death in dream = wake with 1 HP)
- Damage taken in nightmares translates to real damage (50% of dream damage carries over)
- **Nightmare Boss**: The Dreamweaver — a recurring entity that grows stronger each time the player sleeps; defeating it grants permanent dream immunity
- Nightmare prevention: Dream Catchers (craftable), Sleeping Potions (deep sleep = no dreams), blessing from a priest
- Nightmare frequency increases if the player has high karma debt or unresolved ghost encounters
- Consecutive nightmares apply "Sleep Deprived" debuff: -2 to all stats until a peaceful rest is achieved

## Acceptance Criteria

- [ ] Nightmare triggers based on correct conditions
- [ ] All nightmare types generate appropriate encounters
- [ ] Dream damage carries over to waking state at correct ratio
- [ ] Prevention items and methods work
- [ ] Sleep Deprived debuff applies after consecutive nightmares
