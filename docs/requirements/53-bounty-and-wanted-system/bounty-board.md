# Bounty Board

As a player, I want a dynamic bounty board in every town that lists targets with scaling rewards, so that hunting has a structured progression with repeatable content.

## Details

- **Bounty Types**:
  - **Monster Bounty**: kill a specific creature or a quota of a species; proof required (trophy item drop)
  - **Bandit Bounty**: bring a named bandit leader to justice (alive or dead; alive = 50% more reward)
  - **Missing Person**: find and rescue a missing NPC; investigation + dungeon rescue
  - **Dangerous Beast**: a specific powerful creature terrorizing an area; unique spawn, mini-boss difficulty
  - **Fugitive**: an escaped criminal; track across multiple towns, may be disguised
  - **Monster Nest**: destroy a spawning nest/hive; stops enemy spawns in that area permanently
- **Bounty Difficulty**: ranked by stars (1-5); higher stars = more dangerous target, better reward
- **Dynamic Generation**: bounties are generated based on world state (monster population surges, recent crimes, NPC disappearances, seasonal threats)
- **Bounty Hunter Rank**: completing bounties earns Hunter XP; ranks: Novice → Journeyman → Expert → Master → Grandmaster
  - Higher rank: access to higher-star bounties, better base rewards, reputation with guards, bounty hunter guild perks
- **Time Limits**: some bounties expire if not completed quickly (fugitives escape, beasts migrate, victims die)
- **Competition**: other NPC bounty hunters may attempt the same bounty; race to complete first, or cooperate for shared (reduced) reward
- **Bounty Stacking**: take up to 3 active bounties at once; more with higher rank (up to 5 at Grandmaster)
- **Proof of Kill**: must bring trophy items (heads, hides, badges) to the bounty board to claim reward; forgery is possible (Charisma check, risky)

## Acceptance Criteria

- [ ] All bounty types generate with appropriate targets and rewards
- [ ] Dynamic generation reflects actual world state
- [ ] Bounty Hunter rank progression unlocks higher tiers
- [ ] Time limits and competition create urgency
- [ ] Proof of kill system validates completion
