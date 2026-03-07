# Runic Inscription

As a player, I want to carve magical runes onto surfaces, items, and the ground to create persistent spell effects, so that enchanting extends beyond items to the environment.

## Details

- **Rune Carving**: requires runic chisel (tool) + arcane ink + surface to carve on; carving takes 3-10 turns based on rune complexity; INT + Enchanting skill determines quality
- **Surface Runes** (carved on walls, floors, doors):
  - **Ward Rune**: protects an area; enemies entering the warded zone take damage or are repelled; lasts 500 turns; used for base defense
  - **Alarm Rune**: alerts player when any creature crosses the rune; silent mental ping regardless of distance; useful for perimeter security
  - **Trap Rune**: single-use; triggers a spell effect when stepped on (fire blast, ice spike, lightning bolt, sleep); more powerful than mechanical traps but expensive to create
  - **Teleport Rune**: pair two runes; stepping on one teleports to the other; permanent; requires 2 Grand Soul Gems; the ultimate fast-travel network
  - **Healing Rune**: heals all allies standing on it for 3 HP per turn; lasts 100 turns; used in safe rooms and camps
  - **Silence Rune**: suppresses all magic in a 5-tile radius; no spells can be cast (including yours); lasts 200 turns; anti-mage defense
- **Item Runes** (carved directly onto equipment):
  - Runes are an alternative to standard enchanting; runes are weaker individually but don't use enchantment slots
  - Each item can hold 1 rune in addition to its enchantments
  - Rune effects: +1 to a stat, minor elemental resistance, glow (light source), unbreakable (prevents item degradation)
- **Rune Combinations**: placing multiple surface runes in patterns creates combination effects:
  - 3 fire runes in a triangle = fire wall (line of fire between them)
  - 4 ward runes in a square = sanctuary (nothing can enter or exit)
  - Healing rune + ward rune adjacent = regeneration field (heal + protect)
- **Rune Decay**: surface runes fade over time (500 turns base); refreshing costs half the original materials; neglected runes malfunction before fading (random effects)
- **Rune Reading**: finding ancient runes in dungeons requires Arcana check to read; reading them teaches new rune patterns; some ancient runes are still active (beneficial or dangerous)

## Acceptance Criteria

- [ ] All surface rune types produce correct persistent effects
- [ ] Item runes correctly coexist with enchantment slots
- [ ] Rune combinations create correct amplified effects
- [ ] Rune decay timer and refresh mechanics work correctly
- [ ] Ancient runes in dungeons are readable with correct skill checks
