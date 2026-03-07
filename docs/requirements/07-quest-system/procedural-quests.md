# Procedural Quest Generation

As a player, I want the game to generate new quests dynamically based on world state, so that content never runs out and quests feel relevant to current events.

## Details

- **LLM-Powered Quest Generation**: the system uses world state (faction standings, recent events, player actions, NPC relationships) to generate contextual quests
- **Quest Templates** the LLM fills in:
  - Fetch: "Retrieve [item] from [location] for [NPC] because [reason]"
  - Kill: "[NPC] needs [enemy type] cleared from [location] — they've been [threat description]"
  - Escort: "Guide [NPC] safely to [destination] while avoiding [danger]"
  - Mystery: "Investigate [strange event] in [location] — [NPC] suspects [theory]"
  - Diplomacy: "Mediate the dispute between [NPC A] and [NPC B] over [conflict]"
  - Delivery: "Bring [package] to [NPC] in [town] before [deadline]"
- **Contextual Relevance**: quests reference actual game events (if a town was raided, generate reconstruction quests; if a plague hit, generate cure-finding quests)
- **Difficulty Scaling**: generated quests match player level ±2
- **Quest Chains**: completing a procedural quest may spawn a follow-up that continues the story
- **Quality Filter**: generated quests are validated against world consistency (can't ask to deliver to a dead NPC or visit a destroyed location)
- Procedural quests marked differently in journal (compass icon vs scroll icon for authored quests)
- Rewards are dynamically calculated based on quest difficulty and player level

## Acceptance Criteria

- [ ] LLM generates quests that reference actual world state
- [ ] All quest templates produce playable quests
- [ ] Difficulty scaling matches player level
- [ ] Follow-up quest chains are generated from completed quests
- [ ] Quality filter prevents impossible or contradictory quests
