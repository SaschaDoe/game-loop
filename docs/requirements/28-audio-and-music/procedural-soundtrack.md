# Procedural Soundtrack

As a player, I want ambient music and sound effects that adapt to the current situation, so that the atmosphere is immersive and reacts to what's happening in the game.

## Details

- Web Audio API-based procedural music generation (no large audio files to download)
- Music layers that blend based on context:
  - **Exploration**: gentle ambient pads, soft arpeggios, nature sounds
  - **Town**: lively tavern music, market chatter, blacksmith hammering
  - **Combat**: driving percussion, tense staccato strings, escalating intensity
  - **Boss fight**: epic full arrangement, choir stabs, dramatic crescendos
  - **Dungeon**: eerie drones, dripping water echoes, distant rumbles
  - **Night**: crickets, owl hoots, haunting melody
  - **Horror areas**: dissonant chords, heartbeat pulse, whispers
- Music transitions smoothly between states (crossfade over 2-3 seconds)
- Biome-specific instrument palettes: desert (oud, tabla), tundra (throat singing, wind), forest (flute, harp)
- Sound effects for: footsteps (surface-dependent), sword swings, spell casts, door opens, item pickup, level up fanfare
- Volume controls: master, music, SFX, ambient (all independently adjustable)
- Mute button and full audio disable for silent play
- **Dynamic Intensity**: combat music escalates as player HP drops; victory fanfare plays on last enemy killed
- **Musical Memory**: areas the player has visited often develop a subtle recurring motif (your "theme" for that place)
- **Silence as Tool**: some horror areas deliberately go silent before a scare — absence of music signals danger
- **Heartbeat SFX**: when HP is below 20%, a heartbeat underlays all other audio; speeds up as HP drops further
- **Seasonal Audio**: winter areas have wind-heavy ambience, summer has birdsong and insects, rain adds patter to all outdoor music
- **NPC Humming**: town NPCs occasionally hum fragments of the town's theme; bards play full versions
- Audio engine uses Web Audio API oscillators and noise generators — total audio payload under 50KB

## Acceptance Criteria

- [ ] Music adapts to game state in real-time
- [ ] Transitions between music states are smooth
- [ ] Sound effects trigger on appropriate actions
- [ ] All volume controls work independently
- [ ] Audio can be fully disabled
