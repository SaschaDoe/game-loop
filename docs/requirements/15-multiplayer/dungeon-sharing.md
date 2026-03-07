# Dungeon Sharing

As a player, I want to create custom dungeons and share them with other players, so that the community can build and play each other's challenges.

## Details

- **Dungeon Editor**: unlocked after completing the main story; ASCII-based map editor
  - Place tiles: walls (#), floors (.), doors (+), water (~), lava (^), traps, stairs
  - Place enemies: choose from bestiary, set patrol routes, assign loot
  - Place items: treasures, keys, switches, puzzle elements
  - Place NPCs: merchants, quest givers, dialogue NPCs (write their dialogue)
  - Set rules: time limit, no-magic zones, darkness, special modifiers
- **Dungeon Validation**: editor verifies the dungeon is completable (path from entrance to exit exists, required keys are obtainable)
- **Sharing**: export dungeon as a shareable code (base64 encoded JSON); import via code in the main menu
- **Rating System**: players rate dungeons 1-5 stars after completing; top-rated dungeons appear on a community board
- **Dungeon Categories**: combat challenge, puzzle focus, exploration, horror, speedrun, story-driven
- **Creator Rewards**: when other players complete your dungeon, you earn "Creator XP" that unlocks more editor features (more tile types, more enemy types, scripted events)
- **Weekly Challenge**: a curated community dungeon is featured each week with special rewards for completion
- **Dungeon Size Limits**: small (20x20), medium (50x50), large (100x100); larger sizes require higher Creator XP
- Share codes are compact enough to fit in a URL parameter for easy sharing

## Acceptance Criteria

- [ ] Dungeon editor allows placement of all listed element types
- [ ] Validation confirms dungeons are completable
- [ ] Export/import via shareable codes works
- [ ] Rating system tracks and displays community scores
- [ ] Creator XP unlocks additional editor features
