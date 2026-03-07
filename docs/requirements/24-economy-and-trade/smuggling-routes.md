# Smuggling Routes

As a player, I want to smuggle illegal goods between towns for high profit, so that the black market economy offers risky but lucrative gameplay.

## Details

- **Contraband Types**:
  - Forbidden spell scrolls (banned by Templar order): high value in mage towns
  - Poisons and assassination tools: high value in criminal districts
  - Stolen artifacts: high value to collectors, dangerous if original owner finds out
  - Exotic creatures (live smuggling): valuable to collectors, creatures may escape during transport
  - Moonshine and drugs: high value in dry towns (towns that banned alcohol/substances)
  - Weapons to embargoed regions: huge profit, severe punishment if caught
- **Smuggling Mechanics**:
  - Acquire contraband from black market or craft it
  - Plan route: avoid guard patrols, border checkpoints, and law-abiding NPCs
  - Transport: hide contraband in false-bottom containers (-50% detection chance), disguise as legitimate cargo, or bribe checkpoint guards
  - Deliver: find the buyer, negotiate price (LLM dialogue), complete the trade
- **Detection Risk**: guards perform spot checks at town gates; Perception vs player's Stealth + concealment method
  - Caught: contraband confiscated, fine, jail time, or fight/flee
  - Repeat offender: bounty increases, elite investigators assigned
- **Smuggling Network**: build a network of contacts (suppliers, safe houses, corrupt officials); network generates passive income over time
- **Risk Multiplier**: longer routes and more dangerous contraband = higher payment (2x-5x base value)
- **Moral Weight**: some contraband is victimless (moonshine); some causes harm (weapons to warlords, poisons); karma affected accordingly
- **Smuggler Reputation**: separate hidden reputation; high smuggler rep unlocks better contracts but increases law enforcement attention

## Acceptance Criteria

- [ ] All contraband types are acquirable and transportable
- [ ] Detection system uses correct checks at checkpoints
- [ ] Smuggling network building provides passive income
- [ ] Risk multiplier calculates correctly for route length and contraband type
- [ ] Smuggler reputation tracks and affects available contracts
