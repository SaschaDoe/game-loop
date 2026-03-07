# Food Buffs and Debuffs

As a player, I want different foods to grant specific temporary buffs and eating bad food to cause debuffs, so that diet is a meaningful tactical choice.

## Details

- **Buff Categories** (one food buff active at a time; eating new food replaces the previous buff):
  - **Strength Food**: grilled steak (+3 STR, 80 turns), bear meat (+4 STR +1 CON, 60 turns), giant's broth (+6 STR, 30 turns)
  - **Speed Food**: elven waybread (+2 DEX +movement speed, 100 turns), peppered fish (+3 DEX, 60 turns), haste honey (+4 DEX, 40 turns)
  - **Mind Food**: sage tea (+3 INT, 80 turns), scholar's stew (+2 INT +2 WIS, 60 turns), psionic mushroom (+5 INT, 30 turns, hallucination risk)
  - **Defense Food**: iron root soup (+3 CON, 80 turns), fortified porridge (+2 CON +10% damage resistance, 60 turns), dragon scale soup (+5 CON, 30 turns)
  - **Social Food**: sweetberry wine (+3 CHA, 80 turns), honeycake (+2 CHA +NPC disposition, 60 turns), ambrosia (+4 CHA +all social checks, 30 turns)
  - **Recovery Food**: chicken broth (HP regen +3/turn, 50 turns), mana tea (mana regen +2/turn, 50 turns), restoration feast (both regens, 30 turns)
- **Debuff Foods**:
  - Spoiled food: nausea (-2 all stats, 20 turns)
  - Raw meat: parasite risk (10% chance, -1 CON per 50 turns until cured)
  - Mysterious mushroom: random effect (could be +5 to a stat or -5, or hallucinations)
  - Tavern mystery stew: cheap but 25% chance of food poisoning (-3 CON, 30 turns)
- **Satiation**: eating when already satiated provides no buff and wastes the food
- **Racial Preferences**: some races get enhanced buffs from certain foods (elves: berries +50% duration, dwarves: meat +50% potency)
- **Companion Feeding**: feed companions for the same buff system; well-fed companions have higher morale
- **Food Sharing**: cooking for NPCs improves relationship; sharing rare food with a potential ally can recruit them

## Acceptance Criteria

- [ ] Food buffs apply correct stat bonuses and durations
- [ ] Only one food buff active at a time with replacement
- [ ] Debuff foods trigger negative effects correctly
- [ ] Racial preferences modify buff potency/duration
- [ ] Companion and NPC feeding mechanics work
