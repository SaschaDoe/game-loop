# Gadget Crafting

As a player, I want to craft magical gadgets that replicate spell effects without requiring mana, so that non-magic classes have access to utility abilities through engineering.

## Details

- **Gadget Types**:
  - **Grappling Hook Launcher**: launch a hook up to 8 tiles; pull yourself to walls/ceilings or pull small enemies to you; 5 uses before reloading
  - **Arcane Lantern**: reveals invisible creatures and hidden doors in a 6-tile radius; toggle on/off; consumes arcane oil
  - **Gravity Inverter**: reverses gravity for all creatures in a 4x4 area for 3 turns; they "fall" to the ceiling and take damage; 1 use per rest
  - **Tesla Coil**: deployable device; zaps the nearest enemy each turn for lightning damage; chain-zaps in water; 10-turn battery
  - **Pocket Forge**: portable crafting station; can repair equipment and smelt ore anywhere; consumes fuel
  - **Mind Lens**: read surface thoughts of target NPC (reveals their disposition, hidden quest info, and whether they're lying); 3 uses per day
  - **Chrono Anchor**: set a temporal bookmark; activate again within 20 turns to rewind to that exact state (HP, position, enemies); single use, expensive to craft
  - **Smoke Screen Generator**: fills a 5x5 area with smoke for 8 turns; blocks line of sight; allies with goggles can see through
- **Crafting Requirements**: Artificer skill + components (gears, crystals, wires, arcane cores, lenses)
- **Gadget Charges**: most gadgets have limited uses; recharged at workbenches with appropriate materials
- **Malfunction Risk**: gadgets have a reliability rating; low-quality components = higher malfunction chance (backfire, explode, break)
- **Invention Discovery**: some gadgets are learned from blueprints; others discovered by experimenting with unusual component combinations
- Gadgets occupy equipment slots (belt, backpack); maximum 4 equipped gadgets at once

## Acceptance Criteria

- [ ] All gadget types function with correct effects
- [ ] Charge system limits usage and recharging works
- [ ] Malfunction risk scales with component quality
- [ ] Gadget discovery through experimentation works
- [ ] Equipment slot limit is enforced
