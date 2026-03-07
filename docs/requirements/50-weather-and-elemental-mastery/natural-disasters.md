# Natural Disasters

As a player, I want natural disasters to strike the world dynamically, destroying terrain and creating emergency scenarios, so that the world feels unpredictable and dangerous.

## Details

- **Disaster Types**:
  - **Earthquake**: ground shakes for 5 turns; creatures knocked prone each turn (Dexterity save); buildings collapse (some tiles become rubble); opens crevices (new dungeon entrances or pits); triggers in mountain/volcanic regions
  - **Flood**: river/coastal areas overflow; water tiles spread (4 tiles per turn); submerges low-lying areas; NPCs flee to high ground; current pushes creatures; lasts until water recedes (30 turns)
  - **Volcanic Eruption**: lava flows from volcano tile; 2 tiles per turn spread; anything touched = instant heavy fire damage; ash cloud (reduced visibility, poison breathing); extremely rare, region-devastating
  - **Tornado**: funnel moves randomly across the overworld map; destroys everything in its path; picks up and throws objects/creatures; lasts 20 turns; pray it doesn't hit a town
  - **Wildfire**: starts from lightning strike or arson; spreads through forest tiles (1 tile per 2 turns); destroys trees, kills wildlife, chokes with smoke; rain or water magic extinguishes
  - **Blizzard**: extreme cold + whiteout conditions; visibility 1 tile, freezing damage without shelter, roads blocked by snow; lasts 50 turns
  - **Tsunami**: triggered by ocean earthquake; massive wave hits coastal areas; sweeps away NPCs and structures; warning time: 10 turns after earthquake
- **Warning Signs**: animals flee, NPCs discuss strange weather, barometric pressure changes (if player has a barometer gadget)
- **Aftermath**: destroyed terrain generates rebuilding quests, displaced NPC refugees, resource shortages, economic disruption
- **Player Intervention**: some disasters can be mitigated (water magic vs wildfire, earth magic vs earthquake, weather manipulation vs storms)
- **Disaster Frequency**: 1-2 minor disasters per in-game year; major ones every 3-5 years; seeded by world seed for consistency
- Surviving a natural disaster grants "Survivor" achievement and +2 to a relevant resistance stat

## Acceptance Criteria

- [ ] All disaster types modify terrain and affect creatures correctly
- [ ] Warning signs appear before disasters strike
- [ ] Aftermath generates appropriate world state changes
- [ ] Player intervention spells can mitigate some disasters
- [ ] Disaster frequency follows world seed scheduling
