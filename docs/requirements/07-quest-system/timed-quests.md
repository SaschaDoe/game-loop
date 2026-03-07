# Timed Quests

As a player, I want some quests to have time limits measured in in-game turns, so that urgency adds tension and I must prioritize wisely.

## Details

- Certain quests have a turn deadline: "The poison will kill the king in 200 turns"
- Timer displayed in the quest journal and optionally on the HUD
- Failing to complete in time leads to a failure state with consequences
- Time pressure forces choices: do I explore that side dungeon or rush to save the king?
- Some timed quests can be extended by finding items or talking to NPCs
- Timer only counts gameplay turns, not real time

## Acceptance Criteria

- [ ] Timed quests display remaining turns
- [ ] Quest fails with consequences when time expires
- [ ] Timer extensions are achievable through gameplay
- [ ] Timer is turn-based, not real-time
