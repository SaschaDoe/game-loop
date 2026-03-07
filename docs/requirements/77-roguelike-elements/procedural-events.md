# Procedural Events

As a player, I want random world events to occur that reshape the game state unpredictably, so that each playthrough feels unique and reactive.

## Details

- **Event Frequency**: one major event every 300-500 turns; minor events every 50-100 turns; frequency modified by world seed and player actions
- **Major Events**:
  - **Dragon Awakening**: an ancient dragon wakes from millennia of sleep; terrorizes a region; towns evacuate; dragon must be confronted or appeased; reshapes regional politics
  - **Planar Breach**: a rift to another dimension opens; extraplanar creatures flood through; area around rift becomes corrupted; closing the rift requires a specific quest chain; rare resources available near rift
  - **Civil War**: a kingdom splits into factions; player must choose a side or stay neutral; battles across the region; quest lines for each faction; political map changes permanently based on outcome
  - **Magical Catastrophe**: a mage experiment goes wrong; wild magic zone expands; random spell effects in the area; all magic is unstable; quest to contain or harness the wild magic
  - **Undead Rising**: mass resurrection event; graveyards disgorge undead; towns under siege; necromancer boss behind it; holy characters get bonus power during the event
  - **Cosmic Alignment**: stars align; all magic amplified (+25% spell power); certain sealed locations open; prophecy-related quests activate; once-in-a-playthrough celestial event
  - **Great Migration**: massive monster horde migrates through the region; not hostile unless provoked; disrupts travel routes; hunting opportunities; some creatures are rideable if tamed during migration
- **Minor Events**:
  - Merchant caravan arrives with rare goods
  - NPC duel in town square (spectate, bet, or intervene)
  - Traveling bard performs (listen for quest hints and lore)
  - Bandit raid on a nearby farm (help or ignore)
  - Rare celestial phenomenon (shooting stars grant wishes if you find where they land)
  - Wandering mini-boss appears in the wilderness
  - Festival/fair in a random town
- **Event Consequences**: major events permanently alter the world; destroyed towns stay destroyed; shifted borders persist; NPCs killed in events are gone; player's response (or non-response) affects reputation and future event likelihood
- **Event Chains**: some events trigger follow-up events (dragon awakening may lead to dragon cult uprising; civil war may lead to foreign invasion of the weakened kingdom)

## Acceptance Criteria

- [ ] Major events trigger at correct frequency with correct world-altering effects
- [ ] Minor events trigger at correct frequency with appropriate rewards
- [ ] Event consequences persist permanently in the world state
- [ ] Event chains trigger follow-up events based on outcomes
- [ ] World seed determines event selection for replayability
