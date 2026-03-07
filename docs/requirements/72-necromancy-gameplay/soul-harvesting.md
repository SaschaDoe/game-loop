# Soul Harvesting

As a player, I want to capture and use the souls of defeated enemies for powerful enchanting, summoning, and spell fuel, so that necromancy has a unique resource economy.

## Details

- **Soul Capture**: use a Soul Gem (empty) on a dying enemy (must be at 1 HP); Necromancy check determines success; soul is trapped in the gem; each gem holds one soul; soul quality = creature's level/power
- **Soul Gem Types**:
  - **Petty Gem**: holds souls of creatures level 1-5; common; cheap
  - **Lesser Gem**: holds level 6-15 souls; uncommon
  - **Greater Gem**: holds level 16-25 souls; rare
  - **Grand Gem**: holds level 26+ souls; very rare; required for the most powerful uses
  - **Black Gem**: holds humanoid souls (NPC/player); always evil act; most powerful for enchanting; possession is illegal everywhere
- **Soul Uses**:
  - **Enchanting Fuel**: consume a filled soul gem to power an enchantment on a weapon or armor; stronger souls = stronger enchantments; soul quality determines max enchantment tier
  - **Spell Fuel**: consume a soul mid-combat to instantly restore mana equal to the soul's power; emergency resource
  - **Summoning Anchor**: use a soul as a focus for summoning; summoned creature is stronger and lasts longer when powered by a soul
  - **Soul Trading**: sell filled soul gems to necromancers, dark mages, and certain merchants; high value; black gems are priceless but trading them attracts law enforcement
  - **Soul Interrogation**: speak with a captured soul (requires Medium skill); they remember their life; useful for gathering information from dead enemies; souls are resentful and may lie
- **Moral Weight**: capturing animal souls = minor evil karma; capturing monster souls = neutral; capturing humanoid souls = major evil karma; capturing innocent souls = extreme evil karma + hunted by divine agents
- **Soul Release**: release a captured soul voluntarily; grants small positive karma; the soul may bless you (minor permanent buff) or curse you (if they died resentfully)
- **Soul Sickness**: carrying too many filled soul gems (10+) causes "Soul Sickness" (whispers, nightmares, -1 WIS per 5 gems over the limit); reflects the weight of carrying trapped consciousness

## Acceptance Criteria

- [ ] Soul capture mechanic triggers at correct HP threshold with correct checks
- [ ] Gem types correctly limit soul level ranges
- [ ] All soul uses consume gems and produce correct effects
- [ ] Moral karma adjusts correctly based on soul type
- [ ] Soul Sickness triggers at correct gem count threshold
