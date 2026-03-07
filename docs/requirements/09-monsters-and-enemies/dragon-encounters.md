# Dragon Encounters

As a player, I want dragons to be rare, terrifying, multi-phase boss encounters with unique loot, so that finding a dragon feels like the ultimate combat challenge.

## Details

- **Dragon Types** (one of each per world, unique lair location):
  - **Red Dragon** (Fire): fire breath (cone AoE, burning terrain), wing buffet (knockback), tail sweep (melee AoE); lair in volcanic caves
  - **Blue Dragon** (Lightning): lightning breath (line AoE, chains to metal-armored targets), thunder roar (stun AoE), burrow (underground ambush); lair in desert canyons
  - **White Dragon** (Ice): frost breath (cone, freeze), blizzard aura (slow all nearby), ice wall (blocks paths); lair in frozen peaks
  - **Black Dragon** (Acid): acid spit (ranged, destroys armor), corrosive aura (equipment durability drain), swim through acid pools; lair in swamps
  - **Green Dragon** (Poison): poison cloud breath (lingering AoE), charm gaze (Wisdom save), poisoned claw; lair in deep forests
  - **Shadow Dragon** (Necrotic): shadow breath (drains max HP), teleport through shadows, fear aura; lair in the Underdark
- **Multi-Phase Combat**:
  - Phase 1 (100-66% HP): standard attacks, tests the player
  - Phase 2 (66-33% HP): enraged, faster attacks, lair-specific hazards activate (lava flows, lightning storms, blizzards)
  - Phase 3 (33-0% HP): desperate, most powerful attacks, can destroy parts of the arena, may attempt to flee if the player is strong
- **Dragon Dialogue**: dragons are intelligent; can be talked to via LLM before fighting — may negotiate, demand tribute, offer quests, or reveal lore
- **Dragon Hoard**: each dragon guards a massive treasure pile with guaranteed legendary items, gold (1000+), and unique dragon-material loot
- **Dragon Materials**: scales (legendary armor), bones (weapons), blood (potions), heart (one-time permanent stat boost)
- **Dragon Reputation**: killing a dragon makes the player famous — NPCs react with awe, other dragons may seek revenge

## Acceptance Criteria

- [ ] All six dragon types have unique elemental attacks and lairs
- [ ] Multi-phase combat transitions correctly
- [ ] LLM dialogue allows non-combat dragon interaction
- [ ] Dragon hoards contain appropriate legendary loot
- [ ] Dragon materials are usable in crafting
