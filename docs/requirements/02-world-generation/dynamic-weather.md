# Dynamic Weather

As a player, I want the world to have dynamic weather that changes over time, so that the environment feels alive and weather impacts my decisions.

## Details

- Weather types: clear, rain, storm, fog, snow, sandstorm (biome-dependent)
- Weather affects visibility (fog reduces sight range), movement, and combat
- Rain extinguishes torches; snow slows movement; storms can damage exposed characters
- Weather transitions gradually with text descriptions
- Some spells or items interact with weather (e.g., lightning spells stronger in storms)
- Weather is deterministic from the world seed and in-game time

## Acceptance Criteria

- [ ] Weather changes over time during gameplay
- [ ] Weather effects on visibility and movement are functional
- [ ] Weather-specific interactions (torches, spells) work correctly
- [ ] Weather is consistent when reloading a save
