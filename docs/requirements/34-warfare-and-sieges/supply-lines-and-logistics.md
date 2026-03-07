# Supply Lines and Logistics

As a player, I want wars to depend on supply lines that can be disrupted or protected, so that strategy extends beyond direct combat.

## Details

- **Supply System**: armies and besieged towns need food, weapons, and medical supplies; without supply, units weaken over time
- **Supply Caravans**: AI-controlled carts travel along roads between friendly towns and armies
  - Caravan speed: slower than player, follows roads, stops at night
  - Caravan defense: guarded by 2-4 soldiers; can hire additional mercenary escorts
  - Caravan capacity: small (50 units), medium (150 units), large (300 units)
- **Supply Effects**:
  - Full supply: units at full strength
  - Low supply (below 50%): -2 to all stats, morale drops, desertion risk
  - No supply (0%): -5 to all stats, units starve (HP loss per turn), mass desertion, surrender within 50 turns
- **Disruption Tactics**:
  - Ambush caravans: attack and destroy or capture enemy supply wagons
  - Block roads: set traps, collapse bridges, or station units on chokepoints
  - Poison supplies: infiltrate a supply depot and poison food stores (enemy troops weakened)
  - Diversion: create a fake caravan to draw enemy raiders away from the real one
- **Protection Tactics**:
  - Escort missions: personally guard caravans through dangerous territory
  - Multiple routes: split supplies across different paths (harder to intercept all)
  - Hidden caches: pre-position emergency supplies at strategic locations
  - Naval supply: ship supplies by water to bypass land blockades
- **Player Castle Supply**: the player's castle also needs supplies; neglecting supply causes staff to leave and defenses to weaken
- War campaigns that cut off enemy supply before the siege are significantly easier

## Acceptance Criteria

- [ ] Supply caravans travel along roads with correct AI
- [ ] Supply levels affect unit stats and morale correctly
- [ ] Disruption tactics (ambush, block, poison, diversion) all function
- [ ] Protection tactics provide meaningful supply security
- [ ] Player castle supply system tracks provisions
