# Shelter Building

As a player, I want to build temporary and permanent shelters in the wilderness using gathered materials, so that outdoor survival requires strategic camp placement and resource management.

## Details

- **Shelter Types**:
  - **Lean-to**: 5 turns to build; branches + leaves; minimal protection (blocks rain, reduces cold by 25%); no storage; collapses after 50 turns; anyone can build
  - **Tent**: 3 turns to set up; requires tent item (purchased); good protection (blocks rain/wind, reduces cold by 60%); small storage; portable; can be packed up
  - **Log Cabin**: 50 turns to build; requires axe + 20 logs + rope; excellent protection (blocks all weather, warm); large storage; permanent; upgradeable (fireplace, bed, workbench)
  - **Cave Camp**: 10 turns to set up inside a cave; requires bedroll + fire materials; natural protection from weather; risk of cave-dwelling creatures; permanent if secured
  - **Tree House**: 30 turns to build; requires planks + rope + large tree; elevated (safe from ground predators); moderate storage; requires climbing to access (DEX check); great vantage point
  - **Snow Igloo**: 15 turns to build; requires packed snow (winter/tundra only); excellent cold protection (+80%); melts in spring; interior is surprisingly warm with a fire
  - **Magical Shelter**: instant; costs 20 mana; creates a translucent dome; blocks weather, blocks enemy sight, provides warmth; lasts 30 turns; perfect for emergency rest
- **Shelter Benefits**:
  - Rest quality multiplier: sleeping in a shelter = full rest; sleeping exposed = partial rest (50% effectiveness)
  - Crafting: some crafting requires a workbench (only available in cabins/upgraded shelters)
  - Storage: leave items safely in shelter; items in exposed camp can be stolen by wildlife or NPCs
  - Fast travel waypoint: permanent shelters become fast travel destinations
- **Campfire**: built adjacent to shelter; requires wood + flint (or fire magic); provides light (deters some creatures), warmth (+30% cold resist), cooking capability; must be maintained (add wood every 20 turns)
- **Camp Hazards**: building near monster paths invites attacks; campfire visible from distance (attracts curious NPCs — sometimes helpful, sometimes hostile); certain terrain unsuitable (swamp = sinking, cliffside = avalanche risk)
- **Camp Upgrades**: add defensive perimeter (spike wall, alarm runes); animal pen (tether mounts); herb garden (slow-growing herbs for potions); rain collector (passive water supply)

## Acceptance Criteria

- [ ] All shelter types build in correct turn counts from correct materials
- [ ] Weather protection percentages apply correctly
- [ ] Rest quality scales with shelter quality
- [ ] Camp hazards trigger based on location and visibility
- [ ] Upgrades correctly add functionality to permanent shelters
