# Spatial Audio Cues

As a player, I want audio cues that hint at nearby enemies, treasures, and hazards based on direction and distance, so that sound becomes a useful gameplay tool.

## Details

- Stereo panning: sounds from the left of the player pan left in headphones, and vice versa
- Distance attenuation: nearby sounds are louder, distant sounds are faint
- Audio cues for:
  - Enemies: growls, footsteps, weapon clanking (louder = closer)
  - Water: flowing water sound near rivers and underwater areas
  - Treasure: faint magical shimmer near hidden chests or artifacts
  - Traps: subtle mechanical clicking near armed traps (Perception-enhanced)
  - NPCs: ambient conversation murmur near populated areas
  - Boss proximity: deep rumble that intensifies as you approach
- Audio-only secrets: some hidden passages are hinted by sound (wind through a crack, echo in a dead end)
- Accessibility: all audio cues have optional visual equivalents (flashing tile borders, text indicators)

## Acceptance Criteria

- [ ] Stereo panning reflects spatial position relative to the player
- [ ] Distance attenuation scales correctly
- [ ] Audio cues provide genuine gameplay information
- [ ] Visual equivalents exist for all audio cues
