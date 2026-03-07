# Cooperative Play

As a player, I want to invite a friend to explore the same world with me cooperatively, so that we can adventure together, fight enemies, and share the experience.

## Details

- Host player creates a session; friend joins via session code
- Both players exist on the same map and can see each other
- Shared enemies: both players can attack the same monsters
- Loot is instanced per player (no fighting over drops)
- Shared quest progress for quests both players have active
- Chat system for communication (text-based, in the message feed)
- If one player dies, they respawn at the nearest town (no permadeath in co-op)
- Host controls world state; guest's changes persist only while connected

## Acceptance Criteria

- [ ] Session creation and joining works reliably
- [ ] Both players render and interact on the same map
- [ ] Combat works with multiple players
- [ ] Chat system is functional
