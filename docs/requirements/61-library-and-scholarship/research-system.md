# Research System

As a player, I want to research topics at libraries and universities to unlock new recipes, spells, and quest leads, so that intellectual pursuits are a viable gameplay path.

## Details

- **Research Locations**: city libraries, university halls, wizard academies, monastery scriptoriums, personal study (if player owns a house with a desk)
- **Research Process**:
  - Choose a research topic from available categories (alchemy, arcana, history, engineering, biology, theology, warfare)
  - Spend turns researching (10-50 turns depending on complexity); INT modifier reduces time
  - Progress tracked as percentage; can pause and resume; multiple research projects allowed but only one active
  - Breakthrough moments: random chance per turn of a eureka discovery (bonus recipe, spell variant, quest clue)
- **Research Rewards**:
  - **Recipe Discovery**: unlock crafting recipes not available through other means (unique potions, enchantments, gadgets)
  - **Spell Improvement**: research a known spell to create an enhanced version (lower mana cost, added effect, wider area)
  - **Historical Clues**: research reveals hidden dungeon locations, treasure cache coordinates, NPC secrets
  - **Tactical Knowledge**: research enemy types to gain combat bonuses (+10% damage vs researched creature type)
- **Research Prerequisites**: some topics require having read specific tomes, having minimum skill levels, or completing prior research
- **Collaboration**: hire a research assistant NPC for faster progress; some topics require consulting multiple sources (visit 3 different libraries)
- **Publication**: write and publish your research findings for gold and reputation; other players in multiplayer can read your publications
- **Scholar Reputation**: completing research projects builds scholar reputation; unlocks access to restricted archives, university quests, and mentor NPCs

## Acceptance Criteria

- [ ] Research projects track progress correctly across sessions
- [ ] All research categories produce appropriate rewards
- [ ] INT modifier correctly reduces research time
- [ ] Breakthrough moments trigger at correct probability
- [ ] Scholar reputation unlocks appropriate content
