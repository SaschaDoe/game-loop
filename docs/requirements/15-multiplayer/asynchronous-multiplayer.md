# Asynchronous Multiplayer

As a player, I want to interact with other players' worlds asynchronously through messages, ghosts, and shared discoveries, so that the game feels connected without requiring real-time play.

## Details

- **Message System**: leave messages on the ground at any location (short text, 50 chars max); other players see these messages in their world
  - Helpful messages: "Trap ahead!", "Secret wall to the east", "Boss weak to fire"
  - Deceptive messages: "Safe path" (next to a trap) — reader can rate messages helpful/misleading
  - Message visibility: appears as a glowing rune tile (?) that can be read by stepping on it
- **Ghost Echoes**: occasionally see translucent ghosts of other players performing recent actions at the same location (walking paths, dying, fighting)
  - Deaths appear as bloodstains with a brief replay of how they died
  - Purely visual — cannot interact with ghosts
- **Shared Discovery Board**: when a player discovers a secret or completes a rare achievement, it appears on a global notice board in taverns
- **Gift System**: leave items at shrines for random other players to find; reciprocal karma system (giving = higher chance of receiving)
- **Bounty Board (Async PvP)**: post a bounty on your own character's AI ghost; other players fight it for rewards you set; if they lose, you get notified
- **World Seeds**: share world seed codes so others can play the same generated world
- **Leaderboards**: fastest boss kills, highest level, most secrets found, richest character — per world seed
- All async features work without a backend server — use peer-to-peer WebRTC or a lightweight serverless relay

## Acceptance Criteria

- [ ] Messages appear in other players' worlds at correct locations
- [ ] Ghost echoes display recent player actions
- [ ] Rating system filters helpful vs misleading messages
- [ ] Gift shrine system distributes items to other players
- [ ] All features function on serverless architecture
