# Evidence System

As a player, I want a structured evidence collection and analysis system for solving mysteries, so that detective work is systematic and intellectually rewarding.

## Details

- **Evidence Types**:
  - **Physical Evidence**: blood stains, footprints, fibers, weapon marks, broken objects; found at crime scenes; requires Investigation skill to notice; Perception check determines detail quality
  - **Testimonial Evidence**: NPC witness statements; reliability varies (some lie, some misremember); cross-reference statements to find contradictions; Insight check reveals deception
  - **Documentary Evidence**: letters, ledgers, contracts, diary entries, maps; found on suspects or in locations; may require linguistics to decode or forgery to detect fakes
  - **Magical Evidence**: residual magic traces, divination results, ghost testimony; requires Arcana or Spirit Sight; the most reliable but hardest to obtain
  - **Circumstantial Evidence**: NPC motives, alibis, opportunity analysis; not proof alone but builds a case when combined with other evidence
- **Evidence Board**: a visual case board in the player's journal; pin evidence items and draw connections between them; the board organizes clues by suspect, location, and timeline
- **Evidence Analysis**:
  - Compare evidence: match a footprint to a boot, match a fiber to a cloak, match handwriting to a letter
  - Contradiction detection: when two pieces of evidence conflict, the board highlights them
  - Timeline reconstruction: place events in order based on evidence; gaps indicate missing clues
- **Chain of Evidence**: some mysteries require a chain — evidence A leads to location B, where you find evidence C that points to suspect D; following the chain is the core detective loop
- **False Leads**: some evidence is planted by the real culprit; red herrings are deliberately misleading; careful analysis (or a high INT check) reveals planted evidence
- **Accusation**: when confident, accuse a suspect; present evidence to support the accusation; judge/authority evaluates the strength of your case; weak cases are dismissed; strong cases convict; wrong accusations damage reputation
- **Cold Case Integration**: unsolved cases persist; new evidence may emerge later; revisiting old evidence with new skills/tools can reveal missed details

## Acceptance Criteria

- [ ] All evidence types collect and display correctly
- [ ] Evidence board allows pinning, connecting, and organizing
- [ ] Contradiction detection highlights conflicting evidence
- [ ] Chain of evidence connects across locations and suspects
- [ ] Accusation evaluation weighs evidence strength correctly
