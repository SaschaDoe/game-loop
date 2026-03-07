# Daily Challenges

As a player, I want daily-rotating challenge scenarios with pre-set conditions and leaderboards, so that I have fresh content to attempt every day.

## Details

- **Daily Seed**: each real-world day generates a unique challenge seed; all players who attempt the daily challenge play the same seed (same map, same enemies, same item placements); enables fair leaderboard comparison
- **Challenge Structure**: pre-built scenario with specific objective; starting character provided (set class, level, equipment); no carry-over from main game; complete in 30-60 minutes; scored on: completion time, enemies killed, treasure found, optional objectives completed
- **Challenge Types** (rotating):
  - **Dungeon Sprint**: clear a procedural dungeon as fast as possible; score = turns taken (lower = better); traps and puzzles must be solved; boss at the end
  - **Survival Wave**: defend a position against escalating waves of enemies; score = waves survived; no escape; resources limited to what's found between waves
  - **Puzzle Gauntlet**: series of 5 puzzles with no combat; time-scored; logic, riddle, and spatial puzzles; wrong answers cost time penalty
  - **Boss Rush**: fight 5 bosses in sequence; minimal healing between fights; score = total HP remaining after all bosses; tests combat efficiency
  - **Stealth Mission**: infiltrate a stronghold, steal a target item, escape undetected; score = stealth rating (detections subtract points); non-combat focus
  - **Economy Race**: start with nothing; accumulate as much gold as possible in 200 turns; any method allowed (trading, gambling, theft, crafting, adventuring)
  - **Random Chaos**: random modifier combination; random starting class; random objectives; pure adaptability test
- **Leaderboard**: global ranking by score; daily reset; friends leaderboard; weekly aggregate ranking; monthly champion; titles for top performers ("Daily Champion", "Weekly Legend")
- **Daily Rewards**: completing the daily challenge grants a reward token; tokens exchangeable for cosmetic items, unique titles, and exclusive equipment skins in main game; streak bonuses for consecutive days completed
- **Replay**: can replay the daily challenge unlimited times to improve score; only best score counts for leaderboard

## Acceptance Criteria

- [ ] Daily seed generates identical scenarios for all players
- [ ] All challenge types produce correct objectives and scoring
- [ ] Leaderboard ranks players correctly with daily/weekly/monthly periods
- [ ] Reward tokens accumulate and exchange for correct items
- [ ] Replay correctly updates to best score only
