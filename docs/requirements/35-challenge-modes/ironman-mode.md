# Ironman Mode

As a player, I want an ironman mode where I cannot reload saves and every decision is permanent, so that the stakes feel real and every choice carries weight.

## Details

- Single auto-save slot that overwrites constantly (no manual save, no multiple slots)
- Saving occurs after every action (no save-scumming possible)
- Death is permanent: character and save are deleted
- No reloading previous saves; what's done is done
- Failed quests stay failed; killed NPCs stay dead; lost items are gone
- Ironman indicator displayed in the HUD (skull icon)
- Hall of Fame records all ironman characters: name, level, cause of death, playtime, achievements
- Ironman-exclusive rewards: unique title "Ironborn", special character border, bragging rights
- Crash protection: if the browser crashes, resume from the last auto-save (not exploitable — save is mid-state)

## Acceptance Criteria

- [ ] Only one auto-save slot exists in ironman mode
- [ ] Save occurs after every meaningful action
- [ ] Death permanently deletes the save
- [ ] Hall of Fame records completed and dead characters
