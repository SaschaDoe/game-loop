# Mirror Dimension

As a player, I want to discover a mirror dimension where the world is a dark reflection of the normal one, so that I can explore a twisted version of familiar locations.

## Details

- **Entry**: found through enchanted mirrors in the world; stepping through flips the map (literally mirrored layout)
- **Mirror World Properties**:
  - Map layout is the real world mirrored (left becomes right); same rooms but reversed
  - NPCs have opposite personalities (kind → cruel, cowardly → brave, honest → deceptive)
  - Enemies are shadow versions of normal creatures (stronger, darker ASCII colors)
  - Items exist in mirror forms: Mirror Blade (reverses damage resistance), Mirror Shield (reflects spells), Mirror Key (opens locked things but locks open things)
  - Day/night is inverted: bright in normal world = dark in mirror world and vice versa
- **Mirror Self**: the player's mirror double exists here — an NPC with opposite alignment and choices
  - If the player is good, Mirror Self is a villain terrorizing mirror NPCs
  - If the player is evil, Mirror Self is a hero hunting them
  - Confrontation with Mirror Self is a major boss fight; defeating them grants the ability to freely travel between dimensions
- **Mirror Puzzles**: some puzzles require acting in both dimensions simultaneously (push a block in the real world to open a door in the mirror world)
- **Mirror Corruption**: spending too long in the mirror dimension causes "mirror sickness" — the player's ASCII character starts to invert colors, stats slowly swap (STR↔INT, DEX↔WIS)
- **Mirror NPCs**: can give quests that are the inverse of real-world quests (steal from the rich, free the tyrant's prisoners who are actually criminals)

## Acceptance Criteria

- [ ] Mirror world generates as mirrored version of real world
- [ ] NPC personality inversion works with LLM dialogue
- [ ] Mirror Self adapts to player's alignment
- [ ] Cross-dimension puzzles are solvable
- [ ] Mirror sickness applies after prolonged visits
