# Regional Cultures and Genre Variety

As a player, I want each region to feel like a different fantasy sub-genre with its own culture, aesthetics, and gameplay flavor, so that the world is diverse and each journey feels fresh.

## Problem Statement

The current game has one tone — generic dungeon crawler. The existing Elvish, Orcish, and Deepscript language systems hint at cultural depth but have no physical world to inhabit. This spec defines the cultural identity of each region to make the world feel like 7 different games stitched into one coherent world.

---

## User Stories

### The Greenweald — Tolkienesque High Fantasy

#### US-RC-01: Elvish Forest Culture
As a player exploring The Greenweald, I want to encounter an ancient elvish civilization living in harmony with the forest, so that this region feels like classic high fantasy.

**Details:**
- Architecture: tree-platforms, living wood buildings, vine bridges
- ASCII style: trees (♣) in greens, buildings blend with canopy
- NPCs: rangers, druids, lore-keepers, a council of elders
- Customs: greet with a bow (Elvish), revere nature, distrust outsiders initially
- Music/tone: serene, ancient, melancholy
- Unique mechanic: Nature affinity — resting in the forest heals extra; harming trees angers local NPCs
- Shops sell: bows, herbs, cloaks, nature-themed potions
- Quest flavor: protect the forest from corruption, seek ancient wisdom, commune with spirits

**Acceptance Criteria:**
- [ ] Greenweald settlements use tree/nature themed ASCII tiles
- [ ] Elvish NPCs speak Elvish (garbled until learned)
- [ ] Nature affinity mechanic provides healing bonus in forests
- [ ] Quests reflect elvish cultural values

---

### The Ashlands — Dark Fantasy / Grimdark

#### US-RC-02: Orcish War Culture
As a player exploring The Ashlands, I want to encounter brutal orc war clans and volcanic industry, so that this region feels dangerous, harsh, and morally grey.

**Details:**
- Architecture: crude stone fortresses, fire-forges, bone totems, war banners
- ASCII style: reds/oranges on dark background, lava flows (&), ash clouds
- NPCs: warlords, shamans, slave traders, arena masters, goblin servants
- Customs: greet with a challenge (Orcish), strength is respected above all, weakness is punished
- Tone: brutal, survivalist, dog-eat-dog
- Unique mechanic: Honor combat — can challenge NPCs to duels for reputation/items; refusing marks you as coward
- Shops sell: heavy weapons, armor, war paint, fire bombs
- Quest flavor: arena battles, territorial disputes, rescue captives, forge legendary weapons

**Acceptance Criteria:**
- [ ] Ashlands settlements use volcanic/industrial themed tiles
- [ ] Orcish NPCs speak Orcish (garbled until learned)
- [ ] Honor combat mechanic allows NPC duels
- [ ] Quests reflect orcish cultural values (strength, conquest)

---

### The Hearthlands — Medieval Political Drama

#### US-RC-03: Human Trade Culture
As a player exploring The Hearthlands, I want to encounter bustling towns with political intrigue, commerce, and social hierarchy, so that this region feels like a living medieval society.

**Details:**
- Architecture: timber-frame houses, stone walls, market squares, castle keeps
- ASCII style: warm yellows/browns, well-organized grid layouts
- NPCs: merchants, nobles, guards, beggars, spies, guild masters
- Customs: greet with "well met" (Common), money talks, reputation matters most
- Tone: social, political, scheming
- Unique mechanic: Reputation economy — prices change based on your standing; NPCs gossip about your deeds
- Shops sell: balanced equipment, scrolls, information, political favors
- Quest flavor: investigate corruption, choose sides in disputes, deliver messages, uncover conspiracies

**Acceptance Criteria:**
- [ ] Hearthlands settlements have structured town layouts with markets
- [ ] NPC prices vary based on player reputation
- [ ] Political quests offer meaningful choices with consequences
- [ ] Social hierarchy is visible (noble vs common NPCs)

---

### Frostpeak Reach — Norse / Dwarven Saga

#### US-RC-04: Dwarven Mountain Culture
As a player exploring Frostpeak Reach, I want to discover underground dwarven cities carved into mountains, with rune-craft and ancient grudges, so that this region feels epic and industrious.

**Details:**
- Architecture: carved stone halls, glowing rune-pillars, mine carts, massive forges
- ASCII style: ice blue/grey on surface, warm amber underground, rune glyphs (ᚱᚢᚾ)
- NPCs: runesmiths, miners, brewmasters, grudge-keepers, mountain rangers
- Customs: greet with a clan name (Runic), crafting is sacred, debts are eternal
- Tone: stoic, industrious, ancient grudges
- Unique mechanic: Rune-crafting — combine rune stones found in mines to enchant equipment
- Shops sell: heavy armor, hammers, rune stones, warming potions, mining tools
- Quest flavor: clear collapsed mines, settle ancient grudges, recover lost rune-knowledge, forge masterwork items

