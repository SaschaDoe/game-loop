# Potion Addiction

As a player, I want overuse of potions to carry addiction risks with withdrawal mechanics, so that potion consumption requires strategic decision-making rather than mindless chugging.

## Details

- **Addiction Threshold**: consuming 5+ potions of the same type within 100 turns builds dependency; each additional potion after 5 increases addiction level (mild > moderate > severe > critical)
- **Addiction Levels**:
  - **Mild**: potion effectiveness reduced by 10%; slight craving messages ("You could really use a healing potion right now"); no stat penalty
  - **Moderate**: effectiveness reduced by 25%; periodic craving messages become persistent; -1 WIS; consuming the potion gives a brief euphoria bonus (+1 to all stats for 5 turns) followed by a crash (-1 to all stats for 10 turns)
  - **Severe**: effectiveness reduced by 40%; character auto-uses the potion if available in inventory during rest; -2 WIS, -1 INT; withdrawal symptoms when not using (trembling = -1 DEX, anxiety = -1 CHA)
  - **Critical**: potion barely works (60% reduced); character prioritizes acquiring the potion above quest objectives (dialogue options reference addiction); -3 WIS, -2 INT, -1 CHA; NPC dealers charge triple
- **Withdrawal**: going 50 turns without the addicted potion type triggers withdrawal; stat penalties double for 30 turns then gradually fade; hallucination effects during peak withdrawal
- **Recovery**: visit a healer or temple for detox treatment (costs gold, takes 20 turns of rest); herbal remedies reduce withdrawal severity; cold turkey recovery takes 100 turns but is free; support group NPCs provide morale bonus during recovery
- **Addiction-Prone Potions**: healing potions (most common addiction), mana potions, stamina potions, stat-boosting potions, combat enhancement potions; utility potions (invisibility, water breathing) are less addictive
- **Dealer NPCs**: some shady NPCs sell potions cheap to hook you, then raise prices; can be exposed to authorities or eliminated

## Acceptance Criteria

- [ ] Addiction builds correctly based on consumption frequency
- [ ] Each addiction level applies correct penalties and behaviors
- [ ] Withdrawal triggers and resolves over correct timeframes
- [ ] Recovery methods work with correct costs and durations
- [ ] Addiction-prone potions have higher addiction rates than utility potions
