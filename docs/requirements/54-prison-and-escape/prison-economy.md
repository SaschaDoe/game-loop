# Prison Economy

As a player, I want prisons to have their own underground economy using contraband, favors, and cigarettes as currency, so that prison life has unique economic gameplay.

## Details

- **Prison Currency**: standard gold is confiscated; the prison runs on:
  - **Cigarettes**: the primary currency; earned through work assignments, smuggled in, or traded; value fluctuates based on supply (new shipment = deflation, crackdown = inflation)
  - **Favors**: non-tangible currency; "you owe me one"; tracked as debts between inmates; failing to repay a favor has violent consequences
  - **Contraband Credits**: reputation with the smuggling ring; spend credits to order specific items from outside
- **Contraband Items**:
  - Weapons: shivs (crafted from spoons), smuggled knives, makeshift clubs; essential for self-defense and faction wars
  - Drugs/alcohol: prison brew (fermented fruit), smuggled potions; recreational or stat-boosting; addictive
  - Tools: lockpicks, rope, files (for cutting bars); escape supplies
  - Luxury items: books, playing cards, decent food; improve morale and quality of life
  - Communication: letters, messages to contacts outside; plan escape or coordinate with allies
- **Smuggling Routes**: bribed guards (expensive, reliable), delivery trucks (hide items in food shipments), visitor smuggling (visitors hide items, Sleight of Hand check), tunnel drops (maintenance tunnels)
- **Work Assignments**: kitchen (access to knives and fermentable food), laundry (hide items in clean clothing), library (information and privacy), workshop (crafting tools), infirmary (medical supplies and drugs)
- **Protection Racket**: strong inmates demand payment (cigarettes) for protection; refuse = beatings; pay = safety from random violence; alternatively, become strong enough to run your own racket
- **Black Market**: a hidden NPC trader (different inmate each playthrough) operates a black market; sells anything for the right price; betraying the black market operator to guards earns privileges but makes you a prison-wide target

## Acceptance Criteria

- [ ] All currency types track correctly with appropriate economics
- [ ] Contraband items function correctly within prison context
- [ ] Smuggling routes use correct skill checks with detection risk
- [ ] Work assignments provide access to correct resources
- [ ] Protection racket creates meaningful economic pressure
