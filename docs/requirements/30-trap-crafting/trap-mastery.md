# Trap Mastery

As a player, I want a dedicated trap mastery skill tree that unlocks advanced trap types and passive bonuses, so that trap-focused builds have deep progression.

## Details

- **Trap Mastery Tiers** (10 levels):
  - Level 1-2: basic traps (bear trap, spike pit); traps deal +10% damage
  - Level 3-4: intermediate traps (poison cloud, fire mine); trap deployment is 1 turn faster; traps are 20% harder to detect
  - Level 5-6: advanced traps (frost snare, teleport trap); can link traps for chain reactions; +25% trap damage
  - Level 7-8: expert traps (gravity trap, mind trap — causes confusion); traps can be thrown to deploy at range (up to 5 tiles); self-traps don't trigger on you
  - Level 9-10: master traps (temporal trap — freezes time for target 5 turns, soul trap — captures souls); traps are invisible to all enemies; deploy 2 traps per turn
- **New Trap Types** (unlocked through mastery):
  - **Gravity Trap** (Lv7): creates a localized gravity well; pulls enemies to center, holds them for 3 turns
  - **Mind Trap** (Lv7): psychic burst on trigger; confusion (random movement) + memory wipe (enemy forgets player's position)
  - **Mirror Trap** (Lv8): reflects the next spell cast at the trapped tile back at the caster at double power
  - **Temporal Trap** (Lv9): freezes the target in time for 5 turns; target takes no damage while frozen but is completely helpless
  - **Soul Trap** (Lv10): captures the soul of any enemy killed on the trapped tile; souls usable for soul magic or enchanting
  - **Living Trap** (Lv10): animated trap that moves 1 tile per turn toward the nearest enemy; when it reaches one, it triggers
- **Passive Bonuses**: trap damage scales with Intelligence; traps last 50% longer; salvaging disarmed traps yields 75% materials back
- **Trap Architect Title**: completing all mastery levels grants the title and a unique ability — "Perfect Trap" (one guaranteed kill trap per dungeon floor, even on bosses below 10% HP)
- **Trap Schematics**: each new trap type requires learning a schematic (found in dungeons, bought from engineers, or taught by trap masters)

## Acceptance Criteria

- [ ] All mastery tiers unlock correct traps and bonuses
- [ ] New trap types function with described effects
- [ ] Trap deployment speed improves with mastery level
- [ ] Living Trap movement AI works correctly
- [ ] Perfect Trap ability activates under correct conditions
