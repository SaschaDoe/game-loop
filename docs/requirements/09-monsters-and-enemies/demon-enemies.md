# Demon Enemies

As a player, I want to encounter demons with corruption mechanics and temptation abilities, so that fighting the forces of evil feels distinct and morally charged.

## Details

- **Demon Types**:
  - **Imp**: tiny, flying, throws fireballs, annoying rather than dangerous alone; always in groups of 3-6; cowardly (flees when outnumbered)
  - **Succubus/Incubus**: charm gaze (Wisdom save or become charmed for 3 turns — walk toward, can't attack); drains life on contact; disguises as attractive NPC in towns
  - **Hellhound**: fire breath (cone), tracking (cannot be escaped once aggro'd), immune to fire; pack hunter; burning paw prints leave fire terrain
  - **Pit Fiend**: boss-tier; massive, winged, flaming sword; fear aura (-3 to all stats within 8 tiles); fire wall spell; summons imps; high magic resistance
  - **Shadow Demon**: incorporeal in darkness (immune to physical); possesses NPCs (must fight the NPC without killing them to exorcise); revealed by light
  - **Balor**: endgame boss; flaming whip (pull + fire damage), vorpal sword (chance to instant kill), death throes (explodes on death, massive AoE fire)
  - **Corruption Tempter**: doesn't fight; appears during moral choices to offer power in exchange for evil actions; LLM-powered dialogue trying to corrupt the player
- **Corruption Mechanic**: demon attacks have a chance to apply "Corruption" stacks; 10 stacks = minor demonic mutation (cosmetic + small buff + NPC reactions); 50 stacks = major mutation (significant power + rejected by holy NPCs); 100 stacks = demonic transformation (extremely powerful but locked into evil path)
- **Demon Weaknesses**: holy damage (+100%), silver (+50%), exorcism spells (instant kill on lesser demons), holy water splash (AoE holy damage)
- **Demon Summoning**: warlocks and cultists can summon demons; destroying the summoning circle banishes all summoned demons
- **Demonic Pacts**: players can make deals with demons via LLM dialogue (power at a cost — always a catch the demon tries to hide)

## Acceptance Criteria

- [ ] All demon types have unique abilities and behaviors
- [ ] Corruption stacks accumulate and trigger mutations at thresholds
- [ ] Demon weaknesses (holy, silver, exorcism) work correctly
- [ ] Shadow demon possession mechanic functions with NPC hosts
- [ ] LLM dialogue for Corruption Tempter and demonic pacts works
