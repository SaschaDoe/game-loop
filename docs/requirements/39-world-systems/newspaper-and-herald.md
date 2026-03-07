# Newspaper and Herald System

As a player, I want towns to have a newspaper or herald that reports on world events, so that I can stay informed about what's happening across the game world.

## Details

- Town criers in town squares announce recent events vocally (text pop-ups when nearby)
- Newspapers: purchasable at general shops (1 gold), contain 3-5 articles per issue
- Article types:
  - World events: dragon sightings, plague outbreaks, faction wars
  - Player deeds: "Unknown adventurer slays the Goblin King!" (player actions reported)
  - Economy: trade route disruptions, price changes, new shop openings
  - Gossip: NPC scandals, romance rumors, mysterious sightings
  - Bounty listings: current most-wanted with descriptions and rewards
- Newspapers are generated dynamically from actual game events
- New issue every 100 turns; old issues are collectible
- Propaganda: faction-controlled papers spin stories to favor their side
- Player can submit articles (LLM dialogue with the editor) to spread rumors or propaganda
- Reading newspapers grants "Informed" buff: +1 to relevant dialogue checks for 50 turns

## Acceptance Criteria

- [ ] Newspapers generate dynamically from game events
- [ ] Articles reflect actual world state changes
- [ ] Faction bias is present in reporting
- [ ] Player can submit articles through the editor
