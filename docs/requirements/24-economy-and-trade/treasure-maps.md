# Treasure Maps

As a player, I want to find and follow treasure maps that lead to buried riches, so that exploration is rewarded with treasure-hunting adventures.

## Details

- **Obtaining Maps**: bought from shady merchants, found in dungeons, dropped by pirates/bandits, rewarded by quests, found in bottles on beaches
- **Map Types**:
  - **Simple Map**: X marks the spot on a crudely drawn local area; easy to follow
  - **Riddle Map**: location described in verse/riddles that reference landmarks ("Where the twin oaks meet the river's bend, dig where the shadow points at noon")
  - **Fragment Map**: torn into 2-4 pieces scattered across the world; must collect all pieces to reveal the full location
  - **Enchanted Map**: animated, shows a path that only appears under specific conditions (moonlight, rain, specific item held)
  - **Trapped Map**: the treasure is real but the location is guarded by traps and monsters placed by the original owner
- **Digging**: once at the marked location, use a shovel to dig (takes 3 turns); digging in the wrong spot yields nothing
- **Treasure Quality**: scales with map rarity — simple maps lead to modest gold, fragment maps lead to rare items, enchanted maps lead to legendary artifacts
- **Fake Maps**: some maps are forgeries sold by scammers; Perception check when buying, or discover it's fake after digging
- **Map Collection**: collected maps appear in a special journal section with visual representations
- **Competing Treasure Hunters**: some maps have NPCs also seeking the same treasure — race to get there first or negotiate a split

## Acceptance Criteria

- [ ] All map types are obtainable through their listed methods
- [ ] Riddle maps reference actual world landmarks
- [ ] Fragment maps require all pieces to complete
- [ ] Treasure quality scales with map rarity
- [ ] Fake maps are detectable and have appropriate consequences
