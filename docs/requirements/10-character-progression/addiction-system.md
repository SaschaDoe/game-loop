# Addiction System

As a player, I want overuse of certain potions, dark magic, and substances to cause addiction, so that powerful shortcuts have a long-term cost and add depth to resource management.

## Details

- Addictive substances: healing potions (over-reliance), blood magic (power hunger), moon sugar (speed boost drug), void essence (temporary power spike), alcohol (stat buff)
- Addiction progression:
  - **Use 1-5 times**: no effect
  - **Use 6-15 times**: mild dependency — small stat penalty when not under the effect (-1 to a stat)
  - **Use 16-30 times**: moderate dependency — larger penalties (-3 stats), cravings (involuntary use if available)
  - **Use 31+ times**: severe dependency — withdrawal causes combat penalties, hallucinations, companions express concern
- Withdrawal: going 100+ turns without the substance when addicted causes temporary debuffs (recovers after 200 turns clean)
- Cure: visit a healer NPC for rehabilitation (costs gold + 300 turns of game time), or willpower quest (challenging)
- Companion intervention: at severe addiction, companions confront you (LLM emotional dialogue scene)
- NPC pushers: some NPCs encourage addiction for profit (can be reported to guards or confronted)
- Addiction is tracked in character stats; affects NPC dialogue ("You don't look well...")
- **Tolerance**: higher addiction stages reduce substance effectiveness (need more doses for the same effect)
- **Substance-specific hallucinations**: void essence causes shadow creatures on map; moon sugar makes items glow; blood magic shows bleeding walls
- **Recovery timeline**: mild = 100 turns clean, moderate = 200, severe = 400 (or instant with healer NPC for gold)
- **Relapse risk**: after recovery, using the substance even once jumps straight to moderate dependency
- Some quests involve infiltrating drug trade networks or helping addicted NPCs recover
- The black market vendor never warns about addiction risks

## Acceptance Criteria

- [ ] Usage tracking triggers addiction stages correctly
- [ ] Stat penalties apply during dependency and withdrawal
- [ ] Cure methods are available and functional
- [ ] Companion intervention dialogue triggers at severe stage
