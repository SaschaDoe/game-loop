# Endless Dungeon

As a player, I want an infinitely generating dungeon that gets progressively harder, so that I have an endless challenge mode for testing my build and pushing my limits.

## Details

- Accessible from a specific location in the world (The Abyss Gate)
- Procedurally generated floors with no bottom — goes forever
- Difficulty scales continuously: enemy stats increase 5% per floor
- Every 10 floors: a boss fight with a random boss from the game's roster (scaled up)
- Every 5 floors: a rest area with a merchant (prices increase with depth)
- Loot quality increases with depth: guaranteed rare at floor 20, epic at floor 50, legendary at floor 100
- Leaderboard: track deepest floor reached per character
- Death in the endless dungeon: respawn at the entrance (lose all loot found inside unless you escape first)
- Escape mechanic: use a rare Recall Stone to teleport out with your loot (consumed on use)
- Unique enemies: "Abyss-touched" variants of all monsters appear only in the endless dungeon
- Floor modifiers: random mutators each floor (low gravity, darkness, double enemies, no magic, etc.)

## Acceptance Criteria

- [ ] Dungeon generates infinitely with scaling difficulty
- [ ] Boss floors and rest areas appear at correct intervals
- [ ] Loot quality scales with depth
- [ ] Recall Stone escape mechanic functions
