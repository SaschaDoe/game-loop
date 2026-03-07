# Fishing at Sea

As a player, I want to fish from my ship in different ocean zones for rare sea creatures and treasure, so that sailing downtime has a relaxing but rewarding activity.

## Details

- **Ocean Fishing Zones**: coastal (common fish), open ocean (rare fish), deep sea (legendary fish, dangerous)
- **Fish Types**:
  - Coastal: salmon, cod, crab (food ingredients, low value)
  - Open Ocean: swordfish, tuna, octopus (better food, moderate value, alchemy ingredients)
  - Deep Sea: anglerfish (glows, light source item), ghost fish (ectoplasm ingredient), void eel (eldritch ingredient, -1 sanity to catch)
  - Legendary: Golden Koi (wish-granting, one per world), Abyssal Whale (fills entire inventory with meat), Time Fish (rewinds last 10 turns when eaten)
- **Fishing Mechanic**: cast line → wait (1-5 turns based on bait and zone) → bite notification → timing-based reel (too fast = line breaks, too slow = fish escapes)
- **Bait**: different bait attracts different fish; live bait > lure > bread; special bait for legendary catches
- **Fishing Skill**: higher skill = faster bites, stronger line, ability to catch rarer fish, identify fish before reeling
- **Bonus Catches**: occasionally hook treasure (waterlogged chest, ancient coins, messages in bottles, enchanted items)
- **Fishing Contests**: port towns hold fishing tournaments with gold/item prizes
- Can only fish when ship is anchored or drifting (not during active sailing or combat)

## Acceptance Criteria

- [ ] Fish types correspond to correct ocean zones
- [ ] Fishing timing mechanic works with line tension
- [ ] Bait selection affects catch rates
- [ ] Bonus treasure catches occur at appropriate frequency
- [ ] Fishing skill progression affects all listed bonuses
