# World Boss Invasions

As a player, I want massive world bosses to occasionally invade the overworld, threatening towns and requiring community effort to defeat, so that the world feels alive with large-scale threats.

## Details

- **Invasion Frequency**: every 200-300 in-game days, a world boss spawns; 5-day warning period with NPC panic, refugee streams, military mobilization
- **World Boss Types**:
  - **The Colossus**: massive stone giant (occupies 5x5 tiles on map); stomps destroy buildings; marches toward the capital; must be attacked at specific weak points (knees, crystal heart)
  - **The Swarm King**: giant insect lord; spawns endless insectoid minions; spreads blight (kills vegetation, poisons water); must destroy its hive heart while it's distracted
  - **The Dread Fleet**: a fleet of ghost ships attacks coastal towns; spectral cannon fire, undead boarding parties; must sink the flagship
  - **The World Serpent**: burrows underground, surfaces to attack; earthquakes precede it; tail, body, and head are separate fight zones
  - **The Plague Herald**: flying creature that spreads disease over towns; rains poison; must be grounded with siege weapons before fighting
- **Participation System**: player contributes damage; rewards scale with contribution percentage
- **NPC Army**: guards, soldiers, and allied NPCs fight alongside the player; their survival affects the outcome
- **Town Destruction**: if the boss isn't defeated in time, it destroys the target town (shops lost, NPCs killed/displaced, rebuilding quests spawn)
- **Rewards**: legendary loot, massive gold, unique title ("Colossus Slayer"), permanent monument in the saved town
- **Aftermath**: destroyed terrain, NPC funerals for fallen soldiers, reconstruction economy boost
- World boss difficulty scales with the player's highest-level character (across legacies)

## Acceptance Criteria

- [ ] World bosses spawn on schedule with advance warning
- [ ] Multi-zone boss fights work correctly
- [ ] Contribution tracking calculates rewards fairly
- [ ] Town destruction occurs if the boss isn't defeated in time
- [ ] Aftermath events trigger post-boss (reconstruction, memorials)
