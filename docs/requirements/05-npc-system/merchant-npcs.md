# Merchant NPCs

As a player, I want to buy and sell items with merchant NPCs, so that I can acquire gear and offload loot for gold.

## Details

- Merchants have typed inventories: weaponsmith, armorsmith, alchemist, general goods, magic shop
- Inventory restocks periodically (based on in-game time)
- Prices influenced by: Charisma, relationship score, supply/demand, stolen goods penalty
- Haggling system: player can attempt to negotiate (Charisma check via LLM dialogue)
- Merchants refuse to buy stolen items if they recognize them
- Black market merchants in seedy locations buy anything at lower prices
- Merchants can be robbed (with severe reputation consequences)

## Acceptance Criteria

- [ ] Buy/sell interface works with correct pricing
- [ ] Charisma and relationship affect prices
- [ ] Merchant inventory restocks over time
- [ ] Stolen item detection functions correctly
