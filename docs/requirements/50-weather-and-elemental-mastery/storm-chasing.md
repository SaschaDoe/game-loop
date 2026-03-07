# Storm Chasing

As a player, I want to track and harness powerful storms for rare resources and encounters, so that weather mastery has an active exploration component.

## Details

- **Storm Types** (spawn dynamically on the overworld map, move across terrain):
  - **Thunderstorm**: lightning strikes (random damage in area), heavy rain, reduced visibility; spawns lightning elementals; attracts lightning-themed creatures
  - **Blizzard**: extreme cold, whiteout (1-tile visibility), freezing terrain; spawns ice elementals; unique blizzard herbs bloom in eye of the storm
  - **Sandstorm**: abrasion damage (1/turn without cover), buried ruins uncovered temporarily, navigation impossible without compass; rare desert crystals
  - **Mana Storm**: wild magic; random spell effects trigger every few turns; spells cast inside are amplified 2x but unpredictable; mana crystals condense from the air
  - **Blood Moon Storm**: undead surge, red-tinted world, all dark magic amplified; vampires and werewolves are supercharged; cursed items become uncursed and vice versa
- **Storm Eye**: the calm center of every storm; safest spot; rarest resources concentrate here; reaching the eye requires surviving the outer storm
- **Storm Resources** (only obtainable during storms):
  - Storm Crystal (thunderstorm): lightning enchanting component
  - Permafrost Shard (blizzard): cold enchanting, ice golem core
  - Desert Glass (sandstorm): lens crafting, heat resistance gear
  - Raw Mana (mana storm): universal enchanting catalyst, spell fuel
  - Blood Amber (blood moon storm): undead crafting, dark enchanting
- **Storm Tracking**: weather forecasting skill (learned from Meteorologist NPC); predict storm paths and timing; set up camp along the predicted route
- **Storm Surfing** (mount ability): ride the wind currents at the storm's edge for extremely fast travel; risky (periodic damage), requires a flying mount
- **Storm Boss**: each storm type has a rare chance of spawning a storm entity boss at its core (Storm Titan, Blizzard Wyrm, Sand Colossus, Mana Archon, Blood Revenant)

## Acceptance Criteria

- [ ] Storms spawn dynamically and move across the overworld
- [ ] Storm eye is reachable and contains unique resources
- [ ] Storm-exclusive resources are only available during correct storm types
- [ ] Storm tracking predicts paths accurately with skill
- [ ] Storm bosses spawn at correct rarity and are beatable
