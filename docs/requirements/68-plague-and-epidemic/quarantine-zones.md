# Quarantine Zones

As a player, I want towns to dynamically establish quarantine zones during epidemics that restrict movement and create unique gameplay challenges, so that plagues reshape the game world.

## Details

- **Quarantine Triggers**: when 20%+ of a town's NPCs are infected, the town council declares quarantine; guards set up barricades at district borders; non-essential shops close
- **Zone Types**:
  - **Red Zone (Infected)**: where most sick NPCs are concentrated; high infection risk; only plague doctors and guards allowed in; breaking in = criminal charge; breaking out = shot on sight
  - **Yellow Zone (At Risk)**: adjacent to red zone; restricted movement; shops open with limited hours; residents monitored for symptoms; guards patrol frequently
  - **Green Zone (Safe)**: unaffected areas; normal gameplay but heightened tension; refugees from other zones crowd the streets; prices inflated (supply shortage)
- **Quarantine Gameplay**:
  - **Inside the Zone**: resources scarce; food and water rationed; NPCs desperate; black market thrives (smuggle in food, medicine, or luxury goods for huge profit); crime increases as desperation grows
  - **Smuggling Runs**: sneak past quarantine guards to move goods in or out; Stealth + DEX checks at barricade; caught = arrested + confiscation; successful = massive gold from grateful NPCs
  - **Guard Duty**: hired as a quarantine guard; boring but paid work; moral choices (let a family escape? accept a bribe? use force on rule-breakers?)
  - **Cure Delivery**: quest to deliver medicine into the red zone; must navigate hazards (looters, collapsed buildings, infected mobs begging for help)
- **Quarantine Duration**: lasts until infection rate drops below 5%; can be 100-500 turns depending on disease severity and player intervention
- **Quarantine Failure**: if infection spreads beyond containment (50%+ infected), quarantine collapses; entire town becomes an infected zone; refugees flee to other towns (potentially spreading the plague)
- **Post-Quarantine**: once lifted, town slowly recovers; dead NPCs permanently gone; survivors have immunity; player's actions during quarantine affect long-term reputation (hero who saved the town vs profiteer who exploited the sick)

## Acceptance Criteria

- [ ] Quarantine triggers at correct infection threshold
- [ ] Zone types apply correct movement restrictions and risks
- [ ] Smuggling mechanics use correct skill checks with detection risk
- [ ] Quarantine duration scales with disease severity and player action
- [ ] Post-quarantine consequences persist permanently
