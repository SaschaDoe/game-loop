# Creature Relationships

As a player, I want the bestiary to track predator-prey relationships and territorial conflicts between monster species, so that I can exploit the ecosystem tactically.

## Details

- **Relationship Types**:
  - **Predator-Prey**: wolves hunt deer; spiders eat goblins; dragons eat everything — luring prey near a predator triggers combat between them
  - **Territorial Rivals**: trolls vs ogres; ants vs spiders; fire vs ice elementals — entering overlapping territories triggers a turf war
  - **Symbiotic**: goblins ride wolves; mushrooms grow on treants; pilot fish clean sea serpents — killing one partner enrages the other
  - **Parasitic**: mind flayers control thralls; fungi infect zombies; mimics hide among normal creatures — the parasite dies if the host is freed
  - **Pack Hierarchy**: wolf alpha leads the pack; killing the alpha scatters the pack; a new alpha emerges if you don't finish them all
- **Tactical Exploitation**:
  - Lure prey animals to draw predators away from your path
  - Throw meat near rival territories to trigger a monster fight (weaken both sides)
  - Attack the symbiotic partner to enrage and distract the other
  - Target pack alphas first to demoralize the group
  - Use predator scent items to scare prey species away from an area
- **Ecosystem Tracking**: bestiary shows known relationships as a web diagram; discovering relationships requires observing creatures interacting (10+ encounters with both species)
- **Ecological Quests**: druids and rangers offer quests to restore or protect ecosystems:
  - "The wolves are overpopulated — introduce a predator"
  - "The dragon is eating all the deer — now the wolves are starving and attacking farms"
  - "The goblin-spider war is escalating — mediate or pick a side"
- **Extinction Events**: driving a species to 0 population cascades through the food chain (overpopulation of prey, starvation of predators, ecosystem collapse)
- **Creature Migration**: ecosystem disruption causes species to migrate to new areas, potentially invading towns or other biomes

## Acceptance Criteria

- [ ] All relationship types trigger correct behaviors between species
- [ ] Tactical exploitation methods work as described
- [ ] Bestiary web diagram populates from observed interactions
- [ ] Ecological quests reflect actual world ecosystem state
- [ ] Extinction cascades affect the food chain realistically
