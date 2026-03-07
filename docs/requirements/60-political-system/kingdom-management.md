# Kingdom Management

As a player, I want to rule a territory with advisors, policies, and resource management, so that endgame progression includes governance and strategy.

## Details

- **Unlock Condition**: granted a territory by a grateful king, seize one through warfare, or build up from a homestead
- **Advisors** (NPCs assigned to roles):
  - **Marshal**: manages military (army recruitment, defense, war planning); STR/CON-based NPC preferred
  - **Treasurer**: manages economy (taxes, trade, treasury); INT/CHA-based NPC preferred
  - **Spymaster**: manages intelligence (espionage, counter-espionage, crime); DEX/WIS-based NPC preferred
  - **Steward**: manages infrastructure (building, repairs, expansion); CON/INT-based NPC preferred
  - **Diplomat**: manages foreign relations (alliances, treaties, trade deals); CHA/WIS-based NPC preferred
  - **Court Mage**: manages magical affairs (enchantments, wards, magical threats); INT-based NPC preferred
- **Kingdom Stats**: Prosperity (economy), Stability (order), Military (defense), Culture (happiness), Influence (diplomacy)
- **Policies**: set tax rates (high = gold but unrest, low = loyalty but poor), trade agreements, military conscription, festival funding, magical research
- **Events** (random, 1-2 per in-game week):
  - Bandit raids on outlying villages (send troops or deal personally)
  - Plague outbreak (fund healers or quarantine)
  - Neighboring kingdom demands tribute (pay, refuse, negotiate)
  - Natural disaster (allocate rebuilding funds)
  - Diplomatic marriage proposal (alliance or offense)
  - Peasant revolt (address grievances or crush rebellion)
- **Building**: construct castle upgrades, roads, markets, temples, walls, training grounds; each improves kingdom stats
- **Revenue**: weekly tax income based on population, trade routes, and prosperity; spent on military, construction, and events
- **Endgame**: kingdom can grow from a village to a regional power; ultimate goal: unite all factions under one banner or maintain independence against all threats

## Acceptance Criteria

- [ ] Advisor system assigns NPCs to roles with stat-based effectiveness
- [ ] Kingdom stats track and respond to policy decisions
- [ ] Random events present meaningful governance choices
- [ ] Building construction improves kingdom stats correctly
- [ ] Revenue system calculates income and expenses weekly
