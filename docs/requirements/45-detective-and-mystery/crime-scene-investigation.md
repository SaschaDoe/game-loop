# Crime Scene Investigation

As a player, I want to investigate crime scenes by examining clues, interviewing witnesses, and deducing suspects, so that the game offers detective gameplay beyond combat.

## Details

- **Crime Types**: murder, theft, arson, kidnapping, poisoning, smuggling, sabotage
- **Investigation Tools**:
  - **Examine**: inspect objects at the scene for clues (bloodstains, footprints, torn fabric, weapon marks)
  - **Detect Magic**: reveal magical residue (identifies spell type used)
  - **Interview**: LLM-powered witness interrogation — ask open questions, catch inconsistencies, press for details
  - **Tracking**: follow footprints/scent trails from the scene (Perception check, degrades with time/weather)
  - **Forensics**: analyze collected evidence at an alchemy station (identify poison type, match blood to suspect, read burnt documents)
- **Clue Board**: collected clues appear on a board in the journal; player can draw connections between clues
- **Suspect System**: NPCs become suspects based on evidence; each suspect has motive, means, and opportunity
- **Red Herrings**: some clues deliberately mislead; high Intelligence helps identify false leads
- **Accusation**: present evidence to a guard captain or judge; wrong accusation loses reputation; right one gives reward + justice
- **Case Difficulty**: simple (1-2 suspects, clear evidence) to complex (5+ suspects, contradictory evidence, corrupt officials covering tracks)
- **Cold Cases**: old unsolved crimes found in archives; investigating these reveals long-buried secrets
- Time pressure: some crimes have ongoing consequences (kidnap victim is alive but time is running out)

## Acceptance Criteria

- [ ] All investigation tools produce relevant clues
- [ ] LLM witness interviews respond to player questions contextually
- [ ] Clue board tracks and allows connecting evidence
- [ ] Accusation system validates evidence against the correct suspect
- [ ] Red herrings are present but identifiable with high stats
