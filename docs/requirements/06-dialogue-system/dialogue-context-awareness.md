# Dialogue Context Awareness

As a player, I want NPCs to be aware of current world events and my recent actions during conversations, so that dialogue feels reactive and grounded in what's actually happening.

## Details

- LLM context includes: recent player actions, nearby events, time of day, weather, location
- If the player just killed a dragon, townsfolk should reference it
- NPCs near a crime scene react to it in conversation
- Weather and time affect dialogue: "Terrible storm tonight, eh?"
- NPCs in different locations have different knowledge of events (news travels slowly)
- Quest-relevant context is injected so NPCs can give hints naturally

## Acceptance Criteria

- [ ] NPCs reference recent major events in dialogue
- [ ] Location-specific context affects NPC knowledge
- [ ] Environmental conditions are reflected in conversation
- [ ] Quest-relevant hints emerge naturally in dialogue
