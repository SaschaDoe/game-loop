# Ghost Abilities

As a player who has died and entered the ghost realm, I want unique ghost abilities that let me interact with the living world in limited ways, so that death creates a different gameplay phase rather than just ending the game.

## Details

- **Ghost State**: upon death, player becomes a ghost; visible only to Spirit Sight users, animals (who react with fear), and in haunted locations; can't interact with physical objects normally; can move through walls; immune to physical damage; vulnerable to holy/radiant damage and banishment
- **Ghost Abilities**:
  - **Whisper** (free): speak to a living creature; they hear a faint whisper; WIS check for them to understand; can communicate quest info, warnings, or pleas for resurrection to companions
  - **Poltergeist** (5 spirit energy): move a small object (push a book off a shelf, slam a door, knock over a candle); living creatures notice and may investigate; useful for signaling or scaring
  - **Possess Object** (10 spirit energy): inhabit an object temporarily (weapon attacks on its own, armor glows, furniture animates); lasts 5 turns; limited control; useful for helping living allies in combat
  - **Chill Touch** (8 spirit energy): reach through the veil and deal cold damage to a living creature; minor damage (5); drains 1 point of their STR temporarily; the only ghost combat option
  - **Haunt** (15 spirit energy): attach yourself to a location or person; they feel uneasy, have nightmares, hear sounds; living creatures with low WIS become frightened; good for driving enemies away
  - **Manifest** (20 spirit energy): become briefly visible and semi-solid (3 turns); can speak normally, interact with objects, even fight (at 50% normal stats); exhausting — can't manifest again for 50 turns
  - **Dream Visit** (12 spirit energy): enter a sleeping creature's dream; speak with them in the dream; full conversation possible; they may or may not remember upon waking (WIS check)
- **Spirit Energy**: ghost resource; max 50; regenerates slowly (1 per 5 turns); faster near death sites, graveyards, and haunted locations; using spirit energy near holy ground drains it faster
- **Resurrection Path**: as a ghost, seek resurrection by: finding a priest willing to resurrect (must manifest to ask), guiding allies to your body, finding a resurrection artifact, or completing a ghost-realm quest (the Death God offers resurrection in exchange for a service)
- **Permanent Death**: if ghost energy reaches 0 and can't regenerate (no nearby death sites), the ghost fades; true permanent death; timer of 200 turns as a ghost before natural fading begins

## Acceptance Criteria

- [ ] Ghost state correctly restricts physical interaction and grants wall-phasing
- [ ] All ghost abilities consume correct spirit energy and produce correct effects
- [ ] Spirit energy regeneration scales with location type
- [ ] Resurrection paths all function as viable return-to-life options
- [ ] Permanent death triggers correctly when ghost energy and time expire
