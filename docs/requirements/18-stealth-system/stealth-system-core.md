# Stealth System Core Implementation

**Status: DONE**

## User Story
As a player, I want to sneak past enemies and perform devastating backstab attacks from stealth, so that stealth is a viable and rewarding playstyle.

## Acceptance Criteria
- [x] Toggle stealth mode with Z key
- [x] Stealth fails if enemies are adjacent
- [x] Enemies have awareness states: unaware, suspicious, alert
- [x] Detection is based on distance, light level, stealth bonus, and noise
- [x] Backstab from stealth deals 3x damage (5x for Rogues)
- [x] Attacking from stealth breaks stealth
- [x] Noise generated from actions (walk, combat, abilities)
- [x] Equipment can reduce noise and boost stealth
- [x] Stealth state persists in save/load
- [x] Achievement tracking for stealth kills and backstabs
- [x] Stealth processing runs each turn when hidden
- [x] Alert symbols (? for suspicious, ! for alert) for enemies

## Implementation
- `stealth.ts`: Detection, backstab damage, noise, enemy awareness
- `types.ts`: StealthState, EnemyAwareness, AlertState
- `engine.ts`: Z key toggle, backstab in combat, per-turn stealth processing
- `achievements.ts`: Shadow Strike, Silent Assassin, Ghost achievements
