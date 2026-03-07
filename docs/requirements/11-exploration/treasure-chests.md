# Treasure Chests

As a player, I want to find and open treasure chests scattered throughout dungeons, so that exploration directly rewards me with loot.

## Details

- Chest types: wooden (common loot), iron (uncommon), gold (rare), enchanted (epic+)
- Some chests are locked: require a key, lockpicking skill, or force (damages contents)
- Some chests are trapped: opening triggers a trap (detect first to disarm)
- Mimics: rare monster disguised as a chest that attacks when interacted with
- Chest loot is generated based on dungeon level and chest type
- Chests have distinct ASCII symbols and colors by type

## Acceptance Criteria

- [ ] All chest types appear with appropriate frequency
- [ ] Locked chests require correct interaction to open
- [ ] Trapped chests trigger hazards if not disarmed
- [ ] Mimics attack when the player attempts to open
