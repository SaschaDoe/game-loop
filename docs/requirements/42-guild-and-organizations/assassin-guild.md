# Assassin Guild

As a player, I want to join and advance through an assassin guild with contract kills, stealth missions, and a hidden headquarters, so that a dark profession path offers unique gameplay.

## Details

- **Guild Discovery**: the assassin guild doesn't advertise; must be found through: killing an NPC witnessed by a guild recruiter (they approach you), following cryptic clues in tavern conversations, or receiving a mysterious note after high stealth kills
- **Initiation**: prove your skill with 3 trial contracts (each tests a different ability): silent kill (no witnesses, no combat), poison kill (no direct combat), public kill (in broad daylight, escape without capture)
- **Contract System**:
  - Contracts posted on a hidden board in the guild hideout; each details: target name, location, deadline, payment, and special conditions
  - **Simple Contracts**: kill a specific NPC; any method; low pay; good for ranking up
  - **Conditional Contracts**: kill with specific restrictions (must look like an accident, must use poison, must leave a calling card, target must be alone); higher pay
  - **Impossible Contracts**: heavily guarded targets, targets in restricted areas, political figures; highest pay; failure has severe consequences
  - **Refusal**: can decline contracts without penalty; but refusing a contract assigned by the guild master = suspicion
- **Methods**:
  - Blade: silent backstab, throat slit, dagger throw; classic and reliable
  - Poison: coat food/drink, poisoned dart, contact poison on objects the target will touch; requires alchemy knowledge
  - Accident: push off a ledge, sabotage equipment, lure into a trap area; requires planning and environment interaction
  - Infiltration: disguise as a servant/guard, get close, strike when alone; requires disguise kit and social skills
- **Guild Ranks**: Initiate, Blade, Shadow, Phantom, Grandmaster; each rank unlocks: new contract tiers, better equipment access, assassination techniques, and guild safe houses in more cities
- **Guild Politics**: rival assassin guilds exist; inter-guild wars result in defense missions; betraying the guild triggers the "Dark Mark" (every guild member is ordered to hunt you)

## Acceptance Criteria

- [ ] Guild discovery triggers from correct player actions
- [ ] All contract types generate with appropriate targets and conditions
- [ ] Kill methods each use correct skill checks and planning
- [ ] Rank advancement unlocks correct content
- [ ] Guild betrayal triggers the hunt mechanic correctly