**Acceptance Criteria:**
- [ ] Frostpeak has both surface (snowy) and underground (dwarven) areas
- [ ] Runic language appears on inscriptions and in NPC speech
- [ ] Rune-crafting mechanic provides unique item enhancement
- [ ] Quests reflect dwarven values (craft, honor, grudges)

---

### The Drowned Mire — Gothic Horror

#### US-RC-05: Swampfolk Witch Culture
As a player exploring The Drowned Mire, I want to encounter a haunted swampland of witches, spirits, and dark bargains, so that this region feels eerie and unsettling.

**Details:**
- Architecture: stilt houses, bone charms, ritual circles, mushroom growths
- ASCII style: murky greens/purples, fog effects (limited visibility), pulsing bioluminescence
- NPCs: hedge witches, spirit mediums, plague doctors, cursed villagers, talking animals
- Customs: greet with an offering (Whispertongue), spirits are real and must be appeased, nothing is free
- Tone: creepy, atmospheric, morally ambiguous
- Unique mechanic: Spirit bargains — make deals with swamp spirits for power at a cost (temporary debuffs, permanent stat trades)
- Shops sell: potions, curses, spirit tokens, antidotes, ritual components
- Quest flavor: lift curses, appease angry spirits, investigate disappearances, choose between cures and their costs

**Acceptance Criteria:**
- [ ] Drowned Mire has reduced visibility (fog mechanic)
- [ ] Whispertongue language is eerie and unsettling when garbled
- [ ] Spirit bargain mechanic offers risk/reward choices
- [ ] Quests have horror atmosphere and moral dilemmas

---

### The Sunstone Expanse — Arabian Nights / Ancient Egypt

#### US-RC-06: Desert Nomad Culture
As a player exploring The Sunstone Expanse, I want to encounter nomadic traders, buried civilizations, and star-magic, so that this region feels exotic, ancient, and mysterious.

**Details:**
- Architecture: sandstone temples, tent camps, oasis gardens, buried pyramid tips
- ASCII style: golds/burnt orange by day, deep blue/silver by night, sand particles (:)
- NPCs: caravan masters, stargazers, sand mages, tomb wardens, veiled prophets
- Customs: greet with hospitality (Sandscript), water is sacred, stars guide all decisions
- Tone: mysterious, ancient, cyclical (day/night contrast is extreme)
- Unique mechanic: Stargazing — at night, reading the stars reveals hidden locations, prophecies, or temporary navigation bonuses
- Shops sell: water, dried foods, sand-glass weapons, star charts, sun protection
- Quest flavor: excavate ruins, follow star prophecies, protect caravans, unravel ancient mysteries

**Acceptance Criteria:**
- [ ] Sunstone Expanse has dramatic day/night visual shifts
- [ ] Sandscript appears on temple walls and in NPC speech
- [ ] Stargazing mechanic provides night-time exploration bonuses
- [ ] Quests reflect nomadic and archaeological themes

---

### The Underdepths — Cosmic Horror / Lovecraftian

#### US-RC-07: Deep Ones Shadow Culture
As a player exploring The Underdepths, I want to encounter an alien underground civilization obsessed with forbidden knowledge, so that this region feels like descending into madness.

**Details:**
- Architecture: impossible geometry, bioluminescent fungi, crystal growths, living walls
- ASCII style: deep purple/cyan, pulsing glyphs, tiles that seem to shift
- NPCs: Deepscript scholars, fungal gardeners, echo-priests, things that were once human
- Customs: greet by sharing a secret (Deepscript), knowledge is currency, sanity is optional
- Tone: alien, unsettling, intellectually dangerous
- Unique mechanic: Sanity pressure — extended time in the Underdepths causes hallucinations (fake enemies/items), reversed controls, garbled messages. Resting at the surface resets sanity.
- Shops sell: Deepscript scrolls, mind-shielding items, bioluminescent torches, memory potions
- Quest flavor: translate ancient texts, survive the whispers, recover artifacts that shouldn't exist, confront truths about the dungeon's nature

**Acceptance Criteria:**
- [ ] Underdepths has unique visual style with bioluminescence
- [ ] Deepscript (existing) is the primary language
- [ ] Sanity mechanic creates gameplay pressure to surface periodically
- [ ] Quests connect to the existing Deepscript lore and dungeon meta-narrative

---

