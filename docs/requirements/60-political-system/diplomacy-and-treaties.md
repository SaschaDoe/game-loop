# Diplomacy and Treaties

As a player, I want to negotiate treaties, form alliances, and declare wars with neighboring factions, so that political strategy is a core endgame system.

## Details

- **Diplomatic Actions**:
  - **Alliance**: mutual defense pact; ally comes to your aid if attacked and vice versa; requires high mutual reputation
  - **Trade Agreement**: lower tariffs, shared markets, increased prosperity; both sides benefit; requires moderate reputation
  - **Non-Aggression Pact**: promise not to attack each other; frees military resources; low reputation threshold
  - **Tribute**: pay gold to a stronger faction for peace; humiliating but buys time
  - **Marriage Alliance**: political marriage between ruling families; strongest alliance type; permanent until betrayed
  - **Declaration of War**: formal hostility; armies mobilize, borders close, trade stops; reputation with that faction drops to hostile
  - **Peace Treaty**: end a war; negotiate terms (territory exchange, reparations, prisoner release, trade concessions)
- **Negotiation Mechanics**: LLM-powered diplomatic dialogue with faction leaders
  - Arguments matter: presenting logical reasons, appealing to mutual benefit, or threatening consequences
  - Charisma modifier affects success probability
  - Faction personality: some leaders are warlike (hard to negotiate peace), others are mercantile (respond to trade offers), others are paranoid (hard to trust)
  - Backroom deals: secret agreements that the public doesn't know about (spy exchange, hidden tribute, secret alliance)
- **Treaty Violations**: breaking a treaty has severe reputation penalties; other factions learn you're untrustworthy; some treaties have magical enforcement (geas curse if broken)
- **Diplomatic Incidents**: NPC actions may create incidents (your soldier kills their citizen, smugglers cross borders, spies are caught); must be resolved diplomatically or escalate to war
- **Council of Nations**: periodic gathering of all faction leaders; attend to negotiate, spy, or assassinate (extremely risky but game-changing)
- **War Exhaustion**: prolonged wars drain prosperity and stability; populations demand peace; ignored demands lead to rebellion

## Acceptance Criteria

- [ ] All diplomatic action types function with correct effects
- [ ] LLM negotiation responds to arguments and faction personality
- [ ] Treaty violations apply appropriate reputation penalties
- [ ] Diplomatic incidents create resolvable conflict scenarios
- [ ] War exhaustion mechanics pressure toward peace over time
