# World Creation Events

As a player, I want the procedurally generated world to have a unique creation history with pivotal events, so that every playthrough has its own mythology and backstory.

## Details

- **Procedural History Generation**: at world creation (based on seed), the system generates:
  - **Creation Era**: how the world was formed (from a dying god, from elemental chaos, dreamed by a sleeping titan, sung into existence by celestials)
  - **First Age**: the primordial races (which race was first, who built the first city, what magic was discovered)
  - **Great Catastrophe**: a world-shaping disaster (the Sundering, the Flood, the Dragon Wars, the Mana Collapse) that ended the First Age
  - **Second Age**: recovery, new civilizations, current faction origins, the founding of major cities
  - **Recent History**: 100 years of events leading to the present; wars, discoveries, disasters, heroes
- **History Affects the World**:
  - Creation method affects which elemental magic is strongest
  - First race determines which ruins are most common
  - Great Catastrophe leaves physical scars on the map (massive crater, flooded lowlands, magical dead zones, dragon bone fields)
  - Second Age factions determine current political landscape
  - Recent history affects NPC attitudes and active conflicts
- **Discovery**: history is learned through: lore books, NPC stories, ancient inscriptions, historical sites, prophetic visions
- **Timeline View**: codex feature showing events in chronological order; gaps fill in as the player discovers more
- **History Quests**: some quests involve uncovering forgotten history (what really caused the Great Catastrophe, where the first city was, who betrayed the hero)
- **Revisiting History**: time rifts (see time-rifts) allow visiting historical events firsthand
- Each world seed generates a unique creation narrative that LLM uses to inform all NPC dialogue and lore

## Acceptance Criteria

- [ ] World seed generates a consistent multi-era history
- [ ] Historical events have visible effects on the game world
- [ ] History is discoverable through multiple sources
- [ ] Timeline view populates as history is uncovered
- [ ] LLM uses generated history to inform NPC dialogue
