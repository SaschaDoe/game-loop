# Treasure Cartography

As a player, I want to find and decode treasure maps that lead to hidden caches, lost tombs, and buried riches, so that map-reading is both a puzzle and an adventure.

## Details

- **Map Sources**: loot from enemies, purchased from shady dealers, found in libraries, rewarded from quests, discovered in bottles washed ashore
- **Map Quality Tiers**:
  - **Crude Sketch**: minimal detail; shows general area only (within 20 tiles); no landmarks; cheapest
  - **Merchant Map**: moderate detail; shows nearby landmarks and approximate distance; compass rose included
  - **Master Cartographer Map**: precise; X marks the exact spot; includes terrain, landmarks, and safe paths; includes danger warnings
  - **Enchanted Map**: animated; shows real-time weather/danger at the location; path updates as you travel; extremely rare
- **Map Decoding**: some maps are encoded; require linguistics skill, cipher key, or specific item to decode; partial decoding reveals hints but not exact location
- **Treasure Types**:
  - Gold caches: buried chests with gold and gems
  - Equipment stashes: hidden weapon/armor caches, often high quality
  - Spell repositories: sealed containers with spell scrolls or tomes
  - Historical artifacts: valuable to collectors and museums; quest items for lore chains
  - Trapped caches: protected by traps, guardians, or curses; highest rewards
- **Map Aging**: some maps are very old; locations may have changed (new buildings over the spot, cave collapsed, underwater now); requires creative problem-solving to reach the treasure
- **Forgery Detection**: some maps are fakes (traps, ambush points, or just wrong); Perception or cartography skill detects forgeries; fake maps from untrustworthy sources more likely
- **Map Collection**: collecting all maps in a regional set reveals a legendary treasure location (one per world region)

## Acceptance Criteria

- [ ] Maps spawn from correct sources at appropriate rarity
- [ ] Map quality tiers provide correct levels of information
- [ ] Encoded maps require correct decoding mechanics
- [ ] Treasure types match the map's indicated value
- [ ] Forgery detection works based on skill checks
