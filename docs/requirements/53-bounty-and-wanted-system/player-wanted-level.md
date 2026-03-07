# Player Wanted Level

As a player, I want a wanted level system that escalates law enforcement response based on my crimes, so that criminal play has progressive consequences.

## Details

- **Wanted Level Scale** (0-5 stars):
  - 0 Stars: clean record; no pursuit
  - 1 Star: minor crimes (theft, trespassing); town guards keep an eye on you; can pay a small fine to clear
  - 2 Stars: moderate crimes (assault, repeated theft); guards pursue on sight in that town; higher fine or brief jail
  - 3 Stars: serious crimes (murder, arson); bounty hunters dispatched; wanted posters appear in nearby towns; arrest warrant in all allied towns
  - 4 Stars: major criminal (mass murder, treason); elite guards pursue across regions; NPC allies may betray you for the bounty; faction reputation tanks
  - 5 Stars: public enemy (regicide, world-threatening acts); armies mobilized; no safe town in that faction's territory; legendary bounty hunters pursue
- **Wanted Mechanics**:
  - Each crime adds heat; heat decays slowly over time (10 turns per point) when not committing new crimes
  - Witness system: crimes committed without witnesses don't add wanted level (but may be discovered later through evidence)
  - Different towns track wanted level independently; committing crimes in Town A doesn't affect Town B unless they share a faction
  - Wanted posters: at 3+ stars, NPC bounty hunters recognize you by description; disguises help temporarily
- **Evasion Tactics**: flee the jurisdiction, use disguises, bribe officials, destroy evidence, eliminate witnesses (adds more crime if caught), wait for statute of limitations (heat decay)
- **Surrender/Trial**: at any level, can surrender to guards for a trial (see justice-and-law); possible outcomes: fine, jail, exile, execution (5 stars)
- **Clearing Your Name**: pay full bounty at a guard station; complete community service quests; find a corrupt official to erase records; or become powerful enough that no one dares enforce the law
- **Outlaw Camps**: at 3+ stars, discover hidden outlaw camps where other criminals shelter; trade, rest, and find crime-related quests

## Acceptance Criteria

- [ ] Wanted level escalates correctly with crime severity
- [ ] Law enforcement response matches wanted level
- [ ] Heat decays over time when not committing crimes
- [ ] Witness system differentiates seen vs unseen crimes
- [ ] All clearing methods reduce or remove wanted level
