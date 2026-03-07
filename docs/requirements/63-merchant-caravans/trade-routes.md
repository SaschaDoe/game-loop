# Trade Routes

As a player, I want to establish permanent trade routes that generate passive income, so that my merchant empire grows even when I'm adventuring elsewhere.

## Details

- **Route Establishment**: complete 3 successful caravan runs between the same two towns to establish a permanent trade route
- **Passive Income**: established routes generate gold per 50 turns based on route profitability (distance x demand differential); income deposited at player's bank or home storage
- **Route Management**:
  - Hire a caravan master NPC to manage each route (salary: 10% of route income)
  - Set trade goods priority (what to buy/sell automatically)
  - Upgrade route security level (no guards = cheap but risky, heavy guard = expensive but safe)
  - Monitor route health: bandit activity, road conditions, political stability affect income
- **Route Disruption**: bandits may establish a toll on your route (income -50%); rival merchants undercut your prices (income -25%); war between towns shuts route down entirely; player must intervene to fix disruptions
- **Route Network Bonuses**: connecting 3+ towns in a trade network grants bonus income (15% per additional town); controlling trade in a region unlocks the "Merchant Prince/Princess" title and exclusive faction quests
- **Competing Merchants**: NPC merchant guilds compete for the same routes; can be outbid, sabotaged (risky), or merged with (share profits but gain allies)
- **Seasonal Fluctuations**: route profitability shifts with seasons (grain routes peak post-harvest, fur routes peak in winter); smart route scheduling maximizes profit
- **Route Map**: visual display of all established routes on the world map; color-coded by profitability (green = profitable, yellow = break-even, red = losing money)

## Acceptance Criteria

- [ ] Routes establish after 3 successful runs between same towns
- [ ] Passive income calculates correctly based on distance and demand
- [ ] Route disruptions reduce income and require player intervention
- [ ] Network bonuses apply correctly for connected towns
- [ ] Seasonal fluctuations affect route profitability
