# Song Composition

As a Bard player, I want to compose custom songs by combining musical elements, so that I can create personalized performances with unique effect combinations.

## Details

- Composition system: combine a melody (effect type), rhythm (duration/strength), and harmony (range/targeting)
- Melodies: offensive, defensive, healing, utility, debuff
- Rhythms: fast (short duration, strong effect), slow (long duration, mild effect), building (starts weak, crescendos to powerful)
- Harmonies: solo (self only), duet (self + 1 ally), chorus (all allies in range), discord (all enemies)
- Example custom song: offensive melody + fast rhythm + discord harmony = short burst of AoE damage to all enemies
- Compositions are saved and named by the player
- Maximum 8 saved compositions (song book)
- Masterwork compositions: combine 3+ elements at high Bard level for compound effects
- Share compositions: export as a code string, import another player's compositions

## Acceptance Criteria

- [ ] Melody + rhythm + harmony combinations produce correct effects
- [ ] Custom songs are saveable and nameable
- [ ] Masterwork compositions enable compound effects
- [ ] Export/import of compositions works
