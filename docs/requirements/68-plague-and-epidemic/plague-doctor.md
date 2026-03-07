# Plague Doctor

As a player, I want to take on the role of a plague doctor treating the sick during epidemics, so that healing and medicine become active, quest-driven gameplay.

## Details

- **Becoming a Plague Doctor**: learn from a healer NPC or medical guild; requires Herbalism 3+ and INT 13+; granted a plague doctor mask (iconic beaked mask — reduces airborne infection risk by 80%) and a medical kit
- **Treatment Gameplay**:
  - Visit sick NPCs in their homes or quarantine zones
  - Diagnose: examine patient (INT + Medicine check); correct diagnosis reveals the disease and best treatment; misdiagnosis leads to wrong treatment (wastes resources, patient worsens)
  - Treat: apply the correct remedy based on diagnosis; treatment takes 3-10 turns depending on disease severity; patient's condition improves over 20-50 turns after treatment
  - Triage: during epidemics, more patients than you can treat; choose who to prioritize (children, important NPCs, wealthy patients who pay more, or random)
- **Medical Procedures**:
  - Herbal remedy: standard cure for mild/moderate diseases; crafted from herbs; most common
  - Bloodletting: old-school; works on some diseases, harms on others; risky but doesn't require rare ingredients
  - Surgery: for advanced infections (Bloodrot, tumors); requires surgical tools + steady hands (DEX check); failure = patient damage
  - Quarantine enforcement: isolate the infected; reduces spread; NPCs resist quarantine (Persuasion to convince, or force with guards)
  - Experimental cure: try an untested remedy; 30% success, 30% no effect, 40% side effects; but may cure otherwise incurable diseases
- **Plague Doctor Reputation**: successful treatments build medical reputation; high reputation = more patients, better pay, access to rare medical texts, invited to consult on difficult cases
- **Moral Dilemmas**: wealthy noble offers triple pay to treat them first while commoners die; criminal offers a cure they stole — use it or report them; a disease turns out to be an alchemist's experiment — expose them or blackmail
- **Plague Doctor Equipment**: upgraded masks (better protection), enchanted scalpels (magical surgery), portable alchemy lab (craft cures in the field), leeches (effective against magical blood diseases)

## Acceptance Criteria

- [ ] Diagnosis uses correct skill checks with misdiagnosis consequences
- [ ] All treatment types apply correct effects based on disease
- [ ] Triage decisions have meaningful consequences on NPC survival
- [ ] Medical reputation tracks correctly and unlocks content
- [ ] Moral dilemma quests present genuine trade-offs
