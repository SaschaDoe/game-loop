# NPC Romance

As a player, I want to build romantic relationships with certain NPCs through dialogue and actions, so that the game has emotional depth and personal stakes.

## Details

- **Romanceable NPCs**: 6-8 unique NPCs across different towns, classes, and personalities
- **Relationship Progression**: Stranger → Acquaintance → Friend → Close Friend → Romantic Interest → Partner
- Progression driven by: dialogue choices (LLM evaluates sincerity, humor, compatibility), gift-giving, quest completion together, shared experiences
- **Compatibility**: each romanceable NPC has preferences (values bravery, humor, intelligence, kindness) — player actions throughout the game affect compatibility score
- **Date Events**: once at Romantic Interest stage, can invite NPC on activities (stargazing, tavern dinner, dungeon delve, festival attendance) — each triggers unique LLM dialogue
- **Partner Benefits**: NPC joins as a permanent companion, unique combo attacks, shared inventory, morale boost (+2 all stats when together)
- **Breakup/Betrayal**: neglecting the relationship, romancing others, or moral choices the NPC disagrees with can end the relationship; ex-partners become cold or hostile
- **Jealousy System**: romancing multiple NPCs simultaneously risks all of them finding out (NPCs talk to each other)
- NPC romance is entirely optional and never required for main quest progression
- All romances are tasteful — fade-to-black for any intimate scenes

## Acceptance Criteria

- [ ] Relationship progression tracks correctly through all stages
- [ ] LLM dialogue evaluates romantic interaction quality
- [ ] Date events trigger unique conversations
- [ ] Partner companion benefits apply in gameplay
- [ ] Jealousy system detects multiple simultaneous romances
