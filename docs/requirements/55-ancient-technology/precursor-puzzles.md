# Precursor Puzzles

As a player, I want to solve technology-based puzzles in ancient ruins that require logic and experimentation, so that Precursor dungeons test brains alongside brawn.

## Details

- **Puzzle Types**:
  - **Power Grid**: route energy through a network of conduits by rotating connectors; all nodes must be powered to open the door; wrong connections cause sparks (damage)
  - **Holographic Sequence**: a holographic display shows a pattern of colors/symbols; reproduce the sequence on input panels; sequences get longer each room (3 → 5 → 8 → 12)
  - **Gravity Maze**: a room with gravity switches on walls; flip gravity to walk on different surfaces; reach the exit by navigating a 3D maze through gravity shifts
  - **Data Reconstruction**: find scattered data fragments throughout the ruin; assemble them in the correct order on a central terminal; fragments are scrambled text puzzles (anagram/cipher)
  - **Pressure Plates (Weighted)**: step on plates to activate mechanisms; plates require specific weights; use items, corpses, or conjured objects to hold plates down; wrong weights trigger traps
  - **AI Negotiation**: a ruin's AI guardian poses questions/riddles; correct answers open doors; wrong answers trigger defenses; some questions have no "correct" answer — the AI evaluates reasoning quality via LLM
  - **Temporal Puzzle**: two versions of the same room (past and present) visible simultaneously; actions in the past version affect the present version (move a block in the past = door opens in the present); requires careful cross-timeline thinking
- **Puzzle Difficulty**: each ruin has 3-5 puzzles of increasing complexity; optional hint system (examine nearby terminals for clues, -XP reward for using hints)
- **Puzzle Bypass**: Artificer skill allows brute-forcing some puzzles (hack the terminal, 50% success) or finding a hidden maintenance access route; bypassing still gives reduced rewards
- **Puzzle Rewards**: each solved puzzle grants Precursor knowledge XP (separate from combat XP) + often reveals loot or lore
- **Puzzle Variety per Seed**: world seed determines which puzzle variants appear in which ruins; replayability across seeds

## Acceptance Criteria

- [ ] All puzzle types are interactive and solvable
- [ ] Puzzle difficulty escalates within each ruin
- [ ] AI negotiation puzzles evaluate reasoning via LLM
- [ ] Temporal puzzles correctly link past and present room states
- [ ] Puzzle bypass options work with reduced rewards
