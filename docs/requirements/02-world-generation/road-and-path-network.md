# Road and Path Network

As a player, I want the world to have roads connecting towns, hidden trails through wilderness, and dangerous shortcuts, so that travel has meaningful route choices.

## Details

- **Road Types**:
  - **Main Roads** (=): wide, well-maintained, connect major towns; faster travel speed (+50%), patrolled by guards, merchant caravans pass regularly
  - **Dirt Paths** (-): connect smaller settlements and points of interest; normal travel speed, occasional travelers
  - **Hidden Trails** (.): discovered via Perception check or NPC tip; cut through wilderness, shorter but no patrols
  - **Dangerous Shortcuts**: marked trails through monster territory; much shorter but high encounter rate
- **Road Events** (random while traveling):
  - Merchant caravan (trade opportunity)
  - Bandit ambush (combat or pay toll)
  - Broken cart (help for reputation/reward or ignore)
  - Fellow traveler (LLM conversation, may share rumors or be a disguised threat)
  - Road shrine (pray for a small buff)
- **Road Condition**: weather affects roads (rain = mud = slower travel on dirt paths; snow blocks mountain passes)
- **Signposts**: at crossroads, show distances to nearby towns; some are vandalized or misleading (pranksters/bandits)
- **Milestones**: stone markers along main roads every 10 tiles; resting at one is safer than open wilderness
- Roads are generated procedurally to connect all towns in a minimum spanning tree, with extra paths for loops
- Off-road travel: 50% slower in forests, 75% slower in swamps, impossible in mountains without climbing

## Acceptance Criteria

- [ ] All road types generate connecting settlements correctly
- [ ] Road events trigger with appropriate frequency
- [ ] Weather affects road traversal speed
- [ ] Signposts and milestones are placed at correct intervals
- [ ] Off-road speed penalties apply per terrain type

## See Also

This story is expanded and superseded by:
- [interconnected-open-world.md](interconnected-open-world.md) — US-OW-05 (roads and paths)
- [world-generation-algorithm.md](world-generation-algorithm.md) — US-WG-05 (road network generation)
