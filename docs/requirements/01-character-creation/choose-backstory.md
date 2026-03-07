# Choose Backstory

As a player, I want to select or write a backstory for my character, so that NPCs and quests can reference my character's history and motivations.

## Details

- Offer 5-6 premade backstory templates (e.g., "Exiled Noble", "Orphan Thief", "Wandering Scholar", "Disgraced Knight", "Escaped Cultist")
- Each backstory grants a minor starting bonus (extra gold, a unique item, a skill boost)
- Backstory influences initial NPC disposition and unlocks unique dialogue options via LLM
- Allow a free-text custom backstory field that is fed into the LLM context for NPC conversations
- The backstory is stored as part of the character profile

## Acceptance Criteria

- [ ] Premade backstories are selectable
- [ ] Starting bonuses from backstory are applied
- [ ] Custom free-text backstory is saved
- [ ] Backstory context is included in LLM prompts for NPC dialogue
