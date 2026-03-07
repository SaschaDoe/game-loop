# Random Encounters

As a player, I want random encounters to occur during overworld travel, so that journeys between locations are unpredictable and full of small stories.

## Details

- Random encounters trigger with a probability per overworld tile moved (~10%)
- Encounter types:
  - **Combat**: ambush by bandits, wild animal attack, monster patrol
  - **Social**: traveling merchant, lost child, injured NPC, wandering bard
  - **Discovery**: hidden cave entrance, abandoned campsite with loot, ancient marker stone
  - **Event**: forest fire, landslide blocking the path, bridge collapsed, caravan under attack
  - **Strange**: mysterious stranger with a riddle, a talking animal, a time-displaced knight
- Encounters scale with world region difficulty
- Some encounters are multi-part: help the caravan now, meet the grateful merchant later in town
- Encounter frequency affected by: road vs wilderness (roads are safer), time of day (night is more dangerous), player level (higher level = rarer but tougher encounters)
- Option to auto-resolve trivial encounters at high levels ("You easily dispatch the bandits")

## Acceptance Criteria

- [ ] Encounters trigger at correct probabilities during overworld travel
- [ ] All encounter types are implemented
- [ ] Encounter difficulty scales with region
- [ ] Multi-part encounters continue in later gameplay
