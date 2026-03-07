# Double Agent

As a player, I want to serve two opposing factions simultaneously by feeding intelligence to both sides, so that espionage gameplay includes the tension of maintaining dual loyalties.

## Details

- **Becoming a Double Agent**: when serving one faction's spy network, the opposing faction approaches you (or you approach them); agree to feed intel to both sides; triggers the double agent status (hidden from both factions)
- **Dual Objectives**: receive missions from both factions simultaneously; some missions conflict (faction A wants you to protect a target, faction B wants you to assassinate them); must find creative solutions to satisfy both or choose which to betray
- **Intelligence Management**:
  - Receive real intel from faction A; decide what to share with faction B (and vice versa)
  - Can share real intel (dangerous to your primary faction), altered intel (Deception check to make it believable), or worthless intel (CHA check to sell it as important)
  - Each faction tracks how useful your intel has been; too many worthless tips = suspicion
- **Suspicion Meter**: each faction has a suspicion meter (0-100); rises when you miss objectives, provide bad intel, are seen near the wrong people, or fail Deception checks; at 50 suspicion = interrogation event; at 75 = followed by agents; at 100 = exposed (capture, torture, execution attempt)
- **Cover Maintenance**: attend faction meetings, complete loyalty missions, participate in social events; each interaction is a chance to lower suspicion or accidentally raise it
- **Handler NPCs**: each faction assigns a handler; they communicate via dead drops, coded messages, and secret meetings; handlers have personalities (paranoid handler = more tests, relaxed handler = easier management)
- **Endgame Options**: eventually one side discovers the truth; choose to fully commit to one faction (betray the other dramatically), burn both and go independent, or try to broker peace using your dual position
- **Rewards**: double agent earns rewards from both factions simultaneously; unique items available only through double agent quests; "Spymaster" title if you maintain the ruse for 1000+ turns

## Acceptance Criteria

- [ ] Dual mission objectives generate conflicting goals correctly
- [ ] Intelligence sharing uses correct Deception checks
- [ ] Suspicion meters track independently for each faction
- [ ] Exposure triggers appropriate consequences
- [ ] Endgame options all resolve with distinct outcomes
