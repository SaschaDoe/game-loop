# Observer Mode

As a player, I want a read-only observer mode where I can watch the world simulate itself, so that I can enjoy the emergent behavior of NPCs, monsters, and the environment without interfering.

## Details

- Camera follows the action freely; player can pan around the map
- NPCs go about their daily routines, interact with each other, trade, argue, sleep
- Monsters roam, hunt, and fight NPCs or each other
- Weather and day/night cycle continue
- Player cannot interact with anything; no character on the map
- Optional: speed controls (1x, 2x, 5x, 10x) to fast-forward simulation
- Can switch to normal play mode at any time by "spawning in" a character
- A text feed shows notable events: "The merchant closed his shop", "A goblin raided the farm"

## Acceptance Criteria

- [ ] Observer mode is selectable from the main menu
- [ ] World simulates autonomously with NPC and monster AI
- [ ] Player has free camera movement with no world interaction
- [ ] Speed controls adjust simulation rate
- [ ] Event feed displays world happenings
