# NPC Memory

As a player, I want NPCs to remember my previous interactions with them, so that conversations build over time and feel like real ongoing relationships.

## Details

- NPCs remember: topics discussed, promises made, quests given/completed, gifts received
- Memory is stored as structured data and injected into LLM context
- NPCs reference past conversations naturally: "Last time you mentioned looking for the crystal..."
- If player breaks a promise, NPC remembers and trust decreases
- NPCs have limited memory capacity; older memories fade unless very significant
- Important events (saving their life, betraying them) are permanent memories

## Acceptance Criteria

- [ ] NPCs reference previous conversations accurately
- [ ] Broken promises affect trust and dialogue
- [ ] Memory persists across save/load cycles
- [ ] Significant events are permanently remembered
