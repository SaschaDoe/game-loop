# Monster Ecology

As a player, I want monsters to have realistic ecological behaviors including territories, food chains, and breeding cycles, so that the world feels like a living ecosystem.

## Details

- **Territorial Behavior**: each monster type claims territory (area on the map); entering territory increases encounter chance; territory borders overlap creating contested zones where monster types fight each other; stronger species push weaker ones out
- **Food Chain**: predator/prey relationships; wolves hunt deer, dragons hunt wolves, nothing hunts dragons; killing predators causes prey population explosion (more deer = more deer encounters); killing prey causes predator starvation (wolves become desperate, attack towns)
- **Breeding Cycles**: monster populations increase over time if left unchecked; nests/dens produce new monsters every 100-300 turns; destroying a nest halts breeding in that area; seasonal breeding (some monsters breed in spring, others in winter)
- **Migration Patterns**: certain species migrate seasonally; herds of beasts move between regions; creates temporary danger spikes and lulls; migration routes predictable after observation (Survival skill)
- **Symbiosis**: some monsters live together beneficially; goblins ride wolves; treants host bird nests (bird alarms warn of approaching enemies); parasites weaken hosts (infected creatures are weaker but disease-carrying)
- **Ecosystem Consequences**:
  - Overhunting: wiping out a species in a region permanently removes them; cascading ecosystem effects (unchecked prey overgraze, predators seek new food sources including towns)
  - Conservation quests: druids/rangers may ask you to protect endangered species; escort pregnant monsters to safe breeding grounds; relocate invasive species
  - Restoration: reintroducing a species to a region where it was wiped out; requires capturing live specimens and releasing them; population rebuilds over 500+ turns
- **Bestiary Integration**: observing ecological behaviors adds detailed entries to the bestiary (hunting patterns, breeding times, territory maps, prey preferences); complete ecological profiles grant combat bonuses against that species

## Acceptance Criteria

- [ ] Territorial behavior creates correct encounter rates by area
- [ ] Food chain effects cascade correctly when species are removed
- [ ] Breeding cycles produce new monsters on correct timers
- [ ] Ecosystem consequences persist from player actions
- [ ] Bestiary entries update from ecological observation
