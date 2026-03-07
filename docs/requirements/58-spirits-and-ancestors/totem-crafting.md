# Totem Crafting

As a player, I want to carve and empower animal totems that grant passive bonuses and summon spirit animals, so that shamanic crafting has a unique collectible system.

## Details

- **Totem Types** (each grants a passive + an activatable):
  - **Bear Totem**: passive +3 CON, +10 max HP; activate: bear spirit charges through enemies (line AoE, knockback)
  - **Eagle Totem**: passive +3 Perception, see 2 extra tiles; activate: eagle spirit scouts ahead (reveals 20-tile radius for 10 turns)
  - **Wolf Totem**: passive +2 to ally damage when adjacent to companions; activate: wolf pack spirit (3 spectral wolves fight for 8 turns)
  - **Snake Totem**: passive poison resistance, +2 DEX; activate: snake spirit bites target (high poison damage, ignores armor)
  - **Turtle Totem**: passive +4 armor when standing still; activate: turtle shell (complete damage immunity for 2 turns, can't move)
  - **Raven Totem**: passive +2 INT, detect lies; activate: raven spirit steals a random item from target enemy
  - **Stag Totem**: passive +3 movement speed; activate: stag spirit carries you 10 tiles in any direction instantly (escape or charge)
  - **Salmon Totem**: passive swim speed doubled, water breathing 50 turns; activate: upstream leap (jump over obstacles, 5 tiles, ignoring terrain)
- **Crafting Process**: carve from specific wood (each totem needs its animal's native biome wood) + empower with spirit essence (gathered in spirit world) + consecrate at an ancestor shrine
- **Totem Slots**: can equip 2 totems at once (belt slots); switching takes 1 turn
- **Totem Leveling**: using a totem's activate ability earns totem XP; higher level = stronger passive bonus and more powerful activation
- **Totem Resonance**: equipping 2 complementary totems creates a resonance bonus:
  - Bear + Turtle: "Immovable" — immune to knockback and forced movement
  - Eagle + Raven: "All-Seeing" — detect invisible + see through walls within 5 tiles
  - Wolf + Stag: "Pack Runner" — allies gain +2 movement speed
- **Master Totem** (endgame): combine all 8 totems into a Master Totem; grants all passives at half strength; activate summons all 8 spirit animals simultaneously
- Totems have a unique carved ASCII art appearance in the inventory

## Acceptance Criteria

- [ ] All totem types grant correct passives and activatables
- [ ] Crafting requires correct biome-specific materials
- [ ] Totem leveling strengthens effects with use
- [ ] Resonance bonuses activate for correct totem pairs
- [ ] Master Totem combines all effects at reduced strength
