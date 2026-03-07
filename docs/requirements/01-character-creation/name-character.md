# Name Character

As a player, I want to name my character, so that NPCs and the game world address me by name.

## Details

- Free-text input for character name
- Name is used in dialogue, quest logs, and the HUD
- Optional: offer a random name generator based on selected race
- Validate name length (2-24 characters) and block empty names
- Name is passed to LLM context so NPCs use it naturally in conversation

## Acceptance Criteria

- [ ] Player can enter a custom name
- [ ] Random name generator works per race
- [ ] Name appears in HUD, dialogue, and quest journal
- [ ] Name validation prevents invalid entries
