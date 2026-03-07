# Ambient World Sounds

As a player, I want ambient environmental sounds that change based on location, weather, and time of day, so that the world feels immersive through audio.

## Details

- **Biome Ambience**:
  - Forest: birdsong, rustling leaves, distant woodpecker, creaking branches
  - Swamp: frogs, mosquito buzz, bubbling mud, occasional splash
  - Desert: wind howl, sand shifting, distant eagle cry, heat shimmer hum
  - Tundra: howling wind, ice cracking, snow crunch underfoot, distant wolf howl
  - Cave: dripping water, echoing footsteps, distant rumble, bat squeaks
  - Ocean: waves, seagulls, ship creaking, wind in sails
  - Town: crowd murmur, merchant calls, blacksmith hammer, children playing
- **Weather Layers** (added on top of biome sounds):
  - Rain: patter intensity scales with rainfall; thunder on storms
  - Wind: howl scales with strength; gusts are directional
  - Snow: muffled silence, soft landing sounds
  - Fog: dampened ambience, eerie distant sounds seem closer
- **Time of Day**:
  - Dawn: rooster crow, bird chorus starts
  - Day: full ambience
  - Dusk: crickets begin, birds quiet, owls start
  - Night: crickets, owls, wolves, minimal other fauna
- **Interior Sounds**: tavern (chatter, clinking, fire crackle), dungeon (echoes amplified), library (page turning, quill scratching), temple (choir, bells)
- **Footstep Variation**: sound changes based on surface — stone, wood, grass, water, sand, snow, metal grate
- Ambient sounds crossfade between zones over 3-5 seconds for seamless transitions
- All generated procedurally — no audio files needed

## Acceptance Criteria

- [ ] Each biome has a distinct ambient sound profile
- [ ] Weather sounds layer correctly over biome ambience
- [ ] Time of day modifies ambient fauna sounds
- [ ] Footstep sounds vary by surface type
- [ ] Zone transitions crossfade smoothly
