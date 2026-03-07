# Deployable Traps

As a player, I want to craft and place traps on the map to ambush enemies, so that I can use preparation and terrain control as an offensive strategy.

## Details

- Traps are craftable items placed on any walkable tile
- Trap types:
  - **Bear Trap**: immobilizes target for 3 turns, 8 damage (materials: iron + leather)
  - **Spike Pit**: 15 damage + slow, target falls into a pit for 1 turn (materials: wood + iron)
  - **Poison Cloud Trap**: releases poison gas in 3x3 area for 5 turns (materials: glass vial + nightshade)
  - **Fire Mine**: explodes on contact for 12 fire damage in 2x2 area (materials: oil + gunpowder + fuse)
  - **Frost Snare**: freezes target solid for 4 turns (materials: frost mint + crystal + string)
  - **Alarm Trap**: makes a loud noise, attracting all enemies in range toward the trap (materials: wire + bell)
  - **Net Trap**: entangles target, reducing all actions for 5 turns (materials: rope + iron hooks)
  - **Teleport Trap**: teleports target to a random location on the map (materials: mana crystal + rune)
- Traps are invisible to enemies unless they have high Perception
- Maximum 5 deployed traps at once; oldest despawns when placing a 6th
- Traps can be triggered by friendlies — careful placement required
- Ranger and Rogue classes get trap crafting bonuses (cheaper materials, stronger effects)
- Disarmed enemy traps can be collected and redeployed
- **Trap Upgrades** (learned through skill progression):
  - Reinforced: +50% damage, +2 turns duration
  - Camouflaged: enemies need +5 Perception to detect
  - Magnetic: pulls nearby enemies 1 tile toward the trap each turn
  - Twinned: placing one trap creates a second identical trap free on an adjacent tile
- **Environmental Traps**: use dungeon features as traps (rig a chandelier to fall, weaken a floor over a pit, block a doorway with oil)
- Trap crafting station in player housing allows batch production (craft 5 at once)
- Some monsters are trap-immune (flying creatures ignore ground traps, incorporeal creatures pass through)

## Acceptance Criteria

- [ ] All trap types are craftable from correct materials
- [ ] Traps trigger on enemy contact with correct effects
- [ ] Traps are invisible to enemies below Perception threshold
- [ ] Friendly fire from own traps is possible
