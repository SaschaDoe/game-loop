# Town Generation

As a player, I want to discover procedurally generated towns in the overworld, so that I have safe havens to trade, rest, and interact with NPCs.

## Details

- Towns vary in size: hamlet (3-5 buildings), village (6-12), city (13-25+)
- Buildings include: tavern, blacksmith, temple, market, guild hall, library, homes
- Each town has a unique name generated from a naming algorithm
- Towns have a population of NPCs with daily routines
- Town layout is procedural but logical (market in center, homes around edges)
- Towns have a reputation system; player actions affect how townsfolk react

## Acceptance Criteria

- [ ] Towns generate with appropriate buildings for their size
- [ ] NPCs populate towns and follow routines
- [ ] Town names are unique and pronounceable
- [ ] Player reputation affects NPC behavior in town

## See Also

This story is expanded and superseded by:
- [interconnected-open-world.md](interconnected-open-world.md) — US-OW-03 (starting locations as world locations), US-OW-06 (location entry/exit)
- [regional-cultures.md](regional-cultures.md) — culture-specific settlement styles per region
- [world-generation-algorithm.md](world-generation-algorithm.md) — US-WG-04 (settlement placement)
- [settlement-types.md](settlement-types.md) — detailed settlement type breakdown
