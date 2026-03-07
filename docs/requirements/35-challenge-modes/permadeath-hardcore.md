# Permadeath Hardcore

As a player, I want a true permadeath mode where death is permanent with no resurrection or save-scumming, so that every decision carries ultimate weight and survival feels earned.

## Details

- **Mode Selection**: chosen at character creation; cannot be toggled after starting; character marked with a skull icon to indicate hardcore status
- **Death Is Final**: when HP reaches 0, the character is permanently dead; no resurrection spells, no ghost realm return, no divine intervention; save file is locked (viewable but not loadable)
- **Save System**: game auto-saves every 10 turns; only one save slot per hardcore character; save-on-quit; loading the save deletes it (one load per save to prevent save-scumming); crash protection: if the game crashes, save is preserved
- **Death Memorial**: upon death, a memorial screen shows: character name, level reached, turns survived, enemies killed, quests completed, cause of death, and a procedurally generated epitaph (LLM); memorial saved to a "Hall of the Fallen" accessible from main menu
- **Hardcore Bonuses**: +25% XP gain, +15% gold find, +10% rare item drop rate; cosmetic skull aura on character; unique hardcore-only achievements and titles
- **Near-Death Warnings**: at 20% HP, screen flashes red; at 10% HP, heartbeat sound effect; at 5% HP, screen desaturates; these extra warnings help prevent accidental deaths
- **Legacy Transfer**: when a hardcore character dies, 10% of their gold transfers to the next hardcore character created on the same account (family inheritance); also unlocks one piece of "heirloom" equipment
- **Leaderboard**: hardcore characters ranked by turns survived, level reached, and achievements completed; global and friends-only leaderboards
- **Seasonal Hardcore**: special hardcore events with modified rules (no healing potions, double enemy damage, etc.); unique seasonal rewards for participation

## Acceptance Criteria

- [ ] Death permanently locks the save file with no recovery
- [ ] Save system prevents save-scumming with delete-on-load
- [ ] Death memorial generates correct statistics and epitaph
- [ ] Hardcore bonuses apply correctly throughout gameplay
- [ ] Legacy transfer calculates and applies correct inheritance
