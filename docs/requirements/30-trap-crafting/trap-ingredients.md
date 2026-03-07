# Trap Ingredients

As a player, I want to gather and combine specific ingredients to craft a wide variety of traps, so that trap-making is a crafting system with its own resource loop.

## Details

- **Base Components**:
  - **Mechanism**: spring (metal + forge), tripwire (silk/string + tension hook), pressure plate (stone slab + spring), proximity rune (arcane ink + crystal)
  - **Container**: wooden box (planks + nails), clay pot (clay + kiln), glass vial (sand + furnace), leather pouch (hide + cord)
  - **Payload Material**: oil (flammable — fire trap), acid (corrosive — damage trap), glue (sticky — immobilize trap), smoke powder (obscuring — smoke trap), nails/caltrops (metal + forge — spike trap), poison (various — poison trap), flash powder (blinding — stun trap)
- **Trap Recipes**:
  - **Bear Trap**: spring + metal jaws + chain; STR save or immobilized + 15 damage; reusable 3 times
  - **Tripwire Alarm**: tripwire + bell; no damage; alerts player to approaching creatures; useful for camp security
  - **Oil Slick + Spark**: oil pouch + flint trigger; creates a burning zone (5 damage/turn, 5 turns); 3-tile area
  - **Poison Dart Trap**: spring mechanism + poison dart + pressure plate; single target, poison damage + status effect based on poison type
  - **Pit Trap**: dig (requires shovel, 5 turns) + cover (leaves/cloth); creature falls in (fall damage + trapped until climbing out); can add spikes (extra damage) or water (drowning risk)
  - **Net Trap**: rope net + spring mechanism + trigger; entangles target (STR save to escape, 3 attempts); useful for capturing alive
  - **Explosive Trap**: volatile alchemical + container + trigger; AoE damage (15-40 based on explosive quality); 4-tile radius; destroys the trap
  - **Rune Trap**: arcane ink + focus crystal + trigger; spell effect on activation (freeze, shock, fear, teleport); effect depends on rune drawn
- **Ingredient Sources**: buy from merchants, loot from enemies, harvest from environment (silk from spiders, oil from fat creatures, poison from venomous creatures, metal from ore deposits)
- **Crafting Skill**: Trap Crafting skill determines success rate, trap quality, and advanced recipe access; failed crafting wastes 50% of materials
- **Disassembly**: disassemble enemy traps to recover 30-60% of ingredients (skill-dependent)

## Acceptance Criteria

- [ ] All base components combine into correct trap types
- [ ] Each trap triggers with correct damage and effects
- [ ] Ingredient sources provide correct materials from correct locations
- [ ] Crafting skill affects success rate and quality appropriately
- [ ] Disassembly returns correct percentage of materials
