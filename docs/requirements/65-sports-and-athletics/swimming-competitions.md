# Swimming Competitions

As a player, I want to compete in swimming races and diving contests in lakes, rivers, and ocean courses, so that aquatic athletics complement underwater exploration.

## Details

- **Race Types**:
  - **Sprint Swim**: short distance (30 tiles) in a pool or lake; pure speed; CON + STR determines pace; no obstacles
  - **Open Water Race**: 200 tiles through rivers or ocean; currents affect speed (swim with current = fast, against = slow); stamina management critical; wildlife hazards (jellyfish, currents, waves)
  - **Obstacle Swim**: navigate through submerged rings, under logs, over floating barriers; DEX + CON; missing an obstacle = time penalty; sharp obstacles can cause injury
  - **Diving Contest**: dive from increasing heights into water; DEX check for form; higher platform = more points but harder form check; belly flop = damage + humiliation; perfect dive = maximum points + crowd cheers
  - **Underwater Endurance**: see who can stay submerged longest; CON-based breath holding; player can use breathing techniques (meditation skill helps); cheating with water-breathing magic disqualifies if detected
  - **Relay Race**: team event; 4 swimmers each swim a leg; player swims one leg; AI teammates swim based on their stats; team coordination bonus if swimming with companions
- **Water Conditions**: calm water (standard), choppy waves (+difficulty), strong current (stamina drain doubled), cold water (CON save or cramp — lose 2 turns)
- **Equipment**: swimming gear (goggles = visibility, flippers = speed, wetsuit = cold protection); magical swimming items (ring of water speed, amulet of buoyancy); some competitions ban magical equipment
- **Merfolk Competitors**: in underwater competitions, merfolk participants have natural advantages; beating a merfolk swimmer earns massive respect and unique merfolk-crafted prize
- **Seasonal Championships**: held during summer festivals; attract spectators from across the region; champion earns "Ocean's Chosen" title + aquatic-themed legendary item

## Acceptance Criteria

- [ ] All race types use correct stat checks and obstacle mechanics
- [ ] Water conditions modify difficulty appropriately
- [ ] Equipment bonuses apply within competition rules
- [ ] Merfolk competitors have appropriate natural advantages
- [ ] Championship progression tracks across seasonal events
