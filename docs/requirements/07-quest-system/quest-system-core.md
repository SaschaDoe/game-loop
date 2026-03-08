# Quest System Core Implementation

**Status: DONE**

## User Story
As a player, I want a quest journal that tracks active, completed, and failed quests with objectives and rewards, so that my adventure has purpose and narrative drive.

## Acceptance Criteria
- [x] Quest catalog with 20+ quests (5 main story + 15+ side quests)
- [x] Quests have objectives (kill, talk, explore, collect, escort, deliver)
- [x] Quest progress updates automatically on kills, NPC talks, and exploration
- [x] Quests can be accepted, completed, and failed
- [x] Timed quests expire after their turn limit
- [x] Quest rewards include XP, HP, ATK bonuses
- [x] Main story quests hint at the hidden truth without dumping exposition
- [x] Side quests are spread across all regions
- [x] Quest state persists in save/load
- [x] Achievement tracking for quest completion milestones

## Implementation
- `quests.ts`: Quest catalog, quest management functions
- `types.ts`: Quest, QuestObjective, QuestReward types
- `engine.ts`: Quest progress hooks on kills, NPC talks, turn ticks
- `achievements.ts`: Questbearer, Adventurer, Legend achievements
