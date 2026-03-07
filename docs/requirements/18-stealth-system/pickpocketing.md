# Pickpocketing

As a player, I want to steal items from NPCs through a risk-reward pickpocketing system, so that rogues have non-combat ways to acquire loot.

## Details

- **Pickpocket Attempt**: approach an NPC from behind, activate pickpocket action; Dexterity vs NPC Perception check
- **Success Tiers**:
  - Critical Success: steal item + NPC doesn't notice + bonus (steal gold too)
  - Success: steal one item from NPC's visible inventory
  - Partial Success: steal item but NPC becomes suspicious (heightened alertness for 50 turns)
  - Failure: caught in the act — NPC confronts player (fight, flee, or talk your way out)
  - Critical Failure: caught + guards called + reputation penalty
- **Stealable Items**: gold, keys, documents, potions, small weapons; large items (armor, two-handed weapons) cannot be pickpocketed
- **NPC Awareness Factors**: facing direction, alertness level, crowd density (easier in crowds), time of day (easier at night), NPC class (rogues are harder to pickpocket)
- **Pickpocket Skill**: leveling up increases success chance, unlocks ability to steal equipped items, and view NPC inventory before attempting
- **Plant Items**: reverse pickpocketing — place items on NPCs (plant evidence, slip a poison potion into their drink, place a tracking rune)
- **Caught Consequences**: crime tracked by justice system (see justice-and-law), NPC becomes hostile, reputation with that NPC's faction drops
- **Pickpocket Targets**: guards carry keys and arrest warrants, merchants carry extra gold, nobles carry rare trinkets, adventurers carry potions

## Acceptance Criteria

- [ ] Pickpocket checks use correct Dexterity vs Perception formula
- [ ] All success tiers produce correct outcomes
- [ ] NPC awareness factors modify difficulty appropriately
- [ ] Plant items mechanic works in reverse
- [ ] Crime system integration tracks pickpocket attempts
