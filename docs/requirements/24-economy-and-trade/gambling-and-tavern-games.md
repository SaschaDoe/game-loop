# Gambling and Tavern Games

As a player, I want to gamble and play minigames in taverns, so that towns offer entertainment, social interaction, and a risky way to earn gold.

## Details

- Games available at taverns:
  - **Dice Roll**: bet gold, roll against NPC, highest total wins (luck + optional Dexterity for loaded dice)
  - **Card Game (Liar's Gambit)**: bluffing card game against NPCs, Charisma helps detect bluffs
  - **Arm Wrestling**: Strength check, bet gold, escalating stakes per round
  - **Riddle Contest**: NPC poses riddles (LLM-generated), player types answers, bet gold on getting it right
  - **Drinking Contest**: Constitution checks, last one standing wins the pot (fail = pass out, wake up somewhere random)
- NPCs have skill levels at each game; some are hustlers who cheat
- Detect cheating with Wisdom check; call them out or cheat back
- High-stakes back rooms: VIP gambling with massive bets, require reputation to access
- Gambling addiction: optional flavor — NPCs warn you if you gamble too much

## Acceptance Criteria

- [ ] All tavern games are playable with gold stakes
- [ ] NPC skill levels create varied difficulty
- [ ] Cheating detection works with stat checks
- [ ] High-stakes rooms require reputation
