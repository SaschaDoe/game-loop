# NPC Storytelling

As a player, I want NPCs to tell stories, share legends, and recount personal experiences through LLM dialogue, so that the world's history feels alive and spoken rather than just written.

## Details

- **Story Types**:
  - **Personal Anecdotes**: NPCs share their own life experiences; a blacksmith talks about learning the trade, a soldier recounts a battle, a farmer describes a drought
  - **Local Legends**: area-specific tales about haunted places, legendary heroes, hidden treasures; may contain real gameplay hints
  - **Faction Lore**: NPCs from factions tell their organization's origin story, famous members, and grudges
  - **Tall Tales**: exaggerated stories from bards and tavern regulars; entertaining but unreliable; may contain a grain of truth
  - **Campfire Stories**: companions share stories during rest; deepens their backstory and reveals hidden motivations
  - **Cautionary Tales**: NPCs warn about dangers through narrative ("Let me tell you about the last fool who entered that dungeon...")
- **Story Triggers**: ask NPCs about their past, sit in taverns, rest with companions, visit historical sites, attend festivals
- **Story Accuracy**: LLM generates stories that are consistent with world state; local legends reference actual locations and items; personal stories match the NPC's established background
- **Story Rewards**: listening to stories grants: lore codex entries, quest hints (subtle — not directly stated), relationship bonuses with the storyteller, occasional maps or item locations
- **Storytelling Skill** (Bard): tell your own stories to NPCs; good stories improve reputation, attract crowds (earn tips), and can influence NPC opinions
- **Story Collection**: journal section for heard stories; complete collections (all stories from a faction, all local legends) grant bonuses
- **Oral Tradition**: some information exists only in NPC stories — never written in books; requires talking to the right people

## Acceptance Criteria

- [ ] LLM generates stories consistent with world state and NPC background
- [ ] Story types match the context (tavern, campfire, historical site)
- [ ] Listening to stories unlocks codex entries and subtle quest hints
- [ ] Bard storytelling skill affects NPC reactions
- [ ] Story collection tracking works in the journal
