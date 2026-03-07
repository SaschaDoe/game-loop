# Cooking Recipes

As a player, I want to cook meals from gathered ingredients using discoverable recipes, so that food provides meaningful buffs and cooking feels like a rewarding minigame.

## Details

- **Cooking Stations**: campfire (basic), kitchen (intermediate), master kitchen in taverns (advanced)
- **Recipe Tiers**:
  - **Basic** (campfire): roasted meat (+5 HP regen), herb soup (+2 WIS for 50 turns), trail mix (+movement speed)
  - **Intermediate** (kitchen): hearty stew (+10 max HP for 100 turns), spiced fish (+3 DEX), mushroom risotto (+3 INT, minor hallucinations)
  - **Advanced** (master kitchen): dragon pepper chili (+5 STR, fire breath ability for 20 turns), starlight soufflé (+all stats for 50 turns), phoenix pie (auto-revive once)
  - **Legendary** (unique ingredients): ambrosia (full heal + all buffs), void soup (see invisible for 200 turns), time-baked bread (rewind 5 turns if you die)
- **Recipe Discovery**: found in books, taught by NPCs, experimentation (combine ingredients and see what happens)
- **Cooking Skill**: improves with practice; higher skill = better buff potency, less ingredient waste, access to harder recipes
- **Failed Cooking**: wrong combinations produce "mystery slop" (random minor buff or debuff)
- **Ingredient Freshness**: some ingredients spoil over time; spoiled ingredients produce weaker or harmful food
- **Sharing Food**: cooked meals can be given to NPCs for relationship boosts or used to bribe/poison enemies
- Cooking animation: ASCII art of steam rising from the cooking station

## Acceptance Criteria

- [ ] All recipe tiers are craftable at appropriate stations
- [ ] Buff durations and effects apply correctly
- [ ] Recipe discovery through experimentation works
- [ ] Cooking skill progression affects output quality
- [ ] Failed cooking produces appropriate random results
