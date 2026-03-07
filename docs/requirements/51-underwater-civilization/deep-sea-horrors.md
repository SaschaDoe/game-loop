# Deep Sea Horrors

As a player, I want the deepest ocean zones to contain eldritch horrors and crushing pressure, so that deep-sea exploration feels like descending into alien terror.

## Details

- **Depth Zones** (each deeper zone is more dangerous):
  - **Sunlight Zone** (0-50 tiles deep): normal fish, coral, merfolk; safe; full visibility
  - **Twilight Zone** (50-100): reduced light, aggressive predators, currents; pressure tier 1 gear needed
  - **Midnight Zone** (100-200): total darkness except bioluminescence; giant creatures; pressure tier 2 gear; sanity drain starts
  - **Abyssal Zone** (200-300): alien landscape; thermal vents, bizarre life forms; pressure tier 3 gear; heavy sanity drain; no normal compass (navigation by landmarks only)
  - **Hadal Zone** (300+): the deepest trenches; eldritch territory; pressure tier 4 gear (legendary); constant sanity drain; ancient horrors await
- **Deep Sea Creatures**:
  - **Anglerfish Titan**: massive bioluminescent lure; lure appears as a treasure chest or friendly NPC; if approached, massive bite (one-hit potential); ambush predator
  - **Pressure Wraith**: creature adapted to crushing depth; its presence causes pressure to spike (damage even with gear); intangible except when attacking; weak to light
  - **Living Trench**: a section of the ocean floor that is alive; tendrils grab from below; pulls you deeper; must escape by cutting free before being swallowed
  - **The Dreaming One**: endgame ocean boss; a sleeping entity whose dreams warp reality in the hadal zone; fighting it means fighting its nightmare projections; waking it is catastrophic (world event)
  - **Bioluminescent Swarm**: thousands of tiny lights that move as one; beautiful but deadly; drains mana on contact; disperses with AoE attacks
- **Pressure Damage**: without appropriate tier gear, deeper zones deal escalating crush damage per turn; tier 1 protects to 100 tiles, tier 2 to 200, etc.
- **Deep Sea Loot**: abyssal pearls (legendary crafting), pressure-forged metals (hardest materials in the game), eldritch artifacts (powerful + sanity-draining)
- **Point of No Return**: some deep-sea areas have one-way currents; must find an alternate exit or use teleportation to leave

## Acceptance Criteria

- [ ] Depth zones apply correct pressure tiers and environmental effects
- [ ] Deep sea creatures have unique and terrifying behaviors
- [ ] Pressure damage escalates without appropriate gear
- [ ] Sanity drain scales with depth
- [ ] Deep sea loot is appropriately powerful and rare
