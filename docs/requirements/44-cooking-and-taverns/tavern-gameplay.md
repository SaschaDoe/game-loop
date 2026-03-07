# Tavern Gameplay

As a player, I want taverns to be social hubs with drinking, gambling, brawling, and information gathering, so that every town visit has rich non-combat gameplay.

## Details

- **Tavern Activities**:
  - **Drinking**: buy ales, wines, spirits; each drink gives a temporary buff (+CHA, +courage) but stacking drinks causes drunkenness (impaired movement, slurred LLM dialogue, -DEX, -INT)
  - **Bar Brawl**: fist-fighting mini-event; non-lethal combat with tavern patrons, bet gold on yourself, reputation gain/loss
  - **Gambling**: card games, dice games, arm wrestling (see economy-and-trade/gambling-and-tavern-games)
  - **Rumor Board**: tavern notice board with bounties, job postings, and local gossip
  - **Live Music**: if a bard is present, music provides passive buffs to all patrons; player bards can perform for tips and fame
  - **Hiring Mercenaries**: some taverns have sellswords for hire as temporary companions
  - **Black Market Contact**: certain taverns have a back room where illegal goods are traded (lockpicks, poisons, stolen goods, forbidden spell scrolls)
- **Tavern NPCs**: bartender (knows everything, information for gold or drinks), regulars (recurring characters with developing storylines), travelers (random encounters from distant lands with unique quests)
- **Drunkenness Levels**: Sober → Tipsy (+1 CHA) → Drunk (-2 DEX, +2 CHA) → Wasted (-4 DEX, -3 INT, can't navigate properly) → Blackout (wake up somewhere random with missing items)
- **Tavern Reputation**: being a good regular earns free drinks, better rumors, and loyalty from the bartender (may hide you from guards)
- Each town's tavern has a unique name, atmosphere, and specialty drink

## Acceptance Criteria

- [ ] All tavern activities are functional
- [ ] Drunkenness stages apply correct stat modifications
- [ ] Blackout mechanic relocates player and removes items
- [ ] Tavern NPCs offer dynamic LLM-powered conversations
- [ ] Tavern reputation tracks and provides benefits
