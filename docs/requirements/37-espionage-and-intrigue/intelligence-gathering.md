# Intelligence Gathering

As a player, I want to gather intelligence through eavesdropping, bribery, and intercepted messages, so that information is a valuable currency for espionage gameplay.

## Details

- **Intelligence Methods**:
  - **Eavesdropping**: stand near NPCs having conversations (within 2 tiles, behind cover); Perception check to hear clearly; conversations reveal plans, secrets, quest hints
  - **Bribery**: offer gold to NPCs for information; amount needed scales with information value and NPC loyalty; some NPCs report bribe attempts to guards
  - **Intercepted Messages**: steal courier bags, intercept carrier pigeons, find dead drops; messages may be coded (Intelligence check to decode)
  - **Scrying**: magic spell that lets you observe a distant location or NPC for 30 seconds; requires a focus item related to the target
  - **Informant Network**: recruit NPCs as informants (see spy-network); they passively gather intel and report at regular intervals
  - **Interrogation**: captured enemies can be questioned; LLM-powered dialogue where the prisoner may resist, lie, or bargain for freedom
- **Intelligence Quality**: rumors (unverified, 60% accurate) → reports (verified, 90% accurate) → secrets (guaranteed accurate, actionable)
- **Intelligence Journal**: separate section in quest log that tracks gathered intel, source reliability, and connections between pieces
- **Counter-Intelligence**: enemies may feed false information; detecting disinformation requires cross-referencing multiple sources
- **Intel Trade**: sell intelligence to interested factions for gold, favors, or reciprocal information
- **Time Sensitivity**: some intelligence expires (troop movements change, plans evolve, targets relocate)

## Acceptance Criteria

- [ ] All intelligence gathering methods produce contextual information
- [ ] LLM interrogation dialogue responds to different approaches
- [ ] Intelligence quality tiers affect reliability correctly
- [ ] Counter-intelligence false information is detectable
- [ ] Time-sensitive intel expires appropriately
