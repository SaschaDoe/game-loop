# Environmental Music

As a player, I want the procedural soundtrack to dynamically shift based on my location, situation, and emotional context, so that the music enhances atmosphere without being repetitive.

## Details

- **Location-Based Themes**: each biome/location type has a base musical theme generated procedurally:
  - **Town**: warm, major key; plucked strings, light percussion; tempo: moderate; friendly and inviting
  - **Forest**: organic, flowing; woodwind-like tones, rustling ambient; tempo: slow; mysterious and calm
  - **Dungeon**: minor key, tense; low drones, sparse percussive hits, echoing tones; tempo: slow; oppressive and claustrophobic
  - **Combat**: intense, rhythmic; heavy percussion, rapid arpeggios, staccato bursts; tempo: fast; adrenaline-inducing
  - **Boss Fight**: epic, layered; full "orchestra" (synth layers simulating ensemble); tempo: variable (phases); dramatic and climactic
  - **Desert**: sparse, open; sustained tones, occasional metallic shimmer, wind-like synthesis; tempo: very slow; vast and lonely
  - **Ocean/Sailing**: rolling, wave-like; arpeggiated chords, swelling dynamics; tempo: moderate; adventurous and free
  - **Underground/Cave**: dripping resonance, deep bass drones, crystalline echoes; tempo: ambient/no fixed tempo; alien and ancient
- **Situational Transitions**: music cross-fades between themes over 3-5 seconds when situations change:
  - Entering combat: tempo increases, key shifts to minor, percussion layers added
  - Victory: brief triumphant fanfare, then return to location theme
  - Low HP: heartbeat bass added, tempo increases subtly
  - Discovery (finding treasure, secret area): bright arpeggio sting, followed by wonder theme
  - NPC death: somber chord progression, temporary minor key shift
  - Night: all themes gain lower pitch, slower tempo, reduced volume
- **Emotional Layer**: an additional musical layer that reflects the character's emotional state (from karma, companion interactions, quest progress): hopeful = major 7th chords added; dark = dissonant intervals; triumphant = brass-like fanfares; sorrowful = descending minor scales
- **Player-Influenced Music**: if the player is a bard, their instrument choice slightly tints all music (a lute bard hears more string emphasis globally); subtle personalization
- **Silence as Sound Design**: certain moments intentionally have no music (entering a truly empty void, the moment before a boss appears, dead silence in solitary confinement); silence is a powerful audio tool
- **Web Audio Implementation**: all music generated via Web Audio API oscillators, filters, and envelopes; no audio file downloads; total size = 0 bytes of music assets

## Acceptance Criteria

- [ ] Each location type generates a distinct procedural theme via Web Audio API
- [ ] Transitions cross-fade smoothly between themes on situation change
- [ ] Emotional layer correctly reflects character state
- [ ] Night/day modifies all themes appropriately
- [ ] Zero audio files used — all generated procedurally
