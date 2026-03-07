# Mining

As a player, I want to mine ore veins in caves and mountains, so that I can gather materials for crafting weapons, armor, and enchantments.

## Details

- Ore veins visible on cave/mountain walls as special tile characters
- Mining requires a pickaxe; quality affects mining speed and yield
- Ore types (by rarity): iron, copper, silver, gold, mithril, adamantine, void crystal
- Mining takes 2-5 turns per vein; noise may attract nearby enemies
- Veins have limited resources; depleted veins regenerate after many in-game turns
- Gem deposits: ruby, sapphire, emerald, diamond (used in enchanting and selling)
- Mining skill: higher skill = faster mining, chance for bonus yields, detect hidden veins
- Cave-ins: small chance of collapsing the mine (Dexterity check to dodge)
- **Deep Mining**: at skill level 7+, discover passages to deep ore veins with mythril and adamantine; these are guarded by underground creatures
- **Explosive Mining**: use bombs to blast open ore veins (faster, higher yield, but loud + cave-in risk + may destroy gems)
- **Ore Smelting**: raw ore must be smelted at a forge to become usable ingots; smelting skill affects ingot quality (impure → standard → refined → masterwork)
- **Rare Finds**: tiny chance to discover fossils (museum quest), ancient artifacts (lore items), or trapped creatures (freed creature becomes an ally or enemy)
- **Mining Hazards**: gas pockets (explosion if using fire nearby), underground rivers (flooding), unstable floors (falling to lower levels)
- **Prospecting**: use prospecting skill to detect ore deposits before mining; reveals vein quality and size without digging
- **Mining Claims**: in towns with mines, buy a claim for exclusive access to a rich vein; NPCs respect claims; thieves may try to steal your ore
- **Automated Mining**: at high skill + investment, hire NPC miners to extract ore automatically while you adventure (passive income, requires protection from monsters)

## Acceptance Criteria

- [ ] Ore veins are mineable and yield correct materials
- [ ] Pickaxe quality affects mining
- [ ] Mining noise attracts enemies
- [ ] Depleted veins regenerate over time
