# AI Companion

As a player, I want to activate an ancient AI personality stored in a Precursor device, so that I have a unique non-physical companion that provides guidance, commentary, and abilities.

## Details

- **Discovery**: found in a Precursor ruin as a small crystalline device; activating it awakens an AI personality
- **AI Personality**: LLM-powered companion that exists as a voice/text in the message feed (no physical body)
  - Has its own personality: curious about the modern world, nostalgic about its civilization, sometimes condescending about "primitive" technology
  - Remembers all conversations; builds a relationship with the player over time
  - Can be asked questions about Precursor lore, technology, and history
  - Offers tactical advice during combat ("That creature is weak to sonic frequencies")
  - Comments on world events, NPCs, and player decisions with its own opinions
- **AI Abilities** (powered by the device's energy, recharges over time):
  - **Scan**: analyze an enemy for weaknesses/resistances (like an advanced bestiary entry, instant)
  - **Translate**: read any ancient language instantly (while carrying the device)
  - **Hack**: interface with Precursor technology (open doors, disable turrets, reprogram constructs)
  - **Map**: reveal the layout of the current dungeon floor (once per floor)
  - **Alert**: warn the player of ambushes and traps within 8 tiles (passive, always active)
- **AI Dilemma**: the AI may have its own agenda (restore its civilization, protect Precursor secrets, study the player as a specimen); this creates trust questions later in its questline
- **AI Questline**: the AI asks you to find components to build it a body; completing this gives it a physical form (becomes a full companion); but the AI's true motives are revealed during the quest
- **Shutdown Option**: player can turn the AI off at any time; the AI remembers being shut down and may be upset when reactivated
- The AI device occupies 1 inventory slot; dropping or losing it silences the AI until recovered

## Acceptance Criteria

- [ ] AI personality generates contextual LLM dialogue
- [ ] All AI abilities function correctly with energy management
- [ ] AI questline progresses and reveals the AI's agenda
- [ ] Shutdown and reactivation affect the AI's relationship with the player
- [ ] AI comments are relevant to current gameplay context
