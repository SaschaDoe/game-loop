# Lying and Deception

As a player, I want to lie to NPCs and have the LLM evaluate whether my deception is believable, so that social manipulation is a skill-based gameplay option.

## Details

- **Deception Mechanics**: when the player says something false in LLM dialogue, the system evaluates:
  - Plausibility of the lie (does it make logical sense in context?)
  - Player's Charisma modifier (hidden bonus to believability)
  - NPC's Wisdom modifier (hidden resistance to deception)
  - Relationship history (NPCs who trust you are easier to deceive)
  - Supporting evidence (lies backed by planted evidence or partial truths are more convincing)
- **Deception Outcomes**:
  - **Believed**: NPC acts on the false information; may change their behavior, give you something, or reveal information
  - **Suspicious**: NPC half-believes but is wary; may ask follow-up questions (the lie needs to hold under scrutiny)
  - **Caught**: NPC recognizes the lie; relationship damage, potential hostility, NPC warns others about you
- **Lie Types**:
  - Identity lies: "I'm a royal inspector" (requires disguise for full effect)
  - Information lies: "The bandits went north" (misdirect NPCs)
  - Emotional lies: "I'm so sorry for your loss" (fake empathy for manipulation)
  - Omission lies: telling partial truth while hiding key details
  - Blame shifting: "It wasn't me, it was [other NPC]" (frame someone else)
- **Deception Skill**: higher skill = subtle indicators in dialogue that the NPC is becoming suspicious (color change in their dialogue text); at high skill, see the NPC's suspicion percentage
- **NPC Lie Detection**: some NPCs are naturally perceptive (judges, spymasters, priests of truth); Zone of Truth spell exists (forces honesty in an area)
- **Consequences of Chronic Lying**: NPCs share information; a known liar's reputation spreads; eventually even true statements are doubted
- **Counter-Deception**: detect when NPCs are lying to you (Wisdom check, telepathy, truth spells)

## Acceptance Criteria

- [ ] LLM evaluates lie plausibility with stat modifiers
- [ ] Deception outcomes (believed, suspicious, caught) trigger correctly
- [ ] NPC suspicion escalates with follow-up questions
- [ ] Deception skill provides UI indicators of NPC suspicion
- [ ] Chronic lying reputation affects future NPC trust
