# Murder Mystery Quests

As a player, I want to solve procedurally generated murder mysteries with unique victims, suspects, and motives, so that every mystery playthrough is different.

## Details

- **Procedural Mystery Generation**: LLM generates a murder scenario using world state:
  - Victim: randomly selected NPC with existing relationships
  - Murderer: an NPC with a generated motive (jealousy, greed, revenge, secret-keeping, madness)
  - Method: poison, stabbing, magic, staged accident, hired assassin
  - Witnesses: 1-3 NPCs who saw something but may lie or be confused
  - Clues: 4-8 planted at the scene and on suspects, plus 1-2 red herrings
- **Mystery Structure**:
  1. Discovery: find the body or be told about the murder
  2. Scene investigation: examine the crime scene
  3. Interviews: talk to witnesses and suspects (LLM dialogue, each has their own version of events)
  4. Evidence gathering: follow leads to secondary locations
  5. Confrontation: accuse a suspect with evidence (LLM evaluates if your case is strong enough)
  6. Resolution: arrest, confession, or the suspect flees (chase sequence)
- **Multiple Solutions**: some mysteries can be resolved through:
  - Justice: turn the murderer in to guards
  - Vigilante: confront and kill the murderer yourself
  - Blackmail: use the knowledge for personal gain
  - Cover-up: help the murderer hide the crime (if you agree with their motive)
- **Consequences**: the resolution affects faction reputation, NPC relationships, and may spawn follow-up quests
- **Difficulty Scaling**: early mysteries are straightforward; later ones involve conspiracies, multiple murders, and powerful suspects

## Acceptance Criteria

- [ ] Procedural generation creates unique mysteries each time
- [ ] All mystery structure phases are playable
- [ ] LLM suspect interviews maintain consistent but potentially deceptive stories
- [ ] Multiple resolution paths lead to different outcomes
- [ ] Difficulty scales with player level and progression
