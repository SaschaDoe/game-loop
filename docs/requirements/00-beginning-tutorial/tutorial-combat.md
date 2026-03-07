# Tutorial Combat

As a player, I want a guided first combat encounter that teaches me the turn-based system step by step, so that I understand attacks, defense, and abilities before facing real danger.

## Details

- **Training Dummy Phase**: first combat is against a training dummy that doesn't fight back; teaches movement, attack command, and reading damage numbers; dummy has infinite HP until tutorial objective is met
- **Sparring Partner**: second combat is against a friendly NPC sparring partner; they attack gently (can't kill player); teaches blocking, dodging, and using abilities; partner provides tips in the message feed
- **First Real Fight**: a weak enemy (rat, slime, or bandit depending on starting area) with real stakes; tutorial overlay highlights available actions; if player drops to 1 HP, the enemy flees (safety net for first fight only)
- **Ability Introduction**: when player levels up or gains first ability, a brief tutorial explains: ability selection, mana/resource costs, cooldowns, and targeting; uses the actual ability in a safe context
- **Combat Log Explanation**: first few combats have annotated combat log entries explaining what each line means (hit chance calculation, damage breakdown, status effect application)
- **Difficulty Awareness**: if player dies in the first 3 real combats, offer to lower difficulty or provide additional healing items; no penalty for tutorial deaths

## Acceptance Criteria

- [ ] Training dummy phase teaches basic attack mechanics without risk
- [ ] Sparring partner teaches defensive mechanics with damage cap
- [ ] First real fight has safety net at 1 HP
- [ ] Ability tutorial triggers on first ability gain
- [ ] Combat log annotations display during early encounters
