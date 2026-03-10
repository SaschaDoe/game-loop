# Talent System

As a player, I want to spend talent points on passive skills, spells, and rituals, so that I can specialize my character and develop unique builds.

## Details

- **One talent point per level** — the only reward from leveling up
- Talent points are a **unified currency** that can buy:
  - **Passive skills** from class-specific skill trees (e.g., Warrior: Arms, Defense, Tactics)
  - **Spells** from mentors, spell scrolls, spell tomes, and quest rewards (1 talent point each)
  - **Rituals** from mentors, tomes, and quest rewards (1 talent point each)
- Each class has 3 skill tree branches with 3 tiers each (prerequisites required)
- To learn a spell/ritual, you must both **find** the source (NPC, book, quest) AND **spend** 1 talent point
- Starting spells/abilities from character creation are free (do not cost talent points)
- Respec option available at a cost (gold or rare item) to reallocate points
- Visual tree display shows unlocked, available, and locked skills

## Acceptance Criteria

- [ ] 1 talent point granted per level-up (no other rewards from leveling)
- [ ] Talent points can be spent on passive skills, spells, and rituals
- [ ] Learning a spell or ritual from any source costs 1 talent point
- [ ] Starting spells are free (no talent point cost)
- [ ] If 0 talent points available, spell/ritual learning is blocked with a message
- [ ] Skill trees display correctly with prerequisites
- [ ] Respec functionality works
