# Harvest Festival

As a player, I want to participate in an autumn harvest festival with themed activities, competitions, and exclusive rewards, so that seasonal events create memorable community gameplay.

## Details

- **Festival Duration**: 30 turns during autumn season; all towns celebrate simultaneously; festive decorations appear on town maps (bunting, haystacks, pumpkins, lanterns)
- **Festival Activities**:
  - **Pie Eating Contest**: CON-based; eat as many pies as possible before getting sick; rounds escalate (each pie harder to stomach); winner gets "Iron Stomach" title + cooking recipe
  - **Pumpkin Carving**: DEX + artistry; carve an ASCII pumpkin face; LLM judges creativity; winner's pumpkin displayed in town square for the season
  - **Scarecrow Building**: build a scarecrow from available materials; functional scarecrows can be placed on your farm (deters birds/pests for the season); decorative ones judged for style
  - **Corn Maze**: navigable mini-dungeon; race to find the exit; hidden prizes inside (seasonal items, gold); gets harder each year (longer, more dead ends)
  - **Harvest Dance**: social event; dance with NPCs (CHA check for smooth moves); high approval NPCs may confess feelings or reveal secrets during the dance; +reputation with dance partners
  - **Apple Bobbing**: DEX-based; grab floating apples; some apples are enchanted (random minor buff for 50 turns); golden apple grants a wish (minor — restore HP, free item identification, reveal map area)
- **Festival Merchants**: special vendors sell seasonal items only available during the festival:
  - Pumpkin Helm: cosmetic + minor fire resistance
  - Autumn Cloak: +2 CHA during autumn, keeps warm in cold weather
  - Cornucopia: container that slowly generates food (1 ration per 50 turns)
  - Festival Fireworks: consumable; dazzling display that boosts party morale + stuns enemies if used in combat
- **Community Harvest**: town-wide quest to bring in the harvest before the frost; all players and NPCs contribute; meeting the quota = town prosperity bonus (better shops, lower prices) for the next season; failing = food shortage and higher prices
- **Festival Memories**: completing all activities in one festival grants "Festival Champion" achievement; LLM generates a personalized festival memory entry in the player's journal

## Acceptance Criteria

- [ ] Festival triggers during correct autumn turn range
- [ ] All activities use correct skill checks and produce correct rewards
- [ ] Festival merchants stock correct seasonal exclusives
- [ ] Community harvest quest tracks contributions and produces correct town effects
- [ ] Festival Champion achievement requires completing all activities
