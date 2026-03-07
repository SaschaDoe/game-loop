# Tutorial System

As a player, I want an optional in-game tutorial that teaches mechanics through gameplay rather than walls of text, so that new players learn naturally without experienced players being slowed down.

## Details

- **Skip Option**: tutorial is offered at game start; can be fully skipped, partially completed, or done in full
- **Tutorial Island/Area**: a small self-contained starting zone that introduces core mechanics:
  1. Movement and interaction (WASD/arrow keys, bump to interact)
  2. Combat basics (bump to attack, health management, potion use)
  3. Inventory and equipment (pick up items, equip gear, view stats)
  4. NPC dialogue (approach and talk, LLM conversation basics)
  5. Quest acceptance and tracking (quest journal, objectives)
  6. Exploration (fog of war, secret doors, trap detection)
  7. Map reading (legend, minimap, points of interest)
- **Contextual Tips**: even after skipping tutorial, first-time encounters trigger brief tips (dismissable):
  - First combat: "Bump into enemies to attack. Watch your HP!"
  - First NPC: "Talk to NPCs by pressing Enter when adjacent"
  - First trap: "Watch for unusual tiles — they might be traps!"
- **Tutorial NPC**: a guide character who explains mechanics through LLM dialogue (player can ask questions)
- **Practice Dummy**: a target in the starting area for trying combat moves without risk
- Tips can be permanently disabled in settings
- Tutorial progress is tracked; completing all steps grants "Quick Learner" achievement

## Acceptance Criteria

- [ ] Tutorial is fully skippable
- [ ] All seven tutorial steps teach their mechanic correctly
- [ ] Contextual tips appear on first encounters and are dismissable
- [ ] Tutorial NPC answers questions via LLM
- [ ] Tips can be disabled in settings
