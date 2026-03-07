# NPC Professions

As a player, I want NPCs to have diverse professions that affect their knowledge, dialogue, services, and daily behavior, so that each NPC feels like they have a role in the world.

## Details

- Professions and their unique services:
  - **Blacksmith**: repairs equipment, sells weapons/armor, can upgrade item quality for materials + gold
  - **Alchemist**: sells potions, identifies unknown potions, teaches alchemy recipes
  - **Herbalist**: sells herbs, teaches herb locations, cures diseases
  - **Librarian**: sells/lends lore books, fills codex entries, identifies magical items
  - **Priest**: heals, removes curses, resurrects companions, offers blessings
  - **Guard Captain**: posts bounties, provides town intel, recruits player for defense missions
  - **Innkeeper**: provides rooms for rest, sells food/drink, shares local rumors
  - **Bard**: performs for tips, teaches songs (Bard class), shares distant news and lore
  - **Farmer**: sells produce, offers harvest-related quests, knows weather patterns
  - **Miner**: sells ore, knows cave locations, offers mining quests
  - **Fisherman**: sells fish, knows water locations, teaches fishing spots
  - **Sailor**: offers passage to islands, shares sea rumors, sells nautical maps
  - **Thief (hidden)**: fences stolen goods, teaches lockpicking, offers heist quests, found in back alleys
  - **Grave Digger**: knows about undead activity, sells bone components, hints at buried treasure
- Profession determines: LLM dialogue context, shop inventory, available quests, daily schedule
- NPCs discuss their profession naturally in conversation

## Acceptance Criteria

- [ ] All professions are represented across towns
- [ ] Profession-specific services are functional
- [ ] LLM dialogue context includes profession knowledge
- [ ] Profession affects NPC daily routines
