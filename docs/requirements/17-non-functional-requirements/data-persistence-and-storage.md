# Data Persistence and Storage

As a player, I want my save data to persist reliably between sessions and survive browser updates, so that I never lose progress.

## Details

- Primary storage: IndexedDB for game saves (supports large data: maps, NPC memory, world state)
- Secondary storage: localStorage for settings and preferences
- Save data format: versioned JSON with a schema version number
- Migration system: when the game updates, old saves are automatically migrated to the new schema
- Export/import: player can export saves as a downloadable JSON file and import them on another device
- Storage quota management: warn the player if approaching browser storage limits
- Data integrity: checksum/hash on save data to detect corruption

## Non-Functional Targets

- Save data survives browser restarts, OS updates, and minor browser updates
- Maximum save file size: 5 MB per slot
- Migration from version N to N+1 completes in under 1 second

## Acceptance Criteria

- [ ] Saves persist across browser sessions
- [ ] Save data migration works when the schema changes
- [ ] Export/import produces valid, portable save files
- [ ] Storage quota warnings appear before data loss
