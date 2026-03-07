# Temporal Paradoxes

As a player, I want time travel actions to create paradoxes with real gameplay consequences, so that meddling with the timeline is powerful but dangerous.

## Details

- **Paradox Generation**: occurs when player actions in the past contradict the present (saving someone who died, destroying something that exists, meeting your past self)
- **Paradox Types**:
  - **Bootstrap Paradox**: an item or information exists only because you brought it from the future; item has a "temporal shimmer" visual; if the loop is broken (item destroyed in either timeline), both versions vanish
  - **Grandfather Paradox**: killing or preventing the birth of an NPC whose descendants exist in the present; affected NPCs flicker in and out of existence; world events they influenced become unstable (quests may fail or succeed randomly)
  - **Predestination Paradox**: your attempt to prevent an event actually causes it; LLM narrates how your prevention attempt backfires; teaches that some events are fixed points
  - **Temporal Duplicate**: meeting your past self; both versions can fight together briefly (powerful but unstable); after 10 turns, reality corrects itself (one version vanishes, 50% chance it's you — save vs temporal erasure)
  - **Causality Loop**: an NPC gives you a quest because of something you did in the past, which you did because of the quest; loop is stable until disrupted; disruption causes localized time storm
- **Paradox Meter**: tracks cumulative paradox severity (0-100); mild paradoxes add 5-10, severe ones add 20-40
- **Paradox Consequences by Severity**:
  - 0-25: minor visual glitches, temporal echoes (hear sounds from other timelines)
  - 26-50: NPCs occasionally speak in future tense about past events; items briefly duplicate; -1 to all mental stats
  - 51-75: temporal storms spawn in random locations (damage + teleport); timelines bleed (encounter NPCs from alternate pasts); -2 all stats
  - 76-100: reality fracture — the world begins collapsing; a Temporal Guardian boss spawns hunting the player; must resolve paradoxes or face game over
- **Paradox Resolution**: visit temporal nexus points to "stabilize" the timeline; costs rare temporal crystals; some paradoxes can be resolved by completing their logical loop
- **Fixed Points**: certain world events cannot be changed; attempting to alter them auto-fails with a dramatic narration of why

## Acceptance Criteria

- [ ] All paradox types trigger from correct player actions
- [ ] Paradox meter tracks severity and produces correct effects
- [ ] Temporal duplicates function in combat with instability timer
- [ ] Paradox resolution mechanics work at nexus points
- [ ] Fixed points resist alteration with appropriate narrative
