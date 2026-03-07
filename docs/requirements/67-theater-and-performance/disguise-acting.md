# Disguise Acting

As a player, I want to use theatrical disguise and acting skills to impersonate NPCs for espionage, infiltration, and social manipulation, so that performance skills have practical adventuring applications.

## Details

- **Disguise Kit**: crafted or purchased; contains makeup, wigs, prosthetics, clothing padding; quality tiers (basic, professional, masterwork) affect disguise effectiveness
- **Impersonation Targets**: can impersonate any NPC you've studied for 10+ turns; studying records appearance, voice patterns, mannerisms, and known phrases
- **Disguise Checks**:
  - **Visual**: CHA + Disguise skill vs observer's Perception; casual observers easy to fool; close acquaintances of the target much harder
  - **Behavioral**: when interacting with NPCs who know the target, must pass Performance checks to mimic mannerisms; LLM evaluates dialogue for consistency with the target's known personality
  - **Knowledge**: target's friends may ask questions only the real person would know; INT check or prior research to answer correctly; wrong answers raise suspicion
- **Disguise Applications**:
  - Infiltrate enemy strongholds as a guard or member
  - Impersonate a noble to access restricted areas or events
  - Frame someone by committing crimes in their disguise
  - Escape pursuit by changing appearance
  - Deliver false orders to enemy troops as their commander
- **Disguise Duration**: disguise degrades over time (sweat, physical activity, weather); heavy rain or combat may ruin the disguise; refresh by spending 3 turns at a mirror
- **Discovery Consequences**: if caught impersonating, consequences depend on context (arrested for fraud, attacked by infiltrated faction, permanent reputation damage with the impersonated NPC)
- **Master of Disguise**: at maximum Disguise skill, can maintain multiple identities simultaneously; NPCs in different cities know you as different people; each identity has its own reputation score

## Acceptance Criteria

- [ ] Disguise checks use correct skill contests
- [ ] LLM evaluates behavioral consistency during impersonation dialogue
- [ ] Disguise degrades over time and from environmental factors
- [ ] Discovery triggers appropriate consequences by context
- [ ] Multiple identity system tracks separate reputations
