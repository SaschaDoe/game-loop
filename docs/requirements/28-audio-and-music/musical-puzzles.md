# Musical Puzzles

As a player, I want dungeons and quests to contain music-based puzzles where I must play or recognize sequences of notes, so that the audio system is woven into gameplay.

## Details

- **Puzzle Types**:
  - **Echo Sequence**: a magical instrument plays a melody; player must repeat it by selecting notes in order; sequences get longer each round (3, 5, 7, 9 notes); wrong note resets the sequence; 3 failures triggers a trap
  - **Harmonic Lock**: a door has multiple tuning crystals; each crystal emits a tone when activated; player must activate crystals in the right combination to create a harmonious chord; dissonant combinations deal sonic damage
  - **Rhythm Gate**: platforms appear and disappear in a rhythmic pattern; player must time movement to the beat; visual and audio cues indicate the pattern; faster tempo = harder puzzle
  - **Song Reconstruction**: find scattered sheet music fragments in a dungeon; piece them together; play the complete song on a magical instrument to open the path; fragments can be found in any order
  - **NPC Duet**: a ghostly musician plays half a melody; player must improvise the complementary part; LLM evaluates musical "sense" based on note choices; creative solutions accepted
  - **Sound Map**: a dark room where you navigate by sound alone; different floor tiles produce different tones; map the room by listening to footstep sounds; find the exit using audio memory
- **Musical Skill Integration**: characters with the Performance skill get easier puzzles (fewer notes to remember, slower tempo, hint highlighting); bard class gets bonus hints
- **Accessibility**: visual representation of all audio cues for hearing-impaired players; color patterns mirror sound patterns; vibration feedback option
- **Puzzle Rewards**: musical puzzles guard unique sonic-themed items (thunderclap hammer, whisper boots, echo shield)

## Acceptance Criteria

- [ ] All puzzle types produce correct audio using Web Audio API
- [ ] Difficulty scales appropriately within each puzzle type
- [ ] Performance skill correctly reduces puzzle difficulty
- [ ] Accessibility alternatives provide equivalent information
- [ ] Correct solutions unlock progression and rewards
