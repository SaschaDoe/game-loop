# LLM-Powered Conversations

As a player, I want to have free-form conversations with NPCs powered by an LLM, so that I can ask anything, say anything, and receive believable, contextual responses.

## Details

- Player types free-text input when talking to an NPC
- LLM receives context: NPC personality, memories, current situation, world state, player info
- Responses are generated in-character with appropriate tone, vocabulary, and knowledge
- NPCs only know what they would realistically know (a farmer doesn't know ancient magic lore)
- Conversations can reveal quest hooks, lore, secrets, and emotional depth
- Rate limiting / caching to manage API costs
- Fallback responses if LLM is unavailable (pre-written generic dialogue)
- Content filtering to keep responses appropriate for the game's tone

## Acceptance Criteria

- [ ] Player can type any message to an NPC and receive a contextual response
- [ ] NPC responses reflect their personality and knowledge boundaries
- [ ] Conversation context (memories, world state) is correctly injected
- [ ] Fallback dialogue works when LLM is unavailable
