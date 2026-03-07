# Mount Combat

As a player, I want to fight while mounted for speed and power advantages, so that mounts are useful in combat and not just for travel.

## Details

- **Mounted Combat Bonuses**:
  - +3 movement speed (act + move further per turn)
  - +2 to melee damage (height/momentum advantage)
  - Charge attack: move 3+ tiles in a straight line into an enemy for double damage + knockback
  - Trample: ride over small enemies (rats, goblins) for automatic damage
- **Mounted Combat Penalties**:
  - -2 to ranged attacks (mount movement makes aiming harder)
  - Cannot use two-handed weapons while mounted (one hand on reins)
  - Larger target: enemies get +1 to hit against mounted players
  - Cannot enter narrow corridors or small rooms while mounted
- **Mount HP**: mounts have their own HP pool; if a mount reaches 0 HP, the player is thrown off (fall damage + stunned 1 turn) and the mount flees
- **Mount Panic**: mounts can be frightened by fire, undead, or loud noises (Charisma check to calm, or be bucked off)
- **Mount Types in Combat**:
  - Horse: balanced, charge bonus
  - War Horse: armored, +HP, no panic from combat
  - Giant Spider: wall climbing while mounted, web attack
  - Griffon: aerial movement, dive bomb attack
  - Skeletal Steed (undead): no panic, immune to poison, frightens living enemies
- **Dismount/Mount**: takes 1 turn; emergency dismount is free but the mount may bolt
- **Mount Equipment**: barding (mount armor), war saddle (+stability), blinders (+panic resistance)

## Acceptance Criteria

- [ ] Mounted bonuses and penalties apply correctly
- [ ] Charge and trample attacks calculate damage properly
- [ ] Mount HP and mount death mechanics work
- [ ] Mount panic triggers and is resolvable
- [ ] Mount equipment modifies mount stats
