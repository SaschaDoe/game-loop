# Eldritch Encounters

As a player, I want to stumble upon cosmic horror encounters that defy normal game logic, so that certain areas feel genuinely alien and unsettling.

## Details

- **Eldritch Locations** (rare, 1-2 per world):
  - **The Wrongness**: a zone where the ASCII map distorts — walls breathe (characters shift), corridors loop impossibly, the minimap shows a different layout than what you see
  - **The Sunken Library**: flooded ruins filled with forbidden knowledge; reading books grants powerful spells but drains sanity; a librarian entity asks impossible riddles
  - **The Flesh Cathedral**: organic dungeon made of living tissue; walls pulse, floors are sticky, enemies are absorbed body parts; the "boss" is the building itself
- **Eldritch Enemies**:
  - **The Watcher**: a massive eye that fills an entire room; doesn't attack physically but drains sanity by staring; must break line of sight to avoid damage
  - **Void Crawler**: exists partially outside reality; 50% chance to be unhittable each turn (phasing); tentacle attacks from adjacent tiles
  - **The Mirrored**: looks exactly like the player character; copies their last action one turn later; killing it reveals it was "you from another timeline"
  - **Thought Eater**: invisible, detected only by sanity drain; feeds on intelligence (-1 INT per attack); killing it requires attacking empty tiles where the drain is strongest
- **Eldritch Artifacts**: extremely powerful but cursed items found only in eldritch zones
  - Eye of the Void: see through walls in a 10-tile radius, -2 sanity per use
  - Tentacle Whip: highest damage weapon in the game, occasionally attacks the wielder
  - Crown of Whispers: +10 INT but constant whisper messages that mix real hints with lies
- Non-euclidean navigation: some eldritch areas require going "backward to go forward" or entering doors in specific emotional states

## Acceptance Criteria

- [ ] Eldritch locations have unique map distortion effects
- [ ] All eldritch enemies have reality-bending mechanics
- [ ] Eldritch artifacts are powerful with meaningful drawbacks
- [ ] Sanity interacts correctly with all eldritch encounters
- [ ] Non-euclidean navigation puzzles are solvable
