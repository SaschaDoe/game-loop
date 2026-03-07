# Siege Battles

As a player, I want to participate in large-scale siege battles where armies attack or defend fortified locations, so that the game has epic war set-pieces beyond small skirmishes.

## Details

- Siege events triggered by: main story quest, faction war escalation, random world event, player instigation
- Player role: commander + individual combatant (switch between tactical overview and ground-level fighting)
- Tactical overview: position units on the battlefield, assign targets, order charges/retreats
- Unit types under your command: infantry, archers, cavalry, siege engines (battering rams, catapults)
- Defender mechanics: man the walls, pour boiling oil, fire arrow volleys, repair gates
- Attacker mechanics: deploy ladders, batter the gate, tunnel under walls, use siege towers
- Battle phases: approach, outer wall, inner courtyard, throne room (if attacking) or last stand (if defending)
- Player actions during the battle affect morale: killing enemy champions boosts ally morale, fleeing drops it
- Outcome affects world state: conquered town changes faction, destroyed buildings, NPC casualties persist
- Post-siege: looting period, prisoner negotiations, reconstruction quests

## Acceptance Criteria

- [ ] Siege battles render with large-scale ASCII combat
- [ ] Tactical overview and ground combat are both functional
- [ ] Unit commands affect battle outcome
- [ ] Siege results permanently change world state
