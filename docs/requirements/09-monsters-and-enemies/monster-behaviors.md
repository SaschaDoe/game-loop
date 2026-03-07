# Monster Behaviors

As a player, I want monsters to have distinct AI behaviors beyond simply chasing me, so that encounters feel varied and I need to adapt my strategy.

## Details

- Behavior types:
  - **Aggressive**: charges directly at the player
  - **Cautious**: keeps distance, attacks with ranged, retreats when low HP
  - **Ambusher**: hides in specific tiles (tall grass, shadows), attacks when player is adjacent
  - **Pack hunter**: weak alone but flanks and coordinates with nearby allies
  - **Territorial**: only attacks if player enters their zone, doesn't chase far
  - **Fleeing**: runs away when below 25% HP
  - **Summoner**: stays back and spawns minions
- Monsters react to environmental factors: flee from fire, avoid water (non-swimming types)
- Sleeping monsters can be avoided with stealth or attacked for bonus damage

## Acceptance Criteria

- [ ] Each behavior type is distinctly observable in gameplay
- [ ] Monsters react to environmental hazards
- [ ] Sleeping monsters can be sneaked past or ambushed
- [ ] Pack coordination is visible in multi-enemy encounters
