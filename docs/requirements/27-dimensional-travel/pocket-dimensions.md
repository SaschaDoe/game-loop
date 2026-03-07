# Pocket Dimensions

As a player, I want to discover or create small personal pocket dimensions that serve as portable hideouts and storage, so that dimensional magic has a practical utility application.

## Details

- **Pocket Dimension Discovery**: find existing pocket dimensions in: dimensional rifts, wizard tower experiments, Precursor facilities, or inside certain magical artifacts; each has unique properties based on its creator
- **Creating a Pocket Dimension**: requires Dimensional Magic 5+ and 3 rare materials (void crystal, reality anchor, dimension seed); ritual takes 30 turns; success creates a small personal dimension (20x20 tile room); failure creates an unstable dimension (collapses in 100 turns)
- **Pocket Dimension Properties**:
  - **Size**: starts at 20x20 tiles; expandable by feeding it mana crystals (each crystal adds 5x5 tiles); maximum size: 100x100 tiles
  - **Environment**: choose a theme when creating (cozy cabin, crystal cavern, floating island, library, garden); theme is cosmetic but affects ambient effects (garden grows herbs, library generates random books over time)
  - **Time Flow**: time inside can be faster or slower than outside; default is 1:1; adjustable at creation (2:1 means 2 turns pass inside for every 1 outside); useful for: accelerated crafting, rest, or research
  - **Access**: enter via a portal key (unique item, looks like a door handle); use the key on any flat surface to open a door to your dimension; key can be stolen (thief has access to your dimension!)
- **Pocket Dimension Uses**:
  - **Storage**: unlimited safe storage; items persist indefinitely; no theft risk (unless key is stolen)
  - **Crafting Workshop**: install workbenches, forges, enchanting tables; work in peace without interruption
  - **Rest Area**: safe rest with no ambush risk; campfire, bed, decorations; companion characters can be stationed here
  - **Prison**: lock NPCs inside your dimension (kidnapping mechanic); they can't escape without dimensional magic; morally very questionable
  - **Ambush Room**: lure enemies inside where you've set traps; close the door behind them; unfair but effective
- **Dimension Instability**: overloading a pocket dimension (too many items, too much size expansion, too many occupants) causes instability; warning signs: flickering walls, items vibrating, reality tears; ignoring warnings = dimension collapses (everything inside is lost to the void)
- **Dimension Raiders**: certain enemies (void creatures, dimensional parasites) can detect pocket dimensions and try to invade; must defend your dimension or lose its contents

## Acceptance Criteria

- [ ] Pocket dimension creation requires correct materials and skill level
- [ ] Size expansion works correctly with mana crystal feeding
- [ ] Time flow ratio correctly accelerates/decelerates internal processes
- [ ] Portal key access works on any flat surface with correct security risks
- [ ] Instability triggers at correct overload thresholds with correct warnings
