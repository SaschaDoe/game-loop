# Environmental Traps

As a player, I want to use the dungeon's own features as improvised traps, so that trap-focused gameplay extends beyond crafted items.

## Details

- **Environmental Trap Types**:
  - **Rigged Chandelier**: cut the support rope; chandelier falls on anyone beneath (10 damage + pin); requires a blade and being adjacent to the rope
  - **Weakened Floor**: identify a weak floor tile (Perception check); lure enemies onto it; floor collapses into the level below (fall damage + separation from group)
  - **Oil Lamp Chain**: tip over oil lamps in a line; create a fire trail that ignites when any fire source touches it; hallway becomes an inferno
  - **Flooding Mechanism**: in water-adjacent areas, break a wall or open a valve; room floods over 5 turns; non-swimmers are trapped and drowning
  - **Stalactite Drop**: in caves, attack the ceiling above enemies; stalactites fall as AoE (2x2, 8 damage each); requires ranged attack aimed at ceiling
  - **Explosive Barrel Chain**: position explosive barrels (push them into place); detonate one to chain-react all; requires planning and positioning over multiple turns
  - **Bridge Sabotage**: weaken a bridge supports; enemies crossing cause it to collapse; requires tool + 3 uninterrupted turns of sabotage
  - **Lure and Lock**: lure enemies into a room; close and lock the door; they're trapped (can pound down the door in 10 turns); meanwhile you're free to explore elsewhere
- **Environmental Trap Skill**: subset of Trap Mastery; higher skill = better identification of exploitable features, faster setup, and more damage
- **Risk**: environmental traps can backfire (standing on the weak floor yourself, getting caught in the flood, fire spreading unpredictably)
- **Creative Bonus**: using an environmental trap that the game didn't explicitly design for (emergent from physics interactions) grants an "Ingenuity" XP bonus
- **NPC Awareness**: intelligent enemies also use environmental traps; watch for NPCs positioning near hazardous features
- Environmental traps cannot be set up in the same location twice (the feature is destroyed after use)

## Acceptance Criteria

- [ ] All environmental trap types trigger with correct effects
- [ ] Setup requirements (tools, time, positioning) are enforced
- [ ] Backfire risk applies when the player is in the danger zone
- [ ] Creative/emergent trap use grants bonus XP
- [ ] Enemies can use environmental traps against the player
