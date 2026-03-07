# Brewing and Winemaking

As a player, I want to brew beer, distill spirits, and make wine from gathered ingredients, so that alcohol crafting is a profitable profession with social gameplay benefits.

## Details

- **Beverage Types**:
  - **Ale** (basic): wheat + hops + water; fermentation: 20 turns; effect: +1 CHA, minor HP regen; value: low
  - **Mead**: honey + water + spices; fermentation: 30 turns; effect: +2 CHA, +1 CON; value: moderate
  - **Wine**: grapes + sugar; fermentation: 50 turns; effect: +2 CHA, +1 WIS; aged wine (200+ turns): +3 CHA, +2 WIS, high value
  - **Whiskey**: grain + yeast, distilled; fermentation: 40 turns + distillation; effect: +3 STR (liquid courage), -1 DEX; value: high
  - **Elixir Wine** (magical): moonpetal + stargrass + wine base; fermentation: 100 turns; effect: +2 all stats, minor mana regen; value: legendary
  - **Poison Wine** (sinister): wine + nightshade (undetectable); effect: slow poison (3 damage/turn for 20 turns); used for assassination quests
- **Brewing Process**: gather ingredients → combine at brewing station → wait fermentation time → bottle (uses glass vials)
- **Quality Factors**: ingredient quality, brewing skill, fermentation time (longer = better, up to a point), storage conditions (cool cellar = +quality)
- **Aging System**: stored beverages improve with age; tracking turns since bottling; aged products sell for 2x-5x base price
- **Tavern Sales**: sell directly to tavern keepers; exclusive supply contracts for steady income; reputation as a brewer attracts customers
- **Drinking Effects Stacking**: consuming multiple beverages stacks buffs but also stacks drunkenness (see tavern-gameplay)
- **Brewing Competitions**: annual competition at harvest festival; judges rate flavor, potency, and presentation; winner gets gold + "Master Brewer" title
- **Brewing Recipes**: some recipes are secret; learned from NPC brewmasters, found in old cellars, or discovered through experimentation

## Acceptance Criteria

- [ ] All beverage types craft with correct ingredients and fermentation times
- [ ] Quality scales with ingredients, skill, and aging
- [ ] Aging system tracks time and improves value
- [ ] Tavern sales and contracts provide income
- [ ] Brewing competitions are participable and judged fairly
