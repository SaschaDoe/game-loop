# NPC Daily Routines

As a player, I want NPCs to follow daily routines that change with the time of day, so that the world feels alive and NPCs feel like real inhabitants rather than static quest dispensers.

## Details

- Each NPC has a schedule: wake up, eat, work, socialize, eat, leisure, sleep
- Merchants open and close their shops at set hours
- Guards patrol routes during the day and stand watch at night
- Farmers work fields during the day
- Tavern patrons arrive in the evening
- NPCs physically move between locations on the map according to their schedule
- Breaking into a shop at night means no merchant to trade with
- NPCs react if you're in their home uninvited at night

## Acceptance Criteria

- [ ] NPCs move between locations based on time of day
- [ ] Shops are only usable when the merchant is present
- [ ] NPC positions update as in-game time progresses
- [ ] NPCs react to player intrusion during off-hours
