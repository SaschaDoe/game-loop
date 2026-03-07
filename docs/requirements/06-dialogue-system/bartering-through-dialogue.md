# Bartering Through Dialogue

As a player, I want to haggle with merchants through natural conversation rather than just a fixed price UI, so that trading feels personal and my social skills matter.

## Details

- When buying/selling, option to "Haggle" opens LLM dialogue with the merchant
- Player argues for better prices using persuasion, flattery, threats, or sob stories
- Merchant personality affects haggle resistance: greedy merchants are harder, friendly ones give easier discounts
- Charisma stat provides a hidden modifier to the LLM's willingness to accept offers
- Successful haggle: price reduced 10-40% depending on argument quality and stats
- Failed haggle: price stays the same, merchant may refuse to trade entirely if insulted
- Bulk discount: negotiate lower per-item price when buying many items
- Trade secrets: some merchants reveal hidden stock if you befriend them through conversation
- Barter system: offer items instead of gold ("I'll trade you this sword for that potion and 50 gold")
- Merchant memory: merchants remember if you haggled well or poorly last time

## Acceptance Criteria

- [ ] LLM dialogue evaluates haggle attempts contextually
- [ ] Charisma modifier affects haggle success
- [ ] Failed haggling has consequences
- [ ] Item-for-item barter is functional
