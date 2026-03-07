# Stage Plays

As a player, I want to write, direct, and perform in stage plays at theaters, so that creative expression is a viable gameplay path with social and financial rewards.

## Details

- **Theater Locations**: major cities have theaters; small towns have makeshift stages in taverns; player can build a private theater in their homestead
- **Play Creation**:
  - Write a script: choose genre (comedy, tragedy, romance, historical, horror); LLM generates a script outline based on player's choice and game world events
  - Cast actors: recruit NPC actors; each has Acting skill, CHA score, and personality (diva, reliable, nervous); better actors cost more gold
  - Direct rehearsals: spend 20-50 turns rehearsing; player makes directing choices (dramatic pause here, louder there); each rehearsal improves performance quality
  - Set design: choose stage props and backdrops from available inventory; some plays require specific items (a real sword for a battle scene, a crown for a coronation)
- **Performance Night**:
  - Audience fills seats based on town size and theater reputation
  - Performance quality = script quality + actor skills + rehearsal time + directing choices + random variance
  - Player can act in the play themselves (Performance skill check each scene); improvisation options for unexpected moments
  - Audience reacts in real-time: cheering, booing, crying, walking out; reactions displayed in message feed
- **Outcomes**:
  - Critical success: standing ovation; gold from ticket sales + patron donations; +10 local reputation; NPC critics write favorable reviews (spreads fame to other cities)
  - Success: applause; standard gold; +5 reputation
  - Mixed: polite reception; break-even gold; no reputation change
  - Failure: booing, thrown objects; reputation -5; actors may quit; critics savage the play
- **Play Topics**: plays based on actual game events draw bigger crowds (the hero who slew the dragon, the political scandal, the great war); player's own adventures make excellent material
- **Theater Rivalry**: competing theaters in the same city; sabotage (steal actors, bad reviews, stage accidents) or outperform legitimately; winning the seasonal "Grand Stage" competition earns the "Master Playwright" title

## Acceptance Criteria

- [ ] Script creation uses LLM to generate genre-appropriate outlines
- [ ] Actor recruitment and rehearsal improve performance quality
- [ ] Audience reactions scale with performance quality
- [ ] Plays based on real game events attract larger audiences
- [ ] Theater rivalry creates competitive quest content
