# Companion Personal Quests

As a player, I want each recruitable companion to have a personal questline that deepens their backstory and unlocks their full potential, so that companions feel like real characters with their own arcs.

## Details

- **Quest Structure**: each companion has a 3-5 part questline triggered by relationship milestones:
  - Part 1 (Friend): companion shares a personal problem during campfire rest; quest becomes available
  - Part 2-3 (Close Friend): investigate and address the companion's issue; travel to their homeland, confront their past
  - Part 4 (Loyal): climactic confrontation or resolution; companion faces their greatest fear or nemesis
  - Part 5 (Devoted): optional epilogue; companion's future is determined by player choices throughout the questline
- **Example Companion Quests**:
  - **Warrior companion**: dishonorably discharged from the army; quest to clear their name by finding the real traitor
  - **Mage companion**: their mentor went mad researching forbidden magic; quest to stop the mentor without killing them (or decide to)
  - **Rogue companion**: has a bounty from a past theft; quest to pay off the debt, confront the victim, or eliminate the bounty hunters
  - **Healer companion**: their village was destroyed by plague; quest to find the cure and save the survivors
  - **Bard companion**: searching for a lost song that can break a curse on their family; quest spans multiple ancient sites
- **Quest Outcomes**: multiple endings per companion quest; outcomes affect:
  - Companion's personality and dialogue (LLM reflects the resolution)
  - Companion's abilities (unlock ultimate ability or a different ability based on resolution)
  - Companion's loyalty (good resolution = max loyalty; betrayal = companion leaves)
- **Missable Quests**: if a companion dies before their quest completes, the quest fails permanently; their ghost may appear with regrets
- **Inter-Companion Quests**: some companion quests intersect (two companions have conflicting interests; player must choose or find a compromise)

## Acceptance Criteria

- [ ] Each companion has a multi-part personal questline
- [ ] Quest parts trigger at correct relationship milestones
- [ ] Multiple endings per quest affect companion personality and abilities
- [ ] Companion death permanently fails their questline
- [ ] Inter-companion quest conflicts present meaningful choices
