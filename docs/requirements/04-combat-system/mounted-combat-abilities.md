# Mounted Combat Abilities

As a player, I want mount-specific combat abilities that combine rider and mount actions, so that cavalry fighting has its own deep skill set.

## Details

- **Mounted Abilities** (require Mounted Combat skill):
  - **Lance Charge** (Lv1): gallop 4+ tiles in a straight line + lance strike; 3x weapon damage + knockback; mount takes no damage from frontal attacks during charge
  - **Trample** (Lv3): ride over small enemies; mount deals 5 damage to each; can trample up to 3 enemies in a line; enemies make DEX save or fall prone
  - **Mounted Archery** (Lv5): fire bow while mounted without the normal mounted ranged penalty; at high skill, fire while the mount is moving (drive-by)
  - **Leap Attack** (Lv8): mount jumps over obstacles/enemies (3-tile gap); land on an enemy for heavy impact damage + stun; only with jumping mounts (horses, griffons)
  - **Cavalry Sweep** (Lv10): circular gallop around a target; attack every enemy adjacent to the circle path; mount and rider both attack; devastating against grouped enemies
  - **Dismount Strike** (Lv6): leap off mount mid-charge; airborne attack with 2x damage + guaranteed knockdown; mount continues forward and can trample
  - **Shield Bash (Mounted)** (Lv4): while mounted, shield bash has 3x knockback distance; can launch enemies into walls or off ledges
  - **Coordinated Strike** (Lv12): mount and rider attack the same target simultaneously; combined damage ignores 50% armor; requires a bonded mount (high loyalty)
- **Mount Abilities** (inherent to mount type, usable by rider command):
  - Horse: Rear Kick (backward AoE)
  - War Horse: War Cry (enemies -2 morale)
  - Griffon: Dive Bomb (air-to-ground strike)
  - Giant Spider: Web Spit (immobilize at range)
  - Dragon: Breath Weapon (elemental cone)
- **Mounted Skill Tree**: separate progression for mounted combat; levels by fighting while mounted
- **Mounted Combos**: specific sequences of mounted abilities trigger powerful finishers:
  - Lance Charge → Dismount Strike → mount Trample = "Cavalry Blitz" (devastates a line of enemies)
  - Mounted Archery → Leap Attack → Cavalry Sweep = "Storm Rider" (clear an entire engagement)

## Acceptance Criteria

- [ ] All mounted abilities calculate damage and effects correctly
- [ ] Mount abilities trigger on rider command
- [ ] Mounted skill tree levels from mounted combat
- [ ] Mounted combos detect sequences and trigger finishers
- [ ] Mount type determines available mount abilities
