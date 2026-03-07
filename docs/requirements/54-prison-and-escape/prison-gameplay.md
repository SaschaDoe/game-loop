# Prison Gameplay

As a player, I want being imprisoned to be a full gameplay experience with routines, alliances, and escape planning, so that getting caught by the law opens a unique game phase rather than just a loading screen.

## Details

- **Prison Entry**: triggered by arrest (see justice-and-law); sentence length varies by crime (10-500 turns)
- **Prison Routine**: daily schedule enforced by guards:
  - Morning: roll call, breakfast (low-quality food, minor debuff)
  - Midday: labor assignment (mining, laundry, kitchen — each provides different skill XP and escape opportunities)
  - Afternoon: yard time (exercise for stat maintenance, socialize with inmates, find contraband)
  - Evening: cell lockdown (rest, plan escape, craft hidden items)
- **Prison NPCs**:
  - **Inmates**: each has a backstory, skills, and potential as allies or enemies; some are innocent, some are dangerous
  - **Guards**: patrol patterns, some are bribable, some are cruel, one may be sympathetic
  - **Warden**: boss-tier NPC; fair or corrupt depending on world seed; final obstacle for some escape routes
  - **Prison Merchant**: smuggles items in exchange for favors or contraband currency (cigarettes, carved figurines)
- **Prison Activities**:
  - Form alliances with inmate factions (protection, information, resources)
  - Trade contraband (shanks, lockpicks, tunneling tools, maps)
  - Gain reputation: feared (intimidation), respected (help inmates), connected (information broker)
  - Learn skills from inmates: lockpicking from a master thief, fighting from a gladiator, alchemy from a poisoner
- **Serve Your Time**: endure the sentence; on release, equipment is returned, minor stat loss from incarceration, "Ex-Convict" reputation modifier
- Companions can attempt a rescue from outside (triggered if loyalty is high enough)

## Acceptance Criteria

- [ ] Prison routine cycle runs with correct daily phases
- [ ] Prison NPCs have unique backstories and faction dynamics
- [ ] Contraband trading and crafting function within prison
- [ ] Skill learning from inmates provides real progression
- [ ] Sentence timer counts down and releases player correctly
