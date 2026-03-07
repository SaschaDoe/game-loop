# Calendar and Time System

As a player, I want a detailed in-game calendar with days, weeks, months, and years that drives world events, so that time progression feels structured and meaningful.

## Details

- **Calendar Structure**:
  - 1 day = 24 hours (each hour = ~10 player turns)
  - 1 week = 7 days (named: Moonday, Tideday, Forgeday, Windday, Starday, Sunday, Restday)
  - 1 month = 30 days (12 months per year, named after the zodiac/constellations)
  - 1 year = 360 days; seasons change every 90 days (Spring: months 1-3, Summer: 4-6, Autumn: 7-9, Winter: 10-12)
- **Day/Night Cycle**: dawn (5:00), day (7:00-17:00), dusk (17:00-19:00), night (19:00-5:00)
  - Shops open/close based on time; NPC routines follow schedules
  - Some quests have deadlines ("deliver before Forgeday")
  - Nocturnal events: werewolf transformations, vampire activity, midnight rituals
- **Weekly Events**:
  - Market Day (Sundays): traveling merchants arrive, better prices
  - Training Day (Forgeday): training costs reduced 20%
  - Rest Day: NPCs stay home, taverns are busier, temple services free
- **Monthly Events**: full moon (lycanthropy, tides), new moon (undead surge, stealth bonus), equinox (elemental magic boosted)
- **Annual Events**: festivals (see seasonal-events), tax collection, harvest fair, tournament season, pilgrimage
- **Date Display**: shown in HUD corner (e.g., "Forgeday, 14th of Frostfall, Year 347")
- **Aging**: the player character ages 1 year per 360 in-game days; aging past a threshold (varies by race) applies stat penalties
- **Historical Date References**: NPC dialogue and lore books reference dates; the codex tracks historical events on a timeline
- Time can be advanced by: waiting (skip turns), resting, traveling (fast travel advances time proportional to distance)

## Acceptance Criteria

- [ ] Calendar accurately tracks days, weeks, months, years, and seasons
- [ ] Shop hours and NPC schedules follow time correctly
- [ ] Weekly and monthly events trigger on schedule
- [ ] Date displays in HUD and updates in real-time
- [ ] Aging system applies stat changes at race-specific thresholds