### The Eldergrove — Legendary Forest / Elven Kingdoms

#### US-RC-10: Sylvan Elven Culture
As a player exploring The Eldergrove, I want to discover a vast ancient forest with hidden elven cities in the canopy, forgotten temples, dangerous beasts, and bandit-infested roads, so that this region feels like a legendary wilderness where civilization and wild magic coexist.

**Details:**
- Architecture: massive silverwood platforms, vine-bridge networks, living-wood spires, moonlit archives hidden in trunk hollows
- ASCII style: deep greens with silver accents, shafts of golden light, towering canopy
- NPCs: Wardens (ranger-knights), Archivists, sylvan crafters, displaced human bandits, forest hermits
- Customs: greet with open palms (Sylvan), the forest is sovereign, outsiders earn trust through deeds
- Tone: ancient, majestic, dangerous beneath the beauty
- Unique mechanic: Canopy navigation — unlocking Sylvan language reveals hidden paths through the upper forest, bypassing ground-level dangers
- Shops sell: silvered weapons, moonpetal herbs, living-wood armor, archival scrolls
- Quest flavor: clear bandit camps, investigate blighted trees, track rare creatures, uncover pre-Ascension temples, protect the forest from alchemical weapons

**Acceptance Criteria:**
- [ ] Eldergrove settlements use canopy/forest themed ASCII tiles
- [ ] Sylvan NPCs speak Sylvan (garbled until learned)
- [ ] Region contains both civilized elven areas and wild dangerous zones
- [ ] Quests reflect the tension between preservation and encroaching threats
- [ ] Lore connects to the Verdant Basin destruction and Selvara's crime

---

### Cross-Cultural Interactions

#### US-RC-08: Cultural Reactions to Outsiders
As a player, I want NPCs in each region to react to me based on where I come from and what cultures I've engaged with, so that the world feels socially interconnected.

**Details:**
- NPCs recognize your starting origin: "A Greenweald villager? We don't see many of your kind here."
- Wearing armor/items from one culture affects reputation in another (orc armor in elvish lands = distrust)
- Learning a region's language significantly improves NPC disposition
- Some cultures are allied, some hostile: Elves distrust Orcs, Dwarves distrust Swampfolk, Humans trade with everyone
- Player can become a cultural bridge by earning reputation in multiple regions

**Acceptance Criteria:**
- [ ] NPCs reference the player's origin in dialogue
- [ ] Equipment from other cultures affects NPC reactions
- [ ] Language knowledge improves disposition
- [ ] Cross-cultural reputation system tracks standing per region

---

#### US-RC-09: Cultural Festivals and Events
As a player, I want each region to have unique periodic events, so that the world feels alive and there are reasons to revisit areas.

**Details:**
- Greenweald: Festival of Leaves (bonus XP for nature quests)
- Ashlands: Blood Moon Tournament (arena event with unique prizes)
- Hearthlands: Market Fair (rare items available, special merchants)
- Frostpeak: Rune Day (free rune-crafting attempts)
- Drowned Mire: Spirit Night (spirits appear with special bargains)
- Sunstone Expanse: Star Alignment (stargazing reveals a major secret)
- Underdepths: The Whispering (Deepscript messages become temporarily readable everywhere)
- Events cycle based on in-game time (every ~200 turns per region)

**Acceptance Criteria:**
- [ ] Each region has at least one periodic event
- [ ] Events provide unique gameplay benefits
- [ ] Events are announced via messages when the player is in the region
- [ ] Event timing is predictable (players can plan around them)

---

## Genre Map Summary

| Region | Genre | Culture | Language | Tone |
|---|---|---|---|---|
| Greenweald | High Fantasy | Elvish | Elvish | Serene, ancient |
| Ashlands | Grimdark | Orcish | Orcish | Brutal, survivalist |
| Hearthlands | Medieval Drama | Human | Common | Political, social |
| Frostpeak Reach | Norse Saga | Dwarven | Runic | Stoic, industrious |
| Drowned Mire | Gothic Horror | Swampfolk | Whispertongue | Eerie, unsettling |
| Sunstone Expanse | Arabian/Egyptian | Nomadic | Sandscript | Mysterious, ancient |
| Eldergrove | Legendary Forest | Sylvan Elven | Sylvan | Majestic, dangerous |
| Underdepths | Cosmic Horror | Deep Ones | Deepscript | Alien, maddening |

## Dependencies
- interconnected-open-world.md (world structure)
- dialogue.ts existing language system (Elvish, Orcish, Deepscript garbling)
- difficulty-scaling.md (regional difficulty)
- npc-factions.md (faction reputation per region)
