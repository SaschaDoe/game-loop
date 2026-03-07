# Prison Factions

As a player, I want to navigate competing prison gangs and ally with or oppose them, so that prison politics create meaningful social gameplay.

## Details

- **Prison Factions** (3-4 per prison, procedurally composed):
  - **The Iron Circle**: ex-soldiers and fighters; control the yard; offer protection for loyalty; value strength and honor
  - **The Whisper Network**: information brokers and spies; control gossip and secrets; offer intelligence for favors; value cunning
  - **The Rats**: smugglers and thieves; control contraband flow; offer items for gold/services; value resourcefulness
  - **The Zealots**: religious or ideological fanatics; control the chapel; offer spiritual bonuses and healing; value faith and obedience
- **Faction Mechanics**:
  - Reputation tracked per faction (-100 to +100)
  - Joining a faction provides: protection from that faction's enemies, access to their resources and territory, faction-specific quests
  - Opposing factions attack on sight in their territory; neutral factions ignore you
  - Faction conflicts: periodic violence between factions; choosing sides or staying neutral
- **Faction Quests** (examples):
  - Iron Circle: beat the rival faction's champion in a yard brawl
  - Whisper Network: eavesdrop on guard conversations and report back
  - Rats: smuggle a package past guards during meal time
  - Zealots: convert another prisoner to the faith through LLM persuasion
- **Faction Leaders**: named NPCs with backstories; befriending them unlocks special rewards (unique escape assistance, permanent contacts after release)
- **Double Agent**: work for multiple factions secretly; high reward but discovery means all factions become hostile
- **Power Vacuum**: if a faction leader is killed (by you or during a riot), the faction splinters; opportunity to fill the void or exploit the chaos
- **Post-Release Contacts**: former prison allies may help you in the outside world (safe houses, information, backup in fights)

## Acceptance Criteria

- [ ] All prison factions have distinct personalities and resources
- [ ] Faction reputation tracks and affects NPC behavior
- [ ] Faction quests are completable with correct rewards
- [ ] Double agent gameplay carries appropriate risk
- [ ] Post-release contacts provide real outside-world benefits
