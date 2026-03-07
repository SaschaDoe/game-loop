# Cooking

As a player, I want to cook meals from gathered ingredients at campfires and kitchens, so that food provides meaningful buffs beyond just restoring hunger.

## Details

- Cooking at: campfires (basic recipes), kitchens in houses/taverns (advanced recipes)
- Ingredient combination system: 2-4 ingredients per recipe
- Recipe discovery: experiment with ingredients, find recipe scrolls, learn from NPC cooks
- Meal tiers: basic (small buff, 50 turns), hearty (medium buff, 100 turns), gourmet (large buff, 200 turns)
- Buff types: +Strength, +Dexterity, HP regen, mana regen, poison resistance, cold resistance
- Cooking skill: higher skill unlocks complex recipes and reduces ingredient waste on failures
- Failed cooking: produces "burnt mess" (restores hunger but no buff, tastes terrible)
- Companion reactions: companions comment on your cooking quality (LLM-generated quips)

## Acceptance Criteria

- [ ] Cooking combines ingredients into meals at appropriate stations
- [ ] Meals provide timed buffs
- [ ] Recipe discovery works through experimentation and scrolls
- [ ] Cooking skill affects success rate and available recipes
