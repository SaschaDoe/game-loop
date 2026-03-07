# Random World Events

As a player, I want random events to occur in the world unprompted, so that the world feels alive with things happening independently of my actions.

## Details

- Event types:
  - **Meteor Strike**: a meteor crashes in the overworld, creating a new mini-dungeon with alien materials
  - **Plague Outbreak**: a town falls ill; if untreated, NPCs die and the town economy collapses
  - **Bandit Raid**: bandits attack a village; help defend or let it fall
  - **Dragon Sighting**: a dragon is spotted near a town, causing panic and economic disruption
  - **Wandering Merchant**: a rare merchant appears at a random location with unique stock
  - **Eclipse**: temporary darkness across the overworld; nocturnal monsters appear everywhere
  - **Gold Rush**: ore discovered near a town; influx of NPCs, higher prices, mining opportunities
  - **Earthquake**: dungeon layout shifts, new passages open, old ones collapse
- Events trigger randomly every 200-500 turns
- Events persist until resolved or naturally expire
- Event notifications appear in the message feed and on the map
- Player can choose to engage or ignore events (but ignoring has consequences)

## Acceptance Criteria

- [ ] Events trigger at random intervals
- [ ] Events affect world state visibly
- [ ] Player can engage with or ignore events
- [ ] Unresolved events have consequences
