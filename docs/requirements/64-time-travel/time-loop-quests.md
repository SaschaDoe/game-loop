# Time Loop Quests

As a player, I want to encounter Groundhog Day-style time loops where I must solve a puzzle by repeating the same time period with accumulated knowledge, so that time mechanics create unique puzzle-quest experiences.

## Details

- **Loop Trigger**: entering certain locations or accepting specific quests triggers a time loop; a period of 50-100 turns repeats endlessly until the player solves the loop's puzzle; dying within the loop restarts it (no permadeath consequences)
- **Loop Knowledge**: the player retains all knowledge from previous loops (NPC schedules, trap locations, conversation outcomes, item locations); NPCs reset each loop (no memory of previous iterations)
- **Loop Puzzle Types**:
  - **Murder Prevention**: an NPC dies at the end of each loop; player must figure out who kills them, why, and how to prevent it; requires gathering clues across multiple loops (talk to different NPCs each time)
  - **Heist**: a vault must be robbed within the loop timeframe; each loop, learn one more security measure (guard routes, lock combinations, alarm locations); eventually execute a perfect heist combining all knowledge
  - **Disaster Prevention**: a natural or magical disaster destroys the area; player must find the cause and prevent it; multiple false leads and red herrings; correct solution requires information from at least 3 different loop iterations
  - **Social Web**: convince a specific NPC to do something; but they require proof/trust that can only be built by doing favors for other NPCs; chain of favors must be optimized across loops (learn the fastest route through social obligations)
  - **Combat Optimization**: an unwinnable fight; each loop, learn one enemy pattern/weakness; eventually defeat them through perfect preparation and execution
- **Loop Breaker**: solving the puzzle breaks the loop permanently; the timeline continues from the resolved state; NPCs may have deja vu (LLM dialogue hints at subconscious loop memories)
- **Loop Counter**: game tracks how many loops the player took; fewer loops = better reward; bonus reward for solving in the minimum possible loops
- **Voluntary Loop**: once solved, player can optionally re-enter the loop for practice, experimentation, or finding hidden secrets they missed

## Acceptance Criteria

- [ ] Player knowledge persists correctly across loop iterations
- [ ] NPC state resets completely each loop
- [ ] All puzzle types are solvable with information gathered across loops
- [ ] Loop breaking resolves the timeline correctly
- [ ] Loop counter tracks iterations and awards bonuses for efficiency
