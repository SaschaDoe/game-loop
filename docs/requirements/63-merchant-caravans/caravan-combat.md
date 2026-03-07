# Caravan Combat

As a player, I want caravan ambushes to trigger special tactical combat encounters where I defend my wagons and cargo, so that protecting trade goods is an engaging challenge.

## Details

- **Ambush Triggers**: bandit territory, dangerous wilderness routes, carrying high-value cargo, low guard count, night travel
- **Caravan Battle Map**: combat takes place on a road segment with wagons positioned in a line; terrain features (rocks, trees, ditches) provide cover; wagons can be used as barriers
- **Defensive Positioning**: before combat starts, arrange guards and player around wagons; front guard, rear guard, flanking positions; positioning affects who gets attacked first
- **Wagon Defense**: each wagon has HP (50-100 based on upgrade level); enemies target wagons to steal cargo; destroyed wagon = cargo lost; player must balance killing enemies vs protecting wagons
- **Guard NPCs**: hired guards fight alongside player; quality tiers (militia, mercenary, veteran, elite); each has unique abilities; guards can die permanently (must rehire)
- **Enemy Types**:
  - Highway bandits: basic human enemies; will flee if leader killed
  - Goblin raiders: swarm tactics, try to grab individual cargo items and run
  - Orc warband: heavy hitters, target wagons directly with siege weapons
  - Rival merchant thugs: try to destroy cargo, not steal it; hired by competition
  - Monster ambush: wild beasts or territorial creatures; not interested in cargo but attack everything
- **Combat Rewards**: defeating ambushers grants loot + XP; capturing bandit leader = bounty reward; zero cargo loss = bonus reputation
- **Retreat Option**: abandon wagons to flee (lose all cargo but survive); partial retreat (sacrifice rear wagon to save the rest)
- **Anti-Ambush Measures**: hire scouts (detect ambush 3 turns early, allowing preparation); set traps on the road; travel in convoy with other caravans

## Acceptance Criteria

- [ ] Ambush triggers based on correct risk factors
- [ ] Wagon HP and destruction mechanics work correctly
- [ ] Guard NPCs fight with appropriate AI and abilities
- [ ] All enemy types use correct tactics
- [ ] Retreat options correctly sacrifice cargo for survival
