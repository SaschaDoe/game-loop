# Dynamic Pricing

As a player, I want item prices to fluctuate based on supply, demand, and world events, so that trading feels like a living economy I can exploit.

## Details

- Each town tracks supply/demand per item category (weapons, food, ore, potions)
- Prices rise when supply is low (town was raided, caravan destroyed, plague killed farmers)
- Prices drop when supply is high (after a harvest festival, near a mine, player floods market)
- Buy low in one town, sell high in another for profit (trade route gameplay)
- War increases weapon/armor prices; plague increases potion prices
- Price history viewable per town (sparkline chart in ASCII)
- Economic events: trade embargo (faction conflict blocks trade routes), gold inflation (dragon hoard discovered)
- Charisma and reputation still modify final price on top of market rate

## Acceptance Criteria

- [ ] Prices differ between towns based on local supply/demand
- [ ] World events affect pricing
- [ ] Price history is trackable
- [ ] Trade route profit is achievable
