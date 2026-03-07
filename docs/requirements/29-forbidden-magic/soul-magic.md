# Soul Magic

As a player, I want to interact with the souls of the living and dead through forbidden soul magic, so that the darkest magic school offers unique power over life and death.

## Details

- **Soul Magic Spells**:
  - **Soul Sight** (Lv5): see the soul essence of all creatures in 10-tile radius; reveals: alive/undead/soulless, soul strength (correlates to level), soul damage (cursed/corrupted)
  - **Soul Rend** (Lv10): tear at a target's soul; psychic + necrotic damage; if the target dies from this spell, their soul is captured in a soul gem
  - **Soul Trap** (Lv8): enchant a gem to capture the next soul released nearby (enemy death); trapped souls are a crafting resource
  - **Soul Transfer** (Lv18): move a soul between bodies; transplant a dead ally's soul into a golem/construct/empty body; the ally lives again but in a new form
  - **Soul Devour** (Lv20): consume a trapped soul for a permanent +1 to a random stat; max 5 devoured souls; each devour shifts alignment toward evil and adds a whisper to the message feed (the consumed soul protests)
  - **Soul Shield** (Lv12): surround yourself with trapped souls; each soul absorbs 20 damage before being destroyed; moral cost — souls suffer visibly
  - **Soulless** (Lv25): remove your own soul and store it in a phylactery; become immune to soul-based attacks, charm, and fear; but lose all emotion-based dialogue options, CHA drops to 1, companions are disturbed
- **Soul Gems**: consumable resource; small (animal souls, weak), medium (humanoid souls, moderate), large (powerful creature souls, strong), legendary (dragon/boss souls, immense)
- **Soul Economy**: soul gems are extremely valuable to necromancers, certain merchants, and dark factions; some quests require soul gems as currency
- **Moral Weight**: every soul magic use has heavy karma consequences; NPCs with Wisdom can sense soul corruption; temples refuse service to heavy soul magic users
- **Soul Whispers**: consumed souls occasionally provide useful information or warnings through the message feed; they retain fragments of their living knowledge

## Acceptance Criteria

- [ ] All soul magic spells function with correct effects
- [ ] Soul gems capture and store souls correctly
- [ ] Soul Devour provides permanent stat gains with moral consequences
- [ ] Soul Transfer moves consciousness between bodies
- [ ] Moral weight system tracks soul magic karma
