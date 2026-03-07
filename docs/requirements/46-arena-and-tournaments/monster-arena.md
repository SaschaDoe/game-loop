# Monster Arena

As a player, I want to fight waves of monsters in a gladiatorial arena with escalating difficulty and special modifiers, so that I have a pure combat endgame challenge.

## Details

- **Arena Location**: one per major city; accessible after reaching level 5
- **Wave System**: fight waves of enemies with short rest between waves (heal 25% HP, no mana regen)
  - Waves 1-5: common enemies, learning curve
  - Waves 6-10: mixed enemy types, environmental hazards activate
  - Waves 11-15: elite enemies, arena modifiers (lava floor, poison mist, darkness)
  - Waves 16-19: boss-tier enemies, multiple hazards
  - Wave 20: Arena Champion (unique boss, different per city)
- **Arena Modifiers** (random per session):
  - Burning Floor: tiles randomly ignite
  - Flood: water rises, eventually forcing swimming combat
  - Cage Match: arena shrinks each wave
  - No Magic: spells disabled, melee/ranged only
  - Mirror Match: enemies are clones of the player
  - Darkness: no visibility beyond 2 tiles
- **Rewards**: gold per wave (increasing), rare loot at milestone waves (5, 10, 15, 20), unique arena-only equipment at wave 20
- **Leaderboard**: tracks best wave reached, fastest completion, most damage dealt; NPC announcer narrates highlights
- **Tag Team Mode**: bring a companion; when one is downed, the other continues; revive between waves
- **Monster Taming**: occasionally a defeated arena monster can be tamed instead of killed (rare, requires Beast Taming skill)
- **Spectator NPCs**: crowd reacts to combat; throwing gold into the arena mid-fight if you perform well

## Acceptance Criteria

- [ ] Wave progression scales difficulty correctly
- [ ] Arena modifiers apply random challenges per session
- [ ] Rewards distribute at correct wave milestones
- [ ] Leaderboard tracks and displays player records
- [ ] Tag team and spectator mechanics function
