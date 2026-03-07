# Caravan Management

As a player, I want to organize and lead merchant caravans between towns, so that trade becomes an active, strategic gameplay loop with risks and rewards.

## Details

- **Caravan Creation**: hire wagons (1-5), pack animals (horses, mules, oxen), and guards; each wagon holds 100 weight units of goods; costs gold to outfit
- **Route Planning**: choose departure and destination towns from the world map; routes have different lengths, terrain types, and danger levels; longer routes = more profit potential but more risk
- **Trade Goods**: buy low in one region, sell high in another; prices vary by region, season, and supply/demand:
  - Grain: cheap in farming towns, expensive in mountain/desert settlements
  - Ore/metals: cheap near mines, expensive in coastal/forest towns
  - Spices: cheap in tropical ports, expensive everywhere else
  - Textiles: cheap in sheep-farming regions, expensive in cities
  - Alchemical supplies: cheap near swamps/forests, expensive in cities
  - Luxury goods: expensive everywhere but highest markup in capital cities
  - Contraband: illegal goods (drugs, stolen art, forbidden scrolls) with 3x profit but risk of confiscation and arrest
- **Travel Events** (random encounters per route segment):
  - Bandit ambush: fight or pay toll; caravan guards help in combat
  - Broken wheel: DEX check to repair or lose time (5 turns delay)
  - Bridge out: find alternate route (longer) or ford the river (risk losing cargo)
  - Merchant met: opportunity to trade goods mid-route at random prices
  - Weather: storms slow travel and can damage perishable goods
  - Toll gate: pay official toll or attempt to bribe/sneak past
- **Caravan Reputation**: successful deliveries build merchant reputation; unlocks better trade deals, exclusive goods, caravan guild membership, and escort contracts
- **Caravan Upgrades**: reinforced wagons (more cargo, resist damage), war wagons (mounted crossbow), fast horses (reduce travel time), hidden compartments (smuggling)

## Acceptance Criteria

- [ ] Caravan creation correctly calculates costs and capacity
- [ ] Trade good prices vary by region and supply/demand
- [ ] Random travel events trigger at appropriate frequencies
- [ ] Caravan reputation tracks deliveries and unlocks content
- [ ] Contraband mechanics include appropriate risk of detection
