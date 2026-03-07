# Training Montage

As a player, I want to train with martial arts masters through gameplay sequences that improve my combat abilities, so that skill progression feels earned through practice rather than just XP.

## Details

- **Training Types**:
  - **Punching Dummy**: practice attack combos on a target; grants combo proficiency XP; timer-based (hit as many combos as possible in 20 turns)
  - **Obstacle Course**: navigate a timed course of jumps, climbs, and slides; grants DEX XP and movement ability unlocks
  - **Sparring Match**: non-lethal fight against a trainer NPC; they teach by example (using advanced moves you can learn); losing is normal; winning unlocks the next tier
  - **Meditation**: sit and focus for 10-50 turns; grants chi pool expansion, perception bonuses, and resistance to fear/charm
  - **Endurance Training**: take hits from a trainer (voluntary damage); grants CON XP and damage resistance; "Take 50 damage without flinching" = Iron Body unlock
  - **Speed Training**: dodge projectiles thrown by a trainer; grants dodge skill and initiative bonuses; harder tiers throw more and faster
- **Master NPCs**: 4-6 martial arts masters hidden across the world; each teaches a unique fighting style and technique
  - Masters have personality: one is serene, one is brutal, one is comical, one speaks only in riddles
  - Finding a master requires a quest (climb the mountain, survive the trial, bring a gift)
  - Each master has a backstory revealed through LLM dialogue during training breaks
- **Training Progression**: each master has 5 training tiers; completing all 5 grants a mastery certificate and an ultimate technique
- **Ultimate Techniques** (one per master):
  - One Inch Punch: devastating short-range attack; 30 damage, bypasses all armor, knockback 5 tiles
  - Thousand Fists: 10 rapid attacks in one turn at reduced damage each; total far exceeds single hits
  - Perfect Counter: next attack aimed at you is caught and returned at double damage; 100% success rate; 1/combat
  - Flying Dragon: leap 8 tiles, attack all enemies in the flight path; land with AoE shockwave
- Training sequences have unique ASCII art animations (rapid tile changes showing movement patterns)

## Acceptance Criteria

- [ ] All training types provide correct skill/stat progression
- [ ] Master NPCs are discoverable with unique personalities and quests
- [ ] Training tiers progress correctly with increasing difficulty
- [ ] Ultimate techniques are powerful and function as described
- [ ] Training animations display correctly in ASCII
