# Horror Quests

As a player, I want to encounter horror-themed quests with psychological tension and dread, so that the game offers moments of genuine unease and atmospheric storytelling.

## Details

- Horror quest mechanics:
  - **Sanity system**: exposure to eldritch horrors reduces sanity; low sanity causes hallucinations (fake enemies, distorted map, misleading messages)
  - **Unreliable narrator**: the game messages may lie to the player at low sanity ("You feel fine" when poisoned)
  - **Stalker enemy**: an unkillable entity that slowly follows the player through the dungeon (must be avoided or escaped)
  - **Isolation**: companions refuse to enter; player must go alone
  - **Darkness escalation**: light sources dim progressively; complete darkness is lethal
- Horror quest examples:
  - **The Whispering Crypt**: voices call the player deeper; the dungeon rearranges behind you
  - **The Dollmaker**: an NPC village where everyone has been replaced by constructs
  - **The Mirror World**: a dungeon that mirrors the player's actions — a shadow copy fights back
  - **The Infection**: a spreading corruption on the map; stay too long and your character changes
- Sanity restores by: resting at temples, drinking calming potions, companion conversation
- Horror content can be toggled off in settings for players who prefer not to experience it

## Acceptance Criteria

- [ ] Sanity system tracks and applies hallucination effects
- [ ] Stalker enemy AI follows persistently without being killable
- [ ] Horror quests have unique atmospheric mechanics
- [ ] Horror content is togglable in settings
