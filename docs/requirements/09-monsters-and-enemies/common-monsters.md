# Common Monsters

As a player, I want to encounter a variety of common monsters throughout the world, so that combat encounters are diverse and each monster type requires different tactics.

## Details

- Tier 1 (starting areas): Rats, Bats, Slimes, Goblins, Spiders
- Tier 2 (mid-game): Skeletons, Zombies, Wolves, Bandits, Ogres, Harpies
- Tier 3 (late-game): Wraiths, Trolls, Minotaurs, Dark Knights, Basilisks
- Each monster has: unique ASCII symbol, color, stat block, attack pattern, loot table
- Monsters have behavioral AI: Rats flee when low HP, Goblins call for reinforcements, Zombies are relentless
- Monsters appropriate to the biome and dungeon theme
- Monsters can fight each other (wolves attack goblins, undead attack everything)

## Acceptance Criteria

- [ ] All monster types are implemented with unique visuals
- [ ] Monster stats scale by tier
- [ ] Behavioral AI creates distinct combat experiences
- [ ] Monsters appear in appropriate biomes/dungeons
