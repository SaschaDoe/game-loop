# Dimension-Hopping Consequences

As a player, I want frequent dimensional travel to have cumulative side effects on my character, so that dimension-hopping carries meaningful risk and isn't a free fast-travel system.

## Details

- **Dimensional Instability**: each portal transit increases "Instability" counter by 1; counter decays by 1 per 100 turns spent in one dimension
- **Instability Effects** (cumulative):
  - **Level 1-5**: cosmetic flickers (character sprite briefly shifts/glitches); minor dialogue option: "You look... different"
  - **Level 6-10**: dimensional echoes — shadows of alternate-dimension selves appear briefly; disorienting but harmless; -1 Perception
  - **Level 11-15**: reality bleed — objects from other dimensions briefly appear (phantom items, ghostly structures); can sometimes interact with them for unique items; -2 Perception, occasional random teleport (1-3 tiles)
  - **Level 16-20**: severe instability — character phases in and out of reality; 10% chance per turn to become intangible (can't attack or be attacked for 1 turn); -3 Perception, -1 to all stats; NPCs refuse to interact ("You're not fully here")
  - **Level 21+**: dimensional rift — a permanent portal fragment lodges in the character; random creatures from other dimensions emerge near you (sometimes helpful, usually hostile); stable NPC interaction impossible without stabilization
- **Stabilization**: visit a dimensional anchor (rare fixed points in each dimension); costs 500 gold per instability level reduced; or find a "Reality Anchor" artifact (reduces instability by 1 per 50 turns passively)
- **Dimensional Adaptation**: characters who spend 200+ turns in an alternate dimension gain "Adapted" status; reduced instability gain from that specific dimension; some dimensions grant adaptation bonuses (fire dimension = fire resistance)
- **Permanent Changes**: at Instability 25+, some dimensional effects become permanent traits (can be positive or negative); adds to character uniqueness

## Acceptance Criteria

- [ ] Instability counter tracks correctly with correct decay rate
- [ ] Each instability level applies correct effects
- [ ] Stabilization reduces instability at correct cost
- [ ] Dimensional adaptation triggers after correct time spent
- [ ] Permanent changes apply at correct threshold
