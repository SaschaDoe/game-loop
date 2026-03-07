# Woodcutting and Lumber

As a player, I want to chop trees for wood and process lumber for building and crafting, so that forestry is a gathering profession alongside mining and herbalism.

## Details

- **Tree Types** (biome-specific, different yields):
  - **Oak** (temperate forest): common, sturdy wood; used in basic construction and weapon handles
  - **Pine** (tundra/mountains): light, flexible; used in bows, arrows, ship masts
  - **Ironwood** (deep forest, rare): extremely hard; used in shields, heavy weapons, reinforced structures; takes 3x longer to chop
  - **Ghostwood** (haunted areas): pale, cold to touch; used in necromancy staves, spectral items; whispers when cut
  - **Sunwood** (high altitude, clear weather): golden wood; absorbs sunlight; used in holy items, light sources, fire-resistant construction
  - **Darkwood** (underground, cave forests): grows without light; absorbs darkness; used in stealth items, shadow weapons; lightweight
- **Woodcutting Process**: approach a tree tile, use axe; 2-4 turns per tree depending on tree type and axe quality; yields logs
- **Processing**: logs → planks (at sawmill or with saw); planks → refined wood (at workbench); each processing step adds crafting versatility
- **Woodcutting Skill**: higher skill = faster chopping, better yield, chance for rare materials (amber, sap, bird nests with eggs, carved messages)
- **Ecological Impact**: trees regrow after 200 turns; clear-cutting a large area angers druids and nature spirits; may trigger treant attack
- **Furniture Crafting**: use processed wood to build furniture for player housing (bed, table, storage chests, weapon racks)
- **Forestry Quests**: clear-cut for a town (expand territory), thin overgrown forests (improve road visibility), protect ancient trees from loggers
- Wood is also fuel: firewood for campfires and forges

## Acceptance Criteria

- [ ] All tree types yield correct wood variants per biome
- [ ] Woodcutting skill affects speed, yield, and rare finds
- [ ] Processing chain (log → plank → refined) works at correct stations
- [ ] Ecological impact triggers from excessive cutting
- [ ] Furniture crafting produces placeable objects for housing
