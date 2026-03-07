# Consequences of Evil

As a player, I want persistent and escalating consequences for evil actions that make villainy a challenging but viable path, so that evil isn't just "good with extra murder."

## Details

- **Evil Action Tracking**: every evil act (murder, theft, betrayal, dark magic use, cruelty to NPCs) adds to a hidden "Infamy" score; Infamy determines NPC awareness and reaction severity
- **Escalating Consequences by Infamy**:
  - **Infamy 1-20 (Petty Criminal)**: guards warn you; some shops refuse service; minor NPCs avoid you; rumors spread ("I heard they stole from the baker")
  - **Infamy 21-50 (Known Villain)**: wanted posters appear with your description; bounty hunters pursue you periodically; good-aligned companions leave; prices inflate 25% at shops that still serve you; children run away, adults scowl
  - **Infamy 51-75 (Feared)**: armies mobilize against you; assassin guilds take contracts on you; divine agents (paladins, angels) hunt you; no legitimate shop serves you (black market only); you must disguise yourself to enter towns; your name is used to frighten children
  - **Infamy 76-100 (Dark Lord/Lady)**: kingdoms unite against you specifically; legendary heroes emerge to challenge you; the gods themselves take notice (divine punishment events); but evil factions worship you; can build an evil stronghold and recruit evil NPCs; the world treats you as the final boss
- **Evil Benefits**: evil actions provide short-term power (stolen gold, murdered NPCs' equipment, dark magic bonuses, fear-based obedience from NPCs); evil-aligned factions offer powerful but morally repugnant quest rewards; demon patrons grant wishes (with strings)
- **Redemption Difficulty Scaling**: the higher your Infamy, the harder redemption becomes; at 75+, redemption requires a world-saving act of sacrifice; some evil actions are irreversible (certain murders can never be forgiven by certain factions)
- **Evil Endgame**: at maximum Infamy, the game offers an alternate win condition — conquer or destroy the world; become the Dark Lord; this is a full ending with credits; the "evil victory" is legitimate
- **NPC Memory**: NPCs who witnessed your evil acts never forget; even if you lower your public Infamy through manipulation, individual NPCs who saw what you did remain hostile; you can silence witnesses (more evil acts) but the web of consequences grows
- **Companion Reactions**: evil-aligned companions (assassins, necromancers, demons) join you at high Infamy; they're powerful but treacherous (may betray you for their own goals); trust no one

## Acceptance Criteria

- [ ] Infamy score tracks correctly from evil actions
- [ ] Escalating consequences apply at correct Infamy thresholds
- [ ] Evil benefits provide correct short-term power advantages
- [ ] Evil endgame unlocks as alternate win condition at max Infamy
- [ ] NPC memory persists individually regardless of public Infamy changes
