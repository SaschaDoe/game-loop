# Exploration Journal

As a player, I want an automatically-maintained exploration journal that records my discoveries, sketches visited locations, and tracks exploration milestones, so that my journey is documented and reviewable.

## Details

- **Auto-Documentation**: the journal automatically records key exploration events:
  - First visit to a new named location (town, dungeon, landmark)
  - Discovery of hidden areas and secret passages
  - Encounters with unique NPCs or creatures
  - Notable combat victories and defeats
  - Weather events and natural phenomena witnessed
- **Location Sketches**: each visited location gets an ASCII sketch in the journal; shows the map layout as explored; fog of war areas remain blank; updates as you explore more of the location
- **Discovery Log**: chronological list of all discoveries with timestamps (turn count); filterable by category (locations, creatures, items, events)
- **Exploration Statistics**: tracks total tiles explored, percentage of world map revealed, dungeons completed, secrets found, unique locations visited; compare against total discoverable content
- **Personal Notes**: player can add custom notes to any journal entry; notes searchable; useful for remembering puzzle solutions, NPC names, or planned routes
- **Milestone Rewards**: exploration milestones grant titles and bonuses:
  - 10% world explored: "Wanderer" title
  - 25% world explored: +5% movement speed (permanent)
  - 50% world explored: "Explorer" title + reveal nearest undiscovered secret
  - 75% world explored: +10% all loot quality (permanent)
  - 100% world explored: "Cartographer Supreme" title + unique legendary item
- **Journal Sharing**: in multiplayer, share journal entries with other players; shared entries appear as "rumors" in their journal until verified by visiting the location

## Acceptance Criteria

- [ ] Auto-documentation captures all listed event types
- [ ] Location sketches accurately reflect explored areas
- [ ] Discovery log is filterable and searchable
- [ ] Exploration statistics track correct percentages
- [ ] Milestone rewards trigger at correct thresholds
