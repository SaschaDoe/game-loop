# Disease and Plague

As a player, I want diseases to spread through the world and infect my character, so that health management adds another survival layer and plagues create urgent world events.

## Details

- Disease sources: contaminated water, rat bites, corpse contact, swamp exposure, infected NPCs
- Disease types:
  - **Swamp Fever**: -2 CON, -1 STR per 50 turns, cured by herbalist or fever potion
  - **Rattlecough**: contagious to companions, -3 CHA, -2 WIS, loud coughing alerts enemies
  - **Rot**: infected wounds from undead attacks, limb slowly loses function (-1 to a stat per 30 turns), requires temple cure or amputation (permanent stat loss but stops spread)
  - **Mind Fog**: psychic disease from eldritch contact, hallucinations, -4 INT, quest items appear scrambled
  - **Blood Plague**: rare, deadly, -1 max HP per 20 turns, no natural cure — requires legendary Bloodroot herb
  - **Lycanthropic Fever**: precursor to lycanthropy (see lycanthropy story), curable in this stage
- Plague events: diseases spread through towns if untreated, killing NPCs, closing shops, generating rescue quests
- Quarantine: infected NPCs are isolated, player can help or exploit the chaos
- Disease resistance: Constitution checks reduce infection chance, cleanliness items help
- Healer NPCs: diagnose diseases for a fee, prescribe cures
- Disease can spread to companions; untreated companion disease reduces their combat effectiveness
- **Prevention methods**: wearing masks (-50% airborne infection), disease resistance potions, high Constitution score, avoiding contaminated areas
- **Infected items**: loot from diseased enemies has a chance to carry infection; identify spell reveals this
- **Disease journal**: tracks current afflictions, symptoms, known cures, and infection history
- **Pandemic quests**: finding the source of an outbreak, creating a cure, protecting the uninfected, quarantine enforcement
- **Immunity**: recovering from a disease naturally grants permanent immunity to that disease type

## Acceptance Criteria

- [ ] All disease types are contractable with correct stat effects
- [ ] Diseases progress over time if untreated
- [ ] Plague events spread through towns affecting NPCs and shops
- [ ] Cure methods work for each disease type
