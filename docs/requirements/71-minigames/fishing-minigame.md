# Fishing Minigame

As a player, I want fishing to be a relaxing interactive minigame with timing-based catches and varied fish types, so that fishing is a chill but engaging activity.

## Details

- **Casting**: choose a spot on the water (different spots = different fish); cast line (distance determined by STR); wait for a bite (random 5-30 turns; Perception shortens wait by revealing ripples)
- **Bite Detection**: a visual and audio cue when a fish bites (bobber dips, splash sound via Web Audio); player must react within 2 turns or the fish escapes; faster reaction = better hook set
- **Reeling Minigame**: once hooked, a tug-of-war begins:
  - Fish has a stamina bar; reel in to drain stamina; fish pulls back periodically (stop reeling or line breaks)
  - Line tension indicator: green (safe), yellow (caution), red (about to break); let line out when tension is high
  - Fish behavior varies by species: trout fight steadily, bass leap (sudden tension spikes), catfish are heavy (slow but constant pull), legendary fish have unique patterns
- **Fish Types by Location**:
  - Freshwater (rivers/lakes): trout, bass, catfish, pike, perch, golden carp (rare, high value)
  - Saltwater (ocean/coast): tuna, swordfish, halibut, shark, seahorse (rare, alchemical)
  - Exotic (underground rivers, magical pools): blind cave fish, magma fish, crystal fish, void fish
  - Legendary (one per region): Leviathan's Minnow, the Golden Kraken, Old Whiskers (100-year catfish), Ghost Salmon
- **Bait and Lures**: different bait attracts different fish; worms (common fish), minnows (predators), magical bait (exotic fish), legendary lure (crafted from rare materials, needed for legendary fish)
- **Fishing Skill**: increases catch rate, reduces line break chance, reveals fish shadows (see what's in the water before casting), unlocks advanced techniques (fly fishing, net fishing, spear fishing)
- **Cooking Integration**: caught fish can be cooked for stat-buffing meals; rare fish provide powerful buffs; some fish are quest items or trading goods
- **Fishing Spots**: discoverable spots with better fish; some require reaching hidden areas (behind waterfalls, deep caves, mountain lakes); fishing journal tracks all caught species

## Acceptance Criteria

- [ ] Casting and bite detection use correct timing windows
- [ ] Reeling minigame balances tension management with species-specific behavior
- [ ] Fish types appear at correct locations with correct rarity
- [ ] Bait correctly influences which fish bite
- [ ] Fishing skill progression unlocks correct bonuses
