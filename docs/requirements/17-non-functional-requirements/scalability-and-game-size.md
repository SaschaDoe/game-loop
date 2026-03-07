# Scalability and Game Size

As a player, I want the game to handle large worlds and long playthroughs without degrading performance, so that the experience stays smooth no matter how far I progress.

## Details

- World state should handle: 500+ explored map tiles, 100+ NPC memory entries, 50+ active quests
- Map generation for a new level completes in under 100ms
- NPC memory trimming: automatically prune old, low-importance memories to keep context manageable
- Lazy loading: only the current area's data is in active memory; other areas are stored in IndexedDB
- Quest log performance: searching 100+ quests returns results in under 50ms
- No memory leaks: heap stays stable over hours of play (no unbounded growth)
- Stress tested with maximum-size worlds and deep dungeon runs

## Non-Functional Targets

- Smooth gameplay after 1000+ turns
- Memory usage stays under 100 MB even in late-game
- No performance difference between level 1 and level 50

## Acceptance Criteria

- [ ] Game runs smoothly after 1000+ turns without memory growth
- [ ] Large world states save/load without noticeable delay
- [ ] NPC memory pruning keeps context size bounded
- [ ] No performance degradation in late-game content
