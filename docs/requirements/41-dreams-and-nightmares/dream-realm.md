# Dream Realm

As a player, I want to enter a dream realm when my character sleeps, so that resting has gameplay and I can discover secrets hidden in the subconscious world.

## Details

- When the player rests at a campfire or inn, there is a chance (based on recent events) to enter the dream realm
- Dream realm is a surreal procedurally generated map with warped physics:
  - Gravity shifts: walk on walls and ceilings
  - Doors lead to random locations (non-euclidean layout)
  - NPCs from the player's past appear with altered dialogue
  - Time flows differently: 1 dream turn = 0 real turns
- **Dream Activities**:
  - Prophetic dreams: hints about upcoming quests or hidden treasure locations
  - Memory fragments: replay key moments from the character's backstory
  - Dream merchants: sell unique dream-only items (Dream Dust, Lucid Potion, Nightmare Blade)
  - Skill training: practice combat moves in dreams to gain small XP bonuses
- **Lucid Dreaming** (skill): higher levels grant more control over dream content, ability to summon specific NPCs, reshape terrain
- Dream items: certain items only exist in dreams but have real-world effects when you wake (Dream Dust heals status effects)
- Dreams are influenced by: recent events, alignment, equipped items, active quests
- Dream journal: automatically records dream events for later review

## Acceptance Criteria

- [ ] Dream realm triggers during rest with appropriate probability
- [ ] Surreal map generation with non-euclidean properties works
- [ ] Prophetic dreams give accurate hints about game content
- [ ] Dream items carry effects into waking world
- [ ] Dream journal records all dream events
