# Herbalism

As a player, I want to gather herbs and plants from the wild, so that I can brew potions, cook meals, and craft remedies.

## Details

- Herb spawns vary by biome: healing moss (forest), fire bloom (volcanic), frost mint (tundra), shadow root (caves), moonpetal (night only)
- Gathering requires no tool but Wisdom stat affects yield and chance of finding rare variants
- Rare variants: "ancient" prefix herbs with 2x potency for alchemy
- Herb garden: plantable in player housing, grow your own herbs over time
- Herbalism skill: higher skill reveals herb locations on the minimap, identifies unknown plants
- Poisonous plants: misidentified herbs can poison the player (Wisdom check to distinguish)
- Unique herbs: quest-specific plants needed for NPC healers or alchemists
- Seasonal availability: some herbs only grow in specific seasons

## Acceptance Criteria

- [ ] Herbs spawn in biome-appropriate locations
- [ ] Gathering yields scale with Wisdom and skill
- [ ] Poisonous plant identification works with stat checks
- [ ] Seasonal and time-of-day restrictions are enforced
