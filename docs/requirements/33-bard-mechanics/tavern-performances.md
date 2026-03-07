# Tavern Performances

As a player, I want to perform music in taverns for gold, reputation, and crowd reactions, so that bard gameplay has a dedicated performance venue system.

## Details

- **Performance Setup**: approach the tavern stage or ask the innkeeper for a performance slot; some taverns have open mic, others require audition (CHA check); busy taverns = larger audience = more gold potential
- **Performance Types**:
  - **Solo Instrumental**: play your instrument; skill check determines quality; crowd reacts in real-time via message feed; tips accumulate per turn of playing
  - **Singing**: perform a song (player selects from learned songs or composes); CHA + Performance check; some songs have magical effects on the audience
  - **Storytelling**: narrate a tale (LLM generates the story based on player's actual adventures); audience engagement based on how exciting the real events were; embellishment option (Deception check for dramatic flair)
  - **Comedy**: tell jokes (LLM generates humor based on game world context); crowd either laughs (gold + reputation) or heckles (CHA save or lose confidence)
  - **Ensemble**: if traveling with companion musicians, perform together; combined skill checks; ensemble bonuses (+25% tips)
- **Crowd Reactions**:
  - Standing ovation: exceptional performance; double gold, +5 local reputation, NPCs approach to offer quests or information
  - Warm applause: good performance; standard gold, +2 reputation
  - Polite clapping: mediocre; minimal gold, no reputation change
  - Booing: poor performance; no gold, -2 reputation, possible thrown objects (minor damage)
  - Riot: terrible performance in a rough tavern; patrons attack; must fight or flee
- **Signature Songs**: developing a song that you perform repeatedly builds its recognition; NPCs start requesting it; eventually becomes your "signature" (permanent +1 CHA in the region)
- **Tavern Circuit**: performing in 10+ different taverns across the world unlocks "Traveling Bard" reputation; innkeepers offer free rooms; exclusive high-society performance invitations

## Acceptance Criteria

- [ ] All performance types use correct skill checks
- [ ] Crowd reactions scale with performance quality
- [ ] Storytelling generates LLM content from actual player history
- [ ] Signature song mechanics track repetition and recognition
- [ ] Tavern circuit tracks unique venues and unlocks rewards
